import { useState, useEffect } from 'react';
import { X } from '@styled-icons/feather';

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
  const [fieldValue, setFieldValue] = useState(
    schoolReport.formattedAverages[reportKey] !== '-'
      ? schoolReport.formattedAverages[reportKey]
      : undefined
  );

  useEffect(() => {
    setFieldValue(
      schoolReport.formattedAverages[reportKey] !== '-'
        ? schoolReport.formattedAverages[reportKey]
        : undefined
    );
  }, [schoolReport, reportKey]);

  const isDisabled =
    !enabled ||
    schoolReport.enroll.current_classroom?.id !== classroom.id ||
    ['INACTIVE', 'TRANSFERRED', 'QUITTER', 'DECEASED'].includes(
      schoolReport.enroll.status
    );

  return (
    <S.InputContainer
      isDisabled={!enabled}
      message={isLoading ? 'Carregando...' : message}
    >
      <TextInput
        label=""
        size="medium"
        mask="school-report-field"
        disabled={isDisabled}
        containerStyle={{ maxWidth: 80 }}
        name={`${schoolReport.enroll.id}.${reportKey}`}
        value={fieldValue}
        icon={
          !isDisabled && (
            <S.ClearButton
              type="button"
              title="Limpar"
              onClick={() => setFieldValue(undefined)}
            >
              <X title="Limpar" />
            </S.ClearButton>
          )
        }
      />
    </S.InputContainer>
  );
};

export default ClassroomSchoolReportInput;
