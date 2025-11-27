import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProductService } from '../../../core/services/product.service';
import { ReferenceDataService } from '../../../core/services/reference-data.service';
import { Category, Brand, Gender, Color, Size } from '../../../core/models/reference-data.model';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="form-container">
      <!-- Page Header -->
      <div class="page-header">
        <div class="header-content">
          <a routerLink="/products" class="back-link">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
            Back to Products
          </a>
          <h1>{{ isEditMode ? 'Edit Product' : 'Create New Product' }}</h1>
          <p class="subtitle">{{ isEditMode ? 'Update product information' : 'Add a new product to your inventory' }}</p>
        </div>
      </div>

      <!-- Form Card -->
      <div class="form-card">
        <form [formGroup]="productForm" (ngSubmit)="onSubmit()">
          <!-- Basic Information Section -->
          <div class="form-section">
            <div class="section-header">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
              </svg>
              <h2>Basic Information</h2>
            </div>

            <div class="fields-grid">
              <div class="form-field full-width">
                <label for="name">
                  Product Name *
                  <span class="required-indicator"></span>
                </label>
                <input
                  type="text"
                  id="name"
                  formControlName="name"
                  placeholder="Enter product name"
                  [class.invalid]="productForm.get('name')?.invalid && productForm.get('name')?.touched"
                />
                <span class="error-message" *ngIf="productForm.get('name')?.invalid && productForm.get('name')?.touched">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="12" y1="8" x2="12" y2="12" stroke="white" stroke-width="2"/>
                    <circle cx="12" cy="16" r="1" fill="white"/>
                  </svg>
                  Product name is required
                </span>
              </div>

              <div class="form-field full-width">
                <label for="description">Description</label>
                <textarea
                  id="description"
                  formControlName="description"
                  rows="4"
                  placeholder="Describe your product..."
                ></textarea>
              </div>
            </div>
          </div>

          <!-- Pricing & Inventory Section -->
          <div class="form-section">
            <div class="section-header">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <line x1="12" y1="1" x2="12" y2="23"/>
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
              </svg>
              <h2>Pricing & Inventory</h2>
            </div>

            <div class="fields-grid">
              <div class="form-field">
                <label for="price">
                  Price *
                  <span class="required-indicator"></span>
                </label>
                <div class="input-with-icon">
                  <span class="input-icon">$</span>
                  <input
                    type="number"
                    id="price"
                    formControlName="price"
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    [class.invalid]="productForm.get('price')?.invalid && productForm.get('price')?.touched"
                  />
                </div>
                <span class="error-message" *ngIf="productForm.get('price')?.invalid && productForm.get('price')?.touched">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="12" y1="8" x2="12" y2="12" stroke="white" stroke-width="2"/>
                    <circle cx="12" cy="16" r="1" fill="white"/>
                  </svg>
                  Valid price is required
                </span>
              </div>

              <div class="form-field">
                <label for="quantity">
                  Initial Stock *
                  <span class="required-indicator"></span>
                </label>
                <input
                  type="number"
                  id="quantity"
                  formControlName="quantity"
                  placeholder="0"
                  min="0"
                  [class.invalid]="productForm.get('quantity')?.invalid && productForm.get('quantity')?.touched"
                />
                <span class="error-message" *ngIf="productForm.get('quantity')?.invalid && productForm.get('quantity')?.touched">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="12" y1="8" x2="12" y2="12" stroke="white" stroke-width="2"/>
                    <circle cx="12" cy="16" r="1" fill="white"/>
                  </svg>
                  Valid quantity is required
                </span>
              </div>
            </div>
          </div>

          <!-- Product Details Section -->
          <div class="form-section">
            <div class="section-header">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/>
                <line x1="7" y1="7" x2="7.01" y2="7"/>
              </svg>
              <h2>Product Details</h2>
            </div>

            <div class="fields-grid">
              <div class="form-field">
                <label for="category_id">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M3 3h7v7H3z"/>
                    <path d="M14 3h7v7h-7z"/>
                  </svg>
                  Category
                </label>
                <select id="category_id" formControlName="category_id">
                  <option value="">Select Category</option>
                  <option *ngFor="let category of categories" [value]="category.id">
                    {{ category.name }}
                  </option>
                </select>
              </div>

              <div class="form-field">
                <label for="brand_id">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/>
                  </svg>
                  Brand
                </label>
                <select id="brand_id" formControlName="brand_id">
                  <option value="">Select Brand</option>
                  <option *ngFor="let brand of brands" [value]="brand.id">{{ brand.name }}</option>
                </select>
              </div>

              <div class="form-field">
                <label for="gender_id">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                  Gender
                </label>
                <select id="gender_id" formControlName="gender_id">
                  <option value="">Select Gender</option>
                  <option *ngFor="let gender of genders" [value]="gender.id">{{ gender.name }}</option>
                </select>
              </div>

              <div class="form-field">
                <label for="size_id">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                  </svg>
                  Size
                </label>
                <select id="size_id" formControlName="size_id">
                  <option value="">Select Size</option>
                  <option *ngFor="let size of sizes" [value]="size.id">{{ size.name }}</option>
                </select>
              </div>

              <div class="form-field">
                <label for="color_id">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M12 2a7 7 0 1 0 10 10"/>
                  </svg>
                  Color
                </label>
                <select id="color_id" formControlName="color_id">
                  <option value="">Select Color</option>
                  <option *ngFor="let color of colors" [value]="color.id">{{ color.name }}</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Image & Status Section -->
          <div class="form-section">
            <div class="section-header">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                <circle cx="8.5" cy="8.5" r="1.5"/>
                <polyline points="21 15 16 10 5 21"/>
              </svg>
              <h2>Media & Status</h2>
            </div>

            <div class="fields-grid">
              <div class="form-field full-width">
                <label for="image_url">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                    <polyline points="7 10 12 15 17 10"/>
                    <line x1="12" y1="15" x2="12" y2="3"/>
                  </svg>
                  Image URL
                </label>
                <input
                  type="text"
                  id="image_url"
                  formControlName="image_url"
                  placeholder="https://example.com/image.jpg"
                />
                <span class="field-hint">Enter a valid image URL for the product</span>
              </div>

              <div class="form-field" *ngIf="isEditMode">
                <label class="checkbox-label">
                  <input type="checkbox" formControlName="is_active" />
                  <span class="checkbox-custom"></span>
                  <span class="checkbox-text">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                    Product is Active
                  </span>
                </label>
                <span class="field-hint">Active products are visible to customers</span>
              </div>
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

          <!-- Form Actions -->
          <div class="form-actions">
            <button
              type="submit"
              class="btn-submit"
              [disabled]="productForm.invalid || isLoading"
            >
              <span *ngIf="!isLoading">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                {{ isEditMode ? 'Update Product' : 'Create Product' }}
              </span>
              <span *ngIf="isLoading" class="loading-content">
                <span class="spinner"></span>
                Saving...
              </span>
            </button>

            <a routerLink="/products" class="btn-cancel">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
              Cancel
            </a>
          </div>
        </form>
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

    .form-container {
      padding: 32px 40px;
      max-width: 1200px;
      margin: 0 auto;
      animation: fadeIn 0.6s ease-out;
    }

    /* Page Header */
    .page-header {
      margin-bottom: 32px;
    }

    .back-link {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      color: rgba(255, 255, 255, 0.7);
      text-decoration: none;
      font-size: 14px;
      font-weight: 600;
      margin-bottom: 16px;
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

    /* Form Card */
    .form-card {
      background: rgba(255, 255, 255, 0.05);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 20px;
      padding: 32px;
    }

    /* Form Sections */
    .form-section {
      margin-bottom: 32px;
    }

    .form-section:last-of-type {
      margin-bottom: 24px;
    }

    .section-header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 24px;
      padding-bottom: 16px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }

    .section-header svg {
      width: 22px;
      height: 22px;
      stroke-width: 2;
      color: #00d4ff;
    }

    .section-header h2 {
      font-size: 20px;
      font-weight: 700;
      color: white;
      margin: 0;
    }

    /* Fields Grid */
    .fields-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 24px;
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
      display: flex;
      align-items: center;
      gap: 8px;
      color: rgba(255, 255, 255, 0.8);
      font-size: 14px;
      font-weight: 600;
      letter-spacing: 0.3px;
    }

    .form-field label svg {
      width: 16px;
      height: 16px;
      stroke-width: 2;
      color: #00d4ff;
    }

    .required-indicator {
      width: 6px;
      height: 6px;
      background: #00d4ff;
      border-radius: 50%;
      display: inline-block;
      margin-left: 2px;
    }

    .form-field input,
    .form-field select,
    .form-field textarea {
      padding: 14px 16px;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 12px;
      color: white;
      font-size: 15px;
      transition: all 0.3s;
      font-family: inherit;
    }

    .form-field input::placeholder,
    .form-field textarea::placeholder {
      color: rgba(255, 255, 255, 0.4);
    }

    .form-field input:focus,
    .form-field select:focus,
    .form-field textarea:focus {
      outline: none;
      background: rgba(255, 255, 255, 0.08);
      border-color: rgba(0, 212, 255, 0.4);
      box-shadow: 0 0 0 3px rgba(0, 212, 255, 0.1);
    }

    .form-field input.invalid,
    .form-field select.invalid,
    .form-field textarea.invalid {
      border-color: rgba(239, 68, 68, 0.4);
      background: rgba(239, 68, 68, 0.05);
    }

    .form-field select option {
      background: #1a1a2e;
      color: white;
    }

    .form-field textarea {
      resize: vertical;
      min-height: 100px;
    }

    /* Input with Icon */
    .input-with-icon {
      position: relative;
    }

    .input-icon {
      position: absolute;
      left: 16px;
      top: 50%;
      transform: translateY(-50%);
      color: rgba(255, 255, 255, 0.5);
      font-weight: 600;
      font-size: 16px;
      pointer-events: none;
    }

    .input-with-icon input {
      padding-left: 40px;
    }

    /* Checkbox */
    .checkbox-label {
      display: flex;
      align-items: center;
      gap: 12px;
      cursor: pointer;
      padding: 14px 16px;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 12px;
      transition: all 0.3s;
    }

    .checkbox-label:hover {
      background: rgba(255, 255, 255, 0.08);
      border-color: rgba(0, 212, 255, 0.3);
    }

    .checkbox-label input[type="checkbox"] {
      display: none;
    }

    .checkbox-custom {
      width: 20px;
      height: 20px;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-radius: 6px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s;
      flex-shrink: 0;
    }

    .checkbox-label input[type="checkbox"]:checked + .checkbox-custom {
      background: linear-gradient(135deg, #0099ff, #00d4ff);
      border-color: transparent;
    }

    .checkbox-label input[type="checkbox"]:checked + .checkbox-custom::after {
      content: '✓';
      color: white;
      font-size: 14px;
      font-weight: 700;
    }

    .checkbox-text {
      display: flex;
      align-items: center;
      gap: 8px;
      color: white;
      font-weight: 600;
      font-size: 15px;
    }

    .checkbox-text svg {
      width: 16px;
      height: 16px;
      stroke-width: 2.5;
      color: #00d4ff;
    }

    /* Error Message */
    .error-message {
      display: flex;
      align-items: center;
      gap: 6px;
      color: #ef4444;
      font-size: 13px;
      font-weight: 500;
    }

    .error-message svg {
      width: 16px;
      height: 16px;
      flex-shrink: 0;
    }

    .global-error {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 14px 18px;
      background: rgba(239, 68, 68, 0.1);
      border: 1px solid rgba(239, 68, 68, 0.3);
      border-radius: 12px;
      color: #ef4444;
      font-size: 14px;
      font-weight: 500;
      margin-bottom: 24px;
    }

    .global-error svg {
      width: 20px;
      height: 20px;
      flex-shrink: 0;
    }

    /* Field Hint */
    .field-hint {
      color: rgba(255, 255, 255, 0.5);
      font-size: 12px;
      font-style: italic;
    }

    /* Form Actions */
    .form-actions {
      display: flex;
      gap: 12px;
      padding-top: 24px;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
    }

    .btn-submit,
    .btn-cancel {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      padding: 14px 28px;
      border: none;
      border-radius: 12px;
      font-weight: 600;
      font-size: 15px;
      cursor: pointer;
      text-decoration: none;
      transition: all 0.3s;
    }

    .btn-submit {
      background: linear-gradient(135deg, #0099ff, #00d4ff);
      color: white;
      box-shadow: 0 4px 16px rgba(0, 153, 255, 0.3);
      flex: 1;
    }

    .btn-submit:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(0, 153, 255, 0.4);
    }

    .btn-submit:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .btn-submit svg {
      width: 18px;
      height: 18px;
      stroke-width: 2.5;
    }

    .loading-content {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .spinner {
      width: 18px;
      height: 18px;
      border: 3px solid rgba(255, 255, 255, 0.3);
      border-top-color: white;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    .btn-cancel {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.2);
      color: white;
    }

    .btn-cancel:hover {
      background: rgba(255, 255, 255, 0.1);
      border-color: rgba(255, 255, 255, 0.3);
    }

    .btn-cancel svg {
      width: 16px;
      height: 16px;
      stroke-width: 2.5;
    }

    /* Responsive */
    @media (max-width: 768px) {
      .form-container {
        padding: 20px;
      }

      .header-content h1 {
        font-size: 28px;
      }

      .form-card {
        padding: 24px;
      }

      .fields-grid {
        grid-template-columns: 1fr;
      }

      .form-actions {
        flex-direction: column;
      }

      .btn-submit,
      .btn-cancel {
        width: 100%;
      }
    }
  `]
})
export class ProductFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private productService = inject(ProductService);
  private refDataService = inject(ReferenceDataService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  productForm: FormGroup;
  isEditMode = false;
  isLoading = false;
  errorMessage = '';
  productId: number | null = null;

  categories: Category[] = [];
  brands: Brand[] = [];
  genders: Gender[] = [];
  colors: Color[] = [];
  sizes: Size[] = [];

  constructor() {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      price: [0, [Validators.required, Validators.min(0)]],
      quantity: [0, [Validators.required, Validators.min(0)]],
      category_id: [''],
      brand_id: [''],
      gender_id: [''],
      color_id: [''],
      size_id: [''],
      image_url: [''],
      is_active: [true],
    });
  }

  ngOnInit(): void {
    this.loadReferenceData();

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.productId = Number(id);
      this.loadProduct(this.productId);
    }
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

  loadProduct(id: number): void {
    this.productService.getProductById(id).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.productForm.patchValue(response.data);
        }
      },
      error: (error) => console.error('Error loading product:', error),
    });
  }

  onSubmit(): void {
    if (this.productForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      const productData = this.productForm.value;

      Object.keys(productData).forEach((key) => {
        if (productData[key] === '') {
          productData[key] = null;
        }
      });

      const request =
        this.isEditMode && this.productId
          ? this.productService.updateProduct(this.productId, productData)
          : this.productService.createProduct(productData);

      request.subscribe({
        next: (response) => {
          this.isLoading = false;
          if (response.success) {
            this.router.navigate(['/products']);
          }
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = error.error?.message || 'An error occurred';
        },
      });
    }
  }
}
