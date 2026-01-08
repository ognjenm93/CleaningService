
import React, { useState, useMemo } from 'react';
import { CleanerProfile, ServiceType } from '../types';
import { SERVICE_OPTIONS, CROATIAN_CITIES } from '../constants';
import CleanerCard from '../components/CleanerCard';

interface HomeProps {
  cleaners: CleanerProfile[];
  onSelectCleaner: (id: string) => void;
}

const Home: React.FC<HomeProps> = ({ cleaners, onSelectCleaner }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedService, setSelectedService] = useState<ServiceType | ''>('');

  const filteredCleaners = useMemo(() => {
    return cleaners.filter(c => {
      const matchesSearch = c.fullName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCity = !selectedCity || c.city === selectedCity;
      const matchesService = !selectedService || c.services.includes(selectedService as ServiceType);
      return matchesSearch && matchesCity && matchesService;
    });
  }, [cleaners, searchTerm, selectedCity, selectedService]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-700 to-indigo-900 rounded-3xl p-8 md:p-16 mb-12 text-white shadow-xl overflow-hidden relative">
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
            Pronađite stručnjaka kojem <span className="text-blue-300">vjerujete</span>.
          </h1>
          <p className="text-lg md:text-xl text-blue-100 mb-8 font-light">
            Pregledajte profile, pročitajte recenzije i rezervirajte najbolje čišćenje u vašem gradu u nekoliko klikova.
          </p>
          
          <div className="bg-white/10 backdrop-blur-md p-2 rounded-2xl flex flex-col md:flex-row gap-2 border border-white/20">
            <input 
              type="text" 
              placeholder="Ime čistača..."
              className="flex-1 bg-white/90 text-gray-900 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <select 
              className="md:w-48 bg-white/90 text-gray-900 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
            >
              <option value="">Svi gradovi</option>
              {CROATIAN_CITIES.map(city => <option key={city} value={city}>{city}</option>)}
            </select>
            <button className="bg-blue-500 hover:bg-blue-400 px-8 py-3 rounded-xl font-bold transition-all shadow-lg">
              Pretraži
            </button>
          </div>
        </div>
        
        {/* Abstract Background Element */}
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[600px] h-[600px] bg-white/5 rounded-full pointer-events-none"></div>
      </section>

      {/* Filters & Results */}
      <div className="mb-8 flex flex-wrap gap-4 items-center">
        <h2 className="text-2xl font-bold text-gray-900 mr-4">Dostupni čistači</h2>
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          <button 
            onClick={() => setSelectedService('')}
            className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-colors ${!selectedService ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}
          >
            Sve usluge
          </button>
          {SERVICE_OPTIONS.map(service => (
            <button 
              key={service}
              onClick={() => setSelectedService(service)}
              className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-colors ${selectedService === service ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}
            >
              {service}
            </button>
          ))}
        </div>
      </div>

      {filteredCleaners.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredCleaners.map(cleaner => (
            <CleanerCard key={cleaner.id} cleaner={cleaner} onClick={onSelectCleaner} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-200">
          <div className="text-5xl mb-4">🔍</div>
          <h3 className="text-xl font-bold text-gray-900">Nismo pronašli nijednog čistača</h3>
          <p className="text-gray-500">Pokušajte promijeniti filtere ili grad.</p>
        </div>
      )}
    </div>
  );
};

export default Home;
