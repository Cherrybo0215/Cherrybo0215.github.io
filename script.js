document.addEventListener('DOMContentLoaded', () => {

    // --- 1. THEME TOGGLE (with View Transitions API) ---
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;

    // Function to apply theme from localStorage
    const applyStoredTheme = () => {
        const storedTheme = localStorage.getItem('theme');
        if (storedTheme) {
            body.classList.add(storedTheme);
        } else {
            // Default to night mode if nothing is stored
            body.classList.add('night-mode');
        }
    };

    applyStoredTheme();

    themeToggle.addEventListener('click', (e) => {
        const isDayMode = body.classList.contains('day-mode');
        
        // Get click coordinates for the reveal animation
        const x = e.clientX;
        const y = e.clientY;
        document.documentElement.style.setProperty('--x', x + 'px');
        document.documentElement.style.setProperty('--y', y + 'px');

        // Use View Transitions API if available
        if (document.startViewTransition) {
            document.startViewTransition(() => {
                body.classList.toggle('day-mode');
                localStorage.setItem('theme', isDayMode ? 'night-mode' : 'day-mode');
            });
        } else {
            // Fallback for browsers that don't support it
            body.classList.toggle('day-mode');
            localStorage.setItem('theme', isDayMode ? 'night-mode' : 'day-mode');
        }
    });


    // --- 2. 3D Tilt Effect for Bento Cards ---
    const cards = document.querySelectorAll('.bento-card');
    cards.forEach(card => {
        const cardContent = card.querySelector('.card-content');
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left, y = e.clientY - rect.top;
            const centerX = rect.width / 2, centerY = rect.height / 2;
            const rotateX = ((y - centerY) / centerY) * -8;
            const rotateY = ((x - centerX) / centerX) * 8;
            gsap.to(card, { duration: 0.5, rotationX: rotateX, rotationY: rotateY, transformPerspective: 1000, ease: "power2.out" });
            gsap.to(cardContent, { duration: 0.5, x: rotateY * 1.5, y: rotateX * -1.5, ease: "power2.out" });
        });
        card.addEventListener('mouseleave', () => {
            gsap.to(card, { duration: 0.5, rotationX: 0, rotationY: 0, ease: "power2.out" });
            gsap.to(cardContent, { duration: 0.5, x: 0, y: 0, ease: "power2.out" });
        });
    });

    // --- 3. Magnetic Effect for Buttons/Links ---
    const magneticElements = document.querySelectorAll('.magnetic');
    magneticElements.forEach(el => {
        el.addEventListener('mousemove', function(e) {
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left, y = e.clientY - rect.top;
            gsap.to(el, { x: (x - rect.width / 2) * 0.4, y: (y - rect.height / 2) * 0.4, duration: 0.8, ease: "elastic.out(1, 0.3)" });
        });
        el.addEventListener('mouseleave', function() {
            gsap.to(el, { x: 0, y: 0, duration: 0.5, ease: "power2.out" });
        });
    });
    
    // --- 4. Scroll-Triggered Fade-in Animation ---
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    const hiddenElements = document.querySelectorAll('.hidden');
    hiddenElements.forEach(el => observer.observe(el));

});
