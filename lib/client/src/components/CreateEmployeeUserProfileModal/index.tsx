import {
  useState,
  useRef,
  useImperativeHandle,
  forwardRef,
  useMemo,
  useCallback
} from 'react';
import { useQueryClient } from 'react-query';
import { FormHandles } from '@unform/core';
import { ValidationError } from 'yup';

import Modal, { ModalRef } from 'components/Modal';
import Select from 'components/Select';
import Button from 'components/Button';

import { Employee } from 'models/Employee';

import { useListAccessLevels } from 'requests/queries/access-levels';
import { useListBranchs } from 'requests/queries/branch';
import { useCreateUserProfile } from 'requests/mutations/user-profile';

import { userProfileSchema } from './rules/schema';

import * as S from './styles';

type UserProfileFormData = {
  access_level_id: string;
  branch_id: string;
};

export type CreateEmployeeUserProfileModalRef = {
  openModal: (employee: Employee) => void;
};

const CreateEmployeeUserProfileModal: React.ForwardRefRenderFunction<
  CreateEmployeeUserProfileModalRef
> = (_, ref) => {
  const [employee, setEmployee] = useState<Employee>();

  const modalRef = useRef<ModalRef>(null);
  const formRef = useRef<FormHandles>(null);

  const queryClient = useQueryClient();

  const { data: accessLevels, isLoading: loadingAccess } =
    useListAccessLevels();
  const { data: branchs, isLoading: loadingBranchs } = useListBranchs();

  const createUserProfile = useCreateUserProfile();

  const handleBack = useCallback(() => {
    setEmployee(undefined);
    modalRef.current?.closeModal();
  }, []);

  const handleSubmit = useCallback(
    async (values: UserProfileFormData) => {
      if (!employee) return;

      try {
        formRef.current?.setErrors({});

        await userProfileSchema.validate(values, { abortEarly: false });
        createUserProfile
          .mutateAsync({
            user_id: employee.user_id,
            branch_id: values.branch_id,
            access_level_id: values.access_level_id
          })
          .then(() => {
            queryClient.invalidateQueries(
              `list-profiles-${JSON.stringify({ user_id: employee.user_id })}`
            );
          });

        handleBack();
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
    [createUserProfile, employee, handleBack, queryClient]
  );

  const openModal = (employee: Employee) => {
    setEmployee(employee);
    modalRef.current?.openModal();
  };

  useImperativeHandle(ref, () => ({ openModal }));

  const accessLevelsOptions = useMemo(() => {
    if (loadingAccess) return [{ label: 'Carregando...', value: '' }];
    if (!accessLevels) return [];

    return accessLevels
      .filter(({ code }) => code !== 'administrator')
      .map(({ description, id }) => ({
        value: id,
        label: description
      }));
  }, [loadingAccess, accessLevels]);

  const branchsOptions = useMemo(() => {
    if (loadingBranchs) return [{ label: 'Carregando...', value: '' }];
    if (!branchs) return [];

    return branchs.map(({ description, id }) => ({
      value: id,
      label: description
    }));
  }, [loadingBranchs, branchs]);

  return (
    <Modal title="Adicionar perfil" closeOnClickOutside={false} ref={modalRef}>
      <S.Wrapper>
        <S.Form onSubmit={handleSubmit} ref={formRef}>
          <Select
            label="Perfil"
            name="access_level_id"
            options={accessLevelsOptions}
          />
          <Select
            label="Unidade"
            name="branch_id"
            emptyOption
            options={branchsOptions}
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

export default forwardRef(CreateEmployeeUserProfileModal);
