import React from 'react';
import { ShieldAlert, Users, X, Check, Megaphone, ExternalLink } from 'lucide-react';

interface WelcomeModalProps {
  onClose: () => void;
}

export default function WelcomeModal({ onClose }: WelcomeModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark-bg/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-xl rounded-xl border border-border-dark bg-panel-bg p-6 md:p-8 shadow-2xl shadow-black/80 max-h-[90vh] overflow-y-auto custom-scrollbar">
        
        {/* Banner/Header decoration */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-red-600 via-amber-500 to-yellow-400" />

        {/* Top Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 rounded-full bg-gold/10 text-gold shrink-0">
            <Megaphone className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h2 className="text-lg md:text-xl font-bold text-zinc-100 font-display tracking-wide">
              歡迎來到 FFXIV TC RP活動行事曆
            </h2>
            <p className="text-2xs text-gold/80 font-mono tracking-widest uppercase mt-0.5">
              Community Calendar Notice & Disclaimer
            </p>
          </div>
        </div>

        {/* Content Body */}
        <div className="space-y-5 text-sm leading-relaxed text-zinc-300 font-sans">
          
          {/* Shop Announcement Callout */}
          <div className="p-4 rounded-lg bg-gold/5 border border-gold/20 flex gap-3.5">
            <Users className="w-5 h-5 text-gold shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="text-xs font-bold text-gold mb-1">📢 店家活動刊登招募中！</h3>
              <p className="text-xs text-zinc-300 leading-normal">
                本行事曆致力於推廣繁中社群 RP (模擬角色扮演) 的精采生活。
                <strong className="text-zinc-100 font-semibold block mt-1">
                  「若各位店主、活動主辦有即將對外舉辦的公開活動或營運店鋪，十分歡迎隨時與我們維護人員聯絡！」
                </strong>
                我們將代您將活動同步登錄至全球雲端資料庫，讓更多玩家看見！可點擊左下角維護人員<strong> 閻羅@奧汀 </strong>提供資訊。
              </p>
            </div>
          </div>

          {/* Legal Disclaimers */}
          <div className="space-y-3.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-400 select-none">
              <ShieldAlert className="w-4 h-4 text-zinc-500" />
              <span>本站聲明與使用規範 (Disclaimer)</span>
            </div>
            
            <ul className="text-2xs md:text-xs text-zinc-400 space-y-2.5 list-none pl-1">
              <li className="flex items-start gap-2">
                <span className="text-red-500/80 font-mono select-none">1.</span>
                <span>本站僅為社群第三方玩家自發維護的 RP 活動資訊交流平台。行事曆所載之活動內容、時間等資訊，皆由各自主辦方上報提供，其言論與宣傳立場均不代表本站。</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500/80 font-mono select-none">2.</span>
                <span>活動有臨時取消或異動時間之可能，請玩家出發造訪前多加留意該店家之官方社群（如 Threads / Twitter / Discord 等）最新動態。</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500/80 font-mono select-none">3.</span>
                <span>若在參與活動時涉及虛擬遊戲幣交易、私人糾紛或任何爭議，請配合 SQUARE ENIX 遊戲服務協議及官方規範進行，本平台不為參與者之間的個人或商業糾紛承擔任何连带責任。</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500/80 font-mono select-none">4.</span>
                <span>本站使用的《最終幻想XIV》相關遊戲美術資源、美術圖標、宣傳商標版權均屬於 SQUARE ENIX CO., LTD. 所有。</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Action Button Footer */}
        <div className="mt-8 pt-4 border-t border-border-dark flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-2xs text-zinc-500">
          <span>感謝配合，祝您有美好的 RP 旅程！</span>
          <button
            onClick={onClose}
            className="flex items-center justify-center gap-1.5 py-2.5 px-6 rounded-lg bg-gold text-dark-bg font-bold text-xs hover:brightness-115 active:scale-98 transition-all cursor-pointer shadow-lg shadow-gold/10"
          >
            <Check className="w-3.5 h-3.5 stroke-[3]" />
            <span>我已閱讀並同意，進入行事曆</span>
          </button>
        </div>
      </div>
    </div>
  );
}
