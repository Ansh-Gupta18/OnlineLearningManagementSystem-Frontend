import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-admin-analytics',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="analytics-shell">
      <div class="page-header">
        <span class="pill">Metrics</span>
        <h1 class="page-title">Platform Analytics</h1>
        <p class="page-copy">High-level overview of system metrics.</p>
      </div>

      <div class="grid-cards">
        <article class="stat-card">
          <div class="stat-label">Total Courses</div>
          <strong class="stat-value">{{ loading() ? '-' : totalCourses() }}</strong>
        </article>

        <article class="stat-card">
          <div class="stat-label">Published Courses</div>
          <strong class="stat-value stat-positive">{{ loading() ? '-' : publishedCourses() }}</strong>
        </article>

        <article class="stat-card">
          <div class="stat-label">Pending Review</div>
          <strong class="stat-value stat-warning">{{ loading() ? '-' : pendingReview() }}</strong>
        </article>
      </div>

      <article class="info-card">
        <h3 class="section-title">Expanded Analytics Pending</h3>
        <p class="page-copy info-copy">
          Full analytics (revenue, user growth, lesson engagement) require the backend to add dedicated aggregation endpoints. Currently displaying basic computed metrics from available administrative data.
        </p>
      </article>

      <section class="about-section">
        <div class="about-content">
          <h3 class="section-title">About EduLearn</h3>
          <p class="page-copy">EduLearn is an online learning platform that provides easy and structured education through courses, videos, quizzes, and study materials — all in one place.</p>

          <div class="about-grid">
            <div class="about-card">
              <h4>Why Choose Us</h4>
              <ul>
                <li>Expert instructors</li>
                <li>Structured courses with practice</li>
                <li>Progress tracking & certificates</li>
                <li>Affordable learning for all</li>
              </ul>
            </div>

            <div class="about-card">
              <h4>What We Offer</h4>
              <ul>
                <li>Video lessons & notes</li>
                <li>Quizzes and assignments</li>
                <li>Downloadable resources</li>
                <li>Career and exam preparation</li>
              </ul>
            </div>
          </div>

          <div class="mission-block">
            <h4>Our Mission</h4>
            <p>To make quality education accessible to every student and support their career growth.</p>
          </div>
        </div>
      </section>
    </section>
  `,
  styles: [
    `
      :host {
        display: block;
        min-height: 100vh;
        background: #f8f9fa;
        color: #212529;
        padding: 2rem;
        font-family: Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      }

      .analytics-shell {
        max-width: 1140px;
        margin: 0 auto;
        padding: 2rem;
        background: #ffffff;
        border-radius: 28px;
        box-shadow: 0 24px 50px rgba(15, 23, 42, 0.08);
      }

      .page-header {
        margin-bottom: 2rem;
      }

      .pill {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        padding: 0.55rem 1rem;
        border-radius: 999px;
        background: #e7f1ff;
        color: #0d3c72;
        font-weight: 700;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        font-size: 0.78rem;
      }

      .page-title {
        margin: 0.8rem 0 0.35rem;
        font-size: clamp(2rem, 4vw, 3rem);
        color: #111827;
        line-height: 1.05;
      }

      .page-copy {
        margin: 0;
        color: #495057;
        font-size: 1rem;
        line-height: 1.75;
      }

      .grid-cards {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
        gap: 1.25rem;
        margin-bottom: 2rem;
      }

      .stat-card,
      .info-card {
        background: #ffffff;
        border: 1px solid #e9ecef;
        border-radius: 20px;
        box-shadow: 0 14px 32px rgba(15, 23, 42, 0.06);
      }

      .stat-card {
        padding: 1.75rem;
        min-height: 170px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
      }

      .stat-label {
        font-size: 0.95rem;
        color: #6c757d;
        margin-bottom: 1rem;
      }

      .stat-value {
        font-family: 'Space Grotesk', sans-serif;
        font-size: clamp(2rem, 3vw, 2.5rem);
        color: #111827;
      }

      .stat-positive {
        color: #0d6efd;
      }

      .stat-warning {
        color: #d63384;
      }

      .info-card {
        padding: 2rem;
      }

      .section-title {
        margin: 0 0 0.75rem;
        color: #111827;
        font-size: 1.4rem;
        line-height: 1.2;
      }

      .info-copy {
        max-width: 720px;
        margin-top: 0.5rem;
      }

      .about-section {
        margin-top: 2rem;
        padding: 2rem;
        background: #f8f9fa;
        border-radius: 22px;
        border: 1px solid #e9ecef;
      }

      .about-content {
        max-width: 1000px;
        margin: 0 auto;
      }

      .about-grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 1.25rem;
        margin-top: 1.25rem;
      }

      .about-card {
        padding: 1.5rem;
        background: #ffffff;
        border: 1px solid #e9ecef;
        border-radius: 18px;
        box-shadow: 0 16px 32px rgba(15, 23, 42, 0.05);
      }

      .about-card h4,
      .mission-block h4 {
        margin: 0 0 0.75rem;
        color: #0d3c72;
        font-size: 1.05rem;
      }

      .about-card ul {
        margin: 0;
        padding-left: 1.15rem;
        color: #495057;
        line-height: 1.8;
      }

      .about-card li {
        margin-bottom: 0.6rem;
      }

      .mission-block {
        margin-top: 1.75rem;
        padding: 1.9rem;
        background: #ffffff;
        border: 1px solid #e9ecef;
        border-radius: 18px;
        box-shadow: 0 16px 32px rgba(15, 23, 42, 0.05);
      }

      .mission-block p {
        margin: 0;
        color: #495057;
        line-height: 1.75;
        font-size: 1rem;
      }

      @media (max-width: 760px) {
        :host {
          padding: 1rem;
        }
        .analytics-shell {
          padding: 1.5rem;
        }
        .grid-cards {
          gap: 1rem;
        }
        .stat-card {
          min-height: 150px;
        }
        .about-grid {
          grid-template-columns: 1fr;
        }
      }
    `
  ]
})
export class AdminAnalyticsComponent implements OnInit {
  protected loading = signal(true);
  protected totalCourses = signal(0);
  protected publishedCourses = signal(0);
  protected pendingReview = signal(0);

  constructor(private api: ApiService) {}

  ngOnInit() {
    // Attempt to use getAllCoursesAdmin or fallback to getAllCourses
    const fetchCall = (this.api as any).getAllCoursesAdmin 
      ? (this.api as any).getAllCoursesAdmin() 
      : this.api.getAllCourses();

    fetchCall.subscribe({
      next: (res: any) => {
        const courses: any[] = res.data || res || [];
        this.totalCourses.set(courses.length);
        
        let published = 0;
        let pending = 0;
        
        courses.forEach(c => {
          if (c.published || c.isPublished) {
            published++;
          } else {
            pending++;
          }
        });

        this.publishedCourses.set(published);
        this.pendingReview.set(pending);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }
}