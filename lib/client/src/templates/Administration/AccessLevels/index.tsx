import { useRef } from 'react';
import { useSession } from 'next-auth/client';
import { X, PlusCircle } from '@styled-icons/feather';

import Base from 'templates/Base';

import Heading from 'components/Heading';
import Button from 'components/Button';
import Table from 'components/Table';
import TableColumn from 'components/TableColumn';
import AccessModuleTable, {
  AccessModuleChange
} from 'components/AccessModuleTable';
import AddAccessLevelModal, {
  AccessLevelModalRef
} from 'components/AddAccessLevelModal';
import CreateAccessModule, {
  CreateAccessModuleRef
} from 'components/CreateAccessModule';

import { AccessLevel } from 'models/AccessLevel';

import { useListAccessLevels } from 'requests/queries/access-levels';
import { useDeleteAccessLevelMutation } from 'requests/mutations/access-levels';
import { useMutateAccessModules } from 'requests/mutations/access-module';

import * as S from './styles';

type AccessModuleRef = Record<
  string,
  {
    read: boolean;
    write: boolean;
  }
>;

type LevelAccessModulesRef = Record<string, AccessModuleRef>;

type AccessModuleRequestData = {
  access_level_id: string;
  module_id: string;
  read: boolean;
  write: boolean;
};

const AccessLevels = () => {
  const accessModulesRef = useRef<LevelAccessModulesRef>({});
  const accessModuleModalRef = useRef<CreateAccessModuleRef>(null);
  const addAccessLevelModal = useRef<AccessLevelModalRef>(null);

  const [session] = useSession();

  const { data: accessLevels, refetch } = useListAccessLevels(session);

  const mutateAccessModules = useMutateAccessModules();
  const mutation = useDeleteAccessLevelMutation(session);

  const handleDelete = async (
    event: React.MouseEvent,
    accessLevel: AccessLevel
  ) => {
    event.stopPropagation();

    const confirmation = window.confirm(
      `Deseja excluir o nível de acesso ${accessLevel.description}`
    );
    if (confirmation) {
      await mutation.mutateAsync(accessLevel);
      refetch();
    }
  };

  const handleSubmit = (values: LevelAccessModulesRef) => {
    const requestData = Object.entries(values).reduce<
      AccessModuleRequestData[]
    >((acc, item) => {
      const [access_level_id, modulesValue] = item;
      const withModules = Object.entries(modulesValue).map(([key, value]) => ({
        access_level_id,
        module_id: key,
        read: value.read,
        write: value.write
      }));

      return [...acc, ...withModules];
    }, []);

    mutateAccessModules.mutate(requestData);
  };

  const handleChange = (
    accessLevelId: string,
    values: AccessModuleChange[]
  ) => {
    const currentAccessModules = { ...accessModulesRef.current };
    const currentItem = currentAccessModules[accessLevelId] || {};

    const newItems = values.reduce<AccessModuleRef>((acc, item) => {
      const { module_id, read, write } = item;
      const existentItem = acc[module_id] || currentItem[module_id] || {};

      return { ...acc, [module_id]: { ...existentItem, read, write } };
    }, {});

    accessModulesRef.current = {
      ...currentAccessModules,
      [accessLevelId]: { ...currentItem, ...newItems }
    };

    handleSubmit(accessModulesRef.current);
  };

  return (
    <Base>
      <Heading>Níveis de Acesso</Heading>
      <S.AddButtonContainer>
        <Button
          styleType="normal"
          size="medium"
          icon={<PlusCircle />}
          onClick={() => addAccessLevelModal.current?.openModal()}
          module="ACCESS_LEVEL"
          rule="WRITE"
        >
          Adicionar nível de acesso
        </Button>
      </S.AddButtonContainer>

      <S.TableSection>
        <S.SectionTitle>
          <h4>Níveis de Acesso</h4>
        </S.SectionTitle>
        <Table<AccessLevel>
          items={accessLevels || []}
          keyExtractor={(value) => value.id}
        >
          <TableColumn label="Nível de acesso" tableKey="description">
            {(accessLevel: AccessLevel) => (
              <AccessModuleTable
                accessLevel={accessLevel}
                onChangeModule={(values) =>
                  handleChange(accessLevel.id, values)
                }
              />
            )}
          </TableColumn>
          <TableColumn
            label="Ações"
            tableKey=""
            actionColumn
            contentAlign="center"
            module="ACCESS_LEVEL"
            rule="WRITE"
            render={(accessLevel: AccessLevel) => (
              <S.ActionButtons
                onClick={() =>
                  accessModuleModalRef.current?.openModal(accessLevel)
                }
              >
                <S.ActionButton color="primary">
                  <PlusCircle />
                </S.ActionButton>

                <S.ActionButton
                  color="red"
                  onClick={(event) => handleDelete(event, accessLevel)}
                  title={`Apagar nível de acesso ${accessLevel.description}`}
                >
                  <X
                    title={`Apagar nível de acesso ${accessLevel.description}`}
                  />
                </S.ActionButton>
              </S.ActionButtons>
            )}
          />
        </Table>
      </S.TableSection>
      <AddAccessLevelModal ref={addAccessLevelModal} refetchFn={refetch} />
      <CreateAccessModule ref={accessModuleModalRef} />
    </Base>
  );
};

export default AccessLevels;
