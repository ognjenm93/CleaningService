
import React from 'react';
import { User } from '../types';

interface NavbarProps {
  onNavigate: (page: string) => void;
  currentPage: string;
  unreadCount?: number;
  currentUser: User | null;
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onNavigate, currentPage, unreadCount = 0, currentUser, onLogout }) => {
  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div 
            className="flex items-center cursor-pointer group"
            onClick={() => onNavigate('home')}
          >
            <div className="bg-blue-600 p-2 rounded-lg group-hover:bg-blue-700 transition-colors">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <span className="ml-3 text-xl font-bold text-gray-900 tracking-tight">Sjaj&Red</span>
          </div>
          
          <div className="hidden md:flex space-x-8 items-center">
            <button 
              onClick={() => onNavigate('home')}
              className={`${currentPage === 'home' ? 'text-blue-600' : 'text-gray-600'} hover:text-blue-500 font-medium transition-colors`}
            >
              Pronađi čistača
            </button>
            <button 
              onClick={() => onNavigate('messages')}
              className={`relative ${currentPage === 'messages' ? 'text-blue-600' : 'text-gray-600'} hover:text-blue-500 font-medium transition-colors flex items-center`}
            >
              Moje Poruke
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-4 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>
            
            {currentUser ? (
              <div className="flex items-center space-x-4 ml-4 pl-4 border-l border-gray-100">
                <div className="text-right">
                  <p className="text-sm font-bold text-gray-900 leading-none">{currentUser.fullName}</p>
                  <button onClick={onLogout} className="text-[10px] text-red-500 font-bold hover:underline">Odjava</button>
                </div>
                <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-xs">
                  {currentUser.fullName[0].toUpperCase()}
                </div>
              </div>
            ) : (
              <button 
                onClick={() => onNavigate('auth')}
                className="bg-blue-600 text-white px-5 py-2.5 rounded-full hover:bg-blue-700 transition-all font-semibold shadow-sm hover:shadow-md"
              >
                Prijava / Registracija
              </button>
            )}
          </div>

          <div className="md:hidden flex items-center space-x-4">
            <button 
              onClick={() => onNavigate('messages')}
              className="relative p-2 text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 bg-red-500 text-white text-[8px] font-bold w-3 h-3 rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>
            <button onClick={() => onNavigate('auth')} className="text-blue-600 font-bold text-sm">
              {currentUser ? 'Profil' : 'Prijava'}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
