import { useMemo } from 'react';

import { SchoolReport } from 'models/SchoolReport';
import { SchoolSubject } from 'models/SchoolSubject';
import { SchoolTermPeriod } from 'models/SchoolTermPeriod';
import { LowedSchoolTerm } from 'models/SchoolTerm';

import { masks } from 'utils/masks';

import * as S from './styles';

type SchoolTermSchoolReportsProps = {
  schoolTermPeriod: SchoolTermPeriod;
  searchedSchoolSubject: SchoolSubject;
  schoolReports: SchoolReport[];
};

const SchoolTermSchoolReports = ({
  schoolTermPeriod,
  searchedSchoolSubject,
  schoolReports
}: SchoolTermSchoolReportsProps) => {
  const schoolSubjects = useMemo(() => {
    return [
      ...new Map(
        schoolReports.map(({ school_subject_id, school_subject }) => [
          school_subject_id,
          school_subject
        ])
      ).values()
    ];
  }, [schoolReports]);

  const schoolReportsByEnroll = useMemo(() => {
    const schoolTerm = schoolTermPeriod.school_term
      .toLowerCase()
      .replace(/-/g, '_') as LowedSchoolTerm;

    const schoolReportsMap = schoolReports.reduce<
      Record<string, Record<string, string>>
    >((acc, schoolReport) => {
      const { enroll_id, school_subject_id } = schoolReport;

      const average = schoolReport[schoolTerm];

      const current = acc[enroll_id] || {};
      const newItem = {
        ...current,
        [school_subject_id]: schoolReport[schoolTerm]
          ? masks['school-report'](`${average}`)
          : '-'
      };

      return { ...acc, [enroll_id]: newItem };
    }, {});

    const enrolls = [
      ...new Map(
        schoolReports.map(({ enroll_id, enroll }) => [enroll_id, enroll])
      ).values()
    ];

    return enrolls.map((enroll) => {
      const enrollSchoolReports = schoolReportsMap[enroll.id];

      return { enroll, schoolReports: enrollSchoolReports };
    });
  }, [schoolReports, schoolTermPeriod]);

  return (
    <S.Wrapper usePadding={false}>
      <S.Table>
        <thead>
          <tr>
            <th colSpan={schoolSubjects.length + 2} style={{ border: 'none' }}>
              <S.HeadRow>E M E I F. Balao Magico</S.HeadRow>
            </th>
          </tr>
          <tr>
            <th colSpan={schoolSubjects.length + 2} style={{ border: 'none' }}>
              <S.HeadRow style={{ justifyContent: 'space-between' }}>
                <span>Nivel de ensino: Fundamental</span>
                <span>Turma: 3 ANO A</span>
              </S.HeadRow>
            </th>
          </tr>
          <tr>
            <th colSpan={schoolSubjects.length + 2} style={{ border: 'none' }}>
              <S.HeadRow>
                Disciplina: {searchedSchoolSubject.description}
              </S.HeadRow>
            </th>
          </tr>
          <tr>
            <th colSpan={schoolSubjects.length + 2} style={{ border: 'none' }}>
              <S.HeadRow>
                <span>Exame Final</span>
                <span>Ano Letivo: 2017</span>
              </S.HeadRow>
            </th>
          </tr>

          <tr>
            <th>Aluno</th>

            {schoolSubjects.map((schoolSubject) => (
              <S.SchoolSubjectTitleCell key={schoolSubject.id}>
                <span>{schoolSubject.description}</span>
              </S.SchoolSubjectTitleCell>
            ))}

            <S.SchoolSubjectTitleCell>
              <span style={{ textTransform: 'uppercase' }}>Faltas</span>
            </S.SchoolSubjectTitleCell>
          </tr>
        </thead>
        <tbody>
          {schoolReportsByEnroll.map((item) => (
            <tr key={item.enroll.id}>
              <td>{item.enroll.student.name}</td>

              {schoolSubjects.map((schoolSubject) => (
                <td key={`${schoolSubject.id}-${item.enroll.id}`}>
                  {item.schoolReports[schoolSubject.id]}
                </td>
              ))}

              <td></td>
            </tr>
          ))}
        </tbody>
      </S.Table>
    </S.Wrapper>
  );
};

export default SchoolTermSchoolReports;
