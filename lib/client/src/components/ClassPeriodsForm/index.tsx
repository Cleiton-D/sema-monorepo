import { forwardRef, useImperativeHandle, useRef } from 'react';
import { useQueryClient } from 'react-query';
import { X, Edit3, PlusCircle } from '@styled-icons/feather';

import Table from 'components/Table';
import TableColumn from 'components/TableColumn';
import CreateClassPeriodModal, {
  ClassPeriodModalRef
} from 'components/CreateClassPeriodModal';
import Button from 'components/Button';

import { FormHandles } from 'models/Form';
import { FormattedClassPeriod } from 'models/ClassPeriod';

import { useDeleteClassPeriod } from 'requests/mutations/class-period';
import {
  classPeriodsKeys,
  useListClassPeriods
} from 'requests/queries/class-periods';

import * as S from './styles';

const SchoolYearClassPeriodForm: React.ForwardRefRenderFunction<FormHandles> = (
  _,
  ref
) => {
  const queryClient = useQueryClient();

  const { data: classPeriods } = useListClassPeriods({});
  const deleteClassPeriodMutation = useDeleteClassPeriod();

  const handleDelete = async (item: FormattedClassPeriod) => {
    const confirmation = window.confirm(
      `Deseja apagar o período ${item.translated_description}?`
    );

    if (confirmation) {
      await deleteClassPeriodMutation.mutateAsync(item);
      queryClient.invalidateQueries(...classPeriodsKeys.all);
    }
  };

  const modalRef = useRef<ClassPeriodModalRef>(null);

  const submitForm = async () => {
    console.log('submit form');
  };

  useImperativeHandle(ref, () => ({
    submitForm
  }));

  return (
    <S.Wrapper>
      <S.TableSection>
        <S.SectionTitle>
          <h4>Períodos</h4>
        </S.SectionTitle>
        <S.ButtonContainer>
          <Button
            size="medium"
            icon={<PlusCircle />}
            onClick={() => modalRef.current?.openModal()}
          >
            Adicionar período
          </Button>
        </S.ButtonContainer>
        <Table<FormattedClassPeriod>
          items={classPeriods || []}
          keyExtractor={(value) => value.id}
        >
          <TableColumn label="Descrição" tableKey="translated_description" />
          <TableColumn
            label="Início"
            tableKey="time_start"
            contentAlign="center"
          />
          <TableColumn label="Fim" tableKey="time_end" contentAlign="center" />
          <TableColumn
            label="Duração da hora-aula"
            tableKey="class_time"
            contentAlign="center"
          />
          <TableColumn
            label="Duração do intervalo"
            tableKey="break_time"
            contentAlign="center"
          />
          <TableColumn
            label="Horário do intervalo"
            tableKey="break_time_start"
            contentAlign="center"
          />
          <TableColumn
            label="Ações"
            tableKey="actions"
            contentAlign="center"
            actionColumn
            render={(item) => (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)'
                }}
              >
                <S.ActionButton
                  type="button"
                  title={`Alterar período ${item.translated_description}`}
                  onClick={() => modalRef.current?.openModal(item)}
                >
                  <Edit3 size={20} color="#0393BE" />
                </S.ActionButton>
                <S.ActionButton
                  type="button"
                  title={`Remover período ${item.translated_description}`}
                  onClick={() => handleDelete(item)}
                >
                  <X size={20} />
                </S.ActionButton>
              </div>
            )}
          />
        </Table>
      </S.TableSection>
      <CreateClassPeriodModal ref={modalRef} />
    </S.Wrapper>
  );
};

export default forwardRef(SchoolYearClassPeriodForm);
