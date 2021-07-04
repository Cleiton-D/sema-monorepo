import { useState } from 'react';
import { useSession } from 'next-auth/client';

import Base from 'templates/Base';

import Heading from 'components/Heading';

import { SchoolWithEnrollCount } from 'models/School';

import { useListSchools } from 'requests/queries/schools';

import * as S from './styles';
import SchoolTeachersCard from 'components/SchoolTeachersCard';

const SchoolTeachers = () => {
  const [selectedSchool, setSelectedSchool] = useState<SchoolWithEnrollCount>();

  const [session] = useSession();
  const { data: schools } = useListSchools(session);

  const handleSelectSchool = (school: SchoolWithEnrollCount) => {
    if (selectedSchool?.id === school.id) {
      setSelectedSchool(undefined);
    } else {
      setSelectedSchool(school);
    }
  };

  return (
    <Base>
      <Heading>Lotação de professores</Heading>
      <S.Content>
        <S.Wrapper>
          <S.Section>
            <S.SectionTitle>
              <h4>Escolas</h4>
            </S.SectionTitle>
            <S.List>
              {schools?.map((school) => (
                <S.ListItem
                  key={school.id}
                  highlightOnHover
                  onClick={() => handleSelectSchool(school)}
                  selected={selectedSchool?.id === school.id}
                >
                  <span>{school.name}</span>
                </S.ListItem>
              ))}
            </S.List>
          </S.Section>
        </S.Wrapper>
        <S.TeachersContainer active={!!selectedSchool}>
          <SchoolTeachersCard schoolId={selectedSchool?.id} />
        </S.TeachersContainer>
      </S.Content>
      <S.Overlay
        active={!!selectedSchool}
        onClick={() => setSelectedSchool(undefined)}
      />
    </Base>
  );
};

export default SchoolTeachers;
