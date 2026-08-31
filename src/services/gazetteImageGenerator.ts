import { LotteryResult } from '../types/lottery';

interface StateGazetteTheme {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  darkColor: string;
  lightBg: string;
  directorate: string;
  headquarters: string;
}

export const STATE_GAZETTE_THEMES: Record<string, StateGazetteTheme> = {
  KL: {
    primaryColor: '#047857', // Emerald
    secondaryColor: '#065f46',
    accentColor: '#d97706',
    darkColor: '#064e3b',
    lightBg: '#f0fdf4',
    directorate: 'DIRECTORATE OF KERALA STATE LOTTERIES',
    headquarters: 'Vikas Bhavan, Thiruvananthapuram, Kerala - 695033'
  },
  NL: {
    primaryColor: '#b91c1c', // Crimson
    secondaryColor: '#991b1b',
    accentColor: '#d97706',
    darkColor: '#450a0a',
    lightBg: '#fef2f2',
    directorate: 'DIRECTORATE OF NAGALAND STATE LOTTERIES',
    headquarters: 'Directorate of State Lotteries, Kohima, Nagaland - 797001'
  },
  SK: {
    primaryColor: '#1d4ed8', // Royal Blue
    secondaryColor: '#1e40af',
    accentColor: '#d97706',
    darkColor: '#172554',
    lightBg: '#eff6ff',
    directorate: 'DIRECTORATE OF SIKKIM STATE LOTTERIES',
    headquarters: 'Deorali, Gangtok, Sikkim - 737102'
  },
  PB: {
    primaryColor: '#c2410c', // Saffron / Orange
    secondaryColor: '#9a3412',
    accentColor: '#d97706',
    darkColor: '#431407',
    lightBg: '#fff7ed',
    directorate: 'DIRECTORATE OF PUNJAB STATE LOTTERIES',
    headquarters: 'Vit-te-Yojna Bhawan, Sector 33-A, Chandigarh - 160020'
  },
  GA: {
    primaryColor: '#0f766e', // Teal
    secondaryColor: '#115e59',
    accentColor: '#d97706',
    darkColor: '#134e4a',
    lightBg: '#f0fdfa',
    directorate: 'DIRECTORATE OF SMALL SAVINGS & LOTTERIES, GOA',
    headquarters: 'Serra Building, Altinho, Panaji, Goa - 403001'
  },
  MZ: {
    primaryColor: '#4338ca', // Indigo
    secondaryColor: '#3730a3',
    accentColor: '#d97706',
    darkColor: '#1e1b4b',
    lightBg: '#eef2ff',
    directorate: 'DIRECTORATE OF INSTITUTIONAL FINANCE & STATE LOTTERIES',
    headquarters: 'Tuikhuahtlang, Aizawl, Mizoram - 796001'
  },
  MH: {
    primaryColor: '#ea580c', // Deep Saffron
    secondaryColor: '#c2410c',
    accentColor: '#1d4ed8',
    darkColor: '#431407',
    lightBg: '#fff7ed',
    directorate: 'DIRECTORATE OF MAHARASHTRA STATE LOTTERIES',
    headquarters: 'Finance Department, Old Custom House, Mumbai - 400001'
  },
  WB: {
    primaryColor: '#0369a1', // Sky Blue
    secondaryColor: '#075985',
    accentColor: '#d97706',
    darkColor: '#082f49',
    lightBg: '#f0f9ff',
    directorate: 'DIRECTORATE OF WEST BENGAL STATE LOTTERIES',
    headquarters: 'O.C.A. Building, B.B.D. Bagh East, Kolkata, West Bengal - 700001'
  },
  AR: {
    primaryColor: '#0d9488', // Light Teal
    secondaryColor: '#0f766e',
    accentColor: '#d97706',
    darkColor: '#134e4a',
    lightBg: '#f0fdfa',
    directorate: 'DIRECTORATE OF ARUNACHAL PRADESH STATE LOTTERIES',
    headquarters: 'Old Secretariat, Naharlagun, Itanagar, Arunachal Pradesh - 791110'
  },
  ML: {
    primaryColor: '#15803d', // Green
    secondaryColor: '#166534',
    accentColor: '#d97706',
    darkColor: '#052e16',
    lightBg: '#f0fdf4',
    directorate: 'DIRECTORATE OF MEGHALAYA STATE LOTTERIES',
    headquarters: 'Directorate of State Lotteries, MTC Building, Shillong, Meghalaya - 793001'
  }
};

function escapeXml(unsafe: string): string {
  if (!unsafe) return '';
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
      default: return c;
    }
  });
}

export function generateOfficialGazetteSvg(result: LotteryResult): string {
  const theme = STATE_GAZETTE_THEMES[result.stateCode?.toUpperCase()] || {
    primaryColor: '#1d4ed8',
    secondaryColor: '#1e40af',
    accentColor: '#d97706',
    darkColor: '#0f172a',
    lightBg: '#f8fafc',
    directorate: `DIRECTORATE OF ${(result.stateName || 'STATE').toUpperCase()} STATE LOTTERIES`,
    headquarters: `Government of ${result.stateName || 'State'}`
  };

  const totalPrizes = result.prizes ? result.prizes.length : 0;
  
  // Calculate dynamic height based on tiers
  let calculatedHeight = 1180;
  if (totalPrizes > 5) {
    calculatedHeight += (totalPrizes - 5) * 110;
  }
  const width = 1000;
  const secondaryTiers = (result.prizes || []).filter(p => p.rank > 1);

  let currentY = 385;

  // Build Prize Tiers SVG Elements
  let prizeTiersSvg = '';
  for (const tier of secondaryTiers) {
    const numbers = tier.winningNumbers || [];
    const isSmallNumbers = numbers.length > 0 && numbers[0].length <= 5;
    const itemsPerRow = isSmallNumbers ? 8 : 4;
    
    // Group into rows
    const rows: string[][] = [];
    for (let i = 0; i < numbers.length; i += itemsPerRow) {
      rows.push(numbers.slice(i, i + itemsPerRow));
    }

    const rowHeight = 32;
    const tierBoxHeight = Math.max(70, 42 + rows.length * rowHeight);

    prizeTiersSvg += `
      <!-- Prize Tier: ${escapeXml(tier.tierName)} -->
      <g transform="translate(45, ${currentY})">
        <rect width="910" height="${tierBoxHeight}" rx="6" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.5"/>
        <rect width="910" height="34" rx="6" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.5"/>
        <line x1="0" y1="34" x2="910" y2="34" stroke="#cbd5e1" stroke-width="1.5"/>
        
        <!-- Header -->
        <circle cx="20" cy="17" r="10" fill="${theme.primaryColor}"/>
        <text x="20" y="21" font-family="'Helvetica Neue', Arial, sans-serif" font-size="11" font-weight="900" fill="#ffffff" text-anchor="middle">#${tier.rank}</text>
        <text x="38" y="22" font-family="'Helvetica Neue', Arial, sans-serif" font-size="14" font-weight="800" fill="${theme.darkColor}">${escapeXml(tier.tierName.toUpperCase())}</text>
        ${tier.description ? `<text x="240" y="21" font-family="'Helvetica Neue', Arial, sans-serif" font-size="11" font-weight="600" fill="#64748b">(${escapeXml(tier.description)})</text>` : ''}
        <text x="890" y="22" font-family="'Courier New', Courier, monospace" font-size="15" font-weight="900" fill="${theme.primaryColor}" text-anchor="end">${escapeXml(tier.prizeAmountFormatted)}</text>
        
        <!-- Numbers Grid -->
        <g transform="translate(20, 46)">
          ${rows.map((row, rIdx) => {
            const yPos = rIdx * rowHeight + 16;
            return row.map((num, cIdx) => {
              const colWidth = 870 / itemsPerRow;
              const xPos = cIdx * colWidth + colWidth / 2;
              return `
                <rect x="${cIdx * colWidth + 4}" y="${rIdx * rowHeight}" width="${colWidth - 8}" height="24" rx="4" fill="#f1f5f9" stroke="#e2e8f0" stroke-width="1"/>
                <text x="${xPos}" y="${yPos}" font-family="'Courier New', Courier, monospace" font-size="13" font-weight="800" fill="#0f172a" text-anchor="middle" letter-spacing="1">${escapeXml(num)}</text>
              `;
            }).join('');
          }).join('')}
        </g>
      </g>
    `;

    currentY += tierBoxHeight + 14;
  }

  const footerY = currentY + 10;
  const totalSvgHeight = footerY + 230;

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${totalSvgHeight}" width="${width}" height="${totalSvgHeight}">
  <defs>
    <linearGradient id="headerGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="${theme.primaryColor}"/>
      <stop offset="50%" stop-color="${theme.secondaryColor}"/>
      <stop offset="100%" stop-color="${theme.primaryColor}"/>
    </linearGradient>
    <linearGradient id="jackpotGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0f172a"/>
      <stop offset="100%" stop-color="${theme.darkColor}"/>
    </linearGradient>
    <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#f59e0b"/>
      <stop offset="100%" stop-color="#fbbf24"/>
    </linearGradient>
    <filter id="shadow" x="-5%" y="-5%" width="110%" height="110%">
      <feDropShadow dx="0" dy="2" stdDeviation="3" flood-opacity="0.15"/>
    </filter>
  </defs>

  <!-- Background Canvas -->
  <rect width="${width}" height="${totalSvgHeight}" fill="#ffffff"/>
  
  <!-- Outer Decorative Gazette Double Border -->
  <rect x="15" y="15" width="${width - 30}" height="${totalSvgHeight - 30}" fill="none" stroke="${theme.primaryColor}" stroke-width="4"/>
  <rect x="23" y="23" width="${width - 46}" height="${totalSvgHeight - 46}" fill="none" stroke="${theme.primaryColor}" stroke-width="1.5"/>
  
  <!-- Corner Rosettes / Decorative Accents -->
  <circle cx="23" cy="23" r="6" fill="${theme.accentColor}"/>
  <circle cx="${width - 23}" cy="23" r="6" fill="${theme.accentColor}"/>
  <circle cx="23" cy="${totalSvgHeight - 23}" r="6" fill="${theme.accentColor}"/>
  <circle cx="${width - 23}" cy="${totalSvgHeight - 23}" r="6" fill="${theme.accentColor}"/>

  <!-- TOP GAZETTE HEADER -->
  <g transform="translate(45, 38)">
    <!-- Government Emblem / Header Banner -->
    <rect width="910" height="95" rx="8" fill="url(#headerGrad)" filter="url(#shadow)"/>
    
    <!-- Emblem Crest Stylized -->
    <circle cx="60" cy="48" r="28" fill="#ffffff" opacity="0.15"/>
    <circle cx="60" cy="48" r="22" fill="#ffffff" opacity="0.95"/>
    <text x="60" y="44" font-family="'Helvetica Neue', Arial, sans-serif" font-size="9" font-weight="900" fill="${theme.primaryColor}" text-anchor="middle">GOVT OF</text>
    <text x="60" y="56" font-family="'Helvetica Neue', Arial, sans-serif" font-size="10" font-weight="900" fill="${theme.primaryColor}" text-anchor="middle">${result.stateCode}</text>
    
    <!-- Title Text -->
    <text x="475" y="32" font-family="'Helvetica Neue', Arial, sans-serif" font-size="14" font-weight="800" fill="#fef08a" text-anchor="middle" letter-spacing="3">GOVERNMENT OF ${(result.stateName || 'STATE').toUpperCase()}</text>
    <text x="475" y="54" font-family="'Helvetica Neue', Arial, sans-serif" font-size="20" font-weight="900" fill="#ffffff" text-anchor="middle" letter-spacing="1">${escapeXml(theme.directorate)}</text>
    <text x="475" y="74" font-family="'Helvetica Neue', Arial, sans-serif" font-size="11" font-weight="600" fill="#e2e8f0" text-anchor="middle">${escapeXml(theme.headquarters)}</text>
    
    <!-- Verification Badge Top Right -->
    <rect x="760" y="24" width="130" height="48" rx="6" fill="#ffffff" opacity="0.95"/>
    <text x="825" y="42" font-family="'Helvetica Neue', Arial, sans-serif" font-size="10" font-weight="900" fill="${theme.primaryColor}" text-anchor="middle">OFFICIAL GAZETTE</text>
    <text x="825" y="58" font-family="'Courier New', Courier, monospace" font-size="10" font-weight="800" fill="#047857" text-anchor="middle">✓ VERIFIED DRAW</text>
  </g>

  <!-- DRAW DETAILS META CARD -->
  <g transform="translate(45, 145)">
    <rect width="910" height="85" rx="6" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.5"/>
    
    <!-- Lottery Name Title -->
    <text x="24" y="32" font-family="'Helvetica Neue', Arial, sans-serif" font-size="22" font-weight="900" fill="${theme.darkColor}">
      ${escapeXml(result.lotteryName.toUpperCase())}
    </text>
    
    <!-- Gazette Ref No & Draw No -->
    <text x="24" y="54" font-family="'Courier New', Courier, monospace" font-size="12" font-weight="700" fill="#475569">
      DRAW NO: <tspan font-weight="900" fill="${theme.primaryColor}">${escapeXml(result.drawNumber)}</tspan> | GAZETTE REF: ${escapeXml(result.officialSource?.gazetteNotificationNo || `${result.stateCode}-LOT-${result.drawNumber}`)}
    </text>
    <text x="24" y="72" font-family="'Helvetica Neue', Arial, sans-serif" font-size="11" font-weight="600" fill="#64748b">
      Draw conducted at authorized government lottery hall in presence of official judges &amp; commission.
    </text>
    
    <!-- Date & Time Box (Right Side) -->
    <rect x="670" y="14" width="220" height="58" rx="6" fill="#ffffff" stroke="#94a3b8" stroke-width="1"/>
    <text x="780" y="36" font-family="'Helvetica Neue', Arial, sans-serif" font-size="11" font-weight="800" fill="#64748b" text-anchor="middle">DRAW DATE &amp; TIME</text>
    <text x="780" y="56" font-family="'Courier New', Courier, monospace" font-size="14" font-weight="900" fill="${theme.primaryColor}" text-anchor="middle">${escapeXml(result.drawDate)} | ${escapeXml(result.drawTime)}</text>
  </g>

  <!-- 1ST PRIZE (JACKPOT) HIGHLIGHT BANNER -->
  <g transform="translate(45, 240)">
    <rect width="910" height="130" rx="8" fill="url(#jackpotGrad)" filter="url(#shadow)"/>
    <rect x="3" y="3" width="904" height="124" rx="6" fill="none" stroke="#fbbf24" stroke-width="2"/>
    
    <!-- Jackpot Label -->
    <rect x="25" y="18" width="180" height="28" rx="4" fill="#fbbf24"/>
    <text x="115" y="37" font-family="'Helvetica Neue', Arial, sans-serif" font-size="12" font-weight="900" fill="#0f172a" text-anchor="middle" letter-spacing="1">★ 1ST PRIZE (JACKPOT) ★</text>
    
    <!-- Prize Amount -->
    <text x="885" y="42" font-family="'Courier New', Courier, monospace" font-size="28" font-weight="900" fill="#fef08a" text-anchor="end">
      ${escapeXml(result.firstPrize.amountFormatted)}
    </text>
    
    <!-- Ticket Number Box -->
    <rect x="25" y="56" width="460" height="58" rx="6" fill="#ffffff"/>
    <text x="45" y="97" font-family="'Courier New', Courier, monospace" font-size="34" font-weight="900" fill="#0f172a" letter-spacing="6">
      ${escapeXml(result.firstPrize.winningTicket)}
    </text>
    
    <!-- Consolation Info -->
    <g transform="translate(505, 62)">
      <text x="0" y="16" font-family="'Helvetica Neue', Arial, sans-serif" font-size="11" font-weight="800" fill="#fbbf24">
        ${result.consolationPrizes ? `CONSOLATION PRIZE: ${escapeXml(result.consolationPrizes.amountFormatted)}` : 'SERIES TICKETS'}
      </text>
      <text x="0" y="34" font-family="'Helvetica Neue', Arial, sans-serif" font-size="11" font-weight="500" fill="#cbd5e1">
        ${result.seriesList && result.seriesList.length > 0 ? `Active Series: ${escapeXml(result.seriesList.slice(0, 10).join(', '))}` : 'Remaining series tickets matching winning numbers'}
      </text>
      <text x="0" y="48" font-family="'Courier New', Courier, monospace" font-size="10" font-weight="700" fill="#94a3b8">
        Ticket Price: ${escapeXml(result.ticketPriceFormatted)}
      </text>
    </g>
  </g>

  <!-- ALL PRIZE TIERS BREAKDOWN -->
  ${prizeTiersSvg}

  <!-- OFFICIAL FOOTER & VERIFICATION STAMP -->
  <g transform="translate(45, ${footerY})">
    <rect width="910" height="200" rx="8" fill="#f8fafc" stroke="#94a3b8" stroke-width="1.5"/>
    
    <!-- Legal Notice -->
    <text x="24" y="28" font-family="'Helvetica Neue', Arial, sans-serif" font-size="11" font-weight="800" fill="${theme.darkColor}">
      OFFICIAL GOVERNMENT DIRECTIVES &amp; VERIFICATION RULES:
    </text>
    <text x="24" y="46" font-family="'Helvetica Neue', Arial, sans-serif" font-size="10" font-weight="500" fill="#475569">
      1. The prize winners are advised to verify winning ticket numbers with the official results published in the Government Gazette.
    </text>
    <text x="24" y="62" font-family="'Helvetica Neue', Arial, sans-serif" font-size="10" font-weight="500" fill="#475569">
      2. Surrender winning tickets within 30 days from the draw date along with valid government photo identification.
    </text>
    <text x="24" y="78" font-family="'Helvetica Neue', Arial, sans-serif" font-size="10" font-weight="500" fill="#475569">
      3. Taxes and deduction as applicable under Income Tax Act Section 194B shall be deducted at source.
    </text>

    <!-- Divider -->
    <line x1="24" y1="92" x2="886" y2="92" stroke="#cbd5e1" stroke-width="1"/>

    <!-- Audit & Directorate Signature Section -->
    <g transform="translate(24, 108)">
      <text x="0" y="16" font-family="'Courier New', Courier, monospace" font-size="10" font-weight="800" fill="#0f172a">
        SECURITY CHECKSUM: <tspan fill="${theme.primaryColor}">${escapeXml(result.checksum || `sha256-${result.id}`)}</tspan>
      </text>
      <text x="0" y="32" font-family="'Courier New', Courier, monospace" font-size="10" font-weight="600" fill="#64748b">
        PUBLISHED TIMESTAMP: ${escapeXml(result.publishedTime)} | VERIFICATION: ${escapeXml(result.verificationStatus)}
      </text>
      <text x="0" y="48" font-family="'Helvetica Neue', Arial, sans-serif" font-size="10" font-weight="600" fill="#047857">
        ✓ DIRECT GOVERNMENT DATA FEED • AUTHENTIC RECORD
      </text>
      <text x="0" y="64" font-family="'Helvetica Neue', Arial, sans-serif" font-size="9" font-weight="500" fill="#94a3b8">
        Portal: myindialottery.online | State Directorate Authorized Ingestion Node
      </text>
    </g>

    <!-- Directorate Official Stamp (Right) -->
    <g transform="translate(710, 105)">
      <!-- Seal Circle -->
      <circle cx="90" cy="40" r="36" fill="none" stroke="${theme.primaryColor}" stroke-width="2" stroke-dasharray="4,2"/>
      <circle cx="90" cy="40" r="32" fill="none" stroke="${theme.primaryColor}" stroke-width="1"/>
      <text x="90" y="32" font-family="'Helvetica Neue', Arial, sans-serif" font-size="8" font-weight="900" fill="${theme.primaryColor}" text-anchor="middle">DIRECTORATE</text>
      <text x="90" y="43" font-family="'Helvetica Neue', Arial, sans-serif" font-size="7" font-weight="800" fill="${theme.primaryColor}" text-anchor="middle">OF STATE LOTTERIES</text>
      <text x="90" y="53" font-family="'Courier New', Courier, monospace" font-size="7" font-weight="900" fill="#047857" text-anchor="middle">★ SEALED ★</text>
    </g>
  </g>
</svg>`;
}
