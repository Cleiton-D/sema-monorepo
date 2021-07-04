import { DocumentType } from '../infra/typeorm/entities/PersonDocument';

type FindDocumentByNumberAndType = Array<{
  document_type: DocumentType;
  document_number: string;
}>;

export default FindDocumentByNumberAndType;
