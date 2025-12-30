import { Component, computed } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';  // ADD THIS LINE
import { Expense } from '../../../models/expense.model';
import { ExpenseService } from '../../../services/expense-service';

@Component({
  selector: 'app-expense-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    RouterModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule  // ADD THIS LINE
  ],
  templateUrl: './expense-form.html',
  styleUrls: ['./expense-form.css']
})
export class ExpenseFormComponent {

  form!: ReturnType<FormBuilder['group']>;
  expenses!: typeof this.svc.expenses;
  private id: number | null = null;


  isEditMode = computed(() => this.id !== null);

  constructor(
    private fb: FormBuilder,
    private svc: ExpenseService,
    private router: Router,
    private route: ActivatedRoute
  ){

    this.form = this.fb.group({
      id: [0],
      title: ['', Validators.required],
      amount: [0, [Validators.required, Validators.min(0.01)]],
      category: ['', Validators.required],
      date: ['', Validators.required]
    });
    // safe to use svc here
    this.expenses = this.svc.expenses;

    const idParam = this.route.snapshot.paramMap.get('id');

    if (idParam) {
      this.id = +idParam;
      // read from signal store
      const exp = this.svc.get(this.id);
      if(exp) {
        this.form.patchValue(exp)
      }
    }
  }

  save(){
    if (this.form.invalid) return;

    const payload: Expense = {
      id: this.id ?? 0,
      title: this.form.value.title ?? '',
      amount: this.form.value.amount ?? 0,
      category: this.form.value.category ?? '',
      date: this.form.value.date ?? ''
    };
    if (this.id) {
      this.svc.update(this.id, payload);
    } else {
      this.svc.create(payload);
    }
    this.router.navigate(['/expenses']);
  }
}
