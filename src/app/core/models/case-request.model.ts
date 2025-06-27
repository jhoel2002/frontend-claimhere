import { Task } from "./task.model";

export interface CaseRequest {
  id?: number;
  code: string;
  title: string;
  type_case: string;
  customerName: string;
  creation: string;
  status_request: string;
  description?: string;
  evidences?: Document[];
  customerEmail?: string;
  customerDocumentType?: string;
  customerDocumentNumber?: string;
  cotization?: Document;
  lawyerName?: string;
  lenghtTask: number;
  resolution?: Document;
  tasks?: Task[];
}

export interface Document {
  code: string;
  name: string;
}