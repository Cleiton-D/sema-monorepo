import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';

import Base from 'templates/Base';

import Heading from 'components/Heading';
import { AttendancesTable } from 'components/AttendancesTable';
import Button from 'components/Button';

import { useShowClass } from 'requests/queries/class';
import { useFinishClass } from 'requests/mutations/classes';

import * as S from './styles';
import Tab from 'components/Tab';
import ClassroomSchoolReportTable from 'components/ClassroomSchoolReportTable';

const ClassTemplate = () => {
  const { query, push } = useRouter();

  const { data: session } = useSession();
  const { data: classEntity } = useShowClass(session, query.class_id as string);
  const finishClass = useFinishClass();

  const handleFinishClass = async () => {
    if (!classEntity) return;

    await finishClass.mutateAsync(classEntity);
    push('/auth/classes');
  };

  return (
    <Base>
      <Heading>Dados da aula</Heading>
      <S.Wrapper>
        <S.Content>
          <S.Grid>
            <S.GridItem>
              <strong>Data: </strong>
              <span>{classEntity?.formattedClassDate}</span>
            </S.GridItem>
            <S.GridItem>
              <strong>Horário: </strong>
              <span>{classEntity?.period}</span>
            </S.GridItem>
            <S.GridItem>
              <strong>Turma: </strong>
              <span>{classEntity?.classroom.description}</span>
            </S.GridItem>
            <S.GridItem>
              <strong>Disciplina: </strong>
              <span>{classEntity?.school_subject.description}</span>
            </S.GridItem>
            <S.GridItem>
              <strong>Professor: </strong>
              <span>{classEntity?.employee.name}</span>
            </S.GridItem>
            <S.GridItem>
              <strong>Status: </strong>
              <span>{classEntity?.translatedStatus}</span>
            </S.GridItem>
          </S.Grid>
        </S.Content>
        {classEntity?.status === 'PROGRESS' && (
          <Button onClick={handleFinishClass} module="CLASS" rule="WRITE">
            Encerrar aula
          </Button>
        )}
      </S.Wrapper>

      <Tab
        items={[
          {
            title: 'Frequência',
            element: <AttendancesTable class={classEntity} />
          },
          {
            title: 'Notas',
            element: (
              <ClassroomSchoolReportTable
                classroom={classEntity!.classroom}
                schoolSubject={classEntity!.school_subject}
              />
            )
          }
        ]}
      />
    </Base>
  );
};

export default ClassTemplate;
