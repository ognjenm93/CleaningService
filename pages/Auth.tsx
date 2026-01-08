
import React, { useState } from 'react';
import { User } from '../types';

interface AuthProps {
  onLogin: (user: User) => void;
  onBack: () => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin, onBack }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    role: 'client' as 'client' | 'cleaner'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simulacija autentifikacije
    const mockUser: User = {
      id: Date.now().toString(),
      fullName: isLogin ? (formData.email.split('@')[0]) : formData.fullName,
      email: formData.email,
      role: formData.role
    };

    onLogin(mockUser);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
        <div className="bg-blue-600 px-8 py-10 text-center text-white relative">
          <button 
            onClick={onBack}
            className="absolute top-6 left-6 text-white/80 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <h1 className="text-3xl font-bold mb-2">{isLogin ? 'Dobrodošli natrag' : 'Pridruži se zajednici'}</h1>
          <p className="text-blue-100 text-sm">{isLogin ? 'Prijavite se kako biste kontaktirali čistače' : 'Kreirajte račun i počnite sa sjajnim uslugama'}</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          {!isLogin && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Puno ime i prezime</label>
              <input 
                type="text" 
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                value={formData.fullName}
                onChange={e => setFormData({...formData, fullName: e.target.value})}
                placeholder="npr. Marko Marković"
              />
            </div>
          )}
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">E-mail adresa</label>
            <input 
              type="email" 
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              value={formData.email}
              onChange={e => setFormData({...formData, email: e.target.value})}
              placeholder="vjeran@primjer.com"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Lozinka</label>
            <input 
              type="password" 
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              value={formData.password}
              onChange={e => setFormData({...formData, password: e.target.value})}
              placeholder="••••••••"
            />
          </div>

          {!isLogin && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Registriram se kao:</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFormData({...formData, role: 'client'})}
                  className={`py-2 rounded-xl text-sm font-bold border transition-all ${formData.role === 'client' ? 'bg-blue-50 border-blue-500 text-blue-600' : 'bg-white border-gray-200 text-gray-500'}`}
                >
                  Klijent
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({...formData, role: 'cleaner'})}
                  className={`py-2 rounded-xl text-sm font-bold border transition-all ${formData.role === 'cleaner' ? 'bg-blue-50 border-blue-500 text-blue-600' : 'bg-white border-gray-200 text-gray-500'}`}
                >
                  Čistač
                </button>
              </div>
            </div>
          )}

          <button 
            type="submit"
            className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg active:scale-95"
          >
            {isLogin ? 'Prijavi se' : 'Registriraj se'}
          </button>

          <div className="text-center">
            <button 
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm text-gray-500 hover:text-blue-600 transition-colors font-medium"
            >
              {isLogin ? 'Nemate račun? Registrirajte se' : 'Već imate račun? Prijavite se'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Auth;
