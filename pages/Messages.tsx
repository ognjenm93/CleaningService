
import React, { useState, useMemo } from 'react';
import { Inquiry, User, MessageReply } from '../types';

interface MessagesProps {
  inquiries: Inquiry[];
  onDelete: (id: string) => void;
  onMarkAsRead: (id: string) => void;
  onReply: (inquiryId: string, reply: MessageReply) => void;
  currentUser: User | null;
}

const Messages: React.FC<MessagesProps> = ({ inquiries, onDelete, onMarkAsRead, onReply, currentUser }) => {
  const [activeTab, setActiveTab] = useState<'received' | 'sent'>('received');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [replyTexts, setReplyTexts] = useState<Record<string, string>>({});

  const receivedMessages = useMemo(() => {
    if (!currentUser) return [];
    return inquiries.filter(i => i.cleanerEmail.toLowerCase() === currentUser.email.toLowerCase());
  }, [inquiries, currentUser]);

  const sentMessages = useMemo(() => {
    if (!currentUser) return [];
    return inquiries.filter(i => i.senderId === currentUser.id);
  }, [inquiries, currentUser]);

  const displayedMessages = activeTab === 'received' ? receivedMessages : sentMessages;

  const handleSendReply = (inquiryId: string) => {
    const text = replyTexts[inquiryId];
    if (!text?.trim() || !currentUser) return;

    const newReply: MessageReply = {
      id: Date.now().toString(),
      senderId: currentUser.id,
      senderName: currentUser.fullName,
      text: text,
      date: new Date().toLocaleString('hr-HR')
    };

    onReply(inquiryId, newReply);
    setReplyTexts(prev => ({ ...prev, [inquiryId]: '' }));
  };

  if (!currentUser) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Potrebna prijava</h2>
        <p className="text-gray-500 mb-8">Prijavite se kako biste vidjeli svoje poruke.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Moje Poruke</h1>
        <p className="text-gray-500">Razgovarajte s klijentima i stručnjacima o detaljima čišćenja.</p>
      </div>

      <div className="flex border-b border-gray-200 mb-8">
        <button 
          onClick={() => { setActiveTab('received'); setExpandedId(null); }}
          className={`px-8 py-4 font-bold text-sm transition-all border-b-2 ${activeTab === 'received' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
        >
          Primljeni upiti ({receivedMessages.length})
        </button>
        <button 
          onClick={() => { setActiveTab('sent'); setExpandedId(null); }}
          className={`px-8 py-4 font-bold text-sm transition-all border-b-2 ${activeTab === 'sent' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
        >
          Poslani upiti ({sentMessages.length})
        </button>
      </div>

      {displayedMessages.length > 0 ? (
        <div className="space-y-4">
          {[...displayedMessages].reverse().map(inquiry => {
            const isExpanded = expandedId === inquiry.id;
            
            return (
              <div 
                key={inquiry.id} 
                className={`bg-white rounded-3xl border transition-all duration-300 overflow-hidden ${activeTab === 'received' && !inquiry.isRead ? 'border-blue-300 shadow-lg ring-1 ring-blue-50' : 'border-gray-100 shadow-sm'}`}
              >
                {/* Header Card */}
                <div 
                  className="p-6 cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => {
                    if (activeTab === 'received') onMarkAsRead(inquiry.id);
                    setExpandedId(isExpanded ? null : inquiry.id);
                  }}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-white mr-4 shadow-inner ${activeTab === 'received' ? 'bg-gradient-to-tr from-blue-500 to-indigo-600' : 'bg-gradient-to-tr from-emerald-500 to-teal-600'}`}>
                        {activeTab === 'received' ? inquiry.senderName[0] : inquiry.cleanerName[0]}
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">
                          {activeTab === 'received' ? inquiry.senderName : `Za: ${inquiry.cleanerName}`}
                        </h3>
                        <div className="flex items-center text-xs text-gray-400 space-x-2">
                          <span>{activeTab === 'received' ? inquiry.senderEmail : inquiry.cleanerEmail}</span>
                          <span>•</span>
                          <span>{inquiry.date}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={(e) => { e.stopPropagation(); onDelete(inquiry.id); }}
                        className="p-2 text-gray-300 hover:text-red-500 transition-colors"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                      <svg className={`w-5 h-5 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                  
                  <div className="text-gray-700 line-clamp-1 italic mb-2">
                    "{inquiry.message}"
                  </div>
                  
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-blue-600 font-semibold bg-blue-50 px-3 py-1 rounded-full">
                      #{inquiry.id.slice(-5)}
                    </span>
                    <div className="flex items-center space-x-3">
                      <span className="text-gray-400">
                        {inquiry.replies?.length || 0} odgovora
                      </span>
                      {activeTab === 'received' && !inquiry.isRead && (
                        <span className="text-indigo-600 font-bold flex items-center">
                          <span className="w-2 h-2 bg-indigo-600 rounded-full mr-2 animate-pulse"></span>
                          Novo
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Expanded Conversation */}
                {isExpanded && (
                  <div className="border-t border-gray-100 bg-gray-50 p-6 space-y-4 animate-in slide-in-from-top duration-300">
                    {/* First Message */}
                    <div className="flex justify-start">
                      <div className="max-w-[80%] bg-white p-4 rounded-2xl rounded-tl-none shadow-sm border border-gray-100">
                        <p className="text-xs font-bold text-blue-600 mb-1">{inquiry.senderName}</p>
                        <p className="text-gray-800">{inquiry.message}</p>
                        <p className="text-[10px] text-gray-400 mt-2 text-right">{inquiry.date}</p>
                      </div>
                    </div>

                    {/* Replies */}
                    {inquiry.replies?.map(reply => (
                      <div key={reply.id} className={`flex ${reply.senderId === currentUser.id ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] p-4 rounded-2xl shadow-sm border ${
                          reply.senderId === currentUser.id 
                            ? 'bg-blue-600 text-white rounded-tr-none border-blue-500' 
                            : 'bg-white text-gray-800 rounded-tl-none border-gray-100'
                        }`}>
                          <p className={`text-xs font-bold mb-1 ${reply.senderId === currentUser.id ? 'text-blue-100' : 'text-blue-600'}`}>
                            {reply.senderName}
                          </p>
                          <p>{reply.text}</p>
                          <p className={`text-[10px] mt-2 text-right ${reply.senderId === currentUser.id ? 'text-blue-200' : 'text-gray-400'}`}>
                            {reply.date}
                          </p>
                        </div>
                      </div>
                    ))}

                    {/* Reply Input */}
                    <div className="pt-4 border-t border-gray-200">
                      <div className="flex space-x-2">
                        <textarea
                          rows={1}
                          placeholder="Napišite odgovor..."
                          className="flex-1 px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                          value={replyTexts[inquiry.id] || ''}
                          onChange={e => setReplyTexts(prev => ({ ...prev, [inquiry.id]: e.target.value }))}
                        />
                        <button 
                          onClick={() => handleSendReply(inquiry.id)}
                          className="bg-blue-600 text-white p-3 rounded-xl hover:bg-blue-700 transition-colors shadow-md"
                          title="Pošalji odgovor"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-24 bg-white rounded-3xl border-2 border-dashed border-gray-200">
          <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Nema poruka</h3>
          <p className="text-gray-500 max-w-xs mx-auto">Povijest vaših razgovora će se pojaviti ovdje.</p>
        </div>
      )}
    </div>
  );
};

export default Messages;
