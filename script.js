/* ════════════════════════════════════════════════════════
   BOX CARE — script.js
   Premium Interactive Logic & Micro-Interactions
════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
  try {

  // Initialize Lucide Icons
  if (window.lucide) {
    window.lucide.createIcons();
  }

  /* ── STICKY HEADER ───────────────────────────────── */
  const header = document.getElementById('header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  /* ── SEARCH BAR TOGGLE ───────────────────────────── */
  const searchToggleBtn = document.getElementById('search-toggle-btn');
  const searchBar = document.getElementById('search-bar');
  const searchInput = document.getElementById('search-input');
  const searchClearBtn = document.getElementById('search-clear-btn');

  searchToggleBtn.addEventListener('click', () => {
    searchBar.classList.toggle('open');
    if (searchBar.classList.contains('open')) {
      searchInput.focus();
    }
  });

  searchClearBtn.addEventListener('click', () => {
    searchInput.value = '';
    searchInput.focus();
  });

  // Close search on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && searchBar.classList.contains('open')) {
      searchBar.classList.remove('open');
    }
  });

  /* ── MOBILE MENU (HAMBURGER) ───────────────────────── */
  const hamburgerBtn = document.getElementById('hamburger-btn');
  const navLinks = document.getElementById('nav-links');

  hamburgerBtn.addEventListener('click', () => {
    const isOpen = hamburgerBtn.classList.toggle('open');
    navLinks.classList.toggle('open');
    
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      if (header) {
        const headerRect = header.getBoundingClientRect();
        navLinks.style.top = `${headerRect.bottom}px`;
      }
    } else {
      document.body.style.overflow = '';
    }
  });

  // Close mobile nav when clicking a link
  const navLinksList = document.querySelectorAll('.nav-link');
  navLinksList.forEach(link => {
    link.addEventListener('click', (e) => {
      const isDropdownTrigger = link.closest('.nav-item-dropdown');
      const isMobile = window.innerWidth <= 1050;

      if (isDropdownTrigger && isMobile) {
        e.preventDefault();
        e.stopPropagation();
        const parentDropdown = link.closest('.nav-item-dropdown');
        parentDropdown.classList.toggle('open');
        
        const dropdownMenu = parentDropdown.querySelector('.dropdown-menu');
        if (dropdownMenu) {
          const isDisplayed = window.getComputedStyle(dropdownMenu).display === 'flex';
          dropdownMenu.style.display = isDisplayed ? 'none' : 'flex';
        }
        return;
      }

      hamburgerBtn.classList.remove('open');
      navLinks.classList.remove('open');
      document.body.style.overflow = '';
      
      // Update active state
      navLinksList.forEach(l => l.classList.remove('active'));
      link.classList.add('active');
    });
  });

  // Shop dropdown trigger items (Shopping Cart & Checkout Flow)
  document.addEventListener('click', (e) => {
    const cartTrigger = e.target.closest('#nav-cart-trigger');
    const checkoutTrigger = e.target.closest('#nav-checkout-trigger');
    
    if (cartTrigger) {
      e.preventDefault();
      if (cartDrawer && !cartDrawer.classList.contains('open')) {
        cartDrawer.classList.add('open');
      }
      if (hamburgerBtn && hamburgerBtn.classList.contains('open')) {
        hamburgerBtn.classList.remove('open');
        navLinks.classList.remove('open');
        document.body.style.overflow = '';
      }
    }
    
    if (checkoutTrigger) {
      e.preventDefault();
      if (cartDrawer && !cartDrawer.classList.contains('open')) {
        cartDrawer.classList.add('open');
      }
      if (hamburgerBtn && hamburgerBtn.classList.contains('open')) {
        hamburgerBtn.classList.remove('open');
        navLinks.classList.remove('open');
        document.body.style.overflow = '';
      }
      if (cart && cart.length > 0) {
        showToast('Click "Proceed to Checkout" in your cart to finish your order.');
      } else {
        showToast('Your cart is empty. Please add items to checkout!');
      }
    }
  });

  /* ── TOAST NOTIFICATIONS ────────────────────────── */
  const toast = document.getElementById('toast');
  const showToast = (message) => {
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 3000);
  };

  /* ── CART SYSTEM & DRAWER ────────────────────────── */
  const cartToggleBtn = document.getElementById('cart-toggle-btn');
  const cartDrawer = document.getElementById('cart-drawer');
  const cartOverlay = document.getElementById('cart-overlay');
  const cdCloseBtn = document.getElementById('cd-close-btn');
  const cdShopBtn = document.getElementById('cd-shop-btn');
  const cdItemsContainer = document.getElementById('cd-items');
  const cdEmpty = document.getElementById('cd-empty');
  const cdFooter = document.getElementById('cd-footer');
  const cdTotalPrice = document.getElementById('cd-total-price');
  const cartCount = document.getElementById('cart-count');

  let cart = JSON.parse(localStorage.getItem('boxcare_cart') || '[]');

  const toggleCartDrawer = () => {
    cartDrawer.classList.toggle('open');
  };

  cartToggleBtn.addEventListener('click', toggleCartDrawer);
  cartOverlay.addEventListener('click', toggleCartDrawer);
  cdCloseBtn.addEventListener('click', toggleCartDrawer);
  if (cdShopBtn) {
    cdShopBtn.addEventListener('click', toggleCartDrawer);
  }

  const updateCartUI = () => {
    // Save cart state
    localStorage.setItem('boxcare_cart', JSON.stringify(cart));
    
    cdItemsContainer.innerHTML = '';
    if (cart.length === 0) {
      cdEmpty.style.display = 'flex';
      cdFooter.style.display = 'none';
      cartCount.textContent = '0';
    } else {
      cdEmpty.style.display = 'none';
      cdFooter.style.display = 'flex';
      
      let total = 0;
      let count = 0;
      
      cart.forEach((item, index) => {
        total += item.price * item.quantity;
        count += item.quantity;

        const li = document.createElement('li');
        li.className = 'cd-item';
        li.innerHTML = `
          <div class="cd-item-info">
            <h5 class="cd-item-name">${item.name}</h5>
            <span class="cd-item-price">₹${item.price} x ${item.quantity}</span>
          </div>
          <button class="cd-item-remove" data-index="${index}" aria-label="Remove item">
            <i data-lucide="trash-2"></i>
          </button>
        `;
        cdItemsContainer.appendChild(li);
      });

      cdTotalPrice.textContent = `₹${total}`;
      cartCount.textContent = count;
      if (window.lucide) {
        window.lucide.createIcons();
      }

      // Add event listeners to remove buttons
      const removeBtns = cdItemsContainer.querySelectorAll('.cd-item-remove');
      removeBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
          const idx = parseInt(btn.getAttribute('data-index'));
          const removedName = cart[idx].name;
          cart.splice(idx, 1);
          updateCartUI();
          showToast(`${removedName} removed from cart`);
        });
      });
    }
  };

  // Initialize cart UI on page load
  updateCartUI();

  // Add to cart buttons
  const addCartBtns = document.querySelectorAll('.add-cart-btn');
  addCartBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const name = btn.getAttribute('data-name');
      const price = parseInt(btn.getAttribute('data-price'));

      const existingItem = cart.find(item => item.name === name);
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        cart.push({ name, price, quantity: 1 });
      }

      updateCartUI();
      showToast(`${name} added to cart!`);
    });
  });

  // ── PARUL PACKAGING STYLE CATEGORY TABS & QUICK ADD LOGIC ──
  document.addEventListener('click', (e) => {
    const tabBtn = e.target.closest('.pm-tab-btn');
    if (!tabBtn) return;

    const filterContainer = tabBtn.closest('.pm-filter-tabs');
    if (filterContainer) {
      filterContainer.querySelectorAll('.pm-tab-btn').forEach(b => b.classList.remove('active'));
      tabBtn.classList.add('active');

      const targetCat = tabBtn.getAttribute('data-cat');
      const grid = document.getElementById('parul-products-grid');
      if (grid) {
        const items = grid.querySelectorAll('.pm-item');
        items.forEach(item => {
          const itemCat = item.getAttribute('data-cat');
          if (targetCat === 'all' || itemCat === targetCat) {
            item.style.setProperty('display', 'flex', 'important');
            item.style.opacity = '1';
            item.style.visibility = 'visible';
            item.style.transform = 'translateY(0)';
          } else {
            item.style.setProperty('display', 'none', 'important');
          }
        });
      }
    }
  });

  document.addEventListener('click', (e) => {
    const quickAddBtn = e.target.closest('.parul-quick-add-btn');
    if (!quickAddBtn) return;

    e.preventDefault();
    e.stopPropagation();

    const prodId = quickAddBtn.getAttribute('data-id');
    if (prodId && typeof openInstantViewModal === 'function') {
      openInstantViewModal(prodId);
      return;
    }

    const name = quickAddBtn.getAttribute('data-name') || 'Packaging Item';
    const price = parseInt(quickAddBtn.getAttribute('data-price')) || 100;

    const existingItem = cart.find(item => item.name === name);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({ name, price, quantity: 1 });
    }

    updateCartUI();
    showToast(`🛍️ ${name} added to Cart!`);

    if (cartDrawer && !cartDrawer.classList.contains('open')) {
      cartDrawer.classList.add('open');
    }
  });

  // ── INSTANT PRODUCT VIEW & QUICK BUY DROPDOWN & MODAL MANAGER ──
  const ivDropdown = document.getElementById('instant-view-dropdown');
  const ivTriggerBtn = document.getElementById('instant-view-trigger-btn');
  const ivOverlay = document.getElementById('iv-modal-overlay');
  const ivCloseBtn = document.getElementById('iv-modal-close');

  const ivProductsData = {
    'fmb-4-4-2': {
      id: 'fmb-4-4-2',
      name: 'Flap Mailer Box - 4" x 4" x 2"',
      category: 'Flap Mailer Box',
      sizeInches: '4" x 4" x 2"',
      sizeCm: '10.16 x 10.16 x 5.08 cm',
      image: 'images/box_4_4_2.png',
      desc: 'Premium corrugated mailer box with self-locking top flaps. Engineered to protect small items, jewelry, cosmetics, and lightweight gifts during shipping.',
      prices: { 50: 362.5, 100: 675.0, 300: 1875.0, 500: 2875.0 }
    },
    'fmb-4-4-1-5': {
      id: 'fmb-4-4-1-5',
      name: 'Flap Mailer Box - 4" x 4" x 1.5"',
      category: 'Flap Mailer Box',
      sizeInches: '4" x 4" x 1.5"',
      sizeCm: '10.16 x 10.16 x 3.81 cm',
      image: 'images/box_4_4_1_5.png',
      desc: 'Compact slim-profile flap mailer box for accessories, phone cases, cards, and small products. Maximum crush-resistance with double sidewalls.',
      prices: { 50: 326.5, 100: 607.5, 300: 1687.5, 500: 2587.5 }
    },
    'fmb-6-4-2': {
      id: 'fmb-6-4-2',
      name: 'Flap Mailer Box - 6" x 4" x 2"',
      category: 'Flap Mailer Box',
      sizeInches: '6" x 4" x 2"',
      sizeCm: '15.24 x 10.16 x 5.1 cm',
      image: 'images/box_6_4_2.png',
      desc: 'Popular medium mailer box designed for e-commerce order fulfillment. Fits electronics, skincare sets, mugs, and apparel accessories effortlessly.',
      prices: { 50: 471.25, 100: 875.0, 300: 2437.5, 500: 3737.5 }
    },
    'fmb-6-5-1-5': {
      id: 'fmb-6-5-1-5',
      name: 'Flap Mailer Box - 6" x 5" x 1.5"',
      category: 'Flap Mailer Box',
      sizeInches: '6" x 5" x 1.5"',
      sizeCm: '15.24 x 12.70 x 3.81 cm',
      image: 'images/box_6_5_1_5.png',
      desc: 'Versatile low-depth mailer box perfect for books, garments, stationary sets, and flat merchandise. Interlocking tabs ensure safe transit.',
      prices: { 50: 783.0, 100: 1458.0, 300: 4050.0, 500: 6210.0 }
    }
  };

  let currentIvProd = ivProductsData['fmb-4-4-2'];
  let selectedIvPack = 50;

  const openInstantViewModal = (prodId) => {
    const prod = ivProductsData[prodId] || ivProductsData['fmb-4-4-2'];
    currentIvProd = prod;
    selectedIvPack = 50;

    const imgElem = document.getElementById('iv-modal-img');
    if (imgElem) imgElem.src = prod.image;
    
    const catElem = document.getElementById('iv-modal-cat');
    if (catElem) catElem.textContent = prod.category;
    
    const titleElem = document.getElementById('iv-modal-title');
    if (titleElem) titleElem.textContent = prod.name;
    
    const descElem = document.getElementById('iv-modal-desc');
    if (descElem) descElem.textContent = prod.desc;

    const dimInElem = document.getElementById('iv-modal-dim-in');
    if (dimInElem) dimInElem.textContent = prod.sizeInches;

    const dimCmElem = document.getElementById('iv-modal-dim-cm');
    if (dimCmElem) dimCmElem.textContent = prod.sizeCm;

    // Render Pack Buttons
    const packContainer = document.getElementById('iv-modal-pack-options');
    if (packContainer) {
      packContainer.innerHTML = '';

      Object.keys(prod.prices).forEach(qty => {
        const q = parseInt(qty);
        const price = prod.prices[qty];
        const unit = (price / q).toFixed(2);

        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = `iv-pack-btn ${q === 50 ? 'selected' : ''}`;
        btn.innerHTML = `${q} pcs — ₹${price}<br/><small style="font-weight:400; opacity:0.85">₹${unit}/pc</small>`;
        btn.addEventListener('click', () => {
          selectedIvPack = q;
          packContainer.querySelectorAll('.iv-pack-btn').forEach(b => b.classList.remove('selected'));
          btn.classList.add('selected');
          updateIvModalPrice();
        });
        packContainer.appendChild(btn);
      });
    }

    updateIvModalPrice();
    if (ivOverlay) ivOverlay.classList.add('open');
    if (window.lucide) window.lucide.createIcons();
  };

  const updateIvModalPrice = () => {
    if (!currentIvProd) return;
    const price = currentIvProd.prices[selectedIvPack] || 362.5;
    const unitPrice = (price / selectedIvPack).toFixed(2);

    const priceElem = document.getElementById('iv-modal-price');
    if (priceElem) priceElem.textContent = `₹${price.toFixed(2)}`;

    const unitElem = document.getElementById('iv-modal-unit-price');
    if (unitElem) unitElem.textContent = `₹${unitPrice} / box • Pack of ${selectedIvPack}`;
  };

  if (ivTriggerBtn && ivDropdown) {
    ivTriggerBtn.addEventListener('click', () => {
      const selectedId = ivDropdown.value || 'fmb-4-4-2';
      openInstantViewModal(selectedId);
    });

    ivDropdown.addEventListener('change', () => {
      openInstantViewModal(ivDropdown.value);
    });
  }

  if (ivCloseBtn && ivOverlay) {
    ivCloseBtn.addEventListener('click', () => {
      ivOverlay.classList.remove('open');
    });

    ivOverlay.addEventListener('click', (e) => {
      if (e.target === ivOverlay) {
        ivOverlay.classList.remove('open');
      }
    });
  }

  // Modal Buy Now & Add to Cart Handlers
  const ivAddCartBtn = document.getElementById('iv-modal-add-cart');
  const ivBuyNowBtn = document.getElementById('iv-modal-buy-now');

  if (ivAddCartBtn) {
    ivAddCartBtn.addEventListener('click', () => {
      const price = currentIvProd.prices[selectedIvPack];
      const itemName = `${currentIvProd.name} (Pack of ${selectedIvPack})`;

      const existingItem = cart.find(item => item.name === itemName);
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        cart.push({ name: itemName, price: Math.round(price), quantity: 1 });
      }

      updateCartUI();
      showToast(`🛍️ ${itemName} added to Cart!`);
      if (ivOverlay) ivOverlay.classList.remove('open');
      if (cartDrawer && !cartDrawer.classList.contains('open')) {
        cartDrawer.classList.add('open');
      }
    });
  }

  if (ivBuyNowBtn) {
    ivBuyNowBtn.addEventListener('click', () => {
      const price = currentIvProd.prices[selectedIvPack];
      const itemName = `${currentIvProd.name} (Pack of ${selectedIvPack})`;

      const existingItem = cart.find(item => item.name === itemName);
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        cart.push({ name: itemName, price: Math.round(price), quantity: 1 });
      }

      updateCartUI();
      showToast(`⚡ Proceeding to Cart with ${itemName}!`);
      if (ivOverlay) ivOverlay.classList.remove('open');
      if (cartDrawer && !cartDrawer.classList.contains('open')) {
        cartDrawer.classList.add('open');
      }
    });
  }

  // Checkout button click
  const checkoutBtn = document.getElementById('cd-checkout-btn');
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
      showToast('Proceeding to checkout... Thank you!');
      cart = [];
      updateCartUI();
      toggleCartDrawer();
    });
  }

  // Wishlist toggle
  const wishlistToggleBtn = document.getElementById('wishlist-toggle-btn');
  const wishlistCountBadge = document.getElementById('wishlist-count');
  let wishlistCount = 0;

  const addWishlistBtns = document.querySelectorAll('.add-wishlist-btn');
  addWishlistBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const icon = btn.querySelector('svg');
      if (icon) {
        if (icon.getAttribute('fill') === 'currentColor') {
          icon.setAttribute('fill', 'none');
          wishlistCount = Math.max(0, wishlistCount - 1);
          showToast('Removed from wishlist');
        } else {
          icon.setAttribute('fill', 'currentColor');
          wishlistCount += 1;
          showToast('Added to wishlist!');
        }

        if (wishlistCount > 0) {
          wishlistCountBadge.textContent = wishlistCount;
          wishlistCountBadge.removeAttribute('hidden');
        } else {
          wishlistCountBadge.setAttribute('hidden', '');
        }
      }
    });
  });

  /* ── CUSTOM BOX BUILDER ──────────────────────────── */
  const builderSteps = document.querySelectorAll('.builder-step');
  const bpFill = document.getElementById('bp-fill');
  const bpLabel = document.getElementById('bp-label');
  const prevType = document.getElementById('prev-type');
  const prevMat = document.getElementById('prev-mat');
  const prevSize = document.getElementById('prev-size');
  const prevLogo = document.getElementById('prev-logo');
  const bsFileInput = document.getElementById('bs-file-input');
  const bsUploadArea = document.getElementById('bs-upload-area');
  const bsSubmitBtn = document.getElementById('bs-submit-btn');

  let builderData = {
    type: '',
    material: '',
    length: '',
    width: '',
    height: '',
    logo: null,
    name: '',
    phone: '',
    email: '',
    qty: ''
  };

  // Parse query parameters to pre-fill builder if available
  if (window.location.pathname.includes('custom-boxes') || document.getElementById('calc-scene')) {
    const params = new URLSearchParams(window.location.search);
    const boxType = params.get('type');
    const length = params.get('length');
    const width = params.get('width');
    const height = params.get('height');

    if (boxType) {
      const radio = document.querySelector(`input[name="box-type"][value="${boxType}"]`);
      if (radio) {
        radio.checked = true;
        builderData.type = boxType;
        const prevType = document.getElementById('prev-type');
        if (prevType) prevType.textContent = radio.parentElement.textContent.trim();
      }
    }
    
    const materialRadio = document.querySelector('input[name="material"][value="3ply"]');
    if (materialRadio) {
      materialRadio.checked = true;
      builderData.material = '3ply';
      const prevMat = document.getElementById('prev-mat');
      if (prevMat) prevMat.textContent = materialRadio.parentElement.textContent.trim();
    }

    if (length) {
      const el = document.getElementById('bs-length');
      if (el) el.value = length;
      builderData.length = length;
    }
    if (width) {
      const el = document.getElementById('bs-width');
      if (el) el.value = width;
      builderData.width = width;
    }
    if (height) {
      const el = document.getElementById('bs-height');
      if (el) el.value = height;
      builderData.height = height;
    }

    if (length && width && height) {
      const prevSize = document.getElementById('prev-size');
      if (prevSize) prevSize.textContent = `${length} × ${width} × ${height} cm`;
      // Delay navigation slightly so DOM can settle
      setTimeout(() => {
        navigateToStep(1, 4); // Skip directly to step 4 (logo upload)
      }, 500);
    }
  }

  // Step navigation helper
  const navigateToStep = (currentStep, targetStep) => {
    // Basic step validations
    if (targetStep > currentStep) {
      if (currentStep === 1) {
        const selectedType = document.querySelector('input[name="box-type"]:checked');
        if (!selectedType) {
          showToast('Please select a box type');
          return;
        }
        builderData.type = selectedType.value;
        prevType.textContent = selectedType.parentElement.textContent.trim();
      }

      if (currentStep === 2) {
        const selectedMat = document.querySelector('input[name="material"]:checked');
        if (!selectedMat) {
          showToast('Please select a material');
          return;
        }
        builderData.material = selectedMat.value;
        prevMat.textContent = selectedMat.parentElement.textContent.trim();
      }

      if (currentStep === 3) {
        const l = document.getElementById('bs-length').value;
        const w = document.getElementById('bs-width').value;
        const h = document.getElementById('bs-height').value;
        if (!l || !w || !h) {
          showToast('Please fill in all dimensions');
          return;
        }
        builderData.length = l;
        builderData.width = w;
        builderData.height = h;
        prevSize.textContent = `${l} × ${w} × ${h} cm`;
      }
    }

    // Switch active state & smooth scroll to target section
    builderSteps.forEach(step => step.classList.remove('active'));
    const nextStepEl = document.getElementById(`bstep-${targetStep}`);
    if (nextStepEl) {
      nextStepEl.classList.add('active');
      nextStepEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    // Update progress bar if present
    if (bpFill && bpLabel) {
      const percentage = (targetStep / 6) * 100;
      bpFill.style.width = `${percentage}%`;
      bpLabel.textContent = `Step ${targetStep} of 6`;
    }
  };

  // Next Buttons
  document.querySelectorAll('.bs-next-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const currentStep = parseInt(btn.closest('.builder-step').getAttribute('data-step'));
      const targetStep = parseInt(btn.getAttribute('data-next'));
      navigateToStep(currentStep, targetStep);
    });
  });

  // Back Buttons
  document.querySelectorAll('.bs-back-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const currentStep = parseInt(btn.closest('.builder-step').getAttribute('data-step'));
      const targetStep = parseInt(btn.getAttribute('data-back'));
      navigateToStep(currentStep, targetStep);
    });
  });

  // File Upload Logic
  if (bsUploadArea && bsFileInput) {
    bsUploadArea.addEventListener('click', () => bsFileInput.click());

    bsFileInput.addEventListener('change', (e) => {
      if (e.target.files.length > 0) {
        const file = e.target.files[0];
        builderData.logo = file.name;
        prevLogo.textContent = file.name;
        showToast(`Selected file: ${file.name}`);
      }
    });

    // Drag and drop support
    bsUploadArea.addEventListener('dragover', (e) => {
      e.preventDefault();
      bsUploadArea.style.borderColor = 'var(--orange)';
      bsUploadArea.style.background = 'rgba(214,138,69,.08)';
    });

    bsUploadArea.addEventListener('dragleave', () => {
      bsUploadArea.style.borderColor = 'rgba(255,255,255,.25)';
      bsUploadArea.style.background = 'transparent';
    });

    bsUploadArea.addEventListener('drop', (e) => {
      e.preventDefault();
      bsUploadArea.style.borderColor = 'rgba(255,255,255,.25)';
      bsUploadArea.style.background = 'transparent';

      if (e.dataTransfer.files.length > 0) {
        const file = e.dataTransfer.files[0];
        builderData.logo = file.name;
        prevLogo.textContent = file.name;
        showToast(`Dropped file: ${file.name}`);
      }
    });
  }

  // Builder Submit Quote Button
  if (bsSubmitBtn) {
    bsSubmitBtn.addEventListener('click', () => {
      const name = document.getElementById('bs-name').value;
      const phone = document.getElementById('bs-phone').value;
      const email = document.getElementById('bs-email').value;
      const qty = document.getElementById('bs-qty').value;

      if (!name || !phone || !email || !qty) {
        showToast('Please fill in all contact details and quantity');
        return;
      }

      builderData.name = name;
      builderData.phone = phone;
      builderData.email = email;
      builderData.qty = qty;

      showToast('Thank you! Quote request submitted successfully.');
      
      // Reset form & data
      builderData = { type: '', material: '', length: '', width: '', height: '', logo: null, name: '', phone: '', email: '', qty: '' };
      document.querySelectorAll('.builder-step input[type="radio"]').forEach(rad => rad.checked = false);
      document.querySelectorAll('.builder-step input[type="number"]').forEach(input => input.value = '');
      document.querySelectorAll('.builder-step input[type="text"]').forEach(input => input.value = '');
      document.querySelectorAll('.builder-step input[type="tel"]').forEach(input => input.value = '');
      document.querySelectorAll('.builder-step input[type="email"]').forEach(input => input.value = '');
      prevType.textContent = '—';
      prevMat.textContent = '—';
      prevSize.textContent = '—';
      prevLogo.textContent = 'Not uploaded';
      
      navigateToStep(6, 1);
    });
  }

  /* ── SWIPER TESTIMONIALS SLIDER ──────────────────── */
  if (typeof Swiper !== 'undefined' && document.getElementById('testimonials-swiper')) {
    new Swiper('#testimonials-swiper', {
      slidesPerView: 1,
      spaceBetween: 24,
      grabCursor: true,
      loop: true,
      pagination: {
        el: '#testi-pagination',
        clickable: true,
      },
      navigation: {
        nextEl: '#testi-next',
        prevEl: '#testi-prev',
      },
      breakpoints: {
        640: {
          slidesPerView: 2,
        },
        1024: {
          slidesPerView: 3,
        }
      }
    });
  }

  /* ── FAQ ACCORDION ────────────────────────────────── */
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-q');
    question.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      
      // Close all first
      faqItems.forEach(i => {
        i.classList.remove('open');
        i.querySelector('.faq-q').setAttribute('aria-expanded', 'false');
      });

      if (!isOpen) {
        item.classList.add('open');
        question.setAttribute('aria-expanded', 'true');
      }
    });
  });

  /* ── SCROLL REVEAL ANIMATIONS ────────────────────── */
  const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  /* ── STATS COUNTER ANIMATION ─────────────────────── */
  const statsElements = document.querySelectorAll('.stat-num');
  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.getAttribute('data-target'));
        const suffix = el.getAttribute('data-suffix') || '';
        let current = 0;
        const duration = 1500; // ms
        const stepTime = Math.max(Math.floor(duration / target), 15);
        
        const counter = setInterval(() => {
          current += Math.ceil(target / 80);
          if (current >= target) {
            el.textContent = target.toLocaleString() + suffix;
            clearInterval(counter);
          } else {
            el.textContent = current.toLocaleString() + suffix;
          }
        }, stepTime);
        
        statsObserver.unobserve(el);
      }
    });
  }, {
    threshold: 0.5
  });

  statsElements.forEach(el => statsObserver.observe(el));

  /* ── BACK TO TOP BUTTON ──────────────────────────── */
  const backTopBtn = document.getElementById('back-top-btn');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      backTopBtn.classList.add('visible');
    } else {
      backTopBtn.classList.remove('visible');
    }
  });

  backTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  /* ── NEWSLETTER FORM SUBMIT ──────────────────────── */
  const nlForm = document.getElementById('nl-form');
  if (nlForm) {
    nlForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const emailInput = document.getElementById('nl-email');
      if (emailInput.value.trim() === '') {
        showToast('Please enter a valid email address');
        return;
      }
      showToast('Successfully subscribed to newsletter!');
      emailInput.value = '';
    });
  }

  // Smooth scroll logic for main navigation links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        const headerOffset = 80;
        const elementPosition = targetEl.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  /* ════════════════════════════════════════════════════════
     MAILER BOX CATALOG & SIDEBAR FILTER LOGIC
     ════════════════════════════════════════════════════════ */

  // Dynamic Product Catalog Configs Database
  const categoryConfigs = {
    'mailer-boxes': {
      categoryImage: 'images/mailer-boxes.png',
      title: 'Corrugated Mailer Boxes Collection | Box Care',
      breadcrumb: 'Mailer Boxes',
      heading: 'Mailer Boxes',
      subheading: 'Corrugated mailer boxes – direct from the manufacturer',
      desc1: 'Looking for a strong, courier-ready mailer box? As a mailer box manufacturer, Box Care makes corrugated mailer boxes that fold flat, lock without tape, and survive the journey to your customer. Buy plain or custom mailer boxes in popular e-commerce sizes, with wholesale pricing on bulk packs and a GST invoice on every order.',
      desc2: 'Our mailer box packaging suits D2C brands, apparel, beauty and subscription boxes - anywhere the unboxing matters. Choose natural kraft for an eco look or printed mailer boxes to put your brand on every parcel. Need a size we don\'t stock? We make custom mailer boxes to your dimensions and print.',
      cta: 'Order mailer boxes wholesale, factory direct, with same-day dispatch before 2 PM and free shipping across India. For bulk or custom mailer box quotes, message +91 78638 59919.',
      faqs: [
        { q: 'Do these mailer boxes require tape to assemble?', a: 'No! Our mailer boxes feature an interlocking flap design. They lock securely in place without tape or glue, creating a clean, high-end unboxing presentation for your customers.' },
        { q: 'Can we get custom printing on both sides?', a: 'Yes, we support double-sided printing (both inner and outer sides of the box) with full CMYK colours. Perfect for placing branding text inside the lid!' },
        { q: 'Are the dimensions inner or outer?', a: 'All dimensions listed refer to the internal usable space of the box. This ensures your products will fit perfectly inside. Add roughly 0.2 inches for external box measurements.' }
      ],
      products: [
        { id: 'mb-1', name: '3.30 X 2.75 X 1 Inch Mailer Box', length: 3.3, width: 2.75, height: 1.0, minPrice: 2.9, maxPrice: 5.9, discount: '-11%', rating: 5, reviews: 128, inStock: true, sales: 850, image: 'images/box_4_4_1_5.png' },
        { id: 'mb-2', name: '4 X 4 X 1.5 Inch Mailer Box', length: 4.0, width: 4.0, height: 1.5, minPrice: 4.3, maxPrice: 8.1, discount: '-13%', rating: 5, reviews: 94, inStock: true, sales: 740, image: 'images/box_4_4_1_5.png' },
        { id: 'mb-3', name: '4.60 X 3.70 X 1.60 Inch Mailer Box', length: 4.6, width: 3.7, height: 1.6, minPrice: 4.9, maxPrice: 8.8, discount: '-18%', rating: 5, reviews: 212, inStock: true, sales: 960, image: 'images/box_4_4_2.png' },
        { id: 'mb-4', name: '6 X 4 X 2 Inch Mailer Box', length: 6.0, width: 4.0, height: 2.0, minPrice: 6.59, maxPrice: 10.7, discount: '-11%', rating: 5, reviews: 57, inStock: true, sales: 610, image: 'images/box_6_4_2.png' },
        { id: 'mb-5', name: '5 X 3 X 2 Inch Mailer Box', length: 5.0, width: 3.0, height: 2.0, minPrice: 5.1, maxPrice: 9.3, discount: '-15%', rating: 4.8, reviews: 88, inStock: true, sales: 520, image: 'images/box_6_5_1_5.png' },
        { id: 'mb-6', name: '5.5 X 4 X 1.5 Inch Mailer Box', length: 5.5, width: 4.0, height: 1.5, minPrice: 5.8, maxPrice: 9.9, discount: '-12%', rating: 4.9, reviews: 76, inStock: true, sales: 490, image: 'images/box_6_5_1_5.png' },
        { id: 'mb-7', name: '6 X 6 X 3 Inch Mailer Box', length: 6.0, width: 6.0, height: 3.0, minPrice: 8.2, maxPrice: 14.5, discount: '-16%', rating: 4.7, reviews: 105, inStock: true, sales: 630, image: 'images/box_6_4_2.png' },
        { id: 'mb-8', name: '7 X 5 X 2 Inch Mailer Box', length: 7.0, width: 5.0, height: 2.0, minPrice: 7.5, maxPrice: 12.8, discount: '-14%', rating: 5, reviews: 62, inStock: true, sales: 410, image: 'images/box_6_5_1_5.png' },
        { id: 'mb-9', name: '8 X 5 X 3 Inch Mailer Box', length: 8.0, width: 5.0, height: 3.0, minPrice: 9.1, maxPrice: 16.2, discount: '-10%', rating: 4.9, reviews: 143, inStock: true, sales: 780, image: 'images/mailer-boxes.png' },
        { id: 'mb-10', name: '8 X 8 X 4 Inch Mailer Box', length: 8.0, width: 8.0, height: 4.0, minPrice: 11.5, maxPrice: 20.4, discount: '-17%', rating: 4.6, reviews: 59, inStock: true, sales: 330, image: 'images/box_6_4_2.png' },
        { id: 'mb-11', name: '9 X 6 X 3 Inch Mailer Box', length: 9.0, width: 6.0, height: 3.0, minPrice: 10.8, maxPrice: 18.9, discount: '-12%', rating: 4.8, reviews: 137, inStock: true, sales: 690, image: 'images/mailer-boxes.png' },
        { id: 'mb-12', name: '9 X 9 X 4 Inch Mailer Box', length: 9.0, width: 9.0, height: 4.0, minPrice: 13.2, maxPrice: 23.5, discount: '-15%', rating: 5, reviews: 82, inStock: true, sales: 510, image: 'images/box_4_4_2.png' },
        { id: 'mb-13', name: '10 X 6 X 4 Inch Mailer Box', length: 10.0, width: 6.0, height: 4.0, minPrice: 12.9, maxPrice: 22.8, discount: '-11%', rating: 4.7, reviews: 119, inStock: true, sales: 580, image: 'images/mailer-boxes.png' },
        { id: 'mb-14', name: '10 X 8 X 3 Inch Mailer Box', length: 10.0, width: 8.0, height: 3.0, minPrice: 13.5, maxPrice: 24.1, discount: '-13%', rating: 4.9, reviews: 41, inStock: true, sales: 360, image: 'images/box_6_5_1_5.png' },
        { id: 'mb-15', name: '10 X 10 X 4 Inch Mailer Box', length: 10.0, width: 10.0, height: 4.0, minPrice: 16.8, maxPrice: 29.5, discount: '-16%', rating: 5, reviews: 164, inStock: true, sales: 720, image: 'images/mailer-boxes.png' },
        { id: 'mb-16', name: '11 X 8.5 X 5.5 Inch Mailer Box', length: 11.0, width: 8.5, height: 5.5, minPrice: 18.5, maxPrice: 32.8, discount: '-10%', rating: 4.8, reviews: 73, inStock: true, sales: 430, image: 'images/box_6_4_2.png' },
        { id: 'mb-17', name: '12 X 10 X 4 Inch Mailer Box', length: 12.0, width: 10.0, height: 4.0, minPrice: 21.0, maxPrice: 36.5, discount: '-14%', rating: 5, reviews: 92, inStock: true, sales: 480, image: 'images/mailer-boxes.png' },
        { id: 'mb-18', name: '3 X 3 X 1 Inch Mailer Box', length: 3.0, width: 3.0, height: 1.0, minPrice: 2.5, maxPrice: 4.8, discount: '-8%', rating: 4.5, reviews: 18, inStock: false, sales: 110, image: 'images/box_4_4_1_5.png' },
        { id: 'mb-19', name: '6.5 X 4.5 X 2 Inch Mailer Box', length: 6.5, width: 4.5, height: 2.0, minPrice: 7.2, maxPrice: 11.9, discount: '-12%', rating: 4.6, reviews: 29, inStock: false, sales: 190, image: 'images/box_6_4_2.png' },
        { id: 'mb-20', name: '8 X 6 X 2 Inch Mailer Box', length: 8.0, width: 6.0, height: 2.0, minPrice: 8.9, maxPrice: 15.1, discount: '-11%', rating: 4.7, reviews: 34, inStock: false, sales: 220, image: 'images/box_6_5_1_5.png' }
      ]
    },
    'corrugated-boxes': {
      categoryImage: 'images/corrugated-boxes.png',
      title: 'Heavy Duty Corrugated Boxes | Box Care',
      breadcrumb: 'Corrugated Boxes',
      heading: 'Corrugated Boxes',
      subheading: 'Premium shipping cartons & cardboard boxes direct from manufacturer',
      desc1: 'Discover high-strength corrugated boxes designed to protect your goods during heavy logistics and transits. Ideal for industrial shipping, bulk warehousing, and logistics, our 3-ply and 5-ply cartons offer exceptional burst strength.',
      desc2: 'Customize your dimensions, paper grades, and printing options. Enjoy wholesale factory prices and same-day dispatch on stock sizes.',
      cta: 'Buy corrugated boxes direct with GST invoice and bulk discounts. For bulk custom carton requests, call +91 78638 59919.',
      faqs: [
        { q: 'What is the difference between 3-ply and 5-ply boxes?', a: '3-ply boxes feature three layers of paper (two liners and one inner fluting layer) suitable for items under 10 kg. 5-ply boxes have five layers (three liners and two flutings) suitable for heavier loads up to 25 kg.' },
        { q: 'Can I print my company logo on these shipping boxes?', a: 'Yes! We support custom screen printing and flexographic printing for company branding, product information, and handling instructions.' },
        { q: 'Are these boxes delivered flat?', a: 'Yes, all our cardboard boxes are shipped flat-packed to save storage space and shipping costs. They are very easy to assemble with standard packaging tape.' }
      ],
      products: [
        { id: 'cb-1', name: '8 X 8 X 8 Inch 3-Ply Box', length: 8.0, width: 8.0, height: 8.0, minPrice: 8.5, maxPrice: 14.2, discount: '-12%', rating: 4.7, reviews: 45, inStock: true, sales: 450, image: 'images/corrugated-boxes.png' },
        { id: 'cb-2', name: '10 X 10 X 10 Inch 3-Ply Box', length: 10.0, width: 10.0, height: 10.0, minPrice: 12.8, maxPrice: 19.5, discount: '-10%', rating: 4.8, reviews: 62, inStock: true, sales: 510, image: 'images/corrugated-boxes.png' },
        { id: 'cb-3', name: '12 X 9 X 9 Inch 3-Ply Box', length: 12.0, width: 9.0, height: 9.0, minPrice: 14.5, maxPrice: 22.0, discount: '-15%', rating: 5, reviews: 88, inStock: true, sales: 630, image: 'images/corrugated-boxes.png' },
        { id: 'cb-4', name: '14 X 10 X 10 Inch 5-Ply Box', length: 14.0, width: 10.0, height: 10.0, minPrice: 22.0, maxPrice: 34.0, discount: '-14%', rating: 4.9, reviews: 76, inStock: true, sales: 380, image: 'images/corrugated-boxes.png' },
        { id: 'cb-5', name: '16 X 12 X 12 Inch 5-Ply Box', length: 16.0, width: 12.0, height: 12.0, minPrice: 28.5, maxPrice: 42.0, discount: '-11%', rating: 4.6, reviews: 39, inStock: true, sales: 290, image: 'images/corrugated-boxes.png' },
        { id: 'cb-6', name: '18 X 18 X 18 Inch 5-Ply Box', length: 18.0, width: 18.0, height: 18.0, minPrice: 48.0, maxPrice: 65.0, discount: '-8%', rating: 4.5, reviews: 14, inStock: false, sales: 90, image: 'images/corrugated-boxes.png' }
      ]
    },
    'shipping-boxes': {
      categoryImage: 'images/shipping-boxes.png',
      title: 'Standard Shipping & Logistics Boxes | Box Care',
      breadcrumb: 'Shipping Boxes',
      heading: 'Shipping Boxes',
      subheading: 'Premium cardboard shipping cartons directly from the manufacturer',
      desc1: 'Designed for logistics, e-commerce fulfillment, and everyday mailing. Our standard shipping boxes are built to exact courier and postage limits, ensuring minimal shipping weight and volume.',
      desc2: 'With standard brown kraft outer look, these boxes are ready for fast-moving packing stations.',
      cta: 'Free shipping on orders above ₹2,000. Contact our team at hello@boxcare.in for bulk customs.',
      faqs: [
        { q: 'Are these sizes compliant with Amazon/Flipkart guidelines?', a: 'Yes, our shipping boxes conform to the standard size classes used by top e-commerce platforms and courier networks (DHL, BlueDart, FedEx).' },
        { q: 'Is there a minimum order quantity (MOQ)?', a: 'Our MOQ is as low as 50 boxes for standard stock sizes, making it perfect for startups and small e-commerce sellers.' }
      ],
      products: [
        { id: 'sb-1', name: '6 X 6 X 6 Inch Shipping Box', length: 6.0, width: 6.0, height: 6.0, minPrice: 5.5, maxPrice: 9.8, discount: '-10%', rating: 4.8, reviews: 31, inStock: true, sales: 310, image: 'images/shipping-boxes.png' },
        { id: 'sb-2', name: '9 X 6 X 6 Inch Shipping Box', length: 9.0, width: 6.0, height: 6.0, minPrice: 8.9, maxPrice: 14.5, discount: '-13%', rating: 4.7, reviews: 54, inStock: true, sales: 420, image: 'images/shipping-boxes.png' },
        { id: 'sb-3', name: '12 X 10 X 8 Inch Shipping Box', length: 12.0, width: 10.0, height: 8.0, minPrice: 15.6, maxPrice: 24.8, discount: '-11%', rating: 5, reviews: 73, inStock: true, sales: 580, image: 'images/shipping-boxes.png' },
        { id: 'sb-4', name: '15 X 12 X 10 Inch Shipping Box', length: 15.0, width: 12.0, height: 10.0, minPrice: 23.5, maxPrice: 36.0, discount: '-15%', rating: 4.6, reviews: 29, inStock: true, sales: 210, image: 'images/shipping-boxes.png' },
        { id: 'sb-5', name: '20 X 15 X 12 Inch Shipping Box', length: 20.0, width: 15.0, height: 12.0, minPrice: 38.0, maxPrice: 54.0, discount: '-12%', rating: 4.9, reviews: 42, inStock: false, sales: 130, image: 'images/shipping-boxes.png' }
      ]
    },
    'pizza-boxes': {
      categoryImage: 'images/pizza-boxes.png',
      title: 'Premium Corrugated Pizza Boxes | Box Care',
      breadcrumb: 'Pizza Boxes',
      heading: 'Pizza Boxes',
      subheading: 'Ventilated, heat-retaining food-grade pizza boxes',
      desc1: 'Keep your pizzas fresh, hot, and crispy during home delivery. Our pizza boxes are made from certified food-grade, odor-free virgin kraft paper, featuring ventilation holes to prevent steam condensation.',
      desc2: 'Sturdy design prevents top-box collapse when stacked in delivery bags.',
      cta: 'Bulk order food packaging with customized prints. For custom print queries, text +91 78638 59919.',
      faqs: [
        { q: 'Are these pizza boxes certified food-safe?', a: 'Yes! We use 100% food-grade virgin paper and FDA-approved starch adhesive. Our boxes do not transfer chemicals or odors to the food.' },
        { q: 'Can I print my restaurant logo and details?', a: 'Absolutely. We offer high-definition flexographic printing using eco-friendly water-based inks in up to 3 colors.' }
      ],
      products: [
        { id: 'pb-1', name: '7 Inch Pizza Box', length: 7.0, width: 7.0, height: 1.5, minPrice: 4.5, maxPrice: 8.2, discount: '-15%', rating: 4.8, reviews: 112, inStock: true, sales: 940, image: 'images/pizza-boxes.png' },
        { id: 'pb-2', name: '8 Inch Pizza Box', length: 8.0, width: 8.0, height: 1.5, minPrice: 5.2, maxPrice: 9.5, discount: '-12%', rating: 4.9, reviews: 140, inStock: true, sales: 880, image: 'images/pizza-boxes.png' },
        { id: 'pb-3', name: '9 Inch Pizza Box', length: 9.0, width: 9.0, height: 1.5, minPrice: 6.5, maxPrice: 11.0, discount: '-10%', rating: 5, reviews: 215, inStock: true, sales: 1200, image: 'images/pizza-boxes.png' },
        { id: 'pb-4', name: '10 Inch Pizza Box', length: 10.0, width: 10.0, height: 1.75, minPrice: 8.2, maxPrice: 13.8, discount: '-16%', rating: 4.7, reviews: 93, inStock: true, sales: 710, image: 'images/pizza-boxes.png' },
        { id: 'pb-5', name: '12 Inch Pizza Box', length: 12.0, width: 12.0, height: 1.75, minPrice: 11.5, maxPrice: 18.5, discount: '-14%', rating: 4.8, reviews: 84, inStock: true, sales: 650, image: 'images/pizza-boxes.png' },
        { id: 'pb-6', name: '14 Inch Pizza Box', length: 14.0, width: 14.0, height: 2.0, minPrice: 16.0, maxPrice: 24.5, discount: '-11%', rating: 4.6, reviews: 36, inStock: false, sales: 180, image: 'images/pizza-boxes.png' }
      ]
    },
    'mono-cartons': {
      categoryImage: 'images/mono-cartons.png',
      title: 'Cosmetic & Product Mono Cartons | Box Care',
      breadcrumb: 'Mono Cartons',
      heading: 'Mono Cartons',
      subheading: 'Premium single-ply paperboard packaging sleeves & cosmetic cartons',
      desc1: 'Elevate your retail shelf presence with custom mono cartons. Made from premium SBS duplex board, they are perfect for cosmetics, perfumes, pharma products, electronics, and specialty foods.',
      desc2: 'Supports premium finishing techniques such as spot UV, hot foil stamping, and matte/gloss lamination.',
      cta: 'Request physical paperboard material samples directly via hello@boxcare.in.',
      faqs: [
        { q: 'What paper grades do you use for retail cartons?', a: 'We use high-grade Solid Bleached Sulfate (SBS), folding boxboard (FBB), and white-back duplex boards ranging from 250 GSM to 400 GSM.' },
        { q: 'Can you match exact Pantone colors?', a: 'Yes! We use industrial Heidelberg offset presses to match precise brand spot colors and Pantone color matching systems.' }
      ],
      products: [
        { id: 'mc-1', name: 'Cosmetic Carton 2.5 X 2.5 X 4 Inch', length: 2.5, width: 2.5, height: 4.0, minPrice: 1.9, maxPrice: 4.5, discount: '-15%', rating: 4.9, reviews: 88, inStock: true, sales: 1200, image: 'images/mono-cartons.png' },
        { id: 'mc-2', name: 'Perfume Box 3 X 3 X 5 Inch', length: 3.0, width: 3.0, height: 5.0, minPrice: 2.8, maxPrice: 5.9, discount: '-12%', rating: 5, reviews: 76, inStock: true, sales: 940, image: 'images/mono-cartons.png' },
        { id: 'mc-3', name: 'Medicine Box 4 X 2 X 2 Inch', length: 4.0, width: 2.0, height: 2.0, minPrice: 0.9, maxPrice: 2.5, discount: '-20%', rating: 4.8, reviews: 142, inStock: true, sales: 2500, image: 'images/mono-cartons.png' },
        { id: 'mc-4', name: 'Electronics Card Sleeve 6 X 4 X 1 Inch', length: 6.0, width: 4.0, height: 1.0, minPrice: 3.5, maxPrice: 7.2, discount: '-10%', rating: 4.7, reviews: 54, inStock: true, sales: 600, image: 'images/mono-cartons.png' }
      ]
    },
    'courier-bags': {
      categoryImage: 'images/courier-bags.png',
      title: 'Tamper Evident Courier Poly Bags | Box Care',
      breadcrumb: 'Courier Bags',
      heading: 'Courier Bags',
      subheading: 'Premium self-adhesive tamper-proof courier mailers & poly bags',
      desc1: 'Secure your clothing and soft-goods logistics with tamper-evident courier bags. Featuring hot-melt adhesive flaps that cannot be opened without tearing, these bags prevent pilferage during transport.',
      desc2: 'Includes POD transparent jacket sleeve on the back for shipping labels and invoices.',
      cta: 'Buy high-strength LDPE mailing bags wholesale. Bulk inquiries: message +91 78638 59919.',
      faqs: [
        { q: 'What is a POD jacket courier bag?', a: 'A POD jacket is a clear plastic pocket on the back of the envelope. You can easily slip shipping documents, invoices, and shipping labels inside.' },
        { q: 'Are these bags stretchable and tear resistant?', a: 'Yes! They are made from co-extruded multi-layer LDPE plastic film (usually 50 to 60 microns thick), which makes them extremely stretchable and puncture-proof.' }
      ],
      products: [
        { id: 'bg-1', name: '8 X 10 Inch Courier Bag (No POD)', length: 8.0, width: 10.0, height: 0.1, minPrice: 1.2, maxPrice: 2.5, discount: '-10%', rating: 4.7, reviews: 143, inStock: true, sales: 3400, image: 'images/courier-bags.png' },
        { id: 'bg-2', name: '10 X 12 Inch Courier Bag with POD', length: 10.0, width: 12.0, height: 0.1, minPrice: 1.9, maxPrice: 3.8, discount: '-15%', rating: 4.8, reviews: 204, inStock: true, sales: 4100, image: 'images/courier-bags.png' },
        { id: 'bg-3', name: '12 X 16 Inch Courier Bag with POD', length: 12.0, width: 16.0, height: 0.1, minPrice: 2.8, maxPrice: 5.5, discount: '-12%', rating: 4.9, reviews: 189, inStock: true, sales: 2900, image: 'images/courier-bags.png' },
        { id: 'bg-4', name: '14 X 18 Inch Courier Bag with POD', length: 14.0, width: 18.0, height: 0.1, minPrice: 3.9, maxPrice: 7.2, discount: '-11%', rating: 5, reviews: 92, inStock: true, sales: 1500, image: 'images/courier-bags.png' },
        { id: 'bg-5', name: '19 X 24 Inch Courier Bag with POD', length: 19.0, width: 24.0, height: 0.1, minPrice: 6.5, maxPrice: 11.5, discount: '-8%', rating: 4.6, reviews: 41, inStock: false, sales: 850, image: 'images/courier-bags.png' }
      ]
    },
    'paper-bags': {
      categoryImage: 'images/paper-bags.png',
      title: 'Eco-Friendly Kraft Paper Bags | Box Care',
      breadcrumb: 'Paper Bags',
      heading: 'Paper Bags',
      subheading: 'Premium twisted handle brown & white kraft paper bags',
      desc1: 'Elevate your retail brand with zero-plastic packaging. Made from strong biodegradable kraft paper, our bags feature twisted paper handles and reinforced bottoms to hold heavy products.',
      desc2: 'Perfect for retail outlets, gift shops, clothing brands, and bakery deliveries.',
      cta: 'Free shipping on orders above ₹2,000 across India. Customized offset printing available.',
      faqs: [
        { q: 'How much weight can these paper bags carry?', a: 'Depending on size, our twisted handle kraft paper bags can safely support weights between 3 kg and 7 kg due to their high-tensile base adhesive.' },
        { q: 'Are these bags biodegradable?', a: 'Yes! They are made from 100% recycled paper and organic vegetable glue, making them completely compostable and eco-friendly.' }
      ],
      products: [
        { id: 'pg-1', name: 'Small 6 X 3 X 8 Inch Kraft Bag', length: 6.0, width: 3.0, height: 8.0, minPrice: 6.5, maxPrice: 11.2, discount: '-12%', rating: 4.8, reviews: 88, inStock: true, sales: 940, image: 'images/paper-bags.png' },
        { id: 'pg-2', name: 'Medium 8 X 4 X 10 Inch Kraft Bag', length: 8.0, width: 4.0, height: 10.0, minPrice: 9.8, maxPrice: 15.5, discount: '-15%', rating: 4.9, reviews: 115, inStock: true, sales: 1300, image: 'images/paper-bags.png' },
        { id: 'pg-3', name: 'Large 11 X 5 X 14 Inch Kraft Bag', length: 11.0, width: 5.0, height: 14.0, minPrice: 14.5, maxPrice: 22.8, discount: '-10%', rating: 5, reviews: 167, inStock: true, sales: 1500, image: 'images/paper-bags.png' },
        { id: 'pg-4', name: 'Medium White 8 X 4 X 10 Inch Kraft Bag', length: 8.0, width: 4.0, height: 10.0, minPrice: 11.5, maxPrice: 18.0, discount: '-11%', rating: 4.7, reviews: 62, inStock: true, sales: 850, image: 'images/paper-bags.png' }
      ]
    },
    'tape-rolls': {
      categoryImage: 'images/tape-rolls.png',
      title: 'BOPP Adhesive Packaging Tapes | Box Care',
      breadcrumb: 'Tape Rolls',
      heading: 'Tape Rolls',
      subheading: 'Premium high-tack acrylic adhesive packaging tapes',
      desc1: 'Seal your cartons with confidence. Our BOPP tapes feature premium high-tack acrylic adhesive layers that resist peeling, moisture, and extremes of Indian weather.',
      desc2: 'Perfect for manual packaging stations and automatic box sealing machines.',
      cta: 'Stock sizes available for same-day dispatch before 2 PM. For bulk roll discounts, email sales@boxcare.in.',
      faqs: [
        { q: 'What is BOPP tape?', a: 'BOPP stands for Biaxially Oriented Polypropylene. It is a highly durable and strong plastic backing material coated with a specialized high-adhesion adhesive layer.' },
        { q: 'Can I print my brand name or caution text on the tape?', a: 'Yes! We manufacture custom logo-printed tapes with warnings like "FRAGILE" or "DO NOT ACCEPT IF SEAL BROKEN" in up to 2 colors.' }
      ],
      products: [
        { id: 'tp-1', name: '2 Inch Brown Tape (65m Roll)', length: 65.0, width: 2.0, height: 2.0, minPrice: 32.0, maxPrice: 48.0, discount: '-10%', rating: 4.8, reviews: 210, inStock: true, sales: 2500, image: 'images/tape-rolls.png' },
        { id: 'tp-2', name: '2 Inch Transparent Tape (65m Roll)', length: 65.0, width: 2.0, height: 2.0, minPrice: 32.0, maxPrice: 48.0, discount: '-10%', rating: 4.9, reviews: 174, inStock: true, sales: 2200, image: 'images/tape-rolls.png' },
        { id: 'tp-3', name: '3 Inch Brown Heavy Tape (65m Roll)', length: 65.0, width: 3.0, height: 3.0, minPrice: 48.0, maxPrice: 68.0, discount: '-15%', rating: 4.7, reviews: 88, inStock: true, sales: 1100, image: 'images/tape-rolls.png' },
        { id: 'tp-4', name: 'Fragile Printed Tape 2 Inch (65m Roll)', length: 65.0, width: 2.0, height: 2.0, minPrice: 42.0, maxPrice: 58.0, discount: '-12%', rating: 5, reviews: 104, inStock: true, sales: 1400, image: 'images/tape-rolls.png' }
      ]
    },
    'bubble-wrap': {
      categoryImage: 'images/bubble-wrap.png',
      title: 'Premium Protective Bubble Wrap | Box Care',
      breadcrumb: 'Bubble Wrap',
      heading: 'Bubble Wrap',
      subheading: 'High-cushioning protective bubble rolls & packing material',
      desc1: 'Wrap fragile items, electronics, and glassware in high-cushion air bubble packaging. Our bubble sheets have resilient air pockets that absorb shocks and vibration during courier handling.',
      desc2: 'Soft, clean, dust-free packaging protective wrap.',
      cta: 'Free shipping on orders above ₹2,000 across India. MOQ: 1 roll.',
      faqs: [
        { q: 'What GSM values do your bubble wrap rolls have?', a: 'Our standard protective bubble rolls range from 40 GSM (light protective cushion) to 80 GSM (heavy duty thick bubbles for exports).' },
        { q: 'Is this wrap recyclable?', a: 'Yes! Our bubble wrap rolls are made from 100% low-density polyethylene (LDPE) which can be recycled easily.' }
      ],
      products: [
        { id: 'bw-1', name: '10m Bubble Wrap Roll (1m Width)', length: 10.0, width: 39.0, height: 4.0, minPrice: 95.0, maxPrice: 150.0, discount: '-15%', rating: 4.8, reviews: 54, inStock: true, sales: 480, image: 'images/bubble-wrap.png' },
        { id: 'bw-2', name: '20m Bubble Wrap Roll (1m Width)', length: 20.0, width: 39.0, height: 8.0, minPrice: 175.0, maxPrice: 280.0, discount: '-12%', rating: 4.9, reviews: 92, inStock: true, sales: 610, image: 'images/bubble-wrap.png' },
        { id: 'bw-3', name: '50m Bulk Bubble Wrap Roll (1m Width)', length: 50.0, width: 39.0, height: 18.0, minPrice: 380.0, maxPrice: 550.0, discount: '-18%', rating: 5, reviews: 137, inStock: true, sales: 850, image: 'images/bubble-wrap.png' }
      ]
    },
    'corrugated-rolls': {
      categoryImage: 'images/corrugated-rolls.png',
      title: 'Protective Corrugated Paper Rolls | Box Care',
      breadcrumb: 'Corrugated Rolls',
      heading: 'Corrugated Rolls',
      subheading: 'High-strength flexible corrugated cardboard wrapping rolls',
      desc1: 'Flexible wrapping sheet made from premium corrugated fluted paper. Perfect for wrapping industrial parts, metal rods, wooden furniture legs, and odd-shaped heavy items before warehousing.',
      desc2: 'High shock absorbance with eco-friendly biodegradable composition.',
      cta: 'Buy corrugated wrapping rolls wholesale. Custom width rolls available.',
      faqs: [
        { q: 'What is the fluting type on your corrugated rolls?', a: 'We use high-cushion "C-flute" corrugated rolls made from 120 GSM fluting paper for optimal packing flex and cushion.' }
      ],
      products: [
        { id: 'cr-1', name: '10m Corrugated Paper Roll (3ft Width)', length: 10.0, width: 36.0, height: 12.0, minPrice: 120.0, maxPrice: 180.0, discount: '-10%', rating: 4.7, reviews: 34, inStock: true, sales: 290, image: 'images/corrugated-rolls.png' },
        { id: 'cr-2', name: '20m Corrugated Paper Roll (3ft Width)', length: 20.0, width: 36.0, height: 24.0, minPrice: 220.0, maxPrice: 320.0, discount: '-15%', rating: 4.8, reviews: 59, inStock: true, sales: 430, image: 'images/corrugated-rolls.png' },
        { id: 'cr-3', name: '50m Corrugated Paper Roll (3ft Width)', length: 50.0, width: 36.0, height: 50.0, minPrice: 490.0, maxPrice: 680.0, discount: '-12%', rating: 5, reviews: 104, inStock: true, sales: 580, image: 'images/corrugated-rolls.png' }
      ]
    },
    'corrugated-sheets': {
      categoryImage: 'images/corrugated-sheets.png',
      title: 'Sturdy Corrugated Cardboard Sheets | Box Care',
      breadcrumb: 'Corrugated Sheets',
      heading: 'Corrugated Sheets',
      subheading: 'Premium cardboard separation sheets & partitions',
      desc1: 'Provide strong layered support inside standard shipping cartons. Use corrugated flat sheets to separate rows of products, add vertical stack strength, or prevent item sliding.',
      desc2: 'Available in 3-ply and 5-ply construction in various standardized layout dimensions.',
      cta: 'Free shipping on orders above ₹2,000 across India.',
      faqs: [
        { q: 'What can I use these cardboard sheets for?', a: 'They are perfect for layered partitions, photo backing, heavy envelope stiffness, crafting, and adding flat buffers inside larger cartons.' }
      ],
      products: [
        { id: 'cs-1', name: 'A4 Size Cardboard Sheets (Pack of 50)', length: 11.7, width: 8.3, height: 0.15, minPrice: 110.0, maxPrice: 180.0, discount: '-15%', rating: 4.9, reviews: 76, inStock: true, sales: 820, image: 'images/corrugated-sheets.png' },
        { id: 'cs-2', name: '12 X 12 Inch Square Sheets (Pack of 50)', length: 12.0, width: 12.0, height: 0.15, minPrice: 180.0, maxPrice: 290.0, discount: '-12%', rating: 4.8, reviews: 52, inStock: true, sales: 610, image: 'images/corrugated-sheets.png' },
        { id: 'cs-3', name: '24 X 36 Inch Large Sheets (Pack of 20)', length: 36.0, width: 24.0, height: 0.15, minPrice: 320.0, maxPrice: 480.0, discount: '-10%', rating: 5, reviews: 68, inStock: true, sales: 430, image: 'images/corrugated-sheets.png' }
      ]
    },
    'custom-printed-boxes': {
      categoryImage: 'images/custom-printed-boxes.png',
      title: 'Custom Branded Packaging Boxes | Box Care',
      breadcrumb: 'Custom Printed Boxes',
      heading: 'Custom Printed Boxes',
      subheading: 'Premium logo-printed custom packaging direct from manufacturer',
      desc1: 'Transform your unpacking experience into a powerful branding tool. We print high-quality custom boxes with your logo, social handles, or artwork on premium corrugated box types.',
      desc2: 'Supports eco-friendly kraft looks or full double-sided multi-color offset prints.',
      cta: 'Contact our product design team for digital mockups. Whatsapp +91 78638 59919.',
      faqs: [
        { q: 'What is the setup time for custom plates?', a: 'Custom printing plate setup takes 2 to 3 working days. Once approved, typical bulk print production runs take 5 to 7 days.' },
        { q: 'Do you offer design support?', a: 'Yes! Our packaging engineers provide free dieline layouts and template placement assistance to ensure your artwork prints perfectly.' }
      ],
      products: [
        { id: 'cp-1', name: 'Custom Printed Mailer 6 X 4 X 2 Inch', length: 6.0, width: 4.0, height: 2.0, minPrice: 8.5, maxPrice: 14.5, discount: '-10%', rating: 5, reviews: 104, inStock: true, sales: 1500, image: 'images/custom-printed-boxes.png' },
        { id: 'cp-2', name: 'Custom Printed Mailer 8 X 6 X 3 Inch', length: 8.0, width: 6.0, height: 3.0, minPrice: 12.0, maxPrice: 19.5, discount: '-12%', rating: 4.9, reviews: 128, inStock: true, sales: 2100, image: 'images/custom-printed-boxes.png' },
        { id: 'cp-3', name: 'Custom Logo Carton 10 X 10 X 10 Inch', length: 10.0, width: 10.0, height: 10.0, minPrice: 18.0, maxPrice: 28.5, discount: '-15%', rating: 4.8, reviews: 92, inStock: true, sales: 1300, image: 'images/custom-printed-boxes.png' }
      ]
    }
  };

  // Top-level dynamic data
  let dynamicProducts = [];

  // Helper function to extract active category from URL parameters dynamically with sessionStorage persistence
  function getActiveCategory() {
    const urlParams = new URLSearchParams(window.location.search);
    const param = urlParams.get('type') || urlParams.get('category') || urlParams.get('slug');
    if (param && categoryConfigs[param]) {
      try { sessionStorage.setItem('boxcare_active_category', param); } catch (e) {}
      return param;
    }
    if (param) {
      const lower = param.toLowerCase();
      for (const key in categoryConfigs) {
        if (key.includes(lower) || lower.includes(key)) {
          try { sessionStorage.setItem('boxcare_active_category', key); } catch (e) {}
          return key;
        }
      }
    }
    try {
      const saved = sessionStorage.getItem('boxcare_active_category');
      if (saved && categoryConfigs[saved]) {
        return saved;
      }
    } catch (e) {}
    return 'mailer-boxes';
  }

  // Intercept category link clicks to pre-save category to sessionStorage before navigation
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a');
    if (link && link.href) {
      try {
        const url = new URL(link.href, window.location.origin);
        const type = url.searchParams.get('type') || url.searchParams.get('category');
        if (type && categoryConfigs[type]) {
          sessionStorage.setItem('boxcare_active_category', type);
        }
      } catch (err) {}
    }
  });

  // Active category mapping
  let activeCategory = getActiveCategory();

  // Dynamic vector SVG generators based on category types
  function getBoxSvg(length, width, height, id) {
    return `
      <svg class="box-illustration-svg" viewBox="0 0 200 180" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="box-top-${id}" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#D4A58A"/>
            <stop offset="100%" stop-color="#B88464"/>
          </linearGradient>
          <linearGradient id="box-front-${id}" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#9B6E50"/>
            <stop offset="100%" stop-color="#6B452D"/>
          </linearGradient>
          <linearGradient id="box-side-${id}" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stop-color="#6B452D"/>
            <stop offset="100%" stop-color="#4A2E1A"/>
          </linearGradient>
          <filter id="box-sh-${id}" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="8" stdDeviation="6" flood-color="rgba(43,35,15,0.18)"/>
          </filter>
        </defs>
        <g filter="url(#box-sh-${id})">
          <polygon points="40,82 120,82 145,62 65,62" fill="url(#box-top-${id})" />
          <polygon points="40,82 120,82 120,132 40,132" fill="url(#box-front-${id})" />
          <polygon points="120,82 145,62 145,112 120,132" fill="url(#box-side-${id})" />
          <line x1="40" y1="102" x2="120" y2="102" stroke="rgba(0,0,0,0.08)" stroke-width="1.2"/>
        </g>
        <g stroke="var(--charcoal-lt)" stroke-width="1" opacity="0.75">
          <line x1="38" y1="142" x2="118" y2="142" stroke-dasharray="1.5 2"/>
          <path d="M38,142 l4,-2 m-4,2 l4,2 M118,142 l-4,-2 m4,2 l-4,2" fill="none"/>
          <line x1="125" y1="139" x2="148" y2="121" stroke-dasharray="1.5 2"/>
          <path d="M125,139 l2,-4 m-2,4 l4,-1 M148,121 l-2,4 m2,-4 l-4,1" fill="none"/>
          <line x1="28" y1="82" x2="28" y2="132" stroke-dasharray="1.5 2"/>
          <path d="M28,82 l-2,4 m2,-4 l2,4 M28,132 l-2,-4 m2,4 l2,-4" fill="none"/>
        </g>
        <text x="78" y="154" fill="var(--charcoal)" font-family="var(--font-body)" font-size="9.5" font-weight="700" text-anchor="middle">${length}″ L</text>
        <text x="142" y="137" fill="var(--charcoal)" font-family="var(--font-body)" font-size="9.5" font-weight="700" text-anchor="start">${width}″ W</text>
        <text x="21" y="111" fill="var(--charcoal)" font-family="var(--font-body)" font-size="9.5" font-weight="700" text-anchor="end">${height}″ H</text>
      </svg>
    `;
  }

  function getPaperBagSvg(length, width, height, id) {
    return `
      <svg class="box-illustration-svg" viewBox="0 0 200 180" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="bag-grad-${id}" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#E2B18E"/>
            <stop offset="100%" stop-color="#C5936E"/>
          </linearGradient>
          <filter id="bag-sh-${id}">
            <feDropShadow dx="0" dy="8" stdDeviation="5" flood-color="rgba(43,35,15,0.15)"/>
          </filter>
        </defs>
        <g filter="url(#bag-sh-${id})">
          <path d="M60,55 L140,55 L130,135 L70,135 Z" fill="url(#bag-grad-${id})" />
          <path d="M60,55 L75,55 L82,135 L70,135 Z" fill="#A47250" opacity="0.3"/>
          <path d="M75,55 L125,55 L115,135 L85,135 Z" fill="none" stroke="rgba(255,255,255,0.2)" stroke-width="1"/>
          <path d="M85,55 C85,32 100,32 100,55" stroke="#8B5E3C" stroke-width="3" stroke-linecap="round" fill="none" />
          <path d="M100,55 C100,32 115,32 115,55" stroke="#8B5E3C" stroke-width="3" stroke-linecap="round" fill="none" />
        </g>
        <text x="100" y="152" fill="var(--charcoal)" font-family="var(--font-body)" font-size="9.5" font-weight="700" text-anchor="middle">${length}″ × ${width}″ × ${height}″</text>
      </svg>
    `;
  }

  function getTapeRollSvg(width, length, id) {
    return `
      <svg class="box-illustration-svg" viewBox="0 0 200 180" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="tape-grad-${id}" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#E2B18E"/>
            <stop offset="50%" stop-color="#C5936E"/>
            <stop offset="100%" stop-color="#8B5E3C"/>
          </linearGradient>
          <filter id="tape-sh-${id}">
            <feDropShadow dx="0" dy="6" stdDeviation="5" flood-color="rgba(43,35,15,0.15)"/>
          </filter>
        </defs>
        <g filter="url(#tape-sh-${id})">
          <ellipse cx="100" cy="85" rx="55" ry="32" fill="url(#tape-grad-${id})" />
          <ellipse cx="100" cy="85" rx="28" ry="16" fill="#F3E9DD" stroke="#8B5E3C" stroke-width="1.5" />
          <ellipse cx="100" cy="85" rx="14" ry="8" fill="#8B5E3C" opacity="0.8" />
          <ellipse cx="100" cy="85" rx="50" ry="29" fill="none" stroke="rgba(255,255,255,0.25)" stroke-width="0.75" />
          <ellipse cx="100" cy="85" rx="45" ry="26" fill="none" stroke="rgba(255,255,255,0.2)" stroke-width="0.75" />
          <ellipse cx="100" cy="85" rx="40" ry="23" fill="none" stroke="rgba(255,255,255,0.15)" stroke-width="0.75" />
        </g>
        <text x="100" y="142" fill="var(--charcoal)" font-family="var(--font-body)" font-size="9.5" font-weight="700" text-anchor="middle">${width} Inch × ${length}m</text>
      </svg>
    `;
  }

  function getCourierBagSvg(length, width, id) {
    return `
      <svg class="box-illustration-svg" viewBox="0 0 200 180" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="bag-grad-${id}" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#F9F9FB"/>
            <stop offset="100%" stop-color="#E2E3E8"/>
          </linearGradient>
          <filter id="bag-sh-${id}">
            <feDropShadow dx="0" dy="6" stdDeviation="4" flood-color="rgba(0,0,0,0.08)"/>
          </filter>
        </defs>
        <g filter="url(#bag-sh-${id})">
          <rect x="55" y="45" width="90" height="90" rx="5" fill="url(#bag-grad-${id})" stroke="#D1D5DB" stroke-width="1" />
          <rect x="55" y="45" width="90" height="18" rx="1" fill="#374151" opacity="0.9" />
          <line x1="55" y1="72" x2="145" y2="72" stroke="#9CA3AF" stroke-width="1" stroke-dasharray="3 3"/>
          <rect x="65" y="82" width="70" height="35" rx="2" fill="rgba(255,255,255,0.7)" stroke="#E5E7EB" stroke-width="1" />
          <line x1="75" y1="92" x2="125" y2="92" stroke="#9CA3AF" stroke-width="1" opacity="0.6"/>
          <line x1="75" y1="102" x2="115" y2="102" stroke="#9CA3AF" stroke-width="1" opacity="0.4"/>
        </g>
        <text x="100" y="152" fill="var(--charcoal)" font-family="var(--font-body)" font-size="9.5" font-weight="700" text-anchor="middle">${length}″ × ${width}″</text>
      </svg>
    `;
  }

  function getRollSvg(length, details, id) {
    return `
      <svg class="box-illustration-svg" viewBox="0 0 200 180" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="roll-grad-${id}" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#E2B18E"/>
            <stop offset="100%" stop-color="#C5936E"/>
          </linearGradient>
          <filter id="roll-sh-${id}">
            <feDropShadow dx="0" dy="6" stdDeviation="5" flood-color="rgba(43,35,15,0.15)"/>
          </filter>
        </defs>
        <g filter="url(#roll-sh-${id})">
          <rect x="45" y="65" width="110" height="50" rx="10" fill="url(#roll-grad-${id})" />
          <ellipse cx="155" cy="90" rx="10" ry="25" fill="#8B5E3C" />
          <ellipse cx="155" cy="90" rx="3" ry="8" fill="#5C3A20" />
          <path d="M75,65 L75,115 M105,65 L105,115 M135,65 L135,115" stroke="rgba(255,255,255,0.2)" stroke-width="1"/>
        </g>
        <text x="100" y="142" fill="var(--charcoal)" font-family="var(--font-body)" font-size="9.5" font-weight="700" text-anchor="middle">${length} ${details}</text>
      </svg>
    `;
  }

  function getProductSvg(p, category) {
    if (category === 'paper-bags') {
      return getPaperBagSvg(p.length, p.width, p.height, p.id);
    } else if (category === 'tape-rolls') {
      return getTapeRollSvg(p.width, p.length, p.id);
    } else if (category === 'courier-bags') {
      return getCourierBagSvg(p.length, p.width, p.id);
    } else if (category === 'bubble-wrap' || category === 'corrugated-rolls') {
      return getRollSvg(p.length, category === 'bubble-wrap' ? 'm Bubble' : 'm Roll', p.id);
    } else {
      return getBoxSvg(p.length, p.width, p.height, p.id);
    }
  }

  // Generate dynamic sidebar filters based on active category products
  function renderSidebarFilters() {
    const container = document.getElementById('dynamic-filters-container');
    if (!container) return;

    const products = categoryConfigs[activeCategory]?.products || [];
    if (products.length === 0) return;

    // Get unique lengths and widths
    const uniqueLengths = [...new Set(products.map(p => p.length))].sort((a, b) => a - b);
    const uniqueWidths = [...new Set(products.map(p => p.width))].sort((a, b) => a - b);

    // Calculate item counts for each filter
    const lengthCounts = {};
    const widthCounts = {};
    products.forEach(p => {
      lengthCounts[p.length] = (lengthCounts[p.length] || 0) + 1;
      widthCounts[p.width] = (widthCounts[p.width] || 0) + 1;
    });

    let lengthHtml = '';
    uniqueLengths.forEach((len, idx) => {
      const isHidden = idx >= 6;
      lengthHtml += `
        <label class="filter-item ${isHidden ? 'length-hidden' : ''}" style="${isHidden ? 'display:none' : ''}">
          <input type="checkbox" class="filter-length" value="${len}" />
          <span>${len}″</span>
          <span class="count">(${lengthCounts[len]})</span>
        </label>
      `;
    });

    if (uniqueLengths.length > 6) {
      lengthHtml += `
        <a href="#" class="show-all-btn" id="length-show-all" data-expanded="false">
          Show all <i data-lucide="chevron-down" style="width:13px; height:13px"></i>
        </a>
      `;
    }

    let widthHtml = '';
    uniqueWidths.forEach(w => {
      widthHtml += `
        <label class="filter-item">
          <input type="checkbox" class="filter-width" value="${w}" />
          <span>${w}″</span>
          <span class="count">(${widthCounts[w]})</span>
        </label>
      `;
    });

    container.innerHTML = `
      <div class="filter-group">
        <h4 class="filter-title">Length / Size</h4>
        <div class="filter-list">
          ${lengthHtml}
        </div>
      </div>
      <div class="filter-group">
        <h4 class="filter-title">Width / Base</h4>
        <div class="filter-list">
          ${widthHtml}
        </div>
      </div>
    `;

    // Bind event listeners to new checkboxes
    container.querySelectorAll('.filter-length, .filter-width').forEach(cb => {
      cb.addEventListener('change', filterAndRender);
    });

    // Length list expand trigger
    const lengthShowAll = document.getElementById('length-show-all');
    if (lengthShowAll) {
      lengthShowAll.addEventListener('click', (e) => {
        e.preventDefault();
        const hiddenItems = container.querySelectorAll('.filter-item.length-hidden');
        const isExpanded = lengthShowAll.getAttribute('data-expanded') === 'true';
        
        hiddenItems.forEach(item => {
          item.style.display = isExpanded ? 'none' : 'flex';
        });
        
        lengthShowAll.setAttribute('data-expanded', !isExpanded);
        lengthShowAll.innerHTML = isExpanded ? 'Show all <i data-lucide="chevron-down"></i>' : 'Show less <i data-lucide="chevron-up"></i>';
        if (window.lucide) window.lucide.createIcons();
      });
    }

    if (window.lucide) window.lucide.createIcons();
  }

  // Initialize Price Range bounds for slider dynamically
  function initPriceSlider(products) {
    if (!products || products.length === 0) return;
    const minPrices = products.map(p => p.minPrice);
    const maxPrices = products.map(p => p.maxPrice);
    const minBound = Math.floor(Math.min(...minPrices));
    const maxBound = Math.ceil(Math.max(...maxPrices));

    const priceMin = document.getElementById('price-min');
    const priceMax = document.getElementById('price-max');
    const priceInputMin = document.getElementById('price-input-min');
    const priceInputMax = document.getElementById('price-input-max');

    if (priceMin && priceMax && priceInputMin && priceInputMax) {
      priceMin.min = minBound;
      priceMin.max = maxBound;
      priceMin.value = minBound;

      priceMax.min = minBound;
      priceMax.max = maxBound;
      priceMax.value = maxBound;

      priceInputMin.min = minBound;
      priceInputMin.max = maxBound;
      priceInputMin.value = minBound;

      priceInputMax.min = minBound;
      priceInputMax.max = maxBound;
      priceInputMax.value = maxBound;

      updateSliderTrack();
    }
  }

  // Initialize active Category details (breadcrumb, FAQ, meta fields, labels)
  function initCategoryPage() {
    activeCategory = getActiveCategory();
    const config = categoryConfigs[activeCategory];
    if (!config) return;

    if (window.location.pathname.includes('catalog') || document.getElementById('cat-heading')) {
      document.title = config.title;
      
      const metaDesc = document.getElementById('page-meta-desc');
      if (metaDesc) metaDesc.setAttribute('content', config.desc1);

      const breadcrumbCurrent = document.getElementById('breadcrumb-current');
      if (breadcrumbCurrent) breadcrumbCurrent.textContent = config.breadcrumb;

      const breadcrumbProductsLink = document.getElementById('breadcrumb-products-link');
      const breadcrumbSubSep = document.getElementById('breadcrumb-sub-sep');
      if (breadcrumbProductsLink && breadcrumbSubSep) {
        breadcrumbProductsLink.style.display = 'inline';
        breadcrumbSubSep.style.display = 'inline-flex';
      }

      const catHeading = document.getElementById('cat-heading');
      if (catHeading) catHeading.textContent = config.heading;

      const catSubheading = document.getElementById('cat-subheading');
      if (catSubheading) catSubheading.textContent = config.subheading;

      const desc1 = document.getElementById('cat-desc-1');
      if (desc1) desc1.textContent = config.desc1;

      const desc2 = document.getElementById('cat-desc-2');
      if (desc2) desc2.textContent = config.desc2;

      const cta = document.getElementById('cat-cta');
      if (cta) cta.textContent = config.cta;

      // Render custom Category FAQs
      const faqList = document.getElementById('faq-list');
      if (faqList && config.faqs) {
        faqList.innerHTML = config.faqs.map(faq => `
          <div class="faq-item">
            <button class="faq-q" aria-expanded="false"><span>${faq.q}</span><i data-lucide="plus"></i></button>
            <div class="faq-a"><p>${faq.a}</p></div>
          </div>
        `).join('');

        // FAQ Toggle trigger setup
        faqList.querySelectorAll('.faq-item').forEach(item => {
          const btn = item.querySelector('.faq-q');
          btn.addEventListener('click', () => {
            const isExpanded = btn.getAttribute('aria-expanded') === 'true';
            btn.setAttribute('aria-expanded', !isExpanded);
            item.classList.toggle('active');
          });
        });
      }

      const faqHeading = document.getElementById('faq-heading');
      if (faqHeading) faqHeading.textContent = `${config.heading} FAQ`;
    }

    // Update availability stock counts in sidebar
    const inStockCount = config.products.filter(p => p.inStock).length;
    const outStockCount = config.products.filter(p => !p.inStock).length;
    const countInStockEl = document.getElementById('count-in-stock');
    const countOutStockEl = document.getElementById('count-out-stock');
    if (countInStockEl) countInStockEl.textContent = `(${inStockCount})`;
    if (countOutStockEl) countOutStockEl.textContent = `(${outStockCount})`;

    renderSidebarFilters();
    initPriceSlider(config.products);
  }

  // Sidebar controls selectors
  const priceMin = document.getElementById('price-min');
  const priceMax = document.getElementById('price-max');
  const priceInputMin = document.getElementById('price-input-min');
  const priceInputMax = document.getElementById('price-input-max');
  const sliderTrack = document.querySelector('.range-slider-track');
  const priceApplyBtn = document.getElementById('price-apply-btn');

  // Slider track color highlight update
  function updateSliderTrack() {
    if (!priceMin || !priceMax || !sliderTrack) return;
    const minVal = parseInt(priceMin.value);
    const maxVal = parseInt(priceMax.value);
    const minPercent = (minVal / priceMin.max) * 100;
    const maxPercent = (maxVal / priceMax.max) * 100;
    sliderTrack.style.left = minPercent + '%';
    sliderTrack.style.right = (100 - maxPercent) + '%';
  }

  // Bind range events
  if (priceMin && priceMax) {
    priceMin.addEventListener('input', () => {
      let minVal = parseInt(priceMin.value);
      let maxVal = parseInt(priceMax.value);
      if (minVal > maxVal - 5) {
        priceMin.value = maxVal - 5;
        minVal = maxVal - 5;
      }
      priceInputMin.value = minVal;
      updateSliderTrack();
    });

    priceMax.addEventListener('input', () => {
      let minVal = parseInt(priceMin.value);
      let maxVal = parseInt(priceMax.value);
      if (maxVal < minVal + 5) {
        priceMax.value = minVal + 5;
        maxVal = minVal + 5;
      }
      priceInputMax.value = maxVal;
      updateSliderTrack();
    });

    priceInputMin.addEventListener('change', () => {
      let val = Math.max(0, Math.min(parseInt(priceInputMin.value) || 0, parseInt(priceMax.value) - 5));
      priceInputMin.value = val;
      priceMin.value = val;
      updateSliderTrack();
    });

    priceInputMax.addEventListener('change', () => {
      let val = Math.max(parseInt(priceMin.value) + 5, Math.min(parseInt(priceInputMax.value) || 0, parseInt(priceMax.max)));
      priceInputMax.value = val;
      priceMax.value = val;
      updateSliderTrack();
    });

    updateSliderTrack();
  }

  // Render function
  function renderCatalogGrid(products) {
    const grid = document.getElementById('catalog-products-grid');
    if (!grid) return;

    if (products.length === 0) {
      grid.innerHTML = `
        <div style="grid-column:1/-1; text-align:center; padding:80px 20px;">
          <div style="width:56px; height:56px; margin:0 auto 16px; color:var(--beige-xdk);"><i data-lucide="package-open" style="width:100%; height:100%;"></i></div>
          <h4 style="font-family:var(--font-head); font-weight:700; font-size:1.1rem; color:var(--charcoal); margin-bottom:6px;">No Matching Products</h4>
          <p style="font-size:0.85rem; color:var(--charcoal-xlt); max-width:320px; margin:0 auto;">We couldn't find any products matching your specific combinations. Try resetting filters.</p>
        </div>
      `;
      if (window.lucide) window.lucide.createIcons();
      return;
    }

    grid.innerHTML = products.map(p => {
      const isItemInStock = p.inStock;
      const buttonText = isItemInStock ? 'Quick Add' : 'Out Of Stock';
      const buttonDisabled = isItemInStock ? '' : 'disabled style="background:var(--beige-xdk); cursor:not-allowed; box-shadow:none"';
      
      const imgContent = p.image
        ? `<img src="${p.image}" alt="${p.name}" class="catalog-prod-img" loading="lazy" />`
        : getProductSvg(p, activeCategory);

      return `
        <div class="catalog-prod-card" id="card-${p.id}">
          <span class="discount-badge">${p.discount}</span>
          <div class="img-container" style="cursor:pointer" onclick="window.location.href='product-detail.html?id=${p.id}'">
            ${imgContent}
          </div>
          <div class="info-container">
            <div class="rating">
              <i data-lucide="star"></i><i data-lucide="star"></i><i data-lucide="star"></i><i data-lucide="star"></i><i data-lucide="star"></i>
              <span>(${p.reviews})</span>
            </div>
            <h3 class="size-name" style="cursor:pointer" onclick="window.location.href='product-detail.html?id=${p.id}'">${p.name}</h3>
            <div class="price-starts">
              Starts From: <strong>₹ ${p.minPrice.toFixed(2)} - ₹ ${p.maxPrice.toFixed(2)}</strong>
            </div>
            <button class="quick-add-btn add-catalog-cart-btn" data-name="${p.name}" data-price="${Math.round(p.minPrice)}" ${buttonDisabled}>
              ${buttonText}
            </button>
          </div>
        </div>
      `;
    }).join('');

    // Re-bind click event to newly created dynamic catalog cart buttons!
    const addCatalogCartBtns = grid.querySelectorAll('.add-catalog-cart-btn');
    addCatalogCartBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        if (btn.hasAttribute('disabled')) return;
        const name = btn.getAttribute('data-name');
        const price = parseInt(btn.getAttribute('data-price'));

        const existingItem = cart.find(item => item.name === name);
        if (existingItem) {
          existingItem.quantity += 1;
        } else {
          cart.push({ name, price, quantity: 1 });
        }

        updateCartUI();
        showToast(`${name} added to cart!`);
      });
    });

    if (window.lucide) {
      window.lucide.createIcons();
    }
  }

  // Filter and sort execution
  function filterAndRender() {
    activeCategory = getActiveCategory();
    const configProducts = categoryConfigs[activeCategory]?.products || [];
    
    // Combine configProducts with dynamicProducts matching activeCategory
    let combined = [...configProducts];
    if (dynamicProducts && dynamicProducts.length > 0) {
      const matched = dynamicProducts.filter(p => p.categorySlug === activeCategory || p.categoryId === activeCategory);
      matched.forEach(p => {
        if (!combined.some(cp => cp.id === p.id)) {
          combined.push({
            id: p.id,
            name: p.name,
            length: p.length_in,
            width: p.width_in,
            height: p.height_in,
            minPrice: (p.prices && p.prices["50"]) ? p.prices["50"] / 50 : 10,
            maxPrice: (p.prices && p.prices["500"]) ? p.prices["500"] / 500 : 20,
            discount: '-10%',
            rating: 4.9,
            reviews: 85,
            inStock: p.availability === 'In Stock',
            sales: 1000,
            image: p.image
          });
        }
      });
    }

    let filtered = [...combined];

    // 1. Availability filter
    const stockIn = document.getElementById('stock-in')?.checked;
    const stockOut = document.getElementById('stock-out')?.checked;
    if (stockIn && !stockOut) {
      filtered = filtered.filter(p => p.inStock);
    } else if (stockOut && !stockIn) {
      filtered = filtered.filter(p => !p.inStock);
    }

    // 2. Length filter
    const checkedLengths = Array.from(document.querySelectorAll('.filter-length:checked')).map(cb => parseFloat(cb.value));
    if (checkedLengths.length > 0) {
      filtered = filtered.filter(p => {
        return checkedLengths.some(val => p.length === val);
      });
    }

    // 3. Width filter
    const checkedWidths = Array.from(document.querySelectorAll('.filter-width:checked')).map(cb => parseFloat(cb.value));
    if (checkedWidths.length > 0) {
      filtered = filtered.filter(p => {
        return checkedWidths.some(val => p.width === val);
      });
    }

    // 4. Price range filter
    if (priceInputMin && priceInputMax) {
      const minVal = parseFloat(priceInputMin.value) || 0;
      const maxVal = parseFloat(priceInputMax.value) || Infinity;
      filtered = filtered.filter(p => p.minPrice >= minVal && p.minPrice <= maxVal);
    }

    // 5. Header Search filter
    const searchQuery = searchInput?.value.trim().toLowerCase();
    if (searchQuery) {
      filtered = filtered.filter(p => p.name.toLowerCase().includes(searchQuery));
    }

    // 6. Sorting
    const sortBy = document.getElementById('sort-by-select')?.value;
    if (sortBy === 'best-selling') {
      filtered.sort((a, b) => b.sales - a.sales);
    } else if (sortBy === 'price-low') {
      filtered.sort((a, b) => a.minPrice - b.minPrice);
    } else if (sortBy === 'price-high') {
      filtered.sort((a, b) => b.minPrice - a.minPrice);
    } else if (sortBy === 'rating') {
      filtered.sort((a, b) => b.rating - a.rating);
    }

    // 7. Limit items per page
    const itemsPerPage = parseInt(document.getElementById('items-per-page-select')?.value) || 20;
    const totalItems = filtered.length;
    const paginated = filtered.slice(0, itemsPerPage);

    // Update count display
    const countDisplay = document.getElementById('catalog-results-count');
    if (countDisplay) {
      countDisplay.textContent = `Showing 1–${paginated.length} of ${totalItems} results`;
    }

    renderCatalogGrid(paginated);
  }

  // Toggling Grid Column layout sizes
  const gridBtns = document.querySelectorAll('.grid-btn');
  gridBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      gridBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cols = btn.getAttribute('data-cols');
      const grid = document.getElementById('catalog-products-grid');
      if (grid) {
        grid.className = `catalog-products-grid grid-${cols}`;
      }
    });
  });

  // Attach controls listeners
  document.getElementById('sort-by-select')?.addEventListener('change', filterAndRender);
  document.getElementById('items-per-page-select')?.addEventListener('change', filterAndRender);
  document.getElementById('stock-in')?.addEventListener('change', filterAndRender);
  document.getElementById('stock-out')?.addEventListener('change', filterAndRender);

  priceApplyBtn?.addEventListener('click', filterAndRender);

  // Link sticky header search input to catalog filtering
  searchInput?.addEventListener('input', () => {
    if (document.getElementById('catalog-products-grid')) {
      filterAndRender();
    }
  });

  // Initial trigger if catalog grid is present on the loaded page
  if (document.getElementById('catalog-products-grid')) {
    initCategoryPage();
    filterAndRender();
  }

  // Mobile filter toggle
  const mobileFilterBtn = document.getElementById('mobile-filter-btn');
  const catalogSidebar = document.querySelector('.catalog-sidebar');
  if (mobileFilterBtn && catalogSidebar) {
    mobileFilterBtn.addEventListener('click', () => {
      const isOpen = catalogSidebar.classList.toggle('open');
      mobileFilterBtn.classList.toggle('active', isOpen);
      mobileFilterBtn.querySelector('span').textContent = isOpen ? 'Hide Filters' : 'Show Filters';
    });
  }

  /* ════════════════════════════════════════════════════════
     DYNAMIC FLAP MAILER BOX CATALOG & DETAIL PAGE LOGIC
     ════════════════════════════════════════════════════════ */


  // Helper function to build WhatsApp URL
  function getWhatsAppUrl(prod, qty = 50, price = "") {
    const cleanNumber = "918903927262";
    const msg = `Hi! I am interested in purchasing the Flap Mailer Box (${prod.size_inches_short} inches / ${prod.size_cm}). Pack Size: Pack of ${qty} (Price: ${price ? '₹' + price : 'Contact for Pricing'}). Please share quote details.`;
    return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(msg)}`;
  }

  // Load products.json
  async function loadProductsData() {
    try {
      const res = await fetch('products.json');
      if (!res.ok) throw new Error('Failed to fetch products.json');
      dynamicProducts = await res.json();
      
      // Initialize dynamic pages
      initCategoryPage();
      if (document.getElementById('catalog-products-grid')) {
        filterAndRender();
      }
      initDynamicCatalog();
      initDynamicProductDetail();
    } catch (e) {
      console.error('Error loading products data:', e);
    }
  }

  // Dynamic Catalog Page (products.html)
  function initDynamicCatalog() {
    const grid = document.getElementById('dynamic-products-grid');
    if (!grid) return;

    // Set up event listeners for filters
    const categorySelect = document.getElementById('catalog-category-select');
    const searchInput = document.getElementById('catalog-search');
    const lengthCheckboxes = document.querySelectorAll('.filter-length');
    const widthCheckboxes = document.querySelectorAll('.filter-width');
    const priceSlider = document.getElementById('price-range-slider');
    const priceSliderVal = document.getElementById('price-slider-value');
    const sortSelect = document.getElementById('sort-by-select');

    // Auto-select category from URL parameter if present
    const urlParams = new URLSearchParams(window.location.search);
    const categoryParam = urlParams.get('category') || urlParams.get('type') || urlParams.get('slug');
    if (categoryParam && categorySelect) {
      const options = Array.from(categorySelect.options);
      const matchedOpt = options.find(opt => 
        opt.value.toLowerCase() === categoryParam.toLowerCase() ||
        opt.textContent.toLowerCase().includes(categoryParam.toLowerCase().replace(/-/g, ' '))
      );
      if (matchedOpt) {
        categorySelect.value = matchedOpt.value;
      }
    }

    if (priceSlider && priceSliderVal) {
      priceSlider.addEventListener('input', (e) => {
        priceSliderVal.textContent = e.target.value;
        filterAndRenderDynamic();
      });
    }

    categorySelect?.addEventListener('change', filterAndRenderDynamic);
    searchInput?.addEventListener('input', filterAndRenderDynamic);
    lengthCheckboxes.forEach(cb => cb.addEventListener('change', filterAndRenderDynamic));
    widthCheckboxes.forEach(cb => cb.addEventListener('change', filterAndRenderDynamic));
    sortSelect?.addEventListener('change', filterAndRenderDynamic);

    // Initial render
    filterAndRenderDynamic();

    // Parse URL parameter to auto-scroll or highlight a product
    const targetId = urlParams.get('id');
    if (targetId) {
      setTimeout(() => {
        const card = document.getElementById(`card-${targetId}`);
        if (card) {
          card.scrollIntoView({ behavior: 'smooth', block: 'center' });
          card.style.outline = '3px solid var(--brown)';
          card.style.outlineOffset = '4px';
          card.style.borderRadius = 'var(--radius-md)';
          setTimeout(() => {
            card.style.transition = 'outline 1.5s ease';
            card.style.outline = '3px solid transparent';
          }, 3000);
        }
      }, 500);
    }
  }

  function filterAndRenderDynamic() {
    const grid = document.getElementById('dynamic-products-grid');
    if (!grid) return;

    const categorySelect = document.getElementById('catalog-category-select');
    const searchInput = document.getElementById('catalog-search');
    const priceSlider = document.getElementById('price-range-slider');
    const sortSelect = document.getElementById('sort-by-select');

    const selectedCategory = categorySelect ? categorySelect.value : 'all';
    const query = searchInput ? searchInput.value.toLowerCase().trim() : '';
    const maxPrice = priceSlider ? parseFloat(priceSlider.value) : Infinity;
    const sortBy = sortSelect ? sortSelect.value : 'default';

    // Get checked lengths
    const checkedLengths = Array.from(document.querySelectorAll('.filter-length:checked')).map(cb => parseFloat(cb.value));
    // Get checked widths
    const checkedWidths = Array.from(document.querySelectorAll('.filter-width:checked')).map(cb => parseFloat(cb.value));

    // Filter
    let filtered = dynamicProducts.filter(p => {
      // Category / Product Type filter
      const matchesCategory = selectedCategory === 'all' || 
        (p.categorySlug && p.categorySlug.toLowerCase() === selectedCategory.toLowerCase()) || 
        (p.categoryId && p.categoryId.toLowerCase() === selectedCategory.toLowerCase()) || 
        (p.category && p.category.toLowerCase() === selectedCategory.toLowerCase()) || 
        (p.category && p.category.toLowerCase().includes(selectedCategory.toLowerCase()));

      // Search query filter
      const matchesSearch = !query || 
        p.name.toLowerCase().includes(query) || 
        (p.category && p.category.toLowerCase().includes(query)) ||
        p.size_inches.toLowerCase().includes(query) || 
        p.size_cm.toLowerCase().includes(query);
      
      // Length filter
      const matchesLength = checkedLengths.length === 0 || checkedLengths.includes(p.length_in);
      
      // Width filter
      const matchesWidth = checkedWidths.length === 0 || checkedWidths.includes(p.width_in);
      
      // Price filter (on Pack of 50 price)
      const matchesPrice = (p.prices && p.prices["50"]) ? p.prices["50"] <= maxPrice : true;

      return matchesCategory && matchesSearch && matchesLength && matchesWidth && matchesPrice;
    });

    // Sort
    if (sortBy === 'price-low') {
      filtered.sort((a, b) => a.prices["50"] - b.prices["50"]);
    } else if (sortBy === 'price-high') {
      filtered.sort((a, b) => b.prices["50"] - a.prices["50"]);
    } else if (sortBy === 'size-low') {
      filtered.sort((a, b) => (a.length_in * a.width_in * a.height_in) - (b.length_in * b.width_in * b.height_in));
    } else if (sortBy === 'size-high') {
      filtered.sort((a, b) => (b.length_in * b.width_in * b.height_in) - (a.length_in * a.width_in * a.height_in));
    } else {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    }

    // Render results count
    const countDisplay = document.getElementById('catalog-results-count');
    if (countDisplay) {
      countDisplay.textContent = `Showing ${filtered.length} of ${dynamicProducts.length} results`;
    }

    // Render cards
    if (filtered.length === 0) {
      grid.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 60px 20px;">
          <i data-lucide="package-open" style="width: 48px; height: 48px; margin: 0 auto 12px; color: var(--charcoal-xlt);"></i>
          <h4 style="font-family: var(--font-head); font-weight: 700; color: var(--charcoal); margin-bottom: 4px;">No Boxes Found</h4>
          <p style="font-size: 0.85rem; color: var(--charcoal-xlt);">Try adjusting your search queries or slider filters.</p>
        </div>
      `;
      if (window.lucide) window.lucide.createIcons();
      return;
    }

    grid.innerHTML = filtered.map(p => {
      const featuresHTML = p.features.slice(0, 4).map(f => `
        <div class="premium-card-feature-item">
          <i data-lucide="check"></i>
          <span>${f}</span>
        </div>
      `).join('');

      const pricingRows = Object.entries(p.prices).map(([packSize, price]) => `
        <tr>
          <td>Pack of ${packSize}</td>
          <td>₹${price.toFixed(2)}</td>
        </tr>
      `).join('');

      return `
        <div class="premium-prod-card" id="card-${p.id}">
          <div class="premium-card-img-wrap" style="cursor:pointer" onclick="window.location.href='product-detail.html?id=${p.id}'">
            <img src="${p.image}" alt="${p.name}">
          </div>
          <div class="premium-card-body">
            <h3 class="premium-card-title" style="cursor:pointer" onclick="window.location.href='product-detail.html?id=${p.id}'">${p.name}</h3>
            
            <div class="premium-sizes-row">
              <div class="premium-size-tag">
                <i data-lucide="ruler"></i>
                <span>Size: ${p.size_inches}</span>
              </div>
              <div class="premium-size-tag">
                <i data-lucide="expand"></i>
                <span>Metric: ${p.size_cm}</span>
              </div>
            </div>

            <p class="premium-card-desc">${p.description}</p>

            <div class="premium-card-features-list">
              ${featuresHTML}
            </div>

            <table class="premium-pricing-table">
              <thead>
                <tr>
                  <th>Pack Size</th>
                  <th>Price</th>
                </tr>
              </thead>
              <tbody>
                ${pricingRows}
              </tbody>
            </table>

            <div class="premium-card-actions">
              <a href="custom-boxes.html?type=${p.categorySlug || 'mailer'}&length=${p.length_cm}&width=${p.width_cm}&height=${p.height_cm}" class="premium-btn-quote">
                <i data-lucide="file-text" style="width:14px; height:14px;"></i> Quote
              </a>
              <a href="${getWhatsAppUrl(p, 50, p.prices["50"])}" class="premium-btn-whatsapp" target="_blank">
                <i data-lucide="message-circle" style="width:14px; height:14px;"></i> Contact
              </a>
            </div>
          </div>
        </div>
      `;
    }).join('');

    if (window.lucide) window.lucide.createIcons();
  }

  // Dynamic Product Detail Page (product-detail.html)
  function initDynamicProductDetail() {
    const container = document.getElementById('product-detail-container');
    if (!container) return;

    // Parse product ID from query parameter
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id') || urlParams.get('slug');

    // Search in dynamicProducts first
    let product = dynamicProducts.find(p => p.id === productId || p.slug === productId);

    // If not found in dynamicProducts, search across categoryConfigs products
    if (!product) {
      for (const catKey in categoryConfigs) {
        const item = categoryConfigs[catKey].products.find(p => p.id === productId);
        if (item) {
          const catConfig = categoryConfigs[catKey];
          product = {
            id: item.id,
            slug: item.id,
            name: item.name,
            category: catConfig.breadcrumb,
            categorySlug: catKey,
            size_inches: `${item.length} inch X ${item.width} inch X ${item.height} inch`,
            size_inches_short: `${item.length}x${item.width}x${item.height}`,
            size_cm: `${(item.length * 2.54).toFixed(2)} cm x ${(item.width * 2.54).toFixed(2)} cm x ${(item.height * 2.54).toFixed(2)} cm`,
            length_in: item.length,
            width_in: item.width,
            height_in: item.height,
            length_cm: parseFloat((item.length * 2.54).toFixed(2)),
            width_cm: parseFloat((item.width * 2.54).toFixed(2)),
            height_cm: parseFloat((item.height * 2.54).toFixed(2)),
            description: `${item.name} manufactured using high-quality materials. Designed with superior finish, durable construction, lightweight design, and excellent strength for secure packaging and shipping.`,
            features: [
              "Premium Quality Material",
              "Superior Finish",
              "Durable Construction",
              "Lightweight & Heavy-Duty",
              "Quality Assured"
            ],
            prices: {
              "50": item.minPrice * 50,
              "100": Math.round(item.minPrice * 95),
              "300": Math.round(item.minPrice * 270),
              "500": Math.round(item.minPrice * 420)
            },
            contact_number: "+91 89039 27262",
            availability: item.inStock ? "In Stock" : "Out of Stock",
            image: item.image || catConfig.categoryImage,
            specifications: {
              "Box Type": catConfig.breadcrumb,
              "Material": "Corrugated Board",
              "Finish": "Superior",
              "Usage": "Packaging & Deliveries",
              "Customization": "Available",
              "Country of Origin": "India"
            }
          };
          break;
        }
      }
    }

    // Fallback to first dynamic product if no product specified or found
    if (!product && dynamicProducts.length > 0) {
      product = dynamicProducts[0];
    }

    if (!product) return;

    // Populate Page Meta and DOM elements
    document.title = `${product.name} | Box Care`;
    const pgTitle = document.getElementById('detail-page-title');
    if (pgTitle) pgTitle.textContent = `${product.name} | Box Care`;
    const pgDesc = document.getElementById('detail-page-desc');
    if (pgDesc) pgDesc.setAttribute('content', product.description);

    const bcpName = document.getElementById('breadcrumb-product-name');
    if (bcpName) bcpName.textContent = product.name;

    const catBadge = document.querySelector('.category-badge');
    if (catBadge) {
      catBadge.textContent = product.category || 'Packaging';
    }

    const pTitle = document.getElementById('product-title');
    if (pTitle) pTitle.textContent = product.name;

    const pDesc = document.getElementById('product-desc');
    if (pDesc) pDesc.textContent = product.description;

    const telNum = document.getElementById('contact-tel-number');
    if (telNum) telNum.textContent = product.contact_number;

    // Availability Badge
    const availBadge = document.querySelector('.availability-badge');
    if (availBadge) {
      availBadge.textContent = product.availability;
      if (product.availability.toLowerCase().includes('out')) {
        availBadge.style.color = '#F44336';
        availBadge.style.background = 'rgba(244, 67, 54, 0.1)';
      } else {
        availBadge.style.color = 'var(--green)';
        availBadge.style.background = 'rgba(76, 175, 80, 0.1)';
      }
    }

    // Specifications
    const specsGrid = document.getElementById('specs-grid');
    if (specsGrid && product.specifications) {
      specsGrid.innerHTML = Object.entries(product.specifications).map(([label, val]) => `
        <div class="spec-item">
          <span class="spec-label">${label}</span>
          <span class="spec-value">${val}</span>
        </div>
      `).join('');
    }

    // Features
    const featuresGrid = document.getElementById('features-grid');
    if (featuresGrid && product.features) {
      featuresGrid.innerHTML = product.features.map(f => `
        <div class="feature-check-item">
          <i data-lucide="check"></i>
          <span>${f}</span>
        </div>
      `).join('');
    }

    // Size Information Table
    const sizesBody = document.getElementById('sizes-table-body');
    if (sizesBody) {
      sizesBody.innerHTML = `
        <tr>
          <td>Inches (Imperial)</td>
          <td>${product.length_in}″</td>
          <td>${product.width_in}″</td>
          <td>${product.height_in}″</td>
        </tr>
        <tr>
          <td>Centimeters (Metric)</td>
          <td>${product.length_cm} cm</td>
          <td>${product.width_cm} cm</td>
          <td>${product.height_cm} cm</td>
        </tr>
      `;
    }

    // Pricing Table
    const pricesBody = document.getElementById('prices-table-body');
    if (pricesBody && product.prices) {
      pricesBody.innerHTML = Object.entries(product.prices).map(([packSize, price]) => `
        <tr>
          <td>Pack of ${packSize}</td>
          <td class="price-col-highlight">₹${typeof price === 'number' ? price.toFixed(2) : price}</td>
        </tr>
      `).join('');
    }

    // Action buttons WhatsApp & Quote link
    const quoteBtn = document.getElementById('request-quote-btn');
    const contactBtn = document.getElementById('contact-us-btn');

    if (quoteBtn) {
      quoteBtn.setAttribute('href', `custom-boxes.html?type=${product.categorySlug || 'mailer'}&length=${product.length_cm}&width=${product.width_cm}&height=${product.height_cm}`);
    }

    if (contactBtn) {
      contactBtn.setAttribute('href', getWhatsAppUrl(product, 50, product.prices ? product.prices["50"] : ""));
    }

    // Gallery Render
    const galleryEl = document.querySelector('.detail-gallery');
    if (galleryEl) {
      galleryEl.innerHTML = `
        <div class="main-img-wrap">
          <img src="${product.image}" alt="${product.name}" id="detail-main-image">
        </div>
        <div class="thumbnail-row">
          <button class="thumb-btn active" onclick="document.getElementById('detail-main-image').src='${product.image}'; document.querySelectorAll('.thumb-btn').forEach(b => b.classList.remove('active')); this.classList.add('active');">
            <img src="${product.image}" alt="${product.name}">
          </button>
        </div>
      `;
    }

    if (window.lucide) window.lucide.createIcons();
  }

  /* ════════════════════════════════════════════════════════
     INSTANT CUSTOM BOX PRICE CALCULATOR & 3D CONTROLLER
     ════════════════════════════════════════════════════════ */
  function initCustomBoxCalculator() {
    const scene = document.getElementById('calc-scene');
    if (!scene) return;

    const lengthSlider = document.getElementById('calc-length');
    const widthSlider = document.getElementById('calc-width');
    const heightSlider = document.getElementById('calc-height');
    const qtySlider = document.getElementById('calc-qty');
    const boxTypeSelect = document.getElementById('calc-box-type');
    const materialSelect = document.getElementById('calc-material');
    const printCheckbox = document.getElementById('calc-print');

    const lengthTxt = document.getElementById('calc-length-txt');
    const widthTxt = document.getElementById('calc-width-txt');
    const heightTxt = document.getElementById('calc-height-txt');
    const qtyTxt = document.getElementById('calc-qty-txt');
    const overlayDim = document.getElementById('calc-overlay-dim');

    const boxCostTxt = document.getElementById('calc-box-cost');
    const printCostTxt = document.getElementById('calc-print-cost');
    const discountBadge = document.getElementById('calc-discount-badge');
    const subtotalTxt = document.getElementById('calc-subtotal');
    const gstTxt = document.getElementById('calc-gst');
    const totalTxt = document.getElementById('calc-total');
    const whatsappBtn = document.getElementById('btn-calc-whatsapp');
    const applyBtn = document.getElementById('btn-calc-apply');

    const box3d = document.getElementById('calc-box-3d');
    const presetCards = document.querySelectorAll('.calc-preset-card');

    // Preset configurations
    const presets = {
      mobile: { length: 17, width: 9, height: 4, type: 'mailer', material: '3ply' },
      tablet: { length: 26, width: 19, height: 4, type: 'mailer', material: '3ply' },
      laptop: { length: 39, width: 28, height: 6, type: 'mailer', material: '3ply' },
      grinder: { length: 35, width: 25, height: 30, type: 'shipping', material: '3ply' },
      kettle: { length: 22, width: 18, height: 25, type: 'shipping', material: '3ply' },
      microwave: { length: 52, width: 40, height: 32, type: 'shipping', material: '5ply' },
      shoebox: { length: 33, width: 20, height: 12, type: 'shipping', material: '3ply' },
      mug: { length: 12, width: 12, height: 12, type: 'mailer', material: '3ply' }
    };

    // Pricing formulas values
    const materialCosts = {
      kraft: 0.005, // ₹ per cm²
      '3ply': 0.015,
      '5ply': 0.025,
      rigid: 0.040
    };

    const typeFactors = {
      mailer: 1.2,
      shipping: 1.0,
      carton: 0.8,
      gift: 1.5
    };

    // Mouse and touch drag rotation variables
    let isDragging = false;
    let startX, startY;
    let rotX = -20;
    let rotY = 35;

    // Recalculate price and update 3D box styles
    function recalculate() {
      const l = parseInt(lengthSlider.value);
      const w = parseInt(widthSlider.value);
      const h = parseInt(heightSlider.value);
      const qty = parseInt(qtySlider.value);
      const type = boxTypeSelect.value;
      const mat = materialSelect.value;
      const isPrinted = printCheckbox.checked;

      // Update text labels
      if (lengthTxt) lengthTxt.textContent = `${l} cm`;
      if (widthTxt) widthTxt.textContent = `${w} cm`;
      if (heightTxt) heightTxt.textContent = `${h} cm`;
      if (qtyTxt) qtyTxt.textContent = `${qty} units`;
      if (overlayDim) overlayDim.textContent = `${l} x ${w} x ${h} cm`;

      // 1. Calculate Surface Area in cm²
      // Area = 2 * (L*W + W*H + L*H)
      const surfaceArea = 2 * (l * w + w * h + l * h);

      // 2. Base Cost calculation
      const matCostPerCm2 = materialCosts[mat] || 0.01;
      const typeFactor = typeFactors[type] || 1.0;
      const rawBaseCost = surfaceArea * matCostPerCm2 * typeFactor;
      
      // Enforce a sensible minimum unit cost based on type
      const minUnitCosts = { mailer: 12, shipping: 16, carton: 6, gift: 40 };
      const minCost = minUnitCosts[type] || 10;
      let unitBaseCost = Math.max(minCost, rawBaseCost);

      // 3. Discount curve
      let discountPercent = 0;
      if (qty >= 1000) discountPercent = 35;
      else if (qty >= 500) discountPercent = 25;
      else if (qty >= 300) discountPercent = 20;
      else if (qty >= 100) discountPercent = 10;

      const discountAmount = (unitBaseCost * discountPercent) / 100;
      const discountedUnitCost = unitBaseCost - discountAmount;

      // 4. Custom printing surcharges
      const unitPrintCost = isPrinted ? 5.00 : 0.00;
      const totalPrintCost = unitPrintCost * qty;

      // 5. Total pricing calculations
      const subtotal = (discountedUnitCost + unitPrintCost) * qty;
      const gst = subtotal * 0.18;
      const total = subtotal + gst;

      // 6. Update HTML Summary Cards
      if (boxCostTxt) boxCostTxt.textContent = `₹${discountedUnitCost.toFixed(2)}`;
      if (printCostTxt) printCostTxt.textContent = `₹${totalPrintCost.toFixed(2)}`;
      if (discountBadge) {
        if (discountPercent > 0) {
          discountBadge.style.display = 'inline-block';
          discountBadge.textContent = `-${discountPercent}% Qty Discount`;
        } else {
          discountBadge.style.display = 'none';
        }
      }
      if (subtotalTxt) subtotalTxt.textContent = `₹${subtotal.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;
      if (gstTxt) gstTxt.textContent = `₹${gst.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;
      if (totalTxt) totalTxt.textContent = `₹${total.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;

      // 7. Dynamic CSS 3D Box scaling
      if (box3d) {
        const maxPixels = 150;
        const largestInput = Math.max(l, w, h);
        const scale = maxPixels / largestInput;

        const wPx = l * scale;
        const hPx = h * scale;
        const dPx = w * scale;

        box3d.style.setProperty('--box-w', `${wPx}px`);
        box3d.style.setProperty('--box-h', `${hPx}px`);
        box3d.style.setProperty('--box-d', `${dPx}px`);

        // Set material styling class
        box3d.className = `calc-3d-box material-${mat}`;
        if (isPrinted) {
          box3d.classList.add('box-printed');
        } else {
          box3d.classList.remove('box-printed');
        }
      }

      // 8. Update WhatsApp Inquiry link
      if (whatsappBtn) {
        const phone = "918903927262";
        const typeName = boxTypeSelect.options[boxTypeSelect.selectedIndex].text.split('(')[0].trim();
        const matName = materialSelect.options[materialSelect.selectedIndex].text.split('(')[0].trim();
        const msg = `Hi Box Care! I calculated a custom box quote on your website:
• Box Type: ${typeName}
• Material: ${matName}
• Dimensions: ${l} cm (L) x ${w} cm (W) x ${h} cm (H)
• Quantity: ${qty} units
• Custom Print: ${isPrinted ? 'Yes (Logo Screen-Printed)' : 'No (Plain Box)'}
• Estimated Quote: ₹${total.toLocaleString('en-IN', { maximumFractionDigits: 2 })} (GST Incl.)
Please verify availability and timeline.`;
        whatsappBtn.setAttribute('href', `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`);
      }
    }

    // Set slider and dropdown values based on active preset
    function applyPreset(presetKey) {
      const preset = presets[presetKey];
      if (!preset) return;

      lengthSlider.value = preset.length;
      widthSlider.value = preset.width;
      heightSlider.value = preset.height;
      boxTypeSelect.value = preset.type;
      materialSelect.value = preset.material;

      recalculate();
    }

    // Attach Input Event Listeners
    lengthSlider.addEventListener('input', () => {
      removePresetActive();
      recalculate();
    });
    widthSlider.addEventListener('input', () => {
      removePresetActive();
      recalculate();
    });
    heightSlider.addEventListener('input', () => {
      removePresetActive();
      recalculate();
    });
    qtySlider.addEventListener('input', recalculate);
    boxTypeSelect.addEventListener('change', recalculate);
    materialSelect.addEventListener('change', recalculate);
    printCheckbox.addEventListener('change', recalculate);

    // Preset cards click handlers
    presetCards.forEach(card => {
      card.addEventListener('click', () => {
        presetCards.forEach(c => c.classList.remove('active'));
        card.classList.add('active');
        const itemKey = card.getAttribute('data-item');
        applyPreset(itemKey);
      });
    });

    function removePresetActive() {
      presetCards.forEach(c => c.classList.remove('active'));
    }

    // Mouse interactive rotation
    scene.addEventListener('mousedown', (e) => {
      isDragging = true;
      startX = e.clientX;
      startY = e.clientY;
    });

    document.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      startX = e.clientX;
      startY = e.clientY;

      rotY += dx * 0.45;
      rotX -= dy * 0.45;

      // Limit pitch to prevent box turning upside down
      rotX = Math.max(-55, Math.min(55, rotX));
      if (box3d) {
        box3d.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg)`;
      }
    });

    document.addEventListener('mouseup', () => {
      isDragging = false;
    });

    // Touch interaction for mobile screens
    scene.addEventListener('touchstart', (e) => {
      isDragging = true;
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    });

    scene.addEventListener('touchmove', (e) => {
      if (!isDragging) return;
      const dx = e.touches[0].clientX - startX;
      const dy = e.touches[0].clientY - startY;
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;

      rotY += dx * 0.45;
      rotX -= dy * 0.45;
      rotX = Math.max(-55, Math.min(55, rotX));
      if (box3d) {
        box3d.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg)`;
      }
    });

    scene.addEventListener('touchend', () => {
      isDragging = false;
    });

    // Import SPEC data into the main 6-step builder above
    applyBtn?.addEventListener('click', () => {
      const l = parseInt(lengthSlider.value);
      const w = parseInt(widthSlider.value);
      const h = parseInt(heightSlider.value);
      const type = boxTypeSelect.value;
      const mat = materialSelect.value;
      const qty = parseInt(qtySlider.value);

      // Select type radio button in Step 1
      const typeRadio = document.querySelector(`.builder-step input[name="box-type"][value="${type}"]`);
      if (typeRadio) {
        typeRadio.checked = true;
        // Trigger pre-fill preview text
        const prevType = document.getElementById('prev-type');
        if (prevType) prevType.textContent = typeRadio.parentElement.textContent.trim();
      }

      // Select material radio button in Step 2
      const matRadio = document.querySelector(`.builder-step input[name="material"][value="${mat}"]`);
      if (matRadio) {
        matRadio.checked = true;
        const prevMat = document.getElementById('prev-mat');
        if (prevMat) prevMat.textContent = matRadio.parentElement.textContent.trim();
      }

      // Set dimensions in Step 3
      const lengthInput = document.getElementById('bs-length');
      const widthInput = document.getElementById('bs-width');
      const heightInput = document.getElementById('bs-height');
      if (lengthInput) lengthInput.value = l;
      if (widthInput) widthInput.value = w;
      if (heightInput) heightInput.value = h;
      
      const prevSize = document.getElementById('prev-size');
      if (prevSize) prevSize.textContent = `${l} × ${w} × ${h} cm`;

      // Set quantity in Step 6
      const qtyInput = document.getElementById('bs-qty');
      if (qtyInput) qtyInput.value = qty;

      // Update global builderData tracking values
      if (typeof builderData !== 'undefined') {
        builderData.type = type;
        builderData.material = mat;
        builderData.length = l;
        builderData.width = w;
        builderData.height = h;
        builderData.qty = qty;
      }

      // Scroll smoothly back up to the builder
      const builderSection = document.getElementById('builder');
      if (builderSection) {
        builderSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }

      // Navigate to step 4 (Logo upload) automatically to make completion faster!
      if (typeof navigateToStep === 'function') {
        setTimeout(() => {
          navigateToStep(1, 4);
        }, 600);
      }

      if (typeof showToast === 'function') {
        showToast('Specs successfully imported to Box Builder Studio!');
      } else {
        alert('Specifications successfully imported to Box Builder Studio!');
      }
    });

    // Initial run
    applyPreset('mobile');
  }

  // Load catalog data initially
  loadProductsData();
  initCustomBoxCalculator();

  } catch (err) {
    console.error('CRITICAL RUNTIME ERROR in script.js DOMContentLoaded:', err);
  }
});


