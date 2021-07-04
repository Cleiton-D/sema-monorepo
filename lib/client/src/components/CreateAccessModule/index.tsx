import {
  useCallback,
  useRef,
  useImperativeHandle,
  forwardRef,
  useState,
  useMemo
} from 'react';
import { useSession } from 'next-auth/client';

import Modal, { ModalRef } from 'components/Modal';
import Button from 'components/Button';
import Checkbox from 'components/Checkbox';
import Select from 'components/Select';

import { AccessLevel } from 'models/AccessLevel';

import { useListAppModules } from 'requests/queries/app-modules';
import { useMutateAccessModules } from 'requests/mutations/access-module';

import * as S from './styles';

export type CreateAccessModuleRef = {
  openModal: (accessLevel: AccessLevel) => void;
};

type AccessModuleDataRef = {
  module_id: string;
  read: boolean;
  write: boolean;
};

const CreateAccessModule: React.ForwardRefRenderFunction<CreateAccessModuleRef> = (
  _,
  ref
) => {
  const [accessLevel, setAccessLevel] = useState<AccessLevel>();

  const modalRef = useRef<ModalRef>(null);
  const formDataRef = useRef<AccessModuleDataRef>({
    module_id: '',
    read: false,
    write: false
  });

  const [session] = useSession();
  const { data: appModules, isLoading } = useListAppModules(session);
  const mutateAccessModules = useMutateAccessModules(accessLevel);

  const appModulesOptions = useMemo(() => {
    if (isLoading) return [{ label: 'Carregando...', value: '' }];
    if (!appModules) return [];

    return appModules.map(({ id, description }) => ({
      label: description,
      value: id
    }));
  }, [appModules, isLoading]);

  const handleChange = (
    value: boolean | string,
    type: 'module_id' | 'read' | 'write'
  ) => {
    formDataRef.current = { ...formDataRef.current, [type]: value };
  };

  const handleSubmit = () => {
    const { module_id, read, write } = formDataRef.current;

    const module = appModules?.find(({ id }) => id === module_id);

    const requestData = [
      {
        access_level_id: accessLevel?.id,
        module_id,
        module_name: module?.description,
        read,
        write
      }
    ];

    mutateAccessModules.mutate(requestData);
    handleBack();
  };

  const handleBack = useCallback(() => {
    formDataRef.current = {
      module_id: '',
      read: false,
      write: false
    };
    modalRef.current?.closeModal();
  }, []);

  const openModal = useCallback((data: AccessLevel) => {
    setAccessLevel(data);
    modalRef.current?.openModal();
  }, []);

  useImperativeHandle(ref, () => ({ openModal }));

  return (
    <Modal title="Adicionar módulo" closeOnClickOutside={false} ref={modalRef}>
      <S.Wrapper>
        <S.Form onSubmit={() => handleSubmit()}>
          <Select
            name="module_id"
            label="Módulo"
            options={appModulesOptions}
            onChange={(value) => handleChange(value, 'module_id')}
          />
          <S.CheckboxContainer>
            <Checkbox
              label="Leitura"
              labelFor="read"
              onCheck={(value) => handleChange(value, 'read')}
            />
            <Checkbox
              label="Escrita"
              labelFor="write"
              onCheck={(value) => handleChange(value, 'write')}
            />
          </S.CheckboxContainer>

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

export default forwardRef(CreateAccessModule);
