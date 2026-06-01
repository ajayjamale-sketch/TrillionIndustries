import { useState, useRef, useEffect } from 'react';
import { Bot, Send, Sparkles, RefreshCw, Copy, ThumbsUp, ThumbsDown, Zap, TrendingUp, AlertTriangle, BarChart3 } from 'lucide-react';
import { toast } from 'sonner';
import { User } from '@/types';

interface Message {
  id: number;
  role: 'user' | 'assistant';
  content: string;
  time: string;
}

const QUICK_PROMPTS = [
  { icon: TrendingUp, text: 'Analyze production efficiency this week', category: 'Production' },
  { icon: AlertTriangle, text: 'Show critical maintenance alerts', category: 'Maintenance' },
  { icon: BarChart3, text: 'Forecast demand for next quarter', category: 'Analytics' },
  { icon: Zap, text: 'Optimize procurement spend', category: 'Procurement' },
  { icon: Bot, text: 'Identify operational bottlenecks', category: 'Operations' },
  { icon: Sparkles, text: 'Generate weekly executive summary', category: 'Reports' },
];

const AI_RESPONSES: Record<string, string> = {
  default: "I've analyzed your enterprise data. Here's my assessment:\n\n**Key Findings:**\n• Production efficiency is trending up 4.2% week-over-week on Line A and B\n• 3 maintenance items require attention within 7 days to prevent unplanned downtime\n• Procurement spend is 8% above monthly target — primarily driven by emergency POs\n\n**Recommendations:**\n1. Advance PO-7826 by 2 weeks to avoid stockout risk on Steel Rods\n2. Schedule preventive maintenance for CNC-12 bearing replacement\n3. Renegotiate contract with FastenTech Corp — current pricing is 12% above market rate\n\nWould you like me to dive deeper into any of these areas?",
  production: "**Production Analysis — Current Week:**\n\n📊 Overall OEE: **87.3%** (+1.8% vs last week)\n\n**Line Performance:**\n- Line A: 94% OEE | 342 units/day ✅\n- Line B: 88% OEE | 178 units/day ✅\n- Line C: IDLE (awaiting work order)\n- Line D: Under maintenance\n\n**Efficiency Opportunities:**\n• Reassigning 2 operators from Line D to Line C could unlock 250 additional units/day\n• Setup time on Line B can be reduced by 15 min using SMED methodology\n• Scrap rate of 1.2% on Line A is improvable — root cause: tooling wear\n\n**Predictive Insight:** Demand forecast suggests 18% higher orders in Q3. Current capacity may be insufficient by Week 8.",
  maintenance: "**Critical Maintenance Alerts:**\n\n🔴 **CRITICAL (Action Required)**\n• Machine CNC-12: Bearing vibration at 8.4mm/s (threshold: 7.1mm/s). Failure probability: 78% within 14 days\n\n🟡 **WARNING (Schedule Soon)**  \n• Hydraulic Press Line B: Last PM was 94 days ago (schedule: every 90 days)\n• Compressor Unit C3: Oil pressure trending down 0.3 bar/week\n\n🟢 **MONITORED**\n• Conveyor Belt Line A: Normal wear patterns, next PM due in 28 days\n\n**Recommendation:** Schedule CNC-12 bearing replacement during next planned downtime window (Sunday 6AM-10AM) to avoid emergency breakdown cost of ~$18,000.",
  procurement: "**Procurement Spend Optimization:**\n\n💰 **Monthly Spend: $530K** (+8.2% vs target)\n\n**Overspend Analysis:**\n• Emergency POs: $48K (9% of spend) — avoidable with better demand forecasting\n• FastenTech Corp pricing: 12% above market benchmark\n• 3 single-source suppliers with no backup — high supply chain risk\n\n**Cost Savings Opportunities:**\n1. Consolidate 6 small POs with Global Bearings → save ~$12K in freight\n2. Switch to blanket PO with SteelPro Ltd. → est. 7% volume discount ($84K/year)\n3. Qualify backup supplier for hydraulic seals — reduces emergency buy risk\n\n**Predicted Savings: $126K annually** with these 3 changes.",
};

function getAIResponse(userMsg: string): string {
  const lower = userMsg.toLowerCase();
  if (lower.includes('production') || lower.includes('efficiency') || lower.includes('oee')) return AI_RESPONSES.production;
  if (lower.includes('maintenance') || lower.includes('breakdown') || lower.includes('alert')) return AI_RESPONSES.maintenance;
  if (lower.includes('procurement') || lower.includes('spend') || lower.includes('vendor')) return AI_RESPONSES.procurement;
  return AI_RESPONSES.default;
}

export function AIAssistantPage({ user }: { user: User }) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1, role: 'assistant',
      content: `Hello ${user.name.split(' ')[0]}! 👋 I'm your **AI Copilot** for TrillionIndustries.\n\nI have access to your real-time production data, inventory levels, maintenance logs, procurement history, and financial metrics. I can help you:\n\n• Analyze operational performance and spot inefficiencies\n• Generate predictive insights and demand forecasts\n• Identify cost reduction opportunities\n• Surface critical alerts requiring immediate action\n• Create executive summaries and reports\n\nWhat would you like to explore today?`,
      time: 'Now'
    }
  ]);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, isThinking]);

  const sendMessage = async (text?: string) => {
    const msgText = text || input;
    if (!msgText.trim() || isThinking) return;
    const userMsg: Message = { id: Date.now(), role: 'user', content: msgText, time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) };
    setMessages(p => [...p, userMsg]);
    setInput('');
    setIsThinking(true);
    await new Promise(r => setTimeout(r, 1400));
    const aiMsg: Message = { id: Date.now() + 1, role: 'assistant', content: getAIResponse(msgText), time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) };
    setMessages(p => [...p, aiMsg]);
    setIsThinking(false);
  };

  const formatContent = (content: string) => {
    return content.split('\n').map((line, i) => {
      if (line.startsWith('**') && line.endsWith('**')) return <p key={i} className="font-bold text-foreground mt-2 mb-1">{line.replace(/\*\*/g, '')}</p>;
      if (line.startsWith('• ')) return <p key={i} className="flex gap-2 text-sm"><span className="text-primary mt-0.5">•</span><span>{line.slice(2).replace(/\*\*(.*?)\*\*/g, (_, m) => m)}</span></p>;
      if (line.match(/^\d\./)) return <p key={i} className="text-sm ml-2">{line}</p>;
      if (line.startsWith('🔴') || line.startsWith('🟡') || line.startsWith('🟢') || line.startsWith('📊') || line.startsWith('💰')) return <p key={i} className="text-sm font-semibold mt-2">{line}</p>;
      if (line === '') return <div key={i} className="h-1" />;
      return <p key={i} className="text-sm">{line.replace(/\*\*(.*?)\*\*/g, (_, m) => m)}</p>;
    });
  };

  return (
    <div className="h-[calc(100vh-60px)] flex flex-col">
      {/* Header */}
      <div className="px-6 py-4 border-b border-border bg-card shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-brand">
              <Bot className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-foreground flex items-center gap-2">
                AI Copilot <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-medium">Online</span>
              </h1>
              <p className="text-xs text-muted-foreground">Powered by TrillionIndustries AI · Enterprise Intelligence Engine</p>
            </div>
          </div>
          <button onClick={() => { setMessages(m => [m[0]]); toast.info('Conversation cleared'); }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border text-xs font-medium hover:bg-muted transition-colors">
            <RefreshCw className="h-3.5 w-3.5" />New Chat
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-5 bg-muted/20">
        {messages.map(msg => (
          <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.role === 'assistant' && (
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shrink-0 mt-1">
                <Bot className="h-4 w-4 text-white" />
              </div>
            )}
            <div className={`max-w-[75%] ${msg.role === 'user' ? 'order-first' : ''}`}>
              <div className={`rounded-2xl px-4 py-3 ${msg.role === 'user' ? 'bg-primary text-primary-foreground rounded-br-none' : 'bg-card border border-border rounded-bl-none'}`}>
                <div className="space-y-0.5 text-sm leading-relaxed">
                  {formatContent(msg.content)}
                </div>
              </div>
              <div className={`flex items-center gap-2 mt-1.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <span className="text-[10px] text-muted-foreground">{msg.time}</span>
                {msg.role === 'assistant' && (
                  <div className="flex gap-1">
                    <button onClick={() => { navigator.clipboard.writeText(msg.content); toast.success('Copied!'); }}
                      className="p-1 rounded hover:bg-muted transition-colors"><Copy className="h-3 w-3 text-muted-foreground" /></button>
                    <button onClick={() => toast.success('Feedback recorded')} className="p-1 rounded hover:bg-muted transition-colors"><ThumbsUp className="h-3 w-3 text-muted-foreground" /></button>
                    <button onClick={() => toast.info('Feedback recorded')} className="p-1 rounded hover:bg-muted transition-colors"><ThumbsDown className="h-3 w-3 text-muted-foreground" /></button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
        {isThinking && (
          <div className="flex gap-3 items-center">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shrink-0">
              <Bot className="h-4 w-4 text-white" />
            </div>
            <div className="bg-card border border-border rounded-2xl rounded-bl-none px-4 py-3">
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-muted-foreground">Analyzing enterprise data</span>
                <div className="flex gap-0.5">
                  {[0, 1, 2].map(i => (
                    <span key={i} className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Quick Prompts */}
      <div className="px-6 py-3 border-t border-border bg-card shrink-0">
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
          {QUICK_PROMPTS.map(p => {
            const Icon = p.icon;
            return (
              <button key={p.text} onClick={() => sendMessage(p.text)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border bg-muted hover:bg-muted/70 hover:border-primary/30 text-xs font-medium text-muted-foreground hover:text-foreground transition-all whitespace-nowrap shrink-0">
                <Icon className="h-3.5 w-3.5 text-primary" />{p.text}
              </button>
            );
          })}
        </div>
      </div>

      {/* Input */}
      <div className="p-4 border-t border-border bg-card shrink-0">
        <div className="flex items-center gap-3 bg-muted rounded-2xl px-4 py-3 border border-border focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary/30 transition-all">
          <Sparkles className="h-4 w-4 text-primary shrink-0" />
          <input value={input} onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), sendMessage())}
            placeholder="Ask anything about your operations, data, or strategy..."
            className="flex-1 bg-transparent text-sm focus:outline-none text-foreground placeholder:text-muted-foreground" />
          <button onClick={() => sendMessage()} disabled={!input.trim() || isThinking}
            className="p-2 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
