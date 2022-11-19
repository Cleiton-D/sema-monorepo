import format from 'date-fns/format';

import { User } from 'models/User';

import { parseDateWithoutTimezone } from 'utils/parseDateWithoutTimezone';

export const userMapper = (user: User) => ({
  ...user,
  formattedCreatedAt: format(
    parseDateWithoutTimezone(user.created_at),
    "dd/MM/yyyy '-' HH:mm"
  ),
  formattedUpdatedAt: format(
    parseDateWithoutTimezone(user.updated_at),
    "dd/MM/yyyy '-' HH:mm"
  )
});
