import { forwardRef, useCallback, useMemo, useImperativeHandle } from 'react';
import { useSession } from 'next-auth/client';
import { PrimitiveAtom, useAtom } from 'jotai';

import Select from 'components/Select';
import SchoolEmployeesForm from 'components/SchoolEmployeesForm';

import { FormHandles } from 'models/Form';
import { Employee } from 'models/Employee';
import { BasicSchoolFormType } from 'models/School';

import { useListEmployees } from 'requests/queries/employee';

import * as S from './styles';

type SchoolAdministrationFormProps = {
  basicJotaiState: PrimitiveAtom<BasicSchoolFormType>;
  jotaiState: PrimitiveAtom<Record<string, Employee[]>>;
};

const SchoolAdministrationForm: React.ForwardRefRenderFunction<
  FormHandles,
  SchoolAdministrationFormProps
> = ({ jotaiState, basicJotaiState }, ref) => {
  const [state, setState] = useAtom(basicJotaiState);

  const [session] = useSession();
  const { data: employees, isLoading } = useListEmployees(session);

  const employeesOptions = useMemo(() => {
    if (isLoading) return [{ label: 'Carregando...', value: '' }];
    if (!employees) return [];

    return employees.map((employee) => ({
      value: employee.id,
      label: employee.person.name
    }));
  }, [employees, isLoading]);

  const handleChangeDirectory = useCallback(
    (employee_id: string, profileCode: string) => {
      setState((current) => {
        return { ...current, [profileCode]: employee_id };
      });
    },
    [setState]
  );

  const submitForm = useCallback(async () => {
    (() => true)();
  }, []);

  useImperativeHandle(ref, () => ({ submitForm }));

  return (
    <S.Wrapper>
      <S.SectionTitle>
        <h4>Administração</h4>
      </S.SectionTitle>
      <S.Form onSubmit={(values) => console.log(values)}>
        <Select
          label="Diretor"
          name="director_id"
          options={employeesOptions}
          selectedOption={state.director_id}
          onChange={(employee) =>
            handleChangeDirectory(employee, 'director_id')
          }
        />
        <Select
          label="Vice-diretor"
          name="vice_director_id"
          options={employeesOptions}
          selectedOption={state.vice_director_id}
          onChange={(employee) =>
            handleChangeDirectory(employee, 'vice_director_id')
          }
        />
      </S.Form>
      <S.EmployeesSection>
        <SchoolEmployeesForm
          title="Secretários"
          name="secretário"
          pluralName="secretários"
          buttonText="Adicionar Secretário"
          profileCode="school-secretary"
          jotaiState={jotaiState}
        />
        <SchoolEmployeesForm
          title="Supervisores"
          name="supervisor"
          pluralName="supervisores"
          buttonText="Adicionar Supervisor"
          profileCode="supervisor"
          jotaiState={jotaiState}
        />
        <SchoolEmployeesForm
          title="Orientadores"
          name="orientador"
          pluralName="orientadores"
          buttonText="Adicionar Orientador"
          profileCode="advisor"
          jotaiState={jotaiState}
        />
      </S.EmployeesSection>
    </S.Wrapper>
  );
};

export default forwardRef(SchoolAdministrationForm);
