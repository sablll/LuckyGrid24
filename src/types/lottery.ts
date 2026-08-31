export interface PrizeTier {
  rank: number;
  tierName: string;
  prizeAmountFormatted: string;
  prizeAmountNumeric: number;
  totalWinnersCount?: number;
  winningNumbers: string[];
  seriesRequired?: boolean;
  description?: string;
}

export interface OfficialSource {
  sourceName: string;
  sourceUrl: string;
  gazetteNotificationNo?: string;
  verified: boolean;
  directorateName: string;
  verificationHash?: string;
  officialImageUrl?: string;
}

export interface LotteryResult {
  id: string;
  lotteryName: string;
  schemeCode: string;
  stateCode: string;
  stateName: string;
  drawDate: string; // YYYY-MM-DD
  drawNumber: string;
  drawTime: string; // e.g. "03:00 PM"
  bumperDraw?: boolean;
  ticketPriceFormatted: string;
  seriesList: string[];
  firstPrize: {
    amountFormatted: string;
    amountNumeric: number;
    winningTicket: string; // e.g. "WA 789123" or "789123"
    series?: string;
    numberOnly: string;
  };
  consolationPrizes?: {
    amountFormatted: string;
    winningNumbers: string[];
  };
  prizes: PrizeTier[];
  officialSource: OfficialSource;
  officialResultImage?: string; // URL to official government result image scan
  officialResultImageCaption?: string;
  publishedTime: string; // ISO string
  lastUpdatedTime: string; // ISO string
  isDemoData: boolean; // Must be true for test/demo dataset
  verificationStatus: 'VERIFIED_OFFICIAL' | 'PROVISIONAL' | 'VERIFICATION_FAILED';
  sourceRawUrl?: string;
  checksum: string;
}

export interface LotteryScheme {
  id: string;
  stateCode: string;
  name: string;
  code: string;
  drawFrequency: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'BUMPER' | 'FESTIVAL';
  drawDays?: string[];
  drawTime: string;
  ticketPrice: string;
  firstPrize: string;
  description: string;
  officialGazetteRef: string;
  active: boolean;
}

export interface LotteryState {
  code: string;
  name: string;
  shortName: string;
  capital: string;
  legalStatus: 'LEGAL_GOVERNMENT_RUN' | 'LEGAL_AUTHORIZED' | 'PROHIBITED';
  directorateName: string;
  officialPortalUrl: string;
  gazetteDept: string;
  drawTimings: string[];
  description: string;
  establishedYear: number;
  activeSchemesCount: number;
  popularSchemes: string[];
  bannerGradient: string;
}

export interface UpcomingDraw {
  id: string;
  lotteryName: string;
  stateCode: string;
  stateName: string;
  drawDate: string;
  drawTime: string;
  firstPrize: string;
  ticketPrice: string;
  countdownTarget: string; // ISO string
  schemeCode: string;
}

export interface IngestionAdapter {
  id: string;
  name: string;
  stateCode: string;
  stateName: string;
  baseUrl: string;
  sourceType: 'OFFICIAL_DIRECTORATE' | 'STATE_GAZETTE' | 'GOV_API';
  status: 'ACTIVE' | 'IDLE' | 'ERROR' | 'MAINTENANCE';
  lastRunTime: string;
  lastSuccessTime: string;
  successRate: number;
  totalRecordsFetched: number;
  pollingSchedule: string;
  parserFormat: 'JSON' | 'HTML_TABULAR' | 'PDF_GAZETTE' | 'XML_FEED';
  validationRulesCount: number;
  active: boolean;
}

export interface IngestionLog {
  id: string;
  timestamp: string;
  adapterId: string;
  adapterName: string;
  status: 'SUCCESS' | 'VALIDATION_ERROR' | 'NETWORK_ERROR' | 'DUPLICATE_SKIPPED' | 'UNVERIFIED_SOURCE_REJECTED';
  recordsProcessed: number;
  sourceUrl: string;
  message: string;
  details?: string;
  executionTimeMs: number;
}

export interface SearchFilter {
  query?: string;
  stateCode?: string;
  dateFrom?: string;
  dateTo?: string;
  schemeCode?: string;
  drawNumber?: string;
  sortBy?: 'date_desc' | 'date_asc' | 'prize_desc';
  page?: number;
  limit?: number;
}

export interface TicketCheckResult {
  ticketNumber: string;
  series?: string;
  matchedDraws: Array<{
    lotteryResult: LotteryResult;
    matchedPrizes: Array<{
      tierName: string;
      prizeAmountFormatted: string;
      matchingRule: 'EXACT_FULL_TICKET' | 'LAST_4_DIGITS' | 'LAST_5_DIGITS' | 'LAST_3_DIGITS' | 'CONSOLATION';
      winningNumberMatched: string;
    }>;
  }>;
  checkedAt: string;
}

export interface StatisticsOverview {
  totalResultsIndexed: number;
  statesTrackedCount: number;
  activeSchemesCount: number;
  lastIngestionTime: string;
  drawTimeDistribution: Array<{ time: string; count: number; label: string }>;
  hotLastDigits: Array<{ digit: string; count: number; percentage: number }>;
  stateResultCounts: Array<{ stateCode: string; stateName: string; count: number }>;
}
