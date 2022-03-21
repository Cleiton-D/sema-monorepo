import { useState, useEffect, useMemo } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { Form } from '@unform/web';

import Select from 'components/Select';
import DatePicker from 'components/Datepicker';
import TextInput from 'components/TextInput';
import Button from 'components/Button';

import { useListClassrooms } from 'requests/queries/classrooms';
import { useListSchools } from 'requests/queries/schools';
import { useListClassPeriods } from 'requests/queries/class-periods';
import { useListGrades } from 'requests/queries/grades';
import { useListTeachers } from 'requests/queries/teachers';

import { useListSchoolSubjects } from './hooks';

import * as S from './styles';

type SearchClassesProps = {
  handleSearch: (values: Record<string, string>) => void;
};
const SearchClasses = ({ handleSearch }: SearchClassesProps): JSX.Element => {
  const [school, setSchool] = useState<string>();
  const [grade, setGrade] = useState<string>();
  const [classPeriod, setClassPeriod] = useState<string>();
  const [classroom, setClassroom] = useState<string>();

  const { query } = useRouter();

  const { data: session } = useSession();

  const { data: schools, isLoading: isLoadingSchools } =
    useListSchools(session);

  const { data: grades, isLoading: isLoadingGrades } = useListGrades(session);

  const { data: classPeriods, isLoading: isLoadingClassPeriods } =
    useListClassPeriods(session);

  const { data: classrooms, isLoading: isLoadingClassrooms } =
    useListClassrooms(session, {
      school_id: school,
      grade_id: grade,
      class_period_id: classPeriod
    });

  const { data: schoolSubjects, isLoading: isLoadingSchoolSubjects } =
    useListSchoolSubjects(session, {
      classroom_id: classroom,
      school_id: school,
      school_year_id: session?.configs.school_year_id,
      grade_id: grade
    });

  const { data: teachers, isLoading: isLoadingTeachers } =
    useListTeachers(session);

  const schoolsOptions = useMemo(() => {
    if (isLoadingSchools) return [{ label: 'Carregando...', value: '' }];

    return schools?.map(({ name, id }) => ({ label: name, value: id }));
  }, [schools, isLoadingSchools]);

  const gradesOptions = useMemo(() => {
    if (isLoadingGrades) return [{ label: 'Carregando...', value: '' }];

    return grades?.map(({ description, id }) => ({
      label: description,
      value: id
    }));
  }, [grades, isLoadingGrades]);

  const classPeriodsOptions = useMemo(() => {
    if (isLoadingClassPeriods) return [{ label: 'Carregando...', value: '' }];

    return classPeriods?.map(({ translated_description, id }) => ({
      label: translated_description,
      value: id
    }));
  }, [classPeriods, isLoadingClassPeriods]);

  const classroomOptions = useMemo(() => {
    if (!school) return [{ label: 'Selecione uma escola', value: '' }];
    if (isLoadingClassrooms) return [{ label: 'Carregando...', value: '' }];

    return classrooms?.map(({ description, id }) => ({
      label: description,
      value: id
    }));
  }, [school, classrooms, isLoadingClassrooms]);

  const schoolSubjectsOptions = useMemo(() => {
    if (isLoadingSchoolSubjects) return [{ label: 'Carregando...', value: '' }];

    return schoolSubjects?.map(({ description, id }) => ({
      label: description,
      value: id
    }));
  }, [schoolSubjects, isLoadingSchoolSubjects]);

  const teachersOptions = useMemo(() => {
    if (isLoadingTeachers) return [{ label: 'Carregando...', value: '' }];

    return teachers?.map(({ name, id }) => ({
      label: name,
      value: id
    }));
  }, [teachers, isLoadingTeachers]);

  useEffect(() => {
    const schoolId = query.school_id || session?.schoolId;
    if (schoolId && !Array.isArray(schoolId)) {
      setSchool(schoolId);
    }
  }, [query, session]);

  return (
    <S.SearchSection>
      <S.SectionTitle>
        <h4>Pesquisar</h4>
      </S.SectionTitle>
      <Form onSubmit={handleSearch}>
        <S.FieldsContainer>
          <Select
            name="status"
            label="Status"
            options={[
              { label: 'Andamento', value: 'PROGRESS' },
              { label: 'Finalizado', value: 'DONE' }
            ]}
            emptyOption
          />
          <DatePicker name="class_date" label="Data" />

          {!session?.schoolId && (
            <Select
              name="school_id"
              label="Escola"
              options={schoolsOptions}
              emptyOption
              onChange={setSchool}
              selectedOption={school}
            />
          )}
          {session?.accessLevel?.code !== 'teacher' && (
            <Select
              name="employee_id"
              label="Professor"
              options={teachersOptions}
              emptyOption
            />
          )}

          <Select
            name="grade_id"
            label="Série"
            options={gradesOptions}
            onChange={setGrade}
            emptyOption
          />
          <Select
            name="class_period_id"
            label="Período"
            options={classPeriodsOptions}
            onChange={setClassPeriod}
            emptyOption
          />
          <Select
            name="classroom_id"
            label="Turma"
            options={classroomOptions}
            onChange={setClassroom}
            selectedOption={classroom}
            emptyOption
          />
          <Select
            name="school_subject_id"
            label="Disciplina"
            options={schoolSubjectsOptions}
            // onChange={setClassroom}
            emptyOption
          />
          <div style={{ gridColumn: '1/4' }}>
            <TextInput name="taught_content" label="Conteúdo" />
          </div>
        </S.FieldsContainer>
        <S.ButtonContainer>
          <Button styleType="normal" type="submit" size="medium">
            Pesquisar
          </Button>
        </S.ButtonContainer>
      </Form>
    </S.SearchSection>
  );
};

export default SearchClasses;
