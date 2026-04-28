
const $ = (id) => document.getElementById(id);
const STORAGE_KEY = "lawCityStateV9";
const MANUAL_SLOT_COUNT = 3;
const TOTAL_EVIDENCE = 24;

const chapters = [
  { id:"case1", title:"第一案：雨夜证词", phases:["调查阶段","会见阶段","推理阶段","庭审阶段","终局"] },
  { id:"case2", title:"第二案：沉默账本", phases:["医院调查","码头追踪","推理阶段","庭审阶段","终局"] },
  { id:"case3", title:"第三案：灰塔匿名函", phases:["档案追查","天台对峙","推理阶段","终审阶段","终局"] }
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
  "私家侦探录音":["🎙️","乔衡不是终点，只是中间人。"],
  "匿名函残页":["✉️","有人提前警告过受害人，也提前布置了灭口路径。"],
  "审计U盘":["💾","被删除的资金流指向灰塔资本。"],
  "董事会日程":["📆","庭审前夕有人急于切割责任。"],
  "天台门禁记录":["🪪","案发夜有人登上金融街顶层。"],
  "狙击照片底片":["📷","受害人的坠楼并非意外，而是被持续监视。"],
  "灰塔转账凭证":["💳","匿名委托人与码头资金链重叠。"]
};

const combos = [
  { id:"timeline", caseId:"case1", title:"重构案发时间线", req:["破损监控记录","22:13 小票","匿名来电记录"], result:"组合推理：陈巍不是伏击者", text:"监控黑屏发生在陈巍离开路线之后，小票证明受害人仍在店内，匿名来电则把陈巍重新引回现场。", truth:2 },
  { id:"sceneMoved", caseId:"case1", title:"证明现场被二次处理", req:["逆向轮胎水痕","二次出血痕迹","未发送语音"], result:"组合推理：店外黑车袭击", text:"水痕、二次出血和苏岚未发送语音互相咬合：第一次袭击发生在店外，随后有人把伤者移动到便利店制造目击误导。", truth:3, ethics:1 },
  { id:"manager", caseId:"case1", title:"锁定店长乔衡的动机", req:["店长删改指令","保险柜合同","黑车车牌残片"], result:"组合推理：店长与黑车有关", text:"店长删改监控不是为了保护店铺声誉。合同显示他与受害人存在债务纠纷，车牌残片把他的沉默接到黑车尾灯上。", truth:3 },
  { id:"hospital", caseId:"case2", title:"医院线索指向账本", req:["医院缴费单","护士交班记录","残缺账本页"], result:"组合推理：受害人掌握地下账本", text:"缴费单说明受害人不是单纯债务人，交班记录显示病历被调走，账本页解释了有人为何急于灭口。", truth:3, ethics:1 },
  { id:"dock", caseId:"case2", title:"旧码头不是交易终点", req:["码头监控截图","货柜封条","私家侦探录音"], result:"组合推理：幕后委托人浮出", text:"黑车、货柜和录音合在一起，说明乔衡只是清理现场的人，真正指令来自旧码头背后的委托人。", truth:4 },
  { id:"greytower", caseId:"case3", title:"匿名函指向灰塔资本", req:["匿名函残页","审计U盘","董事会日程"], result:"组合推理：灰塔资本介入灭口", text:"匿名函不是善意提醒，而是一次失败的内部自救。U 盘里被删除的账目与董事会日程对应，说明灰塔资本在庭审前急于切断整条链。", truth:4, ethics:1 },
  { id:"rooftop", caseId:"case3", title:"天台会面不是意外", req:["天台门禁记录","狙击照片底片","灰塔转账凭证"], result:"组合推理：终局委托人锁定", text:"门禁记录证明案发夜有人上楼，底片说明受害人被持续跟踪，而转账凭证把旧码头资金、医院账本与最终委托人焊成一根钢索。", truth:5 }
];

const achievementsMeta = {
  firstEvidence:{ title:"初次取证", desc:"获得第一条证据。" },
  evidenceHunter:{ title:"线索猎人", desc:"收集 10 条证据。" },
  fullArchive:{ title:"全卷宗", desc:"收集全部 24 条证据。" },
  case1Closer:{ title:"第一案结案", desc:"完成第一案真相结局。" },
  case2Closer:{ title:"第二案结案", desc:"完成第二案终局。" },
  case3Closer:{ title:"三案终章", desc:"完成第三案终极结局。" },
  comboApprentice:{ title:"推理入门", desc:"完成任意 1 条组合推理。" },
  comboMaster:{ title:"链条大师", desc:"完成全部 7 条组合推理。" },
  ethicsHigh:{ title:"正义倾向", desc:"正义值达到 5。" }
};

const endingsMeta = {
  "第一案真相结局：雨停之前": { rank:"A", desc:"你撬开了第一案的真正裂缝，并解锁第二案。" },
  "第二案终局：法域之城": { rank:"S", desc:"你揭开医院与码头的委托链，第三案随之浮出。" },
  "终极结局：法典之上": { rank:"SS", desc:"你完成三案闭环，把隐藏在城市高处的委托人送上被告席。" },
  "证据不足：真相隔着一层雾": { rank:"C", desc:"你触碰到了方向，但链条还未闭合。" },
  "部分胜利：裂缝被撬开": { rank:"B", desc:"你撬开了异常，却没能锁定完整责任链。" },
  "错误结局：偏见判词": { rank:"D", desc:"你选择了偏见，而不是证据。" }
};

const characterCodex = [
  { name:"陆沉", role:"青年律师 / 主角", portrait:"./assets/char_luchen_v6.png", desc:"冷静、克制，擅长从证词的缝隙里寻找真正的责任链。" },
  { name:"韩亦", role:"刑警 / 案件联络人", portrait:"./assets/char_hanyi_v6.png", desc:"习惯把情绪压在证据后面，是你最可靠的外部支点。" },
  { name:"苏岚", role:"便利店店员 / 关键证人", portrait:"./assets/char_sulan_v6.png", desc:"在恐惧与良知之间摇摆，她的证词决定第一案能否撬开裂缝。" },
  { name:"陈巍", role:"外卖骑手 / 嫌疑人", portrait:"./assets/char_chenwei.svg", desc:"他有动机，也有愤怒，但愤怒本身并不等于定罪。" },
  { name:"李娜", role:"护士 / 医院证人", portrait:"./assets/char_lina.svg", desc:"掌握病历与账本动向的医院证人，她的沉默藏着压力。" },
  { name:"莫野", role:"私家侦探 / 线人", portrait:"./assets/char_moye.svg", desc:"总是晚一步出现，却刚好带着最危险的那一截真相。" },
  { name:"乔衡", role:"便利店店长 / 中间人", portrait:"./assets/char_qiao.svg", desc:"他曾经以为删掉监控就能删掉责任，最后却成了更高层利益链的一枚铆钉。" }
];

const scenes = {
  city: {
    caseId:"case1", phase:"调查阶段", name: "商业区路口", art: "./assets/scene_city_v6.png",
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
    caseId:"case1", phase:"调查阶段", name: "便利店现场", art: "./assets/scene_store_v6.png",
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
    caseId:"hub", phase:"推理阶段", name:"律所办公室", art:"./assets/scene_office_v6.png",
    desc:"证据墙像一片人造星图。每个钉子都是事实，每根线都是你承担的判断。",
    locks:["在这里进行证据组合，组合推理会影响最终结局。", "完成第二案后，将解锁第三案入口。"],
    actions:[
      { id:"combo", icon:"🧠", title:"证据组合", text:"打开推理面板", special:"combo" },
      { id:"notebook", icon:"📓", title:"案件笔记", text:"查看所有线索", special:"notebook" },
      { id:"map", icon:"🗺️", title:"城市地图", text:"选择已解锁地点", special:"map" },
      { id:"casehall", icon:"🗂️", title:"案件大厅", text:"切换案件章节", special:"casehall" },
      { id:"court", icon:"⚖️", title:"第一案法庭", text:"提交雨夜证词", goto:"court", requireCount:7, locked:"至少收集 7 条证据后解锁。" },
      { id:"hospital", icon:"🏥", title:"第二案：云港医院", text:"追踪沉默账本", goto:"hospital", requireCase:"case1", locked:"需要先完成第一案真相结局。" },
      { id:"dock", icon:"🌊", title:"第二案：旧码头", text:"追踪黑车去向", goto:"dock", requireCase:"case1", locked:"需要先完成第一案真相结局。" },
      { id:"archive", icon:"🏛️", title:"第三案：市档案中心", text:"追踪匿名函来源", goto:"archive", requireCase:"case2", locked:"需要先完成第二案终局。" },
      { id:"rooftop", icon:"🌃", title:"第三案：金融街天台", text:"前往终局现场", goto:"rooftop", requireCase:"case2", locked:"需要先完成第二案终局。" }
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
    caseId:"case2", phase:"医院调查", name:"云港医院", art:"./assets/scene_hospital_v6.png",
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
    caseId:"case2", phase:"码头追踪", name:"旧码头仓库", art:"./assets/scene_dock_v6.png",
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
  },
  archive: {
    caseId:"case3", phase:"档案追查", name:"市档案中心", art:"./assets/scene_archive_v8.svg",
    desc:"密集的卷宗和检索终端像一片沉默海。越靠近真相，纸张越显得危险。",
    locks:["第三案已开启：一封匿名函把码头背后的高处阴影照了出来。"],
    actions:[
      { id:"letter", icon:"✉️", title:"匿名函档案袋", text:"检查寄件内容", evidence:"匿名函残页", truth:1, say:"匿名函只剩半页，但能看出寄件人曾警告受害人不要出庭。落款被水泡开，只剩一个模糊的‘塔’字。" },
      { id:"usb", icon:"💾", title:"审计备份柜", text:"提取删除数据", evidence:"审计U盘", truth:2, require:["匿名函残页"], locked:"需要先锁定匿名函来源。", say:"备份柜里藏着一枚没有登记的 U 盘。删除日志显示，灰塔资本曾通过壳公司向旧码头仓库转出数笔紧急款项。" },
      { id:"board", icon:"📆", title:"董事会排期表", text:"查看会议时间", evidence:"董事会日程", truth:1, say:"庭审前夜，灰塔资本临时加开闭门会议。会议议题只有一句：‘外部风险清理方案’。" },
      { id:"qiao", icon:"👤", title:"会见乔衡", text:"追问最终委托人", dialogue:"qiao" },
      { id:"office", icon:"🧠", title:"返回律所", text:"整理档案线索", goto:"office" },
      { id:"rooftop", icon:"🌃", title:"前往金融街天台", text:"追查最后会面地点", goto:"rooftop", require:["审计U盘"], locked:"需要先获得审计 U 盘。" }
    ]
  },
  rooftop: {
    caseId:"case3", phase:"天台对峙", name:"金融街天台", art:"./assets/scene_rooftop_v8.svg",
    desc:"夜风穿过高楼之间，像一份迟到的判词。有人曾在这里谈条件，也有人在这里被迫沉默。",
    locks:["第三案将把旧码头、医院账本与第一案黑车全部收束。"],
    actions:[
      { id:"access", icon:"🪪", title:"电梯门禁", text:"调取顶层记录", evidence:"天台门禁记录", truth:1, say:"门禁记录显示，案发夜 23:47 有临时权限被激活，授权人来自灰塔资本法务部。" },
      { id:"film", icon:"📷", title:"广告灯箱夹层", text:"搜寻遗留底片", evidence:"狙击照片底片", truth:2, say:"灯箱夹层中藏着一卷底片。冲洗后能看到受害人连续数周被偷拍，其中一次背景正是旧码头仓库。" },
      { id:"office", icon:"🧠", title:"返回律所", text:"整理终局线索", goto:"office" },
      { id:"court3", icon:"⚖️", title:"第三案法庭", text:"提交灰塔匿名函", goto:"court3", requireCount:20, locked:"至少收集 20 条证据后解锁。" }
    ]
  },
  court3: {
    caseId:"case3", phase:"终审阶段", name:"第三案法庭", art:"./assets/scene_court.svg",
    desc:"法庭终于照到城市更高的楼层。你不再只是为一名单独被告辩护，而是在逼问整座城的利益结构。",
    locks:["终极结局需要 2 个第三案组合推理，并已完成前两案。"],
    actions:[
      { id:"final3", icon:"📜", title:"终局审判", text:"指出匿名函真正意义", dialogue:"final3" },
      { id:"office", icon:"↩️", title:"回到律所", text:"补充证据组合", goto:"office" }
    ]
  }
};

const dialogues = {
  sulan: {
    speaker:"苏岚", role:"便利店店员 / 关键证人", portrait:"./assets/char_sulan_v6.png",
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
  qiao:{
    speaker:"乔衡", role:"便利店店长 / 中间人", portrait:"./assets/char_qiao.svg",
    text:"我以前以为，只要把监控删掉，把钱还上，就能从这件事里活着走出去。后来我才知道，我连资格都没有。",
    choices:[
      { text:"匿名函是谁寄的？", response:"不是为了救人，是为了让他闭嘴。有人怕受害人把账本和资金链一起带上法庭。匿名函是内部人寄的，寄件地址来自灰塔大厦。", truth:2 },
      { text:"你收过谁的钱？", response:"乔衡把一张转账截图推过来：‘咨询费’、‘安保外包费’、‘仓储协调费’……汇款都绕了一圈，但最后都能回到灰塔资本。", evidence:"灰塔转账凭证", truth:2 },
      { text:"你为什么现在肯说？", response:"因为我终于明白，他们不会给我留退路。你要是能把话说到法庭上，至少别让陈巍继续替别人背着。", ethics:1 },
      { text:"结束会见", response:"乔衡疲惫地靠回椅背。删掉录像的人，最后也想给自己留下证词。" }
    ]
  },
  final1: {
    speaker:"陆沉", role:"第一案庭审发问", portrait:"./assets/char_luchen_v6.png",
    text:"现在必须指出本案真正的裂缝。哪一项证据链能证明陈巍不是唯一在场并接触现场的人？",
    choices:[
      { text:"监控黑屏、伪造订单与店长删改指令形成栽赃链", ending:"case1good", cls:"good" },
      { text:"陈巍与受害人的旧怨足以解释杀人动机", ending:"bad" },
      { text:"便利店小票证明警方时间线有误", ending:"partial" },
      { text:"苏岚没有及时报警，所以她才是凶手", ending:"bad" }
    ]
  },
  final2: {
    speaker:"陆沉", role:"第二案庭审发问", portrait:"./assets/char_luchen_v6.png",
    text:"现在要证明的不是谁拿了刀，而是谁布置了刀。幕后结构在哪里露出了骨头？",
    choices:[
      { text:"医院账本、码头货柜与私家侦探录音形成委托链", ending:"case2good", cls:"good" },
      { text:"乔衡删了监控，所以全部责任都在乔衡", ending:"partial" },
      { text:"陈巍曾有旧怨，所以第二案无需再查", ending:"bad" },
      { text:"护士李娜延迟作证，说明她主导了案件", ending:"bad" }
    ]
  },
  final3: {
    speaker:"陆沉", role:"第三案庭审发问", portrait:"./assets/char_luchen_v6.png",
    text:"现在必须回答最后一个问题：匿名函、码头资金和天台会面，到底证明了什么？",
    choices:[
      { text:"匿名函、审计 U 盘和转账凭证证明灰塔资本主导灭口与切割责任", ending:"case3good", cls:"good" },
      { text:"既然乔衡收过钱，全部责任就只在乔衡一人", ending:"partial" },
      { text:"受害人身边每个人都有嫌疑，所以无需再区分主从", ending:"bad" },
      { text:"天台门禁记录只是巧合，真正案情无法判断", ending:"bad" }
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
  settings:{ audio:true, music:true, ambient:true, typewriter:true, musicVolume:0.55, ambientVolume:0.45, sfxVolume:0.82 },
  visitedScenes:[],
  introSeen:false
};

const audio = {
  ctx:null,
  master:null,
  sfxGain:null,
  musicGain:null,
  ambientGain:null,
  ambientNodes:[],
  musicTimer:null,
  rainSource:null,
  rainFilter:null,
  droneA:null,
  droneB:null,
  started:false,
  currentScene:'',
  currentPreset:null,
  nowPlaying:'未启动'
};

const defaultSettings = {
  audio:true,
  music:true,
  ambient:true,
  typewriter:true,
  musicVolume:0.55,
  ambientVolume:0.45,
  sfxVolume:0.82
};

const audioPresets = {
  city:{ label:'雨夜霓虹', root:220, chord:[0,3,7], tempo:2300, ambient:0.36 },
  store:{ label:'白灯余痕', root:196, chord:[0,5,8], tempo:2550, ambient:0.34 },
  meeting:{ label:'沉默会见', root:174.61, chord:[0,3,10], tempo:2800, ambient:0.22 },
  office:{ label:'证据之墙', root:233.08, chord:[0,7,10], tempo:2200, ambient:0.18 },
  court:{ label:'判词前夜', root:246.94, chord:[0,4,9], tempo:2050, ambient:0.12 },
  hospital:{ label:'空廊心跳', root:207.65, chord:[0,5,9], tempo:2450, ambient:0.28 },
  dock:{ label:'锈海回声', root:155.56, chord:[0,7,8], tempo:2400, ambient:0.38 },
  court2:{ label:'法域终章', root:261.63, chord:[0,4,7], tempo:1950, ambient:0.10 },
  archive:{ label:'卷宗深海', root:185, chord:[0,3,7], tempo:2350, ambient:0.22 },
  rooftop:{ label:'高处风压', root:146.83, chord:[0,5,10], tempo:2140, ambient:0.30 },
  court3:{ label:'法典之上', root:293.66, chord:[0,4,7], tempo:1880, ambient:0.08 }
};

function save(){ localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
function load(){
  const raw = localStorage.getItem(STORAGE_KEY);
  if(raw){ try { state = Object.assign(state, JSON.parse(raw)); } catch(e){} }
  state.settings = Object.assign({}, defaultSettings, state.settings || {});
  if(!state.achievements) state.achievements = [];
  if(!state.endings) state.endings = [];
  if(!state.visitedScenes) state.visitedScenes = [];
  if(typeof state.introSeen !== "boolean") state.introSeen = false;
}

function serializeState(){ return JSON.parse(JSON.stringify(state)); }
function hydrateState(data){
  state = Object.assign({
    scene:'city', activeCase:'case1', completedCases:[], evidence:[], deductions:[], truth:0, ethics:0,
    used:{}, endings:[], achievements:[], settings:Object.assign({}, defaultSettings), visitedScenes:[], introSeen:false
  }, JSON.parse(JSON.stringify(data || {})));
  state.settings = Object.assign({}, defaultSettings, state.settings || {});
  if(!Array.isArray(state.completedCases)) state.completedCases = [];
  if(!Array.isArray(state.evidence)) state.evidence = [];
  if(!Array.isArray(state.deductions)) state.deductions = [];
  if(!Array.isArray(state.endings)) state.endings = [];
  if(!Array.isArray(state.achievements)) state.achievements = [];
  if(!Array.isArray(state.visitedScenes)) state.visitedScenes = [];
  if(typeof state.used !== 'object' || !state.used) state.used = {};
  if(typeof state.introSeen !== 'boolean') state.introSeen = false;
}
function slotKey(i){ return `${STORAGE_KEY}_slot${i}`; }
function readSlot(i){
  const raw = localStorage.getItem(slotKey(i));
  if(!raw) return null;
  try { return JSON.parse(raw); } catch(e){ return null; }
}
function formatStamp(ts){
  if(!ts) return '未存档';
  const d = new Date(ts);
  const pad = n => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
function caseTitleById(id){
  const item = chapters.find(c => c.id === id);
  return item ? item.title : '未命名案件';
}
function sceneTitleById(id){ return scenes[id] ? scenes[id].name : '未知地点'; }
function activateGameUI(){
  $('startScreen').classList.remove('active');
  $('gameScreen').classList.add('active');
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

function clamp(v, min, max){ return Math.max(min, Math.min(max, v)); }
function applyAudioLevels(){
  if(!audio.ctx) return;
  const now = audio.ctx.currentTime;
  const muted = !state.settings.audio;
  const musicVol = muted || !state.settings.music ? 0.0001 : 0.05 * clamp(state.settings.musicVolume, 0, 1);
  const ambientBase = audio.currentPreset ? audio.currentPreset.ambient : 0.28;
  const ambientVol = muted || !state.settings.ambient ? 0.0001 : 0.18 * clamp(state.settings.ambientVolume, 0, 1) * ambientBase * 2.2;
  const sfxVol = muted ? 0.0001 : 0.48 * clamp(state.settings.sfxVolume, 0, 1);
  if(audio.master) audio.master.gain.setTargetAtTime(muted ? 0.0001 : 0.92, now, 0.06);
  if(audio.musicGain) audio.musicGain.gain.setTargetAtTime(musicVol, now, 0.25);
  if(audio.ambientGain) audio.ambientGain.gain.setTargetAtTime(ambientVol, now, 0.25);
  if(audio.sfxGain) audio.sfxGain.gain.setTargetAtTime(sfxVol, now, 0.05);
}
function makeNoiseBuffer(ctx){
  const buffer = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for(let i = 0; i < data.length; i += 1) data[i] = (Math.random() * 2 - 1) * 0.45;
  return buffer;
}
function ensureAudio(){
  if(audio.started) return;
  const Ctx = window.AudioContext || window.webkitAudioContext;
  if(!Ctx) return;
  audio.ctx = new Ctx();
  audio.master = audio.ctx.createGain();
  audio.musicGain = audio.ctx.createGain();
  audio.ambientGain = audio.ctx.createGain();
  audio.sfxGain = audio.ctx.createGain();
  audio.master.connect(audio.ctx.destination);
  audio.musicGain.connect(audio.master);
  audio.ambientGain.connect(audio.master);
  audio.sfxGain.connect(audio.master);

  const rain = audio.ctx.createBufferSource();
  const rainFilter = audio.ctx.createBiquadFilter();
  rainFilter.type = 'lowpass';
  rainFilter.frequency.value = 1450;
  rain.buffer = makeNoiseBuffer(audio.ctx);
  rain.loop = true;
  rain.connect(rainFilter);
  rainFilter.connect(audio.ambientGain);
  rain.start();

  const droneA = audio.ctx.createOscillator();
  const droneB = audio.ctx.createOscillator();
  const droneFilter = audio.ctx.createBiquadFilter();
  droneFilter.type = 'lowpass';
  droneFilter.frequency.value = 620;
  droneA.type = 'sine';
  droneB.type = 'triangle';
  droneA.frequency.value = 110;
  droneB.frequency.value = 164.81;
  droneA.connect(droneFilter);
  droneB.connect(droneFilter);
  droneFilter.connect(audio.ambientGain);
  droneA.start();
  droneB.start();

  audio.rainSource = rain;
  audio.rainFilter = rainFilter;
  audio.droneA = droneA;
  audio.droneB = droneB;
  audio.started = true;
  setSceneAudio(state.scene || 'city');
  applyAudioLevels();
}
function schedulePad(freq, dur, when, volume=0.04, type='triangle'){
  if(!audio.ctx) return;
  const osc = audio.ctx.createOscillator();
  const gain = audio.ctx.createGain();
  const filter = audio.ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.value = 1200;
  osc.type = type;
  osc.frequency.setValueAtTime(freq, when);
  gain.gain.setValueAtTime(0.0001, when);
  gain.gain.linearRampToValueAtTime(volume, when + 0.12);
  gain.gain.exponentialRampToValueAtTime(Math.max(0.0001, volume * 0.65), when + dur * 0.45);
  gain.gain.exponentialRampToValueAtTime(0.0001, when + dur);
  osc.connect(filter);
  filter.connect(gain);
  gain.connect(audio.musicGain);
  osc.start(when);
  osc.stop(when + dur + 0.05);
}
function noteFreq(root, semi){ return root * Math.pow(2, semi / 12); }
function setSceneAudio(sceneId){
  ensureAudio();
  if(!audio.ctx) return;
  const preset = audioPresets[sceneId] || audioPresets.city;
  audio.currentPreset = preset;
  audio.nowPlaying = preset.label;
  if($('musicNow')) $('musicNow').textContent = `BGM：${preset.label}`;
  const now = audio.ctx.currentTime;
  if(audio.droneA) audio.droneA.frequency.setTargetAtTime(preset.root / 2, now, 0.4);
  if(audio.droneB) audio.droneB.frequency.setTargetAtTime(noteFreq(preset.root, preset.chord[preset.chord.length - 1]) / 2, now, 0.45);
  if(audio.rainFilter) audio.rainFilter.frequency.setTargetAtTime(sceneId.includes('court') ? 900 : sceneId === 'office' ? 1200 : sceneId === 'hospital' ? 1600 : 1450, now, 0.5);
  if(audio.currentScene === sceneId && audio.musicTimer){
    applyAudioLevels();
    return;
  }
  audio.currentScene = sceneId;
  if(audio.musicTimer) clearInterval(audio.musicTimer);
  const pulse = () => {
    if(!audio.ctx || !state.settings.audio || !state.settings.music) return;
    if(audio.ctx.state === 'suspended') audio.ctx.resume();
    const t = audio.ctx.currentTime + 0.02;
    const chord = preset.chord.map(step => noteFreq(preset.root, step));
    schedulePad(preset.root / 2, 1.8, t, 0.024, 'sine');
    schedulePad(chord[0], 1.6, t + 0.12, 0.018, 'triangle');
    schedulePad(chord[1], 1.35, t + 0.48, 0.014, 'triangle');
    schedulePad(chord[2], 1.2, t + 0.82, 0.012, 'sine');
    if(sceneId === 'hospital' || sceneId === 'court2') schedulePad(noteFreq(preset.root, 12), 0.5, t + 1.3, 0.009, 'square');
  };
  pulse();
  audio.musicTimer = setInterval(pulse, preset.tempo);
  applyAudioLevels();
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
  osc.connect(gain); gain.connect(audio.sfxGain);
  osc.start(); osc.stop(audio.ctx.currentTime + dur + 0.02);
}
function playSfx(kind){
  const base = clamp(state.settings.sfxVolume, 0, 1);
  const map = {
    click:[520,0.06,'triangle',0.04 * base],
    move:[340,0.09,'sine',0.05 * base],
    evidence:[660,0.18,'triangle',0.07 * base],
    combo:[780,0.22,'sawtooth',0.06 * base],
    success:[920,0.3,'triangle',0.09 * base],
    fail:[180,0.18,'square',0.07 * base],
    court:[280,0.16,'sawtooth',0.08 * base]
  };
  playTone(...(map[kind] || map.click));
}
function updateAudioUi(){
  const btn = $('audioBtn');
  if(btn){
    btn.textContent = `快速静音：${state.settings.audio ? '关' : '开'}`;
    btn.classList.toggle('active-audio', state.settings.audio);
  }
  if($('musicNow')) $('musicNow').textContent = `BGM：${audio.nowPlaying || '未启动'}`;
  applyAudioLevels();
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
  if(caseDone('case3')) unlockAchievement('case3Closer');
}


function showChapterSplash(kicker, title, desc){
  const wrap = $('chapterSplash');
  if(!wrap) return;
  $('splashKicker').textContent = kicker;
  $('splashTitle').textContent = title;
  $('splashDesc').textContent = desc;
  wrap.classList.remove('hidden');
  wrap.setAttribute('aria-hidden', 'false');
  clearTimeout(showChapterSplash.timer);
  showChapterSplash.timer = setTimeout(()=>{
    wrap.classList.add('hidden');
    wrap.setAttribute('aria-hidden', 'true');
  }, 1650);
}
function visitScene(sceneId){
  if(!state.visitedScenes) state.visitedScenes = [];
  if(typeof state.introSeen !== "boolean") state.introSeen = false;
  const first = !state.visitedScenes.includes(sceneId);
  if(first) state.visitedScenes.push(sceneId);
  return first;
}
function goScene(sceneId, narration='你移动到新的地点。', opts={}){
  const first = visitScene(sceneId);
  state.scene = sceneId;
  if(narration !== false){
    say(opts.speaker || '系统', opts.role || '调查记录', opts.portrait || '', narration || '你移动到新的地点。');
  }
  render();
  if(first || opts.forceSplash){
    const scene = scenes[sceneId];
    const kicker = opts.kicker || (scene.caseId === 'case3' ? '第三案：灰塔匿名函' : scene.caseId === 'case2' ? '第二案：沉默账本' : scene.caseId === 'hub' ? '推理中枢' : '第一案：雨夜证词');
    showChapterSplash(kicker, scene.name, scene.desc);
  }
}
function currentChapter(){
  const scene = scenes[state.scene];
  if(scene.caseId === 'hub') return chapters.find(c=>c.id===state.activeCase) || chapters[0];
  return chapters.find(c=>c.id===scene.caseId) || chapters[0];
}

function render(){
  const scene = scenes[state.scene];
  if(scene.caseId !== 'hub') state.activeCase = scene.caseId;
  const ch = currentChapter();
  $('chapterKicker').textContent = ch.title;
  $('chapterTitle').textContent = scene.name;
  $('phaseBadge').textContent = scene.phase;
  $('locationName').textContent = scene.name;
  $('locationDesc').textContent = scene.desc;
  const artEl = $('locationArt');
  artEl.style.backgroundImage = `url(\"${scene.art}\")`;
  artEl.classList.remove('scene-animate');
  void artEl.offsetWidth;
  artEl.classList.add('scene-animate');
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
  setSceneAudio(state.scene);
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
      if(action.special === 'casehall'){ showCaseSelect(); return; }
      if(action.goto){
        playSfx('move');
        goScene(action.goto, action.say || '你移动到新的地点。', { speaker:'系统', role:'调查记录' });
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
      say('韩亦','刑警 / 案件联络人','./assets/char_hanyi_v6.png', action.say || '这条线索值得记录。');
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
    const caseLabel = c.caseId === 'case1' ? '第一案' : c.caseId === 'case2' ? '第二案' : '第三案';
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
    ['city','商业区路口','第一案现场',true,60,120],
    ['store','便利店现场','冷白灯下的第一案核心现场',true,310,80],
    ['meeting','会见室','询问陈巍',true,610,130],
    ['office','律所办公室','证据组合与案件笔记',state.evidence.length>=4,300,290],
    ['court','第一案法庭','完成第一案庭审',state.evidence.length>=7,585,300],
    ['hospital','云港医院','第二案开启后可调查',caseDone('case1'),65,425],
    ['dock','旧码头仓库','第二案追踪黑车',caseDone('case1'),305,500],
    ['court2','第二案法庭','完成第二案庭审',state.evidence.length>=14,590,500],
    ['archive','市档案中心','第三案追查匿名函',caseDone('case2'),850,210],
    ['rooftop','金融街天台','终局前夜的会面地点',caseDone('case2'),1065,370],
    ['court3','第三案法庭','终极结局所在',state.evidence.length>=20 && caseDone('case2'),900,575]
  ];
  const lines = `
    <div class="mapLine" style="left:205px;top:163px;width:145px;transform:rotate(-10deg)"></div>
    <div class="mapLine" style="left:470px;top:150px;width:150px;transform:rotate(10deg)"></div>
    <div class="mapLine" style="left:420px;top:215px;width:145px;transform:rotate(60deg)"></div>
    <div class="mapLine" style="left:190px;top:378px;width:180px;transform:rotate(18deg)"></div>
    <div class="mapLine" style="left:455px;top:455px;width:150px;transform:rotate(0deg)"></div>
    <div class="mapLine" style="left:680px;top:290px;width:190px;transform:rotate(-20deg)"></div>
    <div class="mapLine" style="left:940px;top:300px;width:145px;transform:rotate(35deg)"></div>
    <div class="mapLine" style="left:955px;top:470px;width:125px;transform:rotate(120deg)"></div>
  `;
  const html = nodes.map(([id,title,desc,ok,x,y])=>`
    <button class="mapNode v4" style="left:${x}px;top:${y}px" data-map="${id}" ${ok ? '' : 'disabled'}>
      <h3>${ok ? '◆ ' : '◇ '}${title}</h3><p>${ok ? desc : '尚未解锁'}</p>
    </button>`).join('');
  showModal('城市地图', `<div class="city-map-board">${lines}${html}</div>`);
  document.querySelectorAll('[data-map]').forEach(btn=>{
    btn.onclick = () => {
      playSfx('move');
      closeModal();
      goScene(btn.dataset.map, '你抵达新的地点。', { speaker:'系统', role:'城市地图' });
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
    ['cover_v6.png','封面海报','V6 新增的封面海报，作为首页主视觉。','cover'],
    ['scene_city_v6.png','商业区路口','雨夜、警戒线与霓虹倒影构成第一案的起点。',''],
    ['scene_store_v6.png','便利店现场','冷白灯和被雨水包围的现场，让案发痕迹更加压迫。',''],
    ['scene_office_v6.png','律所办公室','证据墙与夜景共同构成推理舞台。',''],
    ['scene_hospital_v6.png','云港医院','第二案的白色走廊，安静得像一条被抹掉的证词。',''],
    ['scene_dock_v6.png','旧码头仓库','湿冷的港区与仓库，收束了幕后链条。',''],
    ['scene_archive_v8.svg','市档案中心','第三案新增地点。卷宗、检索终端与纸面真相构成新的压迫感。',''],
    ['scene_rooftop_v8.svg','金融街天台','第三案新增终局现场。高处风压与城市夜景把对峙推向更冷的层面。','']
  ];
  const html = items.map(([img,title,desc,extra])=>`<div class="gallery-card"><div class="thumb ${extra}" style="background-image:url('./assets/${img}')"></div><div class="gallery-body"><h3>${title}</h3><p>${desc}</p></div></div>`).join('');
  showModal('视觉图鉴', `<div class="gallery-grid">${html}</div>`);
}

function showCharacterCodex(){
  const html = characterCodex.map(c=>`<div class="character-card"><div class="thumb" style="background-image:url('${c.portrait}')"></div><div class="body"><h3>${c.name}</h3><span class="role">${c.role}</span><p>${c.desc}</p></div></div>`).join('');
  showModal('角色档案', `<div class="character-grid">${html}</div>`);
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
    const unlocked = state.endings.includes(name) || (name === '终极结局：法典之上' && caseDone('case3')) || (name === '第二案终局：法域之城' && caseDone('case2')) || (name === '第一案真相结局：雨停之前' && caseDone('case1'));
    const meta = endingsMeta[name];
    return `<div class="ending-card ${unlocked ? '' : 'locked'}"><div class="rank">${unlocked ? meta.rank : '?'}</div><h3>${unlocked ? name : '未解锁结局'}</h3><p>${unlocked ? meta.desc : '继续推进调查、尝试不同选择。'}</p></div>`;
  }).join('');
  showModal('结局收藏', `<div class="ending-grid">${html}</div>`);
}
function showSettings(){
  showModal('声音与演出设置', `
    <div class="settings-grid v7">
      <div class="settings-card">
        <h3>总控制</h3>
        <p>V8 使用程序实时生成的动态配乐、环境雨声与交互音效，不依赖额外音频文件。</p>
        <div class="toggle-line"><span>总音频：${state.settings.audio ? '已开启' : '已静音'}</span><button class="switch" id="toggleMaster">${state.settings.audio ? '一键静音' : '恢复声音'}</button></div>
        <div class="toggle-line" style="margin-top:10px"><span>当前 BGM：${audio.nowPlaying || '未启动'}</span><button class="switch" id="restartTrack">重新载入当前场景配乐</button></div>
        <div class="audio-status" style="margin-top:12px"><strong>提示：</strong>每个场景都有不同配乐预设。切换地点时，配乐会自动变化。</div>
      </div>
      <div class="settings-card">
        <h3>演出开关</h3>
        <p>你可以自由决定文本和环境的演出强度。</p>
        <div class="toggle-line"><span>动态配乐：${state.settings.music ? '开启' : '关闭'}</span><button class="switch" id="toggleMusic">切换配乐</button></div>
        <div class="toggle-line" style="margin-top:10px"><span>环境音：${state.settings.ambient ? '开启' : '关闭'}</span><button class="switch" id="toggleAmbient">切换环境音</button></div>
        <div class="toggle-line" style="margin-top:10px"><span>打字机效果：${state.settings.typewriter ? '开启' : '关闭'}</span><button class="switch" id="toggleTypewriter">切换打字机</button></div>
      </div>
      <div class="settings-card">
        <h3>音量混音</h3>
        <div class="range-row"><label>配乐音量 <strong id="musicVolVal">${Math.round(state.settings.musicVolume * 100)}%</strong></label><input id="musicVol" type="range" min="0" max="100" value="${Math.round(state.settings.musicVolume * 100)}"></div>
        <div class="range-row"><label>环境音量 <strong id="ambientVolVal">${Math.round(state.settings.ambientVolume * 100)}%</strong></label><input id="ambientVol" type="range" min="0" max="100" value="${Math.round(state.settings.ambientVolume * 100)}"></div>
        <div class="range-row"><label>音效音量 <strong id="sfxVolVal">${Math.round(state.settings.sfxVolume * 100)}%</strong></label><input id="sfxVol" type="range" min="0" max="100" value="${Math.round(state.settings.sfxVolume * 100)}"></div>
      </div>
      <div class="settings-card">
        <h3>场景说明</h3>
        <p>当前场景：${scenes[state.scene].name}</p>
        <div class="audio-status"><strong>场景演出：</strong>${(audioPresets[state.scene] || audioPresets.city).label}<br/>随着你前往律所、医院、码头、档案中心或金融街天台，V8 会自动切换对应气质的配乐与环境混音。</div>
      </div>
    </div>
  `);
  const bindSlider = (id, key, labelId) => {
    const el = $(id);
    if(!el) return;
    el.oninput = () => {
      state.settings[key] = Number(el.value) / 100;
      $(labelId).textContent = `${el.value}%`;
      updateAudioUi();
      save();
    };
  };
  $('toggleMaster').onclick = () => { toggleAudio(); showSettings(); };
  $('toggleMusic').onclick = () => { state.settings.music = !state.settings.music; updateAudioUi(); save(); showSettings(); };
  $('toggleAmbient').onclick = () => { state.settings.ambient = !state.settings.ambient; updateAudioUi(); save(); showSettings(); };
  $('toggleTypewriter').onclick = () => { state.settings.typewriter = !state.settings.typewriter; save(); showSettings(); };
  $('restartTrack').onclick = () => { if(audio.musicTimer) clearInterval(audio.musicTimer); audio.currentScene = ''; setSceneAudio(state.scene); updateAudioUi(); playSfx('move'); };
  bindSlider('musicVol', 'musicVolume', 'musicVolVal');
  bindSlider('ambientVol', 'ambientVolume', 'ambientVolVal');
  bindSlider('sfxVol', 'sfxVolume', 'sfxVolVal');
}

function showIntro(startAfter=false){
  const html = `
    <p>这是一段用于强化沉浸感的序章演出。你可以先阅读它，再正式进入案件。</p>
    <div class="intro-flow">
      <div class="intro-card"><span class="intro-kicker">01 / 雨夜</span><h3>一通没有被接起的电话</h3><p>22:13，商业区便利店的监控开始黑屏。有人把报警拖慢了 47 秒，也把一个原本只是债务纠纷的夜晚，推成了一场蓄意误导。</p></div>
      <div class="intro-card"><span class="intro-kicker">02 / 城市</span><h3>每个人都只说一半真话</h3><p>苏岚在害怕，陈巍在愤怒，韩亦在追索真正的责任链。便利店、医院、旧码头与金融街高楼，将在同一部法典里重新连接。</p></div>
      <div class="intro-card"><span class="intro-kicker">03 / 法庭</span><h3>证据会逼问偏见</h3><p>你不是来选择一个最像凶手的人，而是要让证据彼此作证。真相值决定你能看见多少，正义值决定你愿意承担多少。</p></div>
      <div class="intro-card"><span class="intro-kicker">04 / 终局</span><h3>法典不该只写给街角的人</h3><p>第一案只会打开裂缝，第二案会让幕后结构显形，第三案会把目光抬到更高的楼层。真正的敌人，也许从来都不站在雨里。</p></div>
    </div>
    <div class="intro-actions">
      ${startAfter ? '<button id="introStartNow" class="btn gold">带着序章开始新游戏</button>' : '<button id="introEnterCase" class="btn gold">进入案件大厅</button>'}
      <button id="introCloseOnly" class="btn ghost">关闭</button>
    </div>
    <p class="muted-note">V9 新增：序章演出、三槽位手动存档、案件时间线。</p>`;
  showModal('序章：雨落之前', html);
  const startBtn = $('introStartNow');
  const enterBtn = $('introEnterCase');
  if(startBtn) startBtn.onclick = () => { playSfx('move'); state.introSeen = true; closeModal(); enterGame(true); save(); };
  if(enterBtn) enterBtn.onclick = () => { playSfx('move'); state.introSeen = true; closeModal(); load(); showCaseSelect(); save(); };
  if($('introCloseOnly')) $('introCloseOnly').onclick = () => { playSfx('click'); closeModal(); save(); };
}
function showSaveManager(){
  const cards = Array.from({ length: MANUAL_SLOT_COUNT }, (_, idx) => {
    const slot = idx + 1;
    const rec = readSlot(slot);
    if(!rec || !rec.data){
      return `<div class="save-card"><h3>存档槽位 ${slot}</h3><p>当前为空。你可以把调查进度保存在这里。</p><div class="save-actions"><button class="mini-btn" data-save-slot="${slot}">保存当前进度</button></div></div>`;
    }
    const data = rec.data;
    return `<div class="save-card"><h3>存档槽位 ${slot}</h3><p>${caseTitleById(data.activeCase || (scenes[data.scene] ? scenes[data.scene].caseId : 'case1'))} · ${sceneTitleById(data.scene)}</p><div class="save-meta"><div>时间：${formatStamp(rec.savedAt)}</div><div>证据：${(data.evidence || []).length} / ${TOTAL_EVIDENCE}</div><div>真相：${data.truth || 0}</div><div>正义：${data.ethics || 0}</div></div><div class="save-actions"><button class="mini-btn" data-load-slot="${slot}">读取</button><button class="mini-btn" data-save-slot="${slot}">覆盖</button><button class="mini-btn danger" data-del-slot="${slot}">删除</button></div></div>`;
  }).join('');
  showModal('存档管理', `<p>自动存档会持续记录当前进度；这里提供 3 个手动槽位，适合保留不同分支。</p><div class="save-grid">${cards}</div>`);
  document.querySelectorAll('[data-save-slot]').forEach(btn => btn.onclick = () => saveToSlot(Number(btn.dataset.saveSlot)));
  document.querySelectorAll('[data-load-slot]').forEach(btn => btn.onclick = () => loadFromSlot(Number(btn.dataset.loadSlot)));
  document.querySelectorAll('[data-del-slot]').forEach(btn => btn.onclick = () => deleteSlot(Number(btn.dataset.delSlot)));
}
function saveToSlot(slot){
  localStorage.setItem(slotKey(slot), JSON.stringify({ version:'V9', savedAt: Date.now(), data: serializeState() }));
  showSaveManager();
  showToast('手动存档完成', `进度已保存到槽位 ${slot}。`);
  playSfx('success');
}
function loadFromSlot(slot){
  const rec = readSlot(slot);
  if(!rec || !rec.data){ showToast('读取失败', `槽位 ${slot} 为空。`); playSfx('fail'); return; }
  hydrateState(rec.data);
  closeModal();
  activateGameUI();
  visitScene(state.scene);
  render();
  say('系统','存档管理','', `已从槽位 ${slot} 读取进度：${caseTitleById(state.activeCase)} / ${sceneTitleById(state.scene)}。`);
  showChapterSplash(caseTitleById(currentChapter().id), scenes[state.scene].name, '手动存档读取成功。');
  save();
  playSfx('move');
}
function deleteSlot(slot){
  localStorage.removeItem(slotKey(slot));
  showSaveManager();
  showToast('槽位已删除', `槽位 ${slot} 已清空。`);
  playSfx('click');
}
function showTimeline(){
  const visitHtml = (state.visitedScenes || []).map((id, idx) => {
    const scene = scenes[id];
    if(!scene) return '';
    const cid = scene.caseId === 'hub' ? state.activeCase : scene.caseId;
    return `<div class="timeline-item"><div class="timeline-dot">${String(idx + 1).padStart(2, '0')}</div><div><strong>${scene.name}</strong><small>${caseTitleById(cid)} · ${scene.phase}</small><p>${scene.desc}</p></div></div>`;
  }).join('') || '<p>你还没有移动到新的地点。</p>';
  const latestEvidence = state.evidence.slice(-6).reverse().map(name => `<div class="note"><strong>${iconFor(name)} ${name}</strong><p>${hintFor(name)}</p></div>`).join('') || '<p>尚未获得证据。</p>';
  const latestDeduction = state.deductions.slice(-4).reverse().map(name => `<div class="note"><strong>🧠 ${name}</strong><p>链条正在收束，继续前往法庭验证它。</p></div>`).join('') || '<p>尚未完成组合推理。</p>';
  const completed = state.completedCases.map(caseTitleById).join('、') || '尚未结案';
  showModal('案件时间线', `
    <div class="timeline-grid">
      <div class="timeline-card"><h3>地点推进</h3><div class="timeline-list">${visitHtml}</div></div>
      <div class="timeline-stats">
        <div class="timeline-card"><h3>总体进度</h3><div class="stat"><strong>${state.evidence.length}</strong>已收集证据</div><div class="stat"><strong>${state.deductions.length}</strong>已完成组合推理</div><div class="stat"><strong>${state.completedCases.length}</strong>已完成案件</div><p class="muted-note">当前结案：${completed}</p></div>
        <div class="timeline-card"><h3>最近证据</h3><div class="note-grid">${latestEvidence}</div></div>
        <div class="timeline-card"><h3>最近推理</h3><div class="note-grid">${latestDeduction}</div></div>
      </div>
    </div>`);
}

function showCaseSelect(){
  const html = `
    <button class="casePick" data-case="case1"><h3>第一案：雨夜证词</h3><p>便利店、黑车、伪造订单。已${caseDone('case1') ? '完成' : '开启'}。</p></button>
    <button class="casePick" data-case="case2" ${caseDone('case1') ? '' : 'disabled'}><h3>第二案：沉默账本</h3><p>${caseDone('case1') ? '医院、旧码头与幕后委托人。' : '完成第一案真相结局后解锁。'}</p></button>
    <button class="casePick" data-case="case3" ${caseDone('case2') ? '' : 'disabled'}><h3>第三案：灰塔匿名函</h3><p>${caseDone('case2') ? '市档案中心、金融街天台与终局法庭。' : '完成第二案终局后解锁。'}</p></button>
  `;
  showModal('案件大厅', `<div class="case-grid">${html}</div>`);
  document.querySelectorAll('[data-case]').forEach(btn=>{
    btn.onclick = () => {
      playSfx('move');
      const c = btn.dataset.case;
      closeModal();
      enterGame(false);
      const target = c === 'case1' ? 'city' : c === 'case2' ? 'hospital' : 'archive';
      const text = c === 'case1' ? '重新进入第一案。' : c === 'case2' ? '沉默账本，再次开始。' : '灰塔匿名函，开始收束整座城市。';
      goScene(target, text, { forceSplash:true });
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
  const c3Good = state.deductions.includes('组合推理：灰塔资本介入灭口') &&
                 state.deductions.includes('组合推理：终局委托人锁定') &&
                 state.evidence.includes('灰塔转账凭证') && state.truth >= 28 && caseDone('case2');

  if(type === 'case1good' && c1Good){
    if(!caseDone('case1')) state.completedCases.push('case1');
    title = '第一案真相结局：雨停之前';
    body = `<p>你提交了完整证据链：黑屏监控证明有人预设盲区，伪造订单解释陈巍为何回到现场，黑车线索与店长合同揭开真正动机。</p><p>乔衡被带离时说出一句话：账本不在我手里。第二案已解锁。</p><button class="btn gold" onclick="goNextCase()">进入第二案</button>`;
    playSfx('success');
  } else if(type === 'case2good' && c2Good && caseDone('case1')){
    if(!caseDone('case2')) state.completedCases.push('case2');
    title = '第二案终局：法域之城';
    const rank = state.truth >= 24 && state.ethics >= 5 ? 'S' : state.truth >= 20 ? 'A' : 'B';
    scoreBlock = `<div class="score-grid"><div class="score"><strong>${rank}</strong>第二案评级</div><div class="score"><strong>${state.truth}</strong>真相值</div><div class="score"><strong>${state.ethics}</strong>正义值</div><div class="score"><strong>${state.evidence.length}</strong>证据数</div></div>`;
    body = `${scoreBlock}<p>医院账本、码头货柜和录音形成闭环。法庭决定移送更高层级侦查，陈巍彻底洗清嫌疑，苏岚进入证人保护程序。</p><p>但卷宗并没有结束。匿名函上的‘塔’字，把你推向城市更高的楼层。第三案已解锁。</p><button class="btn gold" onclick="goFinalCase()">进入第三案</button>`;
    playSfx('success');
  } else if(type === 'case3good' && c3Good){
    if(!caseDone('case3')) state.completedCases.push('case3');
    title = '终极结局：法典之上';
    const rank = state.truth >= 33 && state.ethics >= 6 ? 'SS' : state.truth >= 30 ? 'S' : 'A';
    scoreBlock = `<div class="score-grid"><div class="score"><strong>${rank}</strong>终局评级</div><div class="score"><strong>${state.truth}</strong>真相值</div><div class="score"><strong>${state.ethics}</strong>正义值</div><div class="score"><strong>${state.evidence.length}</strong>证据数</div></div>`;
    body = `${scoreBlock}<p>匿名函、审计 U 盘、天台门禁和转账凭证终于在法庭上完成闭环。灰塔资本的最终委托人被正式起诉，第一案里的雨夜也终于得到真正的回声。</p><p>你没有让这座城市立刻变好，但你逼它承认：法典不该只写给街角的人，也该写给高楼里的人。</p><button class="btn gold" onclick="resetGame()">重新开始</button>`;
    playSfx('success');
  } else if(type.includes('good')){
    title = '证据不足：真相隔着一层雾';
    body = `<p>你的方向正确，但证据链还没有完全闭合。回到律所，完成对应案件的组合推理，再回到法庭。</p>`;
    playSfx('court');
  } else if(type === 'partial'){
    title = '部分胜利：裂缝被撬开';
    body = `<p>你指出了案件中的异常，但没有把异常连成完整的责任链。案件重审，真正的委托人仍在更高处等待别人替他承担代价。</p>`;
    playSfx('court');
  } else {
    title = '错误结局：偏见判词';
    body = `<p>你选择了动机，而不是证据。城市收下了一个仓促的答案，真正的指令者在夜色里继续翻页。</p>`;
    playSfx('fail');
  }
  rememberEnding(title);
  render();
  showModal(title, body);
}
function goNextCase(){
  closeModal();
  goScene('hospital', '乔衡开口前，有人切断了审讯室电源。线索指向云港医院。第二案，开始。', { speaker:'韩亦', role:'刑警 / 案件联络人', portrait:'./assets/char_hanyi_v6.png', forceSplash:true, kicker:'第二案：沉默账本' });
}
function goFinalCase(){
  closeModal();
  goScene('archive', '第二案结束后的第三天，一封匿名函被送到律所前台。寄件信息指向市档案中心。第三案，开始。', { speaker:'系统', role:'案件推进', forceSplash:true, kicker:'第三案：灰塔匿名函' });
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
  const settings = Object.assign({}, defaultSettings, state.settings || {});
  state = { scene:'city', activeCase:'case1', completedCases:[], evidence:[], deductions:[], truth:0, ethics:0, used:{}, endings:[], achievements:[], settings,
  visitedScenes:[], introSeen:state.introSeen || false };
  closeModal();
  visitScene('city');
  render();
  say('系统','调查记录','', '雨越下越密。你抵达商业区路口，案件从这里重新呼吸。');
  showChapterSplash('第一案：雨夜证词', '商业区路口', scenes.city.desc);
  showToast('游戏已重置', '新的调查已经开始。');
  save();
}
function enterGame(reset=false){
  ensureAudio();
  if(reset) resetGame(); else {
    load();
    visitScene(state.scene);
    render();
  }
  activateGameUI();
  if(!reset) showChapterSplash(currentChapter().title, scenes[state.scene].name, scenes[state.scene].desc);
}



window.showCombo = showCombo;
window.goNextCase = goNextCase;
window.goFinalCase = goFinalCase;
window.resetGame = resetGame;

$('newGameBtn').onclick = () => { playSfx('click'); showIntro(true); };
$('continueBtn').onclick = () => { playSfx('click'); enterGame(false); };
$('caseSelectBtn').onclick = () => { playSfx('click'); load(); showCaseSelect(); };
$('introBtn').onclick = () => { playSfx('click'); load(); showIntro(false); };
$('saveManagerBtn').onclick = () => { playSfx('click'); load(); showSaveManager(); };
$('galleryBtn').onclick = () => { playSfx('click'); showGallery(); };
$('charactersBtn').onclick = () => { playSfx('click'); showCharacterCodex(); };
$('charactersTopBtn').onclick = () => { playSfx('click'); showCharacterCodex(); };
$('collectionBtn').onclick = () => { playSfx('click'); showEndingCollection(); };
$('howBtn').onclick = () => showModal('玩法说明', `
  <ol>
    <li>点击地点卡片调查现场，收集证据。</li>
    <li>有些地点会被前置证据锁住，比如黑车残片需要先获得苏岚的黑车证词。</li>
    <li>回到律所办公室，可以进行证据组合推理。</li>
    <li>第一案真相结局会解锁第二案，第二案终局会继续解锁第三案。</li>
    <li>新增成就系统、结局收藏、案件大厅与音频设置。</li>
    <li>V6 已加入 AI 场景插画、角色立绘、封面海报与角色档案。</li>
    <li>V7 新增动态配乐、场景转场、声音设置面板与分轨音量控制。</li>
    <li>V8 新增第三案、市档案中心、金融街天台与终局法庭。</li>
    <li>V9 新增序章演出、手动存档系统和案件时间线。</li>
    <li>当前版本的环境音、配乐与交互音效由程序实时生成，不依赖外部音频文件。</li>
  </ol>
`);
$('closeModal').onclick = closeModal;
$('resetBtn').onclick = () => { playSfx('click'); resetGame(); };
$('notebookBtn').onclick = () => { playSfx('click'); showNotebook(); };
$('timelineBtn').onclick = () => { playSfx('click'); showTimeline(); };
$('savePanelBtn').onclick = () => { playSfx('click'); showSaveManager(); };
$('atlasBtn').onclick = () => { playSfx('click'); showEvidenceAtlas(); };
$('caseHallBtn').onclick = () => { playSfx('click'); showCaseSelect(); };
$('mapBtn').onclick = () => { playSfx('click'); showMap(); };
$('achievementsBtn').onclick = () => { playSfx('click'); showAchievements(); };
$('settingsBtn').onclick = () => { playSfx('click'); showSettings(); };
$('audioBtn').onclick = () => { toggleAudio(); if(state.settings.audio) playSfx('click'); };

load();
visitScene(state.scene);
render();
say('系统','调查记录','', '雨越下越密。你抵达商业区路口，案件从这里重新呼吸。');
document.addEventListener('click', ensureAudio, { once:true });
