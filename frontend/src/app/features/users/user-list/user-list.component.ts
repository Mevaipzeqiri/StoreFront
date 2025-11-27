import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../core/services/user.service';
import { User, Role } from '../../../core/models/user.model';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="user-container">
      <!-- Page Header -->
      <div class="page-header">
        <div class="header-content">
          <h1>User Management</h1>
          <p class="subtitle">Manage system users and their permissions</p>
        </div>
        <button class="btn-add" (click)="openCreateForm()">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="16"/>
            <line x1="8" y1="12" x2="16" y2="12"/>
          </svg>
          <span class="btn-text">Add User</span>
        </button>
      </div>

      <!-- Results Info -->
      <div class="results-bar" *ngIf="!isLoading">
        <div class="results-info">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
            <circle cx="9" cy="7" r="4"/>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
          </svg>
          <span><strong>{{ pagination?.total || 0 }}</strong> users found</span>
        </div>
      </div>

      <!-- Users Grid -->
      <div class="users-grid" *ngIf="!isLoading">
        <div class="user-card" *ngFor="let user of users">
          <div class="user-header">
            <div class="user-avatar">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
            </div>
            <div class="user-info">
              <h3 class="user-name">{{ user.username }}</h3>
              <div class="user-email">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
                <span>{{ user.email }}</span>
              </div>
            </div>
            <div class="status-indicator" [class.active]="user.is_active">
              <span class="status-dot"></span>
              <span class="status-text">{{ user.is_active ? 'Active' : 'Inactive' }}</span>
            </div>
          </div>

          <div class="user-body">
            <div class="user-meta">
              <div class="meta-item">
                <div class="role-badge" [ngClass]="getRoleClass(user.role)">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                  </svg>
                  <span>{{ user.role }}</span>
                </div>
              </div>
              <div class="meta-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="12 6 12 12 16 14"/>
                </svg>
                <div class="meta-content">
                  <span class="meta-label">Created</span>
                  <span class="meta-value">{{ user.created_at | date : 'MMM d, y' }}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="user-actions">
            <button class="action-btn edit" (click)="openEditForm(user)">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
              <span>Edit</span>
            </button>
            <button class="action-btn reset" (click)="openResetPasswordForm(user.id)">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
              <span>Reset</span>
            </button>
            <button
              class="action-btn toggle"
              [class.activate]="!user.is_active"
              (click)="toggleUserStatus(user.id)"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" *ngIf="user.is_active">
                <circle cx="12" cy="12" r="10"/>
                <line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/>
              </svg>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" *ngIf="!user.is_active">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              <span>{{ user.is_active ? 'Deactivate' : 'Activate' }}</span>
            </button>
            <button class="action-btn delete" (click)="deleteUser(user.id)">
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
        <p>Loading users...</p>
      </div>

      <!-- Empty State -->
      <div class="empty-state" *ngIf="!isLoading && users.length === 0">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="8" x2="12" y2="12"/>
          <line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
        <h3>No Users Found</h3>
        <p>Start by creating your first user</p>
        <button class="btn-primary" (click)="openCreateForm()">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="16"/>
            <line x1="8" y1="12" x2="16" y2="12"/>
          </svg>
          Create Your First User
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

    <!-- Form Panel Overlay -->
    <div class="form-overlay" *ngIf="showCreateForm || showEditForm || showResetPasswordForm" (click)="closeAllForms()"></div>

    <!-- Create/Edit User Form Panel -->
    <div class="form-panel" [class.open]="showCreateForm || showEditForm">
      <div class="form-panel-header">
        <div class="panel-title">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
          </svg>
          <h2>{{ showCreateForm ? 'Create New User' : 'Edit User' }}</h2>
        </div>
        <button class="close-btn" (click)="closeAllForms()">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>

      <div class="form-panel-body">
        <!-- Account Information -->
        <div class="form-section">
          <div class="section-header">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
            <h3>Account Information</h3>
          </div>

          <div class="form-field">
            <label for="username">
              Username *
              <span class="required-indicator"></span>
            </label>
            <input
              type="text"
              id="username"
              [(ngModel)]="formData.username"
              placeholder="Enter username"
            />
          </div>

          <div class="form-field">
            <label for="email">
              Email *
              <span class="required-indicator"></span>
            </label>
            <input
              type="email"
              id="email"
              [(ngModel)]="formData.email"
              placeholder="user@example.com"
            />
          </div>

          <div class="form-field" *ngIf="showCreateForm">
            <label for="password">
              Password *
              <span class="required-indicator"></span>
            </label>
            <input
              type="password"
              id="password"
              [(ngModel)]="formData.password"
              placeholder="Enter password"
            />
          </div>
        </div>

        <!-- Role & Permissions -->
        <div class="form-section">
          <div class="section-header">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
            <h3>Role & Permissions</h3>
          </div>

          <div class="form-field">
            <label for="role">
              User Role *
              <span class="required-indicator"></span>
            </label>
            <select id="role" [(ngModel)]="formData.role">
              <option value="">Select a role...</option>
              <option *ngFor="let role of roles" [value]="role.name">
                {{ role.name }}
              </option>
            </select>
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
        <button class="btn-apply" (click)="showCreateForm ? createUser() : updateUser()" [disabled]="isLoading">
          <span *ngIf="!isLoading">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            {{ showCreateForm ? 'Create User' : 'Update User' }}
          </span>
          <span *ngIf="isLoading" class="loading-content">
            <span class="spinner-small"></span>
            {{ showCreateForm ? 'Creating...' : 'Updating...' }}
          </span>
        </button>
        <button class="btn-reset" (click)="closeAllForms()">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
          Cancel
        </button>
      </div>
    </div>

    <!-- Reset Password Form Panel -->
    <div class="form-panel" [class.open]="showResetPasswordForm">
      <div class="form-panel-header">
        <div class="panel-title">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
          </svg>
          <h2>Reset Password</h2>
        </div>
        <button class="close-btn" (click)="closeAllForms()">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>

      <div class="form-panel-body">
        <div class="form-section">
          <div class="section-header">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
            <h3>New Password</h3>
          </div>

          <div class="form-field">
            <label for="new_password">
              Password *
              <span class="required-indicator"></span>
            </label>
            <input
              type="password"
              id="new_password"
              [(ngModel)]="newPassword"
              placeholder="Enter new password"
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
        <button class="btn-apply" (click)="resetPassword()" [disabled]="isLoading">
          <span *ngIf="!isLoading">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            Reset Password
          </span>
          <span *ngIf="isLoading" class="loading-content">
            <span class="spinner-small"></span>
            Resetting...
          </span>
        </button>
        <button class="btn-reset" (click)="closeAllForms()">
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

    .user-container {
      padding: 32px 40px;
      max-width: 1800px;
      margin: 0 auto;
      animation: fadeIn 0.6s ease-out;
    }

    /* Page Header */
    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
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

    /* Users Grid */
    .users-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
      gap: 24px;
      animation: fadeIn 0.6s ease-out 0.2s backwards;
    }

    .user-card {
      background: rgba(255, 255, 255, 0.05);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 16px;
      overflow: hidden;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      display: flex;
      flex-direction: column;
    }

    .user-card:hover {
      transform: translateY(-8px);
      border-color: rgba(0, 212, 255, 0.3);
      box-shadow: 0 12px 40px rgba(0, 153, 255, 0.2);
    }

    .user-header {
      padding: 24px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      display: flex;
      align-items: flex-start;
      gap: 16px;
    }

    .user-avatar {
      width: 56px;
      height: 56px;
      background: linear-gradient(135deg, rgba(0, 153, 255, 0.3), rgba(0, 212, 255, 0.2));
      border: 2px solid rgba(0, 212, 255, 0.3);
      border-radius: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .user-avatar svg {
      width: 28px;
      height: 28px;
      stroke-width: 2;
      color: #00d4ff;
    }

    .user-info {
      flex: 1;
      min-width: 0;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .user-name {
      font-size: 18px;
      font-weight: 700;
      color: white;
      margin: 0;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .user-email {
      display: flex;
      align-items: center;
      gap: 6px;
      color: rgba(255, 255, 255, 0.6);
      font-size: 13px;
    }

    .user-email svg {
      width: 14px;
      height: 14px;
      stroke-width: 2;
      flex-shrink: 0;
    }

    .user-email span {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .status-indicator {
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
      flex-shrink: 0;
    }

    .status-indicator.active {
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

    .status-indicator.active .status-dot {
      background: #27ae60;
      box-shadow: 0 0 12px rgba(39, 174, 96, 0.5);
      animation: pulse 2s infinite;
    }

    .user-body {
      padding: 20px 24px;
    }

    .user-meta {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .meta-item {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .role-badge {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 16px;
      border-radius: 10px;
      font-size: 12px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      flex: 1;
    }

    .role-badge svg {
      width: 16px;
      height: 16px;
      stroke-width: 2;
    }

    .role-admin {
      background: rgba(231, 76, 60, 0.2);
      border: 1px solid rgba(231, 76, 60, 0.3);
      color: #e74c3c;
    }

    .role-advanced_user {
      background: rgba(52, 152, 219, 0.2);
      border: 1px solid rgba(52, 152, 219, 0.3);
      color: #3498db;
    }

    .role-simple_user {
      background: rgba(149, 165, 166, 0.2);
      border: 1px solid rgba(149, 165, 166, 0.3);
      color: #95a5a6;
    }

    .meta-item > svg {
      width: 18px;
      height: 18px;
      stroke-width: 2;
      color: rgba(255, 255, 255, 0.5);
      flex-shrink: 0;
    }

    .meta-content {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .meta-label {
      font-size: 11px;
      color: rgba(255, 255, 255, 0.5);
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .meta-value {
      font-size: 13px;
      color: white;
      font-weight: 600;
    }

    .user-actions {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 8px;
      padding: 12px 16px;
      background: rgba(0, 0, 0, 0.2);
      border-top: 1px solid rgba(255, 255, 255, 0.1);
    }

    .action-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      padding: 10px 12px;
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 8px;
      color: white;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s;
    }

    .action-btn svg {
      width: 14px;
      height: 14px;
      stroke-width: 2;
    }

    .action-btn.edit:hover {
      background: rgba(243, 156, 18, 0.2);
      border-color: rgba(243, 156, 18, 0.4);
      transform: translateY(-2px);
    }

    .action-btn.reset:hover {
      background: rgba(52, 152, 219, 0.2);
      border-color: rgba(52, 152, 219, 0.4);
      transform: translateY(-2px);
    }

    .action-btn.toggle:hover {
      background: rgba(149, 165, 166, 0.2);
      border-color: rgba(149, 165, 166, 0.4);
      transform: translateY(-2px);
    }

    .action-btn.toggle.activate:hover {
      background: rgba(39, 174, 96, 0.2);
      border-color: rgba(39, 174, 96, 0.4);
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
      .users-grid {
        grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      }
    }

    @media (max-width: 768px) {
      .user-container {
        padding: 20px;
      }

      .page-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 16px;
      }

      .header-content h1 {
        font-size: 28px;
      }

      .btn-add {
        width: 100%;
        justify-content: center;
      }

      .users-grid {
        grid-template-columns: 1fr;
      }

      .user-header {
        flex-wrap: wrap;
      }

      .status-indicator {
        width: 100%;
        justify-content: center;
      }

      .user-actions {
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

      .form-panel {
        width: 100%;
        max-width: 500px;
      }
    }
  `]
})
export class UserListComponent implements OnInit {
  private userService = inject(UserService);

  users: User[] = [];
  roles: Role[] = [];
  isLoading = false;
  showCreateForm = false;
  showEditForm = false;
  showResetPasswordForm = false;
  pagination: any = null;
  currentPage = 1;
  limit = 20;
  errorMessage = '';
  resetPasswordUserId: number | null = null;
  newPassword = '';

  formData: {
    id: number;
    username: string;
    email: string;
    password: string;
    role: 'admin' | 'advanced_user' | 'simple_user' | '';
  } = {
    id: 0,
    username: '',
    email: '',
    password: '',
    role: '',
  };

  ngOnInit(): void {
    this.loadUsers();
    this.loadRoles();
  }

  loadUsers(): void {
    this.isLoading = true;
    this.userService.getAllUsers(this.currentPage, this.limit).subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.success) {
          this.users = response.data || [];
          this.pagination = response.pagination;
        }
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Error loading users:', error);
      },
    });
  }

  loadRoles(): void {
    this.userService.getAllRoles().subscribe({
      next: (response) => {
        if (response.success) {
          this.roles = response.data || [];
        }
      },
    });
  }

  getRoleClass(role: string): string {
    return `role-${role}`;
  }

  openCreateForm(): void {
    this.formData = {
      id: 0,
      username: '',
      email: '',
      password: '',
      role: '',
    };
    this.errorMessage = '';
    this.showCreateForm = true;
    this.showEditForm = false;
    this.showResetPasswordForm = false;
  }

  openEditForm(user: User): void {
    this.formData = {
      id: user.id,
      username: user.username,
      email: user.email,
      password: '',
      role: user.role as 'admin' | 'advanced_user' | 'simple_user',
    };
    this.errorMessage = '';
    this.showCreateForm = false;
    this.showEditForm = true;
    this.showResetPasswordForm = false;
  }

  openResetPasswordForm(userId: number): void {
    this.resetPasswordUserId = userId;
    this.newPassword = '';
    this.errorMessage = '';
    this.showCreateForm = false;
    this.showEditForm = false;
    this.showResetPasswordForm = true;
  }

  closeAllForms(): void {
    this.showCreateForm = false;
    this.showEditForm = false;
    this.showResetPasswordForm = false;
    this.errorMessage = '';
    this.newPassword = '';
    this.resetPasswordUserId = null;
  }

  createUser(): void {
    this.errorMessage = '';

    if (!this.formData.username || !this.formData.email || !this.formData.password || !this.formData.role) {
      this.errorMessage = 'Please fill in all required fields';
      return;
    }

    this.isLoading = true;

    const createData: any = {
      username: this.formData.username,
      email: this.formData.email,
      password: this.formData.password,
      role: this.formData.role,
    };

    this.userService.createUser(createData).subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.success) {
          this.closeAllForms();
          this.loadUsers();
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.error?.message || 'Failed to create user';
      },
    });
  }

  updateUser(): void {
    this.errorMessage = '';
    this.isLoading = true;

    const updateData: any = {
      username: this.formData.username,
      email: this.formData.email,
      role: this.formData.role || undefined,
    };

    this.userService.updateUser(this.formData.id, updateData).subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.success) {
          this.closeAllForms();
          this.loadUsers();
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.error?.message || 'Failed to update user';
      },
    });
  }

  resetPassword(): void {
    if (!this.resetPasswordUserId || !this.newPassword) {
      this.errorMessage = 'Password is required';
      return;
    }

    this.errorMessage = '';
    this.isLoading = true;

    this.userService.resetUserPassword(this.resetPasswordUserId, this.newPassword).subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.success) {
          this.closeAllForms();
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.error?.message || 'Failed to reset password';
      },
    });
  }

  toggleUserStatus(userId: number): void {
    this.userService.toggleUserStatus(userId).subscribe({
      next: (response) => {
        if (response.success) {
          this.loadUsers();
        }
      },
      error: (error) => {
        console.error('Error toggling user status:', error);
        alert(error.error?.message || 'Failed to toggle user status');
      },
    });
  }

  deleteUser(userId: number): void {
    if (confirm('Are you sure you want to delete this user?')) {
      this.userService.deleteUser(userId).subscribe({
        next: (response) => {
          if (response.success) {
            this.loadUsers();
          }
        },
        error: (error) => {
          console.error('Error deleting user:', error);
          alert(error.error?.message || 'Failed to delete user');
        },
      });
    }
  }

  goToPage(page: number): void {
    this.currentPage = page;
    this.loadUsers();
  }
}
