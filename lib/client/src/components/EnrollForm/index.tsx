import {
  useMemo,
  useState,
  useRef,
  useCallback,
  useImperativeHandle,
  forwardRef
} from 'react';
import { PrimitiveAtom, useAtom } from 'jotai';
import { FormHandles as UnformHandles } from '@unform/core';
import { ValidationError } from 'yup';

import Select from 'components/Select';
import EnrollSchoolReportForm from 'components/EnrollSchoolReportForm';
import TextInput from 'components/TextInput';

import { EnrollFormData } from 'models/Enroll';
import { FormHandles } from 'models/Form';
import { School } from 'models/School';

import { useListGrades } from 'requests/queries/grades';
import { useListClassrooms } from 'requests/queries/classrooms';
import { useListClassPeriods } from 'requests/queries/class-periods';
import { useSessionSchoolYear } from 'requests/queries/session';

import { translateDescription } from 'utils/mappers/classPeriodMapper';

import { enrollSchema } from './rules/schema';

import * as S from './styles';

type EnrollFormProps = {
  jotaiState: PrimitiveAtom<EnrollFormData>;
  school: School;
};

const EnrollForm: React.ForwardRefRenderFunction<
  FormHandles,
  EnrollFormProps
> = ({ jotaiState, school }, ref) => {
  const [selectedGrade, setSelectedGrade] = useState<string>();
  const [selectedClassPeriod, setSelectedClassPeriod] = useState<string>();

  const formRef = useRef<UnformHandles>(null);
  const schoolReportsFormRef = useRef<UnformHandles>(null);

  const [state, setState] = useAtom(jotaiState);

  const { data: schoolYear } = useSessionSchoolYear();

  const { data: grades } = useListGrades({
    school_year_id: schoolYear?.id
  });
  const { data: classrooms, isLoading } = useListClassrooms({
    school_id: school.id,
    grade_id: selectedGrade,
    class_period_id: selectedClassPeriod,
    school_year_id: schoolYear?.id
  });
  const { data: classPeriods, isLoading: isLoadingClassPeriods } =
    useListClassPeriods({
      school_year_id: schoolYear?.id
    });

  const gradesOptions = useMemo(() => {
    if (!grades) return [];

    return grades.map(({ id, description }) => ({
      label: description,
      value: id
    }));
  }, [grades]);

  const classroomsOptions = useMemo(() => {
    if (isLoading) return [{ value: '', label: 'Carregando...' }];
    if (!classrooms) return [];

    const classroomItems = classrooms.items || [];

    return classroomItems.map(({ id, description }) => ({
      label: description,
      value: id
    }));
  }, [classrooms, isLoading]);

  const classPeriodsOptions = useMemo(() => {
    if (isLoadingClassPeriods) return [{ value: '', label: 'Carregando...' }];
    if (!classPeriods) return [];

    return classPeriods.map(({ id, description }) => ({
      label: translateDescription(description),
      value: id
    }));
  }, [classPeriods, isLoadingClassPeriods]);

  const originOptions = useMemo(() => {
    return [
      { label: 'Novo', value: 'NEW' },
      { label: 'Repetente', value: 'REPEATING' }
    ];
  }, []);

  const handleSubmit = useCallback(
    async (values: EnrollFormData) => {
      try {
        formRef.current?.setErrors({});

        await enrollSchema.validate(values, { abortEarly: false });

        setState(values);
      } catch (err) {
        if (err instanceof ValidationError) {
          const validationErrors: Record<string, string> = {};

          err.inner.forEach((error) => {
            if (error.path) {
              validationErrors[error.path] = error.message;
            }
          });

          formRef.current?.setErrors(validationErrors);
        }

        throw err;
      }
    },
    [setState]
  );

  const submitForm = useCallback(async () => {
    const values = formRef.current?.getData() as EnrollFormData;
    const schoolReports = schoolReportsFormRef.current?.getData() as Record<
      string,
      Record<string, string>
    >;

    const normalizedSchoolReports = Object.entries(schoolReports).reduce<
      Record<string, Record<string, number>>
    >((acc, item) => {
      const [key, reports] = item;
      const newReports = Object.entries(reports).reduce<Record<string, number>>(
        (target, [schoolTerm, report]) => {
          if (report === '') return target;

          const parsedReport = Number(report);
          if (isNaN(parsedReport)) return target;

          return { ...target, [schoolTerm]: parsedReport };
        },
        {}
      );

      return { ...acc, [key]: newReports };
    }, {});

    await handleSubmit({ ...values, schoolReports: normalizedSchoolReports });
  }, [handleSubmit]);

  useImperativeHandle(ref, () => ({ submitForm }));

  return (
    <>
      <S.Wrapper>
        <S.SectionTitle>Matrícula</S.SectionTitle>
        <S.Form onSubmit={handleSubmit} initialData={state} ref={formRef}>
          {/* <TextInput name="unique_code" label="Código único" /> */}
          <TextInput label="Data de matrícula" name="enroll_date" mask="date" />
          <Select
            name="origin"
            label="Novo/Repetente"
            options={originOptions}
          />
          <Select
            name="grade_id"
            label="Série"
            options={gradesOptions}
            onChange={(value) => setSelectedGrade(value)}
          />
          <Select
            name="class_period_id"
            label="Período"
            options={classPeriodsOptions}
            onChange={(value) => setSelectedClassPeriod(value)}
          />
          <Select
            name="classroom_id"
            label="Turma"
            options={classroomsOptions}
            disabled={!selectedGrade || !selectedClassPeriod}
          />
        </S.Form>
      </S.Wrapper>
      {selectedGrade && (
        <EnrollSchoolReportForm
          gradeId={selectedGrade}
          ref={schoolReportsFormRef}
        />
      )}
    </>
  );
};

export default forwardRef(EnrollForm);
