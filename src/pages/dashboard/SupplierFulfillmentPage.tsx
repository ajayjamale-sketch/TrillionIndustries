import { useState } from 'react';
import { createPortal } from 'react-dom';
import { ClipboardList, CheckCircle2, Truck, X, Package, ArrowRight, Loader2 } from 'lucide-react';
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
  status: 'Processing' | 'Ready to Ship';
}

const INITIAL_FULFILLMENTS: Order[] = [
  { id: 'ORD-7821', buyer: 'Trillion Industries Corp', items: ['Hydraulic Cylinder 50mm x200'], value: '$57,000', ordered: 'Jun 1', delivery: 'Jun 10', status: 'Processing' },
  { id: 'ORD-7822', buyer: 'Precision Parts Co.', items: ['Seal Kit 30mm x500'], value: '$9,000', ordered: 'Jun 1', delivery: 'Jun 8', status: 'Ready to Ship' }
];

export function SupplierFulfillmentPage({ user }: { user: User }) {
  const [orders, setOrders] = useState<Order[]>(INITIAL_FULFILLMENTS);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const handleShipNow = (orderId: string) => {
    setOrders(prev => prev.filter(o => o.id !== orderId));
    toast.success(`Order ${orderId} has been successfully dispatched for shipment.`);
  };

  const handlePrepare = (orderId: string) => {
    setOrders(prev => 
      prev.map(o => o.id === orderId ? { ...o, status: 'Ready to Ship' } : o)
    );
    toast.info(`Order ${orderId} has been prepared and marked as Ready to Ship.`);
  };

  return (
    <div className="p-6 space-y-5 max-w-[1200px]">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
          <ClipboardList className="h-5 w-5 text-primary" />
          Order Fulfillment
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">Manage order packaging, prep work, and carrier handover.</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Awaiting Preparation', value: orders.filter(o => o.status === 'Processing').length.toString() },
          { label: 'Ready for Shipment Handover', value: orders.filter(o => o.status === 'Ready to Ship').length.toString() },
          { label: 'Average Packing Speed', value: '45 mins' },
        ].map(m => (
          <div key={m.label} className="bg-card border border-border rounded-xl p-4">
            <p className="text-xs text-muted-foreground mb-2">{m.label}</p>
            <p className="text-2xl font-bold text-foreground">{m.value}</p>
          </div>
        ))}
      </div>

      {/* Orders checklist */}
      <div className="space-y-4">
        {orders.length > 0 ? (
          orders.map(order => (
            <div key={order.id} className="bg-card border border-border rounded-xl p-5 hover:border-primary/30 transition-all flex items-start justify-between flex-wrap gap-4 animate-fade-in">
              <div>
                <span className="font-mono text-xs font-bold text-muted-foreground">{order.id}</span>
                <p className="text-sm font-bold text-foreground mt-1">{order.buyer}</p>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {order.items.map(item => (
                    <span key={item} className="text-[11px] px-2 py-0.5 rounded-lg bg-muted text-muted-foreground">
                      {item}
                    </span>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Order Date: {order.ordered} · Targeted Handover: {order.delivery} · Value: <span className="font-semibold text-foreground">{order.value}</span>
                </p>
              </div>

              <div className="flex items-center gap-2">
                <StatusBadge variant={order.status === 'Ready to Ship' ? 'success' : 'warning'} size="sm">
                  {order.status}
                </StatusBadge>

                {order.status === 'Ready to Ship' && (
                  <button 
                    onClick={() => handleShipNow(order.id)}
                    className="px-3 py-1.5 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-colors shadow-brand"
                  >
                    Handover to Carrier
                  </button>
                )}

                {order.status === 'Processing' && (
                  <button 
                    onClick={() => handlePrepare(order.id)}
                    className="px-3 py-1.5 rounded-xl border border-border text-xs font-medium hover:bg-muted transition-colors"
                  >
                    Start Packing
                  </button>
                )}

                <button 
                  onClick={() => setSelectedOrder(order)}
                  className="px-3 py-1.5 rounded-xl border border-border text-xs font-medium hover:bg-muted transition-colors"
                >
                  Details
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center p-12 text-center bg-card border border-border rounded-xl h-64">
            <Package className="h-10 w-10 text-muted-foreground/60 mb-2" />
            <p className="text-sm font-bold text-foreground">No orders awaiting fulfillment</p>
            <p className="text-xs text-muted-foreground mt-0.5">All packages have been packed and shipped.</p>
          </div>
        )}
      </div>

      {/* Details modal */}
      {selectedOrder && createPortal(
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card border border-border rounded-2xl w-full max-w-md p-6 relative shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <button onClick={() => setSelectedOrder(null)} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground">
              <X className="h-5 w-5" />
            </button>
            <h2 className="text-lg font-bold text-foreground mb-4">Fulfillment Details</h2>

            <div className="space-y-4">
              <div className="p-3.5 bg-muted/40 rounded-xl border border-border space-y-2 text-xs">
                <div className="flex justify-between"><span>Order ID</span><span className="font-semibold text-foreground font-mono">{selectedOrder.id}</span></div>
                <div className="flex justify-between"><span>Client Buyer</span><span className="font-semibold text-foreground">{selectedOrder.buyer}</span></div>
                <div className="flex justify-between"><span>Current Step</span><span className="font-semibold text-foreground">{selectedOrder.status === 'Processing' ? 'In Packaging' : 'Awaiting Carrier Handover'}</span></div>
              </div>

              <div>
                <h4 className="text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wider">Package Contents</h4>
                <div className="space-y-1.5">
                  {selectedOrder.items.map(item => (
                    <div key={item} className="flex justify-between items-center text-xs p-2 bg-card border border-border rounded-lg">
                      <span className="font-semibold text-foreground">{item.split(' x')[0]}</span>
                      <span className="px-2 py-0.5 rounded bg-muted text-muted-foreground font-mono">x{item.split(' x')[1] || '1'}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-2 mt-5">
              {selectedOrder.status === 'Ready to Ship' && (
                <button 
                  onClick={() => { handleShipNow(selectedOrder.id); setSelectedOrder(null); }}
                  className="flex-1 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-all shadow-brand"
                >
                  Dispatch
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
