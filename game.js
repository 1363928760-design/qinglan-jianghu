const SAVE_KEY = "qinglan_jianghu_slice_v1";
const TICK_MS = 1000;
const GAME_MINUTES_PER_TICK = 6;

const DATA = {
  locations: {
    town: {
      name: "平安镇",
      desc: "小镇依水而建，茶旗与药香在街口慢慢晃。",
      danger: "安稳",
      enemies: ["drunkard", "streetRogue"],
      actions: [
        { id: "tea", name: "茶肆听闻", cost: { silver: 3 }, gain: { exp: 10 }, text: "你在茶肆听来几段真假难辨的江湖传言。" },
        { id: "medicine", name: "买金疮药", cost: { silver: 12 }, item: "salve", count: 1, text: "药铺掌柜包好一帖金疮药，叮嘱你莫逞强。" },
        { id: "work", name: "码头短工", gain: { silver: 16, exp: 4 }, text: "你替船家搬了半日货，手臂酸胀，钱袋却沉了一点。" }
      ]
    },
    sect: {
      name: "青岚剑派",
      desc: "山门半掩在雨雾里，石阶旁有旧剑痕。",
      danger: "清修",
      enemies: ["woodDummy", "seniorDisciple"],
      actions: [
        { id: "lecture", name: "听长老讲武", cost: { contrib: 8 }, gain: { cultivation: 36, exp: 8 }, text: "长老以竹枝点地，说破你运劲时的一处滞碍。" },
        { id: "sweep", name: "洒扫山门", gain: { contrib: 12, exp: 6 }, text: "你扫净山门青苔，执事记下了你的勤勉。" },
        { id: "forge", name: "修补练功剑", cost: { silver: 10 }, gain: { contrib: 18 }, text: "铁匠看你手稳，让你帮忙修补一批练功剑。" }
      ]
    },
    forest: {
      name: "雁回林",
      desc: "林中鸟道交错，夜里常有人影借树影疾行。",
      danger: "小险",
      enemies: ["banditScout", "wildWolf", "herbGuard"],
      actions: [
        { id: "herb", name: "采药", gain: { exp: 7 }, item: "herb", chance: .72, text: "你沿溪寻到几株止血草。" },
        { id: "trail", name: "循踪", gain: { exp: 16 }, text: "你在泥地辨出新旧足印，眼力更敏锐了。" },
        { id: "ambush", name: "伏击山贼", combat: "banditScout", text: "你伏在枯叶后，等一个落单的山贼斥候靠近。" }
      ]
    },
    pass: {
      name: "断碑古道",
      desc: "古道尽头有断碑，碑下压着几代人的未竟之事。",
      danger: "凶险",
      enemies: ["bladeBandit", "wanderingMonk", "graveRobber"],
      actions: [
        { id: "escort", name: "护送商队", gain: { silver: 34, exp: 18 }, risk: "bladeBandit", text: "你随商队走过乱石坡，刀柄一直没有离手。" },
        { id: "read", name: "拓印残碑", cost: { silver: 8 }, gain: { cultivation: 28, exp: 20 }, text: "残碑字迹古拙，似藏着一段旧日行功口诀。" },
        { id: "duel", name: "寻人切磋", combat: "wanderingMonk", text: "你向路过僧人抱拳，请教几招。" }
      ]
    },
    valley: {
      name: "回声谷",
      desc: "谷中岩壁回音极长，旧时青岚弟子常在此试剑。",
      danger: "幽险",
      enemies: ["echoApe", "lostSwordsman", "valleyHermit"],
      actions: [
        { id: "echo", name: "听谷练息", gain: { cultivation: 42, exp: 12 }, text: "你随回声调整吐纳，气息渐渐归于绵长。" },
        { id: "spring", name: "寻冷泉", gain: { hp: 24, mp: 18 }, item: "herb", chance: .35, text: "谷底冷泉清冽，泉边偶有药草。" },
        { id: "swordmark", name: "试剑石壁", cost: { mp: 10 }, gain: { cultivation: 34, exp: 18 }, risk: "lostSwordsman", text: "你在石壁旧痕旁试剑，回声里似有另一道剑风。" }
      ]
    }
  },
  idleActions: {
    meditate: {
      name: "打坐吐纳",
      desc: "每刻获得修为，少量恢复内力。",
      perMinute: { cultivation: .45, mp: .28 }
    },
    train: {
      name: "木桩练招",
      desc: "每刻获得修为和阅历，消耗少量内力。",
      perMinute: { cultivation: .35, exp: .22, mp: -.11 }
    },
    patrol: {
      name: "山门巡值",
      desc: "每刻获得门贡和银两，偶有小事件。",
      perMinute: { contrib: .16, silver: .07, exp: .08 }
    },
    forage: {
      name: "林间采集",
      desc: "每刻获得银两和阅历，较容易遇险。",
      perMinute: { silver: .14, exp: .13 }
    }
  },
  skills: [
    { id: "qinglan_sword", name: "青岚剑法", type: "剑法", max: 9, baseCost: 32, stat: "atk", moves: ["青云出岫", "雨落横江", "岚回万壑"], desc: "青岚剑派入门剑法，胜在稳定清正。" },
    { id: "mist_step", name: "烟雨步", type: "轻功", max: 8, baseCost: 30, stat: "agi", moves: ["穿廊", "踏叶", "回风"], desc: "步伐轻灵，善避锋芒。" },
    { id: "clear_breath", name: "清心诀", type: "内功", max: 10, baseCost: 36, stat: "mp", moves: ["澄息", "引气", "守一"], desc: "青岚根本内功，提升内力与恢复。" },
    { id: "broken_cloud", name: "破云掌", type: "掌法", max: 8, baseCost: 34, stat: "atk", moves: ["排云", "裂帛", "震衣"], desc: "近身掌法，出手短促狠准。" },
    { id: "rain_needle", name: "细雨针", type: "暗器", max: 7, baseCost: 31, stat: "crit", moves: ["点星", "入帘", "无声"], desc: "细密如雨，重在奇袭。" },
    { id: "stone_body", name: "砺石功", type: "横练", max: 8, baseCost: 35, stat: "def", moves: ["沉肩", "锁骨", "铁衣"], desc: "以拙劲护身，能扛硬打。" },
    { id: "river_blade", name: "分水刀", type: "刀法", max: 7, baseCost: 33, stat: "atk", moves: ["劈浪", "断流", "回潮"], desc: "江湖常见刀路，被青岚弟子吸收改良。" },
    { id: "listening", name: "听风辨位", type: "心法", max: 6, baseCost: 29, stat: "hit", moves: ["闻弦", "辨叶", "识息"], desc: "以声定形，减少失手。" },
    { id: "herb_lore", name: "草木经", type: "杂学", max: 6, baseCost: 24, stat: "heal", moves: ["识草", "配伍", "止血"], desc: "辨药制药，行走江湖很实在。" },
    { id: "cloud_rope", name: "云索擒拿", type: "擒拿", max: 7, baseCost: 30, stat: "control", moves: ["缠腕", "锁喉", "压肩"], desc: "不求杀伤，重在制住对手。" },
    { id: "old_song", name: "古道行歌", type: "奇门", max: 5, baseCost: 42, stat: "luck", moves: ["问路", "醒神", "故人"], desc: "古道上流传的怪歌，唱来令人心神一清。" },
    { id: "cold_light", name: "寒灯剑意", type: "绝学", max: 5, baseCost: 58, stat: "atk", moves: ["一灯", "照雪", "无眠"], desc: "青岚旧谱中的残篇，越修越见锋寒。" }
  ],
  items: {
    salve: { name: "金疮药", type: "药品", desc: "恢复 45 点气血。", use: { hp: 45 } },
    herb: { name: "止血草", type: "材料", desc: "可在药庐换成门贡，也可留作炼药材料。" },
    manual: { name: "残页秘籍", type: "秘籍", desc: "研读后获得 80 修为。", use: { cultivation: 80 } },
    ironSword: { name: "青铁剑", type: "武器", desc: "攻击 +8。", equip: { slot: "weapon", atk: 8 } },
    travelCloak: { name: "行雨短氅", type: "防具", desc: "防御 +5，身法 +2。", equip: { slot: "armor", def: 5, agi: 2 } },
    jade: { name: "旧玉佩", type: "信物", desc: "古道事件所得，似乎与某位故人有关。" }
  },
  enemies: {
    drunkard: { name: "醉汉", hp: 55, atk: 8, def: 1, agi: 4, reward: { exp: 12, silver: 8 } },
    streetRogue: { name: "泼皮", hp: 68, atk: 10, def: 2, agi: 5, reward: { exp: 16, silver: 11 } },
    woodDummy: { name: "木人桩", hp: 80, atk: 5, def: 4, agi: 1, reward: { exp: 10, cultivation: 18 } },
    seniorDisciple: { name: "师兄", hp: 110, atk: 15, def: 5, agi: 8, reward: { exp: 34, cultivation: 26 } },
    banditScout: { name: "山贼斥候", hp: 92, atk: 14, def: 4, agi: 9, reward: { exp: 30, silver: 19 } },
    wildWolf: { name: "林狼", hp: 78, atk: 16, def: 2, agi: 12, reward: { exp: 26 }, drop: { item: "herb", chance: .28 } },
    herbGuard: { name: "采药恶客", hp: 96, atk: 15, def: 5, agi: 7, reward: { exp: 33, silver: 16 }, drop: { item: "salve", chance: .18 } },
    bladeBandit: { name: "快刀山贼", hp: 135, atk: 22, def: 7, agi: 12, reward: { exp: 55, silver: 38 }, drop: { item: "ironSword", chance: .12 } },
    wanderingMonk: { name: "云游僧", hp: 150, atk: 19, def: 10, agi: 9, reward: { exp: 66, cultivation: 42 }, drop: { item: "manual", chance: .2 } },
    graveRobber: { name: "盗墓客", hp: 128, atk: 24, def: 6, agi: 11, reward: { exp: 60, silver: 35 }, drop: { item: "travelCloak", chance: .1 } },
    echoApe: { name: "白臂猿", hp: 118, atk: 20, def: 5, agi: 16, reward: { exp: 48, cultivation: 18 }, drop: { item: "herb", chance: .32 } },
    lostSwordsman: { name: "迷路剑客", hp: 142, atk: 23, def: 8, agi: 13, reward: { exp: 64, cultivation: 35, silver: 16 }, drop: { item: "manual", chance: .14 } },
    valleyHermit: { name: "谷中散人", hp: 170, atk: 25, def: 11, agi: 11, reward: { exp: 82, cultivation: 62 }, drop: { item: "travelCloak", chance: .12 } }
  },
  events: [
    { title: "旧伞", loc: "town", text: "雨起时，一个老妪借你半柄旧伞。伞骨里藏着一枚铜钱大小的青印。", choices: [
      { label: "归还旧伞", gain: { exp: 18, contrib: 6 }, log: "你将旧伞还回巷口，老妪笑说青岚弟子仍有礼数。" },
      { label: "细看青印", gain: { cultivation: 30 }, log: "青印纹路似一式剑招，你默记在心。" }
    ] },
    { title: "茶客争座", loc: "town", text: "茶肆里两名茶客为一张临窗桌子争执，掌柜投来求助的眼神。", choices: [
      { label: "出面调停", gain: { exp: 12, silver: 5 }, log: "你三言两语化开争执，掌柜免了你的茶钱。" },
      { label: "静观其变", gain: { exp: 8 }, log: "你旁观许久，记下不少市井人情。" }
    ] },
    { title: "夜半钟声", loc: "sect", text: "山门夜半响了一声钟，执事说钟未动，声自后山来。", choices: [
      { label: "去后山查看", gain: { exp: 24, cultivation: 24 }, risk: "seniorDisciple", log: "你在后山遇见练剑的师兄，被迫接了十余招。" },
      { label: "守在山门", gain: { contrib: 18 }, log: "你守到天亮无事发生，执事却赞你稳重。" }
    ] },
    { title: "药炉炸火", loc: "sect", text: "药庐童子一时分神，炉火猛地窜起。", choices: [
      { label: "以内力压火", gain: { contrib: 20, exp: 10 }, cost: { mp: 12 }, log: "你以内劲逼回火舌，童子连声道谢。" },
      { label: "抢出药材", item: "herb", gain: { exp: 12 }, log: "你从烟里抢出几包药材，呛得咳了半晌。" }
    ] },
    { title: "白鹿过溪", loc: "forest", text: "白鹿踏水而过，回头望你，角上挂着一截红绳。", choices: [
      { label: "跟随白鹿", gain: { cultivation: 46, exp: 18 }, log: "你跟至幽谷，听泉声悟得一段吐纳节奏。" },
      { label: "取下红绳", item: "jade", gain: { exp: 10 }, log: "红绳另一端系着一枚旧玉佩。" }
    ] },
    { title: "林中火光", loc: "forest", text: "远处有火光晃动，像是有人在林中分赃。", choices: [
      { label: "悄悄靠近", risk: "banditScout", gain: { exp: 14 }, log: "你听见山贼谈起断碑古道的买卖。" },
      { label: "绕路离开", gain: { exp: 8 }, log: "你避开火光，安全穿过湿林。" }
    ] },
    { title: "断碑低语", loc: "pass", text: "你拓印断碑时，石缝里传来极轻的敲击声。", choices: [
      { label: "敲回应声", item: "manual", gain: { exp: 34 }, log: "石缝吐出一页残谱，像有人等了多年。" },
      { label: "封住石缝", gain: { contrib: 24, exp: 16 }, log: "你以碎石封缝，低语渐息。" }
    ] },
    { title: "古道商灯", loc: "pass", text: "商队灯火在风里连成一线，领队邀你同饮一碗热汤。", choices: [
      { label: "同饮热汤", gain: { hp: 28, exp: 10 }, log: "一碗热汤入腹，寒意散去不少。" },
      { label: "婉拒守夜", gain: { silver: 24, exp: 16 }, log: "你替商队守了半夜，领队悄悄塞来银钱。" }
    ] },
    { title: "雨中剑痕", loc: "sect", text: "石阶上旧剑痕被雨水浸亮，像有新意浮出。", choices: [
      { label: "临摹剑痕", gain: { cultivation: 52 }, log: "你以指代剑，悟到青岚剑法的一分转折。" },
      { label: "请教师父", cost: { contrib: 10 }, gain: { cultivation: 68 }, log: "师父看了一眼剑痕，点破其中杀机。" }
    ] },
    { title: "渡口空船", loc: "town", text: "渡口有空船轻撞木桩，船舱里放着一封未署名的信。", choices: [
      { label: "送往衙门", gain: { exp: 18, silver: 10 }, log: "衙役接过信，提醒你近日别走夜路。" },
      { label: "拆信查看", gain: { exp: 26 }, log: "信中只写着三个地名，你隐约串起一条路线。" }
    ] },
    { title: "草间银针", loc: "forest", text: "草叶间一闪，竟是一枚极细银针。", choices: [
      { label: "收入囊中", gain: { exp: 14, cultivation: 20 }, log: "你把银针夹入书页，揣摩其发力角度。" },
      { label: "原地避开", gain: { hp: 16 }, log: "你避开暗器，暗自庆幸没有莽撞。" }
    ] },
    { title: "碑下赌局", loc: "pass", text: "几名江湖客围着断碑下注，说等的是一个敢拔刀的人。", choices: [
      { label: "拔刀入局", risk: "graveRobber", gain: { silver: 42, exp: 20 }, log: "你入局胜出，却也招来盗墓客的记恨。" },
      { label: "记下盘口", gain: { exp: 22 }, log: "你没下注，只听懂了谁在幕后操盘。" }
    ] },
    { title: "回声传剑", loc: "valley", text: "你在谷中出剑，岩壁把剑啸一层层递回，竟像有人隔空拆招。", choices: [
      { label: "顺势再攻", gain: { cultivation: 60, exp: 18 }, log: "你借回声辨出出剑迟滞处，剑路更畅。" },
      { label: "收剑静听", gain: { mp: 24, exp: 16 }, log: "你收剑听风，心神反而安定下来。" }
    ] },
    { title: "冷泉石匣", loc: "valley", text: "冷泉旁有一只半沉石匣，匣盖被水苔封住。", choices: [
      { label: "以内力震开", cost: { mp: 14 }, item: "manual", gain: { exp: 24 }, log: "石匣应声而开，里面是一页被蜡封住的残谱。" },
      { label: "带回门派", gain: { contrib: 34, exp: 12 }, log: "执事认出石匣旧制，记下你的功劳。" }
    ] }
  ]
};

function defaultState() {
  return {
    name: "沈青",
    title: "青岚外门弟子",
    location: "town",
    idle: "meditate",
    dayMinutes: 6 * 60,
    lastSaved: Date.now(),
    hp: 128,
    mp: 82,
    base: { maxHp: 128, maxMp: 82, atk: 18, def: 8, agi: 10, hit: 86, crit: 5 },
    resources: { silver: 45, cultivation: 80, exp: 0, contrib: 20 },
    skills: Object.fromEntries(DATA.skills.map((skill, index) => [skill.id, index < 3 ? 1 : 0])),
    inventory: { salve: 2, herb: 1 },
    equipment: { weapon: null, armor: null },
    log: ["你拜入青岚剑派，领了两帖金疮药，一柄旧木剑，江湖从此有了你的名字。"],
    seenEvents: {},
    kills: 0
  };
}

let state = loadState();
let selectedSkill = DATA.skills[0].id;
let combat = null;

const $ = (id) => document.getElementById(id);
const fmt = (n) => Math.floor(n).toLocaleString("zh-CN");
const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

function loadState() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return defaultState();
    const parsed = JSON.parse(raw);
    return { ...defaultState(), ...parsed, lastSaved: parsed.lastSaved || Date.now() };
  } catch {
    return defaultState();
  }
}

function saveState(silent = false) {
  state.lastSaved = Date.now();
  localStorage.setItem(SAVE_KEY, JSON.stringify(state));
  if (!silent) addLog("进度已保存。");
}

function addLog(text) {
  state.log.unshift(`[${timeLabel()}] ${text}`);
  state.log = state.log.slice(0, 90);
  renderLog();
}

function timeLabel() {
  const day = Math.floor(state.dayMinutes / 1440) + 1;
  const minuteOfDay = state.dayMinutes % 1440;
  const hour = Math.floor(minuteOfDay / 60);
  const phase = hour < 6 ? "夜深" : hour < 11 ? "清晨" : hour < 15 ? "午后" : hour < 19 ? "黄昏" : "入夜";
  return `第 ${day} 日 · ${phase}`;
}

function getSkillLevel(id) {
  return state.skills[id] || 0;
}

function statMods() {
  const mods = { maxHp: 0, maxMp: 0, atk: 0, def: 0, agi: 0, hit: 0, crit: 0, heal: 0, control: 0, luck: 0 };
  for (const skill of DATA.skills) {
    const lv = getSkillLevel(skill.id);
    if (!lv) continue;
    if (skill.stat === "mp") {
      mods.maxMp += lv * 9;
      mods.def += Math.floor(lv / 2);
    } else if (skill.stat === "atk") {
      mods.atk += lv * 3;
    } else if (skill.stat === "def") {
      mods.def += lv * 3;
      mods.maxHp += lv * 8;
    } else if (skill.stat === "agi") {
      mods.agi += lv * 3;
    } else if (skill.stat === "hit") {
      mods.hit += lv * 3;
    } else if (skill.stat === "crit") {
      mods.crit += lv * 2;
    } else {
      mods[skill.stat] += lv * 2;
    }
  }
  for (const itemId of Object.values(state.equipment)) {
    if (!itemId) continue;
    const equip = DATA.items[itemId]?.equip || {};
    for (const [key, value] of Object.entries(equip)) {
      if (key !== "slot") mods[key] = (mods[key] || 0) + value;
    }
  }
  return mods;
}

function stats() {
  const mods = statMods();
  return {
    maxHp: state.base.maxHp + mods.maxHp,
    maxMp: state.base.maxMp + mods.maxMp,
    atk: state.base.atk + mods.atk,
    def: state.base.def + mods.def,
    agi: state.base.agi + mods.agi,
    hit: state.base.hit + mods.hit,
    crit: state.base.crit + mods.crit,
    heal: mods.heal,
    control: mods.control,
    luck: mods.luck
  };
}

function addGain(gain = {}, multiplier = 1) {
  const current = stats();
  for (const [key, raw] of Object.entries(gain)) {
    const value = Math.floor(raw * multiplier);
    if (key === "hp") state.hp = clamp(state.hp + value, 0, current.maxHp);
    else if (key === "mp") state.mp = clamp(state.mp + value, 0, current.maxMp);
    else state.resources[key] = Math.max(0, (state.resources[key] || 0) + value);
  }
}

function canPay(cost = {}) {
  const current = stats();
  for (const [key, value] of Object.entries(cost)) {
    if (key === "hp" && state.hp < value) return false;
    if (key === "mp" && state.mp < value) return false;
    if (key !== "hp" && key !== "mp" && (state.resources[key] || 0) < value) return false;
  }
  return current;
}

function pay(cost = {}) {
  if (!canPay(cost)) return false;
  for (const [key, value] of Object.entries(cost)) {
    if (key === "hp") state.hp -= value;
    else if (key === "mp") state.mp -= value;
    else state.resources[key] -= value;
  }
  return true;
}

function addItem(id, count = 1) {
  state.inventory[id] = (state.inventory[id] || 0) + count;
}

function removeItem(id, count = 1) {
  state.inventory[id] = Math.max(0, (state.inventory[id] || 0) - count);
  if (!state.inventory[id]) delete state.inventory[id];
}

function applyIdle(minutes, silent = false) {
  const idle = DATA.idleActions[state.idle];
  if (!idle) return {};
  const gained = {};
  const current = stats();
  for (const [key, rate] of Object.entries(idle.perMinute)) {
    const amount = rate * minutes;
    gained[key] = amount;
  }
  addGain(gained);
  state.mp = clamp(state.mp, 0, current.maxMp);
  state.hp = clamp(state.hp + minutes * 0.04 + statMods().heal * minutes * 0.01, 0, current.maxHp);
  state.dayMinutes += Math.floor(minutes);
  if (!silent && Math.random() < .2) maybeIdleEvent();
  return gained;
}

function maybeIdleEvent() {
  if (state.idle === "patrol") {
    addGain({ contrib: 8, exp: 6 });
    addLog("巡值时你扶起摔倒的香客，执事给你添了几笔门贡。");
  } else if (state.idle === "forage") {
    if (Math.random() < .45) {
      addItem("herb", 1);
      addLog("你在林间采到一株止血草。");
    } else {
      addLog("林风骤起，你避过一处兽夹，阅历略有增长。");
      addGain({ exp: 8 });
    }
  }
}

function processOffline() {
  const elapsed = Date.now() - state.lastSaved;
  const minutes = Math.min(12 * 60, Math.floor(elapsed / 1000 / 60));
  if (minutes < 3) return;
  const gained = applyIdle(minutes, true);
  const parts = Object.entries(gained)
    .filter(([, value]) => Math.floor(Math.abs(value)) > 0)
    .map(([key, value]) => `${resourceName(key)} ${fmt(Math.max(0, value))}`);
  $("offlineNotice").classList.remove("hidden");
  $("offlineNotice").textContent = `离线 ${minutes} 分钟，${DATA.idleActions[state.idle].name}获得：${parts.join("、") || "些许调息"}。`;
  addLog(`离线结算 ${minutes} 分钟，${parts.join("、") || "心神稍定"}。`);
}

function resourceName(key) {
  return ({ silver: "银两", cultivation: "修为", exp: "阅历", contrib: "门贡", hp: "气血", mp: "内力" })[key] || key;
}

function renderAll() {
  const current = stats();
  const loc = DATA.locations[state.location];
  state.hp = clamp(state.hp, 0, current.maxHp);
  state.mp = clamp(state.mp, 0, current.maxMp);

  $("heroName").textContent = state.name;
  $("heroTitle").textContent = state.title;
  $("hpBar").style.width = `${(state.hp / current.maxHp) * 100}%`;
  $("mpBar").style.width = `${(state.mp / current.maxMp) * 100}%`;
  $("hpText").textContent = `${fmt(state.hp)} / ${fmt(current.maxHp)}`;
  $("mpText").textContent = `${fmt(state.mp)} / ${fmt(current.maxMp)}`;
  $("silverText").textContent = fmt(state.resources.silver);
  $("cultText").textContent = fmt(state.resources.cultivation);
  $("expText").textContent = fmt(state.resources.exp);
  $("contribText").textContent = fmt(state.resources.contrib);
  $("locationName").textContent = loc.name;
  $("locationDesc").textContent = loc.desc;
  $("dangerText").textContent = loc.danger;
  $("idleMode").textContent = `当前：${DATA.idleActions[state.idle].name}`;
  $("dayText").textContent = timeLabel();
  $("realmTag").textContent = realmName();

  renderMap();
  renderIdle();
  renderLocationActions();
  renderEnemies();
  renderSkills();
  renderInventory();
  renderStats();
  renderLog();
  renderRecentLog();
}

function renderMap() {
  const box = $("mapButtons");
  box.innerHTML = "";
  for (const [id, loc] of Object.entries(DATA.locations)) {
    const btn = document.createElement("button");
    btn.innerHTML = `<strong>${loc.name}</strong><br><small>${loc.danger} · ${loc.desc}</small>`;
    btn.disabled = id === state.location;
    btn.addEventListener("click", () => {
      state.location = id;
      addGain({ exp: 3 });
      addLog(`你动身前往${loc.name}。`);
      renderAll();
      saveState(true);
    });
    box.append(btn);
  }
}

function renderIdle() {
  const box = $("idleActions");
  box.innerHTML = "";
  for (const [id, idle] of Object.entries(DATA.idleActions)) {
    const btn = document.createElement("button");
    btn.innerHTML = `<strong>${idle.name}</strong><br><small>${idle.desc}</small>`;
    btn.disabled = id === state.idle;
    btn.addEventListener("click", () => {
      state.idle = id;
      addLog(`你将日常安排改为：${idle.name}。`);
      renderAll();
      saveState(true);
    });
    box.append(btn);
  }
}

function renderLocationActions() {
  const box = $("locationActions");
  box.innerHTML = "";
  const loc = DATA.locations[state.location];
  for (const action of loc.actions) {
    const btn = document.createElement("button");
    const cost = action.cost ? `耗：${describeGain(action.cost)}` : "无需花费";
    btn.innerHTML = `<strong>${action.name}</strong><br><small>${cost}</small>`;
    btn.disabled = !canPay(action.cost);
    btn.addEventListener("click", () => runLocationAction(action));
    box.append(btn);
  }
}

function describeGain(gain = {}) {
  return Object.entries(gain).map(([key, value]) => `${resourceName(key)} ${fmt(value)}`).join("、");
}

function runLocationAction(action) {
  if (!pay(action.cost)) return;
  if (action.gain) addGain(action.gain);
  if (action.item && (action.chance === undefined || Math.random() < action.chance)) addItem(action.item, action.count || 1);
  addLog(action.text);
  if (action.combat) startCombat(action.combat);
  if (action.risk && Math.random() < .38) startCombat(action.risk);
  state.dayMinutes += 24;
  renderAll();
  saveState(true);
}

function renderEnemies() {
  const box = $("enemyList");
  box.innerHTML = "";
  for (const enemyId of DATA.locations[state.location].enemies) {
    const enemy = DATA.enemies[enemyId];
    const btn = document.createElement("button");
    btn.innerHTML = `<strong>挑战${enemy.name}</strong><br><small>气血 ${enemy.hp} · 攻 ${enemy.atk} · 防 ${enemy.def}</small>`;
    btn.addEventListener("click", () => startCombat(enemyId));
    box.append(btn);
  }
}

function startCombat(enemyId) {
  const enemy = { ...DATA.enemies[enemyId], id: enemyId, hpNow: DATA.enemies[enemyId].hp };
  combat = { enemy, lines: [`你与${enemy.name}交上了手。`] };
  $("combatStatus").textContent = `对手：${enemy.name}`;
  for (let round = 1; round <= 12 && enemy.hpNow > 0 && state.hp > 0; round++) {
    combatRound(enemy, round);
  }
  if (enemy.hpNow <= 0) winCombat(enemy);
  else if (state.hp <= 0) loseCombat(enemy);
  else combat.lines.unshift("双方各退半步，此战暂歇。");
  renderCombat();
  renderAll();
  saveState(true);
}

function combatRound(enemy, round) {
  const current = stats();
  const hitChance = clamp((current.hit + current.agi - enemy.agi * 2) / 100, .42, .93);
  if (Math.random() < hitChance) {
    const crit = Math.random() < (current.crit + statMods().luck) / 100;
    const control = statMods().control && Math.random() < statMods().control / 100;
    let dmg = Math.max(3, current.atk + rand(1, 10) - enemy.def);
    if (crit) dmg = Math.floor(dmg * 1.55);
    enemy.hpNow -= dmg;
    combat.lines.unshift(`第${round}合，你${crit ? "觑准破绽，" : ""}一招得手，伤其 ${dmg} 点。`);
    if (control) {
      combat.lines.unshift(`你以擒拿牵住对方腕脉，${enemy.name}这一息难以反击。`);
      return;
    }
  } else {
    combat.lines.unshift(`第${round}合，你攻势落空。`);
  }
  if (enemy.hpNow <= 0) return;
  const enemyHit = clamp((70 + enemy.agi - current.agi) / 100, .35, .88);
  if (Math.random() < enemyHit) {
    const dmg = Math.max(2, enemy.atk + rand(0, 8) - current.def);
    state.hp -= dmg;
    combat.lines.unshift(`${enemy.name}还了一击，你受伤 ${dmg} 点。`);
  } else {
    combat.lines.unshift(`${enemy.name}反击被你闪开。`);
  }
}

function winCombat(enemy) {
  addGain(enemy.reward);
  state.kills += 1;
  combat.lines.unshift(`${enemy.name}败退。你获得${describeGain(enemy.reward)}。`);
  if (enemy.drop && Math.random() < enemy.drop.chance) {
    addItem(enemy.drop.item, 1);
    combat.lines.unshift(`你拾得${DATA.items[enemy.drop.item].name}。`);
  }
  addLog(`你击败${enemy.name}，${describeGain(enemy.reward)}入账。`);
}

function loseCombat(enemy) {
  state.hp = Math.max(1, Math.floor(stats().maxHp * .22));
  state.resources.silver = Math.max(0, state.resources.silver - 18);
  combat.lines.unshift(`你不敌${enemy.name}，被路人救回。损失 18 银两。`);
  addLog(`你败给${enemy.name}，醒来时已在路边茶棚。`);
}

function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function renderCombat() {
  $("combatLog").innerHTML = combat ? combat.lines.slice(0, 12).map((line) => `<div>${line}</div>`).join("") : "";
}

function renderSkills() {
  const list = $("skillList");
  list.innerHTML = "";
  for (const skill of DATA.skills) {
    const lv = getSkillLevel(skill.id);
    const card = document.createElement("button");
    card.className = "skill-card";
    card.innerHTML = `<strong>${skill.name}</strong><span class="tag quiet">${skill.type}</span><p>${skill.desc}</p><b>第 ${lv} / ${skill.max} 重</b>`;
    card.addEventListener("click", () => {
      selectedSkill = skill.id;
      renderSkillDetail();
    });
    list.append(card);
  }
  renderSkillDetail();
}

function renderSkillDetail() {
  const skill = DATA.skills.find((item) => item.id === selectedSkill);
  const lv = getSkillLevel(skill.id);
  const cost = skill.baseCost * (lv + 1);
  $("selectedSkillTag").textContent = `${skill.type} · 第 ${lv} 重`;
  $("skillDetail").innerHTML = `
    <p>${skill.desc}</p>
    <div class="move-list">
      ${skill.moves.map((move, index) => `<div class="move"><strong>${move}</strong><br><span>${index < lv ? "已悟" : "未悟"} · ${index + 1} 式</span></div>`).join("")}
    </div>
    <button id="learnSkillBtn">${lv >= skill.max ? "已臻上限" : `耗 ${fmt(cost)} 修为修习`}</button>
  `;
  const btn = $("learnSkillBtn");
  btn.disabled = lv >= skill.max || state.resources.cultivation < cost;
  btn.addEventListener("click", () => learnSkill(skill, cost));
}

function learnSkill(skill, cost) {
  if (state.resources.cultivation < cost || getSkillLevel(skill.id) >= skill.max) return;
  state.resources.cultivation -= cost;
  state.skills[skill.id] = getSkillLevel(skill.id) + 1;
  addGain({ exp: 5 + getSkillLevel(skill.id) * 2 });
  addLog(`你修习${skill.name}至第 ${getSkillLevel(skill.id)} 重。`);
  renderAll();
  saveState(true);
}

function renderInventory() {
  const list = $("inventoryList");
  const items = Object.entries(state.inventory);
  $("itemCount").textContent = `${items.reduce((sum, [, count]) => sum + count, 0)} 件`;
  list.innerHTML = "";
  if (!items.length) {
    list.innerHTML = `<div class="item"><p>行囊空空，正适合装下新的故事。</p></div>`;
  }
  for (const [id, count] of items) {
    const item = DATA.items[id];
    const row = document.createElement("div");
    row.className = "item";
    row.innerHTML = `<strong>${item.name} × ${count}</strong><p>${item.type} · ${item.desc}</p>`;
    const actions = document.createElement("div");
    actions.className = "button-grid";
    if (item.use) {
      const use = document.createElement("button");
      use.textContent = "使用";
      use.addEventListener("click", () => {
        addGain(item.use);
        removeItem(id);
        addLog(`你使用了${item.name}。`);
        renderAll();
        saveState(true);
      });
      actions.append(use);
    }
    if (item.equip) {
      const equip = document.createElement("button");
      equip.textContent = "装备";
      equip.addEventListener("click", () => equipItem(id));
      actions.append(equip);
    }
    row.append(actions);
    list.append(row);
  }
  renderEquipment();
}

function equipItem(id) {
  const item = DATA.items[id];
  const slot = item.equip.slot;
  const old = state.equipment[slot];
  state.equipment[slot] = id;
  removeItem(id);
  if (old) addItem(old, 1);
  addLog(`你装备了${item.name}。`);
  renderAll();
  saveState(true);
}

function renderEquipment() {
  const box = $("equipList");
  box.innerHTML = "";
  for (const slot of ["weapon", "armor"]) {
    const id = state.equipment[slot];
    const item = DATA.items[id];
    const row = document.createElement("div");
    row.className = "equip";
    row.innerHTML = `<strong>${slot === "weapon" ? "兵器" : "衣甲"}：${item ? item.name : "未装备"}</strong><p>${item ? item.desc : "暂无加成。"}</p>`;
    if (item) {
      const btn = document.createElement("button");
      btn.textContent = "卸下";
      btn.addEventListener("click", () => {
        state.equipment[slot] = null;
        addItem(id, 1);
        addLog(`你卸下了${item.name}。`);
        renderAll();
        saveState(true);
      });
      row.append(btn);
    }
    box.append(row);
  }
}

function renderStats() {
  const current = stats();
  const rows = [
    ["境界", realmName()],
    ["气血上限", current.maxHp],
    ["内力上限", current.maxMp],
    ["攻击", current.atk],
    ["防御", current.def],
    ["身法", current.agi],
    ["命中", `${current.hit}%`],
    ["会心", `${current.crit}%`],
    ["胜场", state.kills],
    ["地点", DATA.locations[state.location].name]
  ];
  $("statsList").innerHTML = rows.map(([key, value]) => `<div class="stat"><span>${key}</span><b>${value}</b></div>`).join("");
}

function realmName() {
  const exp = state.resources.exp;
  if (exp > 1200) return "江湖一流";
  if (exp > 700) return "登堂入室";
  if (exp > 320) return "初窥门径";
  if (exp > 120) return "略有小成";
  return "未入流";
}

function renderLog() {
  $("eventLog").innerHTML = state.log.map((line) => `<div>${line}</div>`).join("");
}

function renderRecentLog() {
  const target = $("recentLog");
  if (!target) return;
  target.innerHTML = state.log.slice(0, 6).map((line) => `<div>${line}</div>`).join("");
}

function triggerEvent() {
  const pool = DATA.events.filter((event) => event.loc === state.location);
  const event = pick(pool);
  state.seenEvents[event.title] = (state.seenEvents[event.title] || 0) + 1;
  $("choiceTitle").textContent = event.title;
  $("choiceText").textContent = event.text;
  const options = $("choiceOptions");
  options.innerHTML = "";
  for (const choice of event.choices) {
    const btn = document.createElement("button");
    btn.value = "close";
    btn.textContent = choice.label;
    btn.disabled = !canPay(choice.cost);
    btn.addEventListener("click", () => {
      if (!pay(choice.cost)) return;
      if (choice.gain) addGain(choice.gain);
      if (choice.item) addItem(choice.item, 1);
      addLog(choice.log);
      if (choice.risk && Math.random() < .5) startCombat(choice.risk);
      state.dayMinutes += 18;
      renderAll();
      saveState(true);
    });
    options.append(btn);
  }
  $("choiceDialog").showModal();
}

function setupEvents() {
  document.querySelectorAll(".bottom-tabs button").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".bottom-tabs button").forEach((item) => item.classList.remove("active"));
      document.querySelectorAll(".view").forEach((view) => view.classList.remove("active"));
      btn.classList.add("active");
      $(`view${btn.dataset.tab[0].toUpperCase()}${btn.dataset.tab.slice(1)}`).classList.add("active");
    });
  });
  $("exploreBtn").addEventListener("click", () => triggerEvent());
  $("saveBtn").addEventListener("click", () => saveState());
  $("exportBtn").addEventListener("click", async () => {
    const text = JSON.stringify(state, null, 2);
    await navigator.clipboard.writeText(text);
    addLog("存档 JSON 已复制到剪贴板。");
  });
  $("resetBtn").addEventListener("click", () => {
    if (!confirm("确定要重开？当前本地存档会被清除。")) return;
    localStorage.removeItem(SAVE_KEY);
    state = defaultState();
    combat = null;
    renderAll();
    saveState(true);
  });
  $("clearLogBtn").addEventListener("click", () => {
    state.log = [];
    renderLog();
    saveState(true);
  });
  $("sectTaskBtn").addEventListener("click", () => {
    const tasks = [
      { text: "你替师门送信到平安镇，途中没有耽搁。", gain: { contrib: 20, silver: 10, exp: 10 } },
      { text: "你校点藏书阁残卷，意外发现一段批注。", gain: { contrib: 14, cultivation: 38, exp: 8 } },
      { text: "你随执事清查山道，驱走几名可疑探子。", gain: { contrib: 24, exp: 18 } }
    ];
    const task = pick(tasks);
    addGain(task.gain);
    addLog(task.text);
    renderAll();
    saveState(true);
  });
  $("healBtn").addEventListener("click", () => {
    const cost = Math.max(6, Math.floor((stats().maxHp - state.hp) / 9));
    if (!pay({ silver: cost })) {
      addLog("药庐童子摇头：银两不足，药炉也要添柴。");
      renderAll();
      return;
    }
    state.hp = stats().maxHp;
    state.mp = stats().maxMp;
    addLog(`你在药庐调息，花费 ${cost} 银两，气血与内力尽复。`);
    renderAll();
    saveState(true);
  });
}

function tick() {
  applyIdle(GAME_MINUTES_PER_TICK / 60);
  renderAll();
  saveState(true);
}

setupEvents();
processOffline();
renderAll();
setInterval(tick, TICK_MS);
