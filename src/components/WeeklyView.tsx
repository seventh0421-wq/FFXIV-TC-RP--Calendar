import { CalendarDays, MapPin } from 'lucide-react';
import { RPEvent } from '../types';
import { getCategoryConfig, formatDateString, formatFriendlyDate, getDCBadgeColor, WEEK_DAYS_ZH, isEventEnded } from '../utils';

interface WeeklyViewProps {
  currentDate: Date;
  events: RPEvent[];
  onEventClick: (event: RPEvent) => void;
  onDayClick: (dateStr: string) => void;
}

export default function WeeklyView({
  currentDate,
  events,
  onEventClick,
  onDayClick,
}: WeeklyViewProps) {
  // Calculate start of the week (Sunday)
  const sunday = new Date(currentDate);
  sunday.setDate(currentDate.getDate() - currentDate.getDay());

  // Generate 7 days of the week starting from Sunday
  const daysOfWeek: Date[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(sunday);
    d.setDate(sunday.getDate() + i);
    daysOfWeek.push(d);
  }

  const todayStr = formatDateString(new Date());

  const getEventsForDay = (date: Date) => {
    const formatted = formatDateString(date);
    return events
      .filter((evt) => evt.date === formatted)
      .sort((a, b) => a.startTime.localeCompare(b.startTime));
  };

  return (
    <div className="flex-grow flex flex-col bg-dark-bg p-4 border-t border-border-dark overflow-auto custom-scrollbar">
      {/* 7 Columns Container */}
      <div className="flex gap-3.5 min-w-[900px] h-full flex-grow items-stretch pb-1">
        {daysOfWeek.map((day, idx) => {
          const dayStr = formatDateString(day);
          const dayEvents = getEventsForDay(day);
          const isToday = dayStr === todayStr;
          const isWeekend = idx === 0 || idx === 6;

          return (
            <div
              key={idx}
              className={`flex-1 min-w-[120px] rounded border flex flex-col transition-all overflow-hidden ${
                isToday
                  ? 'border-gold bg-[#121214] shadow-lg shadow-gold/5'
                  : 'border-border-dark bg-[#121214]/60'
              }`}
            >
              {/* Day Header */}
              <div
                onClick={() => onDayClick(dayStr)}
                className={`p-3 text-center cursor-pointer transition-all border-b flex flex-col gap-0.5 select-none ${
                  isToday
                    ? 'bg-gold/10 border-gold/20 text-gold'
                    : 'bg-panel-bg border-border-dark text-zinc-300 hover:bg-border-dark'
                }`}
              >
                <span className={`text-[11px] font-bold ${isWeekend ? 'text-gold' : 'text-zinc-400'}`}>
                  {WEEK_DAYS_ZH[day.getDay()]}
                </span>
                <span className="text-xl font-extrabold tracking-wider font-sans">
                  {day.getDate()}
                </span>
                <span className="text-[10px] text-zinc-500 truncate">
                  {day.getMonth() + 1}月
                </span>
              </div>

              {/* Day Events Column List */}
              <div className="flex-grow p-2.5 flex flex-col gap-2 overflow-y-auto max-h-[500px] custom-scrollbar bg-[#0c0c0e]/40">
                {dayEvents.length === 0 ? (
                  <div className="flex-grow flex flex-col items-center justify-center py-10 opacity-40">
                    <CalendarDays className="w-5 h-5 text-zinc-650 mb-1.5" />
                    <span className="text-[10px] text-zinc-550 text-center select-none">
                      本日無排程
                    </span>
                    <button
                      onClick={() => onDayClick(dayStr)}
                      className="text-[10px] text-gold hover:underline mt-1.5 font-semibold cursor-pointer"
                    >
                      + 點擊發布
                    </button>
                  </div>
                ) : (
                  dayEvents.map((evt) => {
                    const catConfig = getCategoryConfig(evt.category);
                    const ended = isEventEnded(evt);
                    return (
                      <div
                        key={evt.id}
                        onClick={() => onEventClick(evt)}
                        className={`p-2.5 rounded border text-left cursor-pointer transition-all hover:scale-[1.02] flex flex-col gap-1.5 relative ${
                          ended
                            ? 'border-zinc-805/40 text-zinc-500 bg-[#161618]/30 opacity-55 hover:opacity-85'
                            : catConfig.colorClass
                        }`}
                      >
                        <div className="flex items-center justify-between text-[10px]">
                          <span className={`font-mono font-bold tracking-wider ${ended ? 'text-zinc-600 line-through' : 'opacity-90'}`}>
                            {evt.startTime}
                          </span>
                          {ended ? (
                            <span className="px-1 py-0.5 rounded-sm text-[8px] leading-none bg-zinc-950/45 text-zinc-500 border border-zinc-800/80 font-medium scale-90 origin-right select-none">
                              已結束
                            </span>
                          ) : (
                            <span className={`px-1 rounded-sm text-3xs font-mono scale-90 origin-right ${getDCBadgeColor(evt.dc)}`}>
                              {evt.world}
                            </span>
                          )}
                        </div>
                        <h4 className={`text-xs font-bold leading-snug line-clamp-2 ${ended ? 'text-zinc-550 line-through decoration-zinc-650' : 'text-zinc-200'}`}>
                          {(() => {
                            const match = evt.title.match(/【(.*?)】/);
                            return match && match[1] ? match[1].trim() : evt.title;
                          })()}
                        </h4>
                        <div className="flex items-center gap-1 mt-0.5">
                          <MapPin className="w-2.5 h-2.5 text-zinc-500 shrink-0" />
                          <span className={`text-[10px] truncate max-w-[80px] ${ended ? 'text-zinc-600' : 'text-zinc-400'}`}>
                            {evt.location.housingArea.split(' ')[0]}
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
