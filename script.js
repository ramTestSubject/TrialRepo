/* ==========================================================================
   PREMIUM MINIMALIST PORTFOLIO - SCRIPT.JS
   Micheal Anto Jerrish C
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // ==========================================================================
  // 0. EMAILJS INITIALIZATION
  // ==========================================================================
  const EMAILJS_PUBLIC_KEY = 'pNHfcuOPBWfj6WRxm';     // Replace with your EmailJS Public Key
  const EMAILJS_SERVICE_ID = 'service_096ll5e';     // Replace with your EmailJS Service ID
  const EMAILJS_CONTACT_TEMPLATE_ID = "template_4us7azj";
  const EMAILJS_AUTOREPLY_TEMPLATE_ID = "template_r7ok88m";   // Replace with your EmailJS Template ID

  if (typeof emailjs !== 'undefined' && EMAILJS_PUBLIC_KEY !== 'YOUR_PUBLIC_KEY' && EMAILJS_PUBLIC_KEY !== '') {
    emailjs.init({
      publicKey: EMAILJS_PUBLIC_KEY,
    });
  }

  // ==========================================================================
  // 1. PRELOADER LOADING SCREEN
  // ==========================================================================
  const loader = document.getElementById('loader');

  // Fade out loader on window load
  window.addEventListener('load', () => {
    fadeOutLoader();
  });

  // Backup loader timeout (in case assets take too long)
  setTimeout(() => {
    fadeOutLoader();
  }, 1000);

  function fadeOutLoader() {
    if (loader && !loader.classList.contains('fade-out')) {
      loader.classList.add('fade-out');
    }
  }

  // ==========================================================================
  // 2. THEME TOGGLE (DARK / LIGHT)
  // ==========================================================================
  const themeToggleBtn = document.getElementById('theme-toggle');
  const themeIcon = document.getElementById('theme-icon');

  // Check local storage or system preference
  const savedTheme = localStorage.getItem('portfolio-theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);

  themeToggleBtn.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';

    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('portfolio-theme', newTheme);
    updateThemeIcon(newTheme);
  });

  function updateThemeIcon(theme) {
    if (!themeIcon) return;
    if (theme === 'light') {
      themeIcon.className = 'fa-solid fa-sun';
    } else {
      themeIcon.className = 'fa-solid fa-moon';
    }
  }

  // ==========================================================================
  // 3. HERO TYPING ANIMATION
  // ==========================================================================
  const typedTextSpan = document.getElementById('typed-text');
  const roles = [
    '   Web Developer.',
    '   3rd-Year CSE Student.',
    '   AR/VR Enthusiast.',
    '   AI Explorer.'
  ];

  const typingDelay = 100;
  const erasingDelay = 60;
  const newRoleDelay = 2000; // Pause between roles
  let roleIdx = 0;
  let charIdx = 0;

  function type() {
    if (charIdx < roles[roleIdx].length) {
      if (!typedTextSpan) return;
      typedTextSpan.textContent += roles[roleIdx].charAt(charIdx);
      charIdx++;
      setTimeout(type, typingDelay);
    } else {
      setTimeout(erase, newRoleDelay);
    }
  }

  function erase() {
    if (charIdx > 0) {
      if (!typedTextSpan) return;
      typedTextSpan.textContent = roles[roleIdx].substring(0, charIdx - 1);
      charIdx--;
      setTimeout(erase, erasingDelay);
    } else {
      roleIdx = (roleIdx + 1) % roles.length;
      setTimeout(type, typingDelay + 500);
    }
  }

  // Kickstart typing cycle
  if (roles.length && typedTextSpan) {
    setTimeout(type, 800);
  }

  // ==========================================================================
  // 4. SCROLL REVEAL OBSERVER
  // ==========================================================================
  const revealElements = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');

        // Dynamic progress bar fill for skills cards
        if (entry.target.classList.contains('skill-progress-card')) {
          const bar = entry.target.querySelector('.skill-progress-bar');
          if (bar) {
            const percent = bar.getAttribute('data-percent');
            bar.style.width = `${percent}%`;
          }
        }

        observer.unobserve(entry.target); // Reveal only once
      }
    });
  }, {
    threshold: 0.05,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // ==========================================================================
  // 5. MOBILE MENU HAMBURGER
  // ==========================================================================
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navMenu.classList.toggle('active');
    });
  }

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (hamburger && navMenu) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
      }
    });
  });

  // Hide nav on scroll down, show on scroll up
  let lastScrollY = window.scrollY;
  const headerEl = document.getElementById('header');

  window.addEventListener('scroll', () => {
    if (window.scrollY > lastScrollY && window.scrollY > 150) {
      headerEl.className = 'scroll-down';
    } else {
      headerEl.className = 'scroll-up';
    }
    lastScrollY = window.scrollY;
  });

  // ==========================================================================
  // 6. INTERACTIVE DIALOG MODALS (RESUME/DEMO)
  // ==========================================================================



  // ==========================================================================
  // 6. GITHUB INTEGRATION & PROJECTS CONTROLLER
  // ==========================================================================
  const GITHUB_USERNAME = 'Jerrish-py';
  const API_URL = `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated`;

  let allOtherRepos = [];
  let fetchStatus = 'idle'; // 'idle', 'loading', 'success', 'error'
  let isGalleryOpen = false;

  // Language colors configuration
  const languageColors = {
    'javascript': '#f1e05a',
    'typescript': '#3178c6',
    'python': '#3572a5',
    'html': '#e34c26',
    'css': '#563d7c',
    'jupyter notebook': '#da5b0b',
    'java': '#b07219',
    'c': '#555555'
  };

  // Featured project mappings and details content
  const featuredProjects = {
    'ai-career-recommendation-bot': {
      category: 'Machine Learning / Career Guidance',
      title: 'AI Career Recommendation Bot',
      description: 'An AI-powered Python bot that recommends tech career paths based on user interests in hardware or software domains. Built with pure Python and designed for students and job seekers.',
      tags: ['Python', 'AI/NLP', 'ML Models'],
      detailsHtml: `
        <p style="margin-bottom: 12px; line-height: 1.6;">An intelligent guidance system engineered during my internship. It maps engineering students' interests to career sectors through logical rule flows and ML classification inputs.</p>
        <div style="background: var(--card-bg-hover); border: 1px solid var(--card-border); padding: 1.2rem; border-radius: 8px; font-size: 0.9rem; line-height: 1.6; margin-bottom: 15px;">
          <strong style="color: var(--accent-secondary); display: block; margin-bottom: 6px;"><i class="fa-solid fa-list-check"></i> Key Architectures:</strong>
          <ul style="padding-left: 20px; color: var(--text-secondary); margin: 0;">
            <li style="margin-bottom: 4px;">Dynamic assessment forms capturing hardware vs. software affinities.</li>
            <li style="margin-bottom: 4px;">Rule-based translation classifying profile scores into detailed roadmaps.</li>
            <li style="margin-bottom: 4px;">Recommender pipeline linking outputs to specific books, tutorials, and certifications.</li>
          </ul>
        </div>
        <p style="color: var(--text-secondary); font-size: 0.88rem; line-height: 1.5;">This bot provides structural feedback to recruiters, offering candidates an introductory visual assessment of potential development careers.</p>
      `
    },
    'food-rescue-app': {
      category: 'Social Impact / Web Application',
      title: 'Food Rescue App',
      description: 'A web application dedicated to minimizing food waste by connecting local businesses with shelters to rescue surplus food and distribute it efficiently.',
      tags: ['TypeScript', 'Web App', 'React'],
      detailsHtml: `
        <p style="margin-bottom: 12px; line-height: 1.6;">A full-stack, client-responsive platform built to coordinate community food resources. Connects local food services directly with volunteer groups and distribution shelters.</p>
        <div style="background: var(--card-bg-hover); border: 1px solid var(--card-border); padding: 1.2rem; border-radius: 8px; font-size: 0.9rem; line-height: 1.6; margin-bottom: 15px;">
          <strong style="color: var(--accent-secondary); display: block; margin-bottom: 6px;"><i class="fa-solid fa-list-check"></i> Key Architectures:</strong>
          <ul style="padding-left: 20px; color: var(--text-secondary); margin: 0;">
            <li style="margin-bottom: 4px;">Geolocation Querying: Filters matching merchants with nearest neighborhood shelters.</li>
            <li style="margin-bottom: 4px;">Surplus Scheduling: Allows immediate posting of excess dishes and batch collections.</li>
            <li style="margin-bottom: 4px;">State Management: High-performance React contexts displaying pickup statuses.</li>
          </ul>
        </div>
        <p style="color: var(--text-secondary); font-size: 0.88rem; line-height: 1.5;">Maintains mobile responsiveness to accommodate volunteers updating rescue routes live from the field.</p>
      `
    },
    'electricity-consumption-analysis': {
      category: 'Data Analytics',
      title: 'Electricity Consumption Analysis',
      description: 'An AI-powered application to detect anomalies in electricity consumption. This project uses personalized, time-aware IsolationForest models for each client to identify patterns of fraud or equipment failure with high accuracy.',
      tags: ['Python', 'Jupyter Notebook', 'IsolationForest'],
      detailsHtml: `
        <p style="margin-bottom: 12px; line-height: 1.6;">A machine learning pipeline designed to flag electrical grid anomalies. Detects hardware failures and usage anomalies using historical smart-meter telemetry data.</p>
        <div style="background: var(--card-bg-hover); border: 1px solid var(--card-border); padding: 1.2rem; border-radius: 8px; font-size: 0.9rem; line-height: 1.6; margin-bottom: 15px;">
          <strong style="color: var(--accent-secondary); display: block; margin-bottom: 6px;"><i class="fa-solid fa-list-check"></i> Key Architectures:</strong>
          <ul style="padding-left: 20px; color: var(--text-secondary); margin: 0;">
            <li style="margin-bottom: 4px;">Personalized Profiling: Fits customer baseline benchmarks relative to weekly cycles.</li>
            <li style="margin-bottom: 4px;">IsolationForest Engine: Unsupervised outlier detection flags bypass grids.</li>
            <li style="margin-bottom: 4px;">Visual telemetry: Clean dashboards outputting consumption curves and anomalies.</li>
          </ul>
        </div>
        <p style="color: var(--text-secondary); font-size: 0.88rem; line-height: 1.5;">This mathematical baseline enables smart utility grids to automatically allocate repair technicians to problematic sectors.</p>
      `
    },
    'disease-predictor': {
      category: 'Machine Learning / Healthcare',
      title: 'Disease Predictor',
      description: 'Heart Disease Prediction using ML – A model that analyzes patient data to predict heart disease risk.',
      tags: ['Python', 'Jupyter Notebook', 'Healthcare ML'],
      detailsHtml: `
        <p style="margin-bottom: 12px; line-height: 1.6;">A clinical predictive classification tool analyzing physiological indicators to calculate risk levels for heart disease.</p>
        <div style="background: var(--card-bg-hover); border: 1px solid var(--card-border); padding: 1.2rem; border-radius: 8px; font-size: 0.9rem; line-height: 1.6; margin-bottom: 15px;">
          <strong style="color: var(--accent-secondary); display: block; margin-bottom: 6px;"><i class="fa-solid fa-list-check"></i> Key Architectures:</strong>
          <ul style="padding-left: 20px; color: var(--text-secondary); margin: 0;">
            <li style="margin-bottom: 4px;">Binary Classifier: Trained on clinical cardiovascular benchmarks.</li>
            <li style="margin-bottom: 4px;">Interactive Diagnostic Form: Easy inputs for age, cholesterol, ECG, and blood pressure.</li>
            <li style="margin-bottom: 4px;">Risk Dashboard: Color-coded scale outputs showing likelihood of cardiac risk.</li>
          </ul>
        </div>
        <p style="color: var(--text-secondary); font-size: 0.88rem; line-height: 1.5;">Designed to serve as a supportive diagnostic dashboard model for clinical entry demonstrations.</p>
      `
    }
  };

  // Helper: Format date strings to user-friendly relative/absolute time
  function formatGitHubDate(dateString) {
    if (!dateString) return 'recently';
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 30) return `${diffDays} days ago`;

    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }

  // Primary Fetch Action
  async function initGitHubFetch() {
    fetchStatus = 'loading';
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error(`HTTP Error ${response.status}`);

      const repos = await response.json();
      fetchStatus = 'success';

      // Clear secondary array
      allOtherRepos = [];

      repos.forEach(repo => {
        const nameLower = repo.name.toLowerCase();
        let matchedKey = null;

        // Smart repository prioritization mapping
        if (nameLower === 'ai-career-recommendation-bot') {
          matchedKey = 'ai-career-recommendation-bot';
        } else if (nameLower === 'food-rescue-app') {
          matchedKey = 'food-rescue-app';
        } else if (nameLower === 'electricity-consumption-analysis') {
          matchedKey = 'electricity-consumption-analysis';
        } else if (nameLower === 'disease-predictor') {
          matchedKey = 'disease-predictor';
        }

        if (matchedKey) {
          // Update featured DOM details
          const card = document.querySelector(`.featured-project-card[data-project-key="${matchedKey}"]`);
          if (card) {
            // Update stars
            const starsText = card.querySelector('.stars-count');
            if (starsText) starsText.textContent = repo.stargazers_count;

            // Update last updated date
            const dateText = card.querySelector('.updated-date');
            if (dateText) dateText.textContent = `Updated ${formatGitHubDate(repo.updated_at)}`;

            // Update GitHub Repository Link
            const codeBtn = card.querySelector('.project-github-link');
            if (codeBtn) codeBtn.setAttribute('href', repo.html_url);

            // Sync dynamic content back to mapping for modal detail retrieval
            featuredProjects[matchedKey].stars = repo.stargazers_count;
            featuredProjects[matchedKey].updated = formatGitHubDate(repo.updated_at);
            featuredProjects[matchedKey].html_url = repo.html_url;

            // Update description if available on GitHub
            if (repo.description) {
              const descText = card.querySelector('.project-desc');
              if (descText) descText.textContent = repo.description;
              featuredProjects[matchedKey].description = repo.description;
            }
          }
        } else {
          // Add remaining repository to dynamic gallery
          allOtherRepos.push(repo);
        }
      });

      // Ensure allOtherRepos are sorted by updated_at descending
      allOtherRepos.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));

    } catch (err) {
      console.warn('GitHub API fetch failed, degrading gracefully to fallback content.', err);
      fetchStatus = 'error';
    }
  }

  // Populate dynamic gallery cards in the DOM
  function renderAllProjectsGallery() {
    const gallery = document.getElementById('github-projects-gallery');
    if (!gallery) return;

    gallery.innerHTML = '';

    if (fetchStatus === 'error' || allOtherRepos.length === 0) {
      gallery.innerHTML = `
        <div class="glass-card" style="grid-column: 1 / -1; padding: 2.5rem; text-align: center; border-color: rgba(239, 68, 68, 0.2);">
          <i class="fa-solid fa-triangle-exclamation" style="font-size: 2.5rem; color: #f43f5e; margin-bottom: 12px;"></i>
          <h3 style="font-family: var(--font-heading); margin-bottom: 8px;">Network Sync Offline</h3>
          <p style="color: var(--text-secondary); max-width: 500px; margin: 0 auto 20px auto; font-size: 0.95rem;">
            Unable to dynamically query public repositories at this time. This may be due to active GitHub API rate limiting or temporary connection drops.
          </p>
          <a href="https://github.com/Jerrish-py" target="_blank" rel="noopener noreferrer" class="btn btn-primary" style="display: inline-flex;">
            <i class="fa-brands fa-github"></i> Visit Profile Directly
          </a>
        </div>
      `;
      return;
    }

    allOtherRepos.forEach(repo => {
      const card = document.createElement('div');
      card.className = 'secondary-project-card reveal active'; // activate immediate visual load

      // Safely fetch primary language dot
      const langName = repo.language || 'Other';
      const langColor = languageColors[langName.toLowerCase()] || 'var(--accent-primary)';

      // Handle null descriptions gracefully
      const descText = repo.description || 'No description provided. Click on the title or GitHub link to explore the complete repository.';

      card.innerHTML = `
        <div class="repo-header">
          <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer" class="repo-name" title="Open repository link in a new tab">
            ${repo.name}
          </a>
          <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer" class="repo-link-icon" aria-label="Open in new tab">
            <i class="fa-solid fa-arrow-up-right-from-square"></i>
          </a>
        </div>
        <p class="repo-desc">${descText}</p>
        <div class="repo-footer">
          <div class="repo-lang-group">
            <span class="repo-lang-dot" style="background: ${langColor};"></span>
            <span>${langName}</span>
          </div>
          <span class="repo-stars">
            <i class="fa-solid fa-star"></i> ${repo.stargazers_count}
          </span>
          <span>
            Updated ${formatGitHubDate(repo.updated_at)}
          </span>
        </div>
      `;

      gallery.appendChild(card);
    });
  }

  // Dynamic View All Projects Toggle
  const viewAllBtn = document.getElementById('btn-view-all-projects');
  const galleryDiv = document.getElementById('github-projects-gallery');
  const galleryLoader = document.getElementById('gallery-loader');

  if (viewAllBtn && galleryDiv && galleryLoader) {
    viewAllBtn.addEventListener('click', async () => {
      isGalleryOpen = !isGalleryOpen;

      if (isGalleryOpen) {
        // Toggle open states
        viewAllBtn.innerHTML = '<i class="fa-solid fa-chevron-up"></i> Hide Projects';
        galleryLoader.style.display = 'block';

        // Wait briefly for fetch, or trigger it if not done yet
        if (fetchStatus === 'idle') {
          await initGitHubFetch();
        } else if (fetchStatus === 'loading') {
          // Wait until loading finishes
          while (fetchStatus === 'loading') {
            await new Promise(resolve => setTimeout(resolve, 100));
          }
        }

        // Render and display gallery
        renderAllProjectsGallery();
        galleryLoader.style.display = 'none';
        galleryDiv.style.display = 'grid';

        // Smooth scroll focus into gallery
        setTimeout(() => {
          galleryDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      } else {
        // Close states
        viewAllBtn.innerHTML = '<i class="fa-solid fa-cubes"></i> View All Projects';
        galleryDiv.style.display = 'none';
        galleryLoader.style.display = 'none';

        // Smooth scroll focus back to project section title
        document.getElementById('projects').scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  }

  // Modal Detail Triggers for Featured Projects
  document.addEventListener('click', (e) => {
    const trigger = e.target.closest('.view-details-trigger');
    if (!trigger) return;

    const projectKey = trigger.getAttribute('data-project-key');
    const projectData = featuredProjects[projectKey];
    if (!projectData) return;

    const starsVal = projectData.stars !== undefined ? projectData.stars : '0';
    const updatedVal = projectData.updated ? `Updated ${projectData.updated}` : 'Updated recently';
    const repoUrl = projectData.html_url || `https://github.com/Jerrish-py/${projectKey}`;

    // Structure dynamic layout inside the modal
    const modalContent = `
      <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 12px;">
        <span class="project-tag" style="background: rgba(200, 168, 107, 0.08); border-color: rgba(200, 168, 107, 0.15); color: var(--accent-secondary); font-size: 0.7rem; font-weight: 700; padding: 0.15rem 0.5rem; text-transform: uppercase;">
          ${projectData.category}
        </span>
      </div>
      ${projectData.detailsHtml}
      
      <div style="border-top: 1px solid var(--card-border); padding-top: 1rem; margin-top: 1.5rem; display: flex; justify-content: space-between; align-items: center; font-size: 0.8rem; color: var(--text-muted);">
        <span style="display: inline-flex; align-items: center; gap: 4px;"><i class="fa-solid fa-star" style="color: var(--accent-secondary);"></i> <strong>${starsVal}</strong> stars</span>
        <span><i class="fa-solid fa-clock"></i> ${updatedVal}</span>
      </div>
    `;

    showFuturisticModal(
      projectData.title,
      modalContent,
      () => {
        window.open(repoUrl, '_blank', 'noopener,noreferrer');
      }
    );

    // Customize the proceed button in the modal to act as "Visit Repository"
    const modalProceedBtn = document.querySelector('div[style*="z-index: 99999"] .btn-primary');
    if (modalProceedBtn) {
      modalProceedBtn.innerHTML = '<i class="fa-brands fa-github"></i> Visit Repository';
    }
  });

  // Kickstart repository fetch in background
  initGitHubFetch();

  // Contact Form Submission Action
  window.showConfirmationDialog = function () {
    const senderName = document.getElementById('name').value;
    const form = document.getElementById('contact-form-card');
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalBtnContent = submitBtn.innerHTML;

    // 1. If keys are placeholders, show fallback/instruction modal
    if (EMAILJS_PUBLIC_KEY === 'YOUR_PUBLIC_KEY' || EMAILJS_PUBLIC_KEY === '' ||
      EMAILJS_SERVICE_ID === 'YOUR_SERVICE_ID' || EMAILJS_SERVICE_ID === '' ||
      EMAILJS_CONTACT_TEMPLATE_ID === 'YOUR_TEMPLATE_ID' || EMAILJS_CONTACT_TEMPLATE_ID === '' ||
      EMAILJS_AUTOREPLY_TEMPLATE_ID === 'YOUR_TEMPLATE_ID' || EMAILJS_AUTOREPLY_TEMPLATE_ID === '') {

      showFuturisticModal(
        'EmailJS Integration (Demo Mode)',
        `<p style="margin-bottom: 12px;">Thank you for reaching out, <strong>${senderName}</strong>!</p>
         <p style="color: var(--text-secondary); font-size: 0.95rem; line-height: 1.6; margin-bottom: 12px;">
           The contact form is successfully wired with EmailJS, but it is currently running in <strong>Demo Mode</strong>.
         </p>
         <p style="color: var(--text-secondary); font-size: 0.95rem; line-height: 1.6; margin-bottom: 12px;">
           To receive real emails, open <a href="file:///e:/PROJECTS/new%20Portfolio/script.js" style="color: var(--accent-primary); font-weight: 600; text-decoration: underline;">script.js</a> and update the placeholders at the top of the file:
         </p>
         <code style="display: block; background: var(--bg-card); padding: 12px; border-radius: 8px; font-family: monospace; font-size: 0.85rem; color: var(--accent-secondary); border: 1px solid var(--border-color); line-height: 1.5; margin-bottom: 12px;">
           const EMAILJS_PUBLIC_KEY = '...';<br>
           const EMAILJS_SERVICE_ID = '...';<br>
           const EMAILJS_CONTACT_TEMPLATE_ID = '...';<br>
           const EMAILJS_AUTOREPLY_TEMPLATE_ID = '...';
         </code>
         <p style="color: var(--text-secondary); font-size: 0.95rem; line-height: 1.6;">
           (Your message details have been printed to the browser console for developer inspection.)
         </p>`,
        null
      );
      console.log('Contact Form Submission (Demo Mode):', {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        message: document.getElementById('message').value
      });
      form.reset();
      return;
    }

    // 2. Disable submit button to prevent double-submissions
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending Message...';

    // 3. Send form data via EmailJS Browser SDK
    emailjs.sendForm(
      EMAILJS_SERVICE_ID,
      EMAILJS_CONTACT_TEMPLATE_ID,
      form
    )
      .then(() => {
        console.log('Owner notification sent successfully');

        return emailjs.sendForm(
          EMAILJS_SERVICE_ID,
          EMAILJS_AUTOREPLY_TEMPLATE_ID,
          form
        );
      })
      .then(() => {
        console.log('Auto reply sent successfully');

        showFuturisticModal(
          'Message Sent Successfully',
          `<p style="margin-bottom: 10px;">
       Thank you for reaching out, <strong>${senderName}</strong>!
     </p>
     <p style="color: var(--text-secondary); line-height: 1.6;">
       Your message has been successfully sent.
       A confirmation email has been sent to your inbox and I will get back to you as soon as possible.
     </p>`,
          null
        );

        form.reset();
      })
      .catch((error) => {
        console.error('EmailJS Error:', error);

        showFuturisticModal(
          'Delivery Failed',
          `<p style="margin-bottom: 10px; color: #ff5555; font-weight: bold;">
       Could not deliver the message.
     </p>
     <p style="color: var(--text-secondary); line-height: 1.6;">
       Error: <strong>${error.text || error}</strong>
     </p>`,
          null
        );
      })
      .finally(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Send Message';
      });
  };

/**
 * Spawns a clean, responsive modal dialog matching the typography scale
 */
function showFuturisticModal(title, htmlContent, actionCallback) {
  const theme = document.documentElement.getAttribute('data-theme');

  const modal = document.createElement('div');
  modal.style.position = 'fixed';
  modal.style.top = '0';
  modal.style.left = '0';
  modal.style.width = '100vw';
  modal.style.height = '100vh';
  // Muted overlay adapting to theme backgrounds
  modal.style.background = theme === 'light' ? 'rgba(92, 100, 96, 0.35)' : 'rgba(11, 18, 15, 0.8)';
  modal.style.backdropFilter = 'blur(12px)';
  modal.style.display = 'flex';
  modal.style.justifyContent = 'center';
  modal.style.alignItems = 'center';
  modal.style.zIndex = '99999';
  modal.style.opacity = '0';
  modal.style.transition = 'opacity 0.3s ease';

  const card = document.createElement('div');
  card.className = 'glass-card';
  card.style.padding = '2.5rem';
  card.style.maxWidth = '480px';
  card.style.width = '90%';
  card.style.boxShadow = 'var(--shadow-lg)';
  card.style.transform = 'scale(0.95)';
  card.style.transition = 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)';

  const h3 = document.createElement('h3');
  h3.style.fontFamily = 'var(--font-heading)';
  h3.style.fontSize = '1.5rem';
  h3.style.margin = '0 0 1.2rem 0';
  h3.style.color = 'var(--text-primary)';
  h3.style.fontWeight = '700';
  h3.innerHTML = title;

  const bodyDiv = document.createElement('div');
  bodyDiv.style.margin = '0 0 2rem 0';
  bodyDiv.style.color = 'var(--text-secondary)';
  bodyDiv.style.fontSize = '1rem';
  bodyDiv.innerHTML = htmlContent;

  const btnWrapper = document.createElement('div');
  btnWrapper.style.display = 'flex';
  btnWrapper.style.gap = '1rem';

  const closeBtn = document.createElement('button');
  closeBtn.className = 'btn btn-secondary';
  closeBtn.textContent = 'Close';
  closeBtn.style.padding = '0.5rem 1.5rem';

  btnWrapper.appendChild(closeBtn);

  if (actionCallback) {
    const confirmBtn = document.createElement('button');
    confirmBtn.className = 'btn btn-primary';
    confirmBtn.textContent = 'Proceed';
    confirmBtn.style.padding = '0.5rem 1.5rem';
    confirmBtn.addEventListener('click', () => {
      actionCallback();
      closeModal();
    });
    btnWrapper.appendChild(confirmBtn);
  }

  card.appendChild(h3);
  card.appendChild(bodyDiv);
  card.appendChild(btnWrapper);
  modal.appendChild(card);
  document.body.appendChild(modal);

  // Trigger animate-in
  setTimeout(() => {
    modal.style.opacity = '1';
    card.style.transform = 'scale(1)';
  }, 10);

  const closeModal = () => {
    modal.style.opacity = '0';
    card.style.transform = 'scale(0.95)';
    setTimeout(() => {
      document.body.removeChild(modal);
    }, 300);
  };

  closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });
}
});
