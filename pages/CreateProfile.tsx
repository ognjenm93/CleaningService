
import React, { useState } from 'react';
import { ServiceType, NewProfileInput } from '../types';
import { SERVICE_OPTIONS, CROATIAN_CITIES } from '../constants';
import { optimizeBio, suggestServices } from '../services/geminiService';

interface CreateProfileProps {
  onSubmit: (profile: NewProfileInput) => void;
}

const CreateProfile: React.FC<CreateProfileProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState<NewProfileInput>({
    fullName: '',
    city: CROATIAN_CITIES[0],
    basePrice: 10,
    bio: '',
    services: [],
    phone: '',
    email: ''
  });
  
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [isSuggesting, setIsSuggesting] = useState(false);

  const toggleService = (service: ServiceType) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.includes(service) 
        ? prev.services.filter(s => s !== service)
        : [...prev.services, service]
    }));
  };

  const handleAiOptimize = async () => {
    if (!formData.bio) return;
    setIsOptimizing(true);
    const betterBio = await optimizeBio(formData.bio, formData.services);
    setFormData(prev => ({ ...prev, bio: betterBio }));
    setIsOptimizing(false);
  };

  const handleAiSuggestServices = async () => {
    if (!formData.bio) return;
    setIsSuggesting(true);
    const suggested = await suggestServices(formData.bio);
    // Intersection with real options
    const validSuggestions = suggested.filter((s: string) => 
      SERVICE_OPTIONS.some(opt => opt.toLowerCase() === s.toLowerCase())
    ) as ServiceType[];
    
    setFormData(prev => ({
      ...prev,
      services: Array.from(new Set([...prev.services, ...validSuggestions]))
    }));
    setIsSuggesting(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email || formData.services.length === 0) {
      alert("Molimo popunite sva obavezna polja i odaberite barem jednu uslugu.");
      return;
    }
    onSubmit(formData);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
        <div className="bg-blue-600 px-8 py-10 text-white">
          <h1 className="text-3xl font-extrabold mb-2">Postani dio Sjaj&Red tima</h1>
          <p className="text-blue-100 opacity-90">Ispunite profil i počnite primati upite klijenata odmah.</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          {/* Osnovne informacije */}
          <section className="space-y-6">
            <h2 className="text-xl font-bold text-gray-900 border-b pb-2">Osnovne informacije</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Puno ime i prezime *</label>
                <input 
                  type="text" 
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  value={formData.fullName}
                  onChange={e => setFormData({...formData, fullName: e.target.value})}
                  placeholder="npr. Ana Anić"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Grad *</label>
                <select 
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
                  value={formData.city}
                  onChange={e => setFormData({...formData, city: e.target.value})}
                >
                  {CROATIAN_CITIES.map(city => <option key={city} value={city}>{city}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Cijena po satu (€) *</label>
                <input 
                  type="number" 
                  min="5"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
                  value={formData.basePrice}
                  onChange={e => setFormData({...formData, basePrice: Number(e.target.value)})}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Kontakt telefon *</label>
                <input 
                  type="tel" 
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
                  value={formData.phone}
                  onChange={e => setFormData({...formData, phone: e.target.value})}
                  placeholder="npr. 091 123 4567"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email adresa *</label>
                <input 
                  type="email" 
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                  placeholder="ana@primjer.com"
                />
              </div>
            </div>
          </section>

          {/* Opis profila uz AI */}
          <section className="space-y-4">
            <div className="flex justify-between items-end">
              <label className="block text-sm font-semibold text-gray-700">O meni i mom iskustvu *</label>
              <button 
                type="button"
                onClick={handleAiOptimize}
                disabled={isOptimizing || !formData.bio}
                className="text-xs bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-lg hover:bg-indigo-100 font-bold transition-all disabled:opacity-50 flex items-center"
              >
                {isOptimizing ? 'Optimizacija...' : '✨ Poboljšaj opis uz AI'}
              </button>
            </div>
            <textarea 
              required
              rows={4}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
              value={formData.bio}
              onChange={e => setFormData({...formData, bio: e.target.value})}
              placeholder="Napišite nešto o sebi, svom iskustvu i pristupu radu..."
            />
          </section>

          {/* Usluge */}
          <section className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900 border-b pb-2 flex-1 mr-4">Usluge koje pružam</h2>
              <button 
                type="button"
                onClick={handleAiSuggestServices}
                disabled={isSuggesting || !formData.bio}
                className="text-xs bg-blue-50 text-blue-700 px-3 py-1.5 rounded-lg hover:bg-blue-100 font-bold transition-all disabled:opacity-50"
              >
                {isSuggesting ? 'Analiziram...' : '🪄 Predloži usluge iz opisa'}
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {SERVICE_OPTIONS.map(service => (
                <button
                  key={service}
                  type="button"
                  onClick={() => toggleService(service)}
                  className={`px-4 py-3 rounded-xl text-sm font-medium border transition-all text-left flex items-center justify-between ${
                    formData.services.includes(service)
                      ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300'
                  }`}
                >
                  {service}
                  {formData.services.includes(service) && (
                    <svg className="w-4 h-4 ml-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </section>

          <div className="pt-8 border-t border-gray-100">
            <button 
              type="submit"
              className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-blue-700 transition-all shadow-xl hover:shadow-2xl transform active:scale-[0.98]"
            >
              Kreiraj Profil i Objavi Oglas
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProfile;
