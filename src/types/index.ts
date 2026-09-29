export type MainCategory =
  | 'Tech & Electronics'
  | 'Fashion & Apparel'
  | 'Home & Lifestyle'
  | 'Beauty & Personal Care'
  | 'Groceries & Essentials';

export type TechSubcategory =
  | 'Smartphones & Accessories'
  | 'Laptops & Computing'
  | 'Audio & Headphones'
  | 'Smart Wearables';

export type FashionSubcategory =
  | "Men's Wear"
  | "Women's Wear"
  | 'Footwear & Sneakers'
  | 'Bags & Jewelry';

export type HomeSubcategory =
  | 'Kitchen Appliances'
  | 'Home Decor'
  | 'Smart Home Gadgets';

export type BeautySubcategory =
  | 'Skincare'
  | 'Fragrances & Perfumes'
  | 'Hair Care';

export type GrocerySubcategory =
  | 'Beverages & Drinks'
  | 'Snacks & Provisions';

export type Subcategory =
  | TechSubcategory
  | FashionSubcategory
  | HomeSubcategory
  | BeautySubcategory
  | GrocerySubcategory;

export interface CategoryMeta {
  id: string;
  name: MainCategory;
  slug: string;
  iconName: string;
  description: string;
  subcategories: Subcategory[];
  featuredImage: string;
}

export interface ProductReview {
  id: string;
  author: string;
  rating: number;
  date: string;
  comment: string;
  verified: boolean;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: MainCategory;
  subcategory: Subcategory;
  brand: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  stockCount: number;
  image: string;
  gallery: string[];
  tags: string[];
  specs: Record<string, string>;
  featured?: boolean;
  isNewArrival?: boolean;
  isBestSeller?: boolean;
  reviews: ProductReview[];
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
}

export interface CustomerShippingInfo {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  notes?: string;
}

export interface Order {
  id: string;
  createdAt: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  shippingFee: number;
  total: number;
  customer: CustomerShippingInfo;
  paymentDetails: {
    bankName: string;
    accountNumber: string;
    accountName: string;
    reference: string;
    receiptImageName?: string;
    receiptImageData?: string;
    transferDate: string;
  };
  status: 'payment_submitted' | 'processing' | 'verified' | 'shipped';
}

export interface FilterState {
  searchQuery: string;
  category: MainCategory | 'All';
  subcategory: string | 'All';
  priceRange: [number, number];
  minRating: number;
  inStockOnly: boolean;
  sortBy: 'popularity' | 'price-asc' | 'price-desc' | 'rating' | 'newest';
}
