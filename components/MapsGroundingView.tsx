
import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";

const MapsGroundingView: React.FC = () => {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{ text: string, links: any[] } | null>(null);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setIsLoading(true);
    setResult(null);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      // Get current location
      let location = { latitude: 37.78193, longitude: -122.40476 }; // Default
      try {
        const pos = await new Promise<GeolocationPosition>((res, rej) => navigator.geolocation.getCurrentPosition(res, rej));
        location = { latitude: pos.coords.latitude, longitude: pos.coords.longitude };
      } catch (e) {
        console.warn("Location permission denied.");
      }

      // Per user request: Use gemini-2.5-flash for maps grounding
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: query,
        config: {
          tools: [{ googleMaps: {} }],
          toolConfig: {
            retrievalConfig: {
              latLng: location
            }
          }
        },
      });

      const text = response.text || "No geographic data found.";
      const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
      const mapsLinks = chunks
        .filter((c: any) => c.maps)
        .map((c: any) => ({
          title: c.maps.title,
          uri: c.maps.uri
        }));

      setResult({ text, links: mapsLinks });
    } catch (error) {
      console.error('Maps error:', error);
      alert('GEO-LINK ERROR: NODE UNREACHABLE.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full gap-6">
      <header>
        <h2 className="text-3xl font-black radium-text uppercase">Geo-Locate</h2>
        <p className="text-slate-500 font-medium">Real-time planetary grounding via Google Maps engine.</p>
      </header>

      <div className="glass-panel rounded-3xl p-3 flex border border-green-900/30 shadow-2xl focus-within:border-[#39ff14] transition-all">
        <input 
          type="text" 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          placeholder="SEARCH COORDINATES OR LOCATIONS..."
          className="flex-1 bg-transparent border-none focus:ring-0 px-5 py-3 text-green-400 font-bold placeholder:text-green-900"
        />
        <button 
          onClick={handleSearch}
          disabled={isLoading}
          className="bg-[#39ff14] hover:bg-[#2ecc11] disabled:opacity-20 text-black px-10 py-3 rounded-2xl font-black transition-all active:scale-95 uppercase"
        >
          {isLoading ? 'SCANNING' : 'LOCATE'}
        </button>
      </div>

      <div className="flex-1 glass-panel rounded-3xl p-8 overflow-y-auto border border-green-900/20">
        {isLoading ? (
          <div className="h-full flex flex-col items-center justify-center gap-6">
            <div className="w-16 h-16 border-4 border-[#39ff14] border-t-transparent rounded-full animate-spin"></div>
            <p className="radium-text font-black animate-pulse">TRIANGULATING POSITION...</p>
          </div>
        ) : result ? (
          <div className="space-y-8">
            <div className="prose prose-invert max-w-none">
              <div className="whitespace-pre-wrap leading-relaxed text-slate-300 font-medium text-lg">{result.text}</div>
            </div>
            
            {result.links.length > 0 && (
              <div className="pt-8 border-t border-green-900/20">
                <h3 className="text-[10px] font-black text-green-800 uppercase mb-6 tracking-[0.3em]">Verified Map Nodes</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {result.links.map((link, idx) => (
                    <a 
                      key={idx} 
                      href={link.uri} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-4 p-4 bg-black/40 rounded-2xl border border-green-900/20 hover:border-[#39ff14] transition-all group radium-shadow"
                    >
                      <div className="w-10 h-10 bg-green-900/20 rounded-lg flex items-center justify-center text-xl group-hover:scale-110 transition-transform">📍</div>
                      <div className="flex-1 overflow-hidden">
                        <p className="font-bold text-slate-200 truncate">{link.title}</p>
                        <p className="text-[10px] text-green-500 group-hover:underline uppercase font-bold">Launch Navigation</p>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center opacity-20 text-center px-10">
            <div className="text-8xl mb-8">🛰️</div>
            <p className="text-xl font-bold">AWAITING GEO-SPATIAL QUERY</p>
            <p className="mt-2 text-sm uppercase tracking-widest">Global positioning system active</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MapsGroundingView;
