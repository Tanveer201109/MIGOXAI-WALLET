
import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import { VideoGenerationState } from '../types';

const VideoGeneratorView: React.FC = () => {
  const [sourceImage, setSourceImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16'>('16:9');
  const [genState, setGenState] = useState<VideoGenerationState>({ status: 'idle' });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setSourceImage(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const generateVideo = async () => {
    // 1. Mandatory API Key selection for Veo
    // @ts-ignore
    if (!(await window.aistudio.hasSelectedApiKey())) {
      // @ts-ignore
      await window.aistudio.openSelectKey();
    }

    setGenState({ status: 'loading', message: 'Initiating Veo generation...' });

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const base64Data = sourceImage ? sourceImage.split(',')[1] : null;
      const mimeType = sourceImage ? sourceImage.split(',')[0].split(':')[1].split(';')[0] : null;

      let operation = await ai.models.generateVideos({
        model: 'veo-3.1-fast-generate-preview',
        prompt: prompt || 'Animate this photo with cinematic movement',
        ...(sourceImage ? {
          image: {
            imageBytes: base64Data!,
            mimeType: mimeType!
          }
        } : {}),
        config: {
          numberOfVideos: 1,
          resolution: '720p',
          aspectRatio
        }
      });

      // Status messages for better UX
      const statusMessages = [
        "Analyzing scene dynamics...",
        "Simulating fluid motions...",
        "Rendering textures and light...",
        "Polishing cinematic details...",
        "Finalizing high-quality MP4..."
      ];
      let msgIdx = 0;

      while (!operation.done) {
        setGenState({ 
          status: 'loading', 
          message: statusMessages[msgIdx % statusMessages.length] 
        });
        msgIdx++;
        await new Promise(resolve => setTimeout(resolve, 10000));
        operation = await ai.operations.getVideosOperation({ operation: operation });
      }

      const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
      const response = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
      const blob = await response.blob();
      const videoUrl = URL.createObjectURL(blob);

      setGenState({ status: 'completed', videoUrl });
    } catch (error: any) {
      console.error('Video gen error:', error);
      if (error.message?.includes("Requested entity was not found")) {
        // Reset key selection if it fails
        // @ts-ignore
        await window.aistudio.openSelectKey();
      }
      setGenState({ 
        status: 'error', 
        error: 'Generation failed. Please ensure you have a valid paid API key selected.' 
      });
    }
  };

  return (
    <div className="flex flex-col h-full gap-6">
      <header>
        <h2 className="text-2xl font-bold">Animate with Veo</h2>
        <p className="text-slate-400">Transform static photos into breathtaking videos with Veo 3.1.</p>
        <div className="mt-2 text-xs text-amber-400 bg-amber-900/20 px-3 py-1 rounded inline-block border border-amber-900/40">
          ⚠️ Requires selected API key from a paid project. 
          <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" className="underline ml-1">Learn more</a>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div className="glass-panel p-6 rounded-2xl flex flex-col gap-4">
            <h3 className="font-semibold">Step 1: Upload Frame</h3>
            <div className="aspect-video bg-slate-900/50 rounded-xl border-2 border-dashed border-slate-700 flex items-center justify-center relative hover:border-indigo-500 transition-colors cursor-pointer overflow-hidden">
              {sourceImage ? (
                <img src={sourceImage} className="w-full h-full object-contain" />
              ) : (
                <div className="text-center opacity-50">
                  <p className="text-4xl mb-2">📸</p>
                  <p className="text-sm">Click to upload photo</p>
                </div>
              )}
              <input type="file" accept="image/*" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" />
            </div>
            
            <h3 className="font-semibold mt-2">Step 2: Settings</h3>
            <div className="flex gap-2">
              <button 
                onClick={() => setAspectRatio('16:9')}
                className={`flex-1 py-2 rounded-lg border transition-all ${aspectRatio === '16:9' ? 'bg-indigo-600 border-indigo-400' : 'bg-slate-800 border-slate-700 text-slate-400'}`}
              >
                16:9 Landscape
              </button>
              <button 
                onClick={() => setAspectRatio('9:16')}
                className={`flex-1 py-2 rounded-lg border transition-all ${aspectRatio === '9:16' ? 'bg-indigo-600 border-indigo-400' : 'bg-slate-800 border-slate-700 text-slate-400'}`}
              >
                9:16 Portrait
              </button>
            </div>

            <textarea 
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe the movement... (e.g., 'Slow cinematic zoom into the mountains')"
              className="bg-slate-950 border border-slate-700 rounded-xl p-3 h-24 text-sm focus:outline-none focus:border-indigo-500"
            />

            <button 
              onClick={generateVideo}
              disabled={genState.status === 'loading'}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold py-4 rounded-xl shadow-xl transition-all active:scale-95 disabled:opacity-50"
            >
              {genState.status === 'loading' ? 'Generating...' : 'Start Animation'}
            </button>
          </div>
        </div>

        <div className="glass-panel rounded-2xl p-6 flex flex-col gap-4 min-h-[400px]">
          <h3 className="font-semibold text-slate-400 uppercase text-xs tracking-widest">Result Viewport</h3>
          <div className="flex-1 bg-black rounded-xl overflow-hidden flex items-center justify-center">
            {genState.status === 'loading' ? (
              <div className="text-center">
                <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
                <p className="text-xl font-bold animate-pulse">{genState.message}</p>
                <p className="text-slate-500 text-sm mt-2 italic">Generating videos usually takes 1-2 minutes.</p>
              </div>
            ) : genState.videoUrl ? (
              <video 
                src={genState.videoUrl} 
                controls 
                autoPlay 
                loop 
                className={`max-w-full max-h-full ${aspectRatio === '9:16' ? 'h-full object-cover' : 'w-full object-contain'}`}
              />
            ) : genState.error ? (
              <div className="text-center p-6 text-red-400">
                <p className="text-4xl mb-2">❌</p>
                <p>{genState.error}</p>
              </div>
            ) : (
              <div className="text-center opacity-30">
                <p className="text-6xl mb-4">🎬</p>
                <p>Your video will appear here</p>
              </div>
            )}
          </div>
          {genState.videoUrl && (
            <a 
              href={genState.videoUrl} 
              download="omni-genius-video.mp4"
              className="text-center text-indigo-400 hover:text-indigo-300 text-sm font-medium"
            >
              ⬇️ Download MP4
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoGeneratorView;
