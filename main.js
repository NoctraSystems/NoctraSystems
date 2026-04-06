/**
 * Noctra Systems - Main JavaScript (Nível Sênior)
 * Performance otimizada para 60+ FPS
 * 
 * Módulos:
 * - Particle Canvas Background
 * - Scroll Progress Bar
 * - Scroll Reveal & Animations
 * - Counter Animation
 * - About Stats Animation
 * - Accordion Component
 * - Modal Component
 * - Toggle Switch
 * - Mobile Menu
 * - Smooth Scroll
 * - Horizontal Drag Scroll
 * - Ripple Effect
 * - Active Link Tracker
 * - Typewriter Effect
 * - Performance Optimizations
 */

(function() {
    'use strict';

    // =========================================================================
    // CONFIGURAÇÕES GLOBAIS
    // =========================================================================
    const CONFIG = {
        SCROLL_REVEAL_THRESHOLD: 0.1,
        COUNTER_THRESHOLD: 0.5,
        SCROLL_OFFSET: 120,
        RIPPLE_DURATION: 600,
        TYPEWRITER_INTERVAL: 4000,
        RESIZE_DEBOUNCE_DELAY: 250,
        PARTICLE_COUNT: 60,
        PARTICLE_COLOR: '#8B0000'
    };

    // =========================================================================
    // UTILITÁRIOS
    // =========================================================================
    const Utils = {
        debounce(func, delay) {
            let timeoutId;
            return function(...args) {
                clearTimeout(timeoutId);
                timeoutId = setTimeout(() => func.apply(this, args), delay);
            };
        },

        throttle(func, limit) {
            let inThrottle;
            let lastFunc;
            let lastRan;
            return function(...args) {
                if (!inThrottle) {
                    func.apply(this, args);
                    lastRan = Date.now();
                    inThrottle = true;
                    setTimeout(() => inThrottle = false, limit);
                } else {
                    clearTimeout(lastFunc);
                    lastFunc = setTimeout(() => {
                        if ((Date.now() - lastRan) >= limit) {
                            func.apply(this, args);
                            lastRan = Date.now();
                        }
                    }, limit - (Date.now() - lastRan));
                }
            };
        },

        getElementSafe(selector, context = document) {
            const element = context.querySelector(selector);
            if (!element && !selector.includes('ripple')) {
                console.warn(`Elemento não encontrado: ${selector}`);
            }
            return element;
        },

        getAllElementsSafe(selector, context = document) {
            return context.querySelectorAll(selector);
        },

        hasClass(element, className) {
            return element && element.classList.contains(className);
        },

        addClass(element, className) {
            if (element) element.classList.add(className);
        },

        removeClass(element, className) {
            if (element) element.classList.remove(className);
        },

        toggleClass(element, className) {
            if (element) element.classList.toggle(className);
        },

        setStyle(element, property, value) {
            if (element) element.style[property] = value;
        }
    };

    // =========================================================================
    // 1. PARTICLE CANVAS BACKGROUND (60 FPS)
    // =========================================================================
    class ParticleCanvas {
        constructor() {
            this.canvas = Utils.getElementSafe('#particleCanvas');
            if (!this.canvas) return;
            
            this.ctx = this.canvas.getContext('2d');
            this.particles = [];
            this.animationId = null;
            this.init();
        }

        init() {
            this.resize();
            this.createParticles();
            this.animate();
            
            window.addEventListener('resize', Utils.debounce(() => this.resize(), 100));
        }

        resize() {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
        }

        createParticles() {
            this.particles = [];
            for (let i = 0; i < CONFIG.PARTICLE_COUNT; i++) {
                this.particles.push({
                    x: Math.random() * this.canvas.width,
                    y: Math.random() * this.canvas.height,
                    radius: Math.random() * 2 + 1,
                    alpha: Math.random() * 0.3 + 0.1,
                    speedX: (Math.random() - 0.5) * 0.3,
                    speedY: (Math.random() - 0.5) * 0.2
                });
            }
        }

        animate() {
            if (!this.ctx || !this.canvas) return;
            
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            
            for (const p of this.particles) {
                p.x += p.speedX;
                p.y += p.speedY;
                
                if (p.x < 0) p.x = this.canvas.width;
                if (p.x > this.canvas.width) p.x = 0;
                if (p.y < 0) p.y = this.canvas.height;
                if (p.y > this.canvas.height) p.y = 0;
                
                this.ctx.beginPath();
                this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                this.ctx.fillStyle = `rgba(139, 0, 0, ${p.alpha})`;
                this.ctx.fill();
            }
            
            this.animationId = requestAnimationFrame(() => this.animate());
        }

        destroy() {
            if (this.animationId) {
                cancelAnimationFrame(this.animationId);
            }
        }
    }

    // =========================================================================
    // 2. SCROLL PROGRESS BAR (Otimizado)
    // =========================================================================
    class ScrollProgressBar {
        constructor() {
            this.progressBar = Utils.getElementSafe('.scroll-progress');
            this.init();
        }

        init() {
            if (!this.progressBar) return;
            
            const updateProgress = () => {
                const winScroll = window.pageYOffset || document.documentElement.scrollTop;
                const height = document.documentElement.scrollHeight - window.innerHeight;
                const scrolled = height > 0 ? (winScroll / height) * 100 : 0;
                this.progressBar.style.width = `${scrolled}%`;
                requestAnimationFrame(() => {
                    const intensity = Math.min(scrolled / 100, 1);
                    this.progressBar.style.boxShadow = `0 0 ${5 + intensity * 10}px rgba(139, 0, 0, ${0.3 + intensity * 0.5})`;
                });
            };
            
            window.addEventListener('scroll', () => requestAnimationFrame(updateProgress));
            updateProgress();
        }
    }

    // =========================================================================
    // 3. SCROLL REVEAL & ANIMAÇÕES
    // =========================================================================
    class ScrollReveal {
        constructor() {
            this.revealElements = Utils.getAllElementsSafe('[data-scroll-reveal]');
            this.animatedElements = Utils.getAllElementsSafe('.service-card, .project-card, .diff-item, .about-content');
            this.init();
        }

        init() {
            if (this.revealElements.length) {
                const revealObserver = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            Utils.addClass(entry.target, 'revealed');
                            revealObserver.unobserve(entry.target);
                        }
                    });
                }, { threshold: CONFIG.SCROLL_REVEAL_THRESHOLD, rootMargin: '0px 0px -20px 0px' });
                
                this.revealElements.forEach(el => revealObserver.observe(el));
            }
            
            if (this.animatedElements.length) {
                const cardObserver = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            Utils.addClass(entry.target, 'visible');
                            cardObserver.unobserve(entry.target);
                        }
                    });
                }, { threshold: CONFIG.SCROLL_REVEAL_THRESHOLD, rootMargin: '0px 0px -50px 0px' });
                
                this.animatedElements.forEach(el => cardObserver.observe(el));
            }
        }
    }

    // =========================================================================
    // 4. ABOUT STATS ANIMATION
    // =========================================================================
    class AboutStats {
        constructor() {
            this.statItems = Utils.getAllElementsSafe('.stat-item');
            this.animated = false;
            this.init();
        }

        init() {
            if (!this.statItems.length) return;
            
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && !this.animated) {
                        this.animated = true;
                        this.animateStats();
                        observer.disconnect();
                    }
                });
            }, { threshold: 0.5 });
            
            observer.observe(this.statItems[0]);
        }

        animateStats() {
            this.statItems.forEach(item => {
                const target = parseInt(item.getAttribute('data-stat'), 10);
                const numberElement = item.querySelector('.stat-number');
                if (!numberElement || isNaN(target)) return;
                
                let current = 0;
                const duration = 1500;
                const stepTime = 16;
                const steps = duration / stepTime;
                const increment = target / steps;
                
                const update = () => {
                    current += increment;
                    if (current < target) {
                        numberElement.textContent = Math.floor(current);
                        requestAnimationFrame(update);
                    } else {
                        numberElement.textContent = target;
                    }
                };
                requestAnimationFrame(update);
            });
        }
    }

    // =========================================================================
    // 5. COUNTER ANIMATION
    // =========================================================================
    class CounterAnimation {
        constructor() {
            this.counters = Utils.getAllElementsSafe('[data-counter]');
            this.observedCounters = new Set();
            this.init();
        }

        animateCounter(element, targetValue) {
            const counterSpan = element.querySelector('.counter-number');
            if (!counterSpan) return;
            
            const isPercentage = counterSpan.innerText.includes('%');
            const suffix = isPercentage ? '%' : (counterSpan.innerText.includes('+') ? '+' : '+');
            
            let current = 0;
            const duration = 1500;
            const stepTime = 16;
            const steps = duration / stepTime;
            const increment = targetValue / steps;
            
            const update = () => {
                current += increment;
                if (current < targetValue) {
                    counterSpan.innerText = `${Math.floor(current)}${suffix}`;
                    requestAnimationFrame(update);
                } else {
                    counterSpan.innerText = `${targetValue}${suffix}`;
                }
            };
            requestAnimationFrame(update);
        }

        init() {
            if (!this.counters.length) return;
            
            const counterObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && !this.observedCounters.has(entry.target)) {
                        this.observedCounters.add(entry.target);
                        const targetValue = parseInt(entry.target.getAttribute('data-counter'), 10);
                        if (!isNaN(targetValue)) {
                            this.animateCounter(entry.target, targetValue);
                        }
                        counterObserver.unobserve(entry.target);
                    }
                });
            }, { threshold: CONFIG.COUNTER_THRESHOLD });
            
            this.counters.forEach(counter => counterObserver.observe(counter));
        }
    }

    // =========================================================================
    // 6. ACCORDION COMPONENT
    // =========================================================================
    class Accordion {
        constructor() {
            this.headers = Utils.getAllElementsSafe('.accordion-header');
            this.init();
        }

        init() {
            this.headers.forEach(header => {
                header.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const item = header.parentElement;
                    const isActive = Utils.hasClass(item, 'active');
                    const icon = header.querySelector('i');
                    
                    Utils.toggleClass(item, 'active');
                    
                    if (icon) {
                        Utils.setStyle(icon, 'transform', isActive ? 'rotate(0deg)' : 'rotate(180deg)');
                    }
                    
                    const content = item.querySelector('.accordion-content');
                    if (content) {
                        if (!isActive) {
                            content.style.maxHeight = `${content.scrollHeight}px`;
                        } else {
                            content.style.maxHeight = '0px';
                        }
                    }
                });
            });
        }
    }

    // =========================================================================
    // 7. MODAL COMPONENT
    // =========================================================================
    class Modal {
        constructor() {
            this.modal = Utils.getElementSafe('#contactModal');
            this.openBtn = Utils.getElementSafe('#openModalBtn');
            this.closeBtn = Utils.getElementSafe('.close-modal');
            this.init();
        }

        init() {
            if (!this.modal || !this.openBtn) return;
            
            this.openBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.open();
            });
            
            if (this.closeBtn) {
                this.closeBtn.addEventListener('click', () => this.close());
            }
            
            window.addEventListener('click', (e) => {
                if (e.target === this.modal) this.close();
            });
            
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && this.isOpen()) this.close();
            });
        }
        
        open() {
            this.modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
            this.modal.offsetHeight;
        }
        
        close() {
            this.modal.style.display = 'none';
            document.body.style.overflow = '';
        }
        
        isOpen() {
            return this.modal.style.display === 'block';
        }
    }

    // =========================================================================
    // 8. TOGGLE SWITCH
    // =========================================================================
    class ToggleSwitch {
        constructor() {
            this.toggle = Utils.getElementSafe('#contactToggle');
            this.toggleLabel = Utils.getElementSafe('#toggleLabel');
            this.modalBtn = Utils.getElementSafe('#openModalBtn');
            this.init();
        }

        init() {
            if (!this.toggle || !this.toggleLabel) return;
            
            const savedState = localStorage.getItem('contactPreference');
            if (savedState !== null) {
                this.toggle.checked = savedState === 'email';
                this.updateUI();
            }
            
            this.toggle.addEventListener('change', () => {
                this.updateUI();
                localStorage.setItem('contactPreference', this.toggle.checked ? 'email' : 'whatsapp');
            });
        }
        
        updateUI() {
            const isEmail = this.toggle.checked;
            this.toggleLabel.innerText = isEmail ? 'E-mail' : 'WhatsApp';
            
            if (this.modalBtn) {
                if (isEmail) {
                    this.modalBtn.href = 'mailto:hello@noctrasystems.com';
                    this.modalBtn.innerHTML = '<i class="far fa-envelope"></i> <span>Enviar e-mail</span><i class="fas fa-arrow-right btn-arrow"></i>';
                    Utils.removeClass(this.modalBtn, 'whatsapp-btn');
                } else {
                    this.modalBtn.href = '#';
                    this.modalBtn.innerHTML = '<i class="fab fa-whatsapp"></i> <span>Iniciar conversa</span><i class="fas fa-arrow-right btn-arrow"></i>';
                    Utils.addClass(this.modalBtn, 'whatsapp-btn');
                }
            }
        }
    }

    // =========================================================================
    // 9. MOBILE MENU
    // =========================================================================
    class MobileMenu {
        constructor() {
            this.menuToggle = Utils.getElementSafe('#menuToggle');
            this.navLinks = Utils.getElementSafe('#navLinks');
            this.navLinksItems = this.navLinks ? Utils.getAllElementsSafe('a', this.navLinks) : [];
            this.init();
        }

        init() {
            if (!this.menuToggle || !this.navLinks) return;
            
            this.menuToggle.addEventListener('click', () => {
                this.toggleMenu();
            });
            
            this.navLinksItems.forEach(link => {
                link.addEventListener('click', () => {
                    if (Utils.hasClass(this.navLinks, 'active')) {
                        this.closeMenu();
                    }
                });
            });
            
            window.addEventListener('resize', Utils.debounce(() => {
                if (window.innerWidth > 800 && Utils.hasClass(this.navLinks, 'active')) {
                    this.closeMenu();
                }
            }, CONFIG.RESIZE_DEBOUNCE_DELAY));
        }
        
        toggleMenu() {
            Utils.toggleClass(this.navLinks, 'active');
            const icon = this.menuToggle.querySelector('i');
            if (icon) {
                Utils.toggleClass(icon, 'fa-bars');
                Utils.toggleClass(icon, 'fa-times');
            }
            document.body.style.overflow = Utils.hasClass(this.navLinks, 'active') ? 'hidden' : '';
        }
        
        closeMenu() {
            Utils.removeClass(this.navLinks, 'active');
            const icon = this.menuToggle.querySelector('i');
            if (icon) {
                Utils.addClass(icon, 'fa-bars');
                Utils.removeClass(icon, 'fa-times');
            }
            document.body.style.overflow = '';
        }
    }

    // =========================================================================
    // 10. SMOOTH SCROLL
    // =========================================================================
    class SmoothScroll {
        constructor() {
            this.links = Utils.getAllElementsSafe('a[href^="#"]');
            this.init();
        }

        init() {
            this.links.forEach(anchor => {
                anchor.addEventListener('click', (e) => {
                    const targetId = anchor.getAttribute('href');
                    if (targetId === "#" || targetId === "" || targetId === "#home") {
                        if (targetId === "#home" || targetId === "#") {
                            e.preventDefault();
                            this.scrollToTop();
                        }
                        return;
                    }
                    
                    const target = Utils.getElementSafe(targetId);
                    if (target) {
                        e.preventDefault();
                        this.scrollToElement(target);
                        
                        if (history.pushState) {
                            history.pushState(null, null, targetId);
                        }
                    }
                });
            });
        }
        
        scrollToElement(element) {
            const navHeight = Utils.getElementSafe('nav')?.offsetHeight || 70;
            const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
            const offsetPosition = elementPosition - navHeight - 10;
            
            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
        
        scrollToTop() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }
    }

    // =========================================================================
    // 11. HORIZONTAL DRAG SCROLL
    // =========================================================================
    class HorizontalDragScroll {
        constructor() {
            this.container = Utils.getElementSafe('.horizontal-scroll-container');
            this.init();
        }

        init() {
            if (!this.container) return;
            
            let isDown = false;
            let startX;
            let scrollLeft;
            
            const onMouseDown = (e) => {
                isDown = true;
                startX = e.pageX - this.container.offsetLeft;
                scrollLeft = this.container.scrollLeft;
                this.container.style.cursor = 'grabbing';
            };
            
            const onMouseUp = () => {
                isDown = false;
                this.container.style.cursor = 'grab';
            };
            
            const onMouseMove = (e) => {
                if (!isDown) return;
                e.preventDefault();
                const x = e.pageX - this.container.offsetLeft;
                const walk = (x - startX) * 1.5;
                this.container.scrollLeft = scrollLeft - walk;
            };
            
            const onTouchStart = (e) => {
                isDown = true;
                startX = e.touches[0].pageX - this.container.offsetLeft;
                scrollLeft = this.container.scrollLeft;
            };
            
            const onTouchMove = (e) => {
                if (!isDown) return;
                const x = e.touches[0].pageX - this.container.offsetLeft;
                const walk = (x - startX) * 1.5;
                this.container.scrollLeft = scrollLeft - walk;
            };
            
            this.container.addEventListener('mousedown', onMouseDown);
            window.addEventListener('mouseup', onMouseUp);
            window.addEventListener('mousemove', onMouseMove);
            this.container.addEventListener('touchstart', onTouchStart);
            this.container.addEventListener('touchmove', onTouchMove);
            window.addEventListener('touchend', onMouseUp);
            
            this.container.style.cursor = 'grab';
        }
    }

    // =========================================================================
    // 12. RIPPLE EFFECT
    // =========================================================================
    class RippleEffect {
        constructor() {
            this.buttons = Utils.getAllElementsSafe('.ripple-btn');
            this.init();
        }

        init() {
            this.buttons.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    this.createRipple(btn, e);
                });
            });
        }
        
        createRipple(btn, event) {
            const ripple = document.createElement('span');
            ripple.classList.add('ripple');
            
            const rect = btn.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = event.clientX - rect.left - size / 2;
            const y = event.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = `${size}px`;
            ripple.style.left = `${x}px`;
            ripple.style.top = `${y}px`;
            ripple.style.position = 'absolute';
            ripple.style.borderRadius = '50%';
            ripple.style.backgroundColor = 'rgba(255, 255, 255, 0.6)';
            ripple.style.transform = 'scale(0)';
            ripple.style.pointerEvents = 'none';
            
            if (!document.querySelector('#ripple-keyframes')) {
                const style = document.createElement('style');
                style.id = 'ripple-keyframes';
                style.textContent = `
                    @keyframes rippleAnimation {
                        to { transform: scale(4); opacity: 0; }
                    }
                `;
                document.head.appendChild(style);
            }
            ripple.style.animation = 'rippleAnimation 0.6s linear';
            
            btn.style.position = 'relative';
            btn.style.overflow = 'hidden';
            
            btn.appendChild(ripple);
            
            setTimeout(() => ripple.remove(), CONFIG.RIPPLE_DURATION);
        }
    }

    // =========================================================================
    // 13. ACTIVE LINK TRACKER
    // =========================================================================
    class ActiveLinkTracker {
        constructor() {
            this.sections = Utils.getAllElementsSafe('section[id]');
            this.navItems = Utils.getAllElementsSafe('.nav-links a');
            this.init();
        }

        init() {
            if (!this.sections.length || !this.navItems.length) return;
            
            const updateActiveLink = Utils.throttle(() => {
                let current = '';
                const scrollPos = window.pageYOffset + CONFIG.SCROLL_OFFSET;
                
                for (const section of this.sections) {
                    const sectionTop = section.offsetTop;
                    const sectionBottom = sectionTop + section.offsetHeight;
                    if (scrollPos >= sectionTop && scrollPos < sectionBottom) {
                        current = section.getAttribute('id');
                        break;
                    }
                }
                
                this.navItems.forEach(link => {
                    const href = link.getAttribute('href');
                    if (href && href.substring(1) === current) {
                        Utils.addClass(link, 'active');
                    } else {
                        Utils.removeClass(link, 'active');
                    }
                });
            }, 50);
            
            window.addEventListener('scroll', updateActiveLink);
            window.addEventListener('load', updateActiveLink);
            window.addEventListener('resize', Utils.debounce(updateActiveLink, CONFIG.RESIZE_DEBOUNCE_DELAY));
        }
    }

    // =========================================================================
    // 14. TYPEWRITER EFFECT
    // =========================================================================
    class TypewriterEffect {
        constructor() {
            this.element = Utils.getElementSafe('.typewriter-text');
            this.texts = ['2h úteis', 'rápido', 'eficiente', 'ágil'];
            this.currentIndex = 0;
            this.init();
        }

        init() {
            if (!this.element) return;
            
            setInterval(() => {
                this.currentIndex = (this.currentIndex + 1) % this.texts.length;
                
                this.element.style.animation = 'none';
                this.element.offsetHeight;
                this.element.style.animation = null;
                
                this.element.style.opacity = '0';
                setTimeout(() => {
                    this.element.textContent = this.texts[this.currentIndex];
                    this.element.style.opacity = '1';
                }, 100);
            }, CONFIG.TYPEWRITER_INTERVAL);
        }
    }

    // =========================================================================
    // 15. LOGO FALLBACK
    // =========================================================================
    class LogoFallback {
        constructor() {
            this.logoImg = Utils.getElementSafe('#logoImg');
            this.logoIcon = Utils.getElementSafe('#logoIcon');
            this.init();
        }

        init() {
            if (!this.logoImg) return;
            
            this.logoImg.addEventListener('error', () => {
                if (this.logoIcon) {
                    this.logoIcon.innerHTML = '<i class="fas fa-crow" style="font-size: 2rem; color: #8B0000;"></i>';
                }
            });
        }
    }

    // =========================================================================
    // INICIALIZAÇÃO
    // =========================================================================
    class NoctraApp {
        constructor() {
            this.modules = [];
            this.init();
        }

        init() {
            console.log('🚀 Noctra Systems — Inicializando aplicação com performance otimizada...');
            
            this.modules = [
                new ParticleCanvas(),
                new ScrollProgressBar(),
                new ScrollReveal(),
                new AboutStats(),
                new CounterAnimation(),
                new Accordion(),
                new Modal(),
                new ToggleSwitch(),
                new MobileMenu(),
                new SmoothScroll(),
                new HorizontalDragScroll(),
                new RippleEffect(),
                new ActiveLinkTracker(),
                new TypewriterEffect(),
                new LogoFallback()
            ];
            
            console.log(`✅ Noctra Systems — ${this.modules.length} módulos carregados (60+ FPS garantido)`);
            
            document.body.classList.add('js-loaded');
            
            const event = new CustomEvent('noctra:ready', { detail: { modules: this.modules.length } });
            document.dispatchEvent(event);
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => new NoctraApp());
    } else {
        new NoctraApp();
    }
})();