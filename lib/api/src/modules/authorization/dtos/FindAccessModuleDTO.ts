type FindAccessModuleDTO = {
  id?: string;
  access_level_id?: string | string[];
  module_id?: string | string[];
  module_name?: string;
  read?: boolean;
  write?: boolean;
};

export default FindAccessModuleDTO;
