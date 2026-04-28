const $ = (id) => document.getElementById(id);

const TOTAL_EVIDENCE = 12;
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
  "保险柜合同":["📄","受害人与店长存在债务纠纷。"]
};

const combos = [
  {
    id:"timeline",
    title:"重构案发时间线",
    req:["破损监控记录","22:13 小票","匿名来电记录"],
    result:"组合推理：陈巍不是伏击者",
    text:"监控黑屏发生在陈巍离开路线之后，小票证明受害人仍在店内，匿名来电则把陈巍重新引回现场。陈巍更像被放进镜头里的替罪羊。",
    truth:2
  },
  {
    id:"sceneMoved",
    title:"证明现场被二次处理",
    req:["逆向轮胎水痕","二次出血痕迹","未发送语音"],
    result:"组合推理：店外黑车袭击",
    text:"水痕、二次出血和苏岚未发送语音互相咬合：第一次袭击发生在店外，随后有人把伤者移动到便利店制造目击误导。",
    truth:3,
    ethics:1
  },
  {
    id:"manager",
    title:"锁定店长乔衡的动机",
    req:["店长删改指令","保险柜合同","黑车车牌残片"],
    result:"组合推理：店长与黑车有关",
    text:"店长删改监控不是为了保护店铺声誉。合同显示他与受害人存在债务纠纷，车牌残片则把他的沉默接到黑车尾灯上。",
    truth:3
  }
];

const scenes = {
  city: {
    phase:"调查阶段",
    name: "商业区路口",
    art: "./assets/scene_city.svg",
    desc: "霓虹与警戒线在雨水里扭成一团。这里发生过追逐，也发生过沉默。",
    locks:["建议先拿到：监控、轮胎水痕。", "找到 4 条证据后，会解锁律所证据墙。"],
    actions: [
      { id:"camera", icon:"📹", title:"路口监控探头", text:"查看缺失的 47 秒", evidence:"破损监控记录", truth:1, say:"监控在 22:14:03 到 22:14:50 之间黑屏。不是停电，是有人剪断了旁路电源。" },
      { id:"tyre", icon:"🛞", title:"斑马线地面", text:"检视轮胎水痕", evidence:"逆向轮胎水痕", truth:1, say:"水痕从便利店门口反向拖出，说明倒地者可能先被车撞倒，再被人补了一刀。" },
      { id:"plate", icon:"🚗", title:"排水沟反光物", text:"捡起车牌碎片", evidence:"黑车车牌残片", truth:1, require:["未发送语音"], locked:"需要先从苏岚那里获得黑车信息。", say:"碎片边缘新鲜，编号只剩后三位：7K2。苏岚说的黑车，开始有了骨头。" },
      { id:"store", icon:"🏪", title:"前往便利店", text:"寻找店员苏岚", goto:"store", say:"便利店灯还亮着，货架之间藏着比雨声更碎的呼吸。" },
      { id:"meeting", icon:"🪑", title:"会见嫌疑人", text:"询问外卖骑手陈巍", goto:"meeting", say:"陈巍已经被警方控制。他说自己只是捡起了刀。" },
      { id:"office", icon:"🧠", title:"返回律所", text:"整理证据链", goto:"office", requireCount:4, locked:"至少收集 4 条证据后解锁。", say:"你回到律所。证据墙上，每根线都在寻找自己的钩子。" }
    ]
  },
  store: {
    phase:"调查阶段",
    name: "便利店现场",
    art: "./assets/scene_store.svg",
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
    phase:"会见阶段",
    name: "会见室",
    art: "./assets/scene_meeting.svg",
    desc: "玻璃隔开声音，也隔开恐惧。陈巍的手一直攥着袖口。",
    locks:["陈巍有动机，但动机不是定罪。", "询问后可进入律所做证据组合。"],
    actions: [
      { id:"phone", icon:"📱", title:"手机通话记录", text:"要求调取", evidence:"匿名来电记录", truth:1, ethics:1, say:"陈巍在案发前接到一通匿名电话。对方只说了六个字：别进店，往回走。" },
      { id:"stain", icon:"🧥", title:"外套污渍", text:"检查袖口", evidence:"袖口机油", truth:1, say:"袖口不是血，是机油。和路口被剪断的监控电箱吻合。" },
      { id:"chen", icon:"🧍", title:"追问陈巍", text:"询问当晚细节", dialogue:"chen" },
      { id:"office", icon:"🧠", title:"返回律所", text:"整理证据链", goto:"office", requireCount:4, locked:"至少收集 4 条证据后解锁。" },
      { id:"court", icon:"⚖️", title:"进入法庭对决", text:"提交已有证据", goto:"court", requireCount:7, locked:"至少收集 7 条证据后解锁。", say:"法庭从不等待完美真相，但你需要足够完整的链条。" }
    ]
  },
  office: {
    phase:"推理阶段",
    name:"律所办公室",
    art:"./assets/scene_office.svg",
    desc:"证据墙像一片人造星图。每个钉子都是事实，每根线都是你承担的判断。",
    locks:["在这里进行证据组合，组合推理会影响最终结局。"],
    actions:[
      { id:"combo", icon:"🧠", title:"证据组合", text:"打开推理面板", special:"combo" },
      { id:"notebook", icon:"📓", title:"案件笔记", text:"查看所有线索", special:"notebook" },
      { id:"court", icon:"⚖️", title:"进入法庭对决", text:"提交证据链", goto:"court", requireCount:7, locked:"至少收集 7 条证据后解锁。" },
      { id:"city", icon:"↩️", title:"返回路口", text:"继续补充证据", goto:"city" },
      { id:"store", icon:"🏪", title:"回到便利店", text:"补充现场证据", goto:"store" },
      { id:"meeting", icon:"🪑", title:"前往会见室", text:"继续询问陈巍", goto:"meeting" }
    ]
  },
  court: {
    phase:"庭审阶段",
    name: "法庭对决",
    art: "./assets/scene_court.svg",
    desc: "灯光落下，所有证词都被迫显形。你必须指出真正的矛盾。",
    locks:["好结局需要关键证据和至少 2 个组合推理。"],
    actions: [
      { id:"final", icon:"📜", title:"终案推理", text:"选择核心矛盾", dialogue:"final" },
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
  final: {
    speaker:"陆沉", role:"庭审发问", portrait:"./assets/char_luchen.svg",
    text:"现在必须指出本案真正的裂缝。哪一项证据链能证明陈巍不是唯一在场并接触现场的人？",
    choices:[
      { text:"监控黑屏、伪造订单与店长删改指令形成栽赃链", ending:"good", cls:"good" },
      { text:"陈巍与受害人的旧怨足以解释杀人动机", ending:"bad" },
      { text:"便利店小票证明警方时间线有误", ending:"partial" },
      { text:"苏岚没有及时报警，所以她才是凶手", ending:"bad" }
    ]
  }
};

let state = { scene:"city", evidence:[], deductions:[], truth:0, ethics:0, used:{} };

function save(){ localStorage.setItem("lawCityStateV2", JSON.stringify(state)); }
function load(){
  const raw = localStorage.getItem("lawCityStateV2");
  if(raw){ try { state = JSON.parse(raw); } catch(e){} }
}
function has(name){ return state.evidence.includes(name) || state.deductions.includes(name); }
function canUse(action){
  if(action.requireCount && state.evidence.length < action.requireCount) return false;
  if(action.require && !action.require.every(has)) return false;
  if(action.requireAny && !action.requireAny.some(has)) return false;
  return true;
}
function addEvidence(name){
  if(!name || state.evidence.includes(name)) return;
  state.evidence.push(name);
}
function addDeduction(name){
  if(!name || state.deductions.includes(name)) return;
  state.deductions.push(name);
}
function iconFor(e){ return (evidenceMeta[e] || ["🔎","等待与其他证据交叉印证。"])[0]; }
function hintFor(e){ return (evidenceMeta[e] || ["🔎","等待与其他证据交叉印证。"])[1]; }

function render(){
  const scene = scenes[state.scene];
  $("chapterTitle").textContent = scene.name;
  $("phaseBadge").textContent = scene.phase;
  $("locationName").textContent = scene.name;
  $("locationDesc").textContent = scene.desc;
  $("locationArt").style.backgroundImage = `url("${scene.art}")`;
  $("truthScore").textContent = `真相 ${state.truth}`;
  $("ethicsScore").textContent = `正义 ${state.ethics}`;
  $("evidenceCount").textContent = `${state.evidence.length} / ${TOTAL_EVIDENCE}`;
  $("objectiveTitle").textContent = scene.phase === "推理阶段" ? "组合证据链" : "找到关键线索";
  $("objectiveText").textContent = scene.phase === "庭审阶段" ? "不要把情绪带上证人席。证据链越完整，结局越锋利。" : "证据不是答案，它只是把你推到更难的问题面前。";
  $("locks").innerHTML = (scene.locks || []).map(l=>`<div class="lock">${l}</div>`).join("");
  $("locationActions").innerHTML = scene.actions.map(a => {
    const ok = canUse(a);
    return `<button class="action" data-action="${a.id}" ${ok ? "" : "disabled"} title="${ok ? "" : (a.locked || "尚未解锁")}">
      <strong>${a.icon || "◆"} ${a.title}</strong>
      <small>${ok ? a.text : (a.locked || "尚未解锁")}</small>
    </button>`;
  }).join("");
  $("evidenceList").innerHTML = state.evidence.length ? state.evidence.map(e => `
    <div class="evidence"><div class="icon">${iconFor(e)}</div><div><strong>${e}</strong><small>${hintFor(e)}</small></div></div>
  `).join("") : `<p style="color:#8fa7be;line-height:1.7">证据包空空如也。城市不会主动开口，你得先敲门。</p>`;
  document.querySelectorAll(".process span").forEach(el=>el.classList.toggle("active", el.dataset.phase === scene.phase));
  bindActions();
}
function say(name, role, portrait, text, choices=[]){
  $("speakerName").textContent = name;
  $("speakerRole").textContent = role;
  $("speakerPortrait").style.backgroundImage = portrait ? `url("${portrait}")` : "";
  $("dialogueText").textContent = text;
  $("choiceList").innerHTML = choices.map((c,i)=>`<button class="choice ${c.cls || (c.ending==='bad'?'danger':'')}" data-choice="${i}">${c.text}</button>`).join("");
}
function bindActions(){
  document.querySelectorAll("[data-action]").forEach(btn=>{
    btn.onclick = () => {
      const action = scenes[state.scene].actions.find(a=>a.id===btn.dataset.action);
      if(!canUse(action)) return;
      if(action.special === "combo"){ showCombo(); return; }
      if(action.special === "notebook"){ showNotebook(); return; }
      if(action.goto){
        state.scene = action.goto;
        say("系统","调查记录","", action.say || "你移动到新的地点。");
        save(); render(); return;
      }
      if(action.dialogue){ startDialogue(action.dialogue); return; }
      if(!state.used[action.id]){
        state.truth += action.truth || 0;
        state.ethics += action.ethics || 0;
        addEvidence(action.evidence);
        state.used[action.id] = true;
      }
      say("韩亦","刑警 / 案件联络人","./assets/char_hanyi.svg", action.say || "这条线索值得记录。");
      save(); render();
    };
  });
}
function startDialogue(id){
  const d = dialogues[id];
  say(d.speaker, d.role, d.portrait, d.text, d.choices);
  document.querySelectorAll("[data-choice]").forEach(btn=>{
    btn.onclick = () => {
      const choice = d.choices[Number(btn.dataset.choice)];
      if(choice.ending){ finish(choice.ending); return; }
      if(!state.used[id + choice.text]){
        state.truth += choice.truth || 0;
        state.ethics += choice.ethics || 0;
        addEvidence(choice.evidence);
        state.used[id + choice.text] = true;
      }
      say(d.speaker, d.role, d.portrait, choice.response, d.choices);
      save(); render();
    };
  });
}
function showCombo(){
  const cards = combos.map(c=>{
    const ok = c.req.every(r=>state.evidence.includes(r));
    const done = state.deductions.includes(c.result);
    return `<button class="combo" data-combo="${c.id}" ${ok && !done ? "" : "disabled"}>
      <strong>${done ? "✅ " : ""}${c.title}</strong><br/>
      <small>需要：${c.req.join(" / ")}${done ? " · 已完成" : ok ? " · 可推理" : " · 证据不足"}</small>
    </button>`;
  }).join("");
  showModal("证据组合推理", `<div class="combo-grid">${cards}</div>`);
  document.querySelectorAll("[data-combo]").forEach(btn=>{
    btn.onclick = () => {
      const c = combos.find(x=>x.id===btn.dataset.combo);
      if(!c || !c.req.every(r=>state.evidence.includes(r)) || state.deductions.includes(c.result)) return;
      state.truth += c.truth || 0;
      state.ethics += c.ethics || 0;
      addDeduction(c.result);
      save(); render();
      showModal(c.title, `<p>${c.text}</p><p><strong>新增推理：</strong>${c.result}</p><button class="btn gold" onclick="showCombo()">继续组合</button>`);
    };
  });
}
function showNotebook(){
  const ev = state.evidence.map(e=>`<div class="note"><strong>${iconFor(e)} ${e}</strong><p>${hintFor(e)}</p></div>`).join("") || "<p>暂无证据。</p>";
  const de = state.deductions.map(d=>`<div class="note"><strong>🧠 ${d}</strong><p>由多项证据交叉验证得到。</p></div>`).join("") || "<p>暂无组合推理。</p>";
  showModal("案件笔记", `<h3>证据</h3><div class="note-grid">${ev}</div><h3>组合推理</h3><div class="note-grid">${de}</div>`);
}
function finish(type){
  let title, body;
  const hasGoodChain = state.deductions.includes("组合推理：陈巍不是伏击者") &&
                       state.deductions.includes("组合推理：店外黑车袭击") &&
                       state.deductions.includes("组合推理：店长与黑车有关");
  const enough = state.evidence.includes("破损监控记录") && state.evidence.includes("店长删改指令") && state.truth >= 12;
  if(type==="good" && hasGoodChain && enough){
    title = "真相结局：雨停之前";
    body = `<p>你提交了完整证据链：黑屏监控证明有人预设盲区，伪造订单解释陈巍为何回到现场，黑车线索与店长合同揭开真正动机。</p><p>法庭宣布补充侦查，陈巍暂获释放。乔衡被带离时，城市的霓虹在玻璃门上碎成金色雨点。</p>`;
  } else if(type==="good"){
    title = "证据不足：真相隔着一层雾";
    body = `<p>你的方向正确，但证据链还没有完全闭合。至少完成 3 个组合推理，再回到法庭。</p>`;
  } else if(type==="partial"){
    title = "部分胜利：时间线被撬开";
    body = `<p>小票证明警方时间线存在问题，但仍无法排除陈巍接触凶器的嫌疑。案件重审，真凶仍在雨里。</p>`;
  } else {
    title = "错误结局：偏见判词";
    body = `<p>你选择了动机，而不是证据。陈巍被定罪，苏岚离开城市。数周后，另一段监控曝光，黑车再次出现。</p><p>正义不是响亮的句子，它需要站得住的链条。</p>`;
  }
  showModal(title, body + `<button class="btn gold" onclick="resetGame()">重新开始</button>`);
}
function showModal(title, body){
  $("modalTitle").textContent = title;
  $("modalBody").innerHTML = body;
  $("modal").classList.remove("hidden");
  $("modal").setAttribute("aria-hidden","false");
}
function closeModal(){
  $("modal").classList.add("hidden");
  $("modal").setAttribute("aria-hidden","true");
}
function resetGame(){
  localStorage.removeItem("lawCityStateV2");
  state = { scene:"city", evidence:[], deductions:[], truth:0, ethics:0, used:{} };
  closeModal();
  render();
  say("系统","调查记录","", "雨越下越密。你抵达商业区路口，案件从这里重新呼吸。");
}
function enterGame(reset=false){
  if(reset) resetGame(); else { load(); render(); }
  $("startScreen").classList.remove("active");
  $("gameScreen").classList.add("active");
}

$("startBtn").onclick = () => enterGame(true);
$("continueBtn").onclick = () => enterGame(false);
$("howBtn").onclick = () => showModal("玩法说明", `
  <ol>
    <li>点击地点卡片调查现场，收集证据。</li>
    <li>有些地点会被证据锁住，比如黑车残片需要先获得苏岚的黑车证词。</li>
    <li>回到律所办公室，可以进行证据组合推理。</li>
    <li>好结局需要关键证据和 3 个组合推理，不只是收集数量。</li>
    <li>证据包会自动保存，刷新页面也不会丢失。</li>
  </ol>
`);
$("closeModal").onclick = closeModal;
$("resetBtn").onclick = resetGame;
$("notebookBtn").onclick = showNotebook;

load();
render();
say("系统","调查记录","", "雨越下越密。你抵达商业区路口，案件从这里重新呼吸。");
