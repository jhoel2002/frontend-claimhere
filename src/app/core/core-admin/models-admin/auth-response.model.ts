import { DataUser } from "./data-user.model";

export interface AuthResponse {
  token: string;
  user: DataUser;
}
