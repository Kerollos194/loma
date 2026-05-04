/* ============================================================
   Lo'ma — Cart System
   Handles: cart state, sidebar UI, badge, add/remove/qty controls
   ============================================================ */

(function () {
  'use strict';

  // ─────────────────────────────────────────────────────────────
  // SECTION 1: STATE MANAGEMENT
  // Handles reading and writing cart data to localStorage.
  // ─────────────────────────────────────────────────────────────

  /** @type {Array} */
  let cart = JSON.parse(localStorage.getItem('lomaCart') || '[]');
  if (window.appState) window.appState.cart = cart;

  /**
   * Persists the current cart array to localStorage and syncs with API if logged in.
   */
  async function saveCart() {
    localStorage.setItem('lomaCart', JSON.stringify(cart));
    if (window.appState) window.appState.cart = cart;
    
    // If backend API exists and user is logged in, this would be a good place to sync
    // For now, API.Cart already handles the sync logic in api.js
  }

  /**
   * Returns the total number of items in the cart (sum of quantities).
   * @returns {number}
   */
  function getTotalItemCount() {
    return cart.reduce((sum, item) => sum + item.qty, 0);
  }

  /**
   * Returns the total discounted price of all items.
   * @returns {number}
   */
  function getTotalPrice() {
    return cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  }

  /**
   * Returns the total original (pre-discount) price of all items.
   * @returns {number}
   */
  function getTotalOriginalPrice() {
    return cart.reduce((sum, item) => sum + item.originalPrice * item.qty, 0);
  }

  /**
   * Returns the total amount saved across all items.
   * @returns {number}
   */
  function getTotalSavings() {
    return getTotalOriginalPrice() - getTotalPrice();
  }

  // ─────────────────────────────────────────────────────────────
  // SECTION 2: CART BADGE
  // Updates the cart item count badge in the navbar.
  // ─────────────────────────────────────────────────────────────

  /**
   * Updates all cart badge elements on the page with the current item count.
   */
  function updateCartBadge() {
    const badges = document.querySelectorAll('#cartBadge');
    const count = getTotalItemCount();
    badges.forEach(badge => {
      badge.textContent = count;
      badge.style.display = count > 0 ? 'flex' : 'none';
    });
  }

  // ─────────────────────────────────────────────────────────────
  // SECTION 3: SIDEBAR HTML CONSTRUCTION
  // Builds and injects the cart sidebar into the DOM.
  // ─────────────────────────────────────────────────────────────

  /**
   * Generates the HTML for a single cart item row.
   * @param {{name:string, restaurant:string, price:number, qty:number}} item
   * @param {number} index - Index of the item in the cart array.
   * @returns {string} HTML string.
   */
  function buildCartItemHTML(item, index) {
    return `
      <div class="cart-item" data-idx="${index}">
        <div class="cart-item-info">
          <div class="cart-item-name">${item.name}</div>
          <div class="cart-item-restaurant"><i class="fas fa-store"></i> ${item.restaurant}</div>
          <div class="cart-item-price">$${(item.price * item.qty).toFixed(2)}</div>
        </div>
        <div class="cart-item-controls">
          <button class="qty-btn minus" data-idx="${index}"><i class="fas fa-minus"></i></button>
          <span class="qty-val">${item.qty}</span>
          <button class="qty-btn plus" data-idx="${index}"><i class="fas fa-plus"></i></button>
          <button class="cart-remove-btn" data-idx="${index}" title="Remove"><i class="fas fa-trash"></i></button>
        </div>
      </div>`;
  }

  /**
   * Generates the HTML for the cart body (either empty state or item list).
   * @returns {string} HTML string.
   */
  function buildCartBodyHTML() {
    if (cart.length === 0) {
      return `
        <div class="cart-empty">
          <div class="cart-empty-icon"><i class="fas fa-shopping-basket"></i></div>
          <h3>Your cart is empty</h3>
          <p>Browse our returned meals and add something delicious!</p>
          <a href="return_meal.html" class="cart-browse-btn">Browse Meals</a>
        </div>`;
    }
    return `
      <div class="cart-items">
        ${cart.map((item, idx) => buildCartItemHTML(item, idx)).join('')}
      </div>`;
  }

  /**
   * Generates the HTML for the cart footer (summary + checkout button).
   * Only shown when the cart has items.
   * @returns {string} HTML string, or empty string if cart is empty.
   */
  function buildCartFooterHTML() {
    if (cart.length === 0) return '';
    const savings = getTotalSavings();
    const total = getTotalPrice();
    const delivery = 2.99;
    return `
      <div class="cart-footer">
        <div class="cart-summary">
          <div class="cart-summary-row"><span>Subtotal</span><span>$${total.toFixed(2)}</span></div>
          ${savings > 0 ? `<div class="cart-summary-row saving"><span><i class="fas fa-tag"></i> You save</span><span>-$${savings.toFixed(2)}</span></div>` : ''}
          <div class="cart-summary-row delivery"><span>Delivery</span><span>$${delivery.toFixed(2)}</span></div>
          <div class="cart-summary-row total"><span>Total</span><span>$${(total + delivery).toFixed(2)}</span></div>
        </div>
        <a href="checkout.html" class="cart-checkout-btn">
          <i class="fas fa-lock"></i> Proceed to Checkout
          <span class="cart-checkout-amount">$${(total + delivery).toFixed(2)}</span>
        </a>
        <button class="cart-clear-btn" id="cartClearBtn">Clear all items</button>
      </div>`;
  }

  /**
   * Builds and injects the entire cart sidebar into the DOM.
   * Removes any existing sidebar before rebuilding.
   */
  function buildSidebar() {
    const existing = document.getElementById('cartSidebar');
    if (existing) existing.remove();

    const itemCount = getTotalItemCount();
    const sidebar = document.createElement('div');
    sidebar.id = 'cartSidebar';
    sidebar.innerHTML = `
      <div class="cart-backdrop" id="cartBackdrop"></div>
      <aside class="cart-panel" id="cartPanel">
        <div class="cart-header">
          <div class="cart-title">
            <i class="fas fa-shopping-basket"></i>
            Your Cart
            ${itemCount > 0 ? `<span class="cart-count-pill">${itemCount}</span>` : ''}
          </div>
          <button class="cart-close-btn" id="cartCloseBtn"><i class="fas fa-times"></i></button>
        </div>
        <div class="cart-body">${buildCartBodyHTML()}</div>
        ${buildCartFooterHTML()}
      </aside>`;

    document.body.appendChild(sidebar);
    bindSidebarEvents(sidebar);
  }

  // ─────────────────────────────────────────────────────────────
  // SECTION 4: SIDEBAR EVENTS
  // Binds all interactive events inside the cart sidebar.
  // ─────────────────────────────────────────────────────────────

  /**
   * Attaches event listeners to all interactive elements inside the sidebar.
   * @param {HTMLElement} sidebar - The newly built sidebar element.
   */
  function bindSidebarEvents(sidebar) {
    document.getElementById('cartBackdrop').onclick = closeSidebar;
    document.getElementById('cartCloseBtn').onclick = closeSidebar;

    const clearBtn = document.getElementById('cartClearBtn');
    if (clearBtn) {
      clearBtn.onclick = () => {
        cart = [];
        saveCart();
        rebuildSidebar();
        updateCartBadge();
      };
    }

    // Decrease quantity or remove item if qty reaches 0
    sidebar.querySelectorAll('.qty-btn.minus').forEach(btn => {
      btn.onclick = () => {
        const idx = +btn.dataset.idx;
        if (cart[idx].qty > 1) {
          cart[idx].qty--;
        } else {
          cart.splice(idx, 1);
        }
        saveCart();
        rebuildSidebar();
        updateCartBadge();
      };
    });

    // Increase quantity
    sidebar.querySelectorAll('.qty-btn.plus').forEach(btn => {
      btn.onclick = () => {
        const idx = +btn.dataset.idx;
        cart[idx].qty++;
        saveCart();
        rebuildSidebar();
        updateCartBadge();
      };
    });

    // Remove item entirely
    sidebar.querySelectorAll('.cart-remove-btn').forEach(btn => {
      btn.onclick = () => {
        const idx = +btn.dataset.idx;
        cart.splice(idx, 1);
        saveCart();
        rebuildSidebar();
        updateCartBadge();
      };
    });

    // Close sidebar on Escape key press
    document.addEventListener('keydown', function escClose(e) {
      if (e.key === 'Escape') {
        closeSidebar();
        document.removeEventListener('keydown', escClose);
      }
    });
  }

  // ─────────────────────────────────────────────────────────────
  // SECTION 5: SIDEBAR VISIBILITY
  // Opens, closes, toggles, and rebuilds the sidebar.
  // ─────────────────────────────────────────────────────────────

  /**
   * Rebuilds the sidebar in-place, preserving its open/closed state.
   */
  function rebuildSidebar() {
    const wasOpen = document.getElementById('cartSidebar')
      ?.querySelector('.cart-panel')?.classList.contains('open');
    buildSidebar();
    if (wasOpen) openSidebar(false);
  }

  /**
   * Opens the cart sidebar and optionally rebuilds it first.
   * @param {boolean} [rebuild=true] - Whether to rebuild the sidebar HTML before opening.
   */
  function openSidebar(rebuild = true) {
    if (rebuild) buildSidebar();
    requestAnimationFrame(() => {
      document.getElementById('cartSidebar').classList.add('open');
      document.getElementById('cartPanel').classList.add('open');
      document.getElementById('cartBackdrop').classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  }

  /**
   * Closes the cart sidebar and restores page scroll.
   */
  function closeSidebar() {
    const sidebar = document.getElementById('cartSidebar');
    if (!sidebar) return;
    document.getElementById('cartPanel')?.classList.remove('open');
    document.getElementById('cartBackdrop')?.classList.remove('open');
    sidebar.classList.remove('open');
    document.body.style.overflow = '';
  }

  /**
   * Toggles the cart sidebar open or closed.
   */
  function toggleSidebar() {
    const sidebar = document.getElementById('cartSidebar');
    if (sidebar && sidebar.classList.contains('open')) {
      closeSidebar();
    } else {
      openSidebar();
    }
  }

  // ─────────────────────────────────────────────────────────────
  // SECTION 6: ADD TO CART LOGIC
  // Handles adding items and showing user feedback.
  // ─────────────────────────────────────────────────────────────

  /**
   * Adds an item to the cart.
   * @param {object} item
   */
  async function addToCart(item) {
    if (window.API) {
      // Map frontend item to backend format
      const apiItem = {
        meal_id: item.id || 0, // Need to ensure meals have IDs in HTML
        meal_type: item.type || 'fresh',
        quantity: 1,
        meal_name: item.name,
        unit_price: item.price
      };
      await window.API.Cart.addItem(apiItem);
      // Sync local cart with what the API returns or appState
      cart = window.appState.cart;
    } else {
      // Fallback for if API layer isn't loaded
      const existing = cart.find(i => i.name === item.name && i.restaurant === item.restaurant);
      if (existing) {
        existing.qty++;
      } else {
        cart.push({ ...item, qty: 1 });
      }
    }
    
    saveCart();
    updateCartBadge();
    showAddedToCartToast(item.name);
  }

  /**
   * Shows a temporary toast notification at the bottom of the screen.
   * @param {string} itemName - The name of the item that was added.
   */
  function showAddedToCartToast(itemName) {
    const toast = document.createElement('div');
    toast.className = 'cart-toast';
    toast.innerHTML = `<i class="fas fa-check-circle"></i> <span>${itemName}</span> added to cart`;
    document.body.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add('show'));
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 400);
    }, 2400);
  }

  // ─────────────────────────────────────────────────────────────
  // SECTION 7: BUTTON WIRING
  // Connects "Add to Cart" buttons on meal cards to the cart system.
  // ─────────────────────────────────────────────────────────────

  /**
   * Wires up all unbound "Add to Cart" buttons on the page.
   * Uses a data attribute flag to prevent double-binding.
   */
  function wireAddToCartButtons() {
    document.querySelectorAll('.add-btn, .add-to-cart-btn').forEach(btn => {
      if (btn.dataset.cartWired) return;
      btn.dataset.cartWired = '1';

      btn.addEventListener('click', function () {
        const card = this.closest('.meal-card') || this.closest('.card');
        if (!card) return;

        const name = card.querySelector('h3')?.textContent?.trim() || 'Meal';
        const restaurant = card.querySelector('.restaurant')?.textContent?.replace(/^\s*\S+\s*/, '').trim() || "Lo'ma";
        const newPriceEl = card.querySelector('.new-price') || card.querySelector('.price');
        const oldPriceEl = card.querySelector('.old-price');
        const price = parseFloat((newPriceEl?.textContent || '0').replace('$', '')) || 0;
        const originalPrice = parseFloat((oldPriceEl?.textContent || newPriceEl?.textContent || '0').replace('$', '')) || price;

        addToCart({ name, restaurant, price, originalPrice });

        // Visual feedback on the button
        const originalText = this.textContent;
        this.innerHTML = '<i class="fas fa-check"></i> Added!';
        this.style.background = 'var(--green-deep)';
        setTimeout(() => {
          this.textContent = originalText;
          this.style.background = '';
        }, 1500);
      });
    });
  }

  // ─────────────────────────────────────────────────────────────
  // SECTION 8: CSS INJECTION
  // Injects all cart-related styles dynamically (once).
  // ─────────────────────────────────────────────────────────────

  /**
   * Injects the cart's CSS styles into the document head.
   * Does nothing if styles have already been injected.
   */
  function injectCartStyles() {
    if (document.getElementById('cartStyles')) return;
    const styleEl = document.createElement('style');
    styleEl.id = 'cartStyles';
    styleEl.textContent = `
      .cart-icon-btn {
        position: relative; width: 40px; height: 40px; border-radius: 10px;
        background: var(--bg); border: 1.5px solid var(--border);
        display: flex; align-items: center; justify-content: center;
        color: var(--text); font-size: 1rem; transition: var(--transition);
        cursor: pointer; text-decoration: none; flex-shrink: 0;
      }
      .cart-icon-btn:hover { background: var(--green-light); border-color: var(--green-mid); color: var(--green-mid); }
      .cart-badge {
        position: absolute; top: -6px; right: -6px; width: 20px; height: 20px;
        border-radius: 50%; background: var(--orange); color: #fff;
        font-size: 0.68rem; font-weight: 700;
        display: flex; align-items: center; justify-content: center;
        border: 2px solid var(--white); animation: badgePop 0.3s cubic-bezier(.4,0,.2,1);
      }
      @keyframes badgePop { 0%{transform:scale(0)} 70%{transform:scale(1.2)} 100%{transform:scale(1)} }
      #cartSidebar { position: fixed; inset: 0; z-index: 8000; pointer-events: none; }
      #cartSidebar.open { pointer-events: all; }
      .cart-backdrop {
        position: absolute; inset: 0; background: rgba(10,20,12,0.45);
        backdrop-filter: blur(3px); opacity: 0; transition: opacity 0.32s ease;
      }
      .cart-backdrop.open { opacity: 1; }
      .cart-panel {
        position: absolute; top: 0; right: 0; bottom: 0; width: 400px; max-width: 95vw;
        background: var(--white); display: flex; flex-direction: column;
        transform: translateX(100%); transition: transform 0.35s cubic-bezier(.4,0,.2,1);
        box-shadow: -8px 0 40px rgba(0,0,0,0.15);
      }
      .cart-panel.open { transform: translateX(0); }
      .cart-header {
        display: flex; align-items: center; justify-content: space-between;
        padding: 20px 24px; border-bottom: 1px solid var(--border); flex-shrink: 0;
      }
      .cart-title {
        display: flex; align-items: center; gap: 10px;
        font-family: var(--font-display); font-size: 1.2rem; font-weight: 800; color: var(--dark);
      }
      .cart-title i { color: var(--green-mid); }
      .cart-count-pill {
        background: var(--orange); color: #fff; font-size: 0.72rem; font-weight: 700;
        padding: 2px 8px; border-radius: 50px; font-family: var(--font-body);
      }
      .cart-close-btn {
        width: 36px; height: 36px; border-radius: 50%;
        background: var(--bg); border: 1px solid var(--border);
        display: flex; align-items: center; justify-content: center;
        color: var(--text-muted); font-size: 0.9rem; cursor: pointer; transition: var(--transition);
      }
      .cart-close-btn:hover { background: #fde8e8; color: #e05252; border-color: #e05252; }
      .cart-body { flex: 1; overflow-y: auto; padding: 20px 24px; }
      .cart-empty { text-align: center; padding: 60px 20px; }
      .cart-empty-icon {
        width: 80px; height: 80px; border-radius: 50%;
        background: var(--green-light); color: var(--green-mid); font-size: 2rem;
        display: flex; align-items: center; justify-content: center; margin: 0 auto 20px;
      }
      .cart-empty h3 { font-size: 1.1rem; color: var(--dark); margin-bottom: 8px; }
      .cart-empty p { color: var(--text-muted); font-size: 0.9rem; margin-bottom: 24px; }
      .cart-browse-btn {
        display: inline-block; padding: 10px 24px; background: var(--green-mid); color: #fff;
        border-radius: 8px; font-weight: 700; font-size: 0.9rem;
        text-decoration: none; transition: var(--transition);
      }
      .cart-browse-btn:hover { background: var(--green-deep); }
      .cart-items { display: flex; flex-direction: column; gap: 16px; }
      .cart-item {
        display: flex; align-items: center; justify-content: space-between; gap: 14px;
        padding: 14px 16px; background: var(--bg); border: 1px solid var(--border);
        border-radius: 12px; transition: var(--transition);
      }
      .cart-item:hover { border-color: var(--green-mid); box-shadow: var(--shadow-sm); }
      .cart-item-info { flex: 1; min-width: 0; }
      .cart-item-name { font-weight: 700; font-size: 0.93rem; color: var(--dark); margin-bottom: 3px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
      .cart-item-restaurant { font-size: 0.8rem; color: var(--text-muted); margin-bottom: 6px; }
      .cart-item-restaurant i { margin-right: 4px; }
      .cart-item-price { font-size: 1rem; font-weight: 800; color: var(--green-deep); }
      .cart-item-controls { display: flex; align-items: center; gap: 6px; flex-shrink: 0; }
      .qty-btn {
        width: 28px; height: 28px; border-radius: 8px; border: 1.5px solid var(--border);
        background: var(--white); color: var(--text); font-size: 0.7rem;
        display: flex; align-items: center; justify-content: center;
        cursor: pointer; transition: var(--transition);
      }
      .qty-btn:hover { background: var(--green-light); border-color: var(--green-mid); color: var(--green-mid); }
      .qty-val { font-weight: 700; font-size: 0.95rem; min-width: 22px; text-align: center; color: var(--dark); }
      .cart-remove-btn {
        width: 28px; height: 28px; border-radius: 8px; border: 1.5px solid var(--border);
        background: var(--white); color: var(--text-muted); font-size: 0.7rem;
        display: flex; align-items: center; justify-content: center;
        cursor: pointer; transition: var(--transition); margin-left: 2px;
      }
      .cart-remove-btn:hover { background: #fde8e8; border-color: #e05252; color: #e05252; }
      .cart-footer { padding: 20px 24px; border-top: 1px solid var(--border); flex-shrink: 0; }
      .cart-summary { margin-bottom: 16px; }
      .cart-summary-row {
        display: flex; justify-content: space-between; align-items: center;
        padding: 6px 0; font-size: 0.9rem; color: var(--text-muted);
      }
      .cart-summary-row.saving { color: var(--green-mid); font-weight: 600; }
      .cart-summary-row.saving i { margin-right: 6px; }
      .cart-summary-row.total {
        font-size: 1.05rem; font-weight: 800; color: var(--dark);
        border-top: 1px solid var(--border); margin-top: 8px; padding-top: 12px;
      }
      .cart-checkout-btn {
        display: flex; align-items: center; justify-content: space-between;
        padding: 14px 20px; background: var(--green-mid); color: #fff;
        border-radius: 12px; font-weight: 700; font-size: 0.95rem;
        text-decoration: none; transition: var(--transition); width: 100%;
      }
      .cart-checkout-btn:hover { background: var(--green-deep); transform: translateY(-2px); box-shadow: 0 8px 24px rgba(46,139,74,0.35); }
      .cart-checkout-amount { font-size: 0.9rem; opacity: 0.9; }
      .cart-clear-btn {
        width: 100%; margin-top: 10px; background: none; border: none;
        color: var(--text-muted); font-size: 0.85rem; cursor: pointer; padding: 6px;
        transition: color 0.2s; font-family: var(--font-body);
      }
      .cart-clear-btn:hover { color: #e05252; }
      .cart-toast {
        position: fixed; bottom: 28px; left: 50%; transform: translateX(-50%) translateY(20px);
        background: var(--dark); color: #fff; padding: 12px 22px; border-radius: 50px;
        font-size: 0.88rem; font-weight: 600; display: flex; align-items: center; gap: 10px;
        z-index: 9999; opacity: 0; transition: all 0.3s ease; white-space: nowrap;
        box-shadow: 0 8px 24px rgba(0,0,0,0.25);
      }
      .cart-toast i { color: var(--green-bright); font-size: 1rem; }
      .cart-toast.show { opacity: 1; transform: translateX(-50%) translateY(0); }
    `;
    document.head.appendChild(styleEl);
  }

  // ─────────────────────────────────────────────────────────────
  // SECTION 9: INITIALIZATION
  // Bootstraps the cart system when the page is ready.
  // ─────────────────────────────────────────────────────────────

  /**
   * Initializes the full cart system.
   */
  function init() {
    injectCartStyles();
    updateCartBadge();
    wireAddToCartButtons();

    // Observe for dynamically added meal cards and wire their buttons too
    const observer = new MutationObserver(() => wireAddToCartButtons());
    observer.observe(document.body, { childList: true, subtree: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // ─────────────────────────────────────────────────────────────
  // SECTION 10: PUBLIC API
  // Exposes key cart functions for use by other scripts.
  // ─────────────────────────────────────────────────────────────

  window.lomaCart = {
    add: addToCart,
    toggleSidebar,
    openSidebar,
    closeSidebar,
    getCart: () => cart,
    getTotal: getTotalPrice,
    getTotalWithDelivery: () => getTotalPrice() + 2.99,
    rewire: wireAddToCartButtons,
  };

})();
