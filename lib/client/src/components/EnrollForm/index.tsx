import {
  useMemo,
  useState,
  useEffect,
  useRef,
  useCallback,
  useImperativeHandle,
  forwardRef
} from 'react';
import { useSession } from 'next-auth/client';
import { PrimitiveAtom, useAtom } from 'jotai';
import { FormHandles as UnformHandles } from '@unform/core';
import { ValidationError } from 'yup';

import Select from 'components/Select';

import { EnrollFormData } from 'models/Enroll';
import { FormHandles } from 'models/Form';
import { School } from 'models/School';

import { useListGrades } from 'requests/queries/grades';
import { useListClassrooms } from 'requests/queries/classrooms';
import { useListClassPeriods } from 'requests/queries/class-periods';

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

  const [state, setState] = useAtom(jotaiState);

  const [session] = useSession();
  const { data: grades } = useListGrades(session);
  const { data: classrooms, isLoading } = useListClassrooms(session, {
    school_id: school.id,
    grade_id: selectedGrade,
    class_period_id: selectedClassPeriod
  });

  const gradesOptions = useMemo(() => {
    if (!grades) return [];

    return grades.map(({ id, description }) => ({
      label: description,
      value: id
    }));
  }, [grades]);

  const { data: classPeriods } = useListClassPeriods(session, {
    school_year_id: session?.configs.school_year_id
  });

  const classPeriodsOptions = useMemo(() => {
    if (!classPeriods) return [];

    return classPeriods.map(({ translated_description, id }) => ({
      label: translated_description,
      value: id
    }));
  }, [classPeriods]);

  const classroomsOptions = useMemo(() => {
    if (isLoading) return [{ value: '', label: 'Carregando...' }];
    if (!classrooms) return [];

    return classrooms.map(({ id, description }) => ({
      label: description,
      value: id
    }));
  }, [classrooms, isLoading]);

  useEffect(() => {
    const { grade_id, class_period_id } = state;
    setSelectedGrade(grade_id);
    setSelectedClassPeriod(class_period_id);
  }, [state]);

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
    await handleSubmit(values);
  }, [handleSubmit]);

  useImperativeHandle(ref, () => ({ submitForm }));

  return (
    <S.Wrapper>
      <S.SectionTitle>Associar estudante à uma turma</S.SectionTitle>
      <S.Form onSubmit={handleSubmit} initialData={state} ref={formRef}>
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
  );
};

export default forwardRef(EnrollForm);
