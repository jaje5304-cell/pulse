import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';
import {defineConfig} from 'vite';

function autoRestoreStructure() {
  try {
    const root = process.cwd();
    if (fs.existsSync(path.join(root, 'main.tsx')) && !fs.existsSync(path.join(root, 'src', 'main.tsx'))) {
      const fileMap: Record<string, string> = {
        'BarangayMap.tsx': 'src/components/BarangayMap.tsx',
        'Header.tsx': 'src/components/Header.tsx',
        'HouseholdView.tsx': 'src/components/HouseholdView.tsx',
        'KagawadDashboard.tsx': 'src/components/KagawadDashboard.tsx',
        'RaspberryPiCenter.tsx': 'src/components/RaspberryPiCenter.tsx',
        'ResolutionLogs.tsx': 'src/components/ResolutionLogs.tsx',
        'SourceCodeCenter.tsx': 'src/components/SourceCodeCenter.tsx',
        'TelegramCenter.tsx': 'src/components/TelegramCenter.tsx',
        'LanguageContext.tsx': 'src/context/LanguageContext.tsx',
        'audioAlarm.ts': 'src/utils/audioAlarm.ts',
        'translations.ts': 'src/utils/translations.ts',
        'App.tsx': 'src/App.tsx',
        'main.tsx': 'src/main.tsx',
        'index.css': 'src/index.css',
        'types.ts': 'src/types.ts',
        'icon.svg': 'public/icon.svg',
        'manifest.json': 'public/manifest.json',
        'sw.js': 'public/sw.js',
        'nmp': 'bin/nmp',
        'nmp.js': 'bin/nmp.js',
        'pulse_reports.json': 'data/pulse_reports.json',
        'server.py': 'raspberry-pi-server/server.py',
        'setup_autostart.sh': 'raspberry-pi-server/setup_autostart.sh',
      };
      for (const [srcName, destRel] of Object.entries(fileMap)) {
        const srcPath = path.join(root, srcName);
        const destPath = path.join(root, destRel);
        if (fs.existsSync(srcPath) && !fs.existsSync(destPath)) {
          fs.mkdirSync(path.dirname(destPath), { recursive: true });
          fs.copyFileSync(srcPath, destPath);
        }
      }
    }
  } catch {}
}

export default defineConfig(() => {
  autoRestoreStructure();
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(import.meta.dirname || '.', '.'),
      },
    },
    build: {
      chunkSizeWarningLimit: 2000,
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
