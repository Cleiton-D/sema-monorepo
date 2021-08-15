import { useRef, forwardRef, useImperativeHandle, useMemo } from 'react';
import { useSession } from 'next-auth/client';

import Modal, { ModalRef } from 'components/Modal';
import TextInput from 'components/TextInput';
import Select from 'components/Select';
import Button from 'components/Button';

import { useAddClassroom } from 'requests/mutations/classroom';
import { useListGrades } from 'requests/queries/grades';

import { ProcessQueryDataFn } from 'services/api';

import * as S from './styles';

export type ClassroomModalRef = {
  openModal: () => void;
};

type ClassroomModalProps = {
  createQueries: Record<string, ProcessQueryDataFn>;
  schoolId: string;
};

type ClassroomForm = {
  description: string;
  class_period_id: string;
  grade_id: string;
};

const ClassroomModal: React.ForwardRefRenderFunction<
  ClassroomModalRef,
  ClassroomModalProps
> = ({ createQueries, schoolId }, ref) => {
  const modalRef = useRef<ModalRef>(null);

  const [session] = useSession();
  const { data: grades } = useListGrades(session);

  const addClassroomMutation = useAddClassroom(createQueries);

  const classPeriodsOptions = useMemo(() => {
    return [
      {
        value: 'MORNING',
        label: 'Matutino'
      },
      {
        value: 'EVENING',
        label: 'Vespertino'
      },
      {
        value: 'NOCTURNAL',
        label: 'Noturno'
      }
    ];
  }, []);

  const gradesOptions = useMemo(() => {
    if (!grades) return [];

    return grades.map(({ id, description }) => ({
      label: description,
      value: id
    }));
  }, [grades]);

  const handleSubmit = (values: ClassroomForm) => {
    const selectedGrade = gradesOptions.find(
      ({ value }) => value === values.grade_id
    );

    addClassroomMutation.mutate({
      ...values,
      school_id: schoolId,
      enroll_count: 0,
      grade: {
        description: selectedGrade?.label
      }
    });
    modalRef.current?.closeModal();
  };

  const handleBack = () => {
    modalRef.current?.closeModal();
  };

  const openModal = () => {
    modalRef.current?.openModal();
  };

  useImperativeHandle(ref, () => ({ openModal }));

  return (
    <Modal title="Adicionar turma" closeOnClickOutside={false} ref={modalRef}>
      <S.Wrapper>
        <S.Form onSubmit={handleSubmit}>
          <TextInput name="description" label="Descrição" />
          <Select
            name="class_period"
            label="Período"
            options={classPeriodsOptions}
          />
          <Select name="grade_id" label="Série" options={gradesOptions} />
          <S.ButtonsContainer>
            <Button
              styleType="outlined"
              size="medium"
              onClick={handleBack}
              type="button"
            >
              Voltar
            </Button>
            <Button styleType="rounded" size="medium" type="submit">
              Salvar
            </Button>
          </S.ButtonsContainer>
        </S.Form>
      </S.Wrapper>
    </Modal>
  );
};

export default forwardRef(ClassroomModal);
