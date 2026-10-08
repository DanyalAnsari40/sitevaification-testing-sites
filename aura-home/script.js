/**
 * Aura Living — Client Interactive Logic & Cart Drawer
 */

document.addEventListener('DOMContentLoaded', () => {
  initCartDrawer();
  initMaterialSwitcher();
  initSanctuaryCurator();
  initProductModal();
  initSalonForm();
  initMobileMenu();
});

/* ==========================================================================
   State & Product Database
   ========================================================================== */
const catalogProducts = {
  1: {
    id: 1,
    name: "The Kanso Ergonomic Lounge",
    price: 1480,
    finish: "Solid Black Walnut & Aniline Cognac Leather",
    specs: {
      "Dimensions": '32" W × 36" D × 31" H',
      "Inclination": "108° Biomechanical Angle",
      "Wood Provenance": "FSC-Certified Appalachian Walnut",
      "Cushioning": "Natural Dunlop Latex & Goose Down",
      "Lead Time": "Ships within 5–7 business days"
    },
    desc: "Crafted in partnership with orthopedic biomechanists, the Kanso gently redistributes torso mass across the ischial tuberosities to eliminate lower back fatigue during evening reading or meditation."
  },
  2: {
    id: 2,
    name: "The Verve Executive Desk",
    price: 2250,
    finish: "Solid American Walnut",
    specs: {
      "Dimensions": '60" W × 30" D × 29.5" H',
      "Power Inlay": "Dual 15W Qi Inductive Fast-Chargers",
      "Wire Management": "Sub-surface CNC routed aluminum trench",
      "Wood Thickness": '1.75" Solid Bookmatched Slab',
      "Finish": "Hand-rubbed organic beeswax & linseed oil"
    },
    desc: "A timeless centerpiece for the focused creative. Engineered with hidden cable pathways and wireless charging embedded invisibly beneath the natural grain."
  },
  3: {
    id: 3,
    name: "Akari Mulberry Pendant Lamp",
    price: 420,
    finish: "Hand-Woven Japanese Washi Paper",
    specs: {
      "Diameter": '22" Spherical Geometric Lantern',
      "Socket": "Solid Turned Brass E26 (2700K Warm LED included)",
      "Acoustics": "Certified 0.65 NRC sound-dampening core",
      "Cord": "10-foot braided tobacco linen cord"
    },
    desc: "Spun from raw mulberry bark fibers by sixth-generation paper artisans in Gifu Prefecture, providing soothing glare-free illumination calibrated to human circadian rhythms."
  },
  4: {
    id: 4,
    name: "Sora Ergonomic Task Chair",
    price: 980,
    finish: "Cast Magnesium & 3D Aerated Mesh",
    specs: {
      "Recline Range": "90° to 125° Synchronous Tilt",
      "Armrests": "4D Multi-directional Italian Leather Pads",
      "Mechanism": "Self-weight adjusting torsion bar",
      "Warranty": "15-Year Commercial Duty Rating"
    },
    desc: "Architectural minimalism meets medical-grade posture support. The responsive spine blade tracks micromovements to keep blood flowing effortlessly throughout prolonged work hours."
  }
};

let cart = [
  { id: 2, name: "The Verve Executive Desk", price: 2250, finish: "Solid American Walnut", qty: 1 },
  { id: 1, name: "The Kanso Ergonomic Lounge", price: 1480, finish: "Black Walnut / Cognac Leather", qty: 1 }
];

/* ==========================================================================
   Shopping Cart Drawer
   ========================================================================== */
function initCartDrawer() {
  const trigger = document.getElementById('cart-drawer-trigger');
  const drawer = document.getElementById('cart-drawer');
  const backdrop = document.getElementById('cart-backdrop');
  const closeBtn = document.getElementById('cart-close-btn');
  const checkoutBtn = document.getElementById('checkout-btn');

  function openCart() {
    drawer.classList.add('open');
    backdrop.classList.add('open');
    renderCart();
  }

  function closeCart() {
    drawer.classList.remove('open');
    backdrop.classList.remove('open');
  }

  if (trigger) trigger.addEventListener('click', openCart);
  if (closeBtn) closeBtn.addEventListener('click', closeCart);
  if (backdrop) backdrop.addEventListener('click', closeCart);

  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
      if (cart.length === 0) {
        showAuraToast("Your atelier order is currently empty.");
        return;
      }
      closeCart();
      showAuraToast("Redirecting to encrypted white-glove checkout...");
    });
  }

  renderCart();
}

function renderCart() {
  const container = document.getElementById('cart-items-container');
  const countBadge = document.getElementById('cart-count');
  const countText = document.getElementById('cart-items-count-text');
  const subtotalEl = document.getElementById('cart-subtotal-val');

  if (!container) return;

  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

  if (countBadge) countBadge.textContent = totalItems;
  if (countText) countText.textContent = `${totalItems} Piece${totalItems === 1 ? '' : 's'}`;
  if (subtotalEl) subtotalEl.textContent = `$${subtotal.toLocaleString()}`;

  if (cart.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 3rem 0; color: #78716C;">
        <p style="font-family: 'Playfair Display', serif; font-size: 1.2rem; margin-bottom: 0.5rem;">Your Sanctuary is Empty</p>
        <p style="font-size: 0.85rem;">Discover our handcrafted collection above.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = cart.map((item, index) => `
    <div class="cart-item">
      <div class="cart-item-info">
        <div class="cart-item-title">${item.name}</div>
        <div class="cart-item-spec">${item.finish} &bull; Qty: ${item.qty}</div>
        <div class="cart-item-price">$${(item.price * item.qty).toLocaleString()}</div>
        <button class="cart-remove-btn" onclick="removeFromCart(${index})">Remove Piece</button>
      </div>
    </div>
  `).join('');
}

window.addToCart = function(id, name, price, finish) {
  const existing = cart.find(item => item.id === id);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ id, name, price, finish, qty: 1 });
  }
  renderCart();
  showAuraToast(`Added "${name}" to your Atelier order.`);

  // Open cart drawer automatically
  const drawer = document.getElementById('cart-drawer');
  const backdrop = document.getElementById('cart-backdrop');
  if (drawer && backdrop) {
    drawer.classList.add('open');
    backdrop.classList.add('open');
  }
};

window.removeFromCart = function(index) {
  const removed = cart[index];
  cart.splice(index, 1);
  renderCart();
  if (removed) {
    showAuraToast(`Removed "${removed.name}".`);
  }
};

/* ==========================================================================
   Hero Material Switcher
   ========================================================================== */
function initMaterialSwitcher() {
  const swatches = document.querySelectorAll('.swatch-btn');
  const finishNameEl = document.getElementById('current-finish-name');
  const woodFills = document.querySelectorAll('.desk-svg .wood-fill');

  swatches.forEach(btn => {
    btn.addEventListener('click', () => {
      swatches.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const name = btn.getAttribute('data-name');
      const color = btn.getAttribute('data-color');

      if (finishNameEl) finishNameEl.textContent = name;
      woodFills.forEach(part => {
        part.style.fill = color;
      });

      showAuraToast(`Rendered surface in ${name}.`);
    });
  });
}

/* ==========================================================================
   Sanctuary Curator Quiz
   ========================================================================== */
function initSanctuaryCurator() {
  const moodBtns = document.querySelectorAll('#mood-selector .opt-btn');
  const goalBtns = document.querySelectorAll('#goal-selector .opt-btn');
  const finishBtns = document.querySelectorAll('#finish-selector .opt-btn');
  const bundleTitle = document.getElementById('bundle-title');
  const bundleDesc = document.getElementById('bundle-desc');
  const bundleItems = document.getElementById('bundle-items-list');
  const bundleOldPrice = document.getElementById('bundle-old-price');
  const bundleNewPrice = document.getElementById('bundle-new-price');
  const addBundleBtn = document.getElementById('add-bundle-btn');

  let curMood = 'minimal';
  let curGoal = 'creative';
  let curFinish = 'walnut';

  function setupBtnGroup(buttons, callback) {
    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        buttons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        callback(btn);
        updateCuration();
      });
    });
  }

  setupBtnGroup(moodBtns, (btn) => curMood = btn.getAttribute('data-mood'));
  setupBtnGroup(goalBtns, (btn) => curGoal = btn.getAttribute('data-goal'));
  setupBtnGroup(finishBtns, (btn) => curFinish = btn.getAttribute('data-finish'));

  function updateCuration() {
    let title = "The Kyoto Focus Atelier";
    let desc = "Engineered for deep flow, tactile warmth, and natural spinal alignment throughout 8+ hour creative sessions.";
    let oldVal = "$3,650";
    let newVal = "$3,285";

    if (curMood === 'warm' && curGoal === 'creative') {
      title = "The Nordic Living Sanctuary";
      desc = "Rich organic timber surfaces paired with acoustic Mulberry lighting for immersive writing and conceptual design.";
      oldVal = "$3,900";
      newVal = "$3,510";
    } else if (curGoal === 'executive') {
      title = "The Architectural Executive Suite";
      desc = "Precision dual-surface cable routing paired with the Sora dynamic spine chair for intensive high-throughput engineering.";
      oldVal = "$4,230";
      newVal = "$3,807";
    }

    if (bundleTitle) bundleTitle.textContent = title;
    if (bundleDesc) bundleDesc.textContent = desc;
    if (bundleOldPrice) bundleOldPrice.textContent = oldVal;
    if (bundleNewPrice) bundleNewPrice.textContent = newVal;
  }

  if (addBundleBtn) {
    addBundleBtn.addEventListener('click', () => {
      addToCart(2, 'The Verve Executive Desk', 2250, curFinish === 'walnut' ? 'Solid Walnut' : 'Smoked Oak');
      addToCart(4, 'Sora Ergonomic Task Chair', 980, 'Graphite Mesh');
      addToCart(3, 'Akari Mulberry Pendant Lamp', 420, 'Washi Paper');
      showAuraToast('Curated Architectural Bundle added to cart with 10% atelier savings.');
    });
  }
}

/* ==========================================================================
   Product Detail Modal
   ========================================================================== */
function initProductModal() {
  const modal = document.getElementById('product-modal');
  const closeBtn = document.getElementById('product-modal-close');
  const contentEl = document.getElementById('modal-product-content');

  if (!modal) return;

  window.openProductModal = function(id) {
    const prod = catalogProducts[id];
    if (!prod) return;

    const specsHtml = Object.entries(prod.specs).map(([k, v]) => `
      <div style="display:flex; justify-content:space-between; padding:0.5rem 0; border-bottom:1px solid #E8E2D9; font-size:0.85rem;">
        <span style="color:#78716C;">${k}</span>
        <strong style="color:#1C1917;">${v}</strong>
      </div>
    `).join('');

    contentEl.innerHTML = `
      <div style="font-size:0.75rem; letter-spacing:0.2em; color:#B45309; text-transform:uppercase; margin-bottom:0.4rem;">ATELIER SPECIFICATION</div>
      <h2 style="font-family:'Playfair Display',serif; font-size:1.8rem; margin-bottom:0.4rem;">${prod.name}</h2>
      <div style="font-size:1.3rem; font-weight:700; margin-bottom:1rem; color:#1C1917;">$${prod.price.toLocaleString()}</div>
      <p style="color:#665E58; font-size:0.95rem; line-height:1.6; margin-bottom:1.5rem;">${prod.desc}</p>
      
      <div style="margin-bottom:1.8rem;">
        <h4 style="font-size:0.85rem; text-transform:uppercase; letter-spacing:0.1em; margin-bottom:0.8rem;">Technical Specifications</h4>
        ${specsHtml}
      </div>

      <button class="btn-dark btn-block" onclick="addToCart(${prod.id}, '${prod.name}', ${prod.price}, '${prod.finish}'); closeProductModal();">
        Add to Sanctuary &bull; $${prod.price.toLocaleString()}
      </button>
    `;

    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
  };

  window.closeProductModal = function() {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
  };

  if (closeBtn) closeBtn.addEventListener('click', closeProductModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeProductModal();
  });
}

/* ==========================================================================
   Salon Newsletter Form
   ========================================================================== */
function initSalonForm() {
  const form = document.getElementById('salon-form');
  const emailInput = document.getElementById('salon-email');
  const feedback = document.getElementById('salon-feedback');

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (emailInput.value) {
      if (feedback) feedback.textContent = "Your private salon invitation has been dispatched.";
      emailInput.value = '';
      showAuraToast("Welcome to the Aura Collector Salon.");
    }
  });
}

/* ==========================================================================
   Mobile Menu Toggle
   ========================================================================== */
function initMobileMenu() {
  const toggle = document.getElementById('mobile-toggle');
  const nav = document.getElementById('studio-nav');

  if (!toggle || !nav) return;

  toggle.addEventListener('click', () => {
    nav.classList.toggle('open');
  });

  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => nav.classList.remove('open'));
  });
}

/* ==========================================================================
   Toast Notification
   ========================================================================== */
function showAuraToast(msg) {
  const hub = document.getElementById('toast-hub');
  if (!hub) return;

  const item = document.createElement('div');
  item.className = 'toast-item';
  item.textContent = msg;

  hub.appendChild(item);

  setTimeout(() => {
    item.style.opacity = '0';
    item.style.transform = 'translateY(10px)';
    item.style.transition = 'all 0.3s ease';
    setTimeout(() => item.remove(), 300);
  }, 3500);
}
