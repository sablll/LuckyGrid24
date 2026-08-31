import type { IncomingMessage, ServerResponse } from 'http';
import { LotteryStore } from '../server/storage';
import { IngestionEngine } from '../server/services/ingestionEngine';
import { generateOfficialGazetteSvg } from '../server/services/gazetteImageGenerator';
import { LotteryResult } from '../src/types/lottery';

const store = new LotteryStore();
const ingestionEngine = new IngestionEngine();

ingestionEngine.setRepositoryCallbacks(
  (newResults: LotteryResult[]) => store.saveResults(newResults),
  (resultId: string) => store.hasResult(resultId)
);

// Helper to parse JSON body from incoming requests
async function parseRequestBody(req: IncomingMessage & { body?: any }): Promise<any> {
  if (req.body && typeof req.body === 'object') return req.body;
  if (req.body && typeof req.body === 'string') {
    try {
      return JSON.parse(req.body);
    } catch {
      return {};
    }
  }

  return new Promise((resolve) => {
    let data = '';
    req.on('data', (chunk) => {
      data += chunk;
    });
    req.on('end', () => {
      try {
        resolve(data ? JSON.parse(data) : {});
      } catch {
        resolve({});
      }
    });
    req.on('error', () => {
      resolve({});
    });
  });
}

export default async function handler(
  req: IncomingMessage & { query?: Record<string, string>; body?: any },
  res: ServerResponse
) {
  // Global CORS and Header configuration
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');

  if (req.method === 'OPTIONS') {
    res.statusCode = 200;
    res.end();
    return;
  }

  const rawUrl = req.url || '/';
  const url = new URL(rawUrl, `http://${req.headers.host || 'localhost'}`);
  
  // Extract route from query parameters (__route / path) or headers (x-matched-path) or url.pathname
  const routeParam = url.searchParams.get('__route') || url.searchParams.get('path') || (req as any).query?.__route || (req as any).query?.path;
  const headerPath = (req.headers['x-matched-path'] as string) || (req.headers['x-vercel-matched-path'] as string) || (req.headers['x-forwarded-uri'] as string) || (req.headers['x-original-url'] as string);

  let rawPath = routeParam 
    ? (routeParam.startsWith('/') ? routeParam : '/' + routeParam)
    : (url.pathname !== '/api/index' && url.pathname !== '/api' && url.pathname !== '/index' ? url.pathname : (headerPath || url.pathname));

  // Strip leading /api or /api/
  let pathname = rawPath.replace(/^\/api(\/|$)/, '/');
  if (!pathname.startsWith('/')) pathname = '/' + pathname;

  try {
    // 1. Health check
    if (pathname === '/health' || pathname === '/' || pathname === '/index') {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({
        status: 'ok',
        service: 'My India Lottery Vercel Production API',
        timestamp: new Date().toISOString(),
        mode: 'production',
        demoDataMode: false,
        totalRecords: store.getAllResults({ limit: 1 }).total
      }));
      return;
    }

    // 2. States list
    if (pathname === '/states') {
      const states = store.getAllStates();
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ success: true, count: states.length, data: states }));
      return;
    }

    // 3. Single state detail (/states/:code or /states/:slug)
    if (pathname.startsWith('/states/')) {
      const codeOrSlug = decodeURIComponent(pathname.replace(/^\/states\//, '').split('/')[0]);
      const state = store.getStateByCode(codeOrSlug);
      if (!state) {
        res.statusCode = 404;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ success: false, error: `State with code '${codeOrSlug}' not found.` }));
        return;
      }
      const schemes = store.getSchemesByState(state.code);
      const { results } = store.getAllResults({ stateCode: state.code, limit: 10 });
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ success: true, data: { state, schemes, recentDraws: results } }));
      return;
    }

    // 4. Upcoming draws
    if (pathname === '/upcoming') {
      const upcoming = store.getUpcomingDraws();
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ success: true, count: upcoming.length, data: upcoming }));
      return;
    }

    // 5. Today's lottery results
    if (pathname === '/results/today') {
      const date = url.searchParams.get('date') || new Date().toISOString().split('T')[0];
      const results = store.getTodayResults(date);
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ success: true, date, count: results.length, data: results }));
      return;
    }

    // 6. Latest lottery results
    if (pathname === '/results/latest') {
      const limit = parseInt(url.searchParams.get('limit') || '10', 10);
      const results = store.getLatestResults(limit);
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ success: true, count: results.length, data: results }));
      return;
    }

    // 7. Result image endpoint: /results/:id/image or /results/image/:id or /draws/:id/image or query ?drawId=...
    const isImageEndpoint = pathname.endsWith('/image') || pathname.includes('/image/') || pathname.includes('/results/image') || (pathname === '/image' && !!url.searchParams.get('id'));
    if (isImageEndpoint) {
      let drawId = url.searchParams.get('id') || url.searchParams.get('drawId') || '';
      if (!drawId) {
        const m1 = pathname.match(/\/(?:results|draws)\/(?:image\/)?([^/?#]+?)(?:\/image)?$/);
        if (m1 && m1[1]) {
          drawId = decodeURIComponent(m1[1]);
        } else {
          drawId = decodeURIComponent(pathname.replace(/^\/(?:api\/)?(?:results|draws)\//, '').replace(/\/image.*$/, ''));
        }
      }

      const result = drawId ? store.getResultById(drawId) : undefined;
      if (!result) {
        res.statusCode = 404;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ success: false, error: `Draw result with ID '${drawId}' not found.` }));
        return;
      }

      const svg = generateOfficialGazetteSvg(result);
      res.statusCode = 200;
      res.setHeader('Content-Type', 'image/svg+xml; charset=utf-8');
      res.setHeader('Cache-Control', 'public, max-age=86400, s-maxage=86400');
      res.setHeader('Access-Control-Allow-Origin', '*');

      if (url.searchParams.get('download') === 'true') {
        const filename = url.searchParams.get('filename') || `${result.stateCode}_${result.lotteryName.replace(/[^a-zA-Z0-9]/g, '_')}_${result.drawDate}_Official_Gazette.svg`;
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      }

      res.end(svg);
      return;
    }

    // 8. Single lottery result detail: /results/:id
    if (pathname.startsWith('/results/') && pathname !== '/results/today' && pathname !== '/results/latest') {
      const id = decodeURIComponent(pathname.replace(/^\/results\//, '').split('/')[0]);
      const result = store.getResultById(id);
      if (!result) {
        res.statusCode = 404;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ success: false, error: `Draw result with ID '${id}' not found.` }));
        return;
      }
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ success: true, data: result }));
      return;
    }

    // 9. Results with search, filter, pagination: /results
    if (pathname === '/results') {
      const state = url.searchParams.get('state') || undefined;
      const scheme = url.searchParams.get('scheme') || undefined;
      const dateFrom = url.searchParams.get('dateFrom') || undefined;
      const dateTo = url.searchParams.get('dateTo') || undefined;
      const q = url.searchParams.get('q') || undefined;
      const limit = parseInt(url.searchParams.get('limit') || '50', 10);
      const offset = parseInt(url.searchParams.get('offset') || '0', 10);

      const { results, total } = store.getAllResults({
        stateCode: state,
        schemeCode: scheme,
        dateFrom,
        dateTo,
        query: q,
        limit,
        offset
      });

      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ success: true, total, count: results.length, data: results }));
      return;
    }

    // 10. Image proxy & download helper: /proxy-image
    if (pathname === '/proxy-image') {
      const imageUrl = url.searchParams.get('url');
      const isDownload = url.searchParams.get('download') === 'true';

      if (!imageUrl) {
        res.statusCode = 400;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'Valid image URL is required' }));
        return;
      }

      // Handle relative internal URLs (e.g. /api/results/...)
      if (imageUrl.startsWith('/api/results/') || imageUrl.startsWith('/results/')) {
        const idMatch = imageUrl.match(/\/(?:api\/)?results\/([^/?]+)/);
        if (idMatch && idMatch[1]) {
          const result = store.getResultById(idMatch[1]);
          if (result) {
            const svg = generateOfficialGazetteSvg(result);
            res.statusCode = 200;
            res.setHeader('Content-Type', 'image/svg+xml; charset=utf-8');
            res.setHeader('Cache-Control', 'public, max-age=86400, s-maxage=86400');
            if (isDownload) {
              const filename = url.searchParams.get('filename') || `${result.stateCode}_${result.lotteryName.replace(/[^a-zA-Z0-9]/g, '_')}_${result.drawDate}_Official_Gazette.svg`;
              res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
            }
            res.end(svg);
            return;
          }
        }
      }

      if (/^https?:\/\//i.test(imageUrl)) {
        try {
          const proxyRes = await fetch(imageUrl, {
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
              'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8'
            },
            signal: AbortSignal.timeout(10000)
          });

          if (proxyRes.ok) {
            const contentType = proxyRes.headers.get('content-type') || 'image/jpeg';
            const buffer = await proxyRes.arrayBuffer();
            res.statusCode = 200;
            res.setHeader('Content-Type', contentType);
            res.setHeader('Cache-Control', 'public, max-age=86400');
            if (isDownload) {
              const filename = url.searchParams.get('filename') || 'official-lottery-result.jpg';
              res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
            }
            res.end(Buffer.from(buffer));
            return;
          }
        } catch {
          // Fallback to SVG if drawId is provided
        }
      }

      const fallbackDrawId = url.searchParams.get('drawId');
      if (fallbackDrawId) {
        const result = store.getResultById(fallbackDrawId);
        if (result) {
          const svg = generateOfficialGazetteSvg(result);
          res.statusCode = 200;
          res.setHeader('Content-Type', 'image/svg+xml; charset=utf-8');
          res.setHeader('Cache-Control', 'public, max-age=86400');
          res.end(svg);
          return;
        }
      }

      res.statusCode = 400;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ error: 'Image proxy resolution failed' }));
      return;
    }

    // 11. Ticket Checker: /checker
    if (pathname === '/checker') {
      const body = await parseRequestBody(req);
      const { ticketNumber, stateCode, drawId } = body;

      if (!ticketNumber || typeof ticketNumber !== 'string') {
        res.statusCode = 400;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ success: false, error: 'Valid ticketNumber is required.' }));
        return;
      }

      const checkResult = store.checkTicket(ticketNumber, stateCode, drawId);
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ success: true, data: checkResult }));
      return;
    }

    // 12. Statistics: /statistics
    if (pathname === '/statistics') {
      const stats = store.getStatistics();
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ success: true, data: stats }));
      return;
    }

    // 13. Ingestion endpoints
    if (pathname === '/ingestion/status') {
      const { total } = store.getAllResults({ limit: 1 });
      const { total: keralaTotal } = store.getAllResults({ stateCode: 'KL', limit: 1 });
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({
        success: true,
        lastSyncTime: new Date().toISOString(),
        isSyncing: false,
        totalRecords: total,
        keralaTotalRecords: keralaTotal,
        lastSyncSummary: { totalIngested: total, timestamp: new Date().toISOString() }
      }));
      return;
    }

    if (pathname === '/ingestion/sync-all' || pathname === '/ingestion/sync') {
      const results = await ingestionEngine.runAllAdapters();
      const totalIngested = results.reduce((acc, r) => acc + (r.recordsIngested || 0), 0);
      const { total } = store.getAllResults({ limit: 1 });
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({
        success: true,
        data: { totalIngested, results },
        totalRecords: total,
        lastSyncTime: new Date().toISOString()
      }));
      return;
    }

    if (pathname === '/ingestion/sync-kerala') {
      const body = await parseRequestBody(req);
      const limit = body?.limit ? parseInt(body.limit, 10) : 10;
      const syncResult = await ingestionEngine.runAdapterIngestion('kerala-lotteries-gov');
      const { total } = store.getAllResults({ stateCode: 'KL', limit: 1 });
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({
        success: true,
        data: syncResult,
        keralaTotalRecords: total,
        lastSyncTime: new Date().toISOString()
      }));
      return;
    }

    if (pathname === '/ingestion/adapters') {
      const adapters = ingestionEngine.getAdapters();
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ success: true, count: adapters.length, data: adapters }));
      return;
    }

    if (pathname === '/ingestion/logs') {
      const logs = ingestionEngine.getAuditLogs(100);
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ success: true, count: logs.length, data: logs }));
      return;
    }

    // 14. Sitemap: /sitemap.xml
    if (pathname === '/sitemap.xml') {
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

      let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"\n        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">\n`;

      for (const page of staticPages) {
        xml += `  <url>\n    <loc>${domain}${page.path === '' ? '/' : page.path}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${page.changefreq}</changefreq>\n    <priority>${page.priority}</priority>\n  </url>\n`;
      }

      for (const st of states) {
        xml += `  <url>\n    <loc>${domain}/states/${st.code.toLowerCase()}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>daily</changefreq>\n    <priority>0.8</priority>\n  </url>\n`;
      }

      for (const r of results) {
        const lastModDate = r.publishedTime ? r.publishedTime.split('T')[0] : today;
        xml += `  <url>\n    <loc>${domain}/results/${r.id}</loc>\n    <lastmod>${lastModDate}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.7</priority>\n  </url>\n`;
      }

      xml += `</urlset>`;

      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/xml; charset=utf-8');
      res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=3600');
      res.end(xml);
      return;
    }

    // 15. Robots: /robots.txt
    if (pathname === '/robots.txt') {
      const robotsContent = `User-agent: *\nAllow: /\nDisallow: /admin-ingestion\nDisallow: /api/ingestion/trigger\n\nSitemap: https://myindialottery.online/sitemap.xml\n`;
      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/plain; charset=utf-8');
      res.setHeader('Cache-Control', 'public, max-age=86400, s-maxage=86400');
      res.end(robotsContent);
      return;
    }

    res.statusCode = 404;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ success: false, error: `Endpoint '${pathname}' not found` }));
  } catch (err: any) {
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ success: false, error: err.message || 'Internal Server Error' }));
  }
}
