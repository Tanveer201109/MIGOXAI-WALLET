
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, Zap, Key, Plus, LogIn, Lock, Wallet, Activity, ArrowRight, RefreshCcw } from 'lucide-react';

type WalletTab = 'PORTFOLIO' | 'SWAP' | 'BRIDGE' | 'STAKE';
type ConnectionStep = 'IDLE' | 'INITIALIZING' | 'GENERATING' | 'RECOVERING' | 'GEN_CHOICE' | 'SEED_REVEAL' | 'CONNECTED';

const MNEMONIC_WORDS = [
  "alpha", "bravo", "charlie", "delta", "echo", "foxtrot", "golf", "hotel", "india", "juliet", "kilo", "lima",
  "mike", "november", "oscar", "papa", "quebec", "romeo", "sierra", "tango", "uniform", "victor", "whiskey", "xray",
  "yankee", "zulu", "quantum", "neural", "cipher", "matrix", "nexus", "atomic", "plasma", "pulse", "beacon", "vector"
];

const WalletView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<WalletTab>('PORTFOLIO');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionStep, setConnectionStep] = useState<ConnectionStep>('IDLE');
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [mnemonic, setMnemonic] = useState<string[]>([]);
  const [phraseLength, setPhraseLength] = useState<12 | 24>(12);
  
  const [balance] = useState({
    btc: "1.245082",
    xai: "250,450.00",
    xchain: "882,400.00",
    micro: "1,000,000.00",
    usd: "142,654.20"
  });

  const tokens = [
    { name: "X-CHAIN", symbol: "XCH", amount: balance.xchain, value: "$32,120.45", color: "text-cyan-400", icon: "⛓️", glow: "shadow-[0_0_15px_rgba(34,211,238,0.4)]" },
    { name: "MIGOXAI", symbol: "XAI", amount: balance.xai, value: "$12,450.15", color: "text-[#39ff14]", icon: "💎", glow: "shadow-[0_0_15px_rgba(57,255,20,0.4)]" },
    { name: "Bitcoin", symbol: "BTC", amount: balance.btc, value: "$84,210.00", color: "text-orange-500", icon: "₿", glow: "" },
    { name: "JUST-MICRO", symbol: "MICRO", amount: balance.micro, value: "$1,761.00", color: "text-blue-400", icon: "Ⓜ️", glow: "" },
  ];

  const transactions = [
    { type: "UPLINK", asset: "XCH", amount: "CONNECTED", status: "VERIFIED", date: "JUST NOW" },
    { type: "RECEIVED", asset: "XAI", amount: "+5,000.00", status: "VERIFIED", date: "2023.10.24" },
    { type: "STAKED", asset: "MICRO", amount: "-100,000.00", status: "LOCKED", date: "2023.10.22" },
  ];

  const handleConnect = (type: 'NEW' | 'IMPORT' | 'METAMASK' | 'GOOGLE' | 'MICROSOFT') => {
    if (type === 'NEW') {
      setConnectionStep('GEN_CHOICE');
      return;
    }
    
    setConnectionStep(type === 'IMPORT' ? 'RECOVERING' : 'GENERATING');
    
    const genAddr = '0xMIGO' + Math.random().toString(16).slice(2, 10).toUpperCase();

    setTimeout(() => {
      setConnectionStep('INITIALIZING');
    }, 1200);

    setTimeout(() => {
      setWalletAddress(genAddr);
      if (type === 'IMPORT') {
        finalizeConnection();
      } else {
        generateMnemonic(12); // Default for social logins
      }
    }, 2800);
  };

  const generateMnemonic = (length: 12 | 24) => {
    setConnectionStep('GENERATING');
    setPhraseLength(length);
    
    const words: string[] = [];
    for (let i = 0; i < length; i++) {
      words.push(MNEMONIC_WORDS[Math.floor(Math.random() * MNEMONIC_WORDS.length)]);
    }
    
    setTimeout(() => {
      setMnemonic(words);
      setWalletAddress('0xMIGO' + Math.random().toString(16).slice(2, 10).toUpperCase());
      setConnectionStep('SEED_REVEAL');
    }, 2000);
  };

  const finalizeConnection = () => {
    setIsConnected(true);
    setConnectionStep('CONNECTED');
  };

  const handleAction = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      alert("QUANTUM TRANSACTION COMMITTED: ANS=CORRECT");
    }, 2000);
  };

  if (!isConnected) {
    return (
      <div className="h-full flex items-center justify-center animate-fade-in p-6">
        <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8">
           <div className="flex flex-col justify-center gap-6">
             <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-black border-2 border-[#39ff14] rounded-2xl flex items-center justify-center text-4xl shadow-[0_0_30px_rgba(57,255,20,0.4)] radium-glow animate-pulse">
                  💳
                </div>
                <div>
                  <h2 className="text-5xl font-black radium-text uppercase italic tracking-tighter leading-none">Quantum Wallet</h2>
                  <p className="text-slate-500 font-bold tracking-[0.3em] text-[10px] uppercase mt-1">Status: NOT ACTIVE</p>
                </div>
             </div>
             <p className="text-slate-400 text-sm font-medium leading-relaxed max-w-sm mb-6">
               Initialize your secure link to the MIGOXAI backbone. Managed via quantum-encrypted neural signatures. No seed phrase required.
             </p>
             
             <div className="grid grid-cols-1 gap-4">
                <button 
                  onClick={() => handleConnect('NEW')}
                  disabled={connectionStep !== 'IDLE'}
                  className="w-full group flex items-center justify-between bg-black/60 border border-green-900/30 p-6 rounded-3xl hover:border-[#39ff14] hover:bg-[#39ff14]/5 transition-all text-left relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-20 transition-opacity">
                    <Plus size={60} className="text-[#39ff14]" />
                  </div>
                  <div className="flex items-center gap-4 relative z-10">
                    <div className="w-10 h-10 rounded-xl bg-green-950/30 flex items-center justify-center text-[#39ff14] group-hover:bg-[#39ff14] group-hover:text-black transition-colors">
                      <Plus size={20} />
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-white uppercase tracking-tight">Create New Node</h3>
                      <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mt-0.5">Generate Unique Neural Signature</p>
                    </div>
                  </div>
                  <ArrowRight className="text-green-900 group-hover:text-[#39ff14] transform group-hover:translate-x-2 transition-all" size={16} />
                </button>

                <div className="grid grid-cols-3 gap-3">
                  <button 
                    onClick={() => handleConnect('METAMASK')}
                    disabled={connectionStep !== 'IDLE'}
                    className="group bg-black/60 border border-amber-900/30 p-4 rounded-2xl hover:border-amber-500 hover:bg-amber-500/5 transition-all text-center relative overflow-hidden"
                  >
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-10 h-10 rounded-xl bg-amber-950/30 flex items-center justify-center text-amber-500 group-hover:bg-amber-500 group-hover:text-black transition-colors">
                        <span className="text-xl">🦊</span>
                      </div>
                      <h4 className="text-[9px] font-black text-white uppercase tracking-tight">MetaMask</h4>
                    </div>
                  </button>

                  <button 
                    onClick={() => handleConnect('GOOGLE')}
                    disabled={connectionStep !== 'IDLE'}
                    className="group bg-black/60 border border-slate-700/30 p-4 rounded-2xl hover:border-white hover:bg-white/5 transition-all text-center relative overflow-hidden"
                  >
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white group-hover:bg-white group-hover:text-black transition-colors">
                        <span className="text-xl font-bold">G</span>
                      </div>
                      <h4 className="text-[9px] font-black text-white uppercase tracking-tight">Google</h4>
                    </div>
                  </button>

                  <button 
                    onClick={() => handleConnect('MICROSOFT')}
                    disabled={connectionStep !== 'IDLE'}
                    className="group bg-black/60 border border-blue-700/30 p-4 rounded-2xl hover:border-blue-400 hover:bg-blue-400/5 transition-all text-center relative overflow-hidden"
                  >
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-10 h-10 rounded-xl bg-blue-950/30 flex items-center justify-center text-blue-400 group-hover:bg-blue-400 group-hover:text-black transition-colors">
                        <span className="text-xl">⊞</span>
                      </div>
                      <h4 className="text-[9px] font-black text-white uppercase tracking-tight">Microsoft</h4>
                    </div>
                  </button>
                </div>

                <button 
                  onClick={() => handleConnect('IMPORT')}
                  disabled={connectionStep !== 'IDLE'}
                  className="w-full group flex items-center justify-between border border-dashed border-green-900/30 px-6 py-4 rounded-xl hover:border-[#39ff14] transition-all"
                >
                  <span className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em]">Recover Identity Hub</span>
                  <RefreshCcw size={14} className="text-green-900" />
                </button>
             </div>
           </div>

           <div className="hidden md:flex items-center justify-center">
             <div className="glass-panel p-12 rounded-[4rem] border border-[#39ff14]/10 bg-black/40 w-full aspect-square flex flex-col items-center justify-center text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(57,255,20,0.05),transparent_70%)]" />
                
                <AnimatePresence mode="wait">
                  {connectionStep === 'IDLE' ? (
                    <motion.div 
                      key="idle"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="flex flex-col items-center gap-8 relative z-10"
                    >
                      <div className="w-32 h-32 rounded-full border border-green-900/20 flex items-center justify-center relative">
                        <div className="absolute inset-0 border-2 border-[#39ff14]/30 rounded-full animate-ping" />
                        <Shield size={64} className="text-green-900" />
                      </div>
                      <p className="text-xs font-black text-green-950 uppercase tracking-[0.5em]">Network: ISOLATED</p>
                    </motion.div>
                  ) : connectionStep === 'GEN_CHOICE' ? (
                    <motion.div 
                      key="choice"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex flex-col items-center gap-6 relative z-10 w-full"
                    >
                      <div className="w-16 h-16 bg-black border-2 border-[#39ff14] rounded-2xl flex items-center justify-center text-[#39ff14] mb-4">
                        <Shield size={32} />
                      </div>
                      <h3 className="text-xl font-black radium-text uppercase italic tracking-tighter">Seed Complexity</h3>
                      <div className="grid grid-cols-1 gap-4 w-full">
                        <button 
                          onClick={() => generateMnemonic(12)}
                          className="p-6 bg-green-950/20 border border-green-900/30 rounded-2xl flex justify-between items-center group hover:border-[#39ff14] transition-all"
                        >
                          <div className="text-left">
                            <p className="text-sm font-black text-white uppercase">12 Word Seed</p>
                            <p className="text-[9px] font-bold text-slate-500 uppercase">Standard Security</p>
                          </div>
                          <ArrowRight className="text-green-900 group-hover:text-[#39ff14]" size={16} />
                        </button>
                        <button 
                          onClick={() => generateMnemonic(24)}
                          className="p-6 bg-cyan-950/20 border border-cyan-900/30 rounded-2xl flex justify-between items-center group hover:border-cyan-400 transition-all"
                        >
                          <div className="text-left">
                            <p className="text-sm font-black text-white uppercase">24 Word Seed</p>
                            <p className="text-[9px] font-bold text-slate-500 uppercase">Maximum Neural Entropy</p>
                          </div>
                          <ArrowRight className="text-cyan-900 group-hover:text-cyan-400" size={16} />
                        </button>
                      </div>
                      <button onClick={() => setConnectionStep('IDLE')} className="text-[9px] font-black text-slate-600 uppercase hover:text-white transition-colors">Go Back</button>
                    </motion.div>
                  ) : connectionStep === 'SEED_REVEAL' ? (
                    <motion.div 
                      key="reveal"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex flex-col items-center gap-4 relative z-10 w-full max-h-[450px] overflow-hidden"
                    >
                      <div className="w-12 h-12 bg-green-950/30 border-2 border-[#39ff14] rounded-xl flex items-center justify-center text-[#39ff14] radium-glow shrink-0">
                        <Key size={24} />
                      </div>
                      <div className="space-y-4 w-full overflow-hidden flex flex-col">
                        <div className="text-center">
                          <h3 className="text-lg font-black radium-text uppercase italic tracking-tighter">Back-up Your Neural Seed</h3>
                          <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest mt-1">Status: PRIVATE KEY GENERATED</p>
                        </div>
                        
                        <div className="bg-black/90 border border-[#39ff14]/30 p-4 rounded-2xl relative group overflow-y-auto max-h-[220px] custom-scroll">
                           <div className={`grid ${phraseLength === 12 ? 'grid-cols-3' : 'grid-cols-4'} gap-2`}>
                              {mnemonic.map((word, i) => (
                                <div key={i} className="bg-slate-900/50 p-2 rounded-lg border border-slate-800 text-center">
                                  <span className="text-[8px] font-black text-slate-600 block mb-0.5">{i + 1}</span>
                                  <span className="text-[10px] font-bold text-white mono">{word}</span>
                                </div>
                              ))}
                           </div>
                           <div className="absolute inset-0 bg-black/95 blur-md group-hover:opacity-0 transition-all duration-500 flex flex-col items-center justify-center cursor-none z-50 pointer-events-none group-hover:pointer-events-none">
                              <Lock size={20} className="text-[#39ff14] mb-2" />
                              <p className="text-[10px] font-black text-[#39ff14] uppercase tracking-[0.3em]">Hover to Reveal Phrase</p>
                           </div>
                        </div>

                        <p className="text-[8px] text-red-500 font-black uppercase tracking-widest leading-tight text-center px-4">
                          ⚠ WARNING: IF YOU LOSE THESE {phraseLength} WORDS, YOU LOSE ACCESS TO THE HUB PERMANENTLY.
                        </p>

                        <button 
                          onClick={finalizeConnection}
                          className="w-full bg-[#39ff14] text-black font-black py-4 rounded-xl hover:bg-white transition-all uppercase tracking-widest text-[10px] shadow-[0_0_20px_rgba(57,255,20,0.4)]"
                        >
                          I Have Recorded the Sequence
                        </button>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div 
                      key="active"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex flex-col items-center gap-10 relative z-10"
                    >
                      <div className="relative">
                        <div className="w-48 h-48 border-4 border-dashed border-[#39ff14]/20 rounded-full animate-spin-slow flex items-center justify-center">
                        </div>
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                           <Zap size={80} className="text-[#39ff14] animate-pulse radium-text" />
                        </div>
                      </div>
                      <div className="space-y-4">
                        <p className="text-2xl font-black radium-text uppercase italic tracking-tighter">
                          {connectionStep === 'GENERATING' ? 'Generating Key...' : 
                           connectionStep === 'RECOVERING' ? 'Decrypting Key...' : 
                           'Initializing Link...'}
                        </p>
                        <div className="w-64 h-1 bg-green-950 rounded-full overflow-hidden">
                           <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: '100%' }}
                            transition={{ duration: 3.5 }}
                            className="h-full bg-[#39ff14] shadow-[0_0_10px_#39ff14]"
                           />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
             </div>
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full gap-8 animate-fade-in pb-10">
      <header className="flex flex-col gap-1">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <h2 className="text-5xl font-black radium-text uppercase italic tracking-tighter">MIGOXAI WALLET</h2>
            <div className="flex gap-2">
              <span className="bg-[#39ff14]/10 border border-[#39ff14]/40 px-3 py-1 rounded-md text-[10px] font-black text-[#39ff14] animate-pulse">POWER-SECURE</span>
              <span className="bg-cyan-500/10 border border-cyan-500/40 px-3 py-1 rounded-md text-[10px] font-black text-cyan-400">X-CHAIN ACTIVE</span>
            </div>
          </div>
          
          <div className="flex bg-black border border-slate-800 rounded-xl p-1 shadow-2xl">
            {['PORTFOLIO', 'SWAP', 'BRIDGE', 'STAKE'].map((tab) => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab as WalletTab)}
                className={`px-5 py-2 rounded-lg text-[10px] font-black tracking-widest transition-all ${activeTab === tab ? 'bg-[#39ff14] text-black shadow-[0_0_15px_#39ff14]' : 'text-slate-500 hover:text-white'}`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-4 mt-2">
          <p className="text-slate-500 font-bold tracking-[0.3em] text-[10px] uppercase ml-1">Quantum-Encrypted Asset Hub | v4.5.0-STABLE</p>
          <div className="h-px flex-1 bg-green-900/20" />
          <div className="flex items-center gap-2 bg-black/40 px-3 py-1 rounded-lg border border-green-900/20">
             <div className="w-1.5 h-1.5 bg-[#39ff14] rounded-full" />
             <span className="text-[9px] font-black text-slate-400 mono">{walletAddress}</span>
          </div>
        </div>
      </header>

      {activeTab === 'PORTFOLIO' && (
        <div className="flex flex-col gap-8 flex-1 overflow-visible">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Main Liquidity Card */}
            <div className="lg:col-span-3 glass-panel rounded-[2rem] p-10 border border-[#39ff14]/20 relative overflow-hidden radium-glow bg-gradient-to-br from-[#0f3d0e]/30 to-black group">
              <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:opacity-10 transition-opacity">
                <div className="text-[12rem] radium-text">🔋</div>
              </div>
              
              <div className="relative z-10">
                <p className="text-green-800 font-black text-[10px] uppercase tracking-[0.5em] mb-4">Total Net Liquidity</p>
                <div className="flex items-baseline gap-3">
                  <span className="text-6xl md:text-8xl font-black radium-text tracking-tighter mono selection:bg-[#39ff14] selection:text-black">${balance.usd}</span>
                  <span className="text-green-600 font-bold text-xl uppercase tracking-widest mono">USD</span>
                </div>
                
                <div className="mt-12 flex flex-wrap gap-4">
                  <button onClick={() => setActiveTab('SWAP')} className="px-10 py-4 bg-[#39ff14] text-black font-black rounded-xl hover:bg-white transition-all transform active:scale-95 uppercase tracking-widest text-xs shadow-[0_0_20px_rgba(57,255,20,0.4)]">
                    Direct Swap
                  </button>
                  <button onClick={() => setActiveTab('BRIDGE')} className="px-10 py-4 bg-cyan-500 text-black font-black rounded-xl hover:bg-white transition-all transform active:scale-95 uppercase tracking-widest text-xs shadow-[0_0_20px_rgba(6,182,212,0.4)]">
                    X-Chain Bridge
                  </button>
                  <button className="px-10 py-4 bg-black/60 border border-slate-800 text-slate-400 font-black rounded-xl hover:text-white transition-all uppercase tracking-widest text-xs">
                    Buy Crypto
                  </button>
                </div>
              </div>
            </div>

            {/* Security Health */}
            <div className="glass-panel rounded-[2rem] p-8 border border-green-900/30 flex flex-col justify-between bg-black/40">
              <div>
                <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6">Security Core</h3>
                <div className="space-y-5">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-400">X-Chain Link</span>
                    <span className="text-[10px] font-black text-cyan-400">ENCRYPTED</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-400">KYC Verify</span>
                    <span className="text-[10px] font-black radium-text">TRUSTED</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-400">Node Sync</span>
                    <span className="text-[10px] font-black text-white mono">100%</span>
                  </div>
                </div>
              </div>
              <div className="mt-8">
                 <div className="flex justify-between items-end mb-2">
                   <span className="text-[10px] font-black text-green-900 uppercase">Integrity</span>
                   <span className="text-[10px] font-black radium-text mono">ANS=CORRECT</span>
                 </div>
                 <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-green-900/20">
                    <div className="bg-[#39ff14] h-full w-[100%] shadow-[0_0_10px_#39ff14]"></div>
                 </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-1 min-h-[400px]">
            {/* Asset List */}
            <div className="glass-panel rounded-[2.5rem] p-10 border border-green-900/10 flex flex-col bg-black/20">
              <div className="flex justify-between items-center mb-10">
                <h3 className="text-xs font-black text-green-900 uppercase tracking-[0.4em]">Asset Inventory</h3>
                <button className="text-[9px] font-black text-slate-500 uppercase flex items-center gap-2 hover:text-white transition-colors">
                  <RefreshCcw size={10} />
                  Force Refresh
                </button>
              </div>
              <div className="space-y-4 flex-1 overflow-y-auto pr-4 custom-scroll">
                {tokens.map((token, i) => (
                  <div key={i} className={`flex items-center justify-between p-6 bg-black/40 rounded-[2rem] border border-green-900/10 hover:border-slate-400 transition-all group cursor-pointer relative overflow-hidden ${token.glow}`}>
                    <div className="flex items-center gap-6 relative z-10">
                      <div className="w-16 h-16 bg-slate-950 border border-green-900/20 rounded-2xl flex items-center justify-center text-4xl group-hover:scale-110 transition-transform shadow-inner">
                        {token.icon}
                      </div>
                      <div>
                        <h4 className="font-black text-white text-xl tracking-tighter">{token.name}</h4>
                        <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">{token.symbol}</p>
                      </div>
                    </div>
                    <div className="text-right relative z-10">
                      <p className={`text-2xl font-black ${token.color} tracking-tighter mono`}>{token.amount}</p>
                      <p className="text-[10px] font-bold text-slate-500 mono">{token.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Transaction History */}
            <div className="glass-panel rounded-[2.5rem] p-10 border border-green-900/10 flex flex-col bg-black/20">
              <h3 className="text-xs font-black text-green-900 uppercase tracking-[0.4em] mb-10">Neural Ledger</h3>
              <div className="space-y-4 flex-1 overflow-y-auto pr-4 custom-scroll">
                {transactions.map((tx, i) => (
                  <div key={i} className="flex items-center justify-between p-6 bg-slate-950/40 rounded-2xl border border-white/5 hover:bg-slate-900/40 transition-all group">
                    <div className="flex items-center gap-5">
                      <div className={`w-3 h-3 rounded-full ${tx.type === 'UPLINK' ? 'bg-cyan-400 animate-pulse' : tx.type === 'RECEIVED' ? 'bg-green-500' : 'bg-amber-500 shadow-[0_0_10px_#f59e0b]'}`}></div>
                      <div>
                        <p className="text-sm font-black text-white tracking-tight uppercase">{tx.type} {tx.asset}</p>
                        <p className="text-[9px] font-bold text-slate-600 uppercase mono">{tx.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-black mono ${tx.amount === 'CONNECTED' ? 'text-cyan-400' : tx.amount.startsWith('+') ? 'text-[#39ff14]' : 'text-white'}`}>{tx.amount}</p>
                      <p className="text-[8px] font-black text-green-900 tracking-[0.2em] uppercase">{tx.status}</p>
                    </div>
                  </div>
                ))}
                <div className="p-8 border-2 border-dashed border-green-900/10 rounded-2xl text-center opacity-40">
                  <p className="text-[10px] font-black text-green-950 uppercase tracking-[0.5em]">End of Verified Stream</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'SWAP' && (
        <div className="flex-1 flex items-center justify-center animate-fade-in">
          <div className="glass-panel p-12 rounded-[3rem] border border-[#39ff14]/20 w-full max-w-xl radium-glow bg-black/60 shadow-[0_0_50px_rgba(57,255,20,0.1)]">
             <h3 className="text-2xl font-black radium-text uppercase italic tracking-tighter mb-10 text-center">Neural Asset Swap</h3>
             <div className="space-y-8">
               <div className="bg-black/80 p-6 rounded-2xl border border-green-900/30">
                 <div className="flex justify-between mb-4">
                   <span className="text-[10px] font-black text-slate-500 uppercase">You Pay</span>
                   <span className="text-[10px] font-black text-[#39ff14] uppercase">Balance: 1.24 BTC</span>
                 </div>
                 <div className="flex justify-between items-center">
                   <input type="text" placeholder="0.00" className="bg-transparent text-3xl font-black text-white focus:outline-none w-1/2 mono" />
                   <div className="bg-slate-900 px-4 py-2 rounded-xl flex items-center gap-2 border border-slate-800">
                     <span className="text-2xl">₿</span>
                     <span className="font-black text-xs">BTC</span>
                   </div>
                 </div>
               </div>
               
               <div className="flex justify-center -my-10 relative z-10">
                 <button className="w-14 h-14 bg-[#39ff14] text-black rounded-full flex items-center justify-center text-xl shadow-[0_0_20px_#39ff14] hover:scale-110 transition-transform border-4 border-black">
                   ⇅
                 </button>
               </div>

               <div className="bg-black/80 p-6 rounded-2xl border border-green-900/30">
                 <div className="flex justify-between mb-4">
                   <span className="text-[10px] font-black text-slate-500 uppercase">You Receive</span>
                   <span className="text-[10px] font-black text-slate-500 uppercase">Est. Output</span>
                 </div>
                 <div className="flex justify-between items-center">
                   <input type="text" placeholder="0.00" readOnly className="bg-transparent text-3xl font-black text-[#39ff14] focus:outline-none w-1/2 mono" />
                   <div className="bg-slate-900 px-4 py-2 rounded-xl flex items-center gap-2 border border-slate-800">
                     <span className="text-2xl">💎</span>
                     <span className="font-black text-xs">XAI</span>
                   </div>
                 </div>
               </div>
               
               <div className="flex justify-between text-[10px] font-black text-slate-600 uppercase px-2">
                 <span>Exchange Rate: 1 BTC ≈ 201,100 XAI</span>
                 <span>Slippage: 0.1%</span>
               </div>

               <button 
                onClick={handleAction}
                disabled={isProcessing}
                className="w-full bg-[#39ff14] text-black font-black py-6 rounded-2xl hover:bg-white transition-all uppercase tracking-[0.2em] text-sm shadow-[0_0_30px_rgba(57,255,20,0.4)] disabled:opacity-50"
               >
                {isProcessing ? 'SYNCHRONIZING ATOMIC SWAP...' : 'EXECUTE NEURAL SWAP'}
               </button>
             </div>
          </div>
        </div>
      )}

      {activeTab === 'BRIDGE' && (
        <div className="flex-1 flex items-center justify-center animate-fade-in">
          <div className="glass-panel p-12 rounded-[3rem] border border-cyan-500/20 w-full max-w-2xl bg-black/60 shadow-[0_0_50px_rgba(6,182,212,0.1)] relative overflow-hidden">
             <div className="absolute top-0 right-0 p-8 opacity-10">
               <span className="text-9xl">⛓️</span>
             </div>
             
             <h3 className="text-2xl font-black text-cyan-400 uppercase italic tracking-tighter mb-10 text-center">X-Chain Bridge Tunnel</h3>
             
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                <div className="bg-black/80 p-6 rounded-2xl border border-cyan-900/30 text-center">
                  <p className="text-[10px] font-black text-slate-500 uppercase mb-4">Source Network</p>
                  <div className="text-4xl mb-4">🌍</div>
                  <p className="font-black text-white uppercase tracking-widest">Mainnet Core</p>
                </div>
                
                <div className="flex flex-col items-center gap-4">
                  <div className="w-full h-px bg-gradient-to-r from-transparent via-cyan-500 to-transparent relative">
                    <div className="absolute top-1/2 left-0 w-2 h-2 bg-cyan-400 rounded-full animate-[ping_2s_infinite]"></div>
                  </div>
                  <div className="text-[10px] font-black text-cyan-500 animate-pulse">TUNNEL ACTIVE</div>
                  <div className="w-full h-px bg-gradient-to-r from-transparent via-cyan-500 to-transparent"></div>
                </div>

                <div className="bg-black/80 p-6 rounded-2xl border border-cyan-900/30 text-center">
                  <p className="text-[10px] font-black text-slate-500 uppercase mb-4">Destination</p>
                  <div className="text-4xl mb-4">🧬</div>
                  <p className="font-black text-cyan-400 uppercase tracking-widest">X-Chain Node</p>
                </div>
             </div>

             <div className="mt-12 space-y-6">
               <div className="bg-black/80 p-6 rounded-2xl border border-slate-800">
                 <p className="text-[10px] font-black text-slate-500 uppercase mb-4">Amount to Bridge</p>
                 <div className="flex justify-between items-center">
                   <input type="text" placeholder="0.00" className="bg-transparent text-3xl font-black text-white focus:outline-none w-1/2 mono" />
                   <select className="bg-slate-900 text-xs font-black p-2 rounded-xl border border-slate-800 outline-none">
                     <option>XCH</option>
                     <option>XAI</option>
                     <option>BTC</option>
                   </select>
                 </div>
               </div>
               
               <button 
                onClick={handleAction}
                disabled={isProcessing}
                className="w-full bg-cyan-500 text-black font-black py-6 rounded-2xl hover:bg-white transition-all uppercase tracking-[0.2em] text-sm shadow-[0_0_30px_rgba(6,182,212,0.4)]"
               >
                {isProcessing ? 'OPENING QUANTUM TUNNEL...' : 'INITIATE BRIDGE TRANSFER'}
               </button>
             </div>
          </div>
        </div>
      )}

      {activeTab === 'STAKE' && (
        <div className="flex-1 animate-fade-in">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
            <div className="glass-panel p-12 rounded-[3rem] border border-[#39ff14]/20 bg-black/60 flex flex-col justify-between">
              <div>
                <h3 className="text-2xl font-black radium-text uppercase italic tracking-tighter mb-4">Neural Growth Node</h3>
                <p className="text-slate-500 text-sm font-bold uppercase tracking-widest mb-10">Earn rewards by securing the MIGOXAI backbone.</p>
                
                <div className="grid grid-cols-2 gap-6 mb-10">
                  <div className="bg-slate-900/40 p-6 rounded-2xl border border-green-900/20">
                    <p className="text-[10px] font-black text-slate-500 uppercase mb-2">Current APY</p>
                    <p className="text-4xl font-black radium-text mono">24.5%</p>
                  </div>
                  <div className="bg-slate-900/40 p-6 rounded-2xl border border-green-900/20">
                    <p className="text-[10px] font-black text-slate-500 uppercase mb-2">Total Staked</p>
                    <p className="text-4xl font-black text-white mono">1.2M XAI</p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex justify-between items-center bg-black/40 p-4 rounded-xl border border-green-900/10">
                  <span className="text-xs font-bold text-slate-400">Lock Period</span>
                  <span className="text-xs font-black text-[#39ff14]">FLEXIBLE</span>
                </div>
                <button 
                  onClick={handleAction}
                  className="w-full bg-[#39ff14] text-black font-black py-6 rounded-2xl hover:bg-white transition-all uppercase tracking-[0.2em] text-sm shadow-[0_0_30px_rgba(57,255,20,0.4)]"
                >
                  DEPOSIT TO NODE
                </button>
              </div>
            </div>

            <div className="glass-panel p-12 rounded-[4rem] border border-slate-800 bg-black/40 flex flex-col">
              <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.4em] mb-10">Yield Projection</h3>
              <div className="flex-1 flex flex-col gap-6">
                {[
                  { time: '30 DAYS', yield: '+2.4k XAI', status: 'ESTIMATED' },
                  { time: '90 DAYS', yield: '+7.8k XAI', status: 'ESTIMATED' },
                  { time: '1 YEAR', yield: '+32.4k XAI', status: 'ESTIMATED' },
                ].map((row, i) => (
                  <div key={i} className="flex justify-between items-center p-6 bg-slate-900/20 border border-white/5 rounded-2xl group hover:border-[#39ff14]/20 transition-all">
                    <div>
                      <p className="text-[10px] font-black text-slate-600 uppercase mb-1">{row.time}</p>
                      <p className="text-2xl font-black text-white mono">{row.yield}</p>
                    </div>
                    <span className="text-[9px] font-black text-green-900 border border-green-950 px-2 py-1 rounded group-hover:text-[#39ff14] group-hover:border-[#39ff14] transition-all">
                      {row.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
      
      <footer className="flex justify-between items-center py-6 px-4 border-t border-green-900/10 mt-auto">
        <p className="text-[10px] font-black text-green-950 uppercase tracking-[0.5em] animate-pulse">
          MIGOXAI SECURE QUANTUM HUB ACTIVE // X-CHAIN TUNNEL: ANS=CORRECT
        </p>
        <div className="flex gap-10 text-[10px] font-black text-slate-700 uppercase">
          <span className="radium-text">Security: MAXIMUM</span>
          <span>Latency: 12ms</span>
          <span className="text-blue-900">Chain-Link: TRUE</span>
        </div>
      </footer>
    </div>
  );
};

export default WalletView;
