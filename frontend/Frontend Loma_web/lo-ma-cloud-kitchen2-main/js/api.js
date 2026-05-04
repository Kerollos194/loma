/**
 * Lo'ma API Service Layer
 * Centralized file for all backend communication via Spring Boot.
 * 
 * Maps to loma-backend_db schema:
 * - users, categories, restaurants, fresh_meals, returned_meals, orders, order_items
 */

'use strict';

const BASE_URL = "http://localhost:8080/api";

// In-memory token storage for security (cleared on refresh)
let token = null;

/**
 * Custom Error class for API failures
 */
class ApiError extends Error {
    constructor(status, message, data = null) {
        super(message);
        this.status = status;
        this.data = data;
        this.name = "ApiError";
    }
}

/**
 * Reusable request function for all API calls
 * @param {string} endpoint - API endpoint (e.g., "/meals")
 * @param {string} method - HTTP method (GET, POST, PUT, DELETE)
 * @param {object|null} data - Body data for POST/PUT requests
 * @returns {Promise<any>}
 */
async function request(endpoint, method = "GET", data = null) {
    const url = `${BASE_URL}${endpoint}`;
    
    const headers = {
        "Content-Type": "application/json",
        "Accept": "application/json"
    };

    // Automatically add Authorization header if token exists
    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    const options = {
        method,
        headers
    };

    if (data && (method === "POST" || method === "PUT" || method === "PATCH")) {
        options.body = JSON.stringify(data);
    }

    try {
        const response = await fetch(url, options);
        
        // Handle 204 No Content
        if (response.status === 204) return null;

        const result = await response.json().catch(() => ({}));

        if (!response.ok) {
            throw new ApiError(
                response.status, 
                result.message || result.error || "An unexpected error occurred", 
                result
            );
        }

        return result;
    } catch (error) {
        if (error instanceof ApiError) throw error;
        
        // Handle network errors or parsing errors
        console.error(`API Request Error [${method} ${endpoint}]:`, error);
        throw new ApiError(500, "Network error or server unreachable");
    }
}

/**
 * Authentication Namespace
 */
export const Auth = {
    /**
     * Login user and store token in memory
     * @param {string} email 
     * @param {string} password 
     */
    async login(email, password) {
        const result = await request("/auth/login", "POST", { email, password });
        if (result && result.token) {
            token = result.token;
            // Optionally: localStorage.setItem('loma_token', token); // For persistence if desired
        }
        return result;
    },

    /**
     * Register a new user (Customer or Restaurant)
     * @param {object} userData - { name, email, password, phone, role }
     */
    async register(userData) {
        return request("/auth/register", "POST", userData);
    },

    /**
     * Clear token from memory
     */
    logout() {
        token = null;
        // localStorage.removeItem('loma_token');
    }
};

/**
 * Users Namespace
 */
export const Users = {
    async getUserProfile() {
        return request("/users/me");
    },

    async updateUserProfile(userData) {
        return request("/users/me", "PUT", userData);
    }
};

/**
 * Meals Namespace (Fresh and Returned)
 */
export const Meals = {
    /**
     * Fetch all available fresh meals
     * Supports filtering by category or search term via backend
     */
    async getAllFreshMeals(params = {}) {
        const query = new URLSearchParams(params).toString();
        return request(`/meals/fresh${query ? `?${query}` : ""}`);
    },

    async getFreshMealById(id) {
        return request(`/meals/fresh/${id}`);
    },

    /**
     * Fetch all returned (discounted) meals
     */
    async getAllReturnedMeals() {
        return request("/meals/returned");
    },

    async getReturnedMealById(id) {
        return request(`/meals/returned/${id}`);
    },

    async getMealsByRestaurant(restaurantId) {
        return request(`/restaurants/${restaurantId}/meals`);
    }
};

/**
 * Restaurants Namespace
 */
export const Restaurants = {
    async getAll() {
        return request("/restaurants");
    },

    async getById(id) {
        return request(`/restaurants/${id}`);
    }
};

/**
 * Cart Namespace
 * These calls typically manage a server-side cart or sync local state
 */
export const Cart = {
    async getCart() {
        return request("/cart");
    },

    /**
     * @param {object} item - { meal_id, meal_type, quantity }
     */
    async addToCart(item) {
        return request("/cart/items", "POST", item);
    },

    async updateCartItem(itemId, quantity) {
        return request(`/cart/items/${itemId}`, "PUT", { quantity });
    },

    async removeCartItem(itemId) {
        return request(`/cart/items/${itemId}`, "DELETE");
    },

    async clearCart() {
        return request("/cart", "DELETE");
    }
};

/**
 * Orders Namespace
 */
export const Orders = {
    /**
     * @param {object} orderData - { delivery_address, payment_method, notes, items }
     */
    async createOrder(orderData) {
        return request("/orders", "POST", orderData);
    },

    async getUserOrders() {
        return request("/orders/my-orders");
    },

    async getOrderById(id) {
        return request(`/orders/${id}`);
    }
};

/**
 * General/Contact Namespace
 */
export const Contact = {
    async sendContactMessage(data) {
        return request("/contact", "POST", data);
    }
};

// Export individual modules if needed for specific imports
export default {
    Auth,
    Users,
    Meals,
    Restaurants,
    Cart,
    Orders,
    Contact,
    setToken: (t) => { token = t; }
};
