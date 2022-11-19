import {
  useState,
  useCallback,
  useRef,
  useImperativeHandle,
  useMemo,
  forwardRef
} from 'react';
import { FormHandles } from '@unform/core';
import { useQueryClient } from 'react-query';
import { ValidationError } from 'yup';

import Modal, { ModalRef } from 'components/Modal';
import Button from 'components/Button';
import DatePicker from 'components/Datepicker';

import { SchoolTermPeriod } from 'models/SchoolTermPeriod';

import { useUpdateSchoolTermPeriod } from 'requests/mutations/school-term-periods';

import { shortTranslateSchoolTerm } from 'utils/mappers/schoolTermPeriodMapper';
import { parseDateWithoutTimezone } from 'utils/parseDateWithoutTimezone';

import { schoolTermSchema } from './rules/schema';

import * as S from './styles';

export type ChangeSchoolTermModalRef = {
  openModal: (schoolTermPeriod: SchoolTermPeriod) => void;
};

type ChangeSchoolTermFormData = {
  date_start: Date;
  date_end: Date;
};

const ChangeSchoolTerm: React.ForwardRefRenderFunction<
  ChangeSchoolTermModalRef
> = (_, ref) => {
  const [schoolTerm, setSchoolTerm] = useState<SchoolTermPeriod>();
  const [start, setStart] = useState<Date>();
  const [end, setEnd] = useState<Date>();

  const modalRef = useRef<ModalRef>(null);
  const formRef = useRef<FormHandles>(null);

  const updateSchoolTermPeriod = useUpdateSchoolTermPeriod();
  const queryClient = useQueryClient();

  const openModal = useCallback((item: SchoolTermPeriod) => {
    setSchoolTerm(item);
    const parsedDateStart = item?.date_start
      ? parseDateWithoutTimezone(item.date_start)
      : undefined;

    const parsedDateEnd = item?.date_end
      ? parseDateWithoutTimezone(item.date_end)
      : undefined;

    setStart(parsedDateStart);
    setEnd(parsedDateEnd);

    modalRef.current?.openModal();
  }, []);

  const handleBack = useCallback(() => {
    setSchoolTerm(undefined);
    setStart(undefined);
    setEnd(undefined);

    modalRef.current?.closeModal();
  }, []);

  const handleSave = useCallback(
    async (values: ChangeSchoolTermFormData) => {
      try {
        await schoolTermSchema.validate(values, { abortEarly: false });

        await updateSchoolTermPeriod.mutateAsync({
          ...values,
          id: schoolTerm?.id
        });

        queryClient.invalidateQueries(['show-school-year']);
        handleBack();
      } catch (err) {
        if (err instanceof ValidationError) {
          const validationErrors: Record<string, string> = {};

          err.inner.forEach((error) => {
            console.log(error.path);
            if (error.path) {
              validationErrors[error.path] = error.message;
            }
          });

          formRef.current?.setErrors(validationErrors);
        }

        throw err;
      }
    },
    [handleBack, queryClient, schoolTerm?.id, updateSchoolTermPeriod]
  );

  useImperativeHandle(ref, () => ({ openModal }));

  const description = useMemo(() => {
    if (!schoolTerm?.school_term) return '';

    return shortTranslateSchoolTerm(schoolTerm.school_term);
  }, [schoolTerm]);

  const dateStart = useMemo(() => {
    if (!schoolTerm?.date_start) return undefined;

    return parseDateWithoutTimezone(schoolTerm.date_start);
  }, [schoolTerm]);

  const dateEnd = useMemo(() => {
    if (!schoolTerm?.date_end) return undefined;

    return parseDateWithoutTimezone(schoolTerm.date_end);
  }, [schoolTerm]);

  return (
    <Modal title={`Alterar ${description}`} ref={modalRef}>
      <S.Wrapper>
        <S.Form onSubmit={handleSave} ref={formRef}>
          <S.FieldsContainer>
            <DatePicker
              name="date_start"
              label="Data de Início"
              month={dateStart}
              initialMonth={dateStart}
              value={start}
            />
            <DatePicker
              name="date_end"
              label="Data de Término"
              month={dateEnd}
              initialMonth={dateEnd}
              value={end}
            />
          </S.FieldsContainer>

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

export default forwardRef(ChangeSchoolTerm);
