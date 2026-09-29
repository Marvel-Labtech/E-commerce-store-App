import { Order } from '../types';
import { formatNaira } from '../data/products';
import { STORE_BANK_DETAILS } from '../data/categories';

export interface EmailDispatchResult {
  success: boolean;
  recipientEmail: string;
  subject: string;
  sentAt: string;
  body: string;
  orderId: string;
}

/**
 * Service function to simulate sending an email notification to the store owner's
 * registered email address when a new order is confirmed, using a clean template literal format.
 */
export async function sendOrderNotificationEmail(
  order: Order,
  recipientEmail: string = 'marvelousadesola1@gmail.com'
): Promise<EmailDispatchResult> {
  const formattedItems = order.items
    .map(
      (item, index) =>
        `   ${index + 1}. [${item.product.id}] ${item.product.name} (x${item.quantity}) - ${formatNaira(
          item.product.price * item.quantity
        )}`
    )
    .join('\n');

  const subject = `[Testimony Store Alert] New Order Confirmed #${order.id} - ${formatNaira(order.total)}`;

  // Multi-line template literal format for the store owner's notification email
  const emailBody = `
================================================================================
🔔 TESTIMONY STORE · NEW ORDER NOTIFICATION
================================================================================
To: ${recipientEmail}
From: orders@testimonystore.com (Testimony Store Automated Dispatch)
Subject: ${subject}
Date: ${new Date().toLocaleString('en-NG', { timeZone: 'Africa/Lagos' })}

Dear Store Administrator / Gideon John Mayowa,

A new customer order has been confirmed on Testimony Store!
Please find the complete order summary and Moniepoint payment details below:

--------------------------------------------------------------------------------
1. ORDER SUMMARY
--------------------------------------------------------------------------------
Order ID:            ${order.id}
Date & Time:         ${order.paymentDetails.transferDate || new Date().toLocaleString()}
Status:              ${order.status.toUpperCase()}
Item Count:          ${order.items.reduce((acc, it) => acc + it.quantity, 0)} item(s)

Itemized Breakdown:
${formattedItems}

Financial Totals:
   • Subtotal:       ${formatNaira(order.subtotal)}
   • Discount:       ${order.discount > 0 ? `-${formatNaira(order.discount)}` : '₦0'}
   • Shipping Fee:   ${order.shippingFee === 0 ? 'FREE (Nationwide Promo)' : formatNaira(order.shippingFee)}
   -----------------------------------------------------------------------------
   • TOTAL TO RECEIVE: ${formatNaira(order.total)}

--------------------------------------------------------------------------------
2. CUSTOMER & DELIVERY PARTICULARS
--------------------------------------------------------------------------------
Customer Full Name:  ${order.customer.fullName}
Phone Number:        ${order.customer.phone}
Customer Email:      ${order.customer.email}
Delivery Address:    ${order.customer.address}
City / State:        ${order.customer.city}, ${order.customer.state} State
Delivery Landmark:   ${order.customer.notes || 'None specified'}

--------------------------------------------------------------------------------
3. MONIEPOINT DIRECT BANK TRANSFER PROOF
--------------------------------------------------------------------------------
Receiving Bank:      ${order.paymentDetails.bankName || STORE_BANK_DETAILS.bankName}
Account Number:      ${order.paymentDetails.accountNumber || STORE_BANK_DETAILS.accountNumber}
Account Name:        ${order.paymentDetails.accountName || STORE_BANK_DETAILS.accountName}
Transfer Reference:  ${order.paymentDetails.reference}
Receipt Attached:    ${order.paymentDetails.receiptImageName ? `YES (${order.paymentDetails.receiptImageName})` : 'Reference text provided'}

--------------------------------------------------------------------------------
NEXT STEPS FOR MERCHANT:
1. Verify the incoming credit of ${formatNaira(order.total)} in your Moniepoint app.
2. Cross-reference the customer transaction session ID (${order.paymentDetails.reference}).
3. Dispatch package to ${order.customer.city}, ${order.customer.state} within 24 hours.
4. Contact customer via WhatsApp (${order.customer.phone}) with dispatch tracking.

Need to update settings or manage this order?
Access your Merchant Order Desk: https://testimonystore.com/merchant
================================================================================
`.trim();

  // Simulate network transport latency
  await new Promise((resolve) => setTimeout(resolve, 350));

  // Structured console log
  console.log(`%c[Email Service] Order notification sent to ${recipientEmail}`, 'color: #10B981; font-weight: bold;');
  console.log(emailBody);

  return {
    success: true,
    recipientEmail,
    subject,
    sentAt: new Date().toLocaleTimeString('en-NG', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    body: emailBody,
    orderId: order.id,
  };
}
