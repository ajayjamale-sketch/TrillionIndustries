import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Package, Plus, Edit, Trash2, Search, Eye, X } from 'lucide-react';
import { StatusBadge } from '@/components/features/StatusBadge';
import { toast } from 'sonner';
import { User } from '@/types';

interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  price: string;
  stock: number;
  moq: number;
  status: 'Active' | 'Out of Stock' | 'Discontinued';
}

const INITIAL_PRODUCTS: Product[] = [
  { id: 'PRD-001', name: 'Hydraulic Cylinder 50mm', sku: 'HYD-CYL-50', category: 'Hydraulics', price: '$285', stock: 148, moq: 10, status: 'Active' },
  { id: 'PRD-002', name: 'Bearing Housing Type A', sku: 'BRG-HSG-A', category: 'Bearings', price: '$42', stock: 520, moq: 50, status: 'Active' },
  { id: 'PRD-003', name: 'Seal Kit 30mm Standard', sku: 'SEL-KIT-30', category: 'Seals', price: '$18', stock: 1200, moq: 100, status: 'Active' },
  { id: 'PRD-004', name: 'Pump Shaft 60mm', sku: 'PMP-SFT-60', category: 'Shafts', price: '$128', stock: 0, moq: 5, status: 'Out of Stock' },
];

// Helper: generate next product ID
const generateProductId = (existingProducts: Product[]): string => {
  const ids = existingProducts.map(p => parseInt(p.id.replace('PRD-', ''), 10));
  const maxId = ids.length ? Math.max(...ids) : 0;
  return `PRD-${(maxId + 1).toString().padStart(3, '0')}`;
};

// Helper: generate SKU from name and category
const generateSku = (name: string, category: string): string => {
  const namePart = name.substring(0, 3).toUpperCase().replace(/[^A-Z]/g, '');
  const catPart = category.substring(0, 3).toUpperCase().replace(/[^A-Z]/g, '');
  const random = Math.floor(Math.random() * 900 + 100);
  return `${namePart || 'PRD'}-${catPart || 'GEN'}-${random}`;
};

export function ProductListingsPage({ user, path }: { user: User; path?: string }) {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [search, setSearch] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  useEffect(() => {
    if (path === '/dashboard/supplier/add-product') {
      setShowAddForm(true);
    }
  }, [path]);

  // New product form state
  const [newProduct, setNewProduct] = useState({
    name: '',
    category: '',
    price: '',
    stock: '',
    moq: '',
  });

  // Edit form state
  const [editForm, setEditForm] = useState({
    name: '',
    category: '',
    price: '',
    stock: '',
    moq: '',
  });

  // Reset new product form
  const resetNewForm = () => {
    setNewProduct({ name: '', category: '', price: '', stock: '', moq: '' });
    setShowAddForm(false);
  };

  // Add product
  const handleAddProduct = () => {
    if (!newProduct.name || !newProduct.category || !newProduct.price || !newProduct.stock || !newProduct.moq) {
      toast.error('Please fill all fields');
      return;
    }
    const stockNum = parseInt(newProduct.stock, 10);
    const moqNum = parseInt(newProduct.moq, 10);
    if (isNaN(stockNum) || isNaN(moqNum)) {
      toast.error('Stock and MOQ must be numbers');
      return;
    }
    const priceValue = newProduct.price.startsWith('$') ? newProduct.price : `$${newProduct.price}`;
    const sku = generateSku(newProduct.name, newProduct.category);
    const newId = generateProductId(products);
    const product: Product = {
      id: newId,
      name: newProduct.name,
      sku: sku,
      category: newProduct.category,
      price: priceValue,
      stock: stockNum,
      moq: moqNum,
      status: stockNum > 0 ? 'Active' : 'Out of Stock',
    };
    setProducts(prev => [...prev, product]);
    toast.success(`Product "${newProduct.name}" added with SKU ${sku}`);
    resetNewForm();
  };

  // Open edit modal
  const handleEditClick = (product: Product) => {
    setEditingProduct(product);
    setEditForm({
      name: product.name,
      category: product.category,
      price: product.price.replace('$', ''),
      stock: product.stock.toString(),
      moq: product.moq.toString(),
    });
  };

  // Save edit
  const handleSaveEdit = () => {
    if (!editingProduct) return;
    if (!editForm.name || !editForm.category || !editForm.price || !editForm.stock || !editForm.moq) {
      toast.error('Please fill all fields');
      return;
    }
    const stockNum = parseInt(editForm.stock, 10);
    const moqNum = parseInt(editForm.moq, 10);
    if (isNaN(stockNum) || isNaN(moqNum)) {
      toast.error('Stock and MOQ must be numbers');
      return;
    }
    const priceValue = editForm.price.startsWith('$') ? editForm.price : `$${editForm.price}`;
    const updatedProduct: Product = {
      ...editingProduct,
      name: editForm.name,
      category: editForm.category,
      price: priceValue,
      stock: stockNum,
      moq: moqNum,
      status: stockNum > 0 ? 'Active' : 'Out of Stock',
    };
    setProducts(prev => prev.map(p => p.id === editingProduct.id ? updatedProduct : p));
    toast.success(`Product "${updatedProduct.name}" updated`);
    setEditingProduct(null);
  };

  // Delete product
  const handleDeleteProduct = (product: Product) => {
    if (confirm(`Are you sure you want to delete "${product.name}"?`)) {
      setProducts(prev => prev.filter(p => p.id !== product.id));
      toast.warning(`Product "${product.name}" removed from listing`);
    }
  };

  // Filter products based on search
  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.sku.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 space-y-5 max-w-[1200px]">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-foreground">Product Listings</h1>
          <p className="text-sm text-muted-foreground">{products.length} products listed on marketplace</p>
        </div>
        <button onClick={() => setShowAddForm(v => !v)} className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors shadow-brand">
          <Plus className="h-4 w-4" />Add Product
        </button>
      </div>

      {/* Add Product Form */}
      {showAddForm && (
        <div className="bg-card border border-primary/20 rounded-2xl p-5 space-y-4">
          <h3 className="font-bold text-foreground">New Product Listing</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium block mb-1.5">Product Name</label>
              <input
                value={newProduct.name}
                onChange={e => setNewProduct({ ...newProduct, name: e.target.value })}
                placeholder="e.g. Hydraulic Cylinder 50mm"
                className="w-full px-3 py-2.5 rounded-xl border border-border bg-muted text-sm focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-medium block mb-1.5">Category</label>
              <input
                value={newProduct.category}
                onChange={e => setNewProduct({ ...newProduct, category: e.target.value })}
                placeholder="e.g. Hydraulics, Bearings"
                className="w-full px-3 py-2.5 rounded-xl border border-border bg-muted text-sm focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-medium block mb-1.5">Unit Price</label>
              <input
                value={newProduct.price}
                onChange={e => setNewProduct({ ...newProduct, price: e.target.value })}
                placeholder="$0.00"
                className="w-full px-3 py-2.5 rounded-xl border border-border bg-muted text-sm focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-medium block mb-1.5">Current Stock</label>
              <input
                type="number"
                value={newProduct.stock}
                onChange={e => setNewProduct({ ...newProduct, stock: e.target.value })}
                placeholder="0"
                className="w-full px-3 py-2.5 rounded-xl border border-border bg-muted text-sm focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-medium block mb-1.5">Min Order Qty (MOQ)</label>
              <input
                type="number"
                value={newProduct.moq}
                onChange={e => setNewProduct({ ...newProduct, moq: e.target.value })}
                placeholder="1"
                className="w-full px-3 py-2.5 rounded-xl border border-border bg-muted text-sm focus:outline-none"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={handleAddProduct} className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors">
              List Product
            </button>
            <button onClick={resetNewForm} className="px-4 py-2 rounded-xl border border-border text-sm hover:bg-muted transition-colors">
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {/* Edit Product Modal */}
      {editingProduct && createPortal(
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card border border-border rounded-2xl p-6 max-w-md w-full space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-foreground">Edit Product</h3>
              <button onClick={() => setEditingProduct(null)} className="p-1 rounded hover:bg-muted">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium block mb-1">Product Name</label>
                <input
                  value={editForm.name}
                  onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-border bg-muted text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-medium block mb-1">Category</label>
                <input
                  value={editForm.category}
                  onChange={e => setEditForm({ ...editForm, category: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-border bg-muted text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-medium block mb-1">Unit Price ($)</label>
                <input
                  value={editForm.price}
                  onChange={e => setEditForm({ ...editForm, price: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-border bg-muted text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-medium block mb-1">Stock</label>
                <input
                  type="number"
                  value={editForm.stock}
                  onChange={e => setEditForm({ ...editForm, stock: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-border bg-muted text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-medium block mb-1">Min Order Qty (MOQ)</label>
                <input
                  type="number"
                  value={editForm.moq}
                  onChange={e => setEditForm({ ...editForm, moq: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-border bg-muted text-sm"
                />
              </div>
            </div>
            <div className="flex gap-2 pt-2">
              <button onClick={handleSaveEdit} className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90">
                Save Changes
              </button>
              <button onClick={() => setEditingProduct(null)} className="px-4 py-2 rounded-xl border border-border text-sm hover:bg-muted">
                Cancel
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Search */}
      <div className="relative max-w-xs">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search products..."
          className="pl-8 pr-3 py-2 rounded-xl bg-card border border-border text-sm focus:outline-none w-full"
        />
      </div>

      {/* Products Table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-xs text-muted-foreground">
              <tr>
                {['ID', 'Product', 'SKU', 'Category', 'Price', 'Stock', 'MOQ', 'Status', 'Actions'].map(h => (
                  <th key={h} className="text-left px-5 py-3 font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredProducts.map(p => (
                <tr key={p.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-5 py-3.5 font-mono text-xs text-muted-foreground">{p.id}</td>
                  <td className="px-5 py-3.5 text-xs font-semibold text-foreground">{p.name}</td>
                  <td className="px-5 py-3.5 font-mono text-xs text-muted-foreground">{p.sku}</td>
                  <td className="px-5 py-3.5 text-xs text-muted-foreground">{p.category}</td>
                  <td className="px-5 py-3.5 text-xs font-bold text-foreground">{p.price}</td>
                  <td className="px-5 py-3.5 text-xs font-semibold text-foreground">{p.stock}</td>
                  <td className="px-5 py-3.5 text-xs text-muted-foreground">{p.moq}</td>
                  <td className="px-5 py-3.5">
                    <StatusBadge variant={p.status === 'Active' ? 'success' : 'error'} size="sm">{p.status}</StatusBadge>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex gap-2">
                      <button onClick={() => handleEditClick(p)} className="p-1 rounded hover:bg-muted transition-colors" title="Edit">
                        <Edit className="h-3.5 w-3.5 text-muted-foreground" />
                      </button>
                      <button onClick={() => handleDeleteProduct(p)} className="p-1 rounded hover:bg-muted transition-colors" title="Delete">
                        <Trash2 className="h-3.5 w-3.5 text-red-400" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredProducts.length === 0 && (
                <tr>
                  <td colSpan={9} className="text-center py-8 text-muted-foreground text-sm">
                    No products found. Click "Add Product" to create one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}