
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, Modality, Type, FunctionDeclaration } from '@google/genai';
import { decode, encode, decodeAudioData } from '../utils/audio';

const VoiceAssistantView: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [transcript, setTranscript] = useState<string[]>([]);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const sessionRef = useRef<any>(null);
  const nextStartTimeRef = useRef<number>(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());

  // Function declaration for RPC interaction
  const rpcStatusFunction: FunctionDeclaration = {
    name: 'get_rpc_node_status',
    parameters: {
      type: Type.OBJECT,
      description: 'Get the current status, name, and block height of the primary RPC node.',
      properties: {},
    },
  };

  const startSession = async () => {
    setIsConnecting(true);
    setTranscript([]);
    
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      const inputAudioContext = new AudioContext({ sampleRate: 16000 });
      const outputAudioContext = new AudioContext({ sampleRate: 24000 });
      audioContextRef.current = outputAudioContext;

      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
        callbacks: {
          onopen: () => {
            setIsActive(true);
            setIsConnecting(false);
            
            const source = inputAudioContext.createMediaStreamSource(stream);
            const scriptProcessor = inputAudioContext.createScriptProcessor(4096, 1, 1);
            
            scriptProcessor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const l = inputData.length;
              const int16 = new Int16Array(l);
              for (let i = 0; i < l; i++) {
                int16[i] = inputData[i] * 32768;
              }
              const pcmBlob = {
                data: encode(new Uint8Array(int16.buffer)),
                mimeType: 'audio/pcm;rate=16000',
              };
              
              sessionPromise.then((session) => {
                session.sendRealtimeInput({ media: pcmBlob });
              });
            };
            
            source.connect(scriptProcessor);
            scriptProcessor.connect(inputAudioContext.destination);
          },
          onmessage: async (message: any) => {
            // Handle Function Calls
            if (message.toolCall) {
              for (const fc of message.toolCall.functionCalls) {
                if (fc.name === 'get_rpc_node_status') {
                  const savedNodes = localStorage.getItem('migoxai_rpc_nodes');
                  const nodes = savedNodes ? JSON.parse(savedNodes) : [];
                  const primary = nodes.find((n: any) => n.isPrimary) || nodes[0];
                  
                  const result = primary 
                    ? `Primary node ${primary.name} is ${primary.status} at block height ${primary.blockCount || 'unknown'}. URL is ${primary.url}.`
                    : "No RPC nodes are currently configured in the buffer.";

                  sessionPromise.then((session) => {
                    session.sendToolResponse({
                      functionResponses: {
                        id: fc.id,
                        name: fc.name,
                        response: { status: result },
                      }
                    });
                  });
                }
              }
            }

            if (message.serverContent?.outputTranscription) {
              const text = message.serverContent.outputTranscription.text;
              setTranscript(prev => [...prev.slice(0, -1), (prev[prev.length - 1] || '') + text]);
            } else if (message.serverContent?.inputTranscription) {
              const text = message.serverContent.inputTranscription.text;
              setTranscript(prev => [...prev, `OP: ${text}`]);
            }
            if (message.serverContent?.turnComplete) {
              setTranscript(prev => [...prev, ""]);
            }

            const base64Audio = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (base64Audio) {
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, outputAudioContext.currentTime);
              const audioBuffer = await decodeAudioData(decode(base64Audio), outputAudioContext, 24000, 1);
              const source = outputAudioContext.createBufferSource();
              source.buffer = audioBuffer;
              source.connect(outputAudioContext.destination);
              source.addEventListener('ended', () => sourcesRef.current.delete(source));
              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current += audioBuffer.duration;
              sourcesRef.current.add(source);
            }

            if (message.serverContent?.interrupted) {
              sourcesRef.current.forEach(s => s.stop());
              sourcesRef.current.clear();
              nextStartTimeRef.current = 0;
            }
          },
          onerror: (e) => console.error('Live API Error:', e),
          onclose: () => stopSession(),
        },
        config: {
          responseModalities: [Modality.AUDIO],
          outputAudioTranscription: {},
          inputAudioTranscription: {},
          tools: [{ functionDeclarations: [rpcStatusFunction] }],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Charon' } },
          },
          systemInstruction: 'You are the MIGOXAI Voice Link. You can control and query RPC Parameters. Keep responses extremely concise, authoritative, and technical. You are a secure AI terminal.'
        },
      });

      sessionRef.current = await sessionPromise;
    } catch (err) {
      console.error('Failed to start session:', err);
      setIsConnecting(false);
    }
  };

  const stopSession = () => {
    if (sessionRef.current) {
      sessionRef.current.close();
      sessionRef.current = null;
    }
    setIsActive(false);
    setIsConnecting(false);
  };

  return (
    <div className="flex flex-col h-full gap-8 animate-fade-in">
      <header className="flex flex-col gap-1">
        <h2 className="text-4xl font-black radium-text uppercase italic tracking-tighter">Voice Link</h2>
        <p className="text-slate-500 font-bold tracking-[0.4em] text-[10px] uppercase ml-1">Native Audio Protocol // RPC Controller Node</p>
      </header>

      <div className="flex-1 glass-panel rounded-[3rem] p-16 flex flex-col items-center justify-center relative overflow-hidden border border-[#39ff14]/10 shadow-inner bg-gradient-to-b from-black/20 to-transparent">
        <div className={`w-80 h-80 rounded-full flex items-center justify-center transition-all duration-700 relative ${
          isActive ? 'bg-[#39ff14]/5 border border-[#39ff14]/20 radium-glow' : 'bg-black/40 border border-slate-800'
        }`}>
          {isActive && (
            <>
              <div className="absolute inset-0 rounded-full border-2 border-[#39ff14]/30 animate-ping" />
              <div className="absolute inset-12 rounded-full border-2 border-[#39ff14]/10 animate-[ping_4s_linear_infinite]" />
              {/* Spectral Visualizer Mock */}
              <div className="absolute inset-0 flex items-center justify-center gap-1 opacity-40">
                {[...Array(12)].map((_, i) => (
                  <div key={i} className="w-1 bg-[#39ff14] animate-[bounce_1s_infinite]" style={{ height: `${Math.random() * 40 + 20}%`, animationDelay: `${i * 0.1}s` }} />
                ))}
              </div>
            </>
          )}
          
          <button
            onClick={isActive ? stopSession : startSession}
            disabled={isConnecting}
            className={`w-52 h-52 rounded-full flex flex-col items-center justify-center transition-all shadow-2xl z-10 ${
              isActive 
                ? 'bg-red-600 shadow-[0_0_50px_rgba(220,38,38,0.5)] hover:bg-red-500 scale-105' 
                : 'bg-[#0f3d0e] hover:bg-[#1a4a1a] radium-glow radium-border border-2'
            } disabled:opacity-20 active:scale-95`}
          >
            <span className="text-7xl mb-2">{isConnecting ? '⏳' : isActive ? '⏹️' : '🎙️'}</span>
            <span className="text-[11px] font-black uppercase tracking-widest text-white">
              {isConnecting ? 'Syncing...' : isActive ? 'Disconnect' : 'Secure Link'}
            </span>
          </button>
        </div>

        <div className="mt-16 text-center">
          <p className="text-3xl font-black radium-text tracking-tighter uppercase italic">
            {isConnecting ? 'Establishing Tunnel...' : isActive ? 'Neural Feed Active' : 'Voice Link Ready'}
          </p>
          <p className="text-slate-600 text-[10px] mt-4 font-black uppercase tracking-[0.5em]">
            {isActive ? 'Awaiting Vocal Directives' : 'Initialize to query RPC parameters'}
          </p>
        </div>

        {isActive && transcript.length > 0 && (
          <div className="absolute bottom-12 left-12 right-12 bg-black/80 backdrop-blur-2xl rounded-[2rem] p-8 border border-[#39ff14]/10 max-h-56 overflow-y-auto custom-scroll shadow-2xl">
            <div className="flex flex-col gap-3">
              {transcript.filter(t => t.trim()).map((line, i) => (
                <div key={i} className={`flex gap-4 ${line.startsWith('OP:') ? 'border-l-2 border-[#39ff14]/40 pl-4' : 'border-l-2 border-white/20 pl-4 opacity-80'}`}>
                  <span className={`text-[9px] font-black uppercase tracking-widest ${line.startsWith('OP:') ? 'text-[#39ff14]' : 'text-slate-500'}`}>
                    {line.startsWith('OP:') ? 'Operator' : 'AI'}
                  </span>
                  <p className={`text-sm font-bold mono ${line.startsWith('OP:') ? 'text-white' : 'radium-text italic'}`}>
                    {line.startsWith('OP:') ? line.replace('OP:', '') : line}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-3 gap-6">
        <div className="glass-panel p-6 rounded-2xl border border-white/5 flex flex-col items-center">
           <span className="text-[9px] font-black text-slate-600 uppercase mb-2">Modality</span>
           <span className="text-xs font-black text-white">Native Audio</span>
        </div>
        <div className="glass-panel p-6 rounded-2xl border border-white/5 flex flex-col items-center">
           <span className="text-[9px] font-black text-slate-600 uppercase mb-2">Protocol</span>
           <span className="text-xs font-black radium-text">Gemini 2.5 Flash</span>
        </div>
        <div className="glass-panel p-6 rounded-2xl border border-white/5 flex flex-col items-center">
           <span className="text-[9px] font-black text-slate-600 uppercase mb-2">Integrity</span>
           <span className="text-xs font-black text-green-500 animate-pulse">TRUE</span>
        </div>
      </div>
    </div>
  );
};

export default VoiceAssistantView;
