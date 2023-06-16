import { useProfile } from 'requests/queries/session';

import AdminDashboard from 'templates/AdminDashboard';
import MunicipalSecretaryDashboard from 'templates/MunicipalSecretaryDashboard';
import SchoolAdministrationDashboard from 'templates/SchoolAdministrationDashboard';
import TeacherDashboard from 'templates/TeacherDashboard';

const Dashboard = () => {
  const { data: profile } = useProfile();

  if (profile?.branch?.type === 'MUNICIPAL_SECRETARY') {
    return <MunicipalSecretaryDashboard />;
  }
  if (profile?.access_level?.code === 'teacher') {
    return <TeacherDashboard />;
  }
  if (profile?.access_level?.code === 'administrator') {
    return <AdminDashboard />;
  }

  return <SchoolAdministrationDashboard />;
};

export default Dashboard;
