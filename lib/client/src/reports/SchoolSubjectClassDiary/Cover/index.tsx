import { Classroom } from 'models/Classroom';
import { ClassroomTeacherSchoolSubject } from 'models/ClassroomTeacherSchoolSubject';
import { SchoolSubject } from 'models/SchoolSubject';

import * as S from './styles';

type CoverProps = {
  classroom: Classroom;
  schoolSubject: SchoolSubject;
  classroomTeacherSchoolSubject: ClassroomTeacherSchoolSubject | null;
};
const Cover = ({
  classroom,
  schoolSubject,
  classroomTeacherSchoolSubject
}: CoverProps) => {
  return (
    <S.Wrapper>
      <S.Header>
        <span>Governo do estado de Rondônia</span>
        <span>Prefeitura Municipal de Ministro Andreazza</span>
        <span>Secretaria Municipal da Educação</span>
        <span>{classroom.school?.name}</span>
        <span>Ministro Andreazza</span>

        <h1>Diário de classe</h1>
      </S.Header>

      <S.Empty />
      <S.Empty style={{ marginTop: '2mm' }} />

      <S.InstitutionSection style={{ marginTop: '4mm' }}>
        <span style={{ fontSize: '2rem' }}>{classroom.school?.name}</span>
        <span style={{ fontSize: '1.4rem' }}>ESTABELECIMENTO</span>

        <span style={{ fontSize: '2.2rem' }}>Ministro Andreazza - RO</span>
        <span style={{ fontSize: '1.4rem' }}>LOCAL</span>
      </S.InstitutionSection>

      <S.Detail>
        <span>Disciplina: {schoolSubject.description}</span>
        <span>Nivel: Ensino Fundamental</span>
        <span>Ano: {classroom.grade?.description}</span>
        <span>Turma: {classroom.description}</span>
        <span>Turno: {classroom.class_period.description}</span>
        <span>Ano: 2022</span>
      </S.Detail>

      <S.Footer>
        <span style={{ fontSize: '2rem' }}>
          {classroomTeacherSchoolSubject?.employee.name}
        </span>
        <span style={{ fontSize: '1.4rem' }}>PROFESSOR(A)</span>
      </S.Footer>
    </S.Wrapper>
  );
};

export default Cover;
