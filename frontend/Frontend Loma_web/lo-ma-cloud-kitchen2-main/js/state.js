/**
 * Lo'ma Global State Management
 * Holds runtime data that is shared across multiple pages/components.
 */

'use strict';

window.appState = {
    // Current logged-in user info
    user: null, 
    
    // In-memory cart (synced with API or used as fallback)
    cart: [],
    
    // UI state (modals, loading states, etc)
    ui: {
        isCartOpen: false,
        isLoading: false
    },

    // Success/Error feedback helper
    showFeedback: (message, type = 'success') => {
        const feedbackEl = document.getElementById('appFeedback');
        if (!feedbackEl) {
            const el = document.createElement('div');
            el.id = 'appFeedback';
            el.className = `app-feedback ${type}`;
            el.innerText = message;
            document.body.appendChild(el);
            setTimeout(() => el.remove(), 3000);
        } else {
            feedbackEl.innerText = message;
            feedbackEl.className = `app-feedback ${type}`;
        }
    }
};

/**
 * Initialize state from memory or optional session logic
 */
export function initState() {
    console.log("App State Initialized");
    // In a production app, you might check for a session token here
}
