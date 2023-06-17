import { useMemo } from 'react';
import addDays from 'date-fns/addDays';
import isBefore from 'date-fns/isBefore';

import Button from 'components/Button';
import Table from 'components/Table';
import TableColumn from 'components/TableColumn';
import ClassroomSchoolReportInput from 'components/ClassroomSchoolReportInput';
import ClassroomSchoolReportTableLine from 'components/ClassroomSchoolReportTableLine';

import { useAccess } from 'hooks/AccessProvider';

import { MappedSchoolReport } from 'models/SchoolReport';
import { SchoolTerm } from 'models/SchoolTerm';
import { Classroom } from 'models/Classroom';
import { SchoolSubject } from 'models/SchoolSubject';

import { useListSchoolReports } from 'requests/queries/school-reports';
import { useListSchoolTermPeriods } from 'requests/queries/school-term-periods';
import { useSessionSchoolYear } from 'requests/queries/session';
import { useRegisterSchoolReports } from 'requests/mutations/school-reports';

import { schoolReportsEnrollsMapper } from 'utils/mappers/schoolReportsMapper';
import { parseDateWithoutTimezone } from 'utils/parseDateWithoutTimezone';

import * as S from './styles';

type SchoolReportsValues = Record<SchoolTerm, Record<string, string>>;

type ClassroomSchoolReportTableProps = {
  classroom: Classroom;
  schoolSubject: SchoolSubject;
};
const ClassroomSchoolReportTable = ({
  classroom,
  schoolSubject
}: ClassroomSchoolReportTableProps): JSX.Element => {
  const { data: schoolYear } = useSessionSchoolYear();
  const { enableAccess } = useAccess();

  const registerSchoolReports = useRegisterSchoolReports();

  const handleSubmit = (values: SchoolReportsValues) => {
    const requestItems = Object.entries(values).map(([enroll, averages]) => {
      const newAverages = Object.entries(averages)
        .filter(([, value]) => {
          if (value === '') return true;

          const parsed = Number(value);
          return !isNaN(parsed);
        })
        .reduce((acc, [key, value]) => {
          if (value === '') return { ...acc, [key]: null };

          return { ...acc, [key]: Number(value) };
        }, {});

      return {
        enroll_id: enroll,
        averages: newAverages
      };
    });

    const filteredRequestItems = requestItems.filter(
      ({ averages }) => Object.keys(averages).length > 0
    );

    registerSchoolReports.mutate({
      school_subject_id: schoolSubject.id,
      reports: filteredRequestItems
    });
  };

  const { data: schoolReports } = useListSchoolReports({
    classroom_id: classroom.id as string,
    school_subject_id: schoolSubject.id
  });
  const { data: termPeriods, isLoading } = useListSchoolTermPeriods({
    school_year_id: schoolYear?.id
  });

  const mappedSchoolReports = useMemo(() => {
    if (!schoolReports) return [];

    return schoolReports.map(schoolReportsEnrollsMapper);
  }, [schoolReports]);

  const enabledTermPeriods = useMemo(() => {
    if (!termPeriods)
      return {
        FIRST: false,
        SECOND: false,
        THIRD: false,
        FOURTH: false,
        'FIRST-REC': false,
        'SECOND-REC': false,
        EXAM: false
      };

    return termPeriods.reduce<Record<SchoolTerm, boolean>>(
      (acc, item) => {
        const { school_term, date_end, date_start, status } = item;
        if (status === 'FINISH') {
          const parsedDateStart = parseDateWithoutTimezone(date_start);
          const parsedDateEnd = parseDateWithoutTimezone(date_end);
          const dateEnd = addDays(parsedDateEnd, 10);

          const dateStartAfterToday = isBefore(parsedDateStart, new Date());
          const dateEndBeforeToday = isBefore(new Date(), dateEnd);

          return {
            ...acc,
            [school_term]: dateStartAfterToday && dateEndBeforeToday
          };
        }

        return { ...acc, [school_term]: status === 'ACTIVE' };
      },
      {
        FIRST: false,
        SECOND: false,
        THIRD: false,
        FOURTH: false,
        'FIRST-REC': false,
        'SECOND-REC': false,
        EXAM: false
      }
    );
  }, [termPeriods]);

  const canChangeSchoolReport = useMemo(
    () => enableAccess({ module: 'SCHOOL_REPORT', rule: 'WRITE' }),
    [enableAccess]
  );

  return (
    <S.TableSection>
      <S.Form onSubmit={handleSubmit}>
        <Table<MappedSchoolReport>
          items={mappedSchoolReports}
          keyExtractor={(value) => value.enroll.id}
          renderRow={(props) => (
            <ClassroomSchoolReportTableLine {...props} classroom={classroom} />
          )}
        >
          <TableColumn
            label="Aluno"
            tableKey="enroll.student.name"
            border="right"
            fixed
            render={(value) => <S.StudentName>{value}</S.StudentName>}
          />
          <TableColumn
            label="1º Bimestre"
            tableKey="first"
            contentAlign={canChangeSchoolReport ? undefined : 'center'}
            actionColumn
            render={(item: MappedSchoolReport) =>
              canChangeSchoolReport ? (
                <ClassroomSchoolReportInput
                  isLoading={isLoading}
                  enabled={enabledTermPeriods.FIRST}
                  message="Bimestre fechado"
                  schoolReport={item}
                  classroom={classroom}
                  reportKey="first"
                />
              ) : (
                item.formattedAverages.first
              )
            }
          />
          <TableColumn
            label="2º Bimestre"
            tableKey="second"
            contentAlign={canChangeSchoolReport ? undefined : 'center'}
            actionColumn
            render={(item: MappedSchoolReport) =>
              canChangeSchoolReport ? (
                <ClassroomSchoolReportInput
                  isLoading={isLoading}
                  enabled={enabledTermPeriods.SECOND}
                  message="Bimestre fechado"
                  schoolReport={item}
                  classroom={classroom}
                  reportKey="second"
                />
              ) : (
                item.formattedAverages.second
              )
            }
          />
          <TableColumn
            label="Rec. 1º Semestre"
            tableKey="first_rec"
            contentAlign={canChangeSchoolReport ? undefined : 'center'}
            actionColumn
            render={(item: MappedSchoolReport) =>
              canChangeSchoolReport ? (
                <ClassroomSchoolReportInput
                  isLoading={isLoading}
                  enabled={enabledTermPeriods['FIRST-REC']}
                  schoolReport={item}
                  classroom={classroom}
                  reportKey="first_rec"
                />
              ) : (
                item.formattedAverages.first_rec
              )
            }
          />
          <TableColumn
            label="3º Bimestre"
            tableKey="third"
            contentAlign={canChangeSchoolReport ? undefined : 'center'}
            actionColumn
            render={(item: MappedSchoolReport) =>
              canChangeSchoolReport ? (
                <ClassroomSchoolReportInput
                  isLoading={isLoading}
                  enabled={enabledTermPeriods.THIRD}
                  message="Bimestre fechado"
                  schoolReport={item}
                  classroom={classroom}
                  reportKey="third"
                />
              ) : (
                item.formattedAverages.third
              )
            }
          />
          <TableColumn
            label="4º Bimestre"
            tableKey="fourth"
            contentAlign={canChangeSchoolReport ? undefined : 'center'}
            actionColumn
            render={(item: MappedSchoolReport) =>
              canChangeSchoolReport ? (
                <ClassroomSchoolReportInput
                  isLoading={isLoading}
                  enabled={enabledTermPeriods.FOURTH}
                  message="Bimestre fechado"
                  schoolReport={item}
                  classroom={classroom}
                  reportKey="fourth"
                />
              ) : (
                item.formattedAverages.fourth
              )
            }
          />
          <TableColumn
            label="Rec. 2º Semestre"
            tableKey="formattedAverages.second_rec"
            contentAlign={canChangeSchoolReport ? undefined : 'center'}
            actionColumn
            render={(item: MappedSchoolReport) =>
              canChangeSchoolReport ? (
                <ClassroomSchoolReportInput
                  isLoading={isLoading}
                  enabled={enabledTermPeriods['SECOND-REC']}
                  schoolReport={item}
                  classroom={classroom}
                  reportKey="second_rec"
                />
              ) : (
                item.formattedAverages.second_rec
              )
            }
          />
          <TableColumn
            label="Exame"
            tableKey="EXAM"
            contentAlign={canChangeSchoolReport ? undefined : 'center'}
            actionColumn
            render={(item: MappedSchoolReport) =>
              canChangeSchoolReport ? (
                <ClassroomSchoolReportInput
                  isLoading={isLoading}
                  enabled={enabledTermPeriods.EXAM}
                  schoolReport={item}
                  classroom={classroom}
                  reportKey="exam"
                />
              ) : (
                item.formattedAverages.exam
              )
            }
          />
        </Table>
        <S.ButtonContainer>
          <Button styleType="normal" size="medium" type="submit">
            Salvar
          </Button>
        </S.ButtonContainer>
      </S.Form>
    </S.TableSection>
  );
};

export default ClassroomSchoolReportTable;
