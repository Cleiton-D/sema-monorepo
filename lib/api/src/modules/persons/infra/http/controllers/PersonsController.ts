import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { instanceToInstance } from 'class-transformer';

import ShowPersonService from '@modules/persons/services/ShowPersonService';

class PersonsController {
  public async show(request: Request, response: Response): Promise<Response> {
    const { person_id } = request.params;

    const showPerson = container.resolve(ShowPersonService);
    const person = await showPerson.execute({ person_id });

    return response.json(instanceToInstance(person));
  }
}

export default PersonsController;
