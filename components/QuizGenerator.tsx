
import React, { useState, useEffect } from 'react';
import { generateQuiz } from '../services/geminiService';
import { Board, Grade, Subject, UserPreferences, QuizQuestion } from '../types';
import { Loader2, CheckCircle, XCircle, RefreshCw, Trophy } from 'lucide-react';
import { SYLLABUS } from '../data/syllabus';

interface QuizGeneratorProps {
  preferences: UserPreferences;
  initialTopic?: string;
}

export const QuizGenerator: React.FC<QuizGeneratorProps> = ({ preferences, initialTopic }) => {
  const [topic, setTopic] = useState(initialTopic || '');
  const [subject, setSubject] = useState<Subject>(Subject.BIOLOGY);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [userAnswers, setUserAnswers] = useState<{[key: number]: number}>({});
  const [submitted, setSubmitted] = useState(false);

  const availableTopics = SYLLABUS[subject]?.[preferences.grade] || [];

  useEffect(() => {
      if (initialTopic) {
          setTopic(initialTopic);
          // Try to infer subject if possible, but for now default is fine or user can switch
      }
  }, [initialTopic]);

  // Reset topic selection when subject changes, unless it was initialTopic which might persist briefly
  useEffect(() => {
      if (!initialTopic || topic !== initialTopic) {
          setTopic('');
      }
  }, [subject, preferences.grade]);


  const handleStartQuiz = async () => {
    if (!topic.trim()) return;
    setLoading(true);
    setSubmitted(false);
    setUserAnswers({});
    setQuestions([]);
    
    const generatedQuestions = await generateQuiz(topic, preferences.board, preferences.grade, subject);
    setQuestions(generatedQuestions);
    setLoading(false);
  };

  const handleOptionSelect = (questionId: number, optionIndex: number) => {
    if (submitted) return;
    setUserAnswers(prev => ({ ...prev, [questionId]: optionIndex }));
  };

  const updateStats = (scorePercent: number) => {
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

     stats.totalQuizzes += 1;
     stats.totalScore += scorePercent;
     stats.studyMinutes += 15; // Assume 15 mins per quiz

     // Update weekly chart for current day
     const today = new Date().toLocaleDateString('en-US', { weekday: 'short' });
     const dayIndex = stats.weeklyScores.findIndex((d: any) => d.name === today);
     if (dayIndex !== -1) {
        stats.weeklyScores[dayIndex].score = scorePercent; // Record latest score for the day
     }

     localStorage.setItem('edu_stats', JSON.stringify(stats));
  };

  const handleSubmit = () => {
    setSubmitted(true);
    const score = calculateScore();
    const percentage = Math.round((score / questions.length) * 100);
    updateStats(percentage);
  };

  const calculateScore = () => {
    let score = 0;
    questions.forEach(q => {
      if (userAnswers[q.id] === q.correctAnswer) score++;
    });
    return score;
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-10">
        <div className="flex flex-col space-y-2">
            <h2 className="text-2xl font-bold text-slate-800">Self Assessment Quiz</h2>
            <p className="text-slate-500 text-sm">Test your knowledge on specific chapters from {preferences.board}.</p>
        </div>

        {/* Setup Card */}
        {!questions.length && !loading && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8 text-center">
                <div className="max-w-md mx-auto space-y-4">
                    <div>
                        <label className="block text-left text-sm font-medium text-slate-700 mb-1">Subject</label>
                        <select 
                            value={subject} 
                            onChange={(e) => setSubject(e.target.value as Subject)}
                            className="w-full p-3 border border-slate-300 rounded-lg bg-slate-50 focus:ring-2 focus:ring-indigo-500 outline-none"
                        >
                            {Object.values(Subject).map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-left text-sm font-medium text-slate-700 mb-1">Topic / Chapter</label>
                         
                         {/* Pre-available Chapters Dropdown */}
                        {availableTopics.length > 0 && (
                            <select 
                                onChange={(e) => setTopic(e.target.value)}
                                value={availableTopics.includes(topic) ? topic : ''}
                                className="w-full p-3 mb-2 border border-slate-300 rounded-lg bg-slate-50 focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                            >
                                <option value="">-- Select from Syllabus --</option>
                                {availableTopics.map(t => (
                                    <option key={t} value={t}>{t}</option>
                                ))}
                            </select>
                        )}

                        <input 
                            type="text" 
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                            placeholder="Or type a custom topic e.g. Periodic Table"
                            className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                        />
                    </div>
                    <button 
                        onClick={handleStartQuiz}
                        disabled={!topic.trim()}
                        className="w-full bg-indigo-600 text-white py-3 rounded-lg font-bold hover:bg-indigo-700 transition-colors disabled:opacity-50"
                    >
                        Start Quiz
                    </button>
                </div>
            </div>
        )}

        {loading && (
            <div className="flex flex-col items-center justify-center py-20 text-indigo-600">
                <Loader2 size={48} className="animate-spin mb-4" />
                <p className="font-medium">Generating 10 smart questions for you...</p>
            </div>
        )}

        {/* Quiz Interface */}
        {questions.length > 0 && (
            <div className="space-y-6 animate-fade-in">
                {questions.map((q, index) => (
                    <div key={q.id} className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="text-lg font-medium text-slate-800">
                                <span className="text-indigo-500 font-bold mr-2">Q{index + 1}.</span>
                                {q.question}
                            </h3>
                        </div>
                        <div className="space-y-2">
                            {q.options.map((option, optIdx) => {
                                const isSelected = userAnswers[q.id] === optIdx;
                                const isCorrect = q.correctAnswer === optIdx;
                                const isWrong = isSelected && !isCorrect;
                                
                                let btnClass = "w-full text-left p-3 rounded-lg border transition-all ";
                                
                                if (submitted) {
                                    if (isCorrect) btnClass += "bg-green-50 border-green-500 text-green-700";
                                    else if (isWrong) btnClass += "bg-red-50 border-red-500 text-red-700";
                                    else btnClass += "bg-slate-50 border-slate-200 opacity-60";
                                } else {
                                    if (isSelected) btnClass += "bg-indigo-50 border-indigo-500 text-indigo-700 ring-1 ring-indigo-500";
                                    else btnClass += "bg-white border-slate-200 hover:bg-slate-50 hover:border-slate-300";
                                }

                                return (
                                    <button
                                        key={optIdx}
                                        onClick={() => handleOptionSelect(q.id, optIdx)}
                                        disabled={submitted}
                                        className={btnClass}
                                    >
                                        <div className="flex items-center justify-between">
                                            <span>{option}</span>
                                            {submitted && isCorrect && <CheckCircle size={18} className="text-green-600" />}
                                            {submitted && isWrong && <XCircle size={18} className="text-red-600" />}
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                        {submitted && (
                            <div className="mt-4 p-3 bg-blue-50 rounded-lg text-sm text-blue-800">
                                <span className="font-bold">Explanation:</span> {q.explanation}
                            </div>
                        )}
                    </div>
                ))}

                {!submitted ? (
                    <div className="flex justify-end">
                        <button 
                            onClick={handleSubmit}
                            disabled={Object.keys(userAnswers).length < questions.length}
                            className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            Submit Quiz
                        </button>
                    </div>
                ) : (
                    <div className="bg-indigo-900 text-white rounded-xl p-8 text-center space-y-4 animate-pop-in">
                        <Trophy size={48} className="mx-auto text-yellow-400" />
                        <h3 className="text-2xl font-bold">Score: {calculateScore()} / {questions.length}</h3>
                        <p className="text-indigo-200">Great job practicing!</p>
                        <button 
                            onClick={() => { setQuestions([]); setTopic(''); }}
                            className="inline-flex items-center bg-white text-indigo-900 px-6 py-2 rounded-full font-bold hover:bg-indigo-50 transition-colors"
                        >
                            <RefreshCw size={18} className="mr-2" /> Try Another Topic
                        </button>
                    </div>
                )}
            </div>
        )}
    </div>
  );
};