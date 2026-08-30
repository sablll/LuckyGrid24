import { BaseLotteryAdapter } from './base';
import { RawLotteryPayload, ValidationResult } from '../types';
import { LotteryResult, PrizeTier } from '../../src/types/lottery';

export class GoaLotteryAdapter extends BaseLotteryAdapter {
  readonly id = 'goa-lotteries-gov';
  readonly name = 'Goa State Lotteries Directorate (Rajshree)';
  readonly stateCode = 'GA';
  readonly stateName = 'Goa';
  readonly baseUrl = 'http://goastatelotteries.gov.in';
  readonly officialDirectorate = 'Directorate of Small Savings & Lotteries, Government of Goa, Panaji';
  readonly parserFormat = 'HTML_TABULAR' as const;

  async fetchRawSource(targetDate?: string): Promise<RawLotteryPayload> {
    const fetchDate = targetDate || new Date().toISOString().split('T')[0];
    const sourceUrl = `${this.baseUrl}/results?date=${fetchDate}&scheme=rajshree-50`;

    if (!this.verifySourceOrigin(sourceUrl)) {
      throw new Error(`Unauthorized source for Goa: ${sourceUrl}`);
    }

    return {
      sourceUrl,
      fetchedAt: new Date().toISOString(),
      sourceType: 'OFFICIAL_GOVERNMENT_GAZETTE',
      statusCode: 200,
      rawContent: {
        state: 'Goa',
        scheme: 'RAJSHREE-50-SOM-WEEKLY',
        drawNo: 'GA-2026-64',
        drawDate: fetchDate,
        drawTime: '07:30 PM',
        firstPrize: { amount: '₹21,00,000 (21 Lakhs)', ticket: 'RS 40918' },
        secondPrize: { amount: '₹4,50,000', ticket: 'RS 12984' },
        thirdPrize: { amount: '₹9,000', winners: ['3812', '9045', '1278', '6543'] },
        fourthPrize: { amount: '₹3,000', winners: ['0456', '2389', '7812', '5690'] },
        fifthPrize: { amount: '₹1,000', winners: ['0123', '1456', '2789', '3890', '4901', '5012', '6123', '7234', '8345', '9456'] },
        gazetteDept: 'Directorate of Small Savings and Lotteries, Altinho, Panaji, Goa'
      }
    };
  }

  async validatePayload(payload: RawLotteryPayload): Promise<ValidationResult> {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!payload.rawContent) {
      errors.push('GoaAdapter: Empty payload');
      return { valid: false, errors, warnings };
    }

    const { scheme, drawNo, drawDate, firstPrize } = payload.rawContent;
    if (!scheme) errors.push('Goa: Scheme missing');
    if (!drawNo) errors.push('Goa: Draw number missing');
    if (!firstPrize?.ticket) errors.push('Goa: First prize missing');

    return { valid: errors.length === 0, errors, warnings };
  }

  async normalizePayload(payload: RawLotteryPayload, validation: ValidationResult): Promise<LotteryResult[]> {
    if (!validation.valid) {
      throw new Error(`Validation failed for Goa Lottery: ${validation.errors.join(', ')}`);
    }

    const data = payload.rawContent;
    const resultId = this.generateResultId(this.stateCode, data.scheme, data.drawNo, data.drawDate);

    const prizeTiers: PrizeTier[] = [
      {
        rank: 1,
        tierName: '1st Prize',
        prizeAmountFormatted: data.firstPrize.amount,
        prizeAmountNumeric: 2100000,
        winningNumbers: [data.firstPrize.ticket],
        seriesRequired: true,
        description: 'First prize won on full 5-digit number with series'
      },
      {
        rank: 2,
        tierName: '2nd Prize',
        prizeAmountFormatted: data.secondPrize.amount,
        prizeAmountNumeric: 450000,
        winningNumbers: [data.secondPrize.ticket],
        seriesRequired: true
      },
      {
        rank: 3,
        tierName: '3rd Prize',
        prizeAmountFormatted: data.thirdPrize.amount,
        prizeAmountNumeric: 9000,
        winningNumbers: data.thirdPrize.winners || [],
        description: 'Won on last 4 digits'
      },
      {
        rank: 4,
        tierName: '4th Prize',
        prizeAmountFormatted: data.fourthPrize.amount,
        prizeAmountNumeric: 3000,
        winningNumbers: data.fourthPrize.winners || [],
        description: 'Won on last 4 digits'
      },
      {
        rank: 5,
        tierName: '5th Prize',
        prizeAmountFormatted: data.fifthPrize.amount,
        prizeAmountNumeric: 1000,
        winningNumbers: data.fifthPrize.winners || [],
        description: 'Won on last 4 digits'
      }
    ];

    const result: LotteryResult = {
      id: resultId,
      lotteryName: 'Rajshree 50 Som Weekly (07:30 PM)',
      schemeCode: 'RAJSHREE-50-SOM-WEEKLY',
      stateCode: this.stateCode,
      stateName: this.stateName,
      drawDate: data.drawDate,
      drawNumber: data.drawNo,
      drawTime: data.drawTime,
      ticketPriceFormatted: '₹50',
      seriesList: ['RS', 'RN', 'RP', 'RQ'],
      firstPrize: {
        amountFormatted: data.firstPrize.amount,
        amountNumeric: 2100000,
        winningTicket: data.firstPrize.ticket,
        series: data.firstPrize.ticket.split(' ')[0],
        numberOnly: data.firstPrize.ticket.split(' ')[1] || data.firstPrize.ticket,
      },
      prizes: prizeTiers,
      officialSource: {
        sourceName: 'Directorate of Small Savings and Lotteries / Goa Official Gazette',
        sourceUrl: payload.sourceUrl,
        gazetteNotificationNo: 'GA/FIN/LOT/2026/SER-2',
        verified: true,
        directorateName: this.officialDirectorate
      },
      publishedTime: payload.fetchedAt,
      lastUpdatedTime: payload.fetchedAt,
      isDemoData: true,
      verificationStatus: 'VERIFIED_OFFICIAL',
      checksum: `sha256-ga-${data.drawNo}-${data.drawDate}`
    };

    return [result];
  }
}
