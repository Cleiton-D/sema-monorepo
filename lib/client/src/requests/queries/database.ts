import getConfig from 'next/config';
import { Session } from 'next-auth';
import { initializeApi } from 'services/api';

type DatabaseDumpResponse = {
  filename: string;
  content: Buffer;
};

const { publicRuntimeConfig } = getConfig();

export const getDatabaseDump = async (session: Session | null) => {
  const now = new Date();
  const currentDate = `${now.getFullYear()}.${
    now.getMonth() + 1
  }.${now.getDate()}.${now.getHours()}.${now.getMinutes()}`;

  const filename = `database-backup-${currentDate}.sql`;

  const link = document.createElement('a');
  link.href = `${publicRuntimeConfig.NEXT_PUBLIC_API_URL}/admin/database/dump`;
  link.download = filename;
  link.target = '_blank';
  link.click();

  // const api = initializeApi(session);

  // return api
  //   .get<DatabaseDumpResponse>(`/admin/database/dump`)
  //   .then((response) => response.data);
};
