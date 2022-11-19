import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { instanceToInstance } from 'class-transformer';

import privateRoute from '@shared/decorators/privateRoute';

import CreateSchoolService from '@modules/schools/services/CreateSchoolService';
import ListSchoolsService from '@modules/schools/services/ListSchoolsService';
import ShowSchoolService from '@modules/schools/services/ShowSchoolService';
import CountSchoolsService from '@modules/schools/services/CountSchoolsService';
import UpdateSchoolService from '@modules/schools/services/UpdateSchoolService';

class SchoolsController {
  public async index(request: Request, response: Response): Promise<Response> {
    const listSchools = container.resolve(ListSchoolsService);
    const schools = await listSchools.execute();

    return response.json(schools);
  }

  @privateRoute({ module: 'SCHOOL' })
  public async show(request: Request, response: Response): Promise<Response> {
    const { school_id } = request.params;

    const showSchool = container.resolve(ShowSchoolService);
    if (school_id === 'me') {
      const { branch_id } = request.profile;

      const school = await showSchool.execute({ branch_id });

      return response.json(instanceToInstance(school));
    }

    const school = await showSchool.execute({ school_id });
    return response.json(instanceToInstance(school));
  }

  public async count(request: Request, response: Response): Promise<Response> {
    const countSchools = container.resolve(CountSchoolsService);
    const countResult = await countSchools.execute();

    return response.json(countResult);
  }

  public async create(request: Request, response: Response): Promise<Response> {
    const {
      name,
      inep_code,
      director_id,
      vice_director_id,
      creation_decree,
      recognition_opinion,
      authorization_ordinance,
      address,
      contacts,
      employees,
    } = request.body;

    const createSchool = container.resolve(CreateSchoolService);
    const school = await createSchool.execute({
      name,
      inep_code,
      director_id,
      vice_director_id,
      creation_decree,
      recognition_opinion,
      authorization_ordinance,
      address,
      contacts,
      employees,
    });

    return response.json(instanceToInstance(school));
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const { school_id } = request.params;
    const {
      inep_code,
      name,
      director_id,
      vice_director_id,
      creation_decree,
      recognition_opinion,
      authorization_ordinance,
      address,
      contacts,
    } = request.body;

    const updateSchool = container.resolve(UpdateSchoolService);
    const school = await updateSchool.execute({
      id: school_id,
      inep_code,
      name,
      director_id,
      vice_director_id,
      creation_decree,
      recognition_opinion,
      authorization_ordinance,
      address,
      contacts,
    });

    return response.json(instanceToInstance(school));
  }
}
export default SchoolsController;
