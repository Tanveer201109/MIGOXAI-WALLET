
import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";

const VideoAnalyzerView: React.FC = () => {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [result, setResult] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setVideoFile(file);
      setVideoPreview(URL.createObjectURL(file));
      setResult('');
    }
  };

  const analyzeVideo = async () => {
    if (!videoFile || !query.trim()) return;
    setIsProcessing(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      // Convert file to base64
      const reader = new FileReader();
      const base64Promise = new Promise<string>((resolve) => {
        reader.onload = () => resolve((reader.result as string).split(',')[1]);
      });
      reader.readAsDataURL(videoFile);
      const base64Data = await base64Promise;

      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: [
          {
            parts: [
              { inlineData: { data: base64Data, mimeType: videoFile.type } },
              { text: query }
            ]
          }
        ],
      });

      setResult(response.text || "No analysis generated.");
    } catch (error) {
      console.error('Video analysis failed:', error);
      setResult("ERROR: VIDEO DECRYPTION FAILED. NODE TIMEOUT.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col h-full gap-6">
      <header>
        <h2 className="text-3xl font-black radium-text uppercase">Video Insight</h2>
        <p className="text-slate-500 font-medium">Deep temporal analysis using Gemini 3 Pro vision-video reasoning.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-1 min-h-0">
        <div className="glass-panel p-6 rounded-3xl flex flex-col gap-4 border border-green-900/20">
          <h3 className="text-xs font-black text-green-700 uppercase tracking-[0.2em]">Source Feed</h3>
          <div className="flex-1 bg-black rounded-2xl border border-green-900/40 flex items-center justify-center relative overflow-hidden group">
            {videoPreview ? (
              <video src={videoPreview} controls className="max-w-full max-h-full" />
            ) : (
              <div className="text-center p-10 opacity-40">
                <p className="text-6xl mb-6">🎞️</p>
                <p className="font-bold radium-text">UPLOAD VIDEO FOR SCANNING</p>
              </div>
            )}
            <input 
              type="file" 
              accept="video/*" 
              onChange={handleFileChange}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
          </div>
        </div>

        <div className="glass-panel p-6 rounded-3xl flex flex-col gap-4 border border-green-900/20">
          <h3 className="text-xs font-black text-green-700 uppercase tracking-[0.2em]">Analysis Log</h3>
          <div className="flex-1 bg-black/50 rounded-2xl border border-green-900/10 p-5 overflow-y-auto">
            {isProcessing ? (
              <div className="h-full flex flex-col items-center justify-center gap-4">
                <div className="w-12 h-12 border-4 border-[#39ff14] border-t-transparent rounded-full animate-spin"></div>
                <p className="radium-text font-bold animate-pulse">DECODING VIDEO STREAM...</p>
              </div>
            ) : result ? (
              <div className="prose prose-invert max-w-none">
                <div className="whitespace-pre-wrap text-slate-300 font-medium leading-relaxed">{result}</div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center opacity-20 italic text-slate-500">
                Awaiting input data...
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-black p-4 rounded-3xl border border-green-900/30 flex flex-col md:flex-row gap-4 radium-shadow">
        <input 
          type="text" 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask about the video (e.g., 'Summarize key events', 'What happens at 0:30?')"
          className="flex-1 bg-transparent border-none focus:ring-0 px-4 py-2 text-green-400 font-bold placeholder:text-green-900"
        />
        <button 
          onClick={analyzeVideo}
          disabled={!videoFile || !query || isProcessing}
          className="bg-[#39ff14] hover:bg-[#2ecc11] disabled:opacity-20 text-black px-10 py-3 rounded-2xl font-black transition-all active:scale-95 uppercase tracking-widest shadow-lg"
        >
          ANALYZE
        </button>
      </div>
    </div>
  );
};

export default VideoAnalyzerView;
