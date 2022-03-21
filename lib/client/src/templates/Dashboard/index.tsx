import { useSession } from 'next-auth/react';

import AdminDashboard from 'templates/AdminDashboard';
import MunicipalSecretaryDashboard from 'templates/MunicipalSecretaryDashboard';
import SchoolAdministrationDashboard from 'templates/SchoolAdministrationDashboard';
import TeacherDashboard from 'templates/TeacherDashboard';

const Dashboard = () => {
  const { data: session } = useSession();

  if (session?.branch.type === 'MUNICIPAL_SECRETARY') {
    return <MunicipalSecretaryDashboard />;
  }
  if (session?.accessLevel?.code === 'teacher') {
    return <TeacherDashboard />;
  }
  if (session?.accessLevel?.code === 'administrator') {
    return <AdminDashboard />;
  }

  return <SchoolAdministrationDashboard />;
};

export default Dashboard;
