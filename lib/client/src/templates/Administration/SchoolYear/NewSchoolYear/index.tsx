import { useCallback } from 'react';
import { useRouter } from 'next/router';
import { useResetAtom } from 'jotai/utils';

import Base from 'templates/Base';

import Heading from 'components/Heading';
import FormStep from 'components/FormStep';

import SchoolYearBasicForm from 'components/SchoolYearBasicForm';
import SchoolYearClassPeriodForm from 'components/SchoolYearClassPeriodForm';
import SchoolClassPeriodsForm from 'components/SchoolClassPeriodsForm';
import GradeSchoolSubjectsForm from 'components/GradeSchoolSubjectsForm';

import { schoolYearAtom } from 'store/atoms/school-year';

import * as S from './styles';

const basicForm = <SchoolYearBasicForm />;
const classPeriodsForm = <SchoolYearClassPeriodForm />;
const schoolClassPeriodsForm = <SchoolClassPeriodsForm />;
const gradeSchoolSubjectsForm = <GradeSchoolSubjectsForm />;

const NewSchoolYear = () => {
  const { push } = useRouter();

  const resetForm = useResetAtom(schoolYearAtom);

  const handleFinish = useCallback(() => {
    resetForm();
    push(`/administration/school-year`);
  }, [push, resetForm]);

  return (
    <Base>
      <Heading>Cadastrar ano letivo</Heading>
      <S.FormsSection>
        <FormStep
          items={[
            basicForm,
            classPeriodsForm,
            schoolClassPeriodsForm,
            gradeSchoolSubjectsForm
          ]}
          finishButtonText="Finalizar"
          onFinish={handleFinish}
        />
      </S.FormsSection>
    </Base>
  );
};

export default NewSchoolYear;
