import { getRepository, Repository } from 'typeorm';

import IAdressesRepository from '@modules/address/repositories/IAdressesRepository';
import Address from '../entities/Address';

import CreateAddressDTO from '../../../dtos/CreateAddressDTO';

export default class AdressesRepository implements IAdressesRepository {
  private ormRepository: Repository<Address>;

  constructor() {
    this.ormRepository = getRepository(Address);
  }

  public async findById(address_id: string): Promise<Address | undefined> {
    const address = await this.ormRepository.findOne(address_id);
    return address;
  }

  public async create({
    street,
    house_number,
    city,
    district,
    region,
  }: CreateAddressDTO): Promise<Address> {
    const address = this.ormRepository.create({
      street,
      house_number,
      city,
      district,
      region,
    });
    await this.ormRepository.save(address);

    return address;
  }

  public async update(address: Address): Promise<Address> {
    await this.ormRepository.save(address);
    return address;
  }
}
