import {
  useRef,
  useImperativeHandle,
  forwardRef,
  useMemo,
  useCallback,
  useState
} from 'react';
import { useSession } from 'next-auth/client';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';

import Modal, { ModalRef } from 'components/Modal';
import Select from 'components/Select';
import Button from 'components/Button';

import { Employee } from 'models/Employee';

import { useListEmployees } from 'requests/queries/employee';
import {
  useCreateUserProfile,
  useDeleteUserProfile
} from 'requests/mutations/user-profile';

import * as S from './styles';

export type MunicipalSecretaryEmployeeModalRef = {
  openModal: (current?: Employee) => void;
};

type MunicipalSecretaryEmployeeModalProps = {
  branchId: string;
  refetchFn?: () => void;
};

type FormData = { user_id: string };

const MunicipalSecretaryEmployeeModal: React.ForwardRefRenderFunction<
  MunicipalSecretaryEmployeeModalRef,
  MunicipalSecretaryEmployeeModalProps
> = ({ branchId, refetchFn }, ref) => {
  const [currentEmployee, setCurrentEmployee] = useState<Employee>();

  const modalRef = useRef<ModalRef>(null);
  const formRef = useRef<FormHandles>(null);

  const [session] = useSession();
  const { data: employees, isLoading } = useListEmployees(session);

  const createUserProfile = useCreateUserProfile();
  const deleteUserProfile = useDeleteUserProfile({ showToasts: false });

  const openModal = (current?: Employee) => {
    setCurrentEmployee(current);
    modalRef.current?.openModal();
  };

  const handleBack = () => {
    setCurrentEmployee(undefined);
    modalRef.current?.closeModal();
  };

  useImperativeHandle(ref, () => ({ openModal }));

  const handleSubmit = useCallback(
    async ({ user_id }: FormData) => {
      formRef.current?.setErrors({});
      if (!user_id) {
        formRef.current?.setErrors({ user_id: 'Campo Obrigatório.' });
        return;
      }

      if (currentEmployee) {
        const confirm = await window.confirm(
          `Deseja alterar o secretário municipal de educação?`
        );
        if (!confirm) {
          handleBack();
          return;
        }

        await deleteUserProfile.mutateAsync({
          user_id: currentEmployee.user_id,
          branch_id: branchId,
          accessCode: 'municipal-secretary'
        });
      }

      createUserProfile
        .mutateAsync({
          user_id,
          branch_id: branchId,
          accessCode: 'municipal-secretary'
        })
        .then(() => refetchFn && refetchFn());

      handleBack();
    },
    [branchId, refetchFn, createUserProfile, deleteUserProfile, currentEmployee]
  );

  const employeesOptions = useMemo(() => {
    if (isLoading) return [{ label: 'Carregando...', value: '' }];
    if (!employees) return [];

    return employees.map(({ user_id, person }) => ({
      value: user_id,
      label: person.name
    }));
  }, [employees, isLoading]);

  return (
    <Modal
      title={
        currentEmployee
          ? 'Alterar Secretário Municipal'
          : 'Definir Secretário Municipal'
      }
      closeOnClickOutside={false}
      ref={modalRef}
    >
      <S.Wrapper>
        <Form
          onSubmit={handleSubmit}
          ref={formRef}
          initialData={{ user_id: currentEmployee?.user_id }}
        >
          <Select label="Servidor" name="user_id" options={employeesOptions} />
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

export default forwardRef(MunicipalSecretaryEmployeeModal);
