import { useState } from 'react';
import { createPortal } from 'react-dom';
import { Truck, X, Search, Globe, Clock, MapPin, CheckCircle2 } from 'lucide-react';
import { StatusBadge } from '@/components/features/StatusBadge';
import { toast } from 'sonner';
import { User } from '@/types';

interface Shipment {
  id: string;
  orderId: string;
  buyer: string;
  carrier: string;
  trackingRef: string;
  destination: string;
  status: 'In Transit' | 'Out for Delivery' | 'Delivered';
  eta: string;
  logs: string[];
}

const INITIAL_SHIPMENTS: Shipment[] = [
  {
    id: 'SHP-902',
    orderId: 'ORD-7820',
    buyer: 'Atlas Industrial Corp',
    carrier: 'FastFreight Logistics',
    trackingRef: 'FF-88329-US',
    destination: 'Chicago Distribution Center, IL',
    status: 'In Transit',
    eta: 'Jun 5, 2026',
    logs: [
      'Jun 2, 09:30 AM — Departed sorting facility (Cleveland Hub)',
      'Jun 1, 04:15 PM — Handed over to Carrier',
      'Jun 1, 11:00 AM — Order processed and packed'
    ]
  },
  {
    id: 'SHP-812',
    orderId: 'ORD-7818',
    buyer: 'Titan Manufacturing',
    carrier: 'DHL Cargo',
    trackingRef: 'DHL-98831-C',
    destination: 'Houston Assembly Yard, TX',
    status: 'Delivered',
    eta: 'Jun 2, 2026',
    logs: [
      'Jun 2, 02:40 PM — Delivered & signed by Guard Office',
      'Jun 2, 08:00 AM — Out for delivery',
      'Jun 1, 05:22 PM — Arrived at local hub (Houston South)'
    ]
  }
];

export function SupplierTrackingPage({ user }: { user: User }) {
  const [shipments] = useState<Shipment[]>(INITIAL_SHIPMENTS);
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);
  const [search, setSearch] = useState('');

  const filtered = shipments.filter(s => 
    s.id.toLowerCase().includes(search.toLowerCase()) ||
    s.orderId.toLowerCase().includes(search.toLowerCase()) ||
    s.buyer.toLowerCase().includes(search.toLowerCase()) ||
    s.trackingRef.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 space-y-5 max-w-[1400px]">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
            <Truck className="h-5 w-5 text-primary" />
            Delivery Logistics & Tracking
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">Track dispatched cargos, carrier references, and delivery updates.</p>
        </div>
      </div>

      {/* Stats and Search Row */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-card p-4 rounded-xl border border-border">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input 
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by ID, Order, Buyer or Ref..."
            className="w-full pl-9 pr-4 py-2 text-sm bg-muted border border-border rounded-xl focus:outline-none w-full"
          />
        </div>
        <div className="flex gap-4 shrink-0 text-xs font-semibold text-muted-foreground">
          <div>Active Transits: <span className="text-foreground">{shipments.filter(s => s.status !== 'Delivered').length}</span></div>
          <div>Delivered (MTD): <span className="text-foreground">{shipments.filter(s => s.status === 'Delivered').length}</span></div>
        </div>
      </div>

      {/* Shipments Grid */}
      <div className="grid md:grid-cols-2 gap-4">
        {filtered.map(ship => (
          <div key={ship.id} className="bg-card border border-border rounded-xl p-5 hover:border-primary/30 transition-all flex flex-col justify-between animate-fade-in">
            <div className="space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <span className="font-mono text-xs text-muted-foreground">{ship.id}</span>
                  <h3 className="font-bold text-foreground text-sm mt-0.5">{ship.buyer}</h3>
                </div>
                <StatusBadge variant={ship.status === 'Delivered' ? 'success' : 'default'} size="sm">
                  {ship.status}
                </StatusBadge>
              </div>

              <div className="text-xs space-y-1 text-muted-foreground">
                <p>Order ID: <span className="font-semibold text-foreground">{ship.orderId}</span></p>
                <p>Carrier: <span className="font-semibold text-foreground">{ship.carrier}</span></p>
                <p>Tracking Ref: <span className="font-mono font-semibold text-primary">{ship.trackingRef}</span></p>
                <p className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {ship.destination}</p>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-border flex justify-between items-center text-xs">
              <span className="text-muted-foreground">ETA: <span className="font-bold text-foreground">{ship.eta}</span></span>
              <button 
                onClick={() => setSelectedShipment(ship)}
                className="px-3 py-1.5 rounded-lg bg-muted text-foreground hover:bg-muted/75 font-semibold transition-colors"
              >
                Track History
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Tracking details modal */}
      {selectedShipment && createPortal(
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card border border-border rounded-2xl w-full max-w-md p-6 relative shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <button onClick={() => setSelectedShipment(null)} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground">
              <X className="h-5 w-5" />
            </button>
            <h2 className="text-lg font-bold text-foreground mb-4">Carrier Transit Log</h2>

            <div className="space-y-4">
              <div className="p-3.5 bg-muted/40 rounded-xl border border-border space-y-1.5 text-xs">
                <div className="flex justify-between"><span>Shipment Ref</span><span className="font-semibold text-foreground font-mono">{selectedShipment.id}</span></div>
                <div className="flex justify-between"><span>Carrier Host</span><span className="font-semibold text-foreground">{selectedShipment.carrier}</span></div>
                <div className="flex justify-between"><span>Tracking ID</span><span className="font-semibold text-foreground font-mono text-primary">{selectedShipment.trackingRef}</span></div>
              </div>

              <div>
                <h4 className="text-xs font-semibold text-muted-foreground mb-2.5 uppercase tracking-wider">Logistics Milestones</h4>
                <div className="space-y-3 relative pl-4 border-l border-border ml-2 text-xs">
                  {selectedShipment.logs.map((log, idx) => (
                    <div key={idx} className="relative">
                      <div className={`absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full border-2 bg-card ${
                        idx === 0 ? 'border-primary' : 'border-muted-foreground'
                      }`} />
                      <p className={`leading-relaxed ${idx === 0 ? 'font-semibold text-foreground' : 'text-muted-foreground'}`}>{log}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-2 mt-6">
              <button 
                onClick={() => { toast.success('Tracking reference copied.'); }}
                className="flex-1 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-all shadow-brand"
              >
                Copy Reference
              </button>
              <button onClick={() => setSelectedShipment(null)} className="flex-1 py-2 rounded-xl border border-border text-xs font-semibold hover:bg-muted transition-colors">Close</button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
