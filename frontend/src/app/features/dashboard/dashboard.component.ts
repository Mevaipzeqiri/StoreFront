import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ReportService } from '../../core/services/report.service';
import { AuthService } from '../../core/services/auth.service';
import { RevenueSummary } from '../../core/models/report.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="dashboard">
      <!-- Welcome Section -->
      <div class="welcome-banner">
        <div class="welcome-content">
          <div class="welcome-text">
            <h1>Welcome Back, {{ authService.currentUserValue?.username }}! 👋</h1>
            <p>Here's what's happening with your store today</p>
          </div>
          <div class="welcome-time">
            <div class="time-card">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
              </svg>
              <span>{{ currentTime }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Revenue Stats Grid -->
      <div class="stats-grid" *ngIf="revenueSummary">
        <div class="stat-card featured">
          <div class="stat-header">
            <div class="stat-icon-wrapper primary">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <line x1="12" y1="1" x2="12" y2="23"/>
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
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
            <div class="trend-indicator positive">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
                <polyline points="17 6 23 6 23 12"/>
              </svg>
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

      <!-- Main Content Grid -->
      <div class="content-layout">
        <!-- Quick Actions -->
        <div class="panel actions-panel">
          <div class="panel-header">
            <h2>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
              </svg>
              Quick Actions
            </h2>
            <span class="panel-count">{{ getActionsCount() }}</span>
          </div>
          <div class="panel-body">
            <div class="actions-grid">
              <a routerLink="/products/create" class="action-card">
                <div class="action-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                  </svg>
                </div>
                <div class="action-content">
                  <h3>Add Product</h3>
                  <p>Create new item</p>
                </div>
                <div class="action-arrow">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <line x1="5" y1="12" x2="19" y2="12"/>
                    <polyline points="12 5 19 12 12 19"/>
                  </svg>
                </div>
              </a>

              <a
                routerLink="/orders/create"
                class="action-card"
                *ngIf="authService.hasRole(['admin', 'advanced_user'])"
              >
                <div class="action-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <circle cx="9" cy="21" r="1"/>
                    <circle cx="20" cy="21" r="1"/>
                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                  </svg>
                </div>
                <div class="action-content">
                  <h3>New Order</h3>
                  <p>Process transaction</p>
                </div>
                <div class="action-arrow">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <line x1="5" y1="12" x2="19" y2="12"/>
                    <polyline points="12 5 19 12 12 19"/>
                  </svg>
                </div>
              </a>

              <a
                routerLink="/clients/create"
                class="action-card"
                *ngIf="authService.hasRole(['admin', 'advanced_user'])"
              >
                <div class="action-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                    <circle cx="8.5" cy="7" r="4"/>
                    <line x1="20" y1="8" x2="20" y2="14"/>
                    <line x1="23" y1="11" x2="17" y2="11"/>
                  </svg>
                </div>
                <div class="action-content">
                  <h3>Add Client</h3>
                  <p>Register customer</p>
                </div>
                <div class="action-arrow">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <line x1="5" y1="12" x2="19" y2="12"/>
                    <polyline points="12 5 19 12 12 19"/>
                  </svg>
                </div>
              </a>

              <a
                routerLink="/reports"
                class="action-card"
                *ngIf="authService.hasRole(['admin', 'advanced_user'])"
              >
                <div class="action-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <line x1="18" y1="20" x2="18" y2="10"/>
                    <line x1="12" y1="20" x2="12" y2="4"/>
                    <line x1="6" y1="20" x2="6" y2="14"/>
                  </svg>
                </div>
                <div class="action-content">
                  <h3>Reports</h3>
                  <p>View analytics</p>
                </div>
                <div class="action-arrow">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <line x1="5" y1="12" x2="19" y2="12"/>
                    <polyline points="12 5 19 12 12 19"/>
                  </svg>
                </div>
              </a>
            </div>
          </div>
        </div>

        <!-- Order Status -->
        <div class="panel status-panel" *ngIf="revenueSummary">
          <div class="panel-header">
            <h2>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
              </svg>
              Order Status
            </h2>
            <span class="panel-count">{{ getTotalOrders() }}</span>
          </div>
          <div class="panel-body">
            <div class="status-list">
              <div class="status-item" *ngFor="let status of revenueSummary.order_status_breakdown">
                <div class="status-info">
                  <div class="status-indicator"></div>
                  <span class="status-name">{{ status.status }}</span>
                </div>
                <div class="status-count">
                  <span class="count-number">{{ status.count }}</span>
                  <div class="count-bar">
                    <div
                      class="count-bar-fill"
                      [style.width.%]="(status.count / getTotalOrders()) * 100"
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      @keyframes fadeInUp {
        from {
          opacity: 0;
          transform: translateY(30px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      @keyframes slideInRight {
        from {
          opacity: 0;
          transform: translateX(30px);
        }
        to {
          opacity: 1;
          transform: translateX(0);
        }
      }

      @keyframes pulse {
        0%, 100% {
          opacity: 1;
        }
        50% {
          opacity: 0.6;
        }
      }

      @keyframes fillBar {
        from {
          width: 0;
        }
      }

      .dashboard {
        padding: 32px 40px;
        max-width: 1800px;
        margin: 0 auto;
      }

      /* Welcome Banner */
      .welcome-banner {
        background: linear-gradient(135deg, rgba(0, 153, 255, 0.1), rgba(0, 212, 255, 0.05));
        border: 1px solid rgba(0, 212, 255, 0.2);
        border-radius: 20px;
        padding: 32px;
        margin-bottom: 32px;
        animation: fadeInUp 0.5s ease-out;
      }

      .welcome-content {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 24px;
      }

      .welcome-text h1 {
        font-size: 32px;
        font-weight: 700;
        color: white;
        margin: 0 0 8px 0;
        letter-spacing: -0.5px;
      }

      .welcome-text p {
        color: rgba(255, 255, 255, 0.7);
        font-size: 16px;
        margin: 0;
      }

      .time-card {
        display: flex;
        align-items: center;
        gap: 12px;
        background: rgba(255, 255, 255, 0.1);
        backdrop-filter: blur(10px);
        padding: 12px 20px;
        border-radius: 12px;
        border: 1px solid rgba(255, 255, 255, 0.2);
      }

      .time-card svg {
        width: 20px;
        height: 20px;
        stroke-width: 2;
        color: #00d4ff;
      }

      .time-card span {
        color: white;
        font-weight: 600;
        font-size: 15px;
      }

      /* Stats Grid */
      .stats-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: 24px;
        margin-bottom: 32px;
      }

      .stat-card {
        background: rgba(255, 255, 255, 0.05);
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 20px;
        padding: 24px;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        animation: fadeInUp 0.6s ease-out backwards;
      }

      .stat-card:nth-child(1) { animation-delay: 0.1s; }
      .stat-card:nth-child(2) { animation-delay: 0.15s; }
      .stat-card:nth-child(3) { animation-delay: 0.2s; }
      .stat-card:nth-child(4) { animation-delay: 0.25s; }

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
        transition: all 0.3s;
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
        font-size: 36px;
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
        display: flex;
        justify-content: space-between;
        align-items: center;
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

      .trend-indicator {
        width: 32px;
        height: 32px;
        background: rgba(0, 212, 255, 0.2);
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .trend-indicator svg {
        width: 18px;
        height: 18px;
        stroke-width: 2;
        color: #00d4ff;
      }

      /* Content Layout */
      .content-layout {
        display: grid;
        grid-template-columns: 1fr 400px;
        gap: 24px;
      }

      /* Panel Styles */
      .panel {
        background: rgba(255, 255, 255, 0.05);
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 20px;
        overflow: hidden;
        animation: fadeInUp 0.6s ease-out backwards;
      }

      .actions-panel {
        animation-delay: 0.3s;
      }

      .status-panel {
        animation-delay: 0.35s;
      }

      .panel-header {
        padding: 24px 28px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .panel-header h2 {
        display: flex;
        align-items: center;
        gap: 12px;
        color: white;
        font-size: 20px;
        font-weight: 700;
        margin: 0;
      }

      .panel-header svg {
        width: 22px;
        height: 22px;
        stroke-width: 2;
        color: #00d4ff;
      }

      .panel-count {
        background: rgba(0, 212, 255, 0.2);
        color: #00d4ff;
        padding: 6px 14px;
        border-radius: 8px;
        font-size: 13px;
        font-weight: 700;
      }

      .panel-body {
        padding: 24px 28px;
      }

      /* Actions Grid */
      .actions-grid {
        display: grid;
        gap: 16px;
      }

      .action-card {
        display: flex;
        align-items: center;
        gap: 16px;
        padding: 20px;
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 14px;
        text-decoration: none;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        position: relative;
        overflow: hidden;
      }

      .action-card::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 4px;
        height: 100%;
        background: linear-gradient(135deg, #0099ff, #00d4ff);
        transform: scaleY(0);
        transition: transform 0.3s;
      }

      .action-card:hover {
        background: rgba(255, 255, 255, 0.08);
        border-color: rgba(0, 212, 255, 0.4);
        transform: translateX(8px);
      }

      .action-card:hover::before {
        transform: scaleY(1);
      }

      .action-icon {
        width: 48px;
        height: 48px;
        background: rgba(0, 153, 255, 0.2);
        border: 1px solid rgba(0, 212, 255, 0.3);
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        transition: all 0.3s;
      }

      .action-card:hover .action-icon {
        background: linear-gradient(135deg, #0099ff, #00d4ff);
        border-color: transparent;
        transform: rotate(5deg) scale(1.1);
      }

      .action-icon svg {
        width: 22px;
        height: 22px;
        stroke-width: 2;
        color: #00d4ff;
        transition: color 0.3s;
      }

      .action-card:hover .action-icon svg {
        color: white;
      }

      .action-content {
        flex: 1;
      }

      .action-content h3 {
        color: white;
        font-size: 16px;
        font-weight: 700;
        margin: 0 0 4px 0;
      }

      .action-content p {
        color: rgba(255, 255, 255, 0.6);
        font-size: 13px;
        margin: 0;
      }

      .action-arrow {
        width: 20px;
        height: 20px;
        flex-shrink: 0;
        opacity: 0.5;
        transition: all 0.3s;
      }

      .action-arrow svg {
        width: 100%;
        height: 100%;
        stroke-width: 2;
        color: #00d4ff;
      }

      .action-card:hover .action-arrow {
        opacity: 1;
        transform: translateX(4px);
      }

      /* Status List */
      .status-list {
        display: flex;
        flex-direction: column;
        gap: 16px;
      }

      .status-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 16px;
        padding: 16px;
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 12px;
        transition: all 0.3s;
      }

      .status-item:hover {
        background: rgba(255, 255, 255, 0.08);
        border-color: rgba(0, 212, 255, 0.3);
      }

      .status-info {
        display: flex;
        align-items: center;
        gap: 12px;
        flex: 1;
      }

      .status-indicator {
        width: 12px;
        height: 12px;
        background: linear-gradient(135deg, #0099ff, #00d4ff);
        border-radius: 50%;
        flex-shrink: 0;
        box-shadow: 0 0 12px rgba(0, 212, 255, 0.5);
        animation: pulse 2s infinite;
      }

      .status-name {
        color: white;
        font-size: 15px;
        font-weight: 600;
        text-transform: capitalize;
      }

      .status-count {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        gap: 6px;
        min-width: 60px;
      }

      .count-number {
        color: #00d4ff;
        font-size: 18px;
        font-weight: 800;
      }

      .count-bar {
        width: 60px;
        height: 4px;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 2px;
        overflow: hidden;
      }

      .count-bar-fill {
        height: 100%;
        background: linear-gradient(90deg, #0099ff, #00d4ff);
        border-radius: 2px;
        animation: fillBar 1s ease-out;
      }

      /* Responsive */
      @media (max-width: 1200px) {
        .content-layout {
          grid-template-columns: 1fr;
        }
      }

      @media (max-width: 768px) {
        .dashboard {
          padding: 20px;
        }

        .welcome-content {
          flex-direction: column;
          align-items: flex-start;
        }

        .welcome-text h1 {
          font-size: 24px;
        }

        .stats-grid {
          grid-template-columns: 1fr;
        }

        .stat-value {
          font-size: 28px;
        }
      }
    `,
  ],
})
export class DashboardComponent implements OnInit {
  private reportService = inject(ReportService);
  authService = inject(AuthService);

  revenueSummary: RevenueSummary | null = null;
  currentTime = '';

  ngOnInit(): void {
    this.loadRevenueSummary();
    this.updateTime();
    setInterval(() => this.updateTime(), 60000);
  }

  updateTime(): void {
    const now = new Date();
    this.currentTime = now.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  loadRevenueSummary(): void {
    if (this.authService.hasRole(['admin', 'advanced_user'])) {
      this.reportService.getRevenueSummary().subscribe({
        next: (response) => {
          if (response.success && response.data) {
            this.revenueSummary = response.data;
          }
        },
        error: (error) => console.error('Error loading revenue summary:', error),
      });
    }
  }

  getTotalOrders(): number {
    if (!this.revenueSummary?.order_status_breakdown) return 0;
    return this.revenueSummary.order_status_breakdown.reduce(
      (sum, status) => sum + status.count,
      0
    );
  }

  getActionsCount(): number {
    let count = 1; // Base action (Add Product) - available to all users
    if (this.authService.hasRole(['admin', 'advanced_user'])) {
      count += 3; // New Order, Add Client, Reports
    }
    return count;
  }
}
