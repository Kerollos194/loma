/**
 * Lo'ma — Main Application Script
 * 
 * This file handles global UI interactions across the site, including:
 * 1. Navbar scroll effects
 * 2. Mobile hamburger menu toggling
 * 3. Meal search filtering (on the new_meal page)
 */

document.addEventListener('DOMContentLoaded', initializeApp);

/**
 * Main initialization function.
 * Called when the DOM is fully loaded.
 */
function initializeApp() {
  initNavbarScroll();
  initMobileMenu();
  initMealSearch();
}

/**
 * Initializes the navbar scroll effect.
 * Adds a 'scrolled' class to the navbar when the page is scrolled down.
 */
function initNavbarScroll() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 10) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });
}

/**
 * Initializes the mobile hamburger menu interactions.
 * Handles opening/closing the menu, and closing it when clicking outside or on a link.
 */
function initMobileMenu() {
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');

  if (!hamburger || !mobileMenu) return;

  // Toggle menu when clicking the hamburger icon
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    mobileMenu.classList.toggle('open');
  });

  // Close menu when a navigation link is clicked
  const menuLinks = mobileMenu.querySelectorAll('a');
  menuLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Close menu when clicking outside of the menu and hamburger
  document.addEventListener('click', (event) => {
    const isClickInside = hamburger.contains(event.target) || mobileMenu.contains(event.target);
    if (!isClickInside) {
      closeMenu();
    }
  });

  /**
   * Helper function to close the mobile menu.
   */
  function closeMenu() {
    hamburger.classList.remove('active');
    mobileMenu.classList.remove('open');
  }
}

/**
 * Initializes the meal search functionality.
 * Filters meal cards based on user input matching the title or description.
 */
function initMealSearch() {
  const searchInput = document.getElementById('searchMeals');
  if (!searchInput) return;

  searchInput.addEventListener('input', (event) => {
    const searchTerm = event.target.value.toLowerCase();
    const mealCards = document.querySelectorAll('.card');

    mealCards.forEach(card => {
      const titleElement = card.querySelector('.meal-title');
      const descElement = card.querySelector('.meal-desc');
      
      const titleText = titleElement ? titleElement.textContent.toLowerCase() : '';
      const descText = descElement ? descElement.textContent.toLowerCase() : '';

      // Show card if title or description matches the search term, hide otherwise
      if (titleText.includes(searchTerm) || descText.includes(searchTerm)) {
        card.style.display = '';
      } else {
        card.style.display = 'none';
      }
    });
  });
}
