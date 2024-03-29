import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { instanceToInstance } from 'class-transformer';

import privateRoute from '@shared/decorators/privateRoute';

import CreateEmployeeService from '@modules/employees/services/CreateEmployeeService';
import ListEmployeesService from '@modules/employees/services/ListEmployeesService';
import ShowEmployeeService from '@modules/employees/services/ShowEmployeeService';
import CountEmployeesService from '@modules/employees/services/CountEmployeesService';
import UpdateEmployeeService from '@modules/employees/services/UpdateEmployeeService';
import DeleteEmployeeService from '@modules/employees/services/DeleteEmployeeService';

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

    return response.json(instanceToInstance(employee));
  }

  public async index(request: Request, response: Response): Promise<Response> {
    const { accessCode, branch_id } = request.query;

    const listEmployees = container.resolve(ListEmployeesService);
    const employees = await listEmployees.execute({
      accessCode: accessCode as string,
      branch_id: branch_id as string,
    });

    return response.json(employees);
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
      address,
      contacts,
      education_level,
      pis_pasep,
      cpf,
      rg,
    } = request.body;

    const createEmployee = container.resolve(CreateEmployeeService);
    const employee = await createEmployee.execute({
      name,
      mother_name,
      dad_name,
      birth_date,
      gender,
      address,
      contacts,
      education_level,
      pis_pasep,
      cpf,
      rg,
    });

    return response.json(instanceToInstance(employee));
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const { employee_id } = request.params;

    const {
      name,
      mother_name,
      dad_name,
      birth_date,
      gender,
      address,
      contacts,
      education_level,
      pis_pasep,
      cpf,
      rg,
    } = request.body;

    const createEmployee = container.resolve(UpdateEmployeeService);
    const employee = await createEmployee.execute({
      employee_id,
      name,
      mother_name,
      dad_name,
      birth_date,
      gender,
      address,
      contacts,
      education_level,
      pis_pasep,
      cpf,
      rg,
    });

    return response.json(instanceToInstance(employee));
  }

  @privateRoute()
  public async delete(request: Request, response: Response): Promise<Response> {
    const { employee_id } = request.params;
    const { id: authenticated_user } = request.user;

    const deleteEmployee = container.resolve(DeleteEmployeeService);
    await deleteEmployee.execute({
      employee_id,
      auth_user_id: authenticated_user,
    });

    return response.status(204).send();
  }
}

export default EmployeesController;
