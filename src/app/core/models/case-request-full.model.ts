
export interface CaseRequestFull {
  id: string;
  caseId: string;
  title: string;
  type_case: string;
  status_request: string;
  applicationDate: string; // Puede ser Date según tu backend
  description: string;
  customer: Customer;
  evidence?: string[]; // URLs de imágenes
  downloadableEvidence?: DownloadableEvidence[];
}

export interface Customer {
  name: string;
  email: string;
  documentType: string;
  documentNumber: string;
}

export interface DownloadableEvidence {
  fileName: string;
  fileUrl: string;
}