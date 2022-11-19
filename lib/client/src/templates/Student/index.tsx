import { useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { Edit, Printer } from '@styled-icons/feather';
import format from 'date-fns/format';

import Base from 'templates/Base';

import Heading from 'components/Heading';
import SchoolReportTable from 'components/SchoolReportTable';
import Button from 'components/Button';

import { useAccess } from 'hooks/AccessProvider';

import { useGetEnrollDetails } from 'requests/queries/enrolls';

import { translateStatus } from 'utils/translateStatus';
import { translateDescription } from 'utils/mappers/classPeriodMapper';
import { translateContactType } from 'utils/mappers/contactsMapper';
import { parseDateWithoutTimezone } from 'utils/parseDateWithoutTimezone';

import * as S from './styles';

const StudentPageTemplate = () => {
  const { enableAccess } = useAccess();

  const { query } = useRouter();
  const { data: session } = useSession();

  const { data: enroll } = useGetEnrollDetails(
    query.enroll_id as string,
    session
  );

  const canEditEnroll = useMemo(
    () => enableAccess({ module: 'ENROLL', rule: 'WRITE' }),
    [enableAccess]
  );

  return (
    <Base>
      <Heading>Detalhes do aluno</Heading>
      {enroll && canEditEnroll && (
        <S.EditButtonContainer>
          <Link href={`/auth/student/${enroll.id}/edit`} passHref>
            <Button styleType="normal" size="medium" icon={<Edit />} as="a">
              Editar aluno
            </Button>
          </Link>
        </S.EditButtonContainer>
      )}
      <S.Wrapper>
        <div>
          <S.StudentName size="md" color="primary">
            {enroll?.student.name}
          </S.StudentName>
          <S.LightText>
            Responsáveis:{' '}
            {enroll?.student.dad_name && `${enroll.student.dad_name}, `}{' '}
            {enroll?.student.mother_name}
          </S.LightText>
        </div>
        <S.Details>
          <S.Grid>
            <S.GridItem>
              <strong>Código único</strong>
              <span>{enroll?.student?.unique_code}</span>
            </S.GridItem>
            <S.GridItem>
              <strong>NIS</strong>
              <span>{enroll?.student?.nis}</span>
            </S.GridItem>
            <S.GridItem>
              <strong>Série</strong>
              <span>{enroll?.grade?.description}</span>
            </S.GridItem>
            <S.GridItem>
              <strong>Turma</strong>
              <span>{enroll?.current_classroom?.description}</span>
            </S.GridItem>
            <S.GridItem>
              <strong>Turno</strong>
              <span>
                {enroll?.class_period &&
                  translateDescription(enroll?.class_period.description)}
              </span>
            </S.GridItem>
            <S.GridItem>
              <strong>Data da Matrícula</strong>
              <span>
                {enroll?.enroll_date &&
                  format(
                    parseDateWithoutTimezone(enroll?.enroll_date),
                    'dd/MM/yyyy'
                  )}
              </span>
            </S.GridItem>
            <S.GridItem>
              <strong>Situação</strong>
              <span>{enroll?.status && translateStatus(enroll.status)}</span>
            </S.GridItem>

            {enroll?.status === 'TRANSFERRED' && !!enroll.transfer_date && (
              <S.GridItem>
                <strong>Data da Transferência</strong>
                <span>
                  {format(
                    parseDateWithoutTimezone(enroll.transfer_date),
                    'dd/MM/yyyy'
                  )}
                </span>
              </S.GridItem>
            )}
          </S.Grid>
          <S.Divider style={{ marginTop: 24 }} />
          <S.Section>
            <h2>Endereço</h2>
            <S.Grid>
              <S.GridItem>
                <strong>Logradouro</strong>
                <span>{enroll?.student.address?.street}</span>
              </S.GridItem>

              <S.GridItem>
                <strong>Número</strong>
                <span>{enroll?.student.address?.house_number}</span>
              </S.GridItem>

              <S.GridItem>
                <strong>Bairro</strong>
                <span>{enroll?.student.address?.district}</span>
              </S.GridItem>

              <S.GridItem>
                <strong>Cidade</strong>
                <span>{enroll?.student.address?.city}</span>
              </S.GridItem>

              <S.GridItem>
                <strong>Região</strong>
                <span>{enroll?.student.address?.region}</span>
              </S.GridItem>
            </S.Grid>
          </S.Section>
          {enroll?.student.contacts.length !== 0 && (
            <>
              <S.Section style={{ marginTop: 24 }}>
                <h2>Contatos</h2>
              </S.Section>
              <S.Grid>
                {enroll?.student.contacts.map((contact) => (
                  <S.GridItem key={contact.id}>
                    <strong>{translateContactType(contact.type)}</strong>
                    <span>{contact.description}</span>
                  </S.GridItem>
                ))}
              </S.Grid>
            </>
          )}
        </S.Details>
      </S.Wrapper>

      <S.TableSection>
        <S.SectionTitle>
          <h4>Boletim</h4>

          <Link
            href={{
              pathname: '/auth/exports/school-reports',
              query: {
                enroll_id: enroll?.id
              }
            }}
            passHref
          >
            <S.LightLink target="_blank">
              <Printer
                size={18}
                style={{ strokeWidth: 2, marginRight: '0.5rem' }}
              />
              Imprimir boletim
            </S.LightLink>
          </Link>
        </S.SectionTitle>
        <SchoolReportTable enrollId={query.enroll_id as string} isMininal />
      </S.TableSection>
    </Base>
  );
};

export default StudentPageTemplate;
