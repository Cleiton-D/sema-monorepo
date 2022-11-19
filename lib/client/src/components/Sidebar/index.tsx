import { memo, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';

import {
  administrator,
  municipalSecretary,
  teacher,
  schoolAdministration
} from 'configs/sidebar.routes';

import * as S from './styles';

const Sidebar = () => {
  const { pathname } = useRouter();

  const { data: session } = useSession();
  const routes = useMemo(() => {
    if (session?.branch.type === 'MUNICIPAL_SECRETARY')
      return municipalSecretary;

    if (session?.accessLevel?.code === 'administrator') return administrator;
    if (session?.accessLevel?.code === 'teacher') return teacher;

    return schoolAdministration;
  }, [session]);

  return (
    <S.Wrapper>
      <Link href="/auth" passHref>
        <S.Logo>
          <Image src="/img/new-logo.svg" width={160} height={90} />
        </S.Logo>
      </Link>
      <S.Menu>
        <S.MenuItem active={pathname === '/auth'}>
          <Link href="/auth" passHref>
            <a>Início</a>
          </Link>
        </S.MenuItem>
        {routes.map(({ name, path }) => (
          <S.MenuItem key={`${name}-${path}`} active={path === pathname}>
            <Link href={path} passHref>
              <a>{name}</a>
            </Link>
          </S.MenuItem>
        ))}
      </S.Menu>
    </S.Wrapper>
  );
};

export default memo(Sidebar);
