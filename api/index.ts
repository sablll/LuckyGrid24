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
      res.end(JSON.stringify({ status: 'ok', service: 'India Lottery Results Vercel API' }));
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

    res.statusCode = 404;
    res.end(JSON.stringify({ success: false, error: 'Endpoint not found' }));
  } catch (err: any) {
    res.statusCode = 500;
    res.end(JSON.stringify({ success: false, error: err.message || 'Internal Server Error' }));
  }
}
