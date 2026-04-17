
import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";

const ImageEditorView: React.FC = () => {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [editedImage, setEditedImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setOriginalImage(ev.target?.result as string);
        setEditedImage(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEdit = async () => {
    if (!originalImage || !prompt.trim()) return;
    setIsProcessing(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const base64Data = originalImage.split(',')[1];
      const mimeType = originalImage.split(',')[0].split(':')[1].split(';')[0];

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [
            { inlineData: { data: base64Data, mimeType } },
            { text: prompt }
          ],
        },
      });

      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          setEditedImage(`data:${mimeType};base64,${part.inlineData.data}`);
        }
      }
    } catch (error) {
      console.error('Image edit failed:', error);
      alert('SYSTEM ERROR: VISUAL SYNTHESIS FAILED.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col h-full gap-8 animate-fade-in">
      <header className="flex flex-col gap-1">
        <h2 className="text-4xl font-black radium-text uppercase italic tracking-tighter">Nano Editor</h2>
        <p className="text-slate-500 font-bold tracking-[0.4em] text-[10px] uppercase ml-1">Generative Image Node // Gemini 2.5 Flash Visual</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 flex-1 min-h-0">
        <div className="glass-panel rounded-[2.5rem] p-8 flex flex-col gap-6 border border-[#39ff14]/10 shadow-inner relative overflow-hidden group">
          <h3 className="text-[10px] font-black text-green-800 uppercase tracking-[0.3em] mb-2">Primary Input</h3>
          <div className="flex-1 bg-black/40 rounded-3xl border-2 border-dashed border-green-900/20 flex items-center justify-center relative hover:border-[#39ff14]/40 transition-all cursor-pointer overflow-hidden">
            {originalImage ? (
              <img src={originalImage} alt="Source" className="max-w-full max-h-full object-contain" />
            ) : (
              <div className="text-center p-10 opacity-30">
                <p className="text-7xl mb-6">🎞️</p>
                <p className="text-lg font-black tracking-widest">DRAG IMAGE OR CLICK</p>
              </div>
            )}
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleFileChange}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
          </div>
        </div>

        <div className="glass-panel rounded-[2.5rem] p-8 flex flex-col gap-6 border border-[#39ff14]/10 shadow-inner relative overflow-hidden">
          <h3 className="text-[10px] font-black text-green-800 uppercase tracking-[0.3em] mb-2">Synthesized Result</h3>
          <div className="flex-1 bg-black/60 rounded-3xl border border-slate-900 flex items-center justify-center relative">
            {isProcessing ? (
              <div className="flex flex-col items-center gap-6">
                <div className="w-16 h-16 border-4 border-[#39ff14] border-t-transparent rounded-full animate-spin shadow-[0_0_20px_rgba(57,255,20,0.4)]"></div>
                <p className="radium-text font-black uppercase tracking-widest text-sm animate-pulse">Processing Pixels...</p>
              </div>
            ) : editedImage ? (
              <img src={editedImage} alt="Edited Result" className="max-w-full max-h-full object-contain radium-glow" />
            ) : (
              <div className="text-center p-10 opacity-20 italic font-medium">
                Awaiting Command...
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-black/80 p-5 rounded-[2.5rem] border border-[#39ff14]/20 flex flex-col md:flex-row gap-5 radium-glow">
        <input 
          type="text" 
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="E.G., 'APPLY RADIUM GREEN FILTER', 'REPLACE BACKGROUND WITH CYBERPUNK CITY'..."
          className="flex-1 bg-transparent border border-slate-900 rounded-2xl px-6 py-4 text-white font-bold mono focus:outline-none focus:border-[#39ff14] transition-all placeholder:text-green-950"
        />
        <button 
          onClick={handleEdit}
          disabled={!originalImage || !prompt || isProcessing}
          className="bg-[#39ff14] hover:bg-white disabled:opacity-10 text-black px-12 py-4 rounded-[1.5rem] font-black transition-all active:scale-95 uppercase tracking-widest text-sm shadow-[0_0_20px_rgba(57,255,20,0.6)]"
        >
          Execute Edit
        </button>
      </div>
    </div>
  );
};

export default ImageEditorView;
