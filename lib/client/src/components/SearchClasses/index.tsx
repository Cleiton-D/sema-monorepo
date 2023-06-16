import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/router';
import { Form } from '@unform/web';

import Select from 'components/Select';
import TextInput from 'components/TextInput';
import Button from 'components/Button';
import SchoolDayDatepicker from 'components/SchoolDayDatepicker';

import { useListClassrooms } from 'requests/queries/classrooms';
import { useListSchools } from 'requests/queries/schools';
import { useListClassPeriods } from 'requests/queries/class-periods';
import { useListGrades } from 'requests/queries/grades';
import { useListTeachers } from 'requests/queries/teachers';
import {
  useProfile,
  useSessionSchoolYear,
  useUser
} from 'requests/queries/session';

import { useListSchoolSubjects } from './hooks';

import * as S from './styles';

type SearchClassesProps = {
  handleSearch: (values: Record<string, unknown>) => void;
  currentValues?: Record<string, unknown>;
};
const SearchClasses = ({
  handleSearch,
  currentValues
}: SearchClassesProps): JSX.Element => {
  const [school, setSchool] = useState<string>();
  const [grade, setGrade] = useState<string>();
  const [classPeriod, setClassPeriod] = useState<string>();
  const [classroom, setClassroom] = useState<string>();

  const { query } = useRouter();

  const { data: schoolYear } = useSessionSchoolYear();
  const { data: profile } = useProfile();
  const { data: user } = useUser();

  const { data: schools, isLoading: isLoadingSchools } = useListSchools();

  const { data: grades, isLoading: isLoadingGrades } = useListGrades({
    school_year_id: schoolYear?.id
  });

  const { data: classPeriods, isLoading: isLoadingClassPeriods } =
    useListClassPeriods({
      school_year_id: schoolYear?.id
    });

  const { data: classrooms, isLoading: isLoadingClassrooms } =
    useListClassrooms({
      school_id: school,
      grade_id: grade,
      class_period_id: classPeriod,
      school_year_id: schoolYear?.id,
      employee_id:
        profile?.access_level?.code === 'teacher'
          ? user?.employee?.id
          : undefined
    });

  const { data: schoolSubjects, isLoading: isLoadingSchoolSubjects } =
    useListSchoolSubjects({
      classroom_id: classroom,
      school_id: school,
      school_year_id: schoolYear?.id,
      grade_id: grade
    });

  const { data: teachers, isLoading: isLoadingTeachers } = useListTeachers({
    school_id: school
  });

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

    const classroomItems = classrooms?.items || [];

    return classroomItems?.map(({ description, id }) => ({
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
    const schoolId = query.school_id || profile?.school?.id;
    if (schoolId && !Array.isArray(schoolId)) {
      setSchool(schoolId);
    }
  }, [query, profile]);

  return (
    <S.SearchSection>
      <S.SectionTitle>
        <h4>Pesquisar</h4>
      </S.SectionTitle>
      <Form onSubmit={handleSearch} initialData={currentValues}>
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
          <SchoolDayDatepicker name="class_date" label="Data" />

          {!profile?.school?.id && (
            <Select
              name="school_id"
              label="Escola"
              options={schoolsOptions}
              emptyOption
              onChange={setSchool}
              selectedOption={school}
            />
          )}
          {profile?.access_level?.code !== 'teacher' && (
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
