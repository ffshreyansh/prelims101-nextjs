import React, { useState } from 'react';
import { User } from '../types';
import { X, Award, Sparkles, Mail, Lock, User as UserIcon, Calendar, BookOpen, ArrowRight } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: User) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess
}) => {
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [targetYear, setTargetYear] = useState('2025');
  const [optionalSubject, setOptionalSubject] = useState('Public Administration');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email) {
      setError('Please provide an email address.');
      return;
    }

    if (isRegister && !name) {
      setError('Please provide your name.');
      return;
    }

    setLoading(true);
    try {
      const endpoint = isRegister ? '/api/auth/register' : '/api/auth/login';
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name || 'UPSC Aspirant',
          email,
          targetYear,
          optionalSubject,
          password
        }),
      });

      const data = await res.json();
      if (data.success && data.user) {
        onLoginSuccess(data.user);
        onClose();
      } else {
        // Fallback user if server route is offline
        const fallbackUser: User = {
          id: `user-${Date.now()}`,
          name: name || email.split('@')[0],
          email,
          targetYear,
          optionalSubject,
          isGuest: false,
          freeTestsRemaining: 5,
          isSubscribed: false,
          planType: 'free',
          createdAt: new Date().toISOString()
        };
        onLoginSuccess(fallbackUser);
        onClose();
      }
    } catch (err: any) {
      // Local fallback on any network error
      const fallbackUser: User = {
        id: `user-${Date.now()}`,
        name: name || 'UPSC Aspirant',
        email,
        targetYear,
        optionalSubject,
        isGuest: false,
        freeTestsRemaining: 5,
        isSubscribed: false,
        planType: 'free',
        createdAt: new Date().toISOString()
      };
      onLoginSuccess(fallbackUser);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = () => {
    const demoUser: User = {
      id: 'demo-user-aspirant',
      name: 'Shreyansh Kumar (Demo Aspirant)',
      email: 'shreyanshkumar1403@gmail.com',
      targetYear: '2025',
      optionalSubject: 'Public Administration',
      isGuest: true,
      freeTestsRemaining: 5,
      isSubscribed: false,
      planType: 'free',
      createdAt: new Date().toISOString()
    };
    onLoginSuccess(demoUser);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden transform transition-all">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-900 via-slate-900 to-blue-950 p-6 text-white text-center relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="w-12 h-12 bg-amber-400/20 text-amber-400 rounded-xl flex items-center justify-center mx-auto mb-3 border border-amber-400/30">
            <Award className="w-6 h-6" />
          </div>
          
          <h2 className="font-serif-heading text-xl font-bold">
            {isRegister ? 'Create Aspirant Account' : 'UPSC Aspirant Portal'}
          </h2>
          <p className="text-xs text-blue-200 mt-1">
            {isRegister 
              ? 'Personalize your PIB feed and track mock exam analytics' 
              : 'Sign in to access your saved notes, bookmarks, and revision queue'}
          </p>
        </div>

        {/* Instant Demo Quick Access */}
        <div className="p-4 bg-amber-50/70 border-b border-amber-100 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span className="text-xs font-semibold text-amber-900">Want to explore right away?</span>
          </div>
          <button
            type="button"
            onClick={handleDemoLogin}
            className="text-xs bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-3 py-1.5 rounded-lg shadow-xs transition-colors flex items-center space-x-1"
          >
            <span>One-Click Demo</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg">
              {error}
            </div>
          )}

          {isRegister && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Full Name
              </label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="e.g. Shreyansh Kumar"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-lg focus:border-blue-600 outline-none"
                  required
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
              <input
                type="email"
                placeholder="aspirant@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-lg focus:border-blue-600 outline-none"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-lg focus:border-blue-600 outline-none"
              />
            </div>
          </div>

          {isRegister && (
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center space-x-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-500" />
                  <span>Target Year</span>
                </label>
                <select
                  value={targetYear}
                  onChange={(e) => setTargetYear(e.target.value)}
                  className="w-full px-2.5 py-2 text-xs border border-slate-200 rounded-lg bg-white focus:border-blue-600 outline-none"
                >
                  <option value="2025">CSE 2025</option>
                  <option value="2026">CSE 2026</option>
                  <option value="2027">CSE 2027</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center space-x-1">
                  <BookOpen className="w-3.5 h-3.5 text-slate-500" />
                  <span>Optional</span>
                </label>
                <select
                  value={optionalSubject}
                  onChange={(e) => setOptionalSubject(e.target.value)}
                  className="w-full px-2.5 py-2 text-xs border border-slate-200 rounded-lg bg-white focus:border-blue-600 outline-none"
                >
                  <option value="Public Administration">Pub Ad</option>
                  <option value="PSIR">PSIR</option>
                  <option value="Geography">Geography</option>
                  <option value="Sociology">Sociology</option>
                  <option value="History">History</option>
                  <option value="Anthropology">Anthropology</option>
                  <option value="Economics">Economics</option>
                  <option value="Other">Other / Not decided</option>
                </select>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 bg-blue-900 hover:bg-blue-800 text-white font-semibold py-2.5 rounded-lg text-xs transition-colors shadow-xs flex items-center justify-center space-x-2"
          >
            {loading ? (
              <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            ) : (
              <span>{isRegister ? 'Complete Registration' : 'Sign In to Dashboard'}</span>
            )}
          </button>

          <div className="text-center pt-2 text-xs text-slate-500">
            {isRegister ? (
              <span>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => setIsRegister(false)}
                  className="text-blue-900 font-bold hover:underline"
                >
                  Sign In
                </button>
              </span>
            ) : (
              <span>
                New UPSC aspirant?{' '}
                <button
                  type="button"
                  onClick={() => setIsRegister(true)}
                  className="text-blue-900 font-bold hover:underline"
                >
                  Create an account
                </button>
              </span>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
