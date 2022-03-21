import { useCallback } from 'react';
import { useRouter } from 'next/router';
import { signIn, useSession } from 'next-auth/react';
import { useResetAtom } from 'jotai/utils';

import Base from 'templates/Base';

import Heading from 'components/Heading';
import FormStep from 'components/FormStep';

import SchoolYearBasicForm from 'components/SchoolYearBasicForm';
import GradeSchoolSubjectsForm from 'components/GradeSchoolSubjectsForm';

import { schoolYearAtom } from 'store/atoms/school-year';

import * as S from './styles';

const basicForm = <SchoolYearBasicForm />;
const gradeSchoolSubjectsForm = <GradeSchoolSubjectsForm />;

const NewSchoolYear = () => {
  const { push } = useRouter();

  const resetForm = useResetAtom(schoolYearAtom);

  const { data: session } = useSession();
  const handleFinish = useCallback(async () => {
    resetForm();

    await signIn('refresh', {
      profileId: session?.profileId,
      token: session?.jwt,
      redirect: false
    });

    push(`/auth/administration/school-year`);
  }, [push, resetForm, session]);

  return (
    <Base>
      <Heading>Cadastrar ano letivo</Heading>
      <S.FormsSection>
        <FormStep
          items={[basicForm, gradeSchoolSubjectsForm]}
          finishButtonText="Finalizar"
          onFinish={handleFinish}
        />
      </S.FormsSection>
    </Base>
  );
};

export default NewSchoolYear;
