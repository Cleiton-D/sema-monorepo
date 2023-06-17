import { useMemo } from 'react';

import Table from 'components/Table';
import TableColumn from 'components/TableColumn';

import { Classroom } from 'models/Classroom';

import { useListEnrolls } from 'requests/queries/enrolls';
import { useListSchoolReports } from 'requests/queries/school-reports';
import { useListGradeSchoolSubjects } from 'requests/queries/grade-school-subjects';

import { masks } from 'utils/masks';
import { translateEnrollStatus } from 'utils/mappers/enrollMapper';

import * as S from './styles';

type FinalAtaTable = {
  classroom: Classroom;
};
const FinalAtaTable = ({ classroom }: FinalAtaTable) => {
  const { data: gradeSchoolSubjects = [] } = useListGradeSchoolSubjects({
    grade_id: classroom.grade_id
  });
  const { data: enrolls } = useListEnrolls({
    classroom_id: classroom.id
  });
  const { data: schoolReports = [] } = useListSchoolReports({
    classroom_id: classroom.id
  });

  const schoolSubjects = useMemo(() => {
    return gradeSchoolSubjects.map(({ school_subject }) => school_subject!);
  }, [gradeSchoolSubjects]);

  const finalReports = useMemo(() => {
    const enrollsItems = enrolls?.items || [];

    return enrollsItems.map((enroll) => {
      const filteredSchoolReports = schoolReports.filter(
        ({ enroll_id }) => enroll_id === enroll.id
      );

      const reports = filteredSchoolReports.reduce<
        Record<string, number | undefined>
      >((acc, item) => {
        const { final_average } = item;
        return { ...acc, [item.school_subject_id]: final_average };
      }, {});

      return { enroll, ...reports };
    }, []);
  }, [enrolls, schoolReports]);

  return (
    <S.Wrapper>
      <Table
        items={finalReports}
        keyExtractor={(value) => value.enroll.id}
        minimal
      >
        <TableColumn tableKey="enroll.student.name" label="Aluno" />

        {schoolSubjects.map(({ id, description }) => (
          <TableColumn
            key={id}
            tableKey={id}
            label={description}
            render={(value) =>
              value || value === 0 ? masks['school-report'](`${value}`) : '-'
            }
          />
        ))}

        <TableColumn
          tableKey="enroll.status"
          label="Resultado Final"
          render={translateEnrollStatus}
        />
      </Table>
    </S.Wrapper>
  );
};

export default FinalAtaTable;
