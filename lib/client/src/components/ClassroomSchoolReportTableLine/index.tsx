import { TableRowProps } from 'components/TableRow';

import { Classroom } from 'models/Classroom';
import { MappedSchoolReport } from 'models/SchoolReport';

import * as S from './styles';

type ClassroomSchoolReportTableLineProps = TableRowProps<MappedSchoolReport> & {
  classroom?: Classroom;
};

const ClassroomSchoolReportTableLine = ({
  item: schoolReport,
  classroom,
  ...rest
}: ClassroomSchoolReportTableLineProps): JSX.Element => {
  return (
    <S.Wrapper
      {...rest}
      item={schoolReport}
      isActive={
        !['INACTIVE', 'TRANSFERRED', 'QUITTER', 'DECEASED'].includes(
          schoolReport.enroll.status
        ) && schoolReport.enroll.current_classroom?.id === classroom?.id
      }
    />
  );
};

export default ClassroomSchoolReportTableLine;
