export interface Category {
  id: string;
  slug: string;
  name: string;
  icon: string;
  description?: string;
}

export interface PortfolioItem {
  id: string;
  imageUrl: string;
  caption?: string;
}

export interface Location {
  city: string;
  neighborhood?: string;
  displayName: string;
}

export type Timestamp = string; // ISO 8601
