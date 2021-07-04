import {
  useRef,
  useState,
  useMemo,
  useImperativeHandle,
  forwardRef,
  useCallback
} from 'react';
import { useSession } from 'next-auth/client';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';

import Button from 'components/Button';
import Modal, { ModalRef } from 'components/Modal';
import Select from 'components/Select';

import { useListSchoolTeachers } from 'requests/queries/school-teachers';
import { useAddTeacherToSchoolSubjectMutation } from 'requests/mutations/teacher-school-subjects';

import * as S from './styles';

export type AddTeacherToSchoolSubjectModalRef = {
  openModal: () => void;
};

type AddTeacherToSchoolSubjectModalProps = {
  schoolId: string;
  schoolSubjectId: string;
  refetchFn: () => Promise<unknown>;
};

const AddTeacherToSchoolSubjectModal: React.ForwardRefRenderFunction<
  AddTeacherToSchoolSubjectModalRef,
  AddTeacherToSchoolSubjectModalProps
> = ({ schoolId, schoolSubjectId, refetchFn }, ref) => {
  const [saving, setSaving] = useState(false);

  const modalRef = useRef<ModalRef>(null);
  const formRef = useRef<FormHandles>(null);

  const [session] = useSession();

  const { data: schoolTeachers, isLoading } = useListSchoolTeachers(session, {
    school_id: schoolId
  });

  const addTeacherToSchoolSubject = useAddTeacherToSchoolSubjectMutation(
    modalRef
  );

  const employeesOptions = useMemo(() => {
    if (isLoading) return [{ label: 'Carregando...', value: '' }];
    if (!schoolTeachers) return [];

    return schoolTeachers.map(({ employee }) => ({
      value: employee.id,
      label: employee.person.name
    }));
  }, [schoolTeachers, isLoading]);

  const handleSave = useCallback(
    async ({ employee_id }) => {
      setSaving(true);

      formRef.current?.setErrors({});

      if (!employee_id) {
        // mantive assim pq esse formulario só tem um campo,
        // se adicionar mais campos, fazer validacao usando o yup
        formRef.current?.setErrors({
          employee_id: 'Campo obrigatório'
        });

        setSaving(false);
        return;
      }

      await addTeacherToSchoolSubject.mutateAsync({
        employee_id,
        school_id: schoolId,
        school_subject_id: schoolSubjectId
      });
      refetchFn();

      setSaving(false);
    },
    [addTeacherToSchoolSubject, schoolId, schoolSubjectId, refetchFn]
  );

  const handleBack = () => {
    modalRef.current?.closeModal();
  };

  const openModal = () => {
    modalRef.current?.openModal();
  };

  useImperativeHandle(ref, () => ({ openModal }));

  return (
    <Modal
      title="Vincular professor"
      closeOnClickOutside={false}
      ref={modalRef}
    >
      <S.Wrapper>
        <Form onSubmit={handleSave} ref={formRef}>
          <Select
            name="employee_id"
            label="Professor"
            options={employeesOptions}
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
            <Button
              styleType="rounded"
              size="medium"
              type="submit"
              disabled={saving}
            >
              {saving ? 'Salvando...' : 'Salvar'}
            </Button>
          </S.ButtonsContainer>
        </Form>
      </S.Wrapper>
    </Modal>
  );
};

export default forwardRef(AddTeacherToSchoolSubjectModal);
