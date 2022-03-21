import NextAuth from 'next-auth';
import { RedirectableProvider } from 'next-auth/react';

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
      school_year_id?: string;
    };

    profileId?: string;
    branch: {
      id: string;
      type: 'SCHOOL' | 'MUNICIPAL_SECRETARY';
    };
    accessLevel?: AccessLevel;
  }

  interface User {
    id: string;
    login: string;
    jwt: string;
    name: string;
    email: string;
    change_password: boolean;
    profileId: string;
    accessLevel: AccessLevel;
    schoolId: string;
    branchId: string;
    branchType: 'SCHOOL' | 'MUNICIPAL_SECRETARY';
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    login: string;
    jwt: string;
    name: string;
    email: string;
    changePassword: boolean;
    profileId: string;
    accessLevel: AccessLevel;
    schoolId: string;
    branchId: string;
    branchType: 'SCHOOL' | 'MUNICIPAL_SECRETARY';
  }
}
declare module 'next-auth/react' {
  export type CustomRedirectableProvider =
    | RedirectableProvider
    | 'refresh'
    | 'manualsignout';

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
