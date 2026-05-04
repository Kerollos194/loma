/**
 * Lo'ma Contact Page Logic
 */

'use strict';

import { Contact } from './api.js';

/**
 * Handle Contact Form Submission
 */
export async function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            subject: document.getElementById('subject').value,
            message: document.getElementById('message').value
        };

        try {
            window.appState.ui.isLoading = true;
            await Contact.sendMessage(formData);
            
            window.appState.showFeedback("Message sent successfully! We will get back to you soon.");
            form.reset();
        } catch (error) {
            window.appState.showFeedback(error.message, 'error');
        } finally {
            window.appState.ui.isLoading = false;
        }
    });
}
