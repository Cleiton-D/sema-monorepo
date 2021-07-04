declare namespace Express {
  export interface Request {
    user: {
      id: string;
    };
    profile: {
      id: string;
      branch_id: string;
    };
  }
}
