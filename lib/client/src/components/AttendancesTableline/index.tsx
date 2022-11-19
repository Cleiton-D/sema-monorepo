import { Enroll } from 'models/Enroll';
import { EnrollClassroom } from 'models/EnrollClassroom';

import { TableRowProps } from 'components/TableRow';

import * as S from './styles';

type AttendancesTableLineItem = {
  enroll: Enroll;
  enroll_classroom: EnrollClassroom;
  attendances: Record<string, boolean>;
};

type AttendancesTableLineProps = TableRowProps<AttendancesTableLineItem>;

const AttendancesTableLine = ({
  item: enroll,
  ...rest
}: AttendancesTableLineProps): JSX.Element => {
  return (
    <S.Wrapper
      {...rest}
      item={enroll}
      isActive={enroll.enroll_classroom.status === 'ACTIVE'}
    />
  );
};

export default AttendancesTableLine;
