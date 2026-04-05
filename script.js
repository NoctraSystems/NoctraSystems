// Menu Mobile toggle com microinteração elegante
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');
if (menuToggle) {
    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        // alterar ícone
        const icon = menuToggle.querySelector('i');
        if (navLinks.classList.contains('active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });
}

// fechar menu ao clicar em link (para mobile)
const links = document.querySelectorAll('.nav-links a');
links.forEach(link => {
    link.addEventListener('click', () => {
        if (navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
            const icon = menuToggle.querySelector('i');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });
});

// scroll suave nativo + offset para navbar fixa
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        if (targetId === "#" || targetId === "") return;
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            e.preventDefault();
            const navHeight = document.querySelector('nav').offsetHeight;
            const elementPosition = targetElement.getBoundingClientRect().top + window.scrollY;
            window.scrollTo({
                top: elementPosition - navHeight - 15,
                behavior: 'smooth'
            });
        }
    });
});

// efeito sutil de fade-in ao scroll (simples e sem dependências)
const fadeElements = document.querySelectorAll('.service-card, .project-card, .diff-item, .about-content');
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.1, rootMargin: "0px 0px -20px 0px" });

fadeElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.5s ease';
    observer.observe(el);
});
// garantir que hero também tenha leveza visual
document.querySelector('.hero-grid').style.opacity = '1';

// pequeno detalhe: botão contato whatsapp real melhora usabilidade
console.log("Noctra Systems — site institucional premium carregado.");