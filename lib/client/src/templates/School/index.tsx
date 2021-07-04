import { useRef, useMemo } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useSession } from 'next-auth/client';
import { Edit3, Edit, PlusSquare } from '@styled-icons/feather';

import Base from 'templates/Base';

import Heading from 'components/Heading';
import Button from 'components/Button';
import SchoolDirectoryModal, {
  SchoolDirectoryModalRef
} from 'components/SchoolDirectoryModal';
import EmployeeSection from 'components/EmployeeSection';

import { useAccess } from 'hooks/AccessProvider';

import { School } from 'models/School';

import { useGetSchoolDetail } from 'requests/queries/schools';

import { translateContactType } from 'utils/mappers/contactsMapper';

import * as S from './styles';

export type SchoolProps = {
  school: School;
};
const SchoolPageTemplate = ({ school }: SchoolProps) => {
  const schoolDiretoryModalRef = useRef<SchoolDirectoryModalRef>(null);

  const { enableAccess } = useAccess();

  const [session] = useSession();
  const { query } = useRouter();

  const { data: schoolDetail, refetch } = useGetSchoolDetail(
    school.id,
    session
  );

  const canChangeSchoolDirectory = useMemo(
    () => enableAccess({ module: 'SCHOOL-EMPLOYEE', rule: 'WRITE' }),
    [enableAccess]
  );

  const canAccessEnrolls = useMemo(() => enableAccess({ module: 'ENROLL' }), [
    enableAccess
  ]);

  const canAccessClassrooms = useMemo(
    () => enableAccess({ module: 'CLASSROOM' }),
    [enableAccess]
  );

  return (
    <Base>
      <Heading>Escola</Heading>
      {/* <S.AddButtonContainer>
        <Link href={`/school/${query.school_id}/edit`} passHref>
          <Button as="a" size="medium" styleType="normal" icon={<Edit3 />}>
            Alterar dados
          </Button>
        </Link>
      </S.AddButtonContainer> */}

      <S.Wrapper>
        <div>
          <S.SchoolName size="md" color="primary">
            {schoolDetail?.name}
          </S.SchoolName>
          <S.LightText>Código do INEP: {schoolDetail?.inep_code}</S.LightText>
        </div>
        <S.Details>
          <S.Grid>
            {canAccessEnrolls ? (
              <Link href={`/enrolls?school_id=${query.school_id}`}>
                <S.LinkGridItem>
                  <strong>Alunos ativos</strong>
                  <span>{schoolDetail?.enroll_count}</span>
                </S.LinkGridItem>
              </Link>
            ) : (
              <S.GridItem>
                <strong>Alunos ativos</strong>
                <span>{schoolDetail?.enroll_count}</span>
              </S.GridItem>
            )}

            {canAccessClassrooms ? (
              <Link href={`/school/${query.school_id}/classrooms`}>
                <S.LinkGridItem>
                  <strong>Turmas</strong>
                  <span>{schoolDetail?.classrooms_count}</span>
                </S.LinkGridItem>
              </Link>
            ) : (
              <S.GridItem>
                <strong>Turmas</strong>
                <span>{schoolDetail?.classrooms_count}</span>
              </S.GridItem>
            )}
          </S.Grid>
          <S.Divider style={{ marginTop: 24 }} />
          <S.Section>
            <h2>Endereço</h2>
            <S.Grid>
              <S.GridItem>
                <strong>Logradouro</strong>
                <span>{schoolDetail?.address.street}</span>
              </S.GridItem>

              <S.GridItem>
                <strong>Número</strong>
                <span>{schoolDetail?.address.house_number}</span>
              </S.GridItem>

              <S.GridItem>
                <strong>Bairro</strong>
                <span>{schoolDetail?.address.district}</span>
              </S.GridItem>

              <S.GridItem>
                <strong>Cidade</strong>
                <span>{schoolDetail?.address.city}</span>
              </S.GridItem>

              <S.GridItem>
                <strong>Região</strong>
                <span>{schoolDetail?.address.region}</span>
              </S.GridItem>
            </S.Grid>
          </S.Section>
          <S.Section style={{ marginTop: 24 }}>
            <h2>Contatos</h2>
          </S.Section>
          <S.Grid>
            {schoolDetail?.contacts.map((contact) => (
              <S.GridItem key={contact.id}>
                <strong>{translateContactType(contact.type)}</strong>
                <span>{contact.description}</span>
              </S.GridItem>
            ))}
          </S.Grid>
        </S.Details>
      </S.Wrapper>

      <S.Wrapper>
        <S.SectionTitle>
          <h1>Administração</h1>
        </S.SectionTitle>

        <S.Section style={{ marginTop: 24, width: '75%' }}>
          <S.AdminTitle>
            <h2>Diretoria</h2>
            {canChangeSchoolDirectory && (
              <S.HeaderActionButton
                onClick={() => schoolDiretoryModalRef.current?.openModal()}
              >
                Alterar diretoria <Edit size={16} />
              </S.HeaderActionButton>
            )}
          </S.AdminTitle>

          <S.Grid>
            <S.GridItem>
              <strong>Diretor(a)</strong>
              <span>{schoolDetail?.director?.person.name}</span>
            </S.GridItem>
            <S.GridItem>
              <strong>Vice-diretor(a)</strong>
              <span>{schoolDetail?.vice_director?.person.name}</span>
            </S.GridItem>
          </S.Grid>
        </S.Section>

        <S.EmployeesSection>
          <S.Section style={{ marginTop: 24 }}>
            <EmployeeSection
              title="Secretários"
              name="secretário"
              pluralName="secretários"
              buttonText="Adicionar Secretário"
              profileCode="school-secretary"
              moduleName="SCHOOL"
              branchId={schoolDetail?.branch_id || school.branch_id}
            />
          </S.Section>

          <S.Section style={{ marginTop: 24 }}>
            <EmployeeSection
              title="Supervisores"
              name="supervisor"
              pluralName="supervisores"
              buttonText="Adicionar Supervisor"
              profileCode="supervisor"
              moduleName="SCHOOL"
              branchId={schoolDetail?.branch_id || school.branch_id}
            />
          </S.Section>

          <S.Section style={{ marginTop: 24 }}>
            <EmployeeSection
              title="Orientadores"
              name="orientador"
              pluralName="orientadores"
              buttonText="Adicionar Orientador"
              profileCode="advisor"
              moduleName="SCHOOL"
              branchId={schoolDetail?.branch_id || school.branch_id}
            />
          </S.Section>
        </S.EmployeesSection>
      </S.Wrapper>

      <SchoolDirectoryModal
        ref={schoolDiretoryModalRef}
        school={schoolDetail || school}
        refetchFn={refetch}
      />
    </Base>
  );
};

export default SchoolPageTemplate;
