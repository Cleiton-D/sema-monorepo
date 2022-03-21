import { useState, useMemo } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { PlusCircle } from '@styled-icons/feather';
import Link from 'next/link';

import Base from 'templates/Base';

import Heading from 'components/Heading';
import Button from 'components/Button';
import Table from 'components/Table';
import TableColumn from 'components/TableColumn';
import SearchClasses from 'components/SearchClasses';

import { useAccess } from 'hooks/AccessProvider';

import { FormattedClass } from 'models/Class';

import { ListClassesFilters, useListClasses } from 'requests/queries/class';

import * as S from './styles';

const ClassesTemplate = () => {
  const [filters, setFilters] = useState<ListClassesFilters>({});

  const { enableAccess } = useAccess();

  const router = useRouter();

  const { data: session } = useSession();

  const listClassesFilters = useMemo(() => {
    const isTeacher = session?.accessLevel?.code === 'teacher';
    if (!isTeacher) {
      return { ...filters, sortBy: 'created_at' };
    }

    return {
      ...filters,
      employee_id: session?.user.employeeId,
      school_id: session?.schoolId,
      sortBy: 'created_at'
    };
  }, [session, filters]);

  const { data: classes } = useListClasses(session, listClassesFilters);

  const handleNewClass = () => {
    router.push(`/auth/classes/new`);
  };

  const canChangeClass = useMemo(
    () => enableAccess({ module: 'CLASS', rule: 'WRITE' }),
    [enableAccess]
  );

  return (
    <Base>
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

      <SearchClasses handleSearch={setFilters} />

      <S.TableSection>
        <S.SectionTitle>
          <h4>Aulas</h4>
        </S.SectionTitle>
        <Table<FormattedClass>
          items={classes || []}
          keyExtractor={(value) => value.id}
        >
          <TableColumn
            label="Turma"
            tableKey="classroom.description"
            actionColumn
            render={(classEntity: FormattedClass) => (
              <Link href={`/auth/classes/${classEntity.id}`} passHref>
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
        </Table>
      </S.TableSection>
    </Base>
  );
};

export default ClassesTemplate;
