import { getRepository, MigrationInterface, Repository } from 'typeorm';

import Branch from '@modules/authorization/infra/typeorm/entities/Branch';

export default class CreateMunicipalSecreataryBranch1624412176832
  implements MigrationInterface {
  private repository: Repository<Branch>;

  constructor() {
    this.repository = getRepository(Branch);
  }

  public async up(): Promise<void> {
    const municipalSecretary = this.repository.create({
      description: 'Secretaria Municipal de Educação',
      type: 'MUNICIPAL_SECRETARY',
    });

    await this.repository.save(municipalSecretary);
  }

  public async down(): Promise<void> {
    const itemToDelete = await this.repository.findOne({
      where: {
        description: 'Secretaria Municipal de Educação',
        type: 'MUNICIPAL_SECRETARY',
      },
    });
    if (!itemToDelete) {
      throw new Error('Municipal Secretary not fount');
    }

    await this.repository.remove(itemToDelete);
  }
}
