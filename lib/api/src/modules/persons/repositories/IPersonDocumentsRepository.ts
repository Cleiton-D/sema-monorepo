import CreatePersonDocumentDTO from '../dtos/CreatePersonDocumentDTO';
import FindDocumentByNumberAndType from '../dtos/FindDocumentByNumberAndTypeDTO';
import PersonDocument from '../infra/typeorm/entities/PersonDocument';

export default interface IPersonDocumentsRepository {
  findDocumentByNumberAndType: (
    items: FindDocumentByNumberAndType,
  ) => Promise<PersonDocument[]>;
  create: (data: CreatePersonDocumentDTO) => Promise<PersonDocument>;
}
