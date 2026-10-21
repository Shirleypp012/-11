/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { NavTab, CompetitorItem, StoreProduct, StoreOrder, WorkflowDefinition, WorkflowLog, SupportConversation, SupportMessage } from './types';
import { 
  INITIAL_WARROOM_METRICS, 
  INITIAL_COMPETITOR_ITEMS, 
  INITIAL_STORE_PRODUCTS, 
  INITIAL_STORE_ORDERS, 
  INITIAL_WORKFLOWS, 
  INITIAL_WORKFLOW_LOGS, 
  INITIAL_CONVERSATIONS 
} from './data/mockInitialData';

import { Header } from './components/common/Header';
import { WarRoomView } from './components/warroom/WarRoomView';
import { SelectionView } from './components/selection/SelectionView';
import { SocialInsightView } from './components/social/SocialInsightView';
import { VisualsView } from './components/visuals/VisualsView';
import { StoreView } from './components/store/StoreView';
import { AutomationView } from './components/automation/AutomationView';
import { SupportView } from './components/support/SupportView';

import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('warroom');
  const [metrics, setMetrics] = useState(INITIAL_WARROOM_METRICS);
  const [competitors, setCompetitors] = useState<CompetitorItem[]>(INITIAL_COMPETITOR_ITEMS);
  const [products, setProducts] = useState<StoreProduct[]>(INITIAL_STORE_PRODUCTS);
  const [orders, setOrders] = useState<StoreOrder[]>(INITIAL_STORE_ORDERS);
  const [workflows, setWorkflows] = useState<WorkflowDefinition[]>(INITIAL_WORKFLOWS);
  const [logs, setLogs] = useState<WorkflowLog[]>(INITIAL_WORKFLOW_LOGS);
  const [conversations, setConversations] = useState<SupportConversation[]>(INITIAL_CONVERSATIONS);

  // Operation states
  const [isScanning, setIsScanning] = useState(false);
  const [isExecutingWfId, setIsExecutingWfId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'warning' | 'info' } | null>(null);

  const showToast = (text: string, type: 'success' | 'warning' | 'info' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 3800);
  };

  // 1. Trigger Full Network Scan (changedetection)
  const handleTriggerScan = () => {
    setIsScanning(true);
    showToast('正在向天猫/京东/抖音/拼多多下发分布式抓包巡检请求...', 'info');

    setTimeout(() => {
      setIsScanning(false);
      // Simulate price shift detection
      setCompetitors((prev) =>
        prev.map((item, idx) => {
          if (idx === 0) {
            return {
              ...item,
              currentPrice: 1849,
              changeRate: -19.6,
              lastCheckedTime: '刚刚',
              lastDiff: {
                beforeText: '此前标价：¥1899',
                afterText: '检测到最新降价至 ¥1849！新增立减¥50限时券',
                detectedDiffType: '竞品加码大促降价 (-¥50)',
              },
            };
          }
          return { ...item, lastCheckedTime: '刚刚' };
        })
      );
      showToast('全网巡检完成！探测到【极光数码智能手表】价格进一步跳水至 ¥1849', 'warning');
    }, 1800);
  };

  // 2. Add Competitor Task
  const handleAddCompetitor = (item: CompetitorItem) => {
    setCompetitors((prev) => [item, ...prev]);
    showToast(`已成功创建针对【${item.title.slice(0, 12)}...】的24小时监控任务`);
  };

  // 3. Delete Competitor Task
  const handleDeleteCompetitor = (id: string) => {
    setCompetitors((prev) => prev.filter((c) => c.id !== id));
    showToast('已取消此监控任务', 'info');
  };

  // 4. Replenish Stock (Medusa)
  const handleReplenishStock = (productId: string, amount: number) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === productId) {
          const newAvail = p.availableInventory + amount;
          const newTotal = p.totalInventory + amount;
          return { ...p, availableInventory: newAvail, totalInventory: newTotal };
        }
        return p;
      })
    );
    showToast(`成功加急补充 ${amount} 件库存，可用库存已更新`);
  };

  // 5. Batch Ship Orders (Medusa + SF Express)
  const handleBatchShipOrders = () => {
    const trackingBase = 1409281739000;
    let shippedCount = 0;

    setOrders((prev) =>
      prev.map((o, idx) => {
        if (o.status === 'paid_fulfillment') {
          shippedCount++;
          return {
            ...o,
            status: 'shipped',
            expressTracking: `SF${trackingBase + idx}`,
          };
        }
        return o;
      })
    );

    // Append to n8n logs
    const newLog: WorkflowLog = {
      id: `log-${Date.now()}`,
      workflowId: 'wf-04',
      workflowName: '极速发货顺丰协同与买家双十一关怀',
      timestamp: new Date().toLocaleTimeString('zh-CN', { hour12: false }),
      status: 'success',
      executionDuration: '148ms',
      payloadSummary: `顺丰自动打单调度成功，批量出库 ${shippedCount} 笔订单，电子面单与预计次日达短信已自动同步买家`,
    };
    setLogs((prev) => [newLog, ...prev]);

    showToast(`成功批量打单！已为 ${shippedCount} 笔订单生成顺丰特快运单并出库`);
  };

  // 6. Workflow toggle & execute (n8n)
  const handleToggleWorkflow = (id: string) => {
    setWorkflows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, enabled: !w.enabled } : w))
    );
  };

  const handleExecuteWorkflow = (wfId: string) => {
    setIsExecutingWfId(wfId);
    const targetWf = workflows.find((w) => w.id === wfId);
    showToast(`正在逐级激活【${targetWf?.name}】工作流节点...`, 'info');

    setTimeout(() => {
      setIsExecutingWfId(null);
      setWorkflows((prev) =>
        prev.map((w) =>
          w.id === wfId
            ? { ...w, totalExecutions: w.totalExecutions + 1, lastRunTime: '刚刚' }
            : w
        )
      );

      const newLog: WorkflowLog = {
        id: `log-${Date.now()}`,
        workflowId: wfId,
        workflowName: targetWf?.name || '自动化流程',
        timestamp: new Date().toLocaleTimeString('zh-CN', { hour12: false }),
        status: 'success',
        executionDuration: '235ms',
        payloadSummary: `流程【${targetWf?.name}】手动调试运行完毕，所有执行节点与Webhook均返回 200 OK`,
      };
      setLogs((prev) => [newLog, ...prev]);
      showToast(`流程【${targetWf?.name}】单次执行测试成功`);
    }, 1500);
  };

  const handleAddWorkflow = (wf: WorkflowDefinition) => {
    setWorkflows((prev) => [...prev, wf]);
    showToast(`已成功部署自动化工作流【${wf.name}】`);
  };

  // 7. Chatwoot message send & stage update
  const handleSendMessage = (conversationId: string, message: SupportMessage) => {
    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === conversationId) {
          return {
            ...c,
            lastMessage: message.content,
            lastMessageTime: '刚刚',
            messages: [...c.messages, message],
          };
        }
        return c;
      })
    );
  };

  const handleUpdateDealStage = (conversationId: string, stage: SupportConversation['dealStage']) => {
    setConversations((prev) =>
      prev.map((c) => (c.id === conversationId ? { ...c, dealStage: stage } : c))
    );
    showToast(`客户转化状态已更新为【${stage}】`);
  };

  // 8. Social Insight cross-module triggers
  const handleSyncToSupport = (scriptText: string) => {
    // Append to active conversation if exists
    if (conversations.length > 0) {
      const activeConvId = conversations[0].id;
      const newMsg: SupportMessage = {
        id: `msg-ai-${Date.now()}`,
        sender: 'agent',
        content: scriptText,
        timestamp: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
      };
      handleSendMessage(activeConvId, newMsg);
    }
  };

  const handleSyncToVisuals = (_advice: string) => {
    showToast('已将 AI 详情页与主图首屏改版建议同步至素材工坊！', 'success');
  };

  // 9. War room simulation of order surge
  const handleSimulateSurge = () => {
    setMetrics((prev) => ({
      ...prev,
      currentGMV: prev.currentGMV + 5840,
      todayOrdersCount: prev.todayOrdersCount + 3,
    }));

    // Add new order
    const surgeOrder: StoreOrder = {
      id: `ord-${Date.now()}`,
      orderNumber: `TM${Date.now()}`,
      customerName: '赵先生 (88VIP高潜买家)',
      platform: '天猫旗舰店',
      items: [
        {
          productId: 'spu-001',
          productName: '天枢 Pro 智能运动户外腕表 (蓝宝石心电版)',
          quantity: 1,
          unitPrice: 1999,
        },
        {
          productId: 'spu-002',
          productName: '凝时赋活多肽抗老修护精华乳 50ml',
          quantity: 1,
          unitPrice: 520,
        },
      ],
      totalAmount: 2519,
      discountAmount: 400,
      finalPaid: 2119,
      orderType: '现货直购',
      status: 'paid_fulfillment',
      createdAt: '刚刚',
      shippingAddress: '浙江省 杭州市 西湖区 文三路华星科技大厦 6层',
    };

    setOrders((prev) => [surgeOrder, ...prev]);
    showToast('⚡ 双十一洪峰模拟：收到来自天猫旗舰店的组合购买大单 (¥2,119)，GMV累加成功！');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-red-500 selection:text-white">
      {/* Top Bar Header */}
      <Header
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onQuickScan={handleTriggerScan}
        isScanning={isScanning}
      />

      {/* Main Viewport Container */}
      <main className="flex-1 max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'warroom' && (
          <WarRoomView
            metrics={metrics}
            onNavigate={setActiveTab}
            competitors={competitors}
            products={products}
            orders={orders}
            onSimulateSurge={handleSimulateSurge}
            onShowToast={showToast}
          />
        )}

        {activeTab === 'selection' && (
          <SelectionView
            competitors={competitors}
            onAddCompetitor={handleAddCompetitor}
            onDeleteCompetitor={handleDeleteCompetitor}
            onTriggerScan={handleTriggerScan}
            isScanning={isScanning}
          />
        )}

        {activeTab === 'social_insight' && (
          <SocialInsightView
            onSyncToSupport={handleSyncToSupport}
            onSyncToVisuals={handleSyncToVisuals}
            onAddToCompetitors={handleAddCompetitor}
            onNavigateTab={setActiveTab}
            onShowToast={showToast}
          />
        )}

        {activeTab === 'visuals' && <VisualsView />}

        {activeTab === 'store' && (
          <StoreView
            products={products}
            orders={orders}
            onReplenishStock={handleReplenishStock}
            onBatchShipOrders={handleBatchShipOrders}
          />
        )}

        {activeTab === 'automation' && (
          <AutomationView
            workflows={workflows}
            logs={logs}
            onToggleWorkflow={handleToggleWorkflow}
            onExecuteWorkflow={handleExecuteWorkflow}
            onAddWorkflow={handleAddWorkflow}
            isExecutingId={isExecutingWfId}
          />
        )}

        {activeTab === 'support' && (
          <SupportView
            conversations={conversations}
            onSendMessage={handleSendMessage}
            onUpdateDealStage={handleUpdateDealStage}
          />
        )}
      </main>

      {/* Floating Operational Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl bg-white border border-slate-200 shadow-xl text-xs text-slate-800 max-w-md animate-in fade-in slide-in-from-bottom-2 duration-200">
          {toastMessage.type === 'success' && (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          )}
          {toastMessage.type === 'warning' && (
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
          )}
          {toastMessage.type === 'info' && (
            <Info className="w-4 h-4 text-blue-600 shrink-0" />
          )}
          <span className="flex-1 leading-normal font-medium">{toastMessage.text}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="text-slate-400 hover:text-slate-700 shrink-0 ml-1 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-slate-200 py-4 px-6 text-center text-xs text-slate-500 bg-white">
        <div className="max-w-[1440px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span className="font-medium text-slate-600">赤霄 11.11 · 全链路电商数智营销与自动化运营中枢</span>
          <div className="flex items-center gap-3 text-[11px] text-slate-500">
            <span>选品 (changedetection)</span>
            <span>·</span>
            <span>洞察 (Gemini AI)</span>
            <span>·</span>
            <span>视觉 (PicPilot)</span>
            <span>·</span>
            <span>店铺 (Medusa)</span>
            <span>·</span>
            <span>流转 (n8n)</span>
            <span>·</span>
            <span>客服 (Chatwoot)</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
