import { useState, useMemo } from 'react';
import { useRouter } from 'next/router';
import { signIn, useSession } from 'next-auth/react';

import { useListUserProfiles } from 'requests/queries/user-profile';

import * as S from './styles';

const ProfileListDropdown = () => {
  const [open, setOpen] = useState(false);

  const { push } = useRouter();
  const { data: session } = useSession();
  const { data: userProfiles } = useListUserProfiles(session, {
    user_id: session?.id
  });

  const selectedProfile = useMemo(() => {
    const selected = userProfiles?.find(
      (profile) => profile.id === session?.profileId
    );
    return selected;
  }, [userProfiles, session]);

  const profilesWithoutSelected = useMemo(() => {
    if (!session?.profileId) return [];

    return userProfiles?.filter((profile) => profile.id !== session.profileId);
  }, [userProfiles, session]);

  const toggleDropdown = () => {
    setOpen((current) => !current);
  };

  const handleClickItem = async (profileId: string) => {
    await signIn('refresh', {
      profileId,
      schoolYearId: session?.configs.school_year_id,
      token: session?.jwt,
      redirect: false
    });
    push('/auth');

    setOpen(false);
  };

  return (
    <S.Wrapper>
      <S.Container isOpen={open}>
        <S.Title onClick={toggleDropdown}>
          {selectedProfile?.description} <S.ArrowIcon isOpen={open} />
        </S.Title>
        <S.Content isOpen={open}>
          <ul>
            {profilesWithoutSelected?.map(({ id, description }) => (
              <S.ListItem key={id} onClick={() => handleClickItem(id)}>
                {description}
              </S.ListItem>
            ))}
          </ul>
        </S.Content>
      </S.Container>
      <S.Overlay isOpen={open} onClick={() => setOpen(false)} />
    </S.Wrapper>
  );
};

export default ProfileListDropdown;
