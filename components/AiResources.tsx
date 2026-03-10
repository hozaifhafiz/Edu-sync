
import React, { useState, useEffect } from 'react';
import { 
  BrainCircuit, Cpu, Database, Code, Bot, ChevronRight, X, Sparkles, Loader2, Youtube, 
  ScanEye, MessageSquareText, Gamepad2, Book, ExternalLink, Zap, Search, CheckCircle, Clock, Circle, Trophy
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { explainAiConcept } from '../services/geminiService';

export interface ResourceCard {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  color: string;
}

interface BookResource {
  id: string;
  title: string;
  author: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  description: string;
  link: string;
}

export type ProgressStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';

export const resources: ResourceCard[] = [
  {
    id: 'ai-intro',
    title: "Introduction to AI",
    description: "Understand the basics of Artificial Intelligence, its history, and how it shapes our modern world.",
    icon: <BrainCircuit size={24} className="text-white" />,
    level: "Beginner",
    color: "bg-indigo-500"
  },
  {
    id: 'ml-basics',
    title: "Machine Learning Basics",
    description: "Learn how computers learn from data without being explicitly programmed. Supervised vs Unsupervised learning.",
    icon: <Cpu size={24} className="text-white" />,
    level: "Intermediate",
    color: "bg-blue-500"
  },
  {
    id: 'deep-learning',
    title: "Deep Learning & Neural Nets",
    description: "Dive into neural networks that mimic the human brain to solve complex problems like image recognition.",
    icon: <Database size={24} className="text-white" />,
    level: "Advanced",
    color: "bg-purple-500"
  },
  {
    id: 'python-ai',
    title: "Python for AI",
    description: "Discover why Python is the language of AI and explore libraries like NumPy, Pandas, and TensorFlow.",
    icon: <Code size={24} className="text-white" />,
    level: "Intermediate",
    color: "bg-emerald-500"
  },
  {
    id: 'computer-vision',
    title: "Computer Vision",
    description: "How computers 'see' and interpret images and videos. Face recognition, object detection, and more.",
    icon: <ScanEye size={24} className="text-white" />,
    level: "Intermediate",
    color: "bg-teal-600"
  },
  {
    id: 'nlp',
    title: "Natural Language Processing",
    description: "The interaction between computers and human language. Chatbots, translation, and sentiment analysis.",
    icon: <MessageSquareText size={24} className="text-white" />,
    level: "Intermediate",
    color: "bg-violet-600"
  },
  {
    id: 'gen-ai',
    title: "Generative AI (LLMs)",
    description: "Explore the magic behind tools like Gemini and ChatGPT. How do Large Language Models work?",
    icon: <Bot size={24} className="text-white" />,
    level: "Beginner",
    color: "bg-pink-500"
  },
  {
    id: 'ai-ethics',
    title: "AI Ethics & Safety",
    description: "Why is responsible AI important? Understanding bias, fairness, and the future of human-AI collaboration.",
    icon: <Sparkles size={24} className="text-white" />,
    level: "Beginner",
    color: "bg-amber-500"
  },
  {
    id: 'reinforcement-learning',
    title: "Reinforcement Learning",
    description: "Training models to make a sequence of decisions. Used in robotics, gaming, and navigation.",
    icon: <Gamepad2 size={24} className="text-white" />,
    level: "Advanced",
    color: "bg-orange-500"
  },
  {
    id: 'robotics',
    title: "AI in Robotics",
    description: "Empowering machines with intelligence to navigate, manipulate objects, and assist humans in physical tasks.",
    icon: <Zap size={24} className="text-white" />,
    level: "Advanced",
    color: "bg-rose-600"
  },
  {
    id: 'xai',
    title: "Explainable AI (XAI)",
    description: "Making AI decision-making transparent and understandable to humans. Trust and accountability in AI.",
    icon: <Search size={24} className="text-white" />,
    level: "Advanced",
    color: "bg-cyan-600"
  }
];

const books: BookResource[] = [
  {
    id: 'book-1',
    title: "Artificial Intelligence: A Modern Approach",
    author: "Stuart Russell & Peter Norvig",
    level: "Advanced",
    description: "The definitive textbook on AI, covering a broad range of topics in depth. Used in universities worldwide.",
    link: "https://www.amazon.com/Artificial-Intelligence-A-Modern-Approach/dp/0134610997"
  },
  {
    id: 'book-2',
    title: "Life 3.0: Being Human in the Age of AI",
    author: "Max Tegmark",
    level: "Beginner",
    description: "A fascinating look at the future of AI and its impact on the fabric of life and society.",
    link: "https://www.amazon.com/Life-3-0-Being-Human-Artificial-Intelligence/dp/1101946598"
  },
  {
    id: 'book-3',
    title: "Hands-On Machine Learning",
    author: "Aurélien Géron",
    level: "Intermediate",
    description: "Practical guide to implementing ML models using Scikit-Learn, Keras, and TensorFlow.",
    link: "https://www.amazon.com/Hands-Machine-Learning-Scikit-Learn-TensorFlow/dp/1492032646"
  },
  {
    id: 'book-4',
    title: "Superintelligence",
    author: "Nick Bostrom",
    level: "Advanced",
    description: "A philosophical and technical inquiry into the potential risks of general artificial intelligence.",
    link: "https://www.amazon.com/Superintelligence-Dangers-Strategies-Nick-Bostrom/dp/0199678111"
  },
  {
    id: 'book-5',
    title: "The Hundred-Page Machine Learning Book",
    author: "Andriy Burkov",
    level: "Beginner",
    description: "A compact and practical guide to get you started with Machine Learning quickly.",
    link: "https://www.amazon.com/Hundred-Page-Machine-Learning-Book/dp/199957950X"
  },
  {
    id: 'book-6',
    title: "Deep Learning",
    author: "Ian Goodfellow et al.",
    level: "Advanced",
    description: "The Bible of Deep Learning. Mathematical and theoretical foundations of neural networks.",
    link: "https://www.amazon.com/Deep-Learning-Adaptive-Computation-Machine/dp/0262035618"
  },
  {
    id: 'book-7',
    title: "Human Compatible",
    author: "Stuart Russell",
    level: "Beginner",
    description: "A crucial perspective on the problem of control in artificial intelligence and our future.",
    link: "https://www.amazon.com/Human-Compatible-Artificial-Intelligence-Problem/dp/0525558616"
  },
  {
    id: 'book-8',
    title: "The Master Algorithm",
    author: "Pedro Domingos",
    level: "Intermediate",
    description: "The quest for the ultimate learning machine that will derive all knowledge from data.",
    link: "https://www.amazon.com/Master-Algorithm-Ultimate-Learning-Machine/dp/0465065708"
  }
];

export const AiResources: React.FC = () => {
  const [selectedResource, setSelectedResource] = useState<ResourceCard | null>(null);
  const [explanation, setExplanation] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState<Record<string, ProgressStatus>>({});

  useEffect(() => {
    const saved = localStorage.getItem('edu_ai_progress');
    if (saved) {
      try {
        setProgress(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse progress', e);
      }
    }
  }, []);

  const updateProgress = (id: string, status: ProgressStatus) => {
    const newProgress = { ...progress, [id]: status };
    setProgress(newProgress);
    localStorage.setItem('edu_ai_progress', JSON.stringify(newProgress));
  };

  const handleLearnMore = async (resource: ResourceCard) => {
    // Auto-set to IN_PROGRESS if starting for the first time
    if (!progress[resource.id] || progress[resource.id] === 'NOT_STARTED') {
      updateProgress(resource.id, 'IN_PROGRESS');
    }

    setSelectedResource(resource);
    setExplanation('');
    setLoading(true);
    
    const content = await explainAiConcept(resource.title);
    setExplanation(content);
    setLoading(false);
  };

  const handleMarkComplete = () => {
    if (selectedResource) {
      updateProgress(selectedResource.id, 'COMPLETED');
      
      // Update global stats for Dashboard
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
      stats.topicsMastered += 1;
      stats.studyMinutes += 15; // Reward 15 mins for completing a module
      localStorage.setItem('edu_stats', JSON.stringify(stats));
    }
  };

  const closeModal = () => {
    setSelectedResource(null);
    setExplanation('');
  };

  // Calculate progress statistics
  const totalResources = resources.length;
  const completedCount = Object.values(progress).filter(s => s === 'COMPLETED').length;
  const completionPercentage = Math.round((completedCount / totalResources) * 100);

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-10">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-8 text-white shadow-lg relative overflow-hidden">
         <div className="absolute top-0 right-0 p-4 opacity-10">
            <BrainCircuit size={120} />
         </div>
         <div className="relative z-10">
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
                        <Bot className="text-indigo-400" /> AI Learning Hub
                    </h1>
                    <p className="text-slate-300 text-lg max-w-2xl">
                        Explore the future of technology. Track your journey through Machine Learning, Deep Learning, and Generative AI.
                    </p>
                </div>
                {/* Progress Widget */}
                <div className="hidden md:block bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/20 min-w-[200px]">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-semibold text-indigo-200 flex items-center">
                            <Trophy size={14} className="mr-1 text-yellow-400" /> Progress
                        </span>
                        <span className="text-lg font-bold text-white">{completionPercentage}%</span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2">
                        <div 
                            className="bg-green-400 h-2 rounded-full transition-all duration-1000 ease-out" 
                            style={{ width: `${completionPercentage}%` }}
                        ></div>
                    </div>
                    <p className="text-xs text-slate-400 mt-2 text-right">{completedCount} / {totalResources} Modules</p>
                </div>
            </div>
         </div>
      </div>

      {/* Mobile Progress Bar (Visible only on small screens) */}
      <div className="md:hidden bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-slate-600">Your Progress</span>
              <span className="text-sm font-bold text-indigo-600">{completedCount} / {totalResources}</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2">
              <div 
                  className="bg-indigo-600 h-2 rounded-full transition-all duration-1000" 
                  style={{ width: `${completionPercentage}%` }}
              ></div>
          </div>
      </div>

      {/* YouTube Resource Section */}
      <div className="bg-gradient-to-r from-red-50 to-red-100 rounded-xl p-6 border border-red-200 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
        <div className="flex-1">
             <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-red-600 rounded-lg text-white">
                    <Youtube size={24} />
                </div>
                <h3 className="text-xl font-bold text-slate-800">
                   Featured: AI by Hozaif
                </h3>
             </div>
             <p className="text-slate-700 text-sm md:text-base">
                Watch in-depth tutorials, project walkthroughs, and the latest AI trends on our official YouTube channel.
             </p>
        </div>
        <a 
            href="https://youtube.com/@aibyhozaif?si=LgOq8iSfPe5KSTaP" 
            target="_blank" 
            rel="noopener noreferrer"
            className="px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors flex items-center shadow-sm whitespace-nowrap"
        >
            Visit Channel <ChevronRight size={18} className="ml-1" />
        </a>
      </div>

      {/* Resources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {resources.map((item) => {
            const status = progress[item.id] || 'NOT_STARTED';
            return (
                <div key={item.id} className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all p-6 flex flex-col relative overflow-hidden">
                    {/* Status Banner/Badge */}
                    <div className="flex items-start justify-between mb-4">
                        <div className={`p-3 rounded-lg shadow-sm ${item.color}`}>
                            {item.icon}
                        </div>
                        <div className="flex flex-col items-end gap-2">
                             <span className={`px-2 py-1 rounded text-xs font-semibold uppercase tracking-wide
                                ${item.level === 'Beginner' ? 'bg-green-100 text-green-700' : 
                                item.level === 'Intermediate' ? 'bg-yellow-100 text-yellow-700' : 
                                'bg-red-100 text-red-700'}`}>
                                {item.level}
                            </span>
                            {status === 'COMPLETED' && (
                                <span className="flex items-center text-[10px] font-bold text-green-600 bg-green-50 px-2 py-1 rounded border border-green-100">
                                    <CheckCircle size={12} className="mr-1" /> COMPLETED
                                </span>
                            )}
                            {status === 'IN_PROGRESS' && (
                                <span className="flex items-center text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded border border-blue-100">
                                    <Clock size={12} className="mr-1" /> IN PROGRESS
                                </span>
                            )}
                        </div>
                    </div>

                    <h3 className="text-lg font-bold text-slate-800 mb-2">{item.title}</h3>
                    <p className="text-slate-500 text-sm leading-relaxed mb-6 flex-1">
                        {item.description}
                    </p>

                    <button 
                        onClick={() => handleLearnMore(item)}
                        className={`w-full py-2.5 rounded-lg font-medium transition-colors flex items-center justify-center group border
                            ${status === 'COMPLETED' 
                                ? 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100' 
                                : status === 'IN_PROGRESS'
                                    ? 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100'
                                    : 'bg-white text-indigo-600 border-indigo-100 hover:bg-indigo-50'
                            }`}
                    >
                        {status === 'COMPLETED' ? 'Review Topic' : status === 'IN_PROGRESS' ? 'Continue Learning' : 'Start Learning'}
                        <ChevronRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
            );
        })}
      </div>

      {/* Books Section */}
      <div className="mt-12 pt-8 border-t border-slate-200">
        <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center">
            <Book className="mr-3 text-indigo-600" /> Must-Read AI Books
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {books.map(book => (
                <div key={book.id} className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm flex flex-col h-full hover:border-indigo-300 transition-colors">
                    <div className="flex justify-between items-start mb-3">
                         <div className="p-3 bg-indigo-50 rounded-lg text-indigo-600">
                            <Book size={24} />
                         </div>
                         <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wide
                            ${book.level === 'Beginner' ? 'bg-green-100 text-green-700' : 
                              book.level === 'Intermediate' ? 'bg-yellow-100 text-yellow-700' : 
                              'bg-red-100 text-red-700'}`}>
                            {book.level}
                        </span>
                    </div>
                    <h3 className="font-bold text-slate-800 text-lg mb-1 line-clamp-2">{book.title}</h3>
                    <p className="text-sm text-slate-500 font-medium mb-3">by {book.author}</p>
                    <p className="text-slate-600 text-sm mb-6 flex-1">{book.description}</p>
                    <a 
                        href={book.link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="w-full py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-indigo-600 transition-colors flex items-center justify-center"
                    >
                        View Book <ExternalLink size={14} className="ml-2" />
                    </a>
                </div>
            ))}
        </div>
      </div>

      {/* Explanation Modal */}
      {selectedResource && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[80vh] flex flex-col shadow-2xl animate-pop-in">
                {/* Modal Header */}
                <div className={`p-6 ${selectedResource.color} text-white rounded-t-2xl flex justify-between items-start`}>
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                            {selectedResource.icon}
                        </div>
                        <div>
                            <h2 className="text-xl font-bold">{selectedResource.title}</h2>
                            <p className="text-white/80 text-sm">AI Concept Explainer</p>
                        </div>
                    </div>
                    <button onClick={closeModal} className="p-1 hover:bg-white/20 rounded-full transition-colors">
                        <X size={24} />
                    </button>
                </div>
                
                {/* Modal Content */}
                <div className="p-6 overflow-y-auto flex-1">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                            <Loader2 size={48} className={`animate-spin mb-4 text-${selectedResource.color.replace('bg-', '').replace('-500', '-600')}`} />
                            <p>Generating explanation with AI...</p>
                        </div>
                    ) : (
                        <div className="markdown-body text-slate-700 leading-relaxed">
                            <ReactMarkdown>{explanation}</ReactMarkdown>
                        </div>
                    )}
                </div>

                {/* Modal Footer Actions */}
                <div className="p-4 border-t border-slate-100 bg-slate-50 rounded-b-2xl flex justify-between items-center">
                    <p className="text-xs text-slate-400 hidden sm:block">
                        Powered by Gemini AI
                    </p>
                    <div className="flex gap-3 w-full sm:w-auto justify-end">
                        <button 
                            onClick={closeModal}
                            className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium transition-colors"
                        >
                            Close
                        </button>
                        {progress[selectedResource.id] === 'COMPLETED' ? (
                             <button 
                                disabled
                                className="px-4 py-2 bg-green-100 text-green-700 rounded-lg font-bold flex items-center cursor-default"
                             >
                                <CheckCircle size={18} className="mr-2" /> Completed
                             </button>
                        ) : (
                            <button 
                                onClick={handleMarkComplete}
                                className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 transition-colors flex items-center shadow-md"
                            >
                                <CheckCircle size={18} className="mr-2" /> Mark as Completed
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};
