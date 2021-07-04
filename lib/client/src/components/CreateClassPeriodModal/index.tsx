import {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useRef,
  useState
} from 'react';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import { ValidationError } from 'yup';

import Modal, { ModalRef } from 'components/Modal';
import TextInput from 'components/TextInput';
import Select from 'components/Select';
import Button from 'components/Button';

import { ClassPeriod, ClassPeriodForm } from 'models/ClassPeriod';

import { useMutateClassPeriod } from 'requests/mutations/class-period';

import { classPeriodSchema } from './rules/schema';

import * as S from './styles';

export type ClassPeriodModalRef = {
  openModal: (class_period?: ClassPeriod) => void;
};

const CreateClassPeriodsModal: React.ForwardRefRenderFunction<ClassPeriodModalRef> = (
  _,
  ref
) => {
  const [classPeriod, setClassPeriod] = useState<ClassPeriod>();
  const modalRef = useRef<ModalRef>(null);
  const formRef = useRef<FormHandles>(null);

  const mutation = useMutateClassPeriod(modalRef);

  const handleSubmit = useCallback(
    async (values: ClassPeriodForm) => {
      try {
        formRef.current?.setErrors({});

        await classPeriodSchema.validate(values, { abortEarly: false });
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

  const openModal = useCallback((class_period?: ClassPeriod) => {
    setClassPeriod(class_period);

    modalRef.current?.openModal();
  }, []);

  useImperativeHandle(ref, () => ({ openModal }));

  return (
    <Modal
      title={classPeriod ? 'Alterar período' : 'Adicionar período'}
      ref={modalRef}
    >
      <S.Wrapper>
        <Form onSubmit={handleSubmit} initialData={classPeriod} ref={formRef}>
          <S.FieldsContainer>
            <Select
              name="description"
              label="Período"
              options={[
                { label: 'Matutino', value: 'MORNING' },
                { label: 'Vespertino', value: 'EVENING' },
                { label: 'Noturno', value: 'NOCTURNAL' }
              ]}
              disabled={!!classPeriod}
            />
            <TextInput
              name="class_time"
              label="Duração das aulas"
              mask="time"
            />
            <TextInput
              name="time_start"
              label="Horário de início"
              mask="time"
            />
            <TextInput name="time_end" label="Horário de término" mask="time" />

            <TextInput
              name="break_time"
              label="Duração do intervalo"
              mask="time"
            />
            <TextInput
              name="break_time_start"
              label="Horário do intervalo"
              mask="time"
            />
          </S.FieldsContainer>
          <S.ButtonContainer>
            <Button styleType="rounded" size="medium">
              Salvar
            </Button>
          </S.ButtonContainer>
        </Form>
      </S.Wrapper>
    </Modal>
  );
};

export default forwardRef(CreateClassPeriodsModal);
