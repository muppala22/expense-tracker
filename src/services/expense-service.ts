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

  getAll() {
      return this.http.get<Expense[]>(this.api);
    }

    update(expense: Expense) {
      return this.http.put(`${this.api}/${expense.id}`, expense);
    }

    delete(id: number) {
      return this.http.delete(`${this.api}/${id}`);
    }




}
