import { atomWithReset } from 'jotai/utils';

import { ContactFormData } from 'models/Contact';
import { EmployeeBasicFormData } from 'models/Employee';
import { PersonDocumentsForm } from 'models/PersonDocuments';

export const employeeData = atomWithReset<EmployeeBasicFormData>(
  {} as EmployeeBasicFormData
);

export const employeeContactsData = atomWithReset<ContactFormData[]>([]);

export const employeeDocuments = atomWithReset<PersonDocumentsForm>({});
