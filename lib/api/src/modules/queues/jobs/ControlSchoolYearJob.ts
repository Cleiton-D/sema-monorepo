import { inject, injectable } from 'tsyringe';
import { isAfter } from 'date-fns';

import IQueueJob from '@shared/container/providers/QueueProvider/models/IQueueJob';
import queueJobHO from '@shared/decorators/queueJobHO';

import ISchoolYearsRepository from '@modules/education_core/repositories/ISchoolYearsRepository';

@injectable()
class ControlSchoolYearJob implements IQueueJob {
  constructor(
    @inject('SchoolYearsRepository')
    private schoolYearsRepository: ISchoolYearsRepository,
  ) {}

  public async execute(): Promise<void> {
    const schoolYears = await this.schoolYearsRepository.findAll({
      status: ['ACTIVE', 'PENDING'],
    });

    const currentDate = new Date();
    const updatedSchoolYears = schoolYears.map(schoolYear => {
      if (
        schoolYear.status === 'PENDING' &&
        isAfter(currentDate, schoolYear.date_start)
      ) {
        return Object.assign(schoolYear, {
          status: 'ACTIVE',
        });
      }

      if (
        schoolYear.status === 'ACTIVE' &&
        isAfter(currentDate, schoolYear.date_end)
      ) {
        return Object.assign(schoolYear, {
          status: 'INACTIVE',
        });
      }

      return schoolYear;
    });

    await this.schoolYearsRepository.updateMany(updatedSchoolYears);
    console.log('school years updated');
  }
}

export default queueJobHO(ControlSchoolYearJob, {
  path: __filename,
  name: 'controlSchoolYears',
  cron: '05 04 * * *',
});
