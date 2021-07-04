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

import { useListEmployees } from 'requests/queries/employee';
import { useAddTeacherToSchoolMutation } from 'requests/mutations/school-teacher';

import * as S from './styles';

export type AddTeacherToSchoolModalRef = {
  openModal: () => void;
};

type AddTeacherToSchoolModalProps = {
  schoolId: string;
  refetchFn: () => Promise<unknown>;
};

const AddTeacherToSchoolModal: React.ForwardRefRenderFunction<
  AddTeacherToSchoolModalRef,
  AddTeacherToSchoolModalProps
> = ({ schoolId, refetchFn }, ref) => {
  const [saving, setSaving] = useState(false);

  const modalRef = useRef<ModalRef>(null);
  const formRef = useRef<FormHandles>(null);

  const [session] = useSession();
  const { data: employees, isLoading } = useListEmployees(session);

  const addTeacherToSchool = useAddTeacherToSchoolMutation(modalRef);

  const employeesOptions = useMemo(() => {
    if (isLoading) return [{ label: 'Carregando...', value: '' }];
    if (!employees) return [];

    return employees.map(({ id, person }) => ({
      value: id,
      label: person.name
    }));
  }, [employees, isLoading]);

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

      await addTeacherToSchool.mutateAsync({
        employee_id,
        school_id: schoolId
      });
      refetchFn();

      setSaving(false);
    },
    [addTeacherToSchool, schoolId, refetchFn]
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
            label="Servidor"
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

export default forwardRef(AddTeacherToSchoolModal);
