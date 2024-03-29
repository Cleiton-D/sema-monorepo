import { useMemo } from 'react';

import DatePicker from 'components/Datepicker';

import { useListSchoolTermPeriods } from 'requests/queries/school-term-periods';
import { useListCalendarEvents } from 'requests/queries/calendar-events';
import { useProfile, useSessionSchoolYear } from 'requests/queries/session';

import { parseDateWithoutTimezone } from 'utils/parseDateWithoutTimezone';

type SchoolDayDatepickerProps = {
  name: string;
  label: string;
  selectedDay?: Date;
  handleChangeDate?: (date?: Date) => void;
};

const SchoolDayDatepicker = ({
  name,
  label,
  selectedDay,
  handleChangeDate
}: SchoolDayDatepickerProps): JSX.Element => {
  const { data: schoolYear } = useSessionSchoolYear();
  const { data: profile } = useProfile();

  const { data: inactivePeriods, isLoading: isLoadingSchoolTerms } =
    useListSchoolTermPeriods({
      school_year_id: schoolYear?.id,
      status: ['FINISH', 'PENDING']
    });

  const { data: calendarEvents } = useListCalendarEvents(
    {
      school_year_id: schoolYear?.id,
      school_id: profile?.school?.id,
      competence: 'ALL'
    },
    {
      enabled: !!schoolYear?.id
    }
  );

  const inactiveRanges = useMemo(() => {
    if (!schoolYear) return [];

    if (isLoadingSchoolTerms) {
      return [
        {
          from: parseDateWithoutTimezone(schoolYear.date_start),
          to: parseDateWithoutTimezone(schoolYear.date_end)
        }
      ];
    }
    if (!inactivePeriods) return [];

    return inactivePeriods.map(({ date_start, date_end }) => {
      return {
        from: parseDateWithoutTimezone(date_start),
        to: parseDateWithoutTimezone(date_end)
      };
    });
  }, [inactivePeriods, isLoadingSchoolTerms, schoolYear]);

  const activeDays = useMemo(() => {
    if (!calendarEvents?.length) return [];

    return calendarEvents
      .filter(({ type }) => type === 'SCHOOL_WEEKEND')
      .map(({ date }) => parseDateWithoutTimezone(date));
  }, [calendarEvents]);

  const inactiveDays = useMemo(() => {
    if (!calendarEvents?.length) return [];

    return calendarEvents
      .filter(({ type }) => type === 'HOLIDAY')
      .map(({ date }) => parseDateWithoutTimezone(date));
  }, [calendarEvents]);

  return (
    <DatePicker
      name={name}
      label={label}
      value={selectedDay}
      onChangeDay={handleChangeDate}
      disabledRanges={inactiveRanges}
      disabledDays={inactiveDays}
      exceptEnabledDays={activeDays}
      fromDate={schoolYear && parseDateWithoutTimezone(schoolYear.date_start)}
      toDate={schoolYear && parseDateWithoutTimezone(schoolYear.date_end)}
      disabled={!schoolYear}
    />
  );
};

export default SchoolDayDatepicker;
