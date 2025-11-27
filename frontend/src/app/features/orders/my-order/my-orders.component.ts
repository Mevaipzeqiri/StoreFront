import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { OrderService } from '../../../core/services/order.service';
import { AuthService } from '../../../core/services/auth.service';
import { Order } from '../../../core/models/order.model';

@Component({
  selector: 'app-my-orders',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="my-orders-container">
      <!-- Page Header -->
      <div class="page-header">
        <div class="header-content">
          <h1>My Orders</h1>
          <p class="subtitle">View and track your orders</p>
        </div>
        <a routerLink="/my-orders/create" class="btn-add">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="16"/>
            <line x1="8" y1="12" x2="16" y2="12"/>
          </svg>
          <span>Place New Order</span>
        </a>
      </div>

      <!-- Filter Bar -->
      <div class="filter-bar">
        <div class="filter-group">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
          </svg>
          <label>Filter by Status:</label>
          <select [(ngModel)]="statusFilter" (change)="onFilterChange()">
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
        <div class="results-info" *ngIf="!isLoading">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="9" cy="21" r="1"/>
            <circle cx="20" cy="21" r="1"/>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
          </svg>
          <span><strong>{{ pagination?.total || 0 }}</strong> orders found</span>
        </div>
      </div>

      <!-- Orders Grid -->
      <div class="orders-grid" *ngIf="!isLoading && orders.length > 0">
        <div class="order-card" *ngFor="let order of orders">
          <div class="order-card-header">
            <div class="order-number">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
              </svg>
              <span>{{ order.order_number }}</span>
            </div>
            <span class="status-badge" [class]="'status-' + order.status">
              <span class="status-dot"></span>
              {{ order.status }}
            </span>
          </div>

          <div class="order-card-body">
            <div class="order-info-row">
              <div class="info-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                  <line x1="16" y1="2" x2="16" y2="6"/>
                  <line x1="8" y1="2" x2="8" y2="6"/>
                  <line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
                <div>
                  <span class="info-label">Order Date</span>
                  <span class="info-value">{{ order.order_date | date : 'MMM d, y' }}</span>
                </div>
              </div>

              <div class="info-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <line x1="12" y1="1" x2="12" y2="23"/>
                  <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                </svg>
                <div>
                  <span class="info-label">Total Amount</span>
                  <span class="info-value total">\${{ order.total_amount.toFixed(2) }}</span>
                </div>
              </div>
            </div>

            <div class="shipping-info" *ngIf="order.shipping_address">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
              <div>
                <span class="info-label">Shipping To</span>
                <span class="info-value">{{ order.shipping_address }}</span>
              </div>
            </div>
          </div>

          <div class="order-card-footer">
            <a [routerLink]="['/my-orders', order.id]" class="view-details-btn">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
              View Details
            </a>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div class="loading-state" *ngIf="isLoading">
        <div class="spinner"></div>
        <p>Loading your orders...</p>
      </div>

      <!-- Empty State -->
      <div class="empty-state" *ngIf="!isLoading && orders.length === 0">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <circle cx="9" cy="21" r="1"/>
          <circle cx="20" cy="21" r="1"/>
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
        </svg>
        <h3>No Orders Yet</h3>
        <p>Start shopping and place your first order</p>
        <a routerLink="/my-orders/create" class="btn-primary">Place Your First Order</a>
      </div>

      <!-- Pagination -->
      <div class="pagination" *ngIf="pagination && pagination.totalPages > 1">
        <button class="page-btn" [disabled]="pagination.page === 1" (click)="goToPage(pagination.page - 1)">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
          Previous
        </button>

        <div class="page-info">
          Page <strong>{{ pagination.page }}</strong> of <strong>{{ pagination.totalPages }}</strong>
        </div>

        <button class="page-btn" [disabled]="pagination.page === pagination.totalPages" (click)="goToPage(pagination.page + 1)">
          Next
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <polyline points="9 18 15 12 9 6"/>
          </svg>
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

    .my-orders-container {
      padding: 32px 40px;
      max-width: 1600px;
      margin: 0 auto;
      animation: fadeIn 0.6s ease-out;
    }

    /* Page Header */
    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 32px;
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

    .btn-add {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 14px 24px;
      background: linear-gradient(135deg, #0099ff, #00d4ff);
      color: white;
      border: none;
      border-radius: 12px;
      font-weight: 600;
      text-decoration: none;
      transition: all 0.3s;
      box-shadow: 0 4px 16px rgba(0, 153, 255, 0.3);
    }

    .btn-add:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(0, 153, 255, 0.4);
    }

    .btn-add svg {
      width: 20px;
      height: 20px;
      stroke-width: 2.5;
    }

    /* Filter Bar */
    .filter-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px 24px;
      background: rgba(255, 255, 255, 0.05);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 16px;
      margin-bottom: 32px;
      animation: fadeIn 0.6s ease-out 0.1s backwards;
    }

    .filter-group {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .filter-group svg {
      width: 20px;
      height: 20px;
      stroke-width: 2;
      color: #00d4ff;
    }

    .filter-group label {
      color: rgba(255, 255, 255, 0.8);
      font-weight: 600;
      font-size: 14px;
    }

    .filter-group select {
      padding: 10px 16px;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 10px;
      color: white;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s;
    }

    .filter-group select:focus {
      outline: none;
      background: rgba(255, 255, 255, 0.08);
      border-color: rgba(0, 212, 255, 0.4);
    }

    .filter-group select option {
      background: #1a1a2e;
      color: white;
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

    /* Orders Grid */
    .orders-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
      gap: 24px;
      animation: fadeIn 0.6s ease-out 0.2s backwards;
    }

    .order-card {
      background: rgba(255, 255, 255, 0.05);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 20px;
      overflow: hidden;
      transition: all 0.3s;
    }

    .order-card:hover {
      transform: translateY(-4px);
      border-color: rgba(0, 212, 255, 0.3);
      box-shadow: 0 8px 24px rgba(0, 153, 255, 0.2);
    }

    .order-card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px 24px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      background: rgba(255, 255, 255, 0.02);
    }

    .order-number {
      display: flex;
      align-items: center;
      gap: 10px;
      color: white;
      font-weight: 700;
      font-size: 15px;
    }

    .order-number svg {
      width: 20px;
      height: 20px;
      stroke-width: 2;
      color: #00d4ff;
    }

    .status-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 6px 14px;
      border-radius: 8px;
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .status-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      animation: pulse 2s infinite;
    }

    .status-pending {
      background: rgba(243, 156, 18, 0.2);
      border: 1px solid rgba(243, 156, 18, 0.4);
      color: #f39c12;
    }

    .status-pending .status-dot {
      background: #f39c12;
      box-shadow: 0 0 8px rgba(243, 156, 18, 0.5);
    }

    .status-confirmed {
      background: rgba(52, 152, 219, 0.2);
      border: 1px solid rgba(52, 152, 219, 0.4);
      color: #3498db;
    }

    .status-confirmed .status-dot {
      background: #3498db;
      box-shadow: 0 0 8px rgba(52, 152, 219, 0.5);
    }

    .status-processing {
      background: rgba(155, 89, 182, 0.2);
      border: 1px solid rgba(155, 89, 182, 0.4);
      color: #9b59b6;
    }

    .status-processing .status-dot {
      background: #9b59b6;
      box-shadow: 0 0 8px rgba(155, 89, 182, 0.5);
    }

    .status-shipped {
      background: rgba(26, 188, 156, 0.2);
      border: 1px solid rgba(26, 188, 156, 0.4);
      color: #1abc9c;
    }

    .status-shipped .status-dot {
      background: #1abc9c;
      box-shadow: 0 0 8px rgba(26, 188, 156, 0.5);
    }

    .status-delivered {
      background: rgba(39, 174, 96, 0.2);
      border: 1px solid rgba(39, 174, 96, 0.4);
      color: #27ae60;
    }

    .status-delivered .status-dot {
      background: #27ae60;
      box-shadow: 0 0 8px rgba(39, 174, 96, 0.5);
    }

    .status-cancelled {
      background: rgba(231, 76, 60, 0.2);
      border: 1px solid rgba(231, 76, 60, 0.4);
      color: #e74c3c;
    }

    .status-cancelled .status-dot {
      background: #e74c3c;
      box-shadow: 0 0 8px rgba(231, 76, 60, 0.5);
    }

    .order-card-body {
      padding: 24px;
    }

    .order-info-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      margin-bottom: 20px;
    }

    .info-item {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      padding: 14px;
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.05);
      border-radius: 12px;
    }

    .info-item svg {
      width: 20px;
      height: 20px;
      stroke-width: 2;
      color: #00d4ff;
      flex-shrink: 0;
      margin-top: 2px;
    }

    .info-item > div {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .info-label {
      font-size: 11px;
      color: rgba(255, 255, 255, 0.5);
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .info-value {
      font-size: 14px;
      color: white;
      font-weight: 600;
    }

    .info-value.total {
      font-size: 18px;
      font-weight: 800;
      background: linear-gradient(135deg, #0099ff, #00d4ff);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .shipping-info {
      display: flex;
      gap: 12px;
      padding: 14px;
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.05);
      border-radius: 12px;
    }

    .shipping-info svg {
      width: 20px;
      height: 20px;
      stroke-width: 2;
      color: #00d4ff;
      flex-shrink: 0;
      margin-top: 2px;
    }

    .shipping-info > div {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .order-card-footer {
      padding: 16px 24px;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
      background: rgba(255, 255, 255, 0.02);
    }

    .view-details-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      width: 100%;
      padding: 12px;
      background: rgba(0, 212, 255, 0.1);
      border: 1px solid rgba(0, 212, 255, 0.3);
      border-radius: 10px;
      color: #00d4ff;
      font-size: 14px;
      font-weight: 600;
      text-decoration: none;
      transition: all 0.3s;
    }

    .view-details-btn:hover {
      background: rgba(0, 212, 255, 0.2);
      transform: translateY(-2px);
    }

    .view-details-btn svg {
      width: 18px;
      height: 18px;
      stroke-width: 2;
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
      display: inline-block;
      padding: 12px 24px;
      background: linear-gradient(135deg, #0099ff, #00d4ff);
      color: white;
      border: none;
      border-radius: 10px;
      font-weight: 600;
      text-decoration: none;
      cursor: pointer;
      transition: all 0.3s;
    }

    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(0, 153, 255, 0.4);
    }

    /* Pagination */
    .pagination {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 32px;
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

    /* Responsive */
    @media (max-width: 1024px) {
      .orders-grid {
        grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      }
    }

    @media (max-width: 768px) {
      .my-orders-container {
        padding: 20px;
      }

      .page-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 20px;
      }

      .btn-add {
        width: 100%;
        justify-content: center;
      }

      .filter-bar {
        flex-direction: column;
        align-items: stretch;
        gap: 16px;
      }

      .orders-grid {
        grid-template-columns: 1fr;
      }

      .order-info-row {
        grid-template-columns: 1fr;
      }

      .pagination {
        flex-direction: column;
        gap: 16px;
      }

      .page-btn {
        width: 100%;
        justify-content: center;
      }
    }
  `]
})
export class MyOrdersComponent implements OnInit {
  private orderService = inject(OrderService);
  private authService = inject(AuthService);

  orders: Order[] = [];
  isLoading = false;
  statusFilter = '';
  pagination: any = null;
  currentPage = 1;
  limit = 12;

  ngOnInit(): void {
    this.loadMyOrders();
  }

  loadMyOrders(): void {
    this.isLoading = true;
    const status = this.statusFilter || undefined;
    const currentUser = this.authService.currentUserValue;

    if (currentUser && currentUser.id) {
      // Load orders for the current user (client)
      this.orderService.getOrdersByClient(currentUser.id, this.currentPage, this.limit).subscribe({
        next: (response) => {
          this.isLoading = false;
          if (response.success) {
            this.orders = response.data || [];
            this.pagination = response.pagination;
          }
        },
        error: (error) => {
          this.isLoading = false;
          console.error('Error loading orders:', error);
        },
      });
    } else {
      this.isLoading = false;
    }
  }

  onFilterChange(): void {
    this.currentPage = 1;
    this.loadMyOrders();
  }

  goToPage(page: number): void {
    this.currentPage = page;
    this.loadMyOrders();
  }
}
