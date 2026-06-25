import { Search, Filter, Compass, Sparkles, MapPin, Radio } from 'lucide-react';
import { CalendarFilters, RPCategory, RPEvent } from '../types';
import { CATEGORY_MAP, formatFriendlyDate, getDCBadgeColor, isEventEnded } from '../utils';

interface SidebarFiltersProps {
  filters: CalendarFilters;
  onFiltersChange: (filters: CalendarFilters) => void;
  upcomingEvents: RPEvent[];
  onEventClick: (event: RPEvent) => void;
}

export default function SidebarFilters({
  filters,
  onFiltersChange,
  upcomingEvents,
  onEventClick,
}: SidebarFiltersProps) {
  const dcOptions = ['全部', '鳳凰', '伊弗利特', '迦樓羅', '利維坦', '巴哈姆特', '奧汀', '泰坦'];

  const handleSearchChange = (val: string) => {
    onFiltersChange({ ...filters, searchTerm: val });
  };

  const handleDCChange = (dc: string) => {
    onFiltersChange({ ...filters, datacenter: dc });
  };

  const handleCategoryToggle = (category: string) => {
    onFiltersChange({
      ...filters,
      category: filters.category === category ? 'all' : category,
    });
  };

  return (
    <aside className="w-full lg:w-72 border-r border-border-dark bg-sidebar-bg p-5 flex flex-col gap-6 overflow-y-auto custom-scrollbar">
      {/* Search Input */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-zinc-400 font-sans flex items-center justify-between">
          <span>搜索活動</span>
          <Search className="w-3.5 h-3.5 text-zinc-500" />
        </label>
        <div className="relative">
          <input
            type="text"
            value={filters.searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="輸入主題、接待人、關鍵字..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded border border-border-dark bg-[#1a1a1c] text-zinc-200 placeholder-zinc-500 font-sans focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/20 transition-all"
          />
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-zinc-500" />
        </div>
      </div>

      {/* Server Filter Choice */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-400">
          <Compass className="w-4 h-4 text-gold" />
          <span>活動伺服器 (Server)</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {dcOptions.map((dc) => {
            const isSelected = (filters.datacenter === 'all' && dc === '全部') || filters.datacenter === dc;
            return (
              <button
                key={dc}
                onClick={() => handleDCChange(dc === '全部' ? 'all' : dc)}
                className={`px-2.5 py-1 text-2xs font-medium rounded border transition-all cursor-pointer ${
                  isSelected
                    ? 'border-gold bg-gold/10 text-gold font-semibold'
                    : 'border-border-dark bg-[#1a1a1c] text-zinc-400 hover:text-zinc-200 hover:border-zinc-500'
                }`}
              >
                {dc}
              </button>
            );
          })}
        </div>
      </div>

      {/* RP Categories Pills */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-400">
          <Filter className="w-4 h-4 text-gold" />
          <span>店鋪 / 活動類型</span>
        </div>
        <div className="flex flex-col gap-1.5">
          <button
            onClick={() => handleCategoryToggle('all')}
            className={`flex items-center justify-between w-full p-2.5 text-xs rounded border text-left cursor-pointer transition-all ${
              filters.category === 'all'
                ? 'border-gold text-gold bg-gold/5 font-semibold'
                : 'border-border-dark text-zinc-400 bg-[#1a1a1c] hover:text-zinc-300 hover:bg-zinc-800/40'
            }`}
          >
            <span>✨ 顯示全部類型</span>
          </button>
          
          {Object.entries(CATEGORY_MAP).map(([key, config]) => {
            const isSelected = filters.category === key;
            return (
              <button
                key={key}
                onClick={() => handleCategoryToggle(key)}
                className={`flex items-center justify-between w-full p-2.5 text-xs rounded border text-left cursor-pointer transition-all ${
                  isSelected
                    ? 'border-gold text-gold bg-gold/5 font-semibold'
                    : 'border-border-dark text-zinc-400 bg-[#1a1a1c] hover:text-zinc-300 hover:bg-zinc-800/40'
                }`}
              >
                <span>{config.label}</span>
                {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-gold shadow shadow-gold animate-pulse" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Upcoming events (Hot Events) in 7 days */}
      <div className="flex flex-col gap-2 flex-grow">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-400">
          <Radio className="w-4 h-4 text-[#34a853] animate-pulse" />
          <span>即將來臨 (接下來的活動)</span>
        </div>
        <div className="flex flex-col gap-2 max-h-56 lg:max-h-none overflow-y-auto pr-1">
          {upcomingEvents.length === 0 ? (
            <div className="text-center py-6 border border-border-dark rounded bg-[#131315]">
              <p className="text-2xs text-zinc-500">近期無活動或與篩選不符</p>
            </div>
          ) : (
            upcomingEvents.slice(0, 4).map((evt) => {
              const ended = isEventEnded(evt);
              return (
                <div
                  key={evt.id}
                  onClick={() => onEventClick(evt)}
                  className={`group p-2.5 rounded border transition-all flex flex-col gap-1 text-left cursor-pointer ${
                    ended
                      ? 'border-zinc-800/40 bg-[#141416]/45 opacity-60 hover:opacity-90'
                      : 'border-border-dark bg-[#1a1a1c] hover:border-gold/40 hover:bg-[#1a1a1c]/90'
                  }`}
                >
                  <div className="flex items-center justify-between text-2xs">
                    {ended ? (
                      <span className="px-1 rounded bg-[#101012] border border-zinc-800 text-zinc-600 font-mono text-3xs select-none">
                        已結束
                      </span>
                    ) : (
                      <span className={`px-1 rounded font-mono text-3xs ${getDCBadgeColor(evt.dc)}`}>
                        {evt.dc}-{evt.world}
                      </span>
                    )}
                    <span className={`text-3xs font-mono ${ended ? 'text-zinc-600 line-through' : 'text-zinc-500'}`}>
                      {evt.startTime}
                    </span>
                  </div>
                  <h4 className={`text-xs font-medium truncate transition-colors ${ended ? 'text-zinc-500 line-through decoration-zinc-600' : 'text-zinc-300 group-hover:text-gold'}`}>
                    {evt.title}
                  </h4>
                  <div className="text-3xs text-zinc-500 font-sans font-medium flex items-center justify-between mt-0.5">
                    <span className={ended ? 'text-zinc-600' : 'text-zinc-500'}>{formatFriendlyDate(evt.date)}</span>
                    <span className={`font-mono ${ended ? 'text-zinc-600' : 'text-gold'}`}>
                      {evt.location.housingArea.split(' ')[0]}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </aside>
  );
}
