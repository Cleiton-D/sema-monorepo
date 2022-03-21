import { SchoolReport } from 'models/SchoolReport';

type SchoolReportsBySchoolSubjectsProps = {
  schoolReports: SchoolReport[];
};

const SchoolReportsBySchoolSubjects = ({
  schoolReports
}: SchoolReportsBySchoolSubjectsProps): JSX.Element => {
  console.log(schoolReports);

  return <div>Hello</div>;
};

export default SchoolReportsBySchoolSubjects;
