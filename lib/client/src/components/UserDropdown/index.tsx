import { useState } from 'react';
import Image from 'next/image';
import { signOut } from 'next-auth/client';

import * as S from './styles';

type UserDropdownProps = {
  username: string;
  image: string;
};
const UserDropdown = ({ username, image }: UserDropdownProps) => {
  const [show, setShow] = useState(false);

  const handleSignout = () => {
    signOut();
  };

  const toggleDropdown = () => {
    setShow((current) => !current);
  };

  return (
    <S.Wrapper>
      <S.Container isOpen={show}>
        <S.Title onClick={toggleDropdown}>
          <S.UserContainer>
            <span>
              {username} <S.ArrowIcon isOpen={show} />
            </span>
            <S.UserImage>
              <Image
                src={image}
                layout="fill"
                objectFit="cover"
                quality={80}
                sizes="80px"
                alt={username}
              />
            </S.UserImage>
          </S.UserContainer>
        </S.Title>
        <S.Content isOpen={show}>
          <ul>
            <S.ListItem>Meu perfil</S.ListItem>
            <S.ListItem onClick={handleSignout}>Sair</S.ListItem>
          </ul>
        </S.Content>
      </S.Container>
      <S.Overlay isOpen={show} onClick={() => setShow(false)} />
    </S.Wrapper>
  );
};

export default UserDropdown;
