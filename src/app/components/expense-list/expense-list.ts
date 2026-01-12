// expense-list.ts - IMPROVED VERSION
import {Component, computed, signal} from '@angular/core';
import { ExpenseService } from '../../../services/expense-service';
import { RouterModule } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { Expense } from '../../../models/expense.model';
import { MatTable, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-expense-list',
  standalone: true,
  imports: [
    RouterModule,
    MatListModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTooltipModule,
    CurrencyPipe,
    MatTable,
    MatTableModule,
    MatIconModule,
    DatePipe,
    FormsModule
  ],
  templateUrl: './expense-list.html',
  styleUrls: ['./expense-list.css']
})
export class ExpenseListComponent {

  // Search and filter signals
  searchTerm = signal<string>('');
  selectedCategory = signal<string>('');

  constructor(private svc: ExpenseService) {}

  expenses = computed(() => this.svc.expenses());

  // Filtered expenses based on search and category
  filteredExpenses = computed(() => {
    let filtered = this.expenses();

    // Apply search filter
    const search = this.searchTerm().toLowerCase();
    if (search) {
      filtered = filtered.filter(e =>
        e.title.toLowerCase().includes(search)
      );
    }

    // Apply category filter
    const category = this.selectedCategory();
    if (category) {
      filtered = filtered.filter(e => e.category === category);
    }

    // Sort by date (newest first)
    return filtered.sort((a, b) =>
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  });

  showTable = computed(() => this.expenses().length > 0);

  displayedColumns = ['title', 'category', 'amount', 'date', 'actions'];

  // Calculate total expenses
  getTotalExpenses(): number {
    return this.expenses().reduce((sum, e) => sum + e.amount, 0);
  }

  // Calculate average expense
  getAverageExpense(): number {
    const expenses = this.expenses();
    if (expenses.length === 0) return 0;
    return this.getTotalExpenses() / expenses.length;
  }

  // Get highest expense
  getHighestExpense(): number {
    const expenses = this.expenses();
    if (expenses.length === 0) return 0;
    return Math.max(...expenses.map(e => e.amount));
  }

  save(e: Expense) {
    this.svc.update(e.id, e);
  }

  delete(e: Expense) {
    if (!confirm(`Are you sure you want to delete "${e.title}"?`)) return;
    this.svc.delete(e.id);
  }
}
