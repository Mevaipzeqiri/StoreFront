import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { OrderService } from '../../../core/services/order.service';
import { ClientService } from '../../../core/services/client.service';
import { ProductService } from '../../../core/services/product.service';
import { Client } from '../../../core/models/client.model';
import { Product } from '../../../core/models/product.model';

@Component({
  selector: 'app-order-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="form-container">
      <!-- Page Header -->
      <div class="page-header">
        <div class="header-content">
          <a routerLink="/orders" class="back-link">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
            Back to Orders
          </a>
          <h1>Create New Order</h1>
          <p class="subtitle">Add order details and items to create a new customer order</p>
        </div>
      </div>

      <!-- Form Card -->
      <div class="form-card">
        <form [formGroup]="orderForm" (ngSubmit)="onSubmit()">
          <!-- Client Selection -->
          <div class="form-section">
            <div class="section-header">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
              <h2>Client Information</h2>
            </div>

            <div class="form-field">
              <label for="client_id">
                Select Client *
                <span class="required-indicator"></span>
              </label>
              <select id="client_id" formControlName="client_id">
                <option value="">Choose a client...</option>
                <option *ngFor="let client of clients" [value]="client.id">
                  {{ client.first_name }} {{ client.last_name }} - {{ client.email }}
                </option>
              </select>
              <span class="field-hint">Select the client for this order</span>
            </div>
          </div>

          <!-- Order Items -->
          <div class="form-section">
            <div class="section-header">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx="9" cy="21" r="1"/>
                <circle cx="20" cy="21" r="1"/>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
              </svg>
              <h2>Order Items</h2>
              <button type="button" class="btn-add-item" (click)="addItem()">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="8" x2="12" y2="16"/>
                  <line x1="8" y1="12" x2="16" y2="12"/>
                </svg>
                Add Item
              </button>
            </div>

            <div class="items-list" formArrayName="items">
              <div *ngFor="let item of items.controls; let i = index" [formGroupName]="i" class="item-card">
                <div class="item-header">
                  <span class="item-number">Item #{{ i + 1 }}</span>
                  <button type="button" class="btn-remove-item" (click)="removeItem(i)" [disabled]="items.length === 1">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <polyline points="3 6 5 6 21 6"/>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                    </svg>
                  </button>
                </div>

                <div class="item-fields">
                  <div class="form-field">
                    <label>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                      </svg>
                      Product *
                    </label>
                    <select formControlName="product_id">
                      <option value="">Select product...</option>
                      <option *ngFor="let product of products" [value]="product.id">
                        {{ product.name }} - \${{ product.price.toFixed(2) }}
                      </option>
                    </select>
                  </div>

                  <div class="form-field">
                    <label>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M9 11l3 3L22 4"/>
                        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
                      </svg>
                      Quantity *
                    </label>
                    <input type="number" formControlName="quantity" min="1" placeholder="1" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Shipping Information -->
          <div class="form-section">
            <div class="section-header">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <rect x="1" y="3" width="15" height="13"/>
                <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/>
                <circle cx="5.5" cy="18.5" r="2.5"/>
                <circle cx="18.5" cy="18.5" r="2.5"/>
              </svg>
              <h2>Shipping Information</h2>
            </div>

            <div class="form-field">
              <label for="shipping_address">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
                Shipping Address *
                <span class="required-indicator"></span>
              </label>
              <textarea id="shipping_address" formControlName="shipping_address" rows="3" placeholder="Enter complete shipping address..."></textarea>
            </div>

            <div class="form-field">
              <label for="notes">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                  <line x1="16" y1="13" x2="8" y2="13"/>
                  <line x1="16" y1="17" x2="8" y2="17"/>
                </svg>
                Order Notes
              </label>
              <textarea id="notes" formControlName="notes" rows="3" placeholder="Add any additional notes or special instructions..."></textarea>
              <span class="field-hint">Optional notes about the order</span>
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
            <button type="submit" class="btn-submit" [disabled]="orderForm.invalid || isLoading">
              <span *ngIf="!isLoading">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                Create Order
              </span>
              <span *ngIf="isLoading" class="loading-content">
                <span class="spinner"></span>
                Creating order...
              </span>
            </button>

            <a routerLink="/orders" class="btn-cancel">
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

    .section-header svg:first-child {
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
      flex: 1;
    }

    .btn-add-item {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 16px;
      background: rgba(0, 212, 255, 0.15);
      border: 1px solid rgba(0, 212, 255, 0.3);
      border-radius: 10px;
      color: #00d4ff;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s;
    }

    .btn-add-item:hover {
      background: rgba(0, 212, 255, 0.25);
      transform: translateY(-2px);
    }

    .btn-add-item svg {
      width: 16px;
      height: 16px;
      stroke-width: 2.5;
    }

    /* Form Fields */
    .form-field {
      display: flex;
      flex-direction: column;
      gap: 8px;
      margin-bottom: 20px;
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

    .form-field select option {
      background: #1a1a2e;
      color: white;
    }

    .form-field textarea {
      resize: vertical;
      min-height: 80px;
    }

    .field-hint {
      color: rgba(255, 255, 255, 0.5);
      font-size: 12px;
      font-style: italic;
    }

    /* Items List */
    .items-list {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .item-card {
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 14px;
      padding: 20px;
    }

    .item-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
      padding-bottom: 12px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    }

    .item-number {
      font-size: 14px;
      font-weight: 700;
      color: #00d4ff;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .btn-remove-item {
      width: 32px;
      height: 32px;
      background: rgba(239, 68, 68, 0.15);
      border: 1px solid rgba(239, 68, 68, 0.3);
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.3s;
    }

    .btn-remove-item:hover:not(:disabled) {
      background: rgba(239, 68, 68, 0.25);
      transform: scale(1.05);
    }

    .btn-remove-item:disabled {
      opacity: 0.3;
      cursor: not-allowed;
    }

    .btn-remove-item svg {
      width: 16px;
      height: 16px;
      stroke-width: 2;
      color: #ef4444;
    }

    .item-fields {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 16px;
    }

    /* Error Message */
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

      .item-fields {
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
export class OrderFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private orderService = inject(OrderService);
  private clientService = inject(ClientService);
  private productService = inject(ProductService);
  private router = inject(Router);

  orderForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  clients: Client[] = [];
  products: Product[] = [];

  constructor() {
    this.orderForm = this.fb.group({
      client_id: ['', Validators.required],
      items: this.fb.array([]),
      shipping_address: ['', Validators.required],
      notes: [''],
    });
  }

  get items(): FormArray {
    return this.orderForm.get('items') as FormArray;
  }

  ngOnInit(): void {
    this.loadClients();
    this.loadProducts();
    this.addItem();
  }

  loadClients(): void {
    this.clientService.getAllClients(1, 100).subscribe({
      next: (response) => {
        if (response.success) {
          this.clients = response.data || [];
        }
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

  addItem(): void {
    const itemGroup = this.fb.group({
      product_id: ['', Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]],
    });
    this.items.push(itemGroup);
  }

  removeItem(index: number): void {
    this.items.removeAt(index);
  }

  onSubmit(): void {
    if (this.orderForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      this.orderService.createOrder(this.orderForm.value).subscribe({
        next: (response) => {
          this.isLoading = false;
          if (response.success) {
            this.router.navigate(['/orders']);
          }
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = error.error?.message || 'Failed to create order';
        },
      });
    }
  }
}
