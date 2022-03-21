import { useMemo, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { Form } from '@unform/web';

import Select from 'components/Select';
import Button from 'components/Button';

import { useListSchools } from 'requests/queries/schools';
import { useListGrades } from 'requests/queries/grades';
import { useListClassPeriods } from 'requests/queries/class-periods';

import * as S from './styles';

const statusOptions = [
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

type ClassroomsSearchProps = {
  handleSearch: (values: Record<string, string>) => void;
};
const ClassroomsSearch = ({
  handleSearch
}: ClassroomsSearchProps): JSX.Element => {
  const [school, setSchool] = useState<string>();

  const { query } = useRouter();

  const { data: session } = useSession();

  const { data: schools, isLoading: isLoadingSchools } =
    useListSchools(session);

  const { data: grades, isLoading: isLoadingGrades } = useListGrades(session);

  const { data: classPeriods, isLoading: isLoadingClassPeriods } =
    useListClassPeriods(session);

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

  useEffect(() => {
    const schoolId = query.school_id;
    if (schoolId && !Array.isArray(schoolId)) {
      setSchool(schoolId);
    }
  }, [query]);

  return (
    <S.SearchSection>
      <S.SectionTitle>
        <h4>Pesquisar</h4>
      </S.SectionTitle>
      <Form onSubmit={handleSearch}>
        <S.FieldsContainer>
          {/* <Select
            name="status"
            label="Situação"
            options={statusOptions}
            emptyOption
          /> */}

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
            emptyOption
          />
          <Select
            name="class_period_id"
            label="Período"
            options={classPeriodsOptions}
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

export default ClassroomsSearch;
