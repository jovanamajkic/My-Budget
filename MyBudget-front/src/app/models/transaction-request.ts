export class TransactionRequest {
  description: string;
  amount: number;
  currency: string;
  accountId: number;

  constructor(
    description: string,
    amount: number,
    currency: string,
    accountId: number
  ) {
    this.description = description;
    this.amount = amount;
    this.currency = currency;
    this.accountId = accountId;
  }
}
