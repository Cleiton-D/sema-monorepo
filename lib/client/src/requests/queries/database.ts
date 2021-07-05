import { Session } from 'next-auth';
import { initializeApi } from 'services/api';

type DatabaseDumpResponse = {
  filename: string;
  content: Buffer;
};

export const getDatabaseDump = async (session: Session | null) => {
  const api = initializeApi(session);

  return api
    .get<DatabaseDumpResponse>(`/admin/database/dump`)
    .then((response) => response.data);
};
