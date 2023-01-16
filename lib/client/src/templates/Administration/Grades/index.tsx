import { useRef, useState, useMemo } from 'react';
import { useQueryClient } from 'react-query';
import { useSession } from 'next-auth/react';
import { PlusCircle, X } from '@styled-icons/feather';

import Base, { BaseRef } from 'templates/Base';

import Heading from 'components/Heading';
import Button from 'components/Button';
import AddGradeModal, { ModalRef } from 'components/AddGradeModal';
import GradeSchoolSubjectsCard from 'components/GradeSchoolSubjectsCard';

import { useAccess } from 'hooks/AccessProvider';

import { Grade } from 'models/Grade';

import { gradesKeys, useListGrades } from 'requests/queries/grades';
import { useDeleteGradeMutation } from 'requests/mutations/grades';

import * as S from './styles';

const Grades = () => {
  const [selectedGrade, setSelectedGrade] = useState<Grade>();

  const modalRef = useRef<ModalRef>(null);
  const baseRef = useRef<BaseRef>(null);

  const { enableAccess } = useAccess();

  const { data: session } = useSession();
  const queryClient = useQueryClient();

  const { data: grades } = useListGrades(session, {
    school_year_id: session?.configs.school_year_id
  });

  const mutation = useDeleteGradeMutation(session);
  const handleDelete = async (event: React.MouseEvent, grade: Grade) => {
    event.stopPropagation();

    const confirmation = window.confirm(
      `Deseja excluir a ${grade.description}?`
    );
    if (confirmation) {
      await mutation.mutateAsync(grade);
      queryClient.invalidateQueries(...gradesKeys.all);
    }
  };

  const handleSelectGrade = (grade: Grade) => {
    if (selectedGrade?.id === grade.id) {
      setSelectedGrade(undefined);
    } else {
      baseRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
      setSelectedGrade(grade);
    }
  };

  const canChangeGrades = useMemo(
    () => enableAccess({ module: 'GRADE', rule: 'WRITE' }),
    [enableAccess]
  );

  return (
    <Base ref={baseRef}>
      <Heading>Séries</Heading>
      <S.Content>
        <S.Wrapper>
          <S.TableSection>
            <S.SectionTitle>
              <h4>Séries</h4>
              <Button
                size="small"
                module="GRADE"
                rule="WRITE"
                icon={<PlusCircle size={16} />}
                onClick={() => modalRef.current?.openModal()}
              >
                Adicionar série
              </Button>
            </S.SectionTitle>
            <S.List>
              {grades?.map((grade) => (
                <S.ListItem
                  key={grade.id}
                  highlightOnHover
                  onClick={() => handleSelectGrade(grade)}
                  selected={selectedGrade?.id === grade.id}
                >
                  <span>{grade.description}</span>

                  {canChangeGrades && selectedGrade?.id !== grade.id && (
                    <S.ActionButton
                      onClick={(event) => handleDelete(event, grade)}
                    >
                      <X />
                    </S.ActionButton>
                  )}
                </S.ListItem>
              ))}
            </S.List>
          </S.TableSection>
        </S.Wrapper>

        <S.GradeSchoolSubjectsCardContainer>
          <GradeSchoolSubjectsCard gradeId={selectedGrade?.id} />
        </S.GradeSchoolSubjectsCardContainer>
      </S.Content>
      <S.Overlay
        active={!!selectedGrade}
        onClick={() => setSelectedGrade(undefined)}
      />
      <AddGradeModal
        ref={modalRef}
        schoolYearId={session?.configs.school_year_id}
      />
    </Base>
  );
};

export default Grades;
