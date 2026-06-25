import { useState, useEffect, useMemo } from 'react';
import { Menu, X, Plus, CalendarRange, Trash2, SlidersHorizontal, Info, RefreshCw, Lock, Unlock, Bell, BellRing, MessageSquare } from 'lucide-react';
import { CalendarFilters, CalendarView, RPEvent } from './types';
import { SAMPLE_EVENTS } from './data/sampleEvents';
import { formatDateString } from './utils';
import { auth, fetchEventsFromFirestore, addEventToFirestore, updateEventInFirestore, deleteEventFromFirestore } from './lib/firebase';
import { User } from 'firebase/auth';

// Import components
import CalendarHeader from './components/CalendarHeader';
import SidebarFilters from './components/SidebarFilters';
import MonthlyView from './components/MonthlyView';
import WeeklyView from './components/WeeklyView';
import AgendaView from './components/AgendaView';
import EventDetailModal from './components/EventDetailModal';
import AddEventModal from './components/AddEventModal';
import AdminPortalModal from './components/AdminPortalModal';
import ChangelogModal from './components/ChangelogModal';
import WelcomeModal from './components/WelcomeModal';

const LOCAL_STORAGE_KEY = 'ff14_tc_rp_custom_events';

// Safe localStorage wrapper to prevent iframe SecurityError crashes
const safeStorage = {
  getItem(key: string): string | null {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        return window.localStorage.getItem(key);
      }
    } catch (e) {
      console.warn(`Storage access blocked for key: ${key}`, e);
    }
    return null;
  },
  setItem(key: string, value: string): void {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(key, value);
      }
    } catch (e) {
      console.warn(`Storage set blocked for key: ${key}`, e);
    }
  },
  removeItem(key: string): void {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.removeItem(key);
      }
    } catch (e) {
      console.warn(`Storage remove blocked for key: ${key}`, e);
    }
  }
};

export default function App() {
  // Theme state
  const [theme, setTheme] = useState<string>(() => {
    return safeStorage.getItem('ff14_tc_rp_theme') || 'theme-black-gold';
  });

  // Font Size state: '12px' | '16px' | '20px' | '24px'
  const [fontSize, setFontSizeState] = useState<string>(() => {
    return safeStorage.getItem('ff14_tc_rp_font_size') || '16px';
  });

  // Synchronize Theme with documentElement
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const el = document.documentElement;
      
      // Clean up previous theme classes safely
      el.classList.forEach((cls) => {
        if (cls.startsWith('theme-')) {
          el.classList.remove(cls);
        }
      });
      el.classList.add(theme);
    }
  }, [theme]);

  // Synchronize Font Size with documentElement
  useEffect(() => {
    if (typeof window !== 'undefined') {
      document.documentElement.style.fontSize = fontSize;
    }
  }, [fontSize]);

  // Welcome / Notice modal state
  const [welcomeOpen, setWelcomeOpen] = useState<boolean>(() => {
    return safeStorage.getItem('ff14_disclaimer_dismissed') !== 'true';
  });

  // Navigation states
  const [currentDate, setCurrentDate] = useState<Date>(() => {
    // Current time is June 21, 2026. Let's initialize to this date!
    return new Date('2026-06-21');
  });
  const [view, setView] = useState<CalendarView>('month');

  // Filter States
  const [filters, setFilters] = useState<CalendarFilters>({
    searchTerm: '',
    datacenter: 'all',
    category: 'all',
    onlyCustom: false,
  });

  // Events Storage
  const [events, setEvents] = useState<RPEvent[]>([]);

  // UI Dialog States
  const [selectedEvent, setSelectedEvent] = useState<RPEvent | null>(null);
  const [addEventOpen, setAddEventOpen] = useState(false);
  const [editEventItem, setEditEventItem] = useState<RPEvent | null>(null);
  const [dayClickDate, setDayClickDate] = useState<string | null>(null);

  // Responsive Sidebar Toggle for Tablets / Mobile Phones
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [desktopSidebarOpen, setDesktopSidebarOpen] = useState<boolean>(() => {
    try {
      const stored = safeStorage.getItem('ff14_tc_rp_desktop_sidebar');
      return stored !== 'closed';
    } catch {
      return true;
    }
  });
  const [changelogOpen, setChangelogOpen] = useState(false);

  // Followed & Notification tracking states
  const [followedEventIds, setFollowedEventIds] = useState<string[]>(() => {
    try {
      const stored = safeStorage.getItem('ff14_tc_rp_followed_events');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  interface InAppAlert {
    id: string;
    eventId: string;
    title: string;
    eventName: string;
    startTime: string;
    location: string;
    timestamp: Date;
  }

  const [inAppAlerts, setInAppAlerts] = useState<InAppAlert[]>([]);

  const handleToggleFollow = (id: string) => {
    let updated: string[];
    if (followedEventIds.includes(id)) {
      updated = followedEventIds.filter((fId) => fId !== id);
    } else {
      updated = [...followedEventIds, id];
      // Ask nicely to enable Notifications safely
      try {
        const win = window as any;
        if (typeof window !== 'undefined' && 'Notification' in window && win.Notification) {
          if (win.Notification.permission === 'default') {
            win.Notification.requestPermission().catch((err: any) => {
              console.warn('Notification permission request was blocked:', err);
            });
          }
        }
      } catch (e) {
        console.warn('Desktop notification features are restricted in this frame environment:', e);
      }
    }
    setFollowedEventIds(updated);
    safeStorage.setItem('ff14_tc_rp_followed_events', JSON.stringify(updated));
  };

  // Admin Portal & Loading States
  const [adminUser, setAdminUser] = useState<User | null>(null);
  const [adminPortalOpen, setAdminPortalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Listen to Auth State
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setAdminUser(user);
    });
    return unsubscribe;
  }, []);

  // Background interval to check upcoming followed events starting within 15 minutes
  useEffect(() => {
    const checkUpcomingFollowed = () => {
      const now = new Date();
      const nowTime = now.getTime();
      let storedNotified: string[] = [];
      try {
        const stored = safeStorage.getItem('ff14_tc_rp_notified_events');
        storedNotified = stored ? JSON.parse(stored) : [];
      } catch {
        // ignore
      }
      const freshNotified = [...storedNotified];
      let updatedNotified = false;

      events.forEach((evt) => {
        if (!followedEventIds.includes(evt.id)) return;
        if (freshNotified.includes(evt.id)) return;

        // Parse event date (YYYY-MM-DD) and startTime (HH:MM)
        const dParts = evt.date.split('-');
        const tParts = evt.startTime.split(':');
        if (dParts.length < 3 || tParts.length < 2) return;

        const year = parseInt(dParts[0], 10);
        const month = parseInt(dParts[1], 10) - 1;
        const day = parseInt(dParts[2], 10);
        const hours = parseInt(tParts[0], 10);
        const minutes = parseInt(tParts[1], 10);

        const eventStart = new Date(year, month, day, hours, minutes);
        const diffMs = eventStart.getTime() - nowTime;
        const diffMin = diffMs / (1000 * 60);

        // Trigger push/in-app alert if starting in the next 15 minutes or started up to 2 mins ago
        if (diffMin >= -2 && diffMin <= 15) {
          freshNotified.push(evt.id);
          updatedNotified = true;

          // Trigger Desktop Notification
          let isNotificationGranted = false;
          const win = window as any;
          try {
            if (typeof window !== 'undefined' && 'Notification' in window && win.Notification) {
              isNotificationGranted = win.Notification.permission === 'granted';
            }
          } catch (e) {
            // Ignore permission access blocks inside iframes
          }

          if (isNotificationGranted && win.Notification) {
            try {
              const nTitle = `🔔 RP 活動即將起算：${evt.title}`;
              const nOptions = {
                body: `您關注的活動將於 ${evt.startTime} 展開！地點：${evt.dc} [${evt.world}] @ ${evt.location.housingArea} ${evt.location.ward}區-${evt.location.plot}號`,
                tag: evt.id,
              };
              new win.Notification(nTitle, nOptions);
            } catch (err) {
              console.error('Desktop Notify failed:', err);
            }
          }

          // Trigger In-App beautiful toast
          setInAppAlerts((prev) => [
            ...prev,
            {
              id: `${evt.id}-${nowTime}`,
              eventId: evt.id,
              title: '🔔 追蹤活動即將開始！',
              eventName: evt.title,
              startTime: evt.startTime,
              location: `${evt.dc} [${evt.world}] · ${evt.location.housingArea} ${evt.location.ward}區-${evt.location.plot}號 ${evt.location.roomNumber || ''}`,
              timestamp: new Date(),
            }
          ]);
        }
      });

      if (updatedNotified) {
        safeStorage.setItem('ff14_tc_rp_notified_events', JSON.stringify(freshNotified));
      }
    };

    checkUpcomingFollowed();
    const intId = setInterval(checkUpcomingFollowed, 30000); // Check every 30 seconds
    return () => clearInterval(intId);
  }, [events, followedEventIds]);

  // Fetch / Sync events
  const loadAllEvents = async () => {
    setLoading(true);
    try {
      const dbEvents = await fetchEventsFromFirestore();
      
      // Load local events from LocalStorage
      const stored = safeStorage.getItem(LOCAL_STORAGE_KEY);
      const localEvents: RPEvent[] = stored ? JSON.parse(stored) : [];
      
      if (dbEvents.length > 0) {
        // Merge cloud events and local cache
        const localIds = new Set(localEvents.map(e => e.id));
        const filteredDbEvents = dbEvents.filter(e => !localIds.has(e.id));
        setEvents([...filteredDbEvents, ...localEvents]);
      } else {
        // Fallback to sample events + local events
        const preparedSample = SAMPLE_EVENTS.map(evt => ({ ...evt, isCustom: false }));
        setEvents([...preparedSample, ...localEvents]);
      }
    } catch (e) {
      console.error('Failed to fetch from Firestore, falling back to LocalStorage & samples:', e);
      const preparedSample = SAMPLE_EVENTS.map(evt => ({ ...evt, isCustom: false }));
      const stored = safeStorage.getItem(LOCAL_STORAGE_KEY);
      const localEvents: RPEvent[] = stored ? JSON.parse(stored) : [];
      setEvents([...preparedSample, ...localEvents]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllEvents();
  }, []);

  // Filter events based on active filters
  const filteredEvents = useMemo(() => {
    return events.filter((evt) => {
      // 1. Search term match
      if (filters.searchTerm.trim() !== '') {
        const query = filters.searchTerm.toLowerCase();
        const matchTitle = evt.title.toLowerCase().includes(query);
        const matchHost = evt.host.toLowerCase().includes(query);
        const matchDesc = evt.description.toLowerCase().includes(query);
        const matchArea = evt.location.housingArea.toLowerCase().includes(query);
        const matchTags = evt.tags.some((tag) => tag.toLowerCase().includes(query));
        
        if (!matchTitle && !matchHost && !matchDesc && !matchArea && !matchTags) {
          return false;
        }
      }

      // 2. Server (world) match
      if (filters.datacenter !== 'all' && evt.world !== filters.datacenter) {
        return false;
      }

      // 3. Category match
      if (filters.category !== 'all') {
        const isStandard = ['bar', 'cafe', 'club', 'bath', 'performance', 'photo', 'fortune'].includes(evt.category);
        if (filters.category === 'other') {
          if (isStandard) return false;
        } else if (evt.category !== filters.category) {
          return false;
        }
      }

      // 4. Custom only filter
      if (filters.onlyCustom && !evt.isCustom) {
        return false;
      }

      return true;
    });
  }, [events, filters]);

  // Sidebar mini stats / hot events (sorted chronologically)
  const upcomingEvents = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return filteredEvents
      .filter((evt) => {
        const evtDate = new Date(evt.date);
        evtDate.setHours(0, 0, 0, 0);
        return evtDate >= today;
      })
      .sort((a, b) => {
        const dateComp = a.date.localeCompare(b.date);
        if (dateComp !== 0) return dateComp;
        return a.startTime.localeCompare(b.startTime);
      });
  }, [filteredEvents]);

  // Calendar Navigation handlers
  const handleNavigatePrev = () => {
    setCurrentDate((prev) => {
      const nextDate = new Date(prev);
      if (view === 'month' || view === 'agenda') {
        nextDate.setMonth(prev.getMonth() - 1);
      } else if (view === 'week') {
        nextDate.setDate(prev.getDate() - 7);
      }
      return nextDate;
    });
  };

  const handleNavigateNext = () => {
    setCurrentDate((prev) => {
      const nextDate = new Date(prev);
      if (view === 'month' || view === 'agenda') {
        nextDate.setMonth(prev.getMonth() + 1);
      } else if (view === 'week') {
        nextDate.setDate(prev.getDate() + 7);
      }
      return nextDate;
    });
  };

  const handleNavigateToday = () => {
    setCurrentDate(new Date('2026-06-21')); // Center on 2026-06-21 so the beautiful system matches
  };

  // Event Mutations (C.R.U.D)
  const handleAddOrEditEventSubmit = async (evt: RPEvent) => {
    if (!adminUser) {
      alert('❗ 只有管理者可以新增或修改活動。');
      return;
    }
    try {
      if (editEventItem) {
        // Update the existing Firestore document
        await updateEventInFirestore(evt.id, evt);
        alert('🎉 活動資料修改成功！');
      } else {
        // Create new Firestore document
        const { id, ...payload } = evt;
        await addEventToFirestore(payload);
        alert('🎉 活動發布成功！全球玩家均可查看此活動。');
      }
      // Load fresh events from Firestore
      await loadAllEvents();
    } catch (err) {
      console.error('Error saving event:', err);
      alert('儲存活動失敗，請檢查網路連線。');
    } finally {
      setAddEventOpen(false);
      setEditEventItem(null);
      setDayClickDate(null);
    }
  };

  const handleDeleteEvent = async (id: string) => {
    if (!adminUser) {
      alert('❗ 只有管理者可以下架活動。');
      return;
    }
    try {
      if (window.confirm('確定下架並在全球刪除此特別活動嗎？（此動作無法復原）')) {
        await deleteEventFromFirestore(id);
        alert('🗑️ 活動已成功下架！');
        await loadAllEvents();
      }
    } catch (err) {
      console.error('Error deleting event:', err);
      alert('刪除活動失敗，請檢查網路連線。');
    } finally {
      setSelectedEvent(null);
    }
  };

  // Click on empty day to quickly open publishing dialog on that date
  const handleDayClick = (dateStr: string) => {
    if (!adminUser) return; // Only administrators can create events clicking empty slots
    setDayClickDate(dateStr);
    setEditEventItem(null);
    setAddEventOpen(true);
  };

  const handleEditClick = (evt: RPEvent) => {
    setEditEventItem(evt);
    setAddEventOpen(true);
  };

  // Clear all custom data to reset calendar
  const handleResetCalendar = () => {
    const ok = window.confirm('這將清除您自己發布的本機自定義活動，恢復成初始範本。確定嗎？');
    if (ok) {
      safeStorage.removeItem(LOCAL_STORAGE_KEY);
      loadAllEvents();
    }
  };

  return (
    <div className={`flex flex-col h-screen w-full bg-dark-bg text-zinc-100 overflow-hidden font-sans ${theme}`}>
      {/* Dynamic Header */}
      <CalendarHeader
        currentDate={currentDate}
        view={view}
        onViewChange={setView}
        onNavigatePrev={handleNavigatePrev}
        onNavigateNext={handleNavigateNext}
        onNavigateToday={handleNavigateToday}
        onAddEventClick={() => {
          setEditEventItem(null);
          setDayClickDate(null);
          setAddEventOpen(true);
        }}
        isAdminLoggedIn={!!adminUser}
        theme={theme}
        onThemeChange={(newTheme) => {
          setTheme(newTheme);
          safeStorage.setItem('ff14_tc_rp_theme', newTheme);
        }}
        fontSize={fontSize}
        onFontSizeChange={(newSize) => {
          setFontSizeState(newSize);
          safeStorage.setItem('ff14_tc_rp_font_size', newSize);
        }}
        desktopSidebarOpen={desktopSidebarOpen}
        onToggleDesktopSidebar={() => {
          setDesktopSidebarOpen(prev => {
            const nextVal = !prev;
            safeStorage.setItem('ff14_tc_rp_desktop_sidebar', nextVal ? 'open' : 'closed');
            return nextVal;
          });
        }}
      />

      {/* Main Layout Area */}
      <div className="flex flex-1 overflow-hidden relative">
        
        {/* Toggle Sidebar Option on Mobile */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="lg:hidden absolute bottom-5 right-5 z-40 p-3 bg-gold text-dark-bg rounded-full shadow-lg shadow-gold/20 cursor-pointer active:scale-95 transition-all flex items-center justify-center font-bold"
          title="切換篩選面板"
        >
          {sidebarOpen ? <X className="w-5 h-5 stroke-[2.5]" /> : <SlidersHorizontal className="w-5 h-5 stroke-[2.5]" />}
        </button>

        {/* Sidebar - Collapsible on Mobile and Desktop */}
        <div
          className={`shrink-0 transition-all duration-300 ease-in-out ${
            sidebarOpen
              ? 'absolute inset-0 z-30 flex w-full bg-dark-bg/95 lg:relative lg:bg-transparent animate-fade-in lg:w-72'
              : desktopSidebarOpen
                ? 'hidden lg:flex lg:w-72 border-r border-border-dark'
                : 'hidden lg:flex lg:w-0 overflow-hidden'
          }`}
        >
          <div className="w-full lg:w-72 h-full flex flex-col relative shrink-0">
            {sidebarOpen && (
              <button
                onClick={() => setSidebarOpen(false)}
                className="absolute top-4 right-4 p-1.5 rounded-full bg-panel-bg border border-border-dark text-zinc-300 lg:hidden cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            
            <SidebarFilters
              filters={filters}
              onFiltersChange={(f) => {
                setFilters(f);
                // On mobile, close sidebar after clicking a filter to watch results
                if (window.innerWidth < 1024) {
                  // Keep open if typing a search
                  if (filters.searchTerm === f.searchTerm && filters.datacenter !== f.datacenter) {
                    setSidebarOpen(false);
                  }
                }
              }}
              upcomingEvents={upcomingEvents}
              onEventClick={(evt) => {
                setSelectedEvent(evt);
                setSidebarOpen(false); // Close drawer
              }}
            />

            {/* Clear custom events utility back-button in Sidebar */}
            <div className="p-4 border-t border-border-dark bg-[#141416] flex flex-col gap-3 shrink-0">
              <div className="flex items-center justify-between text-[10px] text-zinc-500">
                <span className="flex items-center gap-1">
                  <Info className="w-3.5 h-3.5 text-zinc-500" />
                  <span>本站專收 **特別活動 / 特企**</span>
                </span>
                <button
                  onClick={handleResetCalendar}
                  className="px-2 py-0.5 rounded bg-[#1d1d20] border border-border-dark hover:border-red-500/30 hover:text-red-400 transition-all cursor-pointer text-3xs"
                  title="重置本機暫存行程"
                >
                  重設
                </button>
              </div>
              <button
                onClick={() => setAdminPortalOpen(true)}
                className="w-full py-1.5 rounded border border-gold/30 hover:border-gold hover:bg-gold/5 text-gold text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer bg-dark-bg"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>管理者後台 / 登入發布</span>
              </button>

              <a
                href="https://discord.gg/n34Ydu29nm"
                target="_blank"
                rel="noreferrer"
                className="w-full py-1.5 rounded border border-indigo-500/35 hover:border-indigo-400 hover:bg-indigo-500/10 text-indigo-400 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer bg-dark-bg"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>RP 店家宣傳 Discord ↗</span>
              </a>

              {/* Maintenance team and external tools utility links */}
              <div className="mt-1 pt-3 border-t border-zinc-800/60 flex flex-col gap-2 text-[10px] text-zinc-500">
                <div className="flex items-center justify-between">
                  <span className="text-zinc-550 select-none">
                    維護：<a
                      href="https://www.threads.com/@yanluo_ff14"
                      target="_blank"
                      rel="noreferrer"
                      className="text-zinc-300 hover:text-gold hover:underline transition-colors font-bold font-sans cursor-pointer inline-flex items-center gap-0.5"
                    >
                      閻羅@奧汀 📷
                    </a>
                  </span>
                  <a
                    href="https://rp-toolbox.vercel.app/"
                    target="_blank"
                    rel="noreferrer"
                    className="text-gold/80 hover:text-gold hover:underline transition-colors flex items-center gap-0.5 font-sans font-medium"
                  >
                    <span>RP工具箱 ↗</span>
                  </a>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[9px] text-zinc-650">Version 1.4.0 (高能倒計)</span>
                  <button
                    onClick={() => setChangelogOpen(true)}
                    className="text-zinc-400 hover:text-zinc-100 hover:underline cursor-pointer flex items-center gap-0.5 transition-colors font-sans font-medium"
                  >
                    📝 更新日記
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Calendar Core Calendar Area */}
        <main className="flex-1 flex flex-col overflow-auto custom-scrollbar bg-dark-bg">
          
          {/* Calendar Display Modes */}
          {view === 'month' && (
            <MonthlyView
              currentDate={currentDate}
              events={filteredEvents}
              onEventClick={setSelectedEvent}
              onDayClick={handleDayClick}
            />
          )}

          {view === 'week' && (
            <WeeklyView
              currentDate={currentDate}
              events={filteredEvents}
              onEventClick={setSelectedEvent}
              onDayClick={handleDayClick}
            />
          )}

          {view === 'agenda' && (
            <AgendaView
              currentDate={currentDate}
              events={filteredEvents}
              onEventClick={setSelectedEvent}
            />
          )}
        </main>
      </div>

      {/* Bottom Status Bar */}
      <footer className="hidden md:flex h-8 bg-panel-bg border-t border-border-dark items-center justify-between px-6 text-[10px] text-[#808080] shrink-0 select-none">
        <div className="flex space-x-6">
          <span>當前伺服器：繁體中文主數據中心 (鳳凰 / 伊弗利特 / 迦樓羅 / 利維坦 / 巴哈姆特 / 奧汀 / 泰坦)</span>
        </div>
        <div className="flex space-x-4">
          <span>資料同步於：剛剛</span>
          <span className="text-gold font-semibold">FF14 RP Community Taiwan</span>
        </div>
      </footer>

      {/* Dynamic Details Dialog (Modal) */}
      {selectedEvent && (
        <EventDetailModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
          onDeleteEvent={handleDeleteEvent}
          onEditClick={handleEditClick}
          isFollowed={followedEventIds.includes(selectedEvent.id)}
          onToggleFollow={handleToggleFollow}
          isAdminLoggedIn={!!adminUser}
        />
      )}

      {/* Welcome & Disclaimer Notice Popup */}
      {welcomeOpen && (
        <WelcomeModal
          onClose={() => {
            setWelcomeOpen(false);
            safeStorage.setItem('ff14_disclaimer_dismissed', 'true');
          }}
        />
      )}

      {/* Dynamic Publish/Edit Dialog (Modal) */}
      {addEventOpen && (
        <AddEventModal
          onClose={() => {
            setAddEventOpen(false);
            setEditEventItem(null);
            setDayClickDate(null);
          }}
          onSubmit={handleAddOrEditEventSubmit}
          editEvent={editEventItem}
          initialDate={dayClickDate || undefined}
          isAdminLoggedIn={!!adminUser}
        />
      )}

      {/* Admin Portal Modal */}
      {adminPortalOpen && (
        <AdminPortalModal
          onClose={() => setAdminPortalOpen(false)}
          onRefreshEvents={loadAllEvents}
          events={events}
          onEditClick={handleEditClick}
          onAddEventClick={() => {
            setEditEventItem(null);
            setDayClickDate(null);
            setAddEventOpen(true);
          }}
        />
      )}

      {/* Release Logs / Changelog Modal */}
      {changelogOpen && (
        <ChangelogModal
          onClose={() => setChangelogOpen(false)}
        />
      )}

      {/* Animated Floating In-App Alert Toasts */}
      {inAppAlerts.length > 0 && (
        <div className="fixed bottom-12 right-6 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none font-sans">
          {inAppAlerts.map((alert) => (
            <div
              key={alert.id}
              className="p-4 rounded border border-gold/40 bg-[#121214]/95 backdrop-blur-md shadow-2xl flex flex-col gap-2 cursor-pointer pointer-events-auto animate-slide-in relative overflow-hidden"
              onClick={() => {
                const found = events.find((e) => e.id === alert.eventId);
                if (found) {
                  setSelectedEvent(found);
                }
                setInAppAlerts((prev) => prev.filter((a) => a.id !== alert.id));
              }}
            >
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-amber-500 to-yellow-400" />
              <div className="flex items-start justify-between gap-2 mt-0.5">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-full bg-gold/10 text-gold animate-bounce shrink-0">
                    <Bell className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold text-gold tracking-wide">{alert.title}</span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setInAppAlerts((prev) => prev.filter((a) => a.id !== alert.id));
                  }}
                  className="text-zinc-500 hover:text-zinc-300 p-0.5 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div>
                <h4 className="text-xs font-bold text-zinc-100 line-clamp-1 font-sans">{alert.eventName}</h4>
                <p className="text-[11px] text-zinc-400 mt-1 flex items-center gap-1 font-mono">
                  <span>開始時間：</span>
                  <span className="text-zinc-200 font-bold">{alert.startTime}</span>
                </p>
                <p className="text-[10px] text-zinc-500 mt-0.5 line-clamp-1">{alert.location}</p>
              </div>
              <div className="text-[9px] text-zinc-500 text-right mt-1">點擊可查看活動詳情</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
