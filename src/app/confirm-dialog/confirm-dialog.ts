import { Component } from '@angular/core';
import {MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle} from '@angular/material/dialog';
import {MatButton} from '@angular/material/button';

@Component({
  standalone: true,
  imports: [
    MatDialogTitle,
    MatDialogContent,
    MatDialogClose,
    MatDialogActions,
    MatButton
  ],
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
