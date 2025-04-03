import { describe, it, expect, vi, beforeEach } from 'vitest';
import { setupCounter } from '@/counter';

describe('setupCounter', () => {
  let element: HTMLButtonElement;

  beforeEach(() => {
    element = document.createElement('button');
    document.body.appendChild(element);
  });

  it('should set initial counter value to 0', () => {
    setupCounter(element);
    expect(element.innerHTML).toBe('count is 0');
  });

  it('should increment counter value on click', () => {
    setupCounter(element);
    element.click();
    expect(element.innerHTML).toBe('count is 1');
    element.click();
    expect(element.innerHTML).toBe('count is 2');
  });
});