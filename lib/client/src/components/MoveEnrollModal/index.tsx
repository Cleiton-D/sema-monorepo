import {
  useState,
  useRef,
  useCallback,
  useMemo,
  ForwardRefRenderFunction,
  forwardRef,
  useImperativeHandle
} from 'react';
import { FormHandles } from '@unform/core';
import { useQueryClient } from 'react-query';

import Modal, { ModalRef } from 'components/Modal';
import Button from 'components/Button';
import Select from 'components/Select';
import ClassroomSelector from 'components/ClassroomSelector';
import DatePicker from 'components/Datepicker';

import { Enroll } from 'models/Enroll';

import { enrollsKeys } from 'requests/queries/enrolls';

import { useRelocateEnroll, useUpdateEnroll } from 'requests/mutations/enroll';

import * as S from './styles';

export type MoveEnrollModalRef = {
  openModal: (enroll: Enroll) => void;
};

export type Action =
  | 'RELOCATE'
  | 'ACTIVE'
  | 'INACTIVE'
  | 'TRANSFERRED'
  | 'QUITTER'
  | 'DECEASED';

const MoveEnrollModal: ForwardRefRenderFunction<MoveEnrollModalRef> = (
  _,
  ref
) => {
  const [enroll, setEnroll] = useState<Enroll>();
  const [action, setAction] = useState<Action>();

  const modalRef = useRef<ModalRef>(null);
  const formRef = useRef<FormHandles>(null);

  const queryClient = useQueryClient();

  const relocateEnroll = useRelocateEnroll();
  const updateEnroll = useUpdateEnroll();

  const handleBack = useCallback(() => {
    modalRef.current?.closeModal();
    setEnroll(undefined);
    setAction(undefined);
  }, []);

  const handleSave = useCallback(
    async (values: any) => {
      if (values.action === 'RELOCATE') {
        const requestData = {
          enroll_id: enroll?.id,
          from: enroll?.current_classroom?.id,
          to: values.classroom
        };
        await relocateEnroll.mutateAsync(requestData);
      } else {
        const transfer_date =
          values.action === 'TRANSFERRED' ? values.transfer_date : undefined;

        await updateEnroll.mutateAsync({
          enroll_id: enroll?.id,
          status: values.action,
          transfer_date
        });
      }

      queryClient.invalidateQueries(enrollsKeys.lists());
      handleBack();
    },
    [enroll, relocateEnroll, updateEnroll, handleBack, queryClient]
  );

  const handleOpenModal = useCallback((data: Enroll) => {
    setEnroll(data);
    modalRef.current?.openModal();
  }, []);

  useImperativeHandle(ref, () => ({ openModal: handleOpenModal }));

  const moveOptions = useMemo(() => {
    if (enroll?.status === 'ACTIVE') {
      return [
        {
          label: 'Transferido',
          value: 'TRANSFERRED'
        },
        {
          label: 'Remanejar',
          value: 'RELOCATE'
        },
        {
          label: 'Cancelar matricula',
          value: 'INACTIVE'
        },
        {
          label: 'Desistente',
          value: 'QUITTER'
        },
        {
          label: 'Falecido',
          value: 'DECEASED'
        }
      ];
    }

    if (enroll?.status === 'INACTIVE') {
      return [
        {
          label: 'Transferido',
          value: 'TRANSFERRED'
        },
        {
          label: 'Reativar matricula',
          value: 'ACTIVE'
        },
        {
          label: 'Desistente',
          value: 'QUITTER'
        },
        {
          label: 'Falecido',
          value: 'DECEASED'
        }
      ];
    }

    if (enroll?.status === 'QUITTER') {
      return [
        {
          label: 'Transferido',
          value: 'TRANSFERRED'
        },
        {
          label: 'Reativar matricula',
          value: 'ACTIVE'
        },
        {
          label: 'Falecido',
          value: 'DECEASED'
        }
      ];
    }

    if (enroll?.status === 'TRANSFERRED') {
      return [
        {
          label: 'Reativar matricula',
          value: 'ACTIVE'
        }
      ];
    }

    return [];
  }, [enroll]);

  const classroomSearchParams = useMemo(() => {
    return {
      school_id: enroll?.school_id,
      grade_id: enroll?.grade_id
    };
  }, [enroll]);

  const studentName = enroll ? enroll.student.name.split(' ')[0] : '';

  return (
    <Modal
      title={`Movimentar estudante - ${studentName}`}
      closeOnClickOutside={false}
      ref={modalRef}
    >
      <S.Wrapper>
        <S.Form onSubmit={handleSave} ref={formRef}>
          <Select
            name="action"
            label="Ação"
            options={moveOptions}
            onChange={setAction}
          />
          {action === 'RELOCATE' && (
            <ClassroomSelector
              name="classroom"
              label="Turma"
              searchParams={classroomSearchParams}
              exceptId={enroll?.current_classroom?.id}
            />
          )}

          {action === 'TRANSFERRED' && (
            <DatePicker
              name="transfer_date"
              label="Data da Transferência"
              toDate={new Date()}
              value={new Date()}
            />
          )}

          <S.ButtonsContainer>
            <Button
              styleType="outlined"
              onClick={handleBack}
              type="button"
              size="medium"
            >
              Voltar
            </Button>
            <Button styleType="rounded" type="submit" size="medium">
              Salvar
            </Button>
          </S.ButtonsContainer>
        </S.Form>
      </S.Wrapper>
    </Modal>
  );
};

export default forwardRef(MoveEnrollModal);
