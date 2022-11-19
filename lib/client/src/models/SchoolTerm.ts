export type SchoolTerm =
  | 'FIRST'
  | 'SECOND'
  | 'THIRD'
  | 'FOURTH'
  | 'FIRST-REC'
  | 'SECOND-REC'
  | 'EXAM';

export type LowedSchoolTerm = Replace<Lowercase<SchoolTerm>, '-', '_'>;
