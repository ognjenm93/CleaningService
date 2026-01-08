
import React from 'react';
import { CleanerProfile } from '../types';

interface CleanerCardProps {
  cleaner: CleanerProfile;
  onClick: (id: string) => void;
}

const CleanerCard: React.FC<CleanerCardProps> = ({ cleaner, onClick }) => {
  return (
    <div 
      onClick={() => onClick(cleaner.id)}
      className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group"
    >
      <div className="relative h-48 w-full">
        <img 
          src={cleaner.imageUrl} 
          alt={cleaner.fullName}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-2 py-1 rounded-lg text-sm font-bold text-blue-600 shadow-sm">
          {cleaner.basePrice}€/h
        </div>
        {cleaner.isVerified && (
          <div className="absolute top-3 left-3 bg-green-500 text-white p-1 rounded-full shadow-sm">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
        )}
      </div>
      
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="text-lg font-bold text-gray-900 leading-tight">{cleaner.fullName}</h3>
            <p className="text-sm text-gray-500 flex items-center mt-1">
              <svg className="w-4 h-4 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {cleaner.city}
            </p>
          </div>
          <div className="flex items-center bg-amber-50 px-2 py-1 rounded-md">
            <svg className="w-4 h-4 text-amber-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="text-sm font-bold text-amber-700">{cleaner.rating}</span>
            <span className="text-xs text-gray-400 ml-1">({cleaner.reviewCount})</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-1 mt-4">
          {cleaner.services.slice(0, 2).map(service => (
            <span key={service} className="text-[10px] uppercase tracking-wider font-semibold px-2 py-1 bg-gray-100 text-gray-600 rounded">
              {service}
            </span>
          ))}
          {cleaner.services.length > 2 && (
            <span className="text-[10px] px-2 py-1 bg-gray-100 text-gray-600 rounded">+{cleaner.services.length - 2}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default CleanerCard;
