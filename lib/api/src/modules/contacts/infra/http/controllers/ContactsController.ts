import { Request, Response } from 'express';
import { container } from 'tsyringe';

import CreateContactService from '@modules/contacts/services/CreateContactService';

export default class ContactsController {
  public async create(request: Request, response: Response): Promise<Response> {
    const requestData = request.body;

    const createContact = container.resolve(CreateContactService);
    const contact = await createContact.execute(requestData);

    return response.json(contact);
  }
}
