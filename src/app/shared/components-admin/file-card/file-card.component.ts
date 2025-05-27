import { Component, inject, Input, OnInit } from '@angular/core';
import { EvidenceService } from '../../../core/services-admin/evidence/evidence.service';
import { AlertService } from '../../../core/services-admin/alert/alert.service';

@Component({
  selector: 'app-file-card',
  templateUrl: './file-card.component.html',
  styleUrls: ['./file-card.component.css']
})
export class FileCardComponent {

  @Input() evidence: any;
  private evidenceService = inject(EvidenceService);
  private alertService = inject(AlertService)

  downloadFile(evidenceId: number) {
    this.evidenceService.downloadFile(evidenceId).subscribe({
      next: (blob) => {
        // saveAs(blob, this.evidence.nombreFile);
      },
      error: (error) => {
        this.alertService.error({
          message: error,
        });
      },
    });
  }
}
