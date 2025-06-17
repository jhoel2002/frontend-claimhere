import { Observable } from "rxjs";

export interface IDocumentService {

    downloadFileByCode(code: string): Observable<Blob>;
}
