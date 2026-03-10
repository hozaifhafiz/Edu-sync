
import React, { useState, useEffect } from 'react';
import { BookOpen, Zap, ArrowRight, Check, BrainCircuit } from 'lucide-react';

export const InteractiveAd: React.FC<{ onEnterApp: () => void }> = ({ onEnterApp }) => {
  const [scene, setScene] = useState(0);
  const [demoInput, setDemoInput] = useState('');
  const [demoResult, setDemoResult] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (scene < 3) {
      const timer = setTimeout(() => setScene(s => s + 1), 3500);
      return () => clearTimeout(timer);
    }
  }, [scene]);

  const runDemo = () => {
    if (!demoInput.trim()) return;
    setIsTyping(true);
    setDemoResult('');
    // Simulate AI typing for the ad demo
    const text = `Here's a quick insight on ${demoInput} for NCERT:\n\n1. Definition: A fundamental concept in... \n2. Key Point: Critical for Class 10/11 exams.\n3. AI Tip: Focus on the diagrams in Chapter 4.`;
    let i = 0;
    const typeTimer = setInterval(() => {
      setDemoResult(prev => text.slice(0, i + 1));
      i++;
      if (i > text.length) {
        clearInterval(typeTimer);
        setIsTyping(false);
      }
    }, 30);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900 text-white flex flex-col items-center justify-center overflow-hidden font-sans">
       {/* Skip Button */}
       <button onClick={onEnterApp} className="absolute top-6 right-6 text-slate-400 hover:text-white text-xs md:text-sm z-50 uppercase tracking-widest font-semibold transition-colors">
         Skip Ad
       </button>

       {/* Scene 0: The Struggle */}
       {scene === 0 && (
         <div className="animate-enter-view text-center p-8 max-w-4xl">
           <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent leading-tight">
             Struggling with NCERT & JKBOSE?
           </h1>
           <p className="text-xl md:text-2xl text-slate-300 mt-4 font-light">
             Thick textbooks. Confusing concepts. Endless doubts.
           </p>
         </div>
       )}

       {/* Scene 1: The Solution */}
       {scene === 1 && (
         <div className="animate-enter-view text-center p-8 max-w-4xl">
           <div className="flex justify-center gap-6 mb-8">
             <div className="p-6 bg-red-500/20 rounded-full text-red-400 animate-bounce shadow-lg shadow-red-500/10">
                <Zap size={64}/>
             </div>
           </div>
           <h1 className="text-4xl md:text-6xl font-bold mb-4 text-white leading-tight">
             Stop Memorizing.
           </h1>
           <p className="text-2xl md:text-3xl text-indigo-300 font-medium">Start Understanding with AI.</p>
         </div>
       )}

       {/* Scene 2: The Brand */}
       {scene === 2 && (
         <div className="animate-pop-in text-center p-8 max-w-4xl">
            <div className="flex justify-center mb-8">
                <div className="relative">
                    <div className="absolute inset-0 bg-indigo-500 blur-3xl opacity-40 animate-pulse"></div>
                    <BookOpen size={100} className="relative z-10 text-white drop-shadow-2xl" />
                </div>
            </div>
            <h1 className="text-6xl md:text-8xl font-extrabold mb-4 tracking-tighter text-white">
              EduSync
            </h1>
            <p className="text-xl md:text-3xl text-indigo-200 font-light mb-8">
               Your Personal AI Tutor. Completely Free.
            </p>
            <div className="flex flex-col md:flex-row gap-4 md:gap-8 justify-center items-center opacity-90 text-lg">
               <span className="flex items-center px-4 py-2 bg-white/5 rounded-full border border-white/10"><Check className="mr-2 text-green-400" size={20}/> Instant Doubts</span>
               <span className="flex items-center px-4 py-2 bg-white/5 rounded-full border border-white/10"><Check className="mr-2 text-green-400" size={20}/> Smart Notes</span>
               <span className="flex items-center px-4 py-2 bg-white/5 rounded-full border border-white/10"><Check className="mr-2 text-green-400" size={20}/> NCERT Focused</span>
            </div>
         </div>
       )}

       {/* Scene 3: The Interactive Demo */}
       {scene === 3 && (
         <div className="w-full max-w-lg p-6 animate-fade-in flex flex-col items-center">
            <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center p-3 bg-indigo-600 rounded-xl mb-4 shadow-lg shadow-indigo-600/30">
                    <BrainCircuit size={32} className="text-white" />
                </div>
                <h2 className="text-3xl md:text-4xl font-bold mb-3 text-white">Experience the Magic</h2>
                <p className="text-slate-400 text-lg">Try generating a smart note right now.</p>
            </div>

            <div className="w-full bg-slate-800 rounded-2xl p-1 border border-slate-700 shadow-2xl mb-8 overflow-hidden relative">
                {/* Input Area */}
                <div className="flex gap-2 p-2 bg-slate-800">
                    <input 
                        type="text" 
                        value={demoInput}
                        onChange={(e) => setDemoInput(e.target.value)}
                        placeholder="Enter a topic (e.g. Gravity)"
                        className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none placeholder:text-slate-600 transition-all"
                        onKeyDown={(e) => e.key === 'Enter' && runDemo()}
                    />
                    <button 
                        onClick={runDemo}
                        className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 rounded-xl font-medium transition-all active:scale-95"
                    >
                        <Zap size={20} />
                    </button>
                </div>
                
                {/* Output Area */}
                <div className="min-h-[140px] bg-slate-900 p-4 font-mono text-sm md:text-base leading-relaxed border-t border-slate-700">
                    {!demoResult && !isTyping && (
                        <div className="h-full flex items-center justify-center text-slate-600 italic">
                            AI output will appear here...
                        </div>
                    )}
                    <div className="text-green-400 whitespace-pre-wrap">
                        {demoResult}
                        {isTyping && <span className="animate-pulse inline-block w-2 h-4 bg-green-400 ml-1 align-middle"></span>}
                    </div>
                </div>
            </div>

            <button 
                onClick={onEnterApp}
                className="w-full bg-white text-indigo-950 text-lg md:text-xl font-bold py-4 rounded-2xl hover:bg-indigo-50 transition-all transform hover:scale-[1.02] flex items-center justify-center shadow-xl shadow-indigo-900/20 group"
            >
                Get Started for Free <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={24} />
            </button>
            
            <p className="mt-6 text-xs text-slate-500 uppercase tracking-widest">Designed for Class 9-12 Students</p>
         </div>
       )}
       
       {/* Progress Indicators */}
       <div className="absolute bottom-12 flex gap-3 z-50">
          {[0, 1, 2, 3].map(i => (
             <div 
                key={i} 
                onClick={() => setScene(i)}
                className={`h-1.5 rounded-full transition-all duration-500 cursor-pointer ${i === scene ? 'w-12 bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.8)]' : 'w-2 bg-slate-800 hover:bg-slate-700'}`}
             />
          ))}
       </div>

       {/* Footer Credit */}
       <div className="absolute bottom-4 z-50 text-white/40 text-xs font-medium tracking-widest uppercase">
          Made by Hozaif Hafiz
       </div>
    </div>
  );
}
