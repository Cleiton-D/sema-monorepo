import { useAtom } from 'jotai';

import TextInput from 'components/TextInput';

import { basicSchoolData } from 'store/atoms/create-school';

import * as S from './styles';

const SchoolBasicForm = () => {
  const [state, setState] = useAtom(basicSchoolData);

  const handleChangeInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setState((old) => ({ ...old, [name]: value }));
  };

  return (
    <S.Wrapper onSubmit={(values) => setState(values)} initialData={state}>
      <TextInput name="name" label="Nome" onChange={handleChangeInput} />
      <TextInput
        name="inep_code"
        label="Código do INEP"
        onChange={handleChangeInput}
      />
    </S.Wrapper>
  );
};

export default SchoolBasicForm;
