import { Component, OnInit, inject, AfterViewInit } from '@angular/core';
import { MatCard } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import {CurrencyPipe, DatePipe, NgFor, NgForOf, NgIf} from '@angular/common';
import { ExpenseService } from '../../../services/expense-service';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { Chart, registerables } from 'chart.js';

// Register Chart.js components
Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    MatCard,
    MatIcon,
    CurrencyPipe,
    RouterLink,
    MatButtonModule,
    MatListModule,
    MatDividerModule,
    DatePipe,
    NgForOf,
    NgIf
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit, AfterViewInit {
  private expenseService = inject(ExpenseService);

  // Dashboard metrics
  totalExpenses: number = 0;
  monthlyExpenses: number = 0;
  highestCategory: string = '';
  recentExpenses: any[] = [];

  // Chart instances
  categoryChart: Chart | null = null;
  trendChart: Chart | null = null;

  // Category data for charts
  categoryData: { [key: string]: number } = {};
  monthlyData: { [key: string]: number } = {};

  ngOnInit() {
    this.calculateMetrics();
    this.loadRecentExpenses();
    this.prepareCategoryData();
    this.prepareMonthlyData();
  }

  ngAfterViewInit() {
    // Initialize charts after view is ready
    setTimeout(() => {
      this.initCategoryChart();
      this.initTrendChart();
    }, 0);
  }

  private calculateMetrics() {
    const expenses = this.expenseService.expenses();

    // Calculate total expenses
    this.totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);

    // Calculate monthly expenses
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    this.monthlyExpenses = expenses
      .filter(e => {
        const expenseDate = new Date(e.date);
        return expenseDate.getMonth() === currentMonth &&
          expenseDate.getFullYear() === currentYear;
      })
      .reduce((sum, expense) => sum + expense.amount, 0);

    // Find highest category
    const categories = expenses.reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
      return acc;
    }, {} as Record<string, number>);

    if (Object.keys(categories).length > 0) {
      this.highestCategory = Object.entries(categories)
        .sort((a, b) => b[1] - a[1])[0][0];
    } else {
      this.highestCategory = 'None';
    }
  }

  private loadRecentExpenses() {
    // Get 5 most recent expenses
    this.recentExpenses = this.expenseService.expenses()
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);
  }

  private prepareCategoryData() {
    const expenses = this.expenseService.expenses();

    // Group expenses by category
    this.categoryData = expenses.reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
      return acc;
    }, {} as Record<string, number>);
  }

  private prepareMonthlyData() {
    const expenses = this.expenseService.expenses();
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    // Initialize with zero values for all months
    monthNames.forEach(month => {
      this.monthlyData[month] = 0;
    });

    // Group expenses by month
    expenses.forEach(expense => {
      const date = new Date(expense.date);
      const monthName = monthNames[date.getMonth()];
      this.monthlyData[monthName] = (this.monthlyData[monthName] || 0) + expense.amount;
    });
  }

  private initCategoryChart() {
    const ctx = document.getElementById('categoryChart') as HTMLCanvasElement;
    if (!ctx) return;

    const labels = Object.keys(this.categoryData);
    const data = Object.values(this.categoryData);
    const backgroundColors = [
      '#4CAF50', // Green for Food
      '#2196F3', // Blue for Transport
      '#9C27B0', // Purple for Utilities
      '#FF9800', // Orange for Entertainment
      '#F44336', // Red for Shopping
      '#607D8B'  // Gray for Other
    ];

    this.categoryChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: labels,
        datasets: [{
          data: data,
          backgroundColor: backgroundColors.slice(0, labels.length),
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'right',
          },
          title: {
            display: false
          }
        }
      }
    });
  }

  private initTrendChart() {
    const ctx = document.getElementById('trendChart') as HTMLCanvasElement;
    if (!ctx) return;

    const labels = Object.keys(this.monthlyData);
    const data = Object.values(this.monthlyData);

    this.trendChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Monthly Expenses',
          data: data,
          fill: false,
          borderColor: '#1976D2',
          tension: 0.1
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Amount ($)'
            }
          },
          x: {
            title: {
              display: true,
              text: 'Month'
            }
          }
        }
      }
    });
  }

  getCategoryIcon(category: string): string {
    switch (category.toLowerCase()) {
      case 'food':
        return 'restaurant';
      case 'transport':
        return 'directions_car';
      case 'utilities':
        return 'power';
      case 'entertainment':
        return 'movie';
      case 'shopping':
        return 'shopping_cart';
      default:
        return 'category';
    }
  }
}
