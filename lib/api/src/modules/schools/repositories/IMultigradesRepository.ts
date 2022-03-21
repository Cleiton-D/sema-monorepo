import FindMultigradesDTO from '../dtos/FindMultigradesDTO';
import Multigrade from '../infra/typeorm/entities/Multigrade';

export default interface IMultigradesRepository {
  findOne(filters: FindMultigradesDTO): Promise<Multigrade | undefined>;
  findAll(filters: FindMultigradesDTO): Promise<Multigrade[]>;
}
