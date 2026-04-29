import { Component, OnInit, signal, effect } from '@angular/core';
import { RouterLink } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ApiService } from '../services/api.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [RouterLink],
  template: `
    <section class="animate-fade-in">
      <article class="glass-card welcome-banner animate-scale-in" style="border-radius: 24px; color">
        <span class="pill">Student dashboard</span>
        <h1 class="page-title" style="margin-top: 0.55rem;">Welcome back, {{ userName() }}</h1>
        <p class="page-copy" style="margin-top: 0.5rem;">Track your learning progress and continue from where you left off.</p>
      </article>

      <div class="grid-cards stat-grid animate-slide-up" style="grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); margin-top: 1rem; animation-delay: 0.2s;">
        @for (stat of stats(); track stat.label) {
          <article class="soft-card stat-card hover-lift" style="animation-delay: {{ $index * 0.1 + 0.3 }}s;">
            <div class="page-copy stat-label">{{ stat.label }}</div>
            <strong class="stat-value">{{ stat.value }}</strong>
          </article>
        }
      </div>

      <section style="margin-top: 1.25rem;" class="animate-slide-up" style="animation-delay: 0.5s;">
        <div style="display: flex; justify-content: space-between; align-items: center; gap: 1rem;">
          <h2 class="section-title">Continue learning</h2>
        </div>

        @if (loading()) {
          <div style="margin-top: 0.85rem; text-align: center; padding: 1.5rem;">
            <div class="skeleton-card" style="max-width: 300px; margin: 0 auto;">
              <div class="skeleton skeleton-text" style="width: 60%; height: 1.5rem; margin-bottom: 1rem;"></div>
              <div class="skeleton skeleton-text" style="width: 80%;"></div>
              <div class="skeleton" style="width: 100%; height: 8px; margin-top: 1rem; border-radius: 999px;"></div>
            </div>
          </div>
        } @else {
          <div class="grid-cards" style="grid-template-columns: repeat(auto-fit, minmax(230px, 1fr)); margin-top: 0.85rem;">
            @for (item of inProgress(); track item.courseId) {
              <article class="glass-card compact-card hover-lift animate-scale-in" style="border-radius: 18px; animation-delay: {{ $index * 0.1 + 0.6 }}s;">
                <div style="display: flex; justify-content: space-between; gap: 0.75rem; align-items: center;">
                  <span class="pill">In progress</span>
                  <span class="page-copy" style="font-size: 0.82rem;">{{ item.progressPercent }}%</span>
                </div>
                <h3 class="section-title card-title" style="margin-top: 0.8rem;">{{ item.title }}</h3>
                <p class="page-copy" style="margin-top: 0.35rem;">{{ item.category }}</p>
                <div class="progress-bar" style="margin-top: 0.9rem;">
                  <div class="progress-fill" [style.width.%]="item.progressPercent" [style.background]="item.progressPercent > 80 ? 'linear-gradient(90deg, #6aaa6a, #4ade80)' : item.progressPercent > 50 ? 'linear-gradient(90deg, #fbbf24, #f59e0b)' : 'linear-gradient(90deg, #3b82f6, #60a5fa)'"></div>
                </div>
              </article>
            }

            @if (inProgress().length === 0) {
              <article class="glass-card" style="padding: 1rem; border-radius: 18px;">
                <h3 class="section-title" style="font-size: 1.1rem;">No courses in progress</h3>
                <p class="page-copy" style="margin-top: 0.35rem;">Start exploring courses to begin learning.</p>
              </article>
            }
          </div>
        }
      </section>

      <section style="margin-top: 1.25rem;">
        <div style="display: flex; justify-content: space-between; align-items: center; gap: 1rem;">
          <h2 class="section-title">Browse all courses</h2>
          <a routerLink="/student/explore" class="view-all-link">View all</a>
        </div>
      </section>
    </section>
  `,
})
export class StudentDashboardComponent implements OnInit {
  protected readonly loading = signal(true);
  protected readonly userName = signal('Learner');

  protected readonly stats = signal([
    { label: 'Total courses', value: '-' },
    { label: 'Lessons done', value: '-' },
    { label: 'Certificates earned', value: '-' },
  ]);

  protected readonly inProgress = signal<any[]>([]);

  constructor(private api: ApiService, private auth: AuthService) {
    // REACTIVE LOAD: Refresh dashboard when UID is finalized
    effect(() => {
      const uid = this.auth.userId();
      if (uid) {
        this.loadDashboardData(uid);
      }
    });
  }

  ngOnInit() {
    const user = this.auth.user();
    if (user) {
      this.userName.set(user.fullName?.split(' ')[0] || 'Learner');
      this.auth.refreshCurrentUser(); // Sync ID
    }
  }

  private loadDashboardData(uid: number) {
    this.loading.set(true);
    forkJoin({
      enrollments: this.api.getEnrollmentsByStudent(uid).pipe(catchError(() => of({ success: true, data: [] }))),
      progress: this.api.getAllProgressByStudent(uid).pipe(catchError(() => of({ success: true, data: [] }))),
      certificates: this.api.getStudentCertificates(uid).pipe(catchError(() => of({ success: true, data: [] }))),
    }).subscribe({
      next: ({ enrollments, progress, certificates }) => {
        const enrollmentList: any[] = Array.isArray((enrollments as any)?.data) 
          ? (enrollments as any).data 
          : (Array.isArray(enrollments) ? enrollments : []);
        
        const progressRecords: any[] = Array.isArray((progress as any)?.data) 
          ? (progress as any).data 
          : (Array.isArray(progress) ? progress : []);
          
        const certList: any[] = Array.isArray((certificates as any)?.data) 
          ? (certificates as any).data 
          : (Array.isArray(certificates) ? certificates : []);

        const enrolledCount = enrollmentList.length;
        
        // MIRROR LOGIC: If progress records are empty but enrollment says 100%, count it as completed
        let completedLessonsValue = progressRecords.filter((r: any) => r.isCompleted === true || r.isCompleted === 1 || String(r.isCompleted) === 'true').length;
        if (completedLessonsValue === 0 && enrollmentList.some(e => e.progressPercent >= 100)) {
           // Fallback to enrollment-based counting if granular progress is missing
           completedLessonsValue = enrollmentList.filter(e => e.progressPercent >= 100).length;
        }

        const certificatesEarned = certList.length;

        this.stats.set([
          { label: 'Total courses', value: String(enrolledCount) },
          { label: 'Lessons done', value: String(completedLessonsValue) },
          { label: 'Certificates earned', value: String(certificatesEarned) },
        ]);

        // Background Sync: Check for 100% courses missing certificates
        const certCourseIds = new Set(certList.map(c => c.courseId));
        enrollmentList.forEach(e => {
          if (e.progressPercent >= 100 && !certCourseIds.has(e.courseId)) {
            this.api.issueCertificate(uid, e.courseId).subscribe({
              next: (newCert) => {
                if (newCert) {
                  // Increment the stat locally
                  this.stats.update(s => s.map(stat => 
                    stat.label === 'Certificates earned' ? { ...stat, value: String(parseInt(stat.value) + 1) } : stat
                  ));
                }
              }
            });
          }
        });

        // Get first 3 ACTIVE enrollments for "Continue Learning"
        const activeEnrollments = enrollmentList
          .filter((e: any) => e.status === 'ACTIVE')
          .slice(0, 3);

        if (activeEnrollments.length > 0) {
          const courseRequests = activeEnrollments.map((e: any) => 
            this.api.getCourseById(e.courseId).pipe(
              catchError(() => of({ data: { title: `Course #${e.courseId}`, category: 'Course' } }))
            )
          );
          forkJoin(courseRequests).subscribe({
            next: (courseResults: any) => {
              const combined = activeEnrollments.map((enrollment: any, index: number) => {
                const courseData = courseResults[index]?.data || courseResults[index] || {};
                return {
                  courseId: enrollment.courseId,
                  title: courseData.title || `Course #${enrollment.courseId}`,
                  category: courseData.category || '',
                  progressPercent: enrollment.progressPercent || 0,
                };
              });
              this.inProgress.set(combined);
              this.loading.set(false);
            },
            error: () => { this.loading.set(false); },
          });
        } else {
          this.loading.set(false);
        }
      },
      error: () => {
        this.loading.set(false);
      },
    });
  }
}
