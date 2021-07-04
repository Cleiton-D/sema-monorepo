import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';

import privateRoute from '@shared/decorators/privateRoute';

import CreateEmployeeService from '@modules/employees/services/CreateEmployeeService';
import ListEmployeesService from '@modules/employees/services/ListEmployeesService';
import ShowEmployeeService from '@modules/employees/services/ShowEmployeeService';
import CountEmployeesService from '@modules/employees/services/CountEmployeesService';

class EmployeesController {
  @privateRoute()
  public async show(request: Request, response: Response): Promise<Response> {
    const { employee_id } = request.params;
    const { branch, accessCode } = request.query;

    const { id: userId } = request.user;

    const showEmployee = container.resolve(ShowEmployeeService);
    const employee = await showEmployee.execute({
      employee_id,
      user_id: employee_id === 'me' ? userId : undefined,
      branch_id: branch as string,
      accessCode: accessCode as string,
    });

    return response.json(classToClass(employee));
  }

  public async index(request: Request, response: Response): Promise<Response> {
    const { accessCode, branch_id } = request.query;

    const listEmployees = container.resolve(ListEmployeesService);
    const employees = await listEmployees.execute({
      accessCode: accessCode as string,
      branch_id: branch_id as string,
    });

    return response.json(classToClass(employees));
  }

  public async count(request: Request, response: Response): Promise<Response> {
    const countEmployees = container.resolve(CountEmployeesService);
    const countResult = await countEmployees.execute();

    return response.json(countResult);
  }

  public async create(request: Request, response: Response): Promise<Response> {
    const {
      name,
      mother_name,
      dad_name,
      birth_date,
      gender,
      documents,
      address,
      contacts,
      education_level,
      pis_pasep,
    } = request.body;

    const createEmployee = container.resolve(CreateEmployeeService);
    const employee = await createEmployee.execute({
      name,
      mother_name,
      dad_name,
      birth_date,
      gender,
      documents,
      address,
      contacts,
      education_level,
      pis_pasep,
    });

    return response.json(classToClass(employee));
  }
}

export default EmployeesController;
