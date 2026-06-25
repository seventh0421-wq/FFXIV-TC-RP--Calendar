import { RPEvent } from '../types';

export const SAMPLE_EVENTS: RPEvent[] = [
  {
    id: 'sample-1',
    title: '【繁中 - 鳳凰】貓與紅茶的午後 - 執事女僕咖啡廳',
    date: '2026-06-21', // Today based on metadata
    startTime: '14:00',
    endTime: '17:00',
    dc: '繁體中文服',
    world: '鳳凰',
    location: {
      housingArea: '薰衣草苗圃',
      ward: 12,
      plot: 3,
      roomNumber: '大廳'
    },
    category: 'cafe',
    host: 'Aetheria Melisandre',
    dressCode: '冒險者日常服 / 歐式仕女紳士裝 (無限制)',
    description: '歡迎來到【貓與紅茶】！在這裡，我們提供現泡的大吉嶺莊園紅茶與精緻的手作愛歐澤亞小點心。\n\n店內環境優雅安靜，整點將有常駐樂手帶來優雅的古典豎琴與鋼琴演奏。適合希望享受片刻寧靜、體驗輕微RP對話的冒險者前來歇息。\n\n🌸 **入店須知：**\n1. 客人請在入口前收起武器與陸行鳥寵物。\n2. 點餐請使用 /say 頻道，若需與店員暢聊可切換至 /tell 或小組隊進行。\n3. 我們提供免費的點心，不收取任何金幣費用，若有心意歡迎和門口存錢箱打招呼！',
    tags: ['新手友善', '免費點心', '輕語RP', '優雅鋼琴'],
    bannerGradient: 'from-emerald-500 via-teal-600 to-cyan-700',
    discordUrl: 'https://discord.gg/ff14-cat-and-tea',
    recruitmentText: '目前正在招募午班服務生 2 名、兼職廚師 1 名！歡迎喜愛與人互動的冒險者詢問！'
  },
  {
    id: 'sample-2',
    title: '【繁中 - 伊弗利特】星光沉落處 - 深夜重金屬搖滾酒吧',
    date: '2026-06-21', // Today!
    startTime: '21:00',
    endTime: '23:30',
    dc: '繁體中文服',
    world: '伊弗利特',
    location: {
      housingArea: '海霧村',
      ward: 8,
      plot: 42,
      roomNumber: '地下層神秘俱樂部'
    },
    category: 'bar',
    host: 'Alecto Redblade',
    dressCode: '酷炫龐克風 / 黑色系酷裝 / 暗黑皮衣',
    description: '這裡是放鬆靈魂的避風港。在白天繁雜的冒險之後，何不來這喝上一杯烈性威士忌？\n\n我們提供薩納蘭最純正的烈酒與我們獨家的調酒「利姆薩腥紅海風」。店內音響將大聲播放重金屬黑膠樂曲，並不定期有吟遊詩人進行手動 Live 搖滾狂歡！\n\n🍻 **今晚特製：**\n- *深淵凝視*：高濃度果香烈酒，後勁十足（只要 500 Gil 象徵性收費）\n- *金蝶狂想*：果汁基底的無酒精特調，適合不能喝酒的冒險者\n\n*快帶上你的吉他，一起在酒池中嘶吼與燃燒吧！*',
    tags: ['酒精特調', '大眾RP', '現場演奏', '黑膠DJ'],
    bannerGradient: 'from-purple-900 via-indigo-950 to-slate-900',
    discordUrl: 'https://discord.gg/starry-drop-bar',
    recruitmentText: '尋找有熱情的吟遊詩人與熱舞舞者加入常駐演出！'
  },
  {
    id: 'sample-3',
    title: '【繁中 - 迦樓羅】極東風浪漫「櫻之庭露天溫泉旅館」',
    date: '2026-06-22', // Tomorrow
    startTime: '20:00',
    endTime: '23:00',
    dc: '繁體中文服',
    world: '迦樓羅',
    location: {
      housingArea: '白銀鄉',
      ward: 22,
      plot: 30,
      roomNumber: '後院溫泉與獨棟和室'
    },
    category: 'bath',
    host: 'Kagura Hime',
    dressCode: '和風浴衣 / 輕便泳裝 (備有免費更衣處)',
    description: '隆冬初逝，春櫻盛開。櫻之庭在白銀鄉的高地為各位旅人準備了暖和的火山地熱溫泉。\n\n我們擁有無遮蔽的絕美星空夜景，以及環繞溫泉的繁茂櫻花林。享受溫泉之餘，還可以享用客房內熱氣騰騰的醬油拉麵與極東黃金港清酒。\n\n🌸 **旅館特色：**\n- 戶外環繞溫泉泡湯、蒸汽浴與賞櫻區。\n- 榻榻米專屬包廂，供情侶或冒險小隊進行私密聚會聊天。\n- 專業 GPose 燈光佈局，泡湯時拍照效果極佳！\n\n*免費提供舒適乾淨的浴衣給所有入浴貴客使用！*',
    tags: ['溫泉SPA', '拍照打卡', '中式日式和風', '養生SPA'],
    bannerGradient: 'from-rose-400 via-pink-500 to-red-500',
    discordUrl: 'https://discord.gg/sakura-yado'
  },
  {
    id: 'sample-4',
    title: '【繁中 - 利維坦】幻影歌劇院 - 經典舞台劇《賢者之夜》公演',
    date: '2026-06-26',
    startTime: '20:00',
    endTime: '22:15',
    dc: '繁體中文服',
    world: '利維坦',
    location: {
      housingArea: '薰衣草苗圃',
      ward: 2,
      plot: 5,
      roomNumber: '一樓大劇場'
    },
    category: 'performance',
    host: 'Dramatist Guild',
    dressCode: '正裝 / 晚禮服 / 體面服飾 (請勿穿著誇張玩偶服)',
    description: '幻影劇團 2026 年夏季史詩級公演！\n\n本劇《賢者之夜》翻拍自艾歐澤亞第六星曆末期的真實歷史傳說。講述了一位研究星髓的賢者面臨大洪水時，為了保護故鄉利姆薩·羅敏薩而展開的一場驚天動地的命運訣別。\n\n全體演員將現場手動 RP 輸入台詞、配合流暢的動作序列、驚艷的法術粒子特效與背景管弦配樂！\n\n🎭 **不容錯過的舞台盛宴：**\n- 19:30 開放觀眾檢票入場，20:00 正式拉開帷幕。\n- 中場休息 15 分鐘，備有精緻茶點供應。\n- 散場後開放全體演員與觀眾的大合照與互動環節！\n\n*敬請觀眾遵守秩序，演出開始後請切換頻道為悄悄話，避免影響他人觀看體驗。*',
    tags: ['舞台劇公演', '全手動RP台詞', '史詩劇場', '管弦配樂'],
    bannerGradient: 'from-amber-600 via-orange-600 to-red-700',
    discordUrl: 'https://discord.gg/phantom-theater'
  },
  {
    id: 'sample-5',
    title: '【繁中 - 巴哈姆特】星之呢喃 - 占卜諮詢與命運塔羅館',
    date: '2026-06-23',
    startTime: '19:30',
    endTime: '22:00',
    dc: '繁體中文服',
    world: '巴哈姆特',
    location: {
      housingArea: '薰衣草苗圃',
      ward: 15,
      plot: 18,
      roomNumber: '2F 占星閣'
    },
    category: 'fortune',
    host: 'Valerius Astrologian',
    dressCode: '神祕學者斗篷 / 薩那蘭宮廷風 / 深色兜帽',
    description: '你是否對未來的冒險感到迷茫？或者在兩件幻化裝備中不知該如何選擇？\n\n命運就在星軌中流轉。本館由擁有多年薩那蘭神殿經驗的占星術士 Valerius 親自打理，結合十二神星象與古典塔羅牌陣，為您提供最真摯、最深刻的一對一心靈解碼。\n\n🔮 **服務項目：**\n1. **單張牌日運簡卜**：適合快速排隊占卜冒險運勢（約 5 分鐘）。\n2. **三牌命運陣 (過去、現在、未來)**：針對具體事件（如感情、職場、RP人生）進行深度解析（需要攜帶一點 RP 人設，約 15 分鐘）。\n\n*占星閣一次僅接待一位旅人，其他冒險者可在 1F 溫馨休息區享用熱紅茶與棋盤桌遊。*',
    tags: ['一對一占卜', '深度星象RP', '命運解碼', '安靜舒適'],
    bannerGradient: 'from-indigo-600 via-violet-600 to-purple-800'
  },
  {
    id: 'sample-6',
    title: '【繁中 - 奧汀】霓虹星雲「NEON NEBULA」超能電音舞會',
    date: '2026-06-27',
    startTime: '22:00',
    endTime: '01:30',
    dc: '繁體中文服',
    world: '奧汀',
    location: {
      housingArea: '海霧村',
      ward: 29,
      plot: 11,
      roomNumber: '全棟多層霓虹舞台'
    },
    category: 'club',
    host: 'DJ NeonCat & Crew',
    dressCode: '發光護目鏡 / 奇幻色彩潮流裝 / 賽博賽車服',
    description: '🔥 電音粉注意！Elemental Data Center 暑期重磅狂歡即將引爆！\n\n我們將海都大型別墅改裝成了迷幻絢麗、煙霧瀰漫的霓虹夜店。本次活動特邀外部人氣 DJ 進行 Twitch 音訊、視訊同步連線直播！重磅重低音、Future Bass 與 Trance 音樂充斥地殼！\n\n⚡ **震撼亮點：**\n- 海量螢光棒與煙火全場發放（動作表情同步配合！）\n- 特設熱舞舞池、高空包廂與DJ打碟台拍照打卡點。\n- Twitch 直播台連結將於現場公布，歡迎帶上親朋好友一起在賽博空间起舞！',
    tags: ['Twitch連線直播', '重低音電音', '萬人同屏狂歡', '酷炫舞台'],
    bannerGradient: 'from-fuchsia-600 via-pink-650 to-violet-600',
    discordUrl: 'https://discord.gg/neon-nebula',
    recruitmentText: '現場氣氛維護專員（保全）招募中！時薪 50,000 Gil，有意者請私訊！'
  },
  {
    id: 'sample-7',
    title: '【繁中 - 泰坦】《夏日夢境》四季流轉主題高級影棚開放',
    date: '2026-06-20', // Past event but active
    startTime: '10:00',
    endTime: '23:59',
    dc: '繁體中文服',
    world: '泰坦',
    location: {
      housingArea: '薰衣草苗圃',
      ward: 4,
      plot: 58,
      roomNumber: '整棟 4 大不同季節攝影棚'
    },
    category: 'photo',
    host: 'Iris PhotoStudio',
    dressCode: '四季幻化服飾 / 休閒比基尼 / 東方和服',
    description: '這裡是為所有 GPose 熱愛者、風景拍攝大師、情侶街拍設計的精品影棚別墅。\n\n我們聘請了幻化群與裝潢群著名設計師，利用浮空與精細對位技術，在一個屋簷下打造了「春之櫻落」、「夏之海灘」、「秋之紅葉」與「冬之暖爐暖被桌」四大獨立微縮景觀！\n\n📸 **自助拍攝指南：**\n- 全天候開放。進門後請使用 3 等組隊或默默自行拍照。\n- 我們在牆壁或暗格嵌入了多組「強力折射壁燈」和「多彩魔界花燈」，方便大家直接收穫立體、有空氣感的頂級渲染光影。\n- 拍照分享至 SNS 歡迎附帶標籤 **#FF14SummerDream**！',
    tags: ['高畫質影棚', '裝護設計欣賞', '二十四小時開放', 'GPose光陰設計'],
    bannerGradient: 'from-sky-400 via-blue-500 to-indigo-600'
  },
  {
    id: 'sample-8',
    title: '【繁中 - 巴哈姆特】無人島海風徐徐 - 露天消暑篝火酒會',
    date: '2026-06-28',
    startTime: '15:00',
    endTime: '18:00',
    dc: '繁體中文服',
    world: '巴哈姆特',
    location: {
      housingArea: '白銀鄉',
      ward: 30,
      plot: 2,
      roomNumber: '前院露天沙灘沙龍'
    },
    category: 'other',
    host: 'Captain Corvus',
    dressCode: '沙灘休閒裝 / 夏威夷花襯衫 / 泳裝',
    description: '熱死啦！一起到沙灘上吹吹海風、圍著熊熊篝火聊聊天吧！\n\n這是一個極度休閒、沒有任何繁瑣RP門檻的聚會。我們在白銀鄉海灘前院布置了躺椅、燒烤架、冰桶與新鮮採摘的椰子汁。\n\n在這裡：\n- 聽聽海浪聲，分享這週隨機排本發生的趣事、冒險路上的槽點。\n- 現場將免費提供現烤「巨龍海鮮燒烤串」與「極北冰原櫻桃冰沙」！\n- 歡迎帶上樂器隨興彈唱，或者帶上魚竿在現場來一場釣魚大賽！',
    tags: ['海風烤肉', '不拘RP大聊天', '沙灘篝火', '釣魚彈唱'],
    bannerGradient: 'from-orange-400 via-amber-500 to-yellow-500'
  }
];
