import { useRef, forwardRef, useImperativeHandle, useState } from 'react';
import { useSession } from 'next-auth/client';
import { FormHandles } from '@unform/core';
import { ValidationError } from 'yup';

import Button from 'components/Button';
import Modal, { ModalRef } from 'components/Modal';
import Select from 'components/Select';
import TextInput from 'components/TextInput';

import { useListSchoolsSubjects } from 'requests/queries/school-subjects';
import {
  useMutateGradeSchoolSubject,
  useUpdateGradeSchoolSubject
} from 'requests/mutations/grade-school-subject';

import { GradeSchoolSubject } from 'models/GradeSchoolSubject';

import { gradeSchoolSubjectSchema } from './rules/schema';

import * as S from './styles';

export type GradeSchoolSubjectModalRef = {
  openModal: (gradeSchoolSubject?: GradeSchoolSubject) => void;
};

type GradeSchoolSubjectModalProps = {
  gradeId?: string;
  schoolYearId?: string;
  refetchFn: () => Promise<unknown>;
};

type GradeSchoolSubjectForm = {
  school_subject_id: string;
  workload: string;
};

const GradeSchoolSubjectModal: React.ForwardRefRenderFunction<
  GradeSchoolSubjectModalRef,
  GradeSchoolSubjectModalProps
> = ({ gradeId, schoolYearId, refetchFn }, ref) => {
  const [
    gradeSchoolSubject,
    setGradeSchoolSubject
  ] = useState<GradeSchoolSubject>();
  const [saving, setSaving] = useState(false);

  const modalRef = useRef<ModalRef>(null);
  const formRef = useRef<FormHandles>(null);

  const [session] = useSession();
  const { data: schoolSubjects, isLoading } = useListSchoolsSubjects(session);

  const mutation = useMutateGradeSchoolSubject(modalRef);
  const updateMutation = useUpdateGradeSchoolSubject(modalRef);

  const openModal = (data?: GradeSchoolSubject) => {
    setGradeSchoolSubject(data);
    modalRef.current?.openModal();
  };
  useImperativeHandle(ref, () => ({ openModal }));

  const handleBack = () => {
    modalRef.current?.closeModal();
  };

  const handleSubmit = async (values: GradeSchoolSubjectForm) => {
    if (!gradeId || !schoolYearId) return;

    setSaving(true);
    try {
      formRef.current?.setErrors({});

      await gradeSchoolSubjectSchema.validate(values, { abortEarly: false });

      const { school_subject_id, workload } = values;

      if (gradeSchoolSubject) {
        const requestData = {
          id: gradeSchoolSubject.id,
          grade_id: gradeSchoolSubject.grade_id,
          workload: +workload
        };

        await updateMutation.mutateAsync(requestData);
      } else {
        const requestData = {
          grade_id: gradeId,
          school_year_id: schoolYearId,
          school_subjects: [
            {
              school_subject_id,
              workload: +workload
            }
          ]
        };

        await mutation.mutateAsync(requestData);
      }

      refetchFn();
    } catch (err) {
      if (err instanceof ValidationError) {
        const validationErrors: Record<string, string> = {};

        err.inner.forEach((error) => {
          if (error.path) {
            validationErrors[error.path] = error.message;
          }
        });

        formRef.current?.setErrors(validationErrors);
      }
    }

    setSaving(false);
  };

  const selectOptions =
    !schoolSubjects && isLoading
      ? [{ value: '', label: 'Carregando...' }]
      : schoolSubjects?.map(({ id, description }) => ({
          value: id,
          label: description
        }));

  return (
    <Modal
      title="Vincular disciplina"
      closeOnClickOutside={false}
      ref={modalRef}
    >
      <S.Wrapper>
        <S.Form
          onSubmit={handleSubmit}
          ref={formRef}
          initialData={gradeSchoolSubject}
        >
          <Select
            name="school_subject_id"
            label="Matéria"
            options={selectOptions}
            disabled={!!gradeSchoolSubject}
          />
          <TextInput name="workload" label="Carga horária" type="number" />
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
        </S.Form>
      </S.Wrapper>
    </Modal>
  );
};

export default forwardRef(GradeSchoolSubjectModal);
