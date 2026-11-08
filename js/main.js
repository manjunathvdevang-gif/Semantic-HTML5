/**
 * Portfolio Main JavaScript
 * Handles Accessible UI: Theme Switching, Mobile Menu Navigation, Form Validation
 */

(function () {
  'use strict';

  // --- 1. Theme Switcher (Dark / Light Mode) ---
  const THEME_STORAGE_KEY = 'portfolio_theme';
  const root = document.documentElement;
  const themeToggleBtn = document.getElementById('theme-toggle');

  function getPreferredTheme() {
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    if (savedTheme) {
      return savedTheme;
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function setTheme(theme) {
    root.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_STORAGE_KEY, theme);
    if (themeToggleBtn) {
      themeToggleBtn.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`);
      const icon = themeToggleBtn.querySelector('.theme-icon');
      if (icon) {
        icon.textContent = theme === 'dark' ? '☀️' : '🌙';
      }
    }
  }

  // Initialize theme immediately
  setTheme(getPreferredTheme());

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = root.getAttribute('data-theme') || 'light';
      setTheme(currentTheme === 'dark' ? 'light' : 'dark');
    });
  }

  // Listen to OS theme changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem(THEME_STORAGE_KEY)) {
      setTheme(e.matches ? 'dark' : 'light');
    }
  });

  // --- 2. Mobile Menu Navigation (Accessible) ---
  const menuBtn = document.getElementById('mobile-menu-btn');
  const navDrawer = document.getElementById('primary-nav');

  if (menuBtn && navDrawer) {
    menuBtn.addEventListener('click', () => {
      const isExpanded = menuBtn.getAttribute('aria-expanded') === 'true';
      menuBtn.setAttribute('aria-expanded', String(!isExpanded));
      navDrawer.classList.toggle('is-open');

      if (!isExpanded) {
        // Focus first link in drawer for keyboard a11y
        const firstLink = navDrawer.querySelector('a');
        if (firstLink) firstLink.focus();
      }
    });

    // Close on Escape key press
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navDrawer.classList.contains('is-open')) {
        navDrawer.classList.remove('is-open');
        menuBtn.setAttribute('aria-expanded', 'false');
        menuBtn.focus();
      }
    });
  }

  // --- 3. Accessible Contact Form Validation ---
  const contactForm = document.getElementById('contact-form');
  const alertBox = document.getElementById('form-alert');

  if (contactForm && alertBox) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let isValid = true;
      let firstInvalidInput = null;

      // Fields to validate
      const fields = [
        {
          id: 'full-name',
          validate: (val) => val.trim().length >= 2,
          errorId: 'name-error',
          errorMsg: 'Please enter your full name (at least 2 characters).'
        },
        {
          id: 'email-address',
          validate: (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim()),
          errorId: 'email-error',
          errorMsg: 'Please enter a valid email address (e.g., name@example.com).'
        },
        {
          id: 'message-subject',
          validate: (val) => val.trim().length > 0,
          errorId: 'subject-error',
          errorMsg: 'Please select a subject for your message.'
        },
        {
          id: 'message-body',
          validate: (val) => val.trim().length >= 10,
          errorId: 'body-error',
          errorMsg: 'Please enter a message containing at least 10 characters.'
        }
      ];

      fields.forEach((field) => {
        const input = document.getElementById(field.id);
        const errorEl = document.getElementById(field.errorId);
        const group = input ? input.closest('.form-group') : null;

        if (input && errorEl && group) {
          if (!field.validate(input.value)) {
            isValid = false;
            group.classList.add('has-error');
            errorEl.textContent = field.errorMsg;
            input.setAttribute('aria-invalid', 'true');
            if (!firstInvalidInput) {
              firstInvalidInput = input;
            }
          } else {
            group.classList.remove('has-error');
            errorEl.textContent = '';
            input.removeAttribute('aria-invalid');
          }
        }
      });

      if (!isValid) {
        alertBox.className = 'alert-box alert-error active';
        alertBox.textContent = 'Please correct the highlighted errors before submitting.';
        if (firstInvalidInput) {
          firstInvalidInput.focus();
        }
        return;
      }

      // Success Feedback
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending Message...';
      }

      setTimeout(() => {
        contactForm.reset();
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Send Message';
        }
        alertBox.className = 'alert-box alert-success active';
        alertBox.textContent = '🎉 Thank you! Your message has been sent successfully. I will get back to you shortly.';
        alertBox.focus();
      }, 800);
    });
  }
})();
