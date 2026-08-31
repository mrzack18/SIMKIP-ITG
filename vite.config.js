import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
    plugins: [
        tailwindcss(),
        laravel({
            input: 'resources/js/main.tsx',
            refresh: true,
        }),
        react(),
        {
            name: 'fe-error-logger',
            configureServer(server) {
                server.middlewares.use('/__fe-error', (req, res) => {
                    res.setHeader('Access-Control-Allow-Origin', '*');
                    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
                    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
                    if (req.method === 'OPTIONS') { res.writeHead(204); res.end(); return; }
                    let body = '';
                    req.on('data', c => body += c);
                    req.on('end', () => {
                        try {
                            const { msg, loc, type } = JSON.parse(body);
                            const tag = type === 'unhandledrejection' ? '[Unhandled]' : '[FE]';
                            console.log(`\n\x1b[31m✗ ${tag}\x1b[0m ${msg}`);
                            if (loc) console.log(`  \x1b[90m  @ ${loc}\x1b[0m`);
                            console.log();
                        } catch {}
                    });
                    res.writeHead(204); res.end();
                });
            }
        },
    ],
    server: {
        host: '0.0.0.0',
        port: 5174,
        hmr: {
            host: 'localhost',
        },
    },
});
