import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CurrencyService } from '../../services/currency.service';
import { TransactionService } from '../../services/transaction.service';
import { TransactionRequest } from '../../models/transaction-request';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogRef } from '@angular/material/dialog';
import { Account } from '../../models/account';
import { AccountService } from '../../services/account.service';
import { DataRefreshService } from '../../services/data-refresh.service';

@Component({
  selector: 'app-new-transaction-dialog',
  templateUrl: './new-transaction-dialog.component.html',
  styleUrl: './new-transaction-dialog.component.css',
})
export class NewTransactionDialogComponent implements OnInit {
  defaultCurrency: string = '';
  accounts: Account[] = [];
  form: FormGroup;

  constructor(
    private builder: FormBuilder,
    private currencyService: CurrencyService,
    private transactionService: TransactionService,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<NewTransactionDialogComponent>,
    private accountService: AccountService,
    private dataRefreshService: DataRefreshService
  ) {
    this.form = this.builder.group({
      description: [null, Validators.required],
      type: [null, Validators.required],
      account: [null, Validators.required],
      amount: [null, Validators.required],
    });
  }

  ngOnInit(): void {
    this.defaultCurrency = this.currencyService.getDefaultCurrency();
    this.loadAccounts();
  }

  loadAccounts() {
    this.accountService.getAll().subscribe((data) => {
      this.accounts = data;
    });
  }

  createTransaction() {
    const request: TransactionRequest = {
      description: this.form.value.description,
      amount:
        this.form.value.type === 'income'
          ? this.form.value.amount
          : this.form.value.amount * -1,
      currency: this.defaultCurrency,
      accountId: this.form.value.account,
    };
    this.transactionService.create(request).subscribe({
      next: (newTransaction) => {
        this.form.reset();
        this.dialogRef.close(newTransaction);
        this.dataRefreshService.triggerRefresh();
      },
      error: (error) => {
        if (error.status === 409) {
          this.snackBar.open('Insufficient funds in the account.', 'Close', {
            duration: 3000,
          });
        } else {
          this.snackBar.open(
            'An error occured, transaction is not created.',
            undefined,
            { duration: 2000 }
          );
        }
      },
    });
  }
}
