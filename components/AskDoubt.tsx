
import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { solveDoubt } from '../services/geminiService';
import { UserPreferences, Subject } from '../types';
import { Send, User, Bot, Copy, Check, AlertTriangle } from 'lucide-react';

interface AskDoubtProps {
  preferences: UserPreferences;
}

interface Message {
  role: 'user' | 'bot';
  content: string;
  isError?: boolean;
}

export const AskDoubt: React.FC<AskDoubtProps> = ({ preferences }) => {
  const [input, setInput] = useState('');
  const [subject, setSubject] = useState<Subject>(Subject.MATH);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'bot', content: `Hi! I'm your ${preferences.board} study companion. Ask me any doubt related to ${preferences.grade} subjects.` }
  ]);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setLoading(true);

    try {
      const response = await solveDoubt(userMsg, preferences.board, preferences.grade, subject);
      setMessages(prev => [...prev, { role: 'bot', content: response }]);
      
      // Update usage stats
      const statsStr = localStorage.getItem('edu_stats');
      const stats = statsStr ? JSON.parse(statsStr) : { 
          topicsMastered: 0, 
          studyMinutes: 0, 
          totalScore: 0, 
          totalQuizzes: 0, 
          weeklyScores: [
              { name: 'Mon', score: 0 }, { name: 'Tue', score: 0 }, { name: 'Wed', score: 0 },
              { name: 'Thu', score: 0 }, { name: 'Fri', score: 0 }, { name: 'Sat', score: 0 }, { name: 'Sun', score: 0 }
          ] 
      };
      stats.studyMinutes += 2; // 2 mins per interaction
      localStorage.setItem('edu_stats', JSON.stringify(stats));

    } catch (err: any) {
      console.error("AskDoubt Error:", err);
      
      let errorMessage = "I encountered an error processing your request. Please try again.";
      
      // Improved error message detection
      if (!navigator.onLine) {
        errorMessage = "It seems you are offline. Please check your internet connection.";
      } else if (err.message) {
          if (err.message.includes("SAFETY")) {
              errorMessage = "I cannot answer this question as it may violate safety guidelines.";
          } else if (err.message.includes("429") || err.message.includes("Quota")) {
              errorMessage = "I'm receiving too many requests right now. Please wait a moment before asking again.";
          }
      }

      setMessages(prev => [...prev, { role: 'bot', content: errorMessage, isError: true }]);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyChat = () => {
    const chatHistory = messages.map(m => {
        const role = m.role === 'user' ? 'You' : 'AI Tutor';
        return `[${role}]: ${m.content}`;
    }).join('\n\n');

    navigator.clipboard.writeText(chatHistory).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }).catch(err => {
        console.error('Failed to copy text: ', err);
    });
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="bg-slate-50 border-b border-slate-200 p-4 flex items-center justify-between">
            <h2 className="font-semibold text-slate-700">AI Tutor Chat</h2>
            <div className="flex items-center gap-3">
                <button 
                    onClick={handleCopyChat}
                    className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-100 rounded-md transition-colors flex items-center"
                    title="Copy Chat History"
                >
                    {copied ? <Check size={18} className="text-green-600" /> : <Copy size={18} />}
                </button>
                <div className="h-4 w-px bg-slate-300 mx-1"></div>
                <select 
                    value={subject} 
                    onChange={(e) => setSubject(e.target.value as Subject)}
                    className="text-sm border-none bg-white rounded-md px-2 py-1 focus:ring-1 focus:ring-indigo-500 text-slate-600 shadow-sm"
                >
                    {Object.values(Subject).map(s => <option key={s} value={s}>{s}</option>)}
                </select>
            </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`
                        max-w-[80%] rounded-2xl p-4 
                        ${msg.role === 'user' 
                            ? 'bg-indigo-600 text-white rounded-tr-none' 
                            : msg.isError 
                                ? 'bg-red-50 text-red-800 border border-red-200 rounded-tl-none' 
                                : 'bg-slate-100 text-slate-800 rounded-tl-none border border-slate-200'}
                    `}>
                        <div className="flex items-center gap-2 mb-1 text-xs opacity-70 font-medium">
                            {msg.role === 'user' ? <User size={12} /> : (msg.isError ? <AlertTriangle size={12}/> : <Bot size={12} />)}
                            {msg.role === 'user' ? 'You' : 'AI Tutor'}
                        </div>
                        <div className={`markdown-body text-sm ${msg.role === 'user' ? 'text-white' : 'text-slate-800'}`}>
                           {msg.role === 'bot' && !msg.isError ? (
                               <ReactMarkdown>{msg.content}</ReactMarkdown>
                           ) : (
                               <p>{msg.content}</p>
                           )}
                        </div>
                    </div>
                </div>
            ))}
            {loading && (
                <div className="flex justify-start animate-pulse">
                     <div className="bg-slate-100 rounded-2xl rounded-tl-none p-4 border border-slate-200 flex items-center space-x-2">
                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                     </div>
                </div>
            )}
        </div>

        <div className="p-4 bg-white border-t border-slate-200">
            <form onSubmit={handleSend} className="flex gap-2 relative">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={`Ask a question about ${subject}...`}
                    className="flex-1 border border-slate-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none"
                />
                <button 
                    type="submit" 
                    disabled={!input.trim() || loading}
                    className="bg-indigo-600 text-white p-3 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    <Send size={20} />
                </button>
            </form>
        </div>
    </div>
  );
};
