document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Spotlight Cursor Effect ---
    const spotlight = document.querySelector('.spotlight');
    if (spotlight) {
        document.addEventListener('mousemove', (e) => {
            // Using requestAnimationFrame for performance
            requestAnimationFrame(() => {
                spotlight.style.left = `${e.clientX}px`;
                spotlight.style.top = `${e.clientY}px`;
            });
        });
    }

    // --- 2. Card Hover Effect (Follow Mouse) ---
    const cards = document.querySelectorAll('section');
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });

    // --- 3. Scroll-Triggered Fade-in Animation ---
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1 // Trigger when 10% of the element is visible
    });

    const hiddenElements = document.querySelectorAll('.hidden');
    hiddenElements.forEach(el => observer.observe(el));

    // --- 4. Theme Toggle ---
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;

    themeToggle.addEventListener('click', () => {
        body.classList.toggle('day-mode');
        body.classList.toggle('night-mode');
        
        if (body.classList.contains('day-mode')) {
            themeToggle.textContent = '🌙';
        } else {
            themeToggle.textContent = '☀️';
        }
    });

    // Set initial toggle icon
    if (body.classList.contains('day-mode')) {
        themeToggle.textContent = '🌙';
    } else {
        themeToggle.textContent = '☀️';
    }
});
