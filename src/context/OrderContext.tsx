import React, { createContext, useContext, useState, useEffect } from 'react';
import { Order } from '../types';
import { STORE_BANK_DETAILS } from '../data/categories';

interface MerchantSettings {
  receivingWhatsApp: string;
  receivingEmail: string;
  storeOwnerName: string;
  soundAlertsEnabled: boolean;
  autoForwardWhatsApp: boolean;
}

interface OrderContextType {
  orders: Order[];
  addOrder: (order: Order) => void;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  deleteOrder: (orderId: string) => void;
  clearAllOrders: () => void;
  merchantSettings: MerchantSettings;
  updateMerchantSettings: (settings: Partial<MerchantSettings>) => void;
  pendingVerificationCount: number;
  totalRevenue: number;
  selectedOrderForDetail: Order | null;
  setSelectedOrderForDetail: (order: Order | null) => void;
  triggerSampleOrder: () => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

const ORDERS_STORAGE_KEY = 'testimony_store_orders_v2';
const SETTINGS_STORAGE_KEY = 'testimony_store_merchant_settings_v2';

const INITIAL_SAMPLE_ORDERS: Order[] = [
  {
    id: 'TST-2026-88412',
    createdAt: new Date(Date.now() - 1000 * 60 * 35).toISOString(), // 35 mins ago
    items: [
      {
        product: {
          id: 'TST-TECH-PHN-001',
          name: 'Pro Max Titanium 5G (256GB)',
          slug: 'pro-max-titanium-5g-256gb',
          description: 'Aerospace-grade titanium chassis, Action Button, 48MP main camera.',
          category: 'Tech & Electronics',
          subcategory: 'Smartphones & Accessories',
          brand: 'Apple',
          price: 1650000,
          rating: 4.9,
          reviewCount: 142,
          inStock: true,
          stockCount: 12,
          image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=700&q=80',
          gallery: ['https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=700&q=80'],
          tags: ['Flagship', 'iOS'],
          specs: { Condition: 'Brand New', Warranty: '1 Year' },
          reviews: [],
        },
        quantity: 1,
      },
      {
        product: {
          id: 'TST-TECH-AUD-001',
          name: 'WH-1000XM5 Wireless Noise-Canceling',
          slug: 'wh-1000xm5-wireless-noise-canceling',
          description: 'Industry-leading noise cancellation with 8 microphones.',
          category: 'Tech & Electronics',
          subcategory: 'Audio & Headphones',
          brand: 'Sony',
          price: 460000,
          rating: 4.8,
          reviewCount: 94,
          inStock: true,
          stockCount: 8,
          image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=700&q=80',
          gallery: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=700&q=80'],
          tags: ['ANC', 'Audio'],
          specs: { Battery: '30 Hours' },
          reviews: [],
        },
        quantity: 1,
      },
    ],
    subtotal: 2110000,
    discount: 0,
    shippingFee: 0,
    total: 2110000,
    customer: {
      fullName: 'Chief Babatunde Adeleke',
      email: 'babatunde.adeleke@gmail.com',
      phone: '+234 803 445 1982',
      address: 'Plot 14B, Admiralty Way, Lekki Phase 1',
      city: 'Lekki / Eti-Osa',
      state: 'Lagos',
      notes: 'Call before arriving. Ring gate buzzer 4B.',
    },
    paymentDetails: {
      bankName: STORE_BANK_DETAILS.bankName,
      accountNumber: STORE_BANK_DETAILS.accountNumber,
      accountName: STORE_BANK_DETAILS.accountName,
      reference: 'MNP-2026-99182740192',
      receiptImageName: 'moniepoint_transfer_receipt_adeleke.png',
      transferDate: 'Today, 35 mins ago',
    },
    status: 'payment_submitted',
  },
  {
    id: 'TST-2026-76194',
    createdAt: new Date(Date.now() - 1000 * 60 * 180).toISOString(), // 3 hours ago
    items: [
      {
        product: {
          id: 'TST-FASH-MEN-001',
          name: 'Bespoke Senator Kaftan 2-Piece Suit',
          slug: 'bespoke-senator-kaftan-2-piece-suit',
          description: 'Impeccably tailored modern African luxury senator suit.',
          category: 'Fashion & Apparel',
          subcategory: "Men's Wear",
          brand: 'Testimony Atelier',
          price: 85000,
          rating: 4.8,
          reviewCount: 52,
          inStock: true,
          stockCount: 15,
          image: 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=700&q=80',
          gallery: ['https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=700&q=80'],
          tags: ['Native Wear', 'Senator'],
          specs: { Fabric: '100% Cashmere' },
          reviews: [],
        },
        quantity: 2,
      },
    ],
    subtotal: 170000,
    discount: 17000,
    shippingFee: 0,
    total: 153000,
    customer: {
      fullName: 'Dr. Chidinma Okoye',
      email: 'chidinma.okoye@unilag.edu.ng',
      phone: '+234 812 770 9410',
      address: 'House 8, 4th Avenue, Gwarinpa Estate',
      city: 'Gwarinpa',
      state: 'Abuja (FCT)',
      notes: 'Deliver to security house if I am in surgery.',
    },
    paymentDetails: {
      bankName: STORE_BANK_DETAILS.bankName,
      accountNumber: STORE_BANK_DETAILS.accountNumber,
      accountName: STORE_BANK_DETAILS.accountName,
      reference: 'MNP-2026-38291048291',
      receiptImageName: 'receipt_transfer_proof.jpeg',
      transferDate: 'Today, 3 hours ago',
    },
    status: 'verified',
  },
];

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const stored = localStorage.getItem(ORDERS_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
      return INITIAL_SAMPLE_ORDERS;
    } catch {
      return INITIAL_SAMPLE_ORDERS;
    }
  });

  const [merchantSettings, setMerchantSettings] = useState<MerchantSettings>(() => {
    try {
      const stored = localStorage.getItem(SETTINGS_STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch {
      // fallback
    }
    return {
      receivingWhatsApp: STORE_BANK_DETAILS.whatsappNumber,
      receivingEmail: 'marvelousadesola1@gmail.com',
      storeOwnerName: 'Gideon John Mayowa',
      soundAlertsEnabled: true,
      autoForwardWhatsApp: true,
    };
  });

  const [selectedOrderForDetail, setSelectedOrderForDetail] = useState<Order | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
    } catch (e) {
      console.error('Failed to save orders to localStorage', e);
    }
  }, [orders]);

  useEffect(() => {
    try {
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(merchantSettings));
    } catch (e) {
      console.error('Failed to save merchant settings', e);
    }
  }, [merchantSettings]);

  const addOrder = (order: Order) => {
    setOrders((prev) => [order, ...prev]);
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status } : o))
    );
    if (selectedOrderForDetail && selectedOrderForDetail.id === orderId) {
      setSelectedOrderForDetail((prev) => (prev ? { ...prev, status } : null));
    }
  };

  const deleteOrder = (orderId: string) => {
    setOrders((prev) => prev.filter((o) => o.id !== orderId));
    if (selectedOrderForDetail?.id === orderId) {
      setSelectedOrderForDetail(null);
    }
  };

  const clearAllOrders = () => {
    setOrders([]);
    setSelectedOrderForDetail(null);
  };

  const updateMerchantSettings = (newSettings: Partial<MerchantSettings>) => {
    setMerchantSettings((prev) => ({ ...prev, ...newSettings }));
  };

  // Helper to trigger a realistic incoming test order for testing
  const triggerSampleOrder = () => {
    const mockNames = ['Engr. Femi Adelekan', 'Hauwa Abubakar', 'Emeka Kalu', 'Titi Omotosho'];
    const mockStates = ['Lagos', 'Abuja (FCT)', 'Rivers', 'Oyo'];
    const randomName = mockNames[Math.floor(Math.random() * mockNames.length)];
    const randomState = mockStates[Math.floor(Math.random() * mockStates.length)];
    const newId = `TST-2026-${Math.floor(10000 + Math.random() * 90000)}`;

    const testOrder: Order = {
      id: newId,
      createdAt: new Date().toISOString(),
      items: [INITIAL_SAMPLE_ORDERS[0].items[0]],
      subtotal: 1650000,
      discount: 0,
      shippingFee: 0,
      total: 1650000,
      customer: {
        fullName: randomName,
        email: `${randomName.toLowerCase().replace(/[^a-z]/g, '')}@gmail.com`,
        phone: '+234 808 223 9911',
        address: '15 Crescent Way, Victoria Island',
        city: 'Victoria Island',
        state: randomState,
        notes: 'Priority dispatch requested via WhatsApp.',
      },
      paymentDetails: {
        bankName: STORE_BANK_DETAILS.bankName,
        accountNumber: STORE_BANK_DETAILS.accountNumber,
        accountName: STORE_BANK_DETAILS.accountName,
        reference: `MNP-SESSION-${Date.now().toString().slice(-8)}`,
        receiptImageName: 'sample_moniepoint_slip.png',
        transferDate: 'Just now',
      },
      status: 'payment_submitted',
    };

    addOrder(testOrder);
  };

  const pendingVerificationCount = orders.filter((o) => o.status === 'payment_submitted').length;
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);

  return (
    <OrderContext.Provider
      value={{
        orders,
        addOrder,
        updateOrderStatus,
        deleteOrder,
        clearAllOrders,
        merchantSettings,
        updateMerchantSettings,
        pendingVerificationCount,
        totalRevenue,
        selectedOrderForDetail,
        setSelectedOrderForDetail,
        triggerSampleOrder,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export function useOrders() {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
}
