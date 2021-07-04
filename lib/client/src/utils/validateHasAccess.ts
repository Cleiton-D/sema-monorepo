import { AccessModule } from 'models/AccessModule';
import { Session } from 'next-auth';

export type WithAccessOptions = {
  module: string;
  rule?: 'READ' | 'WRITE';
};

export const validateHasAccess = (
  session: Session | null,
  modules: AccessModule[],
  { module, rule }: WithAccessOptions
) => {
  if (!session) return false;

  const findedModule = modules.find(
    ({ app_module }) => app_module.description === module
  );
  if (!findedModule) return false;

  if (rule) {
    if (rule === 'READ') return findedModule.read;
    if (rule === 'WRITE') return findedModule.write;
    return false;
  }

  return true;
};
