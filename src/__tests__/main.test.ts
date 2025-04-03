import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createApp } from '@/main';

describe('DOM tests', () => {
  let createElementSpy: any;
  let querySelectorSpy: any;

  beforeEach(() => {
    // Mock document.createElement
    createElementSpy = vi.spyOn(document, 'createElement').mockImplementation((tagName: string) => {
      return { tagName, innerHTML: '', id: 'mock-element' } as HTMLElement;
    });

    // Mock document.querySelector
    querySelectorSpy = vi.spyOn(document, 'querySelector').mockImplementation((selector: string) => {
      return { id: 'mock-element', innerHTML: 'Mocked Content' } as HTMLElement;
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('createApp', () => {
    it('should create the app and set innerHTML', () => {
      const app = createApp();
      expect(app).toContain('Vite + TypeScript');
      expect(app).toContain('Click on the Vite and TypeScript logos to learn more');
    });
  });
});
