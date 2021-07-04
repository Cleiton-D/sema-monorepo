import { atom } from 'jotai';
import { atomWithReset, RESET } from 'jotai/utils';

import { AddressFormData } from 'models/Address';
import { ContactFormData } from 'models/Contact';
import { Employee } from 'models/Employee';
import { BasicSchoolFormType } from 'models/School';

export const basicSchoolData = atomWithReset<BasicSchoolFormType>(
  {} as BasicSchoolFormType
);

export const schoolAddressData = atomWithReset<AddressFormData>(
  {} as AddressFormData
);

export const schoolContactsData = atomWithReset<ContactFormData[]>([]);

export const employeesSchoolData = atomWithReset<Record<string, Employee[]>>(
  {}
);

type SchoolFormData = BasicSchoolFormType & {
  address: AddressFormData;
  contacts: ContactFormData[];
  employees: Record<string, Employee[]>;
};

export const createSchoolData = atom<
  SchoolFormData,
  SchoolFormData | typeof RESET
>(
  (get) => {
    const basicData = get(basicSchoolData);
    const address = get(schoolAddressData);
    const contacts = get(schoolContactsData);
    const employees = get(employeesSchoolData);

    return {
      ...basicData,
      address,
      contacts,
      employees
    };
  },
  (_get, set, newValue) => {
    if (newValue === RESET) {
      set(basicSchoolData, RESET);
      set(schoolAddressData, RESET);
      set(schoolContactsData, RESET);
      set(employeesSchoolData, RESET);
      return;
    }

    const { address, contacts, employees, ...basic } = newValue;
    set(basicSchoolData, basic);
    set(schoolAddressData, address || {});
    set(schoolContactsData, contacts || {});
    set(employeesSchoolData, employees || {});
  }
);
