import {
  useImperativeHandle,
  useRef,
  forwardRef,
  useMemo,
  useState
} from 'react';
import { useSession } from 'next-auth/client';
import { FormHandles } from '@unform/core';
import { ValidationError } from 'yup';

import Modal, { ModalRef } from 'components/Modal';
import Select from 'components/Select';
import Button from 'components/Button';

import { School, CompleteSchool } from 'models/School';

import { useListEmployees } from 'requests/queries/employee';
import { useUpdateSchool } from 'requests/mutations/schools';

import { schoolDirectorySchema } from './rules/schema';

import * as S from './styles';

export type SchoolDirectoryModalRef = {
  openModal: () => void;
};

type SchoolDirectoryModalProps = {
  school: School | CompleteSchool;
  refetchFn?: () => void;
};

type SchoolDirectoryFormData = {
  director_id: string;
  vice_director_id: string;
};

const SchoolDirectoryModal: React.ForwardRefRenderFunction<
  SchoolDirectoryModalRef,
  SchoolDirectoryModalProps
> = ({ school, refetchFn }, ref) => {
  const [director, setDirector] = useState<string>();
  const [viceDirector, setViceDirector] = useState<string>();

  const modalRef = useRef<ModalRef>(null);
  const formRef = useRef<FormHandles>(null);

  const handleBack = () => {
    setDirector(undefined);
    setViceDirector(undefined);
    modalRef.current?.closeModal();
  };

  const [session] = useSession();
  const { data: employees, isLoading } = useListEmployees(session);
  const updateSchool = useUpdateSchool(school, handleBack);

  const handleSubmit = async (values: SchoolDirectoryFormData) => {
    try {
      formRef.current?.setErrors({});

      await schoolDirectorySchema.validate(values, { abortEarly: false });
      await updateSchool.mutateAsync({ school_id: school.id, ...values });
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
  };

  const openModal = () => {
    setDirector(school.director_id);
    setViceDirector(school.vice_director_id);
    modalRef.current?.openModal();
  };
  useImperativeHandle(ref, () => ({ openModal }));

  const employeesOptions = useMemo(() => {
    if (isLoading) return [{ label: 'Carregando...', value: '' }];
    if (!employees) return [];

    return employees.map(({ id, person }) => ({
      value: id,
      label: person.name
    }));
  }, [isLoading, employees]);

  const directorOptions = useMemo(
    () => employeesOptions.filter(({ value }) => value !== viceDirector),
    [viceDirector, employeesOptions]
  );

  const viceDirectorOptions = useMemo(
    () => employeesOptions.filter(({ value }) => value !== director),
    [director, employeesOptions]
  );

  return (
    <Modal title="Alterar diretoria" closeOnClickOutside={false} ref={modalRef}>
      <S.Wrapper>
        <S.Form onSubmit={handleSubmit} ref={formRef}>
          <Select
            label="Diretor"
            name="director_id"
            options={directorOptions}
            selectedOption={director}
            onChange={(value) => setDirector(value)}
          />
          <Select
            label="Vice-diretor"
            name="vice_director_id"
            options={viceDirectorOptions}
            selectedOption={viceDirector}
            onChange={(value) => setViceDirector(value)}
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

export default forwardRef(SchoolDirectoryModal);
