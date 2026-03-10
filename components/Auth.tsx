import React, { useState, useRef } from 'react';
import { User, AuthState, Grade, Board } from '../types';
import { Phone, Lock, ArrowRight, Upload, CheckCircle, BookOpen, ShieldCheck } from 'lucide-react';

interface AuthProps {
  onLogin: (user: User) => void;
}

export const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [view, setView] = useState<AuthState>('LOGIN');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [profilePic, setProfilePic] = useState<string | undefined>(undefined);
  const [grade, setGrade] = useState<Grade>(Grade.CLASS_10);
  const [newPassword, setNewPassword] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [error, setError] = useState<string | null>(null);

  // Mock stored users for demonstration
  const getStoredUser = (mob: string): User | null => {
    const usersStr = localStorage.getItem('edu_users');
    if (!usersStr) return null;
    const users = JSON.parse(usersStr);
    return users[mob] || null;
  };

  const saveUser = (user: User) => {
    const usersStr = localStorage.getItem('edu_users');
    const users = usersStr ? JSON.parse(usersStr) : {};
    users[user.mobile] = user;
    localStorage.setItem('edu_users', JSON.stringify(users));
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const user = getStoredUser(mobile);
    
    if (user && user.password === password) {
      onLogin(user);
    } else {
      setError("Invalid mobile number or password.");
    }
  };

  const requestOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (mobile.length < 10) {
      setError("Please enter a valid mobile number.");
      return;
    }
    // In a real app, send OTP here.
    setView('SIGNUP_OTP');
    setError(null);
  };

  const verifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp === '1234') { // Mock OTP
      setView('SIGNUP_PROFILE');
      setError(null);
    } else {
      setError("Invalid OTP. Try '1234'.");
    }
  };

  const handleProfileCompletion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 4) {
        setError("Password must be at least 4 characters.");
        return;
    }
    
    const newUser: User = {
      mobile,
      email,
      grade,
      password: newPassword,
      profilePic,
      board: Board.NCERT // Default, can be changed in dashboard
    };
    
    saveUser(newUser);
    onLogin(newUser);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePic(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-indigo-600 p-6 text-center">
           <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/20 mb-4">
              <BookOpen className="text-white" size={24} />
           </div>
           <h1 className="text-2xl font-bold text-white mb-1">EduSync</h1>
           <p className="text-indigo-100 text-sm">Your AI-Powered Study Companion</p>
        </div>

        <div className="p-8">
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm rounded-lg border border-red-100">
              {error}
            </div>
          )}

          {view === 'LOGIN' && (
            <form onSubmit={handleLogin} className="space-y-4">
              <h2 className="text-xl font-bold text-slate-800 mb-6">Welcome Back</h2>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Mobile Number</label>
                <div className="relative">
                    <Phone size={18} className="absolute left-3 top-3 text-slate-400" />
                    <input 
                        type="tel" 
                        value={mobile}
                        onChange={(e) => setMobile(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                        placeholder="Enter your mobile"
                        required
                    />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                <div className="relative">
                    <Lock size={18} className="absolute left-3 top-3 text-slate-400" />
                    <input 
                        type="password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                        placeholder="Enter password"
                        required
                    />
                </div>
              </div>
              <button type="submit" className="w-full bg-indigo-600 text-white py-2.5 rounded-lg font-semibold hover:bg-indigo-700 transition-colors mt-2">
                Login
              </button>
              <p className="text-center text-sm text-slate-500 mt-4">
                New to EduSync? <button type="button" onClick={() => setView('SIGNUP_INPUT')} className="text-indigo-600 font-medium hover:underline">Create Account</button>
              </p>
            </form>
          )}

          {view === 'SIGNUP_INPUT' && (
            <form onSubmit={requestOtp} className="space-y-4">
              <h2 className="text-xl font-bold text-slate-800 mb-6">Create Account</h2>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Mobile Number</label>
                <input 
                    type="tel" 
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                    placeholder="Enter your mobile"
                    required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email (Optional)</label>
                <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                    placeholder="Enter your email"
                />
              </div>
              <button type="submit" className="w-full bg-indigo-600 text-white py-2.5 rounded-lg font-semibold hover:bg-indigo-700 transition-colors flex items-center justify-center">
                Get OTP <ArrowRight size={16} className="ml-2" />
              </button>
              <p className="text-center text-sm text-slate-500 mt-4">
                Already have an account? <button type="button" onClick={() => setView('LOGIN')} className="text-indigo-600 font-medium hover:underline">Login</button>
              </p>
            </form>
          )}

          {view === 'SIGNUP_OTP' && (
            <form onSubmit={verifyOtp} className="space-y-4">
              <h2 className="text-xl font-bold text-slate-800 mb-2">Verify Mobile</h2>
              <p className="text-sm text-slate-500 mb-4">Enter the OTP sent to {mobile}</p>
              <div>
                <input 
                    type="text" 
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-center letter-spacing-2 text-xl"
                    placeholder="Enter OTP (1234)"
                    maxLength={4}
                    required
                />
              </div>
              <button type="submit" className="w-full bg-indigo-600 text-white py-2.5 rounded-lg font-semibold hover:bg-indigo-700 transition-colors">
                Verify OTP
              </button>
            </form>
          )}

          {view === 'SIGNUP_PROFILE' && (
            <form onSubmit={handleProfileCompletion} className="space-y-5">
              <h2 className="text-xl font-bold text-slate-800 mb-2">Complete Profile</h2>
              
              <div className="flex justify-center">
                <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                  <div className="w-24 h-24 rounded-full bg-slate-100 border-2 border-dashed border-slate-300 flex items-center justify-center overflow-hidden">
                    {profilePic ? (
                      <img src={profilePic} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <Upload className="text-slate-400" size={24} />
                    )}
                  </div>
                  <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <span className="text-white text-xs font-medium">Change</span>
                  </div>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleFileChange} 
                    accept="image/*" 
                    className="hidden" 
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Select Class</label>
                <select 
                  value={grade} 
                  onChange={(e) => setGrade(e.target.value as Grade)}
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                  {Object.values(Grade).map(g => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Set Password</label>
                <div className="relative">
                    <ShieldCheck size={18} className="absolute left-3 top-3 text-slate-400" />
                    <input 
                        type="password" 
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                        placeholder="Create a password"
                        required
                    />
                </div>
              </div>

              <button type="submit" className="w-full bg-green-600 text-white py-2.5 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center">
                Complete Setup <CheckCircle size={18} className="ml-2" />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
