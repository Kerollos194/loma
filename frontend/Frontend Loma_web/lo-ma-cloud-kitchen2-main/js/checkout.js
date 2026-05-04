/**
 * Lo'ma Checkout Logic
 * Handles order placement and summary calculations.
 */

'use strict';

import { Orders, Cart } from './api.js';

/**
 * Initialize Checkout Page
 */
export async function initCheckout() {
    const cart = window.appState.cart;
    if (cart.length === 0) {
        // Optionally fetch from API if appState is empty
        const apiCart = await Cart.getCart();
        window.appState.cart = apiCart;
    }
    renderOrderSummary();
}

/**
 * Render Order Summary in UI
 */
function renderOrderSummary() {
    const summaryEl = document.getElementById('summaryItems');
    if (!summaryEl) return;

    const cart = window.appState.cart;
    if (cart.length === 0) {
        summaryEl.innerHTML = '<div class="empty-cart-msg">Your cart is empty. <a href="return_meal.html">Browse meals</a></div>';
        return;
    }

    summaryEl.innerHTML = cart.map(item => `
        <div class="summary-item">
            <div class="summary-item-info">
                <div class="s-name">${item.meal_name} <span style="color:var(--text-muted);font-weight:400">×${item.quantity}</span></div>
                <div class="s-meta">${item.restaurant_name || "Lo'ma"}</div>
            </div>
            <div class="summary-item-price">$${(item.unit_price * item.quantity).toFixed(2)}</div>
        </div>
    `).join('');

    // Calculate totals
    const subtotal = cart.reduce((s, i) => s + (i.unit_price * i.quantity), 0);
    const delivery = 2.99;
    const total = subtotal + delivery;

    document.getElementById('sumSubtotal').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('sumTotal').textContent = `$${total.toFixed(2)}`;
}

/**
 * Handle Order Placement
 * @param {object} formData - Form fields from checkout page
 */
export async function placeOrder(formData) {
    try {
        window.appState.ui.isLoading = true;
        
        const orderData = {
            delivery_address: `${formData.street}, ${formData.city} ${formData.zip}`,
            payment_method: formData.payment_method,
            notes: formData.notes,
            items: window.appState.cart.map(i => ({
                meal_type: i.meal_type,
                meal_id: i.meal_id,
                quantity: i.quantity
            }))
        };

        const result = await Orders.createOrder(orderData);
        
        // Clear local cart
        await Cart.clearCart();
        window.appState.cart = [];
        
        // Store order result for confirmation page
        window.appState.lastOrder = result;
        
        window.location.href = 'order-confirm.html';
    } catch (error) {
        window.appState.showFeedback(error.message, 'error');
    } finally {
        window.appState.ui.isLoading = false;
    }
}
