
import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { NotesGenerator } from './components/NotesGenerator';
import { QuizGenerator } from './components/QuizGenerator';
import { AskDoubt } from './components/AskDoubt';
import { AiResources } from './components/AiResources';
import { AboutUs } from './components/AboutUs';
import { PreviousPapers } from './components/PreviousPapers';
import { InteractiveAd } from './components/InteractiveAd';
import { ViewMode, Board, Grade, UserPreferences, User } from './types';

const App: React.FC = () => {
  const [user, setUser] = useState<User>({
    mobile: 'Student',
    grade: Grade.CLASS_10,
    board: Board.NCERT,
    name: 'Guest User'
  });
  
  const [currentView, setCurrentView] = useState<ViewMode>('DASHBOARD');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [preferences, setPreferences] = useState<UserPreferences>({
    board: Board.NCERT,
    grade: Grade.CLASS_10,
  });
  
  // State to prefill quiz topic when navigating from notes
  const [quizTopic, setQuizTopic] = useState<string>('');
  
  // Replaced simple splash screen with the Interactive Ad
  const [showAd, setShowAd] = useState(true);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  const handleLogout = () => {
     window.location.reload();
  };

  const handleStartQuiz = (topic: string) => {
    setQuizTopic(topic);
    setCurrentView('QUIZ');
  };

  const renderContent = () => {
    switch (currentView) {
      case 'DASHBOARD':
        return <Dashboard preferences={preferences} setPreferences={setPreferences} />;
      case 'NOTES':
        return <NotesGenerator preferences={preferences} onStartQuiz={handleStartQuiz} />;
      case 'QUIZ':
        return <QuizGenerator preferences={preferences} initialTopic={quizTopic} />;
      case 'ASK_DOUBT':
        return <AskDoubt preferences={preferences} />;
      case 'AI_RESOURCES':
        return <AiResources />;
      case 'PREVIOUS_PAPERS':
        return <PreviousPapers preferences={preferences} />;
      case 'ABOUT':
        return <AboutUs />;
      default:
        return <Dashboard preferences={preferences} setPreferences={setPreferences} />;
    }
  };

  if (showAd) {
    return <InteractiveAd onEnterApp={() => setShowAd(false)} />;
  }

  return (
    <Layout 
      currentView={currentView} 
      onNavigate={setCurrentView}
      isMobileMenuOpen={isMobileMenuOpen}
      toggleMobileMenu={toggleMobileMenu}
      user={user}
      onLogout={handleLogout}
    >
      {renderContent()}
    </Layout>
  );
};

export default App;