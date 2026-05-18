import { Component, OnInit, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ApiService } from '../services/api.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-student-my-courses',
  imports: [RouterLink],
  template: `
    <section>
      <div style="display: flex; justify-content: space-between; align-items: flex-end; gap: 1rem; flex-wrap: wrap;">
        <div>
          <span class="pill">Learning path</span>
          <h1 class="page-title" style="font-size: clamp(1.8rem, 3.2vw, 2.6rem); margin-top: 0.75rem;">My courses</h1>
          <p class="page-copy" style="margin-top: 0.35rem;">{{ visibleCourses().length }} courses shown · Average progress {{ averageProgress() }}%</p>
        </div>
        <div style="display: flex; gap: 0.45rem; flex-wrap: wrap;">
          @for (filter of filters; track filter) {
            <button class="chip" type="button" [class.role-option--active]="activeFilter() === filter" (click)="activeFilter.set(filter)">{{ filter }}</button>
          }
        </div>
      </div>

      @if (loading()) {
        <div class="grid-cards" style="grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); margin-top: 1rem;">
          <article class="glass-card" style="padding: 1.5rem; border-radius: 18px; text-align: center;">
            <p class="page-copy">Loading your courses…</p>
          </article>
        </div>
      } @else {
        <div class="grid-cards" style="grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); margin-top: 1rem;">
          <article class="soft-card" style="padding: 1rem; border-radius: 18px;">
            <div class="page-copy" style="font-size: 0.82rem;">Courses enrolled</div>
            <strong style="font-family: 'Space Grotesk', sans-serif; font-size: 1.8rem;">{{ enrolledCourses().length }}</strong>
          </article>
          <article class="soft-card" style="padding: 1rem; border-radius: 18px;">
            <div class="page-copy" style="font-size: 0.82rem;">Active learning</div>
            <strong style="font-family: 'Space Grotesk', sans-serif; font-size: 1.8rem;">{{ activeCount() }}</strong>
          </article>
          <article class="soft-card" style="padding: 1rem; border-radius: 18px;">
            <div class="page-copy" style="font-size: 0.82rem;">Completed</div>
            <strong style="font-family: 'Space Grotesk', sans-serif; font-size: 1.8rem;">{{ completedCount() }}</strong>
          </article>
        </div>

        <div class="grid-cards" style="grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); margin-top: 1rem;">
          @for (course of visibleCourses(); track course.courseId) {
            <article class="glass-card" style="padding: 1rem; border-radius: 18px;">
              <h3 class="section-title" style="font-size: 1.2rem;">{{ course.title }}</h3>
              <p class="page-copy" style="margin-top: 0.35rem;">{{ course.category }} · {{ course.level }}</p>
              <p class="page-copy" style="margin-top: 0.5rem;">{{ course.description }}</p>

              <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 0.85rem;">
                <span class="pill">{{ course.progressPercent }}% complete</span>
                <a [routerLink]="['/course', course.courseId, 'lesson', 1]" class="view-all-link">Resume</a>
              </div>

              <div style="height: 8px; border-radius: 999px; background: rgba(255,255,255,0.08); margin-top: 0.7rem; overflow: hidden;">
                <div style="height: 100%; background: linear-gradient(90deg, #6aaa6a, #b9d9a0);" [style.width.%]="course.progressPercent"></div>
              </div>
            </article>
          }

          @if (visibleCourses().length === 0) {
            <article class="glass-card" style="padding: 1rem; border-radius: 18px;">
              <h3 class="section-title" style="font-size: 1.1rem;">No courses in this filter</h3>
              <p class="page-copy" style="margin-top: 0.35rem;">Switch to a different status to continue learning.</p>
            </article>
          }
        </div>
      }
    </section>
  `,
})
export class StudentMyCoursesComponent implements OnInit {
  protected readonly filters = ['All', 'In Progress', 'Completed'] as const;
  protected readonly activeFilter = signal<(typeof this.filters)[number]>('All');
  protected readonly loading = signal(true);

  protected readonly enrolledCourses = signal<any[]>([]);

  protected readonly visibleCourses = computed(() => {
    const filter = this.activeFilter();
    return this.enrolledCourses().filter((course) => {
      if (filter === 'All') return true;
      if (filter === 'Completed') return this.isCourseCompleted(course);
      return !this.isCourseCompleted(course);
    });
  });

  protected readonly completedCount = computed(() => this.enrolledCourses().filter((c: any) => this.isCourseCompleted(c)).length);
  protected readonly activeCount = computed(() => Math.max(this.enrolledCourses().length - this.completedCount(), 0));
  protected readonly averageProgress = computed(() => {
    const courses = this.enrolledCourses();
    if (courses.length === 0) return 0;
    return Math.round(courses.reduce((sum: number, c: any) => sum + (c.progressPercent || 0), 0) / courses.length);
  });

  constructor(private api: ApiService, private auth: AuthService) {}

  private isCourseCompleted(course: any): boolean {
    return course?.status === 'COMPLETED' || Number(course?.progressPercent ?? 0) >= 100 || !!course?.completedAt;
  }

  ngOnInit() {
    const uid = this.auth.userId();
    if (!uid) { this.loading.set(false); return; }

    forkJoin({
      enrollments: this.api.getEnrollmentsByStudent(uid).pipe(catchError(() => of({ data: [] }))),
      progressRecords: this.api.getAllProgressByStudent(uid).pipe(catchError(() => of({ data: [] }))),
    }).subscribe({
      next: (res: any) => {
        const enrollments: any[] = Array.isArray(res.enrollments?.data) ? res.enrollments.data : (Array.isArray(res.enrollments) ? res.enrollments : []);
        const progressRecords: any[] = Array.isArray(res.progressRecords?.data) ? res.progressRecords.data : (Array.isArray(res.progressRecords) ? res.progressRecords : []);
        if (enrollments.length === 0) {
          this.loading.set(false);
          return;
        }

        const courseRequests = enrollments.map((e: any) => forkJoin({
          course: this.api.getCourseById(e.courseId).pipe(catchError(() => of({ data: { courseId: e.courseId, title: `Course #${e.courseId}` } }))),
          progress: this.api.getCourseProgress(uid, e.courseId).pipe(catchError(() => of(e.progressPercent ?? 0))),
          lessonCount: this.api.getLessonCount(e.courseId).pipe(catchError(() => of(0))),
        }));
        forkJoin(courseRequests).subscribe({
          next: (courseResults: any) => {
            const combined = enrollments.map((enrollment: any, index: number) => {
              const courseData = courseResults[index]?.course?.data || courseResults[index]?.course || {};
              const totalLessons = this.responseNumber(courseResults[index]?.lessonCount);
              const completedLessons = progressRecords.filter((record: any) =>
                Number(record.courseId) === Number(enrollment.courseId) && this.isLessonCompleted(record)
              ).length;
              const recordPercent = totalLessons > 0 ? Math.round((completedLessons * 100) / totalLessons) : 0;
              return {
                ...courseData,
                enrollmentId: enrollment.enrollmentId,
                progressPercent: this.bestPercent(courseResults[index]?.progress, enrollment.progressPercent, recordPercent),
                status: enrollment.status || 'ACTIVE',
                enrolledAt: enrollment.enrolledAt,
                completedAt: enrollment.completedAt,
              };
            });
            this.enrolledCourses.set(combined);
            this.loading.set(false);
          },
          error: () => {
            // If course lookup fails, show enrollment data alone
            const fallback = enrollments.map(e => ({
              courseId: e.courseId,
              title: `Course #${e.courseId}`,
              category: '',
              level: '',
              description: '',
              progressPercent: e.progressPercent || 0,
              status: e.status || 'ACTIVE',
              enrollmentId: e.enrollmentId,
            }));
            this.enrolledCourses.set(fallback);
            this.loading.set(false);
          },
        });
      },
      error: () => { this.loading.set(false); },
    });
  }

  private normalizePercent(raw: any, fallback = 0): number {
    const value = typeof raw === 'number' ? raw : (raw?.data ?? raw?.progressPercentage ?? raw?.courseProgress ?? fallback);
    const numeric = Number(value);
    return Number.isFinite(numeric) ? Math.max(0, Math.min(100, numeric)) : 0;
  }

  private bestPercent(raw: any, enrollmentFallback = 0, recordFallback = 0): number {
    return Math.max(
      this.normalizePercent(raw, enrollmentFallback),
      this.normalizePercent(enrollmentFallback),
      this.normalizePercent(recordFallback)
    );
  }

  private isLessonCompleted(record: any): boolean {
    return record?.isCompleted === true || record?.isCompleted === 1 || String(record?.isCompleted) === 'true';
  }

  private responseNumber(raw: any): number {
    const value = typeof raw === 'number' ? raw : (raw?.data ?? raw?.count ?? raw);
    const numeric = Number(value);
    return Number.isFinite(numeric) ? numeric : 0;
  }
}
