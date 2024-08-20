import { Account } from './account';

export class Transaction {
  id: number;
  description: string;
  amount: number;
  currency: string;
  account: Account;

  constructor(
    id: number,
    description: string,
    amount: number,
    currency: string,
    account: Account
  ) {
    this.id = id;
    this.description = description;
    this.amount = amount;
    this.currency = currency;
    this.account = account;
  }
}
