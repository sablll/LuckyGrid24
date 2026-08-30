import React, { useEffect, useState } from 'react';
import { fetchIngestionAdapters, triggerIngestionSync, fetchIngestionLogs } from '../services/api';
import { IngestionAdapter, IngestionLog } from '../types/lottery';
import { LoadingState } from '../components/common/LoadingState';
import { SEOHead } from '../components/common/SEOHead';
import {
  Server,
  Play,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Clock,
  ExternalLink,
  Code,
  RefreshCw,
  Cpu,
  Layers,
  FileCheck2,
  Lock
} from 'lucide-react';

export const AdminIngestionPage: React.FC = () => {
  const [adapters, setAdapters] = useState<IngestionAdapter[]>([]);
  const [logs, setLogs] = useState<IngestionLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [triggering, setTriggering] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const loadIngestionData = async () => {
    try {
      const [adaptersResp, logsResp] = await Promise.all([
        fetchIngestionAdapters(),
        fetchIngestionLogs(20)
      ]);
      setAdapters(adaptersResp.data);
      setLogs(logsResp.data);
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadIngestionData();
  }, []);

  const handleTrigger = async (adapterId?: string) => {
    setTriggering(adapterId || 'ALL');
    setStatusMessage(null);
    try {
      const resp = await triggerIngestionSync(adapterId);
      setStatusMessage('Ingestion sync executed successfully! Verified results extracted.');
      await loadIngestionData();
    } catch (err: any) {
      setStatusMessage(`Error: ${err.message}`);
    } finally {
      setTriggering(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <SEOHead
        title="Automated Ingestion Pipeline & Architecture | India Lottery Results"
        description="Modular ingestion engine and adapter configurations for automated fetching from verified state government directorate portals."
      />

      {/* Page Header */}
      <div className="pb-6 border-b border-stone-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Server className="w-6 h-6 text-emerald-800" />
            <h1 className="text-2xl sm:text-3xl font-bold text-stone-950 font-editorial-serif tracking-tight">
              Ingestion Pipeline &amp; Source Architecture
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Automated fetch engine, whitelist domain filters, schema validation, and checksum deduplication.
          </p>
        </div>

        <button
          onClick={() => handleTrigger()}
          disabled={triggering !== null}
          className="flex items-center gap-2 px-4 py-2 bg-stone-900 hover:bg-stone-800 disabled:bg-stone-400 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-colors shadow-xs self-start md:self-auto font-mono-code"
        >
          {triggering === 'ALL' ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              Running Full Pipeline...
            </>
          ) : (
            <>
              <Play className="w-4 h-4" />
              Trigger All Adapters
            </>
          )}
        </button>
      </div>

      {/* Status Alert */}
      {statusMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>{statusMessage}</span>
          </div>
          <button onClick={() => setStatusMessage(null)} className="text-emerald-700 hover:text-emerald-950 font-semibold">
            Dismiss
          </button>
        </div>
      )}

      {/* Architecture Pipeline Flow Graphic */}
      <div className="bg-white border border-stone-200 rounded-2xl p-6 sm:p-8 space-y-4 shadow-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-stone-800" />
            <h2 className="text-base sm:text-lg font-bold text-stone-950 font-editorial-serif">
              Deterministic Ingestion Pipeline Workflow
            </h2>
          </div>
          <span className="text-[10px] font-mono-code uppercase font-bold bg-stone-100 text-stone-700 px-2 py-0.5 rounded border border-stone-300">
            Zero-Fabrication Guarantee
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs pt-2">
          <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 space-y-1.5">
            <div className="text-emerald-800 font-mono-code font-bold text-[11px]">01. INITIATION</div>
            <h3 className="font-bold text-stone-900">Target Fetch</h3>
            <p className="text-stone-600 text-[11px]">
              CRON or Webhook triggers state adapter with official publication target URL.
            </p>
          </div>

          <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 space-y-1.5">
            <div className="text-stone-800 font-mono-code font-bold text-[11px]">02. SECURITY</div>
            <h3 className="font-bold text-stone-900">Origin Whitelist</h3>
            <p className="text-stone-600 text-[11px]">
              URL is strictly validated against permitted state directorate &amp; authorized publication whitelist.
            </p>
          </div>

          <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 space-y-1.5">
            <div className="text-amber-800 font-mono-code font-bold text-[11px]">03. VALIDATION</div>
            <h3 className="font-bold text-stone-900">Schema Sanity</h3>
            <p className="text-stone-600 text-[11px]">
              Verifies 1st prize ticket structure, series count, and date sanity.
            </p>
          </div>

          <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 space-y-1.5">
            <div className="text-teal-800 font-mono-code font-bold text-[11px]">04. DEDUPLICATION</div>
            <h3 className="font-bold text-stone-900">Content Hash</h3>
            <p className="text-stone-600 text-[11px]">
              Generates deterministic content ID to prevent duplicate draw records.
            </p>
          </div>

          <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 space-y-1.5">
            <div className="text-stone-800 font-mono-code font-bold text-[11px]">05. PERSISTENCE</div>
            <h3 className="font-bold text-stone-900">Live Store &amp; SEO</h3>
            <p className="text-stone-600 text-[11px]">
              Draw is stored and indexed for instant ticket verification &amp; gazette search.
            </p>
          </div>
        </div>
      </div>

      {/* Configured Source Adapters List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-stone-950 font-editorial-serif tracking-tight">
              Configured State Adapters ({adapters.length})
            </h2>
            <p className="text-xs text-stone-500">Authorized source fetchers with automated parsing pipeline.</p>
          </div>
        </div>

        {loading ? (
          <LoadingState message="Loading adapter configs..." />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {adapters.map(ad => (
              <div
                key={ad.id}
                className="bg-white border border-stone-200 rounded-xl p-5 flex flex-col justify-between space-y-4 shadow-xs"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold uppercase bg-stone-100 text-stone-800 px-2 py-0.5 rounded font-mono-code border border-stone-200">
                      {ad.stateCode}
                    </span>
                    <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-mono-code">
                      {ad.pollingSchedule}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-stone-950 mb-1">{ad.name}</h3>
                  <p className="text-xs text-stone-500 font-mono-code truncate mb-3">
                    Base: {ad.baseUrl}
                  </p>

                  <div className="space-y-1.5 text-[11px] bg-stone-50 p-3 rounded-lg border border-stone-200">
                    <div className="flex justify-between">
                      <span className="text-stone-500">Source Type:</span>
                      <span className="text-stone-800 font-mono-code font-bold uppercase">{ad.sourceType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-500">Parser Format:</span>
                      <span className="text-stone-800 font-mono-code font-bold uppercase">{ad.parserFormat}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-500">Last Ingestion:</span>
                      <span className="text-stone-700 font-mono-code">{new Date(ad.lastRunTime).toLocaleTimeString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-500">Success Rate:</span>
                      <span className="text-emerald-800 font-semibold font-mono-code">{ad.successRate}%</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                  <span className="text-[11px] text-stone-500">Auto-fetching active</span>
                  <button
                    onClick={() => handleTrigger(ad.id)}
                    disabled={triggering !== null}
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-lg transition-colors font-mono-code"
                  >
                    {triggering === ad.id ? (
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Play className="w-3.5 h-3.5" />
                    )}
                    Test Adapter
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent Ingestion Audit Trail Logs */}
      <div className="bg-white border border-stone-200 rounded-2xl p-6 space-y-4 shadow-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileCheck2 className="w-5 h-5 text-emerald-800" />
            <h2 className="text-base sm:text-lg font-bold text-stone-950 font-editorial-serif">
              Recent Ingestion Audit Logs
            </h2>
          </div>
          <span className="text-xs text-stone-500 font-mono-code">Live System Logs</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-stone-700">
            <thead className="bg-stone-50 text-stone-600 uppercase font-semibold text-[10px] border-b border-stone-200 font-mono-code">
              <tr>
                <th className="px-4 py-2.5">Timestamp</th>
                <th className="px-4 py-2.5">Adapter Name</th>
                <th className="px-4 py-2.5">Status</th>
                <th className="px-4 py-2.5">Records Processed</th>
                <th className="px-4 py-2.5">Message / Latency</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200 font-mono-code text-[11px]">
              {logs.map(lg => (
                <tr key={lg.id} className="hover:bg-stone-50">
                  <td className="px-4 py-2 text-stone-500">{new Date(lg.timestamp).toLocaleTimeString()}</td>
                  <td className="px-4 py-2 font-bold text-stone-900">{lg.adapterName}</td>
                  <td className="px-4 py-2">
                    <span className="text-emerald-800 font-semibold uppercase">{lg.status}</span>
                  </td>
                  <td className="px-4 py-2 text-stone-700">{lg.recordsProcessed} draws</td>
                  <td className="px-4 py-2 text-stone-600">{lg.message} ({lg.executionTimeMs}ms)</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
