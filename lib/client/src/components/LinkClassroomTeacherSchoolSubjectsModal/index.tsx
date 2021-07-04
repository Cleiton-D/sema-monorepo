import {
  useRef,
  useState,
  useImperativeHandle,
  forwardRef,
  useMemo
} from 'react';
import { useSession } from 'next-auth/client';
import { Form } from '@unform/web';

import Modal, { ModalRef } from 'components/Modal';
import Select, { Option } from 'components/Select';
import Button from 'components/Button';

import { Classroom } from 'models/Classroom';

import { useListSchoolsSubjects } from 'requests/queries/school-subjects';
import { useListTeacherSchoolSubjects } from 'requests/queries/teacher-school-subjects';
import { useListClassroomTeacherSchoolSubjects } from 'requests/queries/classroom-teacher-school-subjects';
import { useLinkClassroomTeacherSchoolSubject } from 'requests/mutations/classroom-teacher-school-subjects';

import * as S from './styles';

export type LinkClassroomTeacherSchoolSubjectsModalRef = {
  openModal: (classroom: Classroom) => void;
};

const LinkClassroomTeacherSchoolSubjectsModal: React.ForwardRefRenderFunction<LinkClassroomTeacherSchoolSubjectsModalRef> = (
  _,
  ref
) => {
  const [classroom, setClassroom] = useState<Classroom>();

  const modalRef = useRef<ModalRef>(null);

  const linkClassroomTeacherSchoolSubjects = useLinkClassroomTeacherSchoolSubject(
    modalRef
  );

  const [session] = useSession();
  const { data: schoolSubjects } = useListSchoolsSubjects(session, {
    grade_id: classroom?.grade_id
  });

  const {
    data: classroomTeacherSchoolSubjects,
    refetch
  } = useListClassroomTeacherSchoolSubjects(session, {
    classroom_id: classroom?.id,
    school_id: classroom?.school_id
  });

  const teacherSchoolSubjectsFilters = useMemo(() => {
    if (!schoolSubjects) return {};

    return {
      school_id: classroom?.school_id,
      school_subject_id: schoolSubjects.map(({ id }) => id)
    };
  }, [schoolSubjects, classroom]);

  const {
    data: teacherSchoolSubjects,
    isLoading
  } = useListTeacherSchoolSubjects(session, teacherSchoolSubjectsFilters);

  const selectOptions = useMemo(() => {
    if (!schoolSubjects) return {};

    return schoolSubjects.reduce<Record<string, Option[]>>(
      (acc, schoolSubject) => {
        if (isLoading) {
          return {
            ...acc,
            [schoolSubject.id]: [{ label: 'Carregando...', value: '' }]
          };
        }
        if (!teacherSchoolSubjects) return { ...acc, [schoolSubject.id]: [] };

        const items = teacherSchoolSubjects
          .filter(
            ({ school_subject_id }) => school_subject_id === schoolSubject.id
          )
          .map((item) => ({
            label: item.employee.person.name,
            value: item.employee_id
          }));

        return { ...acc, [schoolSubject.id]: items };
      },
      {}
    );
  }, [schoolSubjects, teacherSchoolSubjects, isLoading]);

  const initialFormData = useMemo(() => {
    if (!classroomTeacherSchoolSubjects || selectOptions === {}) return {};

    return classroomTeacherSchoolSubjects.reduce<Record<string, string>>(
      (acc, item) => {
        return {
          ...acc,
          [item.school_subject_id]: item.employee_id
        };
      },
      {}
    );
  }, [classroomTeacherSchoolSubjects, selectOptions]);

  const handleSave = async (values: Record<string, string>) => {
    const requestData = {
      classroom,
      teacher_school_subjects: Object.entries(values).map(([key, value]) => ({
        school_subject_id: key,
        employee_id: value
      }))
    };

    await linkClassroomTeacherSchoolSubjects.mutateAsync(requestData);
    refetch();
  };

  const handleBack = () => {
    modalRef.current?.closeModal();
  };

  const openModal = (value: Classroom) => {
    setClassroom(value);
    modalRef.current?.openModal();
  };

  useImperativeHandle(ref, () => ({ openModal }));

  return (
    <Modal
      title="Vincular professores"
      closeOnClickOutside={false}
      ref={modalRef}
    >
      <S.Wrapper>
        <Form onSubmit={handleSave} initialData={initialFormData}>
          <S.FieldsContainer>
            {schoolSubjects?.map((schoolSubject) => (
              <Select
                label={schoolSubject.description}
                name={schoolSubject.id}
                key={schoolSubject.id}
                options={selectOptions[schoolSubject.id]}
              />
            ))}
          </S.FieldsContainer>
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
        </Form>
      </S.Wrapper>
    </Modal>
  );
};

export default forwardRef(LinkClassroomTeacherSchoolSubjectsModal);
