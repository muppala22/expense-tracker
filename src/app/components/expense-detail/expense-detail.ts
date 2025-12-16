import {Component, OnInit} from '@angular/core';
import {Expense} from '../../../models/expense.model';
import {ActivatedRoute, Router} from '@angular/router';
import {ExpenseService} from '../../../services/expense-service';
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";

@Component({
  selector: 'app-expense-detail',
  imports: [MatButtonModule,MatIconModule],
  templateUrl: './expense-detail.html',
  styleUrl: './expense-detail.css',
})
export class ExpenseDetail implements OnInit {

  expense: Expense | null = null;
  constructor(private route: ActivatedRoute, private svc: ExpenseService, private router: Router){}
  ngOnInit(): void {
    const id = +(this.route.snapshot.paramMap.get('id') || 0);
    if(id){
      this.svc.getExpense(id).subscribe(e => this.expense = e);
    }
    throw new Error('Method not implemented.');
  }

  delete() {
    if(!this.expense?.id) return;
    if(!confirm('Delete this expense')) return;
    this.svc.deleteExpense(this.expense.id).subscribe(() => this.router.navigate(['/expenses']));
  }


}
