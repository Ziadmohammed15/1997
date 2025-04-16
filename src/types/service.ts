export interface DeliveryOptions {
  type: 'free' | 'paid' | 'none' | 'company';
  price?: number;
  companyName?: string;
  areas: string[];
  estimatedTime: string;
}

export interface Service {
  id: number;
  title: string;
  description: string;
  price: number;
  rating: number;
  image: string;
  location: string;
  category: string;
  subcategory?: string;
  features: string[];
  deliveryOptions?: DeliveryOptions;
  provider?: {
    id: string;
    name: string;
    avatar?: string;
    rating?: number;
    verified?: boolean;
  };
}