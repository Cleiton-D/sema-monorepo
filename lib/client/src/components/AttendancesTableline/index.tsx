import { TableRowProps } from 'components/TableRow';
import { EnrollClassroom } from 'models/EnrollClassroom';

import * as S from './styles';

type AttendancesTableLineProps = TableRowProps<EnrollClassroom>;

const AttendancesTableLine = ({
  item: enroll,
  ...rest
}: AttendancesTableLineProps): JSX.Element => {
  return (
    <S.Wrapper {...rest} item={enroll} isActive={enroll.status === 'ACTIVE'} />
  );
};

export default AttendancesTableLine;
