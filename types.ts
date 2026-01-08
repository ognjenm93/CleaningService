
export type ServiceType = 
  | 'Standardno čišćenje' 
  | 'Dubinsko čišćenje' 
  | 'Čišćenje prozora' 
  | 'Pranje tepiha' 
  | 'Čišćenje nakon radova' 
  | 'Peglanje veša';

export interface Review {
  id: string;
  user: string;
  rating: number;
  comment: string;
  date: string;
}

export interface User {
  id: string;
  fullName: string;
  email: string;
  role: 'client' | 'cleaner';
}

export interface MessageReply {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  date: string;
}

export interface Inquiry {
  id: string;
  senderId: string;
  cleanerId: string;
  cleanerName: string;
  cleanerEmail: string;
  senderName: string;
  senderEmail: string;
  message: string;
  date: string;
  isRead: boolean;
  replies?: MessageReply[];
}

export interface CleanerProfile {
  id: string;
  fullName: string;
  city: string;
  rating: number;
  reviewCount: number;
  basePrice: number;
  bio: string;
  services: ServiceType[];
  phone: string;
  email: string;
  imageUrl: string;
  isVerified: boolean;
  reviews: Review[];
  availability: string;
}

export interface NewProfileInput {
  fullName: string;
  city: string;
  basePrice: number;
  bio: string;
  services: ServiceType[];
  phone: string;
  email: string;
}
