import { AppModule } from './AppModule';

export type AccessModule = {
  id: string;
  access_level_id: string;
  app_module_id: string;
  app_module: AppModule;
  read: boolean;
  write: boolean;
  created_at: string;
  updated_at: string;
};
