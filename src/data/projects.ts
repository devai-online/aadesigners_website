export interface Project {
  id: string;
  title: string;
  category: string;
  description: string;
  year: string;
  images: string[];
  location: string;
}

export const projects: Project[] = [
  {
    id: 'villa-house',
    title: 'Villa House',
    category: 'residential',
    description: 'Luxury villa design with modern amenities and elegant interiors',
    year: '2024',
    images: ['/Projects/VILLA HOUSE - RESI/4.png'],
    location: 'Hyderabad'
  },
  {
    id: 'mc-house',
    title: 'MC House',
    category: 'residential',
    description: 'Contemporary residential design with sophisticated styling',
    year: '2024',
    images: [
      '/Projects/MC HOUSE - RESI/1.png',
      '/Projects/MC HOUSE - RESI/2.png',
      '/Projects/MC HOUSE - RESI/3.png',
      '/Projects/MC HOUSE - RESI/4.png'
    ],
    location: 'Hyderabad'
  },
  {
    id: 'lb-nagar-office',
    title: 'LB Nagar Office',
    category: 'commercial',
    description: 'Modern office space design for corporate environment',
    year: '2024',
    images: [
      '/Projects/LB NAGAR  - OFFICE  - COMM/1.png',
      '/Projects/LB NAGAR  - OFFICE  - COMM/2.png',
      '/Projects/LB NAGAR  - OFFICE  - COMM/3.png',
      '/Projects/LB NAGAR  - OFFICE  - COMM/4.png'
    ],
    location: 'LB Nagar, Hyderabad'
  },
  {
    id: 'kmp-square',
    title: 'KMP Square',
    category: 'commercial',
    description: 'Commercial space design with innovative layout',
    year: '2024',
    images: [
      '/Projects/KMP SQUARE - COMM/1.png',
      '/Projects/KMP SQUARE - COMM/2.png',
      '/Projects/KMP SQUARE - COMM/3.png',
      '/Projects/KMP SQUARE - COMM/4.png'
    ],
    location: 'Hyderabad'
  },
  {
    id: 'g-house',
    title: 'G House',
    category: 'residential',
    description: 'Family home design with comfort and style',
    year: '2024',
    images: [
      '/Projects/G HOUSE - RESI/1.png',
      '/Projects/G HOUSE - RESI/2.png',
      '/Projects/G HOUSE - RESI/3.png',
      '/Projects/G HOUSE - RESI/4.png'
    ],
    location: 'Hyderabad'
  },
  {
    id: 'family-villa',
    title: 'Family Villa',
    category: 'residential',
    description: 'Spacious villa design for modern family living',
    year: '2024',
    images: [
      '/Projects/FAMILY VILLA - RESI/1.png',
      '/Projects/FAMILY VILLA - RESI/2.png',
      '/Projects/FAMILY VILLA - RESI/3.png',
      '/Projects/FAMILY VILLA - RESI/4.png'
    ],
    location: 'Hyderabad'
  },
  {
    id: 'corner-house',
    title: 'Corner House',
    category: 'residential',
    description: 'Unique corner plot design with optimal space utilization',
    year: '2024',
    images: [
      '/Projects/CORNER HOUSE - RESI/1.png',
      '/Projects/CORNER HOUSE - RESI/2.png',
      '/Projects/CORNER HOUSE - RESI/3.png',
      '/Projects/CORNER HOUSE - RESI/4.png'
    ],
    location: 'Hyderabad'
  },
  {
    id: 'ak-house',
    title: 'AK House',
    category: 'residential',
    description: 'Modern residential design with contemporary aesthetics',
    year: '2024',
    images: [
      '/Projects/AK HOUSE - RESI/1.png',
      '/Projects/AK HOUSE - RESI/2.png',
      '/Projects/AK HOUSE - RESI/3.png',
      '/Projects/AK HOUSE - RESI/4.png'
    ],
    location: 'Hyderabad'
  },
  {
    id: '4bhk-unit',
    title: '4BHK Unit',
    category: 'residential',
    description: 'Luxury 4-bedroom apartment design with premium finishes',
    year: '2024',
    images: [
      '/Projects/4BHK UNIT - RESI/1.png',
      '/Projects/4BHK UNIT - RESI/2.png',
      '/Projects/4BHK UNIT - RESI/3.png',
      '/Projects/4BHK UNIT - RESI/4.png'
    ],
    location: 'Hyderabad'
  },
  {
    id: '4bhk-family-house',
    title: '4BHK Family House',
    category: 'residential',
    description: 'Spacious family home with 4 bedrooms and modern amenities',
    year: '2024',
    images: [
      '/Projects/4BHK FAMILY HOUSE - RESI/1.png',
      '/Projects/4BHK FAMILY HOUSE - RESI/2.png',
      '/Projects/4BHK FAMILY HOUSE - RESI/3.png',
      '/Projects/4BHK FAMILY HOUSE - RESI/4.png'
    ],
    location: 'Hyderabad'
  }
]; 