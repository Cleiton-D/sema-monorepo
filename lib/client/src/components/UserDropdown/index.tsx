import { useRouter } from 'next/router';

import { LogOut, User } from 'lucide-react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from 'components/shadcn/dropdown-menu';
import { Button } from 'components/shadcn/button';
import { Avatar, AvatarFallback, AvatarImage } from 'components/shadcn/avatar';

import { fetchAllSession, useUser } from 'requests/queries/session';
import { destroySession } from 'requests/mutations/session';

const UserDropdown = () => {
  const router = useRouter();

  const { data: user } = useUser();

  const handleSignout = async () => {
    await destroySession();
    await fetchAllSession();

    router.reload();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative">
          {user?.username}
          <Avatar className="h-10 w-10 ml-2">
            <AvatarImage src="/legacy/img/user2.png" alt="@shadcn" />
            <AvatarFallback>SC</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user?.username}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user?.login}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem className="hover:cursor-pointer">
            <User className="mr-2 h-4 w-4" />
            <span>Meu perfil</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem
            className="hover:cursor-pointer"
            onClick={handleSignout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span>Sair</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserDropdown;
