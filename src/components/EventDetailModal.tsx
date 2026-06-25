import { useState, useEffect } from 'react';
import { X, Clock, MapPin, Sparkles, User, Tag, ExternalLink, Copy, Check, Trash2, Edit, Bell, BellRing } from 'lucide-react';
import { RPEvent } from '../types';
import { getCategoryConfig, formatFriendlyDate } from '../utils';

interface EventDetailModalProps {
  event: RPEvent;
  onClose: () => void;
  onDeleteEvent?: (id: string) => void;
  onEditClick?: (event: RPEvent) => void;
  isFollowed?: boolean;
  onToggleFollow?: (id: string) => void;
  isAdminLoggedIn?: boolean;
}

export default function EventDetailModal({
  event,
  onClose,
  onDeleteEvent,
  onEditClick,
  isFollowed = false,
  onToggleFollow,
  isAdminLoggedIn = false,
}: EventDetailModalProps) {
  const [copied, setCopied] = useState(false);
  const [copiedTeleport, setCopiedTeleport] = useState(false);

  const catConfig = getCategoryConfig(event.category);

  // Countdown calculations
  const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number; seconds: number; isUpcoming: boolean } | null>(null);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const dParts = event.date.split('-');
      const tParts = event.startTime.split(':');
      if (dParts.length < 3 || tParts.length < 2) return null;

      const year = parseInt(dParts[0], 10);
      const month = parseInt(dParts[1], 10) - 1;
      const day = parseInt(dParts[2], 10);
      const hours = parseInt(tParts[0], 10);
      const minutes = parseInt(tParts[1], 10);

      const eventStart = new Date(year, month, day, hours, minutes);
      const now = new Date();
      const difference = eventStart.getTime() - now.getTime();

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / 1000 / 60) % 60);
        const seconds = Math.floor((difference / 1000) % 60);
        return { days, hours, minutes, seconds, isUpcoming: true };
      }
      return { days: 0, hours: 0, minutes: 0, seconds: 0, isUpcoming: false };
    };

    const initial = calculateTimeLeft();
    setTimeLeft(initial);

    if (initial && initial.isUpcoming) {
      const timer = setInterval(() => {
        const next = calculateTimeLeft();
        setTimeLeft(next);
        if (next && !next.isUpcoming) {
          clearInterval(timer);
        }
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [event.date, event.startTime]);

  // Full formatted text for sharing
  const getShareText = () => {
    return `【FF14 TC RP 活動分享】
🌟 活動主題：${event.title}
📅 活動時間：${formatFriendlyDate(event.date)} ${event.startTime} - ${event.endTime}
📍 活動地點：${event.dc} / ${event.world} @ ${event.location.housingArea} 得 ${event.location.ward} 區 ${event.location.plot} 號 ${event.location.roomNumber ? `(${event.location.roomNumber})` : ''}
👤 主辦人：${event.host}
👘 著裝：${event.dressCode}
🏷️ 標籤：${event.tags.map((t) => `#${t}`).join(' ')}
✨ 誠邀您的蒞臨！`;
  };

  const handleCopyShare = async () => {
    try {
      await navigator.clipboard.writeText(getShareText());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  // Chat-ready macro for FF14
  const getTeleportAddress = () => {
    return `${event.dc} [${event.world}] ${event.location.housingArea.split(' ')[0]} ${event.location.ward}區 ${event.location.plot}號 ${event.location.roomNumber ? `(房號:${event.location.roomNumber})` : ''}`;
  };

  const handleCopyTeleport = async () => {
    try {
      await navigator.clipboard.writeText(getTeleportAddress());
      setCopiedTeleport(true);
      setTimeout(() => setCopiedTeleport(false), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0c0c0e]/85 backdrop-blur-sm animate-fade-in">
      {/* Modal Container */}
      <div className="relative w-full max-w-2xl max-h-[85vh] rounded border border-border-dark bg-dark-bg overflow-hidden shadow-2xl flex flex-col text-left">
        {/* Banner Decorative Header */}
        <div className={`h-32 bg-gradient-to-r ${event.bannerGradient} p-6 flex flex-col justify-end relative shrink-0`}>
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-black/45 text-zinc-300 hover:text-white hover:bg-black/60 transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
          
          <div className="flex flex-wrap gap-1.5 mb-1.5">
            <span className="px-2 py-0.5 rounded text-3xs font-extrabold bg-black/50 text-gold border border-gold/20">
              {catConfig.label}
            </span>
            <span className="px-2 py-0.5 rounded text-3xs font-mono font-bold bg-black/50 text-zinc-350 border border-[#2d2d30]">
              {event.dc} · {event.world}
            </span>
          </div>
          <h2 className="text-lg md:text-xl font-bold text-white drop-shadow-md font-sans leading-tight">
            {event.title}
          </h2>
        </div>

        {/* Countdown Timer Banner */}
        {timeLeft && timeLeft.isUpcoming && (
          <div className="bg-[#1c140c] border-b border-amber-500/20 px-6 py-2.5 flex items-center justify-between text-xs font-sans text-amber-300 shrink-0">
            <span className="flex items-center gap-1.5 font-medium">
              <BellRing className="w-3.5 h-3.5 text-amber-500 animate-pulse shrink-0" />
              <span>距離特別企劃開始還有：</span>
            </span>
            <div className="flex items-center gap-1 font-mono text-xs font-extrabold text-amber-400">
              {timeLeft.days > 0 && (
                <>
                  <span className="bg-[#291b0f] px-1.5 py-0.5 rounded border border-amber-500/20">{timeLeft.days}</span>
                  <span className="text-[10px] text-zinc-550 mr-1 font-sans">天</span>
                </>
              )}
              <span className="bg-[#291b0f] px-1.5 py-0.5 rounded border border-amber-500/20 min-w-[20px] text-center">
                {String(timeLeft.hours).padStart(2, '0')}
              </span>
              <span className="text-zinc-650 shrink-0">:</span>
              <span className="bg-[#291b0f] px-1.5 py-0.5 rounded border border-amber-500/20 min-w-[20px] text-center">
                {String(timeLeft.minutes).padStart(2, '0')}
              </span>
              <span className="text-zinc-650 shrink-0">:</span>
              <span className="bg-[#291b0f] px-1.5 py-0.5 rounded border border-amber-500/20 min-w-[20px] text-center animate-pulse">
                {String(timeLeft.seconds).padStart(2, '0')}
              </span>
            </div>
          </div>
        )}

        {/* Modal Main Body Scrollbar */}
        <div className="p-4 md:p-6 flex-grow overflow-y-auto custom-scrollbar flex flex-col gap-6 bg-dark-bg">
          {/* Quick Stats Sidebar-style block */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-panel-bg p-4 rounded border border-border-dark text-xs">
            {/* Row 1: Time */}
            <div className="flex items-center gap-3">
              <div className="p-2 rounded bg-dark-bg border border-border-dark text-gold">
                <Clock className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-zinc-400 font-semibold">活動時間</span>
                <span className="text-zinc-200 mt-0.5 font-mono">
                  {formatFriendlyDate(event.date)} {event.startTime} - {event.endTime}
                </span>
              </div>
            </div>

            {/* Row 2: Location with teleport copy */}
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded bg-dark-bg border border-border-dark text-[#34a853]">
                  <MapPin className="w-4 h-4" />
                </div>
                <div className="flex flex-col">
                  <span className="text-zinc-400 font-semibold">活動地址</span>
                  <span className="text-zinc-200 mt-0.5">
                    {event.location.housingArea} {event.location.ward}區-{event.location.plot}號
                    {event.location.roomNumber && ` (${event.location.roomNumber})`}
                  </span>
                </div>
              </div>
              
              <button
                onClick={handleCopyTeleport}
                className="px-2.5 py-1 rounded bg-[#121214] border border-border-dark text-gold hover:border-gold hover:bg-gold/5 transition-all font-semibold font-mono text-3xs flex items-center gap-1 cursor-pointer shrink-0"
                title="複製遊戲內傳送位址"
              >
                {copiedTeleport ? <Check className="w-3 h-3 text-[#34a853]" /> : <Copy className="w-3 h-3" />}
                <span>{copiedTeleport ? '已複製' : '傳送碼'}</span>
              </button>
            </div>

            {/* Row 3: Host information */}
            <div className="flex items-center gap-3">
              <div className="p-2 rounded bg-dark-bg border border-border-dark text-zinc-350">
                <User className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-zinc-400 font-semibold">店長 / 主辦人</span>
                <span className="text-zinc-200 mt-0.5">{event.host}</span>
              </div>
            </div>

            {/* Row 4: Dress Code */}
            <div className="flex items-center gap-3">
              <div className="p-2 rounded bg-dark-bg border border-border-dark text-gold">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-zinc-400 font-semibold">推薦著裝要求 (Dress Code)</span>
                <span className="text-zinc-200 mt-0.5">{event.dressCode || '無限制'}</span>
              </div>
            </div>
          </div>

          {/* Detailed description */}
          <div className="flex flex-col gap-2">
            <h3 className="text-sm font-bold text-zinc-300 border-l-2 border-gold pl-2">
              活動詳情與公告
            </h3>
            <div className="text-xs text-zinc-400 leading-relaxed font-sans whitespace-pre-wrap bg-panel-bg p-4 rounded border border-border-dark">
              {event.description}
            </div>
          </div>

          {/* Recruitment Text Section */}
          {event.recruitmentText && (
            <div className="rounded border border-border-dark bg-[#1a1a1c]/40 p-4 text-xs">
              <h4 className="font-bold text-gold flex items-center gap-1.5 mb-1.5">
                <Tag className="w-3.5 h-3.5 text-gold" />
                <span>招募公告 (Staff Recruitment)</span>
              </h4>
              <p className="text-zinc-400 leading-relaxed font-sans">{event.recruitmentText}</p>
            </div>
          )}

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {event.tags.map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-1 bg-panel-bg border border-border-dark rounded-full text-xs text-zinc-400"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* Modal Actions Footer */}
        <div className="p-4 bg-panel-bg border-t border-border-dark shrink-0 flex flex-wrap gap-3 items-center justify-between">
          <div className="flex flex-wrap gap-2">
            {/* Follow/Track button */}
            {onToggleFollow && (
              <button
                onClick={() => onToggleFollow(event.id)}
                className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded border transition-all cursor-pointer leading-none ${
                  isFollowed
                    ? 'border-amber-500/35 text-amber-400 bg-amber-500/10 hover:bg-amber-500/15 ring-1 ring-amber-500/10'
                    : 'border-border-dark hover:border-gold text-zinc-300 hover:text-gold bg-[#121214] hover:bg-gold/5'
                }`}
                title="當本場 RP 特別活動起算前 15 分鐘內，我們將向您發出自訂桌面與網頁推播通知"
              >
                {isFollowed ? (
                  <>
                    <BellRing className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                    <span>已追蹤特別活動</span>
                  </>
                ) : (
                  <>
                    <Bell className="w-3.5 h-3.5" />
                    <span>追蹤此活動</span>
                  </>
                )}
              </button>
            )}

            {/* Copy share content */}
            <button
              onClick={handleCopyShare}
              className="flex items-center gap-2 px-4 py-2 text-xs font-bold rounded border border-border-dark hover:border-gold text-zinc-300 hover:text-gold bg-[#121214] hover:bg-gold/5 cursor-pointer leading-none transition-all"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-[#34a853]" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? '已複製分享格式' : '複製分享內容'}</span>
            </button>

            {/* Open Discord connection link if any */}
            {event.discordUrl && (
              <a
                href={event.discordUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded border border-border-dark text-indigo-400 hover:text-indigo-300 hover:bg-indigo-500/10 transition-all bg-[#121214]"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>聯繫 Discord</span>
              </a>
            )}
          </div>

          {/* Manage items (Custom edits/deletions) */}
          <div className="flex gap-2">
            {isAdminLoggedIn && onDeleteEvent && onEditClick && (
              <>
                <button
                  onClick={() => onEditClick(event)}
                  className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded border border-border-dark text-zinc-300 hover:text-gold hover:bg-gold/5 transition-all cursor-pointer"
                >
                  <Edit className="w-3.5 h-3.5" />
                  <span>修改</span>
                </button>
                <button
                  onClick={() => {
                    const ok = window.confirm('確定要下架此活動嗎？這將無法復原。');
                    if (ok) {
                      onDeleteEvent(event.id);
                    }
                  }}
                  className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded border border-red-500/30 text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>下架</span>
                </button>
              </>
            )}
            <button
              onClick={onClose}
              className="px-5 py-2 text-xs font-bold rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-200 transition-colors cursor-pointer"
            >
              關閉
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
