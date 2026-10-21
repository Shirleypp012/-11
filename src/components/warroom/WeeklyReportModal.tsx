import React, { useRef, useState, useMemo } from 'react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { 
  WarRoomMetrics, 
  StoreOrder, 
  CompetitorItem, 
  StoreProduct 
} from '../../types';
import { 
  X, 
  Download, 
  FileText, 
  TrendingDown, 
  Flame, 
  AlertTriangle, 
  Package, 
  Sparkles, 
  Clock, 
  ShieldCheck, 
  Printer, 
  Copy,
  Edit3,
  Eye,
  RotateCcw,
  Check,
  CheckCircle2,
  Sliders,
  Wand2,
  Layers,
  HelpCircle
} from 'lucide-react';

interface WeeklyReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  metrics: WarRoomMetrics;
  orders: StoreOrder[];
  competitors: CompetitorItem[];
  products: StoreProduct[];
  onShowToast?: (msg: string, type?: 'success' | 'warning' | 'info') => void;
}

// Editable report state structure
interface EditableReportData {
  reportTitle: string;
  reportSubtitle: string;
  periodWeek: string;
  securityLevel: string;
  executiveSummary: string;
  
  // Metric annotations & textual notes
  gmvNote: string;
  presalePoolNote: string;
  ordersCountNote: string;
  conversionRateNote: string;
  roiNote: string;
  fulfillmentNote: string;
  logisticsNote: string;
  
  // Competitor notes
  competitorAlertNote: string;
  
  // 4 Action Playbook recommendations
  action1Title: string;
  action1Desc: string;
  action2Title: string;
  action2Desc: string;
  action3Title: string;
  action3Desc: string;
  action4Title: string;
  action4Desc: string;
  
  // Custom operation directive & sign-off
  specialDirectives: string;
  signOffOrg: string;
  signOffStatus: string;
}

export const WeeklyReportModal: React.FC<WeeklyReportModalProps> = ({
  isOpen,
  onClose,
  metrics,
  orders,
  competitors,
  products: _products,
  onShowToast,
}) => {
  const reportRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [isEditingMode, setIsEditingMode] = useState<boolean>(false);
  const [activeEditTab, setActiveEditTab] = useState<'all' | 'summary' | 'metrics' | 'playbook' | 'directive'>('all');
  const [isAiPolishing, setIsAiPolishing] = useState<boolean>(false);

  // Competitor price drop highlights
  const priceCutCompetitors = useMemo(() => {
    return competitors
      .filter(c => c.status === 'price_cut' || c.changeRate < 0)
      .sort((a, b) => a.changeRate - b.changeRate);
  }, [competitors]);

  // Pending orders
  const pendingOrders = useMemo(() => {
    return orders.filter(o => o.status !== 'shipped');
  }, [orders]);

  const targetPercentage = ((metrics.currentGMV / metrics.targetGMV) * 100).toFixed(1);
  const currentDate = new Date().toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  const currentTime = new Date().toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit',
  });

  // Default initial report content generated from real data
  const defaultReportData: EditableReportData = useMemo(() => ({
    reportTitle: '双十一大促全周期运营决策周报',
    reportSubtitle: '涵盖核心 GMV 战报、近期订单成交流水与竞品价格降价趋势情报',
    periodWeek: '第 40 周 (预售冲刺期)',
    securityLevel: '商业机密 · 内部决策专供',
    executiveSummary: `本周大促累计 GMV 已突破 ¥${metrics.currentGMV.toLocaleString()}，完成第一阶段目标达成率 ${targetPercentage}%。预售蓄水锁定资金池表现强劲，支付转化率达到 ${metrics.payingConversionRate}%（高于行业均值 +2.8%）。选品监控系统捕获到 ${priceCutCompetitors.length} 款竞品破价抢跑（最大降幅达 ${priceCutCompetitors[0]?.changeRate || 0}%），建议立即强化「30天买贵退差」主图角标并协同客服话术库进行精准截流。`,
    
    gmvNote: `大促目标达成进度 ${targetPercentage}%，第一阶段蓄水顺利达成`,
    presalePoolNote: `占比 ${(metrics.presalePoolValue / metrics.currentGMV * 100).toFixed(1)}% · 锁定大促基本盘`,
    ordersCountNote: '洪峰涌入平稳 · 单量创阶段新高',
    conversionRateNote: '+2.8% vs 行业均值 · 转化稳定',
    roiNote: '健康盈利区间 · 投流模型持续放量',
    fulfillmentNote: `📦 待履约订单总数: ${pendingOrders.length} 单（含 45把人体工学椅企业大宗采购 ¥49,455 待配货）`,
    logisticsNote: '顺丰冷链/特快次日达覆盖率 94.6%',
    
    competitorAlertNote: '竞品价格近7日呈现多轮断崖式调降，极光、珀莱雅竞店均推出满减券与赠品加码策略。',
    
    action1Title: '1. 竞品破价防守与保价承诺',
    action1Desc: '针对竞品破价动作，启动自动化 n8n 规则向加购未付定金用户定向追加发放「¥20 专属回血红包」；主图第2屏置顶「30天全程买贵自动补差」。',
    
    action2Title: '2. 素材工坊 (PicPilot) 首屏重构',
    action2Desc: '在爆款耳机与数码手表主图增加「现货顺丰次日达」、「买1赠5同款体验装」显眼角标，弱化买家对预售长周期的疑虑。',
    
    action3Title: '3. 店铺与供应链防超卖预警',
    action3Desc: '耳机 SKU 现货仅余 50 件，已触及安全阈值熔断。需在 10月28日前协调华东中心仓极速调拨 500 件入库，防止尾款期爆单穿仓。',
    
    action4Title: '4. 客服高意向大单跟进催付',
    action4Desc: 'Chatwoot 中 45 把人体工学椅企业大单 (¥49,455) 已进入待付尾款阶段，安排专席客服提供对公专票极速开具，力保 100% 转化履约。',
    
    specialDirectives: '【冲刺值班指令】双十一预售关闸冲刺倒计时阶段，各业务负责人须保持钉钉应急通道畅通，选品巡检每 30 分钟刷新一次，遇竞品破价超 15% 自动降价联动。',
    signOffOrg: '赤霄数智运营委员会',
    signOffStatus: '已核准生效 · 即刻执行'
  }), [metrics, targetPercentage, priceCutCompetitors, pendingOrders]);

  // Live editable state
  const [reportData, setReportData] = useState<EditableReportData>(defaultReportData);

  if (!isOpen) return null;

  // Handle single field change
  const handleFieldChange = (field: keyof EditableReportData, value: string) => {
    setReportData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Reset to system defaults
  const handleResetDefaults = () => {
    setReportData(defaultReportData);
    onShowToast?.('周报文案已恢复为系统默认自动生成内容', 'info');
  };

  // AI Smart Refine (智能一键润色)
  const handleAiPolish = async () => {
    setIsAiPolishing(true);
    onShowToast?.('AI 运营顾问正在结合最新指标优化润色周报措辞...', 'info');

    try {
      // Call backend or apply polished strategic phrases
      const response = await fetch('/api/social/generate-insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          brand: '赤霄品牌',
          product: `双十一大促周报 (GMV ¥${metrics.currentGMV.toLocaleString()}, 目标率 ${targetPercentage}%)`,
          comments: [
            `当前达成率: ${targetPercentage}%`,
            `竞品降价数量: ${priceCutCompetitors.length}`,
            `转化率: ${metrics.payingConversionRate}%`,
            `待履约大单: 企业采购 45 把工学椅`
          ]
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.summary) {
          setReportData(prev => ({
            ...prev,
            executiveSummary: `【AI 智能提炼】${data.summary.overview || prev.executiveSummary}。本周大促关键在于巩固现货交付信任度，同时对竞品降价形成梯队化防御机制。`,
            gmvNote: `大促达成率稳步攀升至 ${targetPercentage}%，资金锁盘韧性极佳`,
            specialDirectives: `【AI 运营策略建议】${data.tacticalPlaybook?.pricingAdvice || '保持价格底线韧性，加强客服私域触达，提升高客单企业采购订单交付保障。'}`
          }));
          onShowToast?.('AI 智能润色完成！已优化决策摘要与战役指令', 'success');
        }
      } else {
        // Fallback polished wording
        setReportData(prev => ({
          ...prev,
          executiveSummary: `【智能精炼】本周战役累计 GMV 达 ¥${metrics.currentGMV.toLocaleString()}，目标达成率破 ${targetPercentage}%。核心预售资金蓄水池占整体盘面过半，买家转化动能充沛。鉴于 ${priceCutCompetitors.length} 款竞品提前破价抛售，建议运营线迅速收紧赠品阀门并上线全程保价标识，确保毛利防线坚固。`,
          gmvNote: `达成率突破 ${targetPercentage}%，保持高动销增长动能`,
          presalePoolNote: `稳占 ${(metrics.presalePoolValue / metrics.currentGMV * 100).toFixed(1)}% · 筑牢爆发期蓄水池`,
          conversionRateNote: `优于同行 +2.8% · 主图视觉与防退定金双重奏效`
        }));
        onShowToast?.('已根据大促大盘动态完成文案精炼！', 'success');
      }
    } catch {
      // Local smart polish fallback
      setReportData(prev => ({
        ...prev,
        executiveSummary: `【运营提速】本周大促累计成交 ¥${metrics.currentGMV.toLocaleString()}，阶段目标达成率 ${targetPercentage}%。预售蓄水锁定资金池超预期增长，转化率保持 ${metrics.payingConversionRate}% 高位。针对 ${priceCutCompetitors.length} 款竞品违规抢跑破价，已备妥「降价退差额」护航方案。`,
        specialDirectives: '【决胜指令】全线进入 24 小时作战状态，重点防守高产出爆品，全力确保物流顺丰次日达体验口碑。'
      }));
      onShowToast?.('文案润色已更新！', 'success');
    } finally {
      setIsAiPolishing(false);
    }
  };

  // Quick summary copy
  const handleCopySummary = () => {
    const summaryText = `【${reportData.reportTitle}】
期数: ${reportData.periodWeek} | 日期: ${currentDate}
决策摘要:
${reportData.executiveSummary}

核心指标:
- 累计 GMV: ¥${metrics.currentGMV.toLocaleString()} (${reportData.gmvNote})
- 预售锁定池: ¥${metrics.presalePoolValue.toLocaleString()} (${reportData.presalePoolNote})
- 今日订单数: ${metrics.todayOrdersCount.toLocaleString()} 单 (${reportData.ordersCountNote})
- 支付转化率: ${metrics.payingConversionRate}% (${reportData.conversionRateNote})
- 综合投产比: ${metrics.roiEstimate} (${reportData.roiNote})

行动指南:
1. ${reportData.action1Title}: ${reportData.action1Desc}
2. ${reportData.action2Title}: ${reportData.action2Desc}
3. ${reportData.action3Title}: ${reportData.action3Desc}
4. ${reportData.action4Title}: ${reportData.action4Desc}

特别指令: ${reportData.specialDirectives}`;

    navigator.clipboard.writeText(summaryText);
    onShowToast?.('已复制调整后的完整周报文本至剪贴板！', 'info');
  };

  // Handle PDF Export via jsPDF & html2canvas
  const handleExportPDF = async () => {
    if (!reportRef.current) return;
    setIsExporting(true);
    onShowToast?.('正在渲染高清 A4 决策周报 PDF，请稍候...', 'info');

    // Temporarily ensure pristine preview look during capture
    const wasEditing = isEditingMode;
    if (wasEditing) setIsEditingMode(false);

    // Wait a tick for DOM to settle into clean view
    await new Promise(resolve => setTimeout(resolve, 150));

    try {
      const element = reportRef.current;
      
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;
      const imgWidth = pdfWidth;
      const imgHeight = (canvasHeight * pdfWidth) / canvasWidth;

      let heightLeft = imgHeight;
      let position = 0;

      // Page 1
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight;

      // Additional pages if needed
      while (heightLeft > 0) {
        position -= pdfHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pdfHeight;
      }

      const cleanFilename = `${reportData.reportTitle.replace(/\s+/g, '_')}_${currentDate.replace(/\//g, '-')}.pdf`;
      pdf.save(cleanFilename);

      onShowToast?.(`周报 PDF [${cleanFilename}] 已成功生成并下载！`, 'success');
    } catch (error: any) {
      console.error('PDF export error:', error);
      onShowToast?.('PDF 导出出现异常，请尝试直接打印或重试', 'warning');
    } finally {
      setIsExporting(false);
      if (wasEditing) setIsEditingMode(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 sm:p-5 overflow-y-auto">
      <div className="bg-slate-100 rounded-2xl shadow-2xl max-w-6xl w-full max-h-[94vh] flex flex-col overflow-hidden border border-slate-300">
        
        {/* Top Control Bar */}
        <div className="bg-white px-5 py-3.5 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-red-50 text-red-600 border border-red-200 shadow-xs">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900">
                  周报导出前预览与即时编辑
                </h2>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-red-100 text-red-700 font-semibold border border-red-200">
                  A4 格式
                </span>
                {isEditingMode ? (
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold flex items-center gap-1 border border-amber-300 animate-pulse">
                    <Edit3 className="w-3 h-3" />
                    <span>在线编辑中</span>
                  </span>
                ) : (
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-medium flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    <span>印刷预览视图</span>
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                支持在导出 PDF 前直接修改标题、决策摘要、指标评语及运营策略，实时所见即所得
              </p>
            </div>
          </div>

          {/* Action Buttons Toolbar */}
          <div className="flex items-center flex-wrap gap-2">
            
            {/* Toggle Edit / Preview Mode */}
            <button
              onClick={() => setIsEditingMode(!isEditingMode)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer ${
                isEditingMode
                  ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-amber-200'
                  : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-300'
              }`}
              title={isEditingMode ? '点击切换回打印预览' : '点击开启在线编辑'}
            >
              {isEditingMode ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>完成编辑 (预览效果)</span>
                </>
              ) : (
                <>
                  <Edit3 className="w-3.5 h-3.5 text-amber-600" />
                  <span>在线即时编辑</span>
                </>
              )}
            </button>

            {/* AI Polish */}
            <button
              onClick={handleAiPolish}
              disabled={isAiPolishing}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 text-xs font-semibold transition-colors disabled:opacity-50 cursor-pointer"
              title="使用智能算法优化调整关键指标描述"
            >
              <Wand2 className={`w-3.5 h-3.5 text-purple-600 ${isAiPolishing ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">{isAiPolishing ? '润色中...' : 'AI 智能润色'}</span>
            </button>

            {/* Reset Defaults */}
            <button
              onClick={handleResetDefaults}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-medium transition-colors cursor-pointer"
              title="重置为系统默认生成的文字"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">恢复默认</span>
            </button>

            {/* Copy Summary */}
            <button
              onClick={handleCopySummary}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-medium transition-colors cursor-pointer"
              title="复制周报文本"
            >
              <Copy className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">复制</span>
            </button>

            {/* Print System */}
            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-medium transition-colors cursor-pointer"
              title="系统打印机"
            >
              <Printer className="w-3.5 h-3.5" />
            </button>

            {/* Export PDF Button */}
            <button
              onClick={handleExportPDF}
              disabled={isExporting}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white text-xs font-bold shadow-md shadow-red-200 hover:shadow-lg transition-all disabled:opacity-60 cursor-pointer"
            >
              <Download className={`w-4 h-4 ${isExporting ? 'animate-bounce' : ''}`} />
              <span>{isExporting ? '正在导出 PDF...' : '导出并下载 PDF 周报'}</span>
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Editing Mode Banner (Helpful tips when editing) */}
        {isEditingMode && (
          <div className="bg-amber-50 border-b border-amber-200 px-6 py-2 flex items-center justify-between text-xs text-amber-900 shrink-0">
            <div className="flex items-center gap-2">
              <span className="p-1 rounded-md bg-amber-200/80 text-amber-800">
                <Edit3 className="w-3.5 h-3.5" />
              </span>
              <span className="font-semibold">即时编辑模式生效中：</span>
              <span className="text-amber-800">
                您可直接在下方报表卡片中修改标题、摘要、指标评语与行动指南；编辑内容将实时同步至导出 PDF 中。
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsEditingMode(false)}
                className="px-2.5 py-1 rounded bg-amber-200 hover:bg-amber-300 text-amber-900 font-bold transition-colors cursor-pointer text-[11px]"
              >
                预览最终排版
              </button>
            </div>
          </div>
        )}

        {/* Modal Scrollable Body: Paper Preview Canvas */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-200/80 flex justify-center">
          
          {/* Printable Report Canvas (A4 Styled Document) */}
          <div
            ref={reportRef}
            className="w-full max-w-[850px] bg-white rounded-xl shadow-xl border border-slate-300 p-8 sm:p-10 space-y-6 text-slate-800 transition-all"
            style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif' }}
          >
            {/* 1. Report Header */}
            <div className="border-b-2 border-red-600 pb-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-50 border border-red-200 text-[11px] font-bold text-red-600 uppercase tracking-wider mb-2">
                    <Flame className="w-3 h-3 fill-red-500 text-red-500" />
                    <span>赤霄电商作战指挥部 · 双十一战役内参</span>
                  </div>

                  {/* Editable or Display Title */}
                  {isEditingMode ? (
                    <div className="space-y-1.5 my-1">
                      <div className="text-[11px] text-amber-700 font-semibold flex items-center gap-1">
                        <Edit3 className="w-3 h-3" />
                        <span>报告主标题与副标题 (在线编辑)</span>
                      </div>
                      <input
                        type="text"
                        value={reportData.reportTitle}
                        onChange={(e) => handleFieldChange('reportTitle', e.target.value)}
                        className="w-full text-2xl font-black text-slate-900 border-2 border-dashed border-amber-400 bg-amber-50/50 rounded-lg px-2.5 py-1 outline-hidden focus:border-red-500 transition-colors"
                        placeholder="输入报告主标题"
                      />
                      <input
                        type="text"
                        value={reportData.reportSubtitle}
                        onChange={(e) => handleFieldChange('reportSubtitle', e.target.value)}
                        className="w-full text-xs text-slate-600 border border-dashed border-amber-300 bg-amber-50/30 rounded-lg px-2.5 py-1 outline-hidden focus:border-red-400 transition-colors"
                        placeholder="输入报告副标题"
                      />
                    </div>
                  ) : (
                    <div>
                      <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                        {reportData.reportTitle}
                      </h1>
                      <p className="text-xs text-slate-500 mt-1">
                        {reportData.reportSubtitle}
                      </p>
                    </div>
                  )}
                </div>

                <div className="text-right text-xs text-slate-500 space-y-1 shrink-0">
                  {isEditingMode ? (
                    <div className="space-y-1">
                      <input
                        type="text"
                        value={reportData.periodWeek}
                        onChange={(e) => handleFieldChange('periodWeek', e.target.value)}
                        className="w-36 text-right font-mono font-bold text-slate-800 text-xs border border-dashed border-amber-400 bg-amber-50/50 rounded px-1.5 py-0.5 outline-hidden"
                      />
                      <input
                        type="text"
                        value={reportData.securityLevel}
                        onChange={(e) => handleFieldChange('securityLevel', e.target.value)}
                        className="w-36 text-right text-[10px] font-bold text-amber-700 border border-dashed border-amber-400 bg-amber-50/50 rounded px-1.5 py-0.5 outline-hidden"
                      />
                    </div>
                  ) : (
                    <>
                      <div className="font-mono font-bold text-slate-700">{reportData.periodWeek}</div>
                      <div>生成时间: <span className="font-mono text-slate-900 font-semibold">{currentDate} {currentTime}</span></div>
                      <div className="inline-block px-2 py-0.5 rounded bg-amber-50 border border-amber-200 text-amber-700 text-[10px] font-bold">
                        {reportData.securityLevel}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* 2. Executive Summary Callout (Editable) */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 text-xs leading-relaxed space-y-2">
              <div className="font-bold text-red-900 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-red-600" />
                  <span>运营中枢本周决策摘要 (Executive Summary)</span>
                </div>
                {isEditingMode && (
                  <span className="text-[10px] text-amber-700 bg-amber-100 px-2 py-0.5 rounded font-medium flex items-center gap-1">
                    <Edit3 className="w-2.5 h-2.5" />
                    <span>即时编辑此段总结</span>
                  </span>
                )}
              </div>

              {isEditingMode ? (
                <div className="space-y-1.5">
                  <textarea
                    rows={4}
                    value={reportData.executiveSummary}
                    onChange={(e) => handleFieldChange('executiveSummary', e.target.value)}
                    className="w-full text-xs text-slate-800 leading-relaxed border-2 border-dashed border-amber-400 bg-white rounded-lg p-2.5 outline-hidden focus:border-red-500 shadow-inner"
                    placeholder="输入或调整本周运营决策摘要，支持加入总监研判与决策方向..."
                  />
                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span>提示: 您可直接修改上述字句，或点击顶部「AI 智能润色」一键更新</span>
                    <span>字数: {reportData.executiveSummary.length}</span>
                  </div>
                </div>
              ) : (
                <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">
                  {reportData.executiveSummary}
                </p>
              )}
            </div>

            {/* 3. Section 1: GMV Progress & Core Metrics */}
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-1.5 border-b border-slate-200">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <span className="w-2 h-4 bg-red-600 rounded-xs" />
                  <span>一、大促大盘与 GMV 核心经营指标</span>
                </h3>
                <span className="text-[11px] text-slate-400 font-mono">KPI DASHBOARD</span>
              </div>

              {/* Progress Card */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
                  <div>
                    <span className="text-xs text-slate-500 font-medium">累计成交金额 (GMV):</span>
                    <span className="ml-2 text-2xl sm:text-3xl font-black font-mono text-red-600">
                      ¥{metrics.currentGMV.toLocaleString()}
                    </span>
                  </div>
                  <div className="text-xs text-slate-600">
                    大促目标: <span className="font-mono font-bold">¥{metrics.targetGMV.toLocaleString()}</span> · 达成进度: <span className="font-mono font-bold text-red-600">{targetPercentage}%</span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-red-500 to-amber-500 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, Number(targetPercentage))}%` }}
                  />
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] text-slate-500 font-mono">
                  <div className="flex gap-4">
                    <span>蓄水启动: ¥0</span>
                    <span>第一爆发点: ¥6,000,000</span>
                    <span>终极目标: ¥{metrics.targetGMV.toLocaleString()}</span>
                  </div>

                  {/* GMV Annotation Text */}
                  {isEditingMode ? (
                    <div className="flex items-center gap-1">
                      <span className="text-amber-700 font-bold shrink-0">评语:</span>
                      <input
                        type="text"
                        value={reportData.gmvNote}
                        onChange={(e) => handleFieldChange('gmvNote', e.target.value)}
                        className="text-[11px] border border-dashed border-amber-400 bg-amber-50/50 rounded px-1.5 py-0.5 outline-hidden text-red-700 font-sans font-semibold w-64"
                      />
                    </div>
                  ) : (
                    <span className="text-red-700 font-sans font-semibold">{reportData.gmvNote}</span>
                  )}
                </div>
              </div>

              {/* 4-Box Key Metrics Grid with Editable Text Annotations */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                
                {/* Metric 1: Presale Pool */}
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
                  <div>
                    <div className="text-[11px] text-slate-500">预售资金锁定池</div>
                    <div className="text-base font-bold font-mono text-slate-900 mt-0.5">
                      ¥{metrics.presalePoolValue.toLocaleString()}
                    </div>
                  </div>
                  <div className="mt-2 pt-1 border-t border-slate-200">
                    {isEditingMode ? (
                      <input
                        type="text"
                        value={reportData.presalePoolNote}
                        onChange={(e) => handleFieldChange('presalePoolNote', e.target.value)}
                        className="w-full text-[10px] text-emerald-700 font-medium border border-dashed border-amber-400 bg-amber-50/40 rounded px-1 py-0.5 outline-hidden"
                      />
                    ) : (
                      <div className="text-[10px] text-emerald-600 font-medium truncate" title={reportData.presalePoolNote}>
                        {reportData.presalePoolNote}
                      </div>
                    )}
                  </div>
                </div>

                {/* Metric 2: Today Orders */}
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
                  <div>
                    <div className="text-[11px] text-slate-500">今日爆发成交订单</div>
                    <div className="text-base font-bold font-mono text-slate-900 mt-0.5">
                      {metrics.todayOrdersCount.toLocaleString()} 单
                    </div>
                  </div>
                  <div className="mt-2 pt-1 border-t border-slate-200">
                    {isEditingMode ? (
                      <input
                        type="text"
                        value={reportData.ordersCountNote}
                        onChange={(e) => handleFieldChange('ordersCountNote', e.target.value)}
                        className="w-full text-[10px] text-red-700 font-medium border border-dashed border-amber-400 bg-amber-50/40 rounded px-1 py-0.5 outline-hidden"
                      />
                    ) : (
                      <div className="text-[10px] text-red-600 font-medium truncate" title={reportData.ordersCountNote}>
                        {reportData.ordersCountNote}
                      </div>
                    )}
                  </div>
                </div>

                {/* Metric 3: Conversion Rate */}
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
                  <div>
                    <div className="text-[11px] text-slate-500">支付转化率 (CR)</div>
                    <div className="text-base font-bold font-mono text-slate-900 mt-0.5">
                      {metrics.payingConversionRate}%
                    </div>
                  </div>
                  <div className="mt-2 pt-1 border-t border-slate-200">
                    {isEditingMode ? (
                      <input
                        type="text"
                        value={reportData.conversionRateNote}
                        onChange={(e) => handleFieldChange('conversionRateNote', e.target.value)}
                        className="w-full text-[10px] text-emerald-700 font-medium border border-dashed border-amber-400 bg-amber-50/40 rounded px-1 py-0.5 outline-hidden"
                      />
                    ) : (
                      <div className="text-[10px] text-emerald-600 font-medium truncate" title={reportData.conversionRateNote}>
                        {reportData.conversionRateNote}
                      </div>
                    )}
                  </div>
                </div>

                {/* Metric 4: ROI Estimate */}
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
                  <div>
                    <div className="text-[11px] text-slate-500">综合投产比 (ROI)</div>
                    <div className="text-base font-bold font-mono text-slate-900 mt-0.5">
                      {metrics.roiEstimate}
                    </div>
                  </div>
                  <div className="mt-2 pt-1 border-t border-slate-200">
                    {isEditingMode ? (
                      <input
                        type="text"
                        value={reportData.roiNote}
                        onChange={(e) => handleFieldChange('roiNote', e.target.value)}
                        className="w-full text-[10px] text-emerald-700 font-medium border border-dashed border-amber-400 bg-amber-50/40 rounded px-1 py-0.5 outline-hidden"
                      />
                    ) : (
                      <div className="text-[10px] text-emerald-600 font-medium truncate" title={reportData.roiNote}>
                        {reportData.roiNote}
                      </div>
                    )}
                  </div>
                </div>

              </div>
            </div>

            {/* 4. Section 2: Recent Transactions Dynamics */}
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-1.5 border-b border-slate-200">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <span className="w-2 h-4 bg-blue-600 rounded-xs" />
                  <span>二、近期成交动态与大单流水</span>
                </h3>
                <span className="text-[11px] text-slate-400 font-mono">TRANSACTION STREAM</span>
              </div>

              {/* Transactions Table */}
              <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold text-[11px]">
                    <tr>
                      <th className="py-2.5 px-3">订单编号</th>
                      <th className="py-2.5 px-3">下单渠道</th>
                      <th className="py-2.5 px-3">买家信息</th>
                      <th className="py-2.5 px-3">订购商品明细</th>
                      <th className="py-2.5 px-3 text-right">实付金额</th>
                      <th className="py-2.5 px-3 text-center">订单类型</th>
                      <th className="py-2.5 px-3 text-center">履约状态</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {orders.slice(0, 6).map((order) => (
                      <tr key={order.id} className="hover:bg-slate-50/60">
                        <td className="py-2 px-3 font-mono font-medium text-slate-700">
                          {order.orderNumber}
                        </td>
                        <td className="py-2 px-3 text-slate-600">
                          <span className="px-1.5 py-0.5 rounded bg-slate-100 text-[10px] font-medium">
                            {order.platform}
                          </span>
                        </td>
                        <td className="py-2 px-3 font-medium text-slate-800">
                          {order.customerName}
                        </td>
                        <td className="py-2 px-3 text-slate-600 max-w-[180px] truncate" title={order.items.map(i => `${i.productName} x${i.quantity}`).join(', ')}>
                          {order.items.map(i => `${i.productName} x${i.quantity}`).join('; ')}
                        </td>
                        <td className="py-2 px-3 font-mono font-bold text-red-600 text-right">
                          ¥{order.finalPaid.toLocaleString()}
                        </td>
                        <td className="py-2 px-3 text-center">
                          <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                            order.orderType === '预售定金'
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : order.orderType === '尾款结算'
                              ? 'bg-purple-50 text-purple-700 border border-purple-200'
                              : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          }`}>
                            {order.orderType}
                          </span>
                        </td>
                        <td className="py-2 px-3 text-center">
                          <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                            order.status === 'shipped'
                              ? 'bg-slate-100 text-slate-600'
                              : order.status === 'paid_fulfillment'
                              ? 'bg-blue-50 text-blue-700 border border-blue-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}>
                            {order.status === 'shipped' ? '顺丰干线已发' : order.status === 'paid_fulfillment' ? '待极速出库' : '待付尾款'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Editable Logistics & Fulfillment Notes */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-200/80">
                {isEditingMode ? (
                  <div className="w-full space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-amber-800 text-[11px] shrink-0">履约备注:</span>
                      <input
                        type="text"
                        value={reportData.fulfillmentNote}
                        onChange={(e) => handleFieldChange('fulfillmentNote', e.target.value)}
                        className="flex-1 text-[11px] border border-dashed border-amber-400 bg-amber-50/40 rounded px-2 py-0.5 outline-hidden"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-amber-800 text-[11px] shrink-0">时效承诺:</span>
                      <input
                        type="text"
                        value={reportData.logisticsNote}
                        onChange={(e) => handleFieldChange('logisticsNote', e.target.value)}
                        className="flex-1 text-[11px] border border-dashed border-amber-400 bg-amber-50/40 rounded px-2 py-0.5 outline-hidden text-emerald-700 font-semibold"
                      />
                    </div>
                  </div>
                ) : (
                  <>
                    <span>{reportData.fulfillmentNote}</span>
                    <span className="text-emerald-700 font-semibold shrink-0">{reportData.logisticsNote}</span>
                  </>
                )}
              </div>
            </div>

            {/* 5. Section 3: Competitor Price Cut Trends */}
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-1.5 border-b border-slate-200">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <span className="w-2 h-4 bg-amber-500 rounded-xs" />
                  <span>三、竞品价格降价趋势与破价警报</span>
                </h3>
                <span className="text-[11px] text-slate-400 font-mono">COMPETITOR RADAR</span>
              </div>

              {/* Price Cut Alert List */}
              <div className="space-y-2.5">
                {priceCutCompetitors.map((comp) => (
                  <div
                    key={comp.id}
                    className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-1.5 py-0.5 rounded bg-rose-100 text-rose-700 text-[10px] font-bold">
                          破价抢跑
                        </span>
                        <span className="text-xs font-bold text-slate-900">
                          {comp.brand} · {comp.title}
                        </span>
                        <span className="text-[11px] text-slate-500">
                          ({comp.platform})
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-3">
                        <span>大促机制: <strong className="text-slate-700">{comp.promoRule}</strong></span>
                        <span>·</span>
                        <span>库存: <strong className="text-slate-700">{comp.stockStatus}</strong></span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 shrink-0 sm:text-right">
                      <div>
                        <div className="text-[11px] text-slate-400 line-through font-mono">
                          原价 ¥{comp.originalPrice}
                        </div>
                        <div className="text-sm font-extrabold font-mono text-rose-600">
                          现破价 ¥{comp.currentPrice}
                        </div>
                      </div>

                      <div className="px-2.5 py-1 rounded-lg bg-rose-50 border border-rose-200 text-center">
                        <div className="text-[10px] text-rose-600 font-semibold flex items-center justify-center gap-0.5">
                          <TrendingDown className="w-3 h-3" />
                          <span>跌幅</span>
                        </div>
                        <div className="text-xs font-black font-mono text-rose-700">
                          {comp.changeRate}%
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Historical Price Trend Micro-Table & Editable Note */}
                <div className="p-3 rounded-lg bg-amber-50/50 border border-amber-200/70 text-xs text-amber-950 space-y-2">
                  <div className="font-semibold flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                      <span>竞品价格近7日走势追踪与运营研判：</span>
                    </div>
                    {isEditingMode && (
                      <span className="text-[10px] text-amber-700 font-medium">可编辑研判评述</span>
                    )}
                  </div>

                  {isEditingMode ? (
                    <input
                      type="text"
                      value={reportData.competitorAlertNote}
                      onChange={(e) => handleFieldChange('competitorAlertNote', e.target.value)}
                      className="w-full text-[11px] border border-dashed border-amber-400 bg-white rounded p-1.5 outline-hidden text-slate-800"
                    />
                  ) : (
                    <p className="text-[11px] text-amber-900 leading-relaxed">
                      {reportData.competitorAlertNote}
                    </p>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-700 pt-1">
                    <div className="bg-white p-2 rounded border border-amber-200/60 shadow-2xs">
                      <strong>极光手表:</strong> 10-25 标价 ¥1,150 ➔ 10-26 预售折算 ¥999 ➔ 10-27 破价至 <strong>¥950 (-17.4%)</strong>
                    </div>
                    <div className="bg-white p-2 rounded border border-amber-200/60 shadow-2xs">
                      <strong>珀莱雅同类精华:</strong> 10-25 标价 ¥420 ➔ 10-26 满减券叠加 ¥399 ➔ 10-27 触发赠品加码 <strong>¥389 (-7.4%)</strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 6. Section 4: Operational Strategy & Decision Recommendations (Editable 4 Playbooks) */}
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-1.5 border-b border-slate-200">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <span className="w-2 h-4 bg-emerald-600 rounded-xs" />
                  <span>四、本周运营中枢决策指导与行动建议</span>
                </h3>
                <span className="text-[11px] text-slate-400 font-mono">ACTION PLAYBOOK</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                
                {/* Action 1 */}
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                  <div className="font-bold text-slate-900 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    {isEditingMode ? (
                      <input
                        type="text"
                        value={reportData.action1Title}
                        onChange={(e) => handleFieldChange('action1Title', e.target.value)}
                        className="w-full text-xs font-bold text-slate-900 border border-dashed border-amber-400 bg-amber-50/40 rounded px-1.5 py-0.5 outline-hidden"
                      />
                    ) : (
                      <span>{reportData.action1Title}</span>
                    )}
                  </div>
                  {isEditingMode ? (
                    <textarea
                      rows={3}
                      value={reportData.action1Desc}
                      onChange={(e) => handleFieldChange('action1Desc', e.target.value)}
                      className="w-full text-[11px] text-slate-700 leading-relaxed border border-dashed border-amber-400 bg-white rounded p-1.5 outline-hidden"
                    />
                  ) : (
                    <p className="text-slate-600 text-[11px] leading-relaxed">
                      {reportData.action1Desc}
                    </p>
                  )}
                </div>

                {/* Action 2 */}
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                  <div className="font-bold text-slate-900 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                    {isEditingMode ? (
                      <input
                        type="text"
                        value={reportData.action2Title}
                        onChange={(e) => handleFieldChange('action2Title', e.target.value)}
                        className="w-full text-xs font-bold text-slate-900 border border-dashed border-amber-400 bg-amber-50/40 rounded px-1.5 py-0.5 outline-hidden"
                      />
                    ) : (
                      <span>{reportData.action2Title}</span>
                    )}
                  </div>
                  {isEditingMode ? (
                    <textarea
                      rows={3}
                      value={reportData.action2Desc}
                      onChange={(e) => handleFieldChange('action2Desc', e.target.value)}
                      className="w-full text-[11px] text-slate-700 leading-relaxed border border-dashed border-amber-400 bg-white rounded p-1.5 outline-hidden"
                    />
                  ) : (
                    <p className="text-slate-600 text-[11px] leading-relaxed">
                      {reportData.action2Desc}
                    </p>
                  )}
                </div>

                {/* Action 3 */}
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                  <div className="font-bold text-slate-900 flex items-center gap-1.5">
                    <Package className="w-4 h-4 text-blue-600 shrink-0" />
                    {isEditingMode ? (
                      <input
                        type="text"
                        value={reportData.action3Title}
                        onChange={(e) => handleFieldChange('action3Title', e.target.value)}
                        className="w-full text-xs font-bold text-slate-900 border border-dashed border-amber-400 bg-amber-50/40 rounded px-1.5 py-0.5 outline-hidden"
                      />
                    ) : (
                      <span>{reportData.action3Title}</span>
                    )}
                  </div>
                  {isEditingMode ? (
                    <textarea
                      rows={3}
                      value={reportData.action3Desc}
                      onChange={(e) => handleFieldChange('action3Desc', e.target.value)}
                      className="w-full text-[11px] text-slate-700 leading-relaxed border border-dashed border-amber-400 bg-white rounded p-1.5 outline-hidden"
                    />
                  ) : (
                    <p className="text-slate-600 text-[11px] leading-relaxed">
                      {reportData.action3Desc}
                    </p>
                  )}
                </div>

                {/* Action 4 */}
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                  <div className="font-bold text-slate-900 flex items-center gap-1.5">
                    <Flame className="w-4 h-4 text-red-600 shrink-0" />
                    {isEditingMode ? (
                      <input
                        type="text"
                        value={reportData.action4Title}
                        onChange={(e) => handleFieldChange('action4Title', e.target.value)}
                        className="w-full text-xs font-bold text-slate-900 border border-dashed border-amber-400 bg-amber-50/40 rounded px-1.5 py-0.5 outline-hidden"
                      />
                    ) : (
                      <span>{reportData.action4Title}</span>
                    )}
                  </div>
                  {isEditingMode ? (
                    <textarea
                      rows={3}
                      value={reportData.action4Desc}
                      onChange={(e) => handleFieldChange('action4Desc', e.target.value)}
                      className="w-full text-[11px] text-slate-700 leading-relaxed border border-dashed border-amber-400 bg-white rounded p-1.5 outline-hidden"
                    />
                  ) : (
                    <p className="text-slate-600 text-[11px] leading-relaxed">
                      {reportData.action4Desc}
                    </p>
                  )}
                </div>

              </div>
            </div>

            {/* 7. Section 5: Custom Operational Directive (特别批注与决议) */}
            <div className="p-3.5 rounded-xl bg-red-50/70 border border-red-200 text-xs space-y-1.5">
              <div className="flex items-center justify-between font-bold text-red-900">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-red-600" />
                  <span>五、运营特别批注与决胜指令 (Special Directives)</span>
                </span>
                {isEditingMode && (
                  <span className="text-[10px] text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded font-normal">
                    可自定义批注内容
                  </span>
                )}
              </div>
              
              {isEditingMode ? (
                <textarea
                  rows={2}
                  value={reportData.specialDirectives}
                  onChange={(e) => handleFieldChange('specialDirectives', e.target.value)}
                  className="w-full text-[11px] text-red-950 border border-dashed border-red-300 bg-white rounded p-2 outline-hidden focus:border-red-500"
                  placeholder="输入针对本周大促战报的运营总监特别批注、值班交接要求或紧急调令..."
                />
              ) : (
                <p className="text-red-950 text-[11px] leading-relaxed font-medium">
                  {reportData.specialDirectives}
                </p>
              )}
            </div>

            {/* 8. Report Footer Signature */}
            <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-2">
              <div className="flex items-center gap-2">
                {isEditingMode ? (
                  <div className="flex items-center gap-2">
                    <span>报告签发:</span>
                    <input
                      type="text"
                      value={reportData.signOffOrg}
                      onChange={(e) => handleFieldChange('signOffOrg', e.target.value)}
                      className="border border-dashed border-amber-400 bg-amber-50/40 rounded px-1.5 py-0.5 text-[11px] outline-hidden w-40"
                    />
                    <span>· 状态:</span>
                    <input
                      type="text"
                      value={reportData.signOffStatus}
                      onChange={(e) => handleFieldChange('signOffStatus', e.target.value)}
                      className="border border-dashed border-amber-400 bg-amber-50/40 rounded px-1.5 py-0.5 text-[11px] text-emerald-700 font-bold outline-hidden w-36"
                    />
                  </div>
                ) : (
                  <>
                    <span>报告签发: {reportData.signOffOrg}</span>
                    <span>·</span>
                    <span>审核状态: <strong className="text-emerald-600 font-semibold">{reportData.signOffStatus}</strong></span>
                  </>
                )}
              </div>
              <div className="font-mono text-slate-400">
                CHIXIAO-WARROOM-WEEKLY-REPORT-2026-V1.0
              </div>
            </div>

          </div>
        </div>

        {/* Modal Bottom Status Bar */}
        <div className="bg-white px-6 py-2.5 border-t border-slate-200 flex flex-wrap items-center justify-between text-xs text-slate-500 gap-2 shrink-0">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>所见即所得：任何在线编辑均即时映射到最终 A4 PDF 输出中</span>
            </span>
            <span className="hidden md:inline text-slate-300">|</span>
            <span className="hidden md:inline">
              导出引擎: jsPDF v4 + html2canvas 2x 高像素采样
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[11px] text-slate-400">
              提示：点击「导出并下载 PDF 周报」可直接获得最新排版文件
            </span>
            <button
              onClick={handleExportPDF}
              disabled={isExporting}
              className="px-3.5 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-xs transition-colors disabled:opacity-60 cursor-pointer"
            >
              {isExporting ? '导出中...' : '立即下载 PDF'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
