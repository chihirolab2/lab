import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: './', // どのURL（サブパス含む）に置いても動くよう相対パスにする
  plugins: [react()],
  server: { host: true, port: 5174 },
});
