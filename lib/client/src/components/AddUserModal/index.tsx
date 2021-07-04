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

import { useAddUserMutation } from 'requests/mutations/users';

import { addUserSchema } from './rules/schema';

import * as S from './styles';

export type ModalRef = DefaultModalRef;

type AddUserFormData = {
  username: string;
  login: string;
};

const AddUserModal: ForwardRefRenderFunction<ModalRef> = (_, ref) => {
  const modalRef = useRef<ModalRef>(null);
  const [session] = useSession();
  const mutation = useAddUserMutation(modalRef, session);

  const formRef = useRef<FormHandles>(null);

  const handleSave = useCallback(
    async (values: AddUserFormData) => {
      try {
        formRef.current?.setErrors({});

        await addUserSchema.validate(values, { abortEarly: false });

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
      title="Adicionar usuário"
      closeOnClickOutside={false}
      ref={mergeRef([ref, modalRef])}
    >
      <S.Wrapper>
        <S.Form onSubmit={handleSave} ref={formRef}>
          <TextInput name="username" label="Nome" />
          <TextInput name="login" label="Email" />
          <S.ButtonsContainer>
            <Button styleType="outlined" onClick={handleBack} type="button">
              Voltar
            </Button>
            <Button styleType="rounded" type="submit">
              Salvar
            </Button>
          </S.ButtonsContainer>
        </S.Form>
      </S.Wrapper>
    </Modal>
  );
};

export default forwardRef(AddUserModal);
