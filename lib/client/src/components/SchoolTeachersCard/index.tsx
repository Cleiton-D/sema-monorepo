import { useRef, useMemo } from 'react';
import { X } from '@styled-icons/feather';

import Button from 'components/Button';
import ListItem from 'components/ListItem';
import AddTeacherToSchoolModal, {
  AddTeacherToSchoolModalRef
} from 'components/AddTeacherToSchoolModal';

import { useAccess } from 'hooks/AccessProvider';

import { SchoolTeacher } from 'models/SchoolTeacher';

import { useListSchoolTeachers } from 'requests/queries/school-teachers';
import { useSessionSchoolYear } from 'requests/queries/session';
import { useDeleteSchoolTeacher } from 'requests/mutations/school-teacher';

import * as S from './styles';

type SchoolTeachersCardProps = {
  schoolId?: string;
};

const SchoolTeachersCard = ({ schoolId }: SchoolTeachersCardProps) => {
  const modalRef = useRef<AddTeacherToSchoolModalRef>(null);

  const { enableAccess } = useAccess();

  const { data: schoolYear } = useSessionSchoolYear();
  const {
    data: schoolTeachers,
    isLoading,
    refetch
  } = useListSchoolTeachers({
    school_id: schoolId,
    school_year_id: schoolYear?.id
  });
  const deleteSchoolTeacher = useDeleteSchoolTeacher();

  const handleRemove = async (schoolTeacher: SchoolTeacher) => {
    const confirm = window.confirm(
      `Deseja remover o professor ${schoolTeacher.employee.name}?`
    );

    if (confirm) {
      await deleteSchoolTeacher.mutateAsync(schoolTeacher);
      refetch();
    }
  };

  const canChangeSchoolTeacher = useMemo(
    () => enableAccess({ module: 'SCHOOL_TEACHER', rule: 'WRITE' }),
    [enableAccess]
  );

  return (
    <S.Wrapper>
      <S.Section>
        <S.SectionTitle>
          <h4>Professores</h4>
          {canChangeSchoolTeacher && schoolId && schoolTeachers && (
            <Button size="small" onClick={() => modalRef.current?.openModal()}>
              Adicionar professor
            </Button>
          )}
        </S.SectionTitle>
        {schoolId ? (
          <S.ListSection>
            {schoolTeachers ? (
              <>
                {schoolTeachers.length ? (
                  <S.List>
                    {schoolTeachers.map((schoolTeacher) => (
                      <ListItem key={schoolTeacher.id}>
                        <S.ItemContent>
                          <span>{schoolTeacher.employee.name}</span>

                          {canChangeSchoolTeacher && (
                            <S.ActionButton
                              title={`Remover ${schoolTeacher.employee.name}`}
                              onClick={() => handleRemove(schoolTeacher)}
                            >
                              <X
                                title={`Remover ${schoolTeacher.employee.name}`}
                              />
                            </S.ActionButton>
                          )}
                        </S.ItemContent>
                      </ListItem>
                    ))}
                  </S.List>
                ) : (
                  <S.Message>
                    Ainda não temos nenhum professor vinculado a essa escola,
                    clique no botão &quot;Adicionar professor&quot; para
                    vincular professores
                  </S.Message>
                )}
              </>
            ) : (
              <>
                {isLoading ? (
                  <S.Message>Carregando...</S.Message>
                ) : (
                  <S.Message>
                    Não foi possível carregar os professores
                  </S.Message>
                )}
              </>
            )}
          </S.ListSection>
        ) : (
          <S.Message>
            Selecione uma escola para visualizar seus professores
          </S.Message>
        )}
      </S.Section>

      {schoolId && (
        <AddTeacherToSchoolModal
          schoolId={schoolId}
          ref={modalRef}
          refetchFn={refetch}
        />
      )}
    </S.Wrapper>
  );
};

export default SchoolTeachersCard;
