export type User = {
  id: string;
  login: string;
  username: string;
  change_password: boolean;
  created_at: string;
  updated_at: string;
};

export type FormattedUser = User & {
  formattedCreatedAt: string;
  formattedUpdatedAt: string;
};
