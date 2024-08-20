import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NewTransactionDialogComponent } from '../new-transaction-dialog/new-transaction-dialog.component';
import { CurrencyService } from '../../services/currency.service';
import { AccountService } from '../../services/account.service';
import { Router } from '@angular/router';
import { DataRefreshService } from '../../services/data-refresh.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css',
})
export class FooterComponent implements OnInit {
  defaultCurrency: string = '';
  available: string = '';

  constructor(
    public dialog: MatDialog,
    private currencyService: CurrencyService,
    private accountService: AccountService,
    private router: Router,
    private dataRefreshService: DataRefreshService
  ) {}

  ngOnInit(): void {
    this.defaultCurrency = this.currencyService.getDefaultCurrency();
    this.loadAvailableBalanace();
    this.dataRefreshService.refresh$.subscribe(() => {
      this.loadAvailableBalanace();
    });
  }

  openDialog(): void {
    let dialogRef;
    dialogRef = this.dialog.open(NewTransactionDialogComponent, {
      width: '400px',
    });
  }

  loadAvailableBalanace() {
    this.accountService
      .getAvailableBalance(this.defaultCurrency)
      .subscribe((data: number) => {
        this.available = data.toFixed(2);
      });
  }
}
