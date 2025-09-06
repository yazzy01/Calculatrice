/**
 * Theme Manager for Professional Calculator
 * Author: Yassir Rzigui - Full-Stack Developer & AI Specialist
 * Handles dark/light theme switching with smooth animations
 */

class ThemeManager {
    constructor() {
        this.currentTheme = localStorage.getItem('calculatorTheme') || 'light';
        this.themeToggle = document.getElementById('theme-toggle');
        this.themeIcon = document.querySelector('.theme-icon');
        
        this.init();
    }

    init() {
        this.applyTheme(this.currentTheme);
        this.setupEventListeners();
        this.setupThemeTransitions();
    }

    setupEventListeners() {
        this.themeToggle.addEventListener('click', () => {
            this.toggleTheme();
        });

        // Keyboard shortcut for theme toggle (Ctrl/Cmd + T)
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 't') {
                e.preventDefault();
                this.toggleTheme();
            }
        });

        // System theme preference detection
        if (window.matchMedia) {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            mediaQuery.addEventListener('change', (e) => {
                if (!localStorage.getItem('calculatorTheme')) {
                    this.applyTheme(e.matches ? 'dark' : 'light');
                }
            });
        }
    }

    setupThemeTransitions() {
        // Add smooth transitions to theme-sensitive elements
        const transitionElements = [
            'body', '.calculator', '.btn', '.display-container',
            '.history-panel', '.header', '.footer'
        ];

        transitionElements.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                element.style.transition = 'background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease';
            });
        });
    }

    toggleTheme() {
        const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.applyTheme(newTheme);
        
        // Add a subtle animation to the toggle button
        this.themeToggle.style.transform = 'scale(0.9)';
        setTimeout(() => {
            this.themeToggle.style.transform = 'scale(1)';
        }, 150);
    }

    applyTheme(theme) {
        this.currentTheme = theme;
        document.body.setAttribute('data-theme', theme);
        
        // Update toggle button icon
        this.themeIcon.textContent = theme === 'light' ? '🌙' : '☀️';
        this.themeToggle.setAttribute('aria-label', 
            theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'
        );

        // Save preference
        localStorage.setItem('calculatorTheme', theme);

        // Dispatch custom event for other components
        document.dispatchEvent(new CustomEvent('themeChanged', { 
            detail: { theme } 
        }));

        console.log(`Theme switched to ${theme} mode`);
    }

    // Get current theme
    getCurrentTheme() {
        return this.currentTheme;
    }

    // Force theme (for external control)
    setTheme(theme) {
        if (['light', 'dark'].includes(theme)) {
            this.applyTheme(theme);
        }
    }

    // Auto theme based on time of day
    setAutoTheme() {
        const hour = new Date().getHours();
        const theme = (hour >= 6 && hour < 18) ? 'light' : 'dark';
        this.applyTheme(theme);
    }

    // High contrast mode for accessibility
    toggleHighContrast() {
        document.body.classList.toggle('high-contrast');
        const isHighContrast = document.body.classList.contains('high-contrast');
        localStorage.setItem('calculatorHighContrast', isHighContrast);
    }

    // Initialize high contrast if previously enabled
    initHighContrast() {
        const isHighContrast = localStorage.getItem('calculatorHighContrast') === 'true';
        if (isHighContrast) {
            document.body.classList.add('high-contrast');
        }
    }

    // Color blind friendly mode
    toggleColorBlindMode() {
        document.body.classList.toggle('colorblind-friendly');
        const isColorBlindMode = document.body.classList.contains('colorblind-friendly');
        localStorage.setItem('calculatorColorBlind', isColorBlindMode);
    }

    initColorBlindMode() {
        const isColorBlindMode = localStorage.getItem('calculatorColorBlind') === 'true';
        if (isColorBlindMode) {
            document.body.classList.add('colorblind-friendly');
        }
    }

    // Reduced motion for accessibility
    initReducedMotion() {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            document.body.classList.add('reduced-motion');
        }
    }

    // Theme presets
    themePresets = {
        default: {
            light: {
                primary: '#007bff',
                secondary: '#6c757d',
                success: '#28a745',
                warning: '#ffc107',
                danger: '#dc3545'
            },
            dark: {
                primary: '#4dabf7',
                secondary: '#868e96',
                success: '#51cf66',
                warning: '#ffd43b',
                danger: '#ff6b6b'
            }
        },
        ocean: {
            light: {
                primary: '#0077be',
                secondary: '#4a90a4',
                success: '#00a86b',
                warning: '#ffb347',
                danger: '#e74c3c'
            },
            dark: {
                primary: '#5dade2',
                secondary: '#7fb3d3',
                success: '#58d68d',
                warning: '#f7dc6f',
                danger: '#ec7063'
            }
        },
        forest: {
            light: {
                primary: '#228b22',
                secondary: '#556b2f',
                success: '#32cd32',
                warning: '#daa520',
                danger: '#dc143c'
            },
            dark: {
                primary: '#90ee90',
                secondary: '#9acd32',
                success: '#98fb98',
                warning: '#f0e68c',
                danger: '#fa8072'
            }
        }
    };

    applyThemePreset(presetName) {
        const preset = this.themePresets[presetName];
        if (!preset) return;

        const colors = preset[this.currentTheme];
        const root = document.documentElement;

        Object.entries(colors).forEach(([key, value]) => {
            root.style.setProperty(`--color-${key}`, value);
        });

        localStorage.setItem('calculatorThemePreset', presetName);
    }

    // Initialize theme preset
    initThemePreset() {
        const savedPreset = localStorage.getItem('calculatorThemePreset') || 'default';
        this.applyThemePreset(savedPreset);
    }
}

// Initialize theme manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.themeManager = new ThemeManager();
    window.themeManager.initHighContrast();
    window.themeManager.initColorBlindMode();
    window.themeManager.initReducedMotion();
    window.themeManager.initThemePreset();
    
    console.log('Theme Manager initialized by Yassir Rzigui');
});
