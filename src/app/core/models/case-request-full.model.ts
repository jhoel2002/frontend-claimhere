import { Task } from "./task.model";

// export interface CaseRequestFull {
//   id: number;
//   code: string;
//   title: string;
//   description: string;
//   type_case: string;
//   status_request: string;
//   creation: string;
//   customerName: string;
//   customerEmail: string;
//   customerDocumentType: string;
//   customerDocumentNumber: string;
//   lawyerName: string;
//   cotizacion?: Document;
//   resolution?: Document;
//   evidencias?: Document[];
//   tasks?: Task[];
// }

export interface Document {
  code: string;
  name: string;
}