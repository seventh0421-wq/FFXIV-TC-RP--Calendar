import React from 'react';
import { X, Calendar, Sparkles, Flame, Heart } from 'lucide-react';

interface ChangelogModalProps {
  onClose: () => void;
}

export default function ChangelogModal({ onClose }: ChangelogModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0c0c0e]/85 backdrop-blur-sm animate-fade-in font-sans text-left">
      <div className="relative w-full max-w-lg rounded border border-border-dark bg-dark-bg overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        
        {/* Banner header resembling the dark gold theme */}
        <div className="p-5 bg-gradient-to-r from-zinc-900 to-zinc-800 border-b border-border-dark flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <div className="p-1 rounded bg-gold/10 text-gold">
              <Sparkles className="w-4 h-4 text-gold" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-zinc-100">特別活動日曆 - 更新日記</h3>
              <p className="text-[10px] text-zinc-500 font-mono mt-0.5">System Update Log & Changelog</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-[#1f1f23] text-zinc-400 hover:text-white transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Changelog Content */}
        <div className="p-6 overflow-y-auto custom-scrollbar flex flex-col gap-6 bg-[#111113]/90 text-xs">
          
          {/* Version 1.4.0 */}
          <div className="flex gap-3 position-relative">
            <div className="flex flex-col items-center">
              <div className="w-6 h-6 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0 font-mono font-bold text-[10px]">
                1.4
              </div>
              <div className="flex-1 w-[1px] bg-border-dark mt-2"></div>
            </div>
            <div className="flex-1 pb-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-bold text-amber-400">v1.4.0 · 追蹤倒數大升級</span>
                <span className="text-[10px] text-zinc-500 font-mono">2026-06-22</span>
              </div>
              <ul className="text-zinc-350 space-y-1.5 list-disc pl-4 leading-relaxed">
                <li>
                  <strong className="text-zinc-200">⌛ 動態時間倒數：</strong>活動詳情頂部新增毫秒級精密動態倒數模組，離派對起算時刻一目了然。
                </li>
                <li>
                  <strong className="text-zinc-200">🔔 全方位訂閱追蹤：</strong>支援一鍵「關注/追蹤」任何感興趣的特別特企活動。
                </li>
                <li>
                  <strong className="text-zinc-200">📢 桌面推播通知：</strong>當追蹤的活動進入 15 分鐘前倒數時，將自動觸發瀏覽器背景系統 Notification 推播。
                </li>
                <li>
                  <strong className="text-zinc-200">🖼️ 精緻內置浮動彈窗：</strong>未開啟桌面權限時，程式內也配備了具有反饋動畫的右下角卡片式即時提示。
                </li>
                <li>
                  <strong className="text-zinc-200">🛡️ 防呆流程與防護設計：</strong>全面修正「建立活動」之擁有權提示（全球公有 vs 本機私有），避免非管理之造訪者產生困惑。
                </li>
              </ul>
            </div>
          </div>

          {/* Version 1.3.0 */}
          <div className="flex gap-3">
            <div className="flex flex-col items-center">
              <div className="w-6 h-6 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center text-gold shrink-0 font-mono font-bold text-[10px]">
                1.3
              </div>
              <div className="flex-1 w-[1px] bg-border-dark mt-2"></div>
            </div>
            <div className="flex-1 pb-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-bold text-zinc-200">v1.3.0 · 雲端實體資料整合</span>
                <span className="text-[10px] text-zinc-500 font-mono">2026-06-21</span>
              </div>
              <ul className="text-zinc-350 space-y-1.5 list-disc pl-4 leading-relaxed">
                <li>
                  <strong className="text-zinc-200">☁️ Firestore 資料庫連線：</strong>完成全球雲端行程即時讀寫。特別大型企劃不再需要本地人為備份，上傳後全伺服器同步。
                </li>
                <li>
                  <strong className="text-zinc-200">🔐 管理者通行認證：</strong>正式啟用管理者專用後台，配置快速通行碼認證保障公有數據安全。
                </li>
              </ul>
            </div>
          </div>

          {/* Version 1.2.0 */}
          <div className="flex gap-3">
            <div className="flex flex-col items-center">
              <div className="w-6 h-6 rounded-full bg-zinc-800 border border-border-dark flex items-center justify-center text-zinc-400 shrink-0 font-mono font-bold text-[10px]">
                1.2
              </div>
              <div className="flex-1 w-[1px] bg-border-dark mt-2"></div>
            </div>
            <div className="flex-1 pb-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-bold text-zinc-300">v1.2.0 · 黑金主控台優化</span>
                <span className="text-[10px] text-zinc-500 font-mono">2026-06-20</span>
              </div>
              <ul className="text-zinc-350 space-y-1.5 list-disc pl-4 leading-relaxed">
                <li>
                  <strong className="text-zinc-200">📅 行事曆三向視角：</strong>重塑月曆視角、週曆精緻視角及大字體 Agenda 條目列，滿足桌機與手機閱讀密度。
                </li>
                <li>
                  <strong className="text-zinc-200">🧪 快速點按空白格：</strong>滑鼠雙擊或於平板上點按空白區域時，可直接精確將該日期裝填至活動起草表單。
                </li>
                <li>
                  <strong className="text-zinc-200">📋 FF14傳送代碼複製：</strong>追加一鍵快取遊戲內 /teleport 可讀字眼至剪貼簿服務。
                </li>
              </ul>
            </div>
          </div>

          {/* Version 1.1.0 */}
          <div className="flex gap-3">
            <div className="flex flex-col items-center">
              <div className="w-6 h-6 rounded-full bg-zinc-900 border border-border-dark/30 flex items-center justify-center text-zinc-500 shrink-0 font-mono font-bold text-[10px]">
                1.1
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-bold text-zinc-400">v1.1.0 · 本地企劃起步</span>
                <span className="text-[10px] text-zinc-500 font-mono">2026-06-18</span>
              </div>
              <ul className="text-zinc-350 list-disc pl-4 leading-relaxed">
                <li>
                  <strong className="text-zinc-200">🛠️ LocalStorage 備餐：</strong>提供本地儲存及自建活動。預埋各大跨區數據中心資料庫。
                </li>
              </ul>
            </div>
          </div>

        </div>

        {/* Footer info showing developer */}
        <div className="p-4 bg-panel-bg border-t border-border-dark flex items-center justify-between text-[11px] text-zinc-500 shrink-0">
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-zinc-600" />
            <span>特別活動日曆專案團隊</span>
          </span>
          <div className="flex items-center gap-1.5">
            <span>Powered with</span>
            <Heart className="w-3 h-3 text-red-500 fill-red-500/20" />
            <span>· 閻羅@奧汀</span>
          </div>
        </div>

      </div>
    </div>
  );
}
