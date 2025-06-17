export interface User {
  id: number;
  code: string;
  name: string;
  last_name: string;
  email: string;
  password?: string;
  phone: string;
  role: string;
  address: string;
  creation: string;
  enabled: boolean;
}