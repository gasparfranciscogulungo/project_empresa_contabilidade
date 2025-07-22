/**
 * EMJ Consultoria - Main JavaScript Module
 * Versão simplificada e funcional
 */

(function() {
  'use strict';

  // Loader Module - CORRIGIDO
  const LoaderModule = {
    init() {
      const loader = document.getElementById('global-loader');
      
      if (!loader) {
        console.warn('Loader element not found');
        return;
      }
      
      // Esconder loader após 4 segundos
      setTimeout(() => {
        loader.style.display = 'none';
        console.log('✅ Loader escondido após 4 segundos');
      }, 4000);
    }
  };

  // Theme Toggle Module
  const ThemeToggleModule = {
    init() {
      this.toggle = document.getElementById('themeToggle');
      this.toggleMobile = document.getElementById('themeToggleMobile');
      this.currentTheme = localStorage.getItem('theme') || 'light';
      
      this.applyTheme(this.currentTheme);
      this.bindEvents();
    },

    bindEvents() {
      if (this.toggle) {
        this.toggle.addEventListener('click', () => this.toggleTheme());
      }
      if (this.toggleMobile) {
        this.toggleMobile.addEventListener('click', () => this.toggleTheme());
      }
    },

    toggleTheme() {
      this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
      this.applyTheme(this.currentTheme);
      localStorage.setItem('theme', this.currentTheme);
    },

    applyTheme(theme) {
      document.documentElement.setAttribute('data-theme', theme);
      const icon = theme === 'dark' ? 'bi-sun-fill' : 'bi-moon-fill';
      
      if (this.toggle) {
        this.toggle.innerHTML = `<i class="bi ${icon}"></i>`;
      }
      if (this.toggleMobile) {
        this.toggleMobile.innerHTML = `<i class="bi ${icon}"></i>`;
      }
    }
  };

  // Mobile Menu Module
  const MobileMenuModule = {
    init() {
      this.menuToggle = document.getElementById('mobileMenuToggle');
      this.mobileMenu = document.getElementById('mobileMenu');
      this.menuOverlay = document.getElementById('mobileMenuOverlay');
      this.body = document.body;
      
      if (!this.menuToggle || !this.mobileMenu) return;
      
      this.bindEvents();
    },

    bindEvents() {
      this.menuToggle.addEventListener('click', () => this.toggleMenu());
      
      if (this.menuOverlay) {
        this.menuOverlay.addEventListener('click', () => this.closeMenu());
      }
      
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') this.closeMenu();
      });
    },

    toggleMenu() {
      const isActive = this.mobileMenu.classList.contains('active');
      
      if (isActive) {
        this.closeMenu();
      } else {
        this.openMenu();
      }
    },

    openMenu() {
      this.mobileMenu.classList.add('active');
      this.menuToggle.classList.add('active');
      if (this.menuOverlay) this.menuOverlay.classList.add('active');
      this.body.style.overflow = 'hidden';
    },

    closeMenu() {
      this.mobileMenu.classList.remove('active');
      this.menuToggle.classList.remove('active');
      if (this.menuOverlay) this.menuOverlay.classList.remove('active');
      this.body.style.overflow = '';
    }
  };

  // Slider Module - Touch restrito aos cards dos Destaques
  const SliderModule = {
    init() {
      this.track = document.querySelector('.slider-section#servicos .slider-track');
      this.cards = Array.from(document.querySelectorAll('.slider-section#servicos .slider-card'));
      this.btnLeft = document.querySelector('.slider-section#servicos .slider-btn.left');
      this.btnRight = document.querySelector('.slider-section#servicos .slider-btn.right');
      this.container = document.querySelector('.slider-section#servicos');
      
      if (!this.track || !this.cards.length || !this.container) return;
      
      this.current = 0;
      this.touchStartX = 0;
      this.touchEndX = 0;
      this.isMobile = window.innerWidth <= 768;
      this.isTransitioning = false;
      
      this.createCounter();
      this.bindEvents();
      this.updateSlider();
    },

    createCounter() {
      // Criar contador centralizado - estilos agora no CSS
      const counterContainer = document.createElement('div');
      counterContainer.className = 'slider-counter-display';
      counterContainer.innerHTML = `
        <span class="counter-current">1</span>
        <span class="counter-separator">de</span>
        <span class="counter-total">${this.getTotalSlides()}</span>
      `;
      
      this.counterCurrent = counterContainer.querySelector('.counter-current');
      this.counterTotal = counterContainer.querySelector('.counter-total');
      this.container.appendChild(counterContainer);
    },

    getTotalSlides() {
      const visibleCards = this.visibleCards();
      return Math.max(1, this.cards.length - visibleCards + 1);
    },

    bindEvents() {
      // Eventos dos botões
      if (this.btnLeft) {
        this.btnLeft.addEventListener('click', () => this.prevSlide());
      }
      if (this.btnRight) {
        this.btnRight.addEventListener('click', () => this.nextSlide());
      }

      // Touch events APENAS para o slider track específico da seção de destaques
      if (this.track && this.container) {
        // Verificar se é realmente o slider dos destaques
        const isDestaquesSlider = this.container.id === 'servicos';
        
        if (isDestaquesSlider) {
          this.track.addEventListener('touchstart', (e) => {
            // Verificar se o toque foi nos cards e não em outros elementos
            const touchedElement = e.target.closest('.slider-card');
            if (!touchedElement) return;
            
            // Prevenir propagação para não afetar outros elementos
            e.stopPropagation();
            e.preventDefault();
            this.touchStartX = e.touches[0].clientX;
            this.track.style.transition = 'none';
          }, { passive: false });

          this.track.addEventListener('touchmove', (e) => {
            // Verificar se o toque foi nos cards
            const touchedElement = e.target.closest('.slider-card');
            if (!touchedElement || !this.touchStartX) return;
            
            // Prevenir propagação e scroll da página
            e.stopPropagation();
            e.preventDefault();
            
            const currentX = e.touches[0].clientX;
            const diff = this.touchStartX - currentX;
            const maxPreview = 30;
            
            // Preview visual do movimento
            if (Math.abs(diff) > 10) {
              const previewOffset = Math.max(-maxPreview, Math.min(maxPreview, -diff * 0.3));
              const currentOffset = this.current * (this.cards[0]?.offsetWidth + 24 || 294);
              this.track.style.transform = `translateX(-${currentOffset + previewOffset}px)`;
            }
          }, { passive: false });

          this.track.addEventListener('touchend', (e) => {
            // Verificar se o toque foi nos cards
            const touchedElement = e.target.closest('.slider-card');
            if (!touchedElement) return;
            
            // Prevenir propagação para não afetar outros elementos
            e.stopPropagation();
            e.preventDefault();
            this.touchEndX = e.changedTouches[0].clientX;
            this.track.style.transition = 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            this.handleTouch();
          }, { passive: false });
        }
      }

      // Responsive resize
      window.addEventListener('resize', () => {
        this.updateSlider();
        this.updateCounter();
      });
    },

    handleTouch() {
      const swipeThreshold = 50;
      const diff = this.touchStartX - this.touchEndX;
      
      if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
          this.nextSlide(); // Swipe left = próximo
        } else {
          this.prevSlide(); // Swipe right = anterior
        }
      } else {
        // Voltar à posição original se não houve swipe suficiente
        this.updateSlider();
      }
    },

    prevSlide() {
      if (this.isTransitioning) return;
      this.current = Math.max(0, this.current - 1);
      this.updateSlider();
    },

    nextSlide() {
      if (this.isTransitioning) return;
      const maxSlides = this.getTotalSlides() - 1;
      this.current = Math.min(maxSlides, this.current + 1);
      this.updateSlider();
    },

    visibleCards() {
      if (window.innerWidth < 600) return 1;
      if (window.innerWidth < 900) return 2;
      return 3;
    },

    updateSlider() {
      this.isTransitioning = true;
      
      const cardWidth = this.cards[0]?.offsetWidth || 270;
      const gap = 24;
      const offset = this.current * (cardWidth + gap);
      
      this.track.style.transition = 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
      this.track.style.transform = `translateX(-${offset}px)`;
      
      this.updateCounter();
      
      // Reset flag após transição
      setTimeout(() => {
        this.isTransitioning = false;
      }, 500);
    },

    updateCounter() {
      if (this.counterCurrent) {
        this.counterCurrent.textContent = this.current + 1;
      }
      if (this.counterTotal) {
        this.counterTotal.textContent = this.getTotalSlides();
      }
    }
  };

  // Typewriter Effect - Otimizado para Mobile
  const TypewriterModule = {
    init() {
      this.element = document.getElementById('typewriter');
      if (!this.element) return;
      
      this.isMobile = window.innerWidth <= 768;
      
      this.texts = [
        'Soluções Empresariais Especializadas',
        'Consultoria de Contabilidade',
        'Consultoria de Fiscalidade',
        'Gestão de Recursos Humanos',
        'Assessoria Jurídica Empresarial'
      ];
      this.currentIndex = 0;
      this.charIndex = 0;
      this.isDeleting = false;
      
      this.startTyping();
    },

    startTyping() {
      const currentText = this.texts[this.currentIndex];
      
      if (this.isDeleting) {
        this.element.textContent = currentText.substring(0, this.charIndex - 1);
        this.charIndex--;
      } else {
        this.element.textContent = currentText.substring(0, this.charIndex + 1);
        this.charIndex++;
      }

      // Velocidades otimizadas para mobile
      let typeSpeed = this.isDeleting ? 
        (this.isMobile ? 40 : 50) : 
        (this.isMobile ? 80 : 100);

      if (!this.isDeleting && this.charIndex === currentText.length) {
        typeSpeed = this.isMobile ? 1500 : 2000; // Pausa menor no mobile
        this.isDeleting = true;
      } else if (this.isDeleting && this.charIndex === 0) {
        this.isDeleting = false;
        this.currentIndex = (this.currentIndex + 1) % this.texts.length;
        typeSpeed = this.isMobile ? 300 : 500; // Transição mais rápida no mobile
      }

      setTimeout(() => this.startTyping(), typeSpeed);
    }
  };

  // Header Scroll Effect
  const HeaderScrollModule = {
    init() {
      this.header = document.querySelector('.header');
      if (!this.header) return;
      
      window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
          this.header.classList.add('scrolled');
        } else {
          this.header.classList.remove('scrolled');
        }
      });
    }
  };

  // Scroll Animations - Otimizado para Mobile
  const ScrollAnimationModule = {
    init() {
      this.isMobile = window.innerWidth <= 768;
      this.observerOptions = {
        root: null,
        rootMargin: this.isMobile ? '0px 0px -50px 0px' : '0px 0px -100px 0px',
        threshold: this.isMobile ? 0.05 : 0.1
      };
      
      this.setupObserver();
      this.addAnimationClasses();
      this.optimizeForMobile();
    },

    optimizeForMobile() {
      if (this.isMobile) {
        // Reduzir animações em dispositivos móveis para melhor performance
        const style = document.createElement('style');
        style.textContent = `
          @media (max-width: 768px) {
            .animate-on-scroll {
              transition-duration: 0.4s !important;
            }
            .floating-particle-mobile,
            .floating-shape-mobile {
              animation-duration: 6s !important;
            }
          }
        `;
        document.head.appendChild(style);
      }
    },

    addAnimationClasses() {
      const delayMultiplier = this.isMobile ? 0.05 : 0.1; // Delays menores no mobile
      
      // About cards
      const aboutCards = document.querySelectorAll('.about-card');
      aboutCards.forEach((card, index) => {
        card.classList.add('animate-on-scroll', 'fade-up');
        card.style.transitionDelay = `${index * delayMultiplier}s`;
      });

      // Slider cards
      const sliderCards = document.querySelectorAll('.slider-card');
      sliderCards.forEach((card, index) => {
        card.classList.add('animate-on-scroll', 'scale-in');
        card.style.transitionDelay = `${index * delayMultiplier}s`;
      });

      // Cliente cards
      const clienteCards = document.querySelectorAll('.cliente-card');
      clienteCards.forEach((card, index) => {
        card.classList.add('animate-on-scroll', 'fade-up');
        card.style.transitionDelay = `${index * delayMultiplier}s`;
      });

      // Títulos
      const titles = document.querySelectorAll('.about-title, .slider-title, .clientes-title');
      titles.forEach(title => {
        title.classList.add('animate-on-scroll', 'fade-up');
      });
    },

    setupObserver() {
      this.observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animated');
            this.observer.unobserve(entry.target);
          }
        });
      }, this.observerOptions);

      // Observar elementos com delay otimizado
      const observerDelay = this.isMobile ? 300 : 500;
      setTimeout(() => {
        const elements = document.querySelectorAll('.animate-on-scroll');
        elements.forEach(el => this.observer.observe(el));
      }, observerDelay);
    }
  };

  // Advanced Animations Module - Otimizado para Mobile
  const AdvancedAnimationsModule = {
    init() {
      // Detectar se é mobile para reduzir animações pesadas
      this.isMobile = window.innerWidth <= 768 || /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      
      if (this.isMobile) {
        this.createMobileOptimizedAnimations();
      } else {
        this.createDesktopAnimations();
      }
      
      this.enhanceFormAnimations();
    },

    createMobileOptimizedAnimations() {
      // Partículas reduzidas para mobile
      const heroSection = document.querySelector('.hero-section');
      if (!heroSection) return;

      for (let i = 0; i < 5; i++) { // Menos partículas no mobile
        const particle = document.createElement('div');
        particle.className = 'floating-particle-mobile';
        particle.style.cssText = `
          width: ${Math.random() * 4 + 3}px;
          height: ${Math.random() * 4 + 3}px;
          left: ${Math.random() * 100}%;
          top: ${Math.random() * 100}%;
          animation-delay: ${Math.random() * 2}s;
        `;
        heroSection.appendChild(particle);
      }

      // Elementos flutuantes simplificados para mobile
      const agendamentoSection = document.querySelector('.agendamento-section');
      if (!agendamentoSection) return;

      for (let i = 0; i < 3; i++) { // Menos elementos no mobile
        const shape = document.createElement('div');
        shape.className = 'floating-shape-mobile';
        shape.style.cssText = `
          width: ${Math.random() * 20 + 15}px;
          height: ${Math.random() * 20 + 15}px;
          left: ${Math.random() * 100}%;
          top: ${Math.random() * 100}%;
          opacity: ${Math.random() * 0.2 + 0.05};
          animation-delay: ${Math.random() * 2}s;
        `;
        agendamentoSection.appendChild(shape);
      }
    },

    createDesktopAnimations() {
      // Animações completas para desktop
      const heroSection = document.querySelector('.hero-section');
      if (!heroSection) return;

      for (let i = 0; i < 12; i++) {
        const particle = document.createElement('div');
        particle.className = 'floating-particle-desktop';
        particle.style.cssText = `
          width: ${Math.random() * 6 + 4}px;
          height: ${Math.random() * 6 + 4}px;
          left: ${Math.random() * 100}%;
          top: ${Math.random() * 100}%;
          animation-delay: ${Math.random() * 2}s;
        `;
        heroSection.appendChild(particle);
      }

      const agendamentoSection = document.querySelector('.agendamento-section');
      if (!agendamentoSection) return;

      const shapes = ['circle', 'triangle', 'square'];
      
      for (let i = 0; i < 6; i++) {
        const shape = document.createElement('div');
        const shapeType = shapes[Math.floor(Math.random() * shapes.length)];
        
        shape.className = `floating-shape-desktop floating-${shapeType}`;
        shape.style.cssText = `
          width: ${Math.random() * 40 + 20}px;
          height: ${Math.random() * 40 + 20}px;
          left: ${Math.random() * 100}%;
          top: ${Math.random() * 100}%;
          opacity: ${Math.random() * 0.3 + 0.1};
          animation-delay: ${Math.random() * 3}s;
        `;

        agendamentoSection.appendChild(shape);
      }
    },

    enhanceFormAnimations() {
      const formInputs = document.querySelectorAll('.form-group-float input, .form-group-float textarea, .form-group-float select');
      
      formInputs.forEach((input, index) => {
        // Animação de entrada otimizada
        input.style.opacity = '0';
        input.style.transform = 'translateY(20px)';
        
        const delay = this.isMobile ? index * 150 : index * 100; // Delay maior no mobile
        
        setTimeout(() => {
          input.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
          input.style.opacity = '1';
          input.style.transform = 'translateY(0)';
        }, delay);

        // Efeitos suaves para mobile
        if (this.isMobile) {
          input.addEventListener('focus', function() {
            this.parentElement.style.transform = 'scale(1.01)';
            this.parentElement.style.transition = 'transform 0.2s ease';
          });

          input.addEventListener('blur', function() {
            this.parentElement.style.transform = 'scale(1)';
          });
        } else {
          // Efeitos mais intensos para desktop
          input.addEventListener('focus', function() {
            this.parentElement.style.transform = 'scale(1.02)';
            this.parentElement.style.transition = 'transform 0.3s ease';
          });

          input.addEventListener('blur', function() {
            this.parentElement.style.transform = 'scale(1)';
          });
        }
      });

      // Animação no botão de submit
      const submitBtn = document.querySelector('.modern-submit');
      if (submitBtn) {
        // Apenas efeitos de mouse para todos os dispositivos
        submitBtn.addEventListener('mouseenter', function() {
          this.style.transform = 'translateY(-3px) scale(1.05)';
          this.style.boxShadow = '0 12px 30px rgba(0, 123, 255, 0.4)';
          this.style.transition = 'all 0.3s ease';
        });

        submitBtn.addEventListener('mouseleave', function() {
          this.style.transform = 'translateY(0) scale(1)';
          this.style.boxShadow = '0 4px 15px rgba(59, 130, 246, 0.3)';
        });
      }
    }
  };

  // Performance Optimization Module
  const PerformanceModule = {
    init() {
      this.checkPerformance();
      this.addMobileOptimizations();
    },

    checkPerformance() {
      // Detectar dispositivos de baixa performance
      const isLowEnd = navigator.hardwareConcurrency <= 2 || 
                      navigator.deviceMemory <= 4 ||
                      /Android.*Chrome/.test(navigator.userAgent);
      
      if (isLowEnd) {
        this.applyLowEndOptimizations();
      }
    },

    applyLowEndOptimizations() {
      // Reduzir animações para dispositivos de baixa performance
      const style = document.createElement('style');
      style.textContent = `
        .floating-particle-mobile,
        .floating-shape-mobile,
        .floating-particle-desktop,
        .floating-shape-desktop {
          animation-duration: 8s !important;
          opacity: 0.3 !important;
        }
        .animate-on-scroll {
          transition-duration: 0.3s !important;
        }
      `;
      document.head.appendChild(style);
    },

    addMobileOptimizations() {
      // Otimizações específicas para mobile
      if (window.innerWidth <= 768) {
        // Reduzir refresh rate de animações
        document.documentElement.style.setProperty('--animation-speed', '0.5');
        
        // Pausar animações quando a aba não está ativa
        document.addEventListener('visibilitychange', () => {
          const elements = document.querySelectorAll('[class*="floating-"]');
          elements.forEach(el => {
            if (document.hidden) {
              el.style.animationPlayState = 'paused';
            } else {
              el.style.animationPlayState = 'running';
            }
          });
        });
      }
    }
  };

  // Inicialização da aplicação - Otimizada
  document.addEventListener('DOMContentLoaded', function() {
    try {
      console.log('🚀 Iniciando aplicação otimizada...');
      
      // Módulos essenciais primeiro
      LoaderModule.init();
      PerformanceModule.init();
      ThemeToggleModule.init();
      
      // Delay para módulos secundários em mobile
      const isMobile = window.innerWidth <= 768;
      const delay = isMobile ? 100 : 0;
      
      setTimeout(() => {
        MobileMenuModule.init();
        SliderModule.init();
        TypewriterModule.init();
        HeaderScrollModule.init();
        ScrollAnimationModule.init();
        AdvancedAnimationsModule.init();
        
        console.log('✅ Todos os módulos inicializados com sucesso!');
      }, delay);
      
    } catch (error) {
      console.error('❌ Erro na inicialização:', error);
    }
  });

})();
