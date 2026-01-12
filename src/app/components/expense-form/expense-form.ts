// expense-form.ts - FIXED VERSION
import { Component, computed } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
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
    MatIconModule
  ],
  templateUrl: './expense-form.html',
  styleUrls: ['./expense-form.css']
})
export class ExpenseFormComponent {

  form: FormGroup<{
    id: FormControl<number>;
    title: FormControl<string>;
    amount: FormControl<number>;
    category: FormControl<string>;
    date: FormControl<string>;
  }>;

  expenses!: typeof this.svc.expenses;
  private id: number | null = null;

  isEditMode = computed(() => this.id !== null);

  constructor(
    private fb: FormBuilder,
    private svc: ExpenseService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    // Initialize form with proper typing
    this.form = this.fb.group({
      id: this.fb.control(0, { nonNullable: true }),
      title: this.fb.control('', { nonNullable: true, validators: [Validators.required, Validators.minLength(3)] }),
      amount: this.fb.control(0, { nonNullable: true, validators: [Validators.required, Validators.min(0.01)] }),
      category: this.fb.control('', { nonNullable: true, validators: Validators.required }),
      date: this.fb.control(this.getTodayDate(), { nonNullable: true, validators: Validators.required })
    });

    // Safe to use service here
    this.expenses = this.svc.expenses;

    // Check if we're in edit mode
    const idParam = this.route.snapshot.paramMap.get('id');

    if (idParam) {
      this.id = +idParam;
      // Read from signal store
      const exp = this.svc.get(this.id);
      if (exp) {
        this.form.patchValue(exp);
      } else {
        // If expense not found, redirect to list
        this.router.navigate(['/expenses']);
      }
    }
  }

  // Helper method to get today's date in YYYY-MM-DD format
  private getTodayDate(): string {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  save() {
    if (this.form.invalid) {
      // Mark all fields as touched to show validation errors
      Object.keys(this.form.controls).forEach(key => {
        this.form.get(key)?.markAsTouched();
      });
      return;
    }

    const payload: Expense = {
      id: this.id ?? 0,
      title: this.form.value.title ?? '',
      amount: parseFloat(String(this.form.value.amount)) ?? 0,
      category: this.form.value.category ?? '',
      date: this.form.value.date ?? ''
    };

    if (this.id) {
      this.svc.update(this.id, payload);
    } else {
      this.svc.create(payload);
    }

    // Navigate back to list
    this.router.navigate(['/expenses']);
  }

  cancel() {
    this.router.navigate(['/expenses']);
  }
}
