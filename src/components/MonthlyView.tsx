import { formatFriendlyDate, generateMonthGrid, getDCBadgeColor, getCategoryConfig, formatDateString, isEventEnded } from '../utils';
import { RPEvent } from '../types';

interface MonthlyViewProps {
  currentDate: Date;
  events: RPEvent[];
  onEventClick: (event: RPEvent) => void;
  onDayClick: (dateStr: string) => void;
}

export default function MonthlyView({
  currentDate,
  events,
  onEventClick,
  onDayClick,
}: MonthlyViewProps) {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const daysGrid = generateMonthGrid(year, month);
  const weekDays = ['日', '一', '二', '三', '四', '五', '六'];

  // Current today reference
  const todayStr = formatDateString(new Date());

  // Filter events by specific day string YYYY-MM-DD
  const getEventsForDay = (date: Date) => {
    const formatted = formatDateString(date);
    return events.filter((evt) => evt.date === formatted);
  };

  return (
    <div className="flex-grow flex flex-col bg-dark-bg font-sans border-t border-border-dark overflow-auto custom-scrollbar">
      <div className="min-w-[700px] lg:min-w-0 flex-grow flex flex-col">
        {/* Week Header */}
        <div className="grid grid-cols-7 border-b border-border-dark bg-panel-bg text-center py-2.5 shrink-0">
          {weekDays.map((d, idx) => {
            const isWeekend = idx === 0 || idx === 6;
            return (
              <span
                key={idx}
                className={`text-xs font-bold font-sans tracking-widest uppercase ${
                  isWeekend ? 'text-gold' : 'text-[#808080]'
                }`}
              >
                週{d}
              </span>
            );
          })}
        </div>

        {/* Days Grid */}
        <div className="grid grid-cols-7 grid-rows-6 flex-grow border-b border-r border-border-dark">
          {daysGrid.map((date, idx) => {
            const isCurrentMonth = date.getMonth() === month;
            const dayEvents = getEventsForDay(date);
            const isToday = formatDateString(date) === todayStr;
            const dateStr = formatDateString(date);

            return (
              <div
                key={idx}
                className={`min-h-[70px] lg:min-h-[100px] border-l border-t border-border-dark p-1.5 flex flex-col transition-all relative group/cell ${
                  isCurrentMonth ? 'bg-dark-bg' : 'bg-dark-bg/20 opacity-40'
                } hover:bg-panel-bg/40`}
              >
                {/* Day Number Row */}
                <div className="flex items-center justify-between mb-1">
                  <button
                    onClick={() => onDayClick(dateStr)}
                    className={`w-6 h-6 flex items-center justify-center text-xs font-bold rounded-full transition-all cursor-pointer ${
                      isToday
                        ? 'bg-gold text-[#0c0c0e] font-extrabold shadow shadow-gold/40'
                        : isCurrentMonth
                        ? 'text-zinc-300 hover:bg-border-dark'
                        : 'text-zinc-650'
                    }`}
                  >
                    {date.getDate()}
                  </button>

                  {/* Secret add event hovering indicator (+ sign) */}
                  <button
                     onClick={(e) => {
                       e.stopPropagation();
                       onDayClick(dateStr);
                     }}
                    className="opacity-0 group-hover/cell:opacity-100 p-0.5 text-zinc-500 hover:text-gold transition-opacity cursor-pointer duration-150 rounded"
                    title="在此日期發布活動"
                  >
                    <span className="text-sm font-semibold">+</span>
                  </button>
                </div>

                {/* Day Events Chips List */}
                <div className="flex-grow flex flex-col gap-1 overflow-y-auto max-h-[70px] lg:max-h-[110px] custom-scrollbar">
                  {dayEvents.slice(0, 3).map((evt) => {
                    const catConfig = getCategoryConfig(evt.category);
                    const ended = isEventEnded(evt);
                    return (
                      <button
                        key={evt.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          onEventClick(evt);
                        }}
                        className={`w-full text-left text-2xs px-1.5 py-0.5 rounded border leading-tight truncate transition-all cursor-pointer flex items-center gap-1 hover:brightness-110 ${
                          ended
                            ? 'border-zinc-800/40 text-zinc-500 bg-[#161618]/30 opacity-50 line-through decoration-zinc-600'
                            : catConfig.colorClass
                        }`}
                        title={`${evt.startTime} ${evt.title}${ended ? ' (已結束)' : ''}`}
                      >
                        <span className={`font-mono text-3xs font-semibold shrink-0 ${ended ? 'text-zinc-600' : 'opacity-85'}`}>
                          {evt.startTime}
                        </span>
                        <span className={`truncate flex-grow font-sans font-medium ${ended ? 'text-zinc-550' : 'text-zinc-200'}`}>
                          {(() => {
                            const match = evt.title.match(/【(.*?)】/);
                            return match && match[1] ? match[1].trim() : evt.title;
                          })()}
                        </span>
                      </button>
                    );
                  })}
                  {dayEvents.length > 3 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDayClick(dateStr);
                      }}
                      className="text-[9px] text-zinc-500 hover:text-gold font-bold px-1.5 py-0.5 text-left transition-colors cursor-pointer"
                    >
                      還有 {dayEvents.length - 3} 個活動...
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
