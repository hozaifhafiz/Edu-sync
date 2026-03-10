
import React from 'react';
import { Instagram, Twitter, Cpu, Code, Palette, Zap, Globe, Youtube } from 'lucide-react';

export const AboutUs: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-10">
       <div className="bg-gradient-to-r from-indigo-600 to-purple-700 rounded-2xl p-8 text-center text-white shadow-lg">
          <h1 className="text-3xl font-bold mb-4">About EduSync</h1>
          <p className="text-indigo-100 text-lg max-w-2xl mx-auto">
            Empowering students with AI-driven synchronized learning for NCERT and JKBOSE curriculums.
          </p>
       </div>

       <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
             <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center">
                <Globe className="mr-2 text-indigo-500" /> Our Mission
             </h2>
             <p className="text-slate-600 leading-relaxed">
                EduSync aims to bridge the gap between traditional curriculum and modern technology.
                By leveraging the power of Google's Gemini AI, we provide instant doubt resolution,
                custom study notes, and adaptive quizzes tailored specifically for Class 9-12 students.
             </p>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
             <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center">
                <Cpu className="mr-2 text-blue-500" /> Technology Stack
             </h2>
             <ul className="space-y-3">
                <li className="flex items-center text-slate-600">
                   <span className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center mr-3 text-blue-600"><Code size={16} /></span>
                   <span className="font-medium">React 18 & TypeScript</span>
                </li>
                <li className="flex items-center text-slate-600">
                   <span className="w-8 h-8 rounded-full bg-teal-50 flex items-center justify-center mr-3 text-teal-600"><Palette size={16} /></span>
                   <span className="font-medium">Tailwind CSS</span>
                </li>
                <li className="flex items-center text-slate-600">
                   <span className="w-8 h-8 rounded-full bg-purple-50 flex items-center justify-center mr-3 text-purple-600"><Zap size={16} /></span>
                   <span className="font-medium">Google Gemini AI</span>
                </li>
             </ul>
          </div>
       </div>

       <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8 text-center">
          <h2 className="text-xl font-bold text-slate-800 mb-6">Connect with the Developer</h2>
          <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6">
             <a href="https://instagram.com/hozaifhafiz" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center px-6 py-3 bg-pink-50 text-pink-600 rounded-lg hover:bg-pink-100 transition-colors">
                <Instagram className="mr-2" size={20} />
                <span className="font-medium">@hozaifhafiz</span>
             </a>
             <a href="https://twitter.com/hozaifkhann" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center px-6 py-3 bg-sky-50 text-sky-600 rounded-lg hover:bg-sky-100 transition-colors">
                <Twitter className="mr-2" size={20} />
                <span className="font-medium">@hozaifkhann</span>
             </a>
             <a href="https://youtube.com/@aibyhozaif?si=LgOq8iSfPe5KSTaP" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center px-6 py-3 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors">
                <Youtube className="mr-2" size={20} />
                <span className="font-medium">@aibyhozaif</span>
             </a>
          </div>
       </div>
    </div>
  );
};
