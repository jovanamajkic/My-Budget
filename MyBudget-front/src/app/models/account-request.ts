export class AccountRequest {
  name: string;
  currency: string;
  balance: number;

  constructor(name: string, currency: string, balance: number) {
    this.name = name;
    this.currency = currency;
    this.balance = balance;
  }
}
