import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ExpenseService } from '../../../services/expense-service';
import {Router, ActivatedRoute, RouterModule, RouterLink} from '@angular/router';
import {MatFormField, MatFormFieldModule} from '@angular/material/form-field';
import {MatInput, MatInputModule} from '@angular/material/input';
import {MatOption, MatSelect} from '@angular/material/select';
import {MatButton} from '@angular/material/button';

@Component({
  selector: 'app-expense-form',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
      MatInputModule,
    MatInput,
    MatSelect,
    MatOption,
    MatButton,
    RouterLink
  ],
  templateUrl: './expense-form.html',
  styleUrl: './expense-form.css',
})
export class ExpenseForm {
  form = this["fb"].nonNullable.group({
    title: ['', Validators.required],
    amount: [0, [Validators.required, Validators.min(0.01)]],
    category: ['', Validators.required],
    date: ['', Validators.required]
  });


  private id: number | null = null;

  constructor(
    private fb: FormBuilder,
    private svc: ExpenseService,
    private router: Router,
    private route: ActivatedRoute
  ){
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.id = +idParam;
      this.svc.getExpense(this.id).subscribe(e => this.form.patchValue(e));
    }
  }

  loadExpenses() {
    this.svc.getAll().subscribe(data => this.expenses.set(data));
  }

  save(row: Expense) {
    this.svc.update(row).subscribe(() => row.isEditing = false);
  }

  delete(row: Expense) {
    this.svc.delete(row.id).subscribe(() => {
      this.expenses.set(this.expenses().filter(e => e.id !== row.id));
    });
  }




}
