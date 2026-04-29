import { Component, OnInit, signal, effect } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-student-certificates',
  imports: [DatePipe, FormsModule],
  template: `
    <section class="animate-fade-in">
      <div style="display: flex; justify-content: space-between; align-items: center; gap: 1rem; flex-wrap: wrap; margin-bottom: 1.5rem;" class="animate-slide-up">
        <div>
          <span class="pill">Achievements</span>
          <h1 class="page-title" style="font-size:clamp(1.8rem,3.2vw,2.6rem);margin-top:0.75rem;">Certificates</h1>
          <p class="page-copy" style="margin-top:0.35rem;">{{ certificates().length }} certificate(s) earned</p>
        </div>
        <button (click)="refreshAchievements()" class="el-btn hover-lift" style="padding: 0.6rem 1.2rem; display: flex; align-items: center; gap: 0.5rem; background: rgba(106, 170, 106, 0.15); border: 1px solid var(--accent); color: #fff; cursor: pointer; border-radius: 12px; width: auto; animation-delay: 0.3s;">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/></svg>
          Refresh My Achievements
        </button>
      </div>

      @if (loading()) {
        <div style="margin-top: 1.5rem; text-align: center; padding: 2rem;">
          <div class="skeleton-card" style="max-width: 300px; margin: 0 auto;">
            <div class="skeleton skeleton-image" style="height: 150px; border-radius: 18px;"></div>
            <div class="skeleton skeleton-text" style="width: 80%; margin-top: 1rem;"></div>
            <div class="skeleton skeleton-text" style="width: 60%;"></div>
          </div>
        </div>
      } @else {
        <div class="grid-cards" style="grid-template-columns:repeat(auto-fit,minmax(240px,1fr));margin-top:1rem;">
          @for (item of certificates(); track $index) {
            <article class="glass-card hover-lift animate-scale-in" style="padding:1rem;border-radius:18px;display:grid;gap:0.85rem; animation-delay: {{ $index * 0.1 + 0.4 }}s;">
              <div class="certificate-art" style="border-top-color:#6aaa6a;">
                <div class="certificate-art-frame">
                  <div class="certificate-art-header">
                    <span class="certificate-art-badge">EduLearn</span>
                    <span class="certificate-art-year">{{ item.issuedAt | date:'yyyy' }}</span>
                  </div>
                  <div class="certificate-art-body">
                    <div class="certificate-art-title">Certificate</div>
                    <div class="certificate-art-subtitle">of Completion</div>
                    <div class="certificate-art-line certificate-art-line--wide"></div>
                    <div class="certificate-art-line"></div>
                  </div>
                  <div class="certificate-art-footer">
                    <div class="certificate-art-seal">✓</div>
                  </div>
                </div>
              </div>

              <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 0.5rem;">
                <div>
                  <div class="page-copy" style="font-size:0.85rem;">Issued {{ item.issuedAt | date:'mediumDate' }}</div>
                  <div class="page-copy" style="font-size:0.75rem; color: var(--accent); font-weight: 500;">
                    {{ item.studentName || 'Student Achiever' }}
                  </div>
                </div>
              </div>

              <h3 class="section-title" style="font-size:1.05rem;">
                {{ item.courseName || ('Course #' + item.courseId) }}
              </h3>

              <p class="page-copy" style="font-size:0.75rem;opacity:0.6;">
                Code: {{ item.verificationCode }}
              </p>

              <div style="display:flex;gap:0.5rem;">
                <button class="el-btn hover-lift" type="button"
                  style="padding:0.4rem 0.8rem;font-size:0.8rem;flex:1;"
                  (click)="downloadCert(item)">
                  Download PDF
                </button>

                <button class="btn-secondary hover-lift" type="button"
                  style="padding:0.4rem 0.8rem;font-size:0.8rem;"
                  (click)="copyCode(item.verificationCode)">
                  Copy Code
                </button>
              </div>
            </article>
          }

          @if (certificates().length === 0) {
            <article class="glass-card animate-scale-in" style="padding:1rem;border-radius:18px;grid-column:1/-1; text-align: center;">
              <div style="padding: 2rem;">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" style="margin: 0 auto 1rem; opacity: 0.5;"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                <p class="page-copy" style="font-size: 1.1rem; margin-bottom: 0.5rem;">No certificates yet</p>
                <p class="page-copy" style="opacity: 0.7;">Complete a course to earn your first achievement!</p>
              </div>
            </article>
          }
        </div>
      }
    </section>
  `,
})
export class StudentCertificatesComponent implements OnInit {

  protected certificates = signal<any[]>([]);
  protected loading = signal(true);

  constructor(private api: ApiService, private auth: AuthService) {
    effect(() => {
      const uid = this.auth.userId();
      if (uid) {
        this.loadCertificates(uid);
      }
    });
  }

  ngOnInit() {
    this.auth.refreshCurrentUser();
  }

  protected refreshAchievements() {
    this.auth.refreshCurrentUser();
  }

  private loadCertificates(uid: number) {
    this.loading.set(true);

    this.api.getStudentCertificates(uid).subscribe(
      (res: any) => {
        const certList = res.data || res || [];
        this.certificates.set(certList);
        this.loading.set(false);

        this.api.getEnrollmentsByStudent(uid).subscribe(
          (eRes: any) => {
            const enrollList: any[] =
              Array.isArray(eRes?.data) ? eRes.data :
              (Array.isArray(eRes) ? eRes : []);

            const certCourseIds = new Set(certList.map((c: any) => c.courseId));

            enrollList.forEach(e => {
              if (e.progressPercent >= 100 && !certCourseIds.has(e.courseId)) {
                this.api.issueCertificate(uid, e.courseId).subscribe(
                  (newCert) => {
                    const certData = newCert.data || newCert;
                    if (certData && certData.certificateId) {
                      this.certificates.update(current => [...current, certData]);
                    }
                  }
                );
              }
            });
          }
        );
      },
      () => this.loading.set(false)
    );
  }

  // ✅ FIXED METHOD
  protected downloadCert(cert: any) {
    if (!cert.certificateUrl) return;

    const gatewayUrl = window.location.origin.includes('localhost')
      ? 'http://localhost:8080'
      : window.location.origin;

    const fileName = cert.certificateUrl.split('/').pop();

    const downloadUrl = `${gatewayUrl}/certificates/${fileName}`;

    window.open(downloadUrl, '_blank');
  }

  protected copyCode(code: string) {
    navigator.clipboard.writeText(code).catch(() => {});
  }
}