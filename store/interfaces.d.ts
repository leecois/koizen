interface Category {
  _id: string;
  title: string;
  value: string;
  imageUrl: string;
  createdAt?: string;
  updatedAt?: string;
  __v: number;
}

interface CategoryListProps {
  setSelectedCategory: (id: string | null) => void;
  setSelectedSection: (section: string | null) => void;
  setSelectedValue: (value: string | null) => void;
}

interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  images: string[];
  creationAt: string;
  updatedAt: string;
  category: Category;
}

interface Address {
  city: string;
  country: string;
  district: string;
  isoCountryCode: string;
  name: string;
  postalCode: string;
  region: string;
  street: string;
  streetNumber: string;
  subregion: string;
  timezone: string;
}
interface AlertState {
  show: boolean;
  type: 'info' | 'success' | 'error';
  message: string;
}

interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: Rating;
}

interface Rating {
  rate: number;
  count: number;
}
