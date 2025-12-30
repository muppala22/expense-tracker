import {Component, computed, signal} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ExpenseService } from '../../../services/expense-service';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Expense } from '../../../models/expense.model';

@Component({
  selector: 'app-expense-detail',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, MatCardModule,MatDividerModule, CommonModule],
  templateUrl: './expense-detail.html',
  styleUrls: ['./expense-detail.css']
})
export class ExpenseDetailComponent {

  private id = signal<number>(0);

  //signal based expense
  expense = computed(() => this.svc.get(this.id()));

  //signal based total
  monthlyTotal   = computed(() => {
    const e = this.expense();
    if(!e) return 0;

    const month = e.date.slice(0,7);
    return this.svc.expenses()
      .filter(x => x.category === e.category && x.date.startsWith(month))
      .reduce((sum, x) => sum + x.amount, 0);
  });

  constructor(private svc: ExpenseService, private route: ActivatedRoute, private router: Router){}

  delete() {
    const e = this.expense();
    if (!e || !confirm('Delete this expense?')) return;
    this.svc.delete(e.id);
    this.router.navigate(['/expenses']);
  }

  back() {
    this.router.navigate(['/expenses']);
  }

  edit() {
    const e = this.expense();
    if (!e) return;
    this.router.navigate(['/expenses', e.id, 'edit']);
  }

}
