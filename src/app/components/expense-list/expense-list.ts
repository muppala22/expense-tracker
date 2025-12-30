import {Component, computed, signal} from '@angular/core';
import { ExpenseService } from '../../../services/expense-service';
import { RouterModule } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';``
import {CurrencyPipe, DatePipe} from '@angular/common';
import {Expense} from '../../../models/expense.model';
import {MatTable, MatTableModule} from '@angular/material/table';
import {MatIconModule} from '@angular/material/icon';

@Component({
  selector: 'app-expense-list',
  standalone: true,
  imports: [
    RouterModule,
    MatListModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    CurrencyPipe,
    MatTable,
    MatTableModule,
    MatIconModule, DatePipe
  ],
  templateUrl: './expense-list.html',
  styleUrls: ['./expense-list.css']
})
export class ExpenseListComponent  {

  constructor(private svc: ExpenseService) {}

  expenses = computed(() => this.svc.expenses());
  showTable = computed(() => this.expenses().length > 0);

  displayedColumns = ['title', 'category', 'amount', 'date', 'actions'];

  save(e: Expense) {
    this.svc.update(e.id, e);
  }

  delete(e: Expense) {
    if (!confirm('Delete this expense?')) return;
    this.svc.delete(e.id);
  }
}
