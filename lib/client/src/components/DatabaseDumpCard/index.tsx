import { useState } from 'react';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';

import Card from 'components/Card';
import ToastContent from 'components/ToastContent';

import { withAccessComponent } from 'hooks/AccessProvider';

import { getDatabaseDump } from 'requests/queries/database';

const DatabaseDumpCard = () => {
  const [loading, setLoading] = useState(false);

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
          id: toastKey,
          dismissible: false
        }
      );

      await getDatabaseDump();

      toast.dismiss(toastKey);
    } catch (err) {
      console.error(err);
      toast.info('Não foi possível exportar a base de dados', {
        id: toastKey,
        dismissible: false,
        duration: 3000
      });
    } finally {
      setLoading(false);
      toast.dismiss(toastKey);
    }
  };

  return <Card description="Exportar base de dados" onClick={handleGetDump} />;
};

export default withAccessComponent(DatabaseDumpCard);
