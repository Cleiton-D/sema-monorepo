import { inject, injectable } from 'tsyringe';
import { isAfter } from 'date-fns';

import IQueueJob from '@shared/container/providers/QueueProvider/models/IQueueJob';
import queueJobHO from '@shared/decorators/queueJobHO';

import ISchoolTermPeriodsRepository from '@modules/education_core/repositories/ISchoolTermPeriodsRepository';
import ShowSchoolYearService from '@modules/education_core/services/ShowSchoolYearService';

@injectable()
class ControlSchoolTermPeriodsJob implements IQueueJob {
  constructor(
    @inject('SchoolTermPeriodsRepository')
    private schoolTermPeriodsRepository: ISchoolTermPeriodsRepository,
    private showSchoolYear: ShowSchoolYearService,
  ) {}

  public async execute(): Promise<void> {
    const currentSchoolYear = await this.showSchoolYear.execute({
      school_year_id: 'current',
    });

    const schoolTerms = await this.schoolTermPeriodsRepository.findAll({
      school_year_id: currentSchoolYear.id,
      status: ['PENDING', 'ACTIVE'],
    });

    const currentDate = new Date();
    const updatedSchoolTerms = schoolTerms.map(schoolTerm => {
      if (schoolTerm.manually_changed) {
        return schoolTerm;
      }

      if (
        schoolTerm.status === 'PENDING' &&
        isAfter(currentDate, schoolTerm.date_start)
      ) {
        return Object.assign(schoolTerm, {
          status: 'ACTIVE',
        });
      }

      if (
        schoolTerm.status === 'ACTIVE' &&
        isAfter(currentDate, schoolTerm.date_end)
      ) {
        return Object.assign(schoolTerm, {
          status: 'FINISH',
        });
      }

      return schoolTerm;
    });

    await this.schoolTermPeriodsRepository.updateMany(updatedSchoolTerms);
    console.log('school term periods updated');
  }
}

export default queueJobHO(ControlSchoolTermPeriodsJob, {
  path: __filename,
  name: 'controlSchoolTermPeriods',
  cron: '06 04 * * *',
});
