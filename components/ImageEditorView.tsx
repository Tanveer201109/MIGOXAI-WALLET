
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
      alert('Failed to edit image. Ensure you are using a supported image type.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col h-full gap-6">
      <header>
        <h2 className="text-2xl font-bold text-white">GenAI Image Editor</h2>
        <p className="text-slate-400">Describe changes to your image using Gemini 2.5 Flash Image.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1 min-h-0">
        <div className="glass-panel rounded-2xl p-4 flex flex-col gap-4 overflow-hidden">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500">Source Image</h3>
          <div className="flex-1 bg-slate-900/50 rounded-xl border border-dashed border-slate-700 flex items-center justify-center relative group overflow-hidden">
            {originalImage ? (
              <img src={originalImage} alt="Source" className="max-w-full max-h-full object-contain" />
            ) : (
              <div className="text-center p-6">
                <p className="text-4xl mb-4">🖼️</p>
                <p className="text-slate-400">Click to upload or drag an image</p>
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

        <div className="glass-panel rounded-2xl p-4 flex flex-col gap-4 overflow-hidden">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500">Preview Result</h3>
          <div className="flex-1 bg-slate-900/50 rounded-xl border border-slate-800 flex items-center justify-center">
            {isProcessing ? (
              <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-indigo-400 font-medium">Processing your vision...</p>
              </div>
            ) : editedImage ? (
              <img src={editedImage} alt="Edited Result" className="max-w-full max-h-full object-contain" />
            ) : (
              <p className="text-slate-600">Enter a prompt and click "Apply Edit"</p>
            )}
          </div>
        </div>
      </div>

      <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 flex flex-col md:flex-row gap-4">
        <input 
          type="text" 
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g., 'Add a retro 80s filter', 'Make the background a beach', 'Remove the person'"
          className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors"
        />
        <button 
          onClick={handleEdit}
          disabled={!originalImage || !prompt || isProcessing}
          className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg active:scale-95 whitespace-nowrap"
        >
          Apply Edit
        </button>
      </div>
    </div>
  );
};

export default ImageEditorView;
