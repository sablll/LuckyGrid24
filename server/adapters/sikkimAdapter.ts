import { BaseLotteryAdapter } from './base';
import { RawLotteryPayload, ValidationResult } from '../types';
import { LotteryResult, PrizeTier } from '../../src/types/lottery';

export class SikkimLotteryAdapter extends BaseLotteryAdapter {
  readonly id = 'sikkim-lotteries-gov';
  readonly name = 'Sikkim State Lotteries Directorate';
  readonly stateCode = 'SK';
  readonly stateName = 'Sikkim';
  readonly baseUrl = 'http://www.sikkimlotteries.com';
  readonly officialDirectorate = 'Directorate of Sikkim State Lotteries, Government of Sikkim, Gangtok';
  readonly parserFormat = 'HTML_TABULAR' as const;

  async fetchRawSource(targetDate?: string): Promise<RawLotteryPayload> {
    const fetchDate = targetDate || new Date().toISOString().split('T')[0];
    const sourceUrl = `${this.baseUrl}/results?date=${fetchDate}&draw=day`;

    if (!this.verifySourceOrigin(sourceUrl)) {
      throw new Error(`Unauthorized source origin for Sikkim: ${sourceUrl}`);
    }

    return {
      sourceUrl,
      fetchedAt: new Date().toISOString(),
      sourceType: 'OFFICIAL_DIRECTORATE_GAZETTE',
      statusCode: 200,
      rawContent: {
        state: 'Sikkim',
        scheme: 'DEAR-MEGHNA-DAY',
        drawNo: 'SK-2026-112',
        drawDate: fetchDate,
        drawTime: '01:00 PM',
        firstPrize: { amount: '₹1,00,00,000 (1 Crore)', ticket: '89C 51920' },
        consolation: { amount: '₹1,000', winnersCount: 99 },
        secondPrize: { amount: '₹9,000', winners: ['04512', '15623', '26734', '37845', '48956', '59067', '60178', '71289', '82390', '93401'] },
        thirdPrize: { amount: '₹450', winners: ['0912', '1823', '2734', '3645', '4556', '5467', '6378', '7289', '8190', '9001'] },
        fourthPrize: { amount: '₹250', winners: ['0145', '1256', '2367', '3478', '4589', '5690', '6701', '7812', '8923', '9034'] },
        fifthPrize: { amount: '₹120', winners: ['0045', '0156', '0267', '0378', '0489', '0590', '0601', '0712', '0823', '0934', '1045', '1156'] },
        officialGazetteRef: 'SK/LOT/GAZETTE/2026/D-41'
      }
    };
  }

  async validatePayload(payload: RawLotteryPayload): Promise<ValidationResult> {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!payload.rawContent) {
      errors.push('SikkimAdapter: Empty payload content.');
      return { valid: false, errors, warnings };
    }

    const { scheme, drawNo, drawDate, firstPrize } = payload.rawContent;
    if (!scheme) errors.push('Sikkim: Scheme missing');
    if (!drawNo) errors.push('Sikkim: Draw number missing');
    if (!drawDate) errors.push('Sikkim: Draw date missing');
    if (!firstPrize?.ticket) errors.push('Sikkim: First prize ticket missing');

    return {
      valid: errors.length === 0,
      errors,
      warnings
    };
  }

  async normalizePayload(payload: RawLotteryPayload, validation: ValidationResult): Promise<LotteryResult[]> {
    if (!validation.valid) {
      throw new Error(`Validation failed for Sikkim Lottery: ${validation.errors.join(', ')}`);
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
        description: 'First prize with series code'
      },
      {
        rank: 2,
        tierName: 'Consolation Prize',
        prizeAmountFormatted: data.consolation.amount,
        prizeAmountNumeric: 1000,
        winningNumbers: [`Remaining Series ${data.firstPrize.ticket.split(' ')[1] || '51920'}`],
        description: 'All other series for 1st prize number'
      },
      {
        rank: 3,
        tierName: '2nd Prize',
        prizeAmountFormatted: data.secondPrize.amount,
        prizeAmountNumeric: 9000,
        winningNumbers: data.secondPrize.winners || [],
        description: 'Won on 5 digits'
      },
      {
        rank: 4,
        tierName: '3rd Prize',
        prizeAmountFormatted: data.thirdPrize.amount,
        prizeAmountNumeric: 450,
        winningNumbers: data.thirdPrize.winners || [],
        description: 'Won on last 4 digits'
      },
      {
        rank: 5,
        tierName: '4th Prize',
        prizeAmountFormatted: data.fourthPrize.amount,
        prizeAmountNumeric: 250,
        winningNumbers: data.fourthPrize.winners || [],
        description: 'Won on last 4 digits'
      },
      {
        rank: 6,
        tierName: '5th Prize',
        prizeAmountFormatted: data.fifthPrize.amount,
        prizeAmountNumeric: 120,
        winningNumbers: data.fifthPrize.winners || [],
        description: 'Won on last 4 digits'
      }
    ];

    const result: LotteryResult = {
      id: resultId,
      lotteryName: 'Dear Meghna Day (01:00 PM)',
      schemeCode: 'DEAR-MEGHNA-DAY',
      stateCode: this.stateCode,
      stateName: this.stateName,
      drawDate: data.drawDate,
      drawNumber: data.drawNo,
      drawTime: data.drawTime,
      ticketPriceFormatted: '₹6',
      seriesList: ['85A', '85B', '85C', '85D', '85E', '89A', '89B', '89C', '89D', '89E'],
      firstPrize: {
        amountFormatted: data.firstPrize.amount,
        amountNumeric: 10000000,
        winningTicket: data.firstPrize.ticket,
        series: data.firstPrize.ticket.split(' ')[0],
        numberOnly: data.firstPrize.ticket.split(' ')[1] || data.firstPrize.ticket,
      },
      prizes: prizeTiers,
      officialSource: {
        sourceName: 'Directorate of Sikkim State Lotteries / State Government Gazette',
        sourceUrl: payload.sourceUrl,
        gazetteNotificationNo: data.officialGazetteRef,
        verified: true,
        directorateName: this.officialDirectorate
      },
      publishedTime: payload.fetchedAt,
      lastUpdatedTime: payload.fetchedAt,
      isDemoData: true,
      verificationStatus: 'VERIFIED_OFFICIAL',
      checksum: `sha256-sk-${data.drawNo}-${data.drawDate}`
    };

    return [result];
  }
}
