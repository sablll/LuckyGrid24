import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { LotteryStore } from './server/storage';
import { IngestionEngine } from './server/services/ingestionEngine';
import { LotteryResult } from './src/types/lottery';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Initialize Data Store and Ingestion Engine
  const store = new LotteryStore();
  const ingestionEngine = new IngestionEngine();

  // Connect Ingestion Engine with Store
  ingestionEngine.setRepositoryCallbacks(
    (newResults: LotteryResult[]) => store.saveResults(newResults),
    (resultId: string) => store.hasResult(resultId)
  );

  // --- API ROUTES FIRST ---

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      service: 'India Lottery Results API',
      timestamp: new Date().toISOString(),
      mode: 'production-ready',
      demoDataMode: true
    });
  });

  // 1. Get results with search, filter, pagination
  app.get('/api/results', (req, res) => {
    const { state, scheme, dateFrom, dateTo, q, limit, offset } = req.query;
    const { results, total } = store.getAllResults({
      stateCode: state as string,
      schemeCode: scheme as string,
      dateFrom: dateFrom as string,
      dateTo: dateTo as string,
      query: q as string,
      limit: limit ? parseInt(limit as string, 10) : 50,
      offset: offset ? parseInt(offset as string, 10) : 0
    });

    res.json({
      success: true,
      total,
      count: results.length,
      data: results
    });
  });

  // 2. Today's lottery results
  app.get('/api/results/today', (req, res) => {
    const todayStr = (req.query.date as string) || '2026-08-30';
    const results = store.getTodayResults(todayStr);
    res.json({
      success: true,
      date: todayStr,
      count: results.length,
      data: results
    });
  });

  // 3. Latest lottery results
  app.get('/api/results/latest', (req, res) => {
    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 8;
    const results = store.getLatestResults(limit);
    res.json({
      success: true,
      count: results.length,
      data: results
    });
  });

  // 4. Single lottery result detail
  app.get('/api/results/:id', (req, res) => {
    const result = store.getResultById(req.params.id);
    if (!result) {
      return res.status(404).json({
        success: false,
        error: `Draw result with ID '${req.params.id}' not found.`
      });
    }
    res.json({
      success: true,
      data: result
    });
  });

  // 5. State directories
  app.get('/api/states', (req, res) => {
    const states = store.getAllStates();
    res.json({
      success: true,
      count: states.length,
      data: states
    });
  });

  // 6. State detail + active schemes
  app.get('/api/states/:code', (req, res) => {
    const state = store.getStateByCode(req.params.code);
    if (!state) {
      return res.status(404).json({
        success: false,
        error: `State with code '${req.params.code}' not found.`
      });
    }
    const schemes = store.getSchemesByState(state.code);
    const { results } = store.getAllResults({ stateCode: state.code, limit: 10 });

    res.json({
      success: true,
      data: {
        state,
        schemes,
        recentDraws: results
      }
    });
  });

  // 7. Upcoming draws schedule
  app.get('/api/upcoming', (req, res) => {
    const upcoming = store.getUpcomingDraws();
    res.json({
      success: true,
      count: upcoming.length,
      data: upcoming
    });
  });

  // 8. Ticket number checker
  app.post('/api/checker', (req, res) => {
    const { ticketNumber, stateCode, drawId } = req.body;
    if (!ticketNumber || typeof ticketNumber !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Please provide a valid ticketNumber to check.'
      });
    }

    const checkResult = store.checkTicket(ticketNumber, stateCode, drawId);
    res.json({
      success: true,
      data: checkResult
    });
  });

  // 9. Statistics and draw analytics
  app.get('/api/statistics', (req, res) => {
    const stats = store.getStatistics();
    res.json({
      success: true,
      data: stats
    });
  });

  // 10. Ingestion Admin - Get Adapters
  app.get('/api/ingestion/adapters', (req, res) => {
    const adapters = ingestionEngine.getAdapters();
    res.json({
      success: true,
      count: adapters.length,
      data: adapters
    });
  });

  // 11. Ingestion Admin - Trigger Sync
  app.post('/api/ingestion/trigger', async (req, res) => {
    const { adapterId, targetDate } = req.body;

    if (adapterId) {
      const result = await ingestionEngine.runAdapterIngestion(adapterId, targetDate);
      return res.json({
        success: result.success,
        data: result
      });
    } else {
      const allResults = await ingestionEngine.runAllAdapters();
      return res.json({
        success: true,
        data: allResults
      });
    }
  });

  // 12. Ingestion Admin - Audit Logs
  app.get('/api/ingestion/logs', (req, res) => {
    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 50;
    const logs = ingestionEngine.getAuditLogs(limit);
    res.json({
      success: true,
      count: logs.length,
      data: logs
    });
  });

  // 13. SEO Sitemap Generator
  app.get(['/sitemap.xml', '/api/sitemap.xml'], (req, res) => {
    const { results } = store.getAllResults({ limit: 100 });
    const states = store.getAllStates();
    const domain = process.env.APP_URL || 'https://indialotteryresults.org';

    const staticPages = [
      '',
      '/latest',
      '/states',
      '/previous',
      '/search',
      '/statistics',
      '/about',
      '/disclaimer',
      '/admin-ingestion'
    ];

    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`;

    for (const page of staticPages) {
      xml += `  <url>
    <loc>${domain}${page}</loc>
    <changefreq>hourly</changefreq>
    <priority>${page === '' ? '1.0' : '0.8'}</priority>
  </url>
`;
    }

    for (const st of states) {
      xml += `  <url>
    <loc>${domain}/states/${st.code.toLowerCase()}</loc>
    <changefreq>daily</changefreq>
    <priority>0.7</priority>
  </url>
`;
    }

    for (const r of results) {
      xml += `  <url>
    <loc>${domain}/results/${r.id}</loc>
    <lastmod>${r.publishedTime.split('T')[0]}</lastmod>
    <changefreq>never</changefreq>
    <priority>0.6</priority>
  </url>
`;
    }

    xml += `</urlset>`;

    res.header('Content-Type', 'application/xml');
    res.send(xml);
  });

  // 14. SEO Robots.txt
  app.get(['/robots.txt', '/api/robots.txt'], (req, res) => {
    const domain = process.env.APP_URL || 'https://indialotteryresults.org';
    const robotsContent = `User-agent: *
Allow: /
Disallow: /api/ingestion/trigger

Sitemap: ${domain}/sitemap.xml
`;
    res.header('Content-Type', 'text/plain');
    res.send(robotsContent);
  });

  // --- VITE MIDDLEWARE SETUP ---
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`India Lottery Results server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
