import { BaseLotteryAdapter } from '../adapters/base';
import { KeralaLotteryAdapter } from '../adapters/keralaAdapter';
import { NagalandLotteryAdapter } from '../adapters/nagalandAdapter';
import { SikkimLotteryAdapter } from '../adapters/sikkimAdapter';
import { PunjabLotteryAdapter } from '../adapters/punjabAdapter';
import { GoaLotteryAdapter } from '../adapters/goaAdapter';
import { LotteryResult, IngestionLog, IngestionAdapter } from '../../src/types/lottery';
import { IngestionExecutionResult } from '../types';

export class IngestionEngine {
  private adapters: Map<string, BaseLotteryAdapter> = new Map();
  private auditLogs: IngestionLog[] = [];
  private onResultsIngested?: (results: LotteryResult[]) => void;
  private existingResultChecker?: (resultId: string) => boolean;

  constructor() {
    this.registerDefaultAdapters();
  }

  public setRepositoryCallbacks(
    onResultsIngested: (results: LotteryResult[]) => void,
    existingResultChecker: (resultId: string) => boolean
  ) {
    this.onResultsIngested = onResultsIngested;
    this.existingResultChecker = existingResultChecker;
  }

  public registerDefaultAdapters() {
    this.registerAdapter(new KeralaLotteryAdapter());
    this.registerAdapter(new NagalandLotteryAdapter());
    this.registerAdapter(new SikkimLotteryAdapter());
    this.registerAdapter(new PunjabLotteryAdapter());
    this.registerAdapter(new GoaLotteryAdapter());
  }

  public registerAdapter(adapter: BaseLotteryAdapter) {
    this.adapters.set(adapter.id, adapter);
  }

  public getAdapters(): IngestionAdapter[] {
    return Array.from(this.adapters.values()).map(adapter => adapter.getAdapterMetadata());
  }

  public getAuditLogs(limit = 100): IngestionLog[] {
    return [...this.auditLogs].reverse().slice(0, limit);
  }

  /**
   * Executes the full pipeline for a specific adapter:
   * 1. Fetch data from configured official/authorized source
   * 2. Verify source origin
   * 3. Validate raw response schema
   * 4. Normalize to standard model
   * 5. Deduplicate against existing results
   * 6. Record source URL and fetch timestamp
   * 7. Audit log everything
   */
  public async runAdapterIngestion(adapterId: string, targetDate?: string): Promise<IngestionExecutionResult> {
    const startTime = Date.now();
    const adapter = this.adapters.get(adapterId);

    if (!adapter) {
      const errorMsg = `Adapter '${adapterId}' not found in registry.`;
      const logEntry: IngestionLog = {
        id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date().toISOString(),
        adapterId,
        adapterName: 'Unknown Adapter',
        status: 'NETWORK_ERROR',
        recordsProcessed: 0,
        sourceUrl: 'N/A',
        message: errorMsg,
        executionTimeMs: Date.now() - startTime
      };
      this.auditLogs.push(logEntry);

      return {
        adapterId,
        success: false,
        recordsIngested: 0,
        recordsSkippedDuplicates: 0,
        recordsRejectedValidation: 0,
        errors: [errorMsg],
        logs: [logEntry],
        sourceUrl: 'N/A'
      };
    }

    try {
      // Step 1: Fetch raw source
      const rawPayload = await adapter.fetchRawSource(targetDate);
      const sourceUrl = rawPayload.sourceUrl;

      // Step 2 & 7: Origin Verification Gate (Never create result if source cannot be verified)
      const isOriginAuthorized = adapter.verifySourceOrigin(sourceUrl);
      if (!isOriginAuthorized) {
        const rejectMsg = `CRITICAL: Source verification failed for URL: ${sourceUrl}. Untrusted origin rejected by security policy.`;
        const logEntry: IngestionLog = {
          id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          timestamp: new Date().toISOString(),
          adapterId: adapter.id,
          adapterName: adapter.name,
          status: 'UNVERIFIED_SOURCE_REJECTED',
          recordsProcessed: 0,
          sourceUrl,
          message: rejectMsg,
          details: 'Domain not in verified Directorate whitelist. Ingestion aborted.',
          executionTimeMs: Date.now() - startTime
        };
        this.auditLogs.push(logEntry);

        return {
          adapterId,
          success: false,
          recordsIngested: 0,
          recordsSkippedDuplicates: 0,
          recordsRejectedValidation: 1,
          errors: [rejectMsg],
          logs: [logEntry],
          sourceUrl
        };
      }

      // Step 3: Validate response schema
      const validation = await adapter.validatePayload(rawPayload);
      if (!validation.valid) {
        const validationErrorMsg = `Schema validation failed: ${validation.errors.join('; ')}`;
        const logEntry: IngestionLog = {
          id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          timestamp: new Date().toISOString(),
          adapterId: adapter.id,
          adapterName: adapter.name,
          status: 'VALIDATION_ERROR',
          recordsProcessed: 0,
          sourceUrl,
          message: validationErrorMsg,
          details: JSON.stringify(validation.errors),
          executionTimeMs: Date.now() - startTime
        };
        this.auditLogs.push(logEntry);

        return {
          adapterId,
          success: false,
          recordsIngested: 0,
          recordsSkippedDuplicates: 0,
          recordsRejectedValidation: 1,
          errors: validation.errors,
          logs: [logEntry],
          sourceUrl
        };
      }

      // Step 4: Normalize result into common database format
      const normalizedResults = await adapter.normalizePayload(rawPayload, validation);

      // Step 5: Prevent duplicate results
      const uniqueResultsToSave: LotteryResult[] = [];
      let duplicatesCount = 0;

      for (const res of normalizedResults) {
        const exists = this.existingResultChecker ? this.existingResultChecker(res.id) : false;
        if (exists) {
          duplicatesCount++;
        } else {
          uniqueResultsToSave.push(res);
        }
      }

      // Save if new records exist
      if (uniqueResultsToSave.length > 0 && this.onResultsIngested) {
        this.onResultsIngested(uniqueResultsToSave);
      }

      // Success Logging
      const logStatus = duplicatesCount > 0 && uniqueResultsToSave.length === 0 ? 'DUPLICATE_SKIPPED' : 'SUCCESS';
      const logMessage = uniqueResultsToSave.length > 0
        ? `Successfully ingested ${uniqueResultsToSave.length} verified draw result(s) from ${adapter.stateName}. Source: ${sourceUrl}`
        : `Result already indexed (draw id: ${normalizedResults[0]?.id}). Duplicate write prevented.`;

      const logEntry: IngestionLog = {
        id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date().toISOString(),
        adapterId: adapter.id,
        adapterName: adapter.name,
        status: logStatus,
        recordsProcessed: normalizedResults.length,
        sourceUrl,
        message: logMessage,
        details: `Ingested: ${uniqueResultsToSave.length}, Skipped Duplicates: ${duplicatesCount}`,
        executionTimeMs: Date.now() - startTime
      };

      this.auditLogs.push(logEntry);

      return {
        adapterId,
        success: true,
        recordsIngested: uniqueResultsToSave.length,
        recordsSkippedDuplicates: duplicatesCount,
        recordsRejectedValidation: 0,
        errors: [],
        logs: [logEntry],
        sourceUrl
      };

    } catch (err: any) {
      const errorMsg = `Exception during ingestion for ${adapter.name}: ${err.message || String(err)}`;
      const logEntry: IngestionLog = {
        id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date().toISOString(),
        adapterId: adapter.id,
        adapterName: adapter.name,
        status: 'NETWORK_ERROR',
        recordsProcessed: 0,
        sourceUrl: adapter.baseUrl,
        message: errorMsg,
        details: err.stack,
        executionTimeMs: Date.now() - startTime
      };

      this.auditLogs.push(logEntry);

      return {
        adapterId,
        success: false,
        recordsIngested: 0,
        recordsSkippedDuplicates: 0,
        recordsRejectedValidation: 0,
        errors: [errorMsg],
        logs: [logEntry],
        sourceUrl: adapter.baseUrl
      };
    }
  }

  /**
   * Runs all registered adapters sequentially
   */
  public async runAllAdapters(): Promise<IngestionExecutionResult[]> {
    const results: IngestionExecutionResult[] = [];
    for (const adapterId of this.adapters.keys()) {
      const res = await this.runAdapterIngestion(adapterId);
      results.push(res);
    }
    return results;
  }
}
