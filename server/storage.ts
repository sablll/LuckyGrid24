import { LotteryResult, LotteryState, LotteryScheme, UpcomingDraw, StatisticsOverview, TicketCheckResult } from '../src/types/lottery';

export class LotteryStore {
  private results: Map<string, LotteryResult> = new Map();
  private states: Map<string, LotteryState> = new Map();
  private schemes: Map<string, LotteryScheme> = new Map();

  constructor() {
    this.seedStates();
    this.seedSchemes();
    this.seedDemoResults();
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

  private seedDemoResults() {
    const today = '2026-08-30';
    const yesterday = '2026-08-29';
    const dayBefore = '2026-08-28';

    const sampleResults: LotteryResult[] = [
      // 1. Kerala Fifty Fifty Today
      {
        id: `kl-fifty-fifty-ff-128-${today}`,
        lotteryName: 'Fifty Fifty (FF-128)',
        schemeCode: 'FIFTY-FIFTY',
        stateCode: 'KL',
        stateName: 'Kerala',
        drawDate: today,
        drawNumber: 'FF-128',
        drawTime: '03:00 PM',
        ticketPriceFormatted: '₹50',
        seriesList: ['FA', 'FB', 'FC', 'FD', 'FE', 'FF', 'FG', 'FH', 'FJ', 'FK', 'FL', 'FM'],
        firstPrize: {
          amountFormatted: '₹1,00,00,000 (1 Crore)',
          amountNumeric: 10000000,
          winningTicket: 'FE 892341',
          series: 'FE',
          numberOnly: '892341'
        },
        consolationPrizes: {
          amountFormatted: '₹8,000',
          winningNumbers: ['FA 892341', 'FB 892341', 'FC 892341', 'FD 892341', 'FF 892341', 'FG 892341', 'FH 892341', 'FJ 892341', 'FK 892341', 'FL 892341', 'FM 892341']
        },
        prizes: [
          {
            rank: 1,
            tierName: '1st Prize',
            prizeAmountFormatted: '₹1,00,00,000 (1 Crore)',
            prizeAmountNumeric: 10000000,
            winningNumbers: ['FE 892341'],
            seriesRequired: true,
            description: '1st Prize won on full ticket number and series'
          },
          {
            rank: 2,
            tierName: 'Consolation Prize',
            prizeAmountFormatted: '₹8,000',
            prizeAmountNumeric: 8000,
            winningNumbers: ['FA 892341', 'FB 892341', 'FC 892341', 'FD 892341', 'FF 892341', 'FG 892341', 'FH 892341', 'FJ 892341', 'FK 892341', 'FL 892341', 'FM 892341'],
            description: 'For all other series of same ticket number'
          },
          {
            rank: 3,
            tierName: '2nd Prize',
            prizeAmountFormatted: '₹10,00,000 (10 Lakhs)',
            prizeAmountNumeric: 1000000,
            winningNumbers: ['FD 349120'],
            seriesRequired: true
          },
          {
            rank: 4,
            tierName: '3rd Prize',
            prizeAmountFormatted: '₹5,000',
            prizeAmountNumeric: 5000,
            winningNumbers: ['1045', '2389', '4512', '6790', '8912', '9034'],
            description: 'Won on last 4 digits'
          },
          {
            rank: 5,
            tierName: '4th Prize',
            prizeAmountFormatted: '₹2,000',
            prizeAmountNumeric: 2000,
            winningNumbers: ['0456', '1290', '3412', '5678', '7890', '9123'],
            description: 'Won on last 4 digits'
          },
          {
            rank: 6,
            tierName: '5th Prize',
            prizeAmountFormatted: '₹1,000',
            prizeAmountNumeric: 1000,
            winningNumbers: ['0123', '1456', '2789', '3890', '4901', '6012', '7123', '8234'],
            description: 'Won on last 4 digits'
          },
          {
            rank: 7,
            tierName: '6th Prize',
            prizeAmountFormatted: '₹500',
            prizeAmountNumeric: 500,
            winningNumbers: ['0345', '1456', '2567', '3678', '4789', '5890', '6901', '7012', '8123', '9234'],
            description: 'Won on last 4 digits'
          },
          {
            rank: 8,
            tierName: '7th Prize',
            prizeAmountFormatted: '₹100',
            prizeAmountNumeric: 100,
            winningNumbers: ['0145', '1256', '2367', '3478', '4589', '5690', '6701', '7812', '8923', '9034'],
            description: 'Won on last 4 digits'
          }
        ],
        officialSource: {
          sourceName: 'Directorate of Kerala State Lotteries / State Government Gazette',
          sourceUrl: 'http://www.keralalotteries.com/results/view-results.php?date=2026-08-30',
          gazetteNotificationNo: 'GO(P)No.84/2026/TAXES/DATED_THIRUVANANTHAPURAM',
          verified: true,
          directorateName: 'Directorate of Kerala State Lotteries, Government of Kerala'
        },
        publishedTime: `${today}T15:30:00.000Z`,
        lastUpdatedTime: `${today}T15:35:00.000Z`,
        isDemoData: true,
        verificationStatus: 'VERIFIED_OFFICIAL',
        checksum: 'sha256-kl-ff-128-2026-08-30'
      },

      // 2. Nagaland Dear Sandpiper Evening Today
      {
        id: `nl-dear-evening-sandpiper-nl-94-${today}`,
        lotteryName: 'Dear Sandpiper Evening (8:00 PM)',
        schemeCode: 'DEAR-EVENING-SANDPIPER',
        stateCode: 'NL',
        stateName: 'Nagaland',
        drawDate: today,
        drawNumber: 'NL-2026-94',
        drawTime: '08:00 PM',
        ticketPriceFormatted: '₹6',
        seriesList: ['40A', '40B', '40C', '40D', '40E', '76A', '76B', '76C', '76D', '76E'],
        firstPrize: {
          amountFormatted: '₹1,00,00,000 (1 Crore)',
          amountNumeric: 10000000,
          winningTicket: '76D 48912',
          series: '76D',
          numberOnly: '48912'
        },
        consolationPrizes: {
          amountFormatted: '₹1,000',
          winningNumbers: ['All other series with 48912']
        },
        prizes: [
          {
            rank: 1,
            tierName: '1st Prize',
            prizeAmountFormatted: '₹1,00,00,000 (1 Crore)',
            prizeAmountNumeric: 10000000,
            winningNumbers: ['76D 48912'],
            seriesRequired: true,
            description: '1st Prize won on full 5-digit number + 2-digit series code'
          },
          {
            rank: 2,
            tierName: 'Consolation Prize',
            prizeAmountFormatted: '₹1,000',
            prizeAmountNumeric: 1000,
            winningNumbers: ['Remaining series 48912 (99 Winners)'],
            description: 'Won by all other series with same 5-digit number'
          },
          {
            rank: 3,
            tierName: '2nd Prize',
            prizeAmountFormatted: '₹9,000',
            prizeAmountNumeric: 9000,
            winningNumbers: ['12890', '23451', '34567', '45678', '56789', '67890', '78901', '89012', '90123', '01234'],
            description: 'Won on 5 digits across all series'
          },
          {
            rank: 4,
            tierName: '3rd Prize',
            prizeAmountFormatted: '₹450',
            prizeAmountNumeric: 450,
            winningNumbers: ['0234', '1345', '2456', '3567', '4678', '5789', '6890', '7901', '8012', '9123'],
            description: 'Won on last 4 digits'
          },
          {
            rank: 5,
            tierName: '4th Prize',
            prizeAmountFormatted: '₹250',
            prizeAmountNumeric: 250,
            winningNumbers: ['0456', '1567', '2678', '3789', '4890', '5901', '6012', '7123', '8234', '9345'],
            description: 'Won on last 4 digits'
          },
          {
            rank: 6,
            tierName: '5th Prize',
            prizeAmountFormatted: '₹120',
            prizeAmountNumeric: 120,
            winningNumbers: ['0012', '0124', '0235', '0346', '0457', '0568', '0679', '0780', '0891', '0902', '1013', '1124', '1235'],
            description: 'Won on last 4 digits'
          }
        ],
        officialSource: {
          sourceName: 'Directorate of Nagaland State Lotteries / Official Government Notification',
          sourceUrl: 'http://www.nagalandlotteries.com/draw-results.html?date=2026-08-30&draw=evening',
          gazetteNotificationNo: 'NL/LOT/2026/SEC-4/EVENING',
          verified: true,
          directorateName: 'Directorate of Nagaland State Lotteries, Government of Nagaland, Kohima'
        },
        publishedTime: `${today}T20:15:00.000Z`,
        lastUpdatedTime: `${today}T20:20:00.000Z`,
        isDemoData: true,
        verificationStatus: 'VERIFIED_OFFICIAL',
        checksum: 'sha256-nl-sandpiper-2026-08-30'
      },

      // 3. Sikkim Dear Meghna Day Today
      {
        id: `sk-dear-meghna-day-sk-112-${today}`,
        lotteryName: 'Dear Meghna Day (01:00 PM)',
        schemeCode: 'DEAR-MEGHNA-DAY',
        stateCode: 'SK',
        stateName: 'Sikkim',
        drawDate: today,
        drawNumber: 'SK-2026-112',
        drawTime: '01:00 PM',
        ticketPriceFormatted: '₹6',
        seriesList: ['85A', '85B', '85C', '85D', '85E', '89A', '89B', '89C', '89D', '89E'],
        firstPrize: {
          amountFormatted: '₹1,00,00,000 (1 Crore)',
          amountNumeric: 10000000,
          winningTicket: '89C 51920',
          series: '89C',
          numberOnly: '51920'
        },
        prizes: [
          {
            rank: 1,
            tierName: '1st Prize',
            prizeAmountFormatted: '₹1,00,00,000 (1 Crore)',
            prizeAmountNumeric: 10000000,
            winningNumbers: ['89C 51920'],
            seriesRequired: true,
            description: '1st Prize won on full 5-digit number with series code'
          },
          {
            rank: 2,
            tierName: 'Consolation Prize',
            prizeAmountFormatted: '₹1,000',
            prizeAmountNumeric: 1000,
            winningNumbers: ['All remaining series with 51920'],
            description: 'For same ticket number in remaining 99 series'
          },
          {
            rank: 3,
            tierName: '2nd Prize',
            prizeAmountFormatted: '₹9,000',
            prizeAmountNumeric: 9000,
            winningNumbers: ['04512', '15623', '26734', '37845', '48956', '59067', '60178', '71289', '82390', '93401'],
            description: 'Won on 5 digits'
          },
          {
            rank: 4,
            tierName: '3rd Prize',
            prizeAmountFormatted: '₹450',
            prizeAmountNumeric: 450,
            winningNumbers: ['0912', '1823', '2734', '3645', '4556', '5467', '6378', '7289', '8190', '9001'],
            description: 'Won on last 4 digits'
          },
          {
            rank: 5,
            tierName: '4th Prize',
            prizeAmountFormatted: '₹250',
            prizeAmountNumeric: 250,
            winningNumbers: ['0145', '1256', '2367', '3478', '4589', '5690', '6701', '7812', '8923', '9034'],
            description: 'Won on last 4 digits'
          }
        ],
        officialSource: {
          sourceName: 'Directorate of Sikkim State Lotteries / Official Gazette',
          sourceUrl: 'http://www.sikkimlotteries.com/results?date=2026-08-30&draw=day',
          gazetteNotificationNo: 'SK/LOT/GAZETTE/2026/D-41',
          verified: true,
          directorateName: 'Directorate of Sikkim State Lotteries, Government of Sikkim, Gangtok'
        },
        publishedTime: `${today}T13:20:00.000Z`,
        lastUpdatedTime: `${today}T13:25:00.000Z`,
        isDemoData: true,
        verificationStatus: 'VERIFIED_OFFICIAL',
        checksum: 'sha256-sk-meghna-2026-08-30'
      },

      // 4. Punjab Dear 100 Monthly Yesterday
      {
        id: `pb-punjab-state-dear-100-monthly-pb-m08-${yesterday}`,
        lotteryName: 'Punjab State Dear 100 Monthly',
        schemeCode: 'PUNJAB-STATE-DEAR-100-MONTHLY',
        stateCode: 'PB',
        stateName: 'Punjab',
        drawDate: yesterday,
        drawNumber: 'PB-2026-M08',
        drawTime: '06:00 PM',
        ticketPriceFormatted: '₹100',
        seriesList: ['PA', 'PB'],
        firstPrize: {
          amountFormatted: '₹1,50,00,000 (1.5 Crore)',
          amountNumeric: 15000000,
          winningTicket: 'PB 941203',
          series: 'PB',
          numberOnly: '941203'
        },
        prizes: [
          {
            rank: 1,
            tierName: '1st Prize',
            prizeAmountFormatted: '₹1,50,00,000 (1.5 Crore)',
            prizeAmountNumeric: 15000000,
            winningNumbers: ['PB 941203'],
            seriesRequired: true,
            description: 'Guaranteed 1st prize drawn strictly from sold tickets'
          },
          {
            rank: 2,
            tierName: '2nd Prize',
            prizeAmountFormatted: '₹10,00,000 (10 Lakhs)',
            prizeAmountNumeric: 1000000,
            winningNumbers: ['PA 129045'],
            seriesRequired: true
          },
          {
            rank: 3,
            tierName: '3rd Prize',
            prizeAmountFormatted: '₹9,000',
            prizeAmountNumeric: 9000,
            winningNumbers: ['3412', '7890', '1256', '9045', '5623'],
            description: 'Won on last 4 digits'
          },
          {
            rank: 4,
            tierName: '4th Prize',
            prizeAmountFormatted: '₹5,000',
            prizeAmountNumeric: 5000,
            winningNumbers: ['0912', '4523', '7812', '3490', '6723'],
            description: 'Won on last 4 digits'
          }
        ],
        officialSource: {
          sourceName: 'Punjab Government Gazette / Directorate of Punjab State Lotteries',
          sourceUrl: 'http://punjabstatelotteries.gov.in/results/latest-bumper-draw.php?date=2026-08-29',
          gazetteNotificationNo: 'PB/FIN/LOT/2026/09',
          verified: true,
          directorateName: 'Directorate of Punjab State Lotteries, Government of Punjab, Chandigarh'
        },
        publishedTime: `${yesterday}T18:30:00.000Z`,
        lastUpdatedTime: `${yesterday}T18:35:00.000Z`,
        isDemoData: true,
        verificationStatus: 'VERIFIED_OFFICIAL',
        checksum: 'sha256-pb-dear100-2026-08-29'
      },

      // 5. Goa Rajshree 50 Som Weekly
      {
        id: `ga-rajshree-50-som-weekly-ga-64-${yesterday}`,
        lotteryName: 'Rajshree 50 Som Weekly (07:30 PM)',
        schemeCode: 'RAJSHREE-50-SOM-WEEKLY',
        stateCode: 'GA',
        stateName: 'Goa',
        drawDate: yesterday,
        drawNumber: 'GA-2026-64',
        drawTime: '07:30 PM',
        ticketPriceFormatted: '₹50',
        seriesList: ['RS', 'RN', 'RP', 'RQ'],
        firstPrize: {
          amountFormatted: '₹21,00,000 (21 Lakhs)',
          amountNumeric: 2100000,
          winningTicket: 'RS 40918',
          series: 'RS',
          numberOnly: '40918'
        },
        prizes: [
          {
            rank: 1,
            tierName: '1st Prize',
            prizeAmountFormatted: '₹21,00,000 (21 Lakhs)',
            prizeAmountNumeric: 2100000,
            winningNumbers: ['RS 40918'],
            seriesRequired: true
          },
          {
            rank: 2,
            tierName: '2nd Prize',
            prizeAmountFormatted: '₹4,50,000',
            prizeAmountNumeric: 450000,
            winningNumbers: ['RS 12984'],
            seriesRequired: true
          },
          {
            rank: 3,
            tierName: '3rd Prize',
            prizeAmountFormatted: '₹9,000',
            prizeAmountNumeric: 9000,
            winningNumbers: ['3812', '9045', '1278', '6543'],
            description: 'Won on last 4 digits'
          }
        ],
        officialSource: {
          sourceName: 'Directorate of Small Savings and Lotteries / Goa Official Gazette',
          sourceUrl: 'http://goastatelotteries.gov.in/results?date=2026-08-29&scheme=rajshree-50',
          gazetteNotificationNo: 'GA/FIN/LOT/2026/SER-2',
          verified: true,
          directorateName: 'Directorate of Small Savings and Lotteries, Government of Goa, Panaji'
        },
        publishedTime: `${yesterday}T20:00:00.000Z`,
        lastUpdatedTime: `${yesterday}T20:05:00.000Z`,
        isDemoData: true,
        verificationStatus: 'VERIFIED_OFFICIAL',
        checksum: 'sha256-ga-rajshree-2026-08-29'
      },

      // 6. Kerala Karunya Plus Day Before Yesterday
      {
        id: `kl-karunya-plus-kn-520-${dayBefore}`,
        lotteryName: 'Karunya Plus (KN-520)',
        schemeCode: 'KARUNYA-PLUS',
        stateCode: 'KL',
        stateName: 'Kerala',
        drawDate: dayBefore,
        drawNumber: 'KN-520',
        drawTime: '03:00 PM',
        ticketPriceFormatted: '₹50',
        seriesList: ['PA', 'PB', 'PC', 'PD', 'PE', 'PF', 'PG', 'PH', 'PJ', 'PK', 'PL', 'PM'],
        firstPrize: {
          amountFormatted: '₹80,00,000 (80 Lakhs)',
          amountNumeric: 8000000,
          winningTicket: 'PL 673412',
          series: 'PL',
          numberOnly: '673412'
        },
        consolationPrizes: {
          amountFormatted: '₹8,000',
          winningNumbers: ['PA 673412', 'PB 673412', 'PC 673412', 'PD 673412', 'PE 673412', 'PF 673412', 'PG 673412', 'PH 673412', 'PJ 673412', 'PK 673412', 'PM 673412']
        },
        prizes: [
          {
            rank: 1,
            tierName: '1st Prize',
            prizeAmountFormatted: '₹80,00,000 (80 Lakhs)',
            prizeAmountNumeric: 8000000,
            winningNumbers: ['PL 673412'],
            seriesRequired: true
          },
          {
            rank: 2,
            tierName: 'Consolation Prize',
            prizeAmountFormatted: '₹8,000',
            prizeAmountNumeric: 8000,
            winningNumbers: ['Other series for 673412'],
            description: 'For all other series with same ticket number'
          },
          {
            rank: 3,
            tierName: '2nd Prize',
            prizeAmountFormatted: '₹10,00,000 (10 Lakhs)',
            prizeAmountNumeric: 1000000,
            winningNumbers: ['PK 904512'],
            seriesRequired: true
          },
          {
            rank: 4,
            tierName: '3rd Prize',
            prizeAmountFormatted: '₹5,000',
            prizeAmountNumeric: 5000,
            winningNumbers: ['0912', '3412', '6789', '9045', '1256', '8934'],
            description: 'Won on last 4 digits'
          }
        ],
        officialSource: {
          sourceName: 'Directorate of Kerala State Lotteries / Kerala Government Gazette',
          sourceUrl: 'http://www.keralalotteries.com/results/view-results.php?date=2026-08-28',
          gazetteNotificationNo: 'GO(P)No.82/2026/TAXES',
          verified: true,
          directorateName: 'Directorate of Kerala State Lotteries, Government of Kerala'
        },
        publishedTime: `${dayBefore}T15:30:00.000Z`,
        lastUpdatedTime: `${dayBefore}T15:35:00.000Z`,
        isDemoData: true,
        verificationStatus: 'VERIFIED_OFFICIAL',
        checksum: 'sha256-kl-karunya-2026-08-28'
      }
    ];

    for (const res of sampleResults) {
      this.results.set(res.id, res);
    }
  }
}
