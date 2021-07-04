import { inject, injectable } from 'tsyringe';

import { ContactType } from '@modules/contacts/infra/typeorm/entities/Contact';
import RemoveContactService from '@modules/contacts/services/RemoveContactService';
import CreateContactService from '@modules/contacts/services/CreateContactService';
import UpdateAddressService from '@modules/address/services/UpdateAddressService';
import IBranchRepository from '@modules/authorization/repositories/IBranchRepository';
import IEmployeesRepository from '@modules/employees/repositories/IEmployeesRepository';
import DeleteUserProfileService from '@modules/users/services/DeleteUserProfileService';
import CreateUserProfileService from '@modules/users/services/CreateUserProfileService';

import AppError from '@shared/errors/AppError';

import School from '../infra/typeorm/entities/School';
import ISchoolsRepository from '../repositories/ISchoolsRepository';
import ISchoolContactsRepository from '../repositories/ISchoolContactsRepository';

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

type UpdateSchoolResquest = {
  id: string;
  name?: string;
  inep_code?: string;
  address?: AddressData;
  contacts?: ContactData[];
  director_id?: string;
  vice_director_id?: string;
};

@injectable()
class UpdateSchoolService {
  constructor(
    @inject('SchoolsRepository') private schoolsRepository: ISchoolsRepository,
    @inject('BranchRepository') private branchRepository: IBranchRepository,
    @inject('SchoolContactsRepository')
    private schoolContactsRepository: ISchoolContactsRepository,
    @inject('EmployeesRepository')
    private employeesRepository: IEmployeesRepository,
    private removeContacts: RemoveContactService,
    private createContact: CreateContactService,
    private updateAddress: UpdateAddressService,
    private deleteUserProfile: DeleteUserProfileService,
    private createUserProfile: CreateUserProfileService,
  ) {}

  public async execute({
    id,
    inep_code,
    name,
    director_id,
    vice_director_id,
    address: addressData,
    contacts: contactsData,
  }: UpdateSchoolResquest): Promise<School> {
    const school = await this.schoolsRepository.findOne({
      id,
    });
    if (!school) {
      throw new AppError('School not found');
    }
    if (inep_code) {
      const existingInepCode = await this.schoolsRepository.findOne({
        inep_code,
      });
      if (existingInepCode && existingInepCode.inep_code !== school.inep_code) {
        throw new AppError('There is already a school with this Inep code');
      }
    }

    const branch = await this.branchRepository.findOne({
      id: school.branch_id,
    });
    if (!branch) {
      throw new AppError('Branch not found.');
    }

    if (contactsData) {
      const schoolContacts = await this.schoolContactsRepository.findAll({
        school_id: school.id,
      });
      const contactsToRemove = schoolContacts.map(({ contact_id }) => ({
        contact_id,
      }));
      await this.removeContacts.execute(contactsToRemove);

      const createContactData = contactsData.map(({ description, type }) => ({
        description,
        type,
      }));

      await this.createContact.execute(createContactData);
    }
    if (addressData) {
      await this.updateAddress.execute({
        ...addressData,
        address_id: school.address_id,
      });
    }

    if (director_id && director_id !== school.director_id) {
      const director = await this.employeesRepository.findOne({
        id: director_id,
      });
      if (!director) {
        throw new AppError('New Diretor not fount');
      }

      await this.deleteUserProfile.execute({
        access_level_name: 'director',
        branch_id: school.branch_id,
        user_id: school.director.user_id,
      });

      await this.createUserProfile.execute({
        access_level_name: 'director',
        branch_id: school.branch_id,
        user_id: director.user_id,
      });
    }
    if (vice_director_id && vice_director_id !== school.vice_director_id) {
      const viceDirector = await this.employeesRepository.findOne({
        id: vice_director_id,
      });
      if (!viceDirector) {
        throw new AppError('New Vice-diretor not fount');
      }

      await this.deleteUserProfile.execute({
        access_level_name: 'vice-director',
        branch_id: school.branch_id,
        user_id: school.vice_director.user_id,
      });

      await this.createUserProfile.execute({
        access_level_name: 'vice-director',
        branch_id: school.branch_id,
        user_id: viceDirector.user_id,
      });
    }

    const newSchool = Object.assign(school, {
      inep_code,
      name,
      director_id,
      director: undefined,
      vice_director_id,
      vice_director: undefined,
    });

    const updatedSchool = await this.schoolsRepository.update(newSchool);

    const newBranch = Object.assign(branch, {
      description: updatedSchool.name,
    });
    await this.branchRepository.update(newBranch);

    return updatedSchool;
  }
}

export default UpdateSchoolService;
