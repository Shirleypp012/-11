import React, { useState } from 'react';
import { 
  Calendar, 
  Target, 
  Sparkles, 
  Flame, 
  RotateCcw, 
  CheckCircle2, 
  ArrowRight, 
  Zap, 
  Clock, 
  Users, 
  TrendingUp, 
  ShieldCheck, 
  ShoppingBag,
  BellRing
} from 'lucide-react';

export interface CampaignStage {
  id: string;
  name: string;
  tag: string;
  dateRange: string;
  duration: string;
  status: 'completed' | 'active' | 'upcoming';
  headline: string;
  coreObjective: string;
  keyTactics: {
    title: string;
    description: string;
  }[];
  operationalChecklist: string[];
  kpiMetrics: { label: string; value: string }[];
  highlightColor: string;
  badgeStyle: string;
  cardActiveStyle: string;
}

export const CAMPAIGN_STAGES: CampaignStage[] = [
  {
    id: 'stage-seed',
    name: '种草蓄水期',
    tag: 'Pre-warm & Seeding',
    dateRange: '10月12日 - 10月23日',
    duration: '12天',
    status: 'completed',
    headline: '全域人群破圈拉新 · 爆款内容种草蓄水',
    coreObjective: '通过小红书、抖音达人矩阵与逛逛内容种草，打通潜在人群心智，扩充店铺人群资产池与爆款意向加购。',
    keyTactics: [
      {
        title: '小红书 KOC/KOL 种草矩阵',
        description: '布局痛点场景（如久坐护脊、户外健康、抗衰修护），铺设高赞笔记并埋下双十一搜索词拦截。',
      },
      {
        title: '直通车/引力魔方广泛拉新',
        description: '以低成本拿量为导向，广泛圈选行业高潜与竞品流失人群，引导收藏宝贝及关注店铺领大促券。',
      },
      {
        title: '私域老客大促唤醒',
        description: '企业微信与短信定向触达老客，提前派发双十一老客专享“无门槛抢跑神券”，建立回购心智。',
      },
    ],
    operationalChecklist: [
      '主推款拍摄修图与详情页完成（PicPilot 视觉物料出炉）',
      '竞品价格与机制完成首次基线抓取（changedetection 开启全盘监控）',
      '核心爆款现货入仓并与顺丰完成大促干线锁约',
      '达人合作内容 100% 验收上线',
    ],
    kpiMetrics: [
      { label: '人群资产增长', value: '+340,000' },
      { label: '自然搜索 UV', value: '+128%' },
      { label: '预热加购蓄水', value: '42,000 件' },
    ],
    highlightColor: 'text-blue-600',
    badgeStyle: 'bg-blue-50 text-blue-700 border-blue-200',
    cardActiveStyle: 'border-blue-500 bg-blue-50/20 shadow-sm',
  },
  {
    id: 'stage-presale',
    name: '定金预售期',
    tag: 'Presale & Lock',
    dateRange: '10月24日 20:00 - 10月31日 18:00',
    duration: '8天',
    status: 'active',
    headline: '定金膨胀超强锁定 · 争抢第一波开门红',
    coreObjective: '用超值“定金立减+定金膨胀+赠品前N件”组合拳锁定买家确定性需求，抢先锁定核心 GMV 底盘。',
    keyTactics: [
      {
        title: '定金膨胀机制打透',
        description: '天猫/抖音主推“定金¥100抵¥300”，主图醒目标记“买贵必退差”，消除买家后续降价顾虑。',
      },
      {
        title: '前1小时/前N件阶梯加赠',
        description: '设定“前1000名付定金加赠正装耗材/原装配件”，利用紧迫感刺激首日晚8点瞬时爆发抢跑。',
      },
      {
        title: '客服与自动化全速协同',
        description: 'Chatwoot 客服启动大促金牌话术，n8n 自动化监控加购未付定金买家并推送专属催付提醒。',
      },
    ],
    operationalChecklist: [
      '全面核查定金池资金锁库与可用库存配比（Medusa 防超卖）',
      '启动 24 小时竞品破价雷达，一旦对手下调即时防守联动',
      '多渠道客服配置 30 天价保与顺丰发货时效快捷回复',
      '尾款开启前向买家自动下发日历待办提醒与尾款红包',
    ],
    kpiMetrics: [
      { label: '锁定定金规模', value: '¥4,520,000' },
      { label: '定金订单转化率', value: '8.64%' },
      { label: '保价咨询转化', value: '78.2%' },
    ],
    highlightColor: 'text-amber-600',
    badgeStyle: 'bg-amber-50 text-amber-700 border-amber-200',
    cardActiveStyle: 'border-amber-500 bg-amber-50/20 shadow-sm',
  },
  {
    id: 'stage-burst',
    name: '现货爆发期',
    tag: 'Mega Burst & Peak',
    dateRange: '10月31日 20:00 - 11月11日 24:00',
    duration: '12天',
    status: 'upcoming',
    headline: '双波段狂欢冲顶 · 跨店满减与极限履约',
    coreObjective: '分两波（开门红 10.31-11.03 与 终极大促 11.10-11.11）全面承接尾款结算与现货直购洪峰，冲刺年度销量桂冠。',
    keyTactics: [
      {
        title: '满300-50凑单全流程渗透',
        description: '详情页与加购弹窗智能计算“还差¥XX元可再减¥50”，引导顺手凑单高毛利配件，拉升客单价。',
      },
      {
        title: '尾款倒计时极限催付',
        description: '尾款开放 30 分钟未付者，n8n 自动分流发送 ¥20 召回红包与短信通知，挽救跳失订单。',
      },
      {
        title: '顺丰极速打单与前置仓次日达',
        description: '已付订单半小时内自动推单出库，电子面单与物流时效即时推送买家，用极致体验斩获好评。',
      },
    ],
    operationalChecklist: [
      '双十一当晚 20:00 核心技术与运营团队全员值守',
      '仓库顺丰干线冷链多仓联动，启动夜间通宵分拣打包',
      '根据小时 GMV 弹性调整直通车投产出价，重点压制竞争对手',
      '监控热销款安全库存，临界缺货立即转为排产预售批次',
    ],
    kpiMetrics: [
      { label: '目标 GMV', value: '¥12,000,000' },
      { label: '峰值每秒订单', value: '320 单/秒' },
      { label: '24小时发货率', value: '99.2%' },
    ],
    highlightColor: 'text-red-600',
    badgeStyle: 'bg-red-50 text-red-700 border-red-200',
    cardActiveStyle: 'border-red-500 bg-red-50/20 shadow-sm',
  },
  {
    id: 'stage-after',
    name: '大促返场期',
    tag: 'Aftermath & Retention',
    dateRange: '11月12日 - 11月15日',
    duration: '4天',
    status: 'upcoming',
    headline: '同价狂欢余热消化 · 会员沉淀与售后口碑',
    coreObjective: '以“狂欢同价返场，现货最后 3 天”为由头承接双十一长尾流量，同时强化售后无忧与会员社群沉淀。',
    keyTactics: [
      {
        title: '手慢无 · 同价返场捡漏',
        description: '针对双十一未赶上大促或因缺货未买到的客群，开放部分尾数库存，保持核心爆款优惠力度。',
      },
      {
        title: '专属客户关怀与晒单有礼',
        description: '包裹签收后自动触发企微加粉工单，送出延保卡或 ¥15 晒单现金红包，积累高质量评价。',
      },
      {
        title: '双十一运营数据复盘复盘',
        description: '沉淀各渠道 ROI、选品命中率、退货率及自动化流程触发效果，沉淀大促运营 SOP 知识库。',
      },
    ],
    operationalChecklist: [
      '启动 7 天无理由与换货极速通道，降低售后差评与纠纷率',
      '盘点剩余库存与工厂排单，做好双十二与年货节转款衔接',
      '结算返利与达人佣金，复盘各渠道渠道投产效率',
      '将双十一大促新客沉淀至品牌 VIP 私域社群',
    ],
    kpiMetrics: [
      { label: '返场贡献 GMV', value: '¥1,500,000' },
      { label: '大促好评率', value: '99.5%' },
      { label: '新客私域沉淀', value: '35,000+' },
    ],
    highlightColor: 'text-purple-600',
    badgeStyle: 'bg-purple-50 text-purple-700 border-purple-200',
    cardActiveStyle: 'border-purple-500 bg-purple-50/20 shadow-sm',
  },
];

export const MarketingCalendar: React.FC = () => {
  const [selectedStageId, setSelectedStageId] = useState<string>('stage-presale');

  const currentStage = CAMPAIGN_STAGES.find((s) => s.id === selectedStageId) || CAMPAIGN_STAGES[1];

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-red-50 text-red-600 border border-red-100">
              <Calendar className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              2026 双十一作战全周期营销日历 & 阶段策略矩阵
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            横跨蓄水、预售、爆发与返场四大战役阶段，点击各阶段卡片即可查看对应的作战策略、执行清单与关键考核指标。
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono shrink-0">
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 font-semibold">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            <span>当前阶段：定金预售期</span>
          </span>
        </div>
      </div>

      {/* 4-Stage Horizontal Timeline Stepper */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {CAMPAIGN_STAGES.map((stage, idx) => {
          const isSelected = stage.id === selectedStageId;
          const isCurrentActive = stage.status === 'active';

          return (
            <div
              key={stage.id}
              onClick={() => setSelectedStageId(stage.id)}
              className={`relative cursor-pointer rounded-xl p-4 transition-all border ${
                isSelected
                  ? stage.cardActiveStyle
                  : 'bg-slate-50/60 border-slate-200 hover:bg-slate-50 hover:border-slate-300'
              }`}
            >
              {/* Top Row: Index & Status badge */}
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-mono font-bold text-slate-400">
                  STAGE 0{idx + 1}
                </span>

                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                    stage.status === 'completed'
                      ? 'bg-slate-100 text-slate-500 border-slate-200'
                      : stage.status === 'active'
                        ? 'bg-amber-100 text-amber-800 border-amber-300 font-bold'
                        : 'bg-slate-50 text-slate-500 border-slate-200'
                  }`}
                >
                  {stage.status === 'completed' && '已收官'}
                  {stage.status === 'active' && '● 进行中'}
                  {stage.status === 'upcoming' && '待启动'}
                </span>
              </div>

              {/* Stage Name & Date */}
              <h4 className="text-sm font-bold text-slate-900 mb-1 flex items-center gap-1.5">
                <span>{stage.name}</span>
                {isCurrentActive && (
                  <Flame className="w-3.5 h-3.5 fill-red-500 text-red-500 animate-bounce" />
                )}
              </h4>
              <div className="text-xs text-slate-500 font-mono">
                {stage.dateRange}
              </div>

              {/* Duration pill */}
              <div className="mt-3 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px]">
                <span className="text-slate-400 font-mono">周期: {stage.duration}</span>
                <span
                  className={`font-semibold flex items-center gap-0.5 text-xs transition-colors ${
                    isSelected ? stage.highlightColor : 'text-slate-400'
                  }`}
                >
                  <span>查看战术</span>
                  <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Stage Detail Drawer */}
      <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 space-y-5">
        {/* Stage Overview Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded border ${currentStage.badgeStyle}`}>
                {currentStage.tag}
              </span>
              <span className="text-xs text-slate-500 font-mono">时间跨度：{currentStage.dateRange} (共 {currentStage.duration})</span>
            </div>
            <h4 className="text-base font-bold text-slate-900">
              {currentStage.name}核心战役：{currentStage.headline}
            </h4>
            <p className="text-xs text-slate-600 mt-1 max-w-3xl leading-relaxed">
              {currentStage.coreObjective}
            </p>
          </div>

          {/* KPI Mini-cards */}
          <div className="flex items-center gap-3 shrink-0">
            {currentStage.kpiMetrics.map((kpi, idx) => (
              <div key={idx} className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-center shadow-xs">
                <div className="text-[10px] text-slate-400">{kpi.label}</div>
                <div className="text-sm font-bold font-mono text-slate-900 mt-0.5">
                  {kpi.value}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 2-Column Detail: Tactics vs Operational Checklist */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Key Marketing Tactics (7 cols) */}
          <div className="lg:col-span-7 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-800 uppercase tracking-wider">
              <Target className="w-4 h-4 text-red-600" />
              <span>本阶段三大关键营销打法 (Key Tactics)</span>
            </div>

            <div className="space-y-2.5">
              {currentStage.keyTactics.map((tactic, idx) => (
                <div
                  key={idx}
                  className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-xs hover:border-slate-300 transition-colors"
                >
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-900 mb-1">
                    <span className="w-5 h-5 rounded-full bg-red-50 text-red-600 flex items-center justify-center text-[10px] font-mono shrink-0">
                      0{idx + 1}
                    </span>
                    <span>{tactic.title}</span>
                  </div>
                  <p className="text-xs text-slate-600 pl-7 leading-relaxed">
                    {tactic.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Operational Checklist (5 cols) */}
          <div className="lg:col-span-5 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-800 uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>五维系统执行准备清单 (SOP Checklist)</span>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-2.5 shadow-xs">
              {currentStage.operationalChecklist.map((item, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span className="leading-snug">{item}</span>
                </div>
              ))}
            </div>

            <div className="p-3 rounded-lg bg-amber-50/80 border border-amber-200 text-xs text-amber-800 flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                提示：选品、素材、店铺、自动化与客服各模块已按本阶段策略协同就绪。
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
