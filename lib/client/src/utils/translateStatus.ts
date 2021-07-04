import { Status } from 'models/Status';

export const translateStatus = (status: Status): string => {
  const obj: Record<Status, string> = {
    ACTIVE: 'Ativo',
    INACTIVE: 'Inativo',
    PENDING: 'Pendente'
  };

  return obj[status] || status;
};
