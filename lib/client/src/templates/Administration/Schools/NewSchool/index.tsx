import { useRouter } from 'next/router';
import { useSession } from 'next-auth/client';
import { useResetAtom } from 'jotai/utils';

import Base from 'templates/Base';

import Heading from 'components/Heading';
import FormStep from 'components/FormStep';

import SchoolBasicForm from 'components/SchoolBasicForm';
import AddressForm from 'components/AddressForm';
import ContactsForm from 'components/ContactsForm';
import SchoolAdministrationForm from 'components/SchoolAdministrationForm';

import {
  basicSchoolData,
  schoolAddressData,
  schoolContactsData,
  employeesSchoolData,
  createSchoolData
} from 'store/atoms/create-school';
import useAtomCallback from 'hooks/use-atom-callback';

import { useAddSchoolMutation } from 'requests/mutations/schools';

import * as S from './styles';

const addressForm = <AddressForm jotaiState={schoolAddressData} />;
const contactsForm = <ContactsForm jotaiState={schoolContactsData} />;
const schoolAdminForm = (
  <SchoolAdministrationForm
    jotaiState={employeesSchoolData}
    basicJotaiState={basicSchoolData}
  />
);

const NewSchool = () => {
  const [session] = useSession();
  const mutation = useAddSchoolMutation(session);
  const resetForm = useResetAtom(createSchoolData);

  const { push } = useRouter();

  const handleFinish = useAtomCallback(async (get) => {
    const finalState = get(createSchoolData);

    const { contacts, employees, ...finalData } = finalState;
    const contactsWithoutId = contacts.map(({ id: _, ...contact }) => contact);
    const employeesUsers = Object.entries(employees).reduce<
      Record<string, string[]>
    >((acc, item) => {
      const [profile, items] = item;
      const newItems = items || [];

      const userIds = newItems.map(({ user_id }) => user_id);

      return { ...acc, [profile]: userIds };
    }, {});

    await mutation.mutateAsync({
      ...finalData,
      contacts: contactsWithoutId,
      employees: employeesUsers
    });

    await push('/administration/schools');
    resetForm();
  }, []);

  return (
    <Base>
      <Heading>Nova escola</Heading>
      <SchoolBasicForm />

      <S.FormsSection>
        <FormStep
          items={[addressForm, contactsForm, schoolAdminForm]}
          finishButtonText="Finalizar"
          onFinish={handleFinish}
        />
      </S.FormsSection>
    </Base>
  );
};

export default NewSchool;
