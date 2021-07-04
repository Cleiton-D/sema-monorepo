type CreateAccessModuleDTO = {
  access_level_id: string;
  module_id: string;
  read: boolean;
  write: boolean;
};

export default CreateAccessModuleDTO;
