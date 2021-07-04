import { Request } from 'express';
import { verify } from 'jsonwebtoken';
import { container } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import authConfig from '@config/auth';

import FindUserService from '@modules/users/services/FindUserService';
import User from '@modules/users/infra/typeorm/entities/User';

type TokenPayload = {
  iat: number;
  exp: number;
  sub: string;
  pfl?: string;
};

type EnsureAuthenticatedResponse = {
  user: User;
  profileId?: string;
};

function verifyToken(token: string) {
  try {
    const decoded = verify(token, authConfig.jwt.secret);
    return decoded as TokenPayload;
  } catch {
    throw new AppError('Invalid JWT Token', 401);
  }
}

const ensureAuthenticated = async (
  request: Request,
): Promise<EnsureAuthenticatedResponse> => {
  const { authorization } = request.headers;

  if (!authorization) {
    throw new AppError('JWT token is missing', 401);
  }

  const [, token] = authorization.split(' ');
  const { sub, pfl } = verifyToken(token);

  const findUser = container.resolve(FindUserService);
  const user = await findUser.execute({ user_id: sub });

  request.user = {
    id: user.id,
  };

  return { user, profileId: pfl };
};

export default ensureAuthenticated;
