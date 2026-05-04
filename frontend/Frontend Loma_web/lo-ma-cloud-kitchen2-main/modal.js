/* ============================================================
   Lo'ma — Auth Modal (Login / Sign Up popup)
   Include this script in every page AFTER main.js
   ============================================================ */

(function () {
  'use strict';

  // --- 1. UI Components & State ---
  let DOM = {};

  /**
   * Injects the Modal HTML into the DOM and initializes references to its elements.
   */
  function initModalUI() {
    const modalHTML = getModalTemplate();
    document.body.insertAdjacentHTML('beforeend', modalHTML);

    DOM = {
      backdrop: document.getElementById('authModal'),
      box: document.querySelector('#authModal .modal-box'),
      closeBtn: document.getElementById('modalClose'),
      tabs: document.querySelectorAll('#authModal .modal-tab'),
      forms: document.querySelectorAll('#authModal .modal-form'),
      successEl: document.getElementById('modal-success'),
      loginForm: document.getElementById('loginForm'),
      signupForm: document.getElementById('signupForm'),
      switchLinks: document.querySelectorAll('#authModal .modal-switch-link'),
    };
  }

  // --- 2. Modal Core Logic (Open/Close/Switch) ---

  /**
   * Opens the authentication modal.
   * @param {string} tab - The tab to open initially ('login' or 'signup').
   */
  function openModal(tab = 'login') {
    switchTab(tab);
    DOM.successEl.classList.remove('show');
    DOM.backdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
    
    // Focus the first input field after animation completes
    setTimeout(() => {
      const firstInput = DOM.backdrop.querySelector('.modal-form.active .modal-input');
      if (firstInput) firstInput.focus();
    }, 350);
  }

  /**
   * Closes the authentication modal.
   */
  function closeModal() {
    DOM.backdrop.classList.remove('open');
    document.body.style.overflow = '';
  }

  /**
   * Switches the active tab within the modal.
   * @param {string} tabName - The name of the tab to activate ('login' or 'signup').
   */
  function switchTab(tabName) {
    DOM.tabs.forEach(tab => tab.classList.toggle('active', tab.dataset.tab === tabName));
    DOM.forms.forEach(form => form.classList.toggle('active', form.id === `modal-${tabName}`));
    DOM.successEl.classList.remove('show');
  }

  // --- 3. Event Binding ---

  /**
   * Binds all core modal events (tabs, closing, keyboard support).
   */
  function bindModalEvents() {
    // Tab switching
    DOM.tabs.forEach(tab => {
      tab.addEventListener('click', () => switchTab(tab.dataset.tab));
    });

    // Switch links inside forms
    DOM.switchLinks.forEach(btn => {
      btn.addEventListener('click', () => switchTab(btn.dataset.open));
    });

    // Close triggers
    DOM.closeBtn.addEventListener('click', closeModal);
    
    DOM.backdrop.addEventListener('click', (e) => {
      if (e.target === DOM.backdrop) closeModal();
    });
    
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && DOM.backdrop.classList.contains('open')) closeModal();
    });

    // Reset tabs visibility when modal finishes closing
    DOM.backdrop.addEventListener('transitionend', () => {
      if (!DOM.backdrop.classList.contains('open')) {
        DOM.tabs.forEach(tab => tab.style.display = '');
      }
    });
  }

  /**
   * Sets up password visibility toggles.
   * @param {string} inputId - ID of the password input.
   * @param {string} iconId - ID of the toggle icon.
   */
  function setupPasswordToggle(inputId, iconId) {
    const icon = document.getElementById(iconId);
    if (!icon) return;
    
    icon.addEventListener('click', () => {
      const input = document.getElementById(inputId);
      const isHidden = input.type === 'password';
      input.type = isHidden ? 'text' : 'password';
      icon.classList.toggle('fa-eye', !isHidden);
      icon.classList.toggle('fa-eye-slash', isHidden);
    });
  }

  // --- 4. Form Handling ---

  /**
   * Displays the success message within the modal.
   * @param {string} title - The success title.
   * @param {string} msg - The success description.
   */
  function displaySuccessMessage(title, msg) {
    DOM.forms.forEach(form => form.classList.remove('active'));
    DOM.tabs.forEach(tab => tab.style.display = 'none');
    
    DOM.successEl.querySelector('#success-title').textContent = title;
    DOM.successEl.querySelector('#success-msg').textContent = msg;
    DOM.successEl.classList.add('show');
    
    setTimeout(closeModal, 2200);
  }

  /**
   * Binds form submission events to use the real API layer.
   */
  function bindFormSubmissions() {
    DOM.loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('m-email').value;
      const password = document.getElementById('m-pwd').value;

      try {
        if (!window.API) throw new Error("API layer not loaded");
        const result = await window.API.Auth.login(email, password);
        
        if (window.appState) window.appState.user = result.user;
        
        displaySuccessMessage('Welcome back! 👋', `You've successfully logged in as ${result.user.name}.`);
        
        // Refresh or redirect after success
        setTimeout(() => window.location.reload(), 2000);
      } catch (error) {
        alert(error.message);
      }
    });

    DOM.signupForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = document.getElementById('m-name').value;
      const email = document.getElementById('m-semail').value;
      const password = document.getElementById('m-spwd').value;
      const confirm = document.getElementById('m-cpwd').value;

      if (password !== confirm) {
        alert("Passwords do not match!");
        return;
      }

      try {
        if (!window.API) throw new Error("API layer not loaded");
        // Default role to customer for modal signup
        await window.API.Auth.register({ name, email, password, role: 'customer' });
        
        displaySuccessMessage('Account Created! 🎉', "Your Lo'ma account has been created. Please log in.");
        switchTab('login');
      } catch (error) {
        alert(error.message);
      }
    });
  }

  // --- 5. Global Triggers Integration ---

  /**
   * Attaches modal open handlers to any element with the `data-modal` attribute.
   */
  function wireDataModalTriggers() {
    document.querySelectorAll('[data-modal]').forEach(element => {
      element.addEventListener('click', (e) => {
        e.preventDefault();
        openModal(element.dataset.modal);
      });
    });
  }

  /**
   * Patches traditional login/signup links (e.g., href="login.html") 
   * to open the modal instead of navigating away.
   */
  function patchPageLinks() {
    document.querySelectorAll('a').forEach(link => {
      const href = (link.getAttribute('href') || '').toLowerCase();
      
      if (href === 'login.html' || href === 'signup.html') {
        const tabName = href === 'login.html' ? 'login' : 'signup';
        link.setAttribute('href', '#');
        link.setAttribute('data-modal', tabName);
        
        link.addEventListener('click', (e) => {
          e.preventDefault();
          openModal(tabName);
        });
      }
    });
  }

  // --- 6. Bootstrapping ---

  /**
   * Initializes the modal functionality on page load.
   */
  function init() {
    initModalUI();
    bindModalEvents();
    
    setupPasswordToggle('m-pwd', 'm-togglePwd');
    setupPasswordToggle('m-spwd', 'm-toggleSpwd');
    setupPasswordToggle('m-cpwd', 'm-toggleCpwd');
    
    bindFormSubmissions();
    wireDataModalTriggers();
    patchPageLinks();
    
    // Expose API globally
    window.lomaModal = { open: openModal, close: closeModal };
  }

  /**
   * Returns the static HTML template string for the modal.
   * @returns {string} The HTML structure of the auth modal.
   */
  function getModalTemplate() {
    return `
      <div class="modal-backdrop" id="authModal" role="dialog" aria-modal="true" aria-label="Authentication">
        <div class="modal-box">
          <button class="modal-close" id="modalClose" aria-label="Close"><i class="fas fa-times"></i></button>

          <div class="modal-logo"><a href="index.html">Lo'<span>ma</span></a></div>

          <!-- Tabs -->
          <div class="modal-tabs">
            <button class="modal-tab active" data-tab="login">Log In</button>
            <button class="modal-tab"        data-tab="signup">Sign Up</button>
          </div>

          <!-- ── LOGIN FORM ── -->
          <div class="modal-form active" id="modal-login">
            <form id="loginForm" novalidate>
              <div class="modal-form-group">
                <label for="m-email">Email address</label>
                <div class="modal-input-wrap">
                  <input type="email" id="m-email" class="modal-input" placeholder="you@example.com" required/>
                  <i class="fas fa-envelope"></i>
                </div>
              </div>
              <div class="modal-form-group">
                <label for="m-pwd">Password</label>
                <div class="modal-input-wrap">
                  <input type="password" id="m-pwd" class="modal-input" placeholder="Enter your password" required/>
                  <i class="fas fa-eye" id="m-togglePwd"></i>
                </div>
              </div>
              <div class="modal-row">
                <label class="modal-check"><input type="checkbox"/> Remember me</label>
                <a href="#" class="modal-forgot">Forgot password?</a>
              </div>
              <button type="submit" class="modal-btn">Log In</button>
            </form>
            <div class="modal-divider">or continue with</div>
            <div class="modal-social">
              <button class="modal-social-btn"><i class="fab fa-google" style="color:#ea4335"></i> Google</button>
              <button class="modal-social-btn"><i class="fab fa-facebook" style="color:#1877f2"></i> Facebook</button>
            </div>
            <p class="modal-switch">Don't have an account? <button class="modal-switch-link" data-open="signup">Sign Up</button></p>
          </div>

          <!-- ── SIGNUP FORM ── -->
          <div class="modal-form" id="modal-signup">
            <form id="signupForm" novalidate>
              <div class="modal-form-group">
                <label for="m-name">Full Name</label>
                <div class="modal-input-wrap">
                  <input type="text" id="m-name" class="modal-input" placeholder="John Doe" required/>
                  <i class="fas fa-user"></i>
                </div>
              </div>
              <div class="modal-form-group">
                <label for="m-semail">Email address</label>
                <div class="modal-input-wrap">
                  <input type="email" id="m-semail" class="modal-input" placeholder="you@example.com" required/>
                  <i class="fas fa-envelope"></i>
                </div>
              </div>
              <div class="modal-form-group">
                <label for="m-spwd">Password</label>
                <div class="modal-input-wrap">
                  <input type="password" id="m-spwd" class="modal-input" placeholder="Create a strong password" required/>
                  <i class="fas fa-eye" id="m-toggleSpwd"></i>
                </div>
              </div>
              <div class="modal-form-group">
                <label for="m-cpwd">Confirm Password</label>
                <div class="modal-input-wrap">
                  <input type="password" id="m-cpwd" class="modal-input" placeholder="Repeat your password" required/>
                  <i class="fas fa-eye" id="m-toggleCpwd"></i>
                </div>
              </div>
              <div class="modal-form-group" style="margin-bottom:20px">
                <label class="modal-check"><input type="checkbox" required/> I agree to the <a href="#" style="color:var(--green-mid);font-weight:600">Terms &amp; Privacy</a></label>
              </div>
              <button type="submit" class="modal-btn">Create Account</button>
            </form>
            <div class="modal-divider">or sign up with</div>
            <div class="modal-social">
              <button class="modal-social-btn"><i class="fab fa-google" style="color:#ea4335"></i> Google</button>
              <button class="modal-social-btn"><i class="fab fa-facebook" style="color:#1877f2"></i> Facebook</button>
            </div>
            <p class="modal-switch">Already have an account? <button class="modal-switch-link" data-open="login">Log In</button></p>
          </div>

          <!-- ── SUCCESS ── -->
          <div class="modal-success" id="modal-success">
            <div class="modal-success-icon"><i class="fas fa-check"></i></div>
            <h3 id="success-title">Welcome back!</h3>
            <p id="success-msg">You've successfully logged in.</p>
          </div>
        </div>
      </div>`;
  }

  // Execute initialization
  init();

})();
