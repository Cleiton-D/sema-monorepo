import {
  forwardRef,
  ForwardRefRenderFunction,
  useCallback,
  useRef,
  useState,
  useImperativeHandle
} from 'react';
import { useSession } from 'next-auth/client';
import { FormHandles } from '@unform/core';
import { ValidationError } from 'yup';

import Modal, { ModalRef } from 'components/Modal';
import TextInput from 'components/TextInput';
import Button from 'components/Button';

import { useAddSchoolSubjectMutation } from 'requests/mutations/school-subjects';

import { SchoolSubject } from 'models/SchoolSubject';

import { addSchoolSubjectSchema } from './rules/schema';

import * as S from './styles';

export type SchoolSubjectModalRef = {
  openModal: (schoolSubject?: SchoolSubject) => void;
};

type AddSchoolSubjectModalProps = {
  refetchFn?: () => void;
};

type AddSchoolSubjectData = {
  description: string;
  additional_description: string;
};

const AddSchoolSubjectModal: ForwardRefRenderFunction<
  SchoolSubjectModalRef,
  AddSchoolSubjectModalProps
> = ({ refetchFn }, ref) => {
  const [schoolSubject, setSchoolSubject] = useState<SchoolSubject>();

  const modalRef = useRef<ModalRef>(null);
  const [session] = useSession();
  const mutation = useAddSchoolSubjectMutation(modalRef, session);

  const formRef = useRef<FormHandles>(null);

  const handleSave = useCallback(
    async (values: AddSchoolSubjectData) => {
      try {
        formRef.current?.setErrors({});

        await addSchoolSubjectSchema.validate(values, { abortEarly: false });

        await mutation.mutateAsync({ id: schoolSubject?.id, ...values });
        refetchFn && refetchFn();
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
    [mutation, schoolSubject, refetchFn]
  );

  const handleBack = useCallback(() => {
    modalRef.current?.closeModal();
  }, []);

  const openModal = useCallback((data?: SchoolSubject) => {
    setSchoolSubject(data);
    modalRef.current?.openModal();
  }, []);

  useImperativeHandle(ref, () => ({ openModal }));

  return (
    <Modal
      title="Adicionar disciplina"
      closeOnClickOutside={false}
      ref={modalRef}
    >
      <S.Wrapper>
        <S.Form onSubmit={handleSave} ref={formRef} initialData={schoolSubject}>
          <TextInput name="description" label="Nome da disciplina" />
          <TextInput
            name="additional_description"
            label="Descrição da disciplina"
            as="textarea"
          />
          <S.ButtonsContainer>
            <Button
              styleType="outlined"
              size="medium"
              onClick={handleBack}
              type="button"
            >
              Voltar
            </Button>
            <Button styleType="rounded" size="medium" type="submit">
              Salvar
            </Button>
          </S.ButtonsContainer>
        </S.Form>
      </S.Wrapper>
    </Modal>
  );
};

export default forwardRef(AddSchoolSubjectModal);
