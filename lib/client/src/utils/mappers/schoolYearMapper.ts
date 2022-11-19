import format from 'date-fns/format';

import { FormattedSchoolYear, SchoolYear } from 'models/SchoolYear';
import { parseDateWithoutTimezone } from 'utils/parseDateWithoutTimezone';
import { translateStatus } from 'utils/translateStatus';

export const schoolYearMapper = (
  schoolYear: SchoolYear
): FormattedSchoolYear => ({
  ...schoolYear,
  translatedStatus: translateStatus(schoolYear.status),
  formattedDateStart: format(
    parseDateWithoutTimezone(schoolYear.date_start),
    'dd/MM/yyyy'
  ),
  formattedDateEnd: format(
    parseDateWithoutTimezone(schoolYear.date_end),
    'dd/MM/yyyy'
  )
});
