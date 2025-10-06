// JavaScript functionality for Patty McClain Wellness website
document.addEventListener('DOMContentLoaded', function() {
  
  // Dynamic year in footer
  const yearElement = document.getElementById('year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  // Form handling and validation
  const forms = document.querySelectorAll('form[netlify]');
  forms.forEach(form => {
    form.addEventListener('submit', function(e) {
      // Basic form validation
      const requiredFields = form.querySelectorAll('[required]');
      let isValid = true;
      
      requiredFields.forEach(field => {
        if (!field.value.trim()) {
          isValid = false;
          field.style.borderColor = '#ef4444';
          
          // Remove error styling after user starts typing
          field.addEventListener('input', function() {
            this.style.borderColor = '';
          });
        }
      });

      if (!isValid) {
        e.preventDefault();
        // Show error message
        showNotification('Please fill in all required fields.', 'error');
        return;
      }

      // Show loading state
      const submitBtn = form.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;
      }
    });
  });

  // Newsletter form success handling
  document.querySelectorAll('form[name^="newsletter"]').forEach(form => {
    form.addEventListener('submit', function(e) {
      setTimeout(() => {
        showNotification('Thank you for subscribing! You\'ll receive wellness tips soon.', 'success');
        this.reset();
      }, 1000);
    });
  });

  // Product card interactions
  document.querySelectorAll('.product').forEach(product => {
    // Add subtle hover effects
    product.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-4px)';
    });
    
    product.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0)';
    });
  });

  // Outbound link tracking (for analytics)
  document.querySelectorAll('a[target="_blank"]').forEach(link => {
    link.addEventListener('click', function() {
      const url = this.href;
      
      // Track outbound clicks if analytics is available
      if (typeof gtag !== 'undefined') {
        gtag('event', 'click', {
          event_category: 'outbound',
          event_label: url,
          value: 1
        });
      }
      
      console.log('Outbound click:', url);
    });
  });

  // Mobile menu toggle (if needed)
  const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
  const mainNav = document.querySelector('.main-nav');
  
  if (mobileMenuToggle && mainNav) {
    mobileMenuToggle.addEventListener('click', function() {
      mainNav.classList.toggle('is-open');
      this.setAttribute('aria-expanded', 
        this.getAttribute('aria-expanded') === 'true' ? 'false' : 'true'
      );
    });
  }

  // Article filtering (for articles page)
  const categoryBtns = document.querySelectorAll('.category-btn');
  const articleCards = document.querySelectorAll('.article-card[data-category]');
  
  if (categoryBtns.length > 0 && articleCards.length > 0) {
    categoryBtns.forEach(btn => {
      btn.addEventListener('click', function() {
        const category = this.dataset.category;
        
        // Update active button
        categoryBtns.forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        
        // Filter articles with animation
        articleCards.forEach(card => {
          if (category === 'all' || card.dataset.category === category) {
            card.style.display = 'block';
            card.style.animation = 'fadeIn 0.3s ease-in';
          } else {
            card.style.display = 'none';
          }
        });

        // Track category selection
        if (typeof gtag !== 'undefined') {
          gtag('event', 'filter', {
            event_category: 'articles',
            event_label: category,
            value: 1
          });
        }
      });
    });
  }

  // Expandable sections for full articles
  document.querySelectorAll('a[href^="#"][href$="-full"]').forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href').substring(1);
      const target = document.getElementById(targetId);
      
      if (target) {
        // Show the full article
        target.style.display = 'block';
        target.scrollIntoView({ behavior: 'smooth' });
        
        // Track article reading
        if (typeof gtag !== 'undefined') {
          gtag('event', 'read_article', {
            event_category: 'content',
            event_label: targetId,
            value: 1
          });
        }
      }
    });
  });

  // Lazy loading for images
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
          }
          imageObserver.unobserve(img);
        }
      });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
      imageObserver.observe(img);
    });
  }

  // Scroll-to-top functionality
  const scrollToTopBtn = document.createElement('button');
  scrollToTopBtn.innerHTML = '↑';
  scrollToTopBtn.className = 'scroll-to-top';
  scrollToTopBtn.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background: var(--primary);
    color: white;
    border: none;
    font-size: 20px;
    cursor: pointer;
    display: none;
    z-index: 1000;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    transition: all 0.3s ease;
  `;
  
  document.body.appendChild(scrollToTopBtn);

  // Show/hide scroll to top button
  window.addEventListener('scroll', function() {
    if (window.pageYOffset > 300) {
      scrollToTopBtn.style.display = 'block';
    } else {
      scrollToTopBtn.style.display = 'none';
    }
  });

  scrollToTopBtn.addEventListener('click', function() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  // Page visibility tracking (for analytics)
  document.addEventListener('visibilitychange', function() {
    if (typeof gtag !== 'undefined') {
      gtag('event', document.hidden ? 'page_hidden' : 'page_visible', {
        event_category: 'engagement',
        value: 1
      });
    }
  });

  // Contact form enhancements
  const contactForm = document.querySelector('form[name="contact"]');
  if (contactForm) {
    // Character count for message field
    const messageField = contactForm.querySelector('textarea[name="message"]');
    if (messageField) {
      const charCount = document.createElement('div');
      charCount.style.cssText = 'font-size: 0.8rem; color: var(--muted); text-align: right; margin-top: 4px;';
      messageField.parentNode.appendChild(charCount);
      
      function updateCharCount() {
        const length = messageField.value.length;
        charCount.textContent = `${length} characters`;
        if (length > 1000) {
          charCount.style.color = 'var(--error)';
        } else {
          charCount.style.color = 'var(--muted)';
        }
      }
      
      messageField.addEventListener('input', updateCharCount);
      updateCharCount();
    }
  }

  // Product recommendation logic
  function showProductRecommendations() {
    const currentPage = window.location.pathname;
    
    if (currentPage.includes('success.html')) {
      // Show relevant product recommendations on success page
      const recommendationContainer = document.querySelector('.resources-grid');
      if (recommendationContainer) {
        console.log('Success page - showing product recommendations');
      }
    }
  }

  showProductRecommendations();

  // Analytics and performance tracking
  function trackPagePerformance() {
    window.addEventListener('load', function() {
      if ('performance' in window) {
        const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
        
        if (typeof gtag !== 'undefined' && loadTime > 0) {
          gtag('event', 'timing_complete', {
            name: 'page_load',
            value: loadTime
          });
        }
        
        console.log(`Page load time: ${loadTime}ms`);
      }
    });
  }

  trackPagePerformance();

  // Accessibility enhancements
  function enhanceAccessibility() {
    // Add skip link
    const skipLink = document.createElement('a');
    skipLink.href = '#main';
    skipLink.textContent = 'Skip to main content';
    skipLink.className = 'sr-only skip-link';
    skipLink.style.cssText = `
      position: absolute;
      top: -40px;
      left: 6px;
      background: var(--primary);
      color: white;
      padding: 8px;
      text-decoration: none;
      border-radius: 4px;
      z-index: 1000;
      transition: top 0.3s;
    `;
    
    skipLink.addEventListener('focus', function() {
      this.style.top = '6px';
    });
    
    skipLink.addEventListener('blur', function() {
      this.style.top = '-40px';
    });
    
    document.body.insertBefore(skipLink, document.body.firstChild);

    // Enhance focus indicators
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Tab') {
        document.body.classList.add('using-keyboard');
      }
    });
    
    document.addEventListener('mousedown', function() {
      document.body.classList.remove('using-keyboard');
    });
  }

  enhanceAccessibility();

  console.log('Patty McClain Wellness website loaded successfully! 🌱');
});

// Utility function for showing notifications
function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: ${type === 'success' ? 'var(--success)' : type === 'error' ? 'var(--error)' : 'var(--primary)'};
    color: white;
    padding: 16px 20px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    z-index: 1000;
    max-width: 300px;
    opacity: 0;
    transform: translateX(100%);
    transition: all 0.3s ease;
  `;
  
  document.body.appendChild(notification);
  
  // Animate in
  setTimeout(() => {
    notification.style.opacity = '1';
    notification.style.transform = 'translateX(0)';
  }, 100);
  
  // Auto-remove after 5 seconds
  setTimeout(() => {
    notification.style.opacity = '0';
    notification.style.transform = 'translateX(100%)';
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  }, 5000);
  
  // Allow manual dismissal
  notification.addEventListener('click', function() {
    this.style.opacity = '0';
    this.style.transform = 'translateX(100%)';
    setTimeout(() => {
      if (this.parentNode) {
        this.parentNode.removeChild(this);
      }
    }, 300);
  });
}

// CSS for enhanced keyboard navigation
const style = document.createElement('style');
style.textContent = `
  .using-keyboard *:focus {
    outline: 2px solid var(--primary) !important;
    outline-offset: 2px !important;
  }
  
  .skip-link:focus {
    top: 6px !important;
  }
  
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  .notification {
    cursor: pointer;
  }
  
  .scroll-to-top:hover {
    background: var(--primary-700) !important;
    transform: translateY(-2px) !important;
  }
`;
document.head.appendChild(style);