import { useState } from 'react';
import { Inbox, CheckCircle2, Truck } from 'lucide-react';
import { StatusBadge } from '@/components/features/StatusBadge';
import { toast } from 'sonner';
import { User } from '@/types';

interface Order {
  id: string;
  buyer: string;
  items: string[];
  value: string;
  ordered: string;
  delivery: string;
  status: 'Processing' | 'Ready to Ship' | 'Shipped' | 'Delivered';
}

const INITIAL_ORDERS: Order[] = [
  { id: 'ORD-7821', buyer: 'Trillion Industries Corp', items: ['Hydraulic Cylinder 50mm x200'], value: '$57,000', ordered: 'Jun 1', delivery: 'Jun 10', status: 'Processing' },
  { id: 'ORD-7822', buyer: 'Precision Parts Co.', items: ['Seal Kit 30mm x500'], value: '$9,000', ordered: 'Jun 1', delivery: 'Jun 8', status: 'Ready to Ship' },
  { id: 'ORD-7820', buyer: 'Atlas Industrial Corp', items: ['Bearing Housing Type A x100', 'Seal Kit x50'], value: '$5,100', ordered: 'May 29', delivery: 'Jun 5', status: 'Shipped' },
  { id: 'ORD-7818', buyer: 'Titan Manufacturing', items: ['Pump Shaft 60mm x25'], value: '$3,200', ordered: 'May 25', delivery: 'Jun 2', status: 'Delivered' },
];

// Helper: parse currency string to number (e.g., "$57,000" -> 57000)
const parseCurrency = (value: string): number => {
  return parseFloat(value.replace(/[^0-9.-]+/g, ''));
};

// Helper: format number as USD currency
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

export function SupplierOrdersPage({ user }: { user: User }) {
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Derived metrics
  const activeOrders = orders.filter(o => o.status !== 'Delivered').length;
  const totalOrdersMTD = orders.length;
  const revenueMTD = orders.reduce((sum, o) => sum + parseCurrency(o.value), 0);
  const pendingShipment = orders.filter(o => o.status === 'Ready to Ship').length;
  const deliveredOrders = orders.filter(o => o.status === 'Delivered').length;
  const onTimeDeliveryRate = totalOrdersMTD > 0 ? Math.round((deliveredOrders / totalOrdersMTD) * 100) : 100;

  // Filter for new/incoming orders (Processing or Ready to Ship)
  const incomingOrders = orders.filter(o => o.status === 'Processing' || o.status === 'Ready to Ship');

  // Action handlers
  const handleShipNow = (orderId: string) => {
    setOrders(prevOrders =>
      prevOrders.map(order =>
        order.id === orderId && order.status === 'Ready to Ship'
          ? { ...order, status: 'Shipped' }
          : order
      )
    );
    toast.success(`Order ${orderId} marked as Shipped`);
  };

  const handlePrepare = (orderId: string) => {
    setOrders(prevOrders =>
      prevOrders.map(order =>
        order.id === orderId && order.status === 'Processing'
          ? { ...order, status: 'Ready to Ship' }
          : order
      )
    );
    toast.info(`Order ${orderId} is now ready to ship`);
  };

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
  };

  return (
    <div className="p-6 space-y-5 max-w-[1200px]">
      <div>
        <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
          <Inbox className="h-5 w-5" />
          Incoming Sales Orders
        </h1>
        <p className="text-sm text-muted-foreground">{incomingOrders.length} active incoming orders</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Orders (MTD)', value: totalOrdersMTD.toString() },
          { label: 'Revenue (MTD)', value: formatCurrency(revenueMTD) },
          { label: 'Pending Shipment', value: pendingShipment.toString() },
          { label: 'On-Time Delivery', value: `${onTimeDeliveryRate}%` },
        ].map(m => (
          <div key={m.label} className="bg-card border border-border rounded-xl p-4">
            <p className="text-xs text-muted-foreground mb-2">{m.label}</p>
            <p className="text-2xl font-bold text-foreground">{m.value}</p>
          </div>
        ))}
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {incomingOrders.length > 0 ? (
          incomingOrders.map(order => (
            <div
              key={order.id}
              className="bg-card border border-border rounded-xl p-5 hover:border-primary/30 transition-all animate-fade-in"
            >
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-xs font-bold text-muted-foreground">{order.id}</span>
                  </div>
                  <p className="text-sm font-bold text-foreground">{order.buyer}</p>
                  <div className="flex flex-wrap gap-1.5 mt-1.5">
                    {order.items.map(item => (
                      <span
                        key={item}
                        className="text-[11px] px-2 py-0.5 rounded-lg bg-muted text-muted-foreground"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1.5">
                    Order: {order.ordered} · Delivery: {order.delivery} ·{' '}
                    <span className="font-semibold text-foreground">{order.value}</span>
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge
                    variant={
                      order.status === 'Delivered'
                        ? 'success'
                        : order.status === 'Shipped'
                        ? 'default'
                        : 'warning'
                    }
                    size="sm"
                  >
                    {order.status}
                  </StatusBadge>
                  {order.status === 'Ready to Ship' && (
                    <button
                      onClick={() => handleShipNow(order.id)}
                      className="px-3 py-1.5 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-colors shadow-brand"
                    >
                      Ship Now
                    </button>
                  )}
                  {order.status === 'Processing' && (
                    <button
                      onClick={() => handlePrepare(order.id)}
                      className="px-3 py-1.5 rounded-xl border border-border text-xs font-medium hover:bg-muted transition-colors"
                    >
                      Prepare
                    </button>
                  )}
                  <button
                    onClick={() => handleViewDetails(order)}
                    className="px-3 py-1.5 rounded-xl border border-border text-xs font-medium hover:bg-muted transition-colors"
                  >
                    View
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center p-12 text-center bg-card border border-border rounded-xl h-64">
            <Inbox className="h-10 w-10 text-muted-foreground/60 mb-2" />
            <p className="text-sm font-bold text-foreground">No new incoming orders</p>
            <p className="text-xs text-muted-foreground mt-0.5">All incoming orders have been processed.</p>
          </div>
        )}
      </div>

      {/* Detail Overlay Modal */}
      {selectedOrder && createPortal(
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card border border-border rounded-2xl w-full max-w-md p-6 relative shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <button onClick={() => setSelectedOrder(null)} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground">
              <X className="h-5 w-5" />
            </button>
            <h2 className="text-lg font-bold text-foreground mb-4">Supplier Sales Order Info</h2>
            
            <div className="space-y-4">
              <div className="p-3.5 bg-muted/40 rounded-xl border border-border space-y-2 text-xs">
                <div className="flex justify-between"><span>Order ID</span><span className="font-semibold text-foreground font-mono">{selectedOrder.id}</span></div>
                <div className="flex justify-between"><span>Buyer Entity</span><span className="font-semibold text-foreground">{selectedOrder.buyer}</span></div>
                <div className="flex justify-between"><span>Order Date</span><span className="font-semibold text-foreground">{selectedOrder.ordered}</span></div>
                <div className="flex justify-between"><span>Estimated Delivery</span><span className="font-semibold text-foreground">{selectedOrder.delivery}</span></div>
                <div className="flex justify-between"><span>Contract Value</span><span className="font-semibold text-foreground font-bold">{selectedOrder.value}</span></div>
              </div>

              <div>
                <h4 className="text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wider">Ordered Items</h4>
                <div className="space-y-1.5">
                  {selectedOrder.items.map(item => (
                    <div key={item} className="flex justify-between items-center text-xs p-2 bg-card border border-border rounded-lg">
                      <span className="font-semibold text-foreground">{item.split(' x')[0]}</span>
                      <span className="px-2 py-0.5 rounded bg-muted text-muted-foreground font-mono">Qty: {item.split(' x')[1] || '1'}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-between items-center pt-2 text-xs">
                <span className="text-muted-foreground font-medium">Fulfillment Status</span>
                <StatusBadge variant={selectedOrder.status === 'Delivered' ? 'success' : selectedOrder.status === 'Shipped' ? 'default' : 'warning'} size="sm">
                  {selectedOrder.status}
                </StatusBadge>
              </div>
            </div>

            <div className="flex gap-2 mt-5">
              {selectedOrder.status === 'Ready to Ship' && (
                <button 
                  onClick={() => { handleShipNow(selectedOrder.id); setSelectedOrder(null); }}
                  className="flex-1 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-all shadow-brand"
                >
                  Ship Cargo
                </button>
              )}
              {selectedOrder.status === 'Processing' && (
                <button 
                  onClick={() => { handlePrepare(selectedOrder.id); setSelectedOrder(null); }}
                  className="flex-1 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-all"
                >
                  Mark Ready
                </button>
              )}
              <button onClick={() => setSelectedOrder(null)} className="flex-1 py-2 rounded-xl border border-border text-xs font-semibold hover:bg-muted transition-colors">Close</button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}