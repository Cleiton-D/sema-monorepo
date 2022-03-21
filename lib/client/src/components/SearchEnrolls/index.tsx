import { useMemo, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { Form } from '@unform/web';

import TextInput from 'components/TextInput';
import Select from 'components/Select';
import Button from 'components/Button';

import { useListSchools } from 'requests/queries/schools';
import { useListClassrooms } from 'requests/queries/classrooms';
import { useListGrades } from 'requests/queries/grades';
import { useListClassPeriods } from 'requests/queries/class-periods';

import * as S from './styles';

type SearchEnrollsProps = {
  handleSearch: (values: Record<string, string>) => void;
};
const SearchEnrolls = ({ handleSearch }: SearchEnrollsProps): JSX.Element => {
  const [school, setSchool] = useState<string>();
  const [grade, setGrade] = useState<string>();
  const [classPeriod, setClassPeriod] = useState<string>();

  const { query } = useRouter();

  const { data: session } = useSession();

  const { data: schools, isLoading: isLoadingSchools } =
    useListSchools(session);

  const { data: grades, isLoading: isLoadingGrades } = useListGrades(session);

  const { data: classPeriods, isLoading: isLoadingClassPeriods } =
    useListClassPeriods(session);

  const { data: classrooms, isLoading: isLoadingClassrooms } =
    useListClassrooms(
      session,
      {
        school_id: school,
        grade_id: grade,
        class_period_id: classPeriod
      },
      { enabled: !!school }
    );

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

  const statusOptions = useMemo(() => {
    return [
      {
        value: 'ACTIVE',
        label: 'Ativo'
      },
      {
        value: 'INACTIVE',
        label: 'Inativo'
      },
      {
        value: 'TRANSFERRED',
        label: 'Transferido'
      }
    ];
  }, []);

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
          <TextInput name="student_name" label="Nome do aluno" />
          <TextInput name="student_cpf" label="CPF do aluno" />
          <TextInput name="student_nis" label="NIS" />
          <TextInput
            name="student_birth_certificate"
            label="Certidão de nascimento"
          />
          <Select
            name="status"
            label="Situação"
            options={statusOptions}
            emptyOption
          />

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
            emptyOption
          />
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

export default SearchEnrolls;
