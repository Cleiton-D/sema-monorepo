import {
  forwardRef,
  ForwardRefRenderFunction,
  useCallback,
  useRef,
  useImperativeHandle
} from 'react';
import { useSession } from 'next-auth/client';
import { FormHandles } from '@unform/core';
import { ValidationError } from 'yup';

import Modal, { ModalRef } from 'components/Modal';
import TextInput from 'components/TextInput';
import Button from 'components/Button';

import { useAddAccessLevelMutation } from 'requests/mutations/access-levels';

import { addAccessLevelSchema } from './rules/schema';

import * as S from './styles';

export type AccessLevelModalRef = {
  openModal: () => void;
};

type AddAccesslevelModalProps = {
  refetchFn: () => void;
};

type AddAccessLevelData = {
  description: string;
};

const AddAccesslevelModal: ForwardRefRenderFunction<
  AccessLevelModalRef,
  AddAccesslevelModalProps
> = ({ refetchFn }, ref) => {
  const modalRef = useRef<ModalRef>(null);
  const [session] = useSession();
  const mutation = useAddAccessLevelMutation(modalRef, session);

  const formRef = useRef<FormHandles>(null);

  const handleSave = useCallback(
    async (values: AddAccessLevelData) => {
      try {
        formRef.current?.setErrors({});

        await addAccessLevelSchema.validate(values, { abortEarly: false });

        const { description } = values;
        const code = description.trim().toLowerCase().replace(/\s+/g, '-');

        await mutation.mutateAsync({ description, code });
        refetchFn();
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
    [mutation, refetchFn]
  );

  const handleBack = useCallback(() => {
    modalRef.current?.closeModal();
  }, []);

  const openModal = useCallback(() => {
    modalRef.current?.openModal();
  }, []);

  useImperativeHandle(ref, () => ({ openModal }));

  return (
    <Modal
      title="Adicionar Nível de Acesso"
      closeOnClickOutside={false}
      ref={modalRef}
    >
      <S.Wrapper>
        <S.Form onSubmit={handleSave} ref={formRef}>
          <TextInput name="description" label="Nome do nível de acesso" />
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

export default forwardRef(AddAccesslevelModal);
