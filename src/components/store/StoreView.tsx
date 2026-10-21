import React, { useState } from 'react';
import { StoreProduct, StoreOrder } from '../../types';
import { 
  Truck, 
  CheckCircle2, 
  Clock, 
  Package
} from 'lucide-react';

interface StoreViewProps {
  products: StoreProduct[];
  orders: StoreOrder[];
  onReplenishStock: (productId: string, amount: number) => void;
  onBatchShipOrders: () => void;
}

export const StoreView: React.FC<StoreViewProps> = ({
  products,
  orders,
  onReplenishStock,
  onBatchShipOrders,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'inventory' | 'orders'>('inventory');
  const [orderFilter, setOrderFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<StoreOrder | null>(orders[0] || null);

  const pendingShipCount = orders.filter((o) => o.status === 'paid_fulfillment').length;

  const filteredOrders = orders.filter((o) => {
    if (orderFilter === 'all') return true;
    if (orderFilter === 'pending_ship') return o.status === 'paid_fulfillment';
    if (orderFilter === 'presale') return o.status === 'paid_deposit' || o.status === 'awaiting_balance';
    if (orderFilter === 'shipped') return o.status === 'shipped';
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 font-semibold">
              Medusa Commerce 架构
            </span>
            <h1 className="text-lg font-bold text-slate-900 tracking-tight">
              双十一商品底盘、库存防超卖与订单履约中心
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            高并发预售定金锁定、实时库存安全水位熔断、多渠道订单归集与顺丰批量打单发货。
          </p>
        </div>

        {/* Sub-tab navigation */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 p-1 bg-slate-100 border border-slate-200 rounded-lg text-xs">
            <button
              onClick={() => setActiveSubTab('inventory')}
              className={`px-3 py-1.5 rounded-md font-semibold transition-all cursor-pointer ${
                activeSubTab === 'inventory'
                  ? 'bg-white text-blue-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              商品与库存防超卖 ({products.length})
            </button>
            <button
              onClick={() => setActiveSubTab('orders')}
              className={`px-3 py-1.5 rounded-md font-semibold transition-all cursor-pointer ${
                activeSubTab === 'orders'
                  ? 'bg-white text-blue-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              订单与物流履约 ({orders.length})
            </button>
          </div>
        </div>
      </div>

      {activeSubTab === 'inventory' ? (
        /* Inventory / Catalog Section */
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
              <div className="text-xs text-slate-500 mb-1">全店在售商品数 (SPU)</div>
              <div className="text-2xl font-bold font-mono text-slate-900">{products.length} 款</div>
              <div className="text-[11px] text-slate-400 mt-1">覆盖智能穿戴/美妆/影音/家居</div>
            </div>
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
              <div className="text-xs text-slate-500 mb-1">大促预售累计锁库</div>
              <div className="text-2xl font-bold font-mono text-blue-600">
                {products.reduce((acc, p) => acc + p.lockedInventory, 0).toLocaleString()} 件
              </div>
              <div className="text-[11px] text-slate-400 mt-1">定金买家专享配额，不可被抢购</div>
            </div>
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
              <div className="text-xs text-slate-500 mb-1">现货可用库存总量</div>
              <div className="text-2xl font-bold font-mono text-emerald-600">
                {products.reduce((acc, p) => acc + p.availableInventory, 0).toLocaleString()} 件
              </div>
              <div className="text-[11px] text-slate-400 mt-1">支持双十一爆发期秒杀直发</div>
            </div>
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
              <div className="text-xs text-slate-500 mb-1">安全水位预警款</div>
              <div className="text-2xl font-bold font-mono text-amber-600">
                {products.filter((p) => p.availableInventory <= p.safetyThreshold).length} 款
              </div>
              <div className="text-[11px] text-amber-600 mt-1">需加急调拨或下达紧急排产工单</div>
            </div>
          </div>

          {/* Product Items Table */}
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
            <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Medusa SPU/SKU 双十一价格与库存矩阵
              </h3>
              <span className="text-xs text-slate-500">分布式悲观锁并发防护 · 零超卖风险</span>
            </div>

            <div className="divide-y divide-slate-100">
              {products.map((product) => {
                const isLowStock = product.availableInventory <= product.safetyThreshold;
                return (
                  <div
                    key={product.id}
                    className="p-4 md:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50/70 transition-colors"
                  >
                    {/* Product Basic */}
                    <div className="flex items-center gap-3 min-w-[280px]">
                      <img
                        src={product.image}
                        alt={product.name}
                        referrerPolicy="no-referrer"
                        className="w-14 h-14 rounded-lg object-cover bg-slate-100 border border-slate-200 shrink-0"
                      />
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-xs">
                          <span className="font-mono text-slate-500">{product.spuCode}</span>
                          <span className="text-slate-300">·</span>
                          <span className="text-slate-500">{product.category}</span>
                        </div>
                        <h4 className="text-sm font-semibold text-slate-900 leading-snug line-clamp-1">
                          {product.name}
                        </h4>
                        <div className="text-xs text-slate-500">
                          已售出 <span className="font-mono text-slate-800 font-semibold">{product.salesVolume}</span> 件
                        </div>
                      </div>
                    </div>

                    {/* Pricing Matrix */}
                    <div className="text-xs space-y-1 min-w-[150px]">
                      <div className="text-slate-500">
                        常规标价: <span className="font-mono line-through">¥{product.salePrice}</span>
                      </div>
                      <div className="text-red-600 font-semibold">
                        预售定金: <span className="font-mono">¥{product.presaleDeposit}</span>
                      </div>
                      <div className="text-slate-800">
                        预售尾款: <span className="font-mono font-bold">¥{product.presaleBalance}</span>
                      </div>
                    </div>

                    {/* Inventory Breakdown */}
                    <div className="text-xs space-y-1 min-w-[200px]">
                      <div className="flex justify-between text-slate-500">
                        <span>总库存:</span>
                        <span className="font-mono">{product.totalInventory}</span>
                      </div>
                      <div className="flex justify-between text-blue-600">
                        <span>锁定预售:</span>
                        <span className="font-mono">{product.lockedInventory}</span>
                      </div>
                      <div className="flex justify-between font-bold">
                        <span className={isLowStock ? 'text-amber-600' : 'text-emerald-600'}>
                          实时可用:
                        </span>
                        <span className={`font-mono ${isLowStock ? 'text-amber-600' : 'text-emerald-600'}`}>
                          {product.availableInventory} 件 {isLowStock && '(告警)'}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => onReplenishStock(product.id, 500)}
                        className="px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold border border-blue-200 transition-all cursor-pointer"
                      >
                        紧急补仓 (+500)
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        /* Orders & Fulfillment Section */
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-1 p-1 bg-slate-100 border border-slate-200 rounded-lg text-xs">
              <button
                onClick={() => setOrderFilter('all')}
                className={`px-3 py-1.5 rounded-md font-medium transition-all cursor-pointer ${
                  orderFilter === 'all'
                    ? 'bg-white text-slate-900 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                全部订单 ({orders.length})
              </button>
              <button
                onClick={() => setOrderFilter('pending_ship')}
                className={`px-3 py-1.5 rounded-md font-medium transition-all cursor-pointer ${
                  orderFilter === 'pending_ship'
                    ? 'bg-blue-50 text-blue-700 border border-blue-200 font-semibold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                待发货 ({pendingShipCount})
              </button>
              <button
                onClick={() => setOrderFilter('presale')}
                className={`px-3 py-1.5 rounded-md font-medium transition-all cursor-pointer ${
                  orderFilter === 'presale'
                    ? 'bg-white text-slate-900 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                预售阶段 (定金已付)
              </button>
              <button
                onClick={() => setOrderFilter('shipped')}
                className={`px-3 py-1.5 rounded-md font-medium transition-all cursor-pointer ${
                  orderFilter === 'shipped'
                    ? 'bg-white text-slate-900 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                顺丰已发货
              </button>
            </div>

            {pendingShipCount > 0 && (
              <button
                onClick={onBatchShipOrders}
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition-all cursor-pointer"
              >
                <Truck className="w-3.5 h-3.5" />
                <span>批量一键打单发货 (已选 {pendingShipCount} 笔)</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Orders list (7 cols) */}
            <div className="lg:col-span-7 space-y-3">
              {filteredOrders.map((order) => {
                const isSelected = selectedOrder?.id === order.id;
                return (
                  <div
                    key={order.id}
                    onClick={() => setSelectedOrder(order)}
                    className={`cursor-pointer rounded-xl p-4 transition-all border ${
                      isSelected
                        ? 'bg-blue-50/40 border-blue-500 shadow-xs'
                        : 'bg-white border-slate-200 hover:bg-slate-50/80 hover:border-slate-300 shadow-xs'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-800">{order.platform}</span>
                        <span className="text-slate-300">·</span>
                        <span className="font-mono text-slate-500">{order.orderNumber}</span>
                      </div>
                      <span className="font-mono text-slate-400">{order.createdAt}</span>
                    </div>

                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="text-sm font-semibold text-slate-900">
                          {order.items[0]?.productName}
                          {order.items.length > 1 && ` 等共 ${order.items.length} 件`}
                        </div>
                        <div className="text-xs text-slate-500 mt-1">
                          买家: <span className="text-slate-800 font-medium">{order.customerName}</span> · 
                          类型: <span className="text-red-600 font-medium">{order.orderType}</span>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <div className="text-base font-bold font-mono text-slate-900">
                          ¥{order.finalPaid}
                        </div>
                        <div className="text-[11px] text-red-600 font-mono">
                          立省 ¥{order.discountAmount}
                        </div>
                      </div>
                    </div>

                    {/* Status ribbon */}
                    <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        {order.status === 'paid_fulfillment' && (
                          <span className="text-blue-600 font-medium flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>待配货出库</span>
                          </span>
                        )}
                        {order.status === 'paid_deposit' && (
                          <span className="text-amber-600 font-medium flex items-center gap-1">
                            <Package className="w-3 h-3" />
                            <span>预售定金已锁定 (待付尾款)</span>
                          </span>
                        )}
                        {order.status === 'shipped' && (
                          <span className="text-emerald-600 font-medium flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>顺丰已揽收 ({order.expressTracking})</span>
                          </span>
                        )}
                      </div>

                      <div className="text-slate-500 text-[11px] truncate max-w-[200px]">
                        {order.shippingAddress}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Order Detail Drawer (5 cols) */}
            <div className="lg:col-span-5">
              {selectedOrder ? (
                <div className="bg-white border border-slate-200 rounded-xl p-5 sticky top-20 space-y-4 shadow-xs">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                      订单明细与电子面单 (Medusa Fulfillment)
                    </h3>
                    <span className="text-xs text-blue-600 font-mono font-semibold">
                      {selectedOrder.platform}
                    </span>
                  </div>

                  {/* Order Number & Buyer */}
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-500">订单流水号:</span>
                      <span className="font-mono text-slate-800 font-medium">{selectedOrder.orderNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">收件客户:</span>
                      <span className="text-slate-900 font-medium">{selectedOrder.customerName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">收件地址:</span>
                      <span className="text-slate-700 text-right max-w-[220px]">
                        {selectedOrder.shippingAddress}
                      </span>
                    </div>
                  </div>

                  {/* Items */}
                  <div className="bg-slate-50 rounded-lg p-3 border border-slate-200 space-y-2 text-xs">
                    <div className="text-slate-600 font-medium">订购货品明细:</div>
                    {selectedOrder.items.map((it, idx) => (
                      <div key={idx} className="flex justify-between items-center text-slate-800">
                        <span className="truncate max-w-[200px]">{it.productName}</span>
                        <span className="font-mono text-slate-600">
                          x{it.quantity} (¥{it.unitPrice})
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Pricing Breakdown */}
                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between text-slate-500">
                      <span>商品原总价:</span>
                      <span className="font-mono text-slate-800">¥{selectedOrder.totalAmount}</span>
                    </div>
                    <div className="flex justify-between text-red-600">
                      <span>双十一优惠与满减:</span>
                      <span className="font-mono font-medium">-¥{selectedOrder.discountAmount}</span>
                    </div>
                    <div className="pt-2 border-t border-slate-100 flex justify-between items-baseline">
                      <span className="font-bold text-slate-900">买家实付金额:</span>
                      <span className="text-lg font-bold font-mono text-red-600">
                        ¥{selectedOrder.finalPaid}
                      </span>
                    </div>
                  </div>

                  {/* Logistics Status */}
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">物流时效保障:</span>
                      <span className="text-emerald-700 font-semibold">顺丰特快 · 次日达</span>
                    </div>
                    {selectedOrder.expressTracking ? (
                      <div className="font-mono text-slate-700">
                        运单号: <span className="text-red-600 font-bold">{selectedOrder.expressTracking}</span>
                        <div className="text-[11px] text-slate-500 mt-1">包裹已出库，干线运输调度中</div>
                      </div>
                    ) : (
                      <div className="text-slate-500 text-[11px]">
                        订单已进入配货仓队列，等待打单揽收。
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="bg-white border border-slate-200 rounded-xl p-8 text-center text-slate-400 text-xs">
                  请选择左侧订单查看履约面单。
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
