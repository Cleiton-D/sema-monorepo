import {
  useRef,
  useImperativeHandle,
  forwardRef,
  useMemo,
  useCallback
} from 'react';
import { useSession } from 'next-auth/client';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';

import Modal, { ModalRef } from 'components/Modal';
import Select from 'components/Select';
import Button from 'components/Button';

import { Employee } from 'models/Employee';

import { useListEmployees } from 'requests/queries/employee';

import * as S from './styles';

export type AddEmployeeToProfileModalRef = {
  openModal: () => void;
};

type AddEmployeeToProfileModalProps = {
  title: string;
  onSubmit: (employee: Employee) => void;
};

type FormData = { employee: Employee };

const AddEmployeeToProfileModal: React.ForwardRefRenderFunction<
  AddEmployeeToProfileModalRef,
  AddEmployeeToProfileModalProps
> = ({ title, onSubmit }, ref) => {
  const modalRef = useRef<ModalRef>(null);
  const formRef = useRef<FormHandles>(null);

  const [session] = useSession();
  const { data: employees, isLoading } = useListEmployees(session);

  const openModal = () => {
    modalRef.current?.openModal();
  };

  const handleBack = () => {
    modalRef.current?.closeModal();
  };

  useImperativeHandle(ref, () => ({ openModal }));

  const handleSubmit = useCallback(
    ({ employee }: FormData) => {
      formRef.current?.setErrors({});
      if (!employee) {
        formRef.current?.setErrors({ user_id: 'Campo Obrigatório.' });
        return;
      }
      onSubmit(employee);

      handleBack();
    },
    [onSubmit]
  );

  const employeesOptions = useMemo(() => {
    if (isLoading) return [{ label: 'Carregando...', value: '' }];
    if (!employees) return [];

    return employees.map((employee) => ({
      value: employee,
      label: employee.person.name
    }));
  }, [employees, isLoading]);

  return (
    <Modal title={title} closeOnClickOutside={false} ref={modalRef}>
      <S.Wrapper>
        <Form onSubmit={handleSubmit} ref={formRef}>
          <Select label="Servidor" name="employee" options={employeesOptions} />
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
        </Form>
      </S.Wrapper>
    </Modal>
  );
};

export default forwardRef(AddEmployeeToProfileModal);
