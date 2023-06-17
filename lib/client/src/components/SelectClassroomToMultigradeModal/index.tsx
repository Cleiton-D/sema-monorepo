import { useRef, useMemo, useImperativeHandle, forwardRef } from 'react';
import { useQueryClient } from 'react-query';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import { useAtom } from 'jotai';
import { v4 as uuidv4 } from 'uuid';

import Modal, { ModalRef } from 'components/Modal';
import Select from 'components/Select';
import Button from 'components/Button';

import { Classroom } from 'models/Classroom';

import { useListClassrooms } from 'requests/queries/classrooms';
import { multigradesClassroomsKeys } from 'requests/queries/multigrade-classrooms';
import { multigradesKeys } from 'requests/queries/multigrades';
import { useSessionSchoolYear } from 'requests/queries/session';
import { useAddMultigradeClassroom } from 'requests/mutations/multigrade-classrooms';

import { classroomsAtom } from 'store/atoms/create-multigrade';

import * as S from './styles';

export type SelectClassroomToMultigradeModalRef = {
  openModal: () => void;
};

type FormData = {
  classroom: Classroom;
};

type SelectClassroomToMultigradeModalProps = {
  classPeriodId: string;
  schoolId: string;
  multigradeId?: string;
};

const SelectClassroomToMultigradeModal: React.ForwardRefRenderFunction<
  SelectClassroomToMultigradeModalRef,
  SelectClassroomToMultigradeModalProps
> = ({ classPeriodId, schoolId, multigradeId }, ref) => {
  const modalRef = useRef<ModalRef>(null);
  const formRef = useRef<FormHandles>(null);

  const { data: schoolYear } = useSessionSchoolYear();
  const queryClient = useQueryClient();

  const [multigradesClassrooms, setMultigradesClassrooms] =
    useAtom(classroomsAtom);

  const { data: classrooms, isLoading } = useListClassrooms({
    class_period_id: classPeriodId,
    school_id: schoolId,
    school_year_id: schoolYear?.id,
    with_in_multigrades: false
  });

  const currentClassrooms = useMemo(() => {
    return multigradesClassrooms.map(({ classroom }) => classroom.id);
  }, [multigradesClassrooms]);

  const classromsOptions = useMemo(() => {
    if (isLoading) return [{ label: 'Carregando...', value: '' }];

    const classroomsItems = classrooms?.items || [];

    return classroomsItems
      .filter(({ id }) => !currentClassrooms.includes(id))
      .map((classroom) => ({
        label: classroom.description,
        value: classroom
      }));
  }, [isLoading, classrooms, currentClassrooms]);

  const addMultigradeClassroom = useAddMultigradeClassroom();

  const handleSubmit = async (values: FormData) => {
    formRef.current?.setErrors({});

    const errors: Record<string, string> = {};
    if (!values.classroom) errors.classroom = 'Campo obrigatório';

    if (Object.entries(errors).length > 0) {
      formRef.current?.setErrors(errors);
      return;
    }

    if (multigradeId) {
      const requestData = {
        owner_id: multigradeId,
        classroom_id: values.classroom.id
      };
      const response = await addMultigradeClassroom.mutateAsync(requestData);
      if (response.id) {
        setMultigradesClassrooms((current) => [...current, response]);
      }

      queryClient.invalidateQueries(multigradesClassroomsKeys.lists());
      queryClient.invalidateQueries(multigradesKeys.all);
    } else {
      const newItem = {
        id: uuidv4(),
        classroom: values.classroom
      };
      setMultigradesClassrooms((current) => [...current, newItem]);
    }

    handleBack();
  };

  const handleBack = () => {
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
          <Select name="classroom" label="Turma" options={classromsOptions} />

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

export default forwardRef(SelectClassroomToMultigradeModal);
