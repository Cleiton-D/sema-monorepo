import { useState, useMemo } from 'react';
import { useRouter } from 'next/router';
import { signIn, useSession } from 'next-auth/react';

import { Check, ChevronsUpDown } from 'lucide-react';

import { useListUserProfiles } from 'requests/queries/user-profile';

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
import { cn } from 'utils/cnHelper';

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

  const handleClickItem = async (profileId: string) => {
    if (profileId === session?.profileId) {
      setOpen(false);
      return;
    }

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
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-auto max-w-6xl justify-between"
        >
          {selectedProfile
            ? selectedProfile.description
            : 'Selecione um perfil'}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[500px] p-0">
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
                    profile.id === session?.profileId
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
