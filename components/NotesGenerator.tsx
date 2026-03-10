
import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { generateStudyNotesStream } from '../services/geminiService';
import { Board, Grade, Subject, UserPreferences, SavedNote } from '../types';
import { Loader2, BookOpen, Download, Share2, AlertCircle, Save, Trash2, Trophy, ArrowRight } from 'lucide-react';
import { SYLLABUS } from '../data/syllabus';

interface NotesGeneratorProps {
  preferences: UserPreferences;
  onStartQuiz?: (topic: string) => void;
}

export const NotesGenerator: React.FC<NotesGeneratorProps> = ({ preferences, onStartQuiz }) => {
  const [topic, setTopic] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<Subject>(Subject.PHYSICS);
  const [notes, setNotes] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedNotes, setSavedNotes] = useState<SavedNote[]>([]);
  const [viewingSaved, setViewingSaved] = useState<SavedNote | null>(null);
  const [showMockTestAlert, setShowMockTestAlert] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);

  const availableTopics = SYLLABUS[selectedSubject]?.[preferences.grade] || [];

  useEffect(() => {
    const saved = localStorage.getItem('edu_saved_notes');
    if (saved) {
      setSavedNotes(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
      // Reset topic input when subject changes
      setTopic('');
      setShowMockTestAlert(false);
  }, [selectedSubject, preferences.grade]);

  const updateStats = (minutes: number, topics: number = 0) => {
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
    stats.studyMinutes += minutes;
    stats.topicsMastered += topics;
    localStorage.setItem('edu_stats', JSON.stringify(stats));
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;

    setLoading(true);
    setError(null);
    setNotes(''); // Initialize as empty string to start streaming
    setViewingSaved(null);
    setShowMockTestAlert(false);
    
    // Scroll to view immediately
    setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);

    try {
      const stream = generateStudyNotesStream(
        topic,
        preferences.board,
        preferences.grade,
        selectedSubject
      );
      
      let accumulatedNotes = '';
      for await (const chunk of stream) {
          accumulatedNotes += chunk;
          setNotes(accumulatedNotes);
      }
      // Add 5 minutes to study time for generating notes
      updateStats(5, 0);
      setShowMockTestAlert(true);
    } catch (err) {
      setError("Failed to generate notes. Please check your connection and try again.");
      setNotes(null); // Reset if failed completely without data
    } finally {
      setLoading(false);
    }
  };

  const handleSaveNote = () => {
    if (!notes) return;
    
    const newNote: SavedNote = {
      id: Date.now().toString(),
      topic: topic,
      subject: selectedSubject,
      content: notes,
      date: new Date().toLocaleDateString(),
      grade: preferences.grade,
      board: preferences.board
    };

    const updatedNotes = [newNote, ...savedNotes];
    setSavedNotes(updatedNotes);
    localStorage.setItem('edu_saved_notes', JSON.stringify(updatedNotes));
    
    // Increment topics mastered and add 1 min interaction time
    updateStats(1, 1);
    alert('Note saved successfully!');
  };

  const handleDeleteNote = (id: string) => {
    const updated = savedNotes.filter(n => n.id !== id);
    setSavedNotes(updated);
    localStorage.setItem('edu_saved_notes', JSON.stringify(updated));
    if (viewingSaved?.id === id) {
        setViewingSaved(null);
        setNotes(null);
    }
  };

  const handleViewSaved = (note: SavedNote) => {
    setViewingSaved(note);
    setNotes(note.content);
    setTopic(note.topic);
    setSelectedSubject(note.subject);
    setShowMockTestAlert(true);
    setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleDownloadPDF = () => {
    window.print();
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-10">
      <div className="flex flex-col space-y-2 no-print">
        <h2 className="text-2xl font-bold text-slate-800">AI Study Notes</h2>
        <p className="text-slate-500 text-sm">
          Generate comprehensive notes for {preferences.board} {preferences.grade}.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 no-print">
        {/* Left Col: Generator */}
        <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                <form onSubmit={handleGenerate} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Subject</label>
                    <div className="flex flex-wrap gap-2">
                    {Object.values(Subject).map((subj) => (
                        <button
                        key={subj}
                        type="button"
                        onClick={() => setSelectedSubject(subj)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                            selectedSubject === subj
                            ? 'bg-indigo-600 text-white shadow-sm'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                        >
                        {subj}
                        </button>
                    ))}
                    </div>
                </div>

                <div>
                    <label htmlFor="topic" className="block text-sm font-medium text-slate-700 mb-2">Select Chapter or Enter Topic</label>
                    
                    {/* Pre-available Chapters Dropdown */}
                    {availableTopics.length > 0 && (
                        <select 
                            onChange={(e) => setTopic(e.target.value)}
                            value={availableTopics.includes(topic) ? topic : ''}
                            className="w-full px-4 py-2.5 mb-3 rounded-lg border border-slate-300 bg-slate-50 focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                        >
                            <option value="">-- Select from Syllabus --</option>
                            {availableTopics.map(t => (
                                <option key={t} value={t}>{t}</option>
                            ))}
                        </select>
                    )}

                    <div className="relative">
                        <input
                            type="text"
                            id="topic"
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                            placeholder="Or type a custom topic e.g., Thermodynamics..."
                            className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-shadow"
                        />
                        <button
                            type="submit"
                            disabled={loading || !topic.trim()}
                            className="absolute right-2 top-2 bg-indigo-600 text-white p-1.5 px-4 rounded-md text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                        >
                            {loading ? <Loader2 className="animate-spin" size={18} /> : 'Generate'}
                        </button>
                    </div>
                </div>
                </form>
            </div>
        </div>

        {/* Right Col: Saved Notes */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 h-fit max-h-96 overflow-y-auto">
            <h3 className="font-semibold text-slate-800 mb-3 flex items-center">
                <Save size={16} className="mr-2 text-indigo-600" /> Saved Notes
            </h3>
            {savedNotes.length === 0 ? (
                <p className="text-sm text-slate-400 text-center py-4">No saved notes yet.</p>
            ) : (
                <div className="space-y-2">
                    {savedNotes.map(note => (
                        <div key={note.id} className="p-3 rounded-lg bg-slate-50 border border-slate-100 hover:border-indigo-200 transition-colors group relative">
                            <div onClick={() => handleViewSaved(note)} className="cursor-pointer">
                                <p className="font-medium text-sm text-slate-800 truncate">{note.topic}</p>
                                <div className="flex justify-between items-center mt-1">
                                    <span className="text-xs text-slate-500 bg-white px-1.5 py-0.5 rounded border border-slate-200">{note.subject}</span>
                                    <span className="text-xs text-slate-400">{note.date}</span>
                                </div>
                            </div>
                            <button 
                                onClick={(e) => { e.stopPropagation(); handleDeleteNote(note.id); }}
                                className="absolute top-2 right-2 p-1 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <Trash2 size={14} />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start text-red-700 no-print">
          <AlertCircle className="mr-2 mt-0.5 flex-shrink-0" size={18} />
          <span className="text-sm">{error}</span>
        </div>
      )}

      {/* Show if notes is not null (even if empty string during start of stream) */}
      {notes !== null && (
        <div ref={resultRef} className="animate-slide-up printable-content">
            {/* Mock Test Notification */}
            {showMockTestAlert && onStartQuiz && (
                <div className="mb-6 p-5 bg-indigo-900 rounded-xl text-white flex flex-col sm:flex-row items-center justify-between shadow-lg animate-pop-in border border-indigo-700 no-print">
                    <div className="flex items-center mb-4 sm:mb-0">
                        <div className="p-3 bg-indigo-800 rounded-full mr-4">
                             <Trophy className="text-yellow-400" size={24} />
                        </div>
                        <div>
                            <h4 className="font-bold text-lg">Chapter Completed!</h4>
                            <p className="text-indigo-200 text-sm">You've mastered the notes for "{topic}". Ready to test your knowledge?</p>
                        </div>
                    </div>
                    <button 
                        onClick={() => onStartQuiz(topic)}
                        className="w-full sm:w-auto px-6 py-3 bg-white text-indigo-900 font-bold rounded-lg hover:bg-indigo-50 transition-colors flex items-center justify-center shadow-md"
                    >
                        Take Mock Test <ArrowRight size={18} className="ml-2" />
                    </button>
                </div>
            )}

            <div className="bg-white rounded-xl border border-slate-200 shadow-lg overflow-hidden">
                <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex justify-between items-center no-print">
                    <div className="flex items-center text-slate-600">
                        <BookOpen size={18} className="mr-2 text-indigo-600" />
                        <span className="font-semibold text-sm uppercase tracking-wide">{selectedSubject} - {preferences.grade}</span>
                    </div>
                    <div className="flex space-x-2">
                         <button 
                            onClick={handleSaveNote}
                            disabled={loading}
                            className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors disabled:opacity-50" 
                            title="Save to Library"
                         >
                            <Save size={18} />
                         </button>
                         <button 
                            onClick={handleDownloadPDF}
                            disabled={loading}
                            className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors flex items-center gap-2 disabled:opacity-50" 
                            title="Download PDF"
                         >
                            <Download size={18} />
                            <span className="text-xs font-medium hidden sm:inline">Download PDF</span>
                         </button>
                    </div>
                </div>
                
                {/* Print Header (Visible only in print) */}
                <div className="hidden print:block mb-6 text-center border-b pb-4">
                    <h1 className="text-2xl font-bold text-slate-900">{topic}</h1>
                    <p className="text-sm text-slate-500">Subject: {selectedSubject} | Class: {preferences.grade} | Board: {preferences.board}</p>
                </div>

                <div className="p-8 markdown-body text-slate-800 min-h-[200px]">
                    {notes === '' && loading ? (
                         <div className="flex flex-col items-center justify-center h-40 text-slate-400">
                             <Loader2 size={30} className="animate-spin mb-3 text-indigo-500" />
                             <p>Generating notes...</p>
                         </div>
                    ) : (
                        <ReactMarkdown>
                            {notes}
                        </ReactMarkdown>
                    )}
                </div>
                <div className="bg-indigo-50 p-4 text-center border-t border-indigo-100 no-print">
                    <p className="text-xs text-indigo-600 font-medium">
                        Content generated based on {preferences.board} guidelines. Always verify with your textbook.
                    </p>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};