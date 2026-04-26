
import React, { useState } from 'react';
import { AppView } from './types';
import ImageEditorView from './components/ImageEditorView';
import VoiceAssistantView from './components/VoiceAssistantView';
import VideoGeneratorView from './components/VideoGeneratorView';
import ChatBotView from './components/ChatBotView';
import MapsGroundingView from './components/MapsGroundingView';
import VideoAnalyzerView from './components/VideoAnalyzerView';
import AudioTranscribeView from './components/AudioTranscribeView';
import WalletView from './components/WalletView';
import RpcEndpointsView from './components/RpcEndpointsView';
import AdminPanelView from './components/AdminPanelView';
import LegalView from './components/LegalView';
import HomeView from './components/HomeView';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<AppView>(AppView.HOME);

  const navItems = [
    { id: AppView.ADMIN, label: 'Admin Hub', icon: '⚡' },
    { id: AppView.WALLET, label: 'Quantum Wallet', icon: '💳' },
    { id: AppView.RPC_ENDPOINTS, label: 'RPC Parameters', icon: '📡' },
    { id: AppView.CHAT, label: 'Reasoning Node', icon: '🧠' },
    { id: AppView.VOICE, label: 'Voice Link', icon: '🎙️' },
    { id: AppView.IMAGE_EDIT, label: 'Nano Editor', icon: '🎨' },
    { id: AppView.VIDEO_GEN, label: 'Veo Animate', icon: '🎬' },
    { id: AppView.VIDEO_ANALYZE, label: 'Insight Node', icon: '📽️' },
    { id: AppView.AUDIO_TRANSCRIBE, label: 'Audio Sync', icon: '📝' },
    { id: AppView.MAPS, label: 'Geo-Ground', icon: '📍' },
    { id: AppView.LEGAL, label: 'Legal Node', icon: '⚖️' },
  ];

  const renderView = () => {
    switch (activeView) {
      case AppView.ADMIN: return <AdminPanelView />;
      case AppView.WALLET: return <WalletView />;
      case AppView.RPC_ENDPOINTS: return <RpcEndpointsView onBack={() => setActiveView(AppView.WALLET)} />;
      case AppView.IMAGE_EDIT: return <ImageEditorView />;
      case AppView.VOICE: return <VoiceAssistantView />;
      case AppView.VIDEO_GEN: return <VideoGeneratorView />;
      case AppView.VIDEO_ANALYZE: return <VideoAnalyzerView />;
      case AppView.AUDIO_TRANSCRIBE: return <AudioTranscribeView />;
      case AppView.CHAT: return <ChatBotView />;
      case AppView.MAPS: return <MapsGroundingView />;
      case AppView.LEGAL: return <LegalView />;
      case AppView.HOME: return <HomeView onLogin={() => setActiveView(AppView.ADMIN)} onLegal={() => setActiveView(AppView.LEGAL)} />;
      default: return <AdminPanelView />;
    }
  };

  if (activeView === AppView.HOME) {
    return <HomeView onLogin={() => setActiveView(AppView.ADMIN)} onLegal={() => setActiveView(AppView.LEGAL)} />;
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen relative overflow-hidden">
      {/* Sidebar Navigation */}
      <nav className="w-full md:w-80 glass-panel p-8 flex flex-col gap-6 sticky top-0 md:h-screen z-20 border-r border-green-900/30">
        <div className="flex items-center gap-4 mb-12">
          <div className="w-14 h-14 bg-black border-2 border-[#39ff14] rounded-2xl flex items-center justify-center text-3xl shadow-[0_0_25px_rgba(57,255,20,0.5)] radium-glow animate-pulse">
            🔋
          </div>
          <div>
            <h1 className="text-3xl font-black tracking-tighter radium-text uppercase italic leading-none">
              MIGOXAI
            </h1>
            <p className="text-[10px] text-green-700 font-black uppercase tracking-widest mt-1">QUANTUM HARDSECURE</p>
          </div>
        </div>

        <div className="flex md:flex-col gap-2 overflow-x-auto md:overflow-x-visible pb-4 md:pb-0 scrollbar-hide">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={`flex items-center gap-4 px-6 py-4 rounded-xl transition-all duration-300 border border-transparent group whitespace-nowrap ${
                activeView === item.id 
                ? 'active-tab' 
                : 'text-slate-500 hover:text-[#39ff14] hover:bg-green-900/10 hover:border-green-900/20'
              }`}
            >
              <span className={`text-2xl transition-transform duration-300 ${activeView === item.id ? 'scale-110' : 'group-hover:scale-110'}`}>
                {item.icon}
              </span>
              <span className="font-black text-[11px] tracking-[0.15em] uppercase">{item.label}</span>
            </button>
          ))}
        </div>

        <div className="mt-auto hidden md:block">
          <div className="p-6 bg-black/40 rounded-[1.5rem] border border-green-900/30 text-[10px] font-black">
             <div className="flex justify-between mb-2">
               <span className="text-green-900 uppercase">System ID</span>
               <span className="text-slate-400 mono uppercase tracking-widest">Node-882-X</span>
             </div>
             <div className="flex justify-between mb-2">
               <span className="text-green-900 uppercase">Diagnostic</span>
               <span className="radium-text mono animate-pulse">ANS=CORRECT</span>
             </div>
             <div className="mt-4 pt-4 border-t border-green-900/20 text-center">
               <p className="text-slate-600 uppercase tracking-widest">Quantum Hub</p>
               <p className="text-[#39ff14]/40 mt-1">v4.5.0-SECURE</p>
             </div>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-12 overflow-y-auto relative z-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] bg-fixed">
        <div className="max-w-7xl mx-auto h-full">
          {renderView()}
        </div>
      </main>
    </div>
  );
};

export default App;
