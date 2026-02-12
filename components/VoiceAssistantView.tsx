
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, Modality } from '@google/genai';
import { decode, encode, decodeAudioData } from '../utils/audio';

const VoiceAssistantView: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [transcript, setTranscript] = useState<string[]>([]);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const sessionRef = useRef<any>(null);
  const nextStartTimeRef = useRef<number>(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());

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
            
            // Microphone input processing
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
            // Handle transcriptions
            if (message.serverContent?.outputTranscription) {
              const text = message.serverContent.outputTranscription.text;
              setTranscript(prev => [...prev.slice(0, -1), (prev[prev.length - 1] || '') + text]);
            } else if (message.serverContent?.inputTranscription) {
              const text = message.serverContent.inputTranscription.text;
              setTranscript(prev => [...prev, `You: ${text}`]);
            }
            if (message.serverContent?.turnComplete) {
              setTranscript(prev => [...prev, ""]);
            }

            // Handle audio output
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
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } },
          },
          systemInstruction: 'You are a helpful and fast voice assistant. Keep responses naturally short for a spoken conversation.'
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
    <div className="flex flex-col h-full gap-6">
      <header>
        <h2 className="text-2xl font-bold">Live Voice Assistant</h2>
        <p className="text-slate-400">Low-latency conversational experience powered by Gemini 2.5 Native Audio.</p>
      </header>

      <div className="flex-1 glass-panel rounded-3xl p-12 flex flex-col items-center justify-center relative overflow-hidden">
        <div className={`w-48 h-48 rounded-full flex items-center justify-center transition-all duration-500 relative ${
          isActive ? 'bg-indigo-600/20' : 'bg-slate-800'
        }`}>
          {/* Pulsing rings for active state */}
          {isActive && (
            <>
              <div className="absolute inset-0 rounded-full border-4 border-indigo-500/50 animate-ping" />
              <div className="absolute inset-4 rounded-full border-4 border-indigo-400/30 animate-[ping_2s_linear_infinite]" />
            </>
          )}
          
          <button
            onClick={isActive ? stopSession : startSession}
            disabled={isConnecting}
            className={`w-32 h-32 rounded-full flex items-center justify-center text-4xl transition-all shadow-2xl z-10 ${
              isActive 
                ? 'bg-red-500 hover:bg-red-600 scale-110' 
                : 'bg-indigo-600 hover:bg-indigo-500 hover:scale-105'
            } disabled:opacity-50`}
          >
            {isConnecting ? '⏳' : isActive ? '⏹️' : '🎙️'}
          </button>
        </div>

        <div className="mt-12 text-center">
          <p className="text-xl font-medium">
            {isConnecting ? 'Establishing connection...' : isActive ? 'Listening...' : 'Ready to talk'}
          </p>
          <p className="text-slate-500 text-sm mt-2">
            {isActive ? 'Click to stop the conversation' : 'Click the microphone to start'}
          </p>
        </div>

        {/* Real-time Transcription Display */}
        {isActive && transcript.length > 0 && (
          <div className="absolute bottom-8 left-8 right-8 bg-slate-900/80 backdrop-blur rounded-xl p-4 border border-slate-700 max-h-32 overflow-y-auto">
            {transcript.map((line, i) => (
              <p key={i} className="text-sm text-slate-300">{line}</p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default VoiceAssistantView;
