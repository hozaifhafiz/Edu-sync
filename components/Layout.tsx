
import React, { ReactNode } from 'react';
import { BookOpen, GraduationCap, LayoutDashboard, HelpCircle, Menu, X, Info, BrainCircuit, FileText } from 'lucide-react';
import { ViewMode, User } from '../types';

interface LayoutProps {
  children: ReactNode;
  currentView: ViewMode;
  onNavigate: (view: ViewMode) => void;
  isMobileMenuOpen: boolean;
  toggleMobileMenu: () => void;
  user: User | null;
  onLogout: () => void;
}

const NavItem = ({ 
  icon: Icon, 
  label, 
  active, 
  onClick,
  delay,
  isOpen
}: { 
  icon: React.ElementType, 
  label: string, 
  active: boolean, 
  onClick: () => void,
  delay: number,
  isOpen: boolean
}) => (
  <button
    onClick={onClick}
    style={{ transitionDelay: `${isOpen ? delay : 0}ms` }}
    className={`flex items-center w-full px-4 py-3 mb-2 rounded-lg transition-all duration-500 ease-out transform ${
      active 
        ? 'bg-indigo-600 text-white shadow-md' 
        : 'text-slate-600 hover:bg-indigo-50 hover:text-indigo-600'
    } ${
      isOpen 
        ? 'opacity-100 translate-x-0' 
        : 'opacity-0 -translate-x-4 lg:opacity-100 lg:translate-x-0'
    }`}
  >
    <Icon size={20} className="mr-3" />
    <span className="font-medium">{label}</span>
  </button>
);

export const Layout: React.FC<LayoutProps> = ({ 
  children, 
  currentView, 
  onNavigate, 
  isMobileMenuOpen, 
  toggleMobileMenu,
  user,
  onLogout
}) => {
  return (
    <div className="flex h-screen bg-slate-50">
      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 lg:hidden transition-opacity duration-300"
          onClick={toggleMobileMenu}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-30 w-64 bg-white border-r border-slate-200 transform transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-slate-100">
          <div className="flex items-center text-indigo-600">
            <BookOpen size={28} className="mr-2" />
            <span className="text-xl font-bold tracking-tight">EduSync</span>
          </div>
          <button onClick={toggleMobileMenu} className="lg:hidden text-slate-500 hover:text-slate-700 transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="p-4 overflow-y-auto h-[calc(100vh-4rem)] flex flex-col">
          <div className="mb-6">
            <p className="px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Menu</p>
            <NavItem 
              icon={LayoutDashboard} 
              label="Dashboard" 
              active={currentView === 'DASHBOARD'} 
              onClick={() => { onNavigate('DASHBOARD'); toggleMobileMenu(); }}
              delay={50}
              isOpen={isMobileMenuOpen}
            />
            <NavItem 
              icon={BookOpen} 
              label="Study Notes" 
              active={currentView === 'NOTES'} 
              onClick={() => { onNavigate('NOTES'); toggleMobileMenu(); }}
              delay={100}
              isOpen={isMobileMenuOpen}
            />
            <NavItem 
              icon={GraduationCap} 
              label="Take Quiz" 
              active={currentView === 'QUIZ'} 
              onClick={() => { onNavigate('QUIZ'); toggleMobileMenu(); }}
              delay={150}
              isOpen={isMobileMenuOpen}
            />
            <NavItem 
              icon={HelpCircle} 
              label="Ask AI Tutor" 
              active={currentView === 'ASK_DOUBT'} 
              onClick={() => { onNavigate('ASK_DOUBT'); toggleMobileMenu(); }}
              delay={200}
              isOpen={isMobileMenuOpen}
            />
            <NavItem 
              icon={FileText} 
              label="Previous Papers" 
              active={currentView === 'PREVIOUS_PAPERS'} 
              onClick={() => { onNavigate('PREVIOUS_PAPERS'); toggleMobileMenu(); }}
              delay={225}
              isOpen={isMobileMenuOpen}
            />
            <NavItem 
              icon={BrainCircuit} 
              label="AI Hub" 
              active={currentView === 'AI_RESOURCES'} 
              onClick={() => { onNavigate('AI_RESOURCES'); toggleMobileMenu(); }}
              delay={250}
              isOpen={isMobileMenuOpen}
            />
            <NavItem 
              icon={Info} 
              label="About Us" 
              active={currentView === 'ABOUT'} 
              onClick={() => { onNavigate('ABOUT'); toggleMobileMenu(); }}
              delay={300}
              isOpen={isMobileMenuOpen}
            />
          </div>

          <div className={`mt-auto pt-6 transition-all duration-700 ease-out delay-300 ${
             isMobileMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 lg:opacity-100 lg:translate-y-0'
          }`}>
             <div className="px-4 py-4 bg-slate-50 rounded-lg border border-slate-100 mb-4">
                <p className="text-xs text-slate-500 mb-2 font-medium">Synced Platforms</p>
                <div className="flex flex-wrap gap-2">
                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-md font-medium border border-green-200">NCERT</span>
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-md font-medium border border-blue-200">JKBOSE</span>
                </div>
             </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 lg:px-8 no-print">
          <button onClick={toggleMobileMenu} className="lg:hidden p-2 -ml-2 text-slate-600 hover:text-indigo-600 transition-colors">
            <Menu size={24} />
          </button>
          <div className="flex-1 px-4">
             {/* Header content placeholder */}
          </div>
          <div className="flex items-center space-x-4">
             {user ? (
                 <div className="flex items-center gap-3">
                    <div className="text-right hidden md:block">
                        <p className="text-sm font-semibold text-slate-800">{user.mobile}</p>
                        <p className="text-xs text-slate-500">{user.grade}</p>
                    </div>
                    {user.profilePic ? (
                        <img src={user.profilePic} alt="Profile" className="w-9 h-9 rounded-full object-cover border border-slate-200" />
                    ) : (
                        <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-sm border border-indigo-200">
                            ES
                        </div>
                    )}
                 </div>
             ) : (
                 <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-sm border border-indigo-200">
                    ES
                 </div>
             )}
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-4 lg:p-8 relative">
           {/* Animated Wrapper */}
          <div key={currentView} className="animate-enter-view h-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};