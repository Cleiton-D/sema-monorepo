import { getRepository, Repository } from 'typeorm';

import ITimetablesRepository from '@modules/schools/repositories/ITimetablesRepository';
import Timetable from '../entities/Timetable';

class TimetablesRepository implements ITimetablesRepository {
  private ormRepository: Repository<Timetable>;

  constructor() {
    this.ormRepository = getRepository(Timetable);
  }

  public async findById(timetable_id: string): Promise<Timetable | undefined> {
    const timetable = await this.ormRepository.findOne(timetable_id);
    return timetable;
  }

  public async findByIds(timetable_ids: string[]): Promise<Timetable[]> {
    const timetables = await this.ormRepository.find({
      where: { id: timetable_ids },
    });
    return timetables;
  }

  public async updateMany(timetables: Timetable[]): Promise<Timetable[]> {
    await this.ormRepository.save(timetables);
    return timetables;
  }
}

export default TimetablesRepository;
