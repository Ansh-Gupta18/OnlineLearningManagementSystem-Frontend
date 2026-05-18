import { DOCUMENT } from '@angular/common';
import { Injectable, inject, signal } from '@angular/core';

export type AppTheme = 'light' | 'dark';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly document = inject(DOCUMENT);
  private readonly storageKey = 'edulearn-theme';

  readonly theme = signal<AppTheme>('light');

  constructor() {
    const storedTheme = this.getStoredTheme();
    const preferredTheme = this.prefersDarkMode() ? 'dark' : 'light';
    this.setTheme(storedTheme ?? preferredTheme, false);
  }

  toggleTheme(): void {
    this.setTheme(this.theme() === 'dark' ? 'light' : 'dark');
  }

  private setTheme(theme: AppTheme, persist = true): void {
    this.theme.set(theme);
    this.document.documentElement.dataset['theme'] = theme;
    this.document.documentElement.style.colorScheme = theme;

    if (persist) {
      localStorage.setItem(this.storageKey, theme);
    }
  }

  private getStoredTheme(): AppTheme | null {
    const storedTheme = localStorage.getItem(this.storageKey);
    return storedTheme === 'light' || storedTheme === 'dark' ? storedTheme : null;
  }

  private prefersDarkMode(): boolean {
    return window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false;
  }
}
