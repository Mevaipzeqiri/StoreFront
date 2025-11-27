import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { OrderService } from '../../../core/services/order.service';
import { Order } from '../../../core/models/order.model';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-order-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="detail-container" *ngIf="order">
      <!-- Page Header -->
      <div class="page-header">
        <div class="header-navigation">
          <a routerLink="/orders" class="back-link">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
            Back to Orders
          </a>
        </div>
      </div>

      <!-- Order Header Card -->
      <div class="order-header-card">
        <div class="order-title-section">
          <div class="order-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="9" cy="21" r="1"/>
              <circle cx="20" cy="21" r="1"/>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
            </svg>
          </div>
          <div class="order-title-content">
            <span class="order-label">Order Number</span>
            <h1>{{ order.order_number }}</h1>
          </div>
        </div>
        <div class="order-header-actions">
          <span class="status-badge" [class]="'status-' + order.status">
            <span class="status-dot"></span>
            {{ order.status }}
          </span>
          <span class="order-total-badge">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <line x1="12" y1="1" x2="12" y2="23"/>
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
            </svg>
            \${{ order.total_amount.toFixed(2) }}
          </span>
        </div>
      </div>

      <!-- Content Grid -->
      <div class="content-grid">
        <!-- Left Column -->
        <div class="left-column">
          <!-- Order Info Card -->
          <div class="info-card">
            <div class="card-header">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
              </svg>
              <h2>Order Information</h2>
            </div>
            <div class="card-body">
              <div class="info-row">
                <span class="info-label">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                    <line x1="16" y1="2" x2="16" y2="6"/>
                    <line x1="8" y1="2" x2="8" y2="6"/>
                    <line x1="3" y1="10" x2="21" y2="10"/>
                  </svg>
                  Order Date
                </span>
                <span class="info-value">{{ order.order_date | date : 'MMMM d, y, h:mm a' }}</span>
              </div>
            </div>
          </div>

          <!-- Client Info Card -->
          <div class="info-card">
            <div class="card-header">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
              <h2>Client Information</h2>
            </div>
            <div class="card-body">
              <div class="client-profile">
                <div class="client-avatar">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                </div>
                <div class="client-details">
                  <h3>{{ order.first_name }} {{ order.last_name }}</h3>
                  <p>{{ order.client_email }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Shipping Card -->
          <div class="info-card">
            <div class="card-header">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <rect x="1" y="3" width="15" height="13"/>
                <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/>
                <circle cx="5.5" cy="18.5" r="2.5"/>
                <circle cx="18.5" cy="18.5" r="2.5"/>
              </svg>
              <h2>Shipping Address</h2>
            </div>
            <div class="card-body">
              <div class="address-content">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
                <p>{{ order.shipping_address }}</p>
              </div>
            </div>
          </div>

          <!-- Notes Card -->
          <div class="info-card" *ngIf="order.notes">
            <div class="card-header">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
                <line x1="16" y1="13" x2="8" y2="13"/>
                <line x1="16" y1="17" x2="8" y2="17"/>
              </svg>
              <h2>Order Notes</h2>
            </div>
            <div class="card-body">
              <p class="notes-text">{{ order.notes }}</p>
            </div>
          </div>
        </div>

        <!-- Right Column -->
        <div class="right-column">
          <!-- Order Items Card -->
          <div class="items-card" *ngIf="order.items && order.items.length > 0">
            <div class="card-header">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
              </svg>
              <h2>Order Items</h2>
              <span class="items-count">{{ order.items.length }}</span>
            </div>
            <div class="card-body">
              <div class="items-list">
                <div class="item-row" *ngFor="let item of order.items">
                  <div class="item-main">
                    <div class="item-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                      </svg>
                    </div>
                    <div class="item-info">
                      <h4>{{ item.product_name }}</h4>
                      <div class="item-meta">
                        <span class="meta-item">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path d="M9 11l3 3L22 4"/>
                            <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
                          </svg>
                          Qty: {{ item.quantity }}
                        </span>
                        <span class="meta-item">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <line x1="12" y1="1" x2="12" y2="23"/>
                            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                          </svg>
                          \${{ item.unit_price.toFixed(2) }}
                        </span>
                        <span class="meta-item discount" *ngIf="item.discount_applied > 0">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <polyline points="20 6 9 17 4 12"/>
                          </svg>
                          -\${{ item.discount_applied.toFixed(2) }}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div class="item-total">
                    <span class="total-amount">\${{ item.subtotal.toFixed(2) }}</span>
                  </div>
                </div>
              </div>

              <div class="order-summary">
                <div class="summary-row total">
                  <span>Order Total</span>
                  <span class="total-value">\${{ order.total_amount.toFixed(2) }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Status Management Card -->
          <div class="status-card" *ngIf="authService.hasRole(['admin', 'advanced_user'])">
            <div class="card-header">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
              </svg>
              <h2>Order Status Management</h2>
            </div>
            <div class="card-body">
              <div class="status-buttons">
                <button class="status-btn" [class.active]="order.status === 'confirmed'" (click)="updateStatus('confirmed')" [disabled]="order.status === 'confirmed'">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  Confirm
                </button>
                <button class="status-btn" [class.active]="order.status === 'processing'" (click)="updateStatus('processing')" [disabled]="order.status === 'processing'">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <circle cx="12" cy="12" r="10"/>
                    <polyline points="12 6 12 12 16 14"/>
                  </svg>
                  Processing
                </button>
                <button class="status-btn" [class.active]="order.status === 'shipped'" (click)="updateStatus('shipped')" [disabled]="order.status === 'shipped'">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <rect x="1" y="3" width="15" height="13"/>
                    <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/>
                  </svg>
                  Shipped
                </button>
                <button class="status-btn" [class.active]="order.status === 'delivered'" (click)="updateStatus('delivered')" [disabled]="order.status === 'delivered'">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                    <polyline points="22 4 12 14.01 9 11.01"/>
                  </svg>
                  Delivered
                </button>
                <button class="status-btn danger" (click)="cancelOrder()" [disabled]="['shipped', 'delivered', 'cancelled'].includes(order.status)">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="15" y1="9" x2="9" y2="15"/>
                    <line x1="9" y1="9" x2="15" y2="15"/>
                  </svg>
                  Cancel Order
                </button>
              </div>
            </div>
          </div>
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

    .detail-container {
      padding: 32px 40px;
      max-width: 1600px;
      margin: 0 auto;
      animation: fadeIn 0.6s ease-out;
    }

    /* Page Header */
    .page-header {
      margin-bottom: 24px;
    }

    .back-link {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      color: rgba(255, 255, 255, 0.7);
      text-decoration: none;
      font-size: 14px;
      font-weight: 600;
      transition: all 0.3s;
    }

    .back-link:hover {
      color: #00d4ff;
      transform: translateX(-4px);
    }

    .back-link svg {
      width: 16px;
      height: 16px;
      stroke-width: 2.5;
    }

    /* Order Header Card */
    .order-header-card {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 32px;
      background: rgba(255, 255, 255, 0.05);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 20px;
      margin-bottom: 32px;
      animation: fadeIn 0.6s ease-out 0.1s backwards;
    }

    .order-title-section {
      display: flex;
      align-items: center;
      gap: 20px;
    }

    .order-icon {
      width: 64px;
      height: 64px;
      background: linear-gradient(135deg, #0099ff, #00d4ff);
      border-radius: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .order-icon svg {
      width: 32px;
      height: 32px;
      stroke-width: 2;
      color: white;
    }

    .order-title-content {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .order-label {
      font-size: 13px;
      font-weight: 600;
      color: rgba(255, 255, 255, 0.6);
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .order-title-content h1 {
      font-size: 32px;
      font-weight: 700;
      color: white;
      margin: 0;
      letter-spacing: -0.5px;
    }

    .order-header-actions {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .status-badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 10px 18px;
      border-radius: 10px;
      font-size: 13px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .status-dot {
      width: 8px;
      height: 8px;
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
      box-shadow: 0 0 12px rgba(243, 156, 18, 0.5);
    }

    .status-confirmed {
      background: rgba(52, 152, 219, 0.2);
      border: 1px solid rgba(52, 152, 219, 0.4);
      color: #3498db;
    }

    .status-confirmed .status-dot {
      background: #3498db;
      box-shadow: 0 0 12px rgba(52, 152, 219, 0.5);
    }

    .status-processing {
      background: rgba(155, 89, 182, 0.2);
      border: 1px solid rgba(155, 89, 182, 0.4);
      color: #9b59b6;
    }

    .status-processing .status-dot {
      background: #9b59b6;
      box-shadow: 0 0 12px rgba(155, 89, 182, 0.5);
    }

    .status-shipped {
      background: rgba(26, 188, 156, 0.2);
      border: 1px solid rgba(26, 188, 156, 0.4);
      color: #1abc9c;
    }

    .status-shipped .status-dot {
      background: #1abc9c;
      box-shadow: 0 0 12px rgba(26, 188, 156, 0.5);
    }

    .status-delivered {
      background: rgba(39, 174, 96, 0.2);
      border: 1px solid rgba(39, 174, 96, 0.4);
      color: #27ae60;
    }

    .status-delivered .status-dot {
      background: #27ae60;
      box-shadow: 0 0 12px rgba(39, 174, 96, 0.5);
    }

    .status-cancelled {
      background: rgba(231, 76, 60, 0.2);
      border: 1px solid rgba(231, 76, 60, 0.4);
      color: #e74c3c;
    }

    .status-cancelled .status-dot {
      background: #e74c3c;
      box-shadow: 0 0 12px rgba(231, 76, 60, 0.5);
    }

    .order-total-badge {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 12px 20px;
      background: linear-gradient(135deg, rgba(0, 153, 255, 0.2), rgba(0, 212, 255, 0.1));
      border: 1px solid rgba(0, 212, 255, 0.3);
      border-radius: 12px;
      font-size: 24px;
      font-weight: 800;
      background: linear-gradient(135deg, #0099ff, #00d4ff);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .order-total-badge svg {
      width: 24px;
      height: 24px;
      stroke-width: 2;
      color: #00d4ff;
    }

    /* Content Grid */
    .content-grid {
      display: grid;
      grid-template-columns: 400px 1fr;
      gap: 24px;
    }

    /* Cards */
    .info-card,
    .items-card,
    .status-card {
      background: rgba(255, 255, 255, 0.05);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 20px;
      overflow: hidden;
      margin-bottom: 24px;
      animation: fadeIn 0.6s ease-out backwards;
    }

    .left-column .info-card:nth-child(1) { animation-delay: 0.2s; }
    .left-column .info-card:nth-child(2) { animation-delay: 0.25s; }
    .left-column .info-card:nth-child(3) { animation-delay: 0.3s; }
    .left-column .info-card:nth-child(4) { animation-delay: 0.35s; }
    .items-card { animation-delay: 0.2s; }
    .status-card { animation-delay: 0.3s; }

    .card-header {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 20px 24px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }

    .card-header svg {
      width: 20px;
      height: 20px;
      stroke-width: 2;
      color: #00d4ff;
    }

    .card-header h2 {
      font-size: 18px;
      font-weight: 700;
      color: white;
      margin: 0;
      flex: 1;
    }

    .items-count {
      background: rgba(0, 212, 255, 0.2);
      color: #00d4ff;
      padding: 4px 12px;
      border-radius: 8px;
      font-size: 12px;
      font-weight: 700;
    }

    .card-body {
      padding: 24px;
    }

    /* Info Rows */
    .info-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 14px 16px;
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.05);
      border-radius: 10px;
    }

    .info-label {
      display: flex;
      align-items: center;
      gap: 8px;
      color: rgba(255, 255, 255, 0.6);
      font-size: 14px;
      font-weight: 600;
    }

    .info-label svg {
      width: 16px;
      height: 16px;
      stroke-width: 2;
    }

    .info-value {
      color: white;
      font-weight: 600;
      font-size: 14px;
    }

    /* Client Profile */
    .client-profile {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .client-avatar {
      width: 56px;
      height: 56px;
      background: linear-gradient(135deg, #0099ff, #00d4ff);
      border-radius: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .client-avatar svg {
      width: 28px;
      height: 28px;
      stroke-width: 2;
      color: white;
    }

    .client-details h3 {
      font-size: 18px;
      font-weight: 700;
      color: white;
      margin: 0 0 6px 0;
    }

    .client-details p {
      color: rgba(255, 255, 255, 0.7);
      font-size: 14px;
      margin: 0;
    }

    /* Address */
    .address-content {
      display: flex;
      gap: 12px;
    }

    .address-content svg {
      width: 20px;
      height: 20px;
      stroke-width: 2;
      color: #00d4ff;
      flex-shrink: 0;
      margin-top: 2px;
    }

    .address-content p {
      color: rgba(255, 255, 255, 0.8);
      font-size: 14px;
      line-height: 1.6;
      margin: 0;
    }

    .notes-text {
      color: rgba(255, 255, 255, 0.8);
      font-size: 14px;
      line-height: 1.6;
      margin: 0;
    }

    /* Items List */
    .items-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
      margin-bottom: 20px;
    }

    .item-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px;
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.05);
      border-radius: 12px;
      transition: all 0.3s;
    }

    .item-row:hover {
      background: rgba(255, 255, 255, 0.05);
      border-color: rgba(0, 212, 255, 0.2);
    }

    .item-main {
      display: flex;
      align-items: center;
      gap: 14px;
      flex: 1;
    }

    .item-icon {
      width: 44px;
      height: 44px;
      background: rgba(0, 212, 255, 0.1);
      border: 1px solid rgba(0, 212, 255, 0.2);
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .item-icon svg {
      width: 20px;
      height: 20px;
      stroke-width: 2;
      color: #00d4ff;
    }

    .item-info h4 {
      font-size: 15px;
      font-weight: 700;
      color: white;
      margin: 0 0 8px 0;
    }

    .item-meta {
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
    }

    .meta-item {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 12px;
      color: rgba(255, 255, 255, 0.6);
      font-weight: 600;
    }

    .meta-item svg {
      width: 14px;
      height: 14px;
      stroke-width: 2;
    }

    .meta-item.discount {
      color: #27ae60;
    }

    .item-total {
      text-align: right;
    }

    .total-amount {
      font-size: 18px;
      font-weight: 800;
      background: linear-gradient(135deg, #0099ff, #00d4ff);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    /* Order Summary */
    .order-summary {
      padding-top: 20px;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
    }

    .summary-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 16px;
      background: rgba(255, 255, 255, 0.03);
      border-radius: 10px;
    }

    .summary-row.total {
      background: linear-gradient(135deg, rgba(0, 153, 255, 0.15), rgba(0, 212, 255, 0.1));
      border: 1px solid rgba(0, 212, 255, 0.3);
    }

    .summary-row span:first-child {
      color: rgba(255, 255, 255, 0.8);
      font-weight: 600;
      font-size: 15px;
    }

    .total-value {
      font-size: 28px;
      font-weight: 800;
      background: linear-gradient(135deg, #0099ff, #00d4ff);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    /* Status Buttons */
    .status-buttons {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 12px;
    }

    .status-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 12px 16px;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 10px;
      color: white;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s;
    }

    .status-btn:hover:not(:disabled) {
      background: rgba(0, 212, 255, 0.15);
      border-color: rgba(0, 212, 255, 0.4);
      transform: translateY(-2px);
    }

    .status-btn.active {
      background: rgba(0, 212, 255, 0.2);
      border-color: rgba(0, 212, 255, 0.4);
      color: #00d4ff;
    }

    .status-btn.danger {
      grid-column: 1 / -1;
      background: rgba(239, 68, 68, 0.1);
      border-color: rgba(239, 68, 68, 0.3);
      color: #ef4444;
    }

    .status-btn.danger:hover:not(:disabled) {
      background: rgba(239, 68, 68, 0.2);
      border-color: rgba(239, 68, 68, 0.4);
    }

    .status-btn:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }

    .status-btn svg {
      width: 16px;
      height: 16px;
      stroke-width: 2;
    }

    /* Responsive */
    @media (max-width: 1200px) {
      .content-grid {
        grid-template-columns: 1fr;
      }
    }

    @media (max-width: 768px) {
      .detail-container {
        padding: 20px;
      }

      .order-header-card {
        flex-direction: column;
        align-items: flex-start;
        gap: 20px;
      }

      .order-header-actions {
        width: 100%;
        flex-direction: column;
        align-items: stretch;
      }

      .status-buttons {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class OrderDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private orderService = inject(OrderService);
  authService = inject(AuthService);

  order: Order | null = null;

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.loadOrder(id);
    }
  }

  loadOrder(id: number): void {
    this.orderService.getOrderById(id).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.order = response.data;
        }
      },
      error: (error) => console.error('Error loading order:', error),
    });
  }

  updateStatus(status: string): void {
    if (this.order && confirm(`Update order status to ${status}?`)) {
      this.orderService.updateOrderStatus(this.order.id, status).subscribe({
        next: (response) => {
          if (response.success && response.data) {
            this.order = response.data;
            this.loadOrder(this.order.id);
          }
        },
        error: (error) => {
          console.error('Error updating order status:', error);
          alert('Failed to update order status');
        },
      });
    }
  }

  cancelOrder(): void {
    if (this.order && confirm('Are you sure you want to cancel this order?')) {
      this.orderService.cancelOrder(this.order.id).subscribe({
        next: (response) => {
          if (response.success && response.data) {
            this.order = response.data;
            this.loadOrder(this.order.id);
          }
        },
        error: (error) => {
          console.error('Error cancelling order:', error);
          alert('Failed to cancel order');
        },
      });
    }
  }
}
