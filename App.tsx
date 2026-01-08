
import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import CleanerDetails from './pages/CleanerDetails';
import CreateProfile from './pages/CreateProfile';
import Messages from './pages/Messages';
import Auth from './pages/Auth';
import { CleanerProfile, NewProfileInput, Review, Inquiry, User, MessageReply } from './types';
import { INITIAL_CLEANERS } from './constants';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [selectedCleanerId, setSelectedCleanerId] = useState<string | null>(null);
  const [cleaners, setCleaners] = useState<CleanerProfile[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    const savedCleaners = localStorage.getItem('cleaners');
    const savedInquiries = localStorage.getItem('inquiries');
    const savedUser = localStorage.getItem('currentUser');
    
    if (savedCleaners) {
      setCleaners(JSON.parse(savedCleaners));
    } else {
      setCleaners(INITIAL_CLEANERS);
    }

    if (savedInquiries) {
      setInquiries(JSON.parse(savedInquiries));
    }

    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
  }, []);

  useEffect(() => {
    if (cleaners.length > 0) {
      localStorage.setItem('cleaners', JSON.stringify(cleaners));
    }
    localStorage.setItem('inquiries', JSON.stringify(inquiries));
    if (currentUser) {
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('currentUser');
    }
  }, [cleaners, inquiries, currentUser]);

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
    setSelectedCleanerId(null);
    window.scrollTo(0, 0);
  };

  const handleSelectCleaner = (id: string) => {
    setSelectedCleanerId(id);
    setCurrentPage('details');
    window.scrollTo(0, 0);
  };

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    handleNavigate('home');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    handleNavigate('home');
  };

  const handleCreateProfile = (input: NewProfileInput) => {
    const newCleaner: CleanerProfile = {
      ...input,
      id: Date.now().toString(),
      rating: 5.0,
      reviewCount: 0,
      isVerified: false,
      imageUrl: `https://picsum.photos/seed/${input.fullName.split(' ')[0].toLowerCase()}/400/400`,
      availability: 'Dostupan odmah',
      reviews: []
    };

    setCleaners([newCleaner, ...cleaners]);
    handleNavigate('home');
    alert("Profil čistača uspješno kreiran!");
  };

  const handleAddReview = (cleanerId: string, review: Review) => {
    setCleaners(prevCleaners => {
      return prevCleaners.map(c => {
        if (c.id === cleanerId) {
          const updatedReviews = [review, ...c.reviews];
          const totalRating = updatedReviews.reduce((sum, r) => sum + r.rating, 0);
          const newAvgRating = Number((totalRating / updatedReviews.length).toFixed(1));
          
          return {
            ...c,
            reviews: updatedReviews,
            rating: newAvgRating,
            reviewCount: updatedReviews.length
          };
        }
        return c;
      });
    });
  };

  const handleSendInquiry = (inquiry: Inquiry) => {
    setInquiries(prev => [...prev, inquiry]);
  };

  const handleDeleteInquiry = (id: string) => {
    setInquiries(prev => prev.filter(i => i.id !== id));
  };

  const handleMarkAsRead = (id: string) => {
    setInquiries(prev => prev.map(i => i.id === id ? { ...i, isRead: true } : i));
  };

  const handleReplyInquiry = (inquiryId: string, reply: MessageReply) => {
    setInquiries(prev => prev.map(i => {
      if (i.id === inquiryId) {
        return {
          ...i,
          isRead: false, // Reset read status when there's a new reply for the other party
          replies: [...(i.replies || []), reply]
        };
      }
      return i;
    }));
  };

  const unreadCount = inquiries.filter(i => 
    !i.isRead && 
    currentUser && 
    i.cleanerEmail.toLowerCase() === currentUser.email.toLowerCase()
  ).length;

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home cleaners={cleaners} onSelectCleaner={handleSelectCleaner} />;
      case 'auth':
        return <Auth onLogin={handleLogin} onBack={() => handleNavigate('home')} />;
      case 'details':
        const cleaner = cleaners.find(c => c.id === selectedCleanerId);
        return cleaner ? (
          <CleanerDetails 
            cleaner={cleaner} 
            onBack={() => handleNavigate('home')} 
            onAddReview={handleAddReview}
            onSendInquiry={handleSendInquiry}
            currentUser={currentUser}
            onGoToAuth={() => handleNavigate('auth')}
          />
        ) : (
          <Home cleaners={cleaners} onSelectCleaner={handleSelectCleaner} />
        );
      case 'create':
        return <CreateProfile onSubmit={handleCreateProfile} />;
      case 'messages':
        return (
          <Messages 
            inquiries={inquiries} 
            onDelete={handleDeleteInquiry} 
            onMarkAsRead={handleMarkAsRead} 
            onReply={handleReplyInquiry}
            currentUser={currentUser}
          />
        );
      default:
        return <Home cleaners={cleaners} onSelectCleaner={handleSelectCleaner} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar 
        onNavigate={handleNavigate} 
        currentPage={currentPage} 
        unreadCount={unreadCount} 
        currentUser={currentUser}
        onLogout={handleLogout}
      />
      <main className="flex-grow">{renderPage()}</main>
      <footer className="bg-white border-t border-gray-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <div className="bg-blue-600 p-1.5 rounded-md">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
              </div>
              <span className="ml-2 text-lg font-bold text-gray-900 tracking-tight">Sjaj&Red</span>
            </div>
            <div className="mt-4 md:mt-0 text-gray-400 text-xs text-center md:text-right">
              © 2024 Sjaj&Red. Lokalni prototip s interaktivnim razgovorima.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
