export type NavTab = 'warroom' | 'selection' | 'social_insight' | 'visuals' | 'store' | 'automation' | 'support';

// 6. 社媒评论与AI需求洞察
export type SocialPlatform = '小红书' | '抖音' | '微博' | '天猫/淘宝买家秀' | '知乎' | 'B站';

export interface SocialComment {
  id: string;
  platform: SocialPlatform;
  author: string;
  authorTag: string; // e.g. "成分党小红薯", "88VIP买家", "数码自媒体博主", "宝妈实测"
  avatar: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  likesCount: number;
  repliesCount: number;
  publishTime: string;
  verifiedBuyer: boolean;
  content: string;
  tags: string[]; // e.g. ["痛点吐槽", "质感惊艳", "续航需求", "凑单划算"]
  keyDemand: string; // 提取的核心需求或诉求
}

export interface SocialInsightReport {
  brand: string;
  product: string;
  totalCommentsScanned: number;
  positiveRate: number; // 0 - 100
  neutralRate: number;
  negativeRate: number;
  executiveSummary: string; // AI 一句话大促战报情报
  hotKeywords: { word: string; count: number; sentiment: 'positive' | 'negative' | 'neutral' }[];
  corePraises: {
    title: string;
    description: string;
    percentage: number;
    quoteSample: string;
  }[];
  corePainPoints: {
    title: string;
    description: string;
    severity: 'high' | 'medium' | 'low';
    quoteSample: string;
  }[];
  unmetDemands: {
    demand: string;
    opportunityAnalysis: string;
    suggestedProductAction: string;
  }[];
  double11Playbook: {
    visualAdvice: string; // 视觉与详情页痛点回应
    liveScriptAdvice: string; // 直播间破冰话术
    pricingBundleAdvice: string; // 凑单与赠品心智
    competitorDefenseAdvice: string; // 竞品防守
  };
  generatedAt: string;
  sourceModel: string;
}

// 1. 选品研究 (changedetection.io)
export interface CompetitorItem {
  id: string;
  title: string;
  category: string;
  platform: '天猫旗舰店' | '京东自营' | '抖音小店' | '拼多多百亿补贴';
  brand: string;
  originalPrice: number;
  currentPrice: number;
  promoRule: string; // e.g. "跨店满300-50 + 预售立减30"
  targetPriceThreshold: number;
  stockStatus: '充足 (3000+)' | '紧张 (120件)' | '临界缺货 (18件)' | '已售罄';
  stockCount: number;
  status: 'normal' | 'price_cut' | 'low_stock' | 'content_updated';
  lastCheckedTime: string;
  changeRate: number; // e.g. -14.5%
  url: string;
  selector: string;
  historicalPrices: { date: string; price: number }[];
  lastDiff: {
    beforeText: string;
    afterText: string;
    detectedDiffType: string;
  };
}

// 2. 素材处理 (PicPilot)
export interface MarketingBannerConfig {
  productImage: string;
  productName: string;
  theme: 'red_carnival' | 'presale_neon' | 'national_subsidy' | 'luxury_blackgold';
  badgeStyle: 'half_price' | 'minus_50' | 'presale_deposit' | 'official_15' | 'freight_insurance';
  customTitle: string;
  subTitle: string;
  priceTag: string;
  originalTag: string;
  urgencyCopy: string;
  aspectRatio: '1:1' | '3:4' | '16:9' | '9:16';
  showDecorations: boolean;
  backgroundScene: 'studio_stone' | 'neon_showroom' | 'warm_gradient' | 'minimal_dark';
}

// 3. 店铺系统 (Medusa)
export interface StoreProduct {
  id: string;
  spuCode: string;
  name: string;
  category: string;
  image: string;
  costPrice: number;
  salePrice: number;
  presaleDeposit: number;
  presaleBalance: number;
  totalInventory: number;
  lockedInventory: number; // 预售或支付锁库
  availableInventory: number;
  safetyThreshold: number;
  status: 'presale' | 'active' | 'scheduled' | 'out_of_stock';
  salesVolume: number;
}

export interface StoreOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  platform: '天猫旗舰店' | '抖音直播' | '京东自营' | '微信小程序';
  items: {
    productId: string;
    productName: string;
    quantity: number;
    unitPrice: number;
  }[];
  totalAmount: number;
  discountAmount: number;
  finalPaid: number;
  orderType: '预售定金' | '现货直购' | '尾款结算';
  status: 'pending_deposit' | 'paid_deposit' | 'awaiting_balance' | 'paid_fulfillment' | 'shipped';
  createdAt: string;
  expressTracking?: string;
  shippingAddress: string;
}

// 4. 自动化运营 (n8n)
export interface WorkflowNode {
  id: string;
  name: string;
  type: 'trigger' | 'condition' | 'action' | 'notification' | 'webhook';
  service: 'TaobaoAPI' | 'Changedetection' | 'WeCom' | 'DingTalk' | 'MedusaStore' | 'SMS' | 'SFExpress';
  configSummary: string;
  status: 'idle' | 'running' | 'success' | 'failed';
  icon: string;
}

export interface WorkflowDefinition {
  id: string;
  name: string;
  description: string;
  category: '催付促单' | '竞品防守' | '库存熔断' | '履约物流';
  enabled: boolean;
  triggerEvent: string;
  lastRunTime: string;
  totalExecutions: number;
  successRate: number;
  nodes: WorkflowNode[];
}

export interface WorkflowLog {
  id: string;
  workflowId: string;
  workflowName: string;
  timestamp: string;
  status: 'success' | 'warning' | 'error';
  executionDuration: string;
  payloadSummary: string;
}

// 5. 客服转化 (Chatwoot)
export interface SupportMessage {
  id: string;
  sender: 'customer' | 'agent' | 'system';
  content: string;
  timestamp: string;
  type?: 'text' | 'coupon' | 'order_summary';
  couponData?: {
    title: string;
    amount: string;
    validDate: string;
  };
}

export interface SupportConversation {
  id: string;
  customerName: string;
  avatar: string;
  channel: '天猫千牛' | '抖音直播' | '微信小程序' | '小红书私信' | '官网独立站';
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  dealStage: '咨询中' | '高意向' | '已付定金' | '已成单' | '售后关注';
  vipTier: '普通会员' | '88VIP' | '黑钻会员' | '企业大客户';
  cartValue: number;
  potentialIntent: string;
  messages: SupportMessage[];
}

// 指挥大屏指标
export interface WarRoomMetrics {
  targetGMV: number;
  currentGMV: number;
  presalePoolValue: number;
  todayOrdersCount: number;
  payingConversionRate: number;
  cartAdditionRate: number;
  roiEstimate: number;
}
