import { container } from 'tsyringe';

import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import ensureModuleAccess from '@modules/authorization/infra/http/middlewares/ensureModuleAccess';
import ShowUserProfileService from '@modules/users/services/ShowUserProfileService';

type PrivateRouteProps = {
  module: string;
  rule?: 'READ' | 'WRITE';
};

function privateRoute(params?: PrivateRouteProps) {
  return (
    _target: any,
    _propertyKey: string,
    propertyDescriptor: PropertyDescriptor,
  ): PropertyDescriptor => {
    const originalMethod = propertyDescriptor.value;

    // eslint-disable-next-line no-param-reassign
    propertyDescriptor.value = async function newMethod(...args: any) {
      const { profileId } = await ensureAuthenticated.apply(this, args);

      const showUserProfile = container.resolve(ShowUserProfileService);
      const userProfile = await showUserProfile.execute({
        user_profile_id: profileId,
      });

      if (params) {
        const { module, rule } = params;
        await ensureModuleAccess({
          module,
          rule,
          access_level_id: userProfile.access_level_id,
        });
      }

      const [request] = args;
      request.profile = {
        id: userProfile.id,
        access_level_id: userProfile.access_level_id,
        branch_id: userProfile.branch_id,
      };

      return originalMethod.apply(this, args);
    };

    return propertyDescriptor;
  };
}

export default privateRoute;
