import React, { useState } from 'react';
import { SupportConversation, SupportMessage } from '../../types';
import { 
  Send, 
  Ticket, 
  ShieldCheck, 
  Truck
} from 'lucide-react';

interface SupportViewProps {
  conversations: SupportConversation[];
  onSendMessage: (conversationId: string, message: SupportMessage) => void;
  onUpdateDealStage: (conversationId: string, stage: SupportConversation['dealStage']) => void;
}

export const SupportView: React.FC<SupportViewProps> = ({
  conversations,
  onSendMessage,
  onUpdateDealStage,
}) => {
  const [selectedConvId, setSelectedConvId] = useState<string>(conversations[0]?.id || '');
  const [channelFilter, setChannelFilter] = useState<string>('all');
  const [inputText, setInputText] = useState<string>('');

  const currentConv = conversations.find((c) => c.id === selectedConvId) || conversations[0];

  const filteredConversations = conversations.filter((c) => {
    if (channelFilter === 'all') return true;
    return c.channel === channelFilter;
  });

  const quickReplies = [
    {
      id: 'qr1',
      title: '30天价保承诺',
      text: '亲亲放心！全店全线商品均享受【双十一30天全程价保】，无论11号当天如何变动，买贵系统一键秒退差价，现付定金锁定最划算！',
    },
    {
      id: 'qr2',
      title: '发货时效保障',
      text: '全国5大核心仓均备妥现货，顺丰空运/特快直发，最快次日达！大促期间优先安排发货通道，绝不压件！',
    },
    {
      id: 'qr3',
      title: '满300-50凑单建议',
      text: '亲亲，您当前购物车仅需再凑 ¥40 即可触发【跨店满300减50】，搭配店内¥49原装保护壳即可多省¥50，更划算哦！',
    },
    {
      id: 'qr4',
      title: '定金无忧秒退',
      text: '付定金不用有顾虑哦！在尾款开启前若有任何变化，支持系统一键秒退定金，资金无任何锁死风险！',
    },
    {
      id: 'qr5',
      title: '企业大客户专属KA',
      text: '陈总您好，我们针对批量企业采购配有专属对公KA折扣政策，支持13%增值税专用发票并赠送免费上门组装服务！',
    },
  ];

  const handleSendText = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !currentConv) return;

    const newMsg: SupportMessage = {
      id: `m-${Date.now()}`,
      sender: 'agent',
      content: inputText.trim(),
      timestamp: '刚刚',
      type: 'text',
    };

    onSendMessage(currentConv.id, newMsg);
    setInputText('');

    // Trigger simulated customer response after 1.2s
    setTimeout(() => {
      const responses = [
        '好的！看到有保价我就放心了，我现在就去把尾款定金付了！谢谢客服耐心的解答！',
        '哇太棒了，刚好可以凑满减！这个满减规则太划算了，我这就下单！',
        '顺丰发货太给力了，那我就不用担心双十一爆仓收不到货了！',
        '太感谢了，专属优惠券已经收到并在购物车抵扣了！服务满分！',
      ];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];

      const customerReply: SupportMessage = {
        id: `m-${Date.now() + 1}`,
        sender: 'customer',
        content: randomResponse,
        timestamp: '刚刚',
        type: 'text',
      };
      onSendMessage(currentConv.id, customerReply);
    }, 1200);
  };

  const handleSendQuickReply = (text: string) => {
    if (!currentConv) return;
    const newMsg: SupportMessage = {
      id: `m-${Date.now()}`,
      sender: 'agent',
      content: text,
      timestamp: '刚刚',
      type: 'text',
    };
    onSendMessage(currentConv.id, newMsg);
  };

  const handleSendCoupon = () => {
    if (!currentConv) return;
    const newMsg: SupportMessage = {
      id: `m-${Date.now()}`,
      sender: 'agent',
      content: '为您申请了双十一专属加购促单红包：',
      timestamp: '刚刚',
      type: 'coupon',
      couponData: {
        title: '双十一客户专属促单红包',
        amount: '¥30',
        validDate: '仅限今日有效 · 自动抵扣尾款',
      },
    };
    onSendMessage(currentConv.id, newMsg);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-200 font-semibold">
              Chatwoot 统一工单客服
            </span>
            <h1 className="text-lg font-bold text-slate-900 tracking-tight">
              全渠道客服统一收件箱与高潜转化中枢
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            集中处理天猫千牛、抖音直播、微信小程序、小红书与官网咨询，大促金牌话术库与专属红包一键挽单。
          </p>
        </div>

        {/* Channel Filters */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 border border-slate-200 rounded-lg text-xs">
          {['all', '天猫千牛', '抖音直播', '微信小程序', '小红书私信'].map((ch) => (
            <button
              key={ch}
              onClick={() => setChannelFilter(ch)}
              className={`px-3 py-1.5 rounded-md font-medium transition-all cursor-pointer ${
                channelFilter === ch
                  ? 'bg-white text-purple-700 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {ch === 'all' ? '全部渠道' : ch}
            </button>
          ))}
        </div>
      </div>

      {/* 3-Column Chat Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Conversations List (3.5 cols) */}
        <div className="lg:col-span-4 bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              待跟进询单队列 ({filteredConversations.length})
            </span>
            <span className="text-[11px] text-purple-600 font-mono font-medium">实时响应中</span>
          </div>

          <div className="divide-y divide-slate-100 max-h-[640px] overflow-y-auto">
            {filteredConversations.map((conv) => {
              const isSelected = currentConv?.id === conv.id;
              return (
                <div
                  key={conv.id}
                  onClick={() => setSelectedConvId(conv.id)}
                  className={`p-3.5 cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-purple-50/60 border-l-4 border-purple-600'
                      : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <img
                      src={conv.avatar}
                      alt={conv.customerName}
                      className="w-10 h-10 rounded-full bg-slate-100 shrink-0 border border-slate-200"
                    />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-slate-900 truncate">
                            {conv.customerName}
                          </span>
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 border border-slate-200">
                            {conv.channel}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {conv.lastMessageTime}
                        </span>
                      </div>

                      <p className="text-xs text-slate-600 truncate mt-1">
                        {conv.lastMessage}
                      </p>

                      <div className="mt-2 flex items-center justify-between text-[11px]">
                        <span className="text-red-600 font-mono font-semibold">
                          客单 ¥{conv.cartValue.toLocaleString()}
                        </span>
                        <span className="text-purple-700 font-semibold">
                          {conv.dealStage}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Center Column: Live Chat Console (5.5 cols) */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl flex flex-col h-[640px] shadow-xs">
          {/* Chat Header */}
          {currentConv && (
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-3">
                <img
                  src={currentConv.avatar}
                  alt={currentConv.customerName}
                  className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-900">
                      {currentConv.customerName}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-purple-50 text-purple-700 font-semibold border border-purple-200">
                      {currentConv.vipTier}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500">
                    来源: {currentConv.channel} · 意向: {currentConv.potentialIntent}
                  </div>
                </div>
              </div>

              <div className="text-xs font-mono text-emerald-600 flex items-center gap-1 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping inline-block" />
                <span>在线中</span>
              </div>
            </div>
          )}

          {/* Chat Messages Stream */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-slate-50/40">
            {currentConv?.messages.map((msg) => {
              const isMe = msg.sender === 'agent';
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                >
                  <div className="text-[10px] text-slate-400 font-mono mb-1 px-1">
                    {isMe ? '大促专属顾问 (您)' : currentConv.customerName} · {msg.timestamp}
                  </div>

                  {msg.type === 'coupon' && msg.couponData ? (
                    <div className="bg-gradient-to-r from-red-600 to-rose-600 rounded-xl p-3 text-white max-w-xs shadow-md border border-red-300 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold">{msg.couponData.title}</span>
                        <Ticket className="w-4 h-4 text-amber-200" />
                      </div>
                      <div className="text-2xl font-bold font-mono text-amber-200">
                        {msg.couponData.amount}
                      </div>
                      <div className="text-[10px] text-red-100">
                        {msg.couponData.validDate}
                      </div>
                    </div>
                  ) : (
                    <div
                      className={`rounded-2xl px-4 py-2.5 max-w-[85%] text-xs leading-relaxed ${
                        isMe
                          ? 'bg-purple-600 text-white rounded-br-xs shadow-xs'
                          : 'bg-white text-slate-800 rounded-bl-xs border border-slate-200 shadow-xs'
                      }`}
                    >
                      {msg.content}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Chat Quick Action Bar */}
          <div className="px-4 py-2 border-t border-slate-100 bg-white flex items-center gap-2 overflow-x-auto text-xs">
            <button
              onClick={handleSendCoupon}
              className="flex items-center gap-1 px-2.5 py-1 rounded bg-red-50 hover:bg-red-100 text-red-700 font-medium border border-red-200 shrink-0 cursor-pointer"
            >
              <Ticket className="w-3.5 h-3.5" />
              <span>发¥30促单红包</span>
            </button>
            <button
              onClick={() => handleSendQuickReply(quickReplies[0].text)}
              className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 shrink-0 cursor-pointer"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
              <span>发30天价保承诺</span>
            </button>
            <button
              onClick={() => handleSendQuickReply(quickReplies[1].text)}
              className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 shrink-0 cursor-pointer"
            >
              <Truck className="w-3.5 h-3.5 text-emerald-600" />
              <span>发顺丰时效保证</span>
            </button>
          </div>

          {/* Chat Input Field */}
          <form
            onSubmit={handleSendText}
            className="p-3 border-t border-slate-200 flex items-center gap-2 bg-white"
          >
            <input
              type="text"
              placeholder="输入回复或点击上方金牌话术库..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-purple-500"
            />
            <button
              type="submit"
              className="p-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white transition-all cursor-pointer shadow-xs"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Right Column: Customer Profile & Quick Replies Arsenal (3 cols) */}
        <div className="lg:col-span-3 space-y-4">
          {/* Customer CRM info card */}
          {currentConv && (
            <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-3 shadow-xs">
              <div className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                客户画像与转化意向
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">会员层级:</span>
                  <span className="text-amber-700 font-semibold">{currentConv.vipTier}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">预购车总值:</span>
                  <span className="font-mono text-slate-900 font-bold">
                    ¥{currentConv.cartValue.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">转化阶段:</span>
                  <select
                    value={currentConv.dealStage}
                    onChange={(e) => onUpdateDealStage(currentConv.id, e.target.value as any)}
                    className="bg-slate-50 border border-slate-200 rounded px-2 py-1 text-xs text-purple-700 font-semibold focus:outline-none"
                  >
                    <option value="咨询中">咨询中</option>
                    <option value="高意向">高意向</option>
                    <option value="已付定金">已付定金</option>
                    <option value="已成单">已成单</option>
                    <option value="售后关注">售后关注</option>
                  </select>
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-[11px] text-slate-700">
                <span className="text-purple-700 font-semibold">画像判断: </span>
                {currentConv.potentialIntent}
              </div>
            </div>
          )}

          {/* Quick Replies Accordion */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-3 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                大促金牌话术库
              </span>
              <span className="text-[11px] text-slate-500">点击一键发送</span>
            </div>

            <div className="space-y-2">
              {quickReplies.map((qr) => (
                <div
                  key={qr.id}
                  onClick={() => handleSendQuickReply(qr.text)}
                  className="p-2.5 rounded-lg bg-slate-50 hover:bg-purple-50/70 border border-slate-200 cursor-pointer transition-all group shadow-2xs"
                >
                  <div className="text-xs font-semibold text-slate-800 group-hover:text-purple-700 flex items-center justify-between">
                    <span>{qr.title}</span>
                    <Send className="w-3 h-3 text-slate-400 group-hover:text-purple-600" />
                  </div>
                  <p className="text-[11px] text-slate-500 line-clamp-2 mt-1 leading-relaxed">
                    {qr.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
