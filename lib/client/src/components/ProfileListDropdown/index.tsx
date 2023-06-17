import { useState, useMemo } from 'react';
import { useRouter } from 'next/router';

import { Check, ChevronsUpDown } from 'lucide-react';

import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from 'components/shadcn/popover';
import { Button } from 'components/shadcn/button';
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem
} from 'components/shadcn/command';

import { useListUserProfiles } from 'requests/queries/user-profile';
import {
  fetchAllSession,
  useProfile,
  useSessionSchoolYear,
  useUser
} from 'requests/queries/session';
import { refreshSession } from 'requests/mutations/session';

import { cn } from 'utils/cnHelper';

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

  const handleClickItem = async (profileId: string) => {
    if (profileId === currentProfile?.id) {
      setOpen(false);
      return;
    }

    await refreshSession({
      profileId,
      schoolYearId: schoolYear?.id
    });
    await fetchAllSession();

    push('/auth');
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-auto max-w-6xl justify-between"
        >
          <span className="text-ellipsis">
            {selectedProfile
              ? selectedProfile.description
              : 'Selecione um perfil'}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[50rem] p-0">
        <Command>
          <CommandInput placeholder="Pesquisar perfil..." />
          <CommandGroup>
            {userProfiles?.map((profile) => (
              <CommandItem
                key={profile.id}
                onSelect={() => handleClickItem(profile.id)}
                className="hover:cursor-pointer"
              >
                <Check
                  className={cn(
                    'mr-2 h-4 w-4',
                    profile.id === currentProfile?.id
                      ? 'opacity-100'
                      : 'opacity-0'
                  )}
                />
                {profile.description}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default ProfileListDropdown;
