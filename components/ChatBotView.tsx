
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { ChatMessage } from '../types';

const ChatBotView: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isDeepThink, setIsDeepThink] = useState(false);
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
      
      // Select model based on mode
      // User requested: thinking mode uses gemini-3-pro-preview
      // User requested: search uses gemini-3-flash-preview
      const modelName = isDeepThink ? 'gemini-3-pro-preview' : 'gemini-3-flash-preview';
      
      const config: any = {};
      if (isDeepThink) {
        config.thinkingConfig = { thinkingBudget: 32768 };
        // Per user request, do not set maxOutputTokens here.
      }
      if (isSearching) {
        config.tools = [{ googleSearch: {} }];
      }

      const chat = ai.chats.create({
        model: modelName,
        config: {
          systemInstruction: "You are MIGOXAI, a high-performance neural assistant. Be precise, technical, and helpful.",
          ...config
        },
      });

      const result = await chat.sendMessageStream({ message: input });
      
      let aiMsg: ChatMessage = { id: (Date.now() + 1).toString(), role: 'model', text: '' };
      setMessages(prev => [...prev, aiMsg]);

      for await (const chunk of result) {
        const c = chunk as GenerateContentResponse;
        const text = c.text || "";
        
        // Extract grounding if available
        const groundingChunks = c.candidates?.[0]?.groundingMetadata?.groundingChunks;
        const urls = groundingChunks?.map((gc: any) => ({
          title: gc.web?.title || 'Source',
          uri: gc.web?.uri || '#'
        })).filter((u: any) => u.uri !== '#');

        setMessages(prev => prev.map(m => 
          m.id === aiMsg.id 
            ? { 
                ...m, 
                text: m.text + text, 
                groundingUrls: urls?.length ? [...(m.groundingUrls || []), ...urls] : m.groundingUrls 
              } 
            : m
        ));
      }
    } catch (error) {
      console.error("Neural Chat error:", error);
      setMessages(prev => [...prev, { 
        id: Date.now().toString(), 
        role: 'model', 
        text: "NODE ERROR: CONNECTION TERMINATED. PLEASE RE-INITIALIZE." 
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-full gap-4">
      <header className="flex flex-col gap-2">
        <h2 className="text-3xl font-black radium-text uppercase">Neural Chat</h2>
        <p className="text-slate-500 font-medium">Core intelligence interface with quantum search and reasoning.</p>
        
        <div className="flex gap-4 mt-4">
          <button 
            onClick={() => setIsDeepThink(!isDeepThink)}
            className={`flex items-center gap-3 px-4 py-2 rounded-xl border transition-all ${
              isDeepThink ? 'bg-[#39ff14]/10 border-[#39ff14] radium-text' : 'bg-slate-900 border-slate-800 text-slate-500'
            }`}
          >
            <span className="text-lg">⚙️</span>
            <span className="text-sm font-bold uppercase tracking-wider">Thinking Mode (32k)</span>
          </button>
          
          <button 
            onClick={() => setIsSearching(!isSearching)}
            className={`flex items-center gap-3 px-4 py-2 rounded-xl border transition-all ${
              isSearching ? 'bg-blue-500/10 border-blue-500 text-blue-400' : 'bg-slate-900 border-slate-800 text-slate-500'
            }`}
          >
            <span className="text-lg">🌐</span>
            <span className="text-sm font-bold uppercase tracking-wider">Search Grounding</span>
          </button>
        </div>
      </header>

      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto space-y-6 p-6 glass-panel rounded-3xl min-h-[400px] border border-green-900/20"
      >
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-slate-700 gap-6 opacity-40">
            <div className="text-8xl animate-pulse">🔌</div>
            <p className="text-lg font-bold">READY TO COMMUNICATE. INPUT DATA BELOW.</p>
          </div>
        )}
        {messages.map((m) => (
          <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-2xl px-5 py-4 shadow-2xl ${
              m.role === 'user' 
                ? 'bg-[#0f3d0e] border border-[#39ff14]/30 text-[#39ff14] radium-shadow' 
                : 'bg-black border border-slate-800 text-slate-300'
            }`}>
              {m.role === 'model' && (
                <div className="text-[10px] font-black text-green-700 mb-2 uppercase tracking-widest">
                  MIGOXAI RESPONSE
                </div>
              )}
              <div className="whitespace-pre-wrap leading-relaxed text-sm md:text-base font-medium">{m.text}</div>
              {m.groundingUrls && m.groundingUrls.length > 0 && (
                <div className="mt-4 pt-4 border-t border-slate-800 flex flex-col gap-2">
                  <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Verification Sources:</span>
                  <div className="flex flex-wrap gap-2">
                    {Array.from(new Set(m.groundingUrls.map(u => u.uri))).map((uri) => {
                      const url = m.groundingUrls?.find(u => u.uri === uri);
                      return (
                        <a 
                          key={uri} 
                          href={uri} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-xs bg-slate-900 text-green-500 px-3 py-1.5 rounded-lg border border-slate-800 hover:border-green-500 transition-all hover:radium-shadow"
                        >
                          {url?.title || 'External Intel'}
                        </a>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-black rounded-2xl px-5 py-4 border border-green-900/40 animate-pulse text-xs font-bold text-green-600">
              SYNTHESIZING NEURAL PATHWAYS...
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-2 p-3 bg-black rounded-3xl border border-green-900/30 focus-within:border-[#39ff14] transition-all radium-shadow">
        <input 
          type="text" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="ENTER COMMAND OR QUERY..."
          className="flex-1 bg-transparent border-none focus:ring-0 px-4 py-2 text-green-400 placeholder:text-green-900 font-bold"
        />
        <button 
          onClick={handleSend}
          disabled={isTyping}
          className="bg-[#39ff14] hover:bg-[#2ecc11] disabled:opacity-30 text-black px-8 py-2 rounded-2xl font-black transition-all active:scale-95 uppercase tracking-widest"
        >
          Transmit
        </button>
      </div>
    </div>
  );
};

export default ChatBotView;
