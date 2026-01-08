
import React, { useState } from 'react';
import { CleanerProfile, Review, Inquiry, User } from '../types';

interface CleanerDetailsProps {
  cleaner: CleanerProfile;
  onBack: () => void;
  onAddReview: (cleanerId: string, review: Review) => void;
  onSendInquiry: (inquiry: Inquiry) => void;
  currentUser: User | null;
  onGoToAuth: () => void;
}

const CleanerDetails: React.FC<CleanerDetailsProps> = ({ cleaner, onBack, onAddReview, onSendInquiry, currentUser, onGoToAuth }) => {
  const [newReview, setNewReview] = useState({
    user: '',
    rating: 5,
    comment: ''
  });
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);
  
  const [contactData, setContactData] = useState({
    message: ''
  });

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !newReview.comment) return;

    const review: Review = {
      id: Date.now().toString(),
      user: currentUser.fullName,
      rating: newReview.rating,
      comment: newReview.comment,
      date: new Date().toISOString().split('T')[0]
    };

    onAddReview(cleaner.id, review);
    setNewReview({ user: '', rating: 5, comment: '' });
    setShowReviewForm(false);
  };

  const handleSendInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !contactData.message) {
      alert("Molimo unesite poruku.");
      return;
    }

    setIsSending(true);

    const newInquiry: Inquiry = {
      id: Date.now().toString(),
      senderId: currentUser.id,
      cleanerId: cleaner.id,
      cleanerName: cleaner.fullName,
      cleanerEmail: cleaner.email,
      senderName: currentUser.fullName,
      senderEmail: currentUser.email,
      message: contactData.message,
      date: new Date().toLocaleString('hr-HR'),
      isRead: false,
      replies: []
    };

    setTimeout(() => {
      onSendInquiry(newInquiry);
      setIsSending(false);
      setIsSent(true);
      
      const subject = encodeURIComponent(`Upit za čišćenje: ${cleaner.fullName}`);
      const body = encodeURIComponent(
        `Od: ${currentUser.fullName}\n` +
        `E-mail klijenta: ${currentUser.email}\n\n` +
        `Poruka:\n${contactData.message}`
      );
      window.location.href = `mailto:${cleaner.email}?subject=${subject}&body=${body}`;

      setTimeout(() => {
        setIsSent(false);
        setShowContactForm(false);
        setContactData({ message: '' });
      }, 3000);
    }, 1200);
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(cleaner.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <button 
        onClick={onBack}
        className="mb-8 flex items-center text-blue-600 font-semibold hover:text-blue-800 transition-colors"
      >
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Povratak na listu
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-1">
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden sticky top-24">
            <img src={cleaner.imageUrl} alt={cleaner.fullName} className="w-full h-72 object-cover" />
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold text-gray-900">{cleaner.fullName}</h1>
                {cleaner.isVerified && (
                  <span className="bg-blue-100 text-blue-700 p-1.5 rounded-full" title="Provjereni profil">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </span>
                )}
              </div>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-center text-gray-600">
                  <svg className="w-5 h-5 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {cleaner.city}
                </div>
                <div className="flex items-center text-gray-600">
                  <svg className="w-5 h-5 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {cleaner.availability}
                </div>
              </div>

              <div className="pt-6 border-t border-gray-100">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-gray-500">Cijena po satu</span>
                  <span className="text-2xl font-extrabold text-blue-600">{cleaner.basePrice}€/h</span>
                </div>
                
                <button 
                  onClick={() => {
                    setShowContactForm(!showContactForm);
                    setIsSent(false);
                  }}
                  className={`block w-full text-center py-4 rounded-2xl font-bold transition-all shadow-lg hover:shadow-xl transform active:scale-95 mb-4 ${showContactForm ? 'bg-gray-100 text-gray-700' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                >
                  {showContactForm ? 'Zatvori kontakt' : 'Kontaktiraj čistača'}
                </button>

                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 mb-6">
                  <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-2">E-mail adresa čistača</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700 truncate mr-2">{cleaner.email}</span>
                    <button 
                      onClick={handleCopyEmail}
                      className={`text-xs px-3 py-1.5 rounded-lg font-bold transition-all ${copied ? 'bg-green-100 text-green-700' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-100'}`}
                    >
                      {copied ? 'Kopirano!' : 'Kopiraj'}
                    </button>
                  </div>
                </div>

                <button 
                  onClick={() => {
                    setShowReviewForm(!showReviewForm);
                    setShowContactForm(false);
                  }}
                  className="w-full bg-white text-blue-600 border border-blue-200 py-3 rounded-2xl font-semibold hover:bg-blue-50 transition-all"
                >
                  {showReviewForm ? 'Zatvori recenzije' : 'Ostavi recenziju'}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-12">
          {showContactForm && (
            <section className="bg-white p-8 rounded-3xl border-2 border-blue-600 shadow-2xl animate-in slide-in-from-top duration-300 relative overflow-hidden">
              {!currentUser ? (
                <div className="text-center py-8">
                  <div className="bg-amber-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-8 h-8 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m0 0v2m0-2h2m-2 0h-2m8-3V7a2 2 0 00-2-2H6a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2v-3z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Potrebna je prijava</h3>
                  <p className="text-gray-500 mb-6">Morate biti prijavljeni kako biste mogli kontaktirati čistače.</p>
                  <button onClick={onGoToAuth} className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 shadow-md">Prijavi se odmah</button>
                </div>
              ) : isSent ? (
                <div className="py-12 text-center animate-in zoom-in duration-500">
                  <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">Poruka Poslana!</h2>
                  <p className="text-gray-600">Vaš upit je spremljen i poslan čistaču.</p>
                </div>
              ) : (
                <>
                  <div className="flex items-center mb-6">
                    <div className="bg-blue-100 p-3 rounded-full mr-4">
                      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">Kontaktiraj čistača</h2>
                      <p className="text-sm text-gray-500">Šalješ upit kao: <b>{currentUser.fullName}</b></p>
                    </div>
                  </div>
                  <form onSubmit={handleSendInquiry} className="space-y-4">
                    <textarea 
                      required rows={4}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
                      value={contactData.message}
                      onChange={e => setContactData({ message: e.target.value })}
                      placeholder="Napišite što vam je potrebno..."
                    />
                    <button type="submit" disabled={isSending} className={`w-full py-4 rounded-xl font-bold text-white transition-all shadow-md ${isSending ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'}`}>
                      {isSending ? 'Šaljem...' : 'Pošalji upit'}
                    </button>
                  </form>
                </>
              )}
            </section>
          )}

          {showReviewForm && (
            <section className="bg-blue-50 p-8 rounded-3xl border border-blue-100">
              {!currentUser ? (
                 <div className="text-center py-4">
                    <button onClick={onGoToAuth} className="text-blue-600 font-bold underline">Prijavite se za recenziju</button>
                 </div>
              ) : (
                <form onSubmit={handleSubmitReview} className="space-y-4">
                  <h2 className="text-xl font-bold text-blue-900 mb-6">Ostavi recenziju</h2>
                  <div className="flex gap-2 mb-4">
                    {[1, 2, 3, 4, 5].map(star => (
                      <button key={star} type="button" onClick={() => setNewReview({...newReview, rating: star})} className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${newReview.rating >= star ? 'bg-amber-400 text-white' : 'bg-white text-gray-400 border border-gray-200'}`}>
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                      </button>
                    ))}
                  </div>
                  <textarea required rows={3} className="w-full px-4 py-2 rounded-xl border border-blue-200 focus:ring-2 focus:ring-blue-500 outline-none" value={newReview.comment} onChange={e => setNewReview({...newReview, comment: e.target.value})} placeholder="Vaše iskustvo..." />
                  <button type="submit" className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-md">Objavi recenziju</button>
                </form>
              )}
            </section>
          )}

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">O meni</h2>
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm leading-relaxed text-gray-700">{cleaner.bio}</div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Usluge koje nudim</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {cleaner.services.map(service => (
                <div key={service} className="flex items-center p-4 bg-white rounded-2xl border border-gray-100 shadow-sm">
                  <div className="bg-blue-50 p-2 rounded-lg mr-4">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                  </div>
                  <span className="font-semibold text-gray-800">{service}</span>
                </div>
              ))}
            </div>
          </section>

          <section>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Recenzije klijenta</h2>
              <div className="flex items-center text-amber-500 font-bold">
                <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                {cleaner.rating} / 5.0
              </div>
            </div>
            {cleaner.reviews.length > 0 ? (
              <div className="space-y-6">
                {cleaner.reviews.map(review => (
                  <div key={review.id} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center font-bold text-gray-500 mr-3">{review.user[0]}</div>
                        <div>
                          <div className="font-bold text-gray-900">{review.user}</div>
                          <div className="text-xs text-gray-400">{review.date}</div>
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-600 italic">"{review.comment}"</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white p-8 rounded-3xl border border-dashed border-gray-200 text-center text-gray-500">Nema recenzija.</div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default CleanerDetails;
