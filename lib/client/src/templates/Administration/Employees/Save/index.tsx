import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useUpdateAtom, RESET } from 'jotai/utils';
import format from 'date-fns/format';

import Base from 'templates/Base';

import FormsGroup from 'components/FormsGroup';
import Heading from 'components/Heading';

import EmployeeForm from 'components/EmployeeForm';
import ContactsForm from 'components/ContactsForm';
import DocumentsForm from 'components/DocumentsForm';

import useAtomCallback from 'hooks/use-atom-callback';

import {
  employeeData,
  employeeContactsData,
  employeeDocuments
} from 'store/atoms/create-employee';

import { useShowEmployee } from 'requests/queries/employee';
import { useSaveEmployee } from 'requests/mutations/employee';

import { parseDateWithoutTimezone } from 'utils/parseDateWithoutTimezone';

import * as S from './styles';

const SaveEmployee = () => {
  const route = useRouter();

  const { data: employee } = useShowEmployee({
    employee_id: route.query.employee_id as string
  });

  const updateEmployeeData = useUpdateAtom(employeeData);
  const updateEmployeeContactsData = useUpdateAtom(employeeContactsData);
  const updateEmployeeDocuments = useUpdateAtom(employeeDocuments);

  const saveEmployee = useSaveEmployee();

  const handleFinish = useAtomCallback(async (get) => {
    const { birth_date, ...newEmployee } = get(employeeData);
    const contacts = get(employeeContactsData);
    const documents = get(employeeDocuments);

    const [day, month, year] = birth_date.split('/');

    const newBirthDate = new Date(+year, +month - 1, +day);

    const { pis_pasep, cpf, rg } = documents;

    const requestData = {
      ...newEmployee,
      id: employee?.id,
      birth_date: newBirthDate,
      pis_pasep,
      cpf,
      rg,
      contacts
    };

    await saveEmployee.mutateAsync(requestData);

    updateEmployeeData(RESET);
    updateEmployeeContactsData(RESET);
    updateEmployeeDocuments(RESET);

    route.push('/auth/administration/employees');
  }, []);

  useEffect(() => {
    if (!employee) return;

    const {
      name,
      gender,
      birth_date,
      mother_name,
      dad_name,
      address,
      contacts,
      cpf,
      rg,
      pis_pasep
    } = employee;

    const employeeObj = {
      ...employee,
      name,
      gender,
      birth_date:
        birth_date &&
        format(parseDateWithoutTimezone(birth_date), 'dd/MM/yyyy'),
      mother_name,
      dad_name,
      address
    };

    updateEmployeeData(employeeObj);
    updateEmployeeContactsData(contacts);
    updateEmployeeDocuments({ cpf, rg: rg || '', pis_pasep });

    return () => {
      updateEmployeeData(RESET);
      updateEmployeeContactsData(RESET);
      updateEmployeeDocuments(RESET);
    };
  }, [
    employee,
    updateEmployeeData,
    updateEmployeeContactsData,
    updateEmployeeDocuments
  ]);

  return (
    <Base>
      <Heading>{employee ? 'Editar' : 'Adicionar'} Servidor</Heading>
      <S.FormsSection>
        <FormsGroup onFinish={handleFinish}>
          <EmployeeForm jotaiState={employeeData} />
          <DocumentsForm jotaiState={employeeDocuments} />
          <ContactsForm jotaiState={employeeContactsData} />
        </FormsGroup>
      </S.FormsSection>
    </Base>
  );
};

export default SaveEmployee;
