import { CategoryMeta } from '../types';

export const STORE_BANK_DETAILS = {
  bankName: 'Moniepoint Microfinance Bank',
  accountNumber: '8132230017',
  accountName: 'Gideon John Mayowa',
  whatsappNumber: '2348132230017',
  formattedWhatsApp: '+234 813 223 0017',
  supportEmail: 'support@testimonystore.com',
  location: 'Lagos & Abuja, Nigeria',
};

export const CATEGORIES_DATA: CategoryMeta[] = [
  {
    id: 'tech-electronics',
    name: 'Tech & Electronics',
    slug: 'tech-electronics',
    iconName: 'Smartphone',
    description: 'Next-gen flagship smartphones, ultrabooks, studio audio & smart wearables.',
    subcategories: [
      'Smartphones & Accessories',
      'Laptops & Computing',
      'Audio & Headphones',
      'Smart Wearables',
    ],
    featuredImage: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'fashion-apparel',
    name: 'Fashion & Apparel',
    slug: 'fashion-apparel',
    iconName: 'Shirt',
    description: 'Designer streetwear, bespoke native wears, luxury timepieces & leather goods.',
    subcategories: [
      "Men's Wear",
      "Women's Wear",
      'Footwear & Sneakers',
      'Bags & Jewelry',
    ],
    featuredImage: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'home-lifestyle',
    name: 'Home & Lifestyle',
    slug: 'home-lifestyle',
    iconName: 'Home',
    description: 'Modern smart home automation, kitchen appliances, and bespoke aesthetic decor.',
    subcategories: [
      'Kitchen Appliances',
      'Home Decor',
      'Smart Home Gadgets',
    ],
    featuredImage: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'beauty-personal-care',
    name: 'Beauty & Personal Care',
    slug: 'beauty-personal-care',
    iconName: 'Sparkles',
    description: 'Clinical skincare, organic nourishment, signature fragrances & hair essentials.',
    subcategories: [
      'Skincare',
      'Fragrances & Perfumes',
      'Hair Care',
    ],
    featuredImage: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'groceries-essentials',
    name: 'Groceries & Essentials',
    slug: 'groceries-essentials',
    iconName: 'ShoppingBag',
    description: 'Exotic teas, premium roasted coffee, gourmet provisions & everyday staples.',
    subcategories: [
      'Beverages & Drinks',
      'Snacks & Provisions',
    ],
    featuredImage: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80',
  },
];
