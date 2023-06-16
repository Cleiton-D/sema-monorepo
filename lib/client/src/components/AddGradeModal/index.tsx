import {
  forwardRef,
  ForwardRefRenderFunction,
  useCallback,
  useRef,
  useState,
  useImperativeHandle
} from 'react';
import { useQueryClient } from 'react-query';
import { FormHandles } from '@unform/core';
import { ValidationError } from 'yup';

import { Grade } from 'models/Grade';

import Modal, { ModalRef as DefaultModalRef } from 'components/Modal';
import TextInput from 'components/TextInput';
import Button from 'components/Button';

import { useAddGradeMutation } from 'requests/mutations/grades';
import { gradesKeys } from 'requests/queries/grades';

import { addGradeSchema } from './rules/schema';

import * as S from './styles';

export type ModalRef = {
  openModal: (grade?: Grade) => void;
};

type AddGradeModalProps = {
  schoolYearId?: string;
};

type AddGradeFormData = {
  description: string;
  workload?: string;
};

const AddGradeModal: ForwardRefRenderFunction<ModalRef, AddGradeModalProps> = (
  { schoolYearId },
  ref
) => {
  const [grade, setGrade] = useState<Grade>();

  const modalRef = useRef<DefaultModalRef>(null);
  const formRef = useRef<FormHandles>(null);

  const queryClient = useQueryClient();

  const openModal = useCallback((item?: Grade) => {
    setGrade(item);
    modalRef.current?.openModal();
  }, []);

  const handleBack = useCallback(() => {
    formRef.current?.reset();
    modalRef.current?.closeModal();
  }, []);

  const mutation = useAddGradeMutation(handleBack);
  const handleSave = useCallback(
    async (values: AddGradeFormData) => {
      try {
        formRef.current?.setErrors({});

        await addGradeSchema.validate(values, { abortEarly: false });

        const requestData = {
          description: values.description,
          school_year_id: schoolYearId
        };

        await mutation.mutateAsync(requestData);
        queryClient.invalidateQueries(...gradesKeys.all);
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
    [mutation, queryClient, schoolYearId]
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
