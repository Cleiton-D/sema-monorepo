import { useState } from 'react';
import { useSession } from 'next-auth/client';
import { toast } from 'react-toastify';
import { v4 as uuidv4 } from 'uuid';

import Card from 'components/Card';
import ToastContent from 'components/ToastContent';

import { withAccessComponent } from 'hooks/AccessProvider';

import { getDatabaseDump } from 'requests/queries/database';

import { downloadFile } from 'utils/downloadFile';

const DatabaseDumpCard = () => {
  const [loading, setLoading] = useState(false);

  const [session] = useSession();

  const handleGetDump = async () => {
    if (loading) return;
    const toastKey = uuidv4();

    try {
      setLoading(true);

      toast.info(
        <ToastContent showSpinner>
          Gerando dump da base de dados...
        </ToastContent>,
        {
          position: toast.POSITION.TOP_RIGHT,
          toastId: toastKey,
          autoClose: false,
          closeButton: false
        }
      );

      const { filename, content } = await getDatabaseDump(session);

      const buff = Buffer.from(content);
      const blob = new Blob([buff]);

      downloadFile(blob, filename);

      toast.dismiss(toastKey);
    } catch (err) {
      console.error(err);
      toast.info('Não foi possível exportar a base de dados', {
        position: toast.POSITION.TOP_RIGHT,
        type: toast.TYPE.ERROR,
        autoClose: 3000
      });
    } finally {
      setLoading(false);
      toast.dismiss(toastKey);
    }
  };

  return <Card description="Exportar base de dados" onClick={handleGetDump} />;
};

export default withAccessComponent(DatabaseDumpCard);
