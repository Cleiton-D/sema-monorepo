import { AttendanceCount } from 'models/Attendance';
import { EnrollClassroom } from 'models/EnrollClassroom';
import { SchoolReport } from 'models/SchoolReport';
import { SchoolSubject } from 'models/SchoolSubject';
import { schoolReportsSubjectsMapper } from 'utils/mappers/schoolReportsMapper';
import { masks } from 'utils/masks';

import * as S from './styles';

export type CompleteEnroll = {
  enrollClassroom: EnrollClassroom;
  schoolReports: SchoolReport[];
  attendances: AttendanceCount[];
  schoolSubjects: SchoolSubject[];
};

type SchoolReportItem = {
  completeEnroll: CompleteEnroll;
};
const SchoolReportItem = ({ completeEnroll }: SchoolReportItem) => {
  const { enrollClassroom, schoolSubjects, schoolReports, attendances } =
    completeEnroll;

  const mappedSchoolReports = schoolReportsSubjectsMapper(
    schoolReports,
    attendances,
    schoolSubjects
  );

  const globalAttendances = mappedSchoolReports.reduce(
    (acc, { totalAttendances }) => acc + totalAttendances,
    0
  );

  return (
    <S.Wrapper>
      <S.Head>
        <strong>{enrollClassroom.enroll.school?.name}</strong>
        <strong>MINISTRO ANDREAZZA</strong>
        <strong>BOLETIM APROVEITAMENTO ESCOLAR</strong>
      </S.Head>
      <S.Row>
        <div>Ano Letivo: 2024</div>
        <div>Ano: {enrollClassroom.enroll.grade?.description}</div>
        <div>Turma: {enrollClassroom.classroom.description}</div>
        <div>Nível de Ensino: Fundamental</div>
      </S.Row>
      <S.Row>
        <div>Nome do(a) Aluno(a): {enrollClassroom.enroll.student.name}</div>
        <div>Nº: -</div>
      </S.Row>

      <S.Table>
        <thead>
          <tr>
            <th rowSpan={3} style={{ fontStyle: 'italic' }}>
              DISCIPLINAS
            </th>
            <th colSpan={15}>Recuperação semestral com exame final</th>
          </tr>
          <tr>
            <th colSpan={2}>1º Bim</th>
            <th colSpan={2}>2º Bim</th>
            <th rowSpan={2}>Recup.</th>
            <th colSpan={2}>3º Bim</th>
            <th colSpan={2}>4º Bim</th>
            <th rowSpan={2}>Rec.</th>
            <th colSpan={5}>Resultado após Recuperação Semestral</th>
          </tr>
          <tr>
            <th>Not.</th>
            <th>Fat.</th>

            <th>Not.</th>
            <th>Fat.</th>

            <th>Not.</th>
            <th>Fat.</th>

            <th>Not.</th>
            <th>Fat.</th>

            <th>M.A.</th>
            <th>T.F.</th>
            <th>M.E.F.</th>
            <th>M.F.</th>
            <th>Resultado Final</th>
          </tr>
        </thead>

        <tbody>
          {mappedSchoolReports.map((item) => (
            <tr key={item.school_subject}>
              <td>{item.school_subject}</td>

              <td>
                {item.FIRST === '-'
                  ? '-'
                  : masks['school-report'](String(item.FIRST))}
              </td>
              <td>{item['attendances-FIRST'] || '-'}</td>

              <td>
                {item.SECOND === '-'
                  ? '-'
                  : masks['school-report'](String(item.SECOND))}
              </td>
              <td>{item['attendances-SECOND'] || '-'}</td>

              <td>
                {item['FIRST-REC'] === '-'
                  ? '-'
                  : masks['school-report'](String(item['FIRST-REC']))}
              </td>

              <td>
                {item.THIRD === '-'
                  ? '-'
                  : masks['school-report'](String(item.THIRD))}
              </td>
              <td>{item['attendances-THIRD'] || '-'}</td>

              <td>
                {item.FOURTH === '-'
                  ? '-'
                  : masks['school-report'](String(item.FOURTH))}
              </td>
              <td>{item['attendances-FOURTH'] || '-'}</td>

              <td>
                {item['SECOND-REC'] === '-'
                  ? '-'
                  : masks['school-report'](String(item['SECOND-REC']))}
              </td>

              <td>
                {item.annualAverage === '-'
                  ? '-'
                  : masks['school-report'](String(item.annualAverage))}
              </td>

              <td>{item.totalAttendances || '-'}</td>

              <td>
                {item.EXAM === '-'
                  ? '-'
                  : masks['school-report'](String(item.EXAM))}
              </td>

              <td>
                {item.finalAverage === '-'
                  ? '-'
                  : masks['school-report'](String(item.finalAverage))}
              </td>

              <td>{item.status}</td>
            </tr>
          ))}

          <tr style={{ borderBottom: 'none' }}>
            <td colSpan={9} style={{ borderBottom: 'none' }}></td>
            <td colSpan={3}>Total geral de faltas</td>
            <td>{globalAttendances || '-'}</td>
            <td colSpan={3}>- Eq.: %</td>
          </tr>

          <tr style={{ borderTop: 'none' }}>
            <td rowSpan={2} colSpan={16} style={{ borderTop: 'none' }}>
              Resultado Final: Cursando
              <br />
              Observacao: -
            </td>
          </tr>
          <tr></tr>
          <tr>
            <td colSpan={16} style={{ textAlign: 'center' }}>
              Legenda: [Not.= Notas], [Fat. = Faltas], [Bim. = Bimestre], [Bi. =
              Bimestre], [Recup. = Recuperação], [Méd = Média] e [M.Ex. = Média
              Exame].
            </td>
          </tr>
        </tbody>
      </S.Table>
    </S.Wrapper>
  );
};

export default SchoolReportItem;
