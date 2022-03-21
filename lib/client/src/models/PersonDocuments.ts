export type PersonDocumentsForm = Record<string, string>;

export type PersonDocument = {
  id: string;
  document_number: string;
  document_type: string;
  person_id: string;
  created_at: string;
  updated_at: string;
};
