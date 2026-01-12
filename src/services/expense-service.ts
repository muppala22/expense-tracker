import {computed, Injectable, signal} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Expense } from '../models/expense.model';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ExpenseService {
  // Updated to use your Render backend
  private api = 'https://expense-tracker-backend-rlpk.onrender.com/expenses';

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
    this.http.get<Expense[]>(this.api).subscribe({
      next: (data) => {
        this._expenses.set(data);
        console.log('Expenses loaded:', data);
      },
      error: (error) => {
        console.error('Error loading expenses:', error);
      }
    });
  }

  get(id: number) {
    return this._expenses().find(e => e.id === id);
  }

  create(expense: Expense) {
    return this.http.post<Expense>(this.api, expense).subscribe({
      next: (saved) => {
        this._expenses.update(list => [...list, saved]);
      },
      error: (error) => {
        console.error('Error creating expense:', error);
      }
    });
  }

  update(id: number, expense: Expense) {
    return this.http.put<Expense>(`${this.api}/${id}`, expense).subscribe({
      next: (updated) => {
        this._expenses.update(list =>
          list.map(e => e.id === id ? updated : e)
        );
      },
      error: (error) => {
        console.error('Error updating expense:', error);
      }
    });
  }

  delete(id: number) {
    return this.http.delete(`${this.api}/${id}`).subscribe({
      next: () => {
        this._expenses.update(list => list.filter(e => e.id !== id));
      },
      error: (error) => {
        console.error('Error deleting expense:', error);
      }
    });
  }
}
