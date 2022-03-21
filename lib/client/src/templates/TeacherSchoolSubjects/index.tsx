import { useState, useMemo } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';

import Base from 'templates/Base';

import Heading from 'components/Heading';
import TeacherSchoolSubjectCard from 'components/TeacherSchoolSubjectCard';

import { SchoolSubject } from 'models/SchoolSubject';

import { useListSchoolsSubjects } from 'requests/queries/school-subjects';

import * as S from './styles';

const TeacherSchoolSubjects = () => {
  const [selectedSchoolSubject, setSelectedSchoolSubject] =
    useState<SchoolSubject>();

  const { query } = useRouter();
  const { data: session } = useSession();

  const { data: schoolSubjects } = useListSchoolsSubjects(session);

  const handleSelectSchoolSubject = (schoolSubject: SchoolSubject) => {
    if (selectedSchoolSubject?.id === schoolSubject.id) {
      setSelectedSchoolSubject(undefined);
    } else {
      setSelectedSchoolSubject(schoolSubject);
    }
  };

  const schoolId = useMemo(() => {
    if (query.school_id === 'me') {
      return session?.schoolId as string;
    }
    return query.school_id as string;
  }, [query, session]);

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
            schoolId={schoolId}
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
