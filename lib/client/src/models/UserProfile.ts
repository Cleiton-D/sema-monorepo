import { AccessLevel } from './AccessLevel';
import { Branch } from './Branch';

export type UserProfile = {
  id: string;
  description: string;
  user_id: string;
  branch_id: string;
  branch?: Branch;
  access_level_id: string;
  access_level?: AccessLevel;
  default_profile: boolean;
  created_at: string;
  updated_at: string;
};
