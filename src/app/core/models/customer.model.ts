export interface Customer {
  id: number;
  name: string;
  last_name: string;
  email: string;
  password?: string;
  phone: string;
  address: string;
  creation: string;
  type_document: string;
  document: string;
}