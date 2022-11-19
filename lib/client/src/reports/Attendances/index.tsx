import dateFnsFormat from 'date-fns/format';
import prBr from 'date-fns/locale/pt-BR';

import { Classroom } from 'models/Classroom';
import { SchoolSubject } from 'models/SchoolSubject';
import { SchoolTermPeriod } from 'models/SchoolTermPeriod';
import { MinifiedAttendance } from 'models/Attendance';
import { MinifiedClass } from 'models/Class';
import { EnrollClassroom } from 'models/EnrollClassroom';

import { shortTranslateSchoolTerm } from 'utils/mappers/schoolTermPeriodMapper';
import { parseDateWithoutTimezone } from 'utils/parseDateWithoutTimezone';
import { getEnrollsWithAttendances } from 'utils/mappers/attendances';

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

export type AttendancesReportProps = {
  schoolSubject: SchoolSubject;
  classroom: Classroom;
  schoolTermPeriod?: SchoolTermPeriod;
  attendances: MinifiedAttendance[];
  enrollClassrooms: EnrollClassroom[];
  classes: MinifiedClass[];
  usePadding?: boolean;
};

const AttendancesReport = ({
  schoolSubject,
  classroom,
  schoolTermPeriod,
  attendances,
  enrollClassrooms,
  classes,
  usePadding
}: AttendancesReportProps) => {
  const sortedClasses = classes.sort((a, b) => {
    const parsedA = parseDateWithoutTimezone(a.class_date);
    const parsedB = parseDateWithoutTimezone(b.class_date);

    return parsedA.getTime() - parsedB.getTime();
  });

  const enrollWithAttendances = getEnrollsWithAttendances(
    enrollClassrooms,
    attendances
  );

  return (
    <S.Wrapper usePadding={usePadding}>
      <S.Table>
        <tbody>
          <tr>
            <th
              style={{ borderBottom: 'none' }}
              colSpan={sortedClasses.length + 1}
            >
              <S.TitleRow>
                <span>{classroom.school?.name}</span>
                <span>Disciplina: {schoolSubject.description}</span>
                {schoolTermPeriod && (
                  <span>
                    {shortTranslateSchoolTerm(schoolTermPeriod.school_term)}
                  </span>
                )}
              </S.TitleRow>
            </th>
          </tr>

          <tr>
            <th
              style={{ borderTop: 'none' }}
              colSpan={sortedClasses.length + 1}
            >
              <S.TitleRow>
                <span>Nivel: Ensino Fundamental</span>
                <span>Turma: {classroom.description}</span>
                <span>Turno: {classroom.class_period.description}</span>
                <span>Ano Letivo: 2022</span>
              </S.TitleRow>
            </th>
          </tr>

          <tr>
            <th rowSpan={2} style={{ paddingTop: '1mm', paddingBottom: '1mm' }}>
              Aluno
            </th>
            <th colSpan={sortedClasses.length}>Frequência</th>
          </tr>
          <tr>
            {sortedClasses.map(({ class_date, id }) => (
              <S.DayTitleCell key={id}>
                <span>{formatDate('dd/MM', class_date)}</span>
              </S.DayTitleCell>
            ))}
          </tr>
        </tbody>
        <tbody>
          {enrollWithAttendances.map((item) => (
            <tr key={item.enroll.id}>
              <td style={{ whiteSpace: 'nowrap' }}>
                {item.enroll.student.name}
              </td>

              {sortedClasses.map(({ id }) => (
                <td key={id}>{item.attendances[id] ? 'X' : '-'}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </S.Table>
    </S.Wrapper>
  );
};

export default AttendancesReport;
