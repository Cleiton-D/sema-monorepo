import { useMemo, useRef } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { PlusCircle, Edit3, Power } from '@styled-icons/feather';

import Base from 'templates/Base';

import Heading from 'components/Heading';
import Badge from 'components/Badge';
import Button from 'components/Button';
import Table from 'components/Table';
import TableColumn from 'components/TableColumn';
import ChangeSchoolTermModal, {
  ChangeSchoolTermModalRef
} from 'components/ChangeSchoolTermModal';

import { SchoolTermPeriod } from 'models/SchoolTermPeriod';

import { useAccess } from 'hooks/AccessProvider';

import { useSchoolYearWithSchoolTerms } from 'requests/queries/school-year';
import { useUpdateSchoolTermPeriod } from 'requests/mutations/school-term-periods';

import * as S from './styles';

const SchoolYear = () => {
  const modalRef = useRef<ChangeSchoolTermModalRef>(null);

  const { enableAccess } = useAccess();

  const { data: session } = useSession();
  const { data: schoolYear, refetch } = useSchoolYearWithSchoolTerms(session);
  const updateSchoolTermPeriod = useUpdateSchoolTermPeriod();

  const { push } = useRouter();

  const handleAddSchoolYear = () => {
    if (schoolYear?.status === 'PENDING') {
      push(`/auth/administration/school-year/${schoolYear.id}/edit`);
      return;
    }
    push('/auth/administration/school-year/new');
  };

  const getActionTitle = (item: SchoolTermPeriod) => {
    return {
      ACTIVE: 'Encerrar',
      FINISH: 'Reabrir',
      PENDING: 'Iniciar'
    }[item.status];
  };

  const updateSchoolTerm = async (item: SchoolTermPeriod) => {
    const title = getActionTitle(item);
    const confirm = window.confirm(`Deseja ${title} esse período?`);
    if (!confirm) return;

    const newStatus = {
      ACTIVE: 'FINISH',
      FINISH: 'ACTIVE',
      PENDING: 'ACTIVE'
    }[item.status];

    await updateSchoolTermPeriod.mutateAsync({
      id: item.id,
      status: newStatus,
      manually_changed: true
    });
    refetch();
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

      {schoolYear?.schoolTermPeriods && (
        <S.TableSection>
          <S.SectionTitle>
            <h4>Períodos</h4>
          </S.SectionTitle>
          {/* <S.Divider style={{ marginTop: 24 }} /> */}

          <Table
            items={schoolYear.schoolTermPeriodsArray || []}
            keyExtractor={(value) => value.id}
          >
            <TableColumn label="Descrição" tableKey="translatedDescription" />
            <TableColumn label="Início" tableKey="formattedDateStart" />
            <TableColumn label="Término" tableKey="formattedDateEnd" />
            <TableColumn label="Status" tableKey="translatedStatus" />
            <TableColumn
              label="Ações"
              tableKey="actions"
              contentAlign="center"
              actionColumn
              module="SCHOOL_YEAR"
              rule="WRITE"
              render={(item: SchoolTermPeriod) => (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <S.ActionButton
                    type="button"
                    title="Alterar"
                    style={{ right: 0 }}
                    onClick={() => modalRef.current?.openModal(item)}
                  >
                    <Edit3 size={20} color="#0393BE" />
                  </S.ActionButton>

                  <S.ActionButton
                    type="button"
                    title={getActionTitle(item)}
                    onClick={() => updateSchoolTerm(item)}
                  >
                    <Power
                      size={20}
                      color="#0393BE"
                      title={getActionTitle(item)}
                    />
                  </S.ActionButton>
                </div>
              )}
            />
          </Table>
        </S.TableSection>
      )}
      <ChangeSchoolTermModal ref={modalRef} />
    </Base>
  );
};

export default SchoolYear;
