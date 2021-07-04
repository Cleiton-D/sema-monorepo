import { Request, Response } from 'express';
import { container } from 'tsyringe';

import LinkSchoolSubjectsWithTimetablesService from '@modules/schools/services/LinkSchoolSubjectsWithTimetablesService';

class TimetablesController {
  public async update(request: Request, response: Response): Promise<Response> {
    const { classroom_id } = request.params;
    const { timetables } = request.body;

    const linkSchoolSubjectsWithTimetables = container.resolve(
      LinkSchoolSubjectsWithTimetablesService,
    );
    const updatedTimetables = await linkSchoolSubjectsWithTimetables.execute({
      classroom_id,
      timetables,
    });

    return response.json(updatedTimetables);
  }
}

export default TimetablesController;
