import { useMemo, useRef } from 'react';
import { useSession } from 'next-auth/client';
import { X } from '@styled-icons/feather';
import debounce from 'lodash.debounce';

import Table from 'components/Table';
import TableColumn from 'components/TableColumn';
import Checkbox from 'components/Checkbox';

import { AccessLevel } from 'models/AccessLevel';
import { AccessModule } from 'models/AccessModule';

import { useListAccessModules } from 'requests/queries/access-modules';
import { useDeleteAccessModule } from 'requests/mutations/access-module';

import * as S from './styles';
import { useAccess } from 'hooks/AccessProvider';

export type AccessModuleChange = {
  module_id: string;
  read: boolean;
  write: boolean;
};

type AccessModuleRef = Record<
  string,
  {
    read: boolean;
    write: boolean;
  }
>;

type AccessModuleTableProps = {
  accessLevel: AccessLevel;
  onChangeModule: (module: AccessModuleChange[]) => void;
};

const AccessModuleTable = ({
  accessLevel,
  onChangeModule
}: AccessModuleTableProps) => {
  const accessModuleRef = useRef<AccessModuleRef>({});

  const { enableAccess } = useAccess();

  const [session] = useSession();
  const { data: accessModules, refetch } = useListAccessModules(session, {
    access_level_id: accessLevel.id
  });

  const deleteAccessModule = useDeleteAccessModule();

  const debouncedOnChange = useMemo(() => debounce(onChangeModule, 800), [
    onChangeModule
  ]);

  const handleChange = (
    accessModule: AccessModule,
    value: boolean,
    type: 'read' | 'write'
  ) => {
    const currentItems = { ...accessModuleRef.current };
    const currentItem = currentItems[accessModule.app_module_id];

    const storedItem = { read: accessModule.read, write: accessModule.write };
    const newItem = currentItem
      ? { ...currentItem, [type]: value }
      : { ...storedItem, [type]: value };

    accessModuleRef.current = {
      ...currentItems,
      [accessModule.app_module_id]: newItem
    };

    const values = Object.entries(
      accessModuleRef.current
    ).map(([key, value]) => ({ module_id: key, ...value }));

    debouncedOnChange(values);
  };

  const handleDelete = async (accessModule: AccessModule) => {
    const confirm = window.confirm(
      `Deseja remover o acesso ao módulo ${accessModule.app_module.description} do nível ${accessLevel.description}`
    );
    if (confirm) {
      await deleteAccessModule.mutateAsync(accessModule);
      refetch();
    }
  };

  return (
    <Table<AccessModule>
      items={accessModules || []}
      keyExtractor={(value) => value.id}
      minimal
    >
      <TableColumn label="Módulo" tableKey="app_module.description" />
      <TableColumn
        label="Leitura"
        tableKey="read"
        contentAlign="center"
        actionColumn
        render={(accessModule: AccessModule) => (
          <Checkbox
            isChecked={accessModule.read}
            disabled={!enableAccess({ module: 'ACCESS_LEVEL', rule: 'WRITE' })}
            onCheck={(value) => handleChange(accessModule, value, 'read')}
          />
        )}
      />
      <TableColumn
        label="Escrita"
        tableKey="write"
        contentAlign="center"
        actionColumn
        render={(accessModule: AccessModule) => (
          <Checkbox
            isChecked={accessModule.write}
            disabled={!enableAccess({ module: 'ACCESS_LEVEL', rule: 'WRITE' })}
            onCheck={(value) => handleChange(accessModule, value, 'write')}
          />
        )}
      />
      <TableColumn
        label="Ações"
        tableKey=""
        module="ACCESS_LEVEL"
        rule="WRITE"
        actionColumn
        render={(accessModule: AccessModule) => (
          <S.ActionButton onClick={() => handleDelete(accessModule)}>
            <X size={16} />
          </S.ActionButton>
        )}
      />
    </Table>
  );
};

export default AccessModuleTable;
