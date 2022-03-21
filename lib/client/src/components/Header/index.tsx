import { memo } from 'react';
import { useSession } from 'next-auth/react';

import UserDropdown from 'components/UserDropdown';
import ProfileListDropdown from 'components/ProfileListDropdown';

import * as S from './styles';

const Header = () => {
  const { data: session } = useSession();

  return (
    <S.Wrapper>
      <S.ProfileContainer>
        <span>Perfil:</span>
        <ProfileListDropdown />
      </S.ProfileContainer>
      <div style={{ height: '100%' }}>
        <UserDropdown
          username={session?.user.name || ''}
          image="/img/user2.png"
        />
      </div>
    </S.Wrapper>
  );
};

export default memo(Header);
