import { memo } from 'react';

import UserDropdown from 'components/UserDropdown';
import ProfileListDropdown from 'components/ProfileListDropdown';

import { useUser } from 'requests/queries/session';

import * as S from './styles';

const Header = () => {
  const { data: user } = useUser();

  return (
    <S.Wrapper>
      <S.ProfileContainer>
        <span>Perfil:</span>
        <ProfileListDropdown />
      </S.ProfileContainer>
      <div style={{ height: '100%' }}>
        <UserDropdown username={user?.username || ''} image="/img/user2.png" />
      </div>
    </S.Wrapper>
  );
};

export default memo(Header);
