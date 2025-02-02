import { SessionAccess } from 'models/Session';

export type WithAccessOptions = {
  module: string;
  rule?: 'READ' | 'WRITE';
};

export const validateHasAccess = (
  modules: SessionAccess[],
  { module, rule }: WithAccessOptions
) => {
  if (!Array.isArray(modules)) return true;

  const findedModule = modules?.find(({ app_module }) => app_module === module);
  if (!findedModule) return false;

  if (!rule) return true;

  if (findedModule.access_level === 'WRITE') return true;

  return findedModule.access_level === rule;
};
