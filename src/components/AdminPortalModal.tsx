import React, { useState, useEffect, FormEvent } from 'react';
import { 
  X, 
  Lock, 
  Unlock, 
  User, 
  Mail, 
  Key, 
  LogOut, 
  Database, 
  Calendar, 
  Edit, 
  Trash2, 
  Plus, 
  AlertTriangle, 
  Check, 
  RefreshCw,
  Sparkles,
  Info
} from 'lucide-react';
import { 
  auth, 
  seedSampleEventsInFirestore, 
  fetchEventsFromFirestore, 
  deleteEventFromFirestore 
} from '../lib/firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut,
  User as FirebaseUser 
} from 'firebase/auth';
import { RPEvent } from '../types';
import { SAMPLE_EVENTS } from '../data/sampleEvents';
import { CATEGORY_MAP, formatFriendlyDate, getCategoryConfig } from '../utils';

interface AdminPortalModalProps {
  onClose: () => void;
  onRefreshEvents: () => Promise<void>;
  events: RPEvent[];
  onEditClick: (event: RPEvent) => void;
  onAddEventClick: () => void;
}

export default function AdminPortalModal({
  onClose,
  onRefreshEvents,
  events,
  onEditClick,
  onAddEventClick,
}: AdminPortalModalProps) {
  // Auth state
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Syncing / seeding states
  const [syncLoading, setSyncLoading] = useState(false);

  // Monitor auth state on component mount
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
      setError(null);
    });
    return unsubscribe;
  }, []);

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedPasscode = passcode.trim();
    if (!trimmedPasscode) {
      setError('請輸入管理者密碼！');
      return;
    }

    if (trimmedPasscode !== '7736') {
      setError('輸入錯誤');
      return;
    }

    setError(null);
    setAuthLoading(true);

    const adminEmail = 'seventh0421@gmail.com';
    const adminPasswordSecure = 'admin_7736_custom_secret';

    try {
      // Attempt to sign in
      await signInWithEmailAndPassword(auth, adminEmail, adminPasswordSecure);
      setStatusMessage('管理者驗證成功，歡迎回來！');
      setPasscode('');
      await onRefreshEvents();
    } catch (err: any) {
      console.log('SignIn failed, attempting to auto-provision account for first-time use...', err);
      // If user doesn't exist, auto-provision and register transparently
      if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-login-credentials' || err.code === 'auth/cannot-find-user' || err.code === 'auth/invalid-credential') {
        try {
          await createUserWithEmailAndPassword(auth, adminEmail, adminPasswordSecure);
          setStatusMessage('管理者帳號初始化並首次驗證登入成功！');
          setPasscode('');
          await onRefreshEvents();
        } catch (regErr: any) {
          console.error('Auto registry failed', regErr);
          setError(`認證失敗：${regErr.message || '無法建立管理者權限，請確認網路與 Firebase 功能'}`);
        }
      } else {
        setError(err.message || '認證失敗，請檢查網路連線。');
      }
    } finally {
      setAuthLoading(false);
      setTimeout(() => setStatusMessage(null), 3500);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setStatusMessage('已登出管理者帳號。');
      await onRefreshEvents();
    } catch (err) {
      console.error('Signout error', err);
    } finally {
      setTimeout(() => setStatusMessage(null), 3000);
    }
  };

  // Seed sample events to database
  const handleSeedDatabase = async () => {
    if (!currentUser) return;
    setSyncLoading(true);
    setStatusMessage('正在初始化並寫入預設特別活動範本...');
    try {
      await seedSampleEventsInFirestore(SAMPLE_EVENTS);
      setStatusMessage('範本特別活動載入成功！');
      await onRefreshEvents();
    } catch (err: any) {
      setError(`載入失敗：${err.message || err}`);
    } finally {
      setSyncLoading(false);
      setTimeout(() => setStatusMessage(null), 4000);
    }
  };

  // Delete event handler
  const handleDeleteEvent = async (id: string, title: string) => {
    if (!window.confirm(`確定下架並在全球刪除此特別活動嗎？\n活動主題：${title}`)) {
      return;
    }
    setSyncLoading(true);
    try {
      await deleteEventFromFirestore(id);
      setStatusMessage('活動已下架刪除！');
      await onRefreshEvents();
    } catch (err: any) {
      setError(`刪除失敗：${err.message || err}`);
      setTimeout(() => setError(null), 4000);
    } finally {
      setSyncLoading(false);
      setTimeout(() => setStatusMessage(null), 3000);
    }
  };

  // Filter local vs global events
  const globalEvents = events.filter(e => !e.isCustom || e.id.length > 20 || e.id.startsWith('sample') === false);
  const localEvents = events.filter(e => e.isCustom && e.id.length <= 15);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0c0c0e]/85 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-4xl rounded border border-border-dark bg-dark-bg overflow-hidden shadow-2xl flex flex-col text-left h-[85vh]">
        {/* Header decoration */}
        <div className="p-5 border-b border-border-dark bg-panel-bg shrink-0 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded bg-gold/10 border border-gold/20 text-gold">
              <Database className="w-4 h-4" />
            </span>
            <div>
              <h2 className="text-base font-bold text-zinc-100 flex items-center gap-1.5">
                FF14 RP 行事曆管理者後台
                {currentUser && (
                  <span className="text-3xs font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 font-normal">
                    已認證
                  </span>
                )}
              </h2>
              <p className="text-3xs text-zinc-400">登錄與編輯全球玩家可見的主題與特別活動</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Main Area */}
        <div className="flex-grow overflow-y-auto p-6 md:p-8 custom-scrollbar bg-dark-bg flex flex-col gap-6">
          {/* Status Message Prompt */}
          {statusMessage && (
            <div className="p-3 bg-gold/10 border border-gold/30 text-gold text-xs rounded font-medium animate-pulse flex items-center gap-2">
              <Sparkles className="w-4 h-4 shrink-0 text-gold" />
              <span>{statusMessage}</span>
            </div>
          )}

          {/* Error Prompt */}
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-400 text-xs rounded font-medium flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          {/* 1. Auth Guard and Status */}
          {!currentUser ? (
            <div className="max-w-md mx-auto w-full py-10 flex flex-col gap-6 font-sans">
              <div className="text-center flex flex-col items-center gap-2">
                <div className="p-3 rounded-full bg-gold/10 border border-gold/20 text-gold mb-2">
                  <Lock className="w-6 h-6 stroke-[1.5]" />
                </div>
                <h3 className="text-base font-bold text-zinc-100">管理認證中心</h3>
                <p className="text-xs text-zinc-400 max-w-sm leading-relaxed">
                  本系統專供 RP 企劃特別活動。請輸入您設定的專用 4 位數碼更新與同步全球網際網路月曆。
                </p>
              </div>

              {/* Login / Setup Form */}
              <form onSubmit={handleAuthSubmit} className="flex flex-col gap-4 p-5 rounded border border-border-dark bg-panel-bg">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold text-zinc-400 flex items-center gap-1">
                    <Key className="w-3.5 h-3.5 text-zinc-500" />
                    <span>管理者 4 位數密碼 (Passcode)</span>
                  </label>
                  <input
                    type="password"
                    required
                    value={passcode}
                    onChange={(e) => setPasscode(e.target.value)}
                    placeholder="請輸入４位數密碼"
                    maxLength={10}
                    className="w-full px-3 py-2.5 text-center text-sm tracking-widest font-mono rounded border border-border-dark bg-[#1a1a1c] text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-gold/50"
                  />
                </div>

                <button
                  type="submit"
                  disabled={authLoading}
                  className="w-full py-2.5 mt-2 bg-gradient-to-r from-amber-500 to-yellow-400 text-zinc-950 font-bold rounded-full cursor-pointer hover:brightness-110 active:scale-95 transition-all text-sm flex items-center justify-center gap-1.5 shadow"
                >
                  {authLoading ? (
                    <RefreshCw className="w-4 h-4 animate-spin text-zinc-950" />
                  ) : (
                    <>
                      <Unlock className="w-3.5 h-3.5 text-zinc-950" />
                      <span>驗證並登入後台</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              {/* Logged In Info Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded border border-border-dark bg-panel-bg">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-gold/10 border border-gold/20 text-gold">
                    <User className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-zinc-200">管理者帳號：{currentUser.email}</h4>
                    <p className="text-[10px] text-zinc-400">您對此日曆站點具有全球廣播與覆寫編輯權限</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleSignOut}
                    className="flex items-center gap-1.5 px-3 py-1.5 border border-red-500/20 hover:border-red-500/40 text-red-400 hover:bg-red-500/5 rounded text-2xs font-bold font-sans cursor-pointer transition-all"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>登出管理</span>
                  </button>
                </div>
              </div>

              {/* Crucial Instructions Banner */}
              <div className="p-4 rounded bg-amber-500/5 border border-gold/15 flex flex-col gap-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-gold">
                  <AlertTriangle className="w-4 h-4" />
                  <span>嚴正規定與守則：禁止刊登常態營業 (No Regular Business Hours Allowed)</span>
                </div>
                <p className="text-2xs text-zinc-300 leading-relaxed font-sans">
                  本系統專為 RP 社群中具備主題性、時效性、一次性企劃的{' '}
                  <span className="text-gold font-bold">「特別活動 (Special Events)」</span>{' '}
                  而設。例如：週年主題派對、特色舞台劇公演、聖誕聯歡派對等。
                  <strong className="text-red-400 font-bold block mt-1.5">
                    ❌ 請勿在此平台發布非特企的常規/常規日常班表營業！(例如：常態每週五營業酒吧、常態每晚咖啡廳接待)。為維持日曆的純淨度及特別事件的醒目度，如有發現常規營業班表一律會被管理人員下架！
                  </strong>
                </p>
              </div>

              {/* Data Sync & Seed Utils */}
              <div className="flex flex-wrap gap-3 items-center justify-between">
                <div className="text-xs text-zinc-400 flex items-center gap-1.5">
                  <Info className="w-4 h-4 text-zinc-500" />
                  <span>
                    全球雲端特別活動：<strong className="text-gold font-mono">{globalEvents.length}</strong> 個 (所有玩家均可見)
                  </span>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={handleSeedDatabase}
                    disabled={syncLoading}
                    className="flex items-center gap-1.5 px-3 py-1.5 border border-border-dark text-zinc-400 bg-dark-bg hover:border-gold hover:text-gold rounded text-2xs cursor-pointer transition-all"
                    title="當資料庫為空時，可自動載入官方配置好的特別特企範本"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>載入特企範本資料</span>
                  </button>

                  <button
                    onClick={() => {
                      onClose();
                      onAddEventClick();
                    }}
                    className="flex items-center gap-1 px-4 py-1.5 bg-gold text-dark-bg font-bold rounded-full hover:brightness-110 active:scale-95 text-2xs cursor-pointer transition-all gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                    <span>登錄全球特別活動</span>
                  </button>
                </div>
              </div>

              {/* Global Firestore Events Management List */}
              <div className="border border-border-dark rounded overflow-hidden">
                <div className="p-3 border-b border-border-dark bg-[#121214] flex items-center justify-between text-xs font-bold text-zinc-400">
                  <span>全球特別活動清單 ({globalEvents.length})</span>
                  <span>操作</span>
                </div>

                <div className="divide-y divide-border-dark max-h-80 overflow-y-auto custom-scrollbar bg-[#161618]">
                  {globalEvents.length === 0 ? (
                    <div className="text-center py-10">
                      <Calendar className="w-10 h-10 text-zinc-600 mb-2 mx-auto stroke-[1.5]" />
                      <p className="text-xs text-zinc-500">雲端中尚無全球特別活動！</p>
                      <p className="text-3xs text-zinc-600 mt-1">您可以點擊上方「載入特企範本資料」或「登錄全球特別活動」</p>
                    </div>
                  ) : (
                    globalEvents.map((evt) => {
                      const catConfig = getCategoryConfig(evt.category);
                      return (
                        <div key={evt.id} className="p-4 hover:bg-dark-bg/40 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
                          {/* Left Event details */}
                          <div className="flex flex-col gap-1.5 max-w-xl text-left">
                            <div className="flex flex-wrap items-center gap-1.5">
                              <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-[#121214] text-gold border border-gold/20">
                                {catConfig.label}
                              </span>
                              <span className="text-zinc-400 gap-1 select-none font-mono text-[10px]">
                                {evt.dc} · {evt.world} · {evt.date} ({evt.startTime} - {evt.endTime})
                              </span>
                            </div>
                            <h4 className="font-bold text-sm text-zinc-200">
                              {evt.title}
                            </h4>
                            <p className="text-3xs text-zinc-500 font-sans truncate">
                              主辦人: {evt.host} | 著裝: {evt.dressCode} | 傳送代碼: {evt.location.housingArea} 第 {evt.location.ward} 區 {evt.location.plot} 號
                            </p>
                          </div>

                          {/* Right Operations */}
                          <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                            <button
                              onClick={() => {
                                onClose();
                                onEditClick(evt);
                              }}
                              className="p-1.5 rounded-full border border-border-dark text-zinc-400 hover:text-gold hover:border-gold/40 cursor-pointer bg-[#121214] transition-all"
                              title="編輯此全球特別活動"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteEvent(evt.id, evt.title)}
                              className="p-1.5 rounded-full border border-red-500/10 text-red-400 hover:text-red-300 hover:border-red-500/40 cursor-pointer bg-[#121214] transition-all"
                              title="在全球下架刪除此特別活動"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal actions footer */}
        <div className="p-4 bg-panel-bg border-t border-border-dark shrink-0 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-200 transition-colors cursor-pointer"
          >
            關閉
          </button>
        </div>
      </div>
    </div>
  );
}
