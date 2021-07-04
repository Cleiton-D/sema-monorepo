import Header from 'components/Header';
import Sidebar from 'components/Sidebar';
import PageContainer from 'components/PageContainer';

import * as S from './styles';

type BaseProps = {
  children: React.ReactNode;
};

const Base = ({ children }: BaseProps) => {
  return (
    <S.Wrapper>
      <Header />
      <Sidebar />
      <S.Content>
        <PageContainer>{children}</PageContainer>
      </S.Content>
    </S.Wrapper>
  );
};

export default Base;
