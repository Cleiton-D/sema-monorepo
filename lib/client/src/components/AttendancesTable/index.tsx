import { useMemo, useRef, useState } from 'react';
import { useSession } from 'next-auth/react';
import { format, parseISO } from 'date-fns';

import Table from 'components/Table';
import TableColumn from 'components/TableColumn';
import Checkbox from 'components/Checkbox';
import Button from 'components/Button';
import AttendancesTableLine from 'components/AttendancesTableline';

import { useAccess } from 'hooks/AccessProvider';

import { EnrollClassroom } from 'models/EnrollClassroom';
import { Class } from 'models/Class';

import { useListAttendances } from 'requests/queries/attendances';
import { useListEnrollClassrooms } from 'requests/queries/enroll-classrooms';
import { useListClasses } from 'requests/queries/class';
import { useRegisterAttendances } from 'requests/mutations/attendances';

import { translateStatus } from 'utils/translateStatus';

import * as S from './styles';

type AttendancesTableProps = {
  class?: Class;
};

type EnrollWithAttendances = EnrollClassroom & {
  attendances: Record<string, boolean>;
};

type EnrollAttendances = Record<string, Record<string, boolean>>;

export const AttendancesTable = ({
  class: classEntity
}: AttendancesTableProps) => {
  const [saving, setSaving] = useState(false);

  const enrollAttendancesRef = useRef<EnrollAttendances>({});

  const { enableAccess } = useAccess();

  const { data: session } = useSession();
  const { data: attendances } = useListAttendances(session, {
    class_id: 'all',
    classroom_id: classEntity?.classroom_id
  });

  const { data: oldClasses } = useListClasses(session, {
    classroom_id: classEntity?.classroom_id,
    school_subject_id: classEntity?.school_subject_id,
    limit: 6,
    sortBy: 'date_start',
    order: 'DESC'
  });

  const { data: enrollClassrooms } = useListEnrollClassrooms(session, {
    classroom_id: classEntity?.classroom_id
  });

  // const { data: enrolls } = useListEnrolls(session, {
  //   classroom_id: classEntity?.classroom_id,
  //   school_id: classEntity?.classroom.school_id
  // });

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

    // console.log(requestData);
    await registerAttendances.mutateAsync(requestData);
    setSaving(false);
  };

  const classes = useMemo(() => {
    if (!oldClasses) return [];

    return oldClasses
      .map((item) => ({
        ...item,
        date: format(parseISO(item.class_date), 'dd/MM')
      }))
      .sort((a, b) => {
        const parsedA = parseISO(a.created_at);
        const parsedB = parseISO(b.created_at);

        return parsedA.getTime() - parsedB.getTime();
      });
  }, [oldClasses]);

  const enrollsWithAttendances = useMemo(() => {
    if (!enrollClassrooms) return [];

    return enrollClassrooms.map((enrollClassroom) => {
      const enrollAttendances = attendances
        ?.filter(
          (attendance) => attendance.enroll_id === enrollClassroom.enroll.id
        )
        .reduce<Record<string, boolean>>((acc, attendance) => {
          return {
            ...acc,
            [attendance.class_id]: attendance.attendance
          };
        }, {});

      return { ...enrollClassroom, attendances: enrollAttendances || {} };
    });
  }, [enrollClassrooms, attendances]);

  const canChangeAttendances = useMemo(
    () => enableAccess({ module: 'ATTENDANCE', rule: 'WRITE' }),
    [enableAccess]
  );

  return (
    <S.TableSection>
      <S.SectionTitle>
        <h4>Frequência</h4>
      </S.SectionTitle>
      <Table<EnrollWithAttendances>
        items={enrollsWithAttendances}
        keyExtractor={(value) => value.id}
        renderRow={(props) => <AttendancesTableLine {...props} />}
      >
        {[
          <TableColumn
            key="name"
            label="Nome"
            tableKey="enroll.student.name"
          />,
          <TableColumn
            key="status"
            label="Situação"
            tableKey="status"
            render={(status) => translateStatus(status)}
          />,
          ...classes.map((item) => (
            <TableColumn
              key={item.id}
              label={`${item.date} | ${item.period}`}
              tableKey={`attendances.${item.id}`}
              contentAlign="center"
              actionColumn
              render={(enrollClassroom: EnrollWithAttendances) => (
                <Checkbox
                  isChecked={!!enrollClassroom.attendances[item.id]}
                  disabled={
                    !canChangeAttendances ||
                    enrollClassroom.status !== 'ACTIVE' ||
                    item.id !== classEntity?.id ||
                    classEntity?.status === 'DONE'
                  }
                  onCheck={(checked) =>
                    handleCheck(enrollClassroom.enroll.id, item.id, checked)
                  }
                />
              )}
            />
          ))
        ]}
      </Table>
      {canChangeAttendances && classEntity?.status === 'PROGRESS' && (
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
