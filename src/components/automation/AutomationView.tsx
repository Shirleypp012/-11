import React, { useState } from 'react';
import { WorkflowDefinition, WorkflowLog } from '../../types';
import { 
  Workflow, 
  Play, 
  Plus, 
  ArrowRight, 
  Code,
  X
} from 'lucide-react';

interface AutomationViewProps {
  workflows: WorkflowDefinition[];
  logs: WorkflowLog[];
  onToggleWorkflow: (id: string) => void;
  onExecuteWorkflow: (workflowId: string) => void;
  onAddWorkflow: (workflow: WorkflowDefinition) => void;
  isExecutingId: string | null;
}

export const AutomationView: React.FC<AutomationViewProps> = ({
  workflows,
  logs,
  onToggleWorkflow,
  onExecuteWorkflow,
  onAddWorkflow,
  isExecutingId,
}) => {
  const [selectedWfId, setSelectedWfId] = useState<string>(workflows[0]?.id || '');
  const [showAddModal, setShowAddModal] = useState<boolean>(false);

  // New Workflow form state
  const [newWfName, setNewWfName] = useState('');
  const [newCategory, setNewCategory] = useState<WorkflowDefinition['category']>('催付促单');
  const [newDesc, setNewDesc] = useState('');
  const [newTrigger, setNewTrigger] = useState('买家加入购物车满2小时未结算');
  const [newAction, setNewAction] = useState('企业微信自动推送限时¥10加购专享优惠券');

  const selectedWorkflow = workflows.find((w) => w.id === selectedWfId) || workflows[0];

  const handleCreateWorkflow = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWfName) return;

    const newWf: WorkflowDefinition = {
      id: `wf-${Date.now()}`,
      name: newWfName,
      description: newDesc || '自定义双十一智能运营编排流程',
      category: newCategory,
      enabled: true,
      triggerEvent: newTrigger,
      lastRunTime: '刚刚创建',
      totalExecutions: 0,
      successRate: 100,
      nodes: [
        {
          id: 'n_trig',
          name: '事件触发器',
          type: 'trigger',
          service: 'MedusaStore',
          configSummary: newTrigger,
          status: 'idle',
          icon: 'Zap',
        },
        {
          id: 'n_act',
          name: '执行动作',
          type: 'action',
          service: 'WeCom',
          configSummary: newAction,
          status: 'idle',
          icon: 'Send',
        },
      ],
    };

    onAddWorkflow(newWf);
    setSelectedWfId(newWf.id);
    setShowAddModal(false);
    setNewWfName('');
    setNewDesc('');
  };

  const getServiceColor = (service: string) => {
    switch (service) {
      case 'MedusaStore':
        return 'text-blue-700 bg-blue-50 border-blue-200';
      case 'Changedetection':
        return 'text-red-700 bg-red-50 border-red-200';
      case 'DingTalk':
        return 'text-amber-700 bg-amber-50 border-amber-200';
      case 'WeCom':
        return 'text-emerald-700 bg-emerald-50 border-emerald-200';
      case 'SFExpress':
        return 'text-orange-700 bg-orange-50 border-orange-200';
      default:
        return 'text-slate-700 bg-slate-100 border-slate-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold">
              n8n 编排引擎
            </span>
            <h1 className="text-lg font-bold text-slate-900 tracking-tight">
              双十一全自动化运营工作流中枢
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            打通店铺底盘、选品雷达、钉钉/企微运营群、顺丰物流与短信，告别大促手动值守。
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition-all cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>新建自动化流程</span>
        </button>
      </div>

      {/* Main Grid: Workflow Tabs + Node Graph */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Workflows List (4 cols) */}
        <div className="lg:col-span-4 space-y-3">
          <div className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
            预设双十一运营自动化管线 ({workflows.length})
          </div>

          {workflows.map((wf) => {
            const isSelected = selectedWorkflow?.id === wf.id;

            return (
              <div
                key={wf.id}
                onClick={() => setSelectedWfId(wf.id)}
                className={`cursor-pointer rounded-xl p-4 transition-all border ${
                  isSelected
                    ? 'bg-emerald-50/40 border-emerald-500 shadow-xs'
                    : 'bg-white border-slate-200 hover:bg-slate-50/80 hover:border-slate-300 shadow-xs'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] font-mono text-emerald-700 font-semibold">
                    {wf.category}
                  </span>

                  {/* Toggle Enabled */}
                  <label
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={wf.enabled}
                      onChange={() => onToggleWorkflow(wf.id)}
                      className="sr-only"
                    />
                    <div
                      className={`w-8 h-4.5 rounded-full transition-colors relative ${
                        wf.enabled ? 'bg-emerald-600' : 'bg-slate-300'
                      }`}
                    >
                      <div
                        className={`w-3.5 h-3.5 rounded-full bg-white transition-transform absolute top-0.5 left-0.5 shadow-xs ${
                          wf.enabled ? 'translate-x-3.5' : 'translate-x-0'
                        }`}
                      />
                    </div>
                  </label>
                </div>

                <h3 className="text-xs font-bold text-slate-900 leading-snug line-clamp-1">
                  {wf.name}
                </h3>
                <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                  {wf.description}
                </p>

                <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-mono">
                  <span>执行: {wf.totalExecutions.toLocaleString()}次</span>
                  <span>成功率: {wf.successRate}%</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Interactive Node Graph (8 cols) */}
        <div className="lg:col-span-8 space-y-5">
          {selectedWorkflow && (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-6 shadow-xs">
              {/* Header inside canvas */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-sm font-bold text-slate-900">
                      {selectedWorkflow.name}
                    </h2>
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded font-semibold ${
                        selectedWorkflow.enabled
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {selectedWorkflow.enabled ? '● 正在运行' : '○ 已停用'}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 mt-1 font-mono">
                    触发条件: {selectedWorkflow.triggerEvent}
                  </div>
                </div>

                <button
                  onClick={() => onExecuteWorkflow(selectedWorkflow.id)}
                  disabled={isExecutingId === selectedWorkflow.id}
                  className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-all cursor-pointer disabled:opacity-50"
                >
                  <Play className={`w-3.5 h-3.5 fill-white ${isExecutingId === selectedWorkflow.id ? 'animate-pulse' : ''}`} />
                  <span>
                    {isExecutingId === selectedWorkflow.id ? '正在分步流转执行...' : '手动执行测试 (Run Once)'}
                  </span>
                </button>
              </div>

              {/* Visual Node Diagram */}
              <div className="bg-slate-50 rounded-xl p-6 border border-slate-200 overflow-x-auto">
                <div className="text-[11px] text-slate-500 font-medium mb-4 flex items-center gap-2">
                  <Workflow className="w-3.5 h-3.5 text-emerald-600" />
                  <span>n8n 自动化流转节点图 (Visual Node Graph)</span>
                </div>

                <div className="flex items-center gap-3 min-w-[650px] py-4">
                  {selectedWorkflow.nodes.map((node, index) => {
                    const isLast = index === selectedWorkflow.nodes.length - 1;
                    const isExecutingThis = isExecutingId === selectedWorkflow.id;
                    const serviceStyle = getServiceColor(node.service);

                    return (
                      <React.Fragment key={node.id}>
                        {/* Node Card */}
                        <div
                          className={`flex-1 rounded-xl p-4 border transition-all ${
                            isExecutingThis
                              ? 'border-emerald-500 bg-emerald-50 shadow-md animate-pulse'
                              : 'border-slate-200 bg-white hover:border-slate-300 shadow-xs'
                          }`}
                        >
                          <div className="flex items-center justify-between text-[11px] mb-2">
                            <span className="font-mono text-slate-500 uppercase font-bold">
                              {node.type}
                            </span>
                            <span className={`px-2 py-0.5 rounded text-[10px] font-mono border font-medium ${serviceStyle}`}>
                              {node.service}
                            </span>
                          </div>

                          <div className="text-xs font-bold text-slate-900 mb-1">
                            {node.name}
                          </div>

                          <div className="text-[10px] font-mono text-slate-600 bg-slate-50 p-2 rounded border border-slate-200 break-all">
                            {node.configSummary}
                          </div>
                        </div>

                        {/* Arrow connector */}
                        {!isLast && (
                          <div className="flex flex-col items-center justify-center shrink-0 text-slate-400">
                            <ArrowRight className={`w-5 h-5 ${isExecutingThis ? 'text-emerald-600 animate-pulse' : ''}`} />
                          </div>
                        )}
                      </React.Fragment>
                    );
                  })}
                </div>
              </div>

              {/* Execution Logs Console */}
              <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 space-y-3 font-mono text-xs">
                <div className="flex items-center justify-between text-slate-700 pb-2 border-b border-slate-200">
                  <div className="flex items-center gap-2">
                    <Code className="w-4 h-4 text-emerald-600" />
                    <span className="font-bold text-slate-900">自动化执行日志控制台 (Live Logs)</span>
                  </div>
                  <span className="text-[11px] text-slate-500">毫秒级执行响应</span>
                </div>

                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {logs.map((log) => (
                    <div
                      key={log.id}
                      className="p-2.5 rounded bg-white border border-slate-200 flex items-start gap-2.5 text-[11px] shadow-xs"
                    >
                      <span className="text-slate-400 shrink-0">[{log.timestamp}]</span>
                      <span
                        className={`px-1.5 py-0.5 rounded text-[10px] shrink-0 font-medium ${
                          log.status === 'success'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                      >
                        {log.status.toUpperCase()}
                      </span>
                      <span className="text-slate-500 shrink-0">({log.executionDuration})</span>
                      <span className="text-slate-800 flex-1">{log.payloadSummary}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add Workflow Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">
                新建自动化运营工作流 (n8n Orchestrator)
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateWorkflow} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-600 mb-1 font-medium">流程名称</label>
                <input
                  type="text"
                  required
                  placeholder="例如：双十一爆款加购未结算自动召回"
                  value={newWfName}
                  onChange={(e) => setNewWfName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:bg-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-600 mb-1 font-medium">业务分类</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:bg-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="催付促单">催付促单</option>
                  <option value="竞品防守">竞品防守</option>
                  <option value="库存熔断">库存熔断</option>
                  <option value="履约物流">履约物流</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-600 mb-1 font-medium">流程简述</label>
                <input
                  type="text"
                  placeholder="说明此流程在大促期间解决的核心运营痛点..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:bg-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-600 mb-1 font-medium">事件触发器 (Trigger)</label>
                <input
                  type="text"
                  value={newTrigger}
                  onChange={(e) => setNewTrigger(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 font-mono focus:bg-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-600 mb-1 font-medium">自动化动作 (Action)</label>
                <input
                  type="text"
                  value={newAction}
                  onChange={(e) => setNewAction(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 font-mono focus:bg-white focus:outline-none focus:border-emerald-500"
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
                  className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold cursor-pointer"
                >
                  立即部署上阵
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
