import { useMemo, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useQueryClient } from 'react-query';
import { v4 as uuidv4 } from 'uuid';

import Table from 'components/Table';
import TableColumn from 'components/TableColumn';
import TimetableTeacherSchoolSubjectSelector from 'components/TimetableTeacherSchoolSubjectSelector';

import { Classroom } from 'models/Classroom';
import { DayOfWeek } from 'models/DafOfWeek';

import { useListTimetables } from 'requests/queries/timetables';
import { useUpdateTimetables } from 'requests/mutations/timetables';

import { generateTimetable } from 'utils/generateTimetable';
import { timetableObject } from 'utils/mappers/timetableObject';
import { classroomTeacherSchoolSubjectsKeys } from 'requests/queries/classroom-teacher-school-subjects';

type TimetablesTeachersTableProps = {
  classroom: Classroom;
};

type SubmitFnParams = {
  id?: string;
  school_subject?: string;
  teacher?: string;
  day_of_week: DayOfWeek;
  time_start: string;
  time_end: string;
};

const TimetablesTeachersTable = ({
  classroom
}: TimetablesTeachersTableProps) => {
  const queryClient = useQueryClient();
  const { data: session } = useSession();

  const updateTimetables = useUpdateTimetables();
  const { data: timetables } = useListTimetables(session, {
    classroom_id: classroom.id,
    school_id: classroom.school_id
  });

  const mappedTimetables = useMemo(
    () => timetableObject(timetables || []),
    [timetables]
  );

  const handleSubmit = useCallback(
    async (values: SubmitFnParams) => {
      try {
        const timetableItem = {
          id: values.id,
          school_subject_id: values.school_subject,
          employee_id: values.teacher,
          day_of_week: values.day_of_week,
          time_start: values.time_start,
          time_end: values.time_end
        };

        const requestData = {
          classroom_id: classroom.id,
          school_id: classroom.school_id,
          timetables: [timetableItem]
        };

        await updateTimetables.mutateAsync(requestData);

        await Promise.all([
          queryClient.refetchQueries('timetables', { active: true }),
          queryClient.refetchQueries(
            classroomTeacherSchoolSubjectsKeys.lists(),
            { active: true }
          )
        ]);
      } catch (err) {
        console.log(err);
      }
    },
    [classroom, updateTimetables, queryClient]
  );

  const newTableData = useMemo(() => {
    const { time_start, time_end, class_time, break_time, break_time_start } =
      classroom.class_period;

    const timetable = generateTimetable({
      time_start,
      time_end,
      class_time,
      break_time,
      break_time_start
    });

    return timetable.map((item) => {
      const time = `${item.timeStart} - ${item.timeEnd}`;
      const existentItem = mappedTimetables[time];

      return {
        ...item,
        key: uuidv4(),
        time,
        MONDAY: existentItem?.MONDAY,
        TUESDAY: existentItem?.TUESDAY,
        WEDNESDAY: existentItem?.WEDNESDAY,
        THURSDAY: existentItem?.THURSDAY,
        FRIDAY: existentItem?.FRIDAY
      };
    }, []);
  }, [classroom, mappedTimetables]);

  return (
    <Table items={newTableData} keyExtractor={(value) => value.key} minimal>
      <TableColumn label="Horário" tableKey="time" fixed />
      <TableColumn
        label="Segunda"
        tableKey="MONDAY"
        actionColumn
        render={(item) => (
          <TimetableTeacherSchoolSubjectSelector
            classroom={classroom}
            currentData={item.MONDAY}
            dayOfWeek="MONDAY"
            timeStart={item.timeStart}
            timeEnd={item.timeEnd}
            onChange={handleSubmit}
          />
        )}
      />
      <TableColumn
        label="Terça"
        tableKey="TUESDAY"
        actionColumn
        render={(item) => (
          <TimetableTeacherSchoolSubjectSelector
            classroom={classroom}
            currentData={item.TUESDAY}
            dayOfWeek="TUESDAY"
            timeStart={item.timeStart}
            timeEnd={item.timeEnd}
            onChange={handleSubmit}
          />
        )}
      />
      <TableColumn
        label="Quarta"
        tableKey="WEDNESDAY"
        actionColumn
        render={(item) => (
          <TimetableTeacherSchoolSubjectSelector
            classroom={classroom}
            currentData={item.WEDNESDAY}
            dayOfWeek="WEDNESDAY"
            timeStart={item.timeStart}
            timeEnd={item.timeEnd}
            onChange={handleSubmit}
          />
        )}
      />
      <TableColumn
        label="Quinta"
        tableKey="THURSDAY"
        actionColumn
        render={(item) => (
          <TimetableTeacherSchoolSubjectSelector
            classroom={classroom}
            currentData={item.THURSDAY}
            dayOfWeek="THURSDAY"
            timeStart={item.timeStart}
            timeEnd={item.timeEnd}
            onChange={handleSubmit}
          />
        )}
      />
      <TableColumn
        label="Sexta"
        tableKey="FRIDAY"
        actionColumn
        render={(item) => (
          <TimetableTeacherSchoolSubjectSelector
            classroom={classroom}
            currentData={item.FRIDAY}
            dayOfWeek="FRIDAY"
            timeStart={item.timeStart}
            timeEnd={item.timeEnd}
            onChange={handleSubmit}
          />
        )}
      />
    </Table>
  );
};

export default TimetablesTeachersTable;
