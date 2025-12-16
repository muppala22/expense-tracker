import { Routes } from '@angular/router';
import {ExpenseList} from './components/expense-list/expense-list';
import {ExpenseForm} from './components/expense-form/expense-form';
import {ExpenseDetail} from './components/expense-detail/expense-detail';

export const routes: Routes = [
  { path: '', redirectTo: 'expenses', pathMatch: 'full'},
  { path: 'expenses', component: ExpenseList},
  { path: 'expenses/new', component: ExpenseForm},
  { path: 'expenses/:id', component: ExpenseDetail}
];
