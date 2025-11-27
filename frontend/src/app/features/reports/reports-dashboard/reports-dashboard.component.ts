import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReportService } from '../../../core/services/report.service';

@Component({
  selector: 'app-reports-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="reports-container">
      <!-- Page Header -->
      <div class="page-header">
        <div class="header-content">
          <h1>Reports & Analytics</h1>
          <p class="subtitle">Comprehensive insights into your business performance</p>
        </div>
      </div>

      <!-- Revenue Summary Section -->
      <div class="report-section">
        <div class="section-header">
          <div class="header-title">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <line x1="12" y1="1" x2="12" y2="23"/>
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
            </svg>
            <h2>Revenue Summary</h2>
          </div>
        </div>

        <div class="stats-grid" *ngIf="revenueSummary">
          <div class="stat-card featured">
            <div class="stat-header">
              <div class="stat-icon-wrapper primary">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="12 6 12 12 16 14"/>
                </svg>
              </div>
              <div class="stat-badge">Today</div>
            </div>
            <div class="stat-body">
              <h3 class="stat-value">\${{ revenueSummary.today.revenue.toFixed(2) }}</h3>
              <p class="stat-label">Today's Revenue</p>
            </div>
            <div class="stat-footer">
              <div class="stat-meta">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <circle cx="9" cy="21" r="1"/>
                  <circle cx="20" cy="21" r="1"/>
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                </svg>
                <span>{{ revenueSummary.today.orders }} orders</span>
              </div>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-header">
              <div class="stat-icon-wrapper">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                  <line x1="16" y1="2" x2="16" y2="6"/>
                  <line x1="8" y1="2" x2="8" y2="6"/>
                  <line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
              </div>
            </div>
            <div class="stat-body">
              <h3 class="stat-value">\${{ revenueSummary.this_month.revenue.toFixed(2) }}</h3>
              <p class="stat-label">This Month</p>
            </div>
            <div class="stat-footer">
              <div class="stat-meta">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                <span>{{ revenueSummary.this_month.orders }} orders</span>
              </div>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-header">
              <div class="stat-icon-wrapper">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                  <line x1="9" y1="3" x2="9" y2="21"/>
                  <line x1="15" y1="3" x2="15" y2="21"/>
                  <line x1="3" y1="9" x2="21" y2="9"/>
                  <line x1="3" y1="15" x2="21" y2="15"/>
                </svg>
              </div>
            </div>
            <div class="stat-body">
              <h3 class="stat-value">\${{ revenueSummary.this_year.revenue.toFixed(2) }}</h3>
              <p class="stat-label">This Year</p>
            </div>
            <div class="stat-footer">
              <div class="stat-meta">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                <span>{{ revenueSummary.this_year.orders }} orders</span>
              </div>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-header">
              <div class="stat-icon-wrapper">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                  <path d="M2 17l10 5 10-5"/>
                  <path d="M2 12l10 5 10-5"/>
                </svg>
              </div>
            </div>
            <div class="stat-body">
              <h3 class="stat-value">\${{ revenueSummary.all_time.revenue.toFixed(2) }}</h3>
              <p class="stat-label">All Time</p>
            </div>
            <div class="stat-footer">
              <div class="stat-meta">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                </svg>
                <span>{{ revenueSummary.all_time.orders }} orders</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Daily Earnings Section -->
      <div class="report-section">
        <div class="section-header">
          <div class="header-title">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12 6 12 12 16 14"/>
            </svg>
            <h2>Daily Earnings</h2>
          </div>
          <div class="date-control">
            <label>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
              Date:
            </label>
            <input
              type="date"
              [(ngModel)]="selectedDate"
              (change)="loadDailyEarnings()"
            />
          </div>
        </div>

        <div class="earnings-card" *ngIf="dailyEarnings">
          <div class="earnings-stat-group">
            <div class="earnings-stat">
              <div class="earnings-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <line x1="12" y1="1" x2="12" y2="23"/>
                  <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                </svg>
              </div>
              <div class="earnings-content">
                <span class="earnings-label">Total Earnings</span>
                <span class="earnings-value primary">\${{ dailyEarnings.total_earnings?.toFixed(2) || '0.00' }}</span>
              </div>
            </div>
            <div class="earnings-stat">
              <div class="earnings-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <circle cx="9" cy="21" r="1"/>
                  <circle cx="20" cy="21" r="1"/>
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                </svg>
              </div>
              <div class="earnings-content">
                <span class="earnings-label">Total Orders</span>
                <span class="earnings-value">{{ dailyEarnings.total_orders || 0 }}</span>
              </div>
            </div>
            <div class="earnings-stat">
              <div class="earnings-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                  <line x1="16" y1="2" x2="16" y2="6"/>
                  <line x1="8" y1="2" x2="8" y2="6"/>
                  <line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
              </div>
              <div class="earnings-content">
                <span class="earnings-label">Date</span>
                <span class="earnings-value">{{ dailyEarnings.date }}</span>
              </div>
            </div>
            <div class="earnings-stat">
              <div class="earnings-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
                </svg>
              </div>
              <div class="earnings-content">
                <span class="earnings-label">Average Order</span>
                <span class="earnings-value">\${{ (dailyEarnings.total_orders > 0 ? (dailyEarnings.total_earnings / dailyEarnings.total_orders) : 0).toFixed(2) }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="empty-state" *ngIf="!dailyEarnings">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          <p>Loading daily earnings data...</p>
        </div>
      </div>

      <!-- Monthly Earnings Section -->
      <div class="report-section">
        <div class="section-header">
          <div class="header-title">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/>
              <line x1="8" y1="2" x2="8" y2="6"/>
              <line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            <h2>Monthly Earnings</h2>
          </div>
          <div class="month-year-control">
            <label>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
              Month:
            </label>
            <select [(ngModel)]="selectedMonth" (change)="loadMonthlyEarnings()">
              <option [value]="1">January</option>
              <option [value]="2">February</option>
              <option [value]="3">March</option>
              <option [value]="4">April</option>
              <option [value]="5">May</option>
              <option [value]="6">June</option>
              <option [value]="7">July</option>
              <option [value]="8">August</option>
              <option [value]="9">September</option>
              <option [value]="10">October</option>
              <option [value]="11">November</option>
              <option [value]="12">December</option>
            </select>
            <label>Year:</label>
            <input
              type="number"
              [(ngModel)]="selectedYear"
              (change)="loadMonthlyEarnings()"
              min="2020"
              max="2030"
            />
          </div>
        </div>

        <div class="earnings-card" *ngIf="monthlyEarnings">
          <div class="earnings-stat-group">
            <div class="earnings-stat">
              <div class="earnings-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <line x1="12" y1="1" x2="12" y2="23"/>
                  <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                </svg>
              </div>
              <div class="earnings-content">
                <span class="earnings-label">Total Earnings</span>
                <span class="earnings-value primary">\${{ monthlyEarnings.total_earnings?.toFixed(2) || '0.00' }}</span>
              </div>
            </div>
            <div class="earnings-stat">
              <div class="earnings-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <circle cx="9" cy="21" r="1"/>
                  <circle cx="20" cy="21" r="1"/>
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                </svg>
              </div>
              <div class="earnings-content">
                <span class="earnings-label">Total Orders</span>
                <span class="earnings-value">{{ monthlyEarnings.total_orders || 0 }}</span>
              </div>
            </div>
            <div class="earnings-stat">
              <div class="earnings-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                  <line x1="16" y1="2" x2="16" y2="6"/>
                  <line x1="8" y1="2" x2="8" y2="6"/>
                  <line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
              </div>
              <div class="earnings-content">
                <span class="earnings-label">Period</span>
                <span class="earnings-value">{{ monthlyEarnings.month }}/{{ monthlyEarnings.year }}</span>
              </div>
            </div>
            <div class="earnings-stat">
              <div class="earnings-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
                </svg>
              </div>
              <div class="earnings-content">
                <span class="earnings-label">Average Order</span>
                <span class="earnings-value">\${{ (monthlyEarnings.total_orders > 0 ? (monthlyEarnings.total_earnings / monthlyEarnings.total_orders) : 0).toFixed(2) }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="empty-state" *ngIf="!monthlyEarnings">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          <p>Loading monthly earnings data...</p>
        </div>
      </div>

      <!-- Date Range Earnings Section -->
      <div class="report-section">
        <div class="section-header">
          <div class="header-title">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <line x1="8" y1="6" x2="21" y2="6"/>
              <line x1="8" y1="12" x2="21" y2="12"/>
              <line x1="8" y1="18" x2="21" y2="18"/>
              <line x1="3" y1="6" x2="3.01" y2="6"/>
              <line x1="3" y1="12" x2="3.01" y2="12"/>
              <line x1="3" y1="18" x2="3.01" y2="18"/>
            </svg>
            <h2>Date Range Earnings</h2>
          </div>
          <div class="date-range-control">
            <label>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
              From:
            </label>
            <input
              type="date"
              [(ngModel)]="startDate"
            />
            <label>To:</label>
            <input
              type="date"
              [(ngModel)]="endDate"
            />
            <button class="apply-btn" (click)="loadDateRangeEarnings()">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              Apply
            </button>
          </div>
        </div>

        <div class="earnings-card" *ngIf="dateRangeEarnings">
          <div class="earnings-stat-group">
            <div class="earnings-stat">
              <div class="earnings-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <line x1="12" y1="1" x2="12" y2="23"/>
                  <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                </svg>
              </div>
              <div class="earnings-content">
                <span class="earnings-label">Total Earnings</span>
                <span class="earnings-value primary">\${{ dateRangeEarnings.summary?.total_earnings?.toFixed(2) || '0.00' }}</span>
              </div>
            </div>
            <div class="earnings-stat">
              <div class="earnings-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <circle cx="9" cy="21" r="1"/>
                  <circle cx="20" cy="21" r="1"/>
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                </svg>
              </div>
              <div class="earnings-content">
                <span class="earnings-label">Total Orders</span>
                <span class="earnings-value">{{ dateRangeEarnings.summary?.total_orders || 0 }}</span>
              </div>
            </div>
            <div class="earnings-stat">
              <div class="earnings-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                  <line x1="16" y1="2" x2="16" y2="6"/>
                  <line x1="8" y1="2" x2="8" y2="6"/>
                  <line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
              </div>
              <div class="earnings-content">
                <span class="earnings-label">Days in Range</span>
                <span class="earnings-value">{{ dateRangeEarnings.daily_breakdown?.length || 0 }}</span>
              </div>
            </div>
            <div class="earnings-stat">
              <div class="earnings-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
                </svg>
              </div>
              <div class="earnings-content">
                <span class="earnings-label">Average Order</span>
                <span class="earnings-value">\${{ (dateRangeEarnings.summary?.total_orders > 0 ? (dateRangeEarnings.summary.total_earnings / dateRangeEarnings.summary.total_orders) : 0).toFixed(2) }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="empty-state info" *ngIf="!dateRangeEarnings">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          <p>Select date range and click Apply to view earnings</p>
        </div>
      </div>

      <!-- Sales by Brand Section -->
      <div class="report-section">
        <div class="section-header">
          <div class="header-title">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/>
              <circle cx="7" cy="7" r="1"/>
            </svg>
            <h2>Sales by Brand</h2>
          </div>
        </div>

        <div class="brand-grid" *ngIf="salesByBrand.length > 0">
          <div class="brand-card" *ngFor="let brand of salesByBrand">
            <div class="brand-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/>
              </svg>
            </div>
            <div class="brand-content">
              <h3 class="brand-name">{{ brand.brand_name }}</h3>
              <div class="brand-stats">
                <div class="brand-stat">
                  <span class="stat-value primary">\${{ brand.total_revenue.toFixed(2) }}</span>
                  <span class="stat-label">Total Revenue</span>
                </div>
                <div class="brand-stat">
                  <span class="stat-value">{{ brand.total_units_sold }}</span>
                  <span class="stat-label">Units Sold</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="empty-state info" *ngIf="salesByBrand.length === 0">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/>
          </svg>
          <p>No brand sales data available</p>
        </div>
      </div>

      <!-- Top Selling Products Section -->
      <div class="report-section">
        <div class="section-header">
          <div class="header-title">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
              <polyline points="17 6 23 6 23 12"/>
            </svg>
            <h2>Top Selling Products</h2>
          </div>
          <div class="header-badge">Top 10</div>
        </div>

        <div class="products-grid" *ngIf="topProducts.length > 0">
          <div class="product-rank-card" *ngFor="let product of topProducts; let i = index">
            <div class="rank-badge" [class.top-three]="i < 3">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" *ngIf="i === 0">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
              </svg>
              <span>{{ i + 1 }}</span>
            </div>
            <div class="product-rank-info">
              <div class="product-main">
                <h3 class="product-name">{{ product.product_name }}</h3>
                <div class="product-tags">
                  <span class="tag" *ngIf="product.category">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M3 3h7v7H3z"/>
                      <path d="M14 3h7v7h-7z"/>
                    </svg>
                    {{ product.category }}
                  </span>
                  <span class="tag" *ngIf="product.brand">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/>
                    </svg>
                    {{ product.brand }}
                  </span>
                </div>
              </div>
              <div class="product-stats">
                <div class="stat-item">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                  </svg>
                  <span class="stat-value">{{ product.total_sold }}</span>
                  <span class="stat-label">units</span>
                </div>
                <div class="stat-divider"></div>
                <div class="stat-item primary">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <line x1="12" y1="1" x2="12" y2="23"/>
                    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                  </svg>
                  <span class="stat-value">\${{ product.total_revenue.toFixed(2) }}</span>
                  <span class="stat-label">revenue</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="empty-state info" *ngIf="topProducts.length === 0">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
            <polyline points="17 6 23 6 23 12"/>
          </svg>
          <p>No product sales data available</p>
        </div>
      </div>

      <!-- Sales by Category Section -->
      <div class="report-section">
        <div class="section-header">
          <div class="header-title">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <rect x="3" y="3" width="7" height="7"/>
              <rect x="14" y="3" width="7" height="7"/>
              <rect x="14" y="14" width="7" height="7"/>
              <rect x="3" y="14" width="7" height="7"/>
            </svg>
            <h2>Sales by Category</h2>
          </div>
        </div>

        <div class="category-grid" *ngIf="salesByCategory.length > 0">
          <div class="category-card" *ngFor="let category of salesByCategory">
            <div class="category-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M3 3h7v7H3z"/>
                <path d="M14 3h7v7h-7z"/>
              </svg>
            </div>
            <div class="category-content">
              <h3 class="category-name">{{ category.category_name }}</h3>
              <div class="category-stats">
                <div class="category-stat">
                  <span class="stat-value primary">\${{ category.total_revenue.toFixed(2) }}</span>
                  <span class="stat-label">Total Revenue</span>
                </div>
                <div class="category-stat">
                  <span class="stat-value">{{ category.total_units_sold }}</span>
                  <span class="stat-label">Units Sold</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="empty-state info" *ngIf="salesByCategory.length === 0">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <rect x="3" y="3" width="7" height="7"/>
            <rect x="14" y="3" width="7" height="7"/>
            <rect x="14" y="14" width="7" height="7"/>
            <rect x="3" y="14" width="7" height="7"/>
          </svg>
          <p>No category sales data available</p>
        </div>
      </div>

      <!-- Low Stock Products Section -->
      <div class="report-section warning">
        <div class="section-header">
          <div class="header-title">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
              <line x1="12" y1="9" x2="12" y2="13"/>
              <line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
            <h2>Low Stock Alert</h2>
          </div>
          <div class="threshold-control">
            <label>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              Threshold:
            </label>
            <input
              type="number"
              [(ngModel)]="stockThreshold"
              (change)="loadLowStock()"
              min="1"
            />
          </div>
        </div>

        <div class="low-stock-grid" *ngIf="lowStockProducts.length > 0">
          <div class="low-stock-card" *ngFor="let product of lowStockProducts">
            <div class="alert-indicator">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                <line x1="12" y1="9" x2="12" y2="13"/>
                <line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
            </div>
            <div class="low-stock-info">
              <div class="product-details">
                <h3 class="product-name">{{ product.product_name }}</h3>
                <span class="product-category" *ngIf="product.category">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M3 3h7v7H3z"/>
                  </svg>
                  {{ product.category }}
                </span>
              </div>
              <div class="stock-metrics">
                <div class="metric danger">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                  </svg>
                  <div class="metric-content">
                    <span class="metric-value">{{ product.current_quantity }}</span>
                    <span class="metric-label">Current Stock</span>
                  </div>
                </div>
                <div class="metric">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
                    <polyline points="17 6 23 6 23 12"/>
                  </svg>
                  <div class="metric-content">
                    <span class="metric-value">{{ product.sold_quantity }}</span>
                    <span class="metric-label">Sold</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="empty-state" *ngIf="lowStockProducts.length === 0">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
          <p>All products have sufficient stock!</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }

    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.6; }
    }

    .reports-container {
      padding: 32px 40px;
      max-width: 1800px;
      margin: 0 auto;
      animation: fadeIn 0.6s ease-out;
    }

    /* Page Header */
    .page-header {
      margin-bottom: 32px;
      animation: fadeIn 0.6s ease-out;
    }

    .header-content h1 {
      font-size: 36px;
      font-weight: 700;
      color: white;
      margin: 0 0 8px 0;
      letter-spacing: -0.5px;
    }

    .subtitle {
      color: rgba(255, 255, 255, 0.7);
      font-size: 16px;
      margin: 0;
    }

    /* Report Sections */
    .report-section {
      background: rgba(255, 255, 255, 0.05);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 20px;
      padding: 28px;
      margin-bottom: 32px;
      animation: fadeIn 0.6s ease-out backwards;
    }

    .report-section:nth-child(2) { animation-delay: 0.1s; }
    .report-section:nth-child(3) { animation-delay: 0.2s; }
    .report-section:nth-child(4) { animation-delay: 0.3s; }
    .report-section:nth-child(5) { animation-delay: 0.4s; }
    .report-section:nth-child(6) { animation-delay: 0.5s; }
    .report-section:nth-child(7) { animation-delay: 0.6s; }
    .report-section:nth-child(8) { animation-delay: 0.7s; }
    .report-section:nth-child(9) { animation-delay: 0.8s; }

    .report-section.warning {
      background: rgba(231, 76, 60, 0.08);
      border-color: rgba(231, 76, 60, 0.2);
    }

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
      padding-bottom: 16px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      gap: 16px;
      flex-wrap: wrap;
    }

    .header-title {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .header-title svg {
      width: 24px;
      height: 24px;
      stroke-width: 2;
      color: #00d4ff;
    }

    .report-section.warning .header-title svg {
      color: #f39c12;
    }

    .header-title h2 {
      font-size: 22px;
      font-weight: 700;
      color: white;
      margin: 0;
    }

    .header-badge {
      padding: 8px 16px;
      background: rgba(0, 212, 255, 0.2);
      border: 1px solid rgba(0, 212, 255, 0.3);
      border-radius: 10px;
      color: #00d4ff;
      font-size: 12px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    /* Date Controls */
    .date-control,
    .month-year-control,
    .date-range-control {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 10px 16px;
      background: rgba(0, 212, 255, 0.1);
      border: 1px solid rgba(0, 212, 255, 0.3);
      border-radius: 10px;
      flex-wrap: wrap;
    }

    .date-control label,
    .month-year-control label,
    .date-range-control label {
      display: flex;
      align-items: center;
      gap: 6px;
      color: #00d4ff;
      font-size: 13px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .date-control label svg,
    .month-year-control label svg,
    .date-range-control label svg {
      width: 16px;
      height: 16px;
      stroke-width: 2;
    }

    .date-control input,
    .month-year-control input,
    .month-year-control select,
    .date-range-control input {
      padding: 8px 12px;
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(0, 212, 255, 0.3);
      border-radius: 8px;
      color: white;
      font-size: 14px;
      font-weight: 600;
      transition: all 0.3s;
    }

    .month-year-control select {
      min-width: 140px;
    }

    .date-control input:focus,
    .month-year-control input:focus,
    .month-year-control select:focus,
    .date-range-control input:focus {
      outline: none;
      background: rgba(255, 255, 255, 0.15);
      border-color: rgba(0, 212, 255, 0.5);
      box-shadow: 0 0 0 3px rgba(0, 212, 255, 0.1);
    }

    .apply-btn {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 8px 16px;
      background: linear-gradient(135deg, #0099ff, #00d4ff);
      border: none;
      border-radius: 8px;
      color: white;
      font-size: 13px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      cursor: pointer;
      transition: all 0.3s;
    }

    .apply-btn svg {
      width: 16px;
      height: 16px;
      stroke-width: 2;
    }

    .apply-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(0, 153, 255, 0.4);
    }

    /* Earnings Cards */
    .earnings-card {
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 16px;
      padding: 24px;
    }

    .earnings-stat-group {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 20px;
    }

    .earnings-stat {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 20px;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 12px;
      transition: all 0.3s;
    }

    .earnings-stat:hover {
      background: rgba(255, 255, 255, 0.08);
      border-color: rgba(0, 212, 255, 0.3);
      transform: translateY(-4px);
    }

    .earnings-icon {
      width: 56px;
      height: 56px;
      background: linear-gradient(135deg, rgba(0, 153, 255, 0.3), rgba(0, 212, 255, 0.2));
      border: 2px solid rgba(0, 212, 255, 0.3);
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .earnings-icon svg {
      width: 28px;
      height: 28px;
      stroke-width: 2;
      color: #00d4ff;
    }

    .earnings-content {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .earnings-label {
      font-size: 12px;
      color: rgba(255, 255, 255, 0.6);
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .earnings-value {
      font-size: 24px;
      font-weight: 800;
      color: white;
      letter-spacing: -1px;
    }

    .earnings-value.primary {
      background: linear-gradient(135deg, #0099ff, #00d4ff);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    /* Brand Grid */
    .brand-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 20px;
    }

    .brand-card {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 14px;
      padding: 24px;
      display: flex;
      flex-direction: column;
      gap: 16px;
      transition: all 0.3s;
    }

    .brand-card:hover {
      background: rgba(255, 255, 255, 0.08);
      border-color: rgba(0, 212, 255, 0.3);
      transform: translateY(-4px);
      box-shadow: 0 8px 24px rgba(0, 153, 255, 0.15);
    }

    .brand-icon {
      width: 48px;
      height: 48px;
      background: linear-gradient(135deg, rgba(243, 156, 18, 0.3), rgba(241, 196, 15, 0.2));
      border: 2px solid rgba(243, 156, 18, 0.3);
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .brand-icon svg {
      width: 24px;
      height: 24px;
      stroke-width: 2;
      color: #f39c12;
    }

    .brand-content {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .brand-name {
      font-size: 18px;
      font-weight: 700;
      color: white;
      margin: 0;
    }

    .brand-stats {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .brand-stat {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px 12px;
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 8px;
    }

    .brand-stat .stat-value {
      font-size: 18px;
      font-weight: 700;
      color: white;
    }

    .brand-stat .stat-value.primary {
      background: linear-gradient(135deg, #f39c12, #f1c40f);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .brand-stat .stat-label {
      font-size: 12px;
      color: rgba(255, 255, 255, 0.5);
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    /* Stats Grid (Revenue Summary) */
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 24px;
    }

    .stat-card {
      background: rgba(255, 255, 255, 0.05);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 16px;
      padding: 24px;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .stat-card.featured {
      background: linear-gradient(135deg, rgba(0, 153, 255, 0.2), rgba(0, 212, 255, 0.1));
      border-color: rgba(0, 212, 255, 0.3);
    }

    .stat-card:hover {
      transform: translateY(-4px);
      border-color: rgba(0, 212, 255, 0.4);
      box-shadow: 0 12px 40px rgba(0, 153, 255, 0.2);
    }

    .stat-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }

    .stat-icon-wrapper {
      width: 48px;
      height: 48px;
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .stat-icon-wrapper.primary {
      background: linear-gradient(135deg, #0099ff, #00d4ff);
      border-color: transparent;
    }

    .stat-icon-wrapper svg {
      width: 24px;
      height: 24px;
      stroke-width: 2;
      color: white;
    }

    .stat-badge {
      background: rgba(0, 212, 255, 0.2);
      color: #00d4ff;
      padding: 6px 12px;
      border-radius: 8px;
      font-size: 12px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .stat-body {
      margin-bottom: 16px;
    }

    .stat-value {
      font-size: 32px;
      font-weight: 800;
      color: white;
      margin: 0 0 8px 0;
      letter-spacing: -1px;
    }

    .stat-label {
      color: rgba(255, 255, 255, 0.6);
      font-size: 14px;
      font-weight: 500;
      margin: 0;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .stat-footer {
      padding-top: 16px;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
    }

    .stat-meta {
      display: flex;
      align-items: center;
      gap: 8px;
      color: rgba(255, 255, 255, 0.7);
      font-size: 14px;
      font-weight: 500;
    }

    .stat-meta svg {
      width: 16px;
      height: 16px;
      stroke-width: 2;
    }

    /* Products Grid (Top Selling) */
    .products-grid {
      display: grid;
      gap: 16px;
    }

    .product-rank-card {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 14px;
      padding: 20px;
      display: flex;
      align-items: center;
      gap: 20px;
      transition: all 0.3s;
    }

    .product-rank-card:hover {
      background: rgba(255, 255, 255, 0.08);
      border-color: rgba(0, 212, 255, 0.3);
      transform: translateX(8px);
    }

    .rank-badge {
      width: 48px;
      height: 48px;
      background: rgba(255, 255, 255, 0.1);
      border: 2px solid rgba(255, 255, 255, 0.2);
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
      font-weight: 800;
      color: white;
      flex-shrink: 0;
      position: relative;
    }

    .rank-badge.top-three {
      background: linear-gradient(135deg, rgba(243, 156, 18, 0.3), rgba(241, 196, 15, 0.2));
      border-color: rgba(243, 156, 18, 0.4);
    }

    .rank-badge svg {
      position: absolute;
      width: 16px;
      height: 16px;
      top: -6px;
      right: -6px;
      stroke-width: 2;
      fill: #f39c12;
      stroke: #f39c12;
    }

    .product-rank-info {
      flex: 1;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 20px;
    }

    .product-main {
      display: flex;
      flex-direction: column;
      gap: 8px;
      flex: 1;
      min-width: 0;
    }

    .product-name {
      font-size: 16px;
      font-weight: 700;
      color: white;
      margin: 0;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .product-tags {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
    }

    .tag {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 4px 10px;
      background: rgba(0, 212, 255, 0.1);
      border: 1px solid rgba(0, 212, 255, 0.2);
      border-radius: 6px;
      font-size: 11px;
      font-weight: 600;
      color: #00d4ff;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .tag svg {
      width: 12px;
      height: 12px;
      stroke-width: 2;
    }

    .product-stats {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .stat-item {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .stat-item svg {
      width: 18px;
      height: 18px;
      stroke-width: 2;
      color: rgba(255, 255, 255, 0.6);
    }

    .stat-item.primary svg {
      color: #00d4ff;
    }

    .stat-item .stat-value {
      font-size: 16px;
      font-weight: 700;
      color: white;
    }

    .stat-item.primary .stat-value {
      color: #00d4ff;
    }

    .stat-item .stat-label {
      font-size: 12px;
      color: rgba(255, 255, 255, 0.5);
      font-weight: 500;
    }

    .stat-divider {
      width: 1px;
      height: 30px;
      background: rgba(255, 255, 255, 0.1);
    }

    /* Category Grid */
    .category-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 20px;
    }

    .category-card {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 14px;
      padding: 24px;
      display: flex;
      flex-direction: column;
      gap: 16px;
      transition: all 0.3s;
    }

    .category-card:hover {
      background: rgba(255, 255, 255, 0.08);
      border-color: rgba(0, 212, 255, 0.3);
      transform: translateY(-4px);
      box-shadow: 0 8px 24px rgba(0, 153, 255, 0.15);
    }

    .category-icon {
      width: 48px;
      height: 48px;
      background: linear-gradient(135deg, rgba(0, 153, 255, 0.3), rgba(0, 212, 255, 0.2));
      border: 2px solid rgba(0, 212, 255, 0.3);
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .category-icon svg {
      width: 24px;
      height: 24px;
      stroke-width: 2;
      color: #00d4ff;
    }

    .category-content {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .category-name {
      font-size: 18px;
      font-weight: 700;
      color: white;
      margin: 0;
    }

    .category-stats {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .category-stat {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px 12px;
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 8px;
    }

    .category-stat .stat-value {
      font-size: 18px;
      font-weight: 700;
      color: white;
    }

    .category-stat .stat-value.primary {
      background: linear-gradient(135deg, #0099ff, #00d4ff);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .category-stat .stat-label {
      font-size: 12px;
      color: rgba(255, 255, 255, 0.5);
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    /* Threshold Control */
    .threshold-control {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 10px 16px;
      background: rgba(243, 156, 18, 0.15);
      border: 1px solid rgba(243, 156, 18, 0.3);
      border-radius: 10px;
    }

    .threshold-control label {
      display: flex;
      align-items: center;
      gap: 6px;
      color: #f39c12;
      font-size: 13px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .threshold-control label svg {
      width: 16px;
      height: 16px;
      stroke-width: 2;
    }

    .threshold-control input {
      width: 80px;
      padding: 8px 12px;
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(243, 156, 18, 0.3);
      border-radius: 8px;
      color: white;
      font-size: 14px;
      font-weight: 600;
      text-align: center;
      transition: all 0.3s;
    }

    .threshold-control input:focus {
      outline: none;
      background: rgba(255, 255, 255, 0.15);
      border-color: rgba(243, 156, 18, 0.5);
      box-shadow: 0 0 0 3px rgba(243, 156, 18, 0.1);
    }

    /* Low Stock Grid */
    .low-stock-grid {
      display: grid;
      gap: 16px;
    }

    .low-stock-card {
      background: rgba(231, 76, 60, 0.08);
      border: 1px solid rgba(231, 76, 60, 0.2);
      border-radius: 14px;
      padding: 20px;
      display: flex;
      align-items: center;
      gap: 20px;
      transition: all 0.3s;
    }

    .low-stock-card:hover {
      background: rgba(231, 76, 60, 0.12);
      border-color: rgba(231, 76, 60, 0.3);
      transform: translateX(8px);
    }

    .alert-indicator {
      width: 48px;
      height: 48px;
      background: rgba(231, 76, 60, 0.2);
      border: 2px solid rgba(231, 76, 60, 0.3);
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .alert-indicator svg {
      width: 24px;
      height: 24px;
      stroke-width: 2;
      color: #e74c3c;
      fill: none;
    }

    .low-stock-info {
      flex: 1;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 20px;
    }

    .product-details {
      display: flex;
      flex-direction: column;
      gap: 6px;
      flex: 1;
      min-width: 0;
    }

    .product-details .product-name {
      font-size: 16px;
      font-weight: 700;
      color: white;
      margin: 0;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .product-category {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      color: rgba(255, 255, 255, 0.6);
      font-size: 12px;
      font-weight: 600;
    }

    .product-category svg {
      width: 12px;
      height: 12px;
      stroke-width: 2;
      color: #e74c3c;
    }

    .stock-metrics {
      display: flex;
      gap: 16px;
    }

    .metric {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 12px 16px;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 10px;
    }

    .metric.danger {
      background: rgba(231, 76, 60, 0.15);
      border-color: rgba(231, 76, 60, 0.3);
    }

    .metric svg {
      width: 20px;
      height: 20px;
      stroke-width: 2;
      color: rgba(255, 255, 255, 0.6);
    }

    .metric.danger svg {
      color: #e74c3c;
    }

    .metric-content {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .metric-value {
      font-size: 20px;
      font-weight: 800;
      color: white;
    }

    .metric.danger .metric-value {
      color: #e74c3c;
    }

    .metric-label {
      font-size: 11px;
      color: rgba(255, 255, 255, 0.5);
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    /* Empty State */
    .empty-state {
      text-align: center;
      padding: 40px 20px;
      background: rgba(39, 174, 96, 0.1);
      border: 1px solid rgba(39, 174, 96, 0.2);
      border-radius: 12px;
    }

    .empty-state svg {
      width: 48px;
      height: 48px;
      stroke-width: 2;
      color: #27ae60;
      margin-bottom: 12px;
    }

    .empty-state p {
      color: #27ae60;
      font-size: 16px;
      font-weight: 600;
      margin: 0;
    }

    .empty-state.info {
      background: rgba(52, 152, 219, 0.1);
      border-color: rgba(52, 152, 219, 0.2);
    }

    .empty-state.info svg {
      color: #3498db;
    }

    .empty-state.info p {
      color: #3498db;
    }

    /* Responsive */
    @media (max-width: 1200px) {
      .category-grid,
      .brand-grid {
        grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
      }
    }

    @media (max-width: 768px) {
      .reports-container {
        padding: 20px;
      }

      .header-content h1 {
        font-size: 28px;
      }

      .report-section {
        padding: 20px;
      }

      .section-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 12px;
      }

      .stats-grid {
        grid-template-columns: 1fr;
      }

      .product-rank-info {
        flex-direction: column;
        align-items: flex-start;
      }

      .product-stats {
        width: 100%;
        justify-content: space-between;
      }

      .category-grid,
      .brand-grid {
        grid-template-columns: 1fr;
      }

      .low-stock-info {
        flex-direction: column;
        align-items: flex-start;
      }

      .stock-metrics {
        width: 100%;
        justify-content: space-between;
      }

      .earnings-stat-group {
        grid-template-columns: 1fr;
      }

      .date-control,
      .month-year-control,
      .date-range-control {
        flex-direction: column;
        align-items: stretch;
      }

      .date-control input,
      .month-year-control input,
      .month-year-control select,
      .date-range-control input {
        width: 100%;
      }
    }
  `]
})
export class ReportsDashboardComponent implements OnInit {
  private reportService = inject(ReportService);

  // Existing properties
  revenueSummary: any = null;
  topProducts: any[] = [];
  salesByCategory: any[] = [];
  lowStockProducts: any[] = [];
  stockThreshold = 10;

  // New properties for missing services
  dailyEarnings: any = null;
  monthlyEarnings: any = null;
  dateRangeEarnings: any = null;
  salesByBrand: any[] = [];

  // Date controls
  selectedDate: string = new Date().toISOString().split('T')[0];
  selectedMonth: number = new Date().getMonth() + 1;
  selectedYear: number = new Date().getFullYear();
  startDate: string = '';
  endDate: string = '';

  ngOnInit(): void {
    this.loadRevenueSummary();
    this.loadDailyEarnings();
    this.loadMonthlyEarnings();
    this.loadSalesByBrand();
    this.loadTopProducts();
    this.loadSalesByCategory();
    this.loadLowStock();
  }

  // Existing methods
  loadRevenueSummary(): void {
    this.reportService.getRevenueSummary().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.revenueSummary = response.data;
        }
      },
      error: (error) => {
        console.error('Error loading revenue summary:', error);
      }
    });
  }

  loadTopProducts(): void {
    this.reportService.getTopSellingProducts(10).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.topProducts = response.data;
        }
      },
      error: (error) => {
        console.error('Error loading top products:', error);
      }
    });
  }

  loadSalesByCategory(): void {
    this.reportService.getSalesByCategory().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.salesByCategory = response.data;
        }
      },
      error: (error) => {
        console.error('Error loading sales by category:', error);
      }
    });
  }

  loadLowStock(): void {
    this.reportService.getLowStockProducts(this.stockThreshold).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.lowStockProducts = response.data;
        }
      },
      error: (error) => {
        console.error('Error loading low stock products:', error);
      }
    });
  }

  // New methods for missing services
  loadDailyEarnings(): void {
    this.reportService.getDailyEarnings(this.selectedDate).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.dailyEarnings = response.data;
        }
      },
      error: (error) => {
        console.error('Error loading daily earnings:', error);
      }
    });
  }

  loadMonthlyEarnings(): void {
    this.reportService.getMonthlyEarnings(this.selectedMonth, this.selectedYear).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.monthlyEarnings = response.data;
        }
      },
      error: (error) => {
        console.error('Error loading monthly earnings:', error);
      }
    });
  }

  loadDateRangeEarnings(): void {
    if (!this.startDate || !this.endDate) {
      console.warn('Start date and end date are required');
      return;
    }
    this.reportService.getEarningsByDateRange(this.startDate, this.endDate).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.dateRangeEarnings = response.data;
        }
      },
      error: (error) => {
        console.error('Error loading date range earnings:', error);
      }
    });
  }

  loadSalesByBrand(): void {
    this.reportService.getSalesByBrand().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.salesByBrand = response.data;
        }
      },
      error: (error) => {
        console.error('Error loading sales by brand:', error);
      }
    });
  }
}
