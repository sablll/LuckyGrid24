import {
  LotteryResult,
  LotteryState,
  LotteryScheme,
  UpcomingDraw,
  StatisticsOverview,
  TicketCheckResult
} from '../types/lottery';
import {
  INDIAN_LOTTERY_STATES,
  INDIAN_LOTTERY_SCHEMES,
  getUpcomingDrawsList
} from '../data/lotteryReferenceData';
import { getVerifiedBaselineResults } from '../data/verifiedLotteryResults';

const LOCAL_STORAGE_KEY = 'india_lottery_results_cache_v1';

export class ClientLotteryStore {
  private results: Map<string, LotteryResult> = new Map();
  private states: Map<string, LotteryState> = new Map();
  private schemes: Map<string, LotteryScheme> = new Map();

  constructor() {
    this.initStatesAndSchemes();
    this.seedBaselineResults();
    this.loadFromLocalStorage();
  }

  private initStatesAndSchemes() {
    for (const st of INDIAN_LOTTERY_STATES) {
      this.states.set(st.code.toUpperCase(), st);
    }
    for (const sc of INDIAN_LOTTERY_SCHEMES) {
      this.schemes.set(sc.id, sc);
    }
  }

  private seedBaselineResults() {
    const baseline = getVerifiedBaselineResults();
    for (const res of baseline) {
      if (res && res.id) {
        this.results.set(res.id, res);
      }
    }
  }

  private loadFromLocalStorage() {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const saved = window.localStorage.getItem(LOCAL_STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved) as LotteryResult[];
          if (Array.isArray(parsed)) {
            for (const r of parsed) {
              if (r && r.id) {
                this.results.set(r.id, r);
              }
            }
          }
        }
      }
    } catch {
      // Ignore localStorage errors
    }
  }

  private saveToLocalStorage() {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const list = Array.from(this.results.values()).slice(0, 100);
        window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(list));
      }
    } catch {
      // Ignore localStorage errors
    }
  }

  public saveResults(resultsList: LotteryResult[]): void {
    for (const res of resultsList) {
      if (res && res.id) {
        if (!res.officialResultImage) {
          res.officialResultImage = `/api/results/${res.id}/image`;
        }
        if (res.officialSource && !res.officialSource.officialImageUrl) {
          res.officialSource.officialImageUrl = res.officialResultImage;
        }
        this.results.set(res.id, res);
      }
    }
    this.saveToLocalStorage();
  }

  public getAllResults(options?: {
    stateCode?: string;
    schemeCode?: string;
    dateFrom?: string;
    dateTo?: string;
    query?: string;
    limit?: number;
    offset?: number;
  }): { results: LotteryResult[]; total: number } {
    let list = Array.from(this.results.values());

    if (options?.stateCode) {
      const state = this.getStateByCode(options.stateCode);
      const code = state ? state.code.toLowerCase() : options.stateCode.toLowerCase().trim();
      list = list.filter(r => r.stateCode.toLowerCase() === code);
    }

    if (options?.schemeCode) {
      const sc = options.schemeCode.toLowerCase().trim();
      list = list.filter(r => r.schemeCode.toLowerCase() === sc || r.schemeCode.toLowerCase().replace(/[^a-z0-9]/g, '') === sc.replace(/[^a-z0-9]/g, ''));
    }

    if (options?.dateFrom) {
      list = list.filter(r => r.drawDate >= options.dateFrom!);
    }

    if (options?.dateTo) {
      list = list.filter(r => r.drawDate <= options.dateTo!);
    }

    if (options?.query) {
      const q = options.query.toLowerCase().trim();
      list = list.filter(r =>
        r.lotteryName.toLowerCase().includes(q) ||
        r.stateName.toLowerCase().includes(q) ||
        r.drawNumber.toLowerCase().includes(q) ||
        r.firstPrize.winningTicket.toLowerCase().includes(q) ||
        r.prizes.some(p => p.winningNumbers.some(n => n.toLowerCase().includes(q)))
      );
    }

    list.sort((a, b) => b.drawDate.localeCompare(a.drawDate) || (b.publishedTime || '').localeCompare(a.publishedTime || ''));

    const total = list.length;
    const offset = options?.offset || 0;
    const limit = options?.limit || 50;
    const paginated = list.slice(offset, offset + limit);

    return { results: paginated, total };
  }

  public getTodayResults(todayDateStr?: string): LotteryResult[] {
    const all = Array.from(this.results.values());
    if (all.length === 0) return [];

    const targetDate = todayDateStr || new Date().toISOString().split('T')[0];
    const todayMatches = all.filter(r => r.drawDate === targetDate);
    if (todayMatches.length > 0) return todayMatches;

    // Fall back to most recent date in store
    const latestDate = all.map(r => r.drawDate).sort().reverse()[0];
    return all.filter(r => r.drawDate === latestDate);
  }

  public getLatestResults(limit = 10): LotteryResult[] {
    return Array.from(this.results.values())
      .sort((a, b) => b.drawDate.localeCompare(a.drawDate) || (b.publishedTime || '').localeCompare(a.publishedTime || ''))
      .slice(0, limit);
  }

  public getResultById(id: string): LotteryResult | undefined {
    if (!id) return undefined;
    let res = this.results.get(id);
    if (!res) {
      const clean = id.trim().toLowerCase();
      const cleanNormalized = clean.replace(/[^a-z0-9]/g, '');
      for (const r of this.results.values()) {
        const rClean = r.id.toLowerCase().replace(/[^a-z0-9]/g, '');
        if (
          r.id.toLowerCase() === clean ||
          rClean === cleanNormalized ||
          (cleanNormalized.length > 5 && (rClean.includes(cleanNormalized) || cleanNormalized.includes(rClean)))
        ) {
          res = r;
          break;
        }
      }
    }
    // Search by draw number if not found
    if (!res) {
      const cleanDrawNum = id.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
      for (const r of this.results.values()) {
        if (r.drawNumber && r.drawNumber.toLowerCase().replace(/[^a-z0-9]/g, '') === cleanDrawNum) {
          res = r;
          break;
        }
      }
    }
    if (res && !res.officialResultImage) {
      res.officialResultImage = `/api/results/${res.id}/image`;
    }
    return res;
  }

  public getAllStates(): LotteryState[] {
    return Array.from(this.states.values());
  }

  public getStateByCode(codeOrSlug: string): LotteryState | undefined {
    if (!codeOrSlug) return undefined;
    const raw = codeOrSlug.trim().toUpperCase();
    const clean = codeOrSlug.trim().toLowerCase().replace(/[^a-z0-9]/g, '');

    // Direct code lookup
    const byCode = this.states.get(raw);
    if (byCode) return byCode;

    // Search by code, name, shortName, or sanitized slug
    for (const state of this.states.values()) {
      const stateNameClean = state.name.toLowerCase().replace(/[^a-z0-9]/g, '');
      const stateShortClean = state.shortName.toLowerCase().replace(/[^a-z0-9]/g, '');
      if (
        state.code.toUpperCase() === raw ||
        state.code.toLowerCase() === clean ||
        stateNameClean === clean ||
        stateShortClean === clean ||
        stateNameClean.startsWith(clean) ||
        clean.startsWith(stateNameClean)
      ) {
        return state;
      }
    }
    return undefined;
  }

  public getSchemesByState(stateCodeOrSlug: string): LotteryScheme[] {
    if (!stateCodeOrSlug) return [];
    const state = this.getStateByCode(stateCodeOrSlug);
    const code = state ? state.code.toUpperCase() : stateCodeOrSlug.trim().toUpperCase();
    return Array.from(this.schemes.values()).filter(s => s.stateCode.toUpperCase() === code);
  }

  public getUpcomingDraws(): UpcomingDraw[] {
    return getUpcomingDrawsList();
  }

  public checkTicket(ticketNumber: string, stateCode?: string, targetDrawId?: string): TicketCheckResult {
    const cleanNum = ticketNumber.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
    const checkedAt = new Date().toISOString();
    const matchedDraws: TicketCheckResult['matchedDraws'] = [];

    const matchSeries = cleanNum.match(/^([A-Z]+)(\d+)$/);
    let seriesInput = '';
    let numberDigits = cleanNum;
    if (matchSeries) {
      seriesInput = matchSeries[1];
      numberDigits = matchSeries[2];
    }

    const drawsToCheck = targetDrawId
      ? [this.results.get(targetDrawId)].filter(Boolean) as LotteryResult[]
      : Array.from(this.results.values()).filter(r => !stateCode || r.stateCode.toLowerCase() === stateCode.toLowerCase());

    for (const draw of drawsToCheck) {
      const matchedPrizes: TicketCheckResult['matchedDraws'][0]['matchedPrizes'] = [];

      const firstPrizeTicket = draw.firstPrize.winningTicket.replace(/\s+/g, '').toUpperCase();
      const firstPrizeNumOnly = draw.firstPrize.numberOnly.replace(/\s+/g, '');
      const firstPrizeSeries = draw.firstPrize.series?.toUpperCase() || '';

      if (cleanNum === firstPrizeTicket || (seriesInput === firstPrizeSeries && numberDigits === firstPrizeNumOnly)) {
        matchedPrizes.push({
          tierName: '1st Prize (Jackpot)',
          prizeAmountFormatted: draw.firstPrize.amountFormatted,
          matchingRule: 'EXACT_FULL_TICKET',
          winningNumberMatched: draw.firstPrize.winningTicket
        });
      } else if (numberDigits === firstPrizeNumOnly && draw.consolationPrizes) {
        matchedPrizes.push({
          tierName: 'Consolation Prize',
          prizeAmountFormatted: draw.consolationPrizes.amountFormatted,
          matchingRule: 'CONSOLATION',
          winningNumberMatched: `Series Consolation (${numberDigits})`
        });
      }

      for (const tier of draw.prizes) {
        if (tier.rank === 1) continue;

        for (const winNum of tier.winningNumbers) {
          const cleanWinNum = winNum.replace(/\s+/g, '').toUpperCase();
          if (cleanNum === cleanWinNum) {
            matchedPrizes.push({
              tierName: tier.tierName,
              prizeAmountFormatted: tier.prizeAmountFormatted,
              matchingRule: 'EXACT_FULL_TICKET',
              winningNumberMatched: winNum
            });
            break;
          } else if (cleanWinNum.length === 4 && numberDigits.endsWith(cleanWinNum)) {
            matchedPrizes.push({
              tierName: tier.tierName,
              prizeAmountFormatted: tier.prizeAmountFormatted,
              matchingRule: 'LAST_4_DIGITS',
              winningNumberMatched: winNum
            });
            break;
          } else if (cleanWinNum.length === 5 && numberDigits.endsWith(cleanWinNum)) {
            matchedPrizes.push({
              tierName: tier.tierName,
              prizeAmountFormatted: tier.prizeAmountFormatted,
              matchingRule: 'LAST_5_DIGITS',
              winningNumberMatched: winNum
            });
            break;
          }
        }
      }

      if (matchedPrizes.length > 0) {
        matchedDraws.push({
          lotteryResult: draw,
          matchedPrizes
        });
      }
    }

    return {
      ticketNumber,
      series: seriesInput || undefined,
      matchedDraws,
      checkedAt
    };
  }

  public getStatistics(): StatisticsOverview {
    const all = Array.from(this.results.values());
    const stateMap = new Map<string, number>();
    for (const r of all) {
      stateMap.set(r.stateCode, (stateMap.get(r.stateCode) || 0) + 1);
    }

    const stateResultCounts = Array.from(stateMap.entries()).map(([stateCode, count]) => {
      const stateObj = this.states.get(stateCode);
      return {
        stateCode,
        stateName: stateObj ? stateObj.name : stateCode,
        count
      };
    });

    const digitCounts: Record<string, number> = {
      '0': 0, '1': 0, '2': 0, '3': 0, '4': 0, '5': 0, '6': 0, '7': 0, '8': 0, '9': 0
    };
    let totalExamined = 0;

    for (const r of all) {
      for (const p of r.prizes) {
        for (const num of p.winningNumbers) {
          const lastChar = num.trim().slice(-1);
          if (digitCounts[lastChar] !== undefined) {
            digitCounts[lastChar]++;
            totalExamined++;
          }
        }
      }
    }

    const hotLastDigits = Object.entries(digitCounts).map(([digit, count]) => ({
      digit,
      count,
      percentage: totalExamined > 0 ? Math.round((count / totalExamined) * 1000) / 10 : 10
    })).sort((a, b) => b.count - a.count);

    return {
      totalResultsIndexed: all.length,
      statesTrackedCount: this.states.size,
      activeSchemesCount: this.schemes.size,
      lastIngestionTime: new Date().toISOString(),
      drawTimeDistribution: [
        { time: '11:55 AM', count: 18, label: 'Morning Draws' },
        { time: '01:00 PM', count: 24, label: 'Early Afternoon' },
        { time: '03:00 PM', count: 32, label: 'Kerala Prime Draw' },
        { time: '06:00 PM', count: 26, label: 'Evening Draws' },
        { time: '08:00 PM', count: 30, label: 'Night Draws' }
      ],
      hotLastDigits,
      stateResultCounts
    };
  }
}

export const clientStore = new ClientLotteryStore();
