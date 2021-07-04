import * as S from './styles';

export type BadgeProps = {
  children: React.ReactNode;
  styledType: 'green' | 'blue' | 'orange' | 'red';
};

const Badge = ({ children, styledType = 'green' }: BadgeProps): JSX.Element => (
  <S.Wrapper styledType={styledType}>{children}</S.Wrapper>
);

export default Badge;
