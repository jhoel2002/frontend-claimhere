
export interface CaseRequestFull {
  id: number;
  code: string;
  title: string;
  type_case: string;
  status_request: string;
  creation: string;
  description: string;
  customerName: string;
  customerEmail: string;
  customerDocumentType: string;
  customerDocumentNumber: string;
  lawyerName: string
  cotizacion?: Document;
  evidencias?: Document[];
}

export interface Document {
  code: string;
  name: string;
}