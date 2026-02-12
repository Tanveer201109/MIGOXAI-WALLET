
import React, { useState } from 'react';
import { AppView } from './types';
import ImageEditorView from './components/ImageEditorView';
import VoiceAssistantView from './components/VoiceAssistantView';
import VideoGeneratorView from './components/VideoGeneratorView';
import ChatBotView from './components/ChatBotView';
import MapsGroundingView from './components/MapsGroundingView';
import VideoAnalyzerView from './components/VideoAnalyzerView';
import AudioTranscribeView from './components/AudioTranscribeView';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<AppView>(AppView.CHAT);

  const navItems = [
    { id: AppView.CHAT, label: 'Neural Chat', icon: '🧠' },
    { id: AppView.VOICE, label: 'Vocal Link', icon: '🎙️' },
    { id: AppView.IMAGE_EDIT, label: 'Nano Editor', icon: '🎨' },
    { id: AppView.VIDEO_GEN, label: 'Veo Animate', icon: '🎬' },
    { id: AppView.VIDEO_ANALYZE, label: 'Video Insight', icon: '📽️' },
    { id: AppView.AUDIO_TRANSCRIBE, label: 'Transcribe', icon: '📝' },
    { id: AppView.MAPS, label: 'Geo-Locate', icon: '📍' },
  ];

  const renderView = () => {
    switch (activeView) {
      case AppView.IMAGE_EDIT: return <ImageEditorView />;
      case AppView.VOICE: return <VoiceAssistantView />;
      case AppView.VIDEO_GEN: return <VideoGeneratorView />;
      case AppView.VIDEO_ANALYZE: return <VideoAnalyzerView />;
      case AppView.AUDIO_TRANSCRIBE: return <AudioTranscribeView />;
      case AppView.CHAT: return <ChatBotView />;
      case AppView.MAPS: return <MapsGroundingView />;
      default: return <ChatBotView />;
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen relative overflow-hidden">
      {/* Sidebar Navigation */}
      <nav className="w-full md:w-72 glass-panel p-6 flex flex-col gap-4 sticky top-0 md:h-screen z-10 border-r border-green-900/30">
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="w-12 h-12 bg-black border-2 border-[#39ff14] rounded-full flex items-center justify-center text-2xl shadow-[0_0_15px_rgba(57,255,20,0.4)] animate-pulse">
            🔋
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tighter radium-text">
              MIGOXAI
            </h1>
            <p className="text-[10px] text-green-700 font-bold uppercase tracking-widest">Secure Quantum Node</p>
          </div>
        </div>

        <div className="flex md:flex-col gap-2 overflow-x-auto md:overflow-x-visible pb-2 md:pb-0 scrollbar-hide">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 whitespace-nowrap min-w-max md:min-w-0 border border-transparent ${
                activeView === item.id 
                ? 'active-tab' 
                : 'text-slate-500 hover:text-green-400 hover:border-green-900/50 hover:bg-green-900/10'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="font-bold text-sm tracking-wide">{item.label}</span>
            </button>
          ))}
        </div>

        <div className="mt-auto hidden md:block">
          <div className="p-4 bg-black/40 rounded-2xl border border-green-900/30 text-[10px] radium-text font-bold">
             <div className="flex justify-between mb-1 opacity-60">
               <span>STATUS</span>
               <span className="animate-pulse">CONNECTED</span>
             </div>
             <div className="flex justify-between mb-1 opacity-60">
               <span>PROTOCOL</span>
               <span>v4.0.2</span>
             </div>
             <div className="mt-2 pt-2 border-t border-green-900/20 text-center">
               MIGOXAI NETWORK WALLET ACTIVE
             </div>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 p-4 md:p-10 bg-transparent overflow-y-auto">
        <div className="max-w-6xl mx-auto h-full">
          {renderView()}
        </div>
      </main>
    </div>
  );
};

export default App;
