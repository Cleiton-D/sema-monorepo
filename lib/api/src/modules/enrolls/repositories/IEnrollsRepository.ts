import CreateEnrollDTO from '../dtos/CreateEnrollDTO';
import EnrollCountResultDTO from '../dtos/EntollCountResultDTO';
import FindEnrollDTO from '../dtos/FindEnrollDTO';
import Enroll from '../infra/typeorm/entities/Enroll';

export default interface IEnrollsRepository {
  findOne: (filters: FindEnrollDTO) => Promise<Enroll | undefined>;
  findAllByIds: (enroll_ids: string[]) => Promise<Enroll[]>;
  findAll: (filters: FindEnrollDTO) => Promise<Enroll[]>;
  count: (filters: FindEnrollDTO) => Promise<EnrollCountResultDTO>;
  create: (data: CreateEnrollDTO) => Promise<Enroll>;
  update: (enroll: Enroll) => Promise<Enroll>;
}
