

const generateInvoiceHTML = (order) => {
    const itemsHtml = order.orderItems.map(item => `
        <tr class="item">
            <td>${item.name}</td>
            <td>${item.quantity}</td>
            <td>₹${item.price.toFixed(2)}</td>
            <td class="text-right">₹${(item.quantity * item.price).toFixed(2)}</td>
        </tr>
    `).join('');

    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-t">
        <title>Invoice - ${order._id}</title>
        <style>
            body { font-family: 'Helvetica Neue', 'Helvetica', Arial, sans-serif; color: #555; }
            .invoice-box { max-width: 800px; margin: auto; padding: 30px; border: 1px solid #eee; box-shadow: 0 0 10px rgba(0, 0, 0, .15); font-size: 10px; line-height: 12px; }
            .invoice-box table { width: 100%; line-height: inherit; text-align: left; border-collapse: collapse; }
            .invoice-box table td { padding: 5px; vertical-align: top; }
            .invoice-box table tr.top table td.title { font-size: 20px; line-height: 30px; color: #333; font-weight: bold; }
            .invoice-box table tr.information table td { padding-bottom: 40px; }
            .invoice-box table tr.heading td { background: #eee; border-bottom: 1px solid #ddd; font-weight: bold; }
            .invoice-box table tr.item td { border-bottom: 1px solid #eee; }
            .invoice-box table tr.total td:nth-child(4) { border-top: 2px solid #eee; font-weight: bold; }
            .text-right { text-align: right; }
               .signature-note {
                text-align: center;
                font-size: 12px;
                color: #888888;
                margin-top: 40px;
            }
        </style>
    </head>
    <body>
        <div class="invoice-box">
            <table cellpadding="0" cellspacing="0">
                <tr class="top">
                    <td colspan="4">
                        <table>
                            <tr>
                                <td class="title">
                                    <img src="[Logo URL]" style="width:100%; max-width:150px;">
                                    <br>
                                    GadgetGrove
                                </td>
                                <td class="text-right">
                                    Invoice #: ${order._id}<br>
                                    Created: ${new Date(order.createdAt).toLocaleDateString()}<br>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
                <tr class="information">
                    <td colspan="4">
                        <table>
                            <tr>
                                <td>
                                    <strong>From:</strong><br>
                                    GadgetGrove<br>
                                    15, Fatiyabad, Post-Nangal Salia<br>
                                    Alwar, Rajasthan - 301712<br>
                                    yogendrayadavv57@gmail.com<br>
                                    9588057515
                                </td>
                                <td class="text-right">
                                    <strong>Billed To:</strong><br>
                                    ${order.shippingAddress.name}<br>
                                    ${order.shippingAddress.address}<br>
                                    ${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.postalCode}<br>
                                    ${order.shippingAddress.phone}
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
                <tr class="heading">
                    <td colspan="3">Payment Method</td>
                    <td class="text-right">Transaction ID</td>
                </tr>
                <tr class="details">
                    <td colspan="3">${order.paymentMethod}</td>
                    <td class="text-right">${order.paymentResult.id}</td>
                </tr>
                <tr class="heading">
                    <td>Item</td>
                    <td>Quantity</td>
                    <td>Price</td>
                    <td class="text-right">Subtotal</td>
                </tr>
                ${itemsHtml}
                <tr class="total">
                    <td colspan="3" class="text-right">Subtotal:</td>
                    <td class="text-right">₹${order.itemsPrice.toFixed(2)}</td>
                </tr>
                <tr class="total">
                    <td colspan="3" class="text-right">Shipping:</td>
                    <td class="text-right">₹${order.shippingPrice.toFixed(2)}</td>
                </tr>
                <tr class="total">
                    <td colspan="3" class="text-right">Tax:</td>
                    <td class="text-right">₹${order.taxPrice.toFixed(2)}</td>
                </tr>
                <tr class="total">
                    <td colspan="3" class="text-right"><strong>Grand Total:</strong></td>
                    <td class="text-right"><strong>₹${order.totalPrice.toFixed(2)}</strong></td>
                </tr>
            </table>

            <p class="signature-note">This is an online generated bill and does not require a signature.</p>
        </div>
    </body>
    </html>
    `;
};
module.exports = generateInvoiceHTML;
