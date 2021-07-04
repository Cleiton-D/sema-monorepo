import Person from '../infra/typeorm/entities/Person';
import { DocumentType } from '../infra/typeorm/entities/PersonDocument';

type CreatePersonDocumentDTO = {
  person: Person;
  document_number: string;
  document_type: DocumentType;
};

export default CreatePersonDocumentDTO;
