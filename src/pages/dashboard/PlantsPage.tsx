import { useState } from 'react';
import { Factory, Plus, MapPin, Users, Settings, Activity, Trash2, X } from 'lucide-react';
import { StatusBadge } from '@/components/features/StatusBadge';
import { toast } from 'sonner';
import { User } from '@/types';

interface Plant {
  id: string;
  name: string;
  location: string;
  lines: number;
  employees: number;
  output: string;
  status: string;
  utilization: number;
}

const INITIAL_PLANTS: Plant[] = [
  { id: 'PLT-001', name: 'Detroit Main Plant', location: 'Detroit, MI', lines: 8, employees: 640, output: '2,840 units/day', status: 'Operational', utilization: 92 },
  { id: 'PLT-002', name: 'Chicago Assembly', location: 'Chicago, IL', lines: 5, employees: 420, output: '1,680 units/day', status: 'Operational', utilization: 87 },
  { id: 'PLT-003', name: 'Houston Fabrication', location: 'Houston, TX', lines: 4, employees: 380, output: '1,240 units/day', status: 'Maintenance', utilization: 0 },
  { id: 'PLT-004', name: 'Cleveland Components', location: 'Cleveland, OH', lines: 3, employees: 290, output: '890 units/day', status: 'Operational', utilization: 78 },
];

export function PlantsPage({ user }: { user: User }) {
  const [plants, setPlants] = useState<Plant[]>(INITIAL_PLANTS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlant, setEditingPlant] = useState<Plant | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [lines, setLines] = useState(0);
  const [employees, setEmployees] = useState(0);
  const [output, setOutput] = useState('');
  const [status, setStatus] = useState('Operational');
  const [utilization, setUtilization] = useState(80);

  const openAddModal = () => {
    setEditingPlant(null);
    setName('');
    setLocation('');
    setLines(0);
    setEmployees(0);
    setOutput('');
    setStatus('Operational');
    setUtilization(80);
    setIsModalOpen(true);
  };

  const openEditModal = (plant: Plant) => {
    setEditingPlant(plant);
    setName(plant.name);
    setLocation(plant.location);
    setLines(plant.lines);
    setEmployees(plant.employees);
    setOutput(plant.output);
    setStatus(plant.status);
    setUtilization(plant.utilization);
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !location.trim() || !output.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (editingPlant) {
      setPlants(prev =>
        prev.map(p =>
          p.id === editingPlant.id
            ? { ...p, name, location, lines, employees, output, status, utilization: status === 'Operational' ? utilization : 0 }
            : p
        )
      );
      toast.success('Plant updated successfully');
    } else {
      const newPlant: Plant = {
        id: `PLT-00${plants.length + 1}`,
        name,
        location,
        lines,
        employees,
        output,
        status,
        utilization: status === 'Operational' ? utilization : 0,
      };
      setPlants(prev => [...prev, newPlant]);
      toast.success('Plant added successfully');
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this plant?')) {
      setPlants(prev => prev.filter(p => p.id !== id));
      toast.success('Plant deleted successfully');
    }
  };

  return (
    <div className="p-6 space-y-5 max-w-[1400px]">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground">Plant Management</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Manage multi-plant operations and configurations</p>
        </div>
        <button onClick={openAddModal} className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors shadow-brand">
          <Plus className="h-4 w-4" />
          Add Plant
        </button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {plants.map(plant => (
          <div key={plant.id} className="bg-card border border-border rounded-xl p-5 hover:border-primary/30 transition-all relative group">
            <div className="flex items-start justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Factory className="h-5 w-5 text-primary" />
              </div>
              <div className="flex items-center gap-2">
                <StatusBadge variant={plant.status === 'Operational' ? 'success' : 'warning'} size="sm">{plant.status}</StatusBadge>
                <button
                  onClick={(e) => { e.stopPropagation(); handleDelete(plant.id); }}
                  className="p-1.5 rounded-lg border border-border text-red-500 hover:bg-red-500/10 transition-colors opacity-0 group-hover:opacity-100"
                  title="Delete Plant"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            <h3 className="font-bold text-foreground text-sm mb-1">{plant.name}</h3>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mb-3">
              <MapPin className="h-3 w-3" />
              {plant.location}
            </p>

            <div className="space-y-1.5 text-xs text-muted-foreground">
              <div className="flex justify-between">
                <span>Production Lines</span>
                <span className="font-semibold text-foreground">{plant.lines}</span>
              </div>
              <div className="flex justify-between">
                <span>Employees</span>
                <span className="font-semibold text-foreground">{plant.employees}</span>
              </div>
              <div className="flex justify-between">
                <span>Daily Output</span>
                <span className="font-semibold text-foreground">{plant.output}</span>
              </div>
            </div>

            {plant.status === 'Operational' && (
              <div className="mt-3">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-muted-foreground">Utilization</span>
                  <span className="font-semibold text-foreground">{plant.utilization}%</span>
                </div>
                <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${plant.utilization}%` }} />
                </div>
              </div>
            )}

            <div className="flex gap-2 mt-4">
              <button onClick={() => openEditModal(plant)} className="flex-1 py-1.5 rounded-lg border border-border text-xs hover:bg-muted transition-colors font-medium">
                Edit Details
              </button>
              <button onClick={() => openEditModal(plant)} className="p-1.5 rounded-lg border border-border hover:bg-muted transition-colors">
                <Settings className="h-3.5 w-3.5 text-muted-foreground" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Dialog */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card border border-border rounded-2xl w-full max-w-md p-6 relative shadow-2xl">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground">
              <X className="h-5 w-5" />
            </button>
            <h2 className="text-lg font-bold text-foreground mb-4">{editingPlant ? 'Edit Plant' : 'Add Plant'}</h2>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">Plant Name *</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-muted border border-border text-sm focus:outline-none focus:border-primary"
                  placeholder="e.g. Detroit Main Plant"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">Location *</label>
                <input
                  type="text"
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-muted border border-border text-sm focus:outline-none focus:border-primary"
                  placeholder="e.g. Detroit, MI"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">Production Lines</label>
                  <input
                    type="number"
                    value={lines}
                    onChange={e => setLines(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-muted border border-border text-sm focus:outline-none focus:border-primary"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">Employees</label>
                  <input
                    type="number"
                    value={employees}
                    onChange={e => setEmployees(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-muted border border-border text-sm focus:outline-none focus:border-primary"
                    min="0"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">Daily Output *</label>
                  <input
                    type="text"
                    value={output}
                    onChange={e => setOutput(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-muted border border-border text-sm focus:outline-none focus:border-primary"
                    placeholder="e.g. 2,000 units/day"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">Status</label>
                  <select
                    value={status}
                    onChange={e => setStatus(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-muted border border-border text-sm focus:outline-none focus:border-primary"
                  >
                    <option value="Operational">Operational</option>
                    <option value="Maintenance">Maintenance</option>
                    <option value="Offline">Offline</option>
                  </select>
                </div>
              </div>
              {status === 'Operational' && (
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">Utilization (%)</label>
                  <input
                    type="number"
                    value={utilization}
                    onChange={e => setUtilization(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-muted border border-border text-sm focus:outline-none focus:border-primary"
                    min="0"
                    max="100"
                  />
                </div>
              )}
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-2 rounded-xl border border-border text-sm font-semibold hover:bg-muted transition-colors">
                  Cancel
                </button>
                <button type="submit" className="flex-1 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors">
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
