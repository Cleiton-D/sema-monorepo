import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useQueryClient } from 'react-query';
import { X, Edit3, PlusCircle } from '@styled-icons/feather';

import Base from 'templates/Base';

import Heading from 'components/Heading';
import Button from 'components/Button';
import Table from 'components/Table';
import TableColumn from 'components/TableColumn';
import SearchClasses from 'components/SearchClasses';
import Paginator from 'components/Paginator';

import { useAccess } from 'hooks/AccessProvider';

import { Class, FormattedClass } from 'models/Class';

import {
  ListClassesFilters,
  useListClasses,
  classesKeys
} from 'requests/queries/class';
import {
  useProfile,
  useSessionSchoolYear,
  useUser
} from 'requests/queries/session';
import { useDeleteClass } from 'requests/mutations/classes';

import * as S from './styles';

const ClassesTemplate = () => {
  const [filters, setFilters] = useState<ListClassesFilters>({
    page: 1,
    size: 20
  });

  const { enableAccess } = useAccess();

  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: profile } = useProfile();
  const { data: user } = useUser();
  const { data: schoolYear } = useSessionSchoolYear();

  const listClassesFilters = useMemo(() => {
    const isTeacher = profile?.access_level?.code === 'teacher';
    const employee_id = isTeacher ? user?.employee?.id : undefined;

    return {
      school_id: profile?.school?.id,
      employee_id,
      sortBy: 'created_at',
      page: 1,
      size: 20,
      ...filters,
      school_year_id: schoolYear?.id
    };
  }, [filters, profile, schoolYear, user]);

  const { data: classes } = useListClasses(listClassesFilters);

  const deleteClass = useDeleteClass();

  const handleNewClass = () => {
    router.push(`/auth/classes/new`);
  };

  const handleDelete = async (item: Class) => {
    const confirmation = window.confirm(
      `Deseja apagar realmente apagar esta aula?`
    );

    if (confirmation) {
      await deleteClass.mutateAsync(item);
      queryClient.invalidateQueries([...classesKeys.all]);

      return;
    }
  };

  const canChangeClass = useMemo(() => {
    if (schoolYear?.status !== 'ACTIVE') return false;

    return enableAccess({ module: 'CLASS', rule: 'WRITE' });
  }, [enableAccess, schoolYear]);

  return (
    (<Base>
      <Heading>Aulas</Heading>
      {canChangeClass && (
        <S.AddButtonContainer>
          <Button
            styleType="normal"
            size="medium"
            icon={<PlusCircle />}
            onClick={handleNewClass}
          >
            Nova Aula
          </Button>
        </S.AddButtonContainer>
      )}
      <SearchClasses handleSearch={setFilters} currentValues={filters} />
      <S.TableSection>
        <S.SectionTitle>
          <h4>Aulas</h4>
        </S.SectionTitle>
        <Table<FormattedClass>
          items={classes?.items || []}
          keyExtractor={(value) => value.id}
        >
          <TableColumn
            label="Turma"
            tableKey="classroom.description"
            actionColumn
            render={(classEntity: FormattedClass) => (
              <Link href={`/auth/classes/${classEntity.id}`} passHref legacyBehavior>
                <S.TableLink title="Visualizar aula">
                  {classEntity.classroom.description}
                </S.TableLink>
              </Link>
            )}
          />
          <TableColumn
            label="Disciplina"
            tableKey="school_subject.description"
          />
          <TableColumn label="Status" tableKey="translatedStatus" />
          <TableColumn label="Data" tableKey="formattedClassDate" />
          <TableColumn label="Horário" tableKey="period" />
          <TableColumn label="Conteúdo" tableKey="taught_content" ellipsis />
          <TableColumn
            label="Ações"
            tableKey="actions"
            contentAlign="center"
            actionColumn
            render={(item: Class) =>
              !item.edit_available ? (
                <></>
              ) : (
                <S.ActionButtons>
                  <S.ActionButton
                    type="button"
                    title={`Alterar aula`}
                    onClick={() => router.push(`/auth/classes/${item.id}/edit`)}
                  >
                    <Edit3 size={20} color="#0393BE" />
                  </S.ActionButton>
                  <S.ActionButton
                    type="button"
                    title={`Apagar aula`}
                    onClick={() => handleDelete(item)}
                  >
                    <X size={20} />
                  </S.ActionButton>
                </S.ActionButtons>
              )
            }
          />
        </Table>
        <S.PaginatorContainer>
          <Paginator
            total={classes?.total || 0}
            currentPage={classes?.page || 1}
            currentSize={classes?.size || 20}
            onChangeSize={(size: number) =>
              setFilters((current) => ({ ...current, size }))
            }
            onChangePage={(page: number) =>
              setFilters((current) => ({ ...current, page }))
            }
          />
        </S.PaginatorContainer>
      </S.TableSection>
    </Base>)
  );
};

export default ClassesTemplate;
