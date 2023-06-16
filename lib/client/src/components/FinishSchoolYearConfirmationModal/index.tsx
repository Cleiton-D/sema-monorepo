import { forwardRef, useRef, useImperativeHandle } from 'react';

import { FormattedSchoolYear } from 'models/SchoolYear';

import Modal, { ModalRef } from 'components/Modal';
import Button from 'components/Button';
import TextInput from 'components/TextInput';

import { useUser } from 'requests/queries/session';
import { useFinishSchoolYear } from 'requests/mutations/finish-school-year';

import * as S from './styles';

export type FinishSchoolYearConfirmationModalRef = {
  openModal: () => void;
};

type FinishSchoolYearConfirmationModalProps = {
  schoolYear: FormattedSchoolYear;
};

const FinishSchoolYearConfirmationModal: React.ForwardRefRenderFunction<
  FinishSchoolYearConfirmationModalRef,
  FinishSchoolYearConfirmationModalProps
> = ({ schoolYear }, ref) => {
  const modalRef = useRef<ModalRef>(null);

  const { data: user } = useUser();

  const finishSchoolYear = useFinishSchoolYear();

  const openModal = () => {
    modalRef.current?.openModal();
  };

  const handleBack = () => {
    modalRef.current?.closeModal();
  };

  const handleSubmit = (values: { passwd: string }) => {
    modalRef.current?.closeModal();
    finishSchoolYear
      .mutateAsync({
        schoolYearId: schoolYear.id,
        login: user?.login,
        password: values.passwd
      })
      .then(() => document.location.reload());
  };

  useImperativeHandle(ref, () => ({ openModal }));

  return (
    <Modal
      title="Encerrar ano letivo"
      closeOnClickOutside={false}
      ref={modalRef}
    >
      <S.Wrapper>
        <S.Message>
          Deseja encerrar o ano letivo de {schoolYear.reference_year}?
        </S.Message>
        <S.Form onSubmit={handleSubmit}>
          <TextInput name="passwd" label="Informe sua senha" type="password" />
          <S.ButtonsContainer>
            <Button
              styleType="outlined"
              size="medium"
              onClick={handleBack}
              type="button"
            >
              Cancelar
            </Button>
            <Button styleType="rounded" size="medium" type="submit">
              Confirmar
            </Button>
          </S.ButtonsContainer>
        </S.Form>
      </S.Wrapper>
    </Modal>
  );
};

export default forwardRef(FinishSchoolYearConfirmationModal);
