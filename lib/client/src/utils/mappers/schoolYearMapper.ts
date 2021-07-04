import { parseISO, format } from 'date-fns';

import { FormattedSchoolYear, SchoolYear } from 'models/SchoolYear';
import { translateStatus } from 'utils/translateStatus';

export const schoolYearMapper = (
  schoolYear: SchoolYear
): FormattedSchoolYear => ({
  ...schoolYear,
  translatedStatus: translateStatus(schoolYear.status),
  formattedDateStart: format(parseISO(schoolYear.date_start), 'dd/MM/yyyy'),
  formattedDateEnd: format(parseISO(schoolYear.date_end), 'dd/MM/yyyy')
});
