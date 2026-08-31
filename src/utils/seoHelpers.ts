import { LotteryState } from '../types/lottery';

export interface StateSeoConfig {
  code: string;
  slug: string;
  name: string;
  seoTitle: string;
  metaDescription: string;
  h1: string;
  h2: string;
  primaryKeywords: string[];
  directorate: string;
  drawTimings: string[];
  schemesSummary: string;
  gazetteNotice: string;
}

export const STATE_SEO_MAP: Record<string, StateSeoConfig> = {
  KL: {
    code: 'KL',
    slug: 'kerala-lottery-result',
    name: 'Kerala',
    seoTitle: 'Kerala Lottery Result Today | Win-Win, Fifty-Fifty, Karunya & Bumper Official Gazette',
    metaDescription: 'Check Kerala lottery result today live at 3:00 PM. Official winning numbers for Fifty-Fifty, Win-Win, Sthree Sakthi, Nirmal, Karunya & Bumper draws with verified gazette.',
    h1: 'Kerala Lottery Result Today (3:00 PM Draw)',
    h2: 'Official Kerala State Lotteries Draw Results & Gazette Archive',
    primaryKeywords: ['kerala lottery result today', 'kerala lottery today', 'kerala lottery winning numbers', 'kerala state lottery gazette', 'fifty fifty lottery result', 'win win lottery result'],
    directorate: 'Directorate of Kerala State Lotteries, Vikas Bhavan, Thiruvananthapuram',
    drawTimings: ['03:00 PM'],
    schemesSummary: 'Win-Win (Mon), Sthree Sakthi (Tue), Fifty-Fifty (Sun), Karunya Plus (Thu), Nirmal (Fri), Karunya (Sat), Akshaya (Wed)',
    gazetteNotice: 'Published under the authority of Taxes Department, Government of Kerala. 1st Prize ₹70 Lakhs to ₹1 Crore, Bumper up to ₹25 Crores.'
  },
  NL: {
    code: 'NL',
    slug: 'nagaland-lottery-result',
    name: 'Nagaland',
    seoTitle: 'Nagaland Lottery Result Today | Dear Lottery Sambad 1 PM, 6 PM, 8 PM Live Draw',
    metaDescription: 'Nagaland state lottery result today live updates at 1:00 PM, 6:00 PM, and 8:00 PM. Dear Lottery Sambad 1st prize ₹1 Crore winning numbers and official PDF gazette download.',
    h1: 'Nagaland Lottery Result Today (Dear Lottery Sambad)',
    h2: 'Dear 1 PM, 6 PM & 8 PM Official Draw Winning Numbers',
    primaryKeywords: ['nagaland lottery result today', 'lottery sambad today', 'dear lottery result today', 'nagaland state lottery', 'lottery sambad 1 pm result', 'lottery sambad 6 pm result', 'lottery sambad 8 pm result'],
    directorate: 'Directorate of Nagaland State Lotteries, Kohima',
    drawTimings: ['01:00 PM', '06:00 PM', '08:00 PM'],
    schemesSummary: 'Dear Morning (1 PM), Dear Day (6 PM), Dear Evening (8 PM), Dear Monthly Bumper',
    gazetteNotice: 'Supervised by Directorate of Nagaland State Lotteries. Guaranteed 1st Prize of ₹1,00,00,000 (₹1 Crore) with 10 series.'
  },
  SK: {
    code: 'SK',
    slug: 'sikkim-lottery-result',
    name: 'Sikkim',
    seoTitle: 'Sikkim Lottery Result Today | Dear Respect, Meghna & Singam Draw Results',
    metaDescription: 'Sikkim state lottery result today. Live winning numbers for Dear Respect Morning (11:55 AM), Dear Meghna Day (6:00 PM), Dear Mountain Evening & Singam Weekly draws.',
    h1: 'Sikkim Lottery Result Today',
    h2: 'Directorate of Sikkim State Lotteries Winning Numbers & Gazette',
    primaryKeywords: ['sikkim lottery result today', 'sikkim lottery result', 'dear sikkim lottery', 'sikkim state lottery sambad', 'singam weekly lottery'],
    directorate: 'Directorate of Sikkim State Lotteries, Gangtok',
    drawTimings: ['11:55 AM', '04:00 PM', '06:00 PM', '07:00 PM'],
    schemesSummary: 'Dear Respect (11:55 AM), Singam Weekly (4 PM), Dear Meghna (6 PM), Dear Mountain (7 PM)',
    gazetteNotice: 'Finance, Revenue and Expenditure Department, Gangtok. 1st prize ₹1 Crore paper lotteries.'
  },
  PB: {
    code: 'PB',
    slug: 'punjab-lottery-result',
    name: 'Punjab',
    seoTitle: 'Punjab Lottery Result Today | Punjab State Dear 100, 200 & Diwali Bumper Results',
    metaDescription: 'Punjab state lottery result today. Official winning numbers for Punjab State Dear 100 Monthly, Dear 200, Lohri Bumper, and Diwali Bumper draws.',
    h1: 'Punjab Lottery Result Today',
    h2: 'Punjab State Lotteries Directorate Draw Archives & Bumper Results',
    primaryKeywords: ['punjab lottery result today', 'punjab state lottery result', 'punjab dear 100 monthly', 'punjab diwali bumper result', 'punjab lottery winning numbers'],
    directorate: 'Directorate of Punjab State Lotteries, Chandigarh',
    drawTimings: ['06:00 PM'],
    schemesSummary: 'Dear 100 Monthly, Dear 200 Monthly, Lohri Bumper, Baisakhi Bumper, Diwali Bumper',
    gazetteNotice: '1st prize drawn strictly from sold tickets. Guaranteed multi-crore bumper winners.'
  },
  GA: {
    code: 'GA',
    slug: 'goa-lottery-result',
    name: 'Goa',
    seoTitle: 'Goa Lottery Result Today | Rajshree 50 Som & Rajshree 200 Monthly Results',
    metaDescription: 'Goa state lottery result today. Official winning numbers for Rajshree 50 Som Weekly, Rajshree Everest, and Rajshree 200 Monthly paper lottery draws.',
    h1: 'Goa Lottery Result Today (Rajshree Draws)',
    h2: 'Directorate of Small Savings and Lotteries Goa Official Gazette',
    primaryKeywords: ['goa lottery result today', 'rajshree lottery result today', 'goa state lottery', 'rajshree 50 weekly', 'goa lottery winning numbers'],
    directorate: 'Directorate of Small Savings and Lotteries, Government of Goa, Panaji',
    drawTimings: ['11:55 AM', '04:00 PM', '07:30 PM'],
    schemesSummary: 'Rajshree 50 Weekly, Rajshree Everest Daily, Rajshree 200 Monthly Bumper',
    gazetteNotice: 'Finance Department, Secretariat, Porvorim. Regulated under Goa state lotteries rules.'
  },
  MZ: {
    code: 'MZ',
    slug: 'mizoram-lottery-result',
    name: 'Mizoram',
    seoTitle: 'Mizoram Lottery Result Today | Golden King, Silver Weekly & Diamond Bumper',
    metaDescription: 'Mizoram state lottery result today. Official draw winning numbers for Golden King Weekly, Silver Weekly, and Mizoram Diamond Bumper draws.',
    h1: 'Mizoram Lottery Result Today',
    h2: 'Directorate of IF&SL Mizoram Government Draw Gazette',
    primaryKeywords: ['mizoram lottery result today', 'mizoram state lottery result', 'golden king lottery', 'silver weekly lottery mizoram', 'mizoram lottery sambad'],
    directorate: 'Directorate of Institutional Finance & State Lottery (IF&SL), Aizawl',
    drawTimings: ['11:55 AM', '04:00 PM', '07:00 PM'],
    schemesSummary: 'Golden King Weekly (4 PM), Silver Weekly (7 PM), Rajshree Som (11:55 AM), Diamond Bumper',
    gazetteNotice: 'Conducted under Institutional Finance & State Lottery Department, Government of Mizoram.'
  },
  MH: {
    code: 'MH',
    slug: 'maharashtra-lottery-result',
    name: 'Maharashtra',
    seoTitle: 'Maharashtra Lottery Result Today | Gajlaxmi Som, Surabhi & Mahalaxmi Results',
    metaDescription: 'Maharashtra state lottery result today. Official winning numbers for Maharashtra Gajlaxmi Som, Gajlaxmi Budh, Surabhi, and Mahalaxmi weekly draws.',
    h1: 'Maharashtra Lottery Result Today',
    h2: 'Directorate of Maharashtra State Lotteries Official Draw Archives',
    primaryKeywords: ['maharashtra lottery result today', 'gajlaxmi lottery result', 'maharashtra state lottery', 'surabhi weekly lottery', 'maharashtra lottery winning numbers'],
    directorate: 'Directorate of Maharashtra State Lotteries, Mantralaya, Mumbai',
    drawTimings: ['04:15 PM', '04:30 PM', '04:45 PM'],
    schemesSummary: 'Gajlaxmi Som Weekly (4:15 PM), Surabhi Weekly (4:30 PM), Mahalaxmi Weekly (4:45 PM)',
    gazetteNotice: 'Regulated by Finance Department, Government of Maharashtra under Central Act 39 of 1998.'
  },
  WB: {
    code: 'WB',
    slug: 'west-bengal-lottery-result',
    name: 'West Bengal',
    seoTitle: 'West Bengal Lottery Result Today | Bangalakshmi, Bangabhumi & Dear Bengal Results',
    metaDescription: 'West Bengal lottery result today. Official winning numbers for Bangalakshmi Weekly, Bangabhumi, Bangashree Super, and Dear Bengal Bumper draws.',
    h1: 'West Bengal Lottery Result Today',
    h2: 'West Bengal Directorate of State Lotteries Draw Results & Gazette',
    primaryKeywords: ['west bengal lottery result today', 'west bengal lottery sambad', 'bangalakshmi lottery result', 'dear bengal lottery', 'west bengal lottery result'],
    directorate: 'West Bengal Directorate of Lotteries, Nabanna, Howrah / Kolkata',
    drawTimings: ['04:00 PM'],
    schemesSummary: 'Bangalakshmi Weekly (4 PM), Bangabhumi Weekly (4 PM), Dear Bengal Bumper (4 PM), Bangashree Super',
    gazetteNotice: 'Authorized distribution and draw results verified against West Bengal state gazette notifications.'
  },
  AR: {
    code: 'AR',
    slug: 'arunachal-pradesh-lottery-result',
    name: 'Arunachal Pradesh',
    seoTitle: 'Arunachal Pradesh Lottery Result Today | Singam Peak & LabhLaxmi Draw Results',
    metaDescription: 'Arunachal Pradesh state lottery result today. Official winning numbers for Singam Peak Weekly (11:55 AM), LabhLaxmi Som (5:00 PM), and Arunachal Super draws.',
    h1: 'Arunachal Pradesh Lottery Result Today',
    h2: 'Directorate of Arunachal Pradesh State Lotteries Official Draw Archives',
    primaryKeywords: ['arunachal pradesh lottery result today', 'singam peak lottery', 'labhlaxmi lottery result', 'arunachal state lottery', 'lottery result arunachal'],
    directorate: 'Directorate of Arunachal Pradesh State Lotteries, Itanagar',
    drawTimings: ['11:55 AM', '05:00 PM'],
    schemesSummary: 'Singam Peak Weekly (11:55 AM), LabhLaxmi Som (5 PM), LabhLaxmi Mangal (5 PM), Arunachal Super',
    gazetteNotice: 'Finance Department, Government of Arunachal Pradesh, Itanagar.'
  },
  ML: {
    code: 'ML',
    slug: 'meghalaya-lottery-result',
    name: 'Meghalaya',
    seoTitle: 'Meghalaya Lottery Result Today | Singam Meghalaya, Kuwait & Khanapara Teer Results',
    metaDescription: 'Meghalaya state lottery result today. Official winning numbers for Singam Meghalaya Day (12:30 PM), Kuwait Weekly (3:30 PM), and licensed Khanapara Teer results.',
    h1: 'Meghalaya Lottery Result Today',
    h2: 'Directorate of Meghalaya State Lotteries & Traditional Teer Results',
    primaryKeywords: ['meghalaya lottery result today', 'meghalaya state lottery', 'singam meghalaya result', 'khanapara teer result today', 'meghalaya teer result'],
    directorate: 'Directorate of Meghalaya State Lotteries, Shillong',
    drawTimings: ['12:30 PM', '03:30 PM'],
    schemesSummary: 'Singam Meghalaya Day (12:30 PM), Kuwait Weekly (3:30 PM), Khanapara Teer (3:30 PM)',
    gazetteNotice: 'Excise, Registration, Taxation & Stamps Department, Government of Meghalaya, Shillong.'
  }
};

/**
 * Resolve state code from code or friendly slug (e.g. "nagaland-lottery-result", "nagaland", "NL")
 */
export function resolveStateCode(input: string): string | undefined {
  if (!input) return undefined;
  const upper = input.trim().toUpperCase();
  if (STATE_SEO_MAP[upper]) return upper;

  const normalized = input.trim().toLowerCase().replace(/[^a-z0-9]/g, '');

  for (const [code, cfg] of Object.entries(STATE_SEO_MAP)) {
    const slugNorm = cfg.slug.replace(/[^a-z0-9]/g, '');
    const nameNorm = cfg.name.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (
      code.toLowerCase() === normalized ||
      slugNorm === normalized ||
      nameNorm === normalized ||
      slugNorm.startsWith(normalized) ||
      normalized.startsWith(nameNorm)
    ) {
      return code;
    }
  }

  return undefined;
}

export function getStateCanonicalUrl(code: string): string {
  const cfg = STATE_SEO_MAP[code.toUpperCase()];
  if (cfg) {
    return `https://myindialottery.online/states/${cfg.slug}`;
  }
  return `https://myindialottery.online/states/${code.toLowerCase()}`;
}

export function getStateCanonicalPath(code: string): string {
  const cfg = STATE_SEO_MAP[code.toUpperCase()];
  if (cfg) {
    return `/states/${cfg.slug}`;
  }
  return `/states/${code.toLowerCase()}`;
}

/**
 * Build BreadcrumbList JSON-LD Schema
 */
export function buildBreadcrumbSchema(items: { name: string; url: string }[]): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `https://myindialottery.online${item.url}`
    }))
  };
}
