// ==========================================
// SkinNova System - Main Script
// ==========================================

// Default product data with professional information (UNCHANGED)
const defaultProducts = [
  {
    id: 1,
    name: 'Hydra Luxe Serum',
    price: '$499.5',
    category: 'Serum Care',
    description: 'Ultra-hydrating serum with hyaluronic acid and botanical extracts. Restores moisture balance and promotes skin elasticity.',
    image: 'Serum C.png',
    rating: '★★★★★ (128 reviews)'
  },
  {
    id: 2,
    name: 'Radiance Night Cream',
    price: '$699.99',
    category: 'Night Cream',
    description: 'Nourishing night cream with retinol and peptides. Promotes cell renewal while you sleep for a brighter, firmer complexion.',
    image: 'NightCream.png',
    rating: '★★★★☆ (98 reviews)'
  },
  {
    id: 3,
    name: 'Gentle Cleanse Oil',
    price: '$399.99',
    category: 'Cleanser',
    description: 'Micellar cleansing oil that gently removes makeup and impurities. Infused with rose hip and chamomile for soothed, refreshed skin.',
    image: 'Cleanser.png',
    rating: '★★★★☆ (156 reviews)'
  },
  {
    id: 4,
    name: 'Glow Face Mask',
    price: '$1,450.99',
    category: 'Magic Face Mask',
    description: 'Revitalizing sheet mask with vitamin C and gold particles. Brightens skin tone and improves texture in just 15 minutes.',
    image: 'MagicMask.png',
    rating: '★★★★★ (203 reviews)'
  },
  {
    id: 5,
    name: 'Vitamin C Brightener',
    price: '$560.99',
    category: 'Treatment',
    description: 'Stabilized vitamin C serum with ferulic acid. Evens skin tone, reduces dark spots, and delivers powerful antioxidant protection.',
    image: 'Vitamin C.png',
    rating: '★★★★★ (187 reviews)'
  },
  {
    id: 6,
    name: 'Collagen Boost Cream',
    price: '$564.99',
    category: 'Moisturerizer',
    description: 'Rich collagen-infused cream with peptides and plant stem cells.helps to redues darkspots and Restores firmness and smooths fine lines for youthful-looking skin.',
    image: 'Moisturerizer.png',
    rating: '★★★★★ (142 reviews)'
  },
  {
    id: 7,
    name: 'Moonlight Renewal Oil',
    price: '$700.0',
    category: 'Moonlight Renewal Oil',
    description: 'Polishes skin texture and improves the absorption of your follow-up serums.Instruction: Apply to damp skin in circular motions for 30 seconds.',
    image: 'Moon Mask.jpg',
    rating: '★★★★☆ (9K reviews)'
  },
  {
    id: 8,
    name: 'Shea Butter Hand Cream',
    price: '$760.23',
    category: 'Shea Butter Hand Cream',
    description: 'Provides a deep moisture barrier to prevent "ashy" or dry skin.',
    image: 'HandCream.jpg',
    rating: '★★★★☆ (7k reviews)'
  },
  {
    id: 9,
    name: 'Red Wine Face Cleanser',
    price: '$900.80',
    category: 'Red Wine Face Cleanser',
    description: 'Instantly calms redness and provides a visible "bounce back" to tired skin..',
    image: 'Scrub.jpg',
    rating: '★★★★☆ (500k reviews)'
  },
  {
    id: 10,
    name: 'Scalp Revitalizing Shampoo',
    price: '$5480.75',
    category: 'Scalp Revitalizing Shampoo',
    description: 'Removes impurities and pollutants without stripping the skin of its natural oils.All skin types, including sensitive skin.',
    image: 'HairMask.jpg',
    rating: '★★★★☆ (200k reviews)'
  },
  {
    id: 11,
    name: 'Overnight Brightening cream',
    price: '$490.89',
    category: 'lightly Absorbed Day Brightening Cream',
    description: 'Niacinamide (Vitamin B3) Visibly improves enlarged pores, uneven skin tone, and fine lines. A gentle yet effective brightening agent that fades hyper pigmentation.',
    image: 'LightWeight.jpg',
    rating: '★★★★☆ (708 reviews)'
  },
  {
    id: 12,
    name: 'Lightly absorbed Brightening Face oil',
    price: '$2900.60',
    category: 'Lightly Absorbed Overnight Brightening Cream',
    description: 'Fades dark spots, intensely hydrates without a heavy feel, and promotes a natural glow by morning. Rinse thoroughly with lukewarm water 2–3 times a week',
    image: 'Overnight.jpg',
    rating: '★★★★☆ (39k reviews)'
  }
];

// Cart and Wishlist storage
let cart = JSON.parse(localStorage.getItem('skinnovaCart')) || [];
let wishlist = JSON.parse(localStorage.getItem('skinnovaWishlist')) || [];

function updateCounts() {
  const cartCount = document.getElementById('cart-count');
  const wishlistCount = document.getElementById('wishlist-count');
  if (cartCount) cartCount.textContent = cart.length;
  if (wishlistCount) wishlistCount.textContent = wishlist.length;
}

function saveToStorage() {
  localStorage.setItem('skinnovaCart', JSON.stringify(cart));
  localStorage.setItem('skinnovaWishlist', JSON.stringify(wishlist));
  updateCounts();
}

function isInCart(productId) { return cart.some(item => item.id === productId); }
function isInWishlist(productId) { return wishlist.some(item => item.id === productId); }

function toggleCart(product) {
  if (isInCart(product.id)) {
    cart = cart.filter(item => item.id !== product.id);
    showToast(`${product.name} removed from cart`);
  } else {
    cart.push(product);
    showToast(`${product.name} added to cart! 🛒`);
  }
  saveToStorage();
  renderProducts(window.currentProducts || defaultProducts);
}

function toggleWishlist(product) {
  if (isInWishlist(product.id)) {
    wishlist = wishlist.filter(item => item.id !== product.id);
    showToast(`${product.name} removed from wishlist`);
  } else {
    wishlist.push(product);
    showToast(`${product.name} added to wishlist! ❤️`);
  }
  saveToStorage();
  renderProducts(window.currentProducts || defaultProducts);
}

function showToast(message) {
  const existingToast = document.querySelector('.toast-notification');
  if (existingToast) existingToast.remove();
  const toast = document.createElement('div');
  toast.className = 'toast-notification';
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => toast.classList.add('show'), 10);
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 2500);
}

// Render products
const productList = document.getElementById('product-list');

function renderProducts(products) {
  window.currentProducts = products;
  if (!productList) return;
  productList.innerHTML = '';
  products.forEach(product => {
    const inCart = isInCart(product.id);
    const inWishlist = isInWishlist(product.id);

    const productCard = document.createElement('article');
    productCard.className = 'product-card';
    productCard.setAttribute('role', 'listitem');
    productCard.innerHTML = `
      <div class="product-image" style="cursor: pointer;" onclick="showProductDetails(${product.id})">
        <img src="${product.image}" alt="${product.name}" />
        <span class="product-category">${product.category}</span>
        <button class="btn-wishlist ${inWishlist ? 'active' : ''}" data-id="${product.id}" aria-label="Add to wishlist" onclick="event.stopPropagation(); toggleWishlist({id:${product.id}, name:'${product.name.replace(/'/g, "\\'")}', image:'${product.image}', price:'${product.price}', description:'${product.description.replace(/'/g, "\\'")}', rating:'${product.rating}', category:'${product.category}'})">
          <span class="wishlist-icon">${inWishlist ? '❤️' : '🤍'}</span>
        </button>
      </div>
      <div class="product-content">
        <h3 style="cursor: pointer;" onclick="showProductDetails(${product.id})">${product.name}</h3>
        <p class="product-description">${product.description}</p>
        <div class="product-footer">
          <span class="product-price">${product.price}</span>
          <span class="product-rating">${product.rating}</span>
        </div>
        <div class="product-actions">
          <button class="btn-add-to-cart ${inCart ? 'in-cart' : ''}" data-id="${product.id}">
            <span class="cart-icon">${inCart ? '✓' : '🛒'}</span>
            <span>${inCart ? 'In Cart' : 'Add to Cart'}</span>
          </button>
          <button class="btn-view-wishlist ${inWishlist ? 'in-wishlist' : ''}" data-id="${product.id}">
            <span>${inWishlist ? '❤️' : '♡'}</span>
          </button>
        </div>
      </div>
    `;

    const cartBtn = productCard.querySelector('.btn-add-to-cart');
    const wishlistBtn2 = productCard.querySelector('.btn-view-wishlist');
    cartBtn.addEventListener('click', () => toggleCart(product));
    wishlistBtn2.addEventListener('click', () => toggleWishlist(product));

    productList.appendChild(productCard);
  });
}

// Modal functions (unchanged)
function showCartModal() { showModal('cart'); }
function showWishlistModal() { showModal('wishlist'); }

function showModal(type) {
  const items = type === 'cart' ? cart : wishlist;
  const title = type === 'cart' ? '🛒 Your Cart' : '❤️ Your Wishlist';
  const existingModal = document.querySelector('.modal-overlay');
  if (existingModal) existingModal.remove();

  const modal = document.createElement('div');
  modal.className = 'modal-overlay';
  modal.innerHTML = `
    <div class="modal-content">
      <div class="modal-header">
        <h2>${title}</h2>
        <button class="modal-close" aria-label="Close modal">✕</button>
      </div>
      <div class="modal-body">
        ${items.length === 0
      ? `<p class="empty-message">No items in your ${type} yet!</p>`
      : items.map(item => `
            <div class="modal-item">
              <img src="${item.image}" alt="${item.name}" />
              <div class="modal-item-info">
                <h4>${item.name}</h4>
                <p>${item.price}</p>
              </div>
              <button class="modal-item-remove" data-id="${item.id}" data-type="${type}">🗑️</button>
            </div>
          `).join('')
    }
      </div>
      ${items.length > 0 ? `
        <div class="modal-footer">
          ${type === 'cart'
        ? `<button class="btn-checkout">Proceed to Checkout</button>`
        : `<button class="btn-move-to-cart">Move All to Cart</button>`
      }
        </div>
      ` : ''}
    </div>
  `;

  document.body.appendChild(modal);
  modal.querySelector('.modal-close').addEventListener('click', () => modal.remove());
  modal.addEventListener('click', (e) => { if (e.target === modal) modal.remove(); });

  modal.querySelectorAll('.modal-item-remove').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = parseInt(btn.dataset.id);
      if (btn.dataset.type === 'cart') { cart = cart.filter(item => item.id !== id); }
      else { wishlist = wishlist.filter(item => item.id !== id); }
      saveToStorage();
      renderProducts(window.currentProducts || defaultProducts);
      showModal(type);
    });
  });

  const checkoutBtn = modal.querySelector('.btn-checkout');
  if (checkoutBtn) checkoutBtn.addEventListener('click', () => alert('Checkout feature coming soon! 🛍️'));

  const moveToCartBtn = modal.querySelector('.btn-move-to-cart');
  if (moveToCartBtn) {
    moveToCartBtn.addEventListener('click', () => {
      wishlist.forEach(item => { if (!isInCart(item.id)) cart.push(item); });
      wishlist = [];
      saveToStorage();
      renderProducts(window.currentProducts || defaultProducts);
      showToast('All items moved to cart! 🛒');
      modal.remove();
    });
  }
}

// ==========================================
// Advanced Product Details Modal
// ==========================================
function showProductDetails(id) {
  const product = (window.currentProducts || defaultProducts).find(p => p.id === id);
  if (!product) return;

  const inCart = isInCart(product.id);
  const inWishlist = isInWishlist(product.id);
  const existingModal = document.querySelector('.modal-overlay');
  if (existingModal) existingModal.remove();

  // Mock advanced details base on product category
  const skinType = 'All Skin Types' + (product.category.includes('Serum') ? ', especially Dry Skin' : '');
  const ingredients = 'Hyaluronic Acid, Vitamin C, Rose Extract, Squalane, Peptides, Niacinamide, Botanical Essences.';
  const benefits = '<ul><li>Deeply hydrates and restores skin barrier</li><li>Visibly brightens dull complexion</li><li>Reduces appearance of fine lines</li><li>Promotes natural, healthy radiance</li></ul>';
  const usage = 'Apply 2-3 drops to clean, dry skin. Gently massage in upward circular motions until fully absorbed. Use daily, morning and night, followed by sunscreen in the AM.';

  const modal = document.createElement('div');
  modal.className = 'modal-overlay detailed-modal-overlay';
  modal.innerHTML = `
    <div class="product-detailed-modal">
      <button class="modal-close detailed-close" aria-label="Close modal">✕</button>
      <div class="detailed-modal-grid">
        <div class="detailed-image-section">
          <div class="detailed-image-wrapper">
            <img src="${product.image}" alt="${product.name}" class="detailed-main-image" />
          </div>
        </div>
        <div class="detailed-info-section">
          <span class="product-category detailed-tag">${product.category}</span>
          <h2>${product.name}</h2>
          <div class="detailed-rating-price">
            <span class="detailed-price">${product.price}</span>
            <span class="detailed-rating">${product.rating}</span>
          </div>
          <p class="detailed-description">${product.description}</p>
          
          <div class="detailed-accordion">
            <div class="detailed-section">
              <h4>✨ Key Benefits</h4>
              ${benefits}
            </div>
            <div class="detailed-section">
              <h4>🌿 Ingredients</h4>
              <p>${ingredients}</p>
            </div>
            <div class="detailed-section">
              <h4>💧 Skin Type</h4>
              <p>${skinType}</p>
            </div>
            <div class="detailed-section">
              <h4>📝 How to Use</h4>
              <p>${usage}</p>
            </div>
          </div>

          <div class="detailed-actions">
            <button class="btn-add-to-cart detailed-cart-btn ${inCart ? 'in-cart' : ''}" data-id="${product.id}">
              <span class="cart-icon">${inCart ? '✓' : '🛒'}</span>
              <span>${inCart ? 'In Cart' : 'Add to Cart'}</span>
            </button>
            <button class="btn-wishlist detailed-wishlist-btn ${inWishlist ? 'active' : ''}" data-id="${product.id}" aria-label="Add to wishlist">
              <span class="wishlist-icon">${inWishlist ? '❤️' : '🤍'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  // Smooth entry animation
  setTimeout(() => modal.classList.add('show-detailed'), 10);

  modal.querySelector('.detailed-close').addEventListener('click', () => {
    modal.classList.remove('show-detailed');
    setTimeout(() => modal.remove(), 400); // Wait for transition
  });
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('show-detailed');
      setTimeout(() => modal.remove(), 400);
    }
  });

  const cartBtn = modal.querySelector('.detailed-cart-btn');
  const wishlistBtn = modal.querySelector('.detailed-wishlist-btn');

  cartBtn.addEventListener('click', () => {
    toggleCart(product);
    const updatedInCart = isInCart(product.id);
    cartBtn.className = `btn-add-to-cart detailed-cart-btn ${updatedInCart ? 'in-cart' : ''}`;
    cartBtn.innerHTML = `<span class="cart-icon">${updatedInCart ? '✓' : '🛒'}</span><span>${updatedInCart ? 'In Cart' : 'Add to Cart'}</span>`;
  });

  wishlistBtn.addEventListener('click', () => {
    toggleWishlist(product);
    const updatedInWishlist = isInWishlist(product.id);
    wishlistBtn.className = `btn-wishlist detailed-wishlist-btn ${updatedInWishlist ? 'active' : ''}`;
    wishlistBtn.innerHTML = `<span class="wishlist-icon">${updatedInWishlist ? '❤️' : '🤍'}</span>`;
  });
}

function loadProducts() {
  fetch('http://localhost:5000/products')
    .then(res => res.json())
    .then(data => renderProducts(data))
    .catch(() => renderProducts(defaultProducts));
}

// ==========================================
// NEW: Scroll Reveal Animation
// ==========================================
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
  reveals.forEach(el => observer.observe(el));
}

// ==========================================
// NEW: Header scroll effect
// ==========================================
function initHeaderScroll() {
  const header = document.getElementById('site-header');
  if (!header) return;
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 50);
  });
}

// ==========================================
// NEW: Skincare Routine Section
// ==========================================
function initRoutineSection() {
  const container = document.getElementById('routine-container');
  if (!container) return;

  const routines = {
    normal: {
      morning: [
        { step: 'Cleanse', product: 'Gentle Cleanse Oil', desc: 'Start with a gentle cleanse to remove overnight buildup' },
        { step: 'Serum', product: 'Hydra Luxe Serum', desc: 'Apply hydrating serum for deep moisture' },
        { step: 'Moisturize', product: 'Collagen Boost Cream', desc: 'Lock in hydration with collagen cream' },
        { step: 'Protect', product: 'Vitamin C Brightener', desc: 'Antioxidant protection for the day' }
      ],
      night: [
        { step: 'Cleanse', product: 'Gentle Cleanse Oil', desc: 'Double cleanse to remove day\'s impurities' },
        { step: 'Treat', product: 'Moonlight Renewal Oil', desc: 'Polish and renew skin texture' },
        { step: 'Repair', product: 'Radiance Night Cream', desc: 'Nourish and repair while you sleep' }
      ]
    },
    dry: {
      morning: [
        { step: 'Cleanse', product: 'Gentle Cleanse Oil', desc: 'Gentle cleansing without stripping moisture' },
        { step: 'Hydrate', product: 'Hydra Luxe Serum', desc: 'Deep hydration with hyaluronic acid' },
        { step: 'Nourish', product: 'Shea Butter Hand Cream', desc: 'Rich moisture for dry areas' },
        { step: 'Moisturize', product: 'Collagen Boost Cream', desc: 'Seal in all that nourishment' }
      ],
      night: [
        { step: 'Cleanse', product: 'Gentle Cleanse Oil', desc: 'Gentle oil cleanse for dry skin' },
        { step: 'Mask', product: 'Glow Face Mask', desc: 'Weekly deep nourishment (2x/week)' },
        { step: 'Repair', product: 'Radiance Night Cream', desc: 'Intensive overnight repair' },
        { step: 'Oil', product: 'Lightly absorbed Brightening Face oil', desc: 'Seal with facial oil for deep hydration' }
      ]
    },
    oily: {
      morning: [
        { step: 'Cleanse', product: 'Red Wine Face Cleanser', desc: 'Deep cleanse to control oil production' },
        { step: 'Treat', product: 'Vitamin C Brightener', desc: 'Lightweight brightening treatment' },
        { step: 'Hydrate', product: 'Overnight Brightening cream', desc: 'Oil-free lightweight hydration' }
      ],
      night: [
        { step: 'Cleanse', product: 'Red Wine Face Cleanser', desc: 'Thorough evening cleanse' },
        { step: 'Treat', product: 'Hydra Luxe Serum', desc: 'Balanced hydration without heaviness' },
        { step: 'Repair', product: 'Radiance Night Cream', desc: 'Light night repair' }
      ]
    },
    sensitive: {
      morning: [
        { step: 'Cleanse', product: 'Gentle Cleanse Oil', desc: 'Ultra-gentle cleansing for sensitive skin' },
        { step: 'Soothe', product: 'Hydra Luxe Serum', desc: 'Calming hydration with botanicals' },
        { step: 'Protect', product: 'Collagen Boost Cream', desc: 'Gentle moisturizer with barrier repair' }
      ],
      night: [
        { step: 'Cleanse', product: 'Gentle Cleanse Oil', desc: 'Soothing evening cleanse' },
        { step: 'Treat', product: 'Moonlight Renewal Oil', desc: 'Gentle renewal for sensitive skin' },
        { step: 'Repair', product: 'Radiance Night Cream', desc: 'Calming overnight repair' }
      ]
    }
  };

  let currentSkin = 'normal';
  let currentTab = 'morning';

  function renderRoutine() {
    const stepsEl = document.getElementById('routine-steps');
    if (!stepsEl) return;
    const steps = routines[currentSkin][currentTab];
    stepsEl.innerHTML = steps.map((s, i) => `
      <div class="routine-step">
        <div class="step-number">${i + 1}</div>
        <div class="step-info">
          <h4>${s.step} — ${s.product}</h4>
          <p>${s.desc}</p>
        </div>
      </div>
      `).join('');
  }

  document.getElementById('skin-type-select')?.addEventListener('change', (e) => {
    currentSkin = e.target.value;
    renderRoutine();
  });

  document.querySelectorAll('.routine-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.routine-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      currentTab = tab.dataset.tab;
      renderRoutine();
    });
  });

  renderRoutine();
}

// ==========================================
// NEW: Testimonials Slider
// ==========================================
function initTestimonialsSlider() {
  const track = document.getElementById('testimonial-track');
  const dotsContainer = document.getElementById('slider-dots');
  if (!track || !dotsContainer) return;

  const testimonials = [
    { name: 'Dr. Anjali Mehta', position: 'Dermatologist', avatar: '👩‍⚕️', rating: 5, text: 'SkinNova products have transformed my patients\' skin. The natural ingredients combined with scientific formulation deliver exceptional results.' },
    { name: 'Rajesh Kumar', position: 'Beauty Salon Owner', avatar: '👨‍💼', rating: 5, text: 'We exclusively use SkinNova products in our salon. Clients love the results and keep coming back. Highly professional and effective!' },
    { name: 'Maya Patel', position: 'Spa Director', avatar: '👩‍💼', rating: 4, text: 'The quality and consistency of SkinNova products are outstanding. Our clients notice visible improvements within weeks.' },
    { name: 'Priya Sharma', position: 'Skincare Enthusiast', avatar: '💆‍♀️', rating: 5, text: 'I switched to SkinNova\'s Ayurvedic range and my skin has never looked better. The natural glow is real!' },
    { name: 'Sarah Johnson', position: 'Beauty Blogger', avatar: '📝', rating: 5, text: 'Finally, a brand that combines Ayurvedic wisdom with modern skincare science. My followers love the recommendations!' }
  ];

  // Try to use DB data if available
  if (typeof db !== 'undefined') {
    const clients = db.getClients();
    if (clients.length > 0) {
      clients.forEach(c => {
        if (!testimonials.find(t => t.name === c.name)) {
          testimonials.push({ name: c.name, position: c.position, avatar: c.avatar, rating: c.rating, text: c.testimonial });
        }
      });
    }
  }

  track.innerHTML = testimonials.map(t => `
      <div class="testimonial-card">
        <div class="testimonial-inner">
          <div class="testimonial-avatar">${t.avatar}</div>
          <div class="stars">${'⭐'.repeat(t.rating)}${'☆'.repeat(5 - t.rating)}</div>
          <blockquote>"${t.text}"</blockquote>
          <div class="author">${t.name}</div>
          <div class="position">${t.position}</div>
        </div>
      </div>
      `).join('');

  dotsContainer.innerHTML = testimonials.map((_, i) => `
      <button class="slider-dot ${i === 0 ? 'active' : ''}" data-index="${i}"></button>
        `).join('');

  let current = 0;
  function goTo(index) {
    current = index;
    track.style.transform = `translateX(-${current * 100}%)`;
    dotsContainer.querySelectorAll('.slider-dot').forEach((d, i) => {
      d.classList.toggle('active', i === current);
    });
  }

  dotsContainer.querySelectorAll('.slider-dot').forEach(dot => {
    dot.addEventListener('click', () => goTo(parseInt(dot.dataset.index)));
  });

  // Auto-slide every 5s
  setInterval(() => goTo((current + 1) % testimonials.length), 5000);
}

// ==========================================
// Initialize
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  updateCounts();

  const cartIcon = document.getElementById('cart-icon');
  if (cartIcon) cartIcon.addEventListener('click', showCartModal);

  const wishlistIcon = document.getElementById('wishlist-icon');
  if (wishlistIcon) wishlistIcon.addEventListener('click', showWishlistModal);

  // Mobile Menu Toggle
  const hamburger = document.getElementById('hamburger-menu');
  const nav = document.getElementById('main-nav');
  if (hamburger && nav) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      nav.classList.toggle('nav-open');
    });
    nav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        nav.classList.remove('nav-open');
      });
    });
    document.addEventListener('click', (e) => {
      if (!hamburger.contains(e.target) && !nav.contains(e.target) && nav.classList.contains('nav-open')) {
        hamburger.classList.remove('active');
        nav.classList.remove('nav-open');
      }
    });
  }

  // New features
  initScrollReveal();
  initHeaderScroll();
  initRoutineSection();
  initTestimonialsSlider();
});

loadProducts();

// Upload form (only on admin page)
const form = document.getElementById('uploadForm');
if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    try {
      await fetch('http://localhost:5000/upload', {
        method: 'POST',
        body: formData
      });
      alert('Product uploaded successfully');
      form.reset();
      loadProducts();
    } catch (error) {
      alert('Upload failed. Showing default products.');
      renderProducts(defaultProducts);
    }
  });
}
