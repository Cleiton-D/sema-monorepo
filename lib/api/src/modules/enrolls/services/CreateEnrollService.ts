import { inject, injectable } from 'tsyringe';

import { ContactType } from '@modules/contacts/infra/typeorm/entities/Contact';
import { Gender } from '@modules/persons/infra/typeorm/entities/Person';
import { DocumentType } from '@modules/persons/infra/typeorm/entities/PersonDocument';
import IGradeSchoolSubjectsRepository from '@modules/education_core/repositories/IGradeSchoolSubjectsRepository';
import CreatePersonService from '@modules/persons/services/CreatePersonService';
import UpdatePersonService from '@modules/persons/services/UpdatePersonService';
import ISchoolsRepository from '@modules/schools/repositories/ISchoolsRepository';

import AppError from '@shared/errors/AppError';

import Enroll from '../infra/typeorm/entities/Enroll';
import IEnrollsRepository from '../repositories/IEnrollsRepository';
import CreateSchoolReportsToEnrollService from './CreateSchoolReportsToEnrollService';

type AddressData = {
  street: string;
  house_number: string;
  city: string;
  district: string;
  region: string;
};

type DocumentData = {
  document_number: string;
  document_type: DocumentType;
};

type ContactData = {
  description: string;
  type: ContactType;
};

type PersonData = {
  person_id?: string;
  name: string;
  mother_name: string;
  dad_name?: string;
  gender: Gender;
  birth_date: Date;
  address: AddressData;
  documents: DocumentData[];
  contacts: ContactData[];
};

type CreateEnrollRequest = {
  person: PersonData;
  school_id?: string;
  branch_id?: string;
  grade_id: string;
  classroom_id: string;
  school_year_id: string;
};

@injectable()
class CreateEnrollService {
  constructor(
    @inject('EnrollsRepository') private enrollsRepository: IEnrollsRepository,
    @inject('GradeSchoolSubjectsRepository')
    private gradeSchoolSubjectsRepository: IGradeSchoolSubjectsRepository,
    @inject('SchoolsRepository') private schoolsRepository: ISchoolsRepository,
    private createSchoolReportsToEnrollService: CreateSchoolReportsToEnrollService,
    private createPerson: CreatePersonService,
    private updatePerson: UpdatePersonService,
  ) {}

  public async execute({
    person: personData,
    school_id,
    branch_id,
    grade_id,
    classroom_id,
    school_year_id,
  }: CreateEnrollRequest): Promise<Enroll> {
    const { person_id, ...newPersonData } = personData;

    const person = person_id
      ? await this.updatePerson.execute({ ...newPersonData, person_id })
      : await this.createPerson.execute(newPersonData);

    const school = await this.schoolsRepository.findOne({
      id: school_id,
      branch_id,
    });
    if (!school) {
      throw new AppError('School not found');
    }

    const enroll = await this.enrollsRepository.create({
      school_id: school.id,
      grade_id,
      school_year_id,
      classroom_id,
      person,
      status: 'ACTIVE',
    });

    const gradeSchoolSubjects = await this.gradeSchoolSubjectsRepository.find({
      grade_id,
      school_year_id,
    });

    const schoolSubjects = gradeSchoolSubjects.map(
      ({ school_subject_id }) => school_subject_id,
    );
    await this.createSchoolReportsToEnrollService.execute({
      enroll_id: enroll.id,
      school_subject_id: schoolSubjects,
    });

    return enroll;
  }
}

export default CreateEnrollService;
