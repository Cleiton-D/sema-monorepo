import {
  useRef,
  useState,
  useImperativeHandle,
  forwardRef,
  useMemo
} from 'react';
import { useSession } from 'next-auth/client';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';

import Modal, { ModalRef } from 'components/Modal';
import Select, { Option } from 'components/Select';
import Button from 'components/Button';

import { Classroom } from 'models/Classroom';

import { useListClassroomTeacherSchoolSubjects } from 'requests/queries/classroom-teacher-school-subjects';

import * as S from './styles';

export type SelectTeacherClassroomModalRef = {
  openModal: () => void;
};

type SelectOptionValue = {
  classroom: Classroom;
  school_subjects: Option[];
};

type FormData = {
  classroom: SelectOptionValue;
  school_subject_id?: string;
};

type SubmitProps = {
  classroomId: string;
  schoolSubjectId: string;
};
type SelectTeacherClassroomModalProps = {
  onSubmit: (data: SubmitProps) => void;
};

const SelectTeacherClassroomModal: React.ForwardRefRenderFunction<
  SelectTeacherClassroomModalRef,
  SelectTeacherClassroomModalProps
> = ({ onSubmit }, ref) => {
  const [
    selectedClassroom,
    setSelectedClassroom
  ] = useState<SelectOptionValue>();

  const modalRef = useRef<ModalRef>(null);
  const formRef = useRef<FormHandles>(null);

  const [session] = useSession();
  const {
    data: classroomTeacherSchoolSubjects,
    isLoading
  } = useListClassroomTeacherSchoolSubjects(session, {
    classroom_id: 'all',
    school_id: session?.schoolId,
    employee_id: session?.user.employeeId
  });

  const classroomOptions = useMemo(() => {
    if (isLoading) return [{ label: 'Carregando...', value: '' }];
    if (!classroomTeacherSchoolSubjects) return [];

    const items = classroomTeacherSchoolSubjects.reduce<Record<string, Option>>(
      (acc, item) => {
        const { classroom_id, classroom, school_subject } = item;
        const currentItem = acc[classroom_id] || {};
        const currentValue = (currentItem.value || {}) as SelectOptionValue;
        const currentSchoolSubjects = currentValue.school_subjects || [];

        const newSchoolSubjects = [
          ...currentSchoolSubjects,
          { label: school_subject.description, value: school_subject.id }
        ];
        return {
          ...acc,
          [classroom_id]: {
            label: classroom.description,
            value: { classroom, school_subjects: newSchoolSubjects }
          }
        };
      },
      {}
    );

    return Object.values(items);
  }, [classroomTeacherSchoolSubjects, isLoading]);

  const handleSubmit = async (values: FormData) => {
    formRef.current?.setErrors({});

    const errors: Record<string, string> = {};
    if (!values.classroom) errors.classroom = 'Campo obrigatório';
    if (
      values.classroom &&
      values.classroom.school_subjects.length > 1 &&
      !values.school_subject_id
    ) {
      errors.school_subject_id = 'Campo obrigatório';
    }
    if (Object.entries(errors).length > 0) {
      formRef.current?.setErrors(errors);
      return;
    }

    const schoolSubjectId =
      values.classroom.school_subjects.length > 1
        ? values.school_subject_id
        : values.classroom.school_subjects[0].value;

    onSubmit({
      classroomId: values.classroom.classroom.id,
      schoolSubjectId
    });
  };

  const handleBack = () => {
    setSelectedClassroom(undefined);
    modalRef.current?.closeModal();
  };

  const openModal = () => {
    modalRef.current?.openModal();
  };

  useImperativeHandle(ref, () => ({ openModal }));

  return (
    <Modal title="Selecionar turma" closeOnClickOutside={false} ref={modalRef}>
      <S.Wrapper>
        <Form onSubmit={handleSubmit} ref={formRef}>
          <Select
            name="classroom"
            label="Turma"
            options={classroomOptions}
            onChange={(value) => setSelectedClassroom(value)}
          />

          {selectedClassroom &&
            selectedClassroom.school_subjects.length > 1 && (
              <Select
                name="school_subject_id"
                label="Disciplina"
                options={selectedClassroom.school_subjects}
              />
            )}

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
              Próximo
            </Button>
          </S.ButtonsContainer>
        </Form>
      </S.Wrapper>
    </Modal>
  );
};

export default forwardRef(SelectTeacherClassroomModal);
