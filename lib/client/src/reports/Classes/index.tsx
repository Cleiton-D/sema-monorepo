import dateFnsFormat from 'date-fns/format';
import prBr from 'date-fns/locale/pt-BR';

import { Class } from 'models/Class';
import { Classroom } from 'models/Classroom';
import { SchoolTermPeriod } from 'models/SchoolTermPeriod';
import { SchoolSubject } from 'models/SchoolSubject';
import { GradeSchoolSubject } from 'models/GradeSchoolSubject';

import { shortTranslateSchoolTerm } from 'utils/mappers/schoolTermPeriodMapper';
import { parseDateWithoutTimezone } from 'utils/parseDateWithoutTimezone';

import * as S from './styles';

const formatDate = (format: string, date?: Date | string) => {
  if (!date) return '';
  if (date instanceof Date) {
    return dateFnsFormat(date, format, { locale: prBr });
  }

  return dateFnsFormat(parseDateWithoutTimezone(date), format, {
    locale: prBr
  });
};

export type ClassesReportProps = {
  schoolSubject: SchoolSubject;
  classroom: Classroom;
  schoolTermPeriod?: SchoolTermPeriod;
  gradeSchoolSubject: GradeSchoolSubject;
  classes: Class[];
  usePadding?: boolean;
};
export const ClassesReport = ({
  schoolSubject,
  classroom,
  schoolTermPeriod,
  gradeSchoolSubject,
  classes,
  usePadding = true
}: ClassesReportProps) => {
  return (
    <S.Wrapper usePadding={usePadding}>
      <S.Table>
        <tbody>
          <tr>
            <th colSpan={2}>
              <S.Row>
                <span>{classroom.school?.name}</span>
                <span>Disciplina: {schoolSubject.description}</span>

                {schoolTermPeriod && (
                  <span>
                    {shortTranslateSchoolTerm(schoolTermPeriod.school_term)}
                  </span>
                )}

                <span>Ano: {classroom.school_year?.reference_year}</span>
              </S.Row>
            </th>
          </tr>
          <tr>
            <th colSpan={2}>
              <S.Row>
                <span>Nivel: Ensino Fundamental</span>
                <span>Turma: {classroom.description}</span>
                <span>Turno: {classroom.class_period.description}</span>
              </S.Row>
            </th>
          </tr>
          <tr>
            <th>DIA</th>
            <th>CONTEÚDOS</th>
          </tr>
        </tbody>
        <tbody>
          {classes.map((classEntity) => (
            <tr key={classEntity.id}>
              <td>{formatDate('dd/MM', classEntity.class_date)}</td>
              <td>{classEntity.taught_content}</td>
            </tr>
          ))}
        </tbody>
      </S.Table>

      <S.Summary>
        <S.SummaryTitle>Resumo do Bimestre</S.SummaryTitle>

        <S.SummaryBody>
          <S.SummaryClasses>
            <span>
              Aulas Previstas:{' '}
              {schoolTermPeriod
                ? gradeSchoolSubject.workload / 4
                : gradeSchoolSubject.workload}
            </span>
            <span>Aulas Dadas: {classes.length}</span>
          </S.SummaryClasses>

          {schoolTermPeriod && (
            <div style={{ margin: '2mm 0' }}>
              {schoolTermPeriod.status === 'FINISH'
                ? `Encerrado em: ${formatDate(
                    "dd 'de' MMMM 'de' yyyy",
                    schoolTermPeriod.date_end
                  )}`
                : `Encerra em: ${formatDate(
                    "dd 'de' MMMM 'de' yyyy",
                    schoolTermPeriod.date_end
                  )}`}
            </div>
          )}

          <S.SignBox>
            <span>Assinatura do Professor</span>
          </S.SignBox>

          <S.SignBox>
            <span>Visto - Autoridade da Escola</span>
          </S.SignBox>
        </S.SummaryBody>
      </S.Summary>
    </S.Wrapper>
  );
};

export default ClassesReport;
