import { Request, Response } from 'express';
import { container } from 'tsyringe';

import CreateAddressService from '@modules/address/services/CreateAddressService';

export default class AdressesController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { street, house_number, city, district, region } = request.body;

    const createAddress = container.resolve(CreateAddressService);
    const address = await createAddress.execute({
      street,
      house_number,
      city,
      district,
      region,
    });

    return response.json(address);
  }
}
