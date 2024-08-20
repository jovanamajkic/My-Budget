import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Transaction } from '../models/transaction';
import { TransactionRequest } from '../models/transaction-request';

@Injectable({
  providedIn: 'root',
})
export class TransactionService {
  private apiUrl = 'http://localhost:8080/transactions';

  constructor(private http: HttpClient) {}

  getAll() {
    return this.http.get<any>(this.apiUrl);
  }

  getByAccount(accountId: number): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(`${this.apiUrl}/${accountId}`);
  }

  create(request: TransactionRequest) {
    return this.http.post<Transaction>(this.apiUrl, request);
  }
}
