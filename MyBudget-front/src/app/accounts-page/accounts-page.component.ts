import { Component, OnInit } from '@angular/core';
import { Account } from '../models/account';
import { AccountService } from '../services/account.service';
import { CurrencyService } from '../services/currency.service';
import { forkJoin, Observable, tap } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { NewAccountDialogComponent } from '../components/new-account-dialog/new-account-dialog.component';
import { DataRefreshService } from '../services/data-refresh.service';

@Component({
  selector: 'app-accounts-page',
  templateUrl: './accounts-page.component.html',
  styleUrl: './accounts-page.component.css',
})
export class AccountsPageComponent implements OnInit {
  accounts: Account[] = [];
  defaultCurrency: string = 'EUR';
  exchangeRates: Map<string, number> = new Map();

  constructor(
    private accountService: AccountService,
    private currencyService: CurrencyService,
    private dialog: MatDialog,
    private dataRefreshService: DataRefreshService
  ) {}

  ngOnInit(): void {
    this.defaultCurrency = this.currencyService.getDefaultCurrency();
    this.loadAccounts();
    this.dataRefreshService.refresh$.subscribe(() => {
      this.loadAccounts();
    });
  }

  loadAccounts(): void {
    this.accountService.getAll().subscribe((data) => {
      this.accounts = data;
      this.loadExchangeRates();
    });
  }

  loadExchangeRates(): void {
    const currencyRequests: Observable<any>[] = [];
    this.accounts.forEach((account) => {
      if (account.currency !== this.defaultCurrency) {
        const request = this.currencyService
          .getExchangeRate(account.currency, this.defaultCurrency)
          .pipe(tap((rate) => this.exchangeRates.set(account.currency, rate)));
        currencyRequests.push(request);
      }
    });
    forkJoin(currencyRequests).subscribe();
  }

  calculateBalance(account: Account) {
    let balance = account.balance + ' ' + account.currency;
    if (account.currency !== this.defaultCurrency) {
      const rate = this.exchangeRates.get(account.currency);
      if (rate) {
        const convertedBalance = account.balance * rate;
        balance = convertedBalance.toFixed(2) + ' ' + this.defaultCurrency;
      }
    }
    return balance;
  }

  openDialog(): void {
    let dialogRef;
    dialogRef = this.dialog.open(NewAccountDialogComponent, {
      width: '400px',
    });
  }
}
