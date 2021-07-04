import { parseISO, format } from 'date-fns';
import {
  FormattedSchoolTermPeriod,
  SchoolTermPeriod,
  SchoolTermPeriodsObject
} from 'models/SchoolTermPeriod';

export const schoolTermPeriodMapper = (
  schoolYear: SchoolTermPeriod
): FormattedSchoolTermPeriod => ({
  ...schoolYear,
  formattedDateStart: format(parseISO(schoolYear.date_start), 'dd/MM/yyyy'),
  formattedDateEnd: format(parseISO(schoolYear.date_end), 'dd/MM/yyyy')
});

export const mapSchoolTermPeriodsToObject = (
  schoolTermPeriods: SchoolTermPeriod[]
): SchoolTermPeriodsObject =>
  schoolTermPeriods.reduce<SchoolTermPeriodsObject>((acc, item) => {
    const { school_term } = item;
    return { ...acc, [school_term]: schoolTermPeriodMapper(item) };
  }, {});
