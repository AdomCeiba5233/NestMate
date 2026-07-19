export type HostelCategory = 'Hostels' | 'Apartments';

export interface RoomType {
  id: string;
  label: string;
  pricePerYear: number;
  capacity: number;
  bedsLeft: number;
  studentsMatching?: number;
}

export interface Hostel {
  id: string;
  name: string;
  shortName: string;
  category: HostelCategory;
  location: string;
  distanceNote: string;
  rating: number;
  bedsAvailable: number;
  fromPricePerYear: number;
  imageUrl?: string;
  photoCount?: number;
  amenities: string[];
  roomTypes: RoomType[];
}

export interface HostelSearchFilters {
  category?: HostelCategory;
  query?: string;
}

export interface VerifyAccessCodeResult {
  success: boolean;
}
