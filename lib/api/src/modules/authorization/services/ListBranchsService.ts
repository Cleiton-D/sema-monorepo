import { inject, injectable } from 'tsyringe';

import Branch from '../infra/typeorm/entities/Branch';
import IBranchRepository from '../repositories/IBranchRepository';

@injectable()
class ListBranchsService {
  constructor(
    @inject('BranchRepository') private branchRepository: IBranchRepository,
  ) {}

  public async execute(): Promise<Branch[]> {
    const branchs = await this.branchRepository.findAll({});
    return branchs;
  }
}

export default ListBranchsService;
