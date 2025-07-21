
/**
 * EMJ Consultoria - Main JavaScript Module
 * Handles slider functionality, mobile menu, and page interactions
 */

(function() {
  'use strict';

  // Modern browser check
  if (!window.addEventListener || !document.querySelector) {
    console.warn('Browser não suportado. Por favor, atualize seu navegador.');
    return;
  }

  // Slider Module
  const SliderModule = {
    init() {
      this.track = document.querySelector('.slider-track');
      this.cards = Array.from(document.querySelectorAll('.slider-card'));
      this.btnLeft = document.querySelector('.slider-btn.left');
      this.btnRight = document.querySelector('.slider-btn.right');
      this.indicators = document.querySelector('.slider-indicators');
      
      if (!this.track || !this.cards.length) return;
      
      this.current = 0;
      this.autoplayTimer = null;
      this.isDragging = false;
      this.startX = 0;
      this.scrollLeft = 0;
      
      this.bindEvents();
      this.updateSlider();
      this.startAutoplay();
    },

    visibleCards() {
      if (window.innerWidth < 600) return 1;
      if (window.innerWidth < 900) return 2;
      return 3;
    },

    renderIndicators() {
      if (!this.indicators) return;
      
      this.indicators.innerHTML = '';
      const maxSlides = Math.max(0, this.cards.length - this.visibleCards());
      
      for (let i = 0; i <= maxSlides; i++) {
        const dot = document.createElement('span');
        dot.className = 'dot' + (i === this.current ? ' active' : '');
        dot.setAttribute('tabindex', '0');
        dot.setAttribute('role', 'tab');
        dot.setAttribute('aria-label', `Ir para slide ${i + 1}`);
        dot.addEventListener('click', () => this.goTo(i));
        dot.addEventListener('keydown', e => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            this.goTo(i);
          }
        });
        this.indicators.appendChild(dot);
      }
    },

    updateSlider() {
      if (!this.cards[0]) return;
      
      const cardWidth = this.cards[0].offsetWidth + 24; // 24px gap
      this.track.style.transform = `translateX(-${this.current * cardWidth}px)`;
      
      this.cards.forEach((card, i) => {
        card.classList.toggle('active', i === this.current);
        card.setAttribute('aria-hidden', i !== this.current);
      });
      
      this.renderIndicators();
    },

    goTo(index) {
      const maxIndex = Math.max(0, this.cards.length - this.visibleCards());
      this.current = Math.max(0, Math.min(index, maxIndex));
      this.updateSlider();
      this.resetAutoplay();
    },

    prev() {
      const maxIndex = this.cards.length - this.visibleCards();
      this.current = this.current <= 0 ? maxIndex : this.current - 1;
      this.updateSlider();
      this.resetAutoplay();
    },

    next() {
      const maxIndex = this.cards.length - this.visibleCards();
      this.current = this.current >= maxIndex ? 0 : this.current + 1;
      this.updateSlider();
      this.resetAutoplay();
    },

    startAutoplay() {
      this.autoplayTimer = setInterval(() => this.next(), 5000);
    },

    stopAutoplay() {
      if (this.autoplayTimer) {
        clearInterval(this.autoplayTimer);
        this.autoplayTimer = null;
      }
    },

    resetAutoplay() {
      this.stopAutoplay();
      this.startAutoplay();
    },

    bindEvents() {
      // Button events
      if (this.btnLeft) this.btnLeft.addEventListener('click', () => this.prev());
      if (this.btnRight) this.btnRight.addEventListener('click', () => this.next());

      // Keyboard navigation
      this.track.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
          e.preventDefault();
          this.prev();
        }
        if (e.key === 'ArrowRight') {
          e.preventDefault();
          this.next();
        }
      });

      // Touch/swipe events
      this.track.addEventListener('touchstart', (e) => {
        this.isDragging = true;
        this.startX = e.touches[0].clientX;
        this.scrollLeft = this.current;
      }, { passive: true });

      this.track.addEventListener('touchmove', (e) => {
        if (!this.isDragging) return;
        const dx = e.touches[0].clientX - this.startX;
        if (Math.abs(dx) > 50) {
          if (dx < 0) this.next();
          else this.prev();
          this.isDragging = false;
        }
      }, { passive: true });

      this.track.addEventListener('touchend', () => {
        this.isDragging = false;
      });

      // Mouse events for autoplay
      this.track.addEventListener('mouseenter', () => this.stopAutoplay());
      this.track.addEventListener('mouseleave', () => this.startAutoplay());

      // Resize handler
      window.addEventListener('resize', () => {
        const maxIndex = Math.max(0, this.cards.length - this.visibleCards());
        if (this.current > maxIndex) this.current = maxIndex;
        this.updateSlider();
      });

      // Focus events for cards
      this.cards.forEach((card, index) => {
        card.addEventListener('focus', () => {
          this.goTo(index);
        });
      });
    }
  };



  // Header Scroll Module
  const HeaderScrollModule = {
    init() {
      this.header = document.querySelector('.header');
      this.lastScroll = 0;
      this.ticking = false;
      
      if (!this.header) return;
      
      this.bindEvents();
    },

    bindEvents() {
      window.addEventListener('scroll', () => {
        if (!this.ticking) {
          requestAnimationFrame(() => this.handleScroll());
          this.ticking = true;
        }
      }, { passive: true });
    },

    handleScroll() {
      const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
      
      if (currentScroll > this.lastScroll && currentScroll > 80) {
        this.header.classList.add('hide-on-scroll');
      } else {
        this.header.classList.remove('hide-on-scroll');
      }
      
      this.lastScroll = currentScroll;
      this.ticking = false;
    }
  };

  // Typewriter Effect Module
  const TypewriterModule = {
    init() {
      this.element = document.getElementById('typewriter');
      this.text = "EMJ Consultoria & Prestação de Serviços LDA";
      this.index = 0;
      this.typingTimer = null;
      
      if (!this.element) return;
      
      this.startTyping();
    },

    startTyping() {
      this.type();
    },

    type() {
      if (this.index <= this.text.length) {
        this.element.innerHTML = this.text.slice(0, this.index) + 
          '<span class="typewriter-cursor">|</span>';
        this.index++;
        this.typingTimer = setTimeout(() => this.type(), 55);
      } else {
        this.element.innerHTML = this.text;
        setTimeout(() => {
          this.index = 0;
          this.startTyping();
        }, 9000);
      }
    }
  };

  // Loader Module
  const LoaderModule = {
    init() {
      this.loader = document.getElementById('global-loader');
      this.minTime = 4000;
      this.startTime = Date.now();
      
      if (!this.loader) return;
      
      this.showLoader();
      this.bindEvents();
    },

    showLoader() {
      if (this.loader) this.loader.style.display = 'flex';
    },

    hideLoader() {
      if (this.loader) this.loader.style.display = 'none';
    },

    bindEvents() {
      window.addEventListener('load', () => {
        const elapsed = Date.now() - this.startTime;
        const delay = Math.max(0, this.minTime - elapsed);
        setTimeout(() => this.hideLoader(), delay);
      });
    }
  };

  // Error Handler
  const ErrorHandler = {
    init() {
      window.addEventListener('error', (e) => {
        console.error('JavaScript Error:', e.error);
      });

      window.addEventListener('unhandledrejection', (e) => {
        console.error('Unhandled Promise Rejection:', e.reason);
      });
    }
  };

  // Theme Toggle Module
  const ThemeToggleModule = {
    init() {
      this.toggle = document.getElementById('themeToggle');
      this.toggleMobile = document.getElementById('themeToggleMobile');
      this.icon = this.toggle?.querySelector('i');
      this.iconMobile = this.toggleMobile?.querySelector('i');
      
      if (!this.toggle && !this.toggleMobile) return;
      
      // Verificar tema salvo ou preferência do sistema
      this.currentTheme = localStorage.getItem('theme') || 
        (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
      
      this.applyTheme(this.currentTheme);
      this.bindEvents();
    },

    bindEvents() {
      if (this.toggle) {
        this.toggle.addEventListener('click', () => {
          this.toggleTheme();
        });
      }

      if (this.toggleMobile) {
        this.toggleMobile.addEventListener('click', () => {
          this.toggleTheme();
        });
      }

      // Escutar mudanças na preferência do sistema
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
          this.applyTheme(e.matches ? 'dark' : 'light');
        }
      });
    },

    toggleTheme() {
      this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
      this.applyTheme(this.currentTheme);
      localStorage.setItem('theme', this.currentTheme);
    },

    applyTheme(theme) {
      this.currentTheme = theme;
      document.documentElement.setAttribute('data-theme', theme);
      
      // Atualizar ícones
      const updateIcon = (icon, theme) => {
        if (icon) {
          if (theme === 'dark') {
            icon.className = 'bi bi-sun-fill';
          } else {
            icon.className = 'bi bi-moon-fill';
          }
        }
      };

      updateIcon(this.icon, theme);
      updateIcon(this.iconMobile, theme);

      // Dispatch evento personalizado para outros módulos
      document.dispatchEvent(new CustomEvent('themechange', { 
        detail: { theme: theme } 
      }));
    }
  };

  // Mobile Menu Module
  const MobileMenuModule = {
    init() {
      this.menuToggle = document.getElementById('mobileMenuToggle');
      this.mobileMenu = document.getElementById('mobileMenu');
      this.menuOverlay = document.getElementById('mobileMenuOverlay');
      this.menuLinks = document.querySelectorAll('.mobile-nav-list a');
      this.body = document.body;
      
      if (!this.menuToggle || !this.mobileMenu || !this.menuOverlay) return;
      
      this.bindEvents();
    },

    bindEvents() {
      // Toggle menu
      this.menuToggle.addEventListener('click', () => this.toggleMenu());

      // Close menu when clicking overlay
      this.menuOverlay.addEventListener('click', () => this.closeMenu());

      // Close menu when clicking links
      this.menuLinks.forEach(link => {
        link.addEventListener('click', () => this.closeMenu());
      });

      // Close menu on escape key
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && this.mobileMenu.classList.contains('active')) {
          this.closeMenu();
        }
      });

      // Close menu when clicking outside
      document.addEventListener('click', (e) => {
        if (this.mobileMenu.classList.contains('active') &&
            !this.mobileMenu.contains(e.target) &&
            !this.menuToggle.contains(e.target)) {
          this.closeMenu();
        }
      });

      // Handle window resize
      window.addEventListener('resize', () => {
        if (window.innerWidth > 900) {
          this.closeMenu();
        }
      });
    },

    toggleMenu() {
      const isOpen = this.mobileMenu.classList.toggle('active');
      this.menuToggle.classList.toggle('active', isOpen);
      this.menuOverlay.classList.toggle('active', isOpen);
      this.menuToggle.setAttribute('aria-expanded', isOpen);
      
      // Prevent body scroll when menu is open
      this.body.style.overflow = isOpen ? 'hidden' : '';

      // Focus management
      if (isOpen) {
        setTimeout(() => {
          const firstLink = this.mobileMenu.querySelector('a');
          if (firstLink) firstLink.focus();
        }, 300);
      }
    },

    closeMenu() {
      this.mobileMenu.classList.remove('active');
      this.menuToggle.classList.remove('active');
      this.menuOverlay.classList.remove('active');
      this.menuToggle.setAttribute('aria-expanded', 'false');
      this.body.style.overflow = '';
    }
  };

  // Initialize all modules when DOM is ready
  document.addEventListener('DOMContentLoaded', () => {
    try {
      ErrorHandler.init();
      ThemeToggleModule.init();
      MobileMenuModule.init();
      SliderModule.init();
      HeaderScrollModule.init();
      TypewriterModule.init();
      LoaderModule.init();
    } catch (error) {
      console.error('Erro na inicialização:', error);
    }
  });

})();