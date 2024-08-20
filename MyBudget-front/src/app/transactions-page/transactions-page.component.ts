import { Component, OnInit } from '@angular/core';
import { Transaction } from '../models/transaction';
import { TransactionService } from '../services/transaction.service';
import { CurrencyService } from '../services/currency.service';
import { forkJoin, Observable, tap } from 'rxjs';
import { DataRefreshService } from '../services/data-refresh.service';
import { Account } from '../models/account';
import { AccountService } from '../services/account.service';

@Component({
  selector: 'app-transactions-page',
  templateUrl: './transactions-page.component.html',
  styleUrl: './transactions-page.component.css',
})
export class TransactionsPageComponent implements OnInit {
  accounts: Account[] = [];
  transactions: Transaction[] = [];
  filteredTransactions: Transaction[] = [];
  defaultCurrency: string = 'EUR';
  exchangeRates: Map<string, number> = new Map();

  constructor(
    private transactiontService: TransactionService,
    private currencyService: CurrencyService,
    private accountService: AccountService,
    private dataRefreshService: DataRefreshService
  ) {}

  ngOnInit(): void {
    this.defaultCurrency = this.currencyService.getDefaultCurrency();
    this.loadTransactions();
    this.loadAccounts();
    this.dataRefreshService.refresh$.subscribe(() => {
      this.loadTransactions();
    });
  }

  loadTransactions() {
    this.transactiontService.getAll().subscribe((data) => {
      this.transactions = data;
      this.filteredTransactions = this.transactions;
      this.loadExchangeRates();
    });
  }

  loadAccounts() {
    this.accountService.getAll().subscribe((data) => {
      this.accounts = data;
    });
  }

  loadExchangeRates(): void {
    const currencyRequests: Observable<any>[] = [];
    this.transactions.forEach((transaction) => {
      if (transaction.currency !== this.defaultCurrency) {
        const request = this.currencyService
          .getExchangeRate(transaction.currency, this.defaultCurrency)
          .pipe(
            tap((rate) => this.exchangeRates.set(transaction.currency, rate))
          );
        currencyRequests.push(request);
      }
    });
    forkJoin(currencyRequests).subscribe();
  }

  calculateAmount(transaction: Transaction) {
    let balance = transaction.amount + ' ' + transaction.currency;
    if (transaction.currency !== this.defaultCurrency) {
      const rate = this.exchangeRates.get(transaction.currency);
      if (rate) {
        const convertedAmount = transaction.amount * rate;
        balance = convertedAmount.toFixed(2) + ' ' + this.defaultCurrency;
      }
    }
    return balance;
  }

  onAccountChange(event: any) {
    if (event.value === 'all') {
      this.filteredTransactions = this.transactions;
    } else {
      this.transactiontService.getByAccount(event.value).subscribe((data) => {
        this.filteredTransactions = data;
      });
    }
  }
}
