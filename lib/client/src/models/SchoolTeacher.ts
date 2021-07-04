import { Employee } from './Employee';
import { School } from './School';

export type SchoolTeacher = {
  id: string;
  employee_id: string;
  employee: Employee;
  school_id: string;
  school?: School;
  created_at: string;
  updated_at: string;
};
