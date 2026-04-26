
import React from 'react';
import { motion } from 'motion/react';
import { Shield, Zap, Globe, Cpu, UserPlus, LogIn, Mail } from 'lucide-react';

interface HomeViewProps {
  onLogin: () => void;
  onLegal: () => void;
}

const HomeView: React.FC<HomeViewProps> = ({ onLogin, onLegal }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden bg-black/40">
      {/* Background Decorative Elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#39ff14]/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-green-900/10 rounded-full blur-[100px] pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-4xl glass-panel p-12 md:p-20 rounded-[4rem] border border-[#39ff14]/20 relative z-10 radium-glow bg-black/80 shadow-[0_0_80px_rgba(57,255,20,0.15)]"
      >
        <div className="flex flex-col items-center text-center gap-8">
          <motion.div 
            whileHover={{ scale: 1.05, rotate: 5 }}
            className="w-24 h-24 bg-black border-2 border-[#39ff14] rounded-3xl flex items-center justify-center text-5xl shadow-[0_0_30px_rgba(57,255,20,0.4)] radium-glow animate-pulse mb-4"
          >
            🔋
          </motion.div>
          
          <div className="space-y-4">
            <h1 className="text-6xl md:text-8xl font-black radium-text uppercase italic tracking-tighter leading-none mb-4">
              MIGOXAI
            </h1>
            <p className="text-xl md:text-2xl text-slate-400 font-bold tracking-[0.3em] uppercase leading-relaxed max-w-2xl mx-auto">
              Hard-Secure <span className="text-[#39ff14]">Quantum Hub</span> for Neural Reasoning
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mt-12">
            {[
              { icon: Shield, label: 'Bulletproof', sub: 'E2E Encryption' },
              { icon: Zap, label: 'Quantum', sub: 'L3 Neural Link' },
              { icon: Globe, label: 'Decentralized', sub: 'P2P Edge Mesh' }
            ].map((feature, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -5 }}
                className="p-6 bg-black/40 border border-green-900/30 rounded-3xl group transition-all hover:border-[#39ff14]/50"
              >
                <feature.icon className="mx-auto text-green-900 group-hover:text-[#39ff14] mb-4 transition-colors" size={32} />
                <p className="text-xs font-black text-slate-500 uppercase tracking-widest">{feature.label}</p>
                <p className="text-[10px] text-green-900 uppercase tracking-tighter">{feature.sub}</p>
              </motion.div>
            ))}
          </div>

          <div className="w-full max-w-md space-y-4 mt-16">
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onLogin}
              className="w-full bg-[#39ff14] text-black font-black py-5 rounded-2xl flex items-center justify-center gap-4 hover:bg-white transition-all shadow-[0_0_40px_rgba(57,255,20,0.4)]"
            >
              <LogIn size={20} />
              <span className="uppercase tracking-[0.2em] text-sm">Initialize Neural Link</span>
            </motion.button>
            
            <div className="relative flex items-center py-4">
              <div className="flex-grow border-t border-green-900/20"></div>
              <span className="flex-shrink mx-4 text-green-900 text-[10px] font-black uppercase tracking-[0.5em]">Auth Protocols</span>
              <div className="flex-grow border-t border-green-900/20"></div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              {[
                { name: 'Google', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg', color: 'hover:bg-white/10' },
                { name: 'X', icon: 'https://abs.twimg.com/favicons/twitter.2.ico', color: 'hover:bg-white/10' }, // Standard X/Twitter icon
                { name: 'Facebook', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/facebook/facebook-original.svg', color: 'hover:bg-white/10' }
              ].map((provider) => (
                <motion.button
                  key={provider.name}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onLogin}
                  className={`flex flex-col items-center gap-3 p-4 bg-black/60 border border-green-900/20 rounded-2xl transition-all ${provider.color} hover:border-[#39ff14]/40`}
                >
                  <img src={provider.icon} alt={provider.name} className="w-6 h-6 grayscale hover:grayscale-0 transition-all opacity-50 hover:opacity-100" />
                  <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest">{provider.name}</span>
                </motion.button>
              ))}
            </div>
            
            <div className="pt-6">
              <button 
                onClick={onLogin}
                className="text-[9px] font-black text-[#39ff14]/40 hover:text-[#39ff14] transition-colors uppercase tracking-[0.4em] flex items-center justify-center gap-2 mx-auto"
              >
                <UserPlus size={12} />
                Create New Identity Node
              </button>
            </div>
          </div>
        </div>
        
        <div className="mt-20 pt-8 border-t border-green-900/10 flex justify-between items-center opacity-40">
           <div className="flex items-center gap-3">
             <Cpu size={14} className="text-green-900" />
             <span className="text-[8px] font-black text-slate-600 uppercase tracking-[0.5em]">System ID: NODE-882-X</span>
           </div>
           <div className="flex gap-4">
             <span 
               onClick={onLegal}
               className="text-[8px] font-black text-slate-800 uppercase tracking-widest hover:text-[#39ff14] cursor-pointer transition-colors"
             >
               Legal & Policy
             </span>
             <span className="text-[8px] font-black text-slate-800 uppercase tracking-widest hover:text-[#39ff14] cursor-pointer transition-colors">Manifesto</span>
             <span className="text-[8px] font-black text-slate-800 uppercase tracking-widest hover:text-[#39ff14] cursor-pointer transition-colors">Gateway</span>
           </div>
        </div>
      </motion.div>
      
      <div className="mt-8 text-[9px] font-black text-[#0f3d0e] uppercase tracking-[1em] animate-pulse">
        Transmitting Neural Feed...
      </div>
    </div>
  );
};

export default HomeView;
