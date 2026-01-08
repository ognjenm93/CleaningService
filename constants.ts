
import { CleanerProfile, ServiceType } from './types';

export const INITIAL_CLEANERS: CleanerProfile[] = [
  {
    id: '1',
    fullName: 'Ana Horvat',
    city: 'Zagreb',
    rating: 4.9,
    reviewCount: 42,
    basePrice: 12,
    bio: 'Profesionalna čistačica sa preko 5 godina iskustva u održavanju luksuznih stanova i ureda. Pedantna, točna i pouzdana.',
    services: ['Standardno čišćenje', 'Čišćenje prozora', 'Peglanje veša'],
    phone: '091 123 4567',
    email: 'ana.h@gmail.com',
    imageUrl: 'https://picsum.photos/seed/ana/400/400',
    isVerified: true,
    availability: 'Pon-Pet: 08:00 - 16:00',
    reviews: [
      { id: 'r1', user: 'Marko M.', rating: 5, comment: 'Ana je fantastična, stan blista!', date: '2024-05-10' }
    ]
  },
  {
    id: '2',
    fullName: 'Ivan Babić',
    city: 'Split',
    rating: 4.7,
    reviewCount: 28,
    basePrice: 15,
    bio: 'Specijaliziran za dubinska čišćenja i čišćenja nakon renovacija. Koristim isključivo ekološka sredstva.',
    services: ['Dubinsko čišćenje', 'Pranje tepiha', 'Čišćenje nakon radova'],
    phone: '098 765 4321',
    email: 'ivan.service@outlook.com',
    imageUrl: 'https://picsum.photos/seed/ivan/400/400',
    isVerified: true,
    availability: 'Vikendom po dogovoru',
    reviews: [
      { id: 'r2', user: 'Ivana P.', rating: 4, comment: 'Vrlo temeljit, preporuka.', date: '2024-05-12' }
    ]
  },
  {
    id: '3',
    fullName: 'Marija Kovač',
    city: 'Rijeka',
    rating: 5.0,
    reviewCount: 15,
    basePrice: 10,
    bio: 'Brza i učinkovita. Nudim usluge generalnog čišćenja kuća i apartmana prije i nakon sezone.',
    services: ['Standardno čišćenje', 'Peglanje veša'],
    phone: '095 555 6666',
    email: 'marija.cleaning@ri.hr',
    imageUrl: 'https://picsum.photos/seed/marija/400/400',
    isVerified: false,
    availability: 'Svaki dan: 07:00 - 20:00',
    reviews: []
  }
];

export const SERVICE_OPTIONS: ServiceType[] = [
  'Standardno čišćenje',
  'Dubinsko čišćenje',
  'Čišćenje prozora',
  'Pranje tepiha',
  'Čišćenje nakon radova',
  'Peglanje veša'
];

export const CROATIAN_CITIES = ['Zagreb', 'Split', 'Rijeka', 'Osijek', 'Zadar', 'Pula', 'Dubrovnik', 'Varaždin'];
