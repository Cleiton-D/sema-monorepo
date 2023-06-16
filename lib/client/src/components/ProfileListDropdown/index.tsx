import { useState, useMemo } from 'react';
import { useRouter } from 'next/router';

import { useListUserProfiles } from 'requests/queries/user-profile';

import * as S from './styles';
import {
  fetchAllSession,
  useProfile,
  useSessionSchoolYear,
  useUser
} from 'requests/queries/session';
import { refreshSession } from 'requests/mutations/session';

const ProfileListDropdown = () => {
  const [open, setOpen] = useState(false);

  const { push } = useRouter();

  const { data: user } = useUser();
  const { data: currentProfile } = useProfile();
  const { data: schoolYear } = useSessionSchoolYear();

  const { data: userProfiles } = useListUserProfiles({
    user_id: user?.id
  });

  const selectedProfile = useMemo(() => {
    const selected = userProfiles?.find(
      (profile) => profile.id === currentProfile?.id
    );
    return selected;
  }, [userProfiles, currentProfile]);

  const profilesWithoutSelected = useMemo(() => {
    if (!currentProfile?.id) return [];

    return userProfiles?.filter((profile) => profile.id !== currentProfile?.id);
  }, [userProfiles, currentProfile]);

  const toggleDropdown = () => {
    setOpen((current) => !current);
  };

  const handleClickItem = async (profileId: string) => {
    await refreshSession({
      profileId,
      schoolYearId: schoolYear?.id
    });
    await fetchAllSession();

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
