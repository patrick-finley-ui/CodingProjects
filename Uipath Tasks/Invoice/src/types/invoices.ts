export type InvoiceStatus =
  | 'Pending Review'
  | 'Approved'
  | 'Rejected'
  | 'Paid'
  | 'Under Review'
  | 'Processing';

export interface InvoiceRecord {
  invoiceId?: string;
  contractNumber?: string;
  vendorName?: string;
  shipmentNumber?: string;
  acceptanceDate?: string;
  invoiceTotal?: number;
  status?: string;
  recordOwner?: string;
  updatedBy?: string;
  id: string;
  createdBy?: string;
  createTime?: string;
  updateTime?: string;
  maestroProcessKey?: string;
  folderId?: string;
}

export interface InvoiceMetrics {
  totalInvoices: number;
  totalInvoiceValue: number;
  pendingReview: number;
  approved: number;
  rejected: number;
  paid: number;
  averageInvoiceValue: number;
  invoicesByStatus: Record<string, number>;
}

