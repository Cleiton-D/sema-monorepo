import { atom } from 'jotai';
import { atomWithReset, RESET } from 'jotai/utils';

import { ContactFormData } from 'models/Contact';
import {
  EnrollFormData,
  CompleteEnrollFormData,
  EnrollDocumentsFormData
} from 'models/Enroll';
import { Student, StudentForm } from 'models/Student';

export const selectedStudent = atomWithReset<Student | undefined>(undefined);

export const basicEnrollData = atomWithReset<StudentForm>({} as StudentForm);
export const enrollContactsData = atomWithReset<ContactFormData[]>([]);
export const enrollDocumentsData = atomWithReset<EnrollDocumentsFormData>({});
export const enrollData = atomWithReset<EnrollFormData>({} as EnrollFormData);

export const createEnrollData = atom<
  CompleteEnrollFormData,
  CompleteEnrollFormData | typeof RESET
>(
  (get) => {
    const enrollBasicData = get(basicEnrollData);
    const contacts = get(enrollContactsData);
    const documents = get(enrollDocumentsData);
    const enroll = get(enrollData);

    return {
      ...enroll,
      student: { ...enrollBasicData, ...documents, contacts }
    };
  },
  (_get, set, newValue) => {
    if (newValue === RESET) {
      set(basicEnrollData, RESET);
      set(enrollContactsData, RESET);
      set(enrollDocumentsData, RESET);
      set(enrollData, RESET);
      return;
    }

    const { student, ...enroll } = newValue;
    const { contacts, cpf, rg, birth_certificate, nis, unique_code } = student;

    set(basicEnrollData, student);
    set(enrollContactsData, contacts);
    set(enrollDocumentsData, { cpf, rg, birth_certificate, nis, unique_code });
    set(enrollData, enroll);
  }
);
