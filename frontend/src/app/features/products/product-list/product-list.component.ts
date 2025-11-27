import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../../core/services/product.service';
import { ReferenceDataService } from '../../../core/services/reference-data.service';
import { Product } from '../../../core/models/product.model';
import { AuthService } from '../../../core/services/auth.service';
import { Category, Brand, Gender, Color, Size } from '../../../core/models/reference-data.model';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="product-list-container">
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
              placeholder="Search products..."
              [(ngModel)]="searchFilters.search"
              (keyup.enter)="applyFilters()"
            />
            <button class="search-btn" (click)="applyFilters()" *ngIf="searchFilters.search">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </button>
          </div>
        </div>

        <div class="top-bar-actions">
          <button class="filter-trigger-btn" (click)="toggleFilterPanel()" [class.active]="showFilterPanel">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
            </svg>
            <span>Filters</span>
            <span class="filter-count" *ngIf="activeFilterCount > 0">{{ activeFilterCount }}</span>
          </button>

          <a routerLink="/products/create" class="btn-add">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="16"/>
              <line x1="8" y1="12" x2="16" y2="12"/>
            </svg>
            <span class="btn-text">Add Product</span>
          </a>
        </div>
      </div>

      <!-- Active Filters Bar -->
      <div class="active-filters-bar" *ngIf="hasActiveFilters()">
        <div class="active-filters-content">
          <span class="filters-label">Active Filters:</span>
          <div class="filter-chips">
            <span class="filter-chip" *ngIf="searchFilters.search">
              <span class="chip-label">Search:</span>
              {{ searchFilters.search }}
              <button (click)="removeFilter('search')">×</button>
            </span>
            <span class="filter-chip" *ngIf="searchFilters.category">
              {{ searchFilters.category }}
              <button (click)="removeFilter('category')">×</button>
            </span>
            <span class="filter-chip" *ngIf="searchFilters.brand">
              {{ searchFilters.brand }}
              <button (click)="removeFilter('brand')">×</button>
            </span>
            <span class="filter-chip" *ngIf="searchFilters.gender">
              {{ searchFilters.gender }}
              <button (click)="removeFilter('gender')">×</button>
            </span>
            <span class="filter-chip" *ngIf="searchFilters.size">
              Size: {{ searchFilters.size }}
              <button (click)="removeFilter('size')">×</button>
            </span>
            <span class="filter-chip" *ngIf="searchFilters.color">
              {{ searchFilters.color }}
              <button (click)="removeFilter('color')">×</button>
            </span>
            <span class="filter-chip" *ngIf="searchFilters.price_min !== null">
              Min: {{ '$' + searchFilters.price_min }}
              <button (click)="removeFilter('price_min')">×</button>
            </span>
            <span class="filter-chip" *ngIf="searchFilters.price_max !== null">
              Max: {{ '$' + searchFilters.price_max }}
              <button (click)="removeFilter('price_max')">×</button>
            </span>
            <span class="filter-chip" *ngIf="searchFilters.availability">
              {{ searchFilters.availability === 'in_stock' ? 'In Stock' : 'Out of Stock' }}
              <button (click)="removeFilter('availability')">×</button>
            </span>
          </div>
        </div>
        <button class="clear-all-btn" (click)="clearFilters()">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
          Clear All
        </button>
      </div>

      <!-- Results Info -->
      <div class="results-bar" *ngIf="!isLoading">
        <div class="results-info">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
          </svg>
          <span><strong>{{ pagination?.total || 0 }}</strong> products found</span>
        </div>
      </div>

      <!-- Products Grid -->
      <div class="products-grid" *ngIf="!isLoading">
        <div class="product-card" *ngFor="let product of products">
          <a [routerLink]="['/products', product.id]" class="product-link">
            <div class="product-image-wrapper">
              <div
                class="product-image"
                [style.background-image]="product.image_url ? 'url(' + product.image_url + ')' : 'none'"
              ></div>
              <span class="status-badge" [class.active]="product.is_active">
                {{ product.is_active ? 'Active' : 'Inactive' }}
              </span>
            </div>

            <div class="product-content">
              <h3 class="product-name">{{ product.name }}</h3>
              <p class="product-description">{{ product.description || 'No description available' }}</p>

              <div class="product-meta">
                <span *ngIf="product.category_name" class="meta-badge">{{ product.category_name }}</span>
                <span *ngIf="product.brand_name" class="meta-badge">{{ product.brand_name }}</span>
              </div>

              <div class="product-footer">
                <div class="price-info">
                  <span class="price">\${{ product.price.toFixed(2) }}</span>
                  <span class="stock" [class.out]="(product.current_quantity || product.quantity) === 0">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                    </svg>
                    {{ product.current_quantity !== undefined ? product.current_quantity : product.quantity }} in stock
                  </span>
                </div>
              </div>
            </div>
          </a>

          <div class="product-actions">
            <a [routerLink]="['/products', product.id, 'edit']" class="action-btn edit" (click)="$event.stopPropagation()">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
              <span>Edit</span>
            </a>
            <button
              *ngIf="authService.isAdmin"
              class="action-btn delete"
              (click)="deleteProduct(product.id); $event.stopPropagation()"
            >
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
        <p>Loading products...</p>
      </div>

      <!-- Empty State -->
      <div class="empty-state" *ngIf="!isLoading && products.length === 0">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="8" x2="12" y2="12"/>
          <line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
        <h3>No Products Found</h3>
        <p>Try adjusting your filters or search criteria</p>
        <button class="btn-primary" (click)="clearFilters()">Clear All Filters</button>
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

    <!-- Filter Panel Overlay -->
    <div class="filter-overlay" *ngIf="showFilterPanel" (click)="toggleFilterPanel()"></div>

    <!-- Filter Panel Sidebar -->
    <div class="filter-panel" [class.open]="showFilterPanel">
      <div class="filter-panel-header">
        <div class="panel-title">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
          </svg>
          <h2>Filter Products</h2>
        </div>
        <button class="close-btn" (click)="toggleFilterPanel()">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>

      <div class="filter-panel-body">
        <!-- Category -->
        <div class="filter-group">
          <label>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M3 3h7v7H3z"/>
              <path d="M14 3h7v7h-7z"/>
            </svg>
            Category
          </label>
          <select [(ngModel)]="searchFilters.category">
            <option value="">All Categories</option>
            <option *ngFor="let category of categories" [value]="category.name">
              {{ category.name }}
            </option>
          </select>
        </div>

        <!-- Brand -->
        <div class="filter-group">
          <label>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/>
            </svg>
            Brand
          </label>
          <select [(ngModel)]="searchFilters.brand">
            <option value="">All Brands</option>
            <option *ngFor="let brand of brands" [value]="brand.name">
              {{ brand.name }}
            </option>
          </select>
        </div>

        <!-- Gender -->
        <div class="filter-group">
          <label>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
            Gender
          </label>
          <select [(ngModel)]="searchFilters.gender">
            <option value="">All Genders</option>
            <option *ngFor="let gender of genders" [value]="gender.name">
              {{ gender.name }}
            </option>
          </select>
        </div>

        <!-- Size -->
        <div class="filter-group">
          <label>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
            </svg>
            Size
          </label>
          <select [(ngModel)]="searchFilters.size">
            <option value="">All Sizes</option>
            <option *ngFor="let size of sizes" [value]="size.name">
              {{ size.name }}
            </option>
          </select>
        </div>

        <!-- Color -->
        <div class="filter-group">
          <label>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="12" cy="12" r="10"/>
              <path d="M12 2a7 7 0 1 0 10 10"/>
            </svg>
            Color
          </label>
          <select [(ngModel)]="searchFilters.color">
            <option value="">All Colors</option>
            <option *ngFor="let color of colors" [value]="color.name">
              {{ color.name }}
            </option>
          </select>
        </div>

        <!-- Price Range -->
        <div class="filter-group">
          <label>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <line x1="12" y1="1" x2="12" y2="23"/>
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
            </svg>
            Price Range
          </label>
          <div class="price-inputs">
            <input
              type="number"
              placeholder="Min"
              [(ngModel)]="searchFilters.price_min"
              min="0"
              step="0.01"
            />
            <span class="price-separator">-</span>
            <input
              type="number"
              placeholder="Max"
              [(ngModel)]="searchFilters.price_max"
              min="0"
              step="0.01"
            />
          </div>
        </div>

        <!-- Availability -->
        <div class="filter-group">
          <label>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
            </svg>
            Availability
          </label>
          <select [(ngModel)]="searchFilters.availability">
            <option value="">All Products</option>
            <option value="in_stock">In Stock</option>
            <option value="out_of_stock">Out of Stock</option>
          </select>
        </div>
      </div>

      <div class="filter-panel-footer">
        <button class="btn-apply" (click)="applyFiltersAndClose()">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
          Apply Filters
        </button>
        <button class="btn-reset" (click)="clearFilters()">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <polyline points="1 4 1 10 7 10"/>
            <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/>
          </svg>
          Reset
        </button>
      </div>
    </div>
  `,
  styles: [`
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }

    @keyframes slideInRight {
      from { transform: translateX(100%); }
      to { transform: translateX(0); }
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .product-list-container {
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

    .filter-trigger-btn {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 12px 20px;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 12px;
      color: white;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s;
      position: relative;
    }

    .filter-trigger-btn:hover,
    .filter-trigger-btn.active {
      background: rgba(0, 212, 255, 0.15);
      border-color: rgba(0, 212, 255, 0.4);
      transform: translateY(-2px);
    }

    .filter-trigger-btn svg {
      width: 18px;
      height: 18px;
      stroke-width: 2;
    }

    .filter-count {
      position: absolute;
      top: -6px;
      right: -6px;
      min-width: 22px;
      height: 22px;
      background: linear-gradient(135deg, #ff4757, #ff6b81);
      color: white;
      font-size: 11px;
      font-weight: 700;
      border-radius: 11px;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0 6px;
      box-shadow: 0 2px 8px rgba(255, 71, 87, 0.4);
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

    /* Active Filters Bar */
    .active-filters-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 16px;
      padding: 16px 20px;
      background: rgba(0, 153, 255, 0.1);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(0, 212, 255, 0.2);
      border-radius: 12px;
      margin-bottom: 24px;
      animation: fadeIn 0.3s ease-out;
    }

    .active-filters-content {
      display: flex;
      align-items: center;
      gap: 12px;
      flex: 1;
      overflow: hidden;
    }

    .filters-label {
      font-size: 13px;
      font-weight: 700;
      color: rgba(255, 255, 255, 0.7);
      text-transform: uppercase;
      letter-spacing: 0.5px;
      white-space: nowrap;
    }

    .filter-chips {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      flex: 1;
    }

    .filter-chip {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 6px 12px;
      background: rgba(0, 212, 255, 0.2);
      border: 1px solid rgba(0, 212, 255, 0.3);
      border-radius: 8px;
      color: #00d4ff;
      font-size: 13px;
      font-weight: 600;
      white-space: nowrap;
    }

    .chip-label {
      opacity: 0.7;
    }

    .filter-chip button {
      background: none;
      border: none;
      color: #00d4ff;
      font-size: 18px;
      line-height: 1;
      cursor: pointer;
      padding: 0;
      margin-left: 4px;
      transition: transform 0.2s;
    }

    .filter-chip button:hover {
      transform: scale(1.2);
    }

    .clear-all-btn {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 8px 14px;
      background: rgba(239, 68, 68, 0.15);
      border: 1px solid rgba(239, 68, 68, 0.3);
      border-radius: 8px;
      color: #ef4444;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s;
      white-space: nowrap;
    }

    .clear-all-btn:hover {
      background: rgba(239, 68, 68, 0.25);
      transform: translateY(-1px);
    }

    .clear-all-btn svg {
      width: 14px;
      height: 14px;
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

    /* Products Grid */
    .products-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 24px;
      animation: fadeIn 0.6s ease-out 0.2s backwards;
    }

    .product-card {
      background: rgba(255, 255, 255, 0.05);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 16px;
      overflow: hidden;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      display: flex;
      flex-direction: column;
    }

    .product-card:hover {
      transform: translateY(-8px);
      border-color: rgba(0, 212, 255, 0.3);
      box-shadow: 0 12px 40px rgba(0, 153, 255, 0.2);
    }

    .product-link {
      text-decoration: none;
      color: inherit;
      flex: 1;
      display: flex;
      flex-direction: column;
    }

    .product-image-wrapper {
      position: relative;
      width: 100%;
      padding-top: 75%;
    }

    .product-image {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(135deg, rgba(0, 153, 255, 0.3), rgba(0, 212, 255, 0.2));
      background-size: cover;
      background-position: center;
    }

    .status-badge {
      position: absolute;
      top: 12px;
      right: 12px;
      padding: 6px 14px;
      border-radius: 8px;
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      backdrop-filter: blur(10px);
    }

    .status-badge.active {
      background: rgba(39, 174, 96, 0.9);
      color: white;
    }

    .status-badge:not(.active) {
      background: rgba(231, 76, 60, 0.9);
      color: white;
    }

    .product-content {
      padding: 20px;
      flex: 1;
      display: flex;
      flex-direction: column;
    }

    .product-name {
      font-size: 18px;
      font-weight: 700;
      color: white;
      margin: 0 0 8px 0;
    }

    .product-description {
      font-size: 14px;
      color: rgba(255, 255, 255, 0.6);
      margin: 0 0 16px 0;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      line-height: 1.5;
      flex: 1;
    }

    .product-meta {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      margin-bottom: 16px;
    }

    .meta-badge {
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

    .product-footer {
      padding-top: 16px;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
    }

    .price-info {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .price {
      font-size: 24px;
      font-weight: 800;
      background: linear-gradient(135deg, #0099ff, #00d4ff);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .stock {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 13px;
      font-weight: 600;
      color: rgba(255, 255, 255, 0.7);
    }

    .stock.out {
      color: #e74c3c;
    }

    .stock svg {
      width: 14px;
      height: 14px;
      stroke-width: 2;
    }

    .product-actions {
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

    /* Filter Panel Overlay */
    .filter-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.6);
      backdrop-filter: blur(4px);
      z-index: 999;
      animation: fadeIn 0.3s ease-out;
    }

    /* Filter Panel */
    .filter-panel {
      position: fixed;
      top: 0;
      right: 0;
      width: 420px;
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

    .filter-panel.open {
      transform: translateX(0);
    }

    .filter-panel-header {
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

    .filter-panel-body {
      flex: 1;
      overflow-y: auto;
      padding: 24px 28px;
    }

    .filter-panel-body::-webkit-scrollbar {
      width: 6px;
    }

    .filter-panel-body::-webkit-scrollbar-track {
      background: rgba(0, 0, 0, 0.2);
    }

    .filter-panel-body::-webkit-scrollbar-thumb {
      background: rgba(0, 212, 255, 0.3);
      border-radius: 3px;
    }

    .filter-group {
      margin-bottom: 24px;
    }

    .filter-group label {
      display: flex;
      align-items: center;
      gap: 8px;
      color: rgba(255, 255, 255, 0.8);
      font-size: 14px;
      font-weight: 600;
      margin-bottom: 10px;
    }

    .filter-group label svg {
      width: 16px;
      height: 16px;
      stroke-width: 2;
      color: #00d4ff;
    }

    .filter-group select,
    .filter-group input {
      width: 100%;
      padding: 12px 14px;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 10px;
      color: white;
      font-size: 14px;
      transition: all 0.3s;
    }

    .filter-group select:focus,
    .filter-group input:focus {
      outline: none;
      background: rgba(255, 255, 255, 0.08);
      border-color: rgba(0, 212, 255, 0.4);
      box-shadow: 0 0 0 3px rgba(0, 212, 255, 0.1);
    }

    .filter-group select option {
      background: #1a1a2e;
      color: white;
    }

    .price-inputs {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .price-inputs input {
      flex: 1;
    }

    .price-separator {
      color: rgba(255, 255, 255, 0.5);
      font-weight: 600;
    }

    .filter-panel-footer {
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

    .btn-apply:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(0, 153, 255, 0.4);
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
      padding: 12px 24px;
      background: linear-gradient(135deg, #0099ff, #00d4ff);
      color: white;
      border: none;
      border-radius: 10px;
      font-weight: 600;
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
      .products-grid {
        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      }
    }

    @media (max-width: 768px) {
      .product-list-container {
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
        justify-content: space-between;
      }

      .btn-text {
        display: none;
      }

      .filter-panel {
        width: 100%;
        max-width: 420px;
      }

      .products-grid {
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

      .active-filters-bar {
        flex-direction: column;
        align-items: stretch;
      }

      .clear-all-btn {
        width: 100%;
        justify-content: center;
      }
    }
  `]
})
export class ProductListComponent implements OnInit {
  private productService = inject(ProductService);
  private refDataService = inject(ReferenceDataService);
  authService = inject(AuthService);

  products: Product[] = [];
  isLoading = false;
  pagination: any = null;
  currentPage = 1;
  limit = 12;
  showFilterPanel = false;

  categories: Category[] = [];
  brands: Brand[] = [];
  genders: Gender[] = [];
  colors: Color[] = [];
  sizes: Size[] = [];

  searchFilters = {
    search: '',
    category: '',
    gender: '',
    brand: '',
    size: '',
    color: '',
    price_min: null as number | null,
    price_max: null as number | null,
    availability: '',
  };

  get activeFilterCount(): number {
    let count = 0;
    if (this.searchFilters.search) count++;
    if (this.searchFilters.category) count++;
    if (this.searchFilters.brand) count++;
    if (this.searchFilters.gender) count++;
    if (this.searchFilters.size) count++;
    if (this.searchFilters.color) count++;
    if (this.searchFilters.price_min !== null) count++;
    if (this.searchFilters.price_max !== null) count++;
    if (this.searchFilters.availability) count++;
    return count;
  }

  ngOnInit(): void {
    this.loadReferenceData();
    this.loadProducts();
  }

  toggleFilterPanel(): void {
    this.showFilterPanel = !this.showFilterPanel;
  }

  loadReferenceData(): void {
    this.refDataService.getAllCategories().subscribe({
      next: (response) => {
        if (response.success) this.categories = response.data || [];
      },
    });

    this.refDataService.getAllBrands().subscribe({
      next: (response) => {
        if (response.success) this.brands = response.data || [];
      },
    });

    this.refDataService.getAllGenders().subscribe({
      next: (response) => {
        if (response.success) this.genders = response.data || [];
      },
    });

    this.refDataService.getAllColors().subscribe({
      next: (response) => {
        if (response.success) this.colors = response.data || [];
      },
    });

    this.refDataService.getAllSizes().subscribe({
      next: (response) => {
        if (response.success) this.sizes = response.data || [];
      },
    });
  }

  loadProducts(): void {
    this.isLoading = true;

    if (!this.hasActiveFilters()) {
      this.productService.getAllProducts(this.currentPage, this.limit).subscribe({
        next: (response) => {
          this.isLoading = false;
          if (response.success) {
            this.products = response.data || [];
            this.pagination = response.pagination;
          }
        },
        error: (error) => {
          this.isLoading = false;
          console.error('Error loading products:', error);
        },
      });
    } else {
      this.applyFilters();
    }
  }

  applyFilters(): void {
    this.isLoading = true;
    this.currentPage = 1;

    const searchParams: any = {
      page: this.currentPage,
      limit: this.limit,
    };

    if (this.searchFilters.search) searchParams.search = this.searchFilters.search;
    if (this.searchFilters.category) searchParams.category = this.searchFilters.category;
    if (this.searchFilters.gender) searchParams.gender = this.searchFilters.gender;
    if (this.searchFilters.brand) searchParams.brand = this.searchFilters.brand;
    if (this.searchFilters.size) searchParams.size = this.searchFilters.size;
    if (this.searchFilters.color) searchParams.color = this.searchFilters.color;
    if (this.searchFilters.price_min !== null) searchParams.price_min = this.searchFilters.price_min;
    if (this.searchFilters.price_max !== null) searchParams.price_max = this.searchFilters.price_max;
    if (this.searchFilters.availability) searchParams.availability = this.searchFilters.availability;

    this.productService.searchProducts(searchParams).subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.success) {
          this.products = response.data || [];
          this.pagination = response.pagination;
        }
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Error searching products:', error);
      },
    });
  }

  applyFiltersAndClose(): void {
    this.applyFilters();
    this.toggleFilterPanel();
  }

  clearFilters(): void {
    this.searchFilters = {
      search: '',
      category: '',
      gender: '',
      brand: '',
      size: '',
      color: '',
      price_min: null,
      price_max: null,
      availability: '',
    };
    this.currentPage = 1;
    this.loadProducts();
  }

  removeFilter(filterKey: string): void {
    if (filterKey === 'price_min' || filterKey === 'price_max') {
      (this.searchFilters as any)[filterKey] = null;
    } else {
      (this.searchFilters as any)[filterKey] = '';
    }
    this.applyFilters();
  }

  hasActiveFilters(): boolean {
    return (
      !!this.searchFilters.search ||
      !!this.searchFilters.category ||
      !!this.searchFilters.gender ||
      !!this.searchFilters.brand ||
      !!this.searchFilters.size ||
      !!this.searchFilters.color ||
      this.searchFilters.price_min !== null ||
      this.searchFilters.price_max !== null ||
      !!this.searchFilters.availability
    );
  }

  goToPage(page: number): void {
    this.currentPage = page;
    if (this.hasActiveFilters()) {
      this.applyFilters();
    } else {
      this.loadProducts();
    }
  }

  deleteProduct(id: number): void {
    if (confirm('Are you sure you want to delete this product?')) {
      this.productService.deleteProduct(id).subscribe({
        next: (response) => {
          if (response.success) {
            this.loadProducts();
          }
        },
        error: (error) => {
          console.error('Error deleting product:', error);
          alert('Failed to delete product');
        },
      });
    }
  }
}
