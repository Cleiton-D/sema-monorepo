import Link from 'next/link';

import { withAccessComponent } from 'hooks/AccessProvider';

import * as S from './styles';

export type CardProps = {
  children?: React.ReactNode;
  description: string;
  icon?: React.ReactNode;
  iconAlign?: 'right' | 'center' | 'left';
  link?: string;
  onClick?: () => void;
};

const Card = ({
  children,
  description,
  icon,
  iconAlign = 'left',
  link,
  onClick
}: CardProps) => (
  <S.Wrapper>
    <S.Content hasIcon={!!icon} iconAlign={iconAlign}>
      {!!icon && icon}
      {(!!children || children === 0) && <S.Text>{children}</S.Text>}

      <S.Description>{description}</S.Description>
    </S.Content>
    {link ? (
      <Link href={link} passHref>
        <S.Link>
          acessar <S.ArrowIcon />
        </S.Link>
      </Link>
    ) : (
      <>
        {onClick && (
          <S.Link onClick={onClick}>
            acessar <S.ArrowIcon />
          </S.Link>
        )}
      </>
    )}
  </S.Wrapper>
);

export default withAccessComponent(Card);
