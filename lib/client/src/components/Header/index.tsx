import { memo } from 'react';
import { useSession } from 'next-auth/client';

import UserDropdown from 'components/UserDropdown';

import * as S from './styles';
import ProfileListDropdown from 'components/ProfileListDropdown';

const Header = () => {
  const [session] = useSession();

  return (
    <S.Wrapper>
      <S.ProfileContainer>
        <span>Perfil:</span>
        <ProfileListDropdown />

        {/* <p>Professor - Escola Municipal Cecília Meireles</p> */}
      </S.ProfileContainer>
      <div style={{ height: '100%' }}>
        <UserDropdown
          username={session?.user.name || ''}
          image="/img/fry.jpg"
        />
      </div>
    </S.Wrapper>
  );
};

export default memo(Header);
