import { useMemo, useRef } from 'react';
import { useSession } from 'next-auth/client';
import { Edit, PlusSquare } from '@styled-icons/feather';

import Base from 'templates/Base';

import EmployeeSection from 'components/EmployeeSection';
import Heading from 'components/Heading';
import MunicipalSecretaryEmployeeModal, {
  MunicipalSecretaryEmployeeModalRef
} from 'components/MunicipalSecretaryEmployeeModal';

import { useAccess } from 'hooks/AccessProvider';
import { useShowBranch } from 'requests/queries/branch';
import { useShowEmployee } from 'requests/queries/employee';

import * as S from './styles';

const MunicipalSecretary = () => {
  const modalRef = useRef<MunicipalSecretaryEmployeeModalRef>(null);

  const { enableAccess } = useAccess();

  const [session] = useSession();
  const { data: branch } = useShowBranch(session, {
    type: 'MUNICIPAL_SECRETARY'
  });
  const { data: municipalSecretary, refetch } = useShowEmployee(session, {
    branch_id: branch?.id,
    accessCode: 'municipal-secretary'
  });

  const canEditMunicipalSecretary = useMemo(
    () =>
      enableAccess({
        module: 'MUNICIPAL_SECRETARY_EMPLOYEE',
        rule: 'WRITE'
      }),
    []
  );

  return (
    <Base>
      <Heading>Secretaria Municipal de Educação</Heading>
      <S.Wrapper>
        {branch && (
          <>
            <S.Secretary>
              <div>
                <Heading as="strong" size="md" color="primary">
                  Secretário
                </Heading>
                {municipalSecretary ? (
                  <span>{municipalSecretary?.person.name}</span>
                ) : (
                  <>
                    {canEditMunicipalSecretary ? (
                      <S.HeaderActionButton
                        onClick={() => modalRef.current?.openModal()}
                      >
                        Definir Secretário Municipal <PlusSquare size={16} />
                      </S.HeaderActionButton>
                    ) : (
                      <span>Não definido</span>
                    )}
                  </>
                )}
              </div>
              {municipalSecretary && canEditMunicipalSecretary && (
                <S.HeaderActionButton
                  onClick={() =>
                    modalRef.current?.openModal(municipalSecretary)
                  }
                >
                  Alterar Secretário Municipal <Edit size={16} />
                </S.HeaderActionButton>
              )}
            </S.Secretary>
            <S.EmployeesSection>
              <S.Section style={{ marginTop: 24 }}>
                <EmployeeSection
                  title="Coordenação Pedagógica"
                  name="servidor"
                  pluralName="servidores"
                  buttonText="Adicionar"
                  profileCode="pedagogical-coordination"
                  branchId={branch.id}
                  moduleName="MUNICIPAL_SECRETARY"
                />
              </S.Section>
              <S.Section style={{ marginTop: 24 }}>
                <EmployeeSection
                  title="Escrituração"
                  name="servidor"
                  pluralName="servidores"
                  buttonText="Adicionar"
                  profileCode="bookkeeping"
                  branchId={branch.id}
                  moduleName="MUNICIPAL_SECRETARY"
                />
              </S.Section>
            </S.EmployeesSection>
            <MunicipalSecretaryEmployeeModal
              branchId={branch.id}
              refetchFn={refetch}
              ref={modalRef}
            />
          </>
        )}
      </S.Wrapper>
    </Base>
  );
};

export default MunicipalSecretary;
