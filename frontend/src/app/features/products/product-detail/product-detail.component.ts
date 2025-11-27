import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProductService } from '../../../core/services/product.service';
import { Product, ProductQuantity } from '../../../core/models/product.model';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="detail-container" *ngIf="product">
      <!-- Page Header -->
      <div class="page-header">
        <div class="header-navigation">
          <a routerLink="/products" class="back-link">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
            Back to Products
          </a>
        </div>

        <div class="header-actions">
          <a [routerLink]="['/products', product.id, 'edit']" class="btn-edit">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
            Edit Product
          </a>
        </div>
      </div>

      <!-- Product Content -->
      <div class="product-layout">
        <!-- Product Image Section -->
        <div class="image-section">
          <div class="image-card">
            <div
              class="product-image"
              [style.background-image]="product.image_url ? 'url(' + product.image_url + ')' : 'none'"
            >
              <div class="image-overlay">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                  <circle cx="8.5" cy="8.5" r="1.5"/>
                  <polyline points="21 15 16 10 5 21"/>
                </svg>
              </div>
            </div>
            <div class="status-indicator" [class.active]="product.is_active">
              <span class="status-dot"></span>
              <span class="status-text">{{ product.is_active ? 'Active' : 'Inactive' }}</span>
            </div>
          </div>
        </div>

        <!-- Product Info Section -->
        <div class="info-section">
          <!-- Product Title -->
          <div class="title-card">
            <h1>{{ product.name }}</h1>
            <div class="price-badge">
              <span class="price-label">Price</span>
              <span class="price-value">\${{ product.price.toFixed(2) }}</span>
            </div>
          </div>

          <!-- Description -->
          <div class="info-card" *ngIf="product.description">
            <div class="card-header">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
                <line x1="16" y1="13" x2="8" y2="13"/>
                <line x1="16" y1="17" x2="8" y2="17"/>
                <polyline points="10 9 9 9 8 9"/>
              </svg>
              <h2>Description</h2>
            </div>
            <p class="description-text">{{ product.description }}</p>
          </div>

          <!-- Inventory Stats -->
          <div class="stats-grid">
            <div class="stat-box">
              <div class="stat-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                </svg>
              </div>
              <div class="stat-content">
                <span class="stat-label">Initial Stock</span>
                <span class="stat-value">{{ product.quantity }}</span>
              </div>
            </div>

            <div class="stat-box" *ngIf="productQuantity">
              <div class="stat-icon primary">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
                </svg>
              </div>
              <div class="stat-content">
                <span class="stat-label">Current Stock</span>
                <span class="stat-value highlight">{{ productQuantity.current_quantity }}</span>
              </div>
            </div>

            <div class="stat-box" *ngIf="productQuantity">
              <div class="stat-icon success">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
                  <polyline points="17 6 23 6 23 12"/>
                </svg>
              </div>
              <div class="stat-content">
                <span class="stat-label">Sold</span>
                <span class="stat-value">{{ productQuantity.sold_quantity }}</span>
              </div>
            </div>
          </div>

          <!-- Product Details -->
          <div class="info-card">
            <div class="card-header">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/>
                <line x1="7" y1="7" x2="7.01" y2="7"/>
              </svg>
              <h2>Product Details</h2>
            </div>
            <div class="details-grid">
              <div class="detail-item" *ngIf="product.category_name">
                <span class="detail-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M3 3h7v7H3z"/>
                    <path d="M14 3h7v7h-7z"/>
                  </svg>
                </span>
                <div class="detail-content">
                  <span class="detail-label">Category</span>
                  <span class="detail-value">{{ product.category_name }}</span>
                </div>
              </div>

              <div class="detail-item" *ngIf="product.brand_name">
                <span class="detail-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/>
                  </svg>
                </span>
                <div class="detail-content">
                  <span class="detail-label">Brand</span>
                  <span class="detail-value">{{ product.brand_name }}</span>
                </div>
              </div>

              <div class="detail-item" *ngIf="product.gender_name">
                <span class="detail-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                </span>
                <div class="detail-content">
                  <span class="detail-label">Gender</span>
                  <span class="detail-value">{{ product.gender_name }}</span>
                </div>
              </div>

              <div class="detail-item" *ngIf="product.size_name">
                <span class="detail-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                  </svg>
                </span>
                <div class="detail-content">
                  <span class="detail-label">Size</span>
                  <span class="detail-value">{{ product.size_name }}</span>
                </div>
              </div>

              <div class="detail-item" *ngIf="product.color_name">
                <span class="detail-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M12 2a7 7 0 1 0 10 10"/>
                  </svg>
                </span>
                <div class="detail-content">
                  <span class="detail-label">Color</span>
                  <span class="detail-value">{{ product.color_name }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Timestamps -->
          <div class="info-card">
            <div class="card-header">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
              </svg>
              <h2>Timeline</h2>
            </div>
            <div class="timeline">
              <div class="timeline-item">
                <div class="timeline-marker"></div>
                <div class="timeline-content">
                  <span class="timeline-label">Created</span>
                  <span class="timeline-value">{{ product.created_at | date : 'medium' }}</span>
                </div>
              </div>
              <div class="timeline-item">
                <div class="timeline-marker"></div>
                <div class="timeline-content">
                  <span class="timeline-label">Last Updated</span>
                  <span class="timeline-value">{{ product.updated_at | date : 'medium' }}</span>
                </div>
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
      display: flex;
      justify-content: space-between;
      align-items: center;
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

    .btn-edit {
      display: inline-flex;
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
    }

    .btn-edit:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(0, 153, 255, 0.4);
    }

    .btn-edit svg {
      width: 18px;
      height: 18px;
      stroke-width: 2;
    }

    /* Product Layout */
    .product-layout {
      display: grid;
      grid-template-columns: 500px 1fr;
      gap: 32px;
    }

    /* Image Section */
    .image-section {
      animation: fadeIn 0.6s ease-out 0.1s backwards;
    }

    .image-card {
      position: sticky;
      top: 32px;
      background: rgba(255, 255, 255, 0.05);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 20px;
      overflow: hidden;
    }

    .product-image {
      height: 500px;
      background: linear-gradient(135deg, rgba(0, 153, 255, 0.3), rgba(0, 212, 255, 0.2));
      background-size: cover;
      background-position: center;
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .image-overlay {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;
    }

    .image-overlay svg {
      width: 80px;
      height: 80px;
      stroke-width: 1;
      color: rgba(255, 255, 255, 0.3);
    }

    .status-indicator {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 16px 20px;
      background: rgba(255, 255, 255, 0.05);
      border-top: 1px solid rgba(255, 255, 255, 0.1);
    }

    .status-dot {
      width: 10px;
      height: 10px;
      background: #e74c3c;
      border-radius: 50%;
      flex-shrink: 0;
      box-shadow: 0 0 12px rgba(231, 76, 60, 0.5);
    }

    .status-indicator.active .status-dot {
      background: #27ae60;
      box-shadow: 0 0 12px rgba(39, 174, 96, 0.5);
      animation: pulse 2s infinite;
    }

    .status-text {
      color: white;
      font-weight: 600;
      font-size: 14px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    /* Info Section */
    .info-section {
      display: flex;
      flex-direction: column;
      gap: 24px;
      animation: fadeIn 0.6s ease-out 0.2s backwards;
    }

    .title-card {
      background: rgba(255, 255, 255, 0.05);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 20px;
      padding: 32px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 24px;
    }

    .title-card h1 {
      font-size: 36px;
      font-weight: 700;
      color: white;
      margin: 0;
      letter-spacing: -0.5px;
    }

    .price-badge {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 4px;
      padding: 16px 24px;
      background: linear-gradient(135deg, rgba(0, 153, 255, 0.2), rgba(0, 212, 255, 0.1));
      border: 1px solid rgba(0, 212, 255, 0.3);
      border-radius: 14px;
    }

    .price-label {
      font-size: 12px;
      font-weight: 600;
      color: rgba(255, 255, 255, 0.6);
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .price-value {
      font-size: 32px;
      font-weight: 800;
      background: linear-gradient(135deg, #0099ff, #00d4ff);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    /* Info Card */
    .info-card {
      background: rgba(255, 255, 255, 0.05);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 20px;
      padding: 28px;
    }

    .card-header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 20px;
      padding-bottom: 16px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }

    .card-header svg {
      width: 22px;
      height: 22px;
      stroke-width: 2;
      color: #00d4ff;
    }

    .card-header h2 {
      font-size: 20px;
      font-weight: 700;
      color: white;
      margin: 0;
    }

    .description-text {
      color: rgba(255, 255, 255, 0.7);
      font-size: 15px;
      line-height: 1.7;
      margin: 0;
    }

    /* Stats Grid */
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 16px;
    }

    .stat-box {
      background: rgba(255, 255, 255, 0.05);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 16px;
      padding: 20px;
      display: flex;
      flex-direction: column;
      gap: 12px;
      transition: all 0.3s;
    }

    .stat-box:hover {
      transform: translateY(-4px);
      border-color: rgba(0, 212, 255, 0.3);
      box-shadow: 0 8px 24px rgba(0, 153, 255, 0.15);
    }

    .stat-icon {
      width: 44px;
      height: 44px;
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .stat-icon.primary {
      background: rgba(0, 153, 255, 0.2);
      border-color: rgba(0, 212, 255, 0.3);
    }

    .stat-icon.success {
      background: rgba(39, 174, 96, 0.2);
      border-color: rgba(39, 174, 96, 0.3);
    }

    .stat-icon svg {
      width: 22px;
      height: 22px;
      stroke-width: 2;
      color: white;
    }

    .stat-icon.primary svg {
      color: #00d4ff;
    }

    .stat-icon.success svg {
      color: #27ae60;
    }

    .stat-content {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .stat-label {
      font-size: 12px;
      font-weight: 600;
      color: rgba(255, 255, 255, 0.6);
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .stat-value {
      font-size: 28px;
      font-weight: 800;
      color: white;
    }

    .stat-value.highlight {
      background: linear-gradient(135deg, #0099ff, #00d4ff);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    /* Details Grid */
    .details-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 16px;
    }

    .detail-item {
      display: flex;
      align-items: center;
      gap: 14px;
      padding: 16px;
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 12px;
      transition: all 0.3s;
    }

    .detail-item:hover {
      background: rgba(255, 255, 255, 0.05);
      border-color: rgba(0, 212, 255, 0.2);
    }

    .detail-icon {
      width: 40px;
      height: 40px;
      background: rgba(0, 212, 255, 0.1);
      border: 1px solid rgba(0, 212, 255, 0.2);
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .detail-icon svg {
      width: 18px;
      height: 18px;
      stroke-width: 2;
      color: #00d4ff;
    }

    .detail-content {
      display: flex;
      flex-direction: column;
      gap: 4px;
      flex: 1;
    }

    .detail-label {
      font-size: 12px;
      font-weight: 600;
      color: rgba(255, 255, 255, 0.5);
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .detail-value {
      font-size: 15px;
      font-weight: 600;
      color: white;
    }

    /* Timeline */
    .timeline {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .timeline-item {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .timeline-marker {
      width: 12px;
      height: 12px;
      background: linear-gradient(135deg, #0099ff, #00d4ff);
      border-radius: 50%;
      flex-shrink: 0;
      box-shadow: 0 0 12px rgba(0, 212, 255, 0.5);
    }

    .timeline-content {
      display: flex;
      flex-direction: column;
      gap: 4px;
      flex: 1;
      padding: 12px 16px;
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 10px;
    }

    .timeline-label {
      font-size: 12px;
      font-weight: 600;
      color: rgba(255, 255, 255, 0.5);
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .timeline-value {
      font-size: 14px;
      font-weight: 600;
      color: white;
    }

    /* Responsive */
    @media (max-width: 1200px) {
      .product-layout {
        grid-template-columns: 1fr;
      }

      .image-card {
        position: relative;
        top: 0;
      }

      .stats-grid {
        grid-template-columns: 1fr;
      }
    }

    @media (max-width: 768px) {
      .detail-container {
        padding: 20px;
      }

      .page-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 16px;
      }

      .title-card {
        flex-direction: column;
        align-items: flex-start;
      }

      .price-badge {
        align-items: flex-start;
        width: 100%;
      }

      .details-grid {
        grid-template-columns: 1fr;
      }

      .product-image {
        height: 300px;
      }
    }
  `]
})
export class ProductDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private productService = inject(ProductService);

  product: Product | null = null;
  productQuantity: ProductQuantity | null = null;

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.loadProduct(id);
      this.loadProductQuantity(id);
    }
  }

  loadProduct(id: number): void {
    this.productService.getProductById(id).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.product = response.data;
        }
      },
      error: (error) => console.error('Error loading product:', error),
    });
  }

  loadProductQuantity(id: number): void {
    this.productService.getProductQuantity(id).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.productQuantity = response.data;
        }
      },
      error: (error) => console.error('Error loading product quantity:', error),
    });
  }
}
