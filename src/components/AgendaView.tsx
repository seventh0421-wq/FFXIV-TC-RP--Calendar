import { Calendar, Clock, MapPin, Tag, User, Sparkles } from 'lucide-react';
import { RPEvent } from '../types';
import { getCategoryConfig, formatFriendlyDate, getDCBadgeColor, WEEK_DAYS_ZH, isEventEnded } from '../utils';

interface AgendaViewProps {
  currentDate: Date;
  events: RPEvent[];
  onEventClick: (event: RPEvent) => void;
}

export default function AgendaView({
  currentDate,
  events,
  onEventClick,
}: AgendaViewProps) {
  // Group events by date
  // We want to list all matching events chronologically
  const sortedEvents = [...events].sort((a, b) => {
    const dateCompare = a.date.localeCompare(b.date);
    if (dateCompare !== 0) return dateCompare;
    return a.startTime.localeCompare(b.startTime);
  });

  // Grouped by date map: { "2026-06-21": [event1, event2] }
  const groups: Record<string, RPEvent[]> = {};
  sortedEvents.forEach((evt) => {
    if (!groups[evt.date]) {
      groups[evt.date] = [];
    }
    groups[evt.date].push(evt);
  });

  const groupKeys = Object.keys(groups).sort(); // Sort dates ascending YYYY-MM-DD

  return (
    <div className="flex-grow bg-dark-bg p-4 md:p-6 border-t border-border-dark overflow-y-auto custom-scrollbar">
      {groupKeys.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Calendar className="w-16 h-16 text-zinc-800 stroke-[1.5] mb-4" />
          <h3 className="text-lg font-bold text-zinc-300">目前沒有符合篩選的活動</h3>
          <p className="text-xs text-zinc-500 mt-1 max-w-sm">
            請嘗試調整左側的尋找條件，或者點擊右上角的「建立 RP 活動」按鈕，為大家舉辦一場精彩的 RP 盛會吧！
          </p>
        </div>
      ) : (
        <div className="max-w-4xl mx-auto flex flex-col gap-8">
          {groupKeys.map((dateStr) => {
            const dateEvents = groups[dateStr];
            const [y, m, d] = dateStr.split('-');
            const dateObj = new Date(Number(y), Number(m) - 1, Number(d));
            const dayOfWeek = WEEK_DAYS_ZH[dateObj.getDay()];

            return (
              <div key={dateStr} className="flex flex-col md:flex-row gap-4 border-b border-border-dark pb-6 last:border-none">
                {/* Date Header Column */}
                <div className="flex md:flex-col md:items-end items-center gap-2 md:w-32 shrink-0 select-none">
                  <div className="text-3xl font-extrabold text-[#d4af37] font-mono tracking-wider">
                    {d}
                  </div>
                  <div className="flex md:flex-col items-baseline md:items-end gap-1.5">
                    <span className="text-sm font-bold text-zinc-200">
                      {dayOfWeek}
                    </span>
                    <span className="text-2xs text-zinc-500">
                      {y}年{Number(m)}月
                    </span>
                  </div>
                </div>

                {/* Day events cards timeline */}
                <div className="flex-grow flex flex-col gap-4">
                  {dateEvents.map((evt) => {
                    const catConfig = getCategoryConfig(evt.category);
                    const ended = isEventEnded(evt);
                    return (
                      <div
                        key={evt.id}
                        onClick={() => onEventClick(evt)}
                        className={`group flex flex-col lg:flex-row justify-between items-start gap-4 p-5 rounded border transition-all cursor-pointer shadow-sm relative overflow-hidden ${
                          ended
                            ? 'border-zinc-850 bg-[#121214]/40 opacity-60 hover:opacity-90'
                            : 'border-border-dark bg-[#1a1a1c]/60 hover:border-gold/50 hover:bg-[#1a1a1c]'
                        }`}
                      >
                        {/* Event Left Content */}
                        <div className="flex-grow flex flex-col gap-2 max-w-2xl text-left">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className={`px-2 py-0.5 rounded text-3xs font-bold ${ended ? 'bg-zinc-900 border border-zinc-800/80 text-zinc-500 line-through' : catConfig.colorClass}`}>
                              {catConfig.label}
                            </span>
                            <span className={`px-2 py-0.5 rounded text-3xs font-mono font-medium border ${ended ? 'bg-zinc-950/20 text-zinc-500 border-zinc-800/80' : getDCBadgeColor(evt.dc)}`}>
                              {evt.dc} · {evt.world}
                            </span>
                            {ended ? (
                              <span className="px-1.5 py-0.5 rounded text-3xs font-black bg-zinc-950/55 text-zinc-600 border border-zinc-800/80 leading-none select-none">
                                已結束
                              </span>
                            ) : evt.isCustom ? (
                              <span className="px-1.5 py-0.5 rounded text-3xs font-semibold bg-gold/10 border border-gold/25 text-gold">
                                我的發布
                              </span>
                            ) : null}
                          </div>

                          <h3 className={`text-base font-bold transition-colors ${ended ? 'text-zinc-500 line-through decoration-zinc-600' : 'text-zinc-100 group-hover:text-gold'}`}>
                            {evt.title}
                          </h3>

                          {/* Quick Info Grid */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-xs text-zinc-450 mt-1">
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4 text-zinc-500 shrink-0" />
                              <span className={`font-mono ${ended ? 'line-through text-zinc-650' : ''}`}>{evt.startTime} - {evt.endTime}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin className="w-4 h-4 text-zinc-500 shrink-0" />
                              <span className={`font-sans truncate ${ended ? 'text-zinc-550' : 'text-zinc-300'}`}>
                                {evt.location.housingArea} 得 {evt.location.ward} 區 {evt.location.plot} 號 {evt.location.roomNumber && `(${evt.location.roomNumber})`}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <User className="w-4 h-4 text-zinc-500 shrink-0" />
                              <span className={ended ? 'text-zinc-550' : ''}>主辦方：{evt.host}</span>
                            </div>
                            {evt.dressCode && (
                              <div className="flex items-center gap-2">
                                <Sparkles className="w-4 h-4 text-gold shrink-0" />
                                <span className={`truncate ${ended ? 'text-zinc-550' : 'text-zinc-300'}`}>著裝要求：{evt.dressCode}</span>
                              </div>
                            )}
                          </div>

                          {/* Snippet Description */}
                          <p className={`text-xs line-clamp-2 mt-1 leading-relaxed ${ended ? 'text-zinc-600' : 'text-zinc-500'}`}>
                            {evt.description.replace(/[#*`]/g, '')}
                          </p>

                          {/* Tags */}
                          <div className="flex flex-wrap gap-1.5 mt-2">
                            {evt.tags.map((tag) => (
                              <span
                                key={tag}
                                className={`px-2 py-0.5 rounded-full text-3xs border ${ended ? 'text-zinc-600 bg-[#121214] border-zinc-800' : 'text-zinc-450 bg-[#121214] border-border-dark'}`}
                              >
                                #{tag}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Right Decorative/CTAs Column */}
                        <div className="self-end lg:self-center shrink-0 w-full lg:w-auto">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onEventClick(evt);
                            }}
                            className={`w-full lg:w-auto px-4 py-2 text-xs font-bold rounded border transition-all text-center cursor-pointer ${
                              ended
                                ? 'border-[#1a1a1c] text-zinc-500 hover:text-zinc-450 bg-[#121214] hover:bg-[#161618]'
                                : 'border-border-dark hover:border-gold text-zinc-350 hover:text-gold bg-dark-bg hover:bg-gold/5'
                            }`}
                          >
                            詳情摘要
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
