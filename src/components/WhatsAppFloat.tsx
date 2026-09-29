import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { STORE_BANK_DETAILS } from '../data/categories';

interface WhatsAppFloatProps {
  customMessage?: string;
}

export const WhatsAppFloat: React.FC<WhatsAppFloatProps> = ({ customMessage }) => {
  const [isOpen, setIsOpen] = useState(false);

  const defaultMsg = encodeURIComponent(
    customMessage ||
      `Hello Gideon, I am browsing Testimony Store and would like to ask about product availability and ordering.`
  );

  const whatsappUrl = `https://wa.me/${STORE_BANK_DETAILS.whatsappNumber}?text=${defaultMsg}`;

  return (
    <div className="fixed bottom-6 left-6 z-40 flex flex-col items-start font-sans">
      {isOpen && (
        <div className="mb-3 w-72 bg-white rounded-2xl shadow-2xl border border-slate-200 p-4 transition-all duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center text-white font-bold text-xs">
                GJ
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900 leading-tight">Gideon John Mayowa</p>
                <p className="text-[11px] text-emerald-600 font-medium">● Online · Direct Support</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              aria-label="Close WhatsApp chat card"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <p className="text-xs text-slate-600 my-3 leading-relaxed">
            Need help with an item or want to place/verify your Moniepoint bank transfer order via WhatsApp?
          </p>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-md shadow-emerald-600/20 transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Chat on WhatsApp</span>
          </a>
        </div>
      )}

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2.5 px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full shadow-lg shadow-emerald-600/30 transition-all hover:scale-105 active:scale-95 group"
        aria-label="Contact Testimony Store on WhatsApp"
      >
        <MessageCircle className="w-5 h-5 group-hover:rotate-12 transition-transform" />
        <span className="text-xs font-bold hidden sm:inline">WhatsApp Order</span>
      </button>
    </div>
  );
};
