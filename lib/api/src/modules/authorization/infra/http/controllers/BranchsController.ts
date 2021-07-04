import { Request, Response } from 'express';
import { container } from 'tsyringe';

import privateRoute from '@shared/decorators/privateRoute';

import ShowBranchService from '@modules/authorization/services/ShowBranchService';
import ListBranchsService from '@modules/authorization/services/ListBranchsService';

import { BranchType } from '../../typeorm/entities/Branch';

class BranchsController {
  @privateRoute({
    module: 'BRANCH',
    rule: 'READ',
  })
  public async show(request: Request, response: Response): Promise<Response> {
    const { branch_id } = request.params;
    const { type, branch_id: queryBranchId } = request.query;

    const branchId = branch_id || (queryBranchId as string);

    const showBranch = container.resolve(ShowBranchService);
    const branch = await showBranch.execute({
      branch_id: branchId,
      profileBranchId: request.profile.branch_id,
      type: type as BranchType,
    });

    return response.json(branch);
  }

  public async index(request: Request, response: Response): Promise<Response> {
    const listBranchs = container.resolve(ListBranchsService);
    const branchs = await listBranchs.execute();

    return response.json(branchs);
  }
}

export default BranchsController;
