
import React, { useState, useRef } from 'react';
import { GoogleGenAI } from "@google/genai";

const AudioTranscribeView: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        transcribeAudio(audioBlob);
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Error accessing microphone:", err);
      alert("Microphone access denied.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const transcribeAudio = async (blob: Blob) => {
    setIsProcessing(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const reader = new FileReader();
      const base64Promise = new Promise<string>((resolve) => {
        reader.onload = () => resolve((reader.result as string).split(',')[1]);
      });
      reader.readAsDataURL(blob);
      const base64Data = await base64Promise;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [
          {
            parts: [
              { inlineData: { data: base64Data, mimeType: 'audio/webm' } },
              { text: "Transcribe the audio precisely. If multiple speakers, distinguish them." }
            ]
          }
        ],
      });

      setTranscript(response.text || "No transcription available.");
    } catch (error) {
      console.error('Transcription error:', error);
      setTranscript("NODE ERROR: AUDIO SYNC FAILED.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col h-full gap-8">
      <header>
        <h2 className="text-3xl font-black radium-text uppercase">Audio Transcribe</h2>
        <p className="text-slate-500 font-medium">Neural audio processing for rapid speech-to-text conversion.</p>
      </header>

      <div className="flex-1 glass-panel rounded-3xl p-10 flex flex-col items-center justify-center border border-green-900/20 relative">
        <div className={`w-64 h-64 rounded-full flex items-center justify-center transition-all duration-700 relative ${
          isRecording ? 'bg-[#39ff14]/10' : 'bg-black'
        } border-2 border-green-900/30`}>
          {isRecording && (
            <div className="absolute inset-0 rounded-full border-4 border-[#39ff14]/50 animate-ping" />
          )}
          
          <button
            onClick={isRecording ? stopRecording : startRecording}
            className={`w-40 h-40 rounded-full flex flex-col items-center justify-center transition-all shadow-2xl z-10 ${
              isRecording 
                ? 'bg-red-600 shadow-[0_0_30px_rgba(220,38,38,0.5)]' 
                : 'bg-[#0f3d0e] hover:bg-[#1a4a1a] radium-shadow'
            } border-2 border-[#39ff14]/40`}
          >
            <span className="text-5xl mb-2">{isRecording ? '⏹️' : '🎙️'}</span>
            <span className="text-[10px] font-black uppercase tracking-widest text-white">
              {isRecording ? 'Stop Session' : 'Start Capture'}
            </span>
          </button>
        </div>

        <div className="mt-12 text-center">
          <p className="text-2xl font-black radium-text tracking-tighter">
            {isRecording ? 'CAPTURING VOCAL DATA...' : 'SYSTEM READY'}
          </p>
          <p className="text-slate-500 text-sm mt-3 font-medium uppercase tracking-widest">
            {isRecording ? 'Streaming to neural node' : 'Initialize microphone to begin'}
          </p>
        </div>
      </div>

      <div className="glass-panel rounded-3xl p-6 min-h-[200px] border border-green-900/10">
        <h3 className="text-[10px] font-black text-green-800 uppercase tracking-widest mb-4">Transcript Output</h3>
        <div className="bg-black/40 rounded-2xl p-5 border border-green-900/20 min-h-[120px]">
          {isProcessing ? (
            <div className="flex items-center gap-3 animate-pulse">
              <div className="w-2 h-2 bg-[#39ff14] rounded-full"></div>
              <p className="text-sm font-bold text-green-600">PROCESSING NEURAL SYMBOLS...</p>
            </div>
          ) : transcript ? (
            <p className="text-slate-300 font-medium leading-relaxed italic">"{transcript}"</p>
          ) : (
            <p className="text-slate-700 text-sm italic">Capture audio to generate neural transcript.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AudioTranscribeView;
