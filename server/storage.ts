import { LotteryResult, LotteryState, LotteryScheme, UpcomingDraw, StatisticsOverview, TicketCheckResult } from '../src/types/lottery';

export class LotteryStore {
  private results: Map<string, LotteryResult> = new Map();
  private states: Map<string, LotteryState> = new Map();
  private schemes: Map<string, LotteryScheme> = new Map();

  constructor() {
    this.seedStates();
    this.seedSchemes();
  }

  public hasResult(id: string): boolean {
    return this.results.has(id);
  }

  public saveResult(result: LotteryResult): void {
    this.results.set(result.id, result);
  }

  public saveResults(resultsList: LotteryResult[]): void {
    for (const res of resultsList) {
      this.results.set(res.id, res);
    }
  }

  public getResultById(id: string): LotteryResult | undefined {
    return this.results.get(id);
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
      list = list.filter(r => r.stateCode.toLowerCase() === options.stateCode?.toLowerCase());
    }

    if (options?.schemeCode) {
      list = list.filter(r => r.schemeCode.toLowerCase() === options.schemeCode?.toLowerCase());
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

    // Sort by draw date descending, then draw time
    list.sort((a, b) => b.drawDate.localeCompare(a.drawDate) || b.publishedTime.localeCompare(a.publishedTime));

    const total = list.length;
    const offset = options?.offset || 0;
    const limit = options?.limit || 50;
    const paginated = list.slice(offset, offset + limit);

    return { results: paginated, total };
  }

  public getTodayResults(todayDateStr: string): LotteryResult[] {
    const all = Array.from(this.results.values());
    const todayMatches = all.filter(r => r.drawDate === todayDateStr);
    if (todayMatches.length > 0) return todayMatches;
    // If no exact match for today's simulated date, return the most recent date draws
    const latestDate = all.map(r => r.drawDate).sort().reverse()[0];
    return all.filter(r => r.drawDate === latestDate);
  }

  public getLatestResults(limit = 10): LotteryResult[] {
    return Array.from(this.results.values())
      .sort((a, b) => b.drawDate.localeCompare(a.drawDate) || b.publishedTime.localeCompare(a.publishedTime))
      .slice(0, limit);
  }

  public getAllStates(): LotteryState[] {
    return Array.from(this.states.values());
  }

  public getStateByCode(code: string): LotteryState | undefined {
    return this.states.get(code.toUpperCase());
  }

  public getSchemesByState(stateCode: string): LotteryScheme[] {
    return Array.from(this.schemes.values()).filter(s => s.stateCode.toUpperCase() === stateCode.toUpperCase());
  }

  public getUpcomingDraws(): UpcomingDraw[] {
    const today = new Date().toISOString().split('T')[0];
    return [
      {
        id: 'upcoming-nl-morning',
        lotteryName: 'Dear Narmada Morning (1:00 PM)',
        stateCode: 'NL',
        stateName: 'Nagaland',
        drawDate: today,
        drawTime: '01:00 PM',
        firstPrize: '₹1 Crore',
        ticketPrice: '₹6',
        countdownTarget: `${today}T13:00:00+05:30`,
        schemeCode: 'DEAR-MORNING-NARMADA'
      },
      {
        id: 'upcoming-kl-fifty',
        lotteryName: 'Fifty Fifty (FF-128) Kerala',
        stateCode: 'KL',
        stateName: 'Kerala',
        drawDate: today,
        drawTime: '03:00 PM',
        firstPrize: '₹1 Crore',
        ticketPrice: '₹50',
        countdownTarget: `${today}T15:00:00+05:30`,
        schemeCode: 'FIFTY-FIFTY'
      },
      {
        id: 'upcoming-sk-day',
        lotteryName: 'Dear Meghna Day (6:00 PM)',
        stateCode: 'SK',
        stateName: 'Sikkim',
        drawDate: today,
        drawTime: '06:00 PM',
        firstPrize: '₹1 Crore',
        ticketPrice: '₹6',
        countdownTarget: `${today}T18:00:00+05:30`,
        schemeCode: 'DEAR-MEGHNA-DAY'
      },
      {
        id: 'upcoming-ga-rajshree',
        lotteryName: 'Rajshree Som Weekly Goa (7:30 PM)',
        stateCode: 'GA',
        stateName: 'Goa',
        drawDate: today,
        drawTime: '07:30 PM',
        firstPrize: '₹21 Lakhs',
        ticketPrice: '₹50',
        countdownTarget: `${today}T19:30:00+05:30`,
        schemeCode: 'RAJSHREE-50-SOM-WEEKLY'
      },
      {
        id: 'upcoming-nl-evening',
        lotteryName: 'Dear Sandpiper Evening (8:00 PM)',
        stateCode: 'NL',
        stateName: 'Nagaland',
        drawDate: today,
        drawTime: '08:00 PM',
        firstPrize: '₹1 Crore',
        ticketPrice: '₹6',
        countdownTarget: `${today}T20:00:00+05:30`,
        schemeCode: 'DEAR-EVENING-SANDPIPER'
      },
      {
        id: 'upcoming-pb-bumper',
        lotteryName: 'Punjab Dear Bumper Monthly',
        stateCode: 'PB',
        stateName: 'Punjab',
        drawDate: today,
        drawTime: '06:00 PM',
        firstPrize: '₹1.5 Crore',
        ticketPrice: '₹100',
        countdownTarget: `${today}T18:00:00+05:30`,
        schemeCode: 'PUNJAB-STATE-DEAR-100-MONTHLY'
      }
    ];
  }

  public checkTicket(ticketNumber: string, stateCode?: string, targetDrawId?: string): TicketCheckResult {
    const cleanNum = ticketNumber.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
    const checkedAt = new Date().toISOString();
    const matchedDraws: TicketCheckResult['matchedDraws'] = [];

    // Extract digits only and possible series prefix
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

      // Check 1st prize
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
        // Consolation match
        matchedPrizes.push({
          tierName: 'Consolation Prize',
          prizeAmountFormatted: draw.consolationPrizes.amountFormatted,
          matchingRule: 'CONSOLATION',
          winningNumberMatched: `Series Consolation (${numberDigits})`
        });
      }

      // Check remaining prize tiers (last 4 digits, last 5 digits, exact ticket)
      for (const tier of draw.prizes) {
        if (tier.rank === 1) continue; // already checked

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
    
    // Count draws per state
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

    // Last digit frequency analysis across all winning numbers
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

  // --- SEEDING METHODOLOGIES ---
  private seedStates() {
    const statesData: LotteryState[] = [
      {
        code: 'KL',
        name: 'Kerala',
        shortName: 'Kerala',
        capital: 'Thiruvananthapuram',
        legalStatus: 'LEGAL_GOVERNMENT_RUN',
        directorateName: 'Directorate of Kerala State Lotteries',
        officialPortalUrl: 'http://www.keralalotteries.com',
        gazetteDept: 'Taxes Department, Government of Kerala',
        drawTimings: ['03:00 PM'],
        description: 'First Indian state to operate a state lottery (est. 1967) under Finance Minister P. K. Kunju. Operates 7 weekly draws & 6 mega seasonal bumpers.',
        establishedYear: 1967,
        activeSchemesCount: 7,
        popularSchemes: ['Win-Win', 'Sthree Sakthi', 'Fifty-Fifty', 'Karunya Plus', 'Nirmal', 'Karunya', 'Akshaya', 'Onam Bumper (₹25 Cr)'],
        bannerGradient: 'from-emerald-800 to-teal-950'
      },
      {
        code: 'NL',
        name: 'Nagaland',
        shortName: 'Nagaland',
        capital: 'Kohima',
        legalStatus: 'LEGAL_GOVERNMENT_RUN',
        directorateName: 'Directorate of Nagaland State Lotteries',
        officialPortalUrl: 'http://www.nagalandlotteries.com',
        gazetteDept: 'Finance Department, Government of Nagaland',
        drawTimings: ['01:00 PM', '06:00 PM', '08:00 PM'],
        description: 'Popularly known as "Dear Lotteries", conducting 3 daily draws with a top prize of ₹1 Crore per draw with massive multi-state distribution.',
        establishedYear: 1972,
        activeSchemesCount: 21,
        popularSchemes: ['Dear Morning', 'Dear Day', 'Dear Evening', 'Dear Bumper Series'],
        bannerGradient: 'from-blue-900 to-indigo-950'
      },
      {
        code: 'SK',
        name: 'Sikkim',
        shortName: 'Sikkim',
        capital: 'Gangtok',
        legalStatus: 'LEGAL_GOVERNMENT_RUN',
        directorateName: 'Directorate of Sikkim State Lotteries',
        officialPortalUrl: 'http://www.sikkimlotteries.com',
        gazetteDept: 'Finance, Revenue and Expenditure Department, Gangtok',
        drawTimings: ['11:55 AM', '04:00 PM', '07:00 PM'],
        description: 'Pioneer of authorized paper & online lottery systems, conducting prestigious schemes like Dear Sikkim, Singam, and Derby.',
        establishedYear: 1976,
        activeSchemesCount: 14,
        popularSchemes: ['Dear Meghna Day', 'Dear Respect Morning', 'Singam Weekly', 'Sikkim Bumper'],
        bannerGradient: 'from-cyan-900 to-slate-950'
      },
      {
        code: 'PB',
        name: 'Punjab',
        shortName: 'Punjab',
        capital: 'Chandigarh',
        legalStatus: 'LEGAL_GOVERNMENT_RUN',
        directorateName: 'Directorate of Punjab State Lotteries',
        officialPortalUrl: 'http://punjabstatelotteries.gov.in',
        gazetteDept: 'Department of Finance, Punjab',
        drawTimings: ['06:00 PM'],
        description: 'Renowned for guaranteed bumper lotteries (Lohri, Baisakhi, Rakhi, Diwali, New Year) where the 1st prize is drawn exclusively from sold tickets.',
        establishedYear: 1968,
        activeSchemesCount: 6,
        popularSchemes: ['Dear 100 Monthly', 'Diwali Bumper (₹5 Cr)', 'Lohri Bumper', 'Rakhi Bumper'],
        bannerGradient: 'from-amber-900 to-stone-950'
      },
      {
        code: 'GA',
        name: 'Goa',
        shortName: 'Goa',
        capital: 'Panaji',
        legalStatus: 'LEGAL_GOVERNMENT_RUN',
        directorateName: 'Directorate of Small Savings and Lotteries',
        officialPortalUrl: 'http://goastatelotteries.gov.in',
        gazetteDept: 'Finance Department, Secretariat, Porvorim',
        drawTimings: ['11:55 AM', '04:00 PM', '07:30 PM'],
        description: 'Operates Rajshree brand paper lotteries and regulated casino and gaming draws under state statutory oversight.',
        establishedYear: 1995,
        activeSchemesCount: 12,
        popularSchemes: ['Rajshree 50 Som', 'Rajshree 200 Monthly', 'Rajshree Everest'],
        bannerGradient: 'from-purple-900 to-slate-950'
      },
      {
        code: 'MZ',
        name: 'Mizoram',
        shortName: 'Mizoram',
        capital: 'Aizawl',
        legalStatus: 'LEGAL_GOVERNMENT_RUN',
        directorateName: 'Directorate of IF&SL, Government of Mizoram',
        officialPortalUrl: 'http://mizoramlottery.in',
        gazetteDept: 'Institutional Finance & State Lottery, Aizawl',
        drawTimings: ['04:00 PM', '07:00 PM'],
        description: 'Regulated paper draws featuring Golden, Silver, and Diamond weekly draws under strict Directorate governance.',
        establishedYear: 1986,
        activeSchemesCount: 8,
        popularSchemes: ['Golden King', 'Silver Weekly', 'Diamond Bumper'],
        bannerGradient: 'from-violet-950 to-slate-950'
      },
      {
        code: 'MH',
        name: 'Maharashtra',
        shortName: 'Maharashtra',
        capital: 'Mumbai',
        legalStatus: 'LEGAL_GOVERNMENT_RUN',
        directorateName: 'Directorate of Maharashtra State Lotteries',
        officialPortalUrl: 'https://finance.maharashtra.gov.in',
        gazetteDept: 'Finance Department, Mantralaya, Mumbai',
        drawTimings: ['04:15 PM', '04:45 PM'],
        description: 'Operates Maharashtra Gajlaxmi, Surabhi, and Vaibhav weekly draws with revenue channeled towards rural infrastructure.',
        establishedYear: 1969,
        activeSchemesCount: 9,
        popularSchemes: ['Gajlaxmi Som', 'Mahalaxmi Weekly', 'Maharashtra Bumper'],
        bannerGradient: 'from-orange-950 to-neutral-950'
      },
      {
        code: 'WB',
        name: 'West Bengal',
        shortName: 'West Bengal',
        capital: 'Kolkata',
        legalStatus: 'LEGAL_AUTHORIZED',
        directorateName: 'West Bengal Directorate of Lotteries',
        officialPortalUrl: 'https://wb.gov.in',
        gazetteDept: 'Finance Department, Nabanna, Howrah',
        drawTimings: ['04:00 PM'],
        description: 'Authorized sale and distribution of approved paper lottery schemes across West Bengal under state gazette rules.',
        establishedYear: 1970,
        activeSchemesCount: 6,
        popularSchemes: ['Bangalakshmi Weekly', 'Dear Bengal Bumper'],
        bannerGradient: 'from-emerald-950 to-slate-950'
      },
      {
        code: 'AR',
        name: 'Arunachal Pradesh',
        shortName: 'Arunachal',
        capital: 'Itanagar',
        legalStatus: 'LEGAL_GOVERNMENT_RUN',
        directorateName: 'Directorate of Arunachal Pradesh State Lotteries',
        officialPortalUrl: 'http://lotteryindia.gov.in',
        gazetteDept: 'Department of Finance, Itanagar',
        drawTimings: ['11:55 AM', '05:00 PM'],
        description: 'Operates Singam and Labh-Laxmi schemes with regular daily & weekly draws.',
        establishedYear: 1988,
        activeSchemesCount: 7,
        popularSchemes: ['Singam Peak', 'LabhLaxmi Som', 'Arunachal Super'],
        bannerGradient: 'from-rose-950 to-slate-950'
      },
      {
        code: 'ML',
        name: 'Meghalaya',
        shortName: 'Meghalaya',
        capital: 'Shillong',
        legalStatus: 'LEGAL_GOVERNMENT_RUN',
        directorateName: 'Directorate of Meghalaya State Lotteries',
        officialPortalUrl: 'https://meghalaya.gov.in',
        gazetteDept: 'Excise, Registration, Taxation & Stamps Department',
        drawTimings: ['12:30 PM', '03:30 PM'],
        description: 'Conducts state-authorized paper draws and Khanapara Teer traditional archers arrow result licensing.',
        establishedYear: 1982,
        activeSchemesCount: 5,
        popularSchemes: ['Kuwait Weekly', 'Singam Meghalaya', 'Traditional Teer Results'],
        bannerGradient: 'from-teal-950 to-slate-950'
      }
    ];

    for (const st of statesData) {
      this.states.set(st.code, st);
    }
  }

  private seedSchemes() {
    const schemesData: LotteryScheme[] = [
      {
        id: 'KL-FIFTY-FIFTY',
        stateCode: 'KL',
        name: 'Fifty Fifty (FF)',
        code: 'FIFTY-FIFTY',
        drawFrequency: 'WEEKLY',
        drawDays: ['Sunday'],
        drawTime: '03:00 PM',
        ticketPrice: '₹50',
        firstPrize: '₹1,00,00,000 (1 Crore)',
        description: 'Every Sunday draw with ₹1 Crore first prize and ₹10 Lakhs second prize.',
        officialGazetteRef: 'GO(P)No.84/2026/TAXES',
        active: true
      },
      {
        id: 'KL-WIN-WIN',
        stateCode: 'KL',
        name: 'Win-Win (W)',
        code: 'WIN-WIN',
        drawFrequency: 'WEEKLY',
        drawDays: ['Monday'],
        drawTime: '03:00 PM',
        ticketPrice: '₹40',
        firstPrize: '₹75,00,000 (75 Lakhs)',
        description: 'Every Monday draw with ₹75 Lakhs first prize and ₹5 Lakhs second prize.',
        officialGazetteRef: 'GO(P)No.85/2026/TAXES',
        active: true
      },
      {
        id: 'KL-STHREE-SAKTHI',
        stateCode: 'KL',
        name: 'Sthree Sakthi (SS)',
        code: 'STHREE-SAKTHI',
        drawFrequency: 'WEEKLY',
        drawDays: ['Tuesday'],
        drawTime: '03:00 PM',
        ticketPrice: '₹40',
        firstPrize: '₹75,00,000 (75 Lakhs)',
        description: 'Every Tuesday draw dedicated to women empowerment funding.',
        officialGazetteRef: 'GO(P)No.86/2026/TAXES',
        active: true
      },
      {
        id: 'NL-DEAR-EVENING',
        stateCode: 'NL',
        name: 'Dear Sandpiper Evening',
        code: 'DEAR-EVENING-SANDPIPER',
        drawFrequency: 'DAILY',
        drawTime: '08:00 PM',
        ticketPrice: '₹6',
        firstPrize: '₹1,00,00,000 (1 Crore)',
        description: 'Daily evening 8 PM draw with ₹1 Crore top prize.',
        officialGazetteRef: 'NL/LOT/2026/SEC-4',
        active: true
      },
      {
        id: 'NL-DEAR-MORNING',
        stateCode: 'NL',
        name: 'Dear Narmada Morning',
        code: 'DEAR-MORNING-NARMADA',
        drawFrequency: 'DAILY',
        drawTime: '01:00 PM',
        ticketPrice: '₹6',
        firstPrize: '₹1,00,00,000 (1 Crore)',
        description: 'Daily 1:00 PM draw with ₹1 Crore top prize.',
        officialGazetteRef: 'NL/LOT/2026/SEC-4',
        active: true
      },
      {
        id: 'SK-DEAR-DAY',
        stateCode: 'SK',
        name: 'Dear Meghna Day',
        code: 'DEAR-MEGHNA-DAY',
        drawFrequency: 'DAILY',
        drawTime: '06:00 PM',
        ticketPrice: '₹6',
        firstPrize: '₹1,00,00,000 (1 Crore)',
        description: 'Daily Sikkim afternoon draw with ₹1 Crore top prize.',
        officialGazetteRef: 'SK/LOT/GAZETTE/2026/D-41',
        active: true
      },
      {
        id: 'PB-DEAR-100',
        stateCode: 'PB',
        name: 'Punjab State Dear 100 Monthly',
        code: 'PUNJAB-STATE-DEAR-100-MONTHLY',
        drawFrequency: 'MONTHLY',
        drawTime: '06:00 PM',
        ticketPrice: '₹100',
        firstPrize: '₹1,50,00,000 (1.5 Crore)',
        description: 'Monthly bumper with guaranteed 1st prize drawn from sold tickets.',
        officialGazetteRef: 'PB/FIN/LOT/2026/09',
        active: true
      },
      {
        id: 'GA-RAJSHREE-50',
        stateCode: 'GA',
        name: 'Rajshree 50 Som Weekly',
        code: 'RAJSHREE-50-SOM-WEEKLY',
        drawFrequency: 'WEEKLY',
        drawDays: ['Monday'],
        drawTime: '07:30 PM',
        ticketPrice: '₹50',
        firstPrize: '₹21,00,000 (21 Lakhs)',
        description: 'Weekly Monday draw with ₹21 Lakhs top prize.',
        officialGazetteRef: 'GA/FIN/LOT/2026/SER-2',
        active: true
      }
    ];

    for (const sc of schemesData) {
      this.schemes.set(sc.id, sc);
    }
  }

}
