import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink],
  template: `
    <div class="layout">
      <!-- Animated Background -->
      <div class="background-gradient">
        <div class="gradient-orb orb-1"></div>
        <div class="gradient-orb orb-2"></div>
        <div class="gradient-orb orb-3"></div>
        <div class="grid-overlay"></div>
      </div>

      <!-- Sidebar Navigation -->
      <aside class="sidebar" [class.collapsed]="isSidebarCollapsed">
        <div class="sidebar-container">
          <!-- Logo & Brand -->
          <div class="brand-section">
            <a routerLink="/dashboard" class="brand-link">
              <div class="brand-logo">
                <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <linearGradient id="brandGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" style="stop-color:#00d4ff;stop-opacity:1" />
                      <stop offset="100%" style="stop-color:#0099ff;stop-opacity:1" />
                    </linearGradient>
                  </defs>
                  <circle cx="50" cy="50" r="35" fill="url(#brandGradient)" opacity="0.2"/>
                  <path d="M 30 35 L 50 25 L 70 35 L 70 55 L 50 65 L 30 55 Z"
                        fill="none"
                        stroke="url(#brandGradient)"
                        stroke-width="3"
                        stroke-linejoin="round"/>
                  <circle cx="50" cy="45" r="8" fill="url(#brandGradient)"/>
                </svg>
              </div>
              <div class="brand-text" *ngIf="!isSidebarCollapsed">
                <h1>StoreFront</h1>
                <span>Management System</span>
              </div>
            </a>
            <button class="collapse-btn" (click)="toggleSidebar()">
              <svg *ngIf="!isSidebarCollapsed" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <polyline points="15 18 9 12 15 6"/>
              </svg>
              <svg *ngIf="isSidebarCollapsed" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </button>
          </div>

          <!-- Navigation Menu -->
          <nav class="nav-section">
            <div class="nav-group">
              <span class="nav-group-label" *ngIf="!isSidebarCollapsed">Main Menu</span>
              <ul class="nav-list">
                <li>
                  <a routerLink="/dashboard" routerLinkActive="active" class="nav-item">
                    <div class="nav-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <rect x="3" y="3" width="7" height="7"/>
                        <rect x="14" y="3" width="7" height="7"/>
                        <rect x="14" y="14" width="7" height="7"/>
                        <rect x="3" y="14" width="7" height="7"/>
                      </svg>
                    </div>
                    <span class="nav-text" *ngIf="!isSidebarCollapsed">Dashboard</span>
                    <div class="nav-indicator"></div>
                  </a>
                </li>
                <li>
                  <a routerLink="/products" routerLinkActive="active" class="nav-item">
                    <div class="nav-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                        <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
                        <line x1="12" y1="22.08" x2="12" y2="12"/>
                      </svg>
                    </div>
                    <span class="nav-text" *ngIf="!isSidebarCollapsed">Products</span>
                    <div class="nav-indicator"></div>
                  </a>
                </li>
                <!-- Orders Management for Admin and Advanced Users -->
                <li *ngIf="authService.hasRole(['admin', 'advanced_user'])">
                  <a routerLink="/orders" routerLinkActive="active" class="nav-item">
                    <div class="nav-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <circle cx="9" cy="21" r="1"/>
                        <circle cx="20" cy="21" r="1"/>
                        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                      </svg>
                    </div>
                    <span class="nav-text" *ngIf="!isSidebarCollapsed">Orders</span>
                    <div class="nav-indicator"></div>
                  </a>
                </li>
                <!-- Clients for Admin and Advanced Users only -->
                <li *ngIf="authService.hasRole(['admin', 'advanced_user'])">
                  <a routerLink="/clients" routerLinkActive="active" class="nav-item">
                    <div class="nav-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                        <circle cx="9" cy="7" r="4"/>
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                      </svg>
                    </div>
                    <span class="nav-text" *ngIf="!isSidebarCollapsed">Clients</span>
                    <div class="nav-indicator"></div>
                  </a>
                </li>
              </ul>
            </div>

            <div class="nav-group" *ngIf="authService.isAdmin || authService.hasRole(['admin', 'advanced_user'])">
              <span class="nav-group-label" *ngIf="!isSidebarCollapsed">Management</span>
              <ul class="nav-list">
                <li *ngIf="authService.isAdmin">
                  <a routerLink="/discounts" routerLinkActive="active" class="nav-item">
                    <div class="nav-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <line x1="12" y1="1" x2="12" y2="23"/>
                        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                      </svg>
                    </div>
                    <span class="nav-text" *ngIf="!isSidebarCollapsed">Discounts</span>
                    <div class="nav-indicator"></div>
                  </a>
                </li>
                <li *ngIf="authService.hasRole(['admin', 'advanced_user'])">
                  <a routerLink="/reports" routerLinkActive="active" class="nav-item">
                    <div class="nav-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
                        <polyline points="17 6 23 6 23 12"/>
                      </svg>
                    </div>
                    <span class="nav-text" *ngIf="!isSidebarCollapsed">Reports</span>
                    <div class="nav-indicator"></div>
                  </a>
                </li>
                <li *ngIf="authService.isAdmin">
                  <a routerLink="/users" routerLinkActive="active" class="nav-item">
                    <div class="nav-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                        <circle cx="12" cy="7" r="4"/>
                      </svg>
                    </div>
                    <span class="nav-text" *ngIf="!isSidebarCollapsed">Users</span>
                    <div class="nav-indicator"></div>
                  </a>
                </li>
                <li *ngIf="authService.isAdmin">
                  <a routerLink="/reference-data" routerLinkActive="active" class="nav-item">
                    <div class="nav-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <circle cx="12" cy="12" r="3"/>
                        <path d="M12 1v6m0 6v6M5.64 5.64l4.24 4.24m4.24 4.24l4.24 4.24M1 12h6m6 0h6M5.64 18.36l4.24-4.24m4.24-4.24l4.24-4.24"/>
                      </svg>
                    </div>
                    <span class="nav-text" *ngIf="!isSidebarCollapsed">Settings</span>
                    <div class="nav-indicator"></div>
                  </a>
                </li>
              </ul>
            </div>
          </nav>

          <!-- User Profile -->
          <div class="user-section">
            <div class="user-profile">
              <div class="user-avatar">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
              </div>
              <div class="user-info" *ngIf="!isSidebarCollapsed">
                <span class="user-name">{{ currentUser?.username }}</span>
                <span class="user-role">{{ currentUser?.role }}</span>
              </div>
              <button class="logout-icon-btn" (click)="logout()" *ngIf="!isSidebarCollapsed">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                  <polyline points="16 17 21 12 16 7"/>
                  <line x1="21" y1="12" x2="9" y2="12"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </aside>

      <!-- Main Content Area -->
      <div class="main-wrapper">
        <!-- Top Header -->
        <header class="main-header">
          <button class="mobile-menu-btn" (click)="toggleSidebar()">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <line x1="3" y1="12" x2="21" y2="12"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <line x1="3" y1="18" x2="21" y2="18"/>
            </svg>
          </button>

          <div class="header-actions">
            <button class="header-btn notification-btn">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
              </svg>
              <span class="notification-badge">3</span>
            </button>

            <button class="header-btn logout-btn" (click)="logout()">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                <polyline points="16 17 21 12 16 7"/>
                <line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
              <span>Logout</span>
            </button>
          </div>
        </header>

        <!-- Content -->
        <main class="main-content">
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>
  `,
  styles: [
    `
      @keyframes float {
        0%, 100% {
          transform: translate(0, 0) scale(1);
        }
        33% {
          transform: translate(30px, -30px) scale(1.1);
        }
        66% {
          transform: translate(-20px, 20px) scale(0.9);
        }
      }

      @keyframes slideIn {
        from {
          opacity: 0;
          transform: translateX(-20px);
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
          opacity: 0.5;
        }
      }

      .layout {
        display: flex;
        min-height: 100vh;
        position: relative;
        overflow: hidden;
      }

      /* Animated Background */
      .background-gradient {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%);
        z-index: 0;
      }

      .gradient-orb {
        position: absolute;
        border-radius: 50%;
        filter: blur(80px);
        opacity: 0.4;
        animation: float 20s ease-in-out infinite;
      }

      .orb-1 {
        width: 400px;
        height: 400px;
        background: radial-gradient(circle, #00d4ff 0%, transparent 70%);
        top: -200px;
        left: -200px;
        animation-delay: 0s;
      }

      .orb-2 {
        width: 500px;
        height: 500px;
        background: radial-gradient(circle, #0099ff 0%, transparent 70%);
        bottom: -250px;
        right: -250px;
        animation-delay: 7s;
      }

      .orb-3 {
        width: 350px;
        height: 350px;
        background: radial-gradient(circle, #00ffcc 0%, transparent 70%);
        top: 40%;
        right: 10%;
        animation-delay: 14s;
      }

      .grid-overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-image:
          linear-gradient(rgba(0, 212, 255, 0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0, 212, 255, 0.03) 1px, transparent 1px);
        background-size: 50px 50px;
        pointer-events: none;
      }

      /* Sidebar - FIXED */
      .sidebar {
        width: 280px;
        height: 100vh;
        background: rgba(15, 32, 39, 0.8);
        backdrop-filter: blur(20px);
        border-right: 1px solid rgba(0, 212, 255, 0.1);
        transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        position: fixed;
        left: 0;
        top: 0;
        z-index: 100;
        display: flex;
        flex-direction: column;
        overflow: hidden;
      }

      .sidebar.collapsed {
        width: 80px;
      }

      .sidebar-container {
        display: flex;
        flex-direction: column;
        height: 100%;
        overflow: hidden;
      }

      /* Brand Section */
      .brand-section {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 20px 20px 24px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        flex-shrink: 0;
      }

      .brand-link {
        display: flex;
        align-items: center;
        gap: 12px;
        text-decoration: none;
        flex: 1;
      }

      .brand-logo {
        width: 42px;
        height: 42px;
        flex-shrink: 0;
      }

      .brand-logo svg {
        width: 100%;
        height: 100%;
        filter: drop-shadow(0 0 8px rgba(0, 212, 255, 0.4));
      }

      .brand-text h1 {
        margin: 0;
        font-size: 18px;
        font-weight: 700;
        color: white;
        letter-spacing: -0.5px;
      }

      .brand-text span {
        font-size: 11px;
        color: rgba(255, 255, 255, 0.5);
        text-transform: uppercase;
        letter-spacing: 1px;
        font-weight: 600;
      }

      .collapse-btn {
        width: 32px;
        height: 32px;
        background: rgba(0, 212, 255, 0.1);
        border: 1px solid rgba(0, 212, 255, 0.2);
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.3s;
        flex-shrink: 0;
      }

      .collapse-btn:hover {
        background: rgba(0, 212, 255, 0.2);
        border-color: rgba(0, 212, 255, 0.4);
      }

      .collapse-btn svg {
        width: 16px;
        height: 16px;
        stroke-width: 2.5;
        color: #00d4ff;
      }

      /* Navigation - SCROLLABLE */
      .nav-section {
        flex: 1;
        overflow-y: auto;
        overflow-x: hidden;
        padding: 24px 12px;
        min-height: 0;
      }

      .nav-section::-webkit-scrollbar {
        width: 4px;
      }

      .nav-section::-webkit-scrollbar-thumb {
        background: rgba(0, 212, 255, 0.3);
        border-radius: 2px;
      }

      .nav-group {
        margin-bottom: 28px;
      }

      .nav-group-label {
        display: block;
        padding: 0 12px 12px;
        font-size: 11px;
        font-weight: 700;
        color: rgba(255, 255, 255, 0.4);
        text-transform: uppercase;
        letter-spacing: 1px;
      }

      .nav-list {
        list-style: none;
        padding: 0;
        margin: 0;
        display: flex;
        flex-direction: column;
        gap: 4px;
      }

      .nav-item {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 12px 14px;
        color: rgba(255, 255, 255, 0.7);
        text-decoration: none;
        border-radius: 12px;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        position: relative;
        overflow: hidden;
      }

      .nav-item::before {
        content: '';
        position: absolute;
        left: 0;
        top: 0;
        width: 3px;
        height: 100%;
        background: linear-gradient(135deg, #00d4ff, #0099ff);
        transform: scaleY(0);
        transition: transform 0.3s;
      }

      .nav-item:hover {
        background: rgba(0, 212, 255, 0.1);
        color: white;
      }

      .nav-item.active {
        background: rgba(0, 212, 255, 0.15);
        color: #00d4ff;
      }

      .nav-item.active::before {
        transform: scaleY(1);
      }

      .nav-icon {
        width: 20px;
        height: 20px;
        flex-shrink: 0;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .nav-icon svg {
        width: 100%;
        height: 100%;
        stroke-width: 2;
      }

      .nav-text {
        flex: 1;
        font-size: 14px;
        font-weight: 600;
        white-space: nowrap;
      }

      .nav-indicator {
        width: 6px;
        height: 6px;
        background: #00d4ff;
        border-radius: 50%;
        opacity: 0;
        transition: opacity 0.3s;
      }

      .nav-item.active .nav-indicator {
        opacity: 1;
        animation: pulse 2s infinite;
      }

      .sidebar.collapsed .nav-item {
        justify-content: center;
        padding: 12px;
      }

      .sidebar.collapsed .nav-icon {
        margin: 0;
      }

      /* User Section - STICKY AT BOTTOM */
      .user-section {
        padding: 20px 16px;
        border-top: 1px solid rgba(255, 255, 255, 0.1);
        background: rgba(15, 32, 39, 0.8);
        backdrop-filter: blur(20px);
        flex-shrink: 0;
      }

      .user-profile {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 12px;
        background: rgba(0, 212, 255, 0.08);
        border: 1px solid rgba(0, 212, 255, 0.2);
        border-radius: 12px;
      }

      .user-avatar {
        width: 40px;
        height: 40px;
        background: linear-gradient(135deg, #0099ff, #00d4ff);
        border-radius: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
      }

      .user-avatar svg {
        width: 20px;
        height: 20px;
        stroke-width: 2;
        color: white;
      }

      .user-info {
        flex: 1;
        min-width: 0;
      }

      .user-name {
        display: block;
        font-size: 14px;
        font-weight: 700;
        color: white;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .user-role {
        display: block;
        font-size: 11px;
        color: rgba(255, 255, 255, 0.5);
        text-transform: capitalize;
      }

      .logout-icon-btn {
        width: 32px;
        height: 32px;
        background: rgba(255, 255, 255, 0.1);
        border: 1px solid rgba(255, 255, 255, 0.2);
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.3s;
        flex-shrink: 0;
      }

      .logout-icon-btn:hover {
        background: rgba(239, 68, 68, 0.2);
        border-color: rgba(239, 68, 68, 0.4);
      }

      .logout-icon-btn svg {
        width: 16px;
        height: 16px;
        stroke-width: 2;
        color: white;
      }

      /* Main Wrapper - ADJUSTED FOR FIXED SIDEBAR */
      .main-wrapper {
        flex: 1;
        margin-left: 280px;
        display: flex;
        flex-direction: column;
        position: relative;
        z-index: 1;
        transition: margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      }

      .sidebar.collapsed + .main-wrapper {
        margin-left: 80px;
      }

      /* Main Header */
      .main-header {
        background: rgba(15, 32, 39, 0.6);
        backdrop-filter: blur(20px);
        border-bottom: 1px solid rgba(0, 212, 255, 0.1);
        padding: 16px 32px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        position: sticky;
        top: 0;
        z-index: 50;
      }

      .mobile-menu-btn {
        display: none;
        width: 40px;
        height: 40px;
        background: rgba(0, 212, 255, 0.1);
        border: 1px solid rgba(0, 212, 255, 0.2);
        border-radius: 10px;
        align-items: center;
        justify-content: center;
        cursor: pointer;
      }

      .mobile-menu-btn svg {
        width: 20px;
        height: 20px;
        stroke-width: 2;
        color: #00d4ff;
      }

      .header-actions {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-left: auto;
      }

      .header-btn {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 10px 16px;
        background: rgba(0, 212, 255, 0.1);
        border: 1px solid rgba(0, 212, 255, 0.2);
        border-radius: 10px;
        cursor: pointer;
        transition: all 0.3s;
        color: white;
        font-weight: 600;
        font-size: 14px;
        position: relative;
      }

      .header-btn:hover {
        background: rgba(0, 212, 255, 0.2);
        border-color: rgba(0, 212, 255, 0.4);
        transform: translateY(-2px);
      }

      .header-btn svg {
        width: 18px;
        height: 18px;
        stroke-width: 2;
      }

      .notification-btn {
        padding: 10px;
      }

      .notification-badge {
        position: absolute;
        top: -4px;
        right: -4px;
        background: linear-gradient(135deg, #ff4757, #ff6b81);
        color: white;
        font-size: 10px;
        font-weight: 700;
        padding: 2px 6px;
        border-radius: 10px;
        min-width: 18px;
        text-align: center;
      }

      .logout-btn {
        background: linear-gradient(135deg, #0099ff, #00d4ff);
        border-color: transparent;
      }

      .logout-btn:hover {
        box-shadow: 0 4px 16px rgba(0, 153, 255, 0.4);
      }

      /* Main Content */
      .main-content {
        flex: 1;
        overflow-y: auto;
      }

      .main-content::-webkit-scrollbar {
        width: 10px;
      }

      .main-content::-webkit-scrollbar-track {
        background: rgba(0, 0, 0, 0.2);
      }

      .main-content::-webkit-scrollbar-thumb {
        background: rgba(0, 212, 255, 0.3);
        border-radius: 5px;
      }

      /* Responsive */
      @media (max-width: 768px) {
        .sidebar {
          transform: translateX(0);
        }

        .sidebar.collapsed {
          transform: translateX(-100%);
          width: 280px;
        }

        .main-wrapper {
          margin-left: 0 !important;
        }

        .mobile-menu-btn {
          display: flex;
        }

        .main-header {
          padding: 16px 20px;
        }

        .logout-btn span {
          display: none;
        }
      }
    `,
  ],
})
export class LayoutComponent {
  authService = inject(AuthService);
  private router = inject(Router);

  isSidebarCollapsed = false;
  currentUser = this.authService.currentUserValue;

  toggleSidebar(): void {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

  logout(): void {
    this.authService.logout();
  }
}
