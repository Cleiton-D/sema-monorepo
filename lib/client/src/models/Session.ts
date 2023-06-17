import { Employee } from './Employee';
import { School } from './School';
import { User } from './User';
import { UserProfile } from './UserProfile';

export type SessionAccess = {
  access_level: 'WRITE' | 'READ';
  app_module: string;
};

export type UserWithEmployee = User & {
  employee?: Employee;
};

export type ProfileWithSchool = UserProfile & {
  school?: School;
};
