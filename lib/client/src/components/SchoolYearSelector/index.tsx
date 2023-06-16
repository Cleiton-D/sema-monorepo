import type { ChangeEvent } from 'react';
import { useRouter } from 'next/router';

import { useListSchoolYears } from 'requests/queries/school-year';
import {
  fetchAllSession,
  useProfile,
  useSessionSchoolYear
} from 'requests/queries/session';
import { refreshSession } from 'requests/mutations/session';

import * as S from './styles';

const SchoolYearSelector = (): JSX.Element => {
  const { push } = useRouter();

  const { data: currentSchoolYear } = useSessionSchoolYear();
  const { data: profile } = useProfile();

  const { data: schoolYears } = useListSchoolYears();

  const handleChangeSchoolYear = async (
    event: ChangeEvent<HTMLSelectElement>
  ) => {
    const schoolyearId = event.target.value;

    await refreshSession({
      schoolYearId: schoolyearId,
      profileId: profile?.id
    });
    await fetchAllSession();

    push('/auth');
  };

  return (
    <S.Wrapper>
      Ano:
      <S.Selector onChange={handleChangeSchoolYear}>
        {schoolYears?.map((schoolYear) => (
          <option
            key={schoolYear.id}
            value={schoolYear.id}
            selected={currentSchoolYear?.id === schoolYear.id}
          >
            {schoolYear.reference_year}
          </option>
        ))}
      </S.Selector>
    </S.Wrapper>
  );
};

export default SchoolYearSelector;
