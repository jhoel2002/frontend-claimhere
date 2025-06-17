export interface Lawyer {
  id?: number;
  code?: string;
  name: string;
  last_name: string;
  fullName?: string;
  email: string;
  password?: string;
  phone: string;
  address: string;
  creation: string;
  enabled?: boolean;
  case_type: string;
  description?: string;
  buffet?: string;
  foto?: File;
}
