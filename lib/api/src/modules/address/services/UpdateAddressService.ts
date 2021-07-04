import AppError from '@shared/errors/AppError';
import { injectable, inject } from 'tsyringe';

import Address from '../infra/typeorm/entities/Address';
import IAdressesRepository from '../repositories/IAdressesRepository';

type UpdateAddressRequest = {
  address_id: string;
  street: string;
  house_number: string;
  city: string;
  district: string;
  region: string;
};

@injectable()
class UpdateAddressService {
  adressesRepository: IAdressesRepository;

  constructor(
    @inject('AdressesRepository') adressesRepository: IAdressesRepository,
  ) {
    this.adressesRepository = adressesRepository;
  }

  public async execute({
    address_id,
    street,
    house_number,
    city,
    district,
    region,
  }: UpdateAddressRequest): Promise<Address> {
    const address = await this.adressesRepository.findById(address_id);
    if (!address) {
      throw new AppError('Address not found!');
    }

    Object.assign(address, {
      street,
      house_number,
      city,
      district,
      region,
    });

    await this.adressesRepository.update(address);
    return address;
  }
}

export default UpdateAddressService;
