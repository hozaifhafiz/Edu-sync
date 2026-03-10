
import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { BookOpen, Clock, Star, Trophy, Bell, Activity, BrainCircuit } from 'lucide-react';
import { Board, Grade, Subject, UserPreferences, SavedNote } from '../types';
import { resources } from './AiResources';

interface DashboardProps {
  preferences: UserPreferences;
  setPreferences: (prefs: UserPreferences) => void;
}

interface StatsData {
    topicsMastered: number;
    studyMinutes: number;
    totalScore: number;
    totalQuizzes: number;
    weeklyScores: { name: string; score: number }[];
}

const announcements = [
  { id: 1, title: "JKBOSE Class 10 & 12 Date Sheet Tentative", date: "2 hrs ago", type: "Exam Alert" },
  { id: 2, title: "NCERT Rationalised Content List 2024-25", date: "1 day ago", type: "Syllabus" },
  { id: 3, title: "Scholarship Exam Registration Open", date: "3 days ago", type: "Opportunity" }
];

const DEFAULT_STATS: StatsData = {
    topicsMastered: 0,
    studyMinutes: 0,
    totalScore: 0,
    totalQuizzes: 0,
    weeklyScores: [
        { name: 'Mon', score: 0 },
        { name: 'Tue', score: 0 },
        { name: 'Wed', score: 0 },
        { name: 'Thu', score: 0 },
        { name: 'Fri', score: 0 },
        { name: 'Sat', score: 0 },
        { name: 'Sun', score: 0 },
    ]
};

export const Dashboard: React.FC<DashboardProps> = ({ preferences, setPreferences }) => {
  const [stats, setStats] = useState<StatsData>(DEFAULT_STATS);
  const [recentActivity, setRecentActivity] = useState<SavedNote[]>([]);
  const [aiProgress, setAiProgress] = useState({ completed: 0, total: 0, percentage: 0 });

  useEffect(() => {
    // Load Stats
    const storedStats = localStorage.getItem('edu_stats');
    if (storedStats) {
        setStats(JSON.parse(storedStats));
    }

    // Load Recent Activity (Saved Notes)
    const savedNotesStr = localStorage.getItem('edu_saved_notes');
    if (savedNotesStr) {
        const notes: SavedNote[] = JSON.parse(savedNotesStr);
        setRecentActivity(notes.slice(0, 3)); // Get top 3
    }

    // Load AI Progress
    const aiProgressStr = localStorage.getItem('edu_ai_progress');
    const total = resources.length;
    let completed = 0;
    if (aiProgressStr) {
        const progressData = JSON.parse(aiProgressStr);
        completed = Object.values(progressData).filter((s: any) => s === 'COMPLETED').length;
    }
    setAiProgress({
        completed,
        total,
        percentage: total > 0 ? Math.round((completed / total) * 100) : 0
    });

  }, []);
  
  const handleBoardChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPreferences({ ...preferences, board: e.target.value as Board });
  };

  const handleGradeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPreferences({ ...preferences, grade: e.target.value as Grade });
  };

  const quizAvg = stats.totalQuizzes > 0 ? Math.round(stats.totalScore / stats.totalQuizzes) : 0;
  const studyHours = (stats.studyMinutes / 60).toFixed(1);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome & Configuration Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-700 rounded-2xl p-6 text-white shadow-lg">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold mb-2">Welcome back, Scholar!</h1>
            <p className="text-indigo-100 opacity-90">Track your {preferences.board} progress in real-time.</p>
          </div>
          
          <div className="flex gap-3">
             <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2 border border-white/20">
                <label className="block text-xs text-indigo-200 mb-1 font-medium">Curriculum</label>
                <select 
                    value={preferences.board}
                    onChange={handleBoardChange}
                    className="bg-transparent text-white text-sm font-semibold focus:outline-none [&>option]:text-slate-900"
                >
                    {Object.values(Board).map(b => <option key={b} value={b}>{b}</option>)}
                </select>
             </div>
             <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2 border border-white/20">
                <label className="block text-xs text-indigo-200 mb-1 font-medium">Class</label>
                <select 
                    value={preferences.grade}
                    onChange={handleGradeChange}
                    className="bg-transparent text-white text-sm font-semibold focus:outline-none [&>option]:text-slate-900"
                >
                    {Object.values(Grade).map(g => <option key={g} value={g}>{g}</option>)}
                </select>
             </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Stats Cards */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm flex flex-col justify-between h-32">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-slate-500 text-sm font-medium">Topics Saved</p>
                <h3 className="text-2xl font-bold text-slate-800 mt-1">{stats.topicsMastered}</h3>
              </div>
              <div className="p-2 bg-green-50 rounded-lg text-green-600">
                <BookOpen size={20} />
              </div>
            </div>
            <div className="text-xs text-green-600 font-medium flex items-center">
               Saved to Library
            </div>
          </div>
          
          <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm flex flex-col justify-between h-32">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-slate-500 text-sm font-medium">Study Hours</p>
                <h3 className="text-2xl font-bold text-slate-800 mt-1">{studyHours}</h3>
              </div>
              <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                <Clock size={20} />
              </div>
            </div>
            <div className="text-xs text-slate-400 font-medium">
               Based on activity
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm flex flex-col justify-between h-32">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-slate-500 text-sm font-medium">Quiz Avg.</p>
                <h3 className="text-2xl font-bold text-slate-800 mt-1">{quizAvg}%</h3>
              </div>
              <div className="p-2 bg-amber-50 rounded-lg text-amber-600">
                <Trophy size={20} />
              </div>
            </div>
            <div className="text-xs text-amber-600 font-medium">
               {stats.totalQuizzes} Quizzes taken
            </div>
          </div>

          {/* New AI Mastery Card */}
          <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm flex flex-col justify-between h-32">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-slate-500 text-sm font-medium">AI Mastery</p>
                <h3 className="text-2xl font-bold text-slate-800 mt-1">{aiProgress.percentage}%</h3>
              </div>
              <div className="p-2 bg-purple-50 rounded-lg text-purple-600">
                <BrainCircuit size={20} />
              </div>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-1.5 mt-3 mb-1">
                <div className="bg-purple-500 h-1.5 rounded-full transition-all duration-1000" style={{ width: `${aiProgress.percentage}%` }}></div>
            </div>
            <div className="text-xs text-purple-600 font-medium">
               {aiProgress.completed}/{aiProgress.total} Modules Done
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm row-span-2">
            <h3 className="font-semibold text-slate-800 mb-4 flex items-center">
                <Star size={18} className="mr-2 text-yellow-500" />
                Recent Notes
            </h3>
            <div className="space-y-4">
                {recentActivity.length > 0 ? recentActivity.map((item, idx) => (
                    <div key={idx} className="group cursor-pointer">
                        <div className="flex justify-between text-sm mb-1">
                            <span className="font-medium text-slate-700 group-hover:text-indigo-600 transition-colors">{item.subject}</span>
                            <span className="text-slate-400 text-xs">Completed</span>
                        </div>
                        <div className="text-xs text-slate-500 mb-2 truncate">{item.topic}</div>
                        <div className="w-full bg-slate-100 rounded-full h-1.5">
                            <div className={`h-1.5 rounded-full bg-indigo-500`} style={{ width: `100%` }}></div>
                        </div>
                    </div>
                )) : (
                    <div className="flex flex-col items-center justify-center h-32 text-slate-400">
                        <Activity size={32} className="mb-2 opacity-50" />
                        <p className="text-sm">No notes saved yet.</p>
                        <p className="text-xs">Generate notes to see them here.</p>
                    </div>
                )}
            </div>
            
            <button className="w-full mt-6 py-2 border border-indigo-100 text-indigo-600 rounded-lg text-sm font-medium hover:bg-indigo-50 transition-colors">
                Go to Library
            </button>
        </div>

        {/* Chart Section */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-100 shadow-sm h-80">
            <h3 className="font-semibold text-slate-800 mb-4">Weekly Quiz Performance</h3>
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.weeklyScores} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                    <Tooltip 
                        cursor={{ fill: '#f8fafc' }}
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                    <Bar dataKey="score" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={40} />
                </BarChart>
            </ResponsiveContainer>
        </div>

        {/* Announcements Section */}
        <div className="lg:col-span-3 bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-slate-800 flex items-center">
                    <Bell size={18} className="mr-2 text-indigo-500" />
                    Important Updates
                </h3>
                <button className="text-xs text-indigo-600 font-medium hover:underline">View All</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {announcements.map((item) => (
                    <div key={item.id} className="p-4 rounded-lg bg-slate-50 border border-slate-100 hover:border-indigo-200 transition-all hover:shadow-sm cursor-pointer">
                        <div className="flex justify-between items-start mb-2">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide ${
                                item.type === 'Exam Alert' ? 'bg-red-100 text-red-600' :
                                item.type === 'Syllabus' ? 'bg-blue-100 text-blue-600' :
                                'bg-green-100 text-green-600'
                            }`}>
                                {item.type}
                            </span>
                            <span className="text-xs text-slate-400">{item.date}</span>
                        </div>
                        <h4 className="text-sm font-semibold text-slate-800 line-clamp-2">{item.title}</h4>
                    </div>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
};
