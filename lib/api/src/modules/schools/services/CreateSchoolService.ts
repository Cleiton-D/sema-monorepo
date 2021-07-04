import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import { ContactType } from '@modules/contacts/infra/typeorm/entities/Contact';
import CreateAddressService from '@modules/address/services/CreateAddressService';
import CreateContactService from '@modules/contacts/services/CreateContactService';
import IBranchRepository from '@modules/authorization/repositories/IBranchRepository';
import CreateUserProfileService from '@modules/users/services/CreateUserProfileService';
import UserProfile from '@modules/users/infra/typeorm/entities/UserProfile';

import IEmployeesRepository from '@modules/employees/repositories/IEmployeesRepository';
import ISchoolsRepository from '../repositories/ISchoolsRepository';

import School from '../infra/typeorm/entities/School';

type AddressData = {
  street: string;
  house_number: string;
  city: string;
  district: string;
  region: string;
};

type ContactData = {
  description: string;
  type: ContactType;
};

type CreateSchoolResquest = {
  name: string;
  inep_code: string;
  director_id: string;
  vice_director_id: string;
  address: AddressData;
  contacts: ContactData[];
  employees: Record<string, string[]>;
};

@injectable()
class CreateSchoolService {
  constructor(
    @inject('BranchRepository') private branchRepository: IBranchRepository,
    @inject('SchoolsRepository') private schoolsRepository: ISchoolsRepository,
    @inject('EmployeesRepository')
    private employeesRepository: IEmployeesRepository,
    private createAddressService: CreateAddressService,
    private createContactService: CreateContactService,
    private createUserProfileService: CreateUserProfileService,
  ) {}

  public async execute({
    name,
    inep_code,
    director_id,
    vice_director_id,
    address: addressData,
    contacts: contactsData,
    employees,
  }: CreateSchoolResquest): Promise<School> {
    const existingInepCode = await this.schoolsRepository.findOne({
      inep_code,
    });

    if (existingInepCode) {
      throw new AppError('There is already a school with this Inep code');
    }

    const [director, viceDirector] = await Promise.all([
      await this.employeesRepository.findOne({
        id: director_id,
      }),
      this.employeesRepository.findOne({
        id: vice_director_id,
      }),
    ]);

    if (!director || !viceDirector) {
      throw new AppError('Employee not found');
    }

    const contacts = await Promise.all(
      contactsData.map(({ description, type }) =>
        this.createContactService.execute({ description, type }),
      ),
    );

    const { city, district, house_number, region, street } = addressData;
    const address = await this.createAddressService.execute({
      city,
      district,
      house_number,
      region,
      street,
    });

    const branch = await this.branchRepository.create({
      description: name,
      type: 'SCHOOL',
    });

    const profilesPromises = Object.entries(employees).reduce<
      Promise<UserProfile>[]
    >((acc, item) => {
      const [profile, users] = item;
      const requests = users.map(user_id =>
        this.createUserProfileService.execute({
          branch_id: branch.id,
          user_id,
          access_level_name: profile,
        }),
      );

      return [...acc, ...requests];
    }, []);

    const directoryPromises = [
      this.createUserProfileService.execute({
        branch_id: branch.id,
        access_level_name: 'director',
        user_id: director.user_id,
      }),
      this.createUserProfileService.execute({
        branch_id: branch.id,
        access_level_name: 'vice-director',
        user_id: viceDirector.user_id,
      }),
    ];
    await Promise.all([...profilesPromises, ...directoryPromises]);

    const school = await this.schoolsRepository.create({
      name,
      inep_code,
      director_id,
      vice_director_id,
      branch,
      address,
      contacts,
    });

    return school;
  }
}

export default CreateSchoolService;
