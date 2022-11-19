import { useCallback, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { useUpdateAtom, RESET } from 'jotai/utils';

import Base from 'templates/Base';

import Heading from 'components/Heading';
import FormsGroup from 'components/FormsGroup';
import StudentForm from 'components/StudentForm';
import StudentDocumentsForm from 'components/StudentDocumentsForm ';
import ContactsForm from 'components/ContactsForm';

import useAtomCallback from 'hooks/use-atom-callback';

import {
  basicEnrollData,
  enrollContactsData,
  enrollDocumentsData
} from 'store/atoms/create-enroll';

import { useGetEnrollDetails } from 'requests/queries/enrolls';
import { useUpdateStudent } from 'requests/mutations/student';

import * as S from './styles';

export type EditStudentPageTemplateProps = {
  ufs: Array<{
    nome: string;
    sigla: string;
  }>;
};
const EditStudentPageTemplate = ({ ufs }: EditStudentPageTemplateProps) => {
  const router = useRouter();
  const { data: session } = useSession();

  const updateStudentAtom = useUpdateAtom(basicEnrollData);
  const updateStudentDocuments = useUpdateAtom(enrollDocumentsData);
  const updateStudentContacts = useUpdateAtom(enrollContactsData);

  const { data: enroll } = useGetEnrollDetails(
    router.query.enroll_id as string,
    session
  );

  const updateStudent = useUpdateStudent();

  const resetForms = useCallback(() => {
    updateStudentAtom(RESET);
    updateStudentDocuments(RESET);
    updateStudentContacts(RESET);
  }, [updateStudentAtom, updateStudentDocuments, updateStudentContacts]);

  const handleFinish = useAtomCallback(
    async (get) => {
      const studentData = get(basicEnrollData);
      const studentDocumentsData = get(enrollDocumentsData);
      const studentContactsData = get(enrollContactsData);

      const { birth_date, ...newStudent } = studentData;
      const newBirthDate = birth_date.replace(
        /(^[0-9]{2})\/([0-9]{2})\/([0-9]{4})$/,
        '$3-$2-$1'
      );

      await updateStudent.mutateAsync({
        ...newStudent,
        ...studentDocumentsData,
        contacts: studentContactsData,
        student_id: enroll?.student_id,
        birth_date: newBirthDate
      });

      resetForms();
      router.back();
    },
    [enroll, resetForms]
  );

  useEffect(() => {
    if (!enroll) return;

    const { student } = enroll;
    const { contacts, cpf, rg, birth_certificate, nis, unique_code } = student;

    const dateStr =
      student.birth_date instanceof Date
        ? student.birth_date.toISOString()
        : String(student.birth_date);

    const [year, month, day] = dateStr.split('T')[0].split('-');
    const newBirthDate = `${day}/${month}/${year}`;

    updateStudentAtom({ ...student, birth_date: newBirthDate });
    updateStudentDocuments({ cpf, rg, birth_certificate, nis, unique_code });
    updateStudentContacts(contacts);
  }, [
    enroll,
    updateStudentAtom,
    updateStudentContacts,
    updateStudentDocuments
  ]);

  useEffect(() => {
    router.events.on('routeChangeStart', resetForms);

    return () => {
      router.events.off('routeChangeStart', resetForms);
    };
  }, [router, resetForms]);

  return (
    <Base>
      <Heading>Editar aluno</Heading>
      <S.FormsSection>
        <FormsGroup onFinish={handleFinish}>
          <StudentForm jotaiState={basicEnrollData} ufs={ufs} />
          <StudentDocumentsForm jotaiState={enrollDocumentsData} />
          <ContactsForm jotaiState={enrollContactsData} />
        </FormsGroup>
      </S.FormsSection>
    </Base>
  );
};

export default EditStudentPageTemplate;
