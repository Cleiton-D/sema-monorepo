import { useMemo } from 'react';
import { useRouter } from 'next/router';
import { useResetAtom } from 'jotai/utils';

import Base from 'templates/Base';

import Heading from 'components/Heading';
import FormStep from 'components/FormStep';

import PersonForm from 'components/PersonForm';
import ContactsForm from 'components/ContactsForm';
import EnrollForm from 'components/EnrollForm';

import { School } from 'models/School';

import useAtomCallback from 'hooks/use-atom-callback';

import {
  personEnrollData,
  personEnrollContactsData,
  enrollData,
  createEnrollData
} from 'store/atoms/create-enroll';

import { useCreateEnroll } from 'requests/mutations/enroll';

import * as S from './styles';

const personForm = <PersonForm jotaiState={personEnrollData} />;
const contactsForm = <ContactsForm jotaiState={personEnrollContactsData} />;

export type NewEnrollProps = {
  school: School;
};
const NewEnroll = ({ school }: NewEnrollProps) => {
  const router = useRouter();
  const resetForm = useResetAtom(createEnrollData);

  const mutationCreateEnroll = useCreateEnroll();

  const handleFinish = useAtomCallback(
    async (get) => {
      const enroll = get(createEnrollData);

      const { person, ...newEnroll } = enroll;
      const { birth_date, ...newPerson } = person;
      const newBirthDate = birth_date.replace(
        /(^[0-9]{2})\/([0-9]{2})\/([0-9]{4})$/,
        '$3-$2-$1'
      );

      const requestEnroll = {
        ...newEnroll,
        school_id: school.id,
        person: { ...newPerson, birth_date: newBirthDate }
      };

      await mutationCreateEnroll.mutateAsync(requestEnroll);
      resetForm();
      router.back();
    },
    [router, school]
  );

  const enrollForm = useMemo(
    () => <EnrollForm jotaiState={enrollData} school={school} />,
    [school]
  );

  return (
    <Base>
      <Heading>Nova matrícula</Heading>
      <S.FormsSection>
        <FormStep
          items={[personForm, contactsForm, enrollForm]}
          finishButtonText="Finalizar"
          onFinish={handleFinish}
        />
      </S.FormsSection>
    </Base>
  );
};

export default NewEnroll;
