import { Observable } from "rxjs";
import { AuthData } from "../../models/auth-data.model";
import { AuthResponse } from "../../models/auth-response.model";

export interface IAuthService {

    login(credentials: AuthData): Observable<AuthResponse>;

    isTokenValid(): boolean;

    logout(): void;

    get userBuffet(): string;

    get userRole(): string;

    get userToken(): string;

    get userLoginOn(): Observable<boolean>

}
