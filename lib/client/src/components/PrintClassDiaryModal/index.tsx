import {
  useRef,
  useImperativeHandle,
  forwardRef,
  useCallback,
  useState,
  useMemo
} from 'react';
import { useSession } from 'next-auth/react';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';

import { Classroom } from 'models/Classroom';

import Modal, { ModalRef } from 'components/Modal';
import Select from 'components/Select';
import Button from 'components/Button';

import { useShowGrade } from 'requests/queries/grades';
import { useListSchoolSubjects } from 'requests/queries/custom-school-subjects';

import * as S from './styles';

export type PrintClassDiaryModalRef = {
  openModal: (classroom: Classroom) => void;
};

type FormData = { school_subject_id: string };

const PrintClassDiaryModal: React.ForwardRefRenderFunction<
  PrintClassDiaryModalRef
> = (_, ref) => {
  const [classroom, setClassroom] = useState<Classroom>();

  const modalRef = useRef<ModalRef>(null);
  const formRef = useRef<FormHandles>(null);

  const { data: session } = useSession();

  const { data: grade, isLoading: isLoadingGrade } = useShowGrade(
    session,
    classroom?.grade_id
  );
  const { data: schoolSubjects, isLoading: isLoadingSchoolSubjects } =
    useListSchoolSubjects(
      session,
      {
        grade_id: grade?.id,
        is_multidisciplinary: grade?.is_multidisciplinary
      },
      { enabled: !!grade?.id }
    );

  const openModal = (item: Classroom) => {
    setClassroom(item);
    modalRef.current?.openModal();
  };

  const handleBack = () => {
    setClassroom(undefined);
    modalRef.current?.closeModal();
  };

  const handleSubmit = useCallback(
    (values: FormData) => {
      if (!classroom) return;

      formRef.current?.setErrors({});
      if (!values.school_subject_id) {
        formRef.current?.setErrors({ school_subject_id: 'Campo Obrigatório.' });
        return;
      }

      const searchParams = new URLSearchParams();
      searchParams.set('classroom_id', classroom.id);
      searchParams.set('school_subject_id', values.school_subject_id);

      const url = `/auth/exports/class-diary?${searchParams.toString()}`;
      window.open(url, '_blank', 'height=350.8,width=248');
    },
    [classroom]
  );

  const schoolSubjectsOptions = useMemo(() => {
    if (isLoadingGrade || isLoadingSchoolSubjects) {
      return [{ label: 'Carregando...', value: '' }];
    }

    if (!schoolSubjects?.length) return [];

    return schoolSubjects.map((schoolSubject) => ({
      label: schoolSubject.description,
      value: schoolSubject.id
    }));
  }, [schoolSubjects, isLoadingGrade, isLoadingSchoolSubjects]);

  useImperativeHandle(ref, () => ({ openModal }));

  return (
    <Modal
      title="Selecione uma disciplina"
      closeOnClickOutside={false}
      ref={modalRef}
    >
      <S.Wrapper>
        <Form onSubmit={handleSubmit} ref={formRef}>
          <Select
            label="Disciplina"
            name="school_subject_id"
            options={schoolSubjectsOptions}
          />
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
              Imprimir
            </Button>
          </S.ButtonsContainer>
        </Form>
      </S.Wrapper>
    </Modal>
  );
};

export default forwardRef(PrintClassDiaryModal);
