
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { ChatMessage } from '../types';

const ChatBotView: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isDeepThink, setIsDeepThink] = useState(false);
  const [isFastMode, setIsFastMode] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      let modelName = 'gemini-3-flash-preview';
      if (isDeepThink) {
        modelName = 'gemini-3-pro-preview';
      } else if (isFastMode) {
        modelName = 'gemini-2.5-flash-lite-latest';
      }
      
      const config: any = {};
      if (isDeepThink) {
        config.thinkingConfig = { thinkingBudget: 32768 };
      }
      if (isSearching) {
        config.tools = [{ googleSearch: {} }];
      }

      const chat = ai.chats.create({
        model: modelName,
        config: {
          systemInstruction: "You are the MIGOXAI Quantum Reasoning Node. Your output is rendered in a high-security Radium Green + Smoke interface. Be technical, authoritative, and helpful. Use markdown for structured data. Address the user as an authorized node operator.",
          ...config
        },
      });

      const result = await chat.sendMessageStream({ message: input });
      
      let aiMsg: ChatMessage = { id: (Date.now() + 1).toString(), role: 'model', text: '' };
      setMessages(prev => [...prev, aiMsg]);

      for await (const chunk of result) {
        const c = chunk as GenerateContentResponse;
        const text = c.text || "";
        
        const groundingChunks = c.candidates?.[0]?.groundingMetadata?.groundingChunks;
        const urls = groundingChunks?.map((gc: any) => ({
          title: gc.web?.title || 'Data Source',
          uri: gc.web?.uri || '#'
        })).filter((u: any) => u.uri !== '#');

        setMessages(prev => prev.map(m => 
          m.id === aiMsg.id 
            ? { 
                ...m, 
                text: m.text + text, 
                groundingUrls: urls?.length ? Array.from(new Set([...(m.groundingUrls || []), ...urls].map(u => u.uri))).map(uri => [...(m.groundingUrls || []), ...urls].find(u => u.uri === uri)!) : m.groundingUrls 
              } 
            : m
        ));
      }
    } catch (error) {
      console.error("MIGOXAI Link Error:", error);
      setMessages(prev => [...prev, { 
        id: Date.now().toString(), 
        role: 'model', 
        text: "NODE DISCONNECT DETECTED. RETRYING QUANTUM TUNNELING..." 
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-full gap-6 animate-fade-in">
      <header className="flex flex-col gap-1">
        <h2 className="text-4xl font-black radium-text uppercase italic tracking-tighter">Quantum Reasoning Node</h2>
        <p className="text-slate-500 font-bold tracking-[0.4em] text-[10px] uppercase">Grounded Intelligence // Multi-Agent Reasoning Hub</p>
        
        <div className="flex flex-wrap gap-4 mt-4">
          <button 
            onClick={() => {
              setIsDeepThink(!isDeepThink);
              if (!isDeepThink) setIsFastMode(false);
            }}
            className={`flex items-center gap-3 px-5 py-3 rounded-xl border transition-all ${
              isDeepThink ? 'bg-[#39ff14]/15 border-[#39ff14] radium-text radium-glow scale-105' : 'bg-black/50 border-slate-800 text-slate-500 hover:border-slate-700'
            }`}
          >
            <span className="text-xl">🛡️</span>
            <span className="text-[10px] font-black uppercase tracking-widest">Deep Think Mode (32K)</span>
          </button>

          <button 
            onClick={() => {
              setIsFastMode(!isFastMode);
              if (!isFastMode) setIsDeepThink(false);
            }}
            className={`flex items-center gap-3 px-5 py-3 rounded-xl border transition-all ${
              isFastMode ? 'bg-amber-500/15 border-amber-500 text-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.2)]' : 'bg-black/50 border-slate-800 text-slate-500 hover:border-slate-700'
            }`}
          >
            <span className="text-xl">⚡</span>
            <span className="text-[10px] font-black uppercase tracking-widest">Fast AI Response</span>
          </button>
          
          <button 
            onClick={() => setIsSearching(!isSearching)}
            className={`flex items-center gap-3 px-5 py-3 rounded-xl border transition-all ${
              isSearching ? 'bg-blue-500/15 border-blue-500 text-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.2)]' : 'bg-black/50 border-slate-800 text-slate-500 hover:border-slate-700'
            }`}
          >
            <span className="text-xl">🕸️</span>
            <span className="text-[10px] font-black uppercase tracking-widest">Web Grounding</span>
          </button>
        </div>
      </header>

      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto space-y-8 p-10 glass-panel rounded-[2.5rem] min-h-[400px] border border-[#39ff14]/10 shadow-inner bg-gradient-to-br from-black to-[#05080a]"
      >
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-slate-900 gap-10 opacity-30">
            <div className="text-9xl radium-text animate-pulse">⚛️</div>
            <p className="text-2xl font-black tracking-[1em] uppercase ml-10">CORE READY</p>
          </div>
        )}
        {messages.map((m) => (
          <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[92%] rounded-[2rem] px-8 py-6 shadow-2xl relative ${
              m.role === 'user' 
                ? 'bg-[#0f3d0e]/60 border border-[#39ff14]/40 text-[#39ff14] radium-glow' 
                : 'bg-black border border-slate-800 text-slate-200'
            }`}>
              {m.role === 'model' && (
                <div className="text-[9px] font-black text-green-900 mb-4 uppercase tracking-[0.3em] border-b border-green-900/10 pb-3 flex justify-between">
                  <span>REASONING FEED</span>
                  <span className="animate-pulse">STABLE</span>
                </div>
              )}
              <div className="whitespace-pre-wrap leading-relaxed text-base md:text-lg font-medium mono selection:bg-[#39ff14] selection:text-black">
                {m.text}
              </div>
              {m.groundingUrls && m.groundingUrls.length > 0 && (
                <div className="mt-8 pt-6 border-t border-slate-800 flex flex-col gap-4">
                  <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Grounding Verification:</span>
                  <div className="flex flex-wrap gap-2">
                    {m.groundingUrls.map((url, idx) => (
                      <a 
                        key={idx} 
                        href={url.uri} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-[10px] font-black bg-slate-900/60 text-green-500 px-4 py-2 rounded-lg border border-slate-800 hover:border-green-500 transition-all hover:bg-black uppercase tracking-tighter"
                      >
                        {url.title}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-black/50 rounded-2xl px-6 py-4 border border-[#39ff14]/20 animate-pulse text-[10px] font-black text-green-600 uppercase tracking-[0.3em]">
              QUANTUM PROCESSING...
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-4 p-5 bg-black/80 rounded-[2.5rem] border border-[#39ff14]/20 focus-within:border-[#39ff14] transition-all radium-glow">
        <input 
          type="text" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="TRANSMIT NEURAL QUERY..."
          className="flex-1 bg-transparent border-none focus:ring-0 px-6 py-3 text-[#39ff14] placeholder:text-green-950 font-black mono text-xl"
        />
        <button 
          onClick={handleSend}
          disabled={isTyping}
          className="bg-[#39ff14] hover:bg-white disabled:opacity-10 text-black px-12 py-4 rounded-[1.5rem] font-black transition-all active:scale-95 uppercase tracking-widest text-sm shadow-[0_0_20px_rgba(57,255,20,0.6)]"
        >
          ANALYZE
        </button>
      </div>
    </div>
  );
};

export default ChatBotView;
