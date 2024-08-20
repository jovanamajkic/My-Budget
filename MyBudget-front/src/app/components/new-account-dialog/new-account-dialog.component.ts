import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { AccountService } from '../../services/account.service';
import { AccountRequest } from '../../models/account-request';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogRef } from '@angular/material/dialog';
import { CurrencyService } from '../../services/currency.service';
import { Currency } from '../../models/currency';
import { map, Observable, of, startWith } from 'rxjs';
import { DataRefreshService } from '../../services/data-refresh.service';

@Component({
  selector: 'app-new-account-dialog',
  templateUrl: './new-account-dialog.component.html',
  styleUrl: './new-account-dialog.component.css',
})
export class NewAccountDialogComponent implements OnInit {
  currencyControl = new FormControl();
  allCurrencies: Currency[] = [];
  filteredCurrencies: Observable<Currency[]> = of([]);
  selectedCurrency: string = '';
  form: FormGroup;

  constructor(
    private builder: FormBuilder,
    private accountService: AccountService,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<NewAccountDialogComponent>,
    private currencyService: CurrencyService,
    private dataRefreshService: DataRefreshService
  ) {
    this.form = this.builder.group({
      name: [null, Validators.required],
      currency: [null, Validators.required],
      balance: [null, Validators.required],
    });
  }

  ngOnInit(): void {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      this.loadAllCurrencies();

      const savedCurrency = this.currencyService.getCurrency();
      if (savedCurrency) {
        this.currencyControl.setValue(savedCurrency);
        this.selectedCurrency = savedCurrency;
      } else {
        this.currencyControl.setValue('EUR');
      }
    }
  }

  loadAllCurrencies() {
    this.currencyService.getAllCurrencies().subscribe((data: any[]) => {
      this.allCurrencies = data;
      this.filteredCurrencies = this.currencyControl.valueChanges.pipe(
        startWith(''),
        map((value) => this._filter(value))
      );
    });
  }

  private _filter(value: string): Currency[] {
    const filterValue = value.toLowerCase();
    return this.allCurrencies.filter((currency) =>
      currency.key.toLowerCase().includes(filterValue)
    );
  }

  onCurrencyChange(event: any) {
    this.selectedCurrency = event.option.value;
  }

  createAccount() {
    const request: AccountRequest = {
      name: this.form.value.name,
      currency: this.selectedCurrency,
      balance: this.form.value.balance,
    };
    this.accountService.create(request).subscribe({
      next: (newAccount) => {
        this.form.reset();
        this.dialogRef.close(newAccount);
        this.dataRefreshService.triggerRefresh();
      },
      error: () => {
        this.snackBar.open(
          'An error occured, account is not created.',
          undefined,
          { duration: 2000 }
        );
      },
    });
  }
}
