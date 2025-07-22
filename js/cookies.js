/**
 * EMJ Consultoria - Cookie Consent Management
 * Handles GDPR/LGPD compliant cookie consent
 */

(function() {
  'use strict';

  const CookieManager = {
    // Configuration
    config: {
      consentKey: 'emj_cookie_consent',
      showDelay: 1200,
      fadeInDuration: 600,
      cookieExpiry: 365 // days
    },

    // DOM Elements
    elements: {
      banner: null,
      modal: null,
      acceptAllBtn: null,
      acceptSomeBtn: null,
      moreInfoBtn: null,
      modalCloseBtn: null
    },

    init() {
      this.cacheElements();
      this.bindEvents();
      this.checkConsentStatus();
    },

    cacheElements() {
      this.elements = {
        banner: document.getElementById('cookie-banner'),
        modal: document.getElementById('cookie-modal'),
        acceptAllBtn: document.getElementById('cookie-accept-all'),
        acceptSomeBtn: document.getElementById('cookie-accept-some'),
        moreInfoBtn: document.getElementById('cookie-more'),
        modalCloseBtn: document.getElementById('cookie-modal-close')
      };
    },

    bindEvents() {
      // Accept all cookies
      if (this.elements.acceptAllBtn) {
        this.elements.acceptAllBtn.addEventListener('click', (e) => {
          e.preventDefault();
          this.acceptCookies('all');
        });
      }

      // Accept essential cookies only
      if (this.elements.acceptSomeBtn) {
        this.elements.acceptSomeBtn.addEventListener('click', (e) => {
          e.preventDefault();
          this.acceptCookies('essentials');
        });
      }

      // Show more info modal
      if (this.elements.moreInfoBtn) {
        this.elements.moreInfoBtn.addEventListener('click', (e) => {
          e.preventDefault();
          this.showModal();
        });
      }

      // Close modal
      if (this.elements.modalCloseBtn) {
        this.elements.modalCloseBtn.addEventListener('click', () => {
          this.hideModal();
        });
      }

      // Close modal when clicking outside
      if (this.elements.modal) {
        this.elements.modal.addEventListener('click', (e) => {
          if (e.target === this.elements.modal) {
            this.hideModal();
          }
        });
      }

      // Keyboard navigation
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && this.isModalOpen()) {
          this.hideModal();
        }
      });
    },

    checkConsentStatus() {
      const consent = this.getStoredConsent();
      
      if (!consent && this.elements.banner) {
        setTimeout(() => {
          this.showBanner();
        }, this.config.showDelay);
      }
    },

    showBanner() {
      if (this.elements.banner) {
        this.elements.banner.style.display = 'flex';
        this.elements.banner.setAttribute('aria-hidden', 'false');
        
        // Focus management for accessibility
        const firstButton = this.elements.banner.querySelector('button');
        if (firstButton) {
          setTimeout(() => firstButton.focus(), 100);
        }
      }
    },

    hideBanner() {
      if (this.elements.banner) {
        this.elements.banner.style.display = 'none';
        this.elements.banner.setAttribute('aria-hidden', 'true');
      }
    },

    showModal() {
      if (this.elements.modal) {
        this.elements.modal.style.display = 'flex';
        this.elements.modal.setAttribute('aria-hidden', 'false');
        
        // Focus on close button for accessibility
        if (this.elements.modalCloseBtn) {
          this.elements.modalCloseBtn.focus();
        }
        
        // Prevent body scroll
        document.body.style.overflow = 'hidden';
      }
    },

    hideModal() {
      if (this.elements.modal) {
        this.elements.modal.style.display = 'none';
        this.elements.modal.setAttribute('aria-hidden', 'true');
        
        // Restore body scroll
        document.body.style.overflow = '';
        
        // Return focus to the trigger button
        if (this.elements.moreInfoBtn) {
          this.elements.moreInfoBtn.focus();
        }
      }
    },

    isModalOpen() {
      return this.elements.modal && 
             this.elements.modal.style.display === 'flex';
    },

    acceptCookies(type) {
      try {
        const consentData = {
          type: type,
          timestamp: new Date().toISOString(),
          version: '1.0'
        };

        // Store consent
        localStorage.setItem(
          this.config.consentKey, 
          JSON.stringify(consentData)
        );

        // Hide banner
        this.hideBanner();

        // Initialize analytics if full consent
        if (type === 'all') {
          this.initializeAnalytics();
        }

        // Dispatch custom event
        this.dispatchConsentEvent(type);

      } catch (error) {
        console.error('Erro ao salvar preferências de cookies:', error);
      }
    },

    getStoredConsent() {
      try {
        const stored = localStorage.getItem(this.config.consentKey);
        return stored ? JSON.parse(stored) : null;
      } catch (error) {
        console.error('Erro ao ler preferências de cookies:', error);
        return null;
      }
    },

    initializeAnalytics() {
      // Initialize Google Analytics or other tracking
      // Only if user has given full consent
      const consent = this.getStoredConsent();
      
      if (consent && consent.type === 'all') {
        // Example: Initialize GA4
        // gtag('config', 'GA_MEASUREMENT_ID');
        console.log('Analytics initialized with user consent');
      }
    },

    dispatchConsentEvent(type) {
      // Dispatch custom event for other scripts to listen
      const event = new CustomEvent('cookieConsentGiven', {
        detail: { type: type, timestamp: new Date().toISOString() }
      });
      
      window.dispatchEvent(event);
    },

    // Public method to check if analytics are allowed
    isAnalyticsAllowed() {
      const consent = this.getStoredConsent();
      return consent && consent.type === 'all';
    },

    // Public method to revoke consent (for privacy policy page)
    revokeConsent() {
      try {
        localStorage.removeItem(this.config.consentKey);
        location.reload(); // Reload to show banner again
      } catch (error) {
        console.error('Erro ao revogar consentimento:', error);
      }
    }
  };

  // Initialize when DOM is ready
  document.addEventListener('DOMContentLoaded', () => {
    try {
      CookieManager.init();
    } catch (error) {
      console.error('Erro na inicialização do gerenciador de cookies:', error);
    }
  });

  // Make CookieManager available globally if needed
  window.EMJCookieManager = CookieManager;

})();