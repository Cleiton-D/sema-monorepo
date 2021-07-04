import { NextApiRequest, NextApiResponse } from 'next';
import NextAuth from 'next-auth';
import { AxiosInstance } from 'axios';

import { Credentials, Refresh } from 'providers';

import { SchoolYear } from 'models/SchoolYear';
import { Employee } from 'models/Employee';
import { School } from 'models/School';
import { Branch } from 'models/Branch';

import { initializeApi } from 'services/api';

const getEmployee = async (api: AxiosInstance, token?: string) => {
  return await api
    .get<Employee>(`/employees/me`, {
      headers: { authorization: token ? `Bearer ${token}` : '' }
    })
    .then((response) => response.data)
    .catch(() => undefined);
};

const getSchool = async (api: AxiosInstance, token?: string) => {
  return api
    .get<School>('/schools/me', {
      headers: { authorization: token ? `Bearer ${token}` : '' }
    })
    .then((response) => response.data)
    .catch(() => undefined);
};

const getBranch = async (api: AxiosInstance, token?: string) => {
  return api
    .get<Branch>('/app/branchs/me', {
      headers: { authorization: token ? `Bearer ${token}` : '' }
    })
    .then((response) => response.data)
    .catch(() => undefined);
};

const refreshProvider = Refresh({
  name: 'refresh',
  credentials: {},
  async authorize({ profileId, token }: Record<string, string>) {
    const api = initializeApi();

    try {
      const response = await api.put(
        '/sessions',
        { profile_id: profileId },
        {
          headers: { authorization: token ? `Bearer ${token}` : '' }
        }
      );

      const { data } = response;
      if (data.user) {
        const [employee, school, branch] = await Promise.all([
          getEmployee(api, data.token),
          getSchool(api, data.token),
          getBranch(api, data.token)
        ]);

        return {
          ...data.user,
          name: data.user.username,
          jwt: data.token,
          employeeId: employee?.id,
          profileId: data.profile.id,
          accessLevel: data.profile.access_level,
          schoolId: school?.id,
          branchId: branch?.id,
          branchType: branch?.type
        };
      }

      return null;
    } catch (err) {
      return null;
    }
  }
});

const signInProvider = Credentials({
  name: 'sign-in',
  credentials: {},
  async authorize({ email, password }: Record<string, string>) {
    const api = initializeApi();

    try {
      const response = await api.post(`/sessions`, {
        login: email,
        password
      });

      const { data } = response;
      if (data.user) {
        const [employee, school, branch] = await Promise.all([
          getEmployee(api, data.token),
          getSchool(api, data.token),
          getBranch(api, data.token)
        ]);

        return {
          ...data.user,
          name: data.user.username,
          jwt: data.token,
          employeeId: employee?.id,
          profileId: data.profile.id,
          accessLevel: data.profile.access_level,
          schoolId: school ? school.id : undefined,
          branchId: branch ? branch.id : undefined,
          branchType: branch ? branch.type : undefined
        };
      }
    } catch (err) {
      console.log(err);
    }
    return null;
  }
});

const options = {
  jwt: {
    signingKey: process.env.JWT_SIGNING_PRIVATE_KEY
  },
  pages: {
    signIn: '/sign-in'
  },
  providers: [signInProvider, refreshProvider],
  callbacks: {
    session: async (session: any, user: any) => {
      const api = initializeApi();

      const { data } = await api.get('/users/me', {
        headers: { authorization: user.jwt ? `Bearer ${user.jwt}` : '' }
      });

      const {
        school_year_id,
        schoolId,
        profileId,
        accessLevel,
        jwt,
        branchId,
        branchType,
        ...rest
      } = user;

      session.jwt = jwt;
      session.id = user.id;
      session.user = {
        ...rest,
        changePassword: data.change_password
      };
      session.profileId = profileId;
      session.accessLevel = accessLevel;
      session.schoolId = schoolId;
      session.branch = {
        id: branchId,
        type: branchType
      };
      session.configs = {
        school_year_id: school_year_id
      };

      return Promise.resolve(session);
    },
    jwt: async (token: any, user: any) => {
      if (user) {
        const api = initializeApi();

        try {
          const { data } = await api.get<SchoolYear>(
            '/education/admin/school-years/current',
            {
              headers: { authorization: user.jwt ? `Bearer ${user.jwt}` : '' }
            }
          );

          token.school_year_id = data?.id;
        } catch {
          token.school_year_id = undefined;
        }

        token.id = user.id;
        token.email = user.login;
        token.jwt = user.jwt;
        token.profileId = user.profileId;
        token.accessLevel = user.accessLevel;
        token.schoolId = user.schoolId;
        token.employeeId = user.employeeId;
        token.branchId = user.branchId;
        token.branchType = user.branchType;
      }

      return Promise.resolve(token);
    }
  }
};

const Auth = (request: NextApiRequest, response: NextApiResponse) =>
  NextAuth(request, response, options);

export default Auth;
