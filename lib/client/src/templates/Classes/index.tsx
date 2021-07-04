import { useRef, useMemo } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/client';
import { PlusCircle } from '@styled-icons/feather';
import Link from 'next/link';

import Base from 'templates/Base';

import Heading from 'components/Heading';
import Button from 'components/Button';
import Table from 'components/Table';
import TableColumn from 'components/TableColumn';
import SelectTeacherClassroomModal, {
  SelectTeacherClassroomModalRef
} from 'components/SelectTeacherClassroomModal';

import { useAccess } from 'hooks/AccessProvider';

import { FormattedClass } from 'models/Class';

import { useListClasses } from 'requests/queries/class';

import * as S from './styles';

type HandleNewClassProps = {
  classroomId: string;
  schoolSubjectId: string;
};

const ClassesTemplate = () => {
  const modalRef = useRef<SelectTeacherClassroomModalRef>(null);

  const { enableAccess } = useAccess();

  const router = useRouter();

  const [session] = useSession();
  const { data: classes } = useListClasses(session, {
    employee_id: session?.user.employeeId
  });

  const handleNewClass = ({
    classroomId,
    schoolSubjectId
  }: HandleNewClassProps) => {
    router.push(
      `/classes/new?classroom=${classroomId}&school_subject=${schoolSubjectId}`
    );
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
            onClick={() => modalRef.current?.openModal()}
          >
            Nova Aula
          </Button>
        </S.AddButtonContainer>
      )}

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
              <Link href={`/classes/${classEntity.id}`} passHref>
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
          <TableColumn label="Início" tableKey="formattedTimeStart" />
          <TableColumn label="Fim" tableKey="formattedTimeEnd" />
          <TableColumn label="Conteúdo" tableKey="taught_content" ellipsis />
        </Table>
      </S.TableSection>
      <SelectTeacherClassroomModal ref={modalRef} onSubmit={handleNewClass} />
    </Base>
  );
};

export default ClassesTemplate;
