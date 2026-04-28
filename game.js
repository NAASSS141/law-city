
const $ = (id) => document.getElementById(id);
const STORAGE_KEY = "lawCityStateV5";
const TOTAL_EVIDENCE = 18;

const chapters = [
  { id:"case1", title:"第一案：雨夜证词", phases:["调查阶段","会见阶段","推理阶段","庭审阶段","终局"] },
  { id:"case2", title:"第二案：沉默账本", phases:["医院调查","码头追踪","推理阶段","庭审阶段","终局"] }
];

const evidenceMeta = {
  "破损监控记录":["📹","47 秒黑屏不是偶然。"],
  "逆向轮胎水痕":["🛞","受害人可能先在店外遇袭。"],
  "22:13 小票":["🧾","时间线出现裂缝。"],
  "二次出血痕迹":["🩸","现场被移动过。"],
  "店内网络异常":["📡","有人阻断了报警。"],
  "未发送语音":["📱","苏岚看见了黑车。"],
  "店长删改指令":["🧷","证词背后还有权力。"],
  "匿名来电记录":["☎️","陈巍被引导离开路线。"],
  "袖口机油":["🧥","他触碰过电箱。"],
  "伪造订单提醒":["🛵","有人设计了他的出现。"],
  "黑车车牌残片":["🚗","黑车不是幻觉。"],
  "保险柜合同":["📄","受害人与店长存在债务纠纷。"],
  "医院缴费单":["🏥","受害人曾替某人支付医药费。"],
  "护士交班记录":["📋","午夜有陌生人调走病历。"],
  "残缺账本页":["📒","账本记录了仓库、药品和现金流。"],
  "码头监控截图":["🌊","黑车在旧码头仓库停留过。"],
  "货柜封条":["🔒","封条编号与账本页吻合。"],
  "私家侦探录音":["🎙️","乔衡不是终点，只是中间人。"]
};

const combos = [
  { id:"timeline", caseId:"case1", title:"重构案发时间线", req:["破损监控记录","22:13 小票","匿名来电记录"], result:"组合推理：陈巍不是伏击者", text:"监控黑屏发生在陈巍离开路线之后，小票证明受害人仍在店内，匿名来电则把陈巍重新引回现场。", truth:2 },
  { id:"sceneMoved", caseId:"case1", title:"证明现场被二次处理", req:["逆向轮胎水痕","二次出血痕迹","未发送语音"], result:"组合推理：店外黑车袭击", text:"水痕、二次出血和苏岚未发送语音互相咬合：第一次袭击发生在店外，随后有人把伤者移动到便利店制造目击误导。", truth:3, ethics:1 },
  { id:"manager", caseId:"case1", title:"锁定店长乔衡的动机", req:["店长删改指令","保险柜合同","黑车车牌残片"], result:"组合推理：店长与黑车有关", text:"店长删改监控不是为了保护店铺声誉。合同显示他与受害人存在债务纠纷，车牌残片把他的沉默接到黑车尾灯上。", truth:3 },
  { id:"hospital", caseId:"case2", title:"医院线索指向账本", req:["医院缴费单","护士交班记录","残缺账本页"], result:"组合推理：受害人掌握地下账本", text:"缴费单说明受害人不是单纯债务人，交班记录显示病历被调走，账本页解释了有人为何急于灭口。", truth:3, ethics:1 },
  { id:"dock", caseId:"case2", title:"旧码头不是交易终点", req:["码头监控截图","货柜封条","私家侦探录音"], result:"组合推理：幕后委托人浮出", text:"黑车、货柜和录音合在一起，说明乔衡只是清理现场的人，真正指令来自旧码头背后的委托人。", truth:4 }
];

const achievementsMeta = {
  firstEvidence:{ title:"初次取证", desc:"获得第一条证据。" },
  evidenceHunter:{ title:"线索猎人", desc:"收集 10 条证据。" },
  fullArchive:{ title:"全卷宗", desc:"收集全部 18 条证据。" },
  case1Closer:{ title:"第一案结案", desc:"完成第一案真相结局。" },
  case2Closer:{ title:"最终结局", desc:"完成第二案最终结局。" },
  comboApprentice:{ title:"推理入门", desc:"完成任意 1 条组合推理。" },
  comboMaster:{ title:"链条大师", desc:"完成全部组合推理。" },
  ethicsHigh:{ title:"正义倾向", desc:"正义值达到 5。" }
};

const endingsMeta = {
  "第一案真相结局：雨停之前": { rank:"A", desc:"你撬开了第一案的真正裂缝，并解锁第二案。" },
  "最终结局：法域之城": { rank:"S", desc:"你揭开整条利益链，让真相在法庭上完整闭环。" },
  "证据不足：真相隔着一层雾": { rank:"C", desc:"你触碰到了方向，但链条还未闭合。" },
  "部分胜利：裂缝被撬开": { rank:"B", desc:"你撬开了异常，却没能锁定完整责任链。" },
  "错误结局：偏见判词": { rank:"D", desc:"你选择了偏见，而不是证据。" }
};

const scenes = {
  city: {
    caseId:"case1", phase:"调查阶段", name: "商业区路口", art: "./assets/scene_city.svg",
    desc: "霓虹与警戒线在雨水里扭成一团。这里发生过追逐，也发生过沉默。",
    locks:["建议先拿到：监控、轮胎水痕。", "找到 4 条证据后，会解锁律所证据墙。"],
    actions: [
      { id:"camera", icon:"📹", title:"路口监控探头", text:"查看缺失的 47 秒", evidence:"破损监控记录", truth:1, say:"监控在 22:14:03 到 22:14:50 之间黑屏。不是停电，是有人剪断了旁路电源。" },
      { id:"tyre", icon:"🛞", title:"斑马线地面", text:"检视轮胎水痕", evidence:"逆向轮胎水痕", truth:1, say:"水痕从便利店门口反向拖出，说明倒地者可能先被车撞倒，再被人补了一刀。" },
      { id:"plate", icon:"🚗", title:"排水沟反光物", text:"捡起车牌碎片", evidence:"黑车车牌残片", truth:1, require:["未发送语音"], locked:"需要先从苏岚那里获得黑车信息。", say:"碎片边缘新鲜，编号只剩后三位：7K2。苏岚说的黑车，开始有了骨头。" },
      { id:"store", icon:"🏪", title:"前往便利店", text:"寻找店员苏岚", goto:"store", say:"便利店灯还亮着，货架之间藏着比雨声更碎的呼吸。" },
      { id:"meeting", icon:"🪑", title:"会见嫌疑人", text:"询问外卖骑手陈巍", goto:"meeting", say:"陈巍已经被警方控制。他说自己只是捡起了刀。" },
      { id:"office", icon:"🧠", title:"返回律所", text:"整理证据链", goto:"office", requireCount:4, locked:"至少收集 4 条证据后解锁。" }
    ]
  },
  store: {
    caseId:"case1", phase:"调查阶段", name: "便利店现场", art: "./assets/scene_store.svg",
    desc: "货架整齐得反常，血迹却在冷白灯下开成一朵暗红的花。",
    locks:["询问苏岚可获得黑车线索。", "店长办公室需要苏岚证词或网络异常作为突破口。"],
    actions: [
      { id:"receipt", icon:"🧾", title:"收银台小票", text:"核对付款时间", evidence:"22:13 小票", truth:1, say:"小票显示受害人在 22:13 购买了止痛药。陈巍的配送记录却显示他 22:12 已经离开路口。" },
      { id:"blood", icon:"🩸", title:"地面血迹", text:"观察血滴方向", evidence:"二次出血痕迹", truth:1, say:"血迹有两组方向，一组来自门口，一组来自货架尽头。现场被移动过。" },
      { id:"network", icon:"📡", title:"路由器日志", text:"查看店内网络", evidence:"店内网络异常", truth:1, say:"22:14 至 22:17，店内网络被强制断开。报警迟滞不是巧合。" },
      { id:"sulan", icon:"👩‍💼", title:"询问苏岚", text:"便利店店员", dialogue:"sulan" },
      { id:"manager", icon:"🗄️", title:"店长办公室", text:"检查保险柜", evidence:"保险柜合同", truth:1, requireAny:["店长删改指令","店内网络异常"], locked:"需要先获得删改指令或网络异常。", say:"保险柜里有一份旧合同。受害人曾向店长乔衡借款，利息像藤蔓一样爬满每页纸。" },
      { id:"city", icon:"↩️", title:"返回路口", text:"继续调查外围", goto:"city" }
    ]
  },
  meeting: {
    caseId:"case1", phase:"会见阶段", name: "会见室", art: "./assets/scene_meeting.svg",
    desc: "玻璃隔开声音，也隔开恐惧。陈巍的手一直攥着袖口。",
    locks:["陈巍有动机，但动机不是定罪。", "完成第一案真相结局后，会解锁第二案。"],
    actions: [
      { id:"phone", icon:"📱", title:"手机通话记录", text:"要求调取", evidence:"匿名来电记录", truth:1, ethics:1, say:"陈巍在案发前接到一通匿名电话。对方只说了六个字：别进店，往回走。" },
      { id:"stain", icon:"🧥", title:"外套污渍", text:"检查袖口", evidence:"袖口机油", truth:1, say:"袖口不是血，是机油。和路口被剪断的监控电箱吻合。" },
      { id:"chen", icon:"🧍", title:"追问陈巍", text:"询问当晚细节", dialogue:"chen" },
      { id:"office", icon:"🧠", title:"返回律所", text:"整理证据链", goto:"office", requireCount:4, locked:"至少收集 4 条证据后解锁。" },
      { id:"court", icon:"⚖️", title:"进入法庭对决", text:"提交已有证据", goto:"court", requireCount:7, locked:"至少收集 7 条证据后解锁。" }
    ]
  },
  office: {
    caseId:"hub", phase:"推理阶段", name:"律所办公室", art:"./assets/scene_office.svg",
    desc:"证据墙像一片人造星图。每个钉子都是事实，每根线都是你承担的判断。",
    locks:["在这里进行证据组合，组合推理会影响最终结局。"],
    actions:[
      { id:"combo", icon:"🧠", title:"证据组合", text:"打开推理面板", special:"combo" },
      { id:"notebook", icon:"📓", title:"案件笔记", text:"查看所有线索", special:"notebook" },
      { id:"map", icon:"🗺️", title:"城市地图", text:"选择已解锁地点", special:"map" },
      { id:"court", icon:"⚖️", title:"第一案法庭", text:"提交雨夜证词", goto:"court", requireCount:7, locked:"至少收集 7 条证据后解锁。" },
      { id:"hospital", icon:"🏥", title:"第二案：云港医院", text:"追踪沉默账本", goto:"hospital", requireCase:"case1", locked:"需要先完成第一案真相结局。" },
      { id:"dock", icon:"🌊", title:"第二案：旧码头", text:"追踪黑车去向", goto:"dock", requireCase:"case1", locked:"需要先完成第一案真相结局。" }
    ]
  },
  court: {
    caseId:"case1", phase:"庭审阶段", name: "第一案法庭", art: "./assets/scene_court.svg",
    desc: "灯光落下，所有证词都被迫显形。你必须指出真正的矛盾。",
    locks:["好结局需要关键证据和至少 3 个第一案组合推理。"],
    actions: [
      { id:"final1", icon:"📜", title:"终案推理", text:"选择核心矛盾", dialogue:"final1" },
      { id:"office", icon:"↩️", title:"回到律所", text:"补充证据组合", goto:"office" }
    ]
  },
  hospital: {
    caseId:"case2", phase:"医院调查", name:"云港医院", art:"./assets/scene_hospital.svg",
    desc:"白色走廊把人的脚步声磨得很薄。病历、缴费单和夜班记录安静地互相隐瞒。",
    locks:["第二案已开启：受害人的死亡也许只是账本上的一笔删除线。"],
    actions:[
      { id:"bill", icon:"🏥", title:"自助缴费机", text:"查找受害人记录", evidence:"医院缴费单", truth:1, say:"缴费单显示受害人在三个月内替同一名病人支付了六次费用，备注栏只有一个字：桥。" },
      { id:"nurseLog", icon:"📋", title:"护士站交班本", text:"查看午夜记录", evidence:"护士交班记录", truth:1, say:"凌晨 00:41，有人以警方名义调走病历，但韩亦确认警方没有发出过调取申请。" },
      { id:"lina", icon:"👩‍⚕️", title:"询问护士李娜", text:"确认病历去向", dialogue:"lina" },
      { id:"office", icon:"🧠", title:"返回律所", text:"整理医院线索", goto:"office" },
      { id:"dock", icon:"🌊", title:"前往旧码头", text:"追踪账本地址", goto:"dock", require:["残缺账本页"], locked:"需要先获得账本页。" }
    ]
  },
  dock: {
    caseId:"case2", phase:"码头追踪", name:"旧码头仓库", art:"./assets/scene_dock.svg",
    desc:"海风把锈味吹进肺里。仓库外的摄像头低着头，像一个不愿作证的人。",
    locks:["码头线索会连接第一案的黑车与第二案的账本。"],
    actions:[
      { id:"dockCam", icon:"🌊", title:"仓库监控", text:"截取黑车画面", evidence:"码头监控截图", truth:1, say:"截图中，黑车停在 9 号仓库前。车牌尾号 7K2，与商业区残片吻合。" },
      { id:"seal", icon:"🔒", title:"9 号货柜", text:"检查封条编号", evidence:"货柜封条", truth:1, say:"封条编号出现在残缺账本页上。货柜装的不是普通药品，而是被替换过标签的医疗器械。" },
      { id:"moye", icon:"🕵️", title:"会见莫野", text:"私家侦探线人", dialogue:"moye" },
      { id:"office", icon:"🧠", title:"返回律所", text:"整理码头线索", goto:"office" },
      { id:"court2", icon:"⚖️", title:"第二案法庭", text:"提交沉默账本", goto:"court2", requireCount:14, locked:"至少收集 14 条证据后解锁。" }
    ]
  },
  court2: {
    caseId:"case2", phase:"庭审阶段", name:"第二案法庭", art:"./assets/scene_court.svg",
    desc:"这次站上被告席的不是一个人，而是一条穿过医院、码头和便利店的利益链。",
    locks:["好结局需要 2 个第二案组合推理，并完成第一案真相结局。"],
    actions:[
      { id:"final2", icon:"📜", title:"最终庭审", text:"指出幕后结构", dialogue:"final2" },
      { id:"office", icon:"↩️", title:"回到律所", text:"补充证据组合", goto:"office" }
    ]
  }
};

const dialogues = {
  sulan: {
    speaker:"苏岚", role:"便利店店员 / 关键证人", portrait:"./assets/char_sulan.svg",
    text:"我真的没看见他刺人。我只看见那个外卖员冲进来，手里有刀，所有人都在叫。",
    choices:[
      { text:"你为什么没有立刻报警？", response:"因为报警电话一直占线。后来我才知道，店里的网络在那几分钟被人为干扰了。", evidence:"店内网络异常", truth:1 },
      { text:"你的手机里有什么？", response:"苏岚沉默了很久，交出一段未发送语音：‘他不是凶手，店外还有一辆黑车。’", evidence:"未发送语音", truth:2, ethics:1 },
      { text:"你当天为什么那么急？", response:"我母亲在医院。我怕失去工作，所以没有说出店长让我删监控的事。", evidence:"店长删改指令", truth:2 },
      { text:"结束询问", response:"苏岚低下头。她不是没有看见真相，只是不敢承担看见后的代价。" }
    ]
  },
  chen: {
    speaker:"陈巍", role:"外卖骑手 / 嫌疑人", portrait:"./assets/char_chenwei.svg",
    text:"我没刺他。我冲进去的时候刀已经在地上了。我捡起来，是怕别人踩到。",
    choices:[
      { text:"为什么要回到便利店？", response:"有人给我打电话，说我上一单漏了药。可我根本没接过那单。", evidence:"伪造订单提醒", truth:1 },
      { text:"你袖口为什么有机油？", response:"我扶过路口的电箱。那时候监控刚黑，我想看看是不是短路。", truth:1 },
      { text:"你认识受害人吗？", response:"认识。他之前拖欠过我父亲工程款。我恨他，但我没杀他。", ethics:-1 },
      { text:"结束会见", response:"愤怒可以构成动机，但不能代替证据。" }
    ]
  },
  lina:{
    speaker:"李娜", role:"护士 / 医院证人", portrait:"./assets/char_lina.svg",
    text:"病历不是我给出去的。那个人穿着黑色雨衣，说自己是市局的，可他连调取单都没有。",
    choices:[
      { text:"他带走了什么？", response:"一份账本夹在病历里。我只看到第一页，上面写着旧码头 9 号仓。", evidence:"残缺账本页", truth:2 },
      { text:"你为什么现在才说？", response:"我弟弟的手术费，是受害人垫的。有人威胁我，如果我开口，他就被踢出手术名单。", ethics:1 },
      { text:"那个人有什么特征？", response:"他的右手小指缺了一节，袖口有海水和柴油味。", truth:1 },
      { text:"结束询问", response:"李娜握紧笔，像握住一条还没有断掉的线。" }
    ]
  },
  moye:{
    speaker:"莫野", role:"私家侦探 / 旧码头线人", portrait:"./assets/char_moye.svg",
    text:"乔衡？他胆子没那么大。他只会删监控，真正会让人消失的，在码头后面。",
    choices:[
      { text:"你手里有什么？", response:"莫野递来一段录音：‘便利店那边处理干净，账本别进法院。’声音被处理过，但背景里有海雾警报。", evidence:"私家侦探录音", truth:2 },
      { text:"你为什么帮我？", response:"因为受害人也找过我。他说如果自己出事，就让我把账本交给能把话说上法庭的人。", ethics:1 },
      { text:"乔衡负责什么？", response:"他负责引导替罪羊、删监控、拖住警察。刀不是他捅的，账本也不是他要的。", truth:1 },
      { text:"结束会见", response:"莫野点燃一支没有火的烟，只是习惯性地把沉默夹在指间。" }
    ]
  },
  final1: {
    speaker:"陆沉", role:"第一案庭审发问", portrait:"./assets/char_luchen.svg",
    text:"现在必须指出本案真正的裂缝。哪一项证据链能证明陈巍不是唯一在场并接触现场的人？",
    choices:[
      { text:"监控黑屏、伪造订单与店长删改指令形成栽赃链", ending:"case1good", cls:"good" },
      { text:"陈巍与受害人的旧怨足以解释杀人动机", ending:"bad" },
      { text:"便利店小票证明警方时间线有误", ending:"partial" },
      { text:"苏岚没有及时报警，所以她才是凶手", ending:"bad" }
    ]
  },
  final2: {
    speaker:"陆沉", role:"第二案庭审发问", portrait:"./assets/char_luchen.svg",
    text:"现在要证明的不是谁拿了刀，而是谁布置了刀。幕后结构在哪里露出了骨头？",
    choices:[
      { text:"医院账本、码头货柜与私家侦探录音形成委托链", ending:"case2good", cls:"good" },
      { text:"乔衡删了监控，所以全部责任都在乔衡", ending:"partial" },
      { text:"陈巍曾有旧怨，所以第二案无需再查", ending:"bad" },
      { text:"护士李娜延迟作证，说明她主导了案件", ending:"bad" }
    ]
  }
};

let state = {
  scene:"city",
  activeCase:"case1",
  completedCases:[],
  evidence:[],
  deductions:[],
  truth:0,
  ethics:0,
  used:{},
  endings:[],
  achievements:[],
  settings:{ audio:true, ambient:true, typewriter:true }
};

const audio = {
  ctx:null,
  master:null,
  ambientGain:null,
  ambientNodes:[],
  started:false
};

function save(){ localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
function load(){
  const raw = localStorage.getItem(STORAGE_KEY);
  if(raw){ try { state = Object.assign(state, JSON.parse(raw)); } catch(e){} }
  if(!state.settings) state.settings = { audio:true, ambient:true, typewriter:true };
  if(!state.achievements) state.achievements = [];
  if(!state.endings) state.endings = [];
}
function has(name){ return state.evidence.includes(name) || state.deductions.includes(name); }
function caseDone(caseId){ return state.completedCases.includes(caseId); }
function canUse(action){
  if(action.requireCount && state.evidence.length < action.requireCount) return false;
  if(action.require && !action.require.every(has)) return false;
  if(action.requireAny && !action.requireAny.some(has)) return false;
  if(action.requireCase && !caseDone(action.requireCase)) return false;
  return true;
}
function addEvidence(name){ if(name && !state.evidence.includes(name)) state.evidence.push(name); }
function addDeduction(name){ if(name && !state.deductions.includes(name)) state.deductions.push(name); }
function iconFor(e){ return (evidenceMeta[e] || ["🔎","等待与其他证据交叉印证。"])[0]; }
function hintFor(e){ return (evidenceMeta[e] || ["🔎","等待与其他证据交叉印证。"])[1]; }

function ensureAudio(){
  if(audio.started) return;
  const Ctx = window.AudioContext || window.webkitAudioContext;
  if(!Ctx) return;
  audio.ctx = new Ctx();
  audio.master = audio.ctx.createGain();
  audio.master.gain.value = state.settings.audio ? 0.18 : 0;
  audio.master.connect(audio.ctx.destination);
  audio.ambientGain = audio.ctx.createGain();
  audio.ambientGain.gain.value = state.settings.ambient ? 0.10 : 0;
  audio.ambientGain.connect(audio.master);

  const o1 = audio.ctx.createOscillator();
  const o2 = audio.ctx.createOscillator();
  const f = audio.ctx.createBiquadFilter();
  const lfo = audio.ctx.createOscillator();
  const lfoGain = audio.ctx.createGain();
  o1.type = 'sine'; o1.frequency.value = 110;
  o2.type = 'triangle'; o2.frequency.value = 165;
  f.type = 'lowpass'; f.frequency.value = 500;
  lfo.type = 'sine'; lfo.frequency.value = 0.12;
  lfoGain.gain.value = 90;
  lfo.connect(lfoGain); lfoGain.connect(f.frequency);
  o1.connect(f); o2.connect(f); f.connect(audio.ambientGain);
  o1.start(); o2.start(); lfo.start();
  audio.ambientNodes = [o1,o2,lfo,f];
  audio.started = true;
}
function playTone(freq=440, dur=0.08, type='sine', volume=0.08){
  if(!state.settings.audio) return;
  ensureAudio();
  if(!audio.ctx) return;
  if(audio.ctx.state === 'suspended') audio.ctx.resume();
  const osc = audio.ctx.createOscillator();
  const gain = audio.ctx.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(0.0001, audio.ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(volume, audio.ctx.currentTime + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, audio.ctx.currentTime + dur);
  osc.connect(gain); gain.connect(audio.master);
  osc.start(); osc.stop(audio.ctx.currentTime + dur + 0.02);
}
function playSfx(kind){
  const map = {
    click:[520,0.06,'triangle',0.05],
    move:[340,0.08,'sine',0.06],
    evidence:[660,0.18,'triangle',0.07],
    combo:[780,0.22,'sawtooth',0.06],
    success:[920,0.3,'triangle',0.09],
    fail:[180,0.18,'square',0.07],
    court:[280,0.16,'sawtooth',0.08]
  };
  playTone(...(map[kind] || map.click));
}
function updateAudioUi(){
  const btn = $('audioBtn');
  if(!btn) return;
  btn.textContent = `音效：${state.settings.audio ? '开' : '关'}`;
  btn.classList.toggle('active-audio', state.settings.audio);
  if(audio.master) audio.master.gain.value = state.settings.audio ? 0.18 : 0;
  if(audio.ambientGain) audio.ambientGain.gain.value = (state.settings.audio && state.settings.ambient) ? 0.10 : 0;
}
function toggleAudio(){
  state.settings.audio = !state.settings.audio;
  ensureAudio();
  updateAudioUi();
  save();
  if(state.settings.audio) playSfx('click');
}

function showToast(title, text){
  const stack = $('toastStack');
  if(!stack) return;
  const div = document.createElement('div');
  div.className = 'toast';
  div.innerHTML = `<strong>${title}</strong><p>${text}</p>`;
  stack.appendChild(div);
  setTimeout(()=>{ div.style.opacity = '0'; div.style.transform = 'translateY(8px)'; }, 2800);
  setTimeout(()=>div.remove(), 3300);
}
function unlockAchievement(id){
  if(state.achievements.includes(id) || !achievementsMeta[id]) return;
  state.achievements.push(id);
  showToast('成就解锁', achievementsMeta[id].title + ' · ' + achievementsMeta[id].desc);
  playSfx('success');
  save();
}
function evaluateAchievements(){
  if(state.evidence.length >= 1) unlockAchievement('firstEvidence');
  if(state.evidence.length >= 10) unlockAchievement('evidenceHunter');
  if(state.evidence.length >= TOTAL_EVIDENCE) unlockAchievement('fullArchive');
  if(state.deductions.length >= 1) unlockAchievement('comboApprentice');
  if(state.deductions.length >= combos.length) unlockAchievement('comboMaster');
  if(state.ethics >= 5) unlockAchievement('ethicsHigh');
  if(caseDone('case1')) unlockAchievement('case1Closer');
  if(caseDone('case2')) unlockAchievement('case2Closer');
}

function currentChapter(){
  const scene = scenes[state.scene];
  if(scene.caseId === 'case2') return chapters[1];
  return chapters[0];
}

function render(){
  const scene = scenes[state.scene];
  state.activeCase = scene.caseId === 'case2' ? 'case2' : state.activeCase;
  const ch = currentChapter();
  $('chapterKicker').textContent = ch.title;
  $('chapterTitle').textContent = scene.name;
  $('phaseBadge').textContent = scene.phase;
  $('locationName').textContent = scene.name;
  $('locationDesc').textContent = scene.desc;
  $('locationArt').style.backgroundImage = `url("${scene.art}")`;
  $('truthScore').textContent = `真相 ${state.truth}`;
  $('ethicsScore').textContent = `正义 ${state.ethics}`;
  $('evidenceCount').textContent = `${state.evidence.length} / ${TOTAL_EVIDENCE}`;
  $('objectiveTitle').textContent = scene.phase.includes('推理') ? '组合证据链' : scene.phase.includes('庭审') ? '完成法庭对决' : '找到关键线索';
  $('objectiveText').textContent = scene.phase.includes('庭审') ? '不要把情绪带上证人席。证据链越完整，结局越锋利。' : '证据不是答案，它只是把你推到更难的问题面前。';
  $('locks').innerHTML = (scene.locks || []).map(l=>`<div class="lock">${l}</div>`).join('');
  $('locationActions').innerHTML = scene.actions.map(a => {
    const ok = canUse(a);
    return `<button class="action" data-action="${a.id}" ${ok ? '' : 'disabled'} title="${ok ? '' : (a.locked || '尚未解锁')}">
      <strong>${a.icon || '◆'} ${a.title}</strong>
      <small>${ok ? a.text : (a.locked || '尚未解锁')}</small>
    </button>`;
  }).join('');
  $('evidenceList').innerHTML = state.evidence.length ? state.evidence.map(e => `
    <div class="evidence"><div class="icon">${iconFor(e)}</div><div><strong>${e}</strong><small>${hintFor(e)}</small></div></div>
  `).join('') : `<p style="color:#8fa7be;line-height:1.7">证据包空空如也。城市不会主动开口，你得先敲门。</p>`;
  renderChapterNav(scene.phase);
  updateAudioUi();
  bindActions();
  evaluateAchievements();
  save();
}
function renderChapterNav(phase){
  const ch = currentChapter();
  $('chapterNav').innerHTML = ch.phases.map(p=>{
    const done = p === '终局' && caseDone(ch.id) ? 'done' : '';
    return `<span class="${p===phase ? 'active' : done}">${p}</span>`;
  }).join('');
}
function typeText(text){
  const el = $('dialogueText');
  if(!state.settings.typewriter){
    el.textContent = text;
    el.classList.remove('typing');
    return;
  }
  el.textContent = '';
  el.classList.add('typing');
  let i = 0;
  clearInterval(typeText.timer);
  typeText.timer = setInterval(()=>{
    el.textContent = text.slice(0, i + 1);
    i += 1;
    if(i >= text.length){
      clearInterval(typeText.timer);
      el.classList.remove('typing');
    }
  }, 14);
}
function say(name, role, portrait, text, choices=[]){
  $('speakerName').textContent = name;
  $('speakerRole').textContent = role;
  $('speakerPortrait').style.backgroundImage = portrait ? `url("${portrait}")` : '';
  typeText(text);
  $('choiceList').innerHTML = choices.map((c,i)=>`<button class="choice ${c.cls || (c.ending==='bad'?'danger':'')}" data-choice="${i}">${c.text}</button>`).join('');
}

function bindActions(){
  document.querySelectorAll('[data-action]').forEach(btn=>{
    btn.onclick = () => {
      playSfx('click');
      const action = scenes[state.scene].actions.find(a=>a.id===btn.dataset.action);
      if(!canUse(action)) return;
      if(action.special === 'combo'){ showCombo(); return; }
      if(action.special === 'notebook'){ showNotebook(); return; }
      if(action.special === 'map'){ showMap(); return; }
      if(action.goto){
        state.scene = action.goto;
        say('系统','调查记录','', action.say || '你移动到新的地点。');
        playSfx('move');
        render();
        return;
      }
      if(action.dialogue){ startDialogue(action.dialogue); return; }
      const isNew = !state.used[action.id];
      if(isNew){
        state.truth += action.truth || 0;
        state.ethics += action.ethics || 0;
        addEvidence(action.evidence);
        state.used[action.id] = true;
        if(action.evidence) {
          showToast('获得证据', action.evidence);
          playSfx('evidence');
        }
      }
      say('韩亦','刑警 / 案件联络人','./assets/char_hanyi.svg', action.say || '这条线索值得记录。');
      render();
    };
  });
}
function startDialogue(id){
  const d = dialogues[id];
  say(d.speaker, d.role, d.portrait, d.text, d.choices);
  document.querySelectorAll('[data-choice]').forEach(btn=>{
    btn.onclick = () => {
      playSfx('click');
      const choice = d.choices[Number(btn.dataset.choice)];
      if(choice.ending){ finish(choice.ending); return; }
      const isNew = !state.used[id + choice.text];
      if(isNew){
        state.truth += choice.truth || 0;
        state.ethics += choice.ethics || 0;
        addEvidence(choice.evidence);
        state.used[id + choice.text] = true;
        if(choice.evidence){
          showToast('获得证据', choice.evidence);
          playSfx('evidence');
        }
      }
      say(d.speaker, d.role, d.portrait, choice.response, d.choices);
      render();
    };
  });
}
function showCombo(){
  const cards = combos.map(c=>{
    const ok = c.req.every(r=>state.evidence.includes(r));
    const done = state.deductions.includes(c.result);
    const caseLabel = c.caseId === 'case1' ? '第一案' : '第二案';
    return `<button class="combo" data-combo="${c.id}" ${ok && !done ? '' : 'disabled'}>
      <strong>${done ? '✅ ' : ''}${caseLabel} · ${c.title}</strong><br/>
      <small>需要：${c.req.join(' / ')}${done ? ' · 已完成' : ok ? ' · 可推理' : ' · 证据不足'}</small>
    </button>`;
  }).join('');
  showModal('证据组合推理', `<div class="combo-grid">${cards}</div>`);
  document.querySelectorAll('[data-combo]').forEach(btn=>{
    btn.onclick = () => {
      playSfx('combo');
      const c = combos.find(x=>x.id===btn.dataset.combo);
      if(!c || !c.req.every(r=>state.evidence.includes(r)) || state.deductions.includes(c.result)) return;
      state.truth += c.truth || 0;
      state.ethics += c.ethics || 0;
      addDeduction(c.result);
      showToast('组合推理完成', c.result);
      render();
      showModal(c.title, `<p>${c.text}</p><p><strong>新增推理：</strong>${c.result}</p><button class="btn gold" onclick="showCombo()">继续组合</button>`);
    };
  });
}
function showNotebook(){
  const ev = state.evidence.map(e=>`<div class="note"><strong>${iconFor(e)} ${e}</strong><p>${hintFor(e)}</p></div>`).join('') || '<p>暂无证据。</p>';
  const de = state.deductions.map(d=>`<div class="note"><strong>🧠 ${d}</strong><p>由多项证据交叉验证得到。</p></div>`).join('') || '<p>暂无组合推理。</p>';
  showModal('案件笔记', `<h3>证据</h3><div class="note-grid">${ev}</div><h3>组合推理</h3><div class="note-grid">${de}</div>`);
}
function showMap(){
  const nodes = [
    ['city','商业区路口','第一案现场',true,70,150],
    ['store','便利店现场','询问苏岚，调查网络和血迹',true,360,95],
    ['meeting','会见室','询问陈巍',true,650,165],
    ['office','律所办公室','证据组合与案件笔记',state.evidence.length>=4,360,330],
    ['hospital','云港医院','第二案开启后可调查',caseDone('case1'),70,370],
    ['dock','旧码头仓库','第二案追踪黑车',caseDone('case1'),650,385],
    ['court2','第二案法庭','完成最终庭审',state.evidence.length>=14,360,505]
  ];
  const lines = `
    <div class="mapLine" style="left:255px;top:196px;width:170px;transform:rotate(-14deg)"></div>
    <div class="mapLine" style="left:545px;top:180px;width:145px;transform:rotate(15deg)"></div>
    <div class="mapLine" style="left:450px;top:230px;width:180px;transform:rotate(90deg)"></div>
    <div class="mapLine" style="left:250px;top:420px;width:160px;transform:rotate(-12deg)"></div>
    <div class="mapLine" style="left:545px;top:425px;width:160px;transform:rotate(12deg)"></div>
  `;
  const html = nodes.map(([id,title,desc,ok,x,y])=>`
    <button class="mapNode v4" style="left:${x}px;top:${y}px" data-map="${id}" ${ok ? '' : 'disabled'}>
      <h3>${ok ? '◆ ' : '◇ '}${title}</h3><p>${ok ? desc : '尚未解锁'}</p>
    </button>`).join('');
  showModal('城市地图', `<div class="city-map-board">${lines}${html}</div>`);
  document.querySelectorAll('[data-map]').forEach(btn=>{
    btn.onclick = () => {
      playSfx('move');
      state.scene = btn.dataset.map;
      closeModal();
      say('系统','城市地图','', '你抵达新的地点。');
      render();
    };
  });
}
function showEvidenceAtlas(){
  const all = Object.entries(evidenceMeta).map(([name, meta])=>{
    const unlocked = state.evidence.includes(name);
    return `<div class="atlas-card ${unlocked ? '' : 'locked'}">
      <div class="atlas-icon">${unlocked ? meta[0] : '?'}</div>
      <strong>${unlocked ? name : '未发现证据'}</strong>
      <p>${unlocked ? meta[1] : '继续调查地点、询问证人或完成前置线索。'}</p>
    </div>`;
  }).join('');
  const deductions = state.deductions.map(d=>`<div class="atlas-card"><div class="atlas-icon">🧠</div><strong>${d}</strong><p>已完成组合推理。它会影响法庭结局。</p></div>`).join('');
  showModal('证据图鉴', `<h3>证据图鉴</h3><div class="atlas-grid">${all}</div><h3>组合推理</h3><div class="atlas-grid">${deductions || '<p>暂无组合推理。</p>'}</div>`);
}
function showGallery(){
  const items = [
    ['scene_city.svg','商业区路口','雨夜、霓虹、警戒线，第一案的齿轮从这里转动。'],
    ['scene_store.svg','便利店现场','冷白灯下的血迹与货架，藏着被移动过的现场。'],
    ['scene_meeting.svg','会见室','玻璃隔开声音，也把恐惧照得更清楚。'],
    ['scene_office.svg','律所办公室','证据墙是城市的星图，钉子和线构成真相。'],
    ['scene_hospital.svg','云港医院','第二案入口，病历和账本在白色走廊里交错。'],
    ['scene_dock.svg','旧码头仓库','黑车、货柜、海雾警报，幕后线索在这里汇流。'],
    ['scene_court.svg','法庭对决','证词被迫显形的地方，每个选择都有重量。']
  ];
  const html = items.map(([img,title,desc])=>`<div class="gallery-card"><div class="thumb" style="background-image:url('./assets/${img}')"></div><div class="gallery-body"><h3>${title}</h3><p>${desc}</p></div></div>`).join('');
  showModal('视觉图鉴', `<div class="gallery-grid">${html}</div>`);
}
function showAchievements(){
  const html = Object.entries(achievementsMeta).map(([id,meta])=>{
    const ok = state.achievements.includes(id);
    return `<div class="achievement-card ${ok ? '' : 'locked'}"><div class="achievement-badge">${ok ? '已解锁' : '未解锁'}</div><h3>${meta.title}</h3><p>${ok ? meta.desc : '继续推进剧情来解锁这个成就。'}</p></div>`;
  }).join('');
  showModal('成就系统', `<div class="achievement-grid">${html}</div>`);
}
function showEndingCollection(){
  const keys = Object.keys(endingsMeta);
  const html = keys.map(name=>{
    const unlocked = state.endings.includes(name) || (name === '最终结局：法域之城' && caseDone('case2')) || (name === '第一案真相结局：雨停之前' && caseDone('case1'));
    const meta = endingsMeta[name];
    return `<div class="ending-card ${unlocked ? '' : 'locked'}"><div class="rank">${unlocked ? meta.rank : '?'}</div><h3>${unlocked ? name : '未解锁结局'}</h3><p>${unlocked ? meta.desc : '继续推进调查、尝试不同选择。'}</p></div>`;
  }).join('');
  showModal('结局收藏', `<div class="ending-grid">${html}</div>`);
}
function showSettings(){
  showModal('音效与体验设置', `
    <div class="settings-grid">
      <div class="settings-card">
        <h3>环境音</h3>
        <p>当前为程序生成环境音，无需额外音频文件。</p>
        <div class="toggle-line"><span>${state.settings.ambient ? '已开启' : '已关闭'}</span><button class="switch" id="toggleAmbient">切换环境音</button></div>
      </div>
      <div class="settings-card">
        <h3>打字机效果</h3>
        <p>让对话更有视觉小说感。</p>
        <div class="toggle-line"><span>${state.settings.typewriter ? '已开启' : '已关闭'}</span><button class="switch" id="toggleTypewriter">切换打字机效果</button></div>
      </div>
    </div>
  `);
  $('toggleAmbient').onclick = () => {
    state.settings.ambient = !state.settings.ambient;
    updateAudioUi();
    save();
    showSettings();
  };
  $('toggleTypewriter').onclick = () => {
    state.settings.typewriter = !state.settings.typewriter;
    save();
    showSettings();
  };
}
function showCaseSelect(){
  const html = `
    <button class="casePick" data-case="case1"><h3>第一案：雨夜证词</h3><p>便利店、黑车、伪造订单。已${caseDone('case1') ? '完成' : '开启'}。</p></button>
    <button class="casePick" data-case="case2" ${caseDone('case1') ? '' : 'disabled'}><h3>第二案：沉默账本</h3><p>${caseDone('case1') ? '医院、旧码头与幕后委托人。' : '完成第一案真相结局后解锁。'}</p></button>
  `;
  showModal('案件选择', `<div class="case-grid">${html}</div>`);
  document.querySelectorAll('[data-case]').forEach(btn=>{
    btn.onclick = () => {
      playSfx('move');
      const c = btn.dataset.case;
      state.scene = c === 'case1' ? 'city' : 'hospital';
      closeModal();
      enterGame(false);
    };
  });
}

function rememberEnding(title){
  if(!state.endings.includes(title)) state.endings.push(title);
}
function finish(type){
  let title, body, scoreBlock = '';
  const c1Good = state.deductions.includes('组合推理：陈巍不是伏击者') &&
                 state.deductions.includes('组合推理：店外黑车袭击') &&
                 state.deductions.includes('组合推理：店长与黑车有关') &&
                 state.evidence.includes('店长删改指令') && state.truth >= 12;
  const c2Good = state.deductions.includes('组合推理：受害人掌握地下账本') &&
                 state.deductions.includes('组合推理：幕后委托人浮出') &&
                 state.evidence.includes('私家侦探录音') && state.truth >= 20;

  if(type === 'case1good' && c1Good){
    if(!caseDone('case1')) state.completedCases.push('case1');
    title = '第一案真相结局：雨停之前';
    body = `<p>你提交了完整证据链：黑屏监控证明有人预设盲区，伪造订单解释陈巍为何回到现场，黑车线索与店长合同揭开真正动机。</p><p>乔衡被带离时说出一句话：账本不在我手里。第二案已解锁。</p><button class="btn gold" onclick="goNextCase()">进入第二案</button>`;
    playSfx('success');
  } else if(type === 'case2good' && c2Good && caseDone('case1')){
    if(!caseDone('case2')) state.completedCases.push('case2');
    title = '最终结局：法域之城';
    const rank = state.truth >= 24 && state.ethics >= 5 ? 'S' : state.truth >= 20 ? 'A' : 'B';
    scoreBlock = `<div class="score-grid"><div class="score"><strong>${rank}</strong>综合评级</div><div class="score"><strong>${state.truth}</strong>真相值</div><div class="score"><strong>${state.ethics}</strong>正义值</div><div class="score"><strong>${state.evidence.length}</strong>证据数</div></div>`;
    body = `${scoreBlock}<p>医院账本、码头货柜和录音形成闭环。法庭决定移送更高层级侦查，陈巍彻底洗清嫌疑，苏岚进入证人保护程序。</p><p>这座城市不会因为一个判决立刻明亮，但今晚，法典翻到了一页新的纸。</p><button class="btn gold" onclick="resetGame()">重新开始</button>`;
    playSfx('success');
  } else if(type.includes('good')){
    title = '证据不足：真相隔着一层雾';
    body = `<p>你的方向正确，但证据链还没有完全闭合。回到律所，完成对应案件的组合推理，再回到法庭。</p>`;
    playSfx('court');
  } else if(type === 'partial'){
    title = '部分胜利：裂缝被撬开';
    body = `<p>你指出了案件中的异常，但没有把异常连成完整的责任链。案件重审，真凶仍在雨里。</p>`;
    playSfx('court');
  } else {
    title = '错误结局：偏见判词';
    body = `<p>你选择了动机，而不是证据。城市收下了一个仓促的答案，真正的指令者在雨幕背后换了一辆车。</p>`;
    playSfx('fail');
  }
  rememberEnding(title);
  render();
  showModal(title, body);
}
function goNextCase(){
  state.scene = 'hospital';
  closeModal();
  say('韩亦','刑警 / 案件联络人','./assets/char_hanyi.svg','乔衡开口前，有人切断了审讯室电源。线索指向云港医院。第二案，开始。');
  render();
}
function showModal(title, body){
  $('modalTitle').textContent = title;
  $('modalBody').innerHTML = body;
  $('modal').classList.remove('hidden');
  $('modal').setAttribute('aria-hidden','false');
}
function closeModal(){ $('modal').classList.add('hidden'); $('modal').setAttribute('aria-hidden','true'); }
function resetGame(){
  localStorage.removeItem(STORAGE_KEY);
  state = { scene:'city', activeCase:'case1', completedCases:[], evidence:[], deductions:[], truth:0, ethics:0, used:{}, endings:[], achievements:[], settings:{ audio:true, ambient:true, typewriter:true } };
  closeModal();
  render();
  say('系统','调查记录','', '雨越下越密。你抵达商业区路口，案件从这里重新呼吸。');
  showToast('游戏已重置', '新的调查已经开始。');
}
function enterGame(reset=false){
  ensureAudio();
  if(reset) resetGame(); else { load(); render(); }
  $('startScreen').classList.remove('active');
  $('gameScreen').classList.add('active');
}

window.showCombo = showCombo;
window.goNextCase = goNextCase;
window.resetGame = resetGame;

$('newGameBtn').onclick = () => { playSfx('click'); enterGame(true); };
$('continueBtn').onclick = () => { playSfx('click'); enterGame(false); };
$('caseSelectBtn').onclick = () => { playSfx('click'); load(); showCaseSelect(); };
$('galleryBtn').onclick = () => { playSfx('click'); showGallery(); };
$('collectionBtn').onclick = () => { playSfx('click'); showEndingCollection(); };
$('howBtn').onclick = () => showModal('玩法说明', `
  <ol>
    <li>点击地点卡片调查现场，收集证据。</li>
    <li>有些地点会被前置证据锁住，比如黑车残片需要先获得苏岚的黑车证词。</li>
    <li>回到律所办公室，可以进行证据组合推理。</li>
    <li>第一案真相结局会解锁第二案。</li>
    <li>新增成就系统、结局收藏和音效开关。</li>
    <li>当前版本的环境音与交互音效由程序实时生成，不依赖外部音频文件。</li>
  </ol>
`);
$('closeModal').onclick = closeModal;
$('resetBtn').onclick = () => { playSfx('click'); resetGame(); };
$('notebookBtn').onclick = () => { playSfx('click'); showNotebook(); };
$('atlasBtn').onclick = () => { playSfx('click'); showEvidenceAtlas(); };
$('mapBtn').onclick = () => { playSfx('click'); showMap(); };
$('achievementsBtn').onclick = () => { playSfx('click'); showAchievements(); };
$('audioBtn').onclick = toggleAudio;

load();
render();
say('系统','调查记录','', '雨越下越密。你抵达商业区路口，案件从这里重新呼吸。');
document.addEventListener('click', ensureAudio, { once:true });
