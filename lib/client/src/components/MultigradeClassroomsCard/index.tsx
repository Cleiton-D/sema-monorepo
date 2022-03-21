import { Suspense, useRef } from 'react';

import Button from 'components/Button';
import SelectClassroomToMultigradeModal, {
  SelectClassroomToMultigradeModalRef
} from 'components/SelectClassroomToMultigradeModal';
import MultigradeClassroomsList from 'components/MultigradeClassroomsList';

import * as S from './styles';

type MultigradeClassroomsCardProps = {
  schoolId?: string;
  classPeriodId?: string;
  multigradeId?: string;
};

const MultigradeClassroomsCard = ({
  schoolId,
  classPeriodId,
  multigradeId
}: MultigradeClassroomsCardProps) => {
  const modalRef = useRef<SelectClassroomToMultigradeModalRef>(null);

  return (
    <S.Wrapper>
      <S.Section>
        <S.SectionTitle>
          <h4>Turmas</h4>
          {schoolId && classPeriodId && (
            <Button
              // module="GRADE_SCHOOL_SUBJECT"
              // rule="WRITE"
              size="small"
              onClick={() => modalRef.current?.openModal()}
            >
              Adicionar turma
            </Button>
          )}
        </S.SectionTitle>

        <Suspense fallback={<S.Message>Carregando...</S.Message>}>
          <S.ListSection>
            <MultigradeClassroomsList multigradeId={multigradeId} />
          </S.ListSection>
        </Suspense>
      </S.Section>
      {schoolId && classPeriodId && (
        <SelectClassroomToMultigradeModal
          classPeriodId={classPeriodId}
          schoolId={schoolId}
          multigradeId={multigradeId}
          ref={modalRef}
        />
      )}
    </S.Wrapper>
  );
};

export default MultigradeClassroomsCard;
