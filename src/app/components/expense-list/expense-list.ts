import { Component, OnInit } from '@angular/core';

import { ExpenseService } from '../../../services/expense-service';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import {Expense} from "../../../models/expense.model";
import {CurrencyPipe} from "@angular/common";
import {MatButton} from "@angular/material/button";
import {RouterLink} from "@angular/router";
import {MatLine} from "@angular/material/core";

@Component({
  selector: 'app-expense-list',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatListModule,
    CurrencyPipe,
    MatButton,
    RouterLink,
    MatLine
  ],
  templateUrl: './expense-list.html'
})
export class ExpenseList implements OnInit {

  expenses: Expense[] =[];
  loading = true;

  constructor(private svc: ExpenseService) {}

  ngOnInit(): void {
    this.svc.getAll().subscribe({
      next: data => {this.expenses = data; this.loading = false;},
      error: err => {console.error(err); this.loading = false;}
    });
  }

}
