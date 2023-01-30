import { EnrollStatus } from 'models/Enroll';
import { Status } from 'models/Status';

export const translateStatus = (
  status: Status | EnrollStatus | string
): string => {
  const obj: Record<string, string> = {
    ACTIVE: 'Cursando',
    INACTIVE: 'Inativo',
    PENDING: 'Pendente',
    TRANSFERRED: 'Transferido',
    QUITTER: 'Desistente',
    DECEASED: 'Falecido',
    APPROVED: 'Aprovado',
    DISAPPROVED: 'Reprovado',
    RELOCATED: 'Remanejado',
    DISAPPROVED_FOR_ABSENCES: 'Reprovado por faltas',
    EXAM: 'Exame',
    RECOVERY: 'Recuperação'
  };

  return obj[status] || status;
};
