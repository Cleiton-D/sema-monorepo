import { memo, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';

import { Button } from 'components/shadcn/button';

import { useProfile } from 'requests/queries/session';

import { cn } from 'utils/cnHelper';

import {
  administrator,
  municipalSecretary,
  teacher,
  schoolAdministration
} from 'configs/sidebar.routes';

import * as S from './styles';

const Sidebar = () => {
  const { pathname } = useRouter();

  const { data: profile } = useProfile();

  const routes = useMemo(() => {
    if (profile?.branch?.type === 'MUNICIPAL_SECRETARY')
      return municipalSecretary;

    if (profile?.access_level?.code === 'administrator') return administrator;
    if (profile?.access_level?.code === 'teacher') return teacher;

    return schoolAdministration;
  }, [profile]);

  return (
    <aside
      style={{
        gridArea: 'sidebar',
        gridTemplateAreas: `
          'logo'
          'menu'
        `
      }}
      className="bg-background grid grid-rows-[8rem_1fr]"
    >
      <Link href="/auth" passHref>
        <S.Logo>
          <Image src="/img/new-logo.svg" width={160} height={90} />
        </S.Logo>
      </Link>

      <div className={cn('pb-12')}>
        <div className="space-y py-4">
          <div className="px-4 py-2">
            <div className="space-y-1">
              <Button
                variant={pathname === '/auth' ? 'secondary' : 'ghost'}
                size="sm"
                className="w-full justify-start"
              >
                <Link href="/auth" passHref>
                  <a className="w-full h-full flex flex-wrap justify-start content-center">
                    Início
                  </a>
                </Link>
              </Button>

              {routes.map(({ name, path }) => (
                <Button
                  key={`${name}-${path}`}
                  variant={path === pathname ? 'secondary' : 'ghost'}
                  size="sm"
                  className="w-full justify-start"
                >
                  <Link href={path} passHref>
                    <a className="w-full h-full flex flex-wrap justify-start content-center">
                      {name}
                    </a>
                  </Link>
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default memo(Sidebar);
