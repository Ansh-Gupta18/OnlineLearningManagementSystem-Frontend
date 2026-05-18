import { Component, effect, inject, OnInit, OnDestroy, signal } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { filter, Subscription } from 'rxjs';
import { instructorNavItems, studentNavItems, adminNavItems, NavItem } from './app-data';
import { AuthService } from '../services/auth.service';
import { ApiService } from '../services/api.service';
import { CommonModule } from '@angular/common';
import { ThemeToggleComponent } from './theme-toggle.component';

@Component({
  selector: 'app-dashboard-shell',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule, ThemeToggleComponent],
  template: `
    <div class="dashboard-shell" [class.dashboard-shell--instructor]="isInstructor" [class.dashboard-shell--student]="isStudent" [class.dashboard-shell--admin]="isAdmin">
      <header class="topbar glass-card">
        <button class="chip" type="button" (click)="sidebarCollapsed = !sidebarCollapsed">Menu</button>
        <div class="topbar-actions">
          <app-theme-toggle></app-theme-toggle>
           <!-- Notification Bell -->
          <div class="notif-wrapper" style="position: relative; margin-right: 0.5rem;">
            <a
              class="chip notif-chip"
              [routerLink]="notificationsPath"
              aria-label="Notifications"
              title="Notifications"
              style="border:none; background: rgba(255,255,255,0.05); color: inherit; cursor: pointer; z-index: 100; text-decoration:none;"
            >
              <span aria-hidden="true" style="font-size: 1.1rem; line-height: 1;">&#128276;</span>
              @if (unreadCount() > 0) {
                <span class="notif-badge">{{ unreadCount() }}</span>
              }
            </a>

            <!-- Notif Dropdown -->
            @if (showNotifs()) {
              <div class="notif-dropdown glass-card animate-in">
                <div class="notif-header">
                  <h4 style="margin:0; font-size: 1rem;">Notifications</h4>
                  <div style="display:flex;align-items:center;gap:0.7rem;">
                    <a [routerLink]="notificationsPath" (click)="showNotifs.set(false)" class="mark-all-btn">View all</a>
                    <button (click)="markAllRead()" class="mark-all-btn">Mark all read</button>
                  </div>
                </div>
                <div class="notif-list custom-scrollbar">
                  @if (notifError()) {
                    <div class="notif-empty">
                      <p>{{ notifError() }}</p>
                    </div>
                  }
                  @for (n of notifications(); track n.notificationId) {
                    <div class="notif-item" [class.unread]="!n.read" (click)="markRead(n)">
                      <div class="notif-indicator"></div>
                      <div class="notif-content">
                        <div class="notif-title">{{ n.title ?? n.type ?? 'Notification' }}</div>
                        <div class="notif-msg">{{ n.message }}</div>
                        <div class="notif-time">{{ n.createdAt | date:'shortTime' }}</div>
                      </div>
                    </div>
                  }
                  @if (!notifError() && notifications().length === 0) {
                    <div class="notif-empty">
                      <p>All caught up.</p>
                    </div>
                  }
                </div>
              </div>
            }
          </div>

          <a [routerLink]="profilePath" class="chip notif-chip" style="position:relative;text-decoration:none;">Profile</a>
          <span class="avatar">{{ initials() }}</span>
        </div>
      </header>

      <div class="dashboard-body" [class.dashboard-body--sidebar-collapsed]="sidebarCollapsed">
        <aside class="sidebar glass-card" [class.sidebar-collapsed]="sidebarCollapsed">
          <div class="sidebar-top">
            <div>
              <div class="pill">EduLearn</div>
              <h2 class="section-title" style="margin-top: 0.6rem;">{{ title }}</h2>
            </div>
            @if (userName()) {
              <p class="page-copy" style="font-size:0.8rem;margin-top:0.3rem;opacity:0.7;">{{ userName() }}</p>
            }
          </div>
          <nav class="sidebar-nav">
            @for (item of navItems; track item.path) {
              <a [routerLink]="item.path" routerLinkActive="active" [routerLinkActiveOptions]="isExact(item.path) ? { exact: true } : { exact: false }">
                {{ item.label }}
              </a>
            }
          </nav>

          <div class="sidebar-logout-wrap">
            <button class="btn-secondary sidebar-logout" type="button" (click)="logout()">Logout</button>
          </div>
        </aside>

        <main class="content-wrap">
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>
  `,
  styles: `
    .notif-chip { cursor: pointer; display: flex; align-items: center; justify-content: center; width: 40px; height: 40px; border-radius: 12px; transition: all 0.3s; border: 1px solid rgba(148,163,184,0.35); background: #f8fafc; color: #111827; z-index: 100; position: relative; overflow: visible; }
    .notif-chip:hover { background: #e2e8f0 !important; transform: translateY(-2px); }
    .notif-badge { position: absolute; top: -6px; right: -6px; background: #ef4444; color: white; border-radius: 50%; padding: 0.1rem 0.4rem; font-size: 0.65rem; font-weight: bold; border: 2px solid #f8fafc; }
    .notif-dropdown { position: fixed; top: 70px; right: 20px; width: 320px; max-height: 440px; z-index: 9999; padding: 0; overflow: hidden; border: 1px solid rgba(226,232,240,0.95); box-shadow: 0 20px 40px rgba(15,23,42,0.12); border-radius: 20px; background: #ffffff; backdrop-filter: blur(20px); }
    .notif-header { padding: 1.2rem 1rem; border-bottom: 1px solid rgba(226,232,240,0.95); display: flex; justify-content: space-between; align-items: center; background: #f8fafc; }
    .mark-all-btn { background: transparent; border: none; color: var(--accent); cursor: pointer; font-size: 0.8rem; font-weight: 500; }
    .mark-all-btn:hover { text-decoration: underline; }
    
    .notif-list { overflow-y: auto; max-height: 380px; }
    .notif-item { padding: 1.1rem 1rem; border-bottom: 1px solid rgba(226,232,240,0.9); cursor: pointer; display: flex; gap: 0.9rem; transition: background 0.2s; position: relative; background: #ffffff; }
    .notif-item:hover { background: #f8fafc; }
    .notif-item.unread { background: rgba(59,130,246,0.12); }
    .notif-indicator { width: 10px; height: 10px; background: var(--accent); border-radius: 50%; margin-top: 0.3rem; flex-shrink: 0; opacity: 0; box-shadow: 0 0 10px rgba(37,99,235,0.2); }
    .unread .notif-indicator { opacity: 1; }
    .notif-title { font-weight: 600; font-size: 0.95rem; color: #0f172a; }
    .notif-msg { font-size: 0.85rem; opacity: 0.75; margin-top: 0.35rem; line-height: 1.4; color: #475569; }
    .notif-time { font-size: 0.7rem; opacity: 0.65; margin-top: 0.5rem; text-transform: uppercase; color: #6b7280; }
    .notif-empty { padding: 3rem 1rem; text-align: center; opacity: 0.7; font-size: 0.9rem; color: #475569; }
    
    .animate-in { animation: slideDownIn 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
    @keyframes slideDownIn { from { opacity: 0; transform: translateY(-10px) scale(0.95); } to { opacity: 1; transform: translateY(0) scale(1); } }
    
    .custom-scrollbar::-webkit-scrollbar { width: 6px; }
    .custom-scrollbar::-webkit-scrollbar-track { background: rgba(226,232,240,0.9); }
    .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(148,163,184,0.9); border-radius: 10px; }
  `,
})
export class DashboardShellComponent implements OnInit, OnDestroy {
  private readonly router = inject(Router);
  private readonly auth = inject(AuthService);
  private readonly api = inject(ApiService);
  private navSub?: Subscription;
  private pollSub?: any;

  protected sidebarCollapsed = true;
  protected showNotifs = signal(false);
  protected unreadCount = signal(0);
  protected notifications = signal<any[]>([]);
  protected notifError = signal('');

  protected isStudent = false;
  protected isInstructor = false;
  protected isAdmin = false;
  protected title = 'Dashboard';
  protected navItems: NavItem[] = instructorNavItems;
  protected profilePath = '/student/profile';
  protected notificationsPath = '/student/notifications';
  protected initials = signal('U');
  protected userName = signal('');

  constructor() {
    this.updateFromAuth();
    const updateShell = (): void => this.updateFromUrl();
    updateShell();
    this.navSub = this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe(updateShell);
    effect(() => {
      const user = this.auth.user();
      this.updateFromAuth();
      if (user?.userId) {
        this.refreshNotifs(user.userId);
      }
    });
  }

  ngOnInit() {
    this.auth.refreshCurrentUser();
    this.refreshNotifs();
    // Poll for notifications every 20 seconds for a "live" feel
    this.pollSub = setInterval(() => this.refreshNotifs(), 20000);
  }

  ngOnDestroy() {
    this.navSub?.unsubscribe();
    if (this.pollSub) clearInterval(this.pollSub);
  }

  protected toggleNotifs(event: Event) {
    event.stopPropagation();
    this.showNotifs.update(v => !v);
    if (this.showNotifs()) {
      this.refreshNotifs();
    }
  }

  private refreshNotifs(userId?: number) {
    const uid = userId ?? this.auth.userId();
    if (!uid) return;

    this.api.getUnreadCount(uid).subscribe({
      next: (count) => {
        this.unreadCount.set(Number(count) || 0);
        this.notifError.set('');
      },
      error: () => this.notifError.set('Unable to load notifications.')
    });
    
    this.api.getNotifications(uid).subscribe({
      next: (res) => {
        const data = Array.isArray(res) ? res : [];
        this.notifications.set(data.slice(0, 10)); // Top 10 for performance
        this.notifError.set('');
      },
      error: () => this.notifError.set('Unable to load notifications.')
    });
  }

  protected markRead(n: any) {
    const notificationId = n.notificationId ?? n.id;
    if (n.read || !notificationId) return;
    this.api.markNotificationRead(notificationId).subscribe(() => this.refreshNotifs());
  }

  protected markAllRead() {
    const uid = this.auth.userId();
    if (!uid) return;
    this.api.markAllNotificationsRead(uid).subscribe(() => this.refreshNotifs());
  }

  private updateFromAuth() {
    const user = this.auth.user();
    if (user) {
      const parts = user.fullName?.trim().split(' ') ?? [];
      this.initials.set(parts.length >= 2 ? parts[0][0] + parts[parts.length - 1][0] : (parts[0]?.[0] ?? 'U'));
      this.userName.set(user.fullName ?? '');
    }
  }

  private updateFromUrl() {
    const url = this.router.url;
    this.isStudent = url.startsWith('/student');
    this.isInstructor = url.startsWith('/instructor');
    this.isAdmin = url.startsWith('/admin');
    if (this.isStudent) {
      this.title = 'Student';
      this.navItems = studentNavItems;
      this.profilePath = '/student/profile';
      this.notificationsPath = '/student/notifications';
    } else if (this.isInstructor) {
      this.title = 'Instructor';
      this.navItems = instructorNavItems;
      this.profilePath = '/instructor/profile';
      this.notificationsPath = '/instructor/notifications';
    } else if (this.isAdmin) {
      this.title = 'Admin';
      this.navItems = adminNavItems;
      this.profilePath = '/admin';
      this.notificationsPath = '/admin/notifications';
    }
  }

  protected isExact(path: string): boolean {
    return path === '/student' || path === '/instructor' || path === '/admin';
  }

  protected logout(): void {
    this.auth.logout();
  }
}
