import { atomWithCookie } from 'hooks/AtomProvider';
import { SchoolTermPeriod } from 'models/SchoolTermPeriod';
import { SchoolYear } from 'models/SchoolYear';

type CreateSchoolYearAtom = {
  schoolYear: SchoolYear;
  schoolTermPeriods: SchoolTermPeriod[];
};

export const schoolYearAtom = atomWithCookie<CreateSchoolYearAtom | undefined>(
  'create-school-year',
  undefined
);
