import CreateAddressDTO from '../dtos/CreateAddressDTO';
import Address from '../infra/typeorm/entities/Address';

export default interface IAdressesRepository {
  findById(address_id: string): Promise<Address | undefined>;
  create(address: CreateAddressDTO): Promise<Address>;
  update(address: Address): Promise<Address>;
}
