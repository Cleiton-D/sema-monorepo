declare namespace Express {
  export interface Request {
    user: {
      id: string;
    };
    profile: {
      id: string;
      access_level_id: string;
      branch_id: string;
    };
  }
}
