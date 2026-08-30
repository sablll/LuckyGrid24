import type { IncomingMessage, ServerResponse } from 'http';
import { LotteryStore } from '../server/storage';
import { IngestionEngine } from '../server/services/ingestionEngine';
import { LotteryResult } from '../src/types/lottery';

const store = new LotteryStore();
const ingestionEngine = new IngestionEngine();

ingestionEngine.setRepositoryCallbacks(
  (newResults: LotteryResult[]) => store.saveResults(newResults),
  (resultId: string) => store.hasResult(resultId)
);

export default async function handler(req: IncomingMessage & { query?: Record<string, string>; body?: any }, res: ServerResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'OPTIONS') {
    res.statusCode = 200;
    res.end();
    return;
  }

  const url = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`);
  const pathname = url.pathname.replace(/^\/api/, '');

  try {
    if (pathname === '/health' || pathname === '') {
      res.statusCode = 200;
      res.end(JSON.stringify({ status: 'ok', service: 'My India Lottery Vercel API' }));
      return;
    }

    if (pathname === '/states') {
      const states = store.getAllStates();
      res.statusCode = 200;
      res.end(JSON.stringify({ success: true, count: states.length, data: states }));
      return;
    }

    if (pathname.startsWith('/states/')) {
      const code = pathname.split('/')[2];
      const state = store.getStateByCode(code);
      if (!state) {
        res.statusCode = 404;
        res.end(JSON.stringify({ success: false, error: 'State not found' }));
        return;
      }
      const schemes = store.getSchemesByState(state.code);
      const { results } = store.getAllResults({ stateCode: state.code, limit: 10 });
      res.statusCode = 200;
      res.end(JSON.stringify({ success: true, data: { state, schemes, recentDraws: results } }));
      return;
    }

    if (pathname === '/upcoming') {
      const upcoming = store.getUpcomingDraws();
      res.statusCode = 200;
      res.end(JSON.stringify({ success: true, count: upcoming.length, data: upcoming }));
      return;
    }

    if (pathname === '/results/today') {
      const date = url.searchParams.get('date') || new Date().toISOString().split('T')[0];
      const results = store.getTodayResults(date);
      res.statusCode = 200;
      res.end(JSON.stringify({ success: true, date, count: results.length, data: results }));
      return;
    }

    if (pathname === '/results/latest') {
      const limit = parseInt(url.searchParams.get('limit') || '10', 10);
      const results = store.getLatestResults(limit);
      res.statusCode = 200;
      res.end(JSON.stringify({ success: true, count: results.length, data: results }));
      return;
    }

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
      res.end(JSON.stringify({ success: true, total, count: results.length, data: results }));
      return;
    }

    if (pathname === '/statistics') {
      const stats = store.getStatistics();
      res.statusCode = 200;
      res.end(JSON.stringify({ success: true, data: stats }));
      return;
    }

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

    if (pathname === '/robots.txt') {
      const robotsContent = `User-agent: *\nAllow: /\nDisallow: /admin-ingestion\nDisallow: /api/ingestion/trigger\n\nSitemap: https://myindialottery.online/sitemap.xml\n`;
      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/plain; charset=utf-8');
      res.setHeader('Cache-Control', 'public, max-age=86400, s-maxage=86400');
      res.end(robotsContent);
      return;
    }

    res.statusCode = 404;
    res.end(JSON.stringify({ success: false, error: 'Endpoint not found' }));
  } catch (err: any) {
    res.statusCode = 500;
    res.end(JSON.stringify({ success: false, error: err.message || 'Internal Server Error' }));
  }
}
