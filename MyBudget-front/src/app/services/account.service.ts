import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AccountRequest } from '../models/account-request';
import { Account } from '../models/account';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  private apiUrl = 'http://localhost:8080/accounts';

  constructor(private http: HttpClient) {}

  getAll() {
    return this.http.get<any>(this.apiUrl);
  }

  create(request: AccountRequest) {
    return this.http.post<Account>(this.apiUrl, request);
  }

  getAvailableBalance(currency: String) {
    return this.http.get<number>(`${this.apiUrl}/available/${currency}`);
  }

  deleteAllData() {
    return this.http.delete(this.apiUrl);
  }
}
