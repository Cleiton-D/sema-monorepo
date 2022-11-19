import { In, MigrationInterface, Repository } from 'typeorm';

import { dataSource } from '@config/data_source';

import AccessLevel from '@modules/authorization/infra/typeorm/entities/AccessLevel';

export default class CreateProfiles1624321778241 implements MigrationInterface {
  private repository: Repository<AccessLevel>;

  private items: AccessLevel[];

  constructor() {
    this.repository = dataSource.getRepository(AccessLevel);

    const administrator = this.repository.create({
      description: 'Administrador',
      code: 'administrator',
      editable: false,
    });

    const director = this.repository.create({
      description: 'Diretor',
      code: 'director',
      editable: false,
    });

    const viceDirector = this.repository.create({
      description: 'Vice-diretor',
      code: 'vice-director',
      editable: false,
    });

    const teacher = this.repository.create({
      description: 'Professor',
      code: 'teacher',
      editable: false,
    });

    const schoolSecretary = this.repository.create({
      description: 'Secretário',
      code: 'school-secretary',
      editable: false,
    });

    const supervisor = this.repository.create({
      description: 'Supervisor',
      code: 'supervisor',
      editable: false,
    });

    const advisor = this.repository.create({
      description: 'Orientador',
      code: 'advisor',
      editable: false,
    });

    const municipalSecretary = this.repository.create({
      description: 'Secretário Municipal',
      code: 'municipal-secretary',
      editable: false,
    });

    const pedagogicalCoordination = this.repository.create({
      description: 'Coordenação Pedagógica',
      code: 'pedagogical-coordination',
      editable: false,
    });

    const bookkeeping = this.repository.create({
      description: 'Escrituração',
      code: 'bookkeeping',
      editable: false,
    });

    this.items = [
      director,
      viceDirector,
      teacher,
      schoolSecretary,
      supervisor,
      advisor,
      municipalSecretary,
      pedagogicalCoordination,
      bookkeeping,
      administrator,
    ];
  }

  public async up(): Promise<void> {
    await this.repository.save(this.items);
  }

  public async down(): Promise<void> {
    const codes = this.items.map(({ code }) => code);
    const itemsToDelete = await this.repository.find({
      where: {
        code: In(codes),
      },
    });

    await Promise.all(itemsToDelete.map(item => this.repository.remove(item)));
  }
}
