export interface Customer {
  id?: number;
  code?: string;
  fullName?: string;
  name: string;
  last_name: string;
  document_type: string;
  document_number: string;
  email: string;
  phone: string;
  password?: string;
  address: string;
  enabled?: boolean;
  creation?: string;
  buffet?: string;
}