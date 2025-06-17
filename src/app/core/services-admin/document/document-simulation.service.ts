import { Injectable } from '@angular/core';
import { delay, Observable, of, throwError } from 'rxjs';
import { IDocumentService } from './IDocumentService';
import { document } from '../../models/document.model';

@Injectable({
  providedIn: 'root'
})
export class DocumentSimulationService implements IDocumentService {
  
  private types = ['DNI', 'Contrato', 'Informe', 'Factura', 'Poder'];
  private documents: document[] = Array.from({ length: 50 }).map((_, i) => {
    const date = new Date(Date.now() - Math.floor(Math.random() * 10000000000));
    const type = this.types[i % this.types.length];
    const fileName = `Documento_${i + 1}.${type === 'Factura' ? 'pdf' : 'docx'}`;

    // Crear contenido simulado
    const blob = new Blob([`Contenido de ${fileName}`], { type: 'application/octet-stream' });
    const document = new File([blob], fileName, { type: blob.type });

    return {
      id: i + 1,
      code: "24sdfs",
      name: fileName,
      type_document: type,
      creation: date.toISOString(),
      document
    };
  });

  downloadFileByCode(code: string): Observable<Blob> {
  const doc = this.documents.find(d => d.code === code);
  if (doc) {
    return of(doc.document).pipe(delay(300));
  } else {
    return throwError(() => new Error('Documento no encontrado'));
  }
}

}
