import {computed, Injectable, signal} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Expense } from '../models/expense.model';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ExpenseService {
  private api = 'https://expense-tracker-api.onrender.com/expenses';

  // For local development, you can use:
  // private api = 'http://localhost:3000/expenses';
  constructor(private http: HttpClient) {
    this.load(); // auto-load on startup
  }
  //  Central reactive store
  private _expenses = signal<Expense[]>([]);
  // Read-only signal for components
  readonly expenses = this._expenses.asReadonly();

  // Optional computed signals
  readonly total = computed(() =>
    this._expenses().reduce((sum, e) => sum + e.amount, 0)
  );

  readonly byCategory = (cat: string) => computed(() =>
    this._expenses().filter(e => e.category === cat)
  );

  // -------------------------
  // Backend synchronization
  // -------------------------

  load() {
    this.http.get<Expense[]>(this.api).subscribe(data => {
      this._expenses.set(data);
    });
  }

  get(id: number) {
    return this._expenses().find(e => e.id === id);
  }

  create(expense: Expense) {
    return this.http.post<Expense>(this.api, expense).subscribe(saved => {
      this._expenses.update(list => [...list, saved]);
    });
  }

  update(id: number, expense: Expense) {
    return this.http.put<Expense>(`${this.api}/${id}`, expense).subscribe(updated => {
      this._expenses.update(list =>
        list.map(e => e.id === id ? updated : e)
      );
    });
  }

  delete(id: number) {
    return this.http.delete(`${this.api}/${id}`).subscribe(() => {
      this._expenses.update(list => list.filter(e => e.id !== id));
    });
  }
}


