import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Expense} from '../models/expense.model';

@Injectable({
  providedIn: 'root',
})
export class ExpenseService {

  private apiUrl = 'http://localhost:3000/expenses';

  constructor(private http: HttpClient) { }

  getAll(): Observable<Expense[]> {return this.http.get<Expense[]>(this.apiUrl);}
  getExpenses(): Observable<Expense[]> {
    return this.http.get<Expense[]>(this.apiUrl);
  }

  getExpense(id: number): Observable<Expense> {
    return this.http.get<Expense>(`${this.apiUrl}/${id}`);
  }

  addExpense(expense: Expense):Observable<Expense> {
    return this.http.post<Expense>(this.apiUrl, expense);
  }

  updateExpense(id: number, expense: Expense):Observable<Expense> {
    return this.http.put<Expense>(`${this.apiUrl}/${id}`, expense);
  }

  deleteExpense(id: number):Observable<Expense> {
    return this.http.delete<Expense>(`${this.apiUrl}/${id}`);
  }

}
