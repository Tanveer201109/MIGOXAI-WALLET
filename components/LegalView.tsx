
import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldAlert, BookOpen, Scale, FileText, ChevronRight, Gavel, ShieldCheck } from 'lucide-react';

const LegalView: React.FC = () => {
  const [activeDoc, setActiveDoc] = useState<'LICENSE' | 'PRIVACY' | 'TERMS'>('TERMS');

  const docs = {
    TERMS: {
      title: 'Terms of Service',
      icon: Scale,
      content: `
# Terms of Service

**Effective Date: April 26, 2026**

By accessing or using MIGOXAI Quantum Hub, you agree to be bound by these Terms of Service.

## 1. Non-Custodial Nature
MIGOXAI is a decentralized interface. You acknowledge that you are solely responsible for the security of your wallet, seed phrases, and neural keys. We cannot recover lost assets or passwords.

## 2. Prohibited Uses
You agree not to use the application for:
- Illegal money laundering or terrorist financing.
- Exploiting or bypassing neural security protocols.
- Reverse-engineering the MIGOXAI backbone.

## 3. Limitation of Liability
MIGOXAI is provided "as is" without any warranties. We are not liable for any losses resulting from market volatility, smart contract bugs, or lost access to neural signatures.

## 4. Governing Law
These terms are governed by the laws of the jurisdiction in which the user resides, subject to international decentralized protocol standards.

## 5. Modifications
We reserve the right to update these terms as the Quantum Hub evolves. Continued use constitutes acceptance of the new terms.
      `
    },
    PRIVACY: {
      title: 'Privacy Policy',
      icon: ShieldCheck,
      content: `
# Privacy Policy

**Last Updated: April 26, 2026**

MIGOXAI Quantum Hub ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your information when you use our decentralized application.

## 1. Information Collection
We do not collect personal identification information (PII) such as your name, email address, or physical address unless explicitly provided by you (e.g., through Google or Microsoft OAuth integrations). 

## 2. Wallet & Private Keys
MIGOXAI is a non-custodial application. We NEVER store your private keys, seed phrases, or neural signatures on our servers. All sensitive cryptographic data is stored locally in your browser's secure storage or managed through third-party providers (MetaMask, Google Keyring) if selected.

## 3. Data Processing
We use Google Gemini AI for processing neural requests. Your data is sent to Google's API for real-time analysis but is not used for training models unless you opt-in through Google's own service agreements.

## 4. Third-Party Services
We integrate with:
- **Google GenAI:** For AI capabilities.
- **MetaMask/Web3 Providers:** For blockchain interactions.
- **Vercel/Cloud Run:** For hosting and infrastructure.

## 5. Security
We implement "Quantum Stealth" protocols and neural filtering to obfuscate traffic and protect user integrity. However, you are responsible for the safety of your own seed phrases.
      `
    },
    LICENSE: {
      title: 'Software License',
      icon: FileText,
      content: `
# MIT License

Copyright (c) 2026 MIGOXAI Quantum Hub

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
      `
    }
  };

  return (
    <div className="flex flex-col h-full gap-8 animate-fade-in pb-12">
      <header className="flex flex-col gap-2">
        <h2 className="text-5xl font-black radium-text uppercase italic tracking-tighter leading-none">Legal & Compliance</h2>
        <p className="text-slate-600 font-bold tracking-[0.4em] text-[10px] uppercase mt-1">Regulatory Nodes // POL-X9</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 flex-1">
        {/* Sidebar */}
        <div className="flex flex-col gap-4">
          {(Object.keys(docs) as (keyof typeof docs)[]).map((key) => {
            const doc = docs[key];
            const Icon = doc.icon;
            return (
              <button
                key={key}
                onClick={() => setActiveDoc(key)}
                className={`flex items-center justify-between p-6 rounded-2xl border transition-all duration-300 group ${
                  activeDoc === key 
                  ? 'bg-[#39ff14]/10 border-[#39ff14] shadow-[0_0_20px_rgba(57,255,20,0.2)]' 
                  : 'bg-black/40 border-green-900/20 hover:border-[#39ff14]/50'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-lg ${activeDoc === key ? 'bg-[#39ff14] text-black' : 'bg-green-900/20 text-green-700'}`}>
                    <Icon size={18} />
                  </div>
                  <span className={`text-[11px] font-black uppercase tracking-widest ${activeDoc === key ? 'text-white' : 'text-slate-500'}`}>
                    {doc.title}
                  </span>
                </div>
                <ChevronRight size={14} className={activeDoc === key ? 'text-[#39ff14]' : 'text-green-900'} />
              </button>
            );
          })}

          <div className="mt-auto glass-panel p-6 rounded-2xl border border-blue-900/20 bg-blue-950/5">
            <div className="flex items-center gap-3 mb-3 text-blue-400">
              <ShieldAlert size={16} />
              <p className="text-[10px] font-black uppercase tracking-widest">Compliance Status</p>
            </div>
            <p className="text-[10px] font-bold text-slate-500 leading-relaxed uppercase">
              MIGOXAI follows decentralized protocol standards established by Google Web3 and GitHub Open Source guidelines.
            </p>
          </div>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3 glass-panel rounded-[2.5rem] p-10 md:p-16 border border-green-900/10 bg-black/40 overflow-y-auto max-h-[70vh] custom-scroll">
           <AnimatePresence mode="wait">
             <motion.div
               key={activeDoc}
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, y: -10 }}
               transition={{ duration: 0.3 }}
               className="markdown-body prose prose-invert max-w-none prose-p:text-slate-400 prose-headings:text-white prose-headings:radium-text prose-headings:italic prose-headings:tracking-tighter prose-strong:text-[#39ff14] prose-code:text-[#39ff14]"
             >
                <ReactMarkdown>{docs[activeDoc].content}</ReactMarkdown>
             </motion.div>
           </AnimatePresence>
        </div>
      </div>

      <footer className="flex justify-between items-center px-4 opacity-50">
        <p className="text-[10px] font-black text-green-950 uppercase tracking-[0.5em]">Global Legal Node // Ver-2026.4</p>
        <div className="flex gap-4 text-[10px] font-black text-slate-700 uppercase tracking-widest">
           <span>0xLegal..Hash</span>
           <Gavel size={12} />
        </div>
      </footer>
    </div>
  );
};

export default LegalView;
