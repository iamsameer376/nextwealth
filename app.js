/**
 * NextWealth — Apple Minimalist Interactive Engine
 * Refined Micro-interactions, Live Studio Simulation, Counters, and Dialog Control
 */

document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initNavbarScroll();
  initMobileMenu();
  initStatCounters();
  initInteractiveStudio();
  initPocModal();
  initCopyButtons();
  initFaqAccordion();
  initScrollReveal();
});

/* ==========================================================================
   1. Theme Switcher (Apple Titanium / Apple Studio Light)
   ========================================================================== */
function initThemeToggle() {
  const themeToggle = document.getElementById('themeToggle');
  if (!themeToggle) return;

  // Retrieve saved theme or prefer-color-scheme
  const savedTheme = localStorage.getItem('nw-theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');

  document.documentElement.setAttribute('data-theme', initialTheme);

  themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('nw-theme', newTheme);
    
    showToast(`Switched to ${newTheme === 'dark' ? 'Dark Titanium' : 'Studio Light'} mode`);
  });
}

/* ==========================================================================
   2. Sticky Navbar Glass & Scroll Detection
   ========================================================================== */
function initNavbarScroll() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  const handleScroll = () => {
    if (window.scrollY > 20) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

/* ==========================================================================
   3. Mobile Menu Toggle (iOS & Android Touch Support)
   ========================================================================== */
function initMobileMenu() {
  const mobileToggle = document.getElementById('mobileToggle');
  const navMenu = document.getElementById('navMenu');
  const mobileBackdrop = document.getElementById('mobileBackdrop');
  if (!mobileToggle || !navMenu) return;

  function toggleMenu(forceClose = false) {
    const isCurrentlyOpen = navMenu.classList.contains('open');
    const shouldOpen = forceClose ? false : !isCurrentlyOpen;

    navMenu.classList.toggle('open', shouldOpen);
    mobileToggle.classList.toggle('active', shouldOpen);
    if (mobileBackdrop) {
      mobileBackdrop.classList.toggle('active', shouldOpen);
    }
    document.body.classList.toggle('menu-locked', shouldOpen);
    mobileToggle.setAttribute('aria-expanded', shouldOpen);
  }

  mobileToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleMenu();
  });

  if (mobileBackdrop) {
    mobileBackdrop.addEventListener('click', () => {
      toggleMenu(true);
    });
  }

  // Close menu when clicking any nav link
  navMenu.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      toggleMenu(true);
    });
  });

  // Close menu when clicking POC button inside mobile menu
  navMenu.querySelectorAll('.open-poc-modal').forEach(btn => {
    btn.addEventListener('click', () => {
      toggleMenu(true);
    });
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navMenu.classList.contains('open')) {
      toggleMenu(true);
    }
  });
}

/* ==========================================================================
   4. Stat Counters with IntersectionObserver
   ========================================================================== */
function initStatCounters() {
  const statNumbers = document.querySelectorAll('.stat-number');
  if (!statNumbers.length) return;

  let hasRun = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !hasRun) {
        hasRun = true;
        statNumbers.forEach(stat => {
          const target = parseFloat(stat.getAttribute('data-target'));
          const suffix = stat.getAttribute('data-suffix') || '';
          const decimalPlaces = parseInt(stat.getAttribute('data-decimal') || '0', 10);
          
          animateCounter(stat, target, suffix, decimalPlaces, 1800);
        });
      }
    });
  }, { threshold: 0.3 });

  const metricsSection = document.getElementById('metrics');
  if (metricsSection) {
    observer.observe(metricsSection);
  }
}

function animateCounter(element, target, suffix, decimals, duration) {
  const startTime = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    // Apple ease-out cubic
    const easeProgress = 1 - Math.pow(1 - progress, 3);
    const currentVal = (target * easeProgress);

    element.textContent = (decimals > 0 ? currentVal.toFixed(decimals) : Math.floor(currentVal).toLocaleString()) + suffix;

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      element.textContent = (decimals > 0 ? target.toFixed(decimals) : target.toLocaleString()) + suffix;
    }
  }

  requestAnimationFrame(update);
}

/* ==========================================================================
   5. Interactive HITL Studio Workbench
   ========================================================================== */
const STUDIO_DATA = {
  automotive: {
    image: 'assets/autonomous.jpg',
    vertical: 'Automotive & ADAS',
    title: 'Sensor Fusion & LiDAR 3D Bounding',
    desc: 'Continuous multi-frame point cloud tracking across dense urban occlusion. NextWealth annotators correct occlusion boundaries and label high-speed micro-trajectories.',
    rawScore: '81.4%',
    hitlScore: '99.8%',
    delta: '+18.4% Accuracy Improvement',
    items: [
      { tag: 'LiDAR 3D Box', val: 'Sub-pixel verified (±0.02m)' },
      { tag: 'Edge Cases Fixed', val: 'Low-light pedestrians, obscured signs' },
      { tag: 'Turnaround SLA', val: '< 4 Hours Sprint Delivery' },
      { tag: 'Specialist Tier', val: 'ISO 26262 Trained Specialists' }
    ],
    markers: {
      raw: [
        { top: '65%', left: '26%', w: '18%', h: '22%', tag: 'Car A [92% Uncalibrated]', error: true },
        { top: '56%', left: '41%', w: '8%', h: '12%', tag: 'Car B [76% Low Conf]', error: true },
        { top: '51%', left: '59%', w: '9%', h: '16%', tag: 'Truck C [Missed Trailer]', error: true }
      ],
      hitl: [
        { top: '65%', left: '26%', w: '19%', h: '23%', tag: 'Vehicle 01 • 99.8% Ground Truth', error: false },
        { top: '56%', left: '41%', w: '8%', h: '12%', tag: 'Vehicle 02 • 99.6% Calibrated', error: false },
        { top: '51%', left: '59%', w: '10%', h: '18%', tag: 'Truck 03 • 99.9% Full Cuboid', error: false },
        { top: '48%', left: '33%', w: '5%', h: '10%', tag: 'Pedestrian • HITL Identified', error: false }
      ]
    }
  },
  healthcare: {
    image: 'assets/medical.jpg',
    vertical: 'Healthcare & Lifesciences',
    title: 'Multimodal Histopathology & MRI Segmentation',
    desc: 'Cellular boundary polygon segmentation and hippocampal lesion tracking. Every contour reviewed by clinical data specialists under strict HIPAA de-identification protocols.',
    rawScore: '78.2%',
    hitlScore: '99.9%',
    delta: '+21.7% Diagnostic Reliability',
    items: [
      { tag: 'Polygon Accuracy', val: 'Sub-cellular precision (IoU > 0.96)' },
      { tag: 'Clinical Validation', val: 'De-identified MD-reviewed' },
      { tag: 'Compliance', val: 'HIPAA & SOC2 Type II Certified' },
      { tag: 'Annotation Types', val: 'Instance & Semantic Segmentation' }
    ],
    markers: {
      raw: [
        { top: '46%', left: '25%', w: '22%', h: '22%', tag: 'Brain Ventricle [Overlap Error]', error: true },
        { top: '50%', left: '68%', w: '24%', h: '30%', tag: 'Cell Cluster [Under-segmented]', error: true }
      ],
      hitl: [
        { top: '46%', left: '25%', w: '23%', h: '24%', tag: 'Hippocampus Vol: 18.2 cm³ • 99.9%', error: false },
        { top: '50%', left: '68%', w: '26%', h: '32%', tag: 'Cell Density: 4,500/mm² • Human Verified', error: false }
      ]
    }
  },
  retail: {
    image: 'assets/retail.jpg',
    vertical: 'Retail & eCommerce',
    title: 'Granular Fashion Attribute & Hierarchy Tagging',
    desc: 'Fine-grained attribute taxonomy mapping (lapel style, fabric composition, color pantone, texture classification) for visual similarity and generative search indexing.',
    rawScore: '84.1%',
    hitlScore: '99.7%',
    delta: '+15.6% Search Relevance Lift',
    items: [
      { tag: 'Attributes Tagged', val: '120+ Micro-attributes per SKU' },
      { tag: 'Catalog Scale', val: '500k+ SKUs Processed Weekly' },
      { tag: 'Taxonomy Match', val: 'Standardized Pantone & Material' },
      { tag: 'Search Relevance', val: '+24% Lift in Add-to-Cart' }
    ],
    markers: {
      raw: [
        { top: '48%', left: '50%', w: '30%', h: '55%', tag: 'Jacket [Generic Label]', error: true }
      ],
      hitl: [
        { top: '48%', left: '50%', w: '32%', h: '58%', tag: 'Blazer: Wool Twill • Single-Breasted • 99.9%', error: false },
        { top: '40%', left: '69%', w: '16%', h: '16%', tag: 'Pantone 19-4005 TCX • Match', error: false }
      ]
    }
  },
  bfsi: {
    image: 'assets/hero_mesh.jpg',
    vertical: 'BFSI & Fintech',
    title: 'KYC Document Entity Extraction & Anti-Fraud',
    desc: 'Multilingual KYC entity parsing, tabular financial extraction, and risk assessment scoring. Verified by certified banking domain specialists with strict privacy guardrails.',
    rawScore: '83.5%',
    hitlScore: '99.9%',
    delta: '+16.4% Compliance Precision',
    items: [
      { tag: 'Entity Recognition', val: 'Passports, IDs, Invoices, Checks' },
      { tag: 'PII Protection', val: 'Automated Redaction + Human Audit' },
      { tag: 'Turnaround Time', val: '< 60 Seconds Instant Review' },
      { tag: 'Fraud Detection', val: 'Tampered Signature & Alignment Check' }
    ],
    markers: {
      raw: [
        { top: '42%', left: '35%', w: '18%', h: '14%', tag: 'ID Field [Misread Checksum]', error: true },
        { top: '55%', left: '58%', w: '20%', h: '16%', tag: 'Signature [Unverified]', error: true }
      ],
      hitl: [
        { top: '42%', left: '35%', w: '19%', h: '15%', tag: 'Account ID & Checksum • 100% Validated', error: false },
        { top: '55%', left: '58%', w: '21%', h: '17%', tag: 'Signature Biometric Match • 99.9%', error: false },
        { top: '68%', left: '45%', w: '15%', h: '10%', tag: 'Risk Score: Low • Auditor Approved', error: false }
      ]
    }
  }
};

let currentScenario = 'automotive';
let currentMode = 'hitl'; // 'raw' or 'hitl'

function initInteractiveStudio() {
  const tabs = document.querySelectorAll('.studio-tab');
  const canvasImg = document.getElementById('canvasImg');
  const overlayLayer = document.getElementById('overlayLayer');
  const rawModeBtn = document.getElementById('rawModeBtn');
  const hitlModeBtn = document.getElementById('hitlModeBtn');
  const confSlider = document.getElementById('confSlider');
  const confVal = document.getElementById('confVal');
  const viewportLoader = document.getElementById('viewportLoader');

  if (!tabs.length || !canvasImg) return;

  // Render current scenario
  function renderScenario(scenarioKey) {
    const data = STUDIO_DATA[scenarioKey];
    if (!data) return;

    currentScenario = scenarioKey;

    // Show loader momentarily for sleek transition
    viewportLoader.classList.add('active');
    
    setTimeout(() => {
      canvasImg.src = data.image;
      viewportLoader.classList.remove('active');
    }, 200);

    // Update text
    document.getElementById('inspectorVertical').textContent = data.vertical;
    document.getElementById('scenarioTitle').textContent = data.title;
    document.getElementById('scenarioDesc').textContent = data.desc;
    document.getElementById('rawScore').textContent = data.rawScore;
    document.getElementById('hitlScore').textContent = data.hitlScore;
    document.getElementById('deltaBadge').textContent = data.delta;

    // Update list items
    const inspectorList = document.getElementById('inspectorList');
    inspectorList.innerHTML = data.items.map(item => `
      <div class="inspector-item">
        <span class="item-tag">${item.tag}</span>
        <span class="item-val">${item.val}</span>
      </div>
    `).join('');

    renderMarkers();
  }

  // Render simulated overlay markers
  function renderMarkers() {
    overlayLayer.innerHTML = '';
    const scenario = STUDIO_DATA[currentScenario];
    if (!scenario || !scenario.markers) return;

    const markersList = scenario.markers[currentMode] || [];

    markersList.forEach(m => {
      const box = document.createElement('div');
      box.className = `marker-box ${m.error ? 'raw-error' : ''}`;
      box.style.top = m.top;
      box.style.left = m.left;
      box.style.width = m.w;
      box.style.height = m.h;

      const tag = document.createElement('div');
      tag.className = 'marker-tag';
      tag.textContent = m.tag;

      box.appendChild(tag);
      overlayLayer.appendChild(box);
    });
  }

  // Tab click listeners
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const scenarioKey = tab.getAttribute('data-scenario');
      renderScenario(scenarioKey);
    });
  });

  // Mode Switch listeners
  rawModeBtn.addEventListener('click', () => {
    rawModeBtn.classList.add('active');
    hitlModeBtn.classList.remove('active');
    currentMode = 'raw';
    renderMarkers();
    showToast('Inspection set to Raw Machine Predictions');
  });

  hitlModeBtn.addEventListener('click', () => {
    hitlModeBtn.classList.add('active');
    rawModeBtn.classList.remove('active');
    currentMode = 'hitl';
    renderMarkers();
    showToast('Inspection set to NextWealth HITL Ground Truth');
  });

  // Confidence Slider
  if (confSlider && confVal) {
    confSlider.addEventListener('input', (e) => {
      const val = e.target.value;
      confVal.textContent = `${val}%`;
      
      // Visual feedback: toggle opacity of markers slightly
      overlayLayer.style.opacity = (val / 100).toString();
    });
  }

  // Initial render
  renderScenario('automotive');
}

/* ==========================================================================
   6. Apple Modal Dialog (Book a Free POC)
   ========================================================================== */
function initPocModal() {
  const pocModal = document.getElementById('pocModal');
  const closePocModal = document.getElementById('closePocModal');
  const pocForm = document.getElementById('pocForm');
  const modalSuccessState = document.getElementById('modalSuccessState');
  const closeSuccessBtn = document.getElementById('closeSuccessBtn');
  const openButtons = document.querySelectorAll('.open-poc-modal');
  const pocVerticalSelect = document.getElementById('pocVertical');

  if (!pocModal) return;

  function openModal(presetVertical) {
    if (presetVertical && pocVerticalSelect) {
      // Find matching option
      for (let option of pocVerticalSelect.options) {
        if (option.value.toLowerCase().includes(presetVertical.toLowerCase())) {
          option.selected = true;
          break;
        }
      }
    }
    
    // Reset view
    pocForm.style.display = 'flex';
    modalSuccessState.style.display = 'none';

    pocModal.showModal();
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    pocModal.close();
    document.body.style.overflow = '';
  }

  openButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const preset = btn.getAttribute('data-preset');
      openModal(preset);
    });
  });

  if (closePocModal) {
    closePocModal.addEventListener('click', closeModal);
  }

  if (closeSuccessBtn) {
    closeSuccessBtn.addEventListener('click', closeModal);
  }

  // Close on backdrop click (Light dismiss)
  pocModal.addEventListener('click', (e) => {
    const dialogDimensions = pocModal.getBoundingClientRect();
    if (
      e.clientX < dialogDimensions.left ||
      e.clientX > dialogDimensions.right ||
      e.clientY < dialogDimensions.top ||
      e.clientY > dialogDimensions.bottom
    ) {
      closeModal();
    }
  });

  // Form Submission
  if (pocForm) {
    pocForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const submitBtn = document.getElementById('pocSubmitBtn');
      const originalText = submitBtn.innerHTML;
      submitBtn.innerHTML = `<span>Submitting...</span><div class="spinner" style="width:16px;height:16px;border-width:2px;"></div>`;
      submitBtn.disabled = true;

      setTimeout(() => {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        pocForm.style.display = 'none';
        modalSuccessState.style.display = 'block';
        showToast('Proof of Concept request submitted successfully!');
        pocForm.reset();
      }, 900);
    });
  }

  // Intercept policy links to inform user
  document.querySelectorAll('.policy-link').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const policyType = link.getAttribute('data-policy');
      showToast(`${policyType.toUpperCase()} Policy available in compliance documentation.`);
    });
  });
}

/* ==========================================================================
   7. Copy to Clipboard for Emails
   ========================================================================== */
function initCopyButtons() {
  const copyButtons = document.querySelectorAll('.copy-btn');
  copyButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const textToCopy = btn.getAttribute('data-copy');
      if (textToCopy) {
        navigator.clipboard.writeText(textToCopy).then(() => {
          showToast(`Copied ${textToCopy} to clipboard!`);
          btn.style.color = '#30d158';
          setTimeout(() => {
            btn.style.color = '';
          }, 2000);
        }).catch(() => {
          showToast('Failed to copy. Please select manually.');
        });
      }
    });
  });
}

/* ==========================================================================
   8. FAQ Accordion System
   ========================================================================== */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  if (!faqItems.length) return;

  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    if (!questionBtn) return;

    questionBtn.addEventListener('click', () => {
      const isCurrentlyActive = item.classList.contains('active');

      // Close all other FAQ items for a polished accordion experience
      faqItems.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('active');
          const otherBtn = otherItem.querySelector('.faq-question');
          if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
        }
      });

      // Toggle current
      item.classList.toggle('active', !isCurrentlyActive);
      questionBtn.setAttribute('aria-expanded', String(!isCurrentlyActive));
    });
  });
}

/* ==========================================================================
   9. Scroll Reveal Observer
   ========================================================================== */
function initScrollReveal() {
  const targets = document.querySelectorAll(
    '.stat-card, .industry-card, .pipeline-step-card, .service-bento-small, .story-card, .office-card, .impact-card, ' +
    '.modality-card, .workflow-card, .tooling-item, .security-card, .app-card, .rt-card, .pillar-card, .testi-card, ' +
    '.cs-card, .resource-card, .faq-item, .annotation-overview-card, .genai-hero-card'
  );

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -30px 0px'
  });

  targets.forEach(target => {
    target.classList.add('reveal-on-scroll');
    observer.observe(target);
  });
}

/* ==========================================================================
   9. Toast Notification System
   ========================================================================== */
function showToast(message) {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2997ff" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('hiding');
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 3200);
}
