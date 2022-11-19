import {
  useRef,
  forwardRef,
  useImperativeHandle,
  useMemo,
  useState
} from 'react';
import { useQueryClient } from 'react-query';
import { useSession } from 'next-auth/react';

import Modal, { ModalRef } from 'components/Modal';
import TextInput from 'components/TextInput';
import Select from 'components/Select';
import Button from 'components/Button';

import { Classroom } from 'models/Classroom';

import { useAddClassroom } from 'requests/mutations/classroom';
import { classroomsKeys } from 'requests/queries/classrooms';
import { useListGrades } from 'requests/queries/grades';
import { useListClassPeriods } from 'requests/queries/class-periods';

import { translateDescription } from 'utils/mappers/classPeriodMapper';

import * as S from './styles';

export type ClassroomModalRef = {
  openModal: (classroom?: Classroom) => void;
};

type ClassroomModalProps = {
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
> = ({ schoolId }, ref) => {
  const [classroom, setClassroom] = useState<Classroom>();

  const modalRef = useRef<ModalRef>(null);

  const { data: session } = useSession();
  const queryClient = useQueryClient();

  const { data: grades } = useListGrades(session);
  const { data: classPeriods, isLoading } = useListClassPeriods(session);

  const addClassroomMutation = useAddClassroom({});

  const classPeriodsOptions = useMemo(() => {
    if (isLoading) return [{ label: 'Carregando...', value: '' }];
    if (!classPeriods) return [];

    return classPeriods.map((classPeriod) => ({
      value: classPeriod.id,
      label: translateDescription(classPeriod.description)
    }));
  }, [classPeriods, isLoading]);

  const gradesOptions = useMemo(() => {
    if (!grades) return [];

    return grades.map(({ id, description }) => ({
      label: description,
      value: id
    }));
  }, [grades]);

  const handleSubmit = async (values: ClassroomForm) => {
    const selectedGrade = gradesOptions.find(
      ({ value }) => value === values.grade_id
    );

    await addClassroomMutation.mutateAsync({
      ...values,
      id: classroom?.id,
      is_multigrade: false,
      school_id: schoolId,
      enroll_count: 0,
      grade: {
        description: selectedGrade?.label
      }
    });

    await queryClient.invalidateQueries(classroomsKeys.lists());

    handleBack();
  };

  const handleBack = () => {
    setClassroom(undefined);
    modalRef.current?.closeModal();
  };

  const openModal = (item?: Classroom) => {
    setClassroom(item);

    modalRef.current?.openModal();
  };

  useImperativeHandle(ref, () => ({ openModal }));

  return (
    <Modal
      title={
        classroom
          ? `Alterar turma - ${classroom.description}`
          : 'Adicionar turma'
      }
      closeOnClickOutside={false}
      ref={modalRef}
    >
      <S.Wrapper>
        <S.Form onSubmit={handleSubmit} initialData={classroom}>
          <TextInput name="description" label="Descrição" />
          <Select
            name="class_period_id"
            label="Período"
            options={classPeriodsOptions}
          />
          <Select name="grade_id" label="Série" options={gradesOptions} />

          <TextInput name="capacity" label="Lotação" type="number" min="0" />
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
