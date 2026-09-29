import React, { useState } from 'react';
import { useOrders } from '../context/OrderContext';
import { Order } from '../types';
import { formatNaira } from '../data/products';
import { STORE_BANK_DETAILS } from '../data/categories';
import { sendOrderNotificationEmail, EmailDispatchResult } from '../services/notificationService';

/**
 * Service function in MerchantOrderDesk to simulate sending an email notification
 * to the store owner's registered email using a template literal format when a new order is confirmed.
 */
export async function simulateSendOwnerEmailNotification(
  order: Order,
  recipientEmail: string = 'marvelousadesola1@gmail.com'
): Promise<EmailDispatchResult> {
  return await sendOrderNotificationEmail(order, recipientEmail);
}
import {
  Inbox,
  CheckCircle2,
  Clock,
  Truck,
  AlertCircle,
  Search,
  ExternalLink,
  MessageCircle,
  Phone,
  Mail,
  Copy,
  Check,
  Printer,
  Trash2,
  Building2,
  Settings,
  Sparkles,
  Download,
  Filter,
  Eye,
  PlusCircle,
  ShieldCheck,
  MapPin,
  X,
} from 'lucide-react';
import { useToast } from '../context/ToastContext';

interface MerchantOrderDeskProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MerchantOrderDesk: React.FC<MerchantOrderDeskProps> = ({ isOpen, onClose }) => {
  const {
    orders,
    updateOrderStatus,
    deleteOrder,
    clearAllOrders,
    merchantSettings,
    updateMerchantSettings,
    pendingVerificationCount,
    totalRevenue,
    triggerSampleOrder,
  } = useOrders();

  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'verified' | 'shipped'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewingReceiptOrder, setViewingReceiptOrder] = useState<Order | null>(null);
  const [inspectingOrder, setInspectingOrder] = useState<Order | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [tempPhone, setTempPhone] = useState(merchantSettings.receivingWhatsApp);
  const [tempEmail, setTempEmail] = useState(merchantSettings.receivingEmail);
  const [copiedRefId, setCopiedRefId] = useState<string | null>(null);
  const [dispatchedEmail, setDispatchedEmail] = useState<EmailDispatchResult | null>(null);
  const [copiedEmailText, setCopiedEmailText] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);

  const handleSimulateEmailNotification = async (order: Order) => {
    setIsSendingEmail(true);
    try {
      const result = await simulateSendOwnerEmailNotification(order, merchantSettings.receivingEmail);
      setDispatchedEmail(result);
      showToast(`Email notification simulated & sent to ${merchantSettings.receivingEmail}`, 'success');
    } catch {
      showToast('Error simulating email dispatch', 'error');
    } finally {
      setIsSendingEmail(false);
    }
  };

  const handleCopyEmailBody = () => {
    if (!dispatchedEmail) return;
    navigator.clipboard.writeText(dispatchedEmail.body);
    setCopiedEmailText(true);
    showToast('Email notification text copied to clipboard!', 'success');
    setTimeout(() => setCopiedEmailText(false), 2500);
  };

  if (!isOpen) return null;

  // Filter orders
  const filteredOrders = orders.filter((order) => {
    // Status tab filter
    if (activeTab === 'pending' && order.status !== 'payment_submitted') return false;
    if (activeTab === 'verified' && order.status !== 'verified') return false;
    if (activeTab === 'shipped' && order.status !== 'shipped') return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchId = order.id.toLowerCase().includes(q);
      const matchName = order.customer.fullName.toLowerCase().includes(q);
      const matchPhone = order.customer.phone.toLowerCase().includes(q);
      const matchRef = order.paymentDetails.reference.toLowerCase().includes(q);
      const matchState = order.customer.state.toLowerCase().includes(q);
      return matchId || matchName || matchPhone || matchRef || matchState;
    }

    return true;
  });

  const handleCopyReference = (ref: string) => {
    navigator.clipboard.writeText(ref);
    setCopiedRefId(ref);
    showToast(`Reference ${ref} copied!`, 'success');
    setTimeout(() => setCopiedRefId(null), 2500);
  };

  const handleCopyAddress = (order: Order) => {
    const fullText = `${order.customer.fullName}, ${order.customer.phone}, ${order.customer.address}, ${order.customer.city}, ${order.customer.state}`;
    navigator.clipboard.writeText(fullText);
    showToast('Customer delivery address copied for rider!', 'success');
  };

  const handleWhatsAppCustomer = (order: Order) => {
    const cleanPhone = order.customer.phone.replace(/[^0-9]/g, '');
    const phoneToUse = cleanPhone.startsWith('0') ? `234${cleanPhone.slice(1)}` : cleanPhone;

    const message =
      `Hello ${order.customer.fullName},\n\n` +
      `This is Gideon from *Testimony Store* regarding your order *${order.id}* (Total: ${formatNaira(
        order.total
      )}).\n\n` +
      (order.status === 'verified'
        ? `✅ Your Moniepoint bank transfer has been *VERIFIED*! We are now packaging your items for dispatch.`
        : order.status === 'shipped'
        ? `🚚 Your order has been *DISPATCHED*! Our dispatch rider will contact you upon arrival at ${order.customer.address}.`
        : `We received your order and are currently verifying your Moniepoint transfer (Ref: ${order.paymentDetails.reference}).`) +
      `\n\nThank you for choosing Testimony Store!`;

    const url = `https://wa.me/${phoneToUse}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateMerchantSettings({
      receivingWhatsApp: tempPhone,
      receivingEmail: tempEmail,
    });
    setIsSettingsOpen(false);
    showToast('Order receiving destination updated successfully!', 'success');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md transition-opacity" onClick={onClose} />

      {/* Main Order Desk Container */}
      <div className="relative w-full max-w-6xl bg-slate-50 rounded-3xl shadow-2xl z-10 overflow-hidden my-auto max-h-[96vh] flex flex-col border border-slate-300 text-slate-900">
        {/* Top Header */}
        <div className="px-6 py-5 bg-slate-900 text-white flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-indigo-600 text-white">
                <Inbox className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-lg font-bold">Merchant Order Receiving Desk</h1>
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
                    Live System Active
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Incoming orders placed by customers are captured here and routed to your WhatsApp & Email.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => {
                triggerSampleOrder();
                showToast('New test order created & received in desk!', 'success');
              }}
              className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors"
              title="Simulate a new incoming customer order"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Simulate Incoming Order</span>
            </button>

            <button
              onClick={() => setIsSettingsOpen(!isSettingsOpen)}
              className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl text-xs transition-colors"
              title="Receiving Channel Settings"
            >
              <Settings className="w-4 h-4" />
            </button>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Receiving Channels Notification Banner */}
        <div className="bg-indigo-950 px-6 py-3 border-b border-indigo-900/60 text-xs text-indigo-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>Orders are currently being delivered to:</span>
            <strong className="text-white font-mono bg-white/10 px-2 py-0.5 rounded">
              WhatsApp: {merchantSettings.receivingWhatsApp}
            </strong>
            <span className="text-indigo-400">·</span>
            <strong className="text-white bg-white/10 px-2 py-0.5 rounded">
              Email: {merchantSettings.receivingEmail}
            </strong>
          </div>

          <button
            onClick={() => setIsSettingsOpen(true)}
            className="text-xs text-amber-300 hover:text-amber-200 underline font-semibold"
          >
            Change Channels
          </button>
        </div>

        {/* Metrics Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-5 bg-white border-b border-slate-200">
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
              Total Orders Received
            </span>
            <span className="text-xl font-extrabold font-mono text-slate-900 mt-1 block">
              {orders.length}
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800">
                Needs Moniepoint Verification
              </span>
              <Clock className="w-4 h-4 text-amber-600" />
            </div>
            <span className="text-xl font-extrabold font-mono text-amber-900 mt-1 block">
              {pendingVerificationCount} orders
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">
                Verified / Processing
              </span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <span className="text-xl font-extrabold font-mono text-emerald-900 mt-1 block">
              {orders.filter((o) => o.status === 'verified').length} orders
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-indigo-50 border border-indigo-200">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-800">
                Total Store Revenue
              </span>
              <Building2 className="w-4 h-4 text-indigo-600" />
            </div>
            <span className="text-xl font-extrabold font-mono text-indigo-900 mt-1 block">
              {formatNaira(totalRevenue)}
            </span>
          </div>
        </div>

        {/* Toolbar: Tabs & Search */}
        <div className="p-4 px-6 bg-slate-100 border-b border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Tabs */}
          <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200 w-full sm:w-auto">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                activeTab === 'all'
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All ({orders.length})
            </button>
            <button
              onClick={() => setActiveTab('pending')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                activeTab === 'pending'
                  ? 'bg-amber-500 text-white'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Pending Proof ({pendingVerificationCount})
            </button>
            <button
              onClick={() => setActiveTab('verified')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                activeTab === 'verified'
                  ? 'bg-emerald-600 text-white'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Verified ({orders.filter((o) => o.status === 'verified').length})
            </button>
            <button
              onClick={() => setActiveTab('shipped')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                activeTab === 'shipped'
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Shipped ({orders.filter((o) => o.status === 'shipped').length})
            </button>
          </div>

          {/* Search box */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by ID, customer, reference..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-600"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Orders List Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {filteredOrders.length === 0 ? (
            <div className="p-16 text-center bg-white rounded-3xl border border-slate-200 shadow-xs">
              <Inbox className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="font-bold text-slate-900 text-base mb-1">No Orders Found</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mb-4">
                No orders match your current filter. Incoming orders from customers will appear here automatically in real time.
              </p>
              <button
                onClick={triggerSampleOrder}
                className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-semibold"
              >
                Generate a Sample Order
              </button>
            </div>
          ) : (
            filteredOrders.map((order) => {
              const isPending = order.status === 'payment_submitted';
              const isVerified = order.status === 'verified';
              const isShipped = order.status === 'shipped';

              return (
                <div
                  key={order.id}
                  className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-all p-5 flex flex-col lg:flex-row gap-5"
                >
                  {/* Left Column: Order metadata & Customer */}
                  <div className="lg:w-1/3 space-y-3 lg:border-r lg:border-slate-100 lg:pr-5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-sm text-slate-900 bg-slate-100 px-2 py-0.5 rounded-md">
                          {order.id}
                        </span>
                        <span className="text-[11px] text-slate-600 font-mono">
                          {order.paymentDetails.transferDate}
                        </span>
                      </div>

                      {/* Status Tag */}
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                          isPending
                            ? 'bg-amber-100 text-amber-800'
                            : isVerified
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-indigo-100 text-indigo-800'
                        }`}
                      >
                        {isPending
                          ? 'Pending Verification'
                          : isVerified
                          ? 'Payment Verified'
                          : 'Dispatched / In Transit'}
                      </span>
                    </div>

                    {/* Customer Profile */}
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs space-y-1">
                      <p className="font-bold text-slate-900 text-sm">{order.customer.fullName}</p>
                      <div className="flex items-center gap-2 text-slate-600">
                        <Phone className="w-3.5 h-3.5 text-slate-400" />
                        <span>{order.customer.phone}</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-600">
                        <Mail className="w-3.5 h-3.5 text-slate-400" />
                        <span>{order.customer.email}</span>
                      </div>
                      <div className="flex items-start gap-2 text-slate-700 pt-1 border-t border-slate-200">
                        <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
                        <span className="leading-snug">
                          {order.customer.address}, {order.customer.city}, <strong>{order.customer.state} State</strong>
                        </span>
                      </div>
                      {order.customer.notes && (
                        <p className="text-[11px] text-slate-500 italic mt-1">
                          Delivery Note: {order.customer.notes}
                        </p>
                      )}
                    </div>

                    {/* Copy Address Button */}
                    <button
                      onClick={() => handleCopyAddress(order)}
                      className="w-full py-1.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Copy className="w-3 h-3" />
                      <span>Copy Address for Rider</span>
                    </button>
                  </div>

                  {/* Middle Column: Items purchased & Totals */}
                  <div className="lg:w-1/3 space-y-3 lg:border-r lg:border-slate-100 lg:pr-5">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Ordered Products ({order.items.length})
                    </p>

                    <div className="space-y-2 max-h-40 overflow-y-auto pr-1 divide-y divide-slate-100">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="pt-2 first:pt-0 flex items-center gap-3">
                          <img
                            src={item.product.image}
                            alt={item.product.name}
                            referrerPolicy="no-referrer"
                            className="w-10 h-10 rounded-lg object-cover bg-slate-100 shrink-0 border border-slate-200"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-slate-900 truncate">
                              {item.product.name}
                            </p>
                            <p className="text-[11px] text-slate-500">
                              Qty: {item.quantity} × {formatNaira(item.product.price)}
                            </p>
                          </div>
                          <span className="text-xs font-bold font-mono text-slate-900">
                            {formatNaira(item.product.price * item.quantity)}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="pt-2 border-t border-slate-200 flex justify-between items-center text-xs">
                      <span className="text-slate-600 font-medium">Order Total to Receive:</span>
                      <span className="text-base font-extrabold font-mono text-indigo-700">
                        {formatNaira(order.total)}
                      </span>
                    </div>
                  </div>

                  {/* Right Column: Moniepoint Transfer Proof & Actions */}
                  <div className="lg:w-1/3 flex flex-col justify-between space-y-3">
                    <div className="space-y-2">
                      <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        Moniepoint Transfer Verification
                      </p>

                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1.5">
                        <div className="flex justify-between">
                          <span className="text-slate-500">Bank:</span>
                          <strong className="text-slate-800">{order.paymentDetails.bankName}</strong>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Account:</span>
                          <strong className="font-mono text-slate-800">
                            {order.paymentDetails.accountNumber}
                          </strong>
                        </div>
                        <div className="flex items-center justify-between pt-1 border-t border-slate-200">
                          <span className="text-slate-500">Ref:</span>
                          <div className="flex items-center gap-1">
                            <span className="font-mono font-semibold text-indigo-900 truncate max-w-[140px]">
                              {order.paymentDetails.reference}
                            </span>
                            <button
                              onClick={() => handleCopyReference(order.paymentDetails.reference)}
                              className="text-slate-400 hover:text-slate-700 p-0.5"
                              title="Copy Reference"
                            >
                              {copiedRefId === order.paymentDetails.reference ? (
                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </div>
                        </div>

                        {/* Attached receipt proof */}
                        {order.paymentDetails.receiptImageData ? (
                          <div className="pt-2 border-t border-slate-200">
                            <button
                              onClick={() => setViewingReceiptOrder(order)}
                              className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 font-semibold"
                            >
                              <img
                                src={order.paymentDetails.receiptImageData}
                                alt="Receipt thumbnail"
                                className="w-8 h-8 rounded object-cover border border-indigo-200"
                              />
                              <span>View Receipt Screenshot</span>
                            </button>
                          </div>
                        ) : order.paymentDetails.receiptImageName ? (
                          <div className="pt-1 text-[11px] text-emerald-700 font-medium">
                            ✓ Receipt attached ({order.paymentDetails.receiptImageName})
                          </div>
                        ) : null}
                      </div>
                    </div>

                    {/* Merchant Action Buttons */}
                    <div className="space-y-2 pt-2">
                      <div className="flex flex-wrap items-center gap-2">
                        {isPending && (
                          <button
                            onClick={async () => {
                              updateOrderStatus(order.id, 'verified');
                              const res = await simulateSendOwnerEmailNotification(order, merchantSettings.receivingEmail);
                              setDispatchedEmail(res);
                              showToast(`Order ${order.id} verified! Email dispatched to ${merchantSettings.receivingEmail}`, 'success');
                            }}
                            className="flex-1 py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center justify-center gap-1"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Verify Payment</span>
                          </button>
                        )}

                        {isVerified && (
                          <button
                            onClick={() => {
                              updateOrderStatus(order.id, 'shipped');
                              showToast(`Order ${order.id} marked as Shipped!`, 'success');
                            }}
                            className="flex-1 py-2 px-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center justify-center gap-1"
                          >
                            <Truck className="w-3.5 h-3.5" />
                            <span>Dispatch / Ship</span>
                          </button>
                        )}

                        <button
                          onClick={() => handleSimulateEmailNotification(order)}
                          disabled={isSendingEmail}
                          className="py-2 px-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-900 border border-indigo-200 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1"
                          title="Simulate email notification to store owner's registered email"
                        >
                          <Mail className="w-3.5 h-3.5 text-indigo-600" />
                          <span className="hidden sm:inline">Email Alert</span>
                        </button>

                        <button
                          onClick={() => handleWhatsAppCustomer(order)}
                          className="py-2 px-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1"
                          title="WhatsApp Customer"
                        >
                          <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="hidden sm:inline">WhatsApp</span>
                        </button>

                        <button
                          onClick={() => {
                            if (window.confirm(`Delete order ${order.id}?`)) {
                              deleteOrder(order.id);
                              showToast('Order removed', 'info');
                            }
                          }}
                          className="p-2 text-slate-400 hover:text-rose-500 rounded-xl hover:bg-rose-50 transition-colors"
                          title="Delete Order"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-white border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>
              Direct Moniepoint Bank Integration: <strong>8132230017</strong> (Gideon John Mayowa)
            </span>
          </div>

          <div className="flex items-center gap-3">
            {orders.length > 0 && (
              <button
                onClick={() => {
                  if (window.confirm('Are you sure you want to clear all orders?')) {
                    clearAllOrders();
                    showToast('All orders cleared', 'info');
                  }
                }}
                className="text-rose-600 hover:underline"
              >
                Clear All Orders
              </button>
            )}
            <button
              onClick={onClose}
              className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-semibold transition-colors"
            >
              Close Desk
            </button>
          </div>
        </div>
      </div>

      {/* Receipt Proof Viewer Modal */}
      {viewingReceiptOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 border border-slate-200 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">
                  Moniepoint Transfer Receipt Proof
                </h3>
                <p className="text-xs text-slate-500 font-mono">{viewingReceiptOrder.id}</p>
              </div>
              <button
                onClick={() => setViewingReceiptOrder(null)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="rounded-xl overflow-hidden bg-slate-100 border border-slate-200 max-h-96 flex items-center justify-center">
              {viewingReceiptOrder.paymentDetails.receiptImageData ? (
                <img
                  src={viewingReceiptOrder.paymentDetails.receiptImageData}
                  alt="Customer Transfer Proof"
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="p-8 text-center text-xs text-slate-500">
                  No image attached. Reference provided: {viewingReceiptOrder.paymentDetails.reference}
                </div>
              )}
            </div>

            <div className="text-xs text-slate-600 space-y-1 bg-slate-50 p-3 rounded-xl border border-slate-200">
              <p>
                <strong>Customer:</strong> {viewingReceiptOrder.customer.fullName}
              </p>
              <p>
                <strong>Reference:</strong>{' '}
                <span className="font-mono">{viewingReceiptOrder.paymentDetails.reference}</span>
              </p>
              <p>
                <strong>Amount:</strong>{' '}
                <span className="font-mono font-bold text-indigo-700">
                  {formatNaira(viewingReceiptOrder.total)}
                </span>
              </p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  updateOrderStatus(viewingReceiptOrder.id, 'verified');
                  setViewingReceiptOrder(null);
                  showToast('Payment verified successfully!', 'success');
                }}
                className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors"
              >
                Confirm & Verify This Payment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 border border-slate-200 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-indigo-600" />
                <h3 className="font-bold text-slate-900 text-sm">
                  Order Notification Channels
                </h3>
              </div>
              <button
                onClick={() => setIsSettingsOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSettings} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-800 mb-1">
                  Receiving WhatsApp Number (where customer orders are forwarded)
                </label>
                <input
                  type="text"
                  required
                  value={tempPhone}
                  onChange={(e) => setTempPhone(e.target.value)}
                  placeholder="e.g. 2348132230017"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-mono focus:ring-2 focus:ring-indigo-600 focus:outline-none"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  Format with country code (e.g. 2348132230017 for Nigeria).
                </p>
              </div>

              <div>
                <label className="block font-semibold text-slate-800 mb-1">
                  Merchant Notification Email
                </label>
                <input
                  type="email"
                  required
                  value={tempEmail}
                  onChange={(e) => setTempEmail(e.target.value)}
                  placeholder="e.g. marvelousadesola1@gmail.com"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:ring-2 focus:ring-indigo-600 focus:outline-none"
                />
              </div>

              <div className="p-3 bg-indigo-50 rounded-xl text-indigo-900 border border-indigo-100 space-y-1">
                <p className="font-bold">Moniepoint Account Destination:</p>
                <p className="font-mono">8132230017 · Gideon John Mayowa</p>
                <p className="text-[11px] text-slate-500">
                  Fixed merchant credentials configured for Moniepoint Microfinance Bank.
                </p>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsSettingsOpen(false)}
                  className="px-4 py-2 text-slate-600 hover:text-slate-900 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md transition-colors"
                >
                  Save Settings
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Simulated Email Notification Preview Modal */}
      {dispatchedEmail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 space-y-4 border border-slate-200 shadow-2xl max-h-[92vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-emerald-100 text-emerald-800 rounded-xl">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">
                    Simulated Email Notification Dispatched
                  </h3>
                  <p className="text-xs text-slate-500">
                    Delivered to store owner's registered email via template literal
                  </p>
                </div>
              </div>
              <button
                onClick={() => setDispatchedEmail(null)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Email Meta Headers */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-medium">To (Owner Email):</span>
                <span className="font-mono font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200">
                  {dispatchedEmail.recipientEmail}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-medium">Subject:</span>
                <span className="font-semibold text-indigo-700 truncate max-w-sm">
                  {dispatchedEmail.subject}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-medium">Dispatched Time:</span>
                <span className="font-mono text-slate-600">{dispatchedEmail.sentAt}</span>
              </div>
            </div>

            {/* Template Literal Output Preview */}
            <div className="flex-1 overflow-y-auto bg-slate-950 text-emerald-400 p-4 rounded-2xl font-mono text-[11px] leading-relaxed border border-slate-800 shadow-inner select-all whitespace-pre-wrap">
              {dispatchedEmail.body}
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={handleCopyEmailBody}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
              >
                {copiedEmailText ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>Copied Email Content!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copy Email Template</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => setDispatchedEmail(null)}
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
