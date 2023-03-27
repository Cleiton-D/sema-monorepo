import type { ChangeEvent } from 'react';
import { signIn, useSession } from 'next-auth/react';

import { useListSchoolYears } from 'requests/queries/school-year';

import * as S from './styles';

const SchoolYearSelector = (): JSX.Element => {
  const { data: session } = useSession();
  const { data: schoolYears } = useListSchoolYears(session);

  const handleChangeSchoolYear = async (
    event: ChangeEvent<HTMLSelectElement>
  ) => {
    const schoolyearId = event.target.value;

    await signIn('refresh', {
      schoolYearId: schoolyearId,
      token: session?.jwt,
      callbackUrl: `${window.location.origin}/auth`
    });
  };

  return (
    <S.Wrapper>
      Ano:
      <S.Selector onChange={handleChangeSchoolYear}>
        {schoolYears?.map((schoolYear) => (
          <option
            key={schoolYear.id}
            value={schoolYear.id}
            selected={session?.configs.school_year_id === schoolYear.id}
          >
            {schoolYear.reference_year}
          </option>
        ))}
      </S.Selector>
    </S.Wrapper>
  );
};

export default SchoolYearSelector;
