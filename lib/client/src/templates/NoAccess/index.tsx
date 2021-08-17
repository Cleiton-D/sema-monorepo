import Link from 'next/link';

import Base from 'templates/Base';

import * as S from './styles';

const NoAccessTemplate = () => {
  return (
    <Base>
      <S.Text>
        Desculpe!
        <br /> Você não tem acesso a esse recurso.{' '}
        <Link href="/" passHref>
          <a>Voltar para o Inicio</a>
        </Link>
      </S.Text>
    </Base>
  );
};

export default NoAccessTemplate;
