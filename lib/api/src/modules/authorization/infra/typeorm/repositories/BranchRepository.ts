import { FindConditions, getRepository, Repository } from 'typeorm';

import IBranchRepository from '@modules/authorization/repositories/IBranchRepository';
import CreateBranchDTO from '@modules/authorization/dtos/CreateBranchDTO';
import FindBranchDTO from '@modules/authorization/dtos/FindBranchDTO';

import Branch from '../entities/Branch';

class BranchRepository implements IBranchRepository {
  private ormRepository: Repository<Branch>;

  constructor() {
    this.ormRepository = getRepository(Branch);
  }

  public async findOne({
    id,
    type,
  }: FindBranchDTO): Promise<Branch | undefined> {
    const where: FindConditions<Branch> = {};

    if (id) where.id = id;
    if (type) where.type = type;

    const branch = await this.ormRepository.findOne({
      where,
    });
    return branch;
  }

  public async findAll({ id, type }: FindBranchDTO): Promise<Branch[]> {
    const where: FindConditions<Branch> = {};

    if (id) where.id = id;
    if (type) where.type = type;

    const branchs = await this.ormRepository.find({
      where,
    });
    return branchs;
  }

  public async create({ description, type }: CreateBranchDTO): Promise<Branch> {
    const branch = this.ormRepository.create({ description, type });
    await this.ormRepository.save(branch);

    return branch;
  }

  public async update(branch: Branch): Promise<Branch> {
    await this.ormRepository.save(branch);
    return branch;
  }
}

export default BranchRepository;
