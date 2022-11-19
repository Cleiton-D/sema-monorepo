import {
  forwardRef,
  ForwardRefRenderFunction,
  useCallback,
  useRef,
  useState,
  useImperativeHandle
} from 'react';
import { useSession } from 'next-auth/react';
import { FormHandles } from '@unform/core';
import { ValidationError } from 'yup';

import { Grade } from 'models/Grade';

import Modal, { ModalRef as DefaultModalRef } from 'components/Modal';
import TextInput from 'components/TextInput';
import Button from 'components/Button';

import { useAddGradeMutation } from 'requests/mutations/grades';

import { addGradeSchema } from './rules/schema';

import * as S from './styles';

export type ModalRef = {
  openModal: (grade?: Grade) => void;
};

type AddGradeFormData = {
  description: string;
  workload?: string;
};

const AddGradeModal: ForwardRefRenderFunction<ModalRef> = (_, ref) => {
  const [grade, setGrade] = useState<Grade>();

  const modalRef = useRef<DefaultModalRef>(null);
  const formRef = useRef<FormHandles>(null);

  const { data: session } = useSession();

  const openModal = useCallback((item?: Grade) => {
    setGrade(item);
    modalRef.current?.openModal();
  }, []);

  const handleBack = useCallback(() => {
    formRef.current?.reset();
    modalRef.current?.closeModal();
  }, []);

  const mutation = useAddGradeMutation(handleBack, session);
  const handleSave = useCallback(
    async (values: AddGradeFormData) => {
      try {
        formRef.current?.setErrors({});

        await addGradeSchema.validate(values, { abortEarly: false });

        const requestData = {
          description: values.description
        };

        mutation.mutate(requestData);
      } catch (err) {
        if (err instanceof ValidationError) {
          const validationErrors: Record<string, string> = {};

          err.inner.forEach((error) => {
            if (error.path) {
              validationErrors[error.path] = error.message;
            }
          });
          formRef.current?.setErrors(validationErrors);
        }
      }
    },
    [mutation]
  );

  useImperativeHandle(ref, () => ({ openModal }));

  return (
    <Modal
      title={grade ? `Editar ${grade.description}` : 'Adicionar série'}
      closeOnClickOutside={false}
      ref={modalRef}
    >
      <S.Wrapper>
        <S.Form onSubmit={handleSave} ref={formRef} initialData={grade}>
          <TextInput name="description" label="Nome" />

          <S.ButtonsContainer>
            <Button
              styleType="outlined"
              onClick={handleBack}
              type="button"
              size="medium"
            >
              Voltar
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

export default forwardRef(AddGradeModal);
