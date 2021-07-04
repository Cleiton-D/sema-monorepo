import {
  forwardRef,
  ForwardRefRenderFunction,
  useCallback,
  useRef
} from 'react';
import mergeRef from 'react-merge-refs';
import { useSession } from 'next-auth/client';
import { FormHandles } from '@unform/core';
import { ValidationError } from 'yup';

import Modal, { ModalRef as DefaultModalRef } from 'components/Modal';
import TextInput from 'components/TextInput';
import Button from 'components/Button';

import { useAddGradeMutation } from 'requests/mutations/grades';

import { addGradeSchema } from './rules/schema';

import * as S from './styles';

export type ModalRef = DefaultModalRef;

type AddGradeFormData = {
  description: string;
};

const AddGradeModal: ForwardRefRenderFunction<ModalRef> = (_, ref) => {
  const modalRef = useRef<ModalRef>(null);
  const [session] = useSession();
  const mutation = useAddGradeMutation(modalRef, session);

  const formRef = useRef<FormHandles>(null);

  const handleSave = useCallback(
    async (values: AddGradeFormData) => {
      try {
        formRef.current?.setErrors({});

        await addGradeSchema.validate(values, { abortEarly: false });

        mutation.mutate(values);
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

  const handleBack = useCallback(() => {
    modalRef.current?.closeModal();
  }, []);

  return (
    <Modal
      title="Adicionar série"
      closeOnClickOutside={false}
      ref={mergeRef([ref, modalRef])}
    >
      <S.Wrapper>
        <S.Form onSubmit={handleSave} ref={formRef}>
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
