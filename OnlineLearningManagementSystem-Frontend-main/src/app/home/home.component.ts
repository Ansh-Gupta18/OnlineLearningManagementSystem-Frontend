import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
   <div class="landing-shell animate-fade-in">
  <div class="glow-warm"></div>
  <div class="glow-teal"></div>

  <header class="landing-topbar animate-slide-up">
    <a routerLink="/" class="brand-mark brand-link">EDULEARN</a>

    <nav class="landing-nav" aria-label="Primary">
      <a href="#platform" class="el-nav-link" (click)="scrollToSection('platform')">About</a>
      <a href="#essence" class="el-nav-link" (click)="scrollToSection('essence')">Community</a>
      <a routerLink="/explore" class="el-nav-link">Courses</a>
    </nav>

    @if (auth.isLoggedIn()) {
      <a [routerLink]="'/' + auth.user()?.role?.toLowerCase() + (auth.user()?.role === 'ADMIN' ? '' : '/profile')" class="topbar-signin hover-lift">Profile</a>
    } @else {
      <a routerLink="/auth" [queryParams]="{mode: 'login'}" class="topbar-signin hover-lift">Sign In</a>
    }
  </header>

  <main class="home-flow">

    <!-- SECTION 1 -->
    <section id="start" class="home-section login-slide top-login animate-scale-in">
      <div class="el-grain"></div>
      <article class="el-card sign-in-card el-fade-4 hover-lift" style="text-align: center;">
        <h2 class="el-heading">Ready to start?</h2>
        <p class="page-copy" style="margin: 1rem 0 2.5rem; font-size: 1.1rem; opacity: 0.8;">
          Start your learning journey today. Join EduLearn and explore new opportunities.
        </p>

        <div class="home-login-buttons" style="display: flex; flex-direction: column; gap: 1rem;">
          <a routerLink="/auth" class="el-btn hover-lift" style="text-decoration: none; text-align: center; display: block; width: 100%; padding: 16px; animation-delay: 0.2s;">
            Create an Account
          </a>
          <a routerLink="/auth" class="el-btn home-login-btn-alt hover-lift" style="text-decoration: none; text-align: center; display: block; width: 100%; padding: 16px; animation-delay: 0.4s;">
            Sign In
          </a>
        </div>

        <div style="text-align: center; margin-top: 1.5rem;">
          <a routerLink="/explore" class="auth-link-btn" style="color: var(--el-text-muted); font-size: 0.9rem;">
            Continue as Guest <span class="arrow-move">→</span>
          </a>
        </div>
      </article>
    </section>

    <!-- HERO -->
    <section id="hero" class="home-section hero-slide">
      <div class="el-grain"></div>
      <div class="hero-copy el-fade-1">
        <h1 class="el-heading">Learn without limits</h1>
        <p>Access high-quality courses designed by expert instructors. Build skills in design, development, and more.</p>
      </div>
    </section>

    <!-- HIGHLIGHTS -->
    <section id="highlights" class="home-section highlights-slide">
      <div class="el-grain"></div>
      <div class="highlights-copy el-fade-2">
        <div class="header-section">
          <p class="featured-header">FEATURED LEARNING PATHS</p>
        </div>
        <h2 class="el-heading">Explore top skills and certifications</h2>

        <div class="highlight-grid">
          <article class="highlight-card">
            <h3>In-demand Careers</h3>
            <p>Data Scientist · Full Stack Developer · Cloud Engineer · Project Manager · Game Developer</p>
          </article>

          <article class="highlight-card">
            <h3>Career Accelerators</h3>
            <p>Web Development · JavaScript · React · Angular · Java</p>
          </article>

          <article class="highlight-card">
            <h3>IT Certifications</h3>
            <p>AWS · AZ-900 · Cloud Practitioner · Solutions Architect · Kubernetes</p>
          </article>

          <article class="highlight-card">
            <h3>Leadership</h3>
            <p>Management · Productivity · Emotional Intelligence · Project Leadership</p>
          </article>

          <article class="highlight-card">
            <h3>Certifications by Skill</h3>
            <p>Cybersecurity · Cloud · Data Analytics · HR Management</p>
          </article>

          <article class="highlight-card">
            <h3>Data Science & Analytics</h3>
            <p>Python · Machine Learning · Deep Learning · Business Analytics</p>
          </article>

          <article class="highlight-card">
            <h3>Communication</h3>
            <p>Public Speaking · Writing · Presentation Skills</p>
          </article>

          <article class="highlight-card">
            <h3>Business Tools</h3>
            <p>Excel · SQL · Power BI · Data Analysis</p>
          </article>

          <article class="highlight-card highlight-card--links">
            <h3>About EduLearn</h3>
            <p>About us · Careers · Contact · Blog · Investors · App · Pricing · Support · Privacy · Terms</p>
          </article>
        </div>
      </div>
    </section>

    <!-- PLATFORM -->
    <section id="platform" class="home-section story-slide">
      <div class="el-grain"></div>
      <div class="story-copy el-fade-2">
        <div class="header-section">
          <p class="platform-header">THE PLATFORM</p>
        </div>
        <h2 class="el-heading">Education built for modern learners</h2>
        <p>EduLearn connects expert instructors with an engaging learning experience. Courses are practical, interactive, and industry-focused.</p>

        <div class="story-metrics">
          @for (stat of storyStats; track stat.label) {
            <div class="metric">
              <strong>{{ stat.value }}</strong>
              <span>{{ stat.label }}</span>
            </div>
          }
        </div>
      </div>
    </section>

    <!-- ESSENCE -->
    <section id="essence" class="home-section essence-slide">
      <div class="el-grain"></div>
      <div class="slide-header el-fade-3" style="padding: 0 clamp(48px, 8vw, 140px); width: 100%; margin-bottom: 2rem;">
        <div class="header-section">
          <p class="featured-header">OUR ESSENCE</p>
        </div>
        <h2 class="el-heading" style="font-size: clamp(30px, 3.8vw, 48px); font-weight: 500;">Why choose EduLearn?</h2>
      </div>

      <div class="essence-strip el-fade-3">
        <article class="essence-card">
          <div class="essence-num">01.</div>
          <h3 class="essence-title">Mastery</h3>
          <p class="essence-desc">Build strong fundamentals and progress step by step toward expertise.</p>
        </article>

        <article class="essence-card">
          <div class="essence-num">02.</div>
          <h3 class="essence-title">Community</h3>
          <p class="essence-desc">Connect with learners, share ideas, and grow together.</p>
        </article>

        <article class="essence-card">
          <div class="essence-num">03.</div>
          <h3 class="essence-title">Innovation</h3>
          <p class="essence-desc">Learn modern tools and technologies aligned with industry needs.</p>
        </article>
      </div>
    </section>

    <!-- ABOUT -->
    <section class="about-home-section">
      <div class="about-home-copy el-fade-3">
        <h2 class="el-heading">About EduLearn</h2>
        <p>EduLearn is a modern learning platform offering structured courses, videos, quizzes, and study materials in one place.</p>

        <div class="about-grid">
          <article class="about-card">
            <h3>Why Choose Us</h3>
            <ul>
              <li>Expert instructors</li>
              <li>Structured learning paths</li>
              <li>Progress tracking & certificates</li>
              <li>Affordable education</li>
            </ul>
          </article>

          <article class="about-card">
            <h3>What We Offer</h3>
            <ul>
              <li>Video lessons and notes</li>
              <li>Quizzes and assignments</li>
              <li>Downloadable resources</li>
              <li>Career and exam preparation</li>
            </ul>
          </article>
        </div>

        <div class="mission-home-block">
          <h3>Our Mission</h3>
          <p>Provide accessible, high-quality education to help students achieve their career goals.</p>
        </div>
      </div>
    </section>

  </main>
</div>
  `,
  styles: `
    .landing-shell {
      min-height: 100vh;
      position: relative;
      overflow: visible;
      background: #f8fafc;
    }

    .home-flow {
      display: block;
      width: 100%;
    }

    .landing-topbar {
      position: sticky;
      top: 0;
      left: 0;
      right: 0;
      z-index: 50;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      padding: 1rem clamp(1rem, 4vw, 1.5rem);
      backdrop-filter: blur(18px);
      -webkit-backdrop-filter: blur(18px);
      border-bottom: 1px solid rgba(148,163,184,0.35);
      background: rgba(255,255,255,0.95);
      box-shadow: 0 12px 40px rgba(15,23,42,0.06);
    }

    .brand-mark {
      letter-spacing: 0.22em;
      font-size: 0.9rem;
      color: #000000;
      font-weight: 700;
      text-transform: uppercase;
    }

    .landing-nav {
      display: flex;
      flex-wrap: wrap;
      gap: 1.25rem;
      align-items: center;
    }

    .landing-nav .el-nav-link {
      color: #000000;
      transition: color 0.22s ease;
    }

    .landing-nav .el-nav-link:hover {
      color: #000000;
    }

    .topbar-signin {
      padding: 0.85rem 1.25rem;
      border-radius: 999px;
      border: 1px solid rgba(148,163,184,0.45);
      color: #000000;
      background: #ffffff;
      font-size: 0.86rem;
      text-transform: uppercase;
      letter-spacing: 0.08em;
    }

    .hero-slide {
      min-height: 100vh;
      display: flex;
      align-items: center;
      padding: 0 clamp(1.5rem, 5vw, 6rem);
      background: radial-gradient(circle at top left, rgba(37,99,235,0.12), transparent 24%), #f8fafc;
    }

    .login-slide.top-login {
      min-height: auto;
      padding: clamp(3rem, 5vw, 5rem) clamp(1.5rem, 4vw, 4rem);
      display: flex;
      align-items: flex-start;
      justify-content: center;
    }

    .login-slide.top-login .sign-in-card {
      max-width: 540px;
      width: 100%;
      margin-top: 1rem;
    }

    .hero-copy {
      max-width: 700px;
      z-index: 2;
    }

    .hero-copy h1 {
      font-size: clamp(3.5rem, 6vw, 5.5rem);
      font-weight: 800;
      color: #000000  !important;
      margin-bottom: 1rem;
      letter-spacing: -0.04em;
      line-height: 0.98;
      font-family: 'Poppins', sans-serif;
    }

    .hero-copy p {
      font-size: 1.05rem;
      line-height: 1.78;
      max-width: 620px;
      color: #000000  !important;
      margin-bottom: 2rem;
    }

    .highlights-slide {
      min-height: auto;
      padding: clamp(3rem, 5vw, 6rem);
      background: #f1f5f9;
      display: flex;
      justify-content: center;
      align-items: flex-start;
    }

    .highlights-copy {
      width: 100%;
      max-width: 1180px;
      padding: 2rem 1.5rem;
      background: #ffffff;
      border: 1px solid rgba(226,232,240,0.9);
      border-radius: 32px;
      box-shadow: 0 28px 70px rgba(15,23,42,0.08);
    }

    .highlight-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 1rem;
      margin-top: 1.75rem;
    }

    .highlight-card {
      padding: 1.5rem;
      background: #f8fafc;
      border: 1px solid rgba(226,232,240,0.9);
      border-radius: 24px;
      color: #000000;
      line-height: 1.7;
      min-height: 120px;
      transition: transform 0.25s ease, border-color 0.25s ease;
    }

    .highlight-card:hover {
      transform: translateY(-3px);
      border-color: rgba(16,185,129,0.35);
    }

    .highlight-card h3 {
      font-size: 1rem;
      font-weight: 700;
      margin-bottom: 0.9rem;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: #000000  !important;
    }

    .highlight-card p {
      margin: 0;
      color: #000000  !important;
      font-size: 0.93rem;
    }

    .highlight-card--links {
      grid-column: span 2;
    }

    @media (max-width: 900px) {
      .landing-topbar {
        flex-direction: column;
        align-items: flex-start;
      }
      .story-metrics {
        grid-template-columns: 1fr;
      }
      .essence-strip {
        grid-template-columns: 1fr;
      }
      .sign-in-card {
        padding: 2.2rem;
      }
      .highlight-card--links {
        grid-column: auto;
      }
    }

    .scroll-hint {
      position: absolute;
      bottom: 36px;
      right: clamp(1.5rem, 5vw, 6rem);
      display: inline-flex;
      align-items: center;
      gap: 0.75rem;
      color: #000000  !important;
      text-transform: uppercase;
      letter-spacing: 0.18em;
      border: 1px solid rgba(148,163,184,0.6);
      border-radius: 999px;
      padding: 0.85rem 1.2rem;
      background: #ffffff;
      font-family: 'Inter', sans-serif;
      font-size: 0.8rem;
      cursor: pointer;
      transition: transform 0.25s ease, background 0.25s ease;
      box-shadow: 0 14px 30px rgba(15,23,42,0.08);
    }

    .scroll-hint:hover {
      transform: translateY(-1px);
      background: #e2e8f0;
    }

    .story-slide {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      padding: clamp(3rem, 5vw, 6rem);
      background: #f8fafc;
    }

    .story-copy {
      width: 100%;
      max-width: 760px;
      padding: 3rem 2.5rem;
      background: #ffffff;
      border: 1px solid rgba(226,232,240,0.9);
      border-radius: 32px;
      box-shadow: 0 32px 90px rgba(15,23,42,0.08);
    }

    .story-copy h2 {
      font-size: clamp(2.6rem, 4vw, 3.6rem);
      margin: 0 0 1.3rem;
      color: #000000  !important;
      font-family: 'Poppins', sans-serif;
      line-height: 1.02;
    }

    .story-copy p {
      color: #000000  !important;
      line-height: 1.75;
      margin: 0 0 1.5rem;
      font-size: 1rem;
    }

    .story-metrics {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 1.2rem;
      margin-top: 2rem;
    }

    .metric {
      padding: 1.3rem 1.35rem;
      border-radius: 24px;
      background: #f8fafc;
      border: 1px solid rgba(226,232,240,0.9);
    }

    .metric strong {
      font-size: 2rem;
      display: block;
      margin-bottom: 0.5rem;
      color: #000000  !important;
    }

    .metric span {
      font-size: 0.8rem;
      text-transform: uppercase;
      letter-spacing: 0.14em;
      color: #000000  !important;
    }

    .essence-slide {
      min-height: 100vh;
      padding: clamp(3rem, 5vw, 6rem);
      display: flex;
      flex-direction: column;
      justify-content: center;
      background: #f8fafc;
    }

    .slide-header {
      width: 100%;
      max-width: 780px;
      margin-bottom: 2.5rem;
    }

    .slide-header .header-section {
      margin-bottom: 1rem;
    }

    .featured-header,
    .platform-header {
      color: #000000  !important;
      background: rgba(16,185,129,0.12);
      border: 1px solid rgba(16,185,129,0.22);
      padding: 0.75rem 1rem;
      border-radius: 999px;
      font-size: 0.72rem;
      letter-spacing: 0.18em;
      text-transform: uppercase;
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
    }

    .slide-header h2 {
      font-size: clamp(2.6rem, 4vw, 4rem);
      color: #000000  !important;
      margin: 0;
      line-height: 1.04;
      max-width: 12ch;
    }

    .essence-strip {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
      gap: 1.5rem;
      width: 100%;
    }

    .essence-card {
      padding: 2.2rem;
      border-radius: 26px;
      background: #ffffff;
      border: 1px solid rgba(226,232,240,0.9);
      box-shadow: 0 18px 40px rgba(15, 23, 42, 0.08);
      transition: transform 0.35s ease, box-shadow 0.35s ease, border-color 0.35s ease;
    }

    .about-home-section {
      margin-top: 3rem;
      padding: 2.5rem;
      background: #ffffff;
      border-radius: 32px;
      border: 1px solid rgba(226,232,240,0.9);
      box-shadow: 0 24px 50px rgba(15, 23, 42, 0.08);
    }

    .about-home-copy {
      max-width: 1120px;
      margin: 0 auto;
    }

    .about-home-section .el-heading {
      margin-bottom: 1rem;
      color: #000000  !important;
      font-size: clamp(2rem, 3vw, 2.8rem);
    }

    .about-home-section p {
      color: #000000  !important;
      font-size: 1rem;
      line-height: 1.9;
      max-width: 820px;
      margin-bottom: 2rem;
    }

    .about-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    .about-card {
      padding: 1.75rem;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 24px;
      box-shadow: 0 18px 36px rgba(15, 23, 42, 0.06);
    }

    .about-card h3,
    .mission-home-block h3 {
      margin: 0 0 0.85rem;
      font-size: 1.05rem;
      color: #000000  !important;
    }

    .about-card ul {
      margin: 0;
      padding-left: 1.1rem;
      color: #000000  !important;
      line-height: 1.8;
    }

    .about-card li {
      margin-bottom: 0.65rem;
    }

    .mission-home-block {
      padding: 1.75rem;
      background: #f8fafc;
      border-radius: 22px;
      border: 1px solid #e2e8f0;
    }

    .mission-home-block p {
      margin: 0;
      color: #000000  !important;
      line-height: 1.85;
      font-size: 1rem;
    }

    .essence-card:hover {
      transform: translateY(-5px);
      border-color: rgba(16,185,129,0.35);
      box-shadow: 0 36px 90px rgba(15,23,42,0.12);
    }

    .essence-num {
      font-size: 0.8rem;
      letter-spacing: 0.22em;
      text-transform: uppercase;
      color: #64748b;
      margin-bottom: 1rem;
      font-weight: 700;
    }

    .essence-title {
      font-size: 1.35rem;
      margin-bottom: 0.85rem;
      color: #000000  !important;
      font-weight: 700;
    }

    .essence-desc {
      color: #000000  !important;
      line-height: 1.75;
    }

    .home-login-buttons {
      display: grid;
      gap: 1rem;
      margin-top: 2rem;
    }

    .home-login-buttons .el-btn {
      width: 100%;
    }

    .home-login-btn-alt {
      border: 1px solid rgba(226,232,240,0.9);
      background: #f1f5f9;
      color: #000000  !important;
    }

    .home-login-btn-alt:hover {
      background: #e2e8f0;
    }

    .auth-link-btn {
      color: var(--accent-strong) !important;
    }

    .sign-in-card {
      width: 100%;
      max-width: 460px;
      padding: 3rem 2.4rem;
      border-radius: 28px;
      background: #ffffff !important;
      border: 1px solid rgba(226,232,240,0.9) !important;
      box-shadow: 0 38px 100px rgba(15,23,42,0.08);
    }

    .sign-in-card .el-heading {
      color: #000000 !important;
      font-size: 2rem;
      margin-bottom: 0.85rem;
    }

    .sign-in-card .page-copy {
      color: #000000 !important;
      margin-bottom: 1.6rem;
    }

    .sign-in-card .field span {
      color: #000000  !important;
      font-size: 0.82rem;
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }

    .sign-in-card .el-input {
      background: #f8fafc !important;
      border-color: rgba(226,232,240,0.9) !important;
      color: #111827 !important;
      border-radius: 16px;
    }

    .sign-in-card .el-input::placeholder {
      color: #000000 !important;
    }

    .sign-in-card .el-btn:not(.home-login-btn-alt) {
      background: linear-gradient(135deg, var(--accent), var(--accent-strong)) !important;
      color: #fff !important;
      border-radius: 999px;
      box-shadow: 0 18px 40px rgba(37,99,235,0.18);
      font-weight: 700;
    }

    .sign-in-card .el-btn:not(.home-login-btn-alt):hover {
      transform: translateY(-1px);
      box-shadow: 0 22px 48px rgba(37,99,235,0.22);
    }

    @media (max-width: 900px) {
      .landing-topbar {
        flex-direction: column;
        align-items: flex-start;
      }
      .story-metrics {
        grid-template-columns: 1fr;
      }
      .essence-strip {
        grid-template-columns: 1fr;
      }
      .sign-in-card {
        padding: 2.2rem;
      }
    }
  `,
})
export class HomeComponent implements OnInit {
  protected readonly storyStats = [
    { label: 'Students', value: '15K+' },
    { label: 'Courses', value: '300+' },
    { label: 'Satisfaction', value: '99%' },
  ];

  constructor(public readonly auth: AuthService) { }

  ngOnInit(): void {
    // Landing page remains static and scrollable.
  }

  protected scrollToSection(sectionId: string): void {
    const element = document.getElementById(sectionId);
    if (!element) return;

    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}