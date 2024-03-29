import { useState, useImperativeHandle, forwardRef, useRef } from 'react';
import { useQueryClient } from 'react-query';
import { useAtomValue } from 'jotai/utils';
import { X, PlusCircle } from '@styled-icons/feather';

import GradeSchoolSubjectsCard from 'components/GradeSchoolSubjectsCard';
import Button from 'components/Button';
import AddGradeModal, { ModalRef } from 'components/AddGradeModal';

import { Grade } from 'models/Grade';
import { FormHandles } from 'models/Form';

import { gradesKeys, useListGrades } from 'requests/queries/grades';
import { useDeleteGradeMutation } from 'requests/mutations/grades';

import { schoolYearAtom } from 'store/atoms/school-year';

import * as S from './styles';

const GradeSchoolSubjectsForm: React.ForwardRefRenderFunction<FormHandles> = (
  _,
  ref
) => {
  const [selectedGrade, setSelectedGrade] = useState<Grade>();
  const schoolYearAtomValue = useAtomValue(schoolYearAtom);

  const addGradeModalRef = useRef<ModalRef>(null);

  const queryClient = useQueryClient();

  const { data: grades } = useListGrades({
    school_year_id: schoolYearAtomValue?.schoolYear.id
  });
  const deleteGrade = useDeleteGradeMutation();

  const handleSelectGrade = (grade: Grade) => {
    if (selectedGrade?.id === grade.id) {
      setSelectedGrade(undefined);
    } else {
      setSelectedGrade(grade);
    }
  };

  const handleDeleteGrade = async (event: React.MouseEvent, grade: Grade) => {
    event.stopPropagation();

    const confirm = window.confirm(`Deseja apagar ${grade.description}?`);
    if (confirm) {
      await deleteGrade.mutateAsync(grade);
      queryClient.invalidateQueries(...gradesKeys.all);
    }
  };

  const submitForm = async () => {
    console.log('Sending form...');
  };

  useImperativeHandle(ref, () => ({ submitForm }));

  return (
    <>
      <S.Content>
        <S.Wrapper>
          <S.TableSection>
            <S.SectionTitle>
              <h4>Séries</h4>
              <Button
                size="small"
                icon={<PlusCircle size={16} />}
                onClick={() => addGradeModalRef.current?.openModal()}
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

                  {selectedGrade?.id !== grade.id && (
                    <S.ActionButton
                      onClick={(event) => handleDeleteGrade(event, grade)}
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
        ref={addGradeModalRef}
        schoolYearId={schoolYearAtomValue?.schoolYear.id}
      />
    </>
  );
};

export default forwardRef(GradeSchoolSubjectsForm);
