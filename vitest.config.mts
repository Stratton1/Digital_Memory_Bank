import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'node', // Changed from jsdom to node for minimal test
    globals: true,
    include: ['**/*.test.{ts,tsx}', '**/*.spec.{ts,tsx}'],
  },
})
