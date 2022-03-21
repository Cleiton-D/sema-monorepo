import { Router } from 'express';

import EmployeesController from '../controllers/EmployeesController';

const employeesRouter = Router();

const employeesController = new EmployeesController();

employeesRouter.get('/count', employeesController.count);
employeesRouter.get('/show', employeesController.show);
employeesRouter.get('/:employee_id', employeesController.show);
employeesRouter.get('/', employeesController.index);
employeesRouter.post('/', employeesController.create);
employeesRouter.put('/:employee_id', employeesController.update);
employeesRouter.delete('/:employee_id', employeesController.delete);

export default employeesRouter;
