import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true,
    proxy: {
      // Replace '/your-org' with your actual organization/tenant path
      '/uipathlabs/playground': {
        target: 'https://staging.uipath.com',
        changeOrigin: true,
        secure: true,
      },
    },
  }
})
