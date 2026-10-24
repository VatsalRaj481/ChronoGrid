import { defineConfig, type Plugin, type Connect } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

/**
 * Defense-in-depth safeguard against CVE-2026-111497 (Node2Shell).
 * Intercepts and rejects incoming requests carrying `Content-Encoding: br` with HTTP 415
 * to prevent Brotli decompression by Node.js runtime servers.
 */
function brotliSafeguardPlugin(): Plugin {
  const middleware: Connect.NextHandleFunction = (req, res, next) => {
    const encoding = req.headers['content-encoding'];
    if (typeof encoding === 'string' && encoding.toLowerCase().includes('br')) {
      res.statusCode = 415;
      res.setHeader('Content-Type', 'application/json');
      res.end(
        JSON.stringify({
          error: 'Unsupported Media Type',
          message:
            'Brotli request decompression (Content-Encoding: br) is disabled due to security advisory CVE-2026-111497 (Node2Shell).',
        })
      );
      return;
    }
    next();
  };

  return {
    name: 'brotli-safeguard-plugin',
    configureServer(server) {
      server.middlewares.use(middleware);
    },
    configurePreviewServer(server) {
      server.middlewares.use(middleware);
    },
  };
}

export default defineConfig({
  plugins: [react(), brotliSafeguardPlugin()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
    },
  },
});
