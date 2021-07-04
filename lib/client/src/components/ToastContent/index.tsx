import * as S from './styles';

type ToastContentProps = {
  children: React.ReactNode;
  showSpinner?: boolean;
};

const ToastContent = ({ children, showSpinner = false }: ToastContentProps) => (
  <S.Wrapper>
    {showSpinner && <S.Spinner />}
    {children}
  </S.Wrapper>
);

export default ToastContent;
