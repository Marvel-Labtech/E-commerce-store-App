import React, { useState } from 'react';
import { CustomerShippingInfo, Order } from '../types';
import { useCart } from '../context/CartContext';
import { useOrders } from '../context/OrderContext';
import { STORE_BANK_DETAILS } from '../data/categories';
import { formatNaira } from '../data/products';
import { simulateSendOwnerEmailNotification } from './MerchantOrderDesk';
import {
  X,
  Copy,
  Check,
  UploadCloud,
  FileCheck,
  ShieldCheck,
  Building2,
  ArrowRight,
  ArrowLeft,
  MessageCircle,
  AlertCircle,
  Truck,
  CheckCircle2,
} from 'lucide-react';
import { useToast } from '../context/ToastContext';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOrderComplete: (order: Order) => void;
}

const NIGERIAN_STATES = [
  'Lagos',
  'Abuja (FCT)',
  'Rivers',
  'Ogun',
  'Oyo',
  'Kano',
  'Kaduna',
  'Edo',
  'Delta',
  'Enugu',
  'Anambra',
  'Abia',
  'Akwa Ibom',
  'Bayelsa',
  'Benue',
  'Borno',
  'Cross River',
  'Ebonyi',
  'Ekiti',
  'Gombe',
  'Imo',
  'Jigawa',
  'Katsina',
  'Kebbi',
  'Kogi',
  'Kwara',
  'Nasarawa',
  'Niger',
  'Ondo',
  'Osun',
  'Plateau',
  'Sokoto',
  'Taraba',
  'Yobe',
  'Zamfara',
];

export const CheckoutModal: React.FC<CheckoutModalProps> = ({ isOpen, onClose, onOrderComplete }) => {
  const { cart, subtotal, discountAmount, shippingFee, total, clearCart } = useCart();
  const { addOrder, merchantSettings } = useOrders();
  const { showToast } = useToast();

  const [step, setStep] = useState<'shipping' | 'payment'>('shipping');

  // Customer shipping info
  const [shipping, setShipping] = useState<CustomerShippingInfo>({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: 'Lagos',
    notes: '',
  });

  // Payment verification state
  const [copiedAccount, setCopiedAccount] = useState(false);
  const [reference, setReference] = useState('');
  const [receiptPreview, setReceiptPreview] = useState<string | null>(null);
  const [receiptFileName, setReceiptFileName] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleCopyAccountNumber = () => {
    navigator.clipboard.writeText(STORE_BANK_DETAILS.accountNumber);
    setCopiedAccount(true);
    showToast('Moniepoint Account Number (8132230017) copied to clipboard!', 'success');
    setTimeout(() => setCopiedAccount(false), 3000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        showToast('Receipt file size must be under 5MB', 'error');
        return;
      }
      setReceiptFileName(file.name);
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        setReceiptPreview(uploadEvent.target?.result as string);
        showToast('Receipt image attached successfully', 'success');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!shipping.fullName || !shipping.email || !shipping.phone || !shipping.address || !shipping.city) {
      showToast('Please fill in all required shipping fields', 'error');
      return;
    }
    setStep('payment');
  };

  const handleConfirmTransfer = () => {
    if (!reference.trim() && !receiptPreview) {
      showToast('Please provide a transaction reference or upload receipt proof', 'error');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const orderId = `TST-2026-${Math.floor(10000 + Math.random() * 90000)}`;
      const newOrder: Order = {
        id: orderId,
        createdAt: new Date().toISOString(),
        items: [...cart],
        subtotal,
        discount: discountAmount,
        shippingFee,
        total,
        customer: shipping,
        paymentDetails: {
          bankName: STORE_BANK_DETAILS.bankName,
          accountNumber: STORE_BANK_DETAILS.accountNumber,
          accountName: STORE_BANK_DETAILS.accountName,
          reference: reference.trim() || `REF-${Date.now().toString().slice(-6)}`,
          receiptImageName: receiptFileName || undefined,
          receiptImageData: receiptPreview || undefined,
          transferDate: new Date().toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          }),
        },
        status: 'payment_submitted',
      };

      clearCart();
      setIsSubmitting(false);
      addOrder(newOrder);
      // Simulate sending order notification email to store owner's registered email
      simulateSendOwnerEmailNotification(newOrder, merchantSettings.receivingEmail).catch(console.error);
      onOrderComplete(newOrder);
      showToast(`Order received & email notification dispatched to ${merchantSettings.receivingEmail}!`, 'success');
    }, 800);
  };

  // WhatsApp order builder
  const handleWhatsAppDirectOrder = () => {
    const itemList = cart
      .map((item, idx) => `${idx + 1}. ${item.product.name} (Qty: ${item.quantity}) - ${formatNaira(item.product.price * item.quantity)}`)
      .join('\n');

    const message =
      `🛍️ *NEW TESTIMONY STORE ORDER*\n` +
      `━━━━━━━━━━━━━━━━━━━━\n` +
      `*Customer:* ${shipping.fullName || 'Customer'}\n` +
      `*Phone:* ${shipping.phone || 'N/A'}\n` +
      `*Address:* ${shipping.address}, ${shipping.city}, ${shipping.state}\n` +
      `━━━━━━━━━━━━━━━━━━━━\n` +
      `*Items Ordered:*\n${itemList}\n` +
      `━━━━━━━━━━━━━━━━━━━━\n` +
      `*Subtotal:* ${formatNaira(subtotal)}\n` +
      (discountAmount > 0 ? `*Discount:* -${formatNaira(discountAmount)}\n` : '') +
      `*Delivery:* ${shippingFee === 0 ? 'FREE' : formatNaira(shippingFee)}\n` +
      `*TOTAL TO PAY:* ${formatNaira(total)}\n` +
      `━━━━━━━━━━━━━━━━━━━━\n` +
      `*Payment Method:* Moniepoint Bank Transfer\n` +
      `*Bank:* Moniepoint Microfinance Bank\n` +
      `*Account:* 8132230017 (Gideon John Mayowa)\n` +
      (reference ? `*Transfer Ref:* ${reference}\n` : '') +
      `Please confirm receipt and dispatch. Thank you!`;

    const url = `https://wa.me/${STORE_BANK_DETAILS.whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm transition-opacity" onClick={onClose} />

      {/* Modal Container */}
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl z-10 overflow-hidden my-auto max-h-[92vh] flex flex-col border border-slate-100">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                {step === 'shipping' ? 'Step 1 of 2' : 'Step 2 of 2'}
              </span>
              <span aria-hidden="true" className="text-slate-300">·</span>
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                {step === 'shipping' ? 'Shipping Details' : 'Moniepoint Direct Bank Transfer'}
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {step === 'shipping'
                ? 'Enter the destination address for swift nationwide dispatch'
                : 'Transfer order amount directly to our official Moniepoint account'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {step === 'shipping' ? (
            /* STEP 1: Shipping Information Form */
            <form id="shipping-form" onSubmit={handleShippingSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Full Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Babatunde Adeleke"
                    value={shipping.fullName}
                    onChange={(e) => setShipping({ ...shipping, fullName: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-600 focus:outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Phone Number (WhatsApp Ready) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 08012345678 or +234..."
                    value={shipping.phone}
                    onChange={(e) => setShipping({ ...shipping, phone: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-600 focus:outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email Address <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. yourname@example.com"
                  value={shipping.email}
                  onChange={(e) => setShipping({ ...shipping, email: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-600 focus:outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Street Address & Landmark <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="e.g. Flat 4B, Admiralty Way, Lekki Phase 1, Opposite Ebeano Supermarket"
                  value={shipping.address}
                  onChange={(e) => setShipping({ ...shipping, address: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-600 focus:outline-none transition-all"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    City / Town <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Lekki / Ikeja / Garki"
                    value={shipping.city}
                    onChange={(e) => setShipping({ ...shipping, city: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-600 focus:outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    State <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={shipping.state}
                    onChange={(e) => setShipping({ ...shipping, state: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-600 focus:outline-none transition-all"
                  >
                    {NIGERIAN_STATES.map((st) => (
                      <option key={st} value={st}>
                        {st} State
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Delivery Notes / Gate Code (Optional)
                </label>
                <input
                  type="text"
                  placeholder="Special instructions for the dispatch rider"
                  value={shipping.notes}
                  onChange={(e) => setShipping({ ...shipping, notes: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-600 focus:outline-none transition-all"
                />
              </div>

              {/* Order quick summary box */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-1.5 mt-4">
                <div className="flex justify-between text-slate-600">
                  <span>Items Total ({cart.length} unique)</span>
                  <span className="font-mono">{formatNaira(subtotal)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-600">
                    <span>Coupon Discount</span>
                    <span className="font-mono">-{formatNaira(discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-600">
                  <span>Nationwide Shipping</span>
                  <span className="font-mono">{shippingFee === 0 ? 'FREE' : formatNaira(shippingFee)}</span>
                </div>
                <div className="flex justify-between font-bold text-slate-900 pt-2 border-t border-slate-200 text-sm">
                  <span>Grand Total to Pay</span>
                  <span className="font-mono text-indigo-700 text-base">{formatNaira(total)}</span>
                </div>
              </div>
            </form>
          ) : (
            /* STEP 2: Dedicated Payment Modal - Moniepoint Direct Bank Transfer */
            <div className="space-y-6">
              {/* Payment Alert Banner */}
              <div className="bg-indigo-900 text-white rounded-2xl p-5 shadow-lg relative overflow-hidden">
                <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-indigo-500/20 rounded-full blur-xl pointer-events-none" />
                
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-amber-400" />
                    <span className="text-xs uppercase font-bold tracking-wider text-indigo-200">
                      Exclusive Payment Method
                    </span>
                  </div>
                  <span className="text-xs font-mono font-bold px-2 py-0.5 bg-emerald-500/20 text-emerald-300 rounded border border-emerald-500/30">
                    Instant Credit
                  </span>
                </div>

                <div className="space-y-3">
                  <div>
                    <span className="text-xs text-indigo-200">Amount Due:</span>
                    <div className="text-2xl sm:text-3xl font-extrabold font-mono text-white tracking-tight">
                      {formatNaira(total)}
                    </div>
                  </div>

                  {/* Bank Details Card */}
                  <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/15 space-y-2.5">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-indigo-200">Bank Name</span>
                      <strong className="text-white font-medium">{STORE_BANK_DETAILS.bankName}</strong>
                    </div>

                    <div className="flex justify-between items-center text-xs">
                      <span className="text-indigo-200">Account Name</span>
                      <strong className="text-white font-medium">{STORE_BANK_DETAILS.accountName}</strong>
                    </div>

                    <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                      <div>
                        <span className="text-[11px] text-indigo-300 uppercase tracking-wider block">
                          Account Number
                        </span>
                        <span className="text-xl sm:text-2xl font-mono font-black text-amber-300 tracking-wider">
                          {STORE_BANK_DETAILS.accountNumber}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={handleCopyAccountNumber}
                        className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all shadow-sm ${
                          copiedAccount
                            ? 'bg-emerald-500 text-white'
                            : 'bg-white text-indigo-950 hover:bg-amber-400 active:scale-95'
                        }`}
                      >
                        {copiedAccount ? (
                          <>
                            <Check className="w-4 h-4" />
                            <span>Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4" />
                            <span>Copy Number</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Instructions */}
              <div className="text-xs text-slate-600 space-y-1.5 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <p className="font-semibold text-slate-800">Transfer Instructions:</p>
                <ol className="list-decimal pl-4 space-y-1">
                  <li>Open your banking app or USSD (*737#, *894#, *901#, etc.).</li>
                  <li>Transfer exactly <strong>{formatNaira(total)}</strong> to <strong>Moniepoint</strong> account <strong>8132230017</strong>.</li>
                  <li>Enter the transaction reference below OR attach your payment screenshot.</li>
                </ol>
              </div>

              {/* Payment Verification Section */}
              <div className="space-y-4 pt-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                  Payment Verification Details
                </h3>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Bank Transfer Session ID / Transaction Reference
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 10000424092912401800049281928"
                    value={reference}
                    onChange={(e) => setReference(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-mono focus:bg-white focus:ring-2 focus:ring-indigo-600 focus:outline-none"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">
                    Copy the reference number from your bank debit alert or transfer receipt.
                  </p>
                </div>

                {/* Dropzone for Receipt Upload */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Attach Transfer Receipt Screenshot (Optional but recommended)
                  </label>
                  <label className="relative flex flex-col items-center justify-center p-4 border-2 border-dashed border-slate-300 hover:border-indigo-500 rounded-2xl bg-slate-50 hover:bg-indigo-50/30 transition-all cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                    {receiptPreview ? (
                      <div className="flex items-center gap-3 w-full">
                        <img
                          src={receiptPreview}
                          alt="Receipt Preview"
                          className="w-14 h-14 object-cover rounded-lg border border-slate-300"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-slate-900 truncate">
                            {receiptFileName || 'Receipt Image'}
                          </p>
                          <p className="text-[11px] text-emerald-600 flex items-center gap-1 font-medium">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Attached ready for confirmation
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            setReceiptPreview(null);
                            setReceiptFileName(null);
                          }}
                          className="text-xs text-rose-500 hover:text-rose-700 font-medium px-2 py-1"
                        >
                          Remove
                        </button>
                      </div>
                    ) : (
                      <div className="text-center">
                        <UploadCloud className="w-8 h-8 text-indigo-500 mx-auto mb-1.5" />
                        <p className="text-xs font-semibold text-slate-800">
                          Click to upload bank transfer proof
                        </p>
                        <p className="text-[11px] text-slate-400">PNG, JPG or JPEG up to 5MB</p>
                      </div>
                    )}
                  </label>
                </div>

                {/* WhatsApp Direct Order Alternative Button */}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleWhatsAppDirectOrder}
                    className="w-full py-2.5 px-4 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-800 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
                  >
                    <MessageCircle className="w-4 h-4 text-emerald-600" />
                    <span>Send Order & Receipt on WhatsApp directly to Gideon</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="p-4 sm:p-5 border-t border-slate-100 bg-slate-50 flex items-center justify-between gap-3">
          {step === 'shipping' ? (
            <>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="shipping-form"
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/20 flex items-center gap-2 transition-all"
              >
                <span>Continue to Moniepoint Payment</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => setStep('shipping')}
                className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Shipping</span>
              </button>

              <button
                type="button"
                onClick={handleConfirmTransfer}
                disabled={isSubmitting}
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/20 flex items-center gap-2 transition-all disabled:opacity-70"
              >
                {isSubmitting ? (
                  <span>Verifying Payment...</span>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Confirm Transfer & Generate Invoice</span>
                  </>
                )}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
