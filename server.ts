import 'dotenv/config';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import express from 'express';
import type {Request, Response} from 'express';
import {handleRecommendOutfit} from './api/recommend-outfit.ts';
import {handleWeather} from './api/weather.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT) || 3000;
const isProduction =
  process.env.NODE_ENV === 'production' || process.env.npm_lifecycle_event === 'start';

async function startServer() {
  const app = express();
  app.use(express.json({limit: '100kb'}));

  // Local Express dev/start routes sharing the exact same handlers as Vercel Serverless Functions
  app.all('/api/weather', (req: Request, res: Response) => {
    void handleWeather(req, res);
  });

  app.all('/api/recommend-outfit', (req: Request, res: Response) => {
    void handleRecommendOutfit(req, res);
  });

  if (!isProduction) {
    const {createServer: createViteServer} = await import('vite');
    const vite = await createViteServer({
      server: {middlewareMode: true},
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(__dirname, 'dist');
    app.use(express.static(distDir));
    app.get('*', (_req: Request, res: Response) => {
      const indexPath = path.join(distDir, 'index.html');
      if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
      } else {
        res.status(404).send('Build output not found.');
      }
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
