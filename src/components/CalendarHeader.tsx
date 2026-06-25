import { ChevronLeft, ChevronRight, Calendar, Plus, Sparkles, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { CalendarView } from '../types';

interface CalendarHeaderProps {
  currentDate: Date;
  view: CalendarView;
  onViewChange: (view: CalendarView) => void;
  onNavigatePrev: () => void;
  onNavigateNext: () => void;
  onNavigateToday: () => void;
  onAddEventClick: () => void;
  isAdminLoggedIn?: boolean;
  theme: string;
  onThemeChange: (theme: string) => void;
  fontSize: string;
  onFontSizeChange: (size: string) => void;
  desktopSidebarOpen?: boolean;
  onToggleDesktopSidebar?: () => void;
}

export default function CalendarHeader({
  currentDate,
  view,
  onViewChange,
  onNavigatePrev,
  onNavigateNext,
  onNavigateToday,
  onAddEventClick,
  isAdminLoggedIn = false,
  theme,
  onThemeChange,
  fontSize,
  onFontSizeChange,
  desktopSidebarOpen = true,
  onToggleDesktopSidebar,
}: CalendarHeaderProps) {
  const currentYear = currentDate.getFullYear();
  const currentMonthName = `${currentYear}年 ${currentDate.getMonth() + 1}月`;

  return (
    <header className="flex flex-col lg:flex-row lg:items-center lg:justify-between border-b border-border-dark bg-panel-bg px-4 py-3.5 md:px-6 md:py-4 gap-4">
      {/* Brand Logo & Name */}
      <div className="flex items-center gap-3.5 mb-1 lg:mb-0">
        {onToggleDesktopSidebar && (
          <button
            onClick={onToggleDesktopSidebar}
            className="hidden lg:flex p-2 rounded border border-border-dark bg-[#1a1a1c]/80 text-[#DFB15B]/85 hover:text-[#DFB15B] hover:bg-[#202024] hover:border-gold/30 transition-all cursor-pointer shadow-sm active:scale-95 animate-fade-in"
            title={desktopSidebarOpen ? "收起側邊面板" : "展開側邊面板"}
          >
            {desktopSidebarOpen ? (
              <PanelLeftClose className="w-4.5 h-4.5" />
            ) : (
              <PanelLeftOpen className="w-4.5 h-4.5" />
            )}
          </button>
        )}
        <div className="relative flex items-center justify-center w-8.5 h-8.5 rounded bg-gold p-[1px] shadow-md shadow-gold/15 shrink-0">
          <div className="absolute inset-0 bg-[#161619] rounded flex items-center justify-center">
            <Calendar className="w-4 h-4 text-gold animate-pulse" />
          </div>
        </div>
        <div>
          <h1 className="text-lg md:text-xl font-bold tracking-wide text-zinc-100 flex items-center gap-1.5 font-display leading-tight">
            FFXIV TC RP活動行事曆
            <span className="text-[9px] tracking-wider font-mono font-bold uppercase px-1 py-0.2 rounded border border-gold/20 text-gold bg-gold/5 leading-none shrink-0">
              Taiwan
            </span>
          </h1>
          <p className="text-[10px] md:text-[11px] text-zinc-400 font-sans tracking-wide leading-normal">
            不讓你錯過任何有趣好玩的RP活動！
          </p>
        </div>
      </div>

      {/* Date Navigation Block */}
      <div className="flex flex-wrap items-center gap-2.5 mb-1 lg:mb-0">
        <button
          onClick={onNavigateToday}
          className="px-3 md:px-4 py-1.5 bg-gold text-dark-bg font-bold rounded hover:brightness-110 transition-all text-xs md:text-sm cursor-pointer shadow-sm active:scale-95"
        >
          今天
        </button>
        <div className="flex items-center rounded border border-border-dark bg-dark-bg">
          <button
            onClick={onNavigatePrev}
            className="p-1.5 text-zinc-400 hover:text-white transition-colors cursor-pointer"
            title="上一個"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <div className="h-4 w-[1px] bg-border-dark" />
          <button
            onClick={onNavigateNext}
            className="p-1.5 text-zinc-400 hover:text-white transition-colors cursor-pointer"
            title="下一個"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        <span className="text-base md:text-lg font-medium text-zinc-100 tracking-wider ml-1">
          {currentMonthName}
        </span>
      </div>

      {/* Controls & Mode Switches */}
      <div className="flex flex-wrap items-center justify-start sm:justify-between lg:justify-end gap-2.5 self-stretch lg:self-auto w-full lg:w-auto">
        {/* Theme Picker */}
        <div className="flex items-center gap-2 px-2.5 py-1 rounded border border-border-dark bg-[#121214]/65 select-none h-8.5">
          <span className="text-[10px] text-zinc-500 font-sans font-medium uppercase tracking-wider">主題</span>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onThemeChange('theme-black-gold')}
              className={`w-3.5 h-3.5 rounded-full bg-[#DFB15B] border transition-all cursor-pointer hover:scale-110 ${
                theme === 'theme-black-gold' ? 'scale-125 border-zinc-100 ring-2 ring-[#DFB15B]/20' : 'border-zinc-700/60 opacity-60 hover:opacity-100'
              }`}
              title="曜石與奢金 (Black & Gold)"
            />
            <button
              onClick={() => onThemeChange('theme-ocean-crimson')}
              className={`w-3.5 h-3.5 rounded-full bg-[#CC2936] border transition-all cursor-pointer hover:scale-110 ${
                theme === 'theme-ocean-crimson' ? 'scale-125 border-zinc-100 ring-2 ring-[#CC2936]/20' : 'border-zinc-700/60 opacity-60 hover:opacity-100'
              }`}
              title="深海與緋櫻 (Ocean & Crimson)"
            />
            <button
              onClick={() => onThemeChange('theme-sage-terracotta')}
              className={`w-3.5 h-3.5 rounded-full bg-[#F19C79] border transition-all cursor-pointer hover:scale-110 ${
                theme === 'theme-sage-terracotta' ? 'scale-125 border-zinc-100 ring-2 ring-[#F19C79]/20' : 'border-zinc-700/60 opacity-60 hover:opacity-100'
              }`}
              title="松尾與赤陶 (Sage & Terracotta)"
            />
            <button
              onClick={() => onThemeChange('theme-charcoal-lavender')}
              className={`w-3.5 h-3.5 rounded-full bg-[#BFACB5] border transition-all cursor-pointer hover:scale-110 ${
                theme === 'theme-charcoal-lavender' ? 'scale-125 border-zinc-100 ring-2 ring-[#BFACB5]/20' : 'border-zinc-700/60 opacity-60 hover:opacity-100'
              }`}
              title="暮月與闇紫 (Charcoal & Lavender)"
            />
          </div>
        </div>

        {/* Font Size Selector */}
        <div className="flex items-center gap-2 px-2.5 py-1 rounded border border-border-dark bg-[#121214]/65 select-none h-8.5">
          <span className="text-[10px] text-zinc-500 font-sans font-medium uppercase tracking-wider shrink-0">字體</span>
          <select
            value={fontSize}
            onChange={(e) => onFontSizeChange(e.target.value)}
            className="bg-transparent text-xs text-zinc-300 border-none outline-none focus:ring-0 cursor-pointer font-sans pr-1"
          >
            <option value="12px" className="bg-panel-bg text-zinc-200">小 (12px)</option>
            <option value="16px" className="bg-panel-bg text-zinc-200">中 (16px)</option>
            <option value="20px" className="bg-panel-bg text-zinc-200">大 (20px)</option>
            <option value="24px" className="bg-panel-bg text-zinc-200">特大 (24px)</option>
          </select>
        </div>

        <div className="flex p-0.5 rounded border border-border-dark bg-[#121214] text-xs h-8.5 items-center">
          {(['month', 'week', 'agenda'] as CalendarView[]).map((v) => {
            const labelMap = { month: '月', week: '週', agenda: '清單' };
            const isActive = view === v;
            return (
              <button
                key={v}
                onClick={() => onViewChange(v)}
                className={`px-2.5 py-1 rounded-sm font-medium transition-all cursor-pointer ${
                  isActive
                    ? 'bg-gold text-dark-bg font-bold shadow-md shadow-gold/10'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {labelMap[v]}
              </button>
            );
          })}
        </div>

        {isAdminLoggedIn && (
          <div className="flex flex-col md:items-end gap-1 shrink-0">
            <button
              onClick={onAddEventClick}
              className="flex items-center justify-center gap-1.5 py-2 px-4 rounded-full border border-gold text-gold hover:bg-gold hover:text-dark-bg transition-colors shadow-lg shadow-gold/5 cursor-pointer font-bold font-sans text-xs active:scale-95 w-full md:w-auto"
            >
              <Plus className="w-3.5 h-3.5 stroke-[3]" />
              <span>建立 RP 活動</span>
            </button>
            <span className="text-[10px] text-emerald-400 font-semibold font-sans text-right select-none leading-normal max-w-[300px] md:max-w-none">
              ● 已登入管理者：此活動將同步發布至全球雲端資料庫
            </span>
          </div>
        )}
      </div>
    </header>
  );
}
