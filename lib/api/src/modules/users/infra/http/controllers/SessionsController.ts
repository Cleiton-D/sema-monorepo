import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { instanceToInstance } from 'class-transformer';

import privateRoute from '@shared/decorators/privateRoute';

import AuthenticateUserService from '@modules/users/services/AuthenticateUserService';
import GenerateUserTokenService from '@modules/users/services/GenerateUserTokenService';
import ListAccessModulesService from '@modules/authorization/services/ListAccessModulesService';
import ShowUserService from '@modules/users/services/ShowUserService';

class SessionsController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { login, password } = request.body;

    const authenticateUser = container.resolve(AuthenticateUserService);
    const user = await authenticateUser.execute({ login, password });

    const generateToken = container.resolve(GenerateUserTokenService);
    const { token, profile, school_year_id } = await generateToken.execute({
      user_id: user.id,
    });

    if (profile) {
      const listAccessModules = container.resolve(ListAccessModulesService);
      const accessModules = await listAccessModules.execute({
        access_level_id: profile.access_level_id,
      });

      return response.json({
        user: instanceToInstance(user),
        token,
        accessModules,
        profile,
        school_year_id,
      });
    }

    return response.json({
      user: instanceToInstance(user),
      accessModules: [],
      token,
      school_year_id,
    });
  }

  @privateRoute()
  public async update(request: Request, response: Response): Promise<Response> {
    const { profile_id, school_year_id } = request.body;
    const { id: user_id } = request.user;

    const showUser = container.resolve(ShowUserService);
    const user = await showUser.execute({ user_id });

    const generateToken = container.resolve(GenerateUserTokenService);
    const {
      token,
      profile,
      school_year_id: school_year,
    } = await generateToken.execute({
      user_id: user.id,
      user_profile_id: profile_id,
      school_year_id,
    });

    if (profile) {
      const listAccessModules = container.resolve(ListAccessModulesService);
      const accessModules = await listAccessModules.execute({
        access_level_id: profile.access_level_id,
      });

      return response.json({
        user: instanceToInstance(user),
        token,
        accessModules,
        profile,
        school_year_id: school_year,
      });
    }

    return response.json({
      user: instanceToInstance(user),
      accessModules: [],
      token,
      school_year_id: school_year,
    });
  }

  @privateRoute()
  public async validate(
    _request: Request,
    response: Response,
  ): Promise<Response> {
    return response.json({ status: 'ok' });
  }
}

export default SessionsController;
