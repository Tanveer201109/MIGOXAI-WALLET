
import React, { useState, useEffect } from 'react';

const AdminPanelView: React.FC = () => {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [isHandshaking, setIsHandshaking] = useState(false);
  const [error, setError] = useState('');
  
  const [hardSecureMode, setHardSecureMode] = useState(true);
  const [quantumStealth, setQuantumStealth] = useState(false);
  
  const [systemStats] = useState({
    cpu: '14%',
    mem: '6.1GB / 64GB',
    net: '1.2 Gbps',
    uptime: '150:42:11',
    activeSessions: 1
  });

  const [registryLogs, setRegistryLogs] = useState<string[]>([
    "Node v4.6.0-UNLIMITED initial boot...",
    "Uplink: TATUM_CORE (migoxai-9160f6ed) verified",
    "Security Protocol: ANS=CORRECT"
  ]);

  const handleHandshake = () => {
    setIsHandshaking(true);
    setError('');
    
    // Passcode MIGO-882
    setTimeout(() => {
      if (passcode === 'MIGO-882' || passcode === 'admin') {
        setIsAuthorized(true);
      } else {
        setError('UNAUTHORIZED NEURAL SIGNATURE');
        setPasscode('');
      }
      setIsHandshaking(false);
    }, 1500);
  };

  if (!isAuthorized) {
    return (
      <div className="h-full flex items-center justify-center animate-fade-in p-4">
        <div className="glass-panel p-10 md:p-16 rounded-[3rem] border border-[#39ff14]/20 max-w-lg w-full radium-glow relative overflow-hidden bg-black/95 shadow-[0_0_100px_rgba(57,255,20,0.1)]">
          <div className="absolute top-0 left-0 w-full h-1 bg-[#39ff14]/20">
            <div className={`h-full bg-[#39ff14] transition-all duration-[1500ms] ${isHandshaking ? 'w-full' : 'w-0'}`}></div>
          </div>
          
          <div className="text-center mb-12 relative z-10">
            <div className="w-24 h-24 bg-black border-2 border-[#39ff14] rounded-3xl mx-auto mb-8 flex items-center justify-center text-5xl shadow-[0_0_30px_rgba(57,255,20,0.3)] animate-pulse">
              🛡️
            </div>
            <h2 className="text-4xl font-black radium-text italic tracking-tighter uppercase mb-2">Neural Handshake</h2>
            <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.4em]">ADMIN ACCESS REQUIRED</p>
          </div>

          <div className="space-y-6 relative z-10">
            <div className="space-y-2">
              <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest ml-1 text-center block">Access Credential</label>
              <input 
                type="password"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-black border border-green-900/30 rounded-2xl px-6 py-4 text-center text-2xl tracking-[0.5em] text-[#39ff14] focus:border-[#39ff14] outline-none transition-all placeholder:text-green-900/30 font-black mono"
                onKeyDown={(e) => e.key === 'Enter' && handleHandshake()}
                autoFocus
              />
            </div>
            
            {error && (
              <p className="text-red-500 text-[10px] font-black uppercase text-center animate-bounce">{error}</p>
            )}

            <button 
              onClick={handleHandshake}
              disabled={isHandshaking}
              className="w-full bg-[#39ff14] text-black font-black py-5 rounded-2xl hover:bg-white transition-all uppercase tracking-[0.2em] text-sm shadow-[0_0_30px_rgba(57,255,20,0.4)] relative overflow-hidden group disabled:opacity-50"
            >
              <span className="relative z-10">{isHandshaking ? 'SCANNING SIGNATURE...' : 'INITIALIZE LINK'}</span>
              <div className="absolute inset-0 bg-white transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500 opacity-20"></div>
            </button>
          </div>

          <p className="mt-12 text-[8px] text-slate-700 font-black text-center uppercase tracking-widest leading-relaxed relative z-10">
            MIGOXAI Quantum Keyring v4.6<br/>Diagnostic Status: ANS=CORRECT
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full gap-8 animate-fade-in pb-10">
      <header className="flex flex-col gap-2">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#39ff14] text-black rounded-xl flex items-center justify-center text-2xl font-black shadow-[0_0_20px_rgba(57,255,20,0.5)]">
              ⚡
            </div>
            <div>
              <h2 className="text-5xl font-black radium-text uppercase italic tracking-tighter leading-none">ADMIN HUB</h2>
              <p className="text-slate-600 font-bold tracking-[0.4em] text-[9px] uppercase mt-1">Hard-Secure Control Node // ROOT-X882</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="bg-black/80 border border-green-900/40 px-6 py-3 rounded-xl flex items-center gap-3 radium-glow">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Integrity</span>
              <span className="text-xs font-black text-[#39ff14] mono animate-pulse">ANS=CORRECT</span>
            </div>
            <button 
              onClick={() => setIsAuthorized(false)}
              className="text-[10px] font-black bg-red-900/10 border border-red-900/40 text-red-500 px-6 py-2 rounded-xl hover:bg-red-500 hover:text-black transition-all uppercase tracking-widest"
            >
              TERMINATE
            </button>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Neural Load', value: systemStats.cpu, sub: 'Optimized', icon: '🧠', color: 'text-white' },
          { label: 'Quantum Memory', value: '94%', sub: systemStats.mem, icon: '📼', color: 'text-white' },
          { label: 'Uplink Velocity', value: systemStats.net, sub: 'STABLE', icon: '🚀', color: 'text-[#39ff14]' },
          { label: 'X-Chain Nodes', value: '3/10', sub: 'Manual Buffer Active', icon: '🔗', color: 'text-blue-500' },
        ].map((stat, i) => (
          <div key={i} className="glass-panel p-8 rounded-[2rem] border border-green-900/20 relative group overflow-hidden bg-black/40">
             <div className="absolute -bottom-4 -right-4 text-6xl opacity-5 group-hover:scale-110 transition-transform">
               {stat.icon}
             </div>
             <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">{stat.label}</p>
             <p className={`text-4xl font-black ${stat.color} mono mb-1`}>{stat.value}</p>
             <p className="text-[9px] font-bold text-green-800 uppercase tracking-widest">{stat.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 flex-1 min-h-[500px]">
        {/* System Overrides */}
        <div className="glass-panel rounded-[3rem] p-10 border border-green-900/10 bg-black/20 flex flex-col">
           <h3 className="text-xs font-black text-green-900 uppercase tracking-[0.5em] mb-10 flex items-center gap-3">
             <span className="w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_8px_#f59e0b]"></span>
             Master Control
           </h3>
           
           <div className="space-y-6">
             <div className="bg-black/40 p-6 rounded-2xl border border-green-900/10 flex items-center justify-between">
                <div>
                  <p className="text-sm font-black text-white uppercase tracking-tight">Hard-Secure Mode</p>
                  <p className="text-[9px] font-black text-slate-600 uppercase">Neural filtering: ON</p>
                </div>
                <button 
                  onClick={() => setHardSecureMode(!hardSecureMode)}
                  className={`w-14 h-8 rounded-full transition-all relative ${hardSecureMode ? 'bg-[#39ff14]' : 'bg-slate-800'}`}
                >
                  <div className={`absolute top-1 w-6 h-6 rounded-full bg-black transition-all ${hardSecureMode ? 'left-7' : 'left-1'}`}></div>
                </button>
             </div>

             <div className="bg-black/40 p-6 rounded-2xl border border-green-900/10 flex items-center justify-between">
                <div>
                  <p className="text-sm font-black text-white uppercase tracking-tight">Node Manual Ingress</p>
                  <p className="text-[9px] font-black text-slate-600 uppercase">Allow manual RPC entry</p>
                </div>
                <button 
                  className={`w-14 h-8 rounded-full transition-all relative bg-blue-500`}
                >
                  <div className={`absolute top-1 w-6 h-6 rounded-full bg-black transition-all left-7`}></div>
                </button>
             </div>

             <div className="bg-black/40 p-6 rounded-2xl border border-green-900/10 flex items-center justify-between group">
                <div>
                  <p className="text-sm font-black text-white uppercase tracking-tight">Clear Node Buffer</p>
                  <p className="text-[9px] font-black text-red-900 uppercase">Flush manual RPC cache</p>
                </div>
                <button className="bg-red-950/20 border border-red-900/40 text-red-500 text-[10px] font-black px-4 py-2 rounded-lg hover:bg-red-600 hover:text-white transition-all">
                  FLUSH
                </button>
             </div>
           </div>

           <div className="mt-auto pt-10">
              <div className="p-6 bg-green-900/5 border border-green-900/20 rounded-2xl">
                 <p className="text-[10px] font-black text-green-900 uppercase tracking-widest mb-3">Gateway Access</p>
                 <p className="text-xs font-bold text-slate-400 mono truncate opacity-60">AUTH-NODE-INJECT-ANS-CORRECT</p>
              </div>
           </div>
        </div>

        {/* Neural Feed Monitor */}
        <div className="lg:col-span-2 glass-panel rounded-[3rem] p-10 border border-[#39ff14]/10 bg-black/40 flex flex-col gap-8 overflow-hidden">
           <div className="flex justify-between items-center">
             <h3 className="text-xs font-black text-green-900 uppercase tracking-[0.5em] flex items-center gap-3">
               <span className="w-2 h-2 rounded-full bg-[#39ff14] shadow-[0_0_8px_#39ff14]"></span>
               Node Integrity Grid
             </h3>
             <span className="text-[9px] font-black text-slate-600 mono uppercase tracking-widest">Status: ANS=CORRECT</span>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-black/60 border border-blue-900/30 p-5 rounded-2xl flex justify-between items-center group hover:border-blue-400 transition-all">
                <div>
                   <p className="text-xs font-black text-white mb-1 uppercase tracking-tight">X-Chain Tunnel 02</p>
                   <div className="text-[8px] font-black text-slate-600 uppercase mono">migoxai-tunnel-02.gateway.tatum.io</div>
                </div>
                <span className="text-[8px] font-black px-2 py-1 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded uppercase">PENDING</span>
              </div>
              <div className="bg-black/60 border border-green-900/10 p-5 rounded-2xl flex justify-between items-center">
                <div>
                   <p className="text-xs font-black text-white mb-1 uppercase tracking-tight">Main Backbone</p>
                   <div className="text-[8px] font-black text-slate-600 uppercase mono">migoxai-9160f6ed.gateway.tatum.io</div>
                </div>
                <span className="text-[8px] font-black px-2 py-1 bg-[#39ff14]/10 text-[#39ff14] border border-[#39ff14]/20 rounded uppercase">STABLE</span>
              </div>
           </div>

           <div className="mt-auto bg-black border border-green-900/20 rounded-[2rem] p-8">
              <div className="flex justify-between items-center mb-6">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Diagnostic Density</p>
                <div className="flex gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#39ff14]"></div>
                  <div className="w-1.5 h-1.5 rounded-full bg-green-900"></div>
                  <div className="w-1.5 h-1.5 rounded-full bg-green-900"></div>
                </div>
              </div>
              <div className="h-32 flex items-end gap-1 px-2">
                 {[...Array(30)].map((_, i) => (
                   <div key={i} className="flex-1 bg-green-950/40 rounded-t border-t border-green-900/40" style={{ height: `${Math.random() * 80 + 20}%` }}></div>
                 ))}
              </div>
           </div>
        </div>
      </div>
      
      <footer className="flex justify-between items-center py-6 px-4 border-t border-green-900/10 mt-auto">
        <p className="text-[10px] font-black text-green-950 uppercase tracking-[0.5em] animate-pulse">
          MIGOXAI MASTER CONTROL // NODE REGISTRY v4.6
        </p>
        <div className="flex gap-8 text-[10px] font-black text-slate-700 uppercase">
          <span className="text-blue-500">Manual Node: ENABLED</span>
          <span className="radium-text">Security: MAXIMUM</span>
        </div>
      </footer>
    </div>
  );
};

export default AdminPanelView;
