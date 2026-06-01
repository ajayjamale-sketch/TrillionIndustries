import { useState, useEffect } from 'react';
import { User, RegisterData, UserRole } from '@/types';

export const DEMO_USERS: Record<string, { user: User; password: string }> = {
  'admin@trillion.com': {
    password: 'admin123',
    user: {
      id: 'usr_001',
      name: 'Alex Johnson',
      email: 'admin@trillion.com',
      role: 'enterprise_admin',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&q=80',
      company: 'Trillion Industries Corp',
      department: 'Executive',
      phone: '+1 (555) 234-5678',
      location: 'Detroit, MI, USA',
      createdAt: '2024-01-15T10:00:00Z',
    },
  },
  'production@trillion.com': {
    password: 'prod123',
    user: {
      id: 'usr_002',
      name: 'Sarah Mitchell',
      email: 'production@trillion.com',
      role: 'production_manager',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&q=80',
      company: 'Trillion Industries Corp',
      department: 'Production',
      phone: '+1 (555) 345-6789',
      location: 'Detroit, MI, USA',
      createdAt: '2024-02-10T08:00:00Z',
    },
  },
  'procurement@trillion.com': {
    password: 'proc123',
    user: {
      id: 'usr_003',
      name: 'David Chen',
      email: 'procurement@trillion.com',
      role: 'procurement_manager',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&q=80',
      company: 'Trillion Industries Corp',
      department: 'Procurement',
      phone: '+1 (555) 456-7890',
      location: 'Chicago, IL, USA',
      createdAt: '2024-01-20T09:00:00Z',
    },
  },
  'warehouse@trillion.com': {
    password: 'ware123',
    user: {
      id: 'usr_004',
      name: 'Maria Rodriguez',
      email: 'warehouse@trillion.com',
      role: 'warehouse_manager',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&q=80',
      company: 'Trillion Industries Corp',
      department: 'Warehouse',
      phone: '+1 (555) 567-8901',
      location: 'Dallas, TX, USA',
      createdAt: '2024-03-05T07:30:00Z',
    },
  },
  'maintenance@trillion.com': {
    password: 'maint123',
    user: {
      id: 'usr_005',
      name: 'James Williams',
      email: 'maintenance@trillion.com',
      role: 'maintenance_engineer',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&q=80',
      company: 'Trillion Industries Corp',
      department: 'Maintenance',
      phone: '+1 (555) 678-9012',
      location: 'Detroit, MI, USA',
      createdAt: '2024-02-28T06:00:00Z',
    },
  },
  'workforce@trillion.com': {
    password: 'work123',
    user: {
      id: 'usr_009',
      name: 'Patricia Lee',
      email: 'workforce@trillion.com',
      role: 'workforce_manager',
      avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=80&q=80',
      company: 'Trillion Industries Corp',
      department: 'Human Resources',
      phone: '+1 (555) 321-4567',
      location: 'Detroit, MI, USA',
      createdAt: '2024-03-12T09:00:00Z',
    },
  },
  'quality@trillion.com': {
    password: 'qual123',
    user: {
      id: 'usr_010',
      name: 'Thomas Anderson',
      email: 'quality@trillion.com',
      role: 'quality_manager',
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=80&q=80',
      company: 'Trillion Industries Corp',
      department: 'Quality',
      phone: '+1 (555) 432-5678',
      location: 'Detroit, MI, USA',
      createdAt: '2024-02-01T08:00:00Z',
    },
  },
  'supplier@acme.com': {
    password: 'supp123',
    user: {
      id: 'usr_006',
      name: 'Linda Park',
      email: 'supplier@acme.com',
      role: 'supplier',
      avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=80&q=80',
      company: 'ACME Parts Co.',
      department: 'Sales',
      phone: '+1 (555) 789-0123',
      location: 'Cleveland, OH, USA',
      createdAt: '2024-04-01T10:00:00Z',
    },
  },
  'finance@trillion.com': {
    password: 'fin123',
    user: {
      id: 'usr_007',
      name: 'Robert Kumar',
      email: 'finance@trillion.com',
      role: 'finance_officer',
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=80&q=80',
      company: 'Trillion Industries Corp',
      department: 'Finance',
      phone: '+1 (555) 890-1234',
      location: 'New York, NY, USA',
      createdAt: '2024-01-10T11:00:00Z',
    },
  },
  'superadmin@trillion.com': {
    password: 'super123',
    user: {
      id: 'usr_008',
      name: 'Emma Thompson',
      email: 'superadmin@trillion.com',
      role: 'super_admin',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=80&q=80',
      company: 'TrillionIndustries Inc.',
      department: 'Platform Admin',
      phone: '+1 (555) 901-2345',
      location: 'San Francisco, CA, USA',
      createdAt: '2023-12-01T09:00:00Z',
    },
  },
};

export const ROLE_LABELS: Record<UserRole, string> = {
  super_admin: 'Super Admin',
  enterprise_admin: 'Enterprise Admin',
  production_manager: 'Production Manager',
  procurement_manager: 'Procurement Manager',
  warehouse_manager: 'Warehouse Manager',
  maintenance_engineer: 'Maintenance Engineer',
  workforce_manager: 'Workforce Manager',
  quality_manager: 'Quality Manager',
  supplier: 'Supplier / Vendor',
  finance_officer: 'Finance Officer',
};

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('trillion-user');
    if (stored) {
      try { setUser(JSON.parse(stored)); } catch { localStorage.removeItem('trillion-user'); }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 900));
    const key = email.toLowerCase().trim();
    const match = DEMO_USERS[key];
    if (match && match.password === password) {
      setUser(match.user);
      localStorage.setItem('trillion-user', JSON.stringify(match.user));
      setIsLoading(false);
      return;
    }
    if (password.length >= 6) {
      const fallback: User = {
        id: `usr_${Date.now()}`,
        name: email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        email,
        role: 'enterprise_admin',
        company: 'My Enterprise',
        department: 'Operations',
        createdAt: new Date().toISOString(),
      };
      setUser(fallback);
      localStorage.setItem('trillion-user', JSON.stringify(fallback));
      setIsLoading(false);
      return;
    }
    setIsLoading(false);
    throw new Error('Invalid credentials');
  };

  const register = async (data: RegisterData): Promise<void> => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1200));
    const userData: User = {
      id: `usr_${Date.now()}`,
      name: data.name,
      email: data.email,
      role: (data.role as UserRole) || 'enterprise_admin',
      company: data.company,
      createdAt: new Date().toISOString(),
    };
    setUser(userData);
    localStorage.setItem('trillion-user', JSON.stringify(userData));
    setIsLoading(false);
  };

  const logout = () => { setUser(null); localStorage.removeItem('trillion-user'); };

  const updateProfile = async (updates: Partial<User>): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    if (user) {
      const updated = { ...user, ...updates };
      setUser(updated);
      localStorage.setItem('trillion-user', JSON.stringify(updated));
    }
  };

  return { user, isAuthenticated: !!user, isLoading, login, register, logout, updateProfile };
}
