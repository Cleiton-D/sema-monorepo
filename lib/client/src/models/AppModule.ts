import { AccessModule } from './AccessModule';

export type AppModule = {
  id: string;
  description: string;
  created_at: string;
  updated_at: string;
  access_modules: AccessModule[];
};
