import { useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import { useResetAtom } from 'jotai/utils';

import Base from 'templates/Base';

import Heading from 'components/Heading';

import OldStudentForm from 'components/OldStudentForm';
import StudentForm from 'components/StudentForm';
import StudentDocumentsForm from 'components/StudentDocumentsForm ';
import ContactsForm from 'components/ContactsForm';
import EnrollForm from 'components/EnrollForm';
import FormsGroup from 'components/FormsGroup';

import { School } from 'models/School';

import useAtomCallback from 'hooks/use-atom-callback';

import {
  basicEnrollData,
  enrollContactsData,
  enrollData,
  createEnrollData,
  enrollDocumentsData,
  selectedStudent as selectedStudentAtom
} from 'store/atoms/create-enroll';

import { useCreateEnroll } from 'requests/mutations/enroll';

import * as S from './styles';

export type NewEnrollProps = {
  school: School;
  ufs: Array<{
    nome: string;
    sigla: string;
  }>;
};
const NewEnroll = ({ school, ufs }: NewEnrollProps) => {
  const router = useRouter();
  const resetForm = useResetAtom(createEnrollData);
  const resetSelectedStudent = useResetAtom(selectedStudentAtom);

  const mutationCreateEnroll = useCreateEnroll();

  const resetForms = useCallback(() => {
    resetForm();
    resetSelectedStudent();
  }, [resetSelectedStudent, resetForm]);

  const handleFinish = useAtomCallback(
    async (get) => {
      const enroll = get(createEnrollData);
      const selectedStudent = get(selectedStudentAtom);

      const { student, schoolReports, unique_code, enroll_date, ...newEnroll } =
        enroll;
      const { birth_date, ...newStudent } = student;
      const newBirthDate = birth_date.replace(
        /(^[0-9]{2})\/([0-9]{2})\/([0-9]{4})$/,
        '$3-$2-$1'
      );

      const newEnrollDate = enroll_date.replace(
        /(^[0-9]{2})\/([0-9]{2})\/([0-9]{4})$/,
        '$3-$2-$1'
      );

      const requestEnroll = {
        ...newEnroll,
        enroll_date: newEnrollDate,
        school_reports: schoolReports,
        school_id: school.id,
        student: {
          ...newStudent,
          unique_code,
          birth_date: newBirthDate,
          id: selectedStudent?.id
        }
      };

      await mutationCreateEnroll.mutateAsync(requestEnroll);
      resetForms();
      router.push(`/auth/enrolls?school_id=${school.id}`);
    },
    [router, school]
  );

  useEffect(() => {
    router.events.on('routeChangeStart', resetForms);

    return () => {
      router.events.off('routeChangeStart', resetForms);
    };
  }, [router, resetForms]);

  return (
    <Base>
      <Heading>Nova matrícula</Heading>
      <S.FormsSection>
        <OldStudentForm />
        <FormsGroup onFinish={handleFinish}>
          <StudentForm jotaiState={basicEnrollData} ufs={ufs} />
          <StudentDocumentsForm jotaiState={enrollDocumentsData} />
          <ContactsForm jotaiState={enrollContactsData} />
          <EnrollForm jotaiState={enrollData} school={school} />
        </FormsGroup>
      </S.FormsSection>
    </Base>
  );
};

export default NewEnroll;
