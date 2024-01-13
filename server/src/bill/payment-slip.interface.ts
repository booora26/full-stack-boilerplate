export interface PaymentSlip {
  payer: string;
  purposeOfPayment: string;
  payee: string;
  amount: number;
  payerAccountNumber: string;
  model: string;
  referenceNumber: string;
  paymentDate: string;
  paymentCode: string;
  currency: string;
  payerSignature?: string;
}
