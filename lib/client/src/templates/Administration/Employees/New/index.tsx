import { useRouter } from 'next/router';
import { useResetAtom } from 'jotai/utils';

import Base from 'templates/Base';

import FormStep from 'components/FormStep';
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

import { useCreateEmployee } from 'requests/mutations/employee';

import * as S from './styles';

const employeeForm = <EmployeeForm jotaiState={employeeData} />;
const documentsForm = <DocumentsForm jotaiState={employeeDocuments} />;
const contactsForm = <ContactsForm jotaiState={employeeContactsData} />;

const NewEmployee = () => {
  const resetEmployeeData = useResetAtom(employeeData);
  const resetEmployeeContactsData = useResetAtom(employeeContactsData);
  const resetEmployeeDocuments = useResetAtom(employeeDocuments);

  const route = useRouter();

  const mutationCreateEmployee = useCreateEmployee();

  const handleFinish = useAtomCallback(async (get) => {
    const { birth_date, ...newEmployee } = get(employeeData);
    const contacts = get(employeeContactsData);
    const documents = get(employeeDocuments);

    const newBirthDate = birth_date.replace(
      /(^[0-9]{2})\/([0-9]{2})\/([0-9]{4})$/,
      '$3-$2-$1'
    );

    const { pis_pasep, ...restDocuments } = documents;

    const requestDocuments = Object.entries(restDocuments).map(
      ([type, number]) => ({
        document_type: type,
        document_number: number
      })
    );

    const requestData = {
      ...newEmployee,
      birth_date: newBirthDate,
      pis_pasep,
      documents: requestDocuments,
      contacts
    };

    await mutationCreateEmployee.mutateAsync(requestData);

    resetEmployeeData();
    resetEmployeeContactsData();
    resetEmployeeDocuments();

    route.push('/administration/employees');
  }, []);

  return (
    <Base>
      <Heading>Adicionar Servidor</Heading>
      <S.FormsSection>
        <FormStep
          items={[employeeForm, documentsForm, contactsForm]}
          finishButtonText="Finalizar"
          onFinish={handleFinish}
        />
      </S.FormsSection>
    </Base>
  );
};

export default NewEmployee;
