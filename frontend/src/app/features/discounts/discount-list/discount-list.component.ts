import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DiscountService } from '../../../core/services/discount.service';
import { ProductService } from '../../../core/services/product.service';
import { Discount } from '../../../core/models/discount.model';
import { Product } from '../../../core/models/product.model';

@Component({
  selector: 'app-discount-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="discount-container">
      <!-- Top Bar -->
      <div class="top-bar">
        <div class="filter-section">
          <div class="filter-box">
            <svg class="filter-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
            </svg>
            <select class="filter-select" [(ngModel)]="activeFilter" (change)="onFilterChange()">
              <option value="">All Discounts</option>
              <option value="true">Active Only</option>
              <option value="false">Inactive Only</option>
            </select>
          </div>
        </div>

        <div class="top-bar-actions">
          <button class="btn-add" (click)="toggleCreateForm()">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="16"/>
              <line x1="8" y1="12" x2="16" y2="12"/>
            </svg>
            <span class="btn-text">Add Discount</span>
          </button>
        </div>
      </div>

      <!-- Results Info -->
      <div class="results-bar" *ngIf="!isLoading">
        <div class="results-info">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="2" x2="12" y2="6"/>
            <line x1="12" y1="18" x2="12" y2="22"/>
            <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"/>
            <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"/>
            <line x1="2" y1="12" x2="6" y2="12"/>
            <line x1="18" y1="12" x2="22" y2="12"/>
            <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"/>
            <line x1="16.24" y1="7.76" x2="19.07" y2="4.93"/>
          </svg>
          <span><strong>{{ pagination?.total || 0 }}</strong> discounts found</span>
        </div>
      </div>

      <!-- Discounts Grid -->
      <div class="discounts-grid" *ngIf="!isLoading">
        <div class="discount-card" *ngFor="let discount of discounts">
          <div class="discount-header">
            <div class="product-info">
              <div class="product-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                </svg>
              </div>
              <div class="product-details">
                <h3 class="product-name">{{ discount.product_name }}</h3>
                <span class="discount-type">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/>
                    <line x1="7" y1="7" x2="7.01" y2="7"/>
                  </svg>
                  {{ discount.discount_percentage ? 'Percentage' : 'Fixed Amount' }}
                </span>
              </div>
            </div>
            <div class="status-badge" [class.active]="discount.is_active">
              <span class="status-dot"></span>
              {{ discount.is_active ? 'Active' : 'Inactive' }}
            </div>
          </div>

          <div class="discount-body">
            <div class="discount-value">
              <div class="value-card primary">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="2" x2="12" y2="6"/>
                  <line x1="12" y1="18" x2="12" y2="22"/>
                  <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"/>
                  <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"/>
                  <line x1="2" y1="12" x2="6" y2="12"/>
                  <line x1="18" y1="12" x2="22" y2="12"/>
                  <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"/>
                  <line x1="16.24" y1="7.76" x2="19.07" y2="4.93"/>
                </svg>
                <div class="value-content">
                  <span class="value-label">Discount</span>
                  <span class="value-amount" *ngIf="discount.discount_percentage">
                    {{ discount.discount_percentage }}%
                  </span>
                  <span class="value-amount" *ngIf="discount.discount_amount">
                    \${{ discount.discount_amount.toFixed(2) }}
                  </span>
                </div>
              </div>

              <div class="value-card">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <line x1="12" y1="1" x2="12" y2="23"/>
                  <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                </svg>
                <div class="value-content">
                  <span class="value-label">Original</span>
                  <span class="value-amount">\${{ discount.product_price?.toFixed(2) }}</span>
                </div>
              </div>

              <div class="value-card success">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
                  <polyline points="17 6 23 6 23 12"/>
                </svg>
                <div class="value-content">
                  <span class="value-label">Discounted</span>
                  <span class="value-amount highlight">
                    \${{ calculateDiscountedPrice(discount).toFixed(2) }}
                  </span>
                </div>
              </div>
            </div>

            <div class="date-range">
              <div class="date-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="12 6 12 12 16 14"/>
                </svg>
                <div class="date-content">
                  <span class="date-label">Start Date</span>
                  <span class="date-value">{{ discount.start_date | date : 'MMM d, y, h:mm a' }}</span>
                </div>
              </div>

              <div class="date-separator">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <line x1="5" y1="12" x2="19" y2="12"/>
                  <polyline points="12 5 19 12 12 19"/>
                </svg>
              </div>

              <div class="date-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="12 6 12 12 16 14"/>
                </svg>
                <div class="date-content">
                  <span class="date-label">End Date</span>
                  <span class="date-value">{{ discount.end_date | date : 'MMM d, y, h:mm a' }}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="discount-actions">
            <button
              class="action-btn deactivate"
              (click)="deactivateDiscount(discount.id)"
              *ngIf="discount.is_active"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx="12" cy="12" r="10"/>
                <line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/>
              </svg>
              <span>Deactivate</span>
            </button>
            <button class="action-btn delete" (click)="deleteDiscount(discount.id)">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <polyline points="3 6 5 6 21 6"/>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
              </svg>
              <span>Delete</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div class="loading-state" *ngIf="isLoading">
        <div class="spinner"></div>
        <p>Loading discounts...</p>
      </div>

      <!-- Empty State -->
      <div class="empty-state" *ngIf="!isLoading && discounts.length === 0">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="8" x2="12" y2="12"/>
          <line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
        <h3>No Discounts Found</h3>
        <p>{{ activeFilter ? 'Try adjusting your filter' : 'Start by creating your first discount' }}</p>
        <button class="btn-primary" (click)="toggleCreateForm()" *ngIf="!activeFilter">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="16"/>
            <line x1="8" y1="12" x2="16" y2="12"/>
          </svg>
          Create Your First Discount
        </button>
      </div>

      <!-- Pagination -->
      <div class="pagination" *ngIf="pagination && pagination.totalPages > 1">
        <button class="page-btn" [disabled]="pagination.page === 1" (click)="goToPage(pagination.page - 1)">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
          Previous
        </button>

        <div class="page-numbers">
          <span class="page-info">
            Page <strong>{{ pagination.page }}</strong> of <strong>{{ pagination.totalPages }}</strong>
          </span>
        </div>

        <button class="page-btn" [disabled]="pagination.page === pagination.totalPages" (click)="goToPage(pagination.page + 1)">
          Next
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <polyline points="9 18 15 12 9 6"/>
          </svg>
        </button>
      </div>
    </div>

    <!-- Create Form Panel Overlay -->
    <div class="form-overlay" *ngIf="showCreateForm" (click)="toggleCreateForm()"></div>

    <!-- Create Form Panel -->
    <div class="form-panel" [class.open]="showCreateForm">
      <div class="form-panel-header">
        <div class="panel-title">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="16"/>
            <line x1="8" y1="12" x2="16" y2="12"/>
          </svg>
          <h2>Create New Discount</h2>
        </div>
        <button class="close-btn" (click)="toggleCreateForm()">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>

      <div class="form-panel-body">
        <!-- Product Selection -->
        <div class="form-section">
          <div class="section-header">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
            </svg>
            <h3>Product</h3>
          </div>
          <div class="form-field">
            <label for="product">
              Select Product *
              <span class="required-indicator"></span>
            </label>
            <select id="product" [(ngModel)]="newDiscount.product_id">
              <option value="">Choose a product...</option>
              <option *ngFor="let product of products" [value]="product.id">
                {{ product.name }} - \${{ product.price }}
              </option>
            </select>
          </div>
        </div>

        <!-- Discount Configuration -->
        <div class="form-section">
          <div class="section-header">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="2" x2="12" y2="6"/>
              <line x1="12" y1="18" x2="12" y2="22"/>
              <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"/>
              <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"/>
              <line x1="2" y1="12" x2="6" y2="12"/>
              <line x1="18" y1="12" x2="22" y2="12"/>
              <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"/>
              <line x1="16.24" y1="7.76" x2="19.07" y2="4.93"/>
            </svg>
            <h3>Discount Value</h3>
          </div>

          <div class="form-field">
            <label for="type">Discount Type</label>
            <select id="type" [(ngModel)]="discountType" (change)="onDiscountTypeChange()">
              <option value="percentage">Percentage</option>
              <option value="amount">Fixed Amount</option>
            </select>
          </div>

          <div class="form-field" *ngIf="discountType === 'percentage'">
            <label for="percentage">
              Percentage *
              <span class="required-indicator"></span>
            </label>
            <div class="input-with-icon">
              <input
                type="number"
                id="percentage"
                [(ngModel)]="newDiscount.discount_percentage"
                placeholder="0"
                min="0"
                max="100"
                step="0.01"
              />
              <span class="input-suffix">%</span>
            </div>
          </div>

          <div class="form-field" *ngIf="discountType === 'amount'">
            <label for="amount">
              Amount *
              <span class="required-indicator"></span>
            </label>
            <div class="input-with-icon">
              <span class="input-prefix">$</span>
              <input
                type="number"
                id="amount"
                [(ngModel)]="newDiscount.discount_amount"
                placeholder="0.00"
                min="0"
                step="0.01"
              />
            </div>
          </div>
        </div>

        <!-- Date Range -->
        <div class="form-section">
          <div class="section-header">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/>
              <line x1="8" y1="2" x2="8" y2="6"/>
              <line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            <h3>Date Range</h3>
          </div>

          <div class="form-field">
            <label for="start_date">
              Start Date *
              <span class="required-indicator"></span>
            </label>
            <input
              type="datetime-local"
              id="start_date"
              [(ngModel)]="newDiscount.start_date"
            />
          </div>

          <div class="form-field">
            <label for="end_date">
              End Date *
              <span class="required-indicator"></span>
            </label>
            <input
              type="datetime-local"
              id="end_date"
              [(ngModel)]="newDiscount.end_date"
            />
          </div>
        </div>

        <!-- Error Message -->
        <div class="global-error" *ngIf="errorMessage">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <circle cx="12" cy="12" r="10"/>
            <line x1="15" y1="9" x2="9" y2="15" stroke="white" stroke-width="2"/>
            <line x1="9" y1="9" x2="15" y2="15" stroke="white" stroke-width="2"/>
          </svg>
          {{ errorMessage }}
        </div>
      </div>

      <div class="form-panel-footer">
        <button class="btn-apply" (click)="createDiscount()" [disabled]="isLoading">
          <span *ngIf="!isLoading">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            Create Discount
          </span>
          <span *ngIf="isLoading" class="loading-content">
            <span class="spinner-small"></span>
            Creating...
          </span>
        </button>
        <button class="btn-reset" (click)="cancelCreate()">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
          Cancel
        </button>
      </div>
    </div>
  `,
  styles: [`
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.6; }
    }

    .discount-container {
      padding: 32px 40px;
      max-width: 1800px;
      margin: 0 auto;
      animation: fadeIn 0.6s ease-out;
    }

    /* Top Bar */
    .top-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 24px;
      margin-bottom: 24px;
      animation: fadeIn 0.6s ease-out;
    }

    .filter-section {
      flex: 1;
      max-width: 300px;
    }

    .filter-box {
      position: relative;
      display: flex;
      align-items: center;
    }

    .filter-icon {
      position: absolute;
      left: 16px;
      width: 20px;
      height: 20px;
      stroke-width: 2;
      color: rgba(255, 255, 255, 0.5);
      pointer-events: none;
      z-index: 1;
    }

    .filter-select {
      width: 100%;
      padding: 14px 20px 14px 48px;
      background: rgba(255, 255, 255, 0.05);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 12px;
      color: white;
      font-size: 15px;
      font-weight: 600;
      transition: all 0.3s;
      cursor: pointer;
    }

    .filter-select:focus {
      outline: none;
      background: rgba(255, 255, 255, 0.08);
      border-color: rgba(0, 212, 255, 0.4);
      box-shadow: 0 0 0 3px rgba(0, 212, 255, 0.1);
    }

    .filter-select option {
      background: #1a1a2e;
      color: white;
    }

    .top-bar-actions {
      display: flex;
      gap: 12px;
    }

    .btn-add {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 12px 20px;
      background: linear-gradient(135deg, #0099ff, #00d4ff);
      color: white;
      border: none;
      border-radius: 12px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s;
      box-shadow: 0 4px 16px rgba(0, 153, 255, 0.3);
      white-space: nowrap;
    }

    .btn-add:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(0, 153, 255, 0.4);
    }

    .btn-add svg {
      width: 18px;
      height: 18px;
      stroke-width: 2.5;
    }

    /* Results Bar */
    .results-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 20px;
      background: rgba(255, 255, 255, 0.05);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 12px;
      margin-bottom: 24px;
      animation: fadeIn 0.4s ease-out;
    }

    .results-info {
      display: flex;
      align-items: center;
      gap: 10px;
      color: rgba(255, 255, 255, 0.8);
      font-size: 15px;
    }

    .results-info svg {
      width: 20px;
      height: 20px;
      stroke-width: 2;
      color: #00d4ff;
    }

    .results-info strong {
      color: white;
      font-weight: 700;
    }

    /* Discounts Grid */
    .discounts-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(450px, 1fr));
      gap: 24px;
      animation: fadeIn 0.6s ease-out 0.2s backwards;
    }

    .discount-card {
      background: rgba(255, 255, 255, 0.05);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 16px;
      overflow: hidden;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      display: flex;
      flex-direction: column;
    }

    .discount-card:hover {
      transform: translateY(-8px);
      border-color: rgba(0, 212, 255, 0.3);
      box-shadow: 0 12px 40px rgba(0, 153, 255, 0.2);
    }

    .discount-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      padding: 24px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      gap: 16px;
    }

    .product-info {
      display: flex;
      align-items: center;
      gap: 16px;
      flex: 1;
      min-width: 0;
    }

    .product-icon {
      width: 48px;
      height: 48px;
      background: linear-gradient(135deg, rgba(0, 153, 255, 0.3), rgba(0, 212, 255, 0.2));
      border: 2px solid rgba(0, 212, 255, 0.3);
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .product-icon svg {
      width: 24px;
      height: 24px;
      stroke-width: 2;
      color: #00d4ff;
    }

    .product-details {
      display: flex;
      flex-direction: column;
      gap: 6px;
      min-width: 0;
    }

    .product-name {
      font-size: 18px;
      font-weight: 700;
      color: white;
      margin: 0;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .discount-type {
      display: flex;
      align-items: center;
      gap: 6px;
      color: rgba(255, 255, 255, 0.6);
      font-size: 13px;
      font-weight: 600;
    }

    .discount-type svg {
      width: 14px;
      height: 14px;
      stroke-width: 2;
      color: #00d4ff;
    }

    .status-badge {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 14px;
      background: rgba(231, 76, 60, 0.2);
      border: 1px solid rgba(231, 76, 60, 0.3);
      border-radius: 10px;
      font-size: 12px;
      font-weight: 700;
      color: #e74c3c;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      white-space: nowrap;
    }

    .status-badge.active {
      background: rgba(39, 174, 96, 0.2);
      border-color: rgba(39, 174, 96, 0.3);
      color: #27ae60;
    }

    .status-dot {
      width: 8px;
      height: 8px;
      background: #e74c3c;
      border-radius: 50%;
      flex-shrink: 0;
    }

    .status-badge.active .status-dot {
      background: #27ae60;
      box-shadow: 0 0 12px rgba(39, 174, 96, 0.5);
      animation: pulse 2s infinite;
    }

    .discount-body {
      padding: 24px;
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .discount-value {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 12px;
    }

    .value-card {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 12px;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 10px;
      transition: all 0.3s;
    }

    .value-card:hover {
      background: rgba(255, 255, 255, 0.08);
      border-color: rgba(0, 212, 255, 0.3);
    }

    .value-card.primary {
      background: rgba(0, 153, 255, 0.15);
      border-color: rgba(0, 212, 255, 0.3);
    }

    .value-card.success {
      background: rgba(39, 174, 96, 0.15);
      border-color: rgba(39, 174, 96, 0.3);
    }

    .value-card svg {
      width: 20px;
      height: 20px;
      stroke-width: 2;
      color: rgba(255, 255, 255, 0.7);
    }

    .value-card.primary svg {
      color: #00d4ff;
    }

    .value-card.success svg {
      color: #27ae60;
    }

    .value-content {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .value-label {
      font-size: 11px;
      font-weight: 600;
      color: rgba(255, 255, 255, 0.6);
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .value-amount {
      font-size: 20px;
      font-weight: 800;
      color: white;
    }

    .value-amount.highlight {
      background: linear-gradient(135deg, #27ae60, #2ecc71);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .date-range {
      display: grid;
      grid-template-columns: 1fr auto 1fr;
      gap: 16px;
      align-items: center;
      padding: 16px;
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 12px;
    }

    .date-item {
      display: flex;
      align-items: flex-start;
      gap: 12px;
    }

    .date-item svg {
      width: 18px;
      height: 18px;
      stroke-width: 2;
      color: #00d4ff;
      flex-shrink: 0;
      margin-top: 2px;
    }

    .date-content {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .date-label {
      font-size: 11px;
      font-weight: 600;
      color: rgba(255, 255, 255, 0.5);
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .date-value {
      font-size: 13px;
      font-weight: 600;
      color: white;
    }

    .date-separator {
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .date-separator svg {
      width: 20px;
      height: 20px;
      stroke-width: 2;
      color: rgba(255, 255, 255, 0.3);
    }

    .discount-actions {
      display: flex;
      gap: 8px;
      padding: 12px 16px;
      background: rgba(0, 0, 0, 0.2);
      border-top: 1px solid rgba(255, 255, 255, 0.1);
    }

    .action-btn {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 10px 16px;
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 8px;
      color: white;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s;
    }

    .action-btn svg {
      width: 16px;
      height: 16px;
      stroke-width: 2;
    }

    .action-btn.deactivate:hover {
      background: rgba(243, 156, 18, 0.2);
      border-color: rgba(243, 156, 18, 0.4);
      transform: translateY(-2px);
    }

    .action-btn.delete:hover {
      background: rgba(231, 76, 60, 0.2);
      border-color: rgba(231, 76, 60, 0.4);
      transform: translateY(-2px);
    }

    /* Loading State */
    .loading-state {
      text-align: center;
      padding: 80px 20px;
      animation: fadeIn 0.6s ease-out;
    }

    .spinner {
      width: 50px;
      height: 50px;
      border: 4px solid rgba(0, 212, 255, 0.2);
      border-top-color: #00d4ff;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
      margin: 0 auto 20px;
    }

    .loading-state p {
      color: rgba(255, 255, 255, 0.7);
      font-size: 16px;
    }

    /* Empty State */
    .empty-state {
      text-align: center;
      padding: 80px 20px;
      background: rgba(255, 255, 255, 0.05);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 20px;
      animation: fadeIn 0.6s ease-out;
    }

    .empty-state svg {
      width: 64px;
      height: 64px;
      stroke-width: 1.5;
      color: rgba(255, 255, 255, 0.3);
      margin-bottom: 20px;
    }

    .empty-state h3 {
      font-size: 24px;
      font-weight: 700;
      color: white;
      margin: 0 0 12px 0;
    }

    .empty-state p {
      font-size: 16px;
      color: rgba(255, 255, 255, 0.6);
      margin: 0 0 24px 0;
    }

    .btn-primary {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      padding: 12px 24px;
      background: linear-gradient(135deg, #0099ff, #00d4ff);
      color: white;
      border: none;
      border-radius: 10px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s;
      box-shadow: 0 4px 16px rgba(0, 153, 255, 0.3);
    }

    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(0, 153, 255, 0.4);
    }

    .btn-primary svg {
      width: 18px;
      height: 18px;
      stroke-width: 2.5;
    }

    /* Pagination */
    .pagination {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 40px;
      padding: 20px 24px;
      background: rgba(255, 255, 255, 0.05);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 16px;
      animation: fadeIn 0.6s ease-out;
    }

    .page-btn {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 10px 18px;
      background: rgba(0, 212, 255, 0.1);
      border: 1px solid rgba(0, 212, 255, 0.2);
      border-radius: 10px;
      color: #00d4ff;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s;
    }

    .page-btn:hover:not(:disabled) {
      background: rgba(0, 212, 255, 0.2);
      transform: translateY(-2px);
    }

    .page-btn:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }

    .page-btn svg {
      width: 16px;
      height: 16px;
      stroke-width: 2.5;
    }

    .page-info {
      color: white;
      font-size: 16px;
      font-weight: 500;
    }

    .page-info strong {
      color: #00d4ff;
      font-weight: 700;
    }

    /* Form Panel Overlay */
    .form-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.6);
      backdrop-filter: blur(4px);
      z-index: 999;
      animation: fadeIn 0.3s ease-out;
    }

    /* Form Panel */
    .form-panel {
      position: fixed;
      top: 0;
      right: 0;
      width: 500px;
      height: 100vh;
      background: rgba(15, 32, 39, 0.98);
      backdrop-filter: blur(20px);
      border-left: 1px solid rgba(0, 212, 255, 0.2);
      z-index: 1000;
      display: flex;
      flex-direction: column;
      transform: translateX(100%);
      transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      box-shadow: -10px 0 40px rgba(0, 0, 0, 0.5);
    }

    .form-panel.open {
      transform: translateX(0);
    }

    .form-panel-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 24px 28px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }

    .panel-title {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .panel-title svg {
      width: 24px;
      height: 24px;
      stroke-width: 2;
      color: #00d4ff;
    }

    .panel-title h2 {
      font-size: 22px;
      font-weight: 700;
      color: white;
      margin: 0;
    }

    .close-btn {
      width: 40px;
      height: 40px;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.3s;
    }

    .close-btn:hover {
      background: rgba(239, 68, 68, 0.2);
      border-color: rgba(239, 68, 68, 0.4);
    }

    .close-btn svg {
      width: 18px;
      height: 18px;
      stroke-width: 2.5;
      color: white;
    }

    .form-panel-body {
      flex: 1;
      overflow-y: auto;
      padding: 24px 28px;
    }

    .form-panel-body::-webkit-scrollbar {
      width: 6px;
    }

    .form-panel-body::-webkit-scrollbar-track {
      background: rgba(0, 0, 0, 0.2);
    }

    .form-panel-body::-webkit-scrollbar-thumb {
      background: rgba(0, 212, 255, 0.3);
      border-radius: 3px;
    }

    .form-section {
      margin-bottom: 28px;
    }

    .section-header {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 16px;
      padding-bottom: 12px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }

    .section-header svg {
      width: 20px;
      height: 20px;
      stroke-width: 2;
      color: #00d4ff;
    }

    .section-header h3 {
      font-size: 16px;
      font-weight: 700;
      color: white;
      margin: 0;
    }

    .form-field {
      display: flex;
      flex-direction: column;
      gap: 8px;
      margin-bottom: 16px;
    }

    .form-field:last-child {
      margin-bottom: 0;
    }

    .form-field label {
      display: flex;
      align-items: center;
      gap: 6px;
      color: rgba(255, 255, 255, 0.8);
      font-size: 14px;
      font-weight: 600;
    }

    .required-indicator {
      width: 6px;
      height: 6px;
      background: #00d4ff;
      border-radius: 50%;
      display: inline-block;
    }

    .form-field input,
    .form-field select {
      padding: 12px 14px;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 10px;
      color: white;
      font-size: 14px;
      transition: all 0.3s;
      font-family: inherit;
    }

    .form-field input::placeholder {
      color: rgba(255, 255, 255, 0.4);
    }

    .form-field input:focus,
    .form-field select:focus {
      outline: none;
      background: rgba(255, 255, 255, 0.08);
      border-color: rgba(0, 212, 255, 0.4);
      box-shadow: 0 0 0 3px rgba(0, 212, 255, 0.1);
    }

    .form-field select option {
      background: #1a1a2e;
      color: white;
    }

    .input-with-icon {
      position: relative;
      display: flex;
      align-items: center;
    }

    .input-prefix {
      position: absolute;
      left: 14px;
      color: rgba(255, 255, 255, 0.5);
      font-weight: 600;
      font-size: 14px;
      pointer-events: none;
    }

    .input-suffix {
      position: absolute;
      right: 14px;
      color: rgba(255, 255, 255, 0.5);
      font-weight: 600;
      font-size: 14px;
      pointer-events: none;
    }

    .input-with-icon input {
      padding-left: 36px;
    }

    .input-with-icon input:last-child {
      padding-right: 36px;
      padding-left: 14px;
    }

    .global-error {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 12px 16px;
      background: rgba(239, 68, 68, 0.1);
      border: 1px solid rgba(239, 68, 68, 0.3);
      border-radius: 10px;
      color: #ef4444;
      font-size: 13px;
      font-weight: 500;
      margin-top: 16px;
    }

    .global-error svg {
      width: 18px;
      height: 18px;
      flex-shrink: 0;
    }

    .form-panel-footer {
      padding: 20px 28px;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
      display: flex;
      gap: 12px;
    }

    .btn-apply,
    .btn-reset {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 14px 20px;
      border: none;
      border-radius: 12px;
      font-weight: 600;
      font-size: 15px;
      cursor: pointer;
      transition: all 0.3s;
    }

    .btn-apply {
      background: linear-gradient(135deg, #0099ff, #00d4ff);
      color: white;
      box-shadow: 0 4px 16px rgba(0, 153, 255, 0.3);
    }

    .btn-apply:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(0, 153, 255, 0.4);
    }

    .btn-apply:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .btn-reset {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.2);
      color: white;
    }

    .btn-reset:hover {
      background: rgba(255, 255, 255, 0.1);
    }

    .btn-apply svg,
    .btn-reset svg {
      width: 16px;
      height: 16px;
      stroke-width: 2.5;
    }

    .loading-content {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .spinner-small {
      width: 16px;
      height: 16px;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-top-color: white;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    /* Responsive */
    @media (max-width: 1200px) {
      .discounts-grid {
        grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
      }
    }

    @media (max-width: 768px) {
      .discount-container {
        padding: 20px;
      }

      .top-bar {
        flex-direction: column;
        align-items: stretch;
      }

      .filter-section {
        max-width: none;
      }

      .top-bar-actions {
        justify-content: stretch;
      }

      .btn-add {
        justify-content: center;
      }

      .discounts-grid {
        grid-template-columns: 1fr;
      }

      .discount-value {
        grid-template-columns: 1fr;
      }

      .date-range {
        grid-template-columns: 1fr;
      }

      .date-separator {
        transform: rotate(90deg);
      }

      .pagination {
        flex-direction: column;
        gap: 16px;
      }

      .page-btn {
        width: 100%;
        justify-content: center;
      }

      .form-panel {
        width: 100%;
        max-width: 500px;
      }
    }
  `]
})
export class DiscountListComponent implements OnInit {
  private discountService = inject(DiscountService);
  private productService = inject(ProductService);

  discounts: Discount[] = [];
  products: Product[] = [];
  isLoading = false;
  showCreateForm = false;
  activeFilter = '';
  pagination: any = null;
  currentPage = 1;
  limit = 20;
  errorMessage = '';
  discountType = 'percentage';

  newDiscount: any = {
    product_id: '',
    discount_percentage: null,
    discount_amount: null,
    start_date: '',
    end_date: '',
  };

  ngOnInit(): void {
    this.loadDiscounts();
    this.loadProducts();
  }

  loadDiscounts(): void {
    this.isLoading = true;
    const is_active = this.activeFilter === '' ? undefined : this.activeFilter === 'true';

    this.discountService.getAllDiscounts(this.currentPage, this.limit, is_active).subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.success) {
          this.discounts = response.data || [];
          this.pagination = response.pagination;
        }
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Error loading discounts:', error);
      },
    });
  }

  loadProducts(): void {
    this.productService.getAllProducts(1, 100, true).subscribe({
      next: (response) => {
        if (response.success) {
          this.products = response.data || [];
        }
      },
    });
  }

  onFilterChange(): void {
    this.currentPage = 1;
    this.loadDiscounts();
  }

  toggleCreateForm(): void {
    this.showCreateForm = !this.showCreateForm;
    if (!this.showCreateForm) {
      this.cancelCreate();
    }
  }

  onDiscountTypeChange(): void {
    if (this.discountType === 'percentage') {
      this.newDiscount.discount_amount = null;
    } else {
      this.newDiscount.discount_percentage = null;
    }
  }

  createDiscount(): void {
    this.errorMessage = '';

    if (
      !this.newDiscount.product_id ||
      !this.newDiscount.start_date ||
      !this.newDiscount.end_date
    ) {
      this.errorMessage = 'Please fill in all required fields';
      return;
    }

    if (!this.newDiscount.discount_percentage && !this.newDiscount.discount_amount) {
      this.errorMessage = 'Please specify either discount percentage or amount';
      return;
    }

    this.isLoading = true;

    const discountData = {
      product_id: Number(this.newDiscount.product_id),
      discount_percentage: this.newDiscount.discount_percentage
        ? Number(this.newDiscount.discount_percentage)
        : undefined,
      discount_amount: this.newDiscount.discount_amount
        ? Number(this.newDiscount.discount_amount)
        : undefined,
      start_date: this.newDiscount.start_date,
      end_date: this.newDiscount.end_date,
    };

    this.discountService.applyDiscount(discountData).subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.success) {
          this.cancelCreate();
          this.loadDiscounts();
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.error?.message || 'Failed to create discount';
        console.error('Create discount error:', error);
      },
    });
  }

  cancelCreate(): void {
    this.showCreateForm = false;
    this.newDiscount = {
      product_id: '',
      discount_percentage: null,
      discount_amount: null,
      start_date: '',
      end_date: '',
    };
    this.discountType = 'percentage';
    this.errorMessage = '';
  }

  calculateDiscountedPrice(discount: Discount): number {
    const price = discount.product_price || 0;
    if (discount.discount_amount) {
      return price - discount.discount_amount;
    } else if (discount.discount_percentage) {
      return price * (1 - discount.discount_percentage / 100);
    }
    return price;
  }

  deactivateDiscount(id: number): void {
    if (confirm('Deactivate this discount?')) {
      this.discountService.deactivateDiscount(id).subscribe({
        next: (response) => {
          if (response.success) {
            this.loadDiscounts();
          }
        },
        error: (error) => {
          console.error('Error deactivating discount:', error);
          alert('Failed to deactivate discount');
        },
      });
    }
  }

  deleteDiscount(id: number): void {
    if (confirm('Are you sure you want to delete this discount?')) {
      this.discountService.deleteDiscount(id).subscribe({
        next: (response) => {
          if (response.success) {
            this.loadDiscounts();
          }
        },
        error: (error) => {
          console.error('Error deleting discount:', error);
          alert('Failed to delete discount');
        },
      });
    }
  }

  goToPage(page: number): void {
    this.currentPage = page;
    this.loadDiscounts();
  }
}
