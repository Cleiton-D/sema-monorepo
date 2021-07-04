import { useSession } from 'next-auth/client';
import AdminDashboard from 'templates/AdminDashboard';

import MunicipalSecretaryDashboard from 'templates/MunicipalSecretaryDashboard';
import SchoolAdministrationDashboard, {
  SchoolAdministrationDashboardProps
} from 'templates/SchoolAdministrationDashboard';
import TeacherDashboard from 'templates/TeacherDashboard';

export type DashboardProps = SchoolAdministrationDashboardProps | never;

const Dashboard = (props: DashboardProps) => {
  const [session] = useSession();

  if (session?.branch.type === 'MUNICIPAL_SECRETARY') {
    return <MunicipalSecretaryDashboard />;
  }
  if (session?.accessLevel?.code === 'teacher') {
    return <TeacherDashboard {...props} />;
  }
  if (session?.accessLevel?.code === 'administrator') {
    return <AdminDashboard />;
  }

  return <SchoolAdministrationDashboard {...props} />;
};

export default Dashboard;
