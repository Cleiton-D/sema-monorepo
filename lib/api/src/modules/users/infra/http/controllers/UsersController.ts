import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';

import ChangePasswordService from '@modules/users/services/ChangePasswordService';
import ShowUserService from '@modules/users/services/ShowUserService';
import ListUsersService from '@modules/users/services/ListUsersService';
import CreateUserService from '@modules/users/services/CreateUserService';
import DeleteUserService from '@modules/users/services/DeleteUserService';

import privateRoute from '@shared/decorators/privateRoute';
import CountUsersService from '@modules/users/services/CountUsersService';

class UsersController {
  @privateRoute()
  public async show_me(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const { id } = request.user;

    const showUser = container.resolve(ShowUserService);
    const user = await showUser.execute({ user_id: id });

    return response.json(classToClass(user));
  }

  public async index(request: Request, response: Response): Promise<Response> {
    const listUsers = container.resolve(ListUsersService);
    const users = await listUsers.execute();

    return response.json(classToClass(users));
  }

  public async count(request: Request, response: Response): Promise<Response> {
    const countUsers = container.resolve(CountUsersService);
    const countResult = await countUsers.execute();

    return response.json(countResult);
  }

  public async create(request: Request, response: Response): Promise<Response> {
    const { username, login } = request.body;

    const createUser = container.resolve(CreateUserService);
    const user = await createUser.execute({
      username,
      login,
      password: '12345678',
    });

    return response.json(classToClass(user));
  }

  @privateRoute()
  public async update_password(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const { user_id } = request.params;
    const { password } = request.body;
    const { id: authenticated_user } = request.user;

    const changePassword = container.resolve(ChangePasswordService);
    const user = await changePassword.execute({
      user_id,
      authenticated_user,
      password,
    });

    return response.json(classToClass(user));
  }

  @privateRoute()
  public async delete(request: Request, response: Response): Promise<Response> {
    const { user_id } = request.params;
    const { id: authenticated_user } = request.user;

    const deleteUser = container.resolve(DeleteUserService);
    await deleteUser.execute({ user_id, auth_user_id: authenticated_user });

    return response.status(204).send();
  }
}

export default UsersController;
