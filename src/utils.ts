import { RPCategory, RPEvent } from './types';

// Chinese week day names
export const WEEK_DAYS_ZH = ['週日', '週一', '週二', '週三', '週四', '週五', '週六'];

export const CATEGORY_MAP: Record<RPCategory, { label: string; colorClass: string; iconBg: string; textClass: string }> = {
  bar: {
    label: '深夜酒吧 🍻',
    colorClass: 'border-purple-500/30 text-purple-400 bg-purple-950/40 hover:bg-purple-900/50',
    iconBg: 'bg-purple-600',
    textClass: 'text-purple-400'
  },
  cafe: {
    label: '輕食咖啡店 ☕',
    colorClass: 'border-teal-500/30 text-teal-400 bg-teal-950/40 hover:bg-teal-900/50',
    iconBg: 'bg-teal-600',
    textClass: 'text-teal-400'
  },
  club: {
    label: '夜店舞廳 ⚡',
    colorClass: 'border-fuchsia-500/30 text-fuchsia-400 bg-fuchsia-950/40 hover:bg-fuchsia-900/50',
    iconBg: 'bg-fuchsia-600',
    textClass: 'text-fuchsia-400'
  },
  bath: {
    label: '溫泉澡堂 ♨️',
    colorClass: 'border-rose-500/30 text-rose-400 bg-rose-950/40 hover:bg-rose-900/50',
    iconBg: 'bg-rose-600',
    textClass: 'text-rose-400'
  },
  performance: {
    label: '劇團/音樂公演 🎭',
    colorClass: 'border-amber-500/30 text-amber-400 bg-amber-950/40 hover:bg-amber-900/50',
    iconBg: 'bg-amber-600',
    textClass: 'text-amber-400'
  },
  photo: {
    label: '影棚打卡 📸',
    colorClass: 'border-sky-500/30 text-sky-400 bg-sky-950/40 hover:bg-sky-900/50',
    iconBg: 'bg-sky-600',
    textClass: 'text-sky-400'
  },
  fortune: {
    label: '占卜心靈諮詢 🔮',
    colorClass: 'border-indigo-500/30 text-indigo-400 bg-indigo-950/40 hover:bg-indigo-900/50',
    iconBg: 'bg-indigo-600',
    textClass: 'text-indigo-400'
  },
  other: {
    label: '其他聚會 🌟',
    colorClass: 'border-slate-500/30 text-slate-400 bg-slate-900/40 hover:bg-slate-800/50',
    iconBg: 'bg-slate-500',
    textClass: 'text-slate-400'
  }
};

export function getCategoryConfig(category: string): { label: string; colorClass: string; iconBg: string; textClass: string } {
  if (CATEGORY_MAP[category]) {
    return CATEGORY_MAP[category];
  }
  return {
    label: `${category} 🌟`,
    colorClass: 'border-zinc-500/30 text-zinc-400 bg-zinc-900/40 hover:bg-[#202024]/50',
    iconBg: 'bg-zinc-600',
    textClass: 'text-zinc-400'
  };
}

export const DC_WORLDS: Record<string, string[]> = {
  '繁體中文服': ['鳳凰', '伊弗利特', '迦樓羅', '利維坦', '巴哈姆特', '奧汀', '泰坦']
};

/**
 * Parses date string (YYYY-MM-DD) into Date object
 */
export function parseDate(dateStr: string): Date {
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day);
}

/**
 * Formats a Date object as YYYY-MM-DD
 */
export function formatDateString(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/**
 * Formats date into "MM月DD日 (週X)"
 */
export function formatFriendlyDate(dateStr: string): string {
  try {
    const d = parseDate(dateStr);
    const m = d.getMonth() + 1;
    const dateNum = d.getDate();
    const dayName = WEEK_DAYS_ZH[d.getDay()];
    return `${m}月${dateNum}日 (${dayName})`;
  } catch (e) {
    return dateStr;
  }
}

/**
 * Generate dates for 35 or 42 grid cells of a month view calendar
 */
export function generateMonthGrid(year: number, month: number): Date[] {
  // month is 0-indexed (0 = Jan, 5 = Jun)
  const firstDay = new Date(year, month, 1);
  const startDayOfWeek = firstDay.getDay(); // 0 (Sun) to 6 (Sat)
  
  const grid: Date[] = [];
  
  // Backfill previous month days
  const tempDate = new Date(year, month, 1);
  tempDate.setDate(tempDate.getDate() - startDayOfWeek);
  
  // Generate 42 cells (6 weeks)
  for (let i = 0; i < 42; i++) {
    grid.push(new Date(tempDate));
    tempDate.setDate(tempDate.getDate() + 1);
  }
  
  return grid;
}

/**
 * Get color scheme based on data center name
 */
export function getDCBadgeColor(dc: string): string {
  switch (dc) {
    case '繁體中文服':
      return 'bg-amber-900/40 text-amber-300 border-amber-500/20';
    case 'Mana':
      return 'bg-blue-900/40 text-blue-300 border-blue-500/20';
    case 'Elemental':
      return 'bg-emerald-900/40 text-emerald-300 border-emerald-500/20';
    case 'Gaia':
      return 'bg-pink-900/40 text-pink-300 border-pink-500/20';
    case 'Meteor':
      return 'bg-violet-900/40 text-violet-300 border-violet-500/20';
    default:
      return 'bg-zinc-800/40 text-zinc-300 border-zinc-500/20';
  }
}

/**
 * Checks if an event has already ended based on its date, startTime, and endTime (HH:MM)
 */
export function isEventEnded(evt: RPEvent): boolean {
  try {
    const dParts = evt.date.split('-');
    const startParts = evt.startTime.split(':');
    const endParts = evt.endTime.split(':');
    if (dParts.length < 3 || startParts.length < 2 || endParts.length < 2) return false;

    const year = parseInt(dParts[0], 10);
    const month = parseInt(dParts[1], 10) - 1;
    const day = parseInt(dParts[2], 10);
    
    const startH = parseInt(startParts[0], 10);
    const startM = parseInt(startParts[1], 10);
    
    const endH = parseInt(endParts[0], 10);
    const endM = parseInt(endParts[1], 10);

    const eventStart = new Date(year, month, day, startH, startM);
    let eventEnd = new Date(year, month, day, endH, endM);
    
    // If midnight cross (e.g. start at 22:00, end at 02:00)
    if (eventEnd.getTime() < eventStart.getTime()) {
      eventEnd = new Date(eventEnd.getTime() + 24 * 60 * 60 * 1000);
    }
    
    return new Date().getTime() > eventEnd.getTime();
  } catch (e) {
    return false;
  }
}

