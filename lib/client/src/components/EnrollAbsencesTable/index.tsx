import { useRef } from 'react';
import format from 'date-fns/format';
import { FilePlus, Edit, FileMinus } from '@styled-icons/feather';

import { Attendance } from 'models/Attendance';

import Table from 'components/Table';
import TableColumn from 'components/TableColumn';
import JustifyAbsenceModal, {
  JustifyAbsenceModalRef
} from 'components/JustifyAbsenceModal';

import { useListAttendances } from 'requests/queries/attendances';
import { useRemoveAbsenceJustification } from 'requests/mutations/attendances';

import { parseDateWithoutTimezone } from 'utils/parseDateWithoutTimezone';

import * as S from './styles';

type EnrollAbsencesTableProps = {
  enrollId: string;
};

const EnrollAbsencesTable = ({ enrollId }: EnrollAbsencesTableProps) => {
  const justifyAbsenceModalRef = useRef<JustifyAbsenceModalRef>(null);

  const removeAbsenceJustification = useRemoveAbsenceJustification();
  const { data: absences, refetch } = useListAttendances({
    enroll_id: enrollId,
    attendance: false
  });

  const removeJustification = async (attendance: Attendance) => {
    const confirm = window.confirm(
      'Deseja remover esta justificativa de falta?'
    );
    if (!confirm) return;

    await removeAbsenceJustification.mutateAsync({
      attendance_id: attendance.id
    });
    refetch();
  };

  return (
    <div>
      <Table items={absences || []} keyExtractor={(item) => item.id}>
        <TableColumn
          label="Data"
          tableKey="class.class_date"
          render={(class_date) =>
            format(parseDateWithoutTimezone(class_date), 'dd/MM/yyyy')
          }
        />
        <TableColumn label="Horário" tableKey="class.period" />
        <TableColumn
          label="Disciplina"
          tableKey="class.school_subject.description"
        />
        <TableColumn
          label="Justificada?"
          tableKey="justified"
          render={(justified) => (justified ? 'Sim' : 'Não')}
        />
        <TableColumn
          label="Justificativa"
          tableKey="justification_description"
        />
        <TableColumn
          label="Ações"
          tableKey=""
          contentAlign="center"
          actionColumn
          render={(attendance: Attendance) => (
            <S.ActionButtons>
              <S.ActionButton
                type="button"
                title={
                  attendance.justified
                    ? 'Editar justificativa'
                    : 'Adicionar justificativa'
                }
                onClick={() =>
                  justifyAbsenceModalRef.current?.openModal(attendance)
                }
              >
                {attendance.justified ? (
                  <Edit
                    size={20}
                    color="#0393BE"
                    title="Editar justificativa"
                  />
                ) : (
                  <FilePlus
                    size={20}
                    color="#0393BE"
                    title="Adicionar justificativa"
                  />
                )}
              </S.ActionButton>

              {attendance.justified && (
                <S.ActionButton
                  type="button"
                  title="Remover justificativa"
                  onClick={() => removeJustification(attendance)}
                >
                  <FileMinus
                    size={20}
                    color="#EE4C4C"
                    title="Remover justificativa"
                  />
                </S.ActionButton>
              )}
            </S.ActionButtons>
          )}
        />
      </Table>
      <JustifyAbsenceModal ref={justifyAbsenceModalRef} onSucess={refetch} />
    </div>
  );
};

export default EnrollAbsencesTable;
