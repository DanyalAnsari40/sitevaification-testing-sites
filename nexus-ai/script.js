/**
 * NexusAI — Interactive Client Logic
 */

document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initAgentTerminal();
  initRoiCalculator();
  initPricingToggle();
  initFaqAccordion();
  initModal();
  initNewsletter();
});

/* ==========================================================================
   Mobile Navigation
   ========================================================================== */
function initMobileMenu() {
  const toggleBtn = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');

  if (!toggleBtn || !navMenu) return;

  toggleBtn.addEventListener('click', () => {
    navMenu.classList.toggle('mobile-open');
  });

  // Close when clicking nav links
  navMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('mobile-open');
    });
  });
}

/* ==========================================================================
   Interactive Agent Console / Terminal Simulation
   ========================================================================== */
function initAgentTerminal() {
  const runBtn = document.getElementById('run-simulation-btn');
  const clearBtn = document.getElementById('clear-terminal-btn');
  const terminalBody = document.getElementById('terminal-body');

  if (!runBtn || !terminalBody) return;

  const demoScenarios = [
    [
      { text: '<span class="prompt">$</span> nexus test --workflow="CustomerServiceRefundAgent" --strict', type: 'system' },
      { text: '<span class="badge blue">[START]</span> Ingesting incoming dispute ticket #88491 ($320.00 charge)', type: 'normal' },
      { text: '<span class="badge purple">[ROUTER]</span> Fallback policy triggered: Routed to Claude 3.7 Sonnet (Reasoning)', type: 'normal' },
      { text: '<span class="badge cyan">[TOOL]</span> Querying Stripe Webhook API for transaction fingerprint ... OK', type: 'normal' },
      { text: '<span class="badge cyan">[TOOL]</span> Fetching FedEx shipping manifest via DHL/FedEx unified API ... Delivered', type: 'normal' },
      { text: '<span class="badge green">[SUCCESS]</span> Auto-approved refund with 0.992 confidence. Customer notified via Twilio.', type: 'normal' },
      { text: '<span class="prompt">$</span> Execution elapsed: 412ms • Cost: $0.0031 (Saved $14.20 vs manual CSR)', type: 'system' }
    ],
    [
      { text: '<span class="prompt">$</span> nexus vector query --index="legal-contracts" --query="indemnity cap liability"', type: 'system' },
      { text: '<span class="badge blue">[INDEX]</span> Scanning 4.8M sharded embeddings across 16 nodes', type: 'normal' },
      { text: '<span class="badge purple">[MEMORY]</span> Top-5 matches retrieved in 11.4ms (cosine similarity >= 0.941)', type: 'normal' },
      { text: '<span class="badge cyan">[GUARD]</span> PII sanitization applied: 4 social security numbers masked', type: 'normal' },
      { text: '<span class="badge green">[READY]</span> Context injection ready for generation payload.', type: 'normal' }
    ]
  ];

  let currentScenario = 0;

  runBtn.addEventListener('click', () => {
    runBtn.disabled = true;
    runBtn.textContent = '⏳ Executing...';
    terminalBody.innerHTML = '';

    const lines = demoScenarios[currentScenario];
    currentScenario = (currentScenario + 1) % demoScenarios.length;

    let index = 0;
    const interval = setInterval(() => {
      if (index < lines.length) {
        const lineData = lines[index];
        const lineEl = document.createElement('div');
        lineEl.className = `terminal-line ${lineData.type}`;
        lineEl.innerHTML = lineData.text;
        terminalBody.appendChild(lineEl);
        terminalBody.scrollTop = terminalBody.scrollHeight;
        index++;
      } else {
        clearInterval(interval);
        runBtn.disabled = false;
        runBtn.textContent = '⚡ Run Agent Pipeline';
        showToast('Autonomous agent execution completed with zero guardrail violations!');
      }
    }, 450);
  });

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      terminalBody.innerHTML = `
        <div class="terminal-line system"><span class="prompt">$</span> Terminal ready. Click "Run Agent Pipeline" above.</div>
      `;
    });
  }
}

/* ==========================================================================
   ROI & Cost Calculator
   ========================================================================== */
function initRoiCalculator() {
  const tokenSlider = document.getElementById('monthly-tokens');
  const devSlider = document.getElementById('developer-count');
  const tokensDisplay = document.getElementById('tokens-display');
  const devsDisplay = document.getElementById('devs-display');
  const annualSavingsEl = document.getElementById('annual-savings');
  const hoursSavedEl = document.getElementById('hours-saved');
  const mixButtons = document.querySelectorAll('.radio-pill-group .pill-btn');
  const calcCta = document.getElementById('calc-cta-btn');

  if (!tokenSlider || !devSlider) return;

  let currentMix = 'premium';

  function updateCalculator() {
    const tokens = parseInt(tokenSlider.value, 10); // Millions
    const devs = parseInt(devSlider.value, 10);

    tokensDisplay.textContent = `${tokens} Million`;
    devsDisplay.textContent = `${devs} Engineer${devs > 1 ? 's' : ''}`;

    // Base estimated cost per million tokens ($15 avg raw tier-1)
    const costFactor = currentMix === 'premium' ? 14 : 9;
    const rawMonthlyCost = tokens * costFactor * 100; // raw estimate
    
    // Nexus saves ~42% through semantic caching & fallback router
    const monthlyTokenSavings = rawMonthlyCost * 0.42;
    // Each engineer saves ~12 hours / mo on prompt debugging, retries, latency management
    const totalHoursSaved = devs * 12;
    const engHourValue = totalHoursSaved * 110; // $110/hr blended tech rate

    const totalAnnualSavings = Math.round((monthlyTokenSavings + engHourValue) * 12);

    annualSavingsEl.textContent = totalAnnualSavings.toLocaleString();
    hoursSavedEl.textContent = `${totalHoursSaved} Hours`;
  }

  tokenSlider.addEventListener('input', updateCalculator);
  devSlider.addEventListener('input', updateCalculator);

  mixButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      mixButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentMix = btn.getAttribute('data-mix');
      updateCalculator();
    });
  });

  if (calcCta) {
    calcCta.addEventListener('click', () => {
      openDemoModal('Enterprise');
      showToast('Pre-filled ROI metrics attached to demo registration.');
    });
  }

  // Initial calculation
  updateCalculator();
}

/* ==========================================================================
   Pricing Toggle (Monthly vs Annual)
   ========================================================================== */
function initPricingToggle() {
  const toggle = document.getElementById('billing-toggle');
  const priceValues = document.querySelectorAll('.price-val[data-monthly]');

  if (!toggle) return;

  toggle.addEventListener('change', () => {
    const isAnnual = toggle.checked;
    priceValues.forEach(el => {
      const monthlyPrice = el.getAttribute('data-monthly');
      const annualPrice = el.getAttribute('data-annual');
      el.textContent = isAnnual ? annualPrice : monthlyPrice;
    });
  });
}

/* ==========================================================================
   FAQ Accordion
   ========================================================================== */
function initFaqAccordion() {
  const items = document.querySelectorAll('.accordion-item');

  items.forEach(item => {
    const trigger = item.querySelector('.accordion-trigger');
    if (!trigger) return;

    trigger.addEventListener('click', () => {
      const isOpen = item.classList.contains('active');

      // Close all
      items.forEach(i => {
        i.classList.remove('active');
        i.querySelector('.accordion-trigger').setAttribute('aria-expanded', 'false');
      });

      // Toggle current
      if (!isOpen) {
        item.classList.add('active');
        trigger.setAttribute('aria-expanded', 'true');
      }
    });
  });
}

/* ==========================================================================
   Modal Dialog & Demo Request Flow
   ========================================================================== */
function initModal() {
  const modal = document.getElementById('demo-modal');
  const closeBtn = document.getElementById('close-modal-btn');
  const form = document.getElementById('demo-form');
  const successState = document.getElementById('modal-success');
  const doneBtn = document.getElementById('modal-done-btn');
  const openDemoBtn = document.getElementById('open-demo-modal-btn');
  const heroTrialBtn = document.getElementById('hero-start-trial-btn');
  const footerStartBtn = document.getElementById('footer-start-btn');

  if (!modal) return;

  window.openDemoModal = function(tierName = 'Scale Team') {
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    if (form) form.style.display = 'flex';
    if (successState) successState.style.display = 'none';

    const select = document.getElementById('selected-tier');
    if (select && tierName) {
      select.value = tierName;
    }
  };

  function closeModal() {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
  }

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (doneBtn) doneBtn.addEventListener('click', closeModal);

  if (openDemoBtn) openDemoBtn.addEventListener('click', () => openDemoModal('Scale Team'));
  if (heroTrialBtn) heroTrialBtn.addEventListener('click', () => openDemoModal('Scale Team'));
  if (footerStartBtn) footerStartBtn.addEventListener('click', () => openDemoModal('Scale Team'));

  // Close on backdrop click
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  // Handle form submission
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('work-email').value;
      const company = document.getElementById('company-name').value;
      const tier = document.getElementById('selected-tier').value;

      form.style.display = 'none';
      if (successState) successState.style.display = 'block';

      showToast(`Welcome ${company}! Provisioning sandbox for ${email} on ${tier} tier.`);
    });
  }
}

/* ==========================================================================
   Newsletter Subscription
   ========================================================================== */
function initNewsletter() {
  const form = document.getElementById('newsletter-form');
  const emailInput = document.getElementById('newsletter-email');
  const msgEl = document.getElementById('newsletter-msg');

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const val = emailInput.value.trim();
    if (val) {
      emailInput.value = '';
      if (msgEl) {
        msgEl.textContent = '✓ Subscribed! You will receive our weekly architecture digest.';
        msgEl.style.color = '#34D399';
      }
      showToast('Thank you for subscribing to Nexus Architectural Briefings.');
    }
  });
}

/* ==========================================================================
   Toast Notification Helper
   ========================================================================== */
function showToast(message) {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}
