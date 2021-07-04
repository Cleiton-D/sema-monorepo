import Employee from '@modules/employees/infra/typeorm/entities/Employee';

type CreateTeacherDTO = {
  employee: Employee;
};

export default CreateTeacherDTO;
