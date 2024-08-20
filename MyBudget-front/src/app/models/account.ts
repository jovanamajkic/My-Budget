import { Transaction } from './transaction';

export class Account {
  id: number;
  name: string;
  currency: string;
  balance: number;
  transactions: Transaction[];

  constructor(
    id: number,
    name: string,
    currency: string,
    balance: number,
    transactions: Transaction[]
  ) {
    this.id = id;
    this.name = name;
    this.currency = currency;
    this.balance = balance;
    this.transactions = transactions;
  }
}
