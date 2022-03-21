import { inject, injectable } from 'tsyringe';

import { ContactType } from '@modules/contacts/infra/typeorm/entities/Contact';
import { Gender } from '@modules/persons/infra/typeorm/entities/Person';
import IGradeSchoolSubjectsRepository from '@modules/education_core/repositories/IGradeSchoolSubjectsRepository';
import ISchoolsRepository from '@modules/schools/repositories/ISchoolsRepository';
import CreateStudentService from '@modules/students/services/CreateStudentService';

import AppError from '@shared/errors/AppError';

import UpdateStudentService from '@modules/students/services/UpdateStudentService';
import Enroll, { EnrollOrigin } from '../infra/typeorm/entities/Enroll';
import IEnrollsRepository from '../repositories/IEnrollsRepository';
import CreateSchoolReportsToEnrollService from './CreateSchoolReportsToEnrollService';

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

type StudentData = {
  id?: string;
  name: string;
  mother_name: string;
  dad_name?: string;
  gender: Gender;
  birth_date: string;
  address: AddressData;
  contacts: ContactData[];
  cpf?: string;
  rg?: string;
  nis?: string;
  birth_certificate?: string;
  breed: string;
  naturalness: string;
  naturalness_uf: string;
  identity_document: string;
  nationality: string;
  unique_code: string;
};

type CreateEnrollRequest = {
  student: StudentData;
  school_reports?: Record<string, Record<string, number>>;
  school_id?: string;
  branch_id?: string;
  grade_id: string;
  classroom_id?: string;
  school_year_id: string;
  origin: EnrollOrigin;
  class_period_id: string;
  enroll_date: string;
};

@injectable()
class CreateEnrollService {
  constructor(
    @inject('EnrollsRepository') private enrollsRepository: IEnrollsRepository,
    @inject('GradeSchoolSubjectsRepository')
    private gradeSchoolSubjectsRepository: IGradeSchoolSubjectsRepository,
    @inject('SchoolsRepository') private schoolsRepository: ISchoolsRepository,
    private createSchoolReportsToEnrollService: CreateSchoolReportsToEnrollService,
    private createStudent: CreateStudentService,
    private updateStudent: UpdateStudentService,
  ) {}

  public async execute({
    student: studentData,
    school_id,
    branch_id,
    grade_id,
    classroom_id,
    school_year_id,
    origin,
    school_reports,
    class_period_id,
    enroll_date,
  }: CreateEnrollRequest): Promise<Enroll> {
    const { id: student_id, ...newStudentData } = studentData;

    const student = student_id
      ? await this.updateStudent.execute({ ...newStudentData, id: student_id })
      : await this.createStudent.execute(newStudentData);

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
      student,
      status: 'ACTIVE',
      origin,
      class_period_id,
      enroll_date,
    });

    const gradeSchoolSubjects = await this.gradeSchoolSubjectsRepository.find({
      grade_id,
    });

    const schoolSubjects = gradeSchoolSubjects.map(
      ({ school_subject_id }) => school_subject_id,
    );
    await this.createSchoolReportsToEnrollService.execute({
      enroll_id: enroll.id,
      school_subject_id: schoolSubjects,
      reports: school_reports,
    });

    return enroll;
  }
}

export default CreateEnrollService;
