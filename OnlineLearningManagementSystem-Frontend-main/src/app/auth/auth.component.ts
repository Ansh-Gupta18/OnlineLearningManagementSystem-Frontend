import { Component, signal, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-auth',
  imports: [FormsModule, RouterLink],
  template: `
    <div class="auth-shell">
      <div class="el-grain"></div>
      <header class="landing-topbar">
        <a routerLink="/" class="brand-mark brand-link">EDULEARN</a>
      </header>

      <main class="auth-main">
        <section class="auth-hero">
          <div class="auth-hero-copy">
            <p class="eyebrow">Secure access for every learner</p>
            <h1>Login or register to continue your EduLearn journey</h1>
            <p>Fast, polished, and easy access to your courses, dashboard, and progress.</p>
          </div>
        </section>

        <div class="auth-wrapper" [class.auth-wrapper--register]="mode() === 'register'">
          
          <!-- Left Panel (Only visible on register tab) -->
          @if (mode() === 'register') {
            <article class="glass-card left-panel desktop-only">
              <div class="left-panel-content">
                <h2 class="brand-mark" style="font-size: 2rem; margin-bottom: 1rem;">EDULEARN</h2>
                <p style="font-size: 1.2rem; margin-bottom: 3rem; font-weight: 500; opacity: 0.9;">Learn Anytime. Grow Everywhere.</p>
                
                <div class="step-indicators">
                  <div class="step-item">
                    <div class="step-circle active">1</div>
                    <span>Sign up your account</span>
                  </div>
                  <div class="step-item">
                    <div class="step-circle">2</div>
                    <span>Set up your workspace</span>
                  </div>
                  <div class="step-item">
                    <div class="step-circle">3</div>
                    <span>Set up your profile</span>
                  </div>
                </div>
              </div>
            </article>
          }

          <article class="glass-card auth-card">
            <div class="auth-tabs">
              <button class="auth-tab" [class.auth-tab--active]="mode() === 'login'" (click)="mode.set('login')">Sign In</button>
              <button class="auth-tab" [class.auth-tab--active]="mode() === 'register'" (click)="mode.set('register')">Register</button>
            </div>

            @if (mode() === 'login') {
              <h1 class="page-title auth-title">Welcome back</h1>
              <p class="page-copy" style="margin-top:0.35rem;">Sign in to continue your learning journey.</p>

              <form class="auth-form" (ngSubmit)="doLogin()">
                <label style="display:grid;gap:0.4rem;">
                  <span class="page-copy">Email</span>
                  <input class="el-input" type="email" [(ngModel)]="loginEmail" name="email" placeholder="you@example.com" required />
                </label>
                <label style="display:grid;gap:0.4rem;">
                  <span class="page-copy">Password</span>
                  <div style="position: relative; display: flex; align-items: center;">
                    <input class="el-input" [type]="showPassword() ? 'text' : 'password'" [(ngModel)]="loginPassword" name="password" placeholder="••••••••" required style="width: 100%; padding-right: 2.5rem;" />
                    <button type="button" class="pwd-toggle" (click)="showPassword.set(!showPassword())">
                      {{ showPassword() ? '●' : '👁' }}
                    </button>
                  </div>
                </label>

                <button class="el-btn auth-submit" type="submit" [disabled]="loading()">
                  {{ loading() ? 'Signing in…' : 'Sign In' }}
                </button>
              </form>
            }
            
            @if (error()) {
                <p class="auth-error" style="margin-top: 1rem;">{{ error() }}</p>
            }
            @if (success()) {
                <p class="auth-success" style="margin-top: 1rem;">{{ success() }}</p>
            }

            @if (mode() === 'register') {
              <h1 class="page-title auth-title">Create account</h1>
              <p class="page-copy" style="margin-top:0.35rem;">Join thousands of learners and instructors.</p>

              <form class="auth-form" (ngSubmit)="doRegister()">
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                  <label style="display:grid;gap:0.4rem;">
                    <span class="page-copy">First Name</span>
                    <input class="el-input" type="text" [(ngModel)]="regFirstName" name="firstName" placeholder="First Name" required />
                  </label>
                  <label style="display:grid;gap:0.4rem;">
                    <span class="page-copy">Last Name</span>
                    <input class="el-input" type="text" [(ngModel)]="regLastName" name="lastName" placeholder="Last Name" required />
                  </label>
                </div>
                <label style="display:grid;gap:0.4rem;">
                  <span class="page-copy">Email</span>
                  <input class="el-input" type="email" [(ngModel)]="regEmail" name="email" placeholder="you@example.com" required />
                </label>
                <label style="display:grid;gap:0.4rem;">
                  <span class="page-copy">Password</span>
                  <div style="position: relative; display: flex; align-items: center;">
                    <input class="el-input" [type]="showPassword() ? 'text' : 'password'" [(ngModel)]="regPassword" name="password" placeholder="At least 8 characters" required style="width: 100%; padding-right: 2.5rem;" />
                    <button type="button" class="pwd-toggle" (click)="showPassword.set(!showPassword())">
                      {{ showPassword() ? '●' : '👁' }}
                    </button>
                  </div>
                </label>
                <label style="display:grid;gap:0.4rem;">
                  <span class="page-copy">I am a…</span>
                  <select class="el-input" [(ngModel)]="regRole" name="role">
                    <option value="STUDENT">Student</option>
                    <option value="INSTRUCTOR">Instructor</option>
                  </select>
                </label>

                <button class="el-btn auth-submit" type="submit" [disabled]="loading()">
                  {{ loading() ? 'Creating account…' : 'Create Account' }}
                </button>
              </form>
            }
          </article>
        </div>
      </main>
    </div>
  `,
  styles: `
    .auth-shell {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      position: relative;
      background: #f8fafc;
      color: #111827;
    }
    .auth-main {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-start;
      padding: 3.5rem 1rem 2rem;
      gap: 2rem;
    }
    .auth-hero {
      width: min(100%, 760px);
      padding: 1.5rem 2rem;
      border-radius: 28px;
      background: #ffffff;
      border: 1px solid rgba(0, 3, 7, 0.9);
      box-shadow: 0 32px 80px rgba(15, 23, 42, 0.08);
    }
    .auth-hero-copy {
      display: grid;
      gap: 0.75rem;
      text-align: center;
    }
    .auth-hero .eyebrow {
      margin: 0;
      color: #000000;
      letter-spacing: 0.24em;
      text-transform: uppercase;
      font-size: 0.82rem;
      font-weight: 600;
    }
    .auth-hero h1 {
      margin: 0;
      font-size: clamp(2rem, 3.5vw, 3.4rem);
      line-height: 1.05;
      font-weight: 800;
      letter-spacing: -0.04em;
      color: #0f172a;
    }
    .auth-hero p {
      margin: 0;
      color: #000000;
      font-size: 1rem;
      line-height: 1.75;
    }

    .auth-wrapper {
      width: 100%;
      max-width: 540px;
      display: grid;
      transition: all 0.3s ease;
    }
    .auth-wrapper.auth-wrapper--register {
      max-width: 850px;
      grid-template-columns: 1fr 1fr;
      gap: 1.5rem;
    }
    
    .left-panel {
      background: #eff6ff;
      padding: 3rem 2rem;
      border-radius: 20px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      color: #0f172a;
    }
    
    .step-indicators {
      display: grid;
      gap: 1.5rem;
    }
    .step-item {
      display: flex;
      align-items: center;
      gap: 1rem;
      font-size: 1.05rem;
      opacity: 0.95;
    }
    .step-circle {
      width: 30px;
      height: 30px;
      border-radius: 50%;
      background: rgba(37,99,235,0.12);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.9rem;
      font-weight: bold;
      color: #1dd865;
    }
    .step-circle.active {
      background: #25eb7e;
      color: #fff;
    }
    
    .auth-card {
      padding: 1.75rem;
      border-radius: 20px;
      height: 100%;
      background: #ffffff !important;
      border: 1px solid rgba(226,232,240,0.9) !important;
      color: #111827;
      box-shadow: 0 22px 48px rgba(15, 23, 42, 0.08);
    }

    .auth-card .page-title {
      color: #0f172a !important;
      font-weight: 700;
      letter-spacing: -0.02em;
    }

    .auth-card .page-copy {
      color: #000000 !important;
      font-size: 0.95rem;
    }

    .auth-card .field span {
      color: #000000;
      font-size: 0.85rem;
      text-transform: none;
      letter-spacing: normal;
    }

    .auth-card .el-input {
      background: #f8fafc !important;
      border: 1px solid rgba(226,232,240,0.9) !important;
      color: #111827 !important;
      border-radius: 12px;
    }

    .auth-card .el-input::placeholder {
      color: #000000 !important;
    }
    
    .auth-tabs {
      display: flex;
      gap: 0.5rem;
      margin-bottom: 2rem;
    }
    .auth-tab {
      flex: 1;
      padding: 0.65rem;
      border-radius: 12px;
      border: 1px solid rgba(148,163,184,0.35);
      background: #f8fafc;
      color: #10bb82;
      font-size: 0.95rem;
      cursor: pointer;
      transition: all 0.2s;
    }
    .auth-tab--active {
      background: #ffffff;
      border-color: #10bb82;
      color: #10bb82 !important;
      font-weight: 500;
    }
    .auth-title {
      font-size: clamp(1.5rem, 3vw, 2rem);
    }
    .auth-form {
      display: grid;
      gap: 1rem;
      margin-top: 1.25rem;
    }
    .auth-submit {
      width: 100%;
      margin-top: 0.5rem;
      padding: 0.85rem;
      background: #10bb82 !important;
      color: #fff !important;
      border-radius: 12px;
      font-weight: 600;
      font-size: 1rem;
      border: none;
      transition: transform 0.2s ease, box-shadow 0.2s;
      box-shadow: 0 10px 24px rgba(37, 99, 235, 0.18);
    }
    .auth-submit:hover {
      background: #10bb82 !important;
      transform: translateY(-2px);
      box-shadow: 0 10px 24px rgba(37, 99, 235, 0.22);
    }
    .auth-error {
      color: #be123c;
      font-size: 0.85rem;
    }
    .auth-success {
      color: #0f766e;
      font-size: 0.85rem;
    }
    .pwd-toggle {
      position: absolute;
      right: 0.8rem;
      background: none;
      border: none;
      color: #000000;
      opacity: 0.8;
      cursor: pointer;
      font-size: 1.1rem;
      padding: 0;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .pwd-toggle:hover {
      opacity: 1;
    }

    @media (max-width: 768px) {
      .auth-wrapper.auth-wrapper--register {
        grid-template-columns: 1fr;
        max-width: 420px;
      }
      .desktop-only {
        display: none !important;
      }
    }
  `,
})
export class AuthComponent {
  protected mode = signal<'login' | 'register'>('login');
  protected loading = signal(false);
  protected error = signal('');
  protected success = signal('');
  protected showPassword = signal(false);

  protected loginEmail = '';
  protected loginPassword = '';
  protected regFirstName = '';
  protected regLastName = '';
  protected regEmail = '';
  protected regPassword = '';
  protected regRole = 'STUDENT';

  private auth = inject(AuthService);

  constructor() {
    // Check query param for initial tab
  }

  protected doLogin() {
    this.error.set('');
    this.loading.set(true);
    this.auth.login(this.loginEmail, this.loginPassword).subscribe({
      next: (res: any) => {
        this.loading.set(false);
        if (!res.success) this.error.set(res.message ?? 'Login failed');
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set(err?.error?.message ?? 'Login failed. Please check your credentials.');
      },
    });
  }

  protected doRegister() {
    this.error.set('');
    this.success.set('');
    this.loading.set(true);
    
    const regFullName = this.regFirstName.trim() + ' ' + this.regLastName.trim();

    this.auth.register(this.regEmail, regFullName, this.regPassword, this.regRole).subscribe({
      next: (res: any) => {
        this.loading.set(false);
        if (res.success) {
          this.success.set('Account created! You can now sign in.');
          this.mode.set('login');
          this.loginEmail = this.regEmail;
        } else {
          this.error.set(res.message ?? 'Registration failed');
        }
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set(err?.error?.message ?? 'Registration failed.');
      },
    });
  }
}

