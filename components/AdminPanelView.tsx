
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, Zap, Activity, Cpu, Database, Network, Power, Terminal, Lock, Unlock, Eye, EyeOff, AlertTriangle, CheckCircle2 } from 'lucide-react';

const AdminPanelView: React.FC = () => {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [isHandshaking, setIsHandshaking] = useState(false);
  const [isFlushing, setIsFlushing] = useState(false);
  const [handshakeStep, setHandshakeStep] = useState(0);
  const [error, setError] = useState('');
  const [showPasscode, setShowPasscode] = useState(false);
  
  const [hardSecureMode, setHardSecureMode] = useState(true);
  const [quantumStealth, setQuantumStealth] = useState(false);
  
  const [systemStats, setSystemStats] = useState({
    cpu: '14%',
    mem: '6.1GB / 64GB',
    net: '1.2 Gbps',
    uptime: '150:42:11',
    nodes: '8/10',
    thermal: '42°C'
  });

  const handshakeMessages = [
    "Establishing Neural Uplink...",
    "Scanning Bio-Metric Signature...",
    "Verifying Quantum Key...",
    "Deciphering Neural Pulse...",
    "Authenticating Node Root..."
  ];

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isHandshaking) {
      interval = setInterval(() => {
        setHandshakeStep((prev) => (prev < handshakeMessages.length - 1 ? prev + 1 : prev));
      }, 300);
    }
    return () => clearInterval(interval);
  }, [isHandshaking]);

  const handleHandshake = () => {
    if (!passcode) {
      setError('NEURAL PROTOCOL: KEY MISSING');
      return;
    }

    setIsHandshaking(true);
    setHandshakeStep(0);
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
    }, 1800);
  };

  const handleFlush = () => {
    setIsFlushing(true);
    setTimeout(() => {
      setIsFlushing(false);
    }, 1500);
  };

  const StatCard = ({ label, value, sub, icon: Icon, color = "text-[#39ff14]" }: any) => (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
      className="glass-panel p-6 rounded-2xl border border-green-900/20 relative group overflow-hidden bg-black/40"
    >
      <div className="absolute -bottom-4 -right-4 opacity-5 group-hover:scale-110 group-hover:opacity-10 transition-all duration-500">
        <Icon size={120} />
      </div>
      <div className="flex items-center gap-3 mb-4">
        <div className={`p-2 rounded-lg bg-black border border-green-900/30 ${color}`}>
          <Icon size={18} />
        </div>
        <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">{label}</p>
      </div>
      <p className={`text-3xl font-black ${color} mono mb-1`}>{value}</p>
      <p className="text-[9px] font-bold text-green-800 uppercase tracking-widest">{sub}</p>
    </motion.div>
  );

  if (!isAuthorized) {
    return (
      <div className="h-full flex items-center justify-center animate-fade-in p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-panel p-10 md:p-16 rounded-[3rem] border border-[#39ff14]/20 max-w-lg w-full radium-glow relative overflow-hidden bg-black/95 shadow-[0_0_100px_rgba(57,255,20,0.1)]"
        >
          {/* Neural Scan Line */}
          <AnimatePresence>
            {isHandshaking && (
              <motion.div 
                initial={{ top: '0%' }}
                animate={{ top: '100%' }}
                exit={{ opacity: 0 }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                className="absolute inset-x-0 h-1 bg-[#39ff14] z-50 shadow-[0_0_15px_#39ff14]"
              />
            )}
          </AnimatePresence>

          <div className="absolute top-0 left-0 w-full h-1 bg-[#39ff14]/20 overflow-hidden">
            <motion.div 
              className="h-full bg-[#39ff14]"
              initial={{ width: "0%" }}
              animate={{ width: isHandshaking ? "100%" : "0%" }}
              transition={{ duration: 1.8, ease: "easeInOut" }}
            />
          </div>
          
          <div className="text-center mb-12 relative z-10">
            <motion.div 
              animate={isHandshaking ? { 
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0],
                boxShadow: ["0 0 30px rgba(57,255,20,0.3)", "0 0 60px rgba(57,255,20,0.6)", "0 0 30px rgba(57,255,20,0.3)"]
              } : {}}
              transition={{ repeat: Infinity, duration: 2 }}
              className="w-24 h-24 bg-black border-2 border-[#39ff14] rounded-3xl mx-auto mb-8 flex items-center justify-center text-5xl shadow-[0_0_30px_rgba(57,255,20,0.3)]"
            >
              {isAuthorized ? <Unlock className="text-[#39ff14]" size={48} /> : <Lock className="text-[#39ff14]" size={48} />}
            </motion.div>
            <h2 className="text-4xl font-black radium-text italic tracking-tighter uppercase mb-2">Neural Handshake</h2>
            <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.4em]">ADMIN ACCESS REQUIRED</p>
          </div>

          <div className="space-y-6 relative z-10">
            <div className="space-y-4">
              <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest text-center block">Access Credential</label>
              <div className="relative group">
                <input 
                  type={showPasscode ? "text" : "password"}
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  placeholder="••••••••"
                  className={`w-full bg-black border ${error ? 'border-red-500' : 'border-green-900/30'} rounded-2xl px-6 py-4 text-center text-2xl tracking-[0.5em] text-[#39ff14] focus:border-[#39ff14] outline-none transition-all placeholder:text-green-900/30 font-black mono`}
                  onKeyDown={(e) => e.key === 'Enter' && handleHandshake()}
                  autoFocus
                />
                <button 
                  type="button"
                  onClick={() => setShowPasscode(!showPasscode)}
                  className="absolute right-6 top-1/2 -translate-y-1/2 text-green-900/50 hover:text-[#39ff14] transition-colors"
                >
                  {showPasscode ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
            
            <div className="min-h-[20px]">
              {isHandshaking ? (
                <motion.p 
                  key="handshake"
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }}
                  className="text-[#39ff14] text-[10px] font-black uppercase text-center mono animate-pulse"
                >
                  {handshakeMessages[handshakeStep]}
                </motion.p>
              ) : error ? (
                <motion.div 
                  initial={{ x: -10, opacity: 0 }} 
                  animate={{ x: 0, opacity: 1 }}
                  className="flex items-center justify-center gap-2 text-red-500"
                >
                  <AlertTriangle size={14} />
                  <p className="text-[10px] font-black uppercase tracking-tighter">{error}</p>
                </motion.div>
              ) : null}
            </div>

            <button 
              onClick={handleHandshake}
              disabled={isHandshaking}
              className="w-full bg-[#39ff14] text-black font-black py-5 rounded-2xl hover:bg-white transition-all uppercase tracking-[0.2em] text-sm shadow-[0_0_30px_rgba(57,255,20,0.4)] relative overflow-hidden group disabled:opacity-50"
            >
              <span className="relative z-10">{isHandshaking ? 'PROCESSING NEURAL SEED...' : 'INITIALIZE LINK'}</span>
              <div className="absolute inset-0 bg-white transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500 opacity-20"></div>
            </button>
          </div>

          <p className="mt-12 text-[8px] text-slate-700 font-black text-center uppercase tracking-widest leading-relaxed relative z-10">
            MIGOXAI Quantum Keyring v4.6<br/>
            Passcode Prompt: <span className="opacity-40">MIGO-882</span>
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col h-full gap-8 animate-fade-in pb-10"
    >
      <header className="flex flex-col gap-2">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <motion.div 
              whileHover={{ rotate: 360, transition: { duration: 1 } }}
              className="w-12 h-12 bg-[#39ff14] text-black rounded-xl flex items-center justify-center text-2xl shadow-[0_0_20px_rgba(57,255,20,0.5)]"
            >
              <Zap size={24} fill="currentColor" />
            </motion.div>
            <div>
              <h2 className="text-5xl font-black radium-text uppercase italic tracking-tighter leading-none">ADMIN HUB</h2>
              <div className="flex items-center gap-2 mt-1">
                <p className="text-slate-600 font-bold tracking-[0.4em] text-[9px] uppercase">Hard-Secure Control Node // ROOT-X882</p>
                <div className="w-1 h-1 rounded-full bg-green-500 animate-ping"></div>
              </div>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="bg-black/80 border border-green-900/40 px-6 py-3 rounded-xl flex items-center gap-3 radium-glow">
              <Activity size={12} className="text-[#39ff14]" />
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Integrity</span>
              <span className="text-xs font-black text-[#39ff14] mono">ANS=AUTOMATIC-CORRECTED</span>
            </div>
            <button 
              onClick={() => {
                setIsAuthorized(false);
                setPasscode('');
              }}
              className="group flex items-center gap-2 text-[10px] font-black bg-red-900/10 border border-red-900/40 text-red-500 px-6 py-2 rounded-xl hover:bg-red-500 hover:text-black transition-all uppercase tracking-widest shadow-lg shadow-red-950/20"
            >
              <Power size={14} />
              TERMINATE
            </button>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard label="Neural Load" value={systemStats.cpu} sub="Optimized Runtime" icon={Cpu} />
        <StatCard label="Quantized Mem" value="94%" sub={systemStats.mem} icon={Database} />
        <StatCard label="Bandwidth" value={systemStats.net} sub="Hyper-Stable" icon={Network} />
        <StatCard label="Core Temp" value={systemStats.thermal} sub="Thermal Flush: ACTIVE" icon={Activity} color="text-amber-500" />
        <StatCard label="X-Nodes" value={systemStats.nodes} sub="Decentralized Relay" icon={Terminal} color="text-blue-500" />
        <StatCard label="Active Ops" value="1" sub="Uptime: 15h" icon={Shield} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 flex-1">
        {/* System Overrides */}
        <div className="glass-panel rounded-[3rem] p-10 border border-green-900/10 bg-black/20 flex flex-col">
           <div className="flex items-center justify-between mb-10">
             <h3 className="text-xs font-black text-green-900 uppercase tracking-[0.5em] flex items-center gap-3">
               <span className="w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_8px_#f59e0b]"></span>
               Master Control
             </h3>
             <Lock size={14} className="text-green-900/50" />
           </div>
           
           <div className="space-y-4">
             <div className="bg-black/40 p-5 rounded-2xl border border-green-900/10 flex items-center justify-between hover:border-[#39ff14]/30 transition-colors">
                <div>
                  <p className="text-sm font-black text-white uppercase tracking-tight">Hard-Secure Mode</p>
                  <p className="text-[9px] font-black text-slate-600 uppercase">Neural filtering: ON</p>
                </div>
                <button 
                  onClick={() => setHardSecureMode(!hardSecureMode)}
                  className={`w-12 h-6 rounded-full transition-all relative ${hardSecureMode ? 'bg-[#39ff14]' : 'bg-slate-800'}`}
                >
                  <motion.div 
                    animate={{ left: hardSecureMode ? '1.5rem' : '0.25rem' }}
                    className="absolute top-1 w-4 h-4 rounded-full bg-black shadow-lg"
                  />
                </button>
             </div>

             <div className="bg-black/40 p-5 rounded-2xl border border-green-900/10 flex items-center justify-between hover:border-blue-500/30 transition-colors">
                <div>
                  <p className="text-sm font-black text-white uppercase tracking-tight">Quantum Stealth</p>
                  <p className="text-[9px] font-black text-slate-600 uppercase">Obfuscate traffic</p>
                </div>
                <button 
                  onClick={() => setQuantumStealth(!quantumStealth)}
                  className={`w-12 h-6 rounded-full transition-all relative ${quantumStealth ? 'bg-blue-500' : 'bg-slate-800'}`}
                >
                  <motion.div 
                    animate={{ left: quantumStealth ? '1.5rem' : '0.25rem' }}
                    className="absolute top-1 w-4 h-4 rounded-full bg-black"
                  />
                </button>
             </div>

             <div 
               onClick={handleFlush}
               className="bg-black/40 p-5 rounded-2xl border border-green-900/10 flex items-center justify-between group cursor-pointer hover:bg-red-500/5 transition-all"
             >
                <div>
                  <p className="text-sm font-black text-white uppercase tracking-tight">Flush Node Buffer</p>
                  <p className="text-[9px] font-black text-red-900 uppercase">{isFlushing ? 'PURGING NEURAL CACHE...' : 'Immediate Cache Clear'}</p>
                </div>
                <button 
                  disabled={isFlushing}
                  className={`bg-red-950/20 border border-red-900/40 text-red-500 text-[9px] font-black px-4 py-2 rounded-lg transition-all ${isFlushing ? 'opacity-50 animate-pulse' : 'hover:bg-red-600 hover:text-white'}`}
                >
                  {isFlushing ? 'BUSY' : 'FLUSH'}
                </button>
             </div>
           </div>

           <div className="mt-auto pt-10">
              <div className="p-6 bg-green-900/5 border border-green-900/20 rounded-2xl relative overflow-hidden group">
                 <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-100 transition-opacity">
                   <Terminal size={14} className="text-[#39ff14]" />
                 </div>
                 <p className="text-[10px] font-black text-green-900 uppercase tracking-widest mb-3">System Identity Hash</p>
                 <p className="text-[10px] font-bold text-slate-400 mono truncate opacity-60">SHA256: 0x82...F91E</p>
              </div>
           </div>
        </div>

        {/* Neural Feed Monitor */}
        <div className="lg:col-span-2 glass-panel rounded-[3rem] p-10 border border-[#39ff14]/10 bg-black/40 flex flex-col gap-8 overflow-hidden">
           <div className="flex justify-between items-center">
             <div className="flex items-center gap-4">
               <h3 className="text-xs font-black text-green-900 uppercase tracking-[0.5em] flex items-center gap-3">
                 <span className="w-2 h-2 rounded-full bg-[#39ff14] shadow-[0_0_8px_#39ff14]"></span>
                 Node Integrity Grid
               </h3>
               <span className="text-[8px] font-bold bg-[#39ff14]/10 text-[#39ff14] px-2 py-0.5 rounded border border-[#39ff14]/20 uppercase">Real-time</span>
             </div>
             <span className="text-[9px] font-black text-slate-600 mono uppercase tracking-widest">Global Status: ANS=AUTOMATIC-CORRECTED</span>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { name: "X-Chain Tunnel 02", host: "migoxai-tunnel-02.gateway.io", status: "PENDING", color: "blue" },
                { name: "Main Backbone", host: "migoxai-9160f6ed.gateway.io", status: "STABLE", color: "green" },
                { name: "Neural Relay 14", host: "migoxai-relay-14.gateway.io", status: "OFFLINE", color: "red" },
                { name: "Stealth Node X", host: "migoxai-hidden.gateway.io", status: "STABLE", color: "purple" },
              ].map((node, i) => (
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  key={i} 
                  className={`bg-black/60 border border-slate-800 p-5 rounded-2xl flex justify-between items-center group hover:border-${node.color}-500/50 transition-all cursor-default`}
                >
                  <div className="min-w-0">
                    <p className={`text-xs font-black mb-1 uppercase tracking-tight group-hover:text-${node.color}-400 transition-colors`}>{node.name}</p>
                    <div className="text-[8px] font-black text-slate-600 uppercase mono truncate">{node.host}</div>
                  </div>
                  <span className={`text-[8px] font-black px-2 py-1 rounded border uppercase ${
                    node.status === 'STABLE' ? 'bg-[#39ff14]/10 text-[#39ff14] border-[#39ff14]/20' :
                    node.status === 'PENDING' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20 animate-pulse' :
                    node.status === 'OFFLINE' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                    'bg-purple-500/10 text-purple-400 border-purple-500/20'
                  }`}>
                    {node.status}
                  </span>
                </motion.div>
              ))}
           </div>

           <div className="mt-auto bg-black border border-green-900/20 rounded-[2rem] p-8 relative group">
              <div className="flex justify-between items-center mb-6">
                <div className="flex flex-col gap-1">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Processing Density</p>
                  <p className="text-[8px] font-black text-green-900 uppercase">Global Neural Load</p>
                </div>
                <div className="flex gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#39ff14] animate-pulse"></div>
                  <div className="w-1.5 h-1.5 rounded-full bg-green-900"></div>
                  <div className="w-1.5 h-1.5 rounded-full bg-green-900"></div>
                </div>
              </div>
              <div className="h-32 flex items-end gap-1 px-2 relative">
                 <div className="absolute inset-x-0 top-1/2 border-t border-green-900/10 z-0"></div>
                 {[...Array(40)].map((_, i) => (
                   <motion.div 
                     key={i} 
                     initial={{ height: 0 }}
                     animate={{ height: `${Math.random() * 80 + 20}%` }}
                     transition={{ repeat: Infinity, repeatType: "reverse", duration: 1 + Math.random(), delay: i * 0.05 }}
                     className="flex-1 bg-green-950/40 rounded-t border-t border-green-900/40 z-10"
                   />
                 ))}
              </div>
           </div>
        </div>
      </div>
      
      <footer className="flex flex-col md:flex-row justify-between items-center gap-4 pt-10 px-4 border-t border-green-900/10 mt-auto opacity-50 hover:opacity-100 transition-opacity">
        <div className="flex items-center gap-3">
          <CheckCircle2 size={14} className="text-[#39ff14]" />
          <p className="text-[10px] font-black text-green-950 uppercase tracking-[0.5em]">
            MIGOXAI MASTER CONTROL // NODE REGISTRY v4.6
          </p>
        </div>
        <div className="flex gap-8 text-[10px] font-black text-slate-700 uppercase tracking-widest">
          <span className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
            Manual Node: ENABLED
          </span>
          <span className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-[#39ff14]"></div>
            Security: MAXIMUM
          </span>
          <span className="mono">0xAFF1..E09C</span>
        </div>
      </footer>
    </motion.div>
  );
};

export default AdminPanelView;
