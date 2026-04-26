
import React, { useState, useEffect } from 'react';

interface RpcNode {
  id: string;
  name: string;
  url: string;
  gateway: 'GOOGLE' | 'MICROSOFT' | 'XAI-NET' | 'CUSTOM' | 'TATUM';
  latency: number;
  status: 'ONLINE' | 'OFFLINE' | 'SYNCING';
  version: string;
  isUserOwned?: boolean;
  isPrimary?: boolean;
  apiKey?: string;
  blockCount?: number;
  lastResponse?: string;
}

interface RpcEndpointsViewProps {
  onBack: () => void;
}

const DEFAULT_NODES: RpcNode[] = [
  { 
    id: 'tatum-core', 
    name: 'MIGOX-TATUM-PRIMARY', 
    url: 'https://migoxai-9160f6ed.gateway.tatum.io/', 
    gateway: 'TATUM', 
    apiKey: 't-6989e9664f6f4e3435d62281-0ac21b66ba86486489bbca7f',
    latency: 8, 
    status: 'ONLINE', 
    version: 'v4.6.0-SECURE', 
    isUserOwned: true,
    isPrimary: true 
  },
  { 
    id: 'google-chain-01', 
    name: 'Google Cloud Relay', 
    url: 'https://google-chain.migoxai.io/rpc/v1', 
    gateway: 'GOOGLE', 
    latency: 14, 
    status: 'ONLINE', 
    version: 'v1.2-CLOUD', 
    isUserOwned: false 
  },
  { 
    id: 'microsoft-node-01', 
    name: 'Azure Microsoft Node', 
    url: 'https://microsoft-chain.migoxai.io/rpc/v1', 
    gateway: 'MICROSOFT', 
    latency: 18, 
    status: 'ONLINE', 
    version: 'v1.5-AZURE', 
    isUserOwned: false 
  },
  { 
    id: 'xai-01', 
    name: 'X-Chain Neural Hub', 
    url: 'https://x-chain.migoxai.io/rpc', 
    gateway: 'XAI-NET', 
    latency: 12, 
    status: 'ONLINE', 
    version: 'v2.1-NEURAL', 
    isUserOwned: false 
  },
];

const RpcEndpointsView: React.FC<RpcEndpointsViewProps> = ({ onBack }) => {
  const [nodes, setNodes] = useState<RpcNode[]>(() => {
    const saved = localStorage.getItem('migoxai_rpc_nodes');
    return saved ? JSON.parse(saved) : DEFAULT_NODES;
  });

  const [isAddingNode, setIsAddingNode] = useState(false);
  const [newNode, setNewNode] = useState({
    name: '',
    url: '',
    gateway: 'CUSTOM' as any,
    apiKey: ''
  });

  const [isDiagnosing, setIsDiagnosing] = useState<string | null>(null);
  const [integrityStatus, setIntegrityStatus] = useState('ANS=CORRECT');

  useEffect(() => {
    localStorage.setItem('migoxai_rpc_nodes', JSON.stringify(nodes));
  }, [nodes]);

  const handleAddNode = () => {
    if (!newNode.name || !newNode.url) return;
    
    const node: RpcNode = {
      id: `custom-${Date.now()}`,
      name: newNode.name.toUpperCase(),
      url: newNode.url,
      gateway: newNode.gateway,
      apiKey: newNode.apiKey,
      latency: 0,
      status: 'SYNCING',
      version: 'v1.0-USER',
      isUserOwned: true
    };

    setNodes(prev => [...prev, node]);
    setIsAddingNode(false);
    setNewNode({ name: '', url: '', gateway: 'CUSTOM', apiKey: '' });
    testNode(node);
  };

  const testNode = async (node: RpcNode) => {
    setIsDiagnosing(node.id);
    try {
      // Simulate RPC call to Tatum/Custom gateway
      await new Promise(res => setTimeout(res, 1500));
      
      setNodes(prev => prev.map(n => 
        n.id === node.id 
          ? { 
              ...n, 
              status: 'ONLINE', 
              blockCount: Math.floor(Math.random() * 1000000) + 8000000, 
              latency: Math.floor(Math.random() * 20 + 10),
              lastResponse: '{"jsonrpc":"2.0","result":"ANS=CORRECT"}'
            } 
          : n
      ));
    } catch (err) {
      setNodes(prev => prev.map(n => n.id === node.id ? { ...n, status: 'OFFLINE' } : n));
    } finally {
      setIsDiagnosing(null);
    }
  };

  const primaryNode = nodes.find(n => n.isPrimary) || nodes[0];

  return (
    <div className="flex flex-col h-full gap-8 animate-fade-in relative pb-12">
      <header className="flex flex-col gap-2 relative z-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button 
              onClick={onBack}
              className="text-2xl radium-text hover:scale-125 transition-all font-black px-4 py-2 bg-black/60 border border-[#39ff14]/20 rounded-xl"
            >
              &lt;&lt;
            </button>
            <h2 className="text-5xl font-black radium-text uppercase italic tracking-tighter">RPC REGISTRY</h2>
          </div>
          <div className="flex gap-4">
            <button 
              onClick={() => setIsAddingNode(true)}
              className="bg-[#39ff14] text-black font-black px-6 py-3 rounded-xl shadow-[0_0_20px_#39ff14] hover:bg-white transition-all uppercase text-[10px] tracking-widest"
            >
              + Register New Node
            </button>
            <div className="bg-black/80 border border-[#39ff14]/30 px-6 py-3 rounded-xl radium-glow flex items-center gap-4">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Neural Status:</span>
              <span className="text-sm font-black mono text-[#39ff14] animate-pulse">
                ANS=AUTOMATIC-CORRECTED
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Manual Add Modal */}
      {isAddingNode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xl p-4">
          <div className="glass-panel p-12 rounded-[3rem] border border-[#39ff14]/30 max-w-xl w-full radium-glow animate-fade-in">
             <h3 className="text-3xl font-black radium-text italic tracking-tighter uppercase mb-8">Node Manual Entry</h3>
             <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase ml-2">Node Alias</label>
                  <input 
                    className="w-full bg-black border border-green-900/40 rounded-2xl px-6 py-4 text-white font-black mono focus:border-[#39ff14] outline-none" 
                    placeholder="E.G. X-CHAIN-BACKBONE"
                    value={newNode.name}
                    onChange={e => setNewNode({...newNode, name: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase ml-2">RPC Endpoint URL</label>
                  <input 
                    className="w-full bg-black border border-green-900/40 rounded-2xl px-6 py-4 text-[#39ff14] font-black mono focus:border-[#39ff14] outline-none" 
                    placeholder="https://rpc.yournode.io"
                    value={newNode.url}
                    onChange={e => setNewNode({...newNode, url: e.target.value})}
                  />
                  <p className="text-[8px] text-slate-600 italic mt-1 ml-2">Suggested: https://migoxai-tunnel-02.gateway.tatum.io/</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase ml-2">Gateway</label>
                    <select 
                      className="w-full bg-black border border-green-900/40 rounded-2xl px-4 py-4 text-white font-black mono outline-none"
                      value={newNode.gateway}
                      onChange={e => setNewNode({...newNode, gateway: e.target.value as any})}
                    >
                      <option value="CUSTOM">CUSTOM</option>
                      <option value="TATUM">TATUM</option>
                      <option value="XAI-NET">XAI-NET</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase ml-2">Auth Key (Optional)</label>
                    <input 
                      type="password"
                      className="w-full bg-black border border-green-900/40 rounded-2xl px-6 py-4 text-white font-black mono focus:border-[#39ff14] outline-none" 
                      placeholder="••••••••"
                      value={newNode.apiKey}
                      onChange={e => setNewNode({...newNode, apiKey: e.target.value})}
                    />
                  </div>
                </div>
                
                <div className="flex gap-4 mt-10">
                  <button 
                    onClick={() => setIsAddingNode(false)}
                    className="flex-1 py-5 rounded-2xl border border-red-900/20 text-red-500 font-black uppercase text-[10px] tracking-widest hover:bg-red-900/10 transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleAddNode}
                    className="flex-1 py-5 rounded-2xl bg-[#39ff14] text-black font-black uppercase text-[10px] tracking-widest shadow-[0_0_20px_#39ff14] hover:bg-white transition-all"
                  >
                    Register Node
                  </button>
                </div>
             </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 flex-1 min-h-0">
        <div className="lg:col-span-2 flex flex-col gap-8">
          {/* Active Node Detail */}
          <div className="glass-panel rounded-[3rem] p-10 border border-[#39ff14]/20 relative overflow-hidden radium-glow bg-black/40">
             <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
               <div className="flex-1">
                 <div className="flex items-center gap-3 mb-4">
                   <span className="px-2 py-0.5 bg-green-950 border border-[#39ff14]/40 text-[9px] font-black text-[#39ff14] rounded uppercase tracking-widest">ACTIVE BACKBONE</span>
                   <span className="text-[10px] font-black text-slate-500 uppercase mono">{primaryNode.id}</span>
                 </div>
                 <h3 className="text-6xl font-black text-white italic tracking-tighter mb-4">{primaryNode.name}</h3>
                 <p className="text-xs font-bold text-slate-500 mono bg-black/60 p-3 rounded-xl border border-white/5 inline-block">{primaryNode.url}</p>
               </div>
               
               <div className="bg-black/80 p-8 rounded-[2.5rem] border border-[#39ff14]/10 flex gap-8 shadow-2xl">
                 <div className="text-center">
                   <p className="text-[9px] font-black text-slate-600 uppercase mb-1">Latency</p>
                   <p className="text-4xl font-black radium-text mono">{primaryNode.latency}ms</p>
                 </div>
                 <div className="text-center">
                   <p className="text-[9px] font-black text-slate-600 uppercase mb-1">Status</p>
                   <p className="text-4xl font-black text-white mono uppercase">{primaryNode.status}</p>
                 </div>
               </div>
             </div>
          </div>

          <div className="glass-panel rounded-[2rem] p-10 border border-green-900/10 flex-1 flex flex-col bg-black/20 overflow-hidden">
             <h3 className="text-xs font-black text-green-800 uppercase tracking-[0.4em] mb-8">Node Cluster Inventory</h3>
             <div className="overflow-y-auto custom-scroll flex-1 pr-4">
               {nodes.map(node => (
                 <div key={node.id} className="flex items-center justify-between p-6 mb-4 bg-black/40 rounded-2xl border border-white/5 hover:border-[#39ff14]/30 transition-all group">
                   <div className="flex items-center gap-6">
                     <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl bg-slate-900 border ${node.status === 'ONLINE' ? 'border-[#39ff14]/20' : 'border-red-900/20'}`}>
                       {node.gateway === 'TATUM' ? '📡' : node.gateway === 'XAI-NET' ? '🧠' : '🔗'}
                     </div>
                     <div>
                       <div className="flex items-center gap-3">
                         <h4 className="font-black text-white uppercase text-lg leading-none">{node.name}</h4>
                         {node.isUserOwned && <span className="text-[8px] font-black text-blue-500 border border-blue-900/40 px-1 rounded">USER</span>}
                       </div>
                       <p className="text-[10px] text-slate-600 mono mt-1 truncate max-w-[200px]">{node.url}</p>
                     </div>
                   </div>
                   <div className="flex items-center gap-8">
                     <div className="text-right">
                       <p className="text-xs font-black radium-text mono">{node.latency}ms</p>
                       <p className="text-[9px] font-black text-slate-700 uppercase">{node.status}</p>
                     </div>
                     <button 
                        onClick={() => testNode(node)}
                        className="p-3 bg-black border border-slate-800 rounded-xl text-slate-500 hover:text-[#39ff14] hover:border-[#39ff14] transition-all"
                     >
                       <svg className={`w-4 h-4 ${isDiagnosing === node.id ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
                     </button>
                   </div>
                 </div>
               ))}
             </div>
          </div>
        </div>

        {/* Diagnostics Log */}
        <div className="glass-panel rounded-[2.5rem] p-10 border border-green-900/10 flex flex-col bg-black/40">
           <h3 className="text-xs font-black text-green-800 uppercase tracking-[0.4em] mb-8">Registry Log</h3>
           <div className="flex-1 overflow-y-auto custom-scroll space-y-3 font-bold mono text-[9px]">
              <div className="text-green-900 italic">SYSTEM BOOT NODE: {primaryNode.id}</div>
              <div className="text-white">Uplink: TATUM_CORE v4.4.0</div>
              <div className="text-slate-600">ID: 882 | Method: getblockcount</div>
              <div className="text-blue-900">X-API-KEY: {primaryNode.apiKey ? 'REDACTED-STABLE' : 'NONE'}</div>
              
              {nodes.filter(n => n.isUserOwned).map(n => (
                <div key={n.id} className="pt-2 border-t border-white/5">
                  <span className="text-[#39ff14]">INJECT: {n.name} SUCCESS</span>
                  <div className="text-[8px] text-slate-600">{n.url}</div>
                </div>
              ))}
              
              <div className="mt-auto pt-10">
                <div className="p-5 bg-black rounded-2xl border border-green-900/20">
                   <p className="text-[10px] font-black text-green-900 uppercase tracking-widest mb-3">Sync Integrity</p>
                   <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden">
                     <div className="bg-[#39ff14] h-full w-[100%] shadow-[0_0_10px_#39ff14]"></div>
                   </div>
                </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default RpcEndpointsView;
