import NextAuth from 'next-auth';
import { RedirectableProvider } from 'next-auth/client';

import { AccessModule } from 'models/AccessModule';
import { AccessLevel } from 'models/AccessLevel';

declare module 'next-auth' {
  interface Session {
    user: {
      name: string;
      email: string;
      changePassword: boolean;
      employeeId?: string;
    };
    jwt: string;
    id: string;
    schoolId?: string;
    configs: {
      school_year_id: string;
    };

    profileId?: string;
    branch: {
      id: string;
      type: 'SCHOOL' | 'MUNICIPAL_SECRETARY';
    };
    accessLevel?: AccessLevel;
  }
}

declare module 'next-auth/client' {
  export type CustomRedirectableProvider = RedirectableProvider | 'refresh';

  export function signIn<P extends SignInProvider = undefined>(
    provider?: P,
    options?: SignInOptions,
    authorizationParams?: SignInAuthorisationParams
  ): Promise<
    P extends CustomRedirectableProvider
      ? SignInResponse | undefined
      : undefined
  >;
}
