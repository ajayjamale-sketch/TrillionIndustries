import { useState } from 'react';
import { createPortal } from 'react-dom';
import { 
  Store, Search, Star, Clock, FileText, CheckCircle2, 
  ArrowRight, X, ShoppingCart, Truck, ShieldCheck, Filter, 
  Tag, ChevronRight, Info, Plus, Minus
} from 'lucide-react';
import { User } from '@/types';
import { StatusBadge } from '@/components/features/StatusBadge';
import { toast } from 'sonner';

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  unit: string;
  moq: number;
  leadTime: string;
  rating: number;
  reviews: number;
  supplier: string;
  verified: boolean;
  stock: number;
  desc: string;
  specs: Record<string, string>;
}

const PRODUCTS: Product[] = [
  {
    id: 'PRD-781',
    name: 'Precision Carbide End Mill Set (10-Piece)',
    category: 'Tools & Hardware',
    price: 185.00,
    unit: 'set',
    moq: 5,
    leadTime: '3-5 days',
    rating: 4.8,
    reviews: 34,
    supplier: 'Apex Precision Tools Inc.',
    verified: true,
    stock: 240,
    desc: 'High-speed, premium-grade tungsten carbide end mills optimized for hardened steel, titanium, and aluminum machining on standard CNC routers.',
    specs: {
      'Material': 'Tungsten Carbide',
      'Coating': 'AlTiN (Aluminum Titanium Nitride)',
      'Flutes': '4-Flute design',
      'Shank Diameter': '1/2 inch',
      'Hardness Rating': 'Up to 55 HRC'
    }
  },
  {
    id: 'PRD-204',
    name: 'Grade 5 Titanium Plate (100mm x 100mm x 5mm)',
    category: 'Raw Materials',
    price: 42.50,
    unit: 'pcs',
    moq: 20,
    leadTime: '7-10 days',
    rating: 4.9,
    reviews: 58,
    supplier: 'Titan Industrial Alloys Corp',
    verified: true,
    stock: 850,
    desc: 'Ti-6Al-4V Grade 5 titanium blocks. Offers excellent strength-to-weight ratio, exceptional corrosion resistance, and superb mechanical characteristics.',
    specs: {
      'Grade': 'Grade 5 (Ti-6Al-4V)',
      'Tensile Strength': '950 MPa',
      'Density': '4.43 g/cm³',
      'Standards': 'ASTM B265',
      'Finish': 'Mill Finish, Decarburized'
    }
  },
  {
    id: 'PRD-109',
    name: 'Industrial Copper Wire Spool (AWG 12, 100m)',
    category: 'Electrical Components',
    price: 110.00,
    unit: 'spool',
    moq: 10,
    leadTime: '5-7 days',
    rating: 4.6,
    reviews: 21,
    supplier: 'ElectraFlex Wires Ltd.',
    verified: false,
    stock: 140,
    desc: 'High-purity annealed bare copper conductor wire, ideal for heavy-duty electrical distributions, conduit installations, and plant automation setups.',
    specs: {
      'Wire Gauge': '12 AWG',
      'Conductor Material': '99.9% Pure Annealed Copper',
      'Insulation': 'PVC (600V Max Rating)',
      'Length': '100 meters per spool',
      'Standard Compliance': 'UL83, UL1581'
    }
  },
  {
    id: 'PRD-542',
    name: 'Heavy Duty Hydraulic Control Valve (3-Spool)',
    category: 'Hydraulics & Pneumatics',
    price: 340.00,
    unit: 'unit',
    moq: 2,
    leadTime: '8-12 days',
    rating: 4.7,
    reviews: 19,
    supplier: 'HydroFlow Systems Co.',
    verified: true,
    stock: 75,
    desc: 'Directional control valve designed for hydraulic cylinders, loaders, and loaders auxiliary circuits. Features adjustable relief valve.',
    specs: {
      'Flow Rate': '21 GPM (80 L/min)',
      'Max Pressure': '3600 PSI (250 Bar)',
      'Port Size': 'SAE 8 O-Ring ports',
      'Center Type': 'Spring Center, Open Center',
      'Material': 'Cast Iron Body'
    }
  },
  {
    id: 'PRD-448',
    name: 'Precision Deep Groove Ball Bearings (6204-2RS, Pack of 50)',
    category: 'Mechanical Components',
    price: 75.00,
    unit: 'pack',
    moq: 4,
    leadTime: '3-4 days',
    rating: 4.8,
    reviews: 42,
    supplier: 'Apex Precision Tools Inc.',
    verified: true,
    stock: 310,
    desc: 'Double rubber sealed deep groove ball bearings pre-lubricated with high-grade synthetic grease, engineered for high rotative speeds and low friction.',
    specs: {
      'Model': '6204-2RS',
      'Inner Diameter': '20 mm',
      'Outer Diameter': '47 mm',
      'Width': '14 mm',
      'Limiting Speed': '12,000 RPM'
    }
  },
  {
    id: 'PRD-913',
    name: 'Industrial Air Compressor Filter Regulator Lubricator',
    category: 'Hydraulics & Pneumatics',
    price: 89.00,
    unit: 'unit',
    moq: 3,
    leadTime: '5-7 days',
    rating: 4.5,
    reviews: 15,
    supplier: 'HydroFlow Systems Co.',
    verified: true,
    stock: 90,
    desc: 'Modular FRL unit combination for air compressor lines. Clean moisture and lubricate pneumatic machines efficiently to extend component lifespans.',
    specs: {
      'Port Size': '1/2" NPT',
      'Filtration Accuracy': '5 microns',
      'Max Pressure Capacity': '145 PSI',
      'Operating Temp': '5°C to 60°C',
      'Bowl Material': 'Polycarbonate with Metal Guard'
    }
  }
];

const CATEGORIES = ['All Products', 'Raw Materials', 'Electrical Components', 'Hydraulics & Pneumatics', 'Mechanical Components', 'Tools & Hardware'];

export function MarketplacePage({ user }: { user: User }) {
  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const [category, setCategory] = useState('All Products');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('popular');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // RFQ Simulation State
  const [rfqProduct, setRfqProduct] = useState<Product | null>(null);
  const [rfqForm, setRfqForm] = useState({
    qty: 0,
    targetPrice: '',
    deliveryDate: '',
    notes: ''
  });

  // Direct Checkout State
  const [buyProduct, setBuyProduct] = useState<Product | null>(null);
  const [buyQty, setBuyQty] = useState(0);

  // Filtering Logic
  const filtered = products
    .filter(p => {
      const matchCat = category === 'All Products' || p.category === category;
      const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.supplier.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.id.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    })
    .sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      return b.reviews - a.reviews; // 'popular'
    });

  // RFQ Submission
  const handleSendRFQ = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rfqProduct) return;
    if (rfqForm.qty < rfqProduct.moq) {
      toast.error(`Minimum Order Quantity (MOQ) for this item is ${rfqProduct.moq} ${rfqProduct.unit}`);
      return;
    }
    toast.success(`RFQ sent to ${rfqProduct.supplier} for ${rfqForm.qty} ${rfqProduct.unit}s!`);
    setRfqProduct(null);
  };

  // Direct Purchase Transaction
  const handlePurchase = (e: React.FormEvent) => {
    e.preventDefault();
    if (!buyProduct) return;
    if (buyQty < buyProduct.moq) {
      toast.error(`Minimum Order Quantity (MOQ) is ${buyProduct.moq} ${buyProduct.unit}`);
      return;
    }
    const totalPrice = buyProduct.price * buyQty;
    toast.success(`Purchase successful! Ordered ${buyQty} ${buyProduct.unit}s of ${buyProduct.name} for $${totalPrice.toLocaleString()}.`);
    
    // Deduct stock simulation
    setProducts(prev => 
      prev.map(p => p.id === buyProduct.id ? { ...p, stock: Math.max(0, p.stock - buyQty) } : p)
    );
    setBuyProduct(null);
  };

  const handleOpenRFQ = (prod: Product) => {
    setRfqProduct(prod);
    setRfqForm({
      qty: prod.moq,
      targetPrice: prod.price.toString(),
      deliveryDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      notes: ''
    });
  };

  const handleOpenBuy = (prod: Product) => {
    setBuyProduct(prod);
    setBuyQty(prod.moq);
  };

  return (
    <div className="p-6 space-y-6 max-w-[1400px]">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
            <Store className="h-5 w-5 text-amber-500" />
            B2B Marketplace
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">Discover raw materials, tooling, and components from vetted industrial suppliers.</p>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-semibold">
          <ShieldCheck className="h-4 w-4" /> 100% Vetted Suppliers
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-card p-4 rounded-xl border border-border">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input 
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search items, specs, or suppliers..."
            className="w-full pl-9 pr-4 py-2 text-sm bg-muted border border-border rounded-xl focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        {/* Sort */}
        <div className="flex items-center gap-2 w-full md:w-auto shrink-0 justify-end">
          <span className="text-xs font-medium text-muted-foreground flex items-center gap-1">
            <Filter className="h-3.5 w-3.5" /> Sort By:
          </span>
          <select 
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            className="px-3 py-1.5 text-xs bg-muted border border-border rounded-lg text-foreground focus:outline-none"
          >
            <option value="popular">Popularity</option>
            <option value="rating">Top Rated</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Category Navigation */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
        {CATEGORIES.map(c => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={`px-4 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors border ${
              category === c 
                ? 'bg-primary text-primary-foreground border-primary shadow-brand' 
                : 'bg-card border-border hover:bg-muted text-muted-foreground hover:text-foreground'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Product Catalog Grid */}
      {filtered.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map(prod => (
            <div key={prod.id} className="bg-card border border-border rounded-xl p-4 flex flex-col justify-between hover:border-amber-500/40 hover:shadow-md transition-all group">
              <div>
                {/* Meta Row */}
                <div className="flex justify-between items-start mb-2.5">
                  <span className="text-[10px] font-mono font-semibold text-muted-foreground">{prod.id}</span>
                  {prod.verified ? (
                    <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[10px] font-semibold">
                      <ShieldCheck className="h-3 w-3" /> Vetted
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground text-[10px] font-semibold">
                      Supplier Partner
                    </span>
                  )}
                </div>

                {/* Name */}
                <h3 className="text-sm font-bold text-foreground leading-snug group-hover:text-amber-500 transition-colors line-clamp-2 min-h-[40px]">
                  {prod.name}
                </h3>
                
                {/* Description */}
                <p className="text-xs text-muted-foreground leading-relaxed mt-1.5 line-clamp-2 min-h-[32px]">
                  {prod.desc}
                </p>

                {/* Specs Summary */}
                <div className="mt-3 py-2 px-2.5 bg-muted/40 rounded-lg text-[11px] text-muted-foreground space-y-1">
                  <div className="flex justify-between">
                    <span>Category</span>
                    <span className="font-semibold text-foreground truncate max-w-[120px]">{prod.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>MOQ</span>
                    <span className="font-semibold text-foreground">{prod.moq} {prod.unit}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Supplier</span>
                    <span className="font-semibold text-foreground truncate max-w-[120px]">{prod.supplier}</span>
                  </div>
                </div>
              </div>

              {/* Price and Action Buttons */}
              <div className="mt-4 pt-3 border-t border-border">
                <div className="flex justify-between items-baseline mb-3">
                  <span className="text-[10px] text-muted-foreground">Unit Price</span>
                  <div className="text-right">
                    <span className="text-base font-extrabold text-foreground">${prod.price.toFixed(2)}</span>
                    <span className="text-xs text-muted-foreground font-medium"> / {prod.unit}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedProduct(prod)}
                    className="py-1.5 text-xs font-semibold rounded-lg bg-muted text-foreground hover:bg-muted/70 transition-colors flex items-center justify-center gap-1"
                  >
                    <Info className="h-3.5 w-3.5" /> Specs
                  </button>
                  <button
                    type="button"
                    onClick={() => handleOpenBuy(prod)}
                    className="py-1.5 text-xs font-semibold rounded-lg bg-amber-500 hover:bg-amber-600 text-white transition-colors flex items-center justify-center gap-1 shadow-sm"
                  >
                    <ShoppingCart className="h-3.5 w-3.5" /> Buy
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => handleOpenRFQ(prod)}
                  className="w-full mt-2 py-1.5 text-xs font-semibold text-primary border border-primary/20 rounded-lg hover:bg-primary/5 transition-colors flex items-center justify-center gap-1"
                >
                  <FileText className="h-3.5 w-3.5" /> Request Custom Quote (RFQ)
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-12 text-center bg-card border border-border rounded-xl h-80">
          <Store className="h-10 w-10 text-muted-foreground mb-3" />
          <h3 className="text-sm font-bold text-foreground">No matching products found</h3>
          <p className="text-xs text-muted-foreground mt-1 max-w-sm">Try relaxing your search terms or selecting a different category filter.</p>
        </div>
      )}

      {/* PRODUCT SPECS DETAILS MODAL (Portal) */}
      {selectedProduct && createPortal(
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card border border-border rounded-2xl w-full max-w-lg p-6 relative shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <button onClick={() => setSelectedProduct(null)} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground">
              <X className="h-5 w-5" />
            </button>
            <h2 className="text-lg font-bold text-foreground mb-2">Technical Specifications</h2>
            <p className="text-xs text-muted-foreground mb-4">{selectedProduct.id} · {selectedProduct.category}</p>

            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-foreground">{selectedProduct.name}</h3>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{selectedProduct.desc}</p>
              </div>

              {/* Specs Table */}
              <div className="border border-border rounded-xl overflow-hidden text-xs">
                <div className="bg-muted/40 px-4 py-2 border-b border-border font-bold text-foreground">Specs Sheet</div>
                <div className="divide-y divide-border px-4 py-2">
                  {Object.entries(selectedProduct.specs).map(([key, value]) => (
                    <div key={key} className="flex py-2">
                      <span className="w-1/3 text-muted-foreground font-medium">{key}</span>
                      <span className="w-2/3 text-foreground font-semibold">{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Delivery / Vendor Stats */}
              <div className="grid grid-cols-2 gap-3.5 py-3 border-t border-b border-border">
                <div className="space-y-0.5">
                  <span className="text-[10px] text-muted-foreground uppercase font-semibold">Lead Time</span>
                  <div className="text-xs font-bold text-foreground flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5 text-amber-500" /> {selectedProduct.leadTime}
                  </div>
                </div>
                <div className="space-y-0.5">
                  <span className="text-[10px] text-muted-foreground uppercase font-semibold">Supplier Status</span>
                  <span className="text-xs font-bold text-foreground block truncate">{selectedProduct.supplier}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-5">
              <button 
                type="button" 
                onClick={() => { setSelectedProduct(null); handleOpenRFQ(selectedProduct); }}
                className="flex-1 py-2 text-xs font-semibold rounded-xl border border-primary/20 text-primary hover:bg-primary/5 transition-colors"
              >
                Send RFQ
              </button>
              <button 
                type="button" 
                onClick={() => { setSelectedProduct(null); handleOpenBuy(selectedProduct); }}
                className="flex-1 py-2 text-xs font-semibold rounded-xl bg-amber-500 hover:bg-amber-600 text-white transition-colors"
              >
                Direct Purchase
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* REQUEST FOR QUOTE (RFQ) MODAL (Portal) */}
      {rfqProduct && createPortal(
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card border border-border rounded-2xl w-full max-w-md p-6 relative shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <button onClick={() => setRfqProduct(null)} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground">
              <X className="h-5 w-5" />
            </button>
            <h2 className="text-lg font-bold text-foreground mb-1">Request Custom Quote (RFQ)</h2>
            <p className="text-xs text-muted-foreground mb-4">Send to: <span className="font-semibold text-foreground">{rfqProduct.supplier}</span></p>

            <form onSubmit={handleSendRFQ} className="space-y-4">
              <div className="p-3 bg-muted/40 rounded-xl border border-border text-xs">
                <p className="font-bold text-foreground">{rfqProduct.name}</p>
                <p className="text-muted-foreground mt-0.5">Supplier List Price: ${rfqProduct.price.toFixed(2)} / {rfqProduct.unit} (MOQ: {rfqProduct.moq})</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">Target Quantity *</label>
                  <input
                    type="number"
                    min={rfqProduct.moq}
                    required
                    value={rfqForm.qty}
                    onChange={e => setRfqForm(p => ({ ...p, qty: Math.max(0, parseInt(e.target.value) || 0) }))}
                    className="w-full px-3 py-2 text-sm bg-muted border border-border rounded-xl focus:outline-none focus:border-primary"
                  />
                  <span className="text-[10px] text-muted-foreground mt-1 block">Min. {rfqProduct.moq} {rfqProduct.unit}s required</span>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">Target Unit Price ($) *</label>
                  <input
                    type="text"
                    required
                    value={rfqForm.targetPrice}
                    onChange={e => setRfqForm(p => ({ ...p, targetPrice: e.target.value }))}
                    placeholder={`e.g. ${rfqProduct.price}`}
                    className="w-full px-3 py-2 text-sm bg-muted border border-border rounded-xl focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">Required Delivery Date *</label>
                <input
                  type="date"
                  required
                  value={rfqForm.deliveryDate}
                  onChange={e => setRfqForm(p => ({ ...p, deliveryDate: e.target.value }))}
                  className="w-full px-3 py-2 text-sm bg-muted border border-border rounded-xl focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">Custom Notes / Specs Requests</label>
                <textarea
                  rows={3}
                  value={rfqForm.notes}
                  onChange={e => setRfqForm(p => ({ ...p, notes: e.target.value }))}
                  placeholder="E.g., custom sizes, packaging requests, or material compliance requirements..."
                  className="w-full px-3 py-2 text-xs bg-muted border border-border rounded-xl focus:outline-none focus:border-primary resize-none"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setRfqProduct(null)} className="flex-1 py-2 text-xs font-semibold rounded-xl border border-border hover:bg-muted transition-colors">
                  Cancel
                </button>
                <button type="submit" className="flex-1 py-2 text-xs font-semibold rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-brand">
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* DIRECT CHECKOUT MODAL (Portal) */}
      {buyProduct && createPortal(
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card border border-border rounded-2xl w-full max-w-md p-6 relative shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <button onClick={() => setBuyProduct(null)} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground">
              <X className="h-5 w-5" />
            </button>
            <h2 className="text-lg font-bold text-foreground mb-2 flex items-center gap-1.5">
              <ShoppingCart className="h-5 w-5 text-amber-500" /> Direct Purchase
            </h2>
            <p className="text-xs text-muted-foreground mb-4">Supplier: <span className="font-semibold text-foreground">{buyProduct.supplier}</span></p>

            <form onSubmit={handlePurchase} className="space-y-4">
              <div className="p-3.5 bg-muted/40 rounded-xl border border-border space-y-1.5 text-xs">
                <p className="font-bold text-foreground">{buyProduct.name}</p>
                <div className="flex justify-between text-muted-foreground">
                  <span>Unit Price</span>
                  <span className="font-semibold text-foreground">${buyProduct.price.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>In Stock</span>
                  <span className="font-semibold text-foreground">{buyProduct.stock} {buyProduct.unit}s</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>MOQ Requirement</span>
                  <span className="font-semibold text-foreground">{buyProduct.moq} {buyProduct.unit}s</span>
                </div>
              </div>

              {/* Quantity adjustment */}
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1.5">Quantity to Buy</label>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setBuyQty(q => Math.max(buyProduct.moq, q - 1))}
                    disabled={buyQty <= buyProduct.moq}
                    className="p-2 bg-muted border border-border hover:bg-muted/70 disabled:opacity-50 rounded-xl transition-colors shrink-0"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <input
                    type="number"
                    min={buyProduct.moq}
                    max={buyProduct.stock}
                    required
                    value={buyQty}
                    onChange={e => setBuyQty(Math.max(buyProduct.moq, Math.min(buyProduct.stock, parseInt(e.target.value) || buyProduct.moq)))}
                    className="w-full text-center py-2 text-sm bg-muted border border-border rounded-xl focus:outline-none focus:border-primary font-semibold"
                  />
                  <button
                    type="button"
                    onClick={() => setBuyQty(q => Math.min(buyProduct.stock, q + 1))}
                    disabled={buyQty >= buyProduct.stock}
                    className="p-2 bg-muted border border-border hover:bg-muted/70 disabled:opacity-50 rounded-xl transition-colors shrink-0"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Costs Calculation */}
              <div className="pt-3 border-t border-border space-y-2 text-xs">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span>${(buyProduct.price * buyQty).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Shipping & Delivery (Est.)</span>
                  <span className="text-emerald-500 font-semibold">Free Cargo</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-foreground pt-1 border-t border-dashed border-border">
                  <span>Total Cost</span>
                  <span>${(buyProduct.price * buyQty).toFixed(2)}</span>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setBuyProduct(null)} className="flex-1 py-2 text-xs font-semibold rounded-xl border border-border hover:bg-muted transition-colors">
                  Cancel
                </button>
                <button type="submit" className="flex-1 py-2 text-xs font-semibold rounded-xl bg-amber-500 hover:bg-amber-600 text-white transition-colors shadow-sm">
                  Complete Order
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
