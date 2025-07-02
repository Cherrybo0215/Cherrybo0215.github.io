/**
 * @class InteractivePage
 * @author Gemini AI (Optimized for "高级感")
 * @version 3.0
 * * A professional, class-based implementation for advanced webpage interactions.
 * This object-oriented approach encapsulates all logic for better organization,
 * scalability, and maintainability, reflecting modern web development standards.
 *
 * Features:
 * - Perfectly synchronized spotlight cursor, optimized with requestAnimationFrame.
 * - NEW: Parallax effect on header elements for a sense of depth.
 * - Staggered scroll animations via IntersectionObserver.
 * - Cutting-edge theme transitions using the View Transitions API.
 */
class InteractivePage {
    /**
     * Initializes the application, selects DOM elements, and binds events.
     */
    constructor() {
        // --- Element Selectors ---
        this.spotlight = document.querySelector('.spotlight');
        this.header = document.querySelector('header');
        this.profilePic = document.querySelector('.profile-pic');
        this.themeToggle = document.getElementById('theme-toggle');
        this.hiddenElements = document.querySelectorAll('.hidden');

        // --- State Management ---
        this.isTicking = false; // Flag for optimizing rAF calls

        // --- Initialization ---
        if (this._isTouchDevice()) {
            if (this.spotlight) this.spotlight.style.display = 'none';
        } else {
            this._bindDesktopEvents();
        }
        
        this._bindGlobalEvents();
        this._setupScrollObserver();
    }

    /**
     * Binds events that should run globally (on all devices).
     * @private
     */
    _bindGlobalEvents() {
        if (this.themeToggle) {
            this.themeToggle.addEventListener('click', this._handleThemeToggle.bind(this));
        }
        // Set initial theme toggle icon
        this._updateThemeIcon();
    }

    /**
     * Binds events specific to desktop (non-touch) devices.
     * @private
     */
    _bindDesktopEvents() {
        window.addEventListener('mousemove', this._handleMouseMove.bind(this));
        window.addEventListener('scroll', this._handleScroll.bind(this));
    }
    
    /**
     * Sets up the IntersectionObserver for scroll-triggered animations.
     * @private
     */
    _setupScrollObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    const listItems = entry.target.querySelectorAll('ul > li');
                    listItems.forEach((item, index) => {
                        item.style.transitionDelay = `${index * 100}ms`;
                    });
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        this.hiddenElements.forEach(el => observer.observe(el));
    }

    /**
     * Handles the mouse move event, queuing updates for animations.
     * @param {MouseEvent} e - The mouse event.
     * @private
     */
    _handleMouseMove(e) {
        if (!this.isTicking) {
            window.requestAnimationFrame(() => {
                this._updateSpotlight(e.clientX, e.clientY);
                this.isTicking = false;
            });
            this.isTicking = true;
        }
    }

    /**
     * Handles the scroll event for effects like parallax.
     * @private
     */
    _handleScroll() {
        if (!this.isTicking) {
            window.requestAnimationFrame(() => {
                this._applyParallax();
                this.isTicking = false;
            });
            this.isTicking = true;
        }
    }

    /**
     * Updates the spotlight position for a 1:1 sync with the cursor.
     * @param {number} x - The clientX coordinate of the mouse.
     * @param {number} y - The clientY coordinate of the mouse.
     * @private
     */
   _updateSpotlight(x, y) {
        if (this.spotlight) {
            const width = this.spotlight.offsetWidth;
            const height = this.spotlight.offsetHeight;
            this.spotlight.style.transform = `translate(${x - width / 2}px, ${y - height / 2}px)`;
        }
    }

    /**
     * Applies a subtle parallax effect to the profile picture.
     * @private
     */
    _applyParallax() {
        if (this.profilePic) {
            const scrollY = window.scrollY;
            // The factor (0.1) determines how strong the parallax effect is.
            // A smaller number means less movement.
            this.profilePic.style.transform = `translateY(${scrollY * 0.1}px)`;
        }
    }

    /**
     * Handles the theme toggling logic using the View Transition API.
     * @param {MouseEvent} e - The click event.
     * @private
     */
    _handleThemeToggle(e) {
        const isDayMode = document.body.classList.contains('day-mode');
        
        const toggle = () => {
            document.body.classList.toggle('day-mode', !isDayMode);
            document.body.classList.toggle('night-mode', isDayMode);
            this._updateThemeIcon();
        };

        // Use the cutting-edge View Transition API if available
        if (document.startViewTransition) {
            const x = e.clientX;
            const y = e.clientY;

            document.startViewTransition(toggle).ready.then(() => {
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
            // Fallback for older browsers
            toggle();
        }
    }
    
    /**
     * Updates the theme toggle button's icon based on the current theme.
     * @private
     */
    _updateThemeIcon() {
        if (this.themeToggle) {
             this.themeToggle.textContent = document.body.classList.contains('day-mode') ? '🌙' : '☀️';
        }
    }

    /**
     * Checks if the current device is a touch-based primary input device.
     * @returns {boolean}
     * @private
     */
    _isTouchDevice() {
        return window.matchMedia("(pointer: coarse)").matches;
    }
}

// --- App Initialization ---
// Ensures the script runs after the DOM is fully loaded.
document.addEventListener('DOMContentLoaded', () => {
    new InteractivePage();
});
