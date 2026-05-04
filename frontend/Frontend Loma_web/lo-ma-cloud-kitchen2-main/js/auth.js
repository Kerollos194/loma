/**
 * Lo'ma Authentication Logic
 * Handles interaction between Auth API and UI components.
 */

'use strict';

import { Auth, Users } from './api.js';

/**
 * Handle Login Form Submission
 * @param {string} email 
 * @param {string} password 
 */
export async function handleLogin(email, password) {
    try {
        window.appState.ui.isLoading = true;
        const result = await Auth.login(email, password);
        
        // Update global state
        window.appState.user = result.user;
        
        window.appState.showFeedback(`Welcome back, ${result.user.name}!`);
        
        // Redirect based on role
        if (result.user.role === 'restaurant') {
            window.location.href = 'restaurant-dashboard.html';
        } else {
            window.location.href = 'index.html';
        }
    } catch (error) {
        window.appState.showFeedback(error.message, 'error');
    } finally {
        window.appState.ui.isLoading = false;
    }
}

/**
 * Handle Signup Form Submission
 * @param {object} userData - { name, email, password, phone, role }
 */
export async function handleSignup(userData) {
    try {
        window.appState.ui.isLoading = true;
        await Auth.register(userData);
        
        window.appState.showFeedback("Account created successfully! Please login.");
        
        // Redirect to login page
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 2000);
    } catch (error) {
        window.appState.showFeedback(error.message, 'error');
    } finally {
        window.appState.ui.isLoading = false;
    }
}

/**
 * Logout and cleanup
 */
export function handleLogout() {
    Auth.logout();
    window.appState.user = null;
    window.location.href = 'index.html';
}
