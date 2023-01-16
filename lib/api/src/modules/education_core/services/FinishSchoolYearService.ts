import { inject, injectable } from 'tsyringe';

import FinishClassService from '@modules/classes/services/FinishClassService';
import ListClassesService from '@modules/classes/services/ListClassesService';
import ISchoolReportsRepository from '@modules/enrolls/repositories/ISchoolReportsRepository';
import ListEnrollsService from '@modules/enrolls/services/ListEnrollsService';
import ListEnrollSchoolReportsService from '@modules/enrolls/services/ListSchoolReportsService';
import UpdateEnrollService from '@modules/enrolls/services/UpdateEnrollService';

import AppError from '@shared/errors/AppError';

import SchoolYear from '../infra/typeorm/entities/SchoolYear';
import ISchoolYearsRepository from '../repositories/ISchoolYearsRepository';
import ListSchoolTermPeriodsService from './ListSchoolTermPeriodsService';
import UpdateSchoolTermPeriodService from './UpdateSchoolTermPeriodService';

type FinishSchoolYearRequest = {
  school_year_id: string;
};

@injectable()
class FinishSchoolYearService {
  constructor(
    @inject('SchoolYearsRepository')
    private schoolYearsRepository: ISchoolYearsRepository,
    @inject('SchoolReportsRepository')
    private schoolReportsRepository: ISchoolReportsRepository,
    private listClasses: ListClassesService,
    private finishClass: FinishClassService,
    private listEnrolls: ListEnrollsService,
    private updateEnroll: UpdateEnrollService,
    private listSchoolReports: ListEnrollSchoolReportsService,
    private listSchoolTermPeriods: ListSchoolTermPeriodsService,
    private updateSchoolTermPeriod: UpdateSchoolTermPeriodService,
  ) {}

  private async finishClasses(schoolYear: SchoolYear): Promise<void> {
    const { items: pendingClasses = [] } = await this.listClasses.execute({
      status: 'PROGRESS',
      school_year_id: schoolYear.id,
    });

    const promises = pendingClasses.map(({ id: class_id }) => {
      return this.finishClass.execute({ class_id });
    });

    await Promise.all(promises);
  }

  private async finishEnrolls(schoolYear: SchoolYear): Promise<void> {
    const { items: enrolls = [] } = await this.listEnrolls.execute({
      status: 'ACTIVE',
      school_year_id: schoolYear.id,
    });

    const promises = enrolls.map(enroll => {
      return this.updateEnroll.execute({
        enroll_id: enroll.id,
        status: 'INACTIVE',
      });
    });

    await Promise.all(promises);
  }

  private async finishSchoolReports(schoolYear: SchoolYear): Promise<void> {
    const schoolReports = await this.listSchoolReports.execute({
      school_year_id: schoolYear.id,
    });

    const pendingSchoolReports = schoolReports.filter(({ status }) => {
      return !['APPROVED', 'DISAPPROVED', 'DISAPPROVED_FOR_ABSENCES'].includes(
        status,
      );
    });

    const newSchoolReports = pendingSchoolReports.map(schoolReport => {
      return Object.assign(schoolReport, { status: 'CLOSED' });
    });

    await this.schoolReportsRepository.updateMany(newSchoolReports);
  }

  private async finishSchoolTermPeriods(schoolYear: SchoolYear): Promise<void> {
    const schoolTermPeriods = await this.listSchoolTermPeriods.execute({
      school_year_id: schoolYear.id,
      status: ['ACTIVE', 'PENDING'],
    });

    const promises = schoolTermPeriods.map(schoolTermPeriod => {
      return this.updateSchoolTermPeriod.execute({
        id: schoolTermPeriod.id,
        status: 'FINISH',
      });
    });

    await Promise.all(promises);
  }

  public async execute({
    school_year_id,
  }: FinishSchoolYearRequest): Promise<SchoolYear> {
    const schoolYear = await this.schoolYearsRepository.findById(
      school_year_id,
    );
    if (!schoolYear) {
      throw new AppError('school year not found');
    }

    await this.finishClasses(schoolYear);
    await this.finishEnrolls(schoolYear);
    await this.finishSchoolReports(schoolYear);
    await this.finishSchoolTermPeriods(schoolYear);

    const newSchoolYear = Object.assign(schoolYear, {
      status: 'INACTIVE',
    });
    return this.schoolYearsRepository.update(newSchoolYear);
  }
}

export default FinishSchoolYearService;
