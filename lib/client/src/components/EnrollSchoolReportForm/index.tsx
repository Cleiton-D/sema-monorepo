import { forwardRef, useMemo } from 'react';
import { FormHandles } from '@unform/core';
import { useAtomValue } from 'jotai/utils';

import Table from 'components/Table';
import TableColumn from 'components/TableColumn';
import TextInput from 'components/TextInput';

import { useListSchoolsSubjects } from 'requests/queries/school-subjects';
import { useListSchoolReports } from 'requests/queries/school-reports';
import { useSessionSchoolYear } from 'requests/queries/session';

import { selectedStudent } from 'store/atoms/create-enroll';

import * as S from './styles';

type EnrollSchoolReportFormProps = {
  gradeId?: string;
};

const EnrollSchoolReportForm: React.ForwardRefRenderFunction<
  FormHandles,
  EnrollSchoolReportFormProps
> = ({ gradeId }, ref) => {
  const student = useAtomValue(selectedStudent);

  const { data: schoolYear } = useSessionSchoolYear();

  const { data: schoolSubjects = [] } = useListSchoolsSubjects({
    grade_id: gradeId,
    school_year_id: schoolYear?.id
  });

  const { data: schoolReports = [] } = useListSchoolReports(
    {
      enroll_as: 'last',
      student_id: student?.id,
      school_year_id: schoolYear?.id,
      grade_id: gradeId
    },
    {
      enabled: !!student?.id && !!gradeId
    }
  );

  const subjectsWithReports = useMemo(() => {
    const reportsMap = schoolReports.reduce<
      Record<string, Record<string, number | undefined>>
    >((acc, item) => {
      const {
        school_subject_id,
        first,
        second,
        first_rec,
        third,
        fourth,
        second_rec,
        exam
      } = item;

      return {
        ...acc,
        [school_subject_id]: {
          first,
          second,
          first_rec,
          third,
          fourth,
          second_rec,
          exam
        }
      };
    }, {});

    return schoolSubjects.map((schoolSubject) => {
      const reports = reportsMap[schoolSubject.id] || {};
      return {
        ...schoolSubject,
        reports
      };
    });
  }, [schoolReports, schoolSubjects]);

  return (
    <S.Wrapper>
      <S.SectionTitle>Notas</S.SectionTitle>
      <S.Form onSubmit={console.log} ref={ref}>
        <Table items={subjectsWithReports} keyExtractor={(item) => item.id}>
          <TableColumn tableKey="description" label="Disciplina" />
          <TableColumn
            label="1º Bimestre"
            tableKey="first"
            actionColumn
            render={(item: (typeof subjectsWithReports)[0]) => (
              <S.InputContainer>
                <TextInput
                  label=""
                  size="medium"
                  mask="school-report-field"
                  value={item.reports.first}
                  containerStyle={{ maxWidth: 80 }}
                  name={`${item.id}.first`}
                />
              </S.InputContainer>
            )}
          />

          <TableColumn
            label="2º Bimestre"
            tableKey="second"
            actionColumn
            render={(item: (typeof subjectsWithReports)[0]) => (
              <S.InputContainer>
                <TextInput
                  label=""
                  size="medium"
                  mask="school-report-field"
                  value={item.reports.second}
                  containerStyle={{ maxWidth: 80 }}
                  name={`${item.id}.second`}
                />
              </S.InputContainer>
            )}
          />

          <TableColumn
            label="Rec. 1º Semestre"
            tableKey="first_rec"
            actionColumn
            render={(item: (typeof subjectsWithReports)[0]) => (
              <S.InputContainer>
                <TextInput
                  label=""
                  size="medium"
                  mask="school-report-field"
                  value={item.reports.first_rec}
                  containerStyle={{ maxWidth: 80 }}
                  name={`${item.id}.first_rec`}
                />
              </S.InputContainer>
            )}
          />

          <TableColumn
            label="3º Bimestre"
            tableKey="third"
            actionColumn
            render={(item: (typeof subjectsWithReports)[0]) => (
              <S.InputContainer>
                <TextInput
                  label=""
                  size="medium"
                  mask="school-report-field"
                  value={item.reports.third}
                  containerStyle={{ maxWidth: 80 }}
                  name={`${item.id}.third`}
                />
              </S.InputContainer>
            )}
          />

          <TableColumn
            label="4º Bimestre"
            tableKey="fourth"
            actionColumn
            render={(item: (typeof subjectsWithReports)[0]) => (
              <S.InputContainer>
                <TextInput
                  label=""
                  size="medium"
                  mask="school-report-field"
                  value={item.reports.fourth}
                  containerStyle={{ maxWidth: 80 }}
                  name={`${item.id}.fourth`}
                />
              </S.InputContainer>
            )}
          />

          <TableColumn
            label="Rec. 2º Semestre"
            tableKey="second_rec"
            actionColumn
            render={(item: (typeof subjectsWithReports)[0]) => (
              <S.InputContainer>
                <TextInput
                  label=""
                  size="medium"
                  mask="school-report-field"
                  value={item.reports.second_rec}
                  containerStyle={{ maxWidth: 80 }}
                  name={`${item.id}.second_rec`}
                />
              </S.InputContainer>
            )}
          />
        </Table>
      </S.Form>
    </S.Wrapper>
  );
};

export default forwardRef(EnrollSchoolReportForm);
