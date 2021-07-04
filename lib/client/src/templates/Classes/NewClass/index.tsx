import { useRouter } from 'next/router';
import { useSession } from 'next-auth/client';
import { format } from 'date-fns';

import Base from 'templates/Base';

import Heading from 'components/Heading';
import TextInput from 'components/TextInput';
import Button from 'components/Button';

import { useShowClassroom } from 'requests/queries/classrooms';
import { useShowSchoolSubject } from 'requests/queries/school-subjects';
import { useCreateClass } from 'requests/mutations/classes';

import * as S from './styles';

type FormData = {
  taught_content: string;
};

const NewClass = () => {
  const { query, push } = useRouter();

  const [session] = useSession();
  const { data: classroom } = useShowClassroom(session, {
    school_id: session?.schoolId,
    id: query.classroom as string
  });

  const { data: schoolSubject } = useShowSchoolSubject(
    session,
    query.school_subject as string
  );

  const createClass = useCreateClass();

  const handleSubmit = async (values: FormData) => {
    const { taught_content } = values;

    const requestData = {
      classroom_id: classroom?.id,
      school_subject_id: schoolSubject?.id,
      class_date: new Date(),
      time_start: format(new Date(), 'HH:mm'),
      taught_content
    };

    const classEntity = await createClass.mutateAsync(requestData);
    push(`/classes/${classEntity.id}`);
  };

  return (
    <Base>
      <Heading>Iniciar aula</Heading>
      <S.Wrapper>
        <S.Form onSubmit={handleSubmit}>
          <S.Grid>
            <S.GridItem>
              <strong>Data: </strong>
              <span>{format(new Date(), 'dd/MM/yyyy')}</span>
            </S.GridItem>
            <S.GridItem>
              <strong>Hora: </strong>
              <span>{format(new Date(), 'HH:mm')}</span>
            </S.GridItem>
            <S.GridItem>
              <strong>Turma: </strong>
              <span>{classroom?.description}</span>
            </S.GridItem>
            <S.GridItem>
              <strong>Disciplina: </strong>
              <span>{schoolSubject?.description}</span>
            </S.GridItem>
          </S.Grid>
          <S.Divider />
          <S.InputContent>
            <strong>Conteúdo:</strong>
            <TextInput
              as="textarea"
              label="Descreva aqui o conteúdo que será aplicado nesta aula"
              name="taught_content"
            />
          </S.InputContent>
          <S.SaveButtonContainer>
            <Button styleType="normal" size="medium">
              Iniciar aula
            </Button>
          </S.SaveButtonContainer>
        </S.Form>
      </S.Wrapper>
    </Base>
  );
};

export default NewClass;
