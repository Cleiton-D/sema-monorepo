import {
  useState,
  useRef,
  useImperativeHandle,
  forwardRef,
  useMemo,
  useCallback
} from 'react';
import { useSession } from 'next-auth/client';

import Modal, { ModalRef } from 'components/Modal';
import Select from 'components/Select';
import Button from 'components/Button';

import { User } from 'models/User';

import { useListAccessLevels } from 'requests/queries/access-levels';
import { useListBranchs } from 'requests/queries/branch';
import { useCreateUserProfile } from 'requests/mutations/user-profile';

import * as S from './styles';
import { FormHandles } from '@unform/core';
import { ValidationError } from 'yup';
import { userProfileSchema } from './rules/schema';

type UserProfileFormData = {
  access_level_id: string;
  branch_id: string;
};

export type CreateUserProfileModalRef = {
  openModal: (user: User) => void;
};

const CreateUserProfileModal: React.ForwardRefRenderFunction<CreateUserProfileModalRef> = (
  _,
  ref
) => {
  const [user, setUser] = useState<User>();

  const modalRef = useRef<ModalRef>(null);
  const formRef = useRef<FormHandles>(null);

  const [session] = useSession();
  const { data: accessLevels, isLoading: loadingAccess } = useListAccessLevels(
    session
  );
  const { data: branchs, isLoading: loadingBranchs } = useListBranchs(session);

  const createUserProfile = useCreateUserProfile();

  const handleBack = useCallback(() => {
    setUser(undefined);
    modalRef.current?.closeModal();
  }, []);

  const handleSubmit = useCallback(
    async (values: UserProfileFormData) => {
      if (!user) return;

      try {
        formRef.current?.setErrors({});

        await userProfileSchema.validate(values, { abortEarly: false });
        createUserProfile.mutate({
          user_id: user.id,
          branch_id: values.branch_id,
          access_level_id: values.access_level_id
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
    [createUserProfile, user, handleBack]
  );

  const openModal = (user: User) => {
    setUser(user);
    modalRef.current?.openModal();
  };

  useImperativeHandle(ref, () => ({ openModal }));

  const accessLevelsOptions = useMemo(() => {
    if (loadingAccess) return [{ label: 'Carregando...', value: '' }];
    if (!accessLevels) return [];

    return accessLevels.map(({ description, id }) => ({
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
          <Select label="Unidade" name="branch_id" options={branchsOptions} />

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

export default forwardRef(CreateUserProfileModal);
