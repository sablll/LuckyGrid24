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

  // CORS and Cache Headers
  app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') {
      return res.sendStatus(200);
    }
    next();
  });

  // Initialize Data Store and Ingestion Engine
  const store = new LotteryStore();
  const ingestionEngine = new IngestionEngine();

  // Connect Ingestion Engine with Store
  ingestionEngine.setRepositoryCallbacks(
    (newResults: LotteryResult[]) => store.saveResults(newResults),
    (resultId: string) => store.hasResult(resultId)
  );

  // Automatic Background Ingestion for Kerala Real Results on Boot
  let lastSyncTime: string | null = null;
  let isSyncing = false;

  const triggerKeralaRealSync = async (limit = 10) => {
    if (isSyncing) return { inProgress: true };
    isSyncing = true;
    try {
      console.log(`[SyncEngine] Fetching real Kerala lottery results from authorized sources...`);
      const result = await ingestionEngine.ingestKeralaRecentDraws(limit);
      lastSyncTime = new Date().toISOString();
      console.log(`[SyncEngine] Kerala fetch complete: ${result.recordsIngested} new results ingested.`);
      return result;
    } catch (err: any) {
      console.error('[SyncEngine] Error during Kerala lottery sync:', err.message);
      return { success: false, error: err.message };
    } finally {
      isSyncing = false;
    }
  };

  // Run initial sync asynchronously so server binds port immediately
  setTimeout(() => {
    triggerKeralaRealSync(10);
  }, 1000);

  // Periodic Polling: Every 15 minutes
  setInterval(() => {
    triggerKeralaRealSync(5);
  }, 15 * 60 * 1000);

  // --- API ROUTES FIRST ---

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      service: 'My India Lottery API',
      timestamp: new Date().toISOString(),
      mode: 'production-ready',
      demoDataMode: false,
      lastSyncTime,
      totalRecords: store.getAllResults({ limit: 1 }).total
    });
  });

  // Dedicated Kerala Live Sync Endpoint
  app.post('/api/ingestion/sync-kerala', async (req, res) => {
    const limit = req.body?.limit ? parseInt(req.body.limit, 10) : 10;
    const syncResult = await triggerKeralaRealSync(limit);
    const { total } = store.getAllResults({ stateCode: 'KL', limit: 1 });
    res.json({
      success: true,
      data: syncResult,
      keralaTotalRecords: total,
      lastSyncTime
    });
  });

  // Sync status
  app.get('/api/ingestion/status', (req, res) => {
    const { total } = store.getAllResults({ stateCode: 'KL', limit: 1 });
    res.json({
      success: true,
      lastSyncTime,
      isSyncing,
      keralaTotalRecords: total
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
    const todayStr = (req.query.date as string) || new Date().toISOString().split('T')[0];
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
    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 10;
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

  // 13. SEO Dynamic XML Sitemap Generator
  app.get(['/sitemap.xml', '/api/sitemap.xml'], (req, res) => {
    const { results } = store.getAllResults({ limit: 500 });
    const states = store.getAllStates();
    const domain = 'https://myindialottery.online';
    const today = new Date().toISOString().split('T')[0];

    const staticPages = [
      { path: '', changefreq: 'hourly', priority: '1.0' },
      { path: '/latest', changefreq: 'hourly', priority: '0.9' },
      { path: '/previous', changefreq: 'daily', priority: '0.8' },
      { path: '/states', changefreq: 'daily', priority: '0.8' },
      { path: '/search', changefreq: 'daily', priority: '0.8' },
      { path: '/statistics', changefreq: 'daily', priority: '0.7' },
      { path: '/about', changefreq: 'monthly', priority: '0.5' },
      { path: '/disclaimer', changefreq: 'monthly', priority: '0.5' },
      { path: '/contact', changefreq: 'monthly', priority: '0.5' }
    ];

    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
`;

    // Static core pages
    for (const page of staticPages) {
      xml += `  <url>
    <loc>${domain}${page.path === '' ? '/' : page.path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>
`;
    }

    // State category pages
    for (const st of states) {
      xml += `  <url>
    <loc>${domain}/states/${st.code.toLowerCase()}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>
`;
    }

    // Individual Draw results
    for (const r of results) {
      const lastModDate = r.publishedTime ? r.publishedTime.split('T')[0] : today;
      xml += `  <url>
    <loc>${domain}/results/${r.id}</loc>
    <lastmod>${lastModDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
`;
    }

    xml += `</urlset>`;

    res.header('Content-Type', 'application/xml; charset=utf-8');
    res.header('Cache-Control', 'public, max-age=3600, s-maxage=3600');
    res.send(xml);
  });

  // 14. SEO Robots.txt
  app.get(['/robots.txt', '/api/robots.txt'], (req, res) => {
    const robotsContent = `User-agent: *
Allow: /
Disallow: /admin-ingestion
Disallow: /api/ingestion/trigger

Sitemap: https://myindialottery.online/sitemap.xml
`;
    res.header('Content-Type', 'text/plain; charset=utf-8');
    res.header('Cache-Control', 'public, max-age=86400, s-maxage=86400');
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
    console.log(`My India Lottery server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
