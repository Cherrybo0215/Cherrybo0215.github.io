/**
 * Personal Website Enhancement Script
 * Features:
 * 1. Smooth "Lerp" Spotlight Cursor: Creates a fluid, trailing cursor light.
 * 2. View Transition API for Theme Toggling: Provides a circular reveal effect on theme change.
 * 3. Intersection Observer for Staggered Animations: Animates elements as they enter the viewport.
 * 4. Refactored for clarity and maintainability.
 */
document.addEventListener('DOMContentLoaded', () => {

    /**
     * Initializes all interactive scripts.
     */
    function init() {
        setupSmoothCursor();
        setupScrollAnimations();
        setupThemeToggle();
    }

    /**
     * 1. Smooth Cursor Follower (Lerp)
     * Creates a delightful, elastic-feeling spotlight that follows the mouse.
     */
    function setupSmoothCursor() {
        const spotlight = document.querySelector('.spotlight');
        if (!spotlight) return;

        // Don't run on touch devices for better performance
        if (window.matchMedia("(pointer: coarse)").matches) {
            spotlight.style.display = 'none';
            return;
        }

        let mouse = { x: -100, y: -100 };
        let current = { x: -100, y: -100 };
        const easingFactor = 0.08; // Adjust for more/less "lag"

        window.addEventListener('mousemove', e => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        });

        const tick = () => {
            // Lerp formula: current + (target - current) * easing
            current.x += (mouse.x - current.x) * easingFactor;
            current.y += (mouse.y - current.y) * easingFactor;
            spotlight.style.transform = `translate(${current.x}px, ${current.y}px)`;
            requestAnimationFrame(tick);
        };

        tick();
    }

    /**
     * 2. Scroll-triggered Animations with Stagger
     * Fades in sections and staggers list items on scroll.
     */
    function setupScrollAnimations() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    
                    // Stagger animation for list items inside the visible section
                    const listItems = entry.target.querySelectorAll('ul > li');
                    listItems.forEach((item, index) => {
                        item.style.transitionDelay = `${index * 100}ms`;
                    });

                    observer.unobserve(entry.target); // Animate only once
                }
            });
        }, {
            threshold: 0.1
        });

        document.querySelectorAll('.hidden').forEach(el => observer.observe(el));
    }

    /**
     * 3. Theme Toggle with View Transition API
     * Creates a stunning circular reveal animation on theme change.
     */
    function setupThemeToggle() {
        const themeToggle = document.getElementById('theme-toggle');
        if (!themeToggle) return;

        themeToggle.addEventListener('click', (e) => {
            const isDayMode = document.body.classList.contains('day-mode');
            
            // Check for View Transition API support
            if (document.startViewTransition) {
                // Get click coordinates
                const x = e.clientX;
                const y = e.clientY;

                document.startViewTransition(() => {
                    toggleTheme(isDayMode);
                }).ready.then(() => {
                    // Create the circular reveal animation from the click point
                    const clipPath = [
                        `circle(0% at ${x}px ${y}px)`,
                        `circle(${Math.hypot(window.innerWidth, window.innerHeight)}px at ${x}px ${y}px)`
                    ];
                    document.documentElement.animate({
                        clipPath: isDayMode ? [...clipPath].reverse() : clipPath
                    }, {
                        duration: 500,
                        easing: 'ease-in-out',
                        pseudoElement: isDayMode ? '::view-transition-old(root)' : '::view-transition-new(root)'
                    });
                });
            } else {
                // Fallback for browsers without support
                toggleTheme(isDayMode);
            }
        });

        function toggleTheme(isDay) {
            document.body.classList.toggle('day-mode', !isDay);
            document.body.classList.toggle('night-mode', isDay);
            themeToggle.textContent = isDay ? '☀️' : '🌙';
        }
        
        // Set initial icon
        themeToggle.textContent = document.body.classList.contains('day-mode') ? '🌙' : '☀️';
    }

    // Run initialization
    init();
});
