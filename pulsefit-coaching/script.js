/**
 * PulseFit Dynamics — Interactive Client Scripts
 */

document.addEventListener('DOMContentLoaded', () => {
  initScheduleViewer();
  initMacroCalculator();
  initTrialModal();
  initMobileNav();
});

/* ==========================================================================
   Class Schedule Database & Interactive Viewer
   ========================================================================== */
const weeklyScheduleData = {
  mon: [
    { time: "06:00 AM", name: "Kinetic Olympic Strength: Clean & Jerk", coach: "Coach Marcus Vance", spots: 3, low: true },
    { time: "08:30 AM", name: "Hyrox Aerobic Engine & Sled Intervals", coach: "Elena Rostova", spots: 6, low: false },
    { time: "12:00 PM", name: "Metabolic Threshold Ladders", coach: "Elena Rostova", spots: 8, low: false },
    { time: "05:30 PM", name: "Barbell Hypertrophy & Posterior Chain", coach: "Coach Marcus Vance", spots: 2, low: true },
    { time: "07:00 PM", name: "Contrast Recovery & Guided Breathwork", coach: "Dr. Julian Thorne", spots: 5, low: false }
  ],
  tue: [
    { time: "06:30 AM", name: "VO2 Max SkiErg & Echo Bike Intervals", coach: "Elena Rostova", spots: 4, low: false },
    { time: "09:00 AM", name: "Upper Body Structural Power & Core", coach: "Coach Marcus Vance", spots: 7, low: false },
    { time: "05:00 PM", name: "Hyrox Pro Simulation & Pacing Lab", coach: "Elena Rostova", spots: 1, low: true },
    { time: "06:30 PM", name: "Fascial Decompression & Hip Longevity", coach: "Dr. Julian Thorne", spots: 6, low: false }
  ],
  wed: [
    { time: "06:00 AM", name: "Olympic Snatch Precision & Mobility", coach: "Coach Marcus Vance", spots: 3, low: true },
    { time: "08:30 AM", name: "Aerobic Base (Zone 2 Conditioning)", coach: "Elena Rostova", spots: 9, low: false },
    { time: "12:00 PM", name: "Barbell Deadlift & Grip Integrity", coach: "Coach Marcus Vance", spots: 5, low: false },
    { time: "06:00 PM", name: "Full-Body Metabolic Circuit", coach: "Elena Rostova", spots: 4, low: false }
  ],
  thu: [
    { time: "06:30 AM", name: "Metabolic Lactate Threshold Engine", coach: "Elena Rostova", spots: 5, low: false },
    { time: "09:00 AM", name: "Kinetic Overhead Press & Stability", coach: "Coach Marcus Vance", spots: 6, low: false },
    { time: "05:30 PM", name: "Hyrox Heavy Sled & Wall Ball Lab", coach: "Elena Rostova", spots: 2, low: true },
    { time: "07:00 PM", name: "38°F Cold Plunge Contrast Protocol", coach: "Dr. Julian Thorne", spots: 4, low: false }
  ],
  fri: [
    { time: "06:00 AM", name: "Squat Max Velocity & Explosive Jumps", coach: "Coach Marcus Vance", spots: 4, low: false },
    { time: "08:30 AM", name: "Aerobic Capacity Partner Challenge", coach: "Elena Rostova", spots: 8, low: false },
    { time: "05:00 PM", name: "Friday Barbell Club & Community Lift", coach: "Coach Marcus Vance", spots: 2, low: true }
  ],
  sat: [
    { time: "08:00 AM", name: "The PulseFit Saturday 90-Min Hyrox Engine", coach: "Marcus & Elena", spots: 1, low: true },
    { time: "10:30 AM", name: "Olympic Lifting Open Platform", coach: "Coach Marcus Vance", spots: 5, low: false },
    { time: "12:30 PM", name: "Full Contrast Longevity Session", coach: "Dr. Julian Thorne", spots: 7, low: false }
  ]
};

function initScheduleViewer() {
  const tabs = document.querySelectorAll('#day-tabs .day-tab');
  const container = document.getElementById('schedule-cards-container');

  if (!tabs.length || !container) return;

  function renderDay(dayKey) {
    const list = weeklyScheduleData[dayKey] || [];
    container.innerHTML = list.map(item => `
      <div class="schedule-row">
        <div class="time-slot">${item.time}</div>
        <div class="class-title-col">
          <div class="class-name">${item.name}</div>
          <div class="class-coach">${item.coach}</div>
        </div>
        <div class="class-status-col">
          <span class="spots-badge ${item.low ? 'low' : ''}">
            ${item.spots} Spot${item.spots === 1 ? '' : 's'} Remaining
          </span>
          <button class="btn-lime" style="padding: 0.5rem 1rem; font-size: 0.85rem;" onclick="openTrialModal('${item.name} (${item.time})')">
            Book Spot
          </button>
        </div>
      </div>
    `).join('');
  }

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const day = tab.getAttribute('data-day');
      renderDay(day);
    });
  });

  // Initial render (Monday)
  renderDay('mon');
}

/* ==========================================================================
   Hybrid Athlete Macro & Calorie Calculator
   ========================================================================== */
function initMacroCalculator() {
  const weightInput = document.getElementById('athlete-weight');
  const freqSelect = document.getElementById('training-freq');
  const targetBtns = document.querySelectorAll('.target-radio-group .target-btn');
  const calDisplay = document.getElementById('calc-calories');
  const proteinDisplay = document.getElementById('macro-protein');
  const carbsDisplay = document.getElementById('macro-carbs');
  const fatsDisplay = document.getElementById('macro-fats');

  if (!weightInput || !freqSelect) return;

  let currentTarget = 'muscle';

  targetBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      targetBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentTarget = btn.getAttribute('data-target');
      calculateMacros();
    });
  });

  function calculateMacros() {
    const weight = parseFloat(weightInput.value) || 75; // kg
    const freq = parseInt(freqSelect.value, 10); // sessions

    // Base metabolic rate multiplier
    let mult = 32 + (freq * 1.5);
    
    // Adjust by target
    if (currentTarget === 'muscle') mult += 4;
    else if (currentTarget === 'recomp') mult -= 3;
    else if (currentTarget === 'endurance') mult += 2;

    const totalCalories = Math.round(weight * mult);

    // Protein: 2.0g - 2.4g per kg
    const proteinGrams = Math.round(weight * 2.2);
    // Fats: ~1.0g per kg
    const fatGrams = Math.round(weight * 1.0);
    // Remaining calories to carbs
    const proteinCals = proteinGrams * 4;
    const fatCals = fatGrams * 9;
    const remainingCals = Math.max(totalCalories - (proteinCals + fatCals), 400);
    const carbGrams = Math.round(remainingCals / 4);

    if (calDisplay) calDisplay.textContent = totalCalories.toLocaleString();
    if (proteinDisplay) proteinDisplay.textContent = `${proteinGrams}g`;
    if (carbsDisplay) carbsDisplay.textContent = `${carbGrams}g`;
    if (fatsDisplay) fatsDisplay.textContent = `${fatGrams}g`;
  }

  weightInput.addEventListener('input', calculateMacros);
  freqSelect.addEventListener('change', calculateMacros);

  // Initial calculation
  calculateMacros();
}

/* ==========================================================================
   Free Trial Booking Modal
   ========================================================================== */
function initTrialModal() {
  const modal = document.getElementById('trial-modal');
  const closeBtn = document.getElementById('close-trial-modal');
  const form = document.getElementById('trial-booking-form');
  const successBox = document.getElementById('trial-success-box');
  const successClose = document.getElementById('trial-success-close');
  const programTitle = document.getElementById('modal-program-title');
  const openTrialBtn = document.getElementById('open-trial-btn');

  if (!modal) return;

  window.openTrialModal = function(programName = '7-Day Performance Trial') {
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    if (form) form.style.display = 'flex';
    if (successBox) successBox.style.display = 'none';
    if (programTitle) programTitle.textContent = programName;
  };

  function closeModal() {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
  }

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (successClose) successClose.addEventListener('click', closeModal);
  if (openTrialBtn) openTrialBtn.addEventListener('click', () => openTrialModal('7-Day Performance Trial'));

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('athlete-name').value;
      const email = document.getElementById('athlete-email').value;

      form.style.display = 'none';
      if (successBox) successBox.style.display = 'block';

      showPulseToast(`Pass confirmed for ${name}! Barcode dispatched to ${email}.`);
    });
  }
}

/* ==========================================================================
   Mobile Navigation
   ========================================================================== */
function initMobileNav() {
  const toggle = document.getElementById('nav-toggle');
  const links = document.getElementById('nav-links');

  if (!toggle || !links) return;

  toggle.addEventListener('click', () => {
    links.classList.toggle('open');
  });

  links.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => links.classList.remove('open'));
  });
}

/* ==========================================================================
   Toast Notification
   ========================================================================== */
function showPulseToast(message) {
  const zone = document.getElementById('toast-zone');
  if (!zone) return;

  const toast = document.createElement('div');
  toast.className = 'athletic-toast';
  toast.textContent = message;

  zone.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}
