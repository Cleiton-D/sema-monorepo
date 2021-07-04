import { useMemo } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/client';
import { parseISO, isBefore } from 'date-fns';

import Base from 'templates/Base';

import Heading from 'components/Heading';
import Table from 'components/Table';
import TableColumn from 'components/TableColumn';
import TextInput from 'components/TextInput';
import Button from 'components/Button';

import { useAccess } from 'hooks/AccessProvider';

import { MappedSchoolReportEnroll } from 'models/SchoolReport';
import { SchoolTerm } from 'models/SchoolTerm';

import { useListSchoolReports } from 'requests/queries/school-reports';
import { useListSchoolTermPeriods } from 'requests/queries/school-term-periods';
import { useShowClassroom } from 'requests/queries/classrooms';
import { useShowSchoolSubject } from 'requests/queries/school-subjects';
import { useRegisterSchoolReports } from 'requests/mutations/school-reports';

import { schoolReportsEnrollsMapper } from 'utils/mappers/schoolReportsMapper';

import * as S from './styles';

type SchoolReportsValues = Record<SchoolTerm, Record<string, string>>;

const SchoolReportsTemplate = () => {
  const { query } = useRouter();

  const { enableAccess } = useAccess();

  const [session] = useSession();
  const { data: classroom } = useShowClassroom(session, {
    id: query.classroom_id as string
  });
  const { data: schoolSubject } = useShowSchoolSubject(
    session,
    query.school_subject as string
  );
  const { data: schoolReports } = useListSchoolReports(session, {
    classroom_id: query.classroom_id as string,
    school_subject_id: query.school_subject as string
  });
  const { data: termPeriods, isLoading } = useListSchoolTermPeriods(session, {
    school_year_id: session?.configs.school_year_id
  });

  const registerSchoolReports = useRegisterSchoolReports();

  const mappedSchoolReports = useMemo(() => {
    if (!schoolReports) return [];

    return schoolReportsEnrollsMapper(schoolReports);
  }, [schoolReports]);

  const enabledTermPeriods = useMemo(() => {
    if (!termPeriods)
      return { FIRST: false, SECOND: false, THIRD: false, FOURTH: false };

    return termPeriods.reduce<Record<SchoolTerm, boolean>>(
      (acc, item) => {
        const { school_term, date_end } = item;
        const parsedDateEnd = parseISO(date_end);

        return { ...acc, [school_term]: isBefore(new Date(), parsedDateEnd) };
      },
      { FIRST: false, SECOND: false, THIRD: false, FOURTH: false }
    );
  }, [termPeriods]);

  const handleSubmit = (values: SchoolReportsValues) => {
    const requestItems = Object.entries(values).map(([key, value]) => {
      const reports = Object.entries(value).map(([enroll_id, average]) => ({
        enroll_id,
        average
      }));

      return {
        school_subject_id: query.school_subject,
        school_term: key,
        reports
      };
    });

    requestItems.forEach((item) => registerSchoolReports.mutate(item));
  };

  const canChangeSchoolReport = useMemo(
    () => enableAccess({ module: 'SCHOOL_REPORT', rule: 'WRITE' }),
    [enableAccess]
  );

  return (
    <Base>
      <Heading>Notas</Heading>

      <S.Wrapper>
        <S.Grid>
          <S.GridItem>
            <strong>Turma:</strong>
            <span>{classroom?.description}</span>
          </S.GridItem>
          <S.GridItem>
            <strong>Disciplina:</strong>
            <span>{schoolSubject?.description}</span>
          </S.GridItem>
        </S.Grid>
      </S.Wrapper>

      <S.TableSection>
        <S.Form onSubmit={handleSubmit}>
          <S.SectionTitle>
            <h4>Notas</h4>
          </S.SectionTitle>
          <Table<MappedSchoolReportEnroll>
            items={mappedSchoolReports}
            keyExtractor={(value) => value.enroll.id}
          >
            <TableColumn label="Aluno" tableKey="enroll.person.name" />
            <TableColumn
              label="1 Bimestre"
              tableKey="FIRST"
              contentAlign={canChangeSchoolReport ? undefined : 'center'}
              actionColumn
              render={(item: MappedSchoolReportEnroll) =>
                canChangeSchoolReport ? (
                  <S.InputContainer
                    isDisabled={!enabledTermPeriods.FIRST}
                    message={isLoading ? 'Carregando...' : 'Bimestre fechado'}
                  >
                    <TextInput
                      label=""
                      size="medium"
                      mask="school-report"
                      disabled={!enabledTermPeriods.FIRST}
                      containerStyle={{ maxWidth: 80 }}
                      name={`FIRST.${item.enroll.id}`}
                      value={item.FIRST !== '-' ? item.FIRST : undefined}
                    />
                  </S.InputContainer>
                ) : (
                  item.FIRST
                )
              }
            />
            <TableColumn
              label="2 Bimestre"
              tableKey="SECOND"
              contentAlign={canChangeSchoolReport ? undefined : 'center'}
              actionColumn
              render={(item: MappedSchoolReportEnroll) =>
                canChangeSchoolReport ? (
                  <S.InputContainer
                    isDisabled={!enabledTermPeriods.SECOND}
                    message={isLoading ? 'Carregando...' : 'Bimestre fechado'}
                  >
                    <TextInput
                      label=""
                      size="medium"
                      mask="school-report"
                      disabled={!enabledTermPeriods.SECOND}
                      containerStyle={{ maxWidth: 80 }}
                      name={`SECOND.${item.enroll.id}`}
                      value={item.SECOND !== '-' ? item.SECOND : undefined}
                    />
                  </S.InputContainer>
                ) : (
                  item.SECOND
                )
              }
            />
            <TableColumn
              label="3 Bimestre"
              tableKey="THIRD"
              contentAlign={canChangeSchoolReport ? undefined : 'center'}
              actionColumn
              render={(item: MappedSchoolReportEnroll) =>
                canChangeSchoolReport ? (
                  <S.InputContainer
                    isDisabled={!enabledTermPeriods.THIRD}
                    message={isLoading ? 'Carregando...' : 'Bimestre fechado'}
                  >
                    <TextInput
                      label=""
                      size="medium"
                      mask="school-report"
                      disabled={!enabledTermPeriods.THIRD}
                      containerStyle={{ maxWidth: 80 }}
                      name={`THIRD.${item.enroll.id}`}
                      value={item.THIRD !== '-' ? item.THIRD : undefined}
                    />
                  </S.InputContainer>
                ) : (
                  item.THIRD
                )
              }
            />
            <TableColumn
              label="4 Bimestre"
              tableKey="FOURTH"
              contentAlign={canChangeSchoolReport ? undefined : 'center'}
              actionColumn
              render={(item: MappedSchoolReportEnroll) =>
                canChangeSchoolReport ? (
                  <S.InputContainer
                    isDisabled={!enabledTermPeriods.FOURTH}
                    message={isLoading ? 'Carregando...' : 'Bimestre fechado'}
                  >
                    <TextInput
                      label=""
                      size="medium"
                      mask="school-report"
                      disabled={!enabledTermPeriods.FOURTH}
                      containerStyle={{ maxWidth: 80 }}
                      name={`FOURTH.${item.enroll.id}`}
                      value={item.FOURTH !== '-' ? item.FOURTH : undefined}
                    />
                  </S.InputContainer>
                ) : (
                  item.FOURTH
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
    </Base>
  );
};

export default SchoolReportsTemplate;
