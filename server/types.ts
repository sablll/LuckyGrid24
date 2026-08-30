import { LotteryResult, IngestionLog, IngestionAdapter } from '../src/types/lottery';

export interface RawLotteryPayload {
  sourceUrl: string;
  fetchedAt: string;
  sourceType: string;
  rawContent: any;
  declaredChecksum?: string;
  statusCode: number;
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
  sanitizedData?: Partial<LotteryResult>;
}

export interface IngestionExecutionResult {
  adapterId: string;
  success: boolean;
  recordsIngested: number;
  recordsSkippedDuplicates: number;
  recordsRejectedValidation: number;
  errors: string[];
  logs: IngestionLog[];
  sourceUrl: string;
}
