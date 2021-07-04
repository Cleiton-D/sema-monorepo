import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import DeleteUserProfileService from '@modules/users/services/DeleteUserProfileService';
import ISchoolTeachersRepository from '../repositories/ISchoolTeachersRepository';

type DeleteSchoolTeacherRequest = {
  school_teacher_id: string;
};

@injectable()
class DeleteSchoolTeacherService {
  constructor(
    @inject('SchoolTeachersRepository')
    private schoolTeachersRepository: ISchoolTeachersRepository,
    private deleteUserProfile: DeleteUserProfileService,
  ) {}

  public async execute({
    school_teacher_id,
  }: DeleteSchoolTeacherRequest): Promise<void> {
    const schoolTeacher = await this.schoolTeachersRepository.findOne({
      id: school_teacher_id,
    });

    if (!schoolTeacher) {
      throw new AppError('School Teacher not found');
    }

    await this.schoolTeachersRepository.delete(schoolTeacher);
    await this.deleteUserProfile.execute({
      user_id: schoolTeacher.employee.user_id,
      branch_id: schoolTeacher.school.branch_id,
      access_level_name: 'teacher',
    });
  }
}

export default DeleteSchoolTeacherService;
