import format from 'date-fns/format';
import differenceInYears from 'date-fns/differenceInYears';

import { EnrollClassroom } from 'models/EnrollClassroom';
import { Classroom } from 'models/Classroom';

import { parseDateWithoutTimezone } from 'utils/parseDateWithoutTimezone';
import { translateStatus } from 'utils/translateStatus';

import * as S from './styles';

export type NominalRelationReportProps = {
  classroom: Classroom;
  enrollClassrooms: EnrollClassroom[];
  usePadding?: boolean;
};

const formatDate = (date?: Date | string) => {
  if (!date) return '';
  if (date instanceof Date) {
    return format(date, 'dd/MM/yyyy');
  }

  return format(parseDateWithoutTimezone(date), 'dd/MM/yyyy');
};

const situation = (
  situation?: string,
  enrollStatus?: string,
  date?: Date | string
) => {
  if (situation == 'TRANSFERRED') return formatDate(date);
  if (situation === 'RELOCATED') return 'Remanejado';

  if (!enrollStatus) return '';

  return translateStatus(enrollStatus);
};

const getAge = (date?: Date | string) => {
  if (!date) return '';
  if (date instanceof Date) {
    return differenceInYears(new Date(), date);
  }

  return differenceInYears(new Date(), parseDateWithoutTimezone(date));
};

const NominalRelationReport = ({
  classroom,
  enrollClassrooms,
  usePadding = true
}: NominalRelationReportProps) => {
  return (
    <S.Wrapper usePadding={usePadding}>
      <S.Head>
        <strong>GOVERNO DO ESTADO DE RONDÔNIA</strong>
        <strong>PREFEITURA MUNICIPAL DE MINISTRO ANDREAZZA</strong>
        <strong>SECRETARIA MUNICIPAL DE EDUCAÇÃO</strong>
        <strong>{classroom.school?.name}</strong>
        <strong>MINISTRO ANDREAZZA - RO</strong>
        <strong>RELAÇÃO NOMINAL</strong>
      </S.Head>

      <S.Table>
        <thead>
          <tr>
            <th colSpan={10}>
              <S.Row>
                <span>Curso: Ensino Fundamental</span>
                <span>Turno: {classroom.class_period.description}</span>
                <span>Sala: {classroom.description}</span>
                <span>{classroom.school_year?.reference_year}</span>
              </S.Row>
            </th>
          </tr>
          <tr>
            <th colSpan={2}>{classroom.description}</th>
            <th rowSpan={2}>T/R EM</th>
            <th colSpan={2}>SEXO</th>
            <th colSpan={2}>SIT</th>
            <th rowSpan={2}>DAT. NASC.</th>
            <th rowSpan={2}>IDADE</th>
            <th>SITUAÇÃO</th>
          </tr>
          <tr>
            <th>N°</th>
            <th>NOME DO ALUNO</th>
            <th>M</th>
            <th>F</th>
            <th>N/R</th>
            <th>R/cor</th>
            <th>AP/REP\TRA/DES/REM</th>
          </tr>
        </thead>
        <tbody>
          {enrollClassrooms.map((enrollClassroom, index) => (
            <tr key={enrollClassroom.id}>
              <td style={{ textAlign: 'center' }}>{index + 1}</td>
              <td>{enrollClassroom.enroll.student.name}</td>
              <td>{formatDate(enrollClassroom.enroll.enroll_date)}</td>
              <td style={{ textAlign: 'center' }}>
                {enrollClassroom.enroll.student.gender === 'male' && 'X'}
              </td>
              <td style={{ textAlign: 'center' }}>
                {enrollClassroom.enroll.student.gender === 'female' && 'X'}
              </td>
              <td>{enrollClassroom.enroll.origin === 'NEW' ? 'Nov' : 'Rep'}</td>
              <td>{enrollClassroom.enroll.student.breed}</td>
              <td>{formatDate(enrollClassroom.enroll.student.birth_date)}</td>
              <td>{getAge(enrollClassroom.enroll.student.birth_date)}</td>
              <td>
                {situation(
                  enrollClassroom.status,
                  enrollClassroom.enroll.status,
                  enrollClassroom.enroll.transfer_date
                )}
              </td>            
            </tr>
          ))}
        </tbody>
      </S.Table>
    </S.Wrapper>
  );
};

export default NominalRelationReport;
