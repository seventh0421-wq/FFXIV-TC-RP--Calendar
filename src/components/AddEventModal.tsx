import { useState, useEffect, FormEvent } from 'react';
import { X, Save, Calendar, Clock, MapPin, Tag, User, HelpCircle } from 'lucide-react';
import { RPEvent, RPCategory } from '../types';
import { DC_WORLDS, CATEGORY_MAP } from '../utils';

interface AddEventModalProps {
  onClose: () => void;
  onSubmit: (event: RPEvent) => void;
  editEvent?: RPEvent | null;
  initialDate?: string; // Quick pre-defined date click action
  isAdminLoggedIn?: boolean;
}

const GRADIENT_PRESETS = [
  { name: '貓與茶葉(翠)', value: 'from-emerald-500 via-teal-600 to-cyan-700' },
  { name: '深夜群星(靛)', value: 'from-purple-900 via-indigo-950 to-slate-900' },
  { name: '櫻火溫泉(粉)', value: 'from-rose-400 via-pink-500 to-red-500' },
  { name: '歌劇帷幕(赤)', value: 'from-amber-600 via-orange-600 to-red-700' },
  { name: '命運星軌(紫)', value: 'from-indigo-600 via-violet-600 to-purple-800' },
  { name: '迷幻電波(絢)', value: 'from-fuchsia-600 via-pink-600 to-violet-600' },
  { name: '四季之鏡(藍)', value: 'from-sky-400 via-blue-500 to-indigo-600' },
  { name: '夏落篝火(金)', value: 'from-orange-400 via-amber-500 to-yellow-500' },
];

const PRESET_TAGS = ['新手友善', '免費招待', '深夜酒吧', '拍照推薦', 'GPose光陰', 'DJ蹦迪', '一對一微RP', '全手動台詞', '海灘烤肉', '不限著裝'];

export default function AddEventModal({
  onClose,
  onSubmit,
  editEvent,
  initialDate,
  isAdminLoggedIn = false,
}: AddEventModalProps) {
  // Form States
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('21:00');
  const [endTime, setEndTime] = useState('23:00');
  const [dc, setDc] = useState('繁體中文服');
  const [world, setWorld] = useState('鳳凰');
  const [housingArea, setHousingArea] = useState('薰衣草苗圃');
  const [ward, setWard] = useState(1);
  const [plot, setPlot] = useState(1);
  const [roomNumber, setRoomNumber] = useState('');
  const [category, setCategory] = useState<string>('bar');
  const [customCategory, setCustomCategory] = useState('');
  const [host, setHost] = useState('');
  const [dressCode, setDressCode] = useState('無限制');
  const [description, setDescription] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [bannerGradient, setBannerGradient] = useState(GRADIENT_PRESETS[0].value);
  const [discordUrl, setDiscordUrl] = useState('');
  const [recruitmentText, setRecruitmentText] = useState('');
  const [isSpecialEventConfirmed, setIsSpecialEventConfirmed] = useState(false);

  // Auto update world options when DC drops down
  const currentWorlds = DC_WORLDS[dc] || [];

  useEffect(() => {
    if (currentWorlds.length > 0) {
      // Find matching index or default to first
      if (!currentWorlds.includes(world)) {
        setWorld(currentWorlds[0]);
      }
    }
  }, [dc]);

  // Set initial data or load editing details
  useEffect(() => {
    if (editEvent) {
      setTitle(editEvent.title);
      setDate(editEvent.date);
      setStartTime(editEvent.startTime);
      setEndTime(editEvent.endTime);
      setDc(editEvent.dc);
      setWorld(editEvent.world);
      setHousingArea(editEvent.location.housingArea);
      setWard(editEvent.location.ward);
      setPlot(editEvent.location.plot);
      setRoomNumber(editEvent.location.roomNumber || '');
      
      const isStd = ['bar', 'cafe', 'club', 'bath', 'performance', 'photo', 'fortune', 'other'].includes(editEvent.category);
      if (isStd) {
        setCategory(editEvent.category);
        setCustomCategory('');
      } else {
        setCategory('custom');
        setCustomCategory(editEvent.category);
      }
      
      setHost(editEvent.host);
      setDressCode(editEvent.dressCode);
      setDescription(editEvent.description);
      setTagsInput(editEvent.tags.join(' '));
      setBannerGradient(editEvent.bannerGradient);
      setDiscordUrl(editEvent.discordUrl || '');
      setRecruitmentText(editEvent.recruitmentText || '');
      setIsSpecialEventConfirmed(true); // Pre-check for existing events
    } else if (initialDate) {
      setDate(initialDate);
      setIsSpecialEventConfirmed(false);
      setCategory('bar');
      setCustomCategory('');
    } else {
      const today = new Date();
      const yr = today.getFullYear();
      const m = String(today.getMonth() + 1).padStart(2, '0');
      const d = String(today.getDate()).padStart(2, '0');
      setDate(`${yr}-${m}-${d}`);
      setIsSpecialEventConfirmed(false);
      setCategory('bar');
      setCustomCategory('');
    }
  }, [editEvent, initialDate]);

  const handlePresetTagClick = (tag: string) => {
    const currentTags = tagsInput.trim().split(/\s+/).filter(Boolean);
    if (currentTags.includes(tag)) {
      // Remove tag
      setTagsInput(currentTags.filter((t) => t !== tag).join(' '));
    } else {
      // Add tag
      setTagsInput([...currentTags, tag].join(' '));
    }
  };

  const handleFormSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !date || !startTime || !endTime || !host.trim() || !description.trim()) {
      alert('請填寫所有必要欄位（標題、日期、時間、主辦人、活動公告描述）');
      return;
    }

    if (category === 'custom' && !customCategory.trim()) {
      alert('請填寫自訂的活動類型！');
      return;
    }

    if (!isSpecialEventConfirmed) {
      alert('請勾選確認此活動為一次性/限定特別活動，而非日常常規營業！');
      return;
    }

    // Split tags
    const parsedTags = tagsInput
      .split(/[\s,，]+/)
      .map((t) => t.trim().replace(/^#/, ''))
      .filter((t) => t.length > 0);

    const eventPayload: RPEvent = {
      id: editEvent ? editEvent.id : `custom-${Date.now()}`,
      title: title.trim(),
      date,
      startTime,
      endTime,
      dc,
      world,
      location: {
        housingArea,
        ward: Number(ward),
        plot: Number(plot),
        roomNumber: roomNumber.trim() || undefined,
      },
      category: category === 'custom' ? customCategory.trim() : category,
      host: host.trim(),
      dressCode: dressCode.trim() || '無限制',
      description: description.trim(),
      tags: parsedTags.length > 5 ? parsedTags.slice(0, 5) : parsedTags,
      bannerGradient,
      discordUrl: discordUrl.trim() || undefined,
      recruitmentText: recruitmentText.trim() || undefined,
      isCustom: true,
    };

    onSubmit(eventPayload);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0c0c0e]/85 backdrop-blur-sm animate-fade-in">
      {/* Modal Container */}
      <form onSubmit={handleFormSubmit} className="relative w-full max-w-2xl max-h-[85vh] rounded border border-border-dark bg-dark-bg overflow-hidden shadow-2xl flex flex-col text-left">
        {/* Header decoration */}
        <div className="p-5 border-b border-border-dark bg-panel-bg shrink-0 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded bg-gold/10 border border-gold/20 text-gold">
              <Calendar className="w-4 h-4" />
            </span>
            <h2 className="text-base font-bold text-zinc-100">
              {editEvent ? '修改已發布活動' : '建立全新 RP 活動'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-zinc-400 hover:text-white hover:bg-zinc-900 rounded-md transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body Scrollbar */}
        <div className="flex-grow overflow-y-auto custom-scrollbar p-4 md:p-6 flex flex-col gap-5 text-zinc-350 bg-dark-bg font-sans">
          
          {/* Special Event Reminder Board */}
          <div className="p-4 rounded border border-amber-500/20 bg-amber-500/5 flex flex-col gap-1.5">
            <span className="text-xs font-bold text-gold flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4 shrink-0 text-gold" />
              <span>本月曆僅受理 RP 特別/限定活動 (Special Events Only)</span>
            </span>
            <p className="text-[11px] text-zinc-300 leading-relaxed font-sans">
              為了維護行事曆的實用度與專注度，<span className="text-gold font-bold">嚴禁刊登常態性、每日日常營業班表</span>。
              本平台專供特定日期之慶典、節日企劃、劇團重大公演、重大開幕及單次主題夜等限時內容使用。
            </p>
            {isAdminLoggedIn ? (
              <span className="text-2xs text-emerald-400 font-semibold bg-emerald-500/10 border border-emerald-500/15 px-2 py-0.5 rounded self-start">
                已登入管理：建立本行程將同步至全球雲端資料庫
              </span>
            ) : (
              <span className="text-2xs text-zinc-400 font-semibold bg-[#121214] border border-border-dark px-2 py-0.5 rounded self-start">
                本機行程：未登入管理者，此行程將僅儲存在您的瀏覽器暫存區
              </span>
            )}
          </div>

          {/* Title */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-zinc-400">
              活動主題名稱 <span className="text-gold">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="例如：【星幕酒吧】深夜微醺酒館 慶祝夏季大會"
              className="w-full px-3.5 py-2 text-xs rounded border border-border-dark bg-[#1a1a1c] placeholder-zinc-550 text-zinc-100 focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/20"
            />
          </div>

          {/* Date & Time Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-zinc-400 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-zinc-500" />
                <span>活動日期 (Date) *</span>
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3.5 py-2 text-xs rounded border border-border-dark bg-[#1a1a1c] text-zinc-100 focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/20"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-zinc-400 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-zinc-500" />
                <span>開始時間 (HH:MM) *</span>
              </label>
              <input
                type="text"
                required
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                placeholder="21:00"
                className="w-full px-3.5 py-2 text-xs rounded border border-border-dark bg-[#1a1a1c] text-zinc-100 focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/20 font-mono"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-zinc-400 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-zinc-500" />
                <span>結束時間 (HH:MM) *</span>
              </label>
              <input
                type="text"
                required
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                placeholder="23:30"
                className="w-full px-3.5 py-2 text-xs rounded border border-border-dark bg-[#1a1a1c] text-zinc-100 focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/20 font-mono"
              />
            </div>
          </div>

          {/* Server / World DC Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-zinc-400">
                數據中心 (DataCenter) *
              </label>
              <select
                value={dc}
                onChange={(e) => setDc(e.target.value)}
                className="w-full px-3.5 py-2 text-xs rounded border border-border-dark bg-[#1a1a1c] text-zinc-100 focus:outline-none focus:border-gold/50"
              >
                {Object.keys(DC_WORLDS).map((d) => (
                  <option key={d} value={d} className="bg-[#121214]">
                    {d}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-zinc-400">
                伺服器 (World) *
              </label>
              <select
                value={world}
                onChange={(e) => setWorld(e.target.value)}
                className="w-full px-3.5 py-2 text-xs rounded border border-border-dark bg-[#1a1a1c] text-zinc-100 focus:outline-none focus:border-gold/50"
              >
                {currentWorlds.map((w) => (
                  <option key={w} value={w} className="bg-[#121214]">
                    {w}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-zinc-400">
                活動類型 (Category) *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2 text-xs rounded border border-border-dark bg-[#1a1a1c] text-zinc-100 focus:outline-none focus:border-gold/50"
              >
                {Object.entries(CATEGORY_MAP).map(([key, config]) => (
                  <option key={key} value={key} className="bg-[#121214]">
                    {config.label}
                  </option>
                ))}
                <option value="custom" className="bg-[#121214]">✍️ 自行輸入活動類型...</option>
              </select>
              {category === 'custom' && (
                <input
                  type="text"
                  placeholder="請輸入自訂的活動類型 (例如: 德州撲克牌局、女僕執事店)"
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value)}
                  maxLength={25}
                  className="mt-1.5 w-full px-3.5 py-2 text-xs rounded border border-border-dark bg-[#121214] text-zinc-100 focus:outline-none focus:border-gold/50"
                  required
                />
              )}
            </div>
          </div>

          {/* Housing Address Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 rounded border border-border-dark bg-[#1a1a1c]/60">
            <div className="flex flex-col gap-1.5 md:col-span-2">
              <label className="text-xs font-bold text-zinc-400 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-zinc-500" />
                <span>居住區名稱 *</span>
              </label>
              <select
                value={housingArea}
                onChange={(e) => setHousingArea(e.target.value)}
                className="w-full px-3.5 py-2 text-xs rounded border border-border-dark bg-[#121214] text-zinc-100 focus:outline-none focus:border-gold/50"
              >
                <option value="薰衣草苗圃" className="bg-[#121214]">薰衣草苗圃 (格里達尼亞)</option>
                <option value="海霧村" className="bg-[#121214]">海霧村 (利姆薩·羅敏薩)</option>
                <option value="高腳孤丘" className="bg-[#121214]">高腳孤丘 (烏爾達哈)</option>
                <option value="白銀鄉" className="bg-[#121214]">白銀鄉 (黃金港)</option>
                <option value="穹頂皓天" className="bg-[#121214]">穹頂皓天 (伊修加德)</option>
                <option value="個人公寓/旅店房間" className="bg-[#121214]">旅店客房 / 個人公寓 / 其他</option>
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-zinc-400">
                門牌 區 (Ward) *
              </label>
              <input
                type="number"
                min="1"
                max="30"
                required
                value={ward}
                onChange={(e) => setWard(Number(e.target.value))}
                className="w-full px-3.5 py-2 text-xs rounded border border-border-dark bg-[#121214] text-zinc-150 focus:outline-none focus:border-gold/50"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-zinc-400">
                號 (Plot / 房號) *
              </label>
              <input
                type="number"
                min="1"
                max="60"
                required
                value={plot}
                onChange={(e) => setPlot(Number(e.target.value))}
                className="w-full px-3.5 py-2 text-xs rounded border border-border-dark bg-[#121214] text-zinc-150 focus:outline-none focus:border-gold/50"
              />
            </div>
            <div className="flex flex-col gap-1.5 md:col-span-4">
              <label className="text-xs font-bold text-zinc-400 flex items-center gap-1.5">
                <span>詳細位置 / 房號 / 樓層 (Room Number)</span>
                <span className="text-3xs text-zinc-500">(選填)</span>
              </label>
              <input
                type="text"
                value={roomNumber}
                onChange={(e) => setRoomNumber(e.target.value)}
                placeholder="例如：1 號房 / 地下重置大室 / 私密包廂"
                className="w-full px-3.5 py-2 text-xs rounded border border-border-dark bg-[#121214] text-zinc-100 focus:outline-none focus:border-gold/50"
              />
            </div>
          </div>

          {/* Social connections & Host details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-zinc-400 flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-zinc-500" />
                <span>店長 / 主辦人名字 *</span>
              </label>
              <input
                type="text"
                required
                value={host}
                onChange={(e) => setHost(e.target.value)}
                placeholder="例如 / Character: Captain Melisandre"
                className="w-full px-3.5 py-2 text-xs rounded border border-border-dark bg-[#1a1a1c] text-zinc-100 focus:outline-none focus:border-gold/50"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-zinc-400 flex items-center gap-1">
                <span>宣傳封面背景主題</span>
              </label>
              <div className="flex flex-wrap gap-1.5 py-1.5">
                {GRADIENT_PRESETS.map((p) => {
                  const isSelected = bannerGradient === p.value;
                  return (
                    <button
                      key={p.name}
                      type="button"
                      onClick={() => setBannerGradient(p.value)}
                      title={p.name}
                      className={`w-6 h-6 rounded-full bg-gradient-to-tr ${
                        p.value
                      } border cursor-pointer relative flex items-center justify-center transition-transform hover:scale-110 ${
                        isSelected ? 'border-gold ring-2 ring-gold/30' : 'border-black/50'
                      }`}
                    >
                      {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Dress code & Discord url */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-zinc-400">
                建議著裝 (Dress Code)
              </label>
              <input
                type="text"
                value={dressCode}
                onChange={(e) => setDressCode(e.target.value)}
                placeholder="休閒大眾裝 / 帥氣皮克服 / 正式西裝... (無限制)"
                className="w-full px-3.5 py-2 text-xs rounded border border-border-dark bg-[#1a1a1c] text-zinc-100 focus:outline-none focus:border-gold/50"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-zinc-400">
                聯絡 Discord / 社群群組網址 
              </label>
              <input
                type="url"
                value={discordUrl}
                onChange={(e) => setDiscordUrl(e.target.value)}
                placeholder="https://discord.gg/your-channel-id (選填)"
                className="w-full px-3.5 py-2 text-xs rounded border border-border-dark bg-[#1a1a1c] text-zinc-100 focus:outline-none focus:border-gold/50"
              />
            </div>
          </div>

          {/* Description details */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-zinc-400">
              活動詳情公告 / 入店指引及餐單 *
            </label>
            <textarea
              required
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="請輸入店內常規特點、營業守則及特色服務等...（可換行分段）"
              className="w-full p-3.5 text-xs rounded border border-border-dark bg-[#1a1a1c] text-zinc-100 focus:outline-none focus:border-gold/50 custom-scrollbar"
            />
          </div>

          {/* Staff Recruitment Details */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-zinc-400">
              人才招募公告 / 後續常駐召收
            </label>
            <textarea
              rows={2}
              value={recruitmentText}
              onChange={(e) => setRecruitmentText(e.target.value)}
              placeholder="例如：目前正在招收晚班女僕侍應兩位、常駐吉他詩人一名。意者請至/tell或透過Discord與我們聯絡！ (選填)"
              className="w-full p-3.5 text-xs rounded border border-border-dark bg-[#1a1a1c] text-zinc-100 focus:outline-none focus:border-gold/50 custom-scrollbar"
            />
          </div>

          {/* Tags list space separated &preset tag helper */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-zinc-400 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5" />
              <span>活動自定義標籤 (請使用空格或逗號隔開最佳，最多 5 個)</span>
            </label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="例如: 輕語RP 新手友善 特調飲品 免費茶點 (勿加#號)"
              className="w-full px-3.5 py-2 text-xs rounded border border-border-dark bg-[#1a1a1c] text-zinc-100 focus:outline-none focus:border-gold/50"
            />
            {/* Presets helpers list */}
            <div className="flex flex-wrap gap-1.5 mt-1">
              {PRESET_TAGS.map((tag) => {
                const currentTags = tagsInput.trim().split(/\s+/).filter(Boolean);
                const isSelected = currentTags.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => handlePresetTagClick(tag)}
                    className={`px-2.5 py-0.5 rounded-full text-3xs font-medium border transition-all cursor-pointer ${
                      isSelected
                        ? 'border-gold bg-gold/10 text-gold font-bold'
                        : 'border-border-dark bg-[#121214] text-zinc-400 hover:text-zinc-200 hover:border-gold/40'
                    }`}
                  >
                    #{tag}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Declaration Checkbox */}
          <div className="mt-2 p-3.5 rounded border border-gold/15 bg-[#121214] flex items-start gap-2.5">
            <input
              type="checkbox"
              id="confirm-special-event"
              required
              checked={isSpecialEventConfirmed}
              onChange={(e) => setIsSpecialEventConfirmed(e.target.checked)}
              className="mt-0.5 rounded border-border-dark bg-[#1a1a1c] text-gold focus:ring-0 cursor-pointer w-4 h-4"
            />
            <label htmlFor="confirm-special-event" className="text-xs text-zinc-300 font-sans leading-relaxed cursor-pointer select-none">
              <span className="text-gold font-bold">我已深知本曆之特別活動刊登規範 *</span>。<br />我確認此非每日重複性或常規不變的常態營業（例如普通酒吧日常班，或常態女僕開門）。本活動確屬特定日期的「特別企劃/演出/派對」。
            </label>
          </div>
        </div>

        {/* Form CTA action footer */}
        <div className="p-4 border-t border-border-dark bg-panel-bg shrink-0 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-200 cursor-pointer"
          >
            取消
          </button>
          <button
            type="submit"
            className="flex items-center gap-2 px-5 py-2 text-xs font-bold rounded-full border border-gold text-gold hover:bg-gold hover:text-dark-bg transition-colors shadow-lg shadow-gold/5 cursor-pointer font-sans active:scale-95"
          >
            <Save className="w-4 h-4" />
            <span>儲存並建立</span>
          </button>
        </div>
      </form>
    </div>
  );
}
