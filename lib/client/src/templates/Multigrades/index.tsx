import { useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { useQueryClient } from 'react-query';
import { PlusCircle, X, Edit } from '@styled-icons/feather';

import Base from 'templates/Base';

import Heading from 'components/Heading';
import Button from 'components/Button';
import Table from 'components/Table';
import TableColumn from 'components/TableColumn';
import ClassroomsSearch from 'components/ClassroomsSearch';

import { useAccess } from 'hooks/AccessProvider';

import { Multigrade } from 'models/Multigrade';

import {
  ListMultigradesFilters,
  multigradesKeys,
  useListMultigrades
} from 'requests/queries/multigrades';
import { useDeleteMultigrade } from 'requests/mutations/multigrades';

import { translateDescription } from 'utils/mappers/classPeriodMapper';

import * as S from './styles';
import MultigradeClassroomsTable from 'components/MultigradeClassroomsTable';

const MultigradesTemplate = () => {
  const [filters, setFilters] = useState<ListMultigradesFilters>({});

  const { enableAccess } = useAccess();

  const { query, push } = useRouter();
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  const deleteMultigrade = useDeleteMultigrade();

  const handleNewMultigrade = () => {
    push(`/auth/school/${query.school_id}/multigrades/new`);
  };

  const handleDeleteMultigrade = async (multigrade: Multigrade) => {
    const confirmation = window.confirm(
      `Deseja remover o seriado ${multigrade.description}?`
    );
    if (!confirmation) return;

    await deleteMultigrade.mutateAsync(multigrade);
    queryClient.invalidateQueries(multigradesKeys.lists());
  };

  const schoolId = useMemo(() => {
    if (query.school_id === 'me') {
      return session?.schoolId;
    }
    return query.school_id as string;
  }, [query, session]);

  const multigradesFilters = useMemo(() => {
    return {
      school_id: schoolId,
      ...filters
    };
  }, [filters, schoolId]);

  const { data: multigrades } = useListMultigrades(session, multigradesFilters);

  const canChangeClassroom = useMemo(
    () => enableAccess({ module: 'CLASSROOM', rule: 'WRITE' }),
    [enableAccess]
  );

  return (
    <Base>
      <Heading>Seriados</Heading>
      {canChangeClassroom && schoolId && (
        <S.AddButtonContainer>
          <Button
            styleType="normal"
            size="medium"
            icon={<PlusCircle />}
            onClick={handleNewMultigrade}
          >
            Adicionar seriado
          </Button>
        </S.AddButtonContainer>
      )}

      <ClassroomsSearch handleSearch={setFilters} />

      <S.TableSection>
        <S.SectionTitle>
          <h4>Seriados</h4>
        </S.SectionTitle>
        <Table<Multigrade>
          items={multigrades || []}
          keyExtractor={(item) => item.id}
        >
          <TableColumn label="Descrição" tableKey="description">
            {(multigrade: Multigrade) => (
              <MultigradeClassroomsTable multigradeId={multigrade.id} />
            )}
          </TableColumn>

          {!session?.schoolId && (
            <TableColumn label="Escola" tableKey="school.name" />
          )}

          <TableColumn
            label="Período"
            tableKey="class_period.description"
            render={(class_period) => translateDescription(class_period)}
          />

          <TableColumn
            label="Matriculas ativas"
            tableKey="enroll_count"
            contentAlign="center"
          />

          <TableColumn
            label="Ações"
            tableKey=""
            contentAlign="center"
            actionColumn
            render={(multigrade) => (
              <S.ActionButtons>
                <S.ActionEditButton
                  type="button"
                  title={`Alterar seriado`}
                  onClick={() =>
                    push(
                      `/auth/school/${query.school_id}/multigrades/${multigrade.id}`
                    )
                  }
                >
                  <Edit title={`Alterar seriado`} />
                </S.ActionEditButton>
                <S.ActionDeleteButton
                  type="button"
                  title={`Fechar seriado ${multigrade.description}`}
                  onClick={() => handleDeleteMultigrade(multigrade)}
                >
                  <X title={`Fechar seriado ${multigrade.description}`} />
                </S.ActionDeleteButton>
              </S.ActionButtons>
            )}
          />
        </Table>
      </S.TableSection>
    </Base>
  );
};

export default MultigradesTemplate;
