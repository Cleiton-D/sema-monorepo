type CreateUserProfileDTO = {
  user_id: string;
  branch_id: string;
  access_level_id: string;
  description: string;
  default_profile: boolean;
};

export default CreateUserProfileDTO;
