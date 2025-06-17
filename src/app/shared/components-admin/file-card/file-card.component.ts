import { Component, inject, Input, OnInit } from '@angular/core';
import { EvidenceService } from '../../../core/services-admin/evidence/evidence.service';
import { AlertService } from '../../../core/services-admin/alert/alert.service';
import { NgClass, NgIf } from '@angular/common';
import { DocumentService } from '../../../core/services-admin/document/document.service';
import { DOCUMENT_SERVICE_TOKEN } from '../../../core/models/token-injection.model';

@Component({
  selector: 'app-file-card',
  standalone: true,
  imports: [NgIf, NgClass],
  templateUrl: './file-card.component.html',
  styleUrls: ['./file-card.component.css']
})
export class FileCardComponent {

  @Input() document: any;
  @Input() showIcon!: boolean;

  documentService = inject(DocumentService);
  alertService = inject(AlertService)

  downloadFileByCode(code: string, name: string) {
    this.documentService.downloadFileByCode(code).subscribe({
      next: (doc) => {
        if (!doc) {
          this.alertService.error({ message: 'El archivo no fue encontrado.' });
          return;
        }
        const url = URL.createObjectURL(doc);
        const a = document.createElement('a');
        a.href = url;
        a.download = name;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
      },
      error: (error) => {
        this.alertService.error({ message: error });
      },
    });
  }
}
