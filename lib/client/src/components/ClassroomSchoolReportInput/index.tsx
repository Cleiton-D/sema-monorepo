import TextInput from 'components/TextInput';

import { Classroom } from 'models/Classroom';
import { MappedSchoolReport } from 'models/SchoolReport';

import * as S from './styles';

type ClassroomSchoolReportInputProps = {
  isLoading: boolean;
  enabled: boolean;
  message?: string;
  schoolReport: MappedSchoolReport;
  classroom: Classroom;
  reportKey: string;
};
const ClassroomSchoolReportInput = ({
  isLoading,
  enabled,
  message,
  schoolReport,
  classroom,
  reportKey
}: ClassroomSchoolReportInputProps): JSX.Element => {
  return (
    <S.InputContainer
      isDisabled={!enabled}
      message={isLoading ? 'Carregando...' : message}
    >
      <TextInput
        label=""
        size="medium"
        mask="school-report"
        disabled={
          !enabled ||
          schoolReport.enroll.status !== 'ACTIVE' ||
          schoolReport.enroll.current_classroom?.id !== classroom.id
        }
        containerStyle={{ maxWidth: 80 }}
        name={`${schoolReport.enroll.id}.${reportKey}`}
        value={
          schoolReport.formattedAverages[reportKey] !== '-'
            ? schoolReport.formattedAverages[reportKey]
            : undefined
        }
      />
    </S.InputContainer>
  );
};

export default ClassroomSchoolReportInput;
