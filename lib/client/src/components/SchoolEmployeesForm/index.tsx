import { useMemo, useRef } from 'react';
import { PrimitiveAtom, useAtom } from 'jotai';
import { PlusSquare, X } from '@styled-icons/feather';

import AddEmployeeToProfileModal, {
  AddEmployeeToProfileModalRef
} from 'components/AddEmployeeToProfileModal';

import { Employee } from 'models/Employee';

import * as S from './styles';

type SchoolEmployeesFormProps = {
  title: string;
  name: string;
  pluralName: string;
  buttonText: string;
  jotaiState: PrimitiveAtom<Record<string, Employee[]>>;
  profileCode: string;
};

const SchoolEmployeesForm = ({
  title,
  name,
  pluralName,
  buttonText,
  profileCode,
  jotaiState
}: SchoolEmployeesFormProps) => {
  const modalRef = useRef<AddEmployeeToProfileModalRef>(null);

  const [state, setState] = useAtom(jotaiState);

  const handleAddEmployee = (employee: Employee) => {
    setState((current) => {
      const currentState = { ...current };
      const currentItems = currentState[profileCode] || [];

      return { ...currentState, [profileCode]: [...currentItems, employee] };
    });
  };

  const handleRemoveEmployee = (employee: Employee) => {
    setState((current) => {
      const currentState = { ...current };
      const currentItems = currentState[profileCode] || [];
      const newItems = currentItems.filter(({ id }) => id !== employee.id);

      return { ...currentState, [profileCode]: newItems };
    });
  };

  const employees = useMemo(() => state[profileCode], [state, profileCode]);

  return (
    <S.Wrapper>
      <S.Title>
        <h2>{title}</h2>
        <S.HeaderActionButton onClick={() => modalRef.current?.openModal()}>
          {buttonText} <PlusSquare size={16} />
        </S.HeaderActionButton>
      </S.Title>
      {employees?.length ? (
        <S.List>
          {employees.map((employee) => (
            <li key={employee.id}>
              <span>{employee.person.name}</span>
              <S.ActionButton
                onClick={() => handleRemoveEmployee(employee)}
                title="Remover vinculo"
              >
                <X size={16} title="Remover vinculo" />
              </S.ActionButton>
            </li>
          ))}
        </S.List>
      ) : (
        <S.Message>
          Nenhum {name} cadastrado, clique no botao {buttonText} para adicionar
          {pluralName}.
        </S.Message>
      )}
      <AddEmployeeToProfileModal
        onSubmit={handleAddEmployee}
        title={buttonText}
        ref={modalRef}
      />
    </S.Wrapper>
  );
};

export default SchoolEmployeesForm;
