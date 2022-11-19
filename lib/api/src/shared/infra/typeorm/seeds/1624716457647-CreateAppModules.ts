import { MigrationInterface, QueryRunner, Repository } from 'typeorm';

import { dataSource } from '@config/data_source';

import AppModule from '@modules/authorization/infra/typeorm/entities/AppModule';

export default class CreateAppModules1624716457647
  implements MigrationInterface
{
  private repository: Repository<AppModule>;

  private modules: string[] = [];

  constructor() {
    this.repository = dataSource.getRepository(AppModule);

    this.modules = [
      'BRANCH',
      'SCHOOL-SUBJECT',
      'SCHOOL',
      'SCHOOL-EMPLOYEE',
      'CLASSROOM',
      'ENROLL',
      'MUNICIPAL_SECRETARY',
      'MUNICIPAL_SECRETARY_EMPLOYEE',
      'ACCESS_LEVEL',
      'USER',
      'USER_PROFILE',
      'EMPLOYEE',
      'SCHOOL_YEAR',
      'GRADE',
      'GRADE_SCHOOL_SUBJECT',
      'DASHBOARD',
      'SCHOOL_TEACHER',
      'TEACHER_SCHOOL_SUBJECT',
      'CLASSROOM_TEACHER',
      'CLASS',
      'ATTENDANCE',
      'SCHOOL_REPORT',
    ];
  }

  public async up(): Promise<void> {
    const appModules = this.modules.map(module =>
      this.repository.create({ description: module }),
    );

    await this.repository.save(appModules);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
