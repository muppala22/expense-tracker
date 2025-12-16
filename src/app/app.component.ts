import { Component } from '@angular/core';
import {MatButton, MatIconButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {RouterLink, RouterOutlet} from '@angular/router';
import {MatToolbar} from '@angular/material/toolbar';

@Component({
  selector: 'app-root',             // The tag used in index.html
  standalone: true,                 // Important for Standalone Angular
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [
    MatButton,
    MatIcon,
    MatToolbar
  ]
})
export class AppComponent {
  title = 'Expense Tracker';


}
