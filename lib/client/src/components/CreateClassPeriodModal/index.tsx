import {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useRef,
  useState
} from 'react';
import { useSession } from 'next-auth/react';
import { useQueryClient } from 'react-query';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import { ValidationError } from 'yup';

import Modal, { ModalRef } from 'components/Modal';
import TextInput from 'components/TextInput';
import Select from 'components/Select';
import Button from 'components/Button';
import Checkbox from 'components/Checkbox';

import { ClassPeriod, ClassPeriodForm } from 'models/ClassPeriod';

import { useMutateClassPeriod } from 'requests/mutations/class-period';
import { classPeriodsKeys } from 'requests/queries/class-periods';

import { createClassPeriodSchema } from './rules/schema';

import * as S from './styles';

export type ClassPeriodModalRef = {
  openModal: (class_period?: ClassPeriod) => void;
};

const DEFAULT_CLASS_PERIODS = ['Matutino', 'Vespertino', 'Noturno'];

const DEFAULT_CLASS_PERIODS_OPTIONS = [
  { label: 'Matutino', value: 'Matutino' },
  { label: 'Vespertino', value: 'Vespertino' },
  { label: 'Noturno', value: 'Noturno' }
];

const CLASS_PERIODS_OPTIONS = [
  ...DEFAULT_CLASS_PERIODS_OPTIONS,
  { label: 'Outro', value: 'OTHER' }
];

const CreateClassPeriodsModal: React.ForwardRefRenderFunction<
  ClassPeriodModalRef
> = (_, ref) => {
  const [type, setType] = useState<string>();
  const [hasBreakTime, setHasBreakTime] = useState<boolean>(true);

  const [classPeriod, setClassPeriod] = useState<ClassPeriodForm>();
  const modalRef = useRef<ModalRef>(null);
  const formRef = useRef<FormHandles>(null);

  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const mutation = useMutateClassPeriod(modalRef);

  const handleSubmit = useCallback(
    async (values: ClassPeriodForm) => {
      try {
        formRef.current?.setErrors({});

        const classPeriodSchema = createClassPeriodSchema(hasBreakTime);
        await classPeriodSchema.validate(values, { abortEarly: false });

        const {
          description,
          custom_description,
          class_time,
          time_start,
          time_end,
          break_time,
          break_time_start
        } = values;

        const key = (
          description !== 'OTHER' ? description : custom_description
        ) as string;

        const requestData = {
          [key]: {
            class_time,
            time_start,
            time_end,
            break_time,
            break_time_start
          }
        };

        await mutation.mutateAsync({
          school_year_id: session?.configs.school_year_id,
          class_periods: requestData
        });
        queryClient.invalidateQueries(...classPeriodsKeys.all);
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
    [hasBreakTime, mutation, queryClient, session]
  );

  const openModal = useCallback((class_period?: ClassPeriod) => {
    if (class_period) {
      const data: Partial<ClassPeriodForm> = {
        class_time: class_period.class_time,
        time_start: class_period.time_start,
        time_end: class_period.time_end,
        break_time: class_period.break_time,
        break_time_start: class_period.break_time_start
      };

      const isDefault = DEFAULT_CLASS_PERIODS.includes(
        class_period.description
      );
      const withBreaskTime =
        !!class_period.break_time && !!class_period.break_time_start;

      if (isDefault) {
        data.description = class_period.description;
      } else {
        data.description = 'OTHER';
        data.custom_description = class_period.description;
      }

      setClassPeriod(data as ClassPeriodForm);
      setHasBreakTime(withBreaskTime);
      setType(data.description);
    } else {
      setClassPeriod(undefined);
      setHasBreakTime(true);
      setType(undefined);
    }

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
              options={CLASS_PERIODS_OPTIONS}
              selectedOption={type}
              onChange={setType}
              disabled={!!classPeriod}
            />
            {type === 'OTHER' && (
              <div
                style={{
                  gridColumnStart: 1,
                  gridColumnEnd: 3
                }}
              >
                <TextInput
                  name="custom_description"
                  label="Nome do período"
                  disabled={!!classPeriod}
                />
              </div>
            )}

            <S.Divider />
            <Checkbox
              label="Tem intervalo?"
              labelFor="has_breaktime"
              isChecked={hasBreakTime}
              onCheck={setHasBreakTime}
            />
            <S.Divider />

            <TextInput
              name="class_time"
              label="Duração da hora-aula"
              mask="time"
            />
            <TextInput
              name="time_start"
              label="Horário de início"
              mask="time"
            />
            <TextInput name="time_end" label="Horário de término" mask="time" />

            {hasBreakTime && (
              <>
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
              </>
            )}
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
