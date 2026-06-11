// Force starting page (top scroll & no hash) on page refresh
if (history.scrollRestoration) {
  history.scrollRestoration = 'manual';
}

// Convert hash links to custom attributes to prevent showing destination in browser status bar on hover
function initScrollLinks() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    const target = a.getAttribute('href');
    a.removeAttribute('href');
    a.setAttribute('data-scroll-to', target);
    a.style.cursor = 'pointer';
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initScrollLinks);
} else {
  initScrollLinks();
}

// Global click handler for smooth scrolling
document.addEventListener('click', (e) => {
  const scrollTarget = e.target.closest('[data-scroll-to]');
  if (scrollTarget) {
    e.preventDefault();
    const selector = scrollTarget.getAttribute('data-scroll-to');
    if (selector === '#') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const element = document.querySelector(selector);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
    // Close mobile menu if open
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');
    if (hamburger && navLinks && navLinks.classList.contains('open')) {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
      document.body.style.overflow = '';
    }
  }
});

// Detect reload/refresh
const isReload = 
  (performance.getEntriesByType && performance.getEntriesByType('navigation')[0] && performance.getEntriesByType('navigation')[0].type === 'reload') ||
  (window.performance && window.performance.navigation && window.performance.navigation.type === 1);

if (isReload) {
  // Clear URL hash
  if (window.location.hash) {
    history.replaceState(null, document.title, window.location.pathname + window.location.search);
  }
  // Scroll to top instantly
  window.scrollTo(0, 0);
}

// Ensure scroll position is reset to top on DOM load for reloads/fresh visits
window.addEventListener('DOMContentLoaded', () => {
  if (isReload) {
    window.scrollTo(0, 0);
    // Reset all form elements
    document.querySelectorAll('form').forEach(form => form.reset());
    // Reset all input/textarea fields (including terminal ones not in forms)
    document.querySelectorAll('input, textarea').forEach(field => {
      if (field.type === 'checkbox' || field.type === 'radio') {
        field.checked = field.defaultChecked;
      } else {
        field.value = field.defaultValue || '';
      }
    });
  }
});

// Mobile navigation drop menu
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');
    
    if (hamburger && navLinks) {
      hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('open');
        const isOpen = navLinks.classList.toggle('open');
        document.body.style.overflow = isOpen ? 'hidden' : '';
      });
      
      navLinks.querySelectorAll('a').forEach(a => {
        a.addEventListener('click', () => {
          hamburger.classList.remove('open');
          navLinks.classList.remove('open');
          document.body.style.overflow = '';
        });
      });
    }

    // Intersection observer for scrolling fade-up items
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(e => { 
        if (e.isIntersecting) { 
          e.target.classList.add('visible'); 
          observer.unobserve(e.target); 
        } 
      });
    }, { threshold: 0.12 });

    document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));

    // Interactive Terminal CTA
    function executeTermSignup() {
      const emailInput = document.getElementById('termEmail');
      const inputLine = document.getElementById('inputLine');
      const termBody = document.getElementById('termBody');
      const email = emailInput.value.trim();

      if (!email || !email.includes('@')) {
        // Output error to terminal
        const errLine = document.createElement('div');
        errLine.className = 'term-line';
        errLine.style.color = '#ef4444';
        errLine.innerHTML = `[ERROR] Invalid credentials format. Retry.`;
        termBody.insertBefore(errLine, inputLine);
        emailInput.style.color = '#ef4444';
        setTimeout(() => { emailInput.style.color = '#000000'; }, 1000);
        return;
      }

      // Hide input line and append simulation steps
      inputLine.style.display = 'none';
      
      appendTerminalLine(`guest@secops:~$ ./request_access.sh --email=${email}`, 'term-line');
      appendTerminalLine('Connecting to SecOps Authorization Node...', 'term-line info-line');
      
      setTimeout(() => {
        appendTerminalLine('[OK] Securing connection handshake: DH-Exchange established (2048-bit).', 'term-line info-line');
      }, 500);

      setTimeout(() => {
        appendTerminalLine(`[OK] Registry success: Email hash saved.`, 'term-line info-line');
      }, 1000);

      setTimeout(() => {
        appendTerminalLine('----------------------------------------------------', 'term-line info-line');
        appendTerminalLine('🔑 SYSTEM ACCESS AUTHORIZED!', 'term-line success-line');
        appendTerminalLine(`[SUCCESS] Access token dispatched to ${email}. Check inbox for further directives.`, 'term-line success-line');
        appendTerminalLine('guest@secops:~$ logout', 'term-line');
        appendTerminalLine('Connection closed. Stay secure.', 'term-line info-line');
      }, 1500);
    }

    function appendTerminalLine(text, className) {
      const termBody = document.getElementById('termBody');
      const newLine = document.createElement('div');
      newLine.className = className;
      newLine.textContent = text;
      termBody.appendChild(newLine);
      termBody.scrollTop = termBody.scrollHeight;
    }

    // ── INTERACTIVE 3D MOUSE-TRACKING SENTINEL CONTROLS ──
    const heroSec = document.getElementById('heroSec');
    const robots3D = document.getElementById('robots3D');
    const gridFloor = document.getElementById('gridFloor');
    const leftPod = document.querySelector('.pod-left');
    const rightPod = document.querySelector('.pod-right');

    if (heroSec && robots3D && gridFloor && leftPod && rightPod) {
      // Clear transitions when mouse enters to ensure immediate, lag-free tracking
      heroSec.addEventListener('mouseenter', () => {
        robots3D.style.transition = 'none';
        gridFloor.style.transition = 'none';
        leftPod.style.transition = 'none';
        rightPod.style.transition = 'none';
      });

      let ticking = false;
      heroSec.addEventListener('mousemove', (e) => {
        if (!ticking) {
          window.requestAnimationFrame(() => {
            const rect = heroSec.getBoundingClientRect();
            
            // Calculate mouse position relative to hero center (ranges from -0.5 to 0.5)
            const xVal = (e.clientX - rect.left) / rect.width - 0.5;
            const yVal = (e.clientY - rect.top) / rect.height - 0.5;
            
            // Tilt values
            const tiltX = -yVal * 16; 
            const tiltY = xVal * 20;  
            
            // Apply tilt and translation to the primary container
            robots3D.style.transform = `rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
            gridFloor.style.transform = `rotateX(${75 + tiltX * 0.4}deg) rotateY(${tiltY * 0.4}deg) translateZ(-100px)`;
            
            // Subtle offset tilt on individual pods including Z rotations
            leftPod.style.transform = `rotateY(${-15 + xVal * 12}deg) rotateX(${tiltX * 0.4}deg) rotateZ(3deg) translateZ(8px)`;
            rightPod.style.transform = `rotateY(${-25 + xVal * 12}deg) rotateX(${tiltX * 0.4}deg) rotateZ(-6deg) translateZ(8px)`;

            // Rotate the Three.js particle system matching the tilt
            if (window.points) {
              window.points.rotation.y = xVal * 0.6;
              window.points.rotation.x = yVal * 0.6;
            }
            ticking = false;
          });
          ticking = true;
        }
      });

      // Reset coordinates smoothly on mouse leave
      heroSec.addEventListener('mouseleave', () => {
        robots3D.style.transition = 'transform 0.8s cubic-bezier(0.25, 0.8, 0.25, 1)';
        gridFloor.style.transition = 'transform 0.8s cubic-bezier(0.25, 0.8, 0.25, 1)';
        leftPod.style.transition = 'transform 0.8s cubic-bezier(0.25, 0.8, 0.25, 1)';
        rightPod.style.transition = 'transform 0.8s cubic-bezier(0.25, 0.8, 0.25, 1)';
        
        robots3D.style.transform = 'rotateX(0deg) rotateY(0deg)';
        gridFloor.style.transform = 'rotateX(75deg) rotateY(0deg) translateZ(-100px)';
        leftPod.style.transform = 'rotateY(-15deg) rotateZ(3deg) translateZ(0px)';
        rightPod.style.transform = 'rotateY(-25deg) rotateZ(-6deg) translateZ(0px)';

        if (window.points) {
          const resetTween = () => {
            if (Math.abs(window.points.rotation.y) > 0.001 || Math.abs(window.points.rotation.x) > 0.001) {
              window.points.rotation.y *= 0.9;
              window.points.rotation.x *= 0.9;
              requestAnimationFrame(resetTween);
            }
          };
          setTimeout(resetTween, 100);
        }
      });
    }

    // Scroll effect: Navigation bar style transition
    const mainNav = document.querySelector('nav');
    if (mainNav) {
      let isScrolled = false;
      const updateScroll = () => {
        if (window.scrollY > 10) {
          if (!isScrolled) {
            mainNav.classList.add('scrolled');
            isScrolled = true;
          }
        } else {
          if (isScrolled) {
            mainNav.classList.remove('scrolled');
            isScrolled = false;
          }
        }
      };
      // Run once on load to sync scroll state
      updateScroll();
      window.addEventListener('scroll', updateScroll, { passive: true });
    }

    // Custom B2B Campus Demo request handler with error feedback
    function handleInstDemoSubmit(e) {
      e.preventDefault();

      const instNameInput = document.getElementById('instName');
      const instSchoolInput = document.getElementById('instSchool');
      const instRoleInput = document.getElementById('instRole');
      const instPhoneInput = document.getElementById('instPhone');
      const instMessageInput = document.getElementById('instMessage');

      let hasError = false;

      // Reset errors
      [instNameInput, instSchoolInput, instRoleInput, instPhoneInput, instMessageInput].forEach(inp => {
        if (inp) inp.classList.remove('input-error');
      });

      // Validations
      if (!instNameInput || !instNameInput.value.trim()) {
        if (instNameInput) instNameInput.classList.add('input-error');
        hasError = true;
      }
      if (!instSchoolInput || !instSchoolInput.value.trim()) {
        if (instSchoolInput) instSchoolInput.classList.add('input-error');
        hasError = true;
      }
      if (!instRoleInput || !instRoleInput.value.trim()) {
        if (instRoleInput) instRoleInput.classList.add('input-error');
        hasError = true;
      }
      const phoneClean = instPhoneInput ? instPhoneInput.value.replace(/\D/g, '') : '';
      if (phoneClean.length < 10) {
        if (instPhoneInput) instPhoneInput.classList.add('input-error');
        hasError = true;
      }
      if (!instMessageInput || !instMessageInput.value.trim()) {
        if (instMessageInput) instMessageInput.classList.add('input-error');
        hasError = true;
      }

      if (hasError) return;

      const formEl = document.getElementById('instDemoForm');
      const successMsg = document.getElementById('instSuccessMsg');

      if (formEl && successMsg) {
        // Fade out form and show success message
        formEl.style.transition = 'opacity 0.4s ease';
        formEl.style.opacity = '0';

        setTimeout(() => {
          formEl.style.display = 'none';
          successMsg.style.display = 'block';
          successMsg.style.opacity = '0';
          successMsg.style.transition = 'opacity 0.5s ease';
          setTimeout(() => successMsg.style.opacity = '1', 50);
        }, 400);
      }
    }

    // Dynamic error state clearing on typing for inputs
    document.querySelectorAll('.reg-input, .reg-textarea').forEach(input => {
      input.addEventListener('input', () => {
        input.classList.remove('input-error');
      });
    });