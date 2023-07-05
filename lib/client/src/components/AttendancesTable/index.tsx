import { useMemo, useRef, useState } from 'react';
import format from 'date-fns/format';

import Table from 'components/Table';
import TableColumn from 'components/TableColumn';
import Checkbox from 'components/Checkbox';
import Button from 'components/Button';
import AttendancesTableLine from 'components/AttendancesTableline';

import { useAccess } from 'hooks/AccessProvider';

import { EnrollClassroom } from 'models/EnrollClassroom';
import { Enroll } from 'models/Enroll';
import { Class } from 'models/Class';

import { useListAttendancesByClasses } from 'requests/queries/attendances';
import { useListEnrollClassrooms } from 'requests/queries/enroll-classrooms';
import { useRegisterAttendances } from 'requests/mutations/attendances';

import { translateStatus } from 'utils/translateStatus';
import { parseDateWithoutTimezone } from 'utils/parseDateWithoutTimezone';
import { getEnrollsWithAttendances } from 'utils/mappers/attendances';

import * as S from './styles';
import { SingleStudentModal } from './single-student-modal';
import { useProfile } from 'requests/queries/session';

type AttendancesTableProps = {
  class?: Class;
  enableWithDone?: boolean;
};

type EnrollWithAttendances = {
  enroll: Enroll;
  enroll_classroom: EnrollClassroom;
  attendances: Record<string, boolean>;
};

type EnrollAttendances = Record<string, Record<string, boolean>>;

export const AttendancesTable = ({
  class: classEntity,
  enableWithDone = false
}: AttendancesTableProps) => {
  const [saving, setSaving] = useState(false);

  const enrollAttendancesRef = useRef<EnrollAttendances>({});

  const { data: profile } = useProfile();

  const { enableAccess } = useAccess();

  const { data: { classes: oldClasses, attendances } = {} } =
    useListAttendancesByClasses(
      {
        classroom_id: classEntity?.classroom_id,
        school_subject_id: classEntity?.school_subject_id,
        limit: 6,
        sortBy: 'date_start',
        order: 'DESC',
        before: classEntity?.id
      },
      { enabled: !!classEntity?.classroom_id }
    );

  const { data: enrollClassrooms } = useListEnrollClassrooms({
    classroom_id: classEntity?.classroom_id
  });

  const registerAttendances = useRegisterAttendances();

  const handleCheck = (
    enroll_id: string,
    class_id: string,
    attendance: boolean
  ) => {
    const currentItems = { ...enrollAttendancesRef.current };
    const currentEnrollItems = { ...currentItems[enroll_id] };
    const newEnrollItems = { ...currentEnrollItems, [class_id]: attendance };

    enrollAttendancesRef.current = {
      ...currentItems,
      [enroll_id]: newEnrollItems
    };
  };

  const handleSubmit = async () => {
    if (!classEntity) return;

    setSaving(true);

    const attendancesRequest = Object.entries(enrollAttendancesRef.current).map(
      ([enroll_id, items]) => {
        const attendance = items[classEntity.id];
        return { enroll_id, attendance };
      }
    );

    const requestData = {
      class_id: classEntity.id,
      attendances: attendancesRequest
    };

    await registerAttendances.mutateAsync(requestData);
    setSaving(false);
  };

  const classes = useMemo(() => {
    if (!oldClasses?.length) return [];

    return oldClasses
      .map((item) => ({
        ...item,
        date: format(parseDateWithoutTimezone(item.class_date), 'dd/MM')
      }))
      .sort((a, b) => {
        const parsedA = parseDateWithoutTimezone(a.class_date);
        const parsedB = parseDateWithoutTimezone(b.class_date);

        return parsedA.getTime() - parsedB.getTime();
      });
  }, [oldClasses]);

  const enrollsWithAttendances = useMemo(
    () => getEnrollsWithAttendances(enrollClassrooms, attendances),
    [attendances, enrollClassrooms]
  );

  const thisClassAttendances = useMemo(() => {
    if (!attendances) return [];
    return attendances?.filter(({ class_id }) => class_id === classEntity?.id);
  }, [attendances, classEntity]);

  const canChangeAttendances = useMemo(
    () => enableAccess({ module: 'ATTENDANCE', rule: 'WRITE' }),
    [enableAccess]
  );

  const validateCanChangeAttendance = (
    classId: string,
    enrollClassroom: EnrollClassroom
  ) => {
    if (!canChangeAttendances) return false;
    if (enrollClassroom.status !== 'ACTIVE') return false;
    if (classId !== classEntity?.id) return false;

    if (classEntity?.status === 'DONE') {
      if (!enableWithDone) return false;
    }

    return true;
  };

  return (
    <S.TableSection>
      <S.SectionTitle>
        <h4>Frequência</h4>
        {classEntity && profile?.access_level?.code === 'administrator' && (
          <SingleStudentModal
            classroomId={classEntity.classroom_id}
            attendances={thisClassAttendances}
            classId={classEntity.id}
          />
        )}
      </S.SectionTitle>
      <Table
        items={enrollsWithAttendances}
        keyExtractor={(value) => value.enroll.id}
        renderRow={(props) => <AttendancesTableLine {...props} />}
      >
        {[
          // <TableColumn
          //   key="index"
          //   label="Nº"
          //   tableKey=""
          //   fixed
          //   render={(_value, index) => <span>{index + 1}</span>}
          // />,
          <TableColumn
            key="name"
            label="Nome"
            tableKey="enroll.student.name"
            border="right"
            fixed
            render={(value) => <S.StudentName>{value}</S.StudentName>}
          />,
          ...(classEntity?.classroom.is_multigrade
            ? [
                <TableColumn
                  key="classroom"
                  label="Turma"
                  tableKey="enroll_classroom.classroom.description"
                />
              ]
            : []),
          <TableColumn
            key="status"
            label="Situação"
            tableKey="enroll_classroom.status"
            render={(status) => translateStatus(status)}
          />,
          ...classes.map((item) => (
            <TableColumn
              key={item.id}
              label={
                <>
                  {item.date}
                  <br />
                  {item.period}
                </>
              }
              tableKey={`attendances.${item.id}`}
              contentAlign="center"
              actionColumn
              render={({
                enroll_classroom,
                enroll,
                attendances
              }: EnrollWithAttendances) =>
                typeof attendances[item.id] !== 'undefined' && (
                  <Checkbox
                    isChecked={!!attendances[item.id]}
                    disabled={
                      !validateCanChangeAttendance(item.id, enroll_classroom)
                    }
                    onCheck={(checked) =>
                      handleCheck(enroll.id, item.id, checked)
                    }
                  />
                )
              }
            />
          ))
        ]}
      </Table>
      {canChangeAttendances &&
        (classEntity?.status === 'PROGRESS' || enableWithDone) && (
          <S.ButtonContainer>
            <Button
              styleType="normal"
              size="medium"
              onClick={handleSubmit}
              disabled={saving}
            >
              {saving ? 'Salvando...' : 'Salvar'}
            </Button>
          </S.ButtonContainer>
        )}
    </S.TableSection>
  );
};
