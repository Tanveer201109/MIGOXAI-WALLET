
import React, { useState } from 'react';

type WalletTab = 'PORTFOLIO' | 'SWAP' | 'BRIDGE' | 'STAKE';

const WalletView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<WalletTab>('PORTFOLIO');
  const [isProcessing, setIsProcessing] = useState(false);
  
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

  const handleAction = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      alert("QUANTUM TRANSACTION COMMITTED: ANS=CORRECT");
    }, 2000);
  };

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
        <p className="text-slate-500 font-bold tracking-[0.3em] text-[10px] uppercase ml-1">Quantum-Encrypted Asset Hub | v4.5.0-STABLE</p>
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
              <h3 className="text-xs font-black text-green-900 uppercase tracking-[0.4em] mb-10">Asset Inventory</h3>
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

            <div className="glass-panel p-12 rounded-[3rem] border border-slate-800 bg-black/40 flex flex-col">
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
