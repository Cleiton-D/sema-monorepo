import { inject, injectable } from 'tsyringe';
import { endOfDay, endOfToday } from 'date-fns';

import IQueueJob from '@shared/container/providers/QueueProvider/models/IQueueJob';
import queueJobHO from '@shared/decorators/queueJobHO';

import ISchoolYearsRepository from '@modules/education_core/repositories/ISchoolYearsRepository';
import SchoolYear from '@modules/education_core/infra/typeorm/entities/SchoolYear';
import ListClassesService from '@modules/classes/services/ListClassesService';
import FinishClassService from '@modules/classes/services/FinishClassService';
import ListEnrollsService from '@modules/enrolls/services/ListEnrollsService';
import UpdateEnrollService from '@modules/enrolls/services/UpdateEnrollService';
import ListEnrollSchoolReportsService from '@modules/enrolls/services/ListSchoolReportsService';
import ISchoolReportsRepository from '@modules/enrolls/repositories/ISchoolReportsRepository';
import ListSchoolTermPeriodsService from '@modules/education_core/services/ListSchoolTermPeriodsService';
import UpdateSchoolTermPeriodService from '@modules/education_core/services/UpdateSchoolTermPeriodService';

@injectable()
class FinishSchoolYearJob implements IQueueJob {
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

  private async finishSchoolYear(schoolYear: SchoolYear) {
    await this.finishClasses(schoolYear);
    await this.finishEnrolls(schoolYear);
    await this.finishSchoolReports(schoolYear);
    await this.finishSchoolTermPeriods(schoolYear);

    const newSchoolYear = Object.assign(schoolYear, {
      status: 'INACTIVE',
    });
    await this.schoolYearsRepository.update(newSchoolYear);
  }

  public async execute(): Promise<void> {
    const schoolYears = await this.schoolYearsRepository.findAll({
      status: 'ACTIVE',
    });

    const currentDate = endOfToday();
    const filteredSchoolYears = schoolYears.filter(schoolYear => {
      const endOfSchoolYear = endOfDay(schoolYear.date_end);

      return endOfSchoolYear.getTime() <= currentDate.getTime();
    });

    const promises = filteredSchoolYears.map(schoolYear => {
      return this.finishSchoolYear(schoolYear);
    });

    await Promise.all(promises);
  }
}

export default queueJobHO(FinishSchoolYearJob, {
  path: __filename,
  name: 'finishSchoolYear',
  cron: '00 03 * * *',
});
