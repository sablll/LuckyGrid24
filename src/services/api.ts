import {
  LotteryResult,
  LotteryState,
  LotteryScheme,
  UpcomingDraw,
  StatisticsOverview,
  TicketCheckResult,
  IngestionAdapter,
  IngestionLog
} from '../types/lottery';

const BASE_URL = '/api';

export async function fetchResults(params?: {
  state?: string;
  scheme?: string;
  dateFrom?: string;
  dateTo?: string;
  q?: string;
  limit?: number;
  offset?: number;
}): Promise<{ total: number; count: number; data: LotteryResult[] }> {
  const query = new URLSearchParams();
  if (params?.state) query.set('state', params.state);
  if (params?.scheme) query.set('scheme', params.scheme);
  if (params?.dateFrom) query.set('dateFrom', params.dateFrom);
  if (params?.dateTo) query.set('dateTo', params.dateTo);
  if (params?.q) query.set('q', params.q);
  if (params?.limit) query.set('limit', params.limit.toString());
  if (params?.offset) query.set('offset', params.offset.toString());

  const res = await fetch(`${BASE_URL}/results?${query.toString()}`);
  if (!res.ok) throw new Error(`Failed to fetch results: ${res.statusText}`);
  return res.json();
}

export async function fetchTodayResults(date?: string): Promise<{ date: string; data: LotteryResult[] }> {
  const url = date ? `${BASE_URL}/results/today?date=${date}` : `${BASE_URL}/results/today`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch today results: ${res.statusText}`);
  return res.json();
}

export async function fetchLatestResults(limit = 8): Promise<{ data: LotteryResult[] }> {
  const res = await fetch(`${BASE_URL}/results/latest?limit=${limit}`);
  if (!res.ok) throw new Error(`Failed to fetch latest results: ${res.statusText}`);
  return res.json();
}

export async function fetchResultById(id: string): Promise<{ data: LotteryResult }> {
  const res = await fetch(`${BASE_URL}/results/${id}`);
  if (!res.ok) throw new Error(`Result not found for id: ${id}`);
  return res.json();
}

export async function fetchStates(): Promise<{ data: LotteryState[] }> {
  const res = await fetch(`${BASE_URL}/states`);
  if (!res.ok) throw new Error(`Failed to fetch states: ${res.statusText}`);
  return res.json();
}

export async function fetchStateDetail(code: string): Promise<{
  data: {
    state: LotteryState;
    schemes: LotteryScheme[];
    recentDraws: LotteryResult[];
  };
}> {
  const res = await fetch(`${BASE_URL}/states/${code}`);
  if (!res.ok) throw new Error(`Failed to fetch state ${code}: ${res.statusText}`);
  return res.json();
}

export async function fetchUpcomingDraws(): Promise<{ data: UpcomingDraw[] }> {
  const res = await fetch(`${BASE_URL}/upcoming`);
  if (!res.ok) throw new Error(`Failed to fetch upcoming draws: ${res.statusText}`);
  return res.json();
}

export async function checkTicket(ticketNumber: string, stateCode?: string, drawId?: string): Promise<{ data: TicketCheckResult }> {
  const res = await fetch(`${BASE_URL}/checker`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ticketNumber, stateCode, drawId })
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to check ticket');
  }
  return res.json();
}

export async function fetchStatistics(): Promise<{ data: StatisticsOverview }> {
  const res = await fetch(`${BASE_URL}/statistics`);
  if (!res.ok) throw new Error(`Failed to fetch statistics: ${res.statusText}`);
  return res.json();
}

export async function fetchIngestionAdapters(): Promise<{ data: IngestionAdapter[] }> {
  const res = await fetch(`${BASE_URL}/ingestion/adapters`);
  if (!res.ok) throw new Error(`Failed to fetch ingestion adapters: ${res.statusText}`);
  return res.json();
}

export async function triggerIngestionSync(adapterId?: string, targetDate?: string): Promise<{ success: boolean; data: any }> {
  const res = await fetch(`${BASE_URL}/ingestion/trigger`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ adapterId, targetDate })
  });
  if (!res.ok) throw new Error(`Ingestion trigger failed: ${res.statusText}`);
  return res.json();
}

export async function fetchIngestionLogs(limit = 50): Promise<{ data: IngestionLog[] }> {
  const res = await fetch(`${BASE_URL}/ingestion/logs?limit=${limit}`);
  if (!res.ok) throw new Error(`Failed to fetch ingestion logs: ${res.statusText}`);
  return res.json();
}
