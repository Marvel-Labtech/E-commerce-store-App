import React from 'react';
import { Logo } from './Logo';
import { STORE_BANK_DETAILS, CATEGORIES_DATA } from '../data/categories';
import { Building2, MessageCircle, Mail, MapPin, ShieldCheck, Heart } from 'lucide-react';

interface FooterProps {
  onCategorySelect: (categoryName: string) => void;
  onOpenMerchantDesk?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onCategorySelect, onOpenMerchantDesk }) => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          {/* Brand & Overview */}
          <div className="lg:col-span-2 space-y-4">
            <Logo size="md" showTagline className="text-white" />
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Testimony Store is Nigeria's premier curated online marketplace featuring over 500+ authentic tech devices, luxury African and designer fashion, smart home innovations, clinical skincare, and gourmet food provisions.
            </p>

            {/* Official Moniepoint Bank Details Box */}
            <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 max-w-sm space-y-1.5 text-xs">
              <div className="flex items-center gap-2 text-amber-400 font-bold">
                <Building2 className="w-4 h-4" />
                <span>Official Store Bank Details</span>
              </div>
              <p className="text-slate-300">
                Bank: <strong className="text-white">{STORE_BANK_DETAILS.bankName}</strong>
              </p>
              <p className="text-slate-300">
                Account Number: <strong className="text-amber-300 font-mono text-sm tracking-wider">{STORE_BANK_DETAILS.accountNumber}</strong>
              </p>
              <p className="text-slate-300">
                Account Name: <strong className="text-white">{STORE_BANK_DETAILS.accountName}</strong>
              </p>
            </div>
          </div>

          {/* Quick Categories */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Catalog Categories
            </h4>
            <ul className="space-y-2.5 text-xs">
              {CATEGORIES_DATA.map((cat) => (
                <li key={cat.id}>
                  <button
                    onClick={() => {
                      onCategorySelect(cat.name);
                      window.scrollTo({ top: 500, behavior: 'smooth' });
                    }}
                    className="hover:text-white transition-colors text-slate-400 text-left"
                  >
                    {cat.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service & Support */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Assistance & Orders
            </h4>
            <ul className="space-y-3 text-xs text-slate-400">
              <li className="flex items-start gap-2">
                <MessageCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <a
                  href={`https://wa.me/${STORE_BANK_DETAILS.whatsappNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-400 transition-colors"
                >
                  WhatsApp: {STORE_BANK_DETAILS.formattedWhatsApp}
                </a>
              </li>
              <li className="flex items-start gap-2">
                <Mail className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                <span>{STORE_BANK_DETAILS.supportEmail}</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span>Dispatch Hubs: Victoria Island, Lagos & Garki 2, Abuja</span>
              </li>
            </ul>
          </div>

          {/* Verification Guarantee */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Trust & Security
            </h4>
            <div className="space-y-3 text-xs text-slate-400">
              <div className="flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                <span>Moniepoint direct merchant transfer guarantees zero card fraud.</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/60 text-[11px] text-slate-300">
                Operating Hours: Monday – Saturday (8:00 AM – 8:00 PM WAT).
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Testimony Store. All rights reserved.</p>
          <div className="flex items-center gap-6">
            {onOpenMerchantDesk && (
              <button
                onClick={onOpenMerchantDesk}
                className="text-amber-400 hover:text-amber-300 font-semibold transition-colors"
              >
                Merchant Order Desk (Received Orders)
              </button>
            )}
            <span>Direct Bank Transfer Powered by Moniepoint Microfinance Bank</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
