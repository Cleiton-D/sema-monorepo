import { inject, injectable } from 'tsyringe';
import EnrollClassroom from '../infra/typeorm/entities/EnrollClassroom';
import IEnrollClassroomsRepository from '../repositories/IEnrollClassroomsRepository';

type ListEnrollClassroomsRequest = {
  classroom_id?: string;
  enroll_id?: string | string[];
  status?: string;
};

@injectable()
class ListEnrollClassroomsService {
  constructor(
    @inject('EnrollClassroomsRepository')
    private enrollClassroomsRepository: IEnrollClassroomsRepository,
  ) {}

  public async execute({
    classroom_id,
    enroll_id,
    status,
  }: ListEnrollClassroomsRequest): Promise<EnrollClassroom[]> {
    const enrollClassrooms = await this.enrollClassroomsRepository.findAll({
      classroom_id,
      enroll_id,
      status,
    });

    return enrollClassrooms;
  }
}

export default ListEnrollClassroomsService;
