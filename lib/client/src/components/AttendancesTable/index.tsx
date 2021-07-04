import { useMemo, useRef, useState } from 'react';
import { useSession } from 'next-auth/client';
import { format, parseISO } from 'date-fns';

import Table from 'components/Table';
import TableColumn from 'components/TableColumn';
import Checkbox from 'components/Checkbox';
import Button from 'components/Button';

import { useAccess } from 'hooks/AccessProvider';

import { Class } from 'models/Class';
import { Enroll } from 'models/Enroll';

import { useListAttendances } from 'requests/queries/attendances';
import { useListEnrolls } from 'requests/queries/enrolls';
import { useListClasses } from 'requests/queries/class';
import { useRegisterAttendances } from 'requests/mutations/attendances';

import { translateStatus } from 'utils/translateStatus';

import * as S from './styles';

type AttendancesTableProps = {
  class?: Class;
};

type EnrollWithAttendances = Enroll & {
  attendances: Record<string, boolean>;
};

type EnrollAttendances = Record<string, Record<string, boolean>>;

export const AttendancesTable = ({
  class: classEntity
}: AttendancesTableProps) => {
  const [saving, setSaving] = useState(false);

  const enrollAttendancesRef = useRef<EnrollAttendances>({});

  const { enableAccess } = useAccess();

  const [session] = useSession();
  const { data: attendances } = useListAttendances(session, {
    class_id: 'all',
    classroom_id: classEntity?.classroom_id
  });

  const { data: oldClasses } = useListClasses(session, {
    classroom_id: classEntity?.classroom_id,
    school_subject_id: classEntity?.school_subject_id
  });

  const { data: enrolls } = useListEnrolls(session, {
    classroom_id: classEntity?.classroom_id,
    school_id: classEntity?.classroom.school_id
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
    if (!oldClasses) return [];

    return oldClasses.map((item) => ({
      ...item,
      date: format(parseISO(item.class_date), 'dd/MM')
    }));
  }, [oldClasses]);

  const enrollsWithAttendances = useMemo(() => {
    if (!enrolls) return [];

    return enrolls.map((enroll) => {
      const enrollAttendances = attendances
        ?.filter((attendance) => attendance.enroll_id === enroll.id)
        .reduce<Record<string, boolean>>((acc, attendance) => {
          return {
            ...acc,
            [attendance.class_id]: attendance.attendance
          };
        }, {});

      return { ...enroll, attendances: enrollAttendances || {} };
    });
  }, [enrolls, attendances]);

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
      >
        {[
          <TableColumn key="name" label="Nome" tableKey="person.name" />,
          <TableColumn
            key="status"
            label="Situação"
            tableKey="status"
            render={(status) => translateStatus(status)}
          />,
          ...classes.map((item) => (
            <TableColumn
              key={item.id}
              label={item.date}
              tableKey={`attendances.${item.id}`}
              contentAlign="center"
              actionColumn
              render={(enroll: EnrollWithAttendances) => (
                <Checkbox
                  isChecked={!!enroll.attendances[item.id]}
                  disabled={
                    !canChangeAttendances ||
                    item.id !== classEntity?.id ||
                    classEntity?.status === 'DONE'
                  }
                  onCheck={(checked) =>
                    handleCheck(enroll.id, item.id, checked)
                  }
                />
              )}
            />
          ))
        ]}
      </Table>
      {canChangeAttendances && (
        <S.ButtonContainer>
          <Button
            styleType="normal"
            size="medium"
            onClick={handleSubmit}
            disabled={saving || classEntity?.status === 'DONE'}
          >
            {saving ? 'Salvando...' : 'Salvar'}
          </Button>
        </S.ButtonContainer>
      )}
    </S.TableSection>
  );
};
