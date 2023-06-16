//import { NextApiRequest, NextApiResponse } from 'next';
//import NextAuth, { NextAuthOptions, Session } from 'next-auth';
//import { CredentialInput } from 'next-auth/providers';
//import { AxiosError, AxiosInstance } from 'axios';
//import { v4 as uuidv4 } from 'uuid';
//import Cookies from 'cookies';
//
//import { Credentials, Refresh } from 'providers';
//
//import { SchoolYear } from 'models/SchoolYear';
//import { Employee } from 'models/Employee';
//import { School } from 'models/School';
//import { Branch } from 'models/Branch';
//
//import { initializeApi } from 'services/api';
//
//const getEmployee = async (api: AxiosInstance, token?: string) => {
//  return await api
//    .get<Employee>(`/employees/me`, {
//      headers: { authorization: token ? `Bearer ${token}` : '' }
//    })
//    .then((response) => response.data)
//    .catch(() => undefined);
//};
//
//const getSchool = async (api: AxiosInstance, token?: string) => {
//  return api
//    .get<School>('/schools/me', {
//      headers: { authorization: token ? `Bearer ${token}` : '' }
//    })
//    .then((response) => response.data)
//    .catch(() => undefined);
//};
//
//const getBranch = async (api: AxiosInstance, token?: string) => {
//  return api
//    .get<Branch>('/app/branchs/me', {
//      headers: { authorization: token ? `Bearer ${token}` : '' }
//    })
//    .then((response) => response.data)
//    .catch((err) => console.log(err));
//};
//
//const refreshProvider = Refresh<Record<string, CredentialInput>>({
//  name: 'refresh',
//  credentials: {},
//  async authorize(params) {
//    if (!params) return null;
//
//    const { profileId, schoolYearId, token } = params;
//
//    const api = initializeApi();
//    try {
//      const response = await api.put(
//        '/sessions',
//        { profile_id: profileId, school_year_id: schoolYearId },
//        {
//          headers: { authorization: token ? `Bearer ${token}` : '' }
//        }
//      );
//
//      const { data } = response;
//      if (data.user) {
//        const [employee, school, branch] = await Promise.all([
//          getEmployee(api, data.token),
//          getSchool(api, data.token),
//          getBranch(api, data.token)
//        ]);
//
//        return {
//          ...data.user,
//          name: data.user.username,
//          jwt: data.token,
//          employeeId: employee?.id,
//          profileId: data.profile.id,
//          accessLevel: data.profile.access_level,
//          schoolYearId: data.school_year_id,
//          schoolId: school?.id,
//          branchId: branch?.id,
//          branchType: branch?.type
//        };
//      }
//
//      return null;
//    } catch (err) {
//      return null;
//    }
//  }
//});
//
//const signInProvider = Credentials<Record<string, CredentialInput>>({
//  name: 'sign-in',
//  credentials: {},
//  async authorize(params) {
//    if (!params) return null;
//
//    const { email, password } = params;
//
//    const api = initializeApi();
//
//    try {
//      const response = await api.post(`/sessions`, {
//        login: email,
//        password
//      });
//
//      const { data } = response;
//      if (data.user) {
//        const [employee, school, branch] = await Promise.all([
//          getEmployee(api, data.token),
//          getSchool(api, data.token),
//          getBranch(api, data.token)
//        ]);
//
//        return {
//          ...data.user,
//          name: data.user.username,
//          jwt: data.token,
//          employeeId: employee?.id,
//          profileId: data.profile?.id,
//          accessLevel: data.profile?.access_level,
//          schoolYearId: data.school_year_id,
//          schoolId: school ? school.id : undefined,
//          branchId: branch ? branch.id : undefined,
//          branchType: branch ? branch.type : undefined
//        };
//      }
//    } catch (err) {
//      console.log(err);
//    }
//    return null;
//  }
//});
//
//const createOptions = (
//  sessionId?: string
//): NextAuthOptions & { site?: string } => {
//  return {
//    site: process.env.NEXTAUTH_URL,
//    jwt: {
//      secret: process.env.JWT_SIGNING_PRIVATE_KEY
//    },
//    secret: 'Q0yLUJWJw+fsHG98mWLOZq/lxYMD8q1xDRxGJqROhTY=',
//    pages: {
//      signIn: '/sign-in'
//    },
//    providers: [signInProvider, refreshProvider],
//    callbacks: {
//      session: async (...args) => {
//        const { token, session } = args[0];
//        if (token.sessionId !== sessionId) {
//          return Promise.resolve({} as Session);
//        }
//
//        const api = initializeApi();
//
//        try {
//          await api.get('/sessions/validate', {
//            headers: { authorization: token.jwt ? `Bearer ${token.jwt}` : '' }
//          });
//        } catch (err) {
//          const { response } = err as AxiosError;
//
//          if (response?.status === 401) {
//            return Promise.resolve({} as Session);
//          }
//        }
//
//        const sessionConfigs: Record<string, string | undefined> = {};
//
//        try {
//          const { data: schoolYear } = await api.get<SchoolYear>(
//            `/education/admin/school-years/${token.schoolYearId || 'current'}`,
//            {
//              headers: { authorization: token.jwt ? `Bearer ${token.jwt}` : '' }
//            }
//          );
//
//          sessionConfigs.school_year_id = schoolYear?.id;
//        } catch {
//          sessionConfigs.school_year_id = undefined;
//        }
//
//        const {
//          schoolId,
//          profileId,
//          accessLevel,
//          jwt,
//          branchId,
//          branchType,
//          ...rest
//        } = token;
//
//        session.jwt = jwt;
//        session.id = token.id;
//        session.user = {
//          ...rest
//        };
//        session.profileId = profileId;
//        session.accessLevel = accessLevel;
//        session.schoolId = schoolId;
//        session.branch = {
//          id: branchId,
//          type: branchType
//        };
//        session.configs = sessionConfigs;
//
//        return Promise.resolve(session);
//      },
//      jwt: async (args) => {
//        const { token, user } = args;
//        if (user) {
//          token.id = user.id;
//          token.changePassword = user.change_password;
//          token.email = user.login;
//          token.jwt = user.jwt;
//          token.profileId = user.profileId;
//          token.accessLevel = user.accessLevel;
//          token.schoolId = user.schoolId;
//          token.employeeId = user.employeeId;
//          token.branchId = user.branchId;
//          token.branchType = user.branchType;
//          token.schoolYearId = user.schoolYearId;
//        }
//
//        if (!token.sessionId) {
//          token.sessionId = sessionId;
//        }
//
//        return Promise.resolve(token);
//      }
//    }
//  };
//};
//
//const Auth = async (request: NextApiRequest, response: NextApiResponse) => {
//  const cookies = new Cookies(request, response);
//
//  let sessionId = cookies.get('next-auth.session-id');
//  if (!sessionId) {
//    sessionId = uuidv4();
//    cookies.set('next-auth.session-id', sessionId);
//  }
//
//  return NextAuth(request, response, createOptions(sessionId));
//};
//
//export default Auth;
