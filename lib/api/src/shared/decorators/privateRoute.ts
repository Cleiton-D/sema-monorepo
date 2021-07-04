import { Request } from 'express';

import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import ensureModuleAccess from '@modules/authorization/infra/http/middlewares/ensureModuleAccess';

type PrivateRouteProps = {
  module: string;
  rule?: 'READ' | 'WRITE';
};

function privateRoute(params?: PrivateRouteProps) {
  return (
    target: any,
    propertyKey: string,
    propertyDescriptor: PropertyDescriptor,
  ): PropertyDescriptor => {
    const originalMethod = propertyDescriptor.value;

    // eslint-disable-next-line no-param-reassign
    propertyDescriptor.value = async function newMethod(...args: any) {
      const { profileId } = await ensureAuthenticated.apply(this, args);

      if (params) {
        const { module, rule } = params;

        const validateAcess = async function validateAcess(request: Request) {
          const { userProfile } = await ensureModuleAccess({
            module,
            rule,
            user_profile_id: profileId,
          });

          request.profile = {
            id: userProfile.id,
            branch_id: userProfile.branch_id,
          };
        };

        await validateAcess.apply(this, args);
      }

      return originalMethod.apply(this, args);
    };

    return propertyDescriptor;
  };
}

export default privateRoute;
