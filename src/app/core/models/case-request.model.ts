import { document } from "./document.model";

export interface CaseRequest {
    id: number;
    code: string;
    title: string;
    description: string;
    type_case: string;
    status_request: string;
    customer: string;
    creation: string;
    evidences?: document[];
}
