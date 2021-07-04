import { parseISO, format } from 'date-fns';

import { User } from 'models/User';

export const userMapper = (user: User) => ({
  ...user,
  formattedCreatedAt: format(parseISO(user.created_at), "dd/MM/yyyy '-' HH:mm"),
  formattedUpdatedAt: format(parseISO(user.updated_at), "dd/MM/yyyy '-' HH:mm")
});
