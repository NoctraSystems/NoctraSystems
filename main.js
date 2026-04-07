/**
 * Noctra Systems - Main JavaScript
 * Performance otimizada, foco em conversão e marketing
 */

(function () {
    'use strict';

    // Configurações
    const CONFIG = {
        SCROLL_OFFSET: 80,
        TYPEWRITER_INTERVAL: 4000
    };

    // Utilitários
    const Utils = {
        debounce(func, delay) {
            let timeout;
            return function (...args) {
                clearTimeout(timeout);
                timeout = setTimeout(() => func.apply(this, args), delay);
            };
        },
        getElement(selector) {
            return document.querySelector(selector);
        },
        getAllElements(selector) {
            return document.querySelectorAll(selector);
        },
        addClass(el, className) {
            if (el) el.classList.add(className);
        },
        removeClass(el, className) {
            if (el) el.classList.remove(className);
        },
        toggleClass(el, className) {
            if (el) el.classList.toggle(className);
        }
    };

    // Logo Fallback
    class LogoFallback {
        constructor() {
            this.logoImg = Utils.getElement('#logoImg');
            this.logoIcon = Utils.getElement('#logoIcon');
            this.footerLogoImg = Utils.getElement('.footer-logo-img');
            this.init();
        }
        init() {
            if (this.logoImg) {
                this.logoImg.addEventListener('error', () => {
                    if (this.logoIcon) {
                        this.logoIcon.innerHTML = '<i class="fas fa-crow" style="font-size: 1.5rem; color: #8B0000;"></i>';
                        this.logoIcon.style.background = 'transparent';
                    }
                });
            }
            if (this.footerLogoImg) {
                this.footerLogoImg.addEventListener('error', () => {
                    const parent = this.footerLogoImg.parentElement;
                    if (parent) {
                        parent.innerHTML = '<i class="fas fa-crow" style="font-size: 1rem; color: #8B0000;"></i>';
                        parent.style.background = 'transparent';
                    }
                });
            }
        }
    }

    // Scroll Progress Bar
    class ScrollProgress {
        constructor() {
            this.progressBar = Utils.getElement('.scroll-progress');
            this.init();
        }
        init() {
            if (!this.progressBar) return;
            window.addEventListener('scroll', () => {
                const winScroll = window.pageYOffset;
                const height = document.documentElement.scrollHeight - window.innerHeight;
                const scrolled = (winScroll / height) * 100;
                this.progressBar.style.width = `${scrolled}%`;
            });
        }
    }

    // Scroll Reveal com leve efeito
    class ScrollReveal {
        constructor() {
            this.elements = Utils.getAllElements('[data-scroll-reveal]');
            this.init();
        }
        init() {
            if (!this.elements.length) return;
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        Utils.addClass(entry.target, 'revealed');
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.1 });
            this.elements.forEach(el => observer.observe(el));
        }
    }

    // Active Link Tracker
    class ActiveLinkTracker {
        constructor() {
            this.sections = Utils.getAllElements('section[id]');
            this.navItems = Utils.getAllElements('.nav-links a');
            this.init();
        }
        init() {
            if (!this.sections.length) return;
            window.addEventListener('scroll', () => {
                let current = '';
                const scrollPos = window.pageYOffset + CONFIG.SCROLL_OFFSET;
                this.sections.forEach(section => {
                    const sectionTop = section.offsetTop;
                    const sectionBottom = sectionTop + section.offsetHeight;
                    if (scrollPos >= sectionTop && scrollPos < sectionBottom) {
                        current = section.getAttribute('id');
                    }
                });
                this.navItems.forEach(link => {
                    Utils.removeClass(link, 'active');
                    const href = link.getAttribute('href');
                    if (href && href.substring(1) === current) {
                        Utils.addClass(link, 'active');
                    }
                });
            });
        }
    }

    // Mobile Menu
    class MobileMenu {
        constructor() {
            this.menuToggle = Utils.getElement('#menuToggle');
            this.navLinks = Utils.getElement('#navLinks');
            this.init();
        }
        init() {
            if (!this.menuToggle || !this.navLinks) return;
            this.menuToggle.addEventListener('click', () => {
                Utils.toggleClass(this.navLinks, 'active');
                const icon = this.menuToggle.querySelector('i');
                if (icon) {
                    icon.classList.toggle('fa-bars');
                    icon.classList.toggle('fa-times');
                }
                document.body.style.overflow = this.navLinks.classList.contains('active') ? 'hidden' : '';
            });
            this.navLinks.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', () => {
                    Utils.removeClass(this.navLinks, 'active');
                    const icon = this.menuToggle.querySelector('i');
                    if (icon) {
                        icon.classList.add('fa-bars');
                        icon.classList.remove('fa-times');
                    }
                    document.body.style.overflow = '';
                });
            });
            window.addEventListener('resize', Utils.debounce(() => {
                if (window.innerWidth > 800 && this.navLinks.classList.contains('active')) {
                    Utils.removeClass(this.navLinks, 'active');
                    const icon = this.menuToggle.querySelector('i');
                    if (icon) {
                        icon.classList.add('fa-bars');
                        icon.classList.remove('fa-times');
                    }
                    document.body.style.overflow = '';
                }
            }, 250));
        }
    }

    // Smooth Scroll
    class SmoothScroll {
        constructor() {
            this.links = Utils.getAllElements('a[href^="#"]');
            this.init();
        }
        init() {
            this.links.forEach(anchor => {
                anchor.addEventListener('click', (e) => {
                    const targetId = anchor.getAttribute('href');
                    if (targetId === '#' || targetId === '' || targetId === '#home') {
                        if (targetId === '#home' || targetId === '#') {
                            e.preventDefault();
                            this.scrollToTop();
                        }
                        return;
                    }
                    const target = Utils.getElement(targetId);
                    if (target) {
                        e.preventDefault();
                        const navHeight = Utils.getElement('nav')?.offsetHeight || 70;
                        const elementPosition = target.getBoundingClientRect().top + window.pageYOffset;
                        window.scrollTo({
                            top: elementPosition - navHeight,
                            behavior: 'smooth'
                        });
                        if (history.pushState) {
                            history.pushState(null, null, targetId);
                        }
                    }
                });
            });
        }
        scrollToTop() {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }

    // Form Handler
    class FormHandler {
        constructor() {
            this.form = Utils.getElement('#contactForm');
            this.modal = Utils.getElement('#successModal');
            this.init();
        }
        init() {
            if (!this.form) return;
            this.form.addEventListener('submit', (e) => {
                e.preventDefault();
                const name = Utils.getElement('#name')?.value;
                if (name) {
                    this.showModal();
                    this.form.reset();
                }
            });
            const closeModal = Utils.getElement('.close-modal');
            const modalCloseBtn = Utils.getElement('.modal-close-btn');
            if (closeModal) closeModal.addEventListener('click', () => this.hideModal());
            if (modalCloseBtn) modalCloseBtn.addEventListener('click', () => this.hideModal());
            window.addEventListener('click', (e) => {
                if (e.target === this.modal) this.hideModal();
            });
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && this.modal?.style.display === 'flex') {
                    this.hideModal();
                }
            });
        }
        showModal() {
            if (this.modal) {
                this.modal.style.display = 'flex';
                document.body.style.overflow = 'hidden';
            }
        }
        hideModal() {
            if (this.modal) {
                this.modal.style.display = 'none';
                document.body.style.overflow = '';
            }
        }
    }

    // Animate Stats
    class StatsAnimation {
        constructor() {
            this.stats = Utils.getAllElements('.hero-stat .stat-number');
            this.animated = false;
            this.init();
        }
        init() {
            if (!this.stats.length) return;
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && !this.animated) {
                        this.animated = true;
                        this.animateStats();
                        observer.disconnect();
                    }
                });
            }, { threshold: 0.5 });
            observer.observe(this.stats[0]);
        }
        animateStats() {
            this.stats.forEach(stat => {
                const text = stat.textContent;
                const target = parseInt(text) || 50;
                let current = 0;
                const duration = 1500;
                const stepTime = 16;
                const steps = duration / stepTime;
                const increment = target / steps;
                const update = () => {
                    current += increment;
                    if (current < target) {
                        stat.textContent = Math.floor(current) + (text.includes('%') ? '%' : '+');
                        requestAnimationFrame(update);
                    } else {
                        stat.textContent = text;
                    }
                };
                requestAnimationFrame(update);
            });
        }
    }

    // Card Hover Effects
    class CardEffects {
        constructor() {
            this.cards = Utils.getAllElements('.solution-card, .service-card, .portfolio-item');
            this.init();
        }
        init() {
            this.cards.forEach(card => {
                card.addEventListener('mouseenter', () => {
                    card.style.transform = 'translateY(-5px)';
                });
                card.addEventListener('mouseleave', () => {
                    card.style.transform = 'translateY(0)';
                });
            });
        }
    }

    // Logo Click to Top
    class LogoClick {
        constructor() {
            this.logoLink = Utils.getElement('#logoLink');
            this.init();
        }
        init() {
            if (this.logoLink) {
                this.logoLink.addEventListener('click', (e) => {
                    e.preventDefault();
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                });
            }
        }
    }

    // Initialize all modules
    class NoctraApp {
        constructor() {
            console.log('🚀 Noctra Systems — Inicializando...');
            new LogoFallback();
            new ScrollProgress();
            new ScrollReveal();
            new ActiveLinkTracker();
            new MobileMenu();
            new SmoothScroll();
            new FormHandler();
            new StatsAnimation();
            new CardEffects();
            new LogoClick();
            console.log('✅ Noctra Systems — Pronto para converter!');
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => new NoctraApp());
    } else {
        new NoctraApp();
    }
})();