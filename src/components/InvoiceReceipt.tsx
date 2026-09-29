import React from 'react';
import { Order } from '../types';
import { formatNaira } from '../data/products';
import { Logo } from './Logo';
import { STORE_BANK_DETAILS } from '../data/categories';
import {
  Printer,
  CheckCircle2,
  X,
  MessageCircle,
  Building2,
  Calendar,
  Clock,
  MapPin,
  Phone,
  User,
  ShieldCheck,
  Download,
} from 'lucide-react';
import { useToast } from '../context/ToastContext';

interface InvoiceReceiptProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenMerchantDesk?: () => void;
}

export const InvoiceReceipt: React.FC<InvoiceReceiptProps> = ({ order, isOpen, onClose, onOpenMerchantDesk }) => {
  const { showToast } = useToast();

  if (!isOpen || !order) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleWhatsAppSendReceipt = () => {
    const itemList = order.items
      .map(
        (item, idx) =>
          `${idx + 1}. ${item.product.name} (Qty: ${item.quantity}) - ${formatNaira(
            item.product.price * item.quantity
          )}`
      )
      .join('\n');

    const message =
      `📄 *TESTIMONY STORE OFFICIAL ORDER INVOICE*\n` +
      `*Invoice ID:* ${order.id}\n` +
      `*Date:* ${order.paymentDetails.transferDate}\n` +
      `━━━━━━━━━━━━━━━━━━━━\n` +
      `*Customer:* ${order.customer.fullName}\n` +
      `*Phone:* ${order.customer.phone}\n` +
      `*Address:* ${order.customer.address}, ${order.customer.city}, ${order.customer.state}\n` +
      `━━━━━━━━━━━━━━━━━━━━\n` +
      `*Itemized Products:*\n${itemList}\n` +
      `━━━━━━━━━━━━━━━━━━━━\n` +
      `*Total Paid:* ${formatNaira(order.total)}\n` +
      `*Payment Method:* Moniepoint Direct Bank Transfer\n` +
      `*Transfer Reference:* ${order.paymentDetails.reference}\n` +
      `━━━━━━━━━━━━━━━━━━━━\n` +
      `Hello Gideon, I have completed the transfer. Here is my order confirmation!`;

    const url = `https://wa.me/${STORE_BANK_DETAILS.whatsappNumber}?text=${encodeURIComponent(
      message
    )}`;
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm transition-opacity no-print"
        onClick={onClose}
      />

      {/* Invoice Container */}
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl z-10 overflow-hidden my-auto max-h-[94vh] flex flex-col border border-slate-200">
        {/* Modal Top Bar (hidden on print) */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50 no-print">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <h2 className="text-sm sm:text-base font-bold text-slate-900">
              Order Receipt & Invoice
            </h2>
            <span className="font-mono text-xs text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-md font-semibold">
              {order.id}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
              title="Print Receipt"
            >
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline">Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Receipt Paper */}
        <div id="printable-receipt" className="flex-1 overflow-y-auto p-6 sm:p-8 bg-white space-y-6 text-slate-800">
          {/* Top Brand & Status Section */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pb-6 border-b border-slate-200">
            <div>
              <Logo size="md" showTagline />
              <p className="text-xs text-slate-500 mt-2">
                Premier Lifestyle, Tech & Luxury Essentials
              </p>
              <p className="text-xs text-slate-500">
                Lagos & Abuja, Nigeria · Support: {STORE_BANK_DETAILS.formattedWhatsApp}
              </p>
            </div>

            <div className="sm:text-right">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Transfer Submitted
              </span>
              <div className="text-xs text-slate-500 font-mono mt-1">
                Date: {order.paymentDetails.transferDate}
              </div>
              <div className="text-xs font-semibold text-slate-700 font-mono">
                Invoice No: {order.id}
              </div>
            </div>
          </div>

          {/* Customer & Shipping Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 text-xs">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                Delivering To
              </p>
              <p className="font-bold text-slate-900 text-sm">{order.customer.fullName}</p>
              <p className="text-slate-600 mt-0.5">{order.customer.phone}</p>
              <p className="text-slate-600">{order.customer.email}</p>
              <p className="text-slate-700 mt-1 font-medium">
                {order.customer.address}, {order.customer.city}, {order.customer.state} State
              </p>
              {order.customer.notes && (
                <p className="text-slate-500 italic mt-1 text-[11px]">Note: {order.customer.notes}</p>
              )}
            </div>

            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                Moniepoint Payment Details
              </p>
              <p className="font-semibold text-slate-900">{STORE_BANK_DETAILS.bankName}</p>
              <p className="text-slate-700">
                Account Number: <strong className="font-mono text-indigo-700">{STORE_BANK_DETAILS.accountNumber}</strong>
              </p>
              <p className="text-slate-700">Account Name: <strong>{STORE_BANK_DETAILS.accountName}</strong></p>
              <p className="text-slate-600 mt-1">
                Transfer Reference: <span className="font-mono font-semibold text-slate-900">{order.paymentDetails.reference}</span>
              </p>
              {order.paymentDetails.receiptImageName && (
                <p className="text-emerald-700 font-medium text-[11px] mt-0.5">
                  ✓ Receipt Attached ({order.paymentDetails.receiptImageName})
                </p>
              )}
            </div>
          </div>

          {/* Itemized Table */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">
              Itemized Order Summary
            </h3>
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 border-b border-slate-200">
                    <th className="py-2.5 px-3 font-semibold">Item</th>
                    <th className="py-2.5 px-3 font-semibold text-center">Qty</th>
                    <th className="py-2.5 px-3 font-semibold text-right">Unit Price</th>
                    <th className="py-2.5 px-3 font-semibold text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {order.items.map((item, idx) => (
                    <tr key={`${item.product.id}-${idx}`} className="hover:bg-slate-50/50">
                      <td className="py-2.5 px-3 font-medium text-slate-900">
                        <div>{item.product.name}</div>
                        <div className="text-[11px] text-slate-500">{item.product.brand} · {item.product.subcategory}</div>
                      </td>
                      <td className="py-2.5 px-3 text-center font-mono tabular-nums text-slate-700">
                        {item.quantity}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono tabular-nums text-slate-600">
                        {formatNaira(item.product.price)}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono tabular-nums font-semibold text-slate-900">
                        {formatNaira(item.product.price * item.quantity)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Financial Totals */}
          <div className="flex justify-end">
            <div className="w-full sm:w-64 space-y-1.5 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-mono tabular-nums text-slate-900">{formatNaira(order.subtotal)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-emerald-600">
                  <span>Discount</span>
                  <span className="font-mono tabular-nums">-{formatNaira(order.discount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Shipping Fee</span>
                <span className="font-mono tabular-nums">
                  {order.shippingFee === 0 ? 'FREE' : formatNaira(order.shippingFee)}
                </span>
              </div>
              <div className="flex justify-between text-base font-bold text-slate-900 pt-2 border-t border-slate-200">
                <span>Total Paid</span>
                <span className="font-mono text-indigo-700 tabular-nums">
                  {formatNaira(order.total)}
                </span>
              </div>
            </div>
          </div>

          {/* Footer Bank Instructions & Warranty */}
          <div className="pt-4 border-t border-slate-200 text-[11px] text-slate-500 space-y-1">
            <p className="font-semibold text-slate-700">Thank you for shopping at Testimony Store!</p>
            <p>
              Your payment is verified automatically with our Moniepoint merchant gateway. Nationwide dispatch will be initiated within 24 hours. Keep this invoice for warranty and parcel tracking.
            </p>
          </div>
        </div>

        {/* Modal Bottom Actions (hidden on print) */}
        <div className="p-4 sm:p-5 border-t border-slate-100 bg-slate-50 flex flex-col sm:flex-row items-center justify-between gap-3 no-print">
          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            <button
              onClick={handleWhatsAppSendReceipt}
              className="flex-1 sm:flex-initial px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Confirm on WhatsApp</span>
            </button>

            {onOpenMerchantDesk && (
              <button
                onClick={() => {
                  onClose();
                  onOpenMerchantDesk();
                }}
                className="flex-1 sm:flex-initial px-4 py-2.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all"
              >
                <span>View in Merchant Desk</span>
              </button>
            )}
          </div>

          <button
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
};
