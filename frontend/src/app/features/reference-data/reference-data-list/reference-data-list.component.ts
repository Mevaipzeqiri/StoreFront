import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReferenceDataService } from '../../../core/services/reference-data.service';
import { Category, Brand, Color, Size, Gender } from '../../../core/models/reference-data.model';

@Component({
  selector: 'app-reference-data-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="reference-container">
      <!-- Page Header -->
      <div class="page-header">
        <div class="header-content">
          <h1>Reference Data Management</h1>
          <p class="subtitle">Manage product attributes and classification</p>
        </div>
      </div>

      <!-- Tabs Navigation -->
      <div class="tabs-navigation">
        <button
          class="tab-btn"
          [class.active]="activeTab === 'categories'"
          (click)="switchTab('categories')"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M3 3h7v7H3z"/>
            <path d="M14 3h7v7h-7z"/>
            <path d="M14 14h7v7h-7z"/>
            <path d="M3 14h7v7H3z"/>
          </svg>
          <span>Categories</span>
        </button>
        <button
          class="tab-btn"
          [class.active]="activeTab === 'brands'"
          (click)="switchTab('brands')"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/>
            <line x1="7" y1="7" x2="7.01" y2="7"/>
          </svg>
          <span>Brands</span>
        </button>
        <button
          class="tab-btn"
          [class.active]="activeTab === 'colors'"
          (click)="switchTab('colors')"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="12" cy="12" r="10"/>
            <path d="M12 2a7 7 0 1 0 10 10"/>
          </svg>
          <span>Colors</span>
        </button>
        <button
          class="tab-btn"
          [class.active]="activeTab === 'sizes'"
          (click)="switchTab('sizes')"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
          </svg>
          <span>Sizes</span>
        </button>
        <button
          class="tab-btn"
          [class.active]="activeTab === 'genders'"
          (click)="switchTab('genders')"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
          </svg>
          <span>Genders</span>
        </button>
      </div>

      <!-- Categories Tab -->
      <div class="tab-content" *ngIf="activeTab === 'categories'">
        <div class="section-header">
          <div class="header-title">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M3 3h7v7H3z"/>
              <path d="M14 3h7v7h-7z"/>
            </svg>
            <h2>Categories</h2>
          </div>
          <button class="btn-add" (click)="showCategoryForm = !showCategoryForm">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="16"/>
              <line x1="8" y1="12" x2="16" y2="12"/>
            </svg>
            <span>{{ showCategoryForm ? 'Cancel' : 'Add Category' }}</span>
          </button>
        </div>

        <div class="create-form" *ngIf="showCategoryForm">
          <div class="form-grid">
            <div class="form-field">
              <label>Name *</label>
              <input type="text" [(ngModel)]="newCategory.name" placeholder="Enter category name" />
            </div>
            <div class="form-field full-width">
              <label>Description</label>
              <input type="text" [(ngModel)]="newCategory.description" placeholder="Enter description (optional)" />
            </div>
          </div>
          <button class="btn-submit" (click)="createCategory()">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            Create Category
          </button>
        </div>

        <div class="items-grid">
          <div class="item-card" *ngFor="let category of categories">
            <div class="item-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M3 3h7v7H3z"/>
                <path d="M14 3h7v7h-7z"/>
              </svg>
            </div>
            <div class="item-content">
              <h3 class="item-name">{{ category.name }}</h3>
              <p class="item-description">{{ category.description || 'No description' }}</p>
            </div>
            <button class="delete-btn" (click)="deleteCategory(category.id)">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <polyline points="3 6 5 6 21 6"/>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Brands Tab -->
      <div class="tab-content" *ngIf="activeTab === 'brands'">
        <div class="section-header">
          <div class="header-title">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/>
            </svg>
            <h2>Brands</h2>
          </div>
          <button class="btn-add" (click)="showBrandForm = !showBrandForm">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="16"/>
              <line x1="8" y1="12" x2="16" y2="12"/>
            </svg>
            <span>{{ showBrandForm ? 'Cancel' : 'Add Brand' }}</span>
          </button>
        </div>

        <div class="create-form" *ngIf="showBrandForm">
          <div class="form-grid">
            <div class="form-field">
              <label>Name *</label>
              <input type="text" [(ngModel)]="newBrand.name" placeholder="Enter brand name" />
            </div>
            <div class="form-field full-width">
              <label>Description</label>
              <input type="text" [(ngModel)]="newBrand.description" placeholder="Enter description (optional)" />
            </div>
          </div>
          <button class="btn-submit" (click)="createBrand()">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            Create Brand
          </button>
        </div>

        <div class="items-grid">
          <div class="item-card" *ngFor="let brand of brands">
            <div class="item-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/>
              </svg>
            </div>
            <div class="item-content">
              <h3 class="item-name">{{ brand.name }}</h3>
              <p class="item-description">{{ brand.description || 'No description' }}</p>
            </div>
            <button class="delete-btn" (click)="deleteBrand(brand.id)">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <polyline points="3 6 5 6 21 6"/>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Colors Tab -->
      <div class="tab-content" *ngIf="activeTab === 'colors'">
        <div class="section-header">
          <div class="header-title">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="12" cy="12" r="10"/>
              <path d="M12 2a7 7 0 1 0 10 10"/>
            </svg>
            <h2>Colors</h2>
          </div>
          <button class="btn-add" (click)="showColorForm = !showColorForm">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="16"/>
              <line x1="8" y1="12" x2="16" y2="12"/>
            </svg>
            <span>{{ showColorForm ? 'Cancel' : 'Add Color' }}</span>
          </button>
        </div>

        <div class="create-form" *ngIf="showColorForm">
          <div class="form-grid">
            <div class="form-field">
              <label>Name *</label>
              <input type="text" [(ngModel)]="newColor.name" placeholder="Enter color name" />
            </div>
            <div class="form-field">
              <label>Hex Code</label>
              <div class="color-input-wrapper">
                <input type="color" [(ngModel)]="newColor.hex_code" class="color-picker" />
                <input type="text" [(ngModel)]="newColor.hex_code" placeholder="#000000" class="hex-input" />
              </div>
            </div>
          </div>
          <button class="btn-submit" (click)="createColor()">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            Create Color
          </button>
        </div>

        <div class="items-grid">
          <div class="item-card color-card" *ngFor="let color of colors">
            <div class="color-preview" [style.background-color]="color.hex_code">
              <div class="color-overlay">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M12 2a7 7 0 1 0 10 10"/>
                </svg>
              </div>
            </div>
            <div class="item-content">
              <h3 class="item-name">{{ color.name }}</h3>
              <p class="item-description">{{ color.hex_code }}</p>
            </div>
            <button class="delete-btn" (click)="deleteColor(color.id)">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <polyline points="3 6 5 6 21 6"/>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Sizes Tab -->
      <div class="tab-content" *ngIf="activeTab === 'sizes'">
        <div class="section-header">
          <div class="header-title">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
            </svg>
            <h2>Sizes</h2>
          </div>
          <button class="btn-add" (click)="showSizeForm = !showSizeForm">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="16"/>
              <line x1="8" y1="12" x2="16" y2="12"/>
            </svg>
            <span>{{ showSizeForm ? 'Cancel' : 'Add Size' }}</span>
          </button>
        </div>

        <div class="create-form" *ngIf="showSizeForm">
          <div class="form-grid">
            <div class="form-field">
              <label>Name *</label>
              <input type="text" [(ngModel)]="newSize.name" placeholder="Enter size name" />
            </div>
            <div class="form-field">
              <label>Sort Order</label>
              <input type="number" [(ngModel)]="newSize.sort_order" placeholder="0" />
            </div>
            <div class="form-field full-width">
              <label>Description</label>
              <input type="text" [(ngModel)]="newSize.description" placeholder="Enter description (optional)" />
            </div>
          </div>
          <button class="btn-submit" (click)="createSize()">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            Create Size
          </button>
        </div>

        <div class="items-grid">
          <div class="item-card" *ngFor="let size of sizes">
            <div class="item-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
              </svg>
            </div>
            <div class="item-content">
              <h3 class="item-name">{{ size.name }}</h3>
              <p class="item-description">{{ size.description || 'No description' }}</p>
            </div>
            <button class="delete-btn" (click)="deleteSize(size.id)">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <polyline points="3 6 5 6 21 6"/>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Genders Tab -->
      <div class="tab-content" *ngIf="activeTab === 'genders'">
        <div class="section-header">
          <div class="header-title">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
            <h2>Genders</h2>
          </div>
          <button class="btn-add" (click)="showGenderForm = !showGenderForm">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="16"/>
              <line x1="8" y1="12" x2="16" y2="12"/>
            </svg>
            <span>{{ showGenderForm ? 'Cancel' : 'Add Gender' }}</span>
          </button>
        </div>

        <div class="create-form" *ngIf="showGenderForm">
          <div class="form-grid">
            <div class="form-field">
              <label>Name *</label>
              <input type="text" [(ngModel)]="newGender.name" placeholder="Enter gender name" />
            </div>
            <div class="form-field full-width">
              <label>Description</label>
              <input type="text" [(ngModel)]="newGender.description" placeholder="Enter description (optional)" />
            </div>
          </div>
          <button class="btn-submit" (click)="createGender()">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            Create Gender
          </button>
        </div>

        <div class="items-grid">
          <div class="item-card" *ngFor="let gender of genders">
            <div class="item-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
            </div>
            <div class="item-content">
              <h3 class="item-name">{{ gender.name }}</h3>
              <p class="item-description">{{ gender.description || 'No description' }}</p>
            </div>
            <button class="delete-btn" (click)="deleteGender(gender.id)">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <polyline points="3 6 5 6 21 6"/>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
              </svg>
            </button>
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

    @keyframes slideIn {
      from { opacity: 0; transform: scaleY(0); transform-origin: top; }
      to { opacity: 1; transform: scaleY(1); }
    }

    .reference-container {
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

    /* Tabs Navigation */
    .tabs-navigation {
      display: flex;
      gap: 12px;
      margin-bottom: 32px;
      padding: 8px;
      background: rgba(255, 255, 255, 0.05);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 16px;
      overflow-x: auto;
      animation: fadeIn 0.6s ease-out 0.1s backwards;
    }

    .tabs-navigation::-webkit-scrollbar {
      height: 6px;
    }

    .tabs-navigation::-webkit-scrollbar-track {
      background: transparent;
    }

    .tabs-navigation::-webkit-scrollbar-thumb {
      background: rgba(0, 212, 255, 0.3);
      border-radius: 3px;
    }

    .tab-btn {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 12px 20px;
      background: transparent;
      border: 1px solid transparent;
      border-radius: 12px;
      color: rgba(255, 255, 255, 0.6);
      font-size: 15px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s;
      white-space: nowrap;
    }

    .tab-btn svg {
      width: 18px;
      height: 18px;
      stroke-width: 2;
    }

    .tab-btn:hover {
      color: rgba(255, 255, 255, 0.9);
      background: rgba(255, 255, 255, 0.05);
    }

    .tab-btn.active {
      color: white;
      background: linear-gradient(135deg, rgba(0, 153, 255, 0.3), rgba(0, 212, 255, 0.2));
      border-color: rgba(0, 212, 255, 0.3);
      box-shadow: 0 4px 12px rgba(0, 153, 255, 0.2);
    }

    /* Tab Content */
    .tab-content {
      background: rgba(255, 255, 255, 0.05);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 20px;
      padding: 28px;
      animation: fadeIn 0.6s ease-out 0.2s backwards;
    }

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
      padding-bottom: 16px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
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

    .header-title h2 {
      font-size: 22px;
      font-weight: 700;
      color: white;
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

    /* Create Form */
    .create-form {
      background: rgba(0, 153, 255, 0.08);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(0, 212, 255, 0.2);
      border-radius: 16px;
      padding: 24px;
      margin-bottom: 28px;
      animation: slideIn 0.4s ease-out;
    }

    .form-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 16px;
      margin-bottom: 16px;
    }

    .form-field {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .form-field.full-width {
      grid-column: 1 / -1;
    }

    .form-field label {
      color: rgba(255, 255, 255, 0.8);
      font-size: 13px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .form-field input {
      padding: 12px 14px;
      background: rgba(255, 255, 255, 0.08);
      border: 1px solid rgba(255, 255, 255, 0.15);
      border-radius: 10px;
      color: white;
      font-size: 14px;
      transition: all 0.3s;
      font-family: inherit;
    }

    .form-field input::placeholder {
      color: rgba(255, 255, 255, 0.4);
    }

    .form-field input:focus {
      outline: none;
      background: rgba(255, 255, 255, 0.12);
      border-color: rgba(0, 212, 255, 0.5);
      box-shadow: 0 0 0 3px rgba(0, 212, 255, 0.15);
    }

    .color-input-wrapper {
      display: flex;
      gap: 12px;
      align-items: center;
    }

    .color-picker {
      width: 60px;
      height: 44px;
      border: none;
      border-radius: 10px;
      cursor: pointer;
      background: transparent;
    }

    .hex-input {
      flex: 1;
    }

    .btn-submit {
      display: flex;
      align-items: center;
      justify-content: center;
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

    .btn-submit:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(0, 153, 255, 0.4);
    }

    .btn-submit svg {
      width: 18px;
      height: 18px;
      stroke-width: 2.5;
    }

    /* Items Grid */
    .items-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 20px;
    }

    .item-card {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 14px;
      padding: 20px;
      display: flex;
      align-items: center;
      gap: 16px;
      transition: all 0.3s;
      position: relative;
      overflow: hidden;
    }

    .item-card::before {
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

    .item-card:hover {
      background: rgba(255, 255, 255, 0.08);
      border-color: rgba(0, 212, 255, 0.3);
      transform: translateX(8px);
    }

    .item-card:hover::before {
      transform: scaleY(1);
    }

    .item-icon {
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

    .item-icon svg {
      width: 24px;
      height: 24px;
      stroke-width: 2;
      color: #00d4ff;
    }

    .item-content {
      flex: 1;
      min-width: 0;
    }

    .item-name {
      font-size: 16px;
      font-weight: 700;
      color: white;
      margin: 0 0 4px 0;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .item-description {
      font-size: 13px;
      color: rgba(255, 255, 255, 0.6);
      margin: 0;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .delete-btn {
      width: 36px;
      height: 36px;
      background: rgba(231, 76, 60, 0.15);
      border: 1px solid rgba(231, 76, 60, 0.3);
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.3s;
      flex-shrink: 0;
    }

    .delete-btn:hover {
      background: rgba(231, 76, 60, 0.25);
      border-color: rgba(231, 76, 60, 0.5);
      transform: scale(1.1);
    }

    .delete-btn svg {
      width: 18px;
      height: 18px;
      stroke-width: 2;
      color: #e74c3c;
    }

    /* Color Card Special Styling */
    .item-card.color-card {
      flex-direction: column;
      align-items: stretch;
    }

    .color-preview {
      width: 100%;
      height: 120px;
      border-radius: 10px;
      border: 2px solid rgba(255, 255, 255, 0.2);
      position: relative;
      overflow: hidden;
      margin-bottom: 12px;
    }

    .color-overlay {
      position: absolute;
      inset: 0;
      background: rgba(0, 0, 0, 0.3);
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      transition: opacity 0.3s;
    }

    .item-card.color-card:hover .color-overlay {
      opacity: 1;
    }

    .color-overlay svg {
      width: 40px;
      height: 40px;
      stroke-width: 2;
      color: white;
    }

    .color-card .item-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .color-card .delete-btn {
      position: static;
    }

    /* Responsive */
    @media (max-width: 768px) {
      .reference-container {
        padding: 20px;
      }

      .header-content h1 {
        font-size: 28px;
      }

      .tabs-navigation {
        padding: 6px;
        gap: 8px;
      }

      .tab-btn {
        padding: 10px 16px;
        font-size: 14px;
      }

      .tab-btn span {
        display: none;
      }

      .tab-content {
        padding: 20px;
      }

      .section-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 12px;
      }

      .btn-add {
        width: 100%;
        justify-content: center;
      }

      .form-grid {
        grid-template-columns: 1fr;
      }

      .items-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class ReferenceDataListComponent implements OnInit {
  private refDataService = inject(ReferenceDataService);

  activeTab = 'categories';

  categories: Category[] = [];
  brands: Brand[] = [];
  colors: Color[] = [];
  sizes: Size[] = [];
  genders: Gender[] = [];

  showCategoryForm = false;
  showBrandForm = false;
  showColorForm = false;
  showSizeForm = false;
  showGenderForm = false;

  newCategory: Partial<Category> = {};
  newBrand: Partial<Brand> = {};
  newColor: Partial<Color> = { hex_code: '#000000' };
  newSize: Partial<Size> = {};
  newGender: Partial<Gender> = {};

  ngOnInit(): void {
    this.loadAllData();
  }

  switchTab(tab: string): void {
    this.activeTab = tab;
    this.closeAllForms();
  }

  closeAllForms(): void {
    this.showCategoryForm = false;
    this.showBrandForm = false;
    this.showColorForm = false;
    this.showSizeForm = false;
    this.showGenderForm = false;
  }

  loadAllData(): void {
    this.loadCategories();
    this.loadBrands();
    this.loadColors();
    this.loadSizes();
    this.loadGenders();
  }

  loadCategories(): void {
    this.refDataService.getAllCategories().subscribe({
      next: (response) => {
        if (response.success) this.categories = response.data || [];
      },
    });
  }

  loadBrands(): void {
    this.refDataService.getAllBrands().subscribe({
      next: (response) => {
        if (response.success) this.brands = response.data || [];
      },
    });
  }

  loadColors(): void {
    this.refDataService.getAllColors().subscribe({
      next: (response) => {
        if (response.success) this.colors = response.data || [];
      },
    });
  }

  loadSizes(): void {
    this.refDataService.getAllSizes().subscribe({
      next: (response) => {
        if (response.success) this.sizes = response.data || [];
      },
    });
  }

  loadGenders(): void {
    this.refDataService.getAllGenders().subscribe({
      next: (response) => {
        if (response.success) this.genders = response.data || [];
      },
    });
  }

  createCategory(): void {
    if (this.newCategory.name) {
      this.refDataService.createCategory(this.newCategory).subscribe({
        next: () => {
          this.newCategory = {};
          this.showCategoryForm = false;
          this.loadCategories();
        },
      });
    }
  }

  deleteCategory(id: number): void {
    if (confirm('Delete this category?')) {
      this.refDataService.deleteCategory(id).subscribe({
        next: () => this.loadCategories(),
      });
    }
  }

  createBrand(): void {
    if (this.newBrand.name) {
      this.refDataService.createBrand(this.newBrand).subscribe({
        next: () => {
          this.newBrand = {};
          this.showBrandForm = false;
          this.loadBrands();
        },
      });
    }
  }

  deleteBrand(id: number): void {
    if (confirm('Delete this brand?')) {
      this.refDataService.deleteBrand(id).subscribe({
        next: () => this.loadBrands(),
      });
    }
  }

  createColor(): void {
    if (this.newColor.name) {
      this.refDataService.createColor(this.newColor).subscribe({
        next: () => {
          this.newColor = { hex_code: '#000000' };
          this.showColorForm = false;
          this.loadColors();
        },
      });
    }
  }

  deleteColor(id: number): void {
    if (confirm('Delete this color?')) {
      this.refDataService.deleteColor(id).subscribe({
        next: () => this.loadColors(),
      });
    }
  }

  createSize(): void {
    if (this.newSize.name) {
      this.refDataService.createSize(this.newSize).subscribe({
        next: () => {
          this.newSize = {};
          this.showSizeForm = false;
          this.loadSizes();
        },
      });
    }
  }

  deleteSize(id: number): void {
    if (confirm('Delete this size?')) {
      this.refDataService.deleteSize(id).subscribe({
        next: () => this.loadSizes(),
      });
    }
  }

  createGender(): void {
    if (this.newGender.name) {
      this.refDataService.createGender(this.newGender).subscribe({
        next: () => {
          this.newGender = {};
          this.showGenderForm = false;
          this.loadGenders();
        },
      });
    }
  }

  deleteGender(id: number): void {
    if (confirm('Delete this gender?')) {
      this.refDataService.deleteGender(id).subscribe({
        next: () => this.loadGenders(),
      });
    }
  }
}
