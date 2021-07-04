import { injectable, inject } from 'tsyringe';

import Address from '../infra/typeorm/entities/Address';
import IAdressesRepository from '../repositories/IAdressesRepository';

type CreateAddressRequest = {
  street: string;
  house_number: string;
  city: string;
  district: string;
  region: string;
};

@injectable()
export default class CreateAddressService {
  adressesRepository: IAdressesRepository;

  constructor(
    @inject('AdressesRepository') adressesRepository: IAdressesRepository,
  ) {
    this.adressesRepository = adressesRepository;
  }

  public async execute({
    street,
    house_number,
    city,
    district,
    region,
  }: CreateAddressRequest): Promise<Address> {
    const address = await this.adressesRepository.create({
      street,
      house_number,
      city,
      district,
      region,
    });

    return address;
  }
}
