import { inject, injectable } from 'tsyringe';
import { startOfDay, startOfToday } from 'date-fns';

import queueJobHO from '@shared/decorators/queueJobHO';
import IQueueJob from '@shared/container/providers/QueueProvider/models/IQueueJob';

import ISchoolYearsRepository from '@modules/education_core/repositories/ISchoolYearsRepository';

@injectable()
class StartSchoolYearJob implements IQueueJob {
  constructor(
    @inject('SchoolYearsRepository')
    private schoolYearsRepository: ISchoolYearsRepository,
  ) {}

  public async execute(): Promise<void> {
    const schoolYears = await this.schoolYearsRepository.findAll({
      status: 'PENDING',
    });

    const currentDate = startOfToday();
    const filteredSchoolYears = schoolYears.filter(schoolYear => {
      const startOfSchoolYear = startOfDay(schoolYear.date_start);

      return startOfSchoolYear.getTime() >= currentDate.getTime();
    });

    const promises = filteredSchoolYears.map(schoolYear => {
      const newSchoolYear = Object.assign(schoolYear, { status: 'ACTIVE' });
      return this.schoolYearsRepository.update(newSchoolYear);
    });

    await Promise.all(promises);
  }
}

export default queueJobHO(StartSchoolYearJob, {
  path: __filename,
  name: 'startSchoolYear',
  cron: '30 03 * * *',
});
