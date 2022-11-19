import {
  FindOptionsWhere,
  ObjectLiteral,
  Repository,
  WhereExpressionBuilder,
} from 'typeorm';
import { parseISO } from 'date-fns';

import { dataSource } from '@config/data_source';

import ICalendarEventsRespository from '@modules/education_core/repositories/ICalendarEventsRepository';
import CreateCalendarEventDTO from '@modules/education_core/dtos/CreateCalendarEventDTO';
import FindCalendarEventDTO from '@modules/education_core/dtos/FindCalendarEventDTO';

import CalendarEvent from '../entities/CalendarEvent';

type AndWhere = {
  condition: string;
  parameters?: ObjectLiteral;
};

class CalendarEventsRespository implements ICalendarEventsRespository {
  private ormRepository: Repository<CalendarEvent>;

  constructor() {
    this.ormRepository = dataSource.getRepository(CalendarEvent);
  }

  private createQueryBuilder({
    id,
    school_year_id,
    date,
    description,
    type,
    competence,
    school_id,
  }: FindCalendarEventDTO) {
    const where: FindOptionsWhere<CalendarEvent> = {};
    const andWhere: AndWhere[] = [];

    if (id) where.id = id;
    if (school_year_id) where.school_year_id = school_year_id;
    if (date) where.date = date instanceof Date ? date : parseISO(date);
    if (description) where.description = description;
    if (type) where.type = type;

    if (competence === 'ALL' && !!school_id) {
      andWhere.push({
        condition: `
          calendar_event.competence = :municipalCompetence
          OR (calendar_event.competence = :schoolCompetence AND calendar_event.school_id = :schoolId)
        `,
        parameters: {
          municipalCompetence: 'MUNICIPAL',
          schoolCompetence: 'SCHOLL',
          schoolId: school_id,
        },
      });
    } else if (competence !== 'ALL') {
      if (competence) where.competence = competence;
      if (school_id) where.school_id = school_id;
    }

    return this.ormRepository
      .createQueryBuilder('calendar_event')
      .select()
      .where((qb: WhereExpressionBuilder) => {
        qb.where(where);
        andWhere.forEach(({ condition, parameters }) =>
          qb.andWhere(condition, parameters),
        );
      });
  }

  public async findOne(
    filters: FindCalendarEventDTO,
  ): Promise<CalendarEvent | undefined> {
    const queryBuilder = this.createQueryBuilder(filters);

    const calendarEvents = await queryBuilder.getOne();
    return calendarEvents || undefined;
  }

  public async findAll(
    filters: FindCalendarEventDTO,
  ): Promise<CalendarEvent[]> {
    const queryBuilder = this.createQueryBuilder(filters);

    const calendarEvents = await queryBuilder.getMany();
    return calendarEvents;
  }

  public async create({
    school_year_id,
    date,
    description,
    type,
    competence,
    school_id,
  }: CreateCalendarEventDTO): Promise<CalendarEvent> {
    const calendarEvent = this.ormRepository.create({
      school_year_id,
      date,
      description,
      type,
      competence,
      school_id,
    });
    await this.ormRepository.save(calendarEvent);
    return calendarEvent;
  }

  public async delete(calendarEvent: CalendarEvent): Promise<void> {
    await this.ormRepository.softRemove(calendarEvent);
  }
}

export default CalendarEventsRespository;
