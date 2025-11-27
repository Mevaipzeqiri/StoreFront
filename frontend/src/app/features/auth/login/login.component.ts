import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="auth-container">
      <div class="background-shapes">
        <div class="shape shape-1"></div>
        <div class="shape shape-2"></div>
        <div class="shape shape-3"></div>
      </div>

      <div class="auth-card">
        <div class="logo-container">
          <div class="logo">
            <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style="stop-color:#00d4ff;stop-opacity:1" />
                  <stop offset="100%" style="stop-color:#0099ff;stop-opacity:1" />
                </linearGradient>
              </defs>
              <circle cx="50" cy="50" r="45" fill="url(#logoGradient)" opacity="0.1"/>
              <path d="M 30 35 L 50 25 L 70 35 L 70 55 L 50 65 L 30 55 Z"
                    fill="none"
                    stroke="url(#logoGradient)"
                    stroke-width="3"
                    stroke-linejoin="round"/>
              <circle cx="50" cy="45" r="8" fill="url(#logoGradient)"/>
            </svg>
          </div>
        </div>

        <h1>StoreFront</h1>
        <p class="subtitle">Welcome back! Please login to continue</p>

        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label for="email">
              <svg class="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
              Email Address
            </label>
            <input
              type="email"
              id="email"
              formControlName="email"
              class="form-control"
              placeholder="you@example.com"
              [class.invalid]="loginForm.get('email')?.invalid && loginForm.get('email')?.touched"
            />
            <div
              class="error-message"
              *ngIf="loginForm.get('email')?.invalid && loginForm.get('email')?.touched"
            >
              <svg class="error-icon" viewBox="0 0 24 24" fill="currentColor">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12" stroke="white" stroke-width="2"/>
                <circle cx="12" cy="16" r="1" fill="white"/>
              </svg>
              <span *ngIf="loginForm.get('email')?.errors?.['required']">Email is required</span>
              <span *ngIf="loginForm.get('email')?.errors?.['email']">Invalid email format</span>
            </div>
          </div>

          <div class="form-group">
            <label for="password">
              <svg class="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
              Password
            </label>
            <input
              type="password"
              id="password"
              formControlName="password"
              class="form-control"
              placeholder="Enter your password"
              [class.invalid]="
                loginForm.get('password')?.invalid && loginForm.get('password')?.touched
              "
            />
            <div
              class="error-message"
              *ngIf="loginForm.get('password')?.invalid && loginForm.get('password')?.touched"
            >
              <svg class="error-icon" viewBox="0 0 24 24" fill="currentColor">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12" stroke="white" stroke-width="2"/>
                <circle cx="12" cy="16" r="1" fill="white"/>
              </svg>
              <span>Password is required</span>
            </div>
          </div>

          <div class="error-message global-error" *ngIf="errorMessage">
            <svg class="error-icon" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="12" cy="12" r="10"/>
              <line x1="15" y1="9" x2="9" y2="15" stroke="white" stroke-width="2"/>
              <line x1="9" y1="9" x2="15" y2="15" stroke="white" stroke-width="2"/>
            </svg>
            {{ errorMessage }}
          </div>

          <button type="submit" class="btn btn-primary" [disabled]="loginForm.invalid || isLoading">
            <span class="btn-content" *ngIf="!isLoading">
              <span>Sign In</span>
              <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <line x1="5" y1="12" x2="19" y2="12"/>
                <polyline points="12 5 19 12 12 19"/>
              </svg>
            </span>
            <span class="btn-content" *ngIf="isLoading">
              <span class="spinner"></span>
              <span>Signing in...</span>
            </span>
          </button>
        </form>

        <div class="divider">
          <span>or</span>
        </div>

        <div class="auth-footer">
          <p>Don't have an account? <a routerLink="/auth/register">Create one now</a></p>
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

      @keyframes float {
        0%, 100% {
          transform: translateY(0px) rotate(0deg);
        }
        50% {
          transform: translateY(-20px) rotate(5deg);
        }
      }

      @keyframes spin {
        to {
          transform: rotate(360deg);
        }
      }

      @keyframes shimmer {
        0% {
          background-position: -1000px 0;
        }
        100% {
          background-position: 1000px 0;
        }
      }

      .auth-container {
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 100vh;
        background: linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%);
        padding: 20px;
        position: relative;
        overflow: hidden;
      }

      .background-shapes {
        position: absolute;
        width: 100%;
        height: 100%;
        overflow: hidden;
        z-index: 0;
      }

      .shape {
        position: absolute;
        border-radius: 50%;
        filter: blur(60px);
        opacity: 0.3;
        animation: float 6s ease-in-out infinite;
      }

      .shape-1 {
        width: 300px;
        height: 300px;
        background: linear-gradient(135deg, #00d4ff, #0099ff);
        top: -100px;
        left: -100px;
        animation-delay: 0s;
      }

      .shape-2 {
        width: 400px;
        height: 400px;
        background: linear-gradient(135deg, #0099ff, #0066cc);
        bottom: -150px;
        right: -150px;
        animation-delay: 2s;
      }

      .shape-3 {
        width: 250px;
        height: 250px;
        background: linear-gradient(135deg, #00ffcc, #00d4ff);
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        animation-delay: 4s;
      }

      .auth-card {
        background: rgba(255, 255, 255, 0.95);
        backdrop-filter: blur(10px);
        border-radius: 24px;
        padding: 50px 45px;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3),
        0 0 0 1px rgba(255, 255, 255, 0.1);
        width: 100%;
        max-width: 440px;
        position: relative;
        z-index: 1;
        animation: fadeInUp 0.6s ease-out;
      }

      .logo-container {
        display: flex;
        justify-content: center;
        margin-bottom: 20px;
      }

      .logo {
        width: 80px;
        height: 80px;
        animation: float 3s ease-in-out infinite;
      }

      .logo svg {
        width: 100%;
        height: 100%;
        filter: drop-shadow(0 4px 8px rgba(0, 153, 255, 0.3));
      }

      h1 {
        text-align: center;
        background: linear-gradient(135deg, #0099ff, #00d4ff);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        margin-bottom: 8px;
        font-size: 36px;
        font-weight: 700;
        letter-spacing: -1px;
      }

      .subtitle {
        text-align: center;
        color: #64748b;
        margin-bottom: 35px;
        font-size: 15px;
        font-weight: 400;
      }

      .form-group {
        margin-bottom: 24px;
        animation: fadeInUp 0.6s ease-out backwards;
      }

      .form-group:nth-child(1) {
        animation-delay: 0.1s;
      }

      .form-group:nth-child(2) {
        animation-delay: 0.2s;
      }

      label {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 8px;
        color: #1e293b;
        font-weight: 600;
        font-size: 14px;
        letter-spacing: 0.2px;
      }

      .input-icon {
        width: 18px;
        height: 18px;
        stroke-width: 2;
        color: #0099ff;
      }

      .form-control {
        width: 100%;
        padding: 14px 16px;
        border: 2px solid #e2e8f0;
        border-radius: 12px;
        font-size: 15px;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        box-sizing: border-box;
        background: #ffffff;
        color: #1e293b;
      }

      .form-control::placeholder {
        color: #94a3b8;
      }

      .form-control:focus {
        outline: none;
        border-color: #0099ff;
        box-shadow: 0 0 0 4px rgba(0, 153, 255, 0.1);
        transform: translateY(-2px);
      }

      .form-control.invalid {
        border-color: #ef4444;
        background: #fef2f2;
      }

      .form-control.invalid:focus {
        box-shadow: 0 0 0 4px rgba(239, 68, 68, 0.1);
      }

      .error-message {
        display: flex;
        align-items: center;
        gap: 6px;
        color: #ef4444;
        font-size: 13px;
        margin-top: 8px;
        font-weight: 500;
      }

      .error-icon {
        width: 16px;
        height: 16px;
        flex-shrink: 0;
      }

      .global-error {
        background: #fef2f2;
        border: 1px solid #fecaca;
        padding: 12px 14px;
        border-radius: 10px;
        margin-bottom: 20px;
        animation: fadeInUp 0.3s ease-out;
      }

      .btn {
        width: 100%;
        padding: 16px;
        border: none;
        border-radius: 12px;
        font-size: 16px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        margin-top: 10px;
        position: relative;
        overflow: hidden;
        animation: fadeInUp 0.6s ease-out backwards;
        animation-delay: 0.3s;
      }

      .btn-primary {
        background: linear-gradient(135deg, #0099ff, #00d4ff);
        color: white;
        box-shadow: 0 4px 16px rgba(0, 153, 255, 0.3);
      }

      .btn-primary::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(135deg, #00d4ff, #0099ff);
        opacity: 0;
        transition: opacity 0.3s;
      }

      .btn-primary:hover:not(:disabled)::before {
        opacity: 1;
      }

      .btn-primary:hover:not(:disabled) {
        transform: translateY(-2px);
        box-shadow: 0 8px 24px rgba(0, 153, 255, 0.4);
      }

      .btn-primary:active:not(:disabled) {
        transform: translateY(0);
      }

      .btn:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }

      .btn-content {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
        position: relative;
        z-index: 1;
      }

      .btn-icon {
        width: 20px;
        height: 20px;
        stroke-width: 2.5;
        transition: transform 0.3s;
      }

      .btn-primary:hover:not(:disabled) .btn-icon {
        transform: translateX(4px);
      }

      .spinner {
        width: 18px;
        height: 18px;
        border: 3px solid rgba(255, 255, 255, 0.3);
        border-top-color: white;
        border-radius: 50%;
        animation: spin 0.8s linear infinite;
      }

      .divider {
        display: flex;
        align-items: center;
        margin: 30px 0 25px;
        color: #94a3b8;
        font-size: 13px;
        font-weight: 500;
        animation: fadeInUp 0.6s ease-out backwards;
        animation-delay: 0.4s;
      }

      .divider::before,
      .divider::after {
        content: '';
        flex: 1;
        height: 1px;
        background: linear-gradient(to right, transparent, #e2e8f0, transparent);
      }

      .divider span {
        padding: 0 15px;
      }

      .auth-footer {
        text-align: center;
        animation: fadeInUp 0.6s ease-out backwards;
        animation-delay: 0.5s;
      }

      .auth-footer p {
        color: #64748b;
        font-size: 14px;
        font-weight: 400;
      }

      .auth-footer a {
        color: #0099ff;
        text-decoration: none;
        font-weight: 600;
        transition: all 0.3s;
        position: relative;
      }

      .auth-footer a::after {
        content: '';
        position: absolute;
        bottom: -2px;
        left: 0;
        width: 0;
        height: 2px;
        background: linear-gradient(135deg, #0099ff, #00d4ff);
        transition: width 0.3s;
      }

      .auth-footer a:hover {
        color: #00d4ff;
      }

      .auth-footer a:hover::after {
        width: 100%;
      }

      @media (max-width: 480px) {
        .auth-card {
          padding: 40px 30px;
        }

        h1 {
          font-size: 30px;
        }

        .logo {
          width: 70px;
          height: 70px;
        }
      }
    `,
  ],
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  loginForm: FormGroup;
  isLoading = false;
  errorMessage = '';

  constructor() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      const { email, password } = this.loginForm.value;

      this.authService.login(email, password).subscribe({
        next: (response) => {
          this.isLoading = false;
          if (response.success) {
            this.router.navigate(['/dashboard']);
          }
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = error.error?.message || 'Login failed. Please try again.';
        },
      });
    }
  }
}
