import { useMemo } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/client';
import { PlusCircle, Edit3 } from '@styled-icons/feather';

import Base from 'templates/Base';

import Heading from 'components/Heading';
import Badge from 'components/Badge';
import Button from 'components/Button';

import { useAccess } from 'hooks/AccessProvider';

import { useSchoolYearWithSchoolTerms } from 'requests/queries/school-year';

import * as S from './styles';

const SchoolYear = () => {
  const { enableAccess } = useAccess();

  const [session] = useSession();
  const { data: schoolYear } = useSchoolYearWithSchoolTerms(session);

  const { push } = useRouter();

  const handleAddSchoolYear = () => {
    if (schoolYear?.status === 'PENDING') {
      push(`/administration/school-year/${schoolYear.id}/edit`);
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
            icon={schoolYear?.status === 'PENDING' ? <Edit3 /> : <PlusCircle />}
            onClick={handleAddSchoolYear}
            disabled={schoolYear?.status === 'ACTIVE'}
          >
            {schoolYear?.status === 'PENDING'
              ? 'Alterar ano letivo'
              : 'Cadastrar ano letivo'}
          </Button>
        </S.AddButtonContainer>
      )}

      <S.Wrapper>
        {schoolYear?.id ? (
          <>
            <S.Grid columns={3}>
              <S.GridItem>
                <strong>Data de Início</strong>
                <span>{schoolYear?.formattedDateStart}</span>
              </S.GridItem>
              <S.GridItem>
                <strong>Data de Término</strong>
                <span>{schoolYear?.formattedDateEnd}</span>
              </S.GridItem>
              <S.GridItem>
                <strong>Status</strong>
                {schoolYear?.status && (
                  <Badge
                    styledType={
                      schoolYear.status === 'ACTIVE'
                        ? 'green'
                        : schoolYear.status === 'INACTIVE'
                        ? 'red'
                        : 'orange'
                    }
                  >
                    {schoolYear?.translatedStatus}
                  </Badge>
                )}
              </S.GridItem>
            </S.Grid>

            {schoolYear?.schoolTermPeriods && (
              <>
                <S.Divider style={{ marginTop: 24 }} />
                <S.Grid columns={4} gap={20} style={{ marginTop: 24 }}>
                  {schoolYear.schoolTermPeriods.FIRST && (
                    <S.SchoolTermContainer>
                      <strong>1º Bimestre</strong>
                      <div>
                        <div>
                          <strong>Início:</strong>
                          <span>
                            {
                              schoolYear?.schoolTermPeriods.FIRST
                                ?.formattedDateStart
                            }
                          </span>
                        </div>
                        <div>
                          <strong>Fim:</strong>
                          <span>
                            {
                              schoolYear?.schoolTermPeriods.FIRST
                                ?.formattedDateEnd
                            }
                          </span>
                        </div>
                      </div>
                    </S.SchoolTermContainer>
                  )}
                  {schoolYear.schoolTermPeriods.SECOND && (
                    <S.SchoolTermContainer>
                      <strong>2º Bimestre</strong>
                      <div>
                        <div>
                          <strong>Início:</strong>
                          <span>
                            {
                              schoolYear.schoolTermPeriods.SECOND
                                .formattedDateStart
                            }
                          </span>
                        </div>
                        <div>
                          <strong>Fim:</strong>
                          <span>
                            {
                              schoolYear.schoolTermPeriods.SECOND
                                .formattedDateEnd
                            }
                          </span>
                        </div>
                      </div>
                    </S.SchoolTermContainer>
                  )}

                  {schoolYear.schoolTermPeriods.THIRD && (
                    <S.SchoolTermContainer>
                      <strong>3º Bimestre</strong>
                      <div>
                        <div>
                          <strong>Início:</strong>
                          <span>
                            {
                              schoolYear.schoolTermPeriods.THIRD
                                .formattedDateStart
                            }
                          </span>
                        </div>
                        <div>
                          <strong>Fim:</strong>
                          <span>
                            {
                              schoolYear.schoolTermPeriods.THIRD
                                .formattedDateEnd
                            }
                          </span>
                        </div>
                      </div>
                    </S.SchoolTermContainer>
                  )}

                  {schoolYear.schoolTermPeriods.FOURTH && (
                    <S.SchoolTermContainer>
                      <strong>4º Bimestre</strong>
                      <div>
                        <div>
                          <strong>Início:</strong>
                          <span>
                            {
                              schoolYear.schoolTermPeriods.FOURTH
                                .formattedDateStart
                            }
                          </span>
                        </div>
                        <div>
                          <strong>Fim:</strong>
                          <span>
                            {
                              schoolYear.schoolTermPeriods.FOURTH
                                .formattedDateEnd
                            }
                          </span>
                        </div>
                      </div>
                    </S.SchoolTermContainer>
                  )}
                </S.Grid>
              </>
            )}
          </>
        ) : (
          <>
            <S.Message>
              Ainda não temos nenhum ano letivo cadastrado, clique no botão
              &quot;Cadastrar ano letivo&quot; para adicionar um novo ano
              letivo.
            </S.Message>
          </>
        )}
      </S.Wrapper>
    </Base>
  );
};

export default SchoolYear;
