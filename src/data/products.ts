import { Product, ProductReview, MainCategory, Subcategory } from '../types';

// Curated high-resolution image sets per subcategory
const IMAGE_SETS: Record<string, string[]> = {
  'Smartphones & Accessories': [
    'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=700&q=80',
    'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=700&q=80',
    'https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=700&q=80',
    'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?auto=format&fit=crop&w=700&q=80',
    'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?auto=format&fit=crop&w=700&q=80',
    'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?auto=format&fit=crop&w=700&q=80',
  ],
  'Laptops & Computing': [
    'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=700&q=80',
    'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=700&q=80',
    'https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=700&q=80',
    'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?auto=format&fit=crop&w=700&q=80',
    'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=700&q=80',
  ],
  'Audio & Headphones': [
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=700&q=80',
    'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=700&q=80',
    'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=700&q=80',
    'https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?auto=format&fit=crop&w=700&q=80',
    'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=700&q=80',
  ],
  'Smart Wearables': [
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=700&q=80',
    'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=700&q=80',
    'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&w=700&q=80',
    'https://images.unsplash.com/photo-1544117518-30df578096a4?auto=format&fit=crop&w=700&q=80',
  ],
  "Men's Wear": [
    'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=700&q=80',
    'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=700&q=80',
    'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=700&q=80',
    'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=700&q=80',
    'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=700&q=80',
  ],
  "Women's Wear": [
    'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=700&q=80',
    'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=700&q=80',
    'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=700&q=80',
    'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=700&q=80',
    'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&w=700&q=80',
  ],
  'Footwear & Sneakers': [
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=700&q=80',
    'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=700&q=80',
    'https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=700&q=80',
    'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=700&q=80',
    'https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=700&q=80',
  ],
  'Bags & Jewelry': [
    'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=700&q=80',
    'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=700&q=80',
    'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=700&q=80',
    'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=700&q=80',
    'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=700&q=80',
  ],
  'Kitchen Appliances': [
    'https://images.unsplash.com/photo-1570222094114-d054a817e56b?auto=format&fit=crop&w=700&q=80',
    'https://images.unsplash.com/photo-1588854337236-6889d631faa8?auto=format&fit=crop&w=700&q=80',
    'https://images.unsplash.com/photo-1590794056226-79ef3a8147e1?auto=format&fit=crop&w=700&q=80',
    'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=700&q=80',
  ],
  'Home Decor': [
    'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=700&q=80',
    'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=700&q=80',
    'https://images.unsplash.com/photo-1534349762230-e0cadf78f5da?auto=format&fit=crop&w=700&q=80',
    'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=700&q=80',
  ],
  'Smart Home Gadgets': [
    'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=700&q=80',
    'https://images.unsplash.com/photo-1543512214-318c7553f230?auto=format&fit=crop&w=700&q=80',
    'https://images.unsplash.com/photo-1507646227500-4d389b0012be?auto=format&fit=crop&w=700&q=80',
  ],
  'Skincare': [
    'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=700&q=80',
    'https://images.unsplash.com/photo-1608248597359-0a6d091e3e7f?auto=format&fit=crop&w=700&q=80',
    'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=700&q=80',
    'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=700&q=80',
  ],
  'Fragrances & Perfumes': [
    'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=700&q=80',
    'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=700&q=80',
    'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=700&q=80',
    'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?auto=format&fit=crop&w=700&q=80',
  ],
  'Hair Care': [
    'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&w=700&q=80',
    'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?auto=format&fit=crop&w=700&q=80',
    'https://images.unsplash.com/photo-1519735777090-ec97162dc266?auto=format&fit=crop&w=700&q=80',
  ],
  'Beverages & Drinks': [
    'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=700&q=80',
    'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=700&q=80',
    'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=700&q=80',
    'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=700&q=80',
  ],
  'Snacks & Provisions': [
    'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?auto=format&fit=crop&w=700&q=80',
    'https://images.unsplash.com/photo-1582293041079-7814c2f12063?auto=format&fit=crop&w=700&q=80',
    'https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?auto=format&fit=crop&w=700&q=80',
    'https://images.unsplash.com/photo-1621996346565-e3d5d6281e85?auto=format&fit=crop&w=700&q=80',
  ],
};

interface SubcategoryTemplate {
  name: Subcategory;
  category: MainCategory;
  prefix: string;
  items: {
    baseName: string;
    brand: string;
    price: number;
    specs: Record<string, string>;
    desc: string;
    tags: string[];
  }[];
}

// Subcategory definitions with bases
const SUBCATEGORY_TEMPLATES: SubcategoryTemplate[] = [
  // 1. Smartphones & Accessories
  {
    name: 'Smartphones & Accessories',
    category: 'Tech & Electronics',
    prefix: 'TECH-PHN',
    items: [
      { baseName: 'Pro Max Titanium 5G (256GB)', brand: 'Apple', price: 1650000, specs: { Display: '6.7" Super Retina XDR OLED', Battery: '4422 mAh', Processor: 'A17 Pro Bionic', Network: '5G Global Ready', Warranty: '1 Year Apple Care' }, desc: 'Aerospace-grade titanium chassis, Action Button, 48MP main camera with 5x optical telephoto lens.', tags: ['Flagship', 'iOS', '5G', 'Dual SIM'] },
      { baseName: 'Galaxy Ultra AI Titanium 512GB', brand: 'Samsung', price: 1780000, specs: { Display: '6.8" Dynamic AMOLED 2X 120Hz', Camera: '200MP Quad Cam', S_Pen: 'Built-in S-Pen Stylus', Battery: '5000 mAh 45W' }, desc: 'Unmatched mobile computing with built-in Galaxy AI live translation and 100x Space Zoom.', tags: ['Android', 'AI Camera', '200MP', '512GB'] },
      { baseName: 'Phantom V Fold2 5G', brand: 'Tecno', price: 1350000, specs: { Display: '7.85" Foldable AMOLED', RAM: '16GB RAM + 512GB ROM', Battery: '5750 mAh 70W Ultra Charge' }, desc: 'Ultra-slim foldable flagship engineered for multitasking, business executives, and power creators.', tags: ['Foldable', 'Flagship', 'Fast Charge'] },
      { baseName: 'Camo Zero 30 5G Flagship', brand: 'Infinix', price: 420000, specs: { Front_Camera: '50MP 4K 60FPS Vlog Cam', Storage: '256GB ROM + 12GB RAM', Display: '144Hz 3D Curved AMOLED' }, desc: 'Designed for next-gen creators featuring flawless 4K front vlogging camera and curved display.', tags: ['Vlogging', 'Curved Screen', 'High Refresh'] },
      { baseName: 'Magnetic 65W GaN Power Bank 20000mAh', brand: 'Anker', price: 68000, specs: { Capacity: '20,000 mAh / 74Wh', Output: '65W Max USB-C PD 3.0', Ports: '2x USB-C, 1x USB-A' }, desc: 'Ultra-compact high-speed power bank capable of charging laptops, tablets, and phones simultaneously.', tags: ['Fast Charge', 'Laptop Charger', 'GaN'] },
      { baseName: 'Armor Magnetic Shockproof Case', brand: 'Spigen', price: 28000, specs: { Material: 'Polycarbonate & TPU Air Cushion', Compatibility: 'MagSafe Compatible', Drop_Test: 'MIL-STD 810G-516.6' }, desc: 'Military-grade rugged shock absorption with integrated neodymium magnetic ring for wireless chargers.', tags: ['Protective', 'MagSafe', 'Accessories'] },
      { baseName: '100W Braided Kevlar Type-C Cable (2m)', brand: 'Baseus', price: 14500, specs: { Speed: '480 Mbps Data Transfer', Length: '2.0 Meters (6.6ft)', Durability: '30,000+ Bend Lifespan' }, desc: 'Heavy-duty Kevlar-reinforced charging cable delivering up to 100W PD charging speed.', tags: ['Durable', 'Type-C', 'Fast Charging'] },
      { baseName: '3-in-1 Foldable Travel Wireless Station', brand: 'Joyroom', price: 45000, specs: { Output: '15W Phone + 5W Watch + 5W Pods', Folding: 'Multi-angle origami fold', Interface: 'USB-C Input' }, desc: 'Magnetic folding charging stand for bedside or office desk, powering phone, smartwatch, and earbuds.', tags: ['Wireless Charging', 'Travel', 'Compact'] }
    ]
  },
  // 2. Laptops & Computing
  {
    name: 'Laptops & Computing',
    category: 'Tech & Electronics',
    prefix: 'TECH-LPT',
    items: [
      { baseName: 'MacBook Pro 16" M3 Max (36GB/1TB)', brand: 'Apple', price: 3850000, specs: { Chip: 'Apple M3 Max 14-core CPU', Memory: '36GB Unified Memory', SSD: '1TB Superfast NVMe', Display: 'Liquid Retina XDR 120Hz' }, desc: 'The ultimate portable powerhouse for 3D rendering, software engineering, and 8K video production.', tags: ['Pro Laptop', 'Apple Silicon', 'Engineering'] },
      { baseName: 'XPS 15 InfinityEdge OLED (i9/32GB)', brand: 'Dell', price: 2950000, specs: { CPU: 'Intel Core i9-13900H 14 Cores', GPU: 'NVIDIA RTX 4070 8GB GDDR6', Display: '3.5K OLED Touchscreen' }, desc: 'Machined aluminum chassis, carbon fiber palm rest, and breathtaking 3.5K OLED creator display.', tags: ['Creator Laptop', 'RTX 4070', 'OLED'] },
      { baseName: 'ThinkPad X1 Carbon Gen 11 Ultrabook', brand: 'Lenovo', price: 2150000, specs: { Weight: '1.12 kg Ultra-Lightweight', Battery: 'Up to 19.5 Hours Battery', Security: 'Fingerprint & IR Face Recognition' }, desc: 'Legendary business reliability, spill-resistant keyboard, and enterprise security architecture.', tags: ['Enterprise', 'Lightweight', 'Business'] },
      { baseName: 'Legion Pro 7i Gen 8 Gaming Beast', brand: 'Lenovo', price: 2800000, specs: { GPU: 'RTX 4080 12GB 175W TGP', Display: '16" 240Hz WQXGA 500 nits', Cooling: 'Coldfront 5.0 Vapor Chamber' }, desc: 'Extreme desktop-grade performance engineered for competitive esports and intense ray-traced gaming.', tags: ['Gaming', 'RTX 4080', 'High Refresh'] },
      { baseName: 'Zenbook 14 OLED Ultra 7 Evo', brand: 'ASUS', price: 1650000, specs: { CPU: 'Intel Core Ultra 7 155H with NPU', Display: '14" 2.8K 120Hz Lumina OLED', Weight: '1.2 kg' }, desc: 'AI-accelerated thin and light laptop with military-grade durability and all-day endurance.', tags: ['AI PC', 'OLED', 'Portable'] },
      { baseName: '4K Ultra-Wide 34" Curved Monitor 165Hz', brand: 'Samsung', price: 620000, specs: { Curvature: '1000R Deep Curve', Panel: 'VA QD-OLED HDR400', Connectivity: 'Thunderbolt 4, HDMI 2.1, DP' }, desc: 'Immersive wrap-around panoramic display providing maximum productivity workspace and gaming clarity.', tags: ['Monitor', 'Curved', 'Productivity'] },
      { baseName: 'Master 3S Ergonomic Silent Wireless Mouse', brand: 'Logitech', price: 135000, specs: { Sensor: '8000 DPI Darkfield Laser', Battery: 'Up to 70 days rechargeable', Scrolling: 'MagSpeed Electromagnetic Wheel' }, desc: 'The gold standard workstation mouse with quiet clicks, gesture controls, and multi-device Flow.', tags: ['Ergonomic', 'Workstation', 'Wireless'] }
    ]
  },
  // 3. Audio & Headphones
  {
    name: 'Audio & Headphones',
    category: 'Tech & Electronics',
    prefix: 'TECH-AUD',
    items: [
      { baseName: 'WH-1000XM5 Wireless Noise-Canceling', brand: 'Sony', price: 460000, specs: { ANC: 'Dual Processor V1 + QN1 ANC', Battery: '30 Hours with Quick Charge', Driver: '30mm Carbon Composite' }, desc: 'Industry-leading noise cancellation with 8 microphones, LDAC Hi-Res audio, and Speak-to-Chat.', tags: ['ANC', 'Hi-Res Audio', 'Travel'] },
      { baseName: 'QuietComfort Ultra Spatial Headphones', brand: 'Bose', price: 510000, specs: { Audio: 'Bose Immersive Spatial Audio', CustomTune: 'Ear-canal acoustic calibration', Battery: '24 Hours Playtime' }, desc: 'Breakthrough spatialized audio making your music feel more real and spacious than ever before.', tags: ['Spatial Audio', 'Comfort', 'Premium ANC'] },
      { baseName: 'AirPods Pro 2nd Gen USB-C MagSafe', brand: 'Apple', price: 340000, specs: { Chip: 'H2 Headphone Processor', Transparency: 'Adaptive Audio & Conversation Awareness', Case: 'Precision Finding Case' }, desc: 'Up to 2x more Active Noise Cancellation, personalized spatial audio with dynamic head tracking.', tags: ['True Wireless', 'MagSafe', 'Apple'] },
      { baseName: 'Boombox 3 Waterproof Bluetooth Speaker', brand: 'JBL', price: 540000, specs: { Output: '180W RMS (AC mode)', Battery: '24 Hours Massive Li-ion', Waterproof: 'IP67 Water & Dustproof' }, desc: 'Monstrous bass and crystal highs tuned for outdoor parties, poolside, and large gatherings.', tags: ['Outdoor', 'Party Speaker', 'Deep Bass'] },
      { baseName: 'Soundcore Space A40 Ultra-Compact Earbuds', brand: 'Anker', price: 85000, specs: { Playtime: '50-Hour Playtime with Case', ANC: 'Adaptive Noise Cancelling reduces noise by 98%', Audio: 'Hi-Res Wireless & LDAC' }, desc: 'Feather-light true wireless buds offering audiophile-grade detail and long battery performance.', tags: ['Best Value', 'Long Battery', 'Compact'] }
    ]
  },
  // 4. Smart Wearables
  {
    name: 'Smart Wearables',
    category: 'Tech & Electronics',
    prefix: 'TECH-WRB',
    items: [
      { baseName: 'Watch Ultra 2 GPS + Cellular 49mm', brand: 'Apple', price: 1250000, specs: { Case: '49mm Aerospace Titanium', Brightness: '3000 nits Peak Brightness', Battery: 'Up to 72 Hours Low Power Mode' }, desc: 'Built for extreme endurance athletes, divers, and adventurers with dual-frequency precision GPS.', tags: ['Rugged', 'Cellular', 'Fitness Flagship'] },
      { baseName: 'Galaxy Watch 6 Classic 47mm LTE', brand: 'Samsung', price: 395000, specs: { Bezel: 'Rotating Physical Bezel', Health: 'ECG, Blood Pressure, Body Composition', Glass: 'Sapphire Crystal Screen' }, desc: 'Timeless luxury stainless steel casing paired with advanced body composition and sleep coaching.', tags: ['Luxury Smartwatch', 'ECG', 'Fitness'] },
      { baseName: 'Fenix 7X Pro Solar Sapphire Edition', brand: 'Garmin', price: 1100000, specs: { Solar: 'Power Glass Solar Charging Lens', Flashlight: 'Multi-LED Built-in Flashlight', Battery: 'Up to 37 Days in Smartwatch Mode' }, desc: 'Multisport GPS watch with topo maps, stamina tracking, and military-grade durability.', tags: ['Solar GPS', 'Outdoor', 'Ultra Marathon'] },
      { baseName: 'Band 8 Slim AMOLED Health Tracker', brand: 'Huawei', price: 48000, specs: { Thickness: '8.99mm Ultra-Thin Design', Screen: '1.47" Full AMOLED Display', Battery: '14 Days Typical Usage' }, desc: 'Discreet, featherweight smart band monitoring sleep phases, SpO2, stress, and 100 workout modes.', tags: ['Lightweight', 'Budget Friendly', 'Health'] }
    ]
  },
  // 5. Men's Wear
  {
    name: "Men's Wear",
    category: 'Fashion & Apparel',
    prefix: 'FASH-MEN',
    items: [
      { baseName: 'Bespoke Senator Kaftan 2-Piece Suit', brand: 'Testimony Atelier', price: 85000, specs: { Fabric: '100% Premium Cashmere Wool Blend', Stitching: 'Hand-finished edge piping', Care: 'Dry Clean Only' }, desc: 'Impeccably tailored modern African luxury senator suit with embroidered placket and trousers.', tags: ['Native Wear', 'Senator', 'Bespoke', 'Luxury'] },
      { baseName: 'Structured Italian Wool Blazer', brand: 'Canali Milano', price: 240000, specs: { Material: 'Super 130s Pure Virgin Wool', Cut: 'Modern Slim Tailored Fit', Origin: 'Made in Italy' }, desc: 'Sophisticated single-breasted jacket designed for black-tie networking, banquets, and corporate leaders.', tags: ['Formal', 'Blazer', 'Luxury Tailoring'] },
      { baseName: 'Heavyweight French Terry Cotton Hoodie', brand: 'Testimony Studio', price: 42000, specs: { Weight: '480 GSM 100% Organic Cotton', Fit: 'Relaxed Drop-Shoulder Silhouette', Details: 'Reinforced kangaroo pocket' }, desc: 'Premium streetwear staple with dense knit structure, ribbed cuffs, and minimal aesthetic branding.', tags: ['Streetwear', 'Casual', 'Oversized'] },
      { baseName: 'Selvedge Raw Denim Slim-Straight Jeans', brand: 'Heritage Denims', price: 55000, specs: { Weight: '14.5oz Japanese Selvedge Cotton', Hardware: 'Solid Copper Rivets and Buttons', Fit: 'Custom Slim Straight' }, desc: 'Unwashed raw indigo denim designed to develop unique personal fades with each wear.', tags: ['Selvedge', 'Raw Denim', 'Casual'] },
      { baseName: 'Oxford Button-Down Crisp Cotton Shirt', brand: 'Savile Club', price: 32000, specs: { Fabric: '100% Two-Ply Egyptian Giza Cotton', Collar: 'Structured Hidden Button-Down', Finish: 'Easy-Iron Wrinkle Resist' }, desc: 'Crisp, breathable dress shirt providing timeless elegance from morning meetings to evening dinners.', tags: ['Dress Shirt', 'Workwear', 'Cotton'] }
    ]
  },
  // 6. Women's Wear
  {
    name: "Women's Wear",
    category: 'Fashion & Apparel',
    prefix: 'FASH-WMN',
    items: [
      { baseName: 'Luxe Ankara Print Asymmetric Maxi Dress', brand: 'AfroChic London', price: 68000, specs: { Fabric: '100% Premium Dutch Wax Cotton', Cut: 'Flattering Asymmetric Wrap Skirt', Lining: 'Soft Cotton Voile Lining' }, desc: 'Vibrant, high-contrast cultural statement dress featuring flowing silhouette and tailored waistline.', tags: ['Ankara', 'African Fashion', 'Maxi Dress'] },
      { baseName: 'Tailored Wide-Leg Silk Crepe Trousers', brand: 'Zara Couture', price: 48000, specs: { Fabric: 'Heavyweight Silk Crepe de Chine', Rise: 'High-Waisted Structured Waistband', Pockets: 'Deep Slant Side Pockets' }, desc: 'Flowing wide-leg cut lending effortless sophistication to office attire and dinner silhouettes.', tags: ['Formal', 'Silk', 'High Waist'] },
      { baseName: 'Double-Breasted Linen Trench Coat', brand: 'Massimo Dutti', price: 165000, specs: { Composition: '100% French Natural Flax Linen', Details: 'Tortoiseshell Buttons & D-Ring Belt', Length: 'Mid-Calf Elegant Cut' }, desc: 'Breathable, timeless statement outerwear for year-round effortless layering and travel.', tags: ['Outerwear', 'Linen', 'Luxury'] },
      { baseName: 'Satin Slip Midi Dress with Cowl Neck', brand: 'Aya Muse', price: 58000, specs: { Fabric: 'Lustrous Liquid Silk Satin', Straps: 'Adjustable Delicate Rouleau Straps', Cut: 'Bias-Cut Drape' }, desc: 'Figure-skimming silhouette that dances in the light, perfect for cocktail parties and galas.', tags: ['Evening Wear', 'Satin', 'Party'] }
    ]
  },
  // 7. Footwear & Sneakers
  {
    name: 'Footwear & Sneakers',
    category: 'Fashion & Apparel',
    prefix: 'FASH-SHS',
    items: [
      { baseName: 'Retro High OG Heritage Leather Sneaker', brand: 'Nike Air', price: 195000, specs: { Leather: 'Full-Grain Tumbled Cowhide', Sole: 'Encapsulated Air-Sole Unit', Edition: 'Limited Release Collector' }, desc: 'Iconic high-top basketball silhouette remastered in timeless colorway with archival accuracy.', tags: ['Sneakers', 'Streetwear', 'Collectibles'] },
      { baseName: 'Cloudfoam Ultra Running Trainers', brand: 'Adidas', price: 95000, specs: { Midsole: 'Lightstrike Pro Boost Foam', Upper: 'Breathable Engineered Primeknit', Weight: '240g Featherweight' }, desc: 'Maximum energy return and shock absorption for daily 10k road running and fitness sessions.', tags: ['Running', 'Athletic', 'Boost'] },
      { baseName: 'Handcrafted Goodyear-Welted Leather Loafers', brand: 'Church & Co', price: 285000, specs: { Upper: 'Calfskin Box Leather', Construction: 'Goodyear Welted Oak Bark Sole', Lining: 'Soft Glove Leather' }, desc: 'Traditional artisan dress shoes offering decades of longevity, comfort, and undeniable authority.', tags: ['Dress Shoes', 'Leather', 'Goodyear Welted'] },
      { baseName: 'Minimalist White Low-Top Leather Sneaker', brand: 'Common Projects', price: 175000, specs: { Origin: 'Crafted in Marche, Italy', Details: 'Gold Foil Serial Number Stamping', Sole: 'Margom Vulcanized Rubber' }, desc: 'The quintessential minimalist luxury sneaker, pairing seamlessly with both suits and denim.', tags: ['Minimalist', 'Luxury Sneaker', 'Italian Leather'] }
    ]
  },
  // 8. Bags & Jewelry
  {
    name: 'Bags & Jewelry',
    category: 'Fashion & Apparel',
    prefix: 'FASH-BAG',
    items: [
      { baseName: 'Pebbled Full-Grain Leather Executive Briefcase', brand: 'Montblanc', price: 420000, specs: { Material: 'Italian Full-Grain Calfskin Leather', Laptop_Sleeve: 'Padded for up to 16" Laptops', Lock: 'Brushed Gunmetal Combination Clasp' }, desc: 'Impeccable executive craftsmanship with compartmentalized organization for documents and devices.', tags: ['Executive', 'Briefcase', 'Full Grain'] },
      { baseName: '18K Gold Plated Cuban Link Chain (10mm)', brand: 'Testimony Jewels', price: 98000, specs: { Base: '316L Surgical Stainless Steel', Plating: '5x PVD 18K Real Gold Plating', Clasp: 'Double-Safety Iced Box Clasp' }, desc: 'Heavyweight diamond-cut curb links engineered never to tarnish, fade, or irritate sensitive skin.', tags: ['Jewelry', '18K Gold', 'Cuban Link'] },
      { baseName: 'Quilted Crossbody Leather Flap Bag', brand: 'Chanel Style', price: 210000, specs: { Leather: 'Supple Lambskin Leather', Strap: 'Interwoven Gold Chain & Leather', Hardware: 'Polished Brass Hardware' }, desc: 'Iconic diamond quilting and sleek silhouette for evening galas, formal dinners, and daily elegance.', tags: ['Handbag', 'Crossbody', 'Luxury'] },
      { baseName: 'Automatic Diver 300m Steel Watch', brand: 'Seiko Prospex', price: 340000, specs: { Movement: 'Caliber 4R35 Automatic Hand-Winding', Water_Resist: '300m Professional Diver', Glass: 'Hardlex Crystal Bezel' }, desc: 'Robust nautical sports watch tested for deep water diving and refined everyday wrist presence.', tags: ['Automatic Watch', 'Diver', 'Stainless Steel'] }
    ]
  },
  // 9. Kitchen Appliances
  {
    name: 'Kitchen Appliances',
    category: 'Home & Lifestyle',
    prefix: 'HOME-KTN',
    items: [
      { baseName: 'Smart Touch Air Fryer XXL 8.5L', brand: 'Ninja', price: 145000, specs: { Capacity: '8.5 Liters Family Size', Power: '2200W Rapid Air Circulation', Modes: 'Air Fry, Roast, Dehydrate, Reheat' }, desc: 'Crisps meals with up to 75% less oil, featuring dual-zone cooking baskets and digital presets.', tags: ['Kitchen', 'Air Fryer', 'Healthy Cooking'] },
      { baseName: 'Commercial High-Speed Blender 2500W', brand: 'Vitamix Pro', price: 185000, specs: { Motor: '3.5 Peak HP Commercial Motor', Blades: 'Aircraft-grade Hardened Stainless Steel', Pitcher: '2.0L BPA-Free Tritan Jar' }, desc: 'Effortlessly pulses tough Nigerian beans for moi-moi, tigernut milk, smoothies, and ice crushes.', tags: ['Heavy Duty', 'Blender', 'Commercial'] },
      { baseName: 'Espresso & Cappuccino Barista Machine 20-Bar', brand: 'DeLonghi', price: 275000, specs: { Pump: 'Italian 20-Bar High Pressure Pump', Wand: 'Stainless Steel Manual Milk Frothing Wand', Boiler: 'ThermoBlock Rapid Heating' }, desc: 'Brew authentic velvety espresso, silky lattes, and frothy cappuccinos in under 45 seconds.', tags: ['Coffee', 'Espresso', 'Barista'] },
      { baseName: 'Multi-Function Digital Pressure Cooker 6L', brand: 'Instant Pot', price: 115000, specs: { Safety: '10 Proven Safety Mechanisms', Presets: '14 One-Touch Smart Programs', Inner_Pot: 'Food-Grade 304 Stainless Steel' }, desc: 'Prepares tender stews, soups, beans, and jollof rice up to 70% faster than traditional stovetop.', tags: ['Pressure Cooker', 'Multi Cooker', 'Fast Cooking'] }
    ]
  },
  // 10. Home Decor
  {
    name: 'Home Decor',
    category: 'Home & Lifestyle',
    prefix: 'HOME-DEC',
    items: [
      { baseName: 'Handmade Ceramic Sculptural Vases (Set of 3)', brand: 'Nordic Clay', price: 42000, specs: { Material: 'Organic Stoneware Ceramic', Finish: 'Matte Sandy Textured Glaze', Dimensions: 'Height: 28cm, 22cm, 16cm' }, desc: 'Minimalist wabi-sabi ceramic vessels designed to elevate dining tables, mantels, and entryway consoles.', tags: ['Ceramic', 'Vases', 'Minimalist Decor'] },
      { baseName: 'Ultrasonic Aromatherapy Ambient Diffuser', brand: 'Muji Zen', price: 34000, specs: { Capacity: '500ml Water Reservoir', Lighting: 'Warm Candlelight LED Glow', Timer: '1H / 3H / 6H Auto Shutoff' }, desc: 'Whisper-quiet ultrasonic mist distributing essential oils while casting a tranquil ambient warm glow.', tags: ['Aromatherapy', 'Wellness', 'Ambient Light'] },
      { baseName: 'Abstract Textured Canvas Wall Art 120x80cm', brand: 'Lagos Modern Studio', price: 78000, specs: { Medium: 'Acrylic & Plaster on Cotton Canvas', Frame: 'Natural Floating Solid Oak Wood Frame', Ready: 'Pre-installed Sawtooth Hanging Hooks' }, desc: 'Tactile layered abstract composition creating sophisticated gallery depth in modern living rooms.', tags: ['Wall Art', 'Canvas', 'Interior Design'] },
      { baseName: 'Geometric Tufted Wool Area Rug (200x300cm)', brand: 'Bespoke Loom', price: 165000, specs: { Material: '100% New Zealand Wool', Pile: 'High-Density 15mm Plush Pile', Backing: 'Non-Slip Natural Latex Backing' }, desc: 'Sumptuous plush underfoot feel featuring neutral geometric patterns that ground any sitting room.', tags: ['Rugs', 'Plush', 'Living Room'] }
    ]
  },
  // 11. Smart Home Gadgets
  {
    name: 'Smart Home Gadgets',
    category: 'Home & Lifestyle',
    prefix: 'HOME-SMT',
    items: [
      { baseName: 'Smart Biometric Fingerprint Door Lock', brand: 'Aqara', price: 165000, specs: { Access: 'Fingerprint, Passcode, RFID Card, Mobile App, Key', Mortise: 'Class-C Anti-Theft Stainless Mortise', Battery: '8x AA Batteries (18 months battery)' }, desc: 'Keyless peace of mind with 0.3s lightning recognition, doorbell chime, and remote access logs.', tags: ['Smart Security', 'Fingerprint Lock', 'Home Automation'] },
      { baseName: 'Outdoor Solar 4K PTZ Security Camera', brand: 'Eufy Security', price: 145000, specs: { Solar: 'Integrated Solar Panel (Infinite Power)', Resolution: '4K Ultra HD with Color Night Vision', Rotation: '360° Pan & 120° Tilt AI Human Tracking' }, desc: '100% wire-free perimeter security with spotlight deterrent, siren, and zero monthly cloud fees.', tags: ['Security Camera', 'Solar Powered', '4K'] },
      { baseName: 'Smart WiFi RGBIC Corner Floor Lamp', brand: 'Govee', price: 62000, specs: { Lumens: '1500 Lumens Output', Connectivity: 'WiFi 2.4GHz + Bluetooth App Control', Music_Sync: 'Built-in High Sensitivity Mic for Music Sync' }, desc: 'Dynamic flowing gradient illumination reacting to beats, movies, and personal mood scenes.', tags: ['Smart Lighting', 'RGBIC', 'Room Decor'] }
    ]
  },
  // 12. Skincare
  {
    name: 'Skincare',
    category: 'Beauty & Personal Care',
    prefix: 'BTY-SKN',
    items: [
      { baseName: 'Niacinamide 10% + Zinc 1% Blemish Serum (60ml)', brand: 'The Ordinary', price: 16500, specs: { Skin_Type: 'Oily, Combination, Acne-Prone', Key_Actives: '10% Niacinamide, 1% Zinc PCA', Volume: '60ml Super Size' }, desc: 'Visibly balances sebum activity, tightens enlarged pores, and diminishes post-blemish dark marks.', tags: ['Serum', 'Niacinamide', 'Pore Care'] },
      { baseName: 'Ultra-Hydrating Hyaluronic Water Gel Cream', brand: 'Laneige', price: 28000, specs: { Formula: 'Micro-Hyaluronic Acid & Blue Sea Minerals', Finish: 'Non-comedogenic Dewey Glow', Size: '50ml Airless Jar' }, desc: 'Replenishes moisture reserves for 48 hours without heaviness, ideal for warm tropical climates.', tags: ['Moisturizer', 'Hyaluronic Acid', 'Hydration'] },
      { baseName: 'Broad Spectrum SPF 50+ Invisible Sun Fluid', brand: 'La Roche-Posay', price: 24500, specs: { Protection: 'UVA/UVB SPF 50+ PA++++', Cast: 'Guaranteed 0% White Cast on Melanin Rich Skin', Water_Resist: 'Sweat and Water Resistant for 80 mins' }, desc: 'Ultra-lightweight invisible fluid leaving zero greasiness or chalky residue on dark skin tones.', tags: ['Sunscreen', 'No White Cast', 'Dermatologist'] },
      { baseName: 'Raw Whipped Shea & Cocoa Butter Glow Balm', brand: 'Testimony Naturals', price: 12000, specs: { Ingredients: 'Unrefined Ghanaian Shea, Nigerian Cocoa, Jojoba', Scent: 'Subtle Warm Vanilla & Almond', Net_Weight: '250g' }, desc: 'Deeply nourishes dry elbows, knees, and stretch marks, locking in long-lasting radiant moisture.', tags: ['Organic', 'Shea Butter', 'Glow'] }
    ]
  },
  // 13. Fragrances & Perfumes
  {
    name: 'Fragrances & Perfumes',
    category: 'Beauty & Personal Care',
    prefix: 'BTY-PRF',
    items: [
      { baseName: 'Oud Royal Extract Extrait de Parfum (100ml)', brand: 'Maison Francis K', price: 320000, specs: { Concentration: 'Extrait de Parfum (35% Oil Concentration)', Top_Notes: 'Saffron, Nutmeg, Bergamot', Base_Notes: 'Cambodian Oud, Amber, Leather, Vanilla' }, desc: 'Opulent, aristocratic fragrance trail radiating magnetic warmth and all-day projection.', tags: ['Niche Perfume', 'Oud', 'Luxury Scent'] },
      { baseName: 'Sauvage Elixir Concentrated Cologne', brand: 'Dior', price: 215000, specs: { Family: 'Spicy Woody Aromatic', Sillage: 'Enormous 24-Hour Lasting Sillage', Launch: 'Signature Iconic Masculine Release' }, desc: 'Extreme concentration steeped in iconic freshness with an intoxicating spicy heart and lavender essence.', tags: ['Masculine', 'Beast Mode', 'Signature'] },
      { baseName: 'Baccarat Rouge 540 Scent Profile (70ml)', brand: 'Maison Francis K', price: 285000, specs: { Type: 'Amber Floral Woody', Notes: 'Jasmine, Saffron, Cedarwood, Ambergris', Longevity: 'Over 16 Hours on Skin & Clothes' }, desc: 'Luminous and intense, laying on skin like an amber and woody floral whisper of pure elegance.', tags: ['Iconic Scent', 'Compliment Getter', 'Luxury'] },
      { baseName: 'Vanilla Sugar & Warm Amber Body Mist (250ml)', brand: 'Sol de Janeiro', price: 38000, specs: { Fragrance_Type: 'Gourmand Warm Vanilla & Salted Caramel', Application: 'Hair & Body Mist', Volume: '240ml Spray Flacon' }, desc: 'Deliciously addictive sunny gourmand mist providing an instant mood boost and delicious aroma.', tags: ['Body Mist', 'Vanilla', 'Sweet'] }
    ]
  },
  // 14. Hair Care
  {
    name: 'Hair Care',
    category: 'Beauty & Personal Care',
    prefix: 'BTY-HAR',
    items: [
      { baseName: 'Bond Maintenance Hair Repair System (No. 3)', brand: 'Olaplex', price: 36000, specs: { Technology: 'Patented Bis-Aminopropyl Diglycol Dimaleate', Benefit: 'Relinks Broken Disulfide Bonds', Usage: 'Pre-shampoo treatment for damaged hair' }, desc: 'Clinically proven concentrated treatment restoring internal hair structure and tensile strength.', tags: ['Hair Repair', 'Bond Builder', 'Salon Grade'] },
      { baseName: 'Rosemary & Mint Scalp Strengthening Hair Oil', brand: 'Mielle Organics', price: 14000, specs: { Infusion: 'Organic Biotin & Over 30 Essential Oils', Target: 'Follicle Stimulation & Length Retention', Size: '59ml Precision Dropper' }, desc: 'Bestselling scalp nutrient soothing dry itchiness, smoothing split ends, and encouraging vigorous growth.', tags: ['Hair Growth', 'Scalp Oil', 'Organic'] },
      { baseName: 'Deep Moisture Raw Shea Intensive Mask (500ml)', brand: 'Shea Moisture', price: 18500, specs: { Active: 'Raw Shea Butter, Sea Kelp & Argan Oil', Hair_Type: 'Coily, Curly & Chemically Treated Textures', Free_From: 'No Sulfates, Silicones, or Mineral Oils' }, desc: 'Intense moisture mask detangling stubborn knots and infusing dry brittle curls with rich elasticity.', tags: ['Deep Conditioner', 'Curly Hair', 'Natural Hair'] }
    ]
  },
  // 15. Beverages & Drinks
  {
    name: 'Beverages & Drinks',
    category: 'Groceries & Essentials',
    prefix: 'GROC-BEV',
    items: [
      { baseName: 'Artisanal Medium Roast Arabica Beans (1kg)', brand: 'Kilimanjaro Coffee', price: 22000, specs: { Origin: 'Single Origin East Africa', Roast: 'Medium Roast with Notes of Honey & Cocoa', Whole_Bean: 'Freshly Roasted Valve Sealed Foil' }, desc: 'Aromatic smooth coffee beans providing balanced acidity and velvety mouthfeel for morning brews.', tags: ['Coffee', 'Whole Bean', 'Arabica'] },
      { baseName: 'Pure Ceremonial Grade Japanese Matcha (100g)', brand: 'Uji Kyoto', price: 29000, specs: { Grade: 'First Harvest Ceremonial Grade', Nutrition: '137x Antioxidants of Standard Green Tea', Texture: 'Micro-Milled Emerald Green Silk Powder' }, desc: 'Vibrant clean energy without jitters, packed with L-theanine for sustained mental focus.', tags: ['Matcha', 'Antioxidants', 'Superfood'] },
      { baseName: 'Sparkling Botanical Mineral Water (Pack of 12)', brand: 'San Pellegrino', price: 18000, specs: { Pack: '12 x 750ml Emerald Glass Bottles', Source: 'Natural Italian Alpine Springs', Effervescence: 'Crisp Fine Bubbles' }, desc: 'Pure refreshing carbonated mineral hydration to complement fine dining, wines, and lunch.', tags: ['Mineral Water', 'Sparkling', 'Refreshing'] },
      { baseName: 'Organic Hibiscus & Ginger Zobo Infusion (Pack of 20)', brand: 'Testimony Pantry', price: 7500, specs: { Ingredients: '100% Sun-Dried Nigerian Zobo Calyces & Dried Ginger', Preparation: 'Brews Hot or Chilled with Citrus', Additives: 'Zero Artificial Sugar or Flavors' }, desc: 'Traditional Nigerian antioxidant powerhouse bursting with ruby color and invigorating spiced punch.', tags: ['Zobo', 'Herbal Tea', 'Local Favorite'] }
    ]
  },
  // 16. Snacks & Provisions
  {
    name: 'Snacks & Provisions',
    category: 'Groceries & Essentials',
    prefix: 'GROC-SNK',
    items: [
      { baseName: 'Premium Salted Cashew Nuts Glass Jar (500g)', brand: 'Ogbomoso Gold', price: 12500, specs: { Source: 'Hand-Selected Jumbo Grade Ogbomoso Cashews', Roast: 'Slow Roasted in Sea Salt and Crisp', Shelf_Life: '12 Months Airtight' }, desc: 'Extra-crunchy, golden jumbo whole cashew nuts packed with healthy proteins and buttery richness.', tags: ['Cashews', 'Healthy Snacks', 'Local Premium'] },
      { baseName: 'Artisanal Crispy Ripe Plantain Chips (Box of 12)', brand: 'Kolawole Snacks', price: 9500, specs: { Oil: 'Fried in Pure Vegetable Oil', Seasoning: 'Lightly Salted Ripe Sweet Crunch', Pack_Size: '12 x 100g Individual Bags' }, desc: 'Authentic golden yellow sweet dodo chips delivering the nostalgic Nigerian street food crunch.', tags: ['Plantain Chips', 'Snacks', 'Crispy'] },
      { baseName: 'Swiss Dark Chocolate 85% Cocoa Truffles (300g)', brand: 'Lindt Excellence', price: 16500, specs: { Cocoa: '85% Single-Origin Trinitario Beans', Texture: 'Silky Melt-in-Mouth Ganache Core', Net_Weight: '300g Gift Box' }, desc: 'Intense rich cocoa complexity with subtle roasted fruit undertones, crafted by Swiss maître chocolatiers.', tags: ['Dark Chocolate', 'Gourmet', 'Gift'] },
      { baseName: 'Raw Multifloral Forest Honey Glass Jar (1kg)', brand: 'Mambilla Nectar', price: 14000, specs: { Purity: '100% Raw Unpasteurized Wildflower Honey', Origin: 'Mambilla Plateau Taraba State', Consistency: 'Thick Golden Crystallizing Nectar' }, desc: 'Pure unheated Nigerian highland honey rich in natural pollens, enzymes, and medicinal soothing warmth.', tags: ['Raw Honey', 'Pure', 'Natural Sweetener'] }
    ]
  }
];

// Nigerian review templates for authentic social proof
const REVIEW_NAMES = [
  'Tunde Adeleke',
  'Chidinma Okoye',
  'Ibrahim Mohammed',
  'Blessing Eke',
  'Folashade Balogun',
  'Emeka Nwosu',
  'Kehinde Alabi',
  'Amina Yusuf',
  'Chibuike Eze',
  'Zainab Bello',
  'Oluwaseun Bakare',
  'Ngozi Obi'
];

const REVIEW_COMMENTS = [
  'Delivery was fast to Lekki Phase 1! The quality exceeded my expectations. Testimony Store is my new go-to.',
  'Confirmed transfer via Moniepoint and my order was verified in under 15 minutes. Very reliable merchant!',
  'Authentic original item with seal intact. Customer care on WhatsApp responded right away to confirm tracking.',
  'Top tier! Package arrived in Abuja securely wrapped with bubble cushioning. Highly recommended.',
  'I have ordered twice now and both transactions were smooth. Great pricing and genuine brand quality.',
  'The best shopping experience I have had online in Nigeria. Real stock and polite delivery.'
];

// Generator to produce 520+ distinct catalog products
function generateFullCatalog(): Product[] {
  const catalog: Product[] = [];
  let globalIndex = 1;

  // For each subcategory, generate a balanced set of products
  for (const sub of SUBCATEGORY_TEMPLATES) {
    const images = IMAGE_SETS[sub.name] || IMAGE_SETS['Smartphones & Accessories'];
    const itemCount = 33; // 16 subcategories * 33 items = 528 products!

    for (let i = 0; i < itemCount; i++) {
      const template = sub.items[i % sub.items.length];
      const imageIndex = (i + globalIndex) % images.length;
      const primaryImage = images[imageIndex];
      const secondaryImage = images[(imageIndex + 1) % images.length];
      const tertiaryImage = images[(imageIndex + 2) % images.length];

      // Add variation qualifiers for uniqueness across 500+ items
      const variations = [
        'Signature Edition',
        'Pro Edition',
        'Elite Series',
        'Vanguard Series',
        'Max Edition',
        'Stealth Black',
        'Prime Edition',
        'Classic Edition',
        'Heritage Collection',
        'Ultra Refined',
        'Apex Edition',
        'Studio Craft',
        'Prestige Model'
      ];
      const variationName = variations[i % variations.length];
      const name = i === 0 ? template.baseName : `${template.baseName} - ${variationName}`;

      // Realistic price scaling variation (+- 15%)
      const priceVariationFactor = 0.85 + (i * 0.035) % 0.35;
      const calculatedPrice = Math.round((template.price * priceVariationFactor) / 500) * 500;
      const originalPrice = Math.round((calculatedPrice * (1.12 + ((i % 5) * 0.04))) / 500) * 500;

      // Realistic ratings (4.1 to 5.0)
      const rating = Number((4.1 + ((i * 7) % 9) * 0.1).toFixed(1));
      const reviewCount = 12 + ((i * 19) % 280);

      // Generate 2-3 reviews per product
      const productReviews: ProductReview[] = [
        {
          id: `rev-${globalIndex}-1`,
          author: REVIEW_NAMES[(i + globalIndex) % REVIEW_NAMES.length],
          rating: rating >= 4.8 ? 5 : 4,
          date: '2 days ago',
          comment: REVIEW_COMMENTS[(i + globalIndex) % REVIEW_COMMENTS.length],
          verified: true
        },
        {
          id: `rev-${globalIndex}-2`,
          author: REVIEW_NAMES[(i + globalIndex + 3) % REVIEW_NAMES.length],
          rating: 5,
          date: '1 week ago',
          comment: REVIEW_COMMENTS[(i + globalIndex + 2) % REVIEW_COMMENTS.length],
          verified: true
        }
      ];

      const inStock = i % 15 !== 0; // ~93% in stock
      const stockCount = inStock ? 5 + ((i * 11) % 45) : 0;

      const product: Product = {
        id: `TST-${sub.prefix}-${String(i + 1).padStart(3, '0')}`,
        name,
        slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
        description: template.desc,
        category: sub.category,
        subcategory: sub.name,
        brand: template.brand,
        price: calculatedPrice,
        originalPrice,
        rating,
        reviewCount,
        inStock,
        stockCount,
        image: primaryImage,
        gallery: [primaryImage, secondaryImage, tertiaryImage],
        tags: [...template.tags, sub.category, sub.name],
        specs: {
          ...template.specs,
          Condition: 'Brand New (Sealed)',
          Authenticity: '100% Genuine Guaranteed',
          Dispatch: 'Within 24 Hours in Lagos/Abuja'
        },
        featured: i % 7 === 0,
        isNewArrival: i % 4 === 0,
        isBestSeller: i % 6 === 0,
        reviews: productReviews
      };

      catalog.push(product);
      globalIndex++;
    }
  }

  return catalog;
}

export const ALL_PRODUCTS: Product[] = generateFullCatalog();

// Currency formatter utility for Nigerian Naira
export function formatNaira(amount: number): string {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    maximumFractionDigits: 0
  }).format(amount).replace('NGN', '₦');
}
