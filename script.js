// script.js

document.addEventListener('DOMContentLoaded', () => {
   // --- Smooth Scrolling for Navigation ---
   document.querySelectorAll('nav a[href^="#"]').forEach(anchor => {
       anchor.addEventListener('click', function (e) {
           e.preventDefault();
           const targetId = this.getAttribute('href');
           const targetElement = document.querySelector(targetId);
           if (targetElement) {
               // Get the fixed header height to offset scroll position
               const headerOffset = document.querySelector('.site-header').offsetHeight;
               const elementPosition = targetElement.getBoundingClientRect().top + window.scrollY;
               const offsetPosition = elementPosition - headerOffset - 20; // Add a little extra padding

               window.scrollTo({
                   top: offsetPosition,
                   behavior: 'smooth'
               });
           }
       });
   });

   // --- Navigation Active State and Scroll Blur ---
   const navLinks = document.querySelectorAll('.nav-links a');
   const sections = document.querySelectorAll('main section');
   const header = document.querySelector('.site-header');
   const heroSection = document.getElementById('hero');

   const observerOptions = {
       root: null,
       rootMargin: '-50% 0px -50% 0px', // Trigger when section is roughly in the middle of the viewport
       threshold: 0 // We'll handle entry/exit
   };

   const navObserver = new IntersectionObserver((entries) => {
       entries.forEach(entry => {
           const id = entry.target.getAttribute('id');
           const navLink = document.querySelector(`.nav-links a[href="#${id}"]`);

           if (navLink) {
               if (entry.isIntersecting) {
                   navLinks.forEach(link => link.classList.remove('active'));
                   navLink.classList.add('active');
               }
           }
       });
   }, observerOptions);

   sections.forEach(section => {
       navObserver.observe(section);
   });

   // Add blur/opacity to nav on scroll
   const headerScrollObserver = new IntersectionObserver((entries) => {
       entries.forEach(entry => {
           if (!entry.isIntersecting) {
               header.classList.add('scrolled');
           } else {
               header.classList.remove('scrolled');
           }
       });
   }, {
       root: null,
       rootMargin: '-100px 0px 0px 0px', // Trigger when hero is 100px from top
       threshold: 0
   });

   if (heroSection) {
       headerScrollObserver.observe(heroSection);
   }


   // --- Scroll Reveal Animation ---
   const scrollRevealElements = document.querySelectorAll('.scroll-reveal');

   const revealObserver = new IntersectionObserver((entries, observer) => {
       entries.forEach(entry => {
           if (entry.isIntersecting) {
               entry.target.classList.add('is-visible');
               observer.unobserve(entry.target); // Stop observing once revealed
           }
       });
   }, {
       root: null,
       rootMargin: '0px',
       threshold: 0.1 // Trigger when 10% of the element is visible
   });

   scrollRevealElements.forEach(el => {
       revealObserver.observe(el);
   });

   // --- Hero Section Animations ---
   const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
   const heroStatusDot = document.querySelector('.hero-section .status-dot');
   const staggeredDotsContainer = document.querySelector('.staggered-dots');
   const staggeredDots = document.querySelectorAll('.stagger-dot');

   if (!prefersReducedMotion) {
       // Blinking status dot (CSS animation handles this)
       if (heroStatusDot) {
           heroStatusDot.classList.add('blinking');
       }

       // Staggered dots boot sequence
       if (staggeredDotsContainer && staggeredDots.length > 0) {
           setTimeout(() => {
               staggeredDotsContainer.classList.add('visible');
               staggeredDots.forEach((dot, index) => {
                   setTimeout(() => {
                       dot.style.transform = 'scale(1)';
                       dot.style.opacity = '1';
                   }, index * 150); // Staggered delay
               });
           }, 1000); // Delay before boot sequence starts
       }
   } else {
       // If prefers-reduced-motion is active, ensure elements are visible
       if (heroStatusDot) {
           heroStatusDot.classList.remove('blinking');
           heroStatusDot.style.opacity = '1';
       }
       if (staggeredDotsContainer) {
           staggeredDotsContainer.classList.add('visible');
           staggeredDots.forEach(dot => {
               dot.style.transform = 'scale(1)';
               dot.style.opacity = '1';
           });
       }
   }

   // --- Project Card Signal Color Bar ---
   document.querySelectorAll('.project-card').forEach(card => {
       const signalColor = card.dataset.signalColor;
       const projectBar = card.querySelector('.project-bar');
       if (projectBar && signalColor) {
           projectBar.style.backgroundColor = signalColor;

           // Add hover glow effect
           card.addEventListener('mouseenter', () => {
               projectBar.style.boxShadow = `0 0 15px ${signalColor}`;
           });
           card.addEventListener('mouseleave', () => {
               projectBar.style.boxShadow = 'none';
           });
       }
   });

   // --- Footer Current Year ---
   const currentYearSpan = document.getElementById('current-year');
   if (currentYearSpan) {
       currentYearSpan.textContent = new Date().getFullYear();
   }
});
