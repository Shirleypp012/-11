import React, { useState } from 'react';
import { CompetitorItem } from '../../types';
import { 
  TrendingDown, 
  Search, 
  ExternalLink, 
  Plus, 
  Clock, 
  Eye, 
  RotateCw, 
  Trash2, 
  X
} from 'lucide-react';

interface SelectionViewProps {
  competitors: CompetitorItem[];
  onAddCompetitor: (item: CompetitorItem) => void;
  onDeleteCompetitor: (id: string) => void;
  onTriggerScan: () => void;
  isScanning: boolean;
}

export const SelectionView: React.FC<SelectionViewProps> = ({
  competitors,
  onAddCompetitor,
  onDeleteCompetitor,
  onTriggerScan,
  isScanning,
}) => {
  const [selectedItem, setSelectedItem] = useState<CompetitorItem | null>(competitors[0] || null);
  const [statusFilter, setStatusFilter] = useState<'all' | 'price_cut' | 'low_stock' | 'normal'>('all');
  const [platformFilter, setPlatformFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showAddModal, setShowAddModal] = useState<boolean>(false);

  // New item form state
  const [newTitle, setNewTitle] = useState('');
  const [newPlatform, setNewPlatform] = useState<CompetitorItem['platform']>('天猫旗舰店');
  const [newBrand, setNewBrand] = useState('');
  const [newCategory, setNewCategory] = useState('数码智能');
  const [newPrice, setNewPrice] = useState(1299);
  const [newThreshold, setNewThreshold] = useState(1200);
  const [newUrl, setNewUrl] = useState('');

  const filteredItems = competitors.filter((item) => {
    if (statusFilter !== 'all' && item.status !== statusFilter) return false;
    if (platformFilter !== 'all' && item.platform !== platformFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        item.title.toLowerCase().includes(q) ||
        item.brand.toLowerCase().includes(q) ||
        item.promoRule.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle) return;

    const newItem: CompetitorItem = {
      id: `comp-${Date.now()}`,
      title: newTitle,
      category: newCategory,
      platform: newPlatform,
      brand: newBrand || '标杆竞品',
      originalPrice: newPrice * 1.2,
      currentPrice: newPrice,
      promoRule: '跨店满300-50 + 预售专属券 (实时监控中)',
      targetPriceThreshold: newThreshold,
      stockStatus: '充足 (3000+)',
      stockCount: 3000,
      status: 'normal',
      lastCheckedTime: '刚刚',
      changeRate: 0,
      url: newUrl || 'https://detail.tmall.com/item.htm?id=99281203',
      selector: '.promo-price-wrapper .main-price',
      historicalPrices: [
        { date: '10-25', price: newPrice * 1.1 },
        { date: '10-26', price: newPrice * 1.05 },
        { date: '10-27', price: newPrice },
      ],
      lastDiff: {
        beforeText: `初始化监控基线：标价 ¥${newPrice}`,
        afterText: `监控任务建立，等待第一次定时巡检抓包`,
        detectedDiffType: '新建监控锚点',
      },
    };

    onAddCompetitor(newItem);
    setShowAddModal(false);
    setNewTitle('');
    setNewUrl('');
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-red-50 text-red-700 border border-red-200 font-semibold">
              changedetection.io 引擎
            </span>
            <h1 className="text-lg font-bold text-slate-900 tracking-tight">
              竞品选品与大促破价巡检雷达
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            24小时高频监听天猫、京东、抖音、拼多多竞品价格曲线、活动利益点变动与库存水位。
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onTriggerScan}
            disabled={isScanning}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium border border-slate-200 transition-all cursor-pointer disabled:opacity-50"
          >
            <RotateCw className={`w-3.5 h-3.5 ${isScanning ? 'animate-spin text-red-600' : 'text-slate-600'}`} />
            <span>{isScanning ? '巡检全网抓取中...' : '立即全网巡检'}</span>
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-semibold shadow-xs transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>新建监控任务</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Status segmented controls */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 border border-slate-200 rounded-lg text-xs">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded-md font-medium transition-all cursor-pointer ${
              statusFilter === 'all'
                ? 'bg-white text-slate-900 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            全部 ({competitors.length})
          </button>
          <button
            onClick={() => setStatusFilter('price_cut')}
            className={`px-3 py-1.5 rounded-md font-medium transition-all cursor-pointer ${
              statusFilter === 'price_cut'
                ? 'bg-red-50 text-red-700 border border-red-200 font-semibold shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            破价预警 ({competitors.filter((c) => c.status === 'price_cut').length})
          </button>
          <button
            onClick={() => setStatusFilter('low_stock')}
            className={`px-3 py-1.5 rounded-md font-medium transition-all cursor-pointer ${
              statusFilter === 'low_stock'
                ? 'bg-amber-50 text-amber-700 border border-amber-200 font-semibold shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            濒临缺货 ({competitors.filter((c) => c.status === 'low_stock').length})
          </button>
        </div>

        {/* Platform & Search Input */}
        <div className="flex items-center gap-2">
          <select
            value={platformFilter}
            onChange={(e) => setPlatformFilter(e.target.value)}
            className="bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 shadow-xs focus:outline-none focus:border-red-500"
          >
            <option value="all">全电商渠道</option>
            <option value="天猫旗舰店">天猫旗舰店</option>
            <option value="京东自营">京东自营</option>
            <option value="抖音小店">抖音小店</option>
            <option value="拼多多百亿补贴">拼多多百亿补贴</option>
          </select>

          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="搜索商品名、竞品品牌..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-white border border-slate-200 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-800 placeholder:text-slate-400 w-48 sm:w-60 focus:outline-none focus:border-red-500 shadow-xs"
            />
          </div>
        </div>
      </div>

      {/* Main Monitoring Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Monitored Products List (7 cols) */}
        <div className="lg:col-span-7 space-y-3">
          {filteredItems.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-xl p-8 text-center text-slate-400 text-xs">
              暂无匹配的监控任务，请调整筛选或点击“新建监控任务”。
            </div>
          ) : (
            filteredItems.map((item) => {
              const isSelected = selectedItem?.id === item.id;
              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedItem(item)}
                  className={`cursor-pointer rounded-xl p-4 transition-all border ${
                    isSelected
                      ? 'bg-red-50/40 border-red-500 shadow-xs'
                      : 'bg-white border-slate-200 hover:bg-slate-50/80 hover:border-slate-300 shadow-xs'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2 text-xs">
                        <span className="font-semibold text-slate-800">{item.platform}</span>
                        <span className="text-slate-400">·</span>
                        <span className="text-slate-600">{item.brand}</span>
                        <span className="text-slate-400">·</span>
                        <span className="text-slate-500">{item.category}</span>
                      </div>
                      <h3 className="text-sm font-semibold text-slate-900 line-clamp-1">
                        {item.title}
                      </h3>
                      <div className="text-xs text-slate-500 line-clamp-1">
                        机制: <span className="text-slate-700">{item.promoRule}</span>
                      </div>
                    </div>

                    {/* Price Tag & Rate */}
                    <div className="text-right shrink-0">
                      <div className="text-base font-bold font-mono text-red-600">
                        ¥{item.currentPrice}
                      </div>
                      <div className="text-xs font-mono text-slate-400 line-through">
                        ¥{item.originalPrice}
                      </div>
                      {item.changeRate < 0 && (
                        <div className="flex items-center justify-end text-xs font-mono text-red-600 font-semibold">
                          <TrendingDown className="w-3 h-3 mr-0.5" />
                          <span>{item.changeRate}%</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Bottom Metadata & Alert Tag */}
                  <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                    <div className="flex items-center gap-2">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span>检测于 {item.lastCheckedTime}</span>
                      <span className="text-slate-300">|</span>
                      <span>库存: {item.stockStatus}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      {item.status === 'price_cut' && (
                        <span className="text-red-600 font-medium">⚠️ 突发破价预警</span>
                      )}
                      {item.status === 'low_stock' && (
                        <span className="text-amber-600 font-medium">⚡ 竞品库存预警</span>
                      )}
                      {item.status === 'normal' && (
                        <span className="text-slate-400">价格平稳</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right Column: Diff & Trend Inspector (5 cols) */}
        <div className="lg:col-span-5">
          {selectedItem ? (
            <div className="bg-white border border-slate-200 rounded-xl p-5 sticky top-20 space-y-4 shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-red-600" />
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    变动对比分析器 (Diff Inspector)
                  </h3>
                </div>
                <button
                  onClick={() => onDeleteCompetitor(selectedItem.id)}
                  title="删除此监控任务"
                  className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-all cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Title & Platform Header */}
              <div>
                <div className="text-xs text-slate-500 mb-1">
                  {selectedItem.platform} · {selectedItem.brand}
                </div>
                <h4 className="text-sm font-semibold text-slate-900 leading-snug">
                  {selectedItem.title}
                </h4>
                <div className="mt-2 flex items-center justify-between">
                  <div className="text-xs text-slate-600">
                    预警防线底价: <span className="font-mono text-amber-600 font-semibold">¥{selectedItem.targetPriceThreshold}</span>
                  </div>
                  <a
                    href={selectedItem.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-red-600 hover:text-red-700 flex items-center gap-1 font-medium"
                  >
                    <span>跳转原商品页</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              {/* Price Step Chart (SVG) */}
              <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
                <div className="flex items-center justify-between text-xs text-slate-600 mb-2 font-medium">
                  <span>双十一前夕价格跳水趋势 (10-20 至 今日)</span>
                  <span className="font-mono text-red-600 font-bold">
                    现价 ¥{selectedItem.currentPrice}
                  </span>
                </div>
                {/* SVG Line chart */}
                <div className="h-28 w-full flex items-end">
                  <svg className="w-full h-full overflow-visible" viewBox="0 0 300 90">
                    {/* Grid lines */}
                    <line x1="0" y1="20" x2="300" y2="20" stroke="#e2e8f0" strokeDasharray="3 3" />
                    <line x1="0" y1="50" x2="300" y2="50" stroke="#e2e8f0" strokeDasharray="3 3" />
                    <line x1="0" y1="80" x2="300" y2="80" stroke="#e2e8f0" strokeDasharray="3 3" />

                    {/* Polyline */}
                    {(() => {
                      const prices = selectedItem.historicalPrices.map((p) => p.price);
                      const minP = Math.min(...prices) * 0.95;
                      const maxP = Math.max(...prices) * 1.05;
                      const range = maxP - minP || 1;
                      const points = selectedItem.historicalPrices
                        .map((p, idx) => {
                          const x = (idx / (selectedItem.historicalPrices.length - 1)) * 280 + 10;
                          const y = 80 - ((p.price - minP) / range) * 65;
                          return `${x},${y}`;
                        })
                        .join(' ');

                      return (
                        <>
                          <polyline
                            fill="none"
                            stroke="#dc2626"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            points={points}
                          />
                          {selectedItem.historicalPrices.map((p, idx) => {
                            const x = (idx / (selectedItem.historicalPrices.length - 1)) * 280 + 10;
                            const y = 80 - ((p.price - minP) / range) * 65;
                            return (
                              <g key={idx}>
                                <circle cx={x} cy={y} r="3.5" fill="#dc2626" stroke="#ffffff" strokeWidth="1.5" />
                                <text
                                  x={x}
                                  y={y - 7}
                                  textAnchor="middle"
                                  fontSize="9"
                                  fill="#1e293b"
                                  fontWeight="600"
                                  fontFamily="monospace"
                                >
                                  ¥{p.price}
                                </text>
                                <text
                                  x={x}
                                  y="88"
                                  textAnchor="middle"
                                  fontSize="8"
                                  fill="#64748b"
                                  fontFamily="monospace"
                                >
                                  {p.date}
                                </text>
                              </g>
                            );
                          })}
                        </>
                      );
                    })()}
                  </svg>
                </div>
              </div>

              {/* Text Diff View */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-700">
                  <span className="font-semibold">HTML / 促销文案变动对比 (Diff)</span>
                  <span className="text-[11px] text-red-600 font-mono font-medium">
                    {selectedItem.lastDiff.detectedDiffType}
                  </span>
                </div>

                <div className="space-y-2 font-mono text-xs">
                  {/* Before */}
                  <div className="bg-red-50 border border-red-200 rounded-lg p-2.5 text-red-900">
                    <div className="text-[10px] text-red-600 font-bold uppercase mb-1">
                      - 上一次抓取值 (BEFORE)
                    </div>
                    <p className="text-[11px] leading-relaxed">{selectedItem.lastDiff.beforeText}</p>
                  </div>

                  {/* After */}
                  <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-2.5 text-emerald-900">
                    <div className="text-[10px] text-emerald-700 font-bold uppercase mb-1">
                      + 最新检测值 (AFTER)
                    </div>
                    <p className="text-[11px] leading-relaxed">{selectedItem.lastDiff.afterText}</p>
                  </div>
                </div>
              </div>

              {/* Crawler Meta info */}
              <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500 space-y-1 font-mono">
                <div>DOM选择器: {selectedItem.selector}</div>
                <div>巡检周期: 每15分钟一次 · 请求伪装模式: 移动端H5协议</div>
              </div>
            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-xl p-8 text-center text-slate-400 text-xs">
              点击左侧任意商品查看变动对比与价格走势。
            </div>
          )}
        </div>
      </div>

      {/* Add Monitor Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">
                新建商品监控任务 (changedetection)
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-600 mb-1 font-medium">商品标题 / 监测代号</label>
                <input
                  type="text"
                  required
                  placeholder="例如：极光 Pro 智能腕表 旗舰版"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:bg-white focus:outline-none focus:border-red-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 mb-1 font-medium">监控电商平台</label>
                  <select
                    value={newPlatform}
                    onChange={(e) => setNewPlatform(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:bg-white focus:outline-none focus:border-red-500"
                  >
                    <option value="天猫旗舰店">天猫旗舰店</option>
                    <option value="京东自营">京东自营</option>
                    <option value="抖音小店">抖音小店</option>
                    <option value="拼多多百亿补贴">拼多多百亿补贴</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-600 mb-1 font-medium">竞品品牌</label>
                  <input
                    type="text"
                    placeholder="例如：润颜科技"
                    value={newBrand}
                    onChange={(e) => setNewBrand(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:bg-white focus:outline-none focus:border-red-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 mb-1 font-medium">当前抓取标价 (元)</label>
                  <input
                    type="number"
                    value={newPrice}
                    onChange={(e) => setNewPrice(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 font-mono focus:bg-white focus:outline-none focus:border-red-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 mb-1 font-medium">降价预警警戒线 (元)</label>
                  <input
                    type="number"
                    value={newThreshold}
                    onChange={(e) => setNewThreshold(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 font-mono focus:bg-white focus:outline-none focus:border-red-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 mb-1 font-medium">商品链接 URL (选填)</label>
                <input
                  type="text"
                  placeholder="https://detail.tmall.com/item.htm?id=..."
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 font-mono focus:bg-white focus:outline-none focus:border-red-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium cursor-pointer"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold cursor-pointer"
                >
                  立即开启监控
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
