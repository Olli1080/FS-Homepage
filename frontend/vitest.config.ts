import { defineConfig, mergeConfig } from 'vitest/config'
import { configFunction } from './vite.config'

export default defineConfig(async () => {
  const baseConfig = await configFunction({ isProd: false, isSSR: false })
  
  return mergeConfig(baseConfig, {
    test: {
      environment: 'jsdom',
      include: ['src/**/*.{test,spec}.{ts,js,vue}'],
      globals: true,
      server: {
        deps: {
          inline: [/vuetify/]
        }
      }
    }
  })
})
