import {
  useState,
  useCallback,
  useRef,
  useImperativeHandle,
  forwardRef
} from 'react';
import { FormHandles } from '@unform/core';

import { Attendance } from 'models/Attendance';

import Button from 'components/Button';
import Modal, { ModalRef } from 'components/Modal';
import TextInput from 'components/TextInput';

import { useJustifyAbsence } from 'requests/mutations/attendances';

import * as S from './styles';

export type JustifyAbsenceModalRef = {
  openModal: (attendance: Attendance) => void;
};

type JustifyAbsenceModalProps = {
  onSucess?: () => void;
};

const JustifyAbsenceModal: React.ForwardRefRenderFunction<
  JustifyAbsenceModalRef,
  JustifyAbsenceModalProps
> = ({ onSucess }, ref) => {
  const [attendance, setAttendance] = useState<Attendance>();

  const modalRef = useRef<ModalRef>(null);
  const formRef = useRef<FormHandles>(null);

  const justifyAbsence = useJustifyAbsence();

  const openModal = useCallback((attendance?: Attendance) => {
    setAttendance(attendance);
    modalRef.current?.openModal();
  }, []);

  const handleBack = useCallback(() => {
    setAttendance(undefined);
    modalRef.current?.closeModal();
  }, []);

  const handleSubmit = useCallback(
    async (values: { justification_description: string }) => {
      formRef.current?.setErrors({});
      if (!attendance) return;

      if (!values.justification_description) {
        formRef.current?.setErrors({
          justification_description: 'Campo Obrigatório'
        });
      }

      justifyAbsence
        .mutateAsync({
          attendance_id: attendance.id,
          description: values.justification_description
        })
        .then(() => {
          onSucess?.();
        });

      handleBack();
    },
    [attendance, justifyAbsence, handleBack, onSucess]
  );

  useImperativeHandle(ref, () => ({ openModal }));

  return (
    <Modal
      closeOnClickOutside={false}
      ref={modalRef}
      title={
        attendance?.justified
          ? `Editar justificativa`
          : `Adicionar justificativa`
      }
    >
      <S.Wrapper>
        <S.Form onSubmit={handleSubmit} ref={formRef} initialData={attendance}>
          <S.FieldsContainer>
            <TextInput
              name="justification_description"
              label="Descrição"
              as="textarea"
            />
          </S.FieldsContainer>

          <S.ButtonsContainer>
            <Button
              styleType="outlined"
              onClick={handleBack}
              type="button"
              size="medium"
            >
              Cancelar
            </Button>
            <Button styleType="rounded" type="submit" size="medium">
              Salvar
            </Button>
          </S.ButtonsContainer>
        </S.Form>
      </S.Wrapper>
    </Modal>
  );
};

export default forwardRef(JustifyAbsenceModal);
