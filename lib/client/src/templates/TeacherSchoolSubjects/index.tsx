import { useState } from 'react';
import { useSession } from 'next-auth/client';

import Base from 'templates/Base';

import Heading from 'components/Heading';
import TeacherSchoolSubjectCard from 'components/TeacherSchoolSubjectCard';

import { School } from 'models/School';
import { SchoolSubject } from 'models/SchoolSubject';

import { useListSchoolsSubjects } from 'requests/queries/school-subjects';

import * as S from './styles';

export type TeacherSchoolSubjectsProps = {
  school: School;
};

const TeacherSchoolSubjects = ({ school }: TeacherSchoolSubjectsProps) => {
  const [
    selectedSchoolSubject,
    setSelectedSchoolSubject
  ] = useState<SchoolSubject>();

  const [session] = useSession();

  const { data: schoolSubjects } = useListSchoolsSubjects(session);

  const handleSelectSchoolSubject = (schoolSubject: SchoolSubject) => {
    if (selectedSchoolSubject?.id === schoolSubject.id) {
      setSelectedSchoolSubject(undefined);
    } else {
      setSelectedSchoolSubject(schoolSubject);
    }
  };

  return (
    <Base>
      <Heading>Professor x Disciplinas</Heading>
      <S.Content>
        <S.Wrapper>
          <S.Section>
            <S.SectionTitle>
              <h4>Disciplinas</h4>
            </S.SectionTitle>
            <S.List>
              {schoolSubjects?.map((schoolSubject) => (
                <S.ListItem
                  key={schoolSubject.id}
                  highlightOnHover
                  onClick={() => handleSelectSchoolSubject(schoolSubject)}
                  selected={selectedSchoolSubject?.id === schoolSubject.id}
                >
                  <span>{schoolSubject.description}</span>
                </S.ListItem>
              ))}
            </S.List>
          </S.Section>
        </S.Wrapper>
        <S.TeacherSchoolSubjectsContainer active={!!selectedSchoolSubject}>
          <TeacherSchoolSubjectCard
            schoolId={school.id}
            schoolSubjectId={selectedSchoolSubject?.id}
          />
        </S.TeacherSchoolSubjectsContainer>
      </S.Content>
      <S.Overlay
        active={!!selectedSchoolSubject}
        onClick={() => setSelectedSchoolSubject(undefined)}
      />
    </Base>
  );
};

export default TeacherSchoolSubjects;
