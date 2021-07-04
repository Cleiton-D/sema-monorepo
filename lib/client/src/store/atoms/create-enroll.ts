import { atom } from 'jotai';
import { atomWithReset, RESET } from 'jotai/utils';

import { ContactFormData } from 'models/Contact';
import { EnrollFormData, CompleteEnrollFormData } from 'models/Enroll';
import { PersonBasicFormData } from 'models/Person';

export const personEnrollData = atomWithReset<PersonBasicFormData>(
  {} as PersonBasicFormData
);

export const personEnrollContactsData = atomWithReset<ContactFormData[]>([]);

export const enrollData = atomWithReset<EnrollFormData>({} as EnrollFormData);

export const createEnrollData = atom<
  CompleteEnrollFormData,
  CompleteEnrollFormData | typeof RESET
>(
  (get) => {
    const personBasicData = get(personEnrollData);
    const contacts = get(personEnrollContactsData);
    const enroll = get(enrollData);

    return { ...enroll, person: { ...personBasicData, contacts } };
  },
  (_get, set, newValue) => {
    if (newValue === RESET) {
      set(personEnrollData, newValue);
      set(personEnrollContactsData, newValue);
      set(enrollData, newValue);
      return;
    }

    const { person, ...enroll } = newValue;
    const { contacts, ...newPerson } = person;

    set(personEnrollData, newPerson);
    set(personEnrollContactsData, contacts);
    set(enrollData, enroll);
  }
);
