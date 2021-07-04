import { useMemo } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/client';
import { PlusCircle, Edit3 } from '@styled-icons/feather';

import Base from 'templates/Base';

import Heading from 'components/Heading';
import Badge from 'components/Badge';
import ClassPeriodsTable from 'components/ClassPeriodsTable';
import Button from 'components/Button';

import { useAccess } from 'hooks/AccessProvider';

import { useSchoolYearWithSchoolTerms } from 'requests/queries/school-year';

import * as S from './styles';

const SchoolYear = () => {
  const { enableAccess } = useAccess();

  const [session] = useSession();
  const { data } = useSchoolYearWithSchoolTerms(session);

  const { push } = useRouter();

  const handleAddSchoolYear = () => {
    if (data?.status === 'PENDING') {
      push(`/administration/school-year/${data.id}/edit`);
      return;
    }

    push('/administration/school-year/new');
  };

  const canEditSchoolYear = useMemo(
    () => enableAccess({ module: 'SCHOOL_YEAR', rule: 'WRITE' }),
    [enableAccess]
  );

  return (
    <Base>
      <Heading>Ano Letivo</Heading>
      {canEditSchoolYear && (
        <S.AddButtonContainer>
          <Button
            size="medium"
            styleType="normal"
            icon={data?.status !== 'INACTIVE' ? <Edit3 /> : <PlusCircle />}
            onClick={handleAddSchoolYear}
            disabled={data?.status === 'ACTIVE'}
          >
            {data?.status !== 'INACTIVE'
              ? 'Alterar ano letivo'
              : 'Cadastrar ano letivo'}
          </Button>
        </S.AddButtonContainer>
      )}

      <S.Wrapper>
        <S.Grid columns={3}>
          <S.GridItem>
            <strong>Data de Início</strong>
            <span>{data?.formattedDateStart}</span>
          </S.GridItem>
          <S.GridItem>
            <strong>Data de Término</strong>
            <span>{data?.formattedDateEnd}</span>
          </S.GridItem>
          <S.GridItem>
            <strong>Status</strong>
            {data?.status && (
              <Badge
                styledType={
                  data.status === 'ACTIVE'
                    ? 'green'
                    : data.status === 'INACTIVE'
                    ? 'red'
                    : 'orange'
                }
              >
                {data?.translatedStatus}
              </Badge>
            )}
          </S.GridItem>
        </S.Grid>

        {data?.schoolTermPeriods && (
          <>
            <S.Divider style={{ marginTop: 24 }} />
            <S.Grid columns={4} gap={20} style={{ marginTop: 24 }}>
              {data.schoolTermPeriods.FIRST && (
                <S.SchoolTermContainer>
                  <strong>1º Bimestre</strong>
                  <div>
                    <div>
                      <strong>Início:</strong>
                      <span>
                        {data?.schoolTermPeriods.FIRST?.formattedDateStart}
                      </span>
                    </div>
                    <div>
                      <strong>Fim:</strong>
                      <span>
                        {data?.schoolTermPeriods.FIRST?.formattedDateEnd}
                      </span>
                    </div>
                  </div>
                </S.SchoolTermContainer>
              )}
              {data.schoolTermPeriods.SECOND && (
                <S.SchoolTermContainer>
                  <strong>2º Bimestre</strong>
                  <div>
                    <div>
                      <strong>Início:</strong>
                      <span>
                        {data.schoolTermPeriods.SECOND.formattedDateStart}
                      </span>
                    </div>
                    <div>
                      <strong>Fim:</strong>
                      <span>
                        {data.schoolTermPeriods.SECOND.formattedDateEnd}
                      </span>
                    </div>
                  </div>
                </S.SchoolTermContainer>
              )}

              {data.schoolTermPeriods.THIRD && (
                <S.SchoolTermContainer>
                  <strong>3º Bimestre</strong>
                  <div>
                    <div>
                      <strong>Início:</strong>
                      <span>
                        {data.schoolTermPeriods.THIRD.formattedDateStart}
                      </span>
                    </div>
                    <div>
                      <strong>Fim:</strong>
                      <span>
                        {data.schoolTermPeriods.THIRD.formattedDateEnd}
                      </span>
                    </div>
                  </div>
                </S.SchoolTermContainer>
              )}

              {data.schoolTermPeriods.FOURTH && (
                <S.SchoolTermContainer>
                  <strong>4º Bimestre</strong>
                  <div>
                    <div>
                      <strong>Início:</strong>
                      <span>
                        {data.schoolTermPeriods.FOURTH.formattedDateStart}
                      </span>
                    </div>
                    <div>
                      <strong>Fim:</strong>
                      <span>
                        {data.schoolTermPeriods.FOURTH.formattedDateEnd}
                      </span>
                    </div>
                  </div>
                </S.SchoolTermContainer>
              )}
            </S.Grid>
          </>
        )}
      </S.Wrapper>

      <S.TableSection>
        <S.SectionTitle>
          <h4>Períodos</h4>
        </S.SectionTitle>
        <ClassPeriodsTable classPeriods={data?.classPeriods || []} />
      </S.TableSection>
    </Base>
  );
};

export default SchoolYear;
