import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ClientService } from '../../../core/services/client.service';
import { Client } from '../../../core/models/client.model';

@Component({
  selector: 'app-client-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="client-list-container">
      <!-- Top Bar -->
      <div class="top-bar">
        <div class="search-section">
          <div class="search-box">
            <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="11" cy="11" r="8"/>
              <path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              type="text"
              placeholder="Search clients by name, email, or phone..."
              [(ngModel)]="searchTerm"
              (keyup.enter)="onSearch()"
            />
            <button class="search-btn" (click)="onSearch()" *ngIf="searchTerm">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </button>
          </div>
        </div>

        <div class="top-bar-actions">
          <a routerLink="/clients/create" class="btn-add">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="16"/>
              <line x1="8" y1="12" x2="16" y2="12"/>
            </svg>
            <span class="btn-text">Add Client</span>
          </a>
        </div>
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
          <span><strong>{{ pagination?.total || 0 }}</strong> clients found</span>
        </div>
      </div>

      <!-- Clients Grid -->
      <div class="clients-grid" *ngIf="!isLoading">
        <div class="client-card" *ngFor="let client of clients">
          <div class="client-info-section">
            <div class="client-avatar">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
            </div>

            <div class="client-content">
              <h3 class="client-name">{{ client.first_name }} {{ client.last_name }}</h3>

              <div class="client-info">
                <div class="info-item">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                  </svg>
                  <span>{{ client.email }}</span>
                </div>

                <div class="info-item" *ngIf="client.phone">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                  </svg>
                  <span>{{ client.phone }}</span>
                </div>

                <div class="info-item" *ngIf="client.city || client.country">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                    <circle cx="12" cy="10" r="3"/>
                  </svg>
                  <span>{{ client.city }}{{ client.city && client.country ? ', ' : '' }}{{ client.country }}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="client-actions">
            <a [routerLink]="['/clients', client.id, 'edit']" class="action-btn edit">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
              <span>Edit</span>
            </a>
            <button class="action-btn delete" (click)="deleteClient(client.id)">
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
        <p>Loading clients...</p>
      </div>

      <!-- Empty State -->
      <div class="empty-state" *ngIf="!isLoading && clients.length === 0">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="8" x2="12" y2="12"/>
          <line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
        <h3>No Clients Found</h3>
        <p>{{ searchTerm ? 'Try adjusting your search criteria' : 'Start by adding your first client' }}</p>
        <a routerLink="/clients/create" class="btn-primary" *ngIf="!searchTerm">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="16"/>
            <line x1="8" y1="12" x2="16" y2="12"/>
          </svg>
          Add Your First Client
        </a>
        <button class="btn-primary" (click)="clearSearch()" *ngIf="searchTerm">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <polyline points="1 4 1 10 7 10"/>
            <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/>
          </svg>
          Clear Search
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
  `,
  styles: [`
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .client-list-container {
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

    .search-section {
      flex: 1;
      max-width: 600px;
    }

    .search-box {
      position: relative;
      display: flex;
      align-items: center;
    }

    .search-icon {
      position: absolute;
      left: 16px;
      width: 20px;
      height: 20px;
      stroke-width: 2;
      color: rgba(255, 255, 255, 0.5);
      pointer-events: none;
      z-index: 1;
    }

    .search-box input {
      width: 100%;
      padding: 14px 50px 14px 48px;
      background: rgba(255, 255, 255, 0.05);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 12px;
      color: white;
      font-size: 15px;
      transition: all 0.3s;
    }

    .search-box input::placeholder {
      color: rgba(255, 255, 255, 0.4);
    }

    .search-box input:focus {
      outline: none;
      background: rgba(255, 255, 255, 0.08);
      border-color: rgba(0, 212, 255, 0.4);
      box-shadow: 0 0 0 3px rgba(0, 212, 255, 0.1);
    }

    .search-btn {
      position: absolute;
      right: 8px;
      width: 36px;
      height: 36px;
      background: linear-gradient(135deg, #0099ff, #00d4ff);
      border: none;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.3s;
    }

    .search-btn:hover {
      transform: scale(1.05);
      box-shadow: 0 4px 12px rgba(0, 153, 255, 0.4);
    }

    .search-btn svg {
      width: 16px;
      height: 16px;
      stroke-width: 2.5;
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
      text-decoration: none;
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

    /* Clients Grid */
    .clients-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
      gap: 24px;
      animation: fadeIn 0.6s ease-out 0.2s backwards;
    }

    .client-card {
      background: rgba(255, 255, 255, 0.05);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 16px;
      overflow: hidden;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      display: flex;
      flex-direction: column;
    }

    .client-card:hover {
      transform: translateY(-8px);
      border-color: rgba(0, 212, 255, 0.3);
      box-shadow: 0 12px 40px rgba(0, 153, 255, 0.2);
    }

    .client-info-section {
      padding: 24px;
      flex: 1;
      display: flex;
      gap: 20px;
    }

    .client-avatar {
      width: 64px;
      height: 64px;
      background: linear-gradient(135deg, rgba(0, 153, 255, 0.3), rgba(0, 212, 255, 0.2));
      border: 2px solid rgba(0, 212, 255, 0.3);
      border-radius: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .client-avatar svg {
      width: 32px;
      height: 32px;
      stroke-width: 2;
      color: #00d4ff;
    }

    .client-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .client-name {
      font-size: 20px;
      font-weight: 700;
      color: white;
      margin: 0;
      letter-spacing: -0.3px;
    }

    .client-info {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .info-item {
      display: flex;
      align-items: center;
      gap: 8px;
      color: rgba(255, 255, 255, 0.7);
      font-size: 14px;
    }

    .info-item svg {
      width: 14px;
      height: 14px;
      stroke-width: 2;
      color: #00d4ff;
      flex-shrink: 0;
    }

    .info-item span {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .client-actions {
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
      gap: 6px;
      padding: 10px 12px;
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 8px;
      color: white;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      text-decoration: none;
      transition: all 0.3s;
    }

    .action-btn svg {
      width: 16px;
      height: 16px;
      stroke-width: 2;
    }

    .action-btn.edit:hover {
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
      text-decoration: none;
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

    /* Responsive */
    @media (max-width: 1200px) {
      .clients-grid {
        grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      }
    }

    @media (max-width: 768px) {
      .client-list-container {
        padding: 20px;
      }

      .top-bar {
        flex-direction: column;
        align-items: stretch;
      }

      .search-section {
        max-width: none;
      }

      .top-bar-actions {
        justify-content: stretch;
      }

      .btn-add {
        justify-content: center;
      }

      .btn-text {
        display: inline;
      }

      .clients-grid {
        grid-template-columns: 1fr;
      }

      .client-info-section {
        flex-direction: column;
        align-items: center;
        text-align: center;
      }

      .client-content {
        align-items: center;
      }

      .info-item {
        justify-content: center;
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
export class ClientListComponent implements OnInit {
  private clientService = inject(ClientService);

  clients: Client[] = [];
  isLoading = false;
  searchTerm = '';
  pagination: any = null;
  currentPage = 1;
  limit = 20;

  ngOnInit(): void {
    this.loadClients();
  }

  loadClients(): void {
    this.isLoading = true;
    this.clientService.getAllClients(this.currentPage, this.limit).subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.success) {
          this.clients = response.data || [];
          this.pagination = response.pagination;
        }
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Error loading clients:', error);
      },
    });
  }

  onSearch(): void {
    if (this.searchTerm.trim()) {
      this.isLoading = true;
      this.currentPage = 1;
      this.clientService.searchClients(this.searchTerm, this.currentPage, this.limit).subscribe({
        next: (response) => {
          this.isLoading = false;
          if (response.success) {
            this.clients = response.data || [];
            this.pagination = response.pagination;
          }
        },
        error: (error) => {
          this.isLoading = false;
          console.error('Error searching clients:', error);
        },
      });
    } else {
      this.loadClients();
    }
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.currentPage = 1;
    this.loadClients();
  }

  goToPage(page: number): void {
    this.currentPage = page;
    if (this.searchTerm.trim()) {
      this.onSearch();
    } else {
      this.loadClients();
    }
  }

  deleteClient(id: number): void {
    if (confirm('Are you sure you want to delete this client?')) {
      this.clientService.deleteClient(id).subscribe({
        next: (response) => {
          if (response.success) {
            this.loadClients();
          }
        },
        error: (error) => {
          console.error('Error deleting client:', error);
          alert(error.error?.message || 'Failed to delete client');
        },
      });
    }
  }
}
