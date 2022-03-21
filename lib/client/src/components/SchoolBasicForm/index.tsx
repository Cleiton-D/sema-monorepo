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
    <S.Wrapper>
      <S.Form onSubmit={(values) => setState(values)} initialData={state}>
        <TextInput name="name" label="Nome" onChange={handleChangeInput} />
        <TextInput
          name="inep_code"
          label="Código do INEP"
          onChange={handleChangeInput}
        />
        <TextInput
          name="creation_decree"
          label="Decreto de criação"
          onChange={handleChangeInput}
        />
        <TextInput
          name="recognition_opinion"
          label="Parecer de reconhecimento"
          onChange={handleChangeInput}
        />
        <TextInput
          name="authorization_ordinance"
          label="Portaria de autorização"
          onChange={handleChangeInput}
        />
      </S.Form>
    </S.Wrapper>
  );
};

export default SchoolBasicForm;
