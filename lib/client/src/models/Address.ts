export type AddressFormData = {
  street: string;
  house_number: string;
  city: string;
  district: string;
  region: string;
};

export type Address = {
  id: string;
  city: string;
  district: string;
  house_number: string;
  region: string;
  street: string;
  created_at: string;
  updated_at: string;
};
