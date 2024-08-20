import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, of } from 'rxjs';
import { Currency } from '../models/currency';

@Injectable({
  providedIn: 'root',
})
export class CurrencyService {
  private apiBaseUrl =
    'https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies';
  private readonly CURRENCY_KEY = 'deafultCurrency';
  private readonly CURRENCIES_KEY = 'allCurrencies';

  constructor(private http: HttpClient) {
    this.saveAllCurrencies();
  }

  getExchangeRate(
    fromCurrency: string,
    toCurrency: string
  ): Observable<number> {
    return this.http
      .get<number>(`${this.apiBaseUrl}/${fromCurrency.toLowerCase()}.json`)
      .pipe(
        map((response: any) => {
          if (
            response &&
            response[fromCurrency.toLowerCase()] &&
            response[fromCurrency.toLowerCase()][toCurrency.toLowerCase()]
          ) {
            return response[fromCurrency.toLowerCase()][
              toCurrency.toLowerCase()
            ];
          }
          throw new Error(
            `Exchange rate not found for ${fromCurrency} to ${toCurrency}`
          );
        })
      );
  }

  saveAllCurrencies(): void {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      const storedCurrencies = localStorage.getItem(this.CURRENCIES_KEY);
      if (!storedCurrencies) {
        this.http.get<any>(this.apiBaseUrl + '.json').subscribe((data) => {
          localStorage.setItem(this.CURRENCIES_KEY, JSON.stringify(data));
        });
      }
    }
  }

  getAllCurrencies(): Observable<Currency[]> {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      const storedCurrencies = localStorage.getItem(this.CURRENCIES_KEY);
      if (storedCurrencies) {
        const rawData = JSON.parse(storedCurrencies);
        const currencies: Currency[] = Object.keys(rawData).map(
          (key) => new Currency(key.toUpperCase(), rawData[key])
        );
        console.log(currencies);
        return of(currencies);
      }
    }
    return of([]);
  }

  getDefaultCurrency(): string {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      const savedCurrency = this.getCurrency();
      if (savedCurrency) {
        return savedCurrency;
      }
    }
    return 'EUR';
  }

  saveCurrency(currency: string) {
    localStorage.setItem(this.CURRENCY_KEY, currency);
  }

  getCurrency(): string | null {
    return localStorage.getItem(this.CURRENCY_KEY);
  }

  getExchangeRateDate(): Observable<string> {
    return this.http
      .get<any>(`${this.apiBaseUrl}/eur.json`)
      .pipe(map((data) => this.formatDate(data.date)));
  }

  private formatDate(date: string): string {
    const [year, month, day] = date.split('-').map(Number);
    return `${this.pad(day)}.${this.pad(month)}.${year}`;
  }

  private pad(number: number): string {
    return number < 10 ? `0${number}` : `${number}`;
  }
}
