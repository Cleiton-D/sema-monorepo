import { useRouter } from 'next/router';
import { useSession } from 'next-auth/client';

import Base from 'templates/Base';

import Heading from 'components/Heading';
import SchoolReportTable from 'components/SchoolReportTable';

import { useGetEnrollDetails } from 'requests/queries/enrolls';

import { translateStatus } from 'utils/translateStatus';
import { translateDescription } from 'utils/mappers/classPeriodMapper';
import { translateContactType } from 'utils/mappers/contactsMapper';

import * as S from './styles';

const StudentPageTemplate = () => {
  const { query } = useRouter();
  const [session] = useSession();

  const { data: enroll } = useGetEnrollDetails(
    query.enroll_id as string,
    session
  );

  return (
    <Base>
      <Heading>Perfil do aluno</Heading>
      <S.Wrapper>
        <div>
          <S.StudentName size="md" color="primary">
            {enroll?.person.name}
          </S.StudentName>
          <S.LightText>
            Responsáveis:{' '}
            {enroll?.person.dad_name && `${enroll.person.dad_name}, `}{' '}
            {enroll?.person.mother_name}
          </S.LightText>
        </div>
        <S.Details>
          <S.Grid>
            <S.GridItem>
              <strong>Série</strong>
              <span>{enroll?.grade?.description}</span>
            </S.GridItem>
            <S.GridItem>
              <strong>Turma</strong>
              <span>{enroll?.current_classroom.description}</span>
            </S.GridItem>
            <S.GridItem>
              <strong>Turno</strong>
              <span>
                {enroll?.current_classroom.class_period &&
                  translateDescription(
                    enroll?.current_classroom.class_period.description
                  )}
              </span>
            </S.GridItem>
            <S.GridItem>
              <strong>Situação</strong>
              <span>{enroll?.status && translateStatus(enroll.status)}</span>
            </S.GridItem>
          </S.Grid>
          <S.Divider style={{ marginTop: 24 }} />
          <S.Section>
            <h2>Endereço</h2>
            <S.Grid>
              <S.GridItem>
                <strong>Logradouro</strong>
                <span>{enroll?.person.address?.street}</span>
              </S.GridItem>

              <S.GridItem>
                <strong>Número</strong>
                <span>{enroll?.person.address?.house_number}</span>
              </S.GridItem>

              <S.GridItem>
                <strong>Bairro</strong>
                <span>{enroll?.person.address?.district}</span>
              </S.GridItem>

              <S.GridItem>
                <strong>Cidade</strong>
                <span>{enroll?.person.address?.city}</span>
              </S.GridItem>

              <S.GridItem>
                <strong>Região</strong>
                <span>{enroll?.person.address?.region}</span>
              </S.GridItem>
            </S.Grid>
          </S.Section>
          {enroll?.person.contacts.length !== 0 && (
            <>
              <S.Section style={{ marginTop: 24 }}>
                <h2>Contatos</h2>
              </S.Section>
              <S.Grid>
                {enroll?.person.contacts.map((contact) => (
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
        </S.SectionTitle>
        <SchoolReportTable enrollId={query.enroll_id as string} />
      </S.TableSection>
    </Base>
  );
};

export default StudentPageTemplate;
