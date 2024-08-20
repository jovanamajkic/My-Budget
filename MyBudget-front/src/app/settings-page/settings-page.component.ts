import { Component, OnInit } from '@angular/core';
import { AccountService } from '../services/account.service';
import { CurrencyService } from '../services/currency.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Currency } from '../models/currency';
import { map, Observable, of, startWith } from 'rxjs';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DeleteConfirmationDialogComponent } from '../components/delete-confirmation-dialog/delete-confirmation-dialog.component';

@Component({
  selector: 'app-settings-page',
  templateUrl: './settings-page.component.html',
  styleUrl: './settings-page.component.css',
})
export class SettingsPageComponent implements OnInit {
  currencyControl = new FormControl();
  allCurrencies: Currency[] = [];
  filteredCurrencies: Observable<Currency[]> = of([]);
  exchangeRateDate: string = '';

  constructor(
    private accountService: AccountService,
    private currencyService: CurrencyService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      this.loadAllCurrencies();

      const savedCurrency = this.currencyService.getCurrency();
      if (savedCurrency) {
        this.currencyControl.setValue(savedCurrency);
      } else {
        this.currencyControl.setValue('EUR');
      }
    }

    this.currencyService.getExchangeRateDate().subscribe((date) => {
      this.exchangeRateDate = date;
    });
  }

  deleteAllData() {
    const dialogRef = this.dialog.open(DeleteConfirmationDialogComponent, {
      width: '300px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'confirm') {
        this.accountService.deleteAllData().subscribe({
          next: () => {
            this.snackBar.open(
              'You have succesfully deleted all data.',
              undefined,
              { duration: 2000 }
            );
          },
          error: () => {
            this.snackBar.open(
              'The error occured, data is not deleted.',
              undefined,
              { duration: 2000 }
            );
          },
        });
      }
    });
  }

  onCurrencyChange(event: any) {
    this.currencyService.saveCurrency(event.option.value);
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
}
