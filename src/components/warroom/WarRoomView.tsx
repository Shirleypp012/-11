import React, { useState } from 'react';
import { 
  WarRoomMetrics, 
  NavTab, 
  CompetitorItem, 
  StoreProduct, 
  StoreOrder 
} from '../../types';
import { 
  TrendingUp, 
  Flame, 
  Sparkles, 
  Package, 
  Workflow, 
  MessageSquare, 
  ArrowRight, 
  Zap, 
  Calculator,
  FileText
} from 'lucide-react';
import { MarketingCalendar } from './MarketingCalendar';
import { WeeklyReportModal } from './WeeklyReportModal';

interface WarRoomViewProps {
  metrics: WarRoomMetrics;
  onNavigate: (tab: NavTab) => void;
  competitors: CompetitorItem[];
  products: StoreProduct[];
  orders: StoreOrder[];
  onSimulateSurge: () => void;
  onShowToast?: (msg: string, type?: 'success' | 'warning' | 'info') => void;
}

export const WarRoomView: React.FC<WarRoomViewProps> = ({
  metrics,
  onNavigate,
  competitors,
  products,
  orders,
  onSimulateSurge,
  onShowToast,
}) => {
  const [isReportModalOpen, setIsReportModalOpen] = useState<boolean>(false);

  // Calculator state
  const [calcPrice, setCalcPrice] = useState<number>(520);
  const [calcQty, setCalcQty] = useState<number>(2);
  const [calcCost, setCalcCost] = useState<number>(180);
  const [use88Vip, setUse88Vip] = useState<boolean>(true);
  const [useStoreCoupon, setUseStoreCoupon] = useState<boolean>(true);

  // Calculation logic
  const grossAmount = calcPrice * calcQty;
  // 跨店满300减50
  const fullMinusDiscount = Math.floor(grossAmount / 300) * 50;
  // 88VIP (满1000减100)
  const vipDiscount = (use88Vip && grossAmount >= 1000) ? 100 : 0;
  // 店铺粉丝券
  const storeCouponDiscount = useStoreCoupon ? 30 : 0;
  const totalDiscount = fullMinusDiscount + vipDiscount + storeCouponDiscount;
  const finalPaid = Math.max(0, grossAmount - totalDiscount);
  const unitFinalPaid = calcQty > 0 ? (finalPaid / calcQty) : 0;
  const totalCost = calcCost * calcQty;
  const grossProfit = finalPaid - totalCost;
  const profitMargin = finalPaid > 0 ? ((grossProfit / finalPaid) * 100) : 0;

  const targetPercentage = ((metrics.currentGMV / metrics.targetGMV) * 100).toFixed(1);

  return (
    <div className="space-y-6">
      {/* Top Banner: Dual 11 GMV Progress Cockpit (Light Mode) */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-red-600 via-red-600 to-rose-700 text-white p-6 md:p-8 shadow-sm">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-red-100">
              <Flame className="w-4 h-4 fill-amber-300 text-amber-300" />
              <span>11.11 预售爆发战役 · 实时累计战报</span>
            </div>
            <div className="flex items-baseline gap-4 flex-wrap">
              <span className="text-4xl md:text-5xl font-extrabold tracking-tight font-mono tabular-nums text-white">
                ¥{metrics.currentGMV.toLocaleString('zh-CN')}
              </span>
              <span className="text-sm font-medium text-red-100">
                目标 ¥{metrics.targetGMV.toLocaleString('zh-CN')} · 达成率{' '}
                <span className="font-mono font-bold text-amber-300">{targetPercentage}%</span>
              </span>
            </div>
            <p className="text-xs text-red-100/90 max-w-xl">
              预售蓄水锁定资金 ¥{metrics.presalePoolValue.toLocaleString('zh-CN')} · 现货直购 ¥
              {(metrics.currentGMV - metrics.presalePoolValue).toLocaleString('zh-CN')} · 订单总数{' '}
              <span className="font-mono font-semibold text-white">{metrics.todayOrdersCount.toLocaleString()}</span> 单
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsReportModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-white font-semibold text-xs border border-white/25 backdrop-blur-xs shadow-xs transition-all cursor-pointer group"
              title="预览周报 PDF 内容，支持在线即时编辑关键指标文字后再下载"
            >
              <FileText className="w-4 h-4 text-amber-300 group-hover:scale-110 transition-transform" />
              <span>预览并导出周报</span>
              <span className="px-1.5 py-0.5 rounded text-[10px] bg-amber-400 text-amber-950 font-bold shadow-2xs">
                在线编辑
              </span>
            </button>
            <button
              onClick={onSimulateSurge}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-red-50 text-red-700 font-semibold text-xs shadow-md transition-all cursor-pointer"
            >
              <Zap className="w-4 h-4 text-red-600" />
              <span>模拟爆发订单洪峰涌入</span>
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-6 space-y-2">
          <div className="w-full h-2.5 bg-black/20 rounded-full overflow-hidden p-0.5">
            <div
              className="h-full bg-gradient-to-r from-amber-300 to-amber-400 rounded-full transition-all duration-500 shadow-sm"
              style={{ width: `${Math.min(100, Number(targetPercentage))}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-red-100 font-mono">
            <span>蓄水启动 ¥0</span>
            <span>第一爆发点 ¥600万</span>
            <span>终极冲顶 ¥1200万 (当前 {targetPercentage}%)</span>
          </div>
        </div>
      </div>

      {/* Key Metric Indicators Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="text-xs text-slate-500 mb-1">支付转化率 (CR)</div>
          <div className="flex items-baseline justify-between">
            <div className="text-2xl font-bold font-mono text-slate-900">
              {metrics.payingConversionRate}%
            </div>
            <span className="text-xs text-emerald-600 font-medium">+2.8% vs 行业</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-2">大促蓄水期核心客群转化活跃</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="text-xs text-slate-500 mb-1">爆款加购率</div>
          <div className="flex items-baseline justify-between">
            <div className="text-2xl font-bold font-mono text-slate-900">
              {metrics.cartAdditionRate}%
            </div>
            <span className="text-xs text-amber-600 font-medium">蓄水充盈</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-2">重点锁定前1小时抢跑用户</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="text-xs text-slate-500 mb-1">综合投产比 (ROI)</div>
          <div className="flex items-baseline justify-between">
            <div className="text-2xl font-bold font-mono text-slate-900">
              {metrics.roiEstimate}
            </div>
            <span className="text-xs text-emerald-600 font-medium">健康盈利</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-2">付费引流与自然搜索流量协同</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="text-xs text-slate-500 mb-1">待履约订单数</div>
          <div className="flex items-baseline justify-between">
            <div className="text-2xl font-bold font-mono text-slate-900">
              {orders.filter(o => o.status !== 'shipped').length} 单
            </div>
            <span className="text-xs text-slate-500 font-mono">顺丰干线待发</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-2">5大中心前置仓联动极速揽收</div>
        </div>
      </div>

      {/* 5-Module Operational Hub Grid */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold tracking-wide text-slate-800">
            双十一五维作战矩阵 · 实时监控与协同
          </h2>
          <span className="text-xs text-slate-500">点击卡片可直接跳转对应系统</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* 1. 选品研究 (changedetection) */}
          <div 
            onClick={() => onNavigate('selection')}
            className="group cursor-pointer bg-white hover:bg-slate-50 border border-slate-200 hover:border-red-400 rounded-xl p-5 transition-all shadow-xs"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-red-50 text-red-600 border border-red-100">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <span className="text-sm font-bold text-slate-900 group-hover:text-red-600 transition-colors">
                  1. 选品研究 (changedetection)
                </span>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-red-600 group-hover:translate-x-1 transition-all" />
            </div>
            <p className="text-xs text-slate-600 mb-3 leading-relaxed">
              全网竞品价格与库存变动探测，掌握天猫/京东/抖音/拼多多对手大促破价动向。
            </p>
            <div className="p-2.5 rounded-lg bg-red-50/80 border border-red-200 text-xs text-red-700 flex items-center justify-between">
              <span className="font-medium">⚠️ 捕获 2 款竞品破价抢跑</span>
              <span className="text-[11px] font-mono">极光手表降17.4%</span>
            </div>
          </div>

          {/* 2. 素材工坊 (PicPilot) */}
          <div 
            onClick={() => onNavigate('visuals')}
            className="group cursor-pointer bg-white hover:bg-slate-50 border border-slate-200 hover:border-amber-400 rounded-xl p-5 transition-all shadow-xs"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-amber-50 text-amber-600 border border-amber-100">
                  <Sparkles className="w-4 h-4" />
                </div>
                <span className="text-sm font-bold text-slate-900 group-hover:text-amber-600 transition-colors">
                  2. 素材工坊 (PicPilot)
                </span>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-amber-600 group-hover:translate-x-1 transition-all" />
            </div>
            <p className="text-xs text-slate-600 mb-3 leading-relaxed">
              双十一战袍营销主图合成、AI场景换底与扩图、全尺寸投放素材自动化导出。
            </p>
            <div className="p-2.5 rounded-lg bg-amber-50/80 border border-amber-200 text-xs text-amber-700 flex items-center justify-between">
              <span className="font-medium">✨ 4大爆款营销战袍已生成</span>
              <span className="text-[11px]">支持直接下载</span>
            </div>
          </div>

          {/* 3. 店铺系统 (Medusa) */}
          <div 
            onClick={() => onNavigate('store')}
            className="group cursor-pointer bg-white hover:bg-slate-50 border border-slate-200 hover:border-blue-400 rounded-xl p-5 transition-all shadow-xs"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-blue-50 text-blue-600 border border-blue-100">
                  <Package className="w-4 h-4" />
                </div>
                <span className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                  3. 店铺系统 (Medusa)
                </span>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
            </div>
            <p className="text-xs text-slate-600 mb-3 leading-relaxed">
              定金膨胀与尾款管理、防超卖锁库、批量极速打单与多仓调拨履约引擎。
            </p>
            <div className="p-2.5 rounded-lg bg-blue-50/80 border border-blue-200 text-xs text-blue-700 flex items-center justify-between">
              <span className="font-medium">📦 耳机SKU库存仅剩50件</span>
              <span className="text-[11px]">触发安全熔断</span>
            </div>
          </div>

          {/* 4. 自动化运营 (n8n) */}
          <div 
            onClick={() => onNavigate('automation')}
            className="group cursor-pointer bg-white hover:bg-slate-50 border border-slate-200 hover:border-emerald-400 rounded-xl p-5 transition-all shadow-xs"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100">
                  <Workflow className="w-4 h-4" />
                </div>
                <span className="text-sm font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">
                  4. 自动化运营 (n8n)
                </span>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all" />
            </div>
            <p className="text-xs text-slate-600 mb-3 leading-relaxed">
              可视化工作流联动：尾款自动催付、突发破价预警播报、顺丰发货买家关怀。
            </p>
            <div className="p-2.5 rounded-lg bg-emerald-50/80 border border-emerald-200 text-xs text-emerald-700 flex items-center justify-between">
              <span className="font-medium">⚡ 4个作战工作流在线运行</span>
              <span className="text-[11px] font-mono">成功率 99.4%</span>
            </div>
          </div>

          {/* 5. 客服转化 (Chatwoot) */}
          <div 
            onClick={() => onNavigate('support')}
            className="group cursor-pointer bg-white hover:bg-slate-50 border border-slate-200 hover:border-purple-400 rounded-xl p-5 transition-all shadow-xs md:col-span-2 lg:col-span-2"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-purple-50 text-purple-600 border border-purple-100">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <span className="text-sm font-bold text-slate-900 group-hover:text-purple-600 transition-colors">
                  5. 客服转化 (Chatwoot)
                </span>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-purple-600 group-hover:translate-x-1 transition-all" />
            </div>
            <p className="text-xs text-slate-600 mb-3 leading-relaxed">
              聚合千牛/抖音/企业微信/小红书咨询，大促金牌话术库一键应答，专属保价与大单促单。
            </p>
            <div className="p-2.5 rounded-lg bg-purple-50/80 border border-purple-200 text-xs text-purple-700 flex items-center justify-between">
              <span className="font-medium">💬 4条高意向会话待促单</span>
              <span className="text-[11px]">含45把人体工学椅企业大单 (¥49,455)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Promotion & Margin Guard Simulator */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
        <div className="flex items-center gap-2 mb-4">
          <Calculator className="w-5 h-5 text-red-600" />
          <h3 className="text-sm font-bold text-slate-900">
            双十一跨店满300-50 & 价格防破价底线测算器
          </h3>
          <span className="text-xs text-slate-500">· 严防大促优惠券叠加导致负毛利穿底</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Controls */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs text-slate-600 block mb-1.5 font-medium">商品单价 (元)</label>
              <input
                type="number"
                value={calcPrice}
                onChange={(e) => setCalcPrice(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 font-mono focus:bg-white focus:outline-none focus:border-red-500"
              />
            </div>
            <div>
              <label className="text-xs text-slate-600 block mb-1.5 font-medium">购买件数 (件)</label>
              <input
                type="number"
                value={calcQty}
                min={1}
                onChange={(e) => setCalcQty(Math.max(1, Number(e.target.value)))}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 font-mono focus:bg-white focus:outline-none focus:border-red-500"
              />
            </div>
            <div>
              <label className="text-xs text-slate-600 block mb-1.5 font-medium">单件保本硬成本 (元)</label>
              <input
                type="number"
                value={calcCost}
                onChange={(e) => setCalcCost(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 font-mono focus:bg-white focus:outline-none focus:border-red-500"
              />
            </div>

            <div className="sm:col-span-3 flex items-center gap-6 pt-2">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-700">
                <input
                  type="checkbox"
                  checked={use88Vip}
                  onChange={(e) => setUse88Vip(e.target.checked)}
                  className="rounded border-slate-300 text-red-600 focus:ring-red-500"
                />
                <span>叠加 88VIP 消费券 (满1000减100)</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-700">
                <input
                  type="checkbox"
                  checked={useStoreCoupon}
                  onChange={(e) => setUseStoreCoupon(e.target.checked)}
                  className="rounded border-slate-300 text-red-600 focus:ring-red-500"
                />
                <span>叠加 店铺粉丝专属立减 (¥30)</span>
              </label>
            </div>
          </div>

          {/* Results Summary */}
          <div className="lg:col-span-5 bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-3">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-500">商品原标价总额:</span>
              <span className="font-mono text-slate-900 font-medium">¥{grossAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center text-xs text-red-600">
              <span>跨店满300减50立减:</span>
              <span className="font-mono font-medium">-¥{fullMinusDiscount.toFixed(2)}</span>
            </div>
            {vipDiscount > 0 && (
              <div className="flex justify-between items-center text-xs text-amber-600">
                <span>88VIP大额满减券:</span>
                <span className="font-mono font-medium">-¥{vipDiscount.toFixed(2)}</span>
              </div>
            )}
            {storeCouponDiscount > 0 && (
              <div className="flex justify-between items-center text-xs text-amber-600">
                <span>店铺粉丝优惠券:</span>
                <span className="font-mono font-medium">-¥{storeCouponDiscount.toFixed(2)}</span>
              </div>
            )}
            <div className="pt-2 border-t border-slate-200 flex justify-between items-baseline">
              <span className="text-xs font-semibold text-slate-700">最终买家实付:</span>
              <div className="text-right">
                <span className="text-xl font-bold font-mono text-red-600">¥{finalPaid.toFixed(2)}</span>
                <div className="text-[11px] text-slate-500 font-mono">
                  折合单件到手 ¥{unitFinalPaid.toFixed(2)}
                </div>
              </div>
            </div>

            <div className={`p-2.5 rounded-lg text-xs flex items-center justify-between font-mono font-medium ${
              profitMargin >= 30 
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                : profitMargin > 0 
                  ? 'bg-amber-50 text-amber-700 border border-amber-200'
                  : 'bg-red-50 text-red-700 border border-red-200'
            }`}>
              <span>毛利估算: ¥{grossProfit.toFixed(2)}</span>
              <span>毛利率: {profitMargin.toFixed(1)}% {profitMargin <= 0 ? '(⚠️ 穿底亏损)' : '(安全)'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Dual 11 Full-Cycle Campaign Marketing Calendar */}
      <MarketingCalendar />

      {/* Weekly Operational Strategy Report Modal (jsPDF) */}
      <WeeklyReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        metrics={metrics}
        orders={orders}
        competitors={competitors}
        products={products}
        onShowToast={onShowToast}
      />
    </div>
  );
};
