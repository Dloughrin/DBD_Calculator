import { describe, it, expect } from 'vitest';
import { createServer } from '../src/script.js';

const server = createServer();

describe('server', () => {
  it('should be defined', () => {
    expect(server).toBeDefined();
    expect(typeof server.listen).toBe('function');
  });
});