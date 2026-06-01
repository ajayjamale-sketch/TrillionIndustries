import { useState, useRef, useEffect } from 'react';
import { Send, Search, Circle, Users, Plus, Phone, Video } from 'lucide-react';
import { toast } from 'sonner';
import { User } from '@/types';
import { getInitials } from '@/lib/utils';

const CONTACTS = [
  { id: 1, name: 'Sarah Mitchell', role: 'Production Manager', online: true, lastMsg: 'Line A is running at 98%', time: '2m', unread: 2 },
  { id: 2, name: 'David Chen', role: 'Procurement Manager', online: true, lastMsg: 'RFQ-2202 responses are in', time: '15m', unread: 0 },
  { id: 3, name: 'Maria Rodriguez', role: 'Warehouse Manager', online: false, lastMsg: 'GRN completed for SteelPro', time: '1h', unread: 1 },
  { id: 4, name: 'James Williams', role: 'Maintenance Engineer', online: false, lastMsg: 'Machine A204 inspection done', time: '2h', unread: 0 },
  { id: 5, name: 'Robert Kumar', role: 'Finance Officer', online: true, lastMsg: 'Q2 budget report ready', time: '3h', unread: 0 },
];

const MESSAGES: Record<number, { from: string; text: string; time: string; mine: boolean }[]> = {
  1: [
    { from: 'Sarah Mitchell', text: 'Good morning! Line A production is running ahead of schedule.', time: '9:12 AM', mine: false },
    { from: 'me', text: 'Great to hear! What is the current OEE?', time: '9:14 AM', mine: true },
    { from: 'Sarah Mitchell', text: 'Currently at 94.2% — best this quarter!', time: '9:15 AM', mine: false },
    { from: 'Sarah Mitchell', text: 'Line A is running at 98%', time: '9:18 AM', mine: false },
  ],
  2: [
    { from: 'David Chen', text: 'Just received 5 vendor quotations for RFQ-2202.', time: '8:30 AM', mine: false },
    { from: 'me', text: 'Excellent! Please share the comparison matrix by EOD.', time: '8:32 AM', mine: true },
    { from: 'David Chen', text: 'RFQ-2202 responses are in — will send by 3 PM.', time: '8:35 AM', mine: false },
  ],
  3: [
    { from: 'Maria Rodriguez', text: 'GRN completed for SteelPro delivery — 500 units received and verified.', time: '7:45 AM', mine: false },
  ],
};

export function MessagesPage({ user }: { user: User }) {
  const [activeContact, setActiveContact] = useState(CONTACTS[0]);
  const [messages, setMessages] = useState(MESSAGES);
  const [inputText, setInputText] = useState('');
  const [search, setSearch] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [activeContact, messages]);

  const sendMessage = () => {
    if (!inputText.trim()) return;
    const newMsg = { from: user.name, text: inputText, time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }), mine: true };
    setMessages(p => ({ ...p, [activeContact.id]: [...(p[activeContact.id] || []), newMsg] }));
    setInputText('');
    setTimeout(() => {
      const reply = { from: activeContact.name, text: 'Got it, I will look into that right away!', time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }), mine: false };
      setMessages(p => ({ ...p, [activeContact.id]: [...(p[activeContact.id] || []), reply] }));
    }, 1500);
  };

  const filteredContacts = CONTACTS.filter(c => c.name.toLowerCase().includes(search.toLowerCase()) || c.role.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="h-[calc(100vh-60px)] flex">
      {/* Sidebar */}
      <div className="w-72 border-r border-border flex flex-col bg-card shrink-0">
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-foreground">Messages</h2>
            <button onClick={() => toast.info('New conversation started')} className="p-1.5 rounded-lg hover:bg-muted transition-colors"><Plus className="h-4 w-4 text-muted-foreground" /></button>
          </div>
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search conversations..."
              className="w-full pl-8 pr-3 py-2 rounded-lg bg-muted border border-border text-xs focus:outline-none focus:ring-1 focus:ring-primary/30" />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {filteredContacts.map(contact => (
            <button key={contact.id} onClick={() => setActiveContact(contact)}
              className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-muted/50 transition-colors text-left ${activeContact.id === contact.id ? 'bg-primary/10 border-r-2 border-primary' : ''}`}>
              <div className="relative shrink-0">
                <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                  {getInitials(contact.name)}
                </div>
                {contact.online && <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-background" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline">
                  <p className="text-xs font-semibold text-foreground truncate">{contact.name}</p>
                  <span className="text-[10px] text-muted-foreground shrink-0 ml-1">{contact.time}</span>
                </div>
                <p className="text-[11px] text-muted-foreground truncate">{contact.lastMsg}</p>
              </div>
              {contact.unread > 0 && <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center shrink-0">{contact.unread}</span>}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <div className="h-[60px] border-b border-border flex items-center justify-between px-5 bg-card shrink-0">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">{getInitials(activeContact.name)}</div>
              {activeContact.online && <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-background" />}
            </div>
            <div>
              <p className="text-sm font-bold text-foreground">{activeContact.name}</p>
              <p className="text-xs text-muted-foreground">{activeContact.role} · {activeContact.online ? 'Online' : 'Offline'}</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <button onClick={() => toast.info('Starting voice call')} className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground"><Phone className="h-4 w-4" /></button>
            <button onClick={() => toast.info('Starting video call')} className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground"><Video className="h-4 w-4" /></button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-muted/20">
          {(messages[activeContact.id] || []).map((msg, i) => (
            <div key={i} className={`flex ${msg.mine ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[70%] rounded-2xl px-4 py-2.5 ${msg.mine ? 'bg-primary text-primary-foreground rounded-br-none' : 'bg-card border border-border rounded-bl-none'}`}>
                <p className="text-sm leading-relaxed">{msg.text}</p>
                <p className={`text-[10px] mt-1 ${msg.mine ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>{msg.time}</p>
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-border bg-card shrink-0">
          <div className="flex items-center gap-3 bg-muted rounded-xl px-4 py-3 border border-border focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary/30 transition-all">
            <input value={inputText} onChange={e => setInputText(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), sendMessage())}
              placeholder="Type a message..." className="flex-1 bg-transparent text-sm focus:outline-none text-foreground placeholder:text-muted-foreground" />
            <button onClick={sendMessage} disabled={!inputText.trim()}
              className="p-2 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
