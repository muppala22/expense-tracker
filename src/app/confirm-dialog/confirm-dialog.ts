import { Component } from '@angular/core';

@Component({
  standalone: true,
  template: `
    <h2 mat-dialog-title>Delete Expense</h2>
    <mat-dialog-content>
      Are you sure you want to delete this expense?
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>No</button>
      <button mat-raised-button color="warn" [mat-dialog-close]="true">
        Yes
      </button>
    </mat-dialog-actions>
  `
})
export class ConfirmDialog {}
