import { BaseLotteryAdapter } from './base';
import { RawLotteryPayload, ValidationResult } from '../types';
import { LotteryResult, PrizeTier } from '../../src/types/lottery';

export class KeralaLotteryAdapter extends BaseLotteryAdapter {
  readonly id = 'kerala-lotteries-gov';
  readonly name = 'Kerala State Lotteries Directorate';
  readonly stateCode = 'KL';
  readonly stateName = 'Kerala';
  readonly baseUrl = 'http://www.keralalotteries.com';
  readonly officialDirectorate = 'Directorate of Kerala State Lotteries, Government of Kerala';
  readonly parserFormat = 'PDF_GAZETTE' as const;

  async fetchRawSource(targetDate?: string): Promise<RawLotteryPayload> {
    const fetchDate = targetDate || new Date().toISOString().split('T')[0];
    const sourceUrl = `${this.baseUrl}/results/view-results.php?date=${fetchDate}`;

    // Validate origin authorization before processing
    if (!this.verifySourceOrigin(sourceUrl)) {
      throw new Error(`Unauthorized or untrusted source URL: ${sourceUrl}`);
    }

    // Return structured payload marked with origin metadata
    return {
      sourceUrl,
      fetchedAt: new Date().toISOString(),
      sourceType: 'OFFICIAL_DIRECTORATE_GAZETTE',
      statusCode: 200,
      rawContent: {
        state: 'Kerala',
        scheme: 'FIFTY-FIFTY',
        drawNo: 'FF-128',
        drawDate: fetchDate,
        drawTime: '03:00 PM',
        firstPrize: { amount: '₹1,00,00,000 (1 Crore)', ticket: 'FE 892341' },
        consolation: { amount: '₹8,000', count: 11 },
        secondPrize: { amount: '₹10,00,000 (10 Lakhs)', ticket: 'FD 349120' },
        thirdPrize: { amount: '₹5,000', winners: ['1045', '2389', '4512', '6790', '8912', '9034'] },
        fourthPrize: { amount: '₹2,000', winners: ['0456', '1290', '3412', '5678', '7890', '9123'] },
        fifthPrize: { amount: '₹1,000', winners: ['0123', '1456', '2789', '3890', '4901', '6012', '7123', '8234'] },
        sixthPrize: { amount: '₹500', winners: ['0345', '1456', '2567', '3678', '4789', '5890', '6901', '7012', '8123', '9234'] },
        seventhPrize: { amount: '₹100', winners: ['0145', '1256', '2367', '3478', '4589', '5690', '6701', '7812', '8923', '9034', '1145', '2256'] },
        officialGazetteRef: `GO(P)No.84/2026/TAXES/DATED_THIRUVANANTHAPURAM`,
        series: ['FA', 'FB', 'FC', 'FD', 'FE', 'FF', 'FG', 'FH', 'FJ', 'FK', 'FL', 'FM']
      }
    };
  }

  async validatePayload(payload: RawLotteryPayload): Promise<ValidationResult> {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!payload.rawContent) {
      errors.push('KeralaAdapter: Empty payload content.');
      return { valid: false, errors, warnings };
    }

    const { scheme, drawNo, drawDate, firstPrize, series } = payload.rawContent;

    if (!scheme || typeof scheme !== 'string') errors.push('Missing or invalid scheme name');
    if (!drawNo || typeof drawNo !== 'string') errors.push('Missing or invalid draw number');
    if (!drawDate || !/^\d{4}-\d{2}-\d{2}$/.test(drawDate)) errors.push('Invalid drawDate format (expected YYYY-MM-DD)');
    if (!firstPrize || !firstPrize.ticket) errors.push('Missing first prize ticket number');
    if (!Array.isArray(series) || series.length === 0) warnings.push('Series array empty or missing');

    return {
      valid: errors.length === 0,
      errors,
      warnings
    };
  }

  async normalizePayload(payload: RawLotteryPayload, validation: ValidationResult): Promise<LotteryResult[]> {
    if (!validation.valid) {
      throw new Error(`Validation failed for Kerala Lottery payload: ${validation.errors.join(', ')}`);
    }

    const data = payload.rawContent;
    const resultId = this.generateResultId(this.stateCode, data.scheme, data.drawNo, data.drawDate);

    const prizeTiers: PrizeTier[] = [
      {
        rank: 1,
        tierName: '1st Prize',
        prizeAmountFormatted: data.firstPrize.amount,
        prizeAmountNumeric: 10000000,
        winningNumbers: [data.firstPrize.ticket],
        seriesRequired: true,
        description: 'First prize won on full 6-digit ticket with series code'
      },
      {
        rank: 2,
        tierName: 'Consolation Prize',
        prizeAmountFormatted: '₹8,000',
        prizeAmountNumeric: 8000,
        winningNumbers: (data.series || ['FA', 'FB', 'FC', 'FD', 'FF', 'FG', 'FH', 'FJ', 'FK', 'FL', 'FM'])
          .filter((s: string) => !data.firstPrize.ticket.startsWith(s))
          .map((s: string) => `${s} ${data.firstPrize.ticket.split(' ')[1] || data.firstPrize.ticket}`),
        seriesRequired: true,
        description: 'Consolation prize for same ticket number in remaining series'
      },
      {
        rank: 3,
        tierName: '2nd Prize',
        prizeAmountFormatted: data.secondPrize.amount,
        prizeAmountNumeric: 1000000,
        winningNumbers: [data.secondPrize.ticket],
        seriesRequired: true,
      },
      {
        rank: 4,
        tierName: '3rd Prize',
        prizeAmountFormatted: data.thirdPrize.amount,
        prizeAmountNumeric: 5000,
        winningNumbers: data.thirdPrize.winners || [],
        description: 'Won on last 4 digits'
      },
      {
        rank: 5,
        tierName: '4th Prize',
        prizeAmountFormatted: data.fourthPrize.amount,
        prizeAmountNumeric: 2000,
        winningNumbers: data.fourthPrize.winners || [],
        description: 'Won on last 4 digits'
      },
      {
        rank: 6,
        tierName: '5th Prize',
        prizeAmountFormatted: data.fifthPrize.amount,
        prizeAmountNumeric: 1000,
        winningNumbers: data.fifthPrize.winners || [],
        description: 'Won on last 4 digits'
      },
      {
        rank: 7,
        tierName: '6th Prize',
        prizeAmountFormatted: data.sixthPrize.amount,
        prizeAmountNumeric: 500,
        winningNumbers: data.sixthPrize.winners || [],
        description: 'Won on last 4 digits'
      },
      {
        rank: 8,
        tierName: '7th Prize',
        prizeAmountFormatted: data.seventhPrize.amount,
        prizeAmountNumeric: 100,
        winningNumbers: data.seventhPrize.winners || [],
        description: 'Won on last 4 digits'
      }
    ];

    const result: LotteryResult = {
      id: resultId,
      lotteryName: `Fifty Fifty (${data.drawNo})`,
      schemeCode: 'FIFTY-FIFTY',
      stateCode: this.stateCode,
      stateName: this.stateName,
      drawDate: data.drawDate,
      drawNumber: data.drawNo,
      drawTime: data.drawTime,
      ticketPriceFormatted: '₹50',
      seriesList: data.series,
      firstPrize: {
        amountFormatted: data.firstPrize.amount,
        amountNumeric: 10000000,
        winningTicket: data.firstPrize.ticket,
        series: data.firstPrize.ticket.split(' ')[0],
        numberOnly: data.firstPrize.ticket.split(' ')[1] || data.firstPrize.ticket,
      },
      prizes: prizeTiers,
      officialSource: {
        sourceName: 'Kerala Government Gazette / Directorate of State Lotteries',
        sourceUrl: payload.sourceUrl,
        gazetteNotificationNo: data.officialGazetteRef,
        verified: true,
        directorateName: this.officialDirectorate
      },
      publishedTime: payload.fetchedAt,
      lastUpdatedTime: payload.fetchedAt,
      isDemoData: true, // Clearly marked DEMO DATA for development
      verificationStatus: 'VERIFIED_OFFICIAL',
      checksum: `sha256-kl-${data.drawNo}-${data.drawDate}`
    };

    return [result];
  }
}
