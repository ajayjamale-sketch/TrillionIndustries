import { useState } from 'react';
import { LifeBuoy, Plus, Search, Clock, CheckCircle2, AlertTriangle, MessageSquare, Loader2, X, Send } from 'lucide-react';
import { StatusBadge } from '@/components/features/StatusBadge';
import { toast } from 'sonner';
import { User } from '@/types';

interface Message {
  sender: 'user' | 'agent' | 'system';
  text: string;
  time: string;
}

interface Ticket {
  id: string;
  title: string;
  priority: string;
  category: string;
  created: string;
  status: string;
  agent: string;
  description: string;
  messages: Message[];
}

const INITIAL_TICKETS: Ticket[] = [
  {
    id: 'TKT-1101',
    title: 'Unable to generate production report — Excel format error',
    priority: 'High',
    category: 'Reports',
    created: 'Jun 1',
    status: 'In Progress',
    agent: 'Support Team',
    description: 'When attempting to export the weekly production report in Excel format, the download fails with a 500 error code. PDF exports work fine.',
    messages: [
      { sender: 'system', text: 'Ticket created and assigned to Support Team.', time: 'Jun 1, 09:00 AM' },
      { sender: 'agent', text: 'We are looking into the Excel generator library. It seems to fail on large datasets. Will update soon.', time: 'Jun 1, 10:15 AM' }
    ]
  },
  {
    id: 'TKT-1102',
    title: 'Inventory sync not reflecting real-time changes',
    priority: 'Critical',
    category: 'Inventory',
    created: 'May 31',
    status: 'Pending',
    agent: 'Unassigned',
    description: 'Updates made on the warehouse scanner do not reflect in the inventory dashboard until a manual refresh is executed.',
    messages: [
      { sender: 'system', text: 'Ticket created. Awaiting assignment.', time: 'May 31, 04:30 PM' }
    ]
  },
  {
    id: 'TKT-1103',
    title: 'Request to add new user role: Quality Inspector',
    priority: 'Medium',
    category: 'Access Control',
    created: 'May 29',
    status: 'Resolved',
    agent: 'Admin Team',
    description: 'Need a new role created in RBAC with read access to IIoT and write access to Quality Inspections logs.',
    messages: [
      { sender: 'system', text: 'Ticket created and assigned to Admin Team.', time: 'May 29, 11:00 AM' },
      { sender: 'agent', text: 'Role "Quality Inspector" has been created and configured in the Access Control panel.', time: 'May 29, 02:45 PM' },
      { sender: 'system', text: 'Ticket marked as Resolved.', time: 'May 29, 02:45 PM' }
    ]
  },
  {
    id: 'TKT-1104',
    title: 'Dashboard chart not loading on mobile device',
    priority: 'Low',
    category: 'UI/UX',
    created: 'May 28',
    status: 'Resolved',
    agent: 'Dev Team',
    description: 'The main Enterprise Analytics performance chart overflows and fails to load on Safari mobile.',
    messages: [
      { sender: 'system', text: 'Ticket created and assigned to Dev Team.', time: 'May 28, 08:30 AM' },
      { sender: 'agent', text: 'Responsive container fixed. Tested on Safari iOS.', time: 'May 28, 04:00 PM' },
      { sender: 'system', text: 'Ticket marked as Resolved.', time: 'May 28, 04:00 PM' }
    ]
  },
];

export function SupportPage({ user }: { user: User }) {
  const [tickets, setTickets] = useState<Ticket[]>(INITIAL_TICKETS);
  const [showNew, setShowNew] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ title: '', category: 'General', priority: 'Medium', description: '' });
  
  // Selected ticket for modal viewing
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [replyText, setReplyText] = useState('');

  const submit = async () => {
    if (!form.title || !form.description) { toast.error('Please fill in all required fields'); return; }
    setSubmitting(true);
    await new Promise(r => setTimeout(r, 1000));
    setSubmitting(false);
    setShowNew(false);
    
    const newId = `TKT-${1101 + tickets.length}`;
    const newTicket: Ticket = {
      id: newId,
      title: form.title,
      priority: form.priority,
      category: form.category,
      created: 'Jun 1',
      status: 'Pending',
      agent: 'Unassigned',
      description: form.description,
      messages: [
        { sender: 'system', text: 'Ticket created. Awaiting assignment.', time: 'Just now' }
      ]
    };
    
    setTickets([newTicket, ...tickets]);
    toast.success(`Support ticket ${newId} created — you will receive an email confirmation`);
    setForm({ title: '', category: 'General', priority: 'Medium', description: '' });
  };

  const handleSendReply = () => {
    if (!replyText.trim() || !selectedTicket) return;
    
    const updatedTickets = tickets.map(t => {
      if (t.id === selectedTicket.id) {
        const updatedMessages = [
          ...t.messages,
          { sender: 'user' as const, text: replyText, time: 'Just now' }
        ];
        
        // Auto-assign or transition status if pending
        let nextStatus = t.status;
        if (t.status === 'Pending') {
          nextStatus = 'In Progress';
        }
        
        const updatedT = {
          ...t,
          status: nextStatus,
          messages: updatedMessages
        };
        
        // Also update currently selected ticket view
        setSelectedTicket(updatedT);
        return updatedT;
      }
      return t;
    });

    setTickets(updatedTickets);
    setReplyText('');
    toast.success('Reply submitted successfully');

    // Simulate Agent Reply after a brief delay
    setTimeout(() => {
      setTickets(prevTickets => {
        return prevTickets.map(t => {
          if (t.id === selectedTicket.id) {
            const updatedT = {
              ...t,
              status: 'In Progress',
              agent: t.agent === 'Unassigned' ? 'Support Team' : t.agent,
              messages: [
                ...t.messages,
                { sender: 'agent' as const, text: "Thanks for the update. Our team is investigating and will get back to you shortly.", time: 'Just now' }
              ]
            };
            if (selectedTicket && selectedTicket.id === t.id) {
              setSelectedTicket(updatedT);
            }
            return updatedT;
          }
          return t;
        });
      });
    }, 1500);
  };

  return (
    <div className="p-6 space-y-5 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground flex items-center gap-2"><LifeBuoy className="h-5 w-5" />Support Tickets</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Submit and track your support requests</p>
        </div>
        <button onClick={() => setShowNew(v => !v)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors shadow-brand">
          <Plus className="h-4 w-4" />New Ticket
        </button>
      </div>

      {showNew && (
        <div className="bg-card border border-primary/20 rounded-2xl p-5 space-y-4 shadow-lg">
          <h3 className="font-bold text-foreground">Create Support Ticket</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-foreground mb-1.5">Title *</label>
              <input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} placeholder="Brief description of the issue"
                className="w-full px-3 py-2.5 rounded-xl border border-border bg-muted text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
            </div>
            <div>
              <label className="block text-xs font-medium text-foreground mb-1.5">Category</label>
              <select value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))}
                className="w-full px-3 py-2.5 rounded-xl border border-border bg-muted text-sm focus:outline-none">
                {['General', 'Production', 'Inventory', 'Procurement', 'Reports', 'Access Control', 'UI/UX'].map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-foreground mb-1.5">Priority</label>
              <select value={form.priority} onChange={e => setForm(p => ({ ...p, priority: e.target.value }))}
                className="w-full px-3 py-2.5 rounded-xl border border-border bg-muted text-sm focus:outline-none">
                {['Low', 'Medium', 'High', 'Critical'].map(p => <option key={p}>{p}</option>)}
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-foreground mb-1.5">Description *</label>
              <textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} rows={4}
                placeholder="Detailed description of the issue, steps to reproduce, expected vs actual behavior..."
                className="w-full px-3 py-2.5 rounded-xl border border-border bg-muted text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none" />
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={submit} disabled={submitting}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 disabled:opacity-60 transition-colors">
              {submitting ? <><Loader2 className="h-4 w-4 animate-spin" />Submitting...</> : 'Submit Ticket'}
            </button>
            <button onClick={() => setShowNew(false)} className="px-4 py-2 rounded-xl border border-border text-sm hover:bg-muted transition-colors">Cancel</button>
          </div>
        </div>
      )}

      <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
        <div className="px-5 py-4 border-b border-border">
          <h3 className="font-semibold text-foreground text-sm">Your Tickets</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-xs text-muted-foreground">
              <tr>
                <th className="text-left px-5 py-3 font-medium">Ticket</th>
                <th className="text-left px-5 py-3 font-medium">Title</th>
                <th className="text-left px-5 py-3 font-medium">Priority</th>
                <th className="text-left px-5 py-3 font-medium">Category</th>
                <th className="text-left px-5 py-3 font-medium">Created</th>
                <th className="text-left px-5 py-3 font-medium">Status</th>
                <th className="text-left px-5 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {tickets.map(t => (
                <tr key={t.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-5 py-3.5 font-mono text-xs text-muted-foreground">{t.id}</td>
                  <td className="px-5 py-3.5 text-xs font-medium text-foreground max-w-xs truncate">{t.title}</td>
                  <td className="px-5 py-3.5">
                    <span className={`text-xs font-semibold ${t.priority === 'Critical' ? 'text-red-500' : t.priority === 'High' ? 'text-amber-500' : t.priority === 'Medium' ? 'text-blue-500' : 'text-muted-foreground'}`}>{t.priority}</span>
                  </td>
                  <td className="px-5 py-3.5 text-xs text-muted-foreground">{t.category}</td>
                  <td className="px-5 py-3.5 text-xs text-muted-foreground">{t.created}</td>
                  <td className="px-5 py-3.5">
                    <StatusBadge variant={t.status === 'Resolved' ? 'success' : t.status === 'In Progress' ? 'default' : 'warning'} size="sm">{t.status}</StatusBadge>
                  </td>
                  <td className="px-5 py-3.5">
                    <button onClick={() => setSelectedTicket(t)} className="text-xs text-primary font-semibold hover:underline">View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Ticket Details Modal */}
      {selectedTicket && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border w-full max-w-2xl rounded-2xl shadow-2xl flex flex-col max-h-[85vh] overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="font-mono text-sm text-muted-foreground bg-muted px-2.5 py-1 rounded-lg border border-border">{selectedTicket.id}</span>
                <StatusBadge variant={selectedTicket.status === 'Resolved' ? 'success' : selectedTicket.status === 'In Progress' ? 'default' : 'warning'} size="sm">
                  {selectedTicket.status}
                </StatusBadge>
              </div>
              <button onClick={() => setSelectedTicket(null)} className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1">
              <div>
                <h2 className="text-lg font-bold text-foreground">{selectedTicket.title}</h2>
                <div className="flex flex-wrap gap-x-6 gap-y-2 mt-2 text-xs text-muted-foreground">
                  <div>Priority: <span className={`font-semibold ${selectedTicket.priority === 'Critical' ? 'text-red-500' : selectedTicket.priority === 'High' ? 'text-amber-500' : selectedTicket.priority === 'Medium' ? 'text-blue-500' : 'text-muted-foreground'}`}>{selectedTicket.priority}</span></div>
                  <div>Category: <span className="font-medium text-foreground">{selectedTicket.category}</span></div>
                  <div>Assigned Agent: <span className="font-medium text-foreground">{selectedTicket.agent}</span></div>
                  <div>Created: <span className="font-medium text-foreground">{selectedTicket.created}</span></div>
                </div>
              </div>

              <div className="bg-muted/40 border border-border rounded-xl p-4">
                <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-2">Description</h4>
                <p className="text-sm text-foreground/95 leading-relaxed whitespace-pre-wrap">{selectedTicket.description}</p>
              </div>

              <div className="space-y-4">
                <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider flex items-center gap-1.5">
                  <MessageSquare className="h-4 w-4 text-primary" /> Activity History
                </h4>
                <div className="space-y-3">
                  {selectedTicket.messages && selectedTicket.messages.map((msg, index) => (
                    <div key={index} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                      <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm ${
                        msg.sender === 'user'
                          ? 'bg-primary text-primary-foreground rounded-tr-none'
                          : msg.sender === 'agent'
                          ? 'bg-card border border-border text-foreground rounded-tl-none'
                          : 'bg-muted/60 text-muted-foreground text-xs border border-border/50 text-center w-full max-w-none rounded-xl'
                      }`}>
                        {msg.text}
                      </div>
                      <span className="text-[10px] text-muted-foreground mt-1 px-1">{msg.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer / Reply form */}
            {selectedTicket.status !== 'Resolved' && (
              <div className="px-6 py-4 border-t border-border bg-muted/20">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={replyText}
                    onChange={e => setReplyText(e.target.value)}
                    placeholder="Type your reply..."
                    className="flex-1 px-4 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                    onKeyDown={e => {
                      if (e.key === 'Enter') handleSendReply();
                    }}
                  />
                  <button
                    onClick={handleSendReply}
                    className="p-2.5 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-colors flex items-center justify-center shadow-brand"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

