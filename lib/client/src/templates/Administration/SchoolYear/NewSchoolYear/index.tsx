import { useCallback } from 'react';
import { useRouter } from 'next/router';
import { useResetAtom } from 'jotai/utils';

import Base from 'templates/Base';

import Heading from 'components/Heading';
import FormStep from 'components/FormStep';

import SchoolYearBasicForm from 'components/SchoolYearBasicForm';
import GradeSchoolSubjectsForm from 'components/GradeSchoolSubjectsForm';

import { fetchAllSession, useProfile } from 'requests/queries/session';
import { refreshSession } from 'requests/mutations/session';

import { schoolYearAtom } from 'store/atoms/school-year';

import * as S from './styles';

const basicForm = <SchoolYearBasicForm />;
const gradeSchoolSubjectsForm = <GradeSchoolSubjectsForm />;

const NewSchoolYear = () => {
  const { push } = useRouter();

  const resetForm = useResetAtom(schoolYearAtom);

  const { data: profile } = useProfile();
  const handleFinish = useCallback(async () => {
    resetForm();

    await refreshSession({
      profileId: profile?.id
    });
    await fetchAllSession();

    push(`/auth/administration/school-year`);
  }, [profile, push, resetForm]);

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
