import { Repository } from 'typeorm';

import { dataSource } from '@config/data_source';

import IPersonDocumentsRepository from '@modules/persons/repositories/IPersonDocumentsRepository';
import CreatePersonDocumentDTO from '@modules/persons/dtos/CreatePersonDocumentDTO';
import FindDocumentByNumberAndType from '@modules/persons/dtos/FindDocumentByNumberAndTypeDTO';
import PersonDocument from '../entities/PersonDocument';

class PersonDocumentsRepository implements IPersonDocumentsRepository {
  private ormRepository: Repository<PersonDocument>;

  constructor() {
    this.ormRepository = dataSource.getRepository(PersonDocument);
  }

  public async create({
    person,
    document_number,
    document_type,
  }: CreatePersonDocumentDTO): Promise<PersonDocument> {
    const personDocument = this.ormRepository.create({
      person,
      document_number,
      document_type,
    });

    await this.ormRepository.save(personDocument);

    return personDocument;
  }

  public async findDocumentByNumberAndType(
    items: FindDocumentByNumberAndType,
  ): Promise<PersonDocument[]> {
    const documents = await this.ormRepository.find({
      where: items.map(({ document_type, document_number }) => ({
        document_type,
        document_number,
      })),
    });

    return documents;
  }
}

export default PersonDocumentsRepository;
