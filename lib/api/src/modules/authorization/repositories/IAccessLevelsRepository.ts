import CreateAccessLevelDTO from '../dtos/CreateAccessLevelDTO';
import FindAccessLevelDTO from '../dtos/FindAccessLevelDTO';
import AccessLevel from '../infra/typeorm/entities/AccessLevel';

export default interface IAccessLevelsRepository {
  findAll: (filters: FindAccessLevelDTO) => Promise<AccessLevel[]>;
  findOne: (filters: FindAccessLevelDTO) => Promise<AccessLevel | undefined>;
  create: (data: CreateAccessLevelDTO) => Promise<AccessLevel>;
  delete: (accessLevel: AccessLevel) => Promise<void>;
}
