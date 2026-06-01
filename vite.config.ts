import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

import type { IncomingMessage } from 'node:http';

// Reads chunks from a Node.js IncomingMessage into a UTF-8 string.
function readBody(req: IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on('data', (chunk: Buffer) => chunks.push(chunk));
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf-8')));
    req.on('error', reject);
  });
}

export default defineConfig(({ mode }) => {
  // Load .env / .env.local so ANTHROPIC_API_KEY is available server-side.
  // The empty prefix means "include ALL env vars", not just VITE_-prefixed ones.
  const env = loadEnv(mode, process.cwd(), '');
  const apiKey = env['ANTHROPIC_API_KEY'] ?? '';

  return {
    plugins: [
      react(),
      {
        name: 'anthropic-vibe-proxy',
        // This middleware only runs during `npm run dev`.
        // It holds the API key server-side — the key never reaches the browser bundle.
        configureServer(server) {
          // eslint-disable-next-line @typescript-eslint/no-misused-promises
          server.middlewares.use('/api/vibe', async (req, res) => {
            if (req.method !== 'POST') {
              res.statusCode = 405;
              res.end('Method Not Allowed');
              return;
            }

            // No key → return fallback signal; frontend renders a canned summary.
            if (!apiKey) {
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ summary: null, fallback: true }));
              return;
            }

            try {
              const raw = await readBody(req);
              const { name, country, travelMonth } = JSON.parse(raw) as {
                name: string;
                country: string;
                travelMonth: string;
              };

              const prompt =
                `Write a 2–3 sentence travel vibe summary for ${name}, ${country}. ` +
                `Best travel window: ${travelMonth}. ` +
                `Be evocative, honest, and concise. Plain prose only — no markdown.`;

              // Dynamic import so the SDK is never bundled into client JS.
              const { default: Anthropic } = await import('@anthropic-ai/sdk');
              const client = new Anthropic({ apiKey });

              const msg = await client.messages.create({
                model: 'claude-sonnet-4-6',
                max_tokens: 200,
                messages: [{ role: 'user', content: prompt }],
              });

              const block = msg.content[0];
              const summary = block?.type === 'text' ? block.text : '';

              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ summary, fallback: false }));
            } catch (err) {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: String(err) }));
            }
          });
        },
      },
    ],
  };
});
