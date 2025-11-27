import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ClientService } from '../../../core/services/client.service';

@Component({
  selector: 'app-client-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="form-container">
      <!-- Page Header -->
      <div class="page-header">
        <div class="header-content">
          <a routerLink="/clients" class="back-link">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
            Back to Clients
          </a>
          <h1>{{ isEditMode ? 'Edit Client' : 'Add New Client' }}</h1>
          <p class="subtitle">{{ isEditMode ? 'Update client information' : 'Register a new customer in your system' }}</p>
        </div>
      </div>

      <!-- Form Card -->
      <div class="form-card">
        <form [formGroup]="clientForm" (ngSubmit)="onSubmit()">
          <!-- Personal Information Section -->
          <div class="form-section">
            <div class="section-header">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
              <h2>Personal Information</h2>
            </div>

            <div class="fields-grid">
              <div class="form-field">
                <label for="first_name">
                  First Name *
                  <span class="required-indicator"></span>
                </label>
                <input
                  type="text"
                  id="first_name"
                  formControlName="first_name"
                  placeholder="Enter first name"
                  [class.invalid]="clientForm.get('first_name')?.invalid && clientForm.get('first_name')?.touched"
                />
                <span class="error-message" *ngIf="clientForm.get('first_name')?.invalid && clientForm.get('first_name')?.touched">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="12" y1="8" x2="12" y2="12" stroke="white" stroke-width="2"/>
                    <circle cx="12" cy="16" r="1" fill="white"/>
                  </svg>
                  First name is required
                </span>
              </div>

              <div class="form-field">
                <label for="last_name">
                  Last Name *
                  <span class="required-indicator"></span>
                </label>
                <input
                  type="text"
                  id="last_name"
                  formControlName="last_name"
                  placeholder="Enter last name"
                  [class.invalid]="clientForm.get('last_name')?.invalid && clientForm.get('last_name')?.touched"
                />
                <span class="error-message" *ngIf="clientForm.get('last_name')?.invalid && clientForm.get('last_name')?.touched">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="12" y1="8" x2="12" y2="12" stroke="white" stroke-width="2"/>
                    <circle cx="12" cy="16" r="1" fill="white"/>
                  </svg>
                  Last name is required
                </span>
              </div>
            </div>
          </div>

          <!-- Contact Information Section -->
          <div class="form-section">
            <div class="section-header">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
              </svg>
              <h2>Contact Information</h2>
            </div>

            <div class="fields-grid">
              <div class="form-field">
                <label for="email">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                  </svg>
                  Email *
                  <span class="required-indicator"></span>
                </label>
                <input
                  type="email"
                  id="email"
                  formControlName="email"
                  placeholder="client@example.com"
                  [class.invalid]="clientForm.get('email')?.invalid && clientForm.get('email')?.touched"
                />
                <span class="error-message" *ngIf="clientForm.get('email')?.invalid && clientForm.get('email')?.touched">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="12" y1="8" x2="12" y2="12" stroke="white" stroke-width="2"/>
                    <circle cx="12" cy="16" r="1" fill="white"/>
                  </svg>
                  Valid email is required
                </span>
              </div>

              <div class="form-field">
                <label for="phone">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                  </svg>
                  Phone Number
                </label>
                <input
                  type="text"
                  id="phone"
                  formControlName="phone"
                  placeholder="+1 (555) 000-0000"
                />
              </div>
            </div>
          </div>

          <!-- Address Information Section -->
          <div class="form-section">
            <div class="section-header">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
              <h2>Address Information</h2>
            </div>

            <div class="fields-grid">
              <div class="form-field full-width">
                <label for="address">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                    <polyline points="9 22 9 12 15 12 15 22"/>
                  </svg>
                  Street Address
                </label>
                <input
                  type="text"
                  id="address"
                  formControlName="address"
                  placeholder="123 Main Street"
                />
              </div>

              <div class="form-field">
                <label for="city">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                  </svg>
                  City
                </label>
                <input
                  type="text"
                  id="city"
                  formControlName="city"
                  placeholder="City name"
                />
              </div>

              <div class="form-field">
                <label for="postal_code">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                    <line x1="8" y1="12" x2="16" y2="12"/>
                  </svg>
                  Postal Code
                </label>
                <input
                  type="text"
                  id="postal_code"
                  formControlName="postal_code"
                  placeholder="12345"
                />
              </div>

              <div class="form-field full-width">
                <label for="country">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="2" y1="12" x2="22" y2="12"/>
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                  </svg>
                  Country
                </label>
                <input
                  type="text"
                  id="country"
                  formControlName="country"
                  placeholder="United States"
                />
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
              [disabled]="clientForm.invalid || isLoading"
            >
              <span *ngIf="!isLoading">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                {{ isEditMode ? 'Update Client' : 'Create Client' }}
              </span>
              <span *ngIf="isLoading" class="loading-content">
                <span class="spinner"></span>
                Saving...
              </span>
            </button>

            <a routerLink="/clients" class="btn-cancel">
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

    .form-field input {
      padding: 14px 16px;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 12px;
      color: white;
      font-size: 15px;
      transition: all 0.3s;
      font-family: inherit;
    }

    .form-field input::placeholder {
      color: rgba(255, 255, 255, 0.4);
    }

    .form-field input:focus {
      outline: none;
      background: rgba(255, 255, 255, 0.08);
      border-color: rgba(0, 212, 255, 0.4);
      box-shadow: 0 0 0 3px rgba(0, 212, 255, 0.1);
    }

    .form-field input.invalid {
      border-color: rgba(239, 68, 68, 0.4);
      background: rgba(239, 68, 68, 0.05);
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
export class ClientFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private clientService = inject(ClientService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  clientForm: FormGroup;
  isEditMode = false;
  isLoading = false;
  errorMessage = '';
  clientId: number | null = null;

  constructor() {
    this.clientForm = this.fb.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      address: [''],
      city: [''],
      postal_code: [''],
      country: [''],
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.clientId = Number(id);
      this.loadClient(this.clientId);
    }
  }

  loadClient(id: number): void {
    this.clientService.getClientById(id).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.clientForm.patchValue(response.data);
        }
      },
      error: (error) => console.error('Error loading client:', error),
    });
  }

  onSubmit(): void {
    if (this.clientForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      const request =
        this.isEditMode && this.clientId
          ? this.clientService.updateClient(this.clientId, this.clientForm.value)
          : this.clientService.createClient(this.clientForm.value);

      request.subscribe({
        next: (response) => {
          this.isLoading = false;
          if (response.success) {
            this.router.navigate(['/clients']);
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
