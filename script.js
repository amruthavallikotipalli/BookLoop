/**
 * BookLoop - 3D Bookshelf Hero Motion Engine & Interaction System
 * Fully implements shelf-hero-spec.md motion mechanics:
 * 1. Endless looping shelf (12 books x 3 copies = 36 cuboids)
 * 2. 3D Physical rotation from spine to front cover with smoothstep openness,
 *    -4.5deg tilt, lift, soft drop-shadow, and cursor-directed lean
 * 3. 58px Custom ring cursor that expands into a Forest Green (#244C3B) "VIEW" disc over cover
 * 4. Paper sheet full-screen expansion from cover bounding rect via Web Animations API
 * 5. Continuous wheel & pointer drag physics with masked translateY slide transitions (NO OPACITY FADES)
 */

document.addEventListener('DOMContentLoaded', () => {

  // --- 1. SVG ICON GENERATOR ---
  function getBookSvg(motif, size = 22) {
    const s = size;
    switch (motif) {
      case 'moon-stars':
        return `<svg viewBox="0 0 24 24" width="${s}" height="${s}" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path><circle cx="17" cy="6" r="1" fill="currentColor"></circle><circle cx="19" cy="9" r="0.75" fill="currentColor"></circle></svg>`;
      case 'atom':
        return `<svg viewBox="0 0 24 24" width="${s}" height="${s}" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="3" fill="currentColor"></circle><ellipse cx="12" cy="12" rx="9" ry="3.5" transform="rotate(30 12 12)"></ellipse><ellipse cx="12" cy="12" rx="9" ry="3.5" transform="rotate(-30 12 12)"></ellipse></svg>`;
      case 'statue':
        return `<svg viewBox="0 0 24 24" width="${s}" height="${s}" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 2a5 5 0 0 0-5 5c0 2.5 1.5 4.5 3.5 5.5V17H9v3h6v-3h-1.5v-4.5C15.5 11.5 17 9.5 17 7a5 5 0 0 0-5-5z"></path><line x1="8" y1="22" x2="16" y2="22"></line></svg>`;
      case 'blossom':
        return `<svg viewBox="0 0 24 24" width="${s}" height="${s}" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 3c-1.5 2-1 4 0 6 1-2 1.5-4 0-6z"></path><path d="M12 21c-1.5-2-1-4 0-6 1 2 1.5 4 0 6z"></path><path d="M3 12c2-1.5 4-1 6 0-2 1-4 1.5-6 0z"></path><path d="M21 12c-2-1.5-4-1-6 0 2 1 4 1.5 6 0z"></path><circle cx="12" cy="12" r="2.5" fill="currentColor"></circle></svg>`;
      case 'sun-dunes':
        return `<svg viewBox="0 0 24 24" width="${s}" height="${s}" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="8" r="4" fill="currentColor"></circle><path d="M2 19c4-4 8-1 12-4 3 2 6 3 8 4"></path><path d="M2 22h20"></path></svg>`;
      case 'magic-crest':
        return `<svg viewBox="0 0 24 24" width="${s}" height="${s}" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 2l3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1z"></path></svg>`;
      case 'handprint':
        return `<svg viewBox="0 0 24 24" width="${s}" height="${s}" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M18 11V6a2 2 0 0 0-4 0v5"></path><path d="M14 10V4a2 2 0 0 0-4 0v7"></path><path d="M10 10.5V6a2 2 0 0 0-4 0v8"></path><path d="M6 14v-2a2 2 0 0 0-4 0v4a8 8 0 0 0 16 0v-4a2 2 0 0 0-4 0"></path></svg>`;
      case 'lotus':
        return `<svg viewBox="0 0 24 24" width="${s}" height="${s}" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 4c-2 4-2 7 0 11 2-4 2-7 0-11z"></path><path d="M7 9c1 3 3 5 5 6-4-1-6-3-5-6z"></path><path d="M17 9c-1 3-3 5-5 6 4-1 6-3 5-6z"></path><path d="M4 17c5-1 11-1 16 0"></path></svg>`;
      case 'twin-moons':
        return `<svg viewBox="0 0 24 24" width="${s}" height="${s}" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 3a9 9 0 0 0 0 18 9 9 0 0 0 0-18z"></path><path d="M19 8a5 5 0 0 0 0 8 5 5 0 0 0 0-8z"></path></svg>`;
      case 'solar-disc':
        return `<svg viewBox="0 0 24 24" width="${s}" height="${s}" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="5" fill="currentColor"></circle><line x1="12" y1="1" x2="12" y2="4"></line><line x1="12" y1="20" x2="12" y2="23"></line><line x1="1" y1="12" x2="4" y2="12"></line><line x1="20" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="4.22" x2="6.34" y2="6.34"></line><line x1="17.66" y1="17.66" x2="19.78" y2="19.78"></line><line x1="4.22" y1="19.78" x2="6.34" y2="17.66"></line><line x1="17.66" y1="6.34" x2="19.78" y2="4.22"></line></svg>`;
      case 'ramen':
        return `<svg viewBox="0 0 24 24" width="${s}" height="${s}" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 11h18a9 9 0 0 1-18 0z"></path><line x1="7" y1="2" x2="17" y2="8"></line><line x1="5" y1="5" x2="15" y2="11"></line></svg>`;
      case 'sculpture':
        return `<svg viewBox="0 0 24 24" width="${s}" height="${s}" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 3v18"></path><path d="M6 8a6 6 0 0 1 12 0c0 4-3 6-6 9"></path><circle cx="12" cy="8" r="2" fill="currentColor"></circle></svg>`;
      default:
        return `<svg viewBox="0 0 24 24" width="${s}" height="${s}" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="6"></circle></svg>`;
    }
  }

  // --- 2. DATA: 12 ICONIC VOLUMES (SINGLE SOURCE OF TRUTH: books.js) ---
  const books = (typeof window !== 'undefined' && window.BOOKS) ? [...window.BOOKS] : [];

  // Helper to load persistent user listings
  function getUserListings() {
    try {
      return JSON.parse(localStorage.getItem('bookloop_user_listings') || '[]');
    } catch (e) {
      return [];
    }
  }

  // Preload existing user listings into catalog
  const savedListings = getUserListings();
  if (Array.isArray(savedListings)) {
    savedListings.forEach(item => {
      if (!books.some(b => b.id === item.id)) {
        books.push(item);
      }
    });
  }

  // --- 3. DOM REFERENCES ---
  const shelfStage = document.getElementById('shelf-3d-stage');
  const stage3d = document.getElementById('stage-3d');
  const playRing = document.getElementById('hero-play-ring');
  const customCursor = document.getElementById('custom-cursor');
  const tabIndicator = document.getElementById('tab-indicator');
  const genreTabs = document.querySelectorAll('.genre-tab-btn');
  const prevBtn = document.getElementById('shelf-prev');
  const nextBtn = document.getElementById('shelf-next');
  const heroBuyBtn = document.getElementById('hero-buy-btn');
  const heroRentBtn = document.getElementById('hero-rent-btn');

  // Detail Paper Sheet Dialog Elements
  const detailSheet = document.getElementById('book-detail-sheet');
  const sheetCloseBtn = document.getElementById('sheet-close-btn');
  const sheetCoverCard = document.getElementById('sheet-cover-card');
  const sheetBookTitle = document.getElementById('sheet-book-title');
  const sheetAuthorName = document.getElementById('sheet-author-name');
  const sheetConditionTag = document.getElementById('sheet-condition-tag');
  const sheetGenrePill = document.getElementById('sheet-genre-pill');
  const sheetSpecEdition = document.getElementById('sheet-spec-edition');
  const sheetSpecPages = document.getElementById('sheet-spec-pages');
  const sheetSpecRating = document.getElementById('sheet-spec-rating');
  const sheetSynopsis = document.getElementById('sheet-synopsis');
  const sheetQuote = document.getElementById('sheet-quote');
  const sheetBuyPrice = document.getElementById('sheet-buy-price');
  const sheetRentPrice = document.getElementById('sheet-rent-price');
  const sheetBuyBtn = document.getElementById('sheet-buy-btn');
  const sheetRentBtn = document.getElementById('sheet-rent-btn');
  const sheetAccessionId = document.getElementById('sheet-accession-id');

  // Masked Caption Slot Elements
  const captionTitleSlot = document.getElementById('caption-title-slot');
  const captionMetaSlot = document.getElementById('caption-meta-slot');
  const captionPriceSlot = document.getElementById('caption-price-slot');

  // --- 4. GEOMETRY & STATE ---
  let H = 320;
  let ws = 54;
  let d = 168;
  let gap = 11;

  function measureDimensions() {
    H = Math.min(window.innerHeight * 0.44, 340);
    if (window.innerWidth < 768) {
      H = Math.min(window.innerWidth * 0.58, 280);
    }
    H = Math.max(250, H);
    ws = H * 142 / 840;
    d = H * 474 / 900;
    gap = H * 0.035;

    shelfStage.style.setProperty('--H', `${H}px`);
    shelfStage.style.setProperty('--ws', `${ws}px`);
    shelfStage.style.setProperty('--d', `${d}px`);
  }
  measureDimensions();
  window.addEventListener('resize', measureDimensions);

  // Motion engine variables
  // Start on Midnight Library (index 6) in middle copy: 12 + 6 = 18
  let s = 18;
  let T = 18;
  let activeBookIndex = 6;
  let activeGenre = 'all';
  let isOpen = false;

  // Pointer & Cursor physics
  let mx = window.innerWidth / 2;
  let my = window.innerHeight / 2;
  let cx = mx;
  let cy = my;
  let tiltX = 0;
  let tiltY = 0;
  let isHoveringInteractive = false;
  let hoveredTapeObj = null;

  // Drag state
  let isDragging = false;
  let dragStartX = 0;
  let dragT0 = 0;
  let dragDistance = 0;
  let dragJustEnded = false;

  // Wheel debounce timer
  let wheelSnapTimer = null;

  // Helper smoothstep
  function smoothstep(val) {
    const x = Math.max(0, Math.min(1, val));
    return x * x * (3 - 2 * x);
  }

  // --- 5. SPAWN 36 CUBOID TAPES (12 BOOKS X 3 COPIES) ---
  const tapeObjects = [];
  stage3d.innerHTML = '';

  for (let copy = 0; copy < 3; copy++) {
    for (let i = 0; i < 12; i++) {
      const v = copy * 12 + i;
      const book = books[i];

      const tapeEl = document.createElement('div');
      tapeEl.className = 'tape';
      tapeEl.setAttribute('data-v', v);
      tapeEl.setAttribute('data-index', i);
      tapeEl.setAttribute('data-id', book.id);

      // Spine face (.face.sp) - Colored from spineColor with vertical title
      const spFace = document.createElement('div');
      spFace.className = `face sp ${book.spineTheme || ''}`;
      if (book.spineColor) spFace.style.backgroundColor = book.spineColor;
      if (book.spineTextColor) spFace.style.color = book.spineTextColor;
      if (book.spineBorderColor) spFace.style.borderTopColor = book.spineBorderColor;
      spFace.innerHTML = `
        <div class="spine-header">${book.number}</div>
        <div class="spine-title-wrap">
          <span class="spine-title-vertical">${book.title}</span>
        </div>
        <div class="spine-footer">
          <div style="margin-bottom: 2px;">${book.authorShort || book.author}</div>
          <span class="spine-badge">BOOKLOOP</span>
        </div>
      `;

      // Cover face (.face.cv) - Real Cover Image with CSS Artwork Fallback
      const cvFace = document.createElement('div');
      cvFace.className = `face cv ${book.coverClass || ''}`;
      cvFace.innerHTML = `
        <img src="${book.cover}" alt="${book.title} cover" class="book-real-cover" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';" />
        <div class="book-cover-content" style="display: none;">
          <div class="cover-header-meta">
            <span class="cover-header-tag">BookLoop</span>
            <span style="color: ${book.accentColor}">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>
            </span>
          </div>
          <div class="cover-center-motif">
            <div class="cover-icon-emblem" style="color: ${book.accentColor}; border-color: ${book.accentColor}66;">
              ${getBookSvg(book.motif, 20)}
            </div>
            <h2 class="cover-title">${book.title}</h2>
            <p class="cover-author">${book.author}</p>
          </div>
          <div class="cover-footer-meta">
            <span class="cover-edition-tag">${book.edition}</span>
            <span class="cover-price-badge">${book.buyPrice}</span>
          </div>
        </div>
        <div class="cover-paper-stack"></div>
      `;

      tapeEl.appendChild(spFace);
      tapeEl.appendChild(cvFace);
      stage3d.appendChild(tapeEl);

      const tapeObj = {
        el: tapeEl,
        v,
        i,
        book,
        spFace,
        cvFace,
        lift: 0,
        targetLift: 0,
        r: 0
      };

      // Hover tracking for lift & cursor
      tapeEl.addEventListener('pointerenter', () => {
        hoveredTapeObj = tapeObj;
        if (Math.abs(tapeObj.r) > 0.5) {
          tapeObj.targetLift = 1;
        }
      });
      tapeEl.addEventListener('pointerleave', () => {
        if (hoveredTapeObj === tapeObj) hoveredTapeObj = null;
        tapeObj.targetLift = 0;
      });

      // Tape click handler
      tapeEl.addEventListener('click', () => {
        if (dragJustEnded) return;
        const r = tapeObj.r;
        if (Math.abs(r) < 0.5) {
          openDetail();
        } else {
          T = Math.round(T + r);
        }
      });

      tapeObjects.push(tapeObj);
    }
  }

  // --- 6. MASKED CAPTION TRANSITIONS (NO OPACITY FADES) ---
  function updateMaskedCaption(book, dir = 1) {
    if (!book) return;

    slideMaskSlot(captionTitleSlot, `<h3 class="caption-title">${book.fullTitle || book.title}</h3>`, dir);
    slideMaskSlot(captionMetaSlot, `<div class="caption-metadata"><span class="caption-bullet"></span><span>${book.author.toUpperCase()} · ${book.condition}</span></div>`, dir);
    slideMaskSlot(captionPriceSlot, `<p class="caption-pricing"><span class="price-buy">BUY ${book.buyPrice}</span> <span style="color: var(--outline); font-weight: 300; margin: 0 6px;">·</span> <span class="price-rent">RENT ${book.rentPrice}</span></p>`, dir);
  }

  function slideMaskSlot(slot, newHtml, dir) {
    if (!slot) return;

    // 1. Cancel ALL running animations on every existing child and
    //    immediately remove every child except (at most) the very last one,
    //    which is the currently-visible element. This prevents pile-ups
    //    when the user clicks rapidly.
    const existingChildren = Array.from(slot.children);
    existingChildren.forEach(child => {
      child.getAnimations().forEach(a => a.cancel());
    });
    // Keep only the last child (the one that was "current"), remove the rest
    const keepChild = existingChildren.length > 0
      ? existingChildren[existingChildren.length - 1]
      : null;
    existingChildren.forEach(child => {
      if (child !== keepChild && child.parentNode === slot) {
        slot.removeChild(child);
      }
    });

    // 2. Create new element
    const newEl = document.createElement('div');
    newEl.style.cssText =
      'position:absolute;inset:0;display:flex;align-items:center;justify-content:center;';
    newEl.innerHTML = newHtml;
    slot.appendChild(newEl);

    // 3. Slide the new element IN from below/above
    const animIn = newEl.animate([
      { transform: `translateY(${dir * 105}%)` },
      { transform: 'translateY(0%)' }
    ], {
      duration: 600,
      easing: 'cubic-bezier(.2, .8, .2, 1)',
      fill: 'forwards'
    });

    // 4. Slide the old element OUT (NO OPACITY CHANGE — mask-slide only)
    if (keepChild) {
      // Reset its transform so the outgoing animation starts from the
      // current visible position (handles interrupted mid-slide elements).
      keepChild.style.transform = 'translateY(0%)';
      const animOut = keepChild.animate([
        { transform: 'translateY(0%)' },
        { transform: `translateY(${-dir * 105}%)` }
      ], {
        duration: 600,
        easing: 'cubic-bezier(.2, .8, .2, 1)',
        fill: 'forwards'
      });
      animOut.onfinish = () => {
        if (keepChild.parentNode === slot) {
          slot.removeChild(keepChild);
        }
      };
    }
  }

  // Initial caption setup without animation on load
  function setInitialCaption(book) {
    if (!book) return;
    function makeInitEl(html) {
      const el = document.createElement('div');
      el.style.cssText =
        'position:absolute;inset:0;display:flex;align-items:center;justify-content:center;';
      el.innerHTML = html;
      return el;
    }
    captionTitleSlot.innerHTML = '';
    captionMetaSlot.innerHTML = '';
    captionPriceSlot.innerHTML = '';
    captionTitleSlot.appendChild(makeInitEl(`<h3 class="caption-title">${book.fullTitle || book.title}</h3>`));
    captionMetaSlot.appendChild(makeInitEl(`<div class="caption-metadata"><span class="caption-bullet"></span><span>${book.author.toUpperCase()} · ${book.condition}</span></div>`));
    captionPriceSlot.appendChild(makeInitEl(`<p class="caption-pricing"><span class="price-buy">BUY ${book.buyPrice}</span> <span style="color: var(--outline); font-weight: 300; margin: 0 6px;">·</span> <span class="price-rent">RENT ${book.rentPrice}</span></p>`));
  }
  setInitialCaption(books[activeBookIndex]);

  // --- 7. GENRE TABS & SLIDING INDICATOR ---
  function updateGenreTabIndicator(genre, animate = true) {
    let targetTab = null;
    genreTabs.forEach(tab => {
      const g = tab.getAttribute('data-genre');
      if (g === genre) {
        targetTab = tab;
        tab.classList.add('active');
      } else {
        tab.classList.remove('active');
      }
    });

    if (targetTab && tabIndicator) {
      if (!animate) {
        tabIndicator.classList.remove('ready');
      } else {
        tabIndicator.classList.add('ready');
      }
      tabIndicator.style.width = `${targetTab.offsetWidth || 64}px`;
      tabIndicator.style.transform = `translateX(${targetTab.offsetLeft || 3}px)`;
    }
  }

  // Set initial tab indicator synchronously without animation
  updateGenreTabIndicator('all', false);
  requestAnimationFrame(() => {
    tabIndicator.classList.add('ready');
  });

  // Update tab indicator to match active book's primary genre
  function syncTabWithBook(book) {
    if (activeGenre !== 'all') {
      updateGenreTabIndicator(activeGenre, true);
      return;
    }
    const primaryGenre = book.genres[0] || 'fiction';
    updateGenreTabIndicator(primaryGenre, true);
  }

  genreTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const genre = tab.getAttribute('data-genre') || 'all';
      activeGenre = genre;
      updateGenreTabIndicator(genre, true);

      if (genre === 'all') {
        // Jump back to Midnight Library
        jumpToBookIndex(6);
      } else {
        const firstMatchIdx = books.findIndex(b => b.genres.includes(genre));
        if (firstMatchIdx !== -1) {
          jumpToBookIndex(firstMatchIdx);
        }
      }
    });
  });

  function jumpToBookIndex(targetIdx) {
    const curIdx = ((Math.round(s) % 12) + 12) % 12;
    let diff = (targetIdx - curIdx) % 12;
    if (diff > 6) diff -= 12;
    if (diff < -6) diff += 12;
    T = Math.round(s) + diff;
  }

  // --- 8. DETAIL PAPER SHEET MODAL (EXPANSION & CONTRACTION) ---
  let currentSheetBook = null;

  function openDetail(instant = false, customBook = null) {
    if (isOpen) return;
    T = Math.round(T);
    s = T;
    isOpen = true;
    document.body.classList.add('sheet-open');
    if (customCursor) customCursor.classList.add('hidden-cursor');

    const book = customBook || books[activeBookIndex];
    if (!book) return;
    currentSheetBook = book;

    // Populate sheet texts
    sheetBookTitle.textContent = book.fullTitle || book.title;
    sheetAuthorName.textContent = `By ${book.author}`;
    sheetConditionTag.textContent = `${book.condition} CONDITION`;
    sheetGenrePill.textContent = (Array.isArray(book.genres) ? book.genres.join(' / ') : (book.genre || 'LITERATURE')).toUpperCase();
    sheetSpecEdition.textContent = book.edition || 'Community Edition';
    sheetSpecPages.textContent = book.pages || '320 pages';
    sheetSpecRating.textContent = book.rating || '4.8 / 5.0';
    sheetSynopsis.textContent = book.synopsis || 'Every book on BookLoop is checked and shared with care.';
    sheetQuote.textContent = `"${book.quote || 'Every volume carries the memories of its readers.'}"`;
    sheetBuyPrice.textContent = book.buyPrice;
    sheetRentPrice.textContent = `${book.rentPrice}`;
    const volNum = book.number ? book.number.replace('§ ', '') : '01';
    sheetAccessionId.textContent = `VOL. ${volNum} · 2026`;

    // Populate sheet right-column cover card (Real cover with CSS fallback)
    sheetCoverCard.className = `sheet-book-card ${book.coverClass || ''}`;
    const accent = book.accentColor || '#deb05c';
    sheetCoverCard.innerHTML = `
      <img src="${book.cover}" alt="${book.title} cover" class="sheet-real-cover" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';" />
      <div class="book-cover-content sheet-fallback-cover" style="display: none; padding: 32px 28px 24px 32px;">
        <div class="cover-header-meta" style="padding-bottom: 12px;">
          <span class="cover-header-tag" style="font-size: 11px;">BookLoop · ${book.number || '§ 01'}</span>
          <span style="color: ${accent}">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>
          </span>
        </div>
        <div class="cover-center-motif" style="padding: 24px 0;">
          <div class="cover-icon-emblem" style="width: 60px; height: 60px; margin-bottom: 16px; color: ${accent}; border-color: ${accent}66;">
            ${getBookSvg(book.motif || 'moon-stars', 30)}
          </div>
          <h2 class="cover-title" style="font-size: 26px; margin-bottom: 8px;">${book.title}</h2>
          <p class="cover-author" style="font-size: 13px;">${book.author}</p>
        </div>
        <div class="cover-footer-meta" style="padding-top: 14px;">
          <span class="cover-edition-tag" style="font-size: 11px;">${book.edition || 'Paperback Edition'}</span>
          <span class="cover-price-badge" style="font-size: 16px;">${book.buyPrice}</span>
        </div>
      </div>
      <div class="cover-paper-stack" style="width: 5px;"></div>
    `;

    // Measure screen rect of active cover face
    const activeTape = tapeObjects.find(t => t.v === Math.round(s));
    const activeCover = activeTape ? activeTape.cvFace : document.querySelector('.face.cv');
    const rect = activeCover ? activeCover.getBoundingClientRect() : { left: window.innerWidth * 0.4, top: window.innerHeight * 0.3, width: 220, height: 320 };

    detailSheet.style.visibility = 'visible';
    detailSheet.setAttribute('aria-hidden', 'false');

    if (instant) {
      detailSheet.style.clipPath = 'inset(0px 0px 0px 0px round 0px)';
      detailSheet.style.transform = 'rotate(0deg)';
      const maskedLines = detailSheet.querySelectorAll('.sheet-mask-wrap > *');
      maskedLines.forEach(line => {
        line.style.transform = 'translateY(0%)';
      });
      return;
    }

    const originX = rect.left + rect.width / 2;
    const originY = rect.top + rect.height / 2;
    detailSheet.style.transformOrigin = `${originX}px ${originY}px`;

    // Growth Web Animation from cover rect & -4.5deg tilt to full screen & 0deg
    const insetTop = Math.max(0, rect.top);
    const insetRight = Math.max(0, window.innerWidth - rect.right);
    const insetBottom = Math.max(0, window.innerHeight - rect.bottom);
    const insetLeft = Math.max(0, rect.left);

    const growthAnim = detailSheet.animate([
      {
        clipPath: `inset(${insetTop}px ${insetRight}px ${insetBottom}px ${insetLeft}px round 4px)`,
        transform: 'rotate(-4.5deg)'
      },
      {
        clipPath: 'inset(0px 0px 0px 0px round 0px)',
        transform: 'rotate(0deg)'
      }
    ], {
      duration: 1050,
      easing: 'cubic-bezier(.76, 0, .18, 1)',
      fill: 'both'
    });

    growthAnim.onfinish = () => {
      detailSheet.style.clipPath = 'none';
      detailSheet.style.transform = 'none';
    };

    // Staggered text lines rise out of their masks
    const maskedLines = detailSheet.querySelectorAll('.sheet-mask-wrap > *');
    maskedLines.forEach((line, idx) => {
      line.animate([
        { transform: 'translateY(110%)' },
        { transform: 'translateY(0%)' }
      ], {
        duration: 900,
        delay: 600 + idx * 70,
        easing: 'cubic-bezier(.2, .8, .2, 1)',
        fill: 'both'
      });
    });
  }

  function closeDetail() {
    if (!isOpen) return;

    const activeTape = tapeObjects.find(t => t.v === Math.round(s));
    const activeCover = activeTape ? activeTape.cvFace : document.querySelector('.face.cv');
    const rect = activeCover ? activeCover.getBoundingClientRect() : null;

    const insetTop = rect ? Math.max(0, rect.top) : 0;
    const insetRight = rect ? Math.max(0, window.innerWidth - rect.right) : 0;
    const insetBottom = rect ? Math.max(0, window.innerHeight - rect.bottom) : 0;
    const insetLeft = rect ? Math.max(0, rect.left) : 0;

    const originX = rect ? rect.left + rect.width / 2 : window.innerWidth / 2;
    const originY = rect ? rect.top + rect.height / 2 : window.innerHeight / 2;
    detailSheet.style.transformOrigin = `${originX}px ${originY}px`;

    const closeAnim = detailSheet.animate([
      {
        clipPath: 'inset(0px 0px 0px 0px round 0px)',
        transform: 'rotate(0deg)'
      },
      {
        clipPath: `inset(${insetTop}px ${insetRight}px ${insetBottom}px ${insetLeft}px round 4px)`,
        transform: 'rotate(-4.5deg)'
      }
    ], {
      duration: 850,
      easing: 'cubic-bezier(.76, 0, .18, 1)',
      fill: 'both'
    });

    closeAnim.onfinish = () => {
      detailSheet.style.visibility = 'hidden';
      detailSheet.setAttribute('aria-hidden', 'true');
      detailSheet.style.clipPath = 'none';
      detailSheet.style.transform = 'none';
      isOpen = false;
      document.body.classList.remove('sheet-open');
      if (customCursor) customCursor.classList.remove('hidden-cursor');
    };
  }

  if (sheetCloseBtn) sheetCloseBtn.addEventListener('click', closeDetail);
  if (playRing) playRing.addEventListener('click', (e) => {
    e.stopPropagation();
    openDetail();
  });

  // --- 9. POINTER & CURSOR TRACKING ---
  window.addEventListener('pointermove', (e) => {
    mx = e.clientX;
    my = e.clientY;

    const target = e.target;
    isHoveringInteractive = !!(target.closest('button') || target.closest('a') || target.closest('select') || target.closest('input'));

    const isInsideDrawerOrModal = !!(
      target.closest('.slide-drawer') ||
      target.closest('.checkout-modal') ||
      target.closest('.book-detail-sheet') ||
      target.closest('.drawer-backdrop') ||
      target.closest('.checkout-modal-backdrop') ||
      document.body.classList.contains('drawer-open') ||
      document.body.classList.contains('modal-open') ||
      document.body.classList.contains('sheet-open')
    );

    if (customCursor) {
      if (isInsideDrawerOrModal) {
        customCursor.classList.add('hidden-cursor');
      } else {
        customCursor.classList.remove('hidden-cursor');
      }
    }
  });

  // Track pointer on fine pointers
  document.addEventListener('pointerdown', (e) => {
    if (isOpen) return;
    if (e.target.closest('#shelf-3d-stage') || e.target.closest('.shelf-arrow-btn') || e.target.closest('.hero-shelf-container')) {
      if (e.target.closest('.shelf-arrow-btn') || e.target.closest('#hero-play-ring')) return;
      isDragging = true;
      dragStartX = e.clientX;
      dragT0 = T;
      dragDistance = 0;
    }
  });

  window.addEventListener('pointermove', (e) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStartX;
    dragDistance = Math.abs(dx);
    T = dragT0 - dx / (ws + gap);
  });

  window.addEventListener('pointerup', () => {
    if (isDragging) {
      isDragging = false;
      T = Math.round(T);
      if (dragDistance > 6) {
        dragJustEnded = true;
        setTimeout(() => { dragJustEnded = false; }, 100);
      }
    }
  });

  window.addEventListener('pointercancel', () => {
    if (isDragging) {
      isDragging = false;
      T = Math.round(T);
    }
  });

  // Dedicated Mobile Touch Drag Physics on shelfStage
  let isTouching = false;
  let touchStartX = 0;
  let touchT0 = 0;
  let touchDistance = 0;

  shelfStage.addEventListener('touchstart', (e) => {
    if (isOpen) return;
    if (e.target.closest('.shelf-arrow-btn') || e.target.closest('#hero-play-ring')) return;
    if (e.touches && e.touches.length === 1) {
      isTouching = true;
      touchStartX = e.touches[0].clientX;
      touchT0 = T;
      touchDistance = 0;
    }
  }, { passive: true });

  shelfStage.addEventListener('touchmove', (e) => {
    if (!isTouching || !e.touches || e.touches.length !== 1) return;
    const dx = e.touches[0].clientX - touchStartX;
    touchDistance = Math.abs(dx);
    if (touchDistance > 6) {
      T = touchT0 - dx / (ws + gap);
    }
  }, { passive: true });

  shelfStage.addEventListener('touchend', () => {
    if (isTouching) {
      isTouching = false;
      T = Math.round(T);
      if (touchDistance > 6) {
        dragJustEnded = true;
        setTimeout(() => { dragJustEnded = false; }, 120);
      }
    }
  });

  shelfStage.addEventListener('touchcancel', () => {
    if (isTouching) {
      isTouching = false;
      T = Math.round(T);
    }
  });

  // Shelf stage click handler (handles clicks on open cover, play ring, and spines)
  shelfStage.addEventListener('click', (e) => {
    if (isOpen) return;
    if (dragJustEnded) return;

    // Play ring clicked
    if (e.target.closest('#hero-play-ring')) {
      openDetail();
      return;
    }

    const stageRect = shelfStage.getBoundingClientRect();
    const shelfCenterX = window.innerWidth / 2;
    const shelfCenterY = stageRect.top + stageRect.height / 2;

    // Check if clicked inside active cover area (or active cover face)
    const isClickOnCover = (
      e.target.closest('.face.cv') ||
      (Math.abs(e.clientX - shelfCenterX) < (0.55 * d) &&
       Math.abs(e.clientY - shelfCenterY) < (0.55 * H) &&
       Math.abs(T - s) < 0.45)
    );

    if (isClickOnCover) {
      openDetail();
      return;
    }

    // Check if clicked on a book spine
    const clickedTape = e.target.closest('.tape');
    if (clickedTape) {
      const v = parseInt(clickedTape.getAttribute('data-v'), 10);
      const tapeObj = tapeObjects.find(t => t.v === v);
      if (tapeObj) {
        if (Math.abs(tapeObj.r) < 0.5) {
          openDetail();
        } else {
          T = Math.round(T + tapeObj.r);
        }
        return;
      }
    }

    // If clicked on the shelf area to the left or right of the cover
    const relX = e.clientX - shelfCenterX;
    if (Math.abs(relX) > 0.55 * d) {
      const step = ws + gap;
      const clickedR = Math.round(relX / step);
      if (clickedR !== 0) {
        T = Math.round(T + clickedR);
      }
    }
  });

  // Mouse wheel scrolling
  shelfStage.addEventListener('wheel', (e) => {
    if (isOpen) return;
    e.preventDefault();
    const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
    T += (delta / (ws + gap)) * 0.45;

    clearTimeout(wheelSnapTimer);
    wheelSnapTimer = setTimeout(() => {
      T = Math.round(T);
    }, 160);
  }, { passive: false });

  // Arrow buttons
  if (prevBtn) prevBtn.addEventListener('click', () => { T = Math.round(T) - 1; });
  if (nextBtn) nextBtn.addEventListener('click', () => { T = Math.round(T) + 1; });

  // Keyboard navigation
  window.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT' || e.target.tagName === 'TEXTAREA') return;

    if (e.key === 'Escape' && isOpen) {
      closeDetail();
    } else if (e.key === 'Enter' && !isOpen) {
      e.preventDefault();
      openDetail();
    } else if (e.key === 'ArrowLeft' && !isOpen) {
      T = Math.round(T) - 1;
    } else if (e.key === 'ArrowRight' && !isOpen) {
      T = Math.round(T) + 1;
    }
  });

  // --- 10. REQUEST ANIMATION FRAME PHYSICS LOOP ---
  let lastTime = performance.now();

  function tick(now) {
    const dt = Math.min((now - lastTime) / 1000, 0.05);
    lastTime = now;

    // Spring physics for scroll s towards target T
    const k = isDragging ? 18 : 5.2;
    s += (T - s) * (1 - Math.exp(-k * dt));

    if (Math.abs(T - s) < 1e-4 && !isDragging) {
      s = T;
    }

    // Normalise loops if scrolled too far
    if (s > 28) {
      s -= 12;
      T -= 12;
    } else if (s < 8) {
      s += 12;
      T += 12;
    }

    // Active book change detection
    const currentActiveIdx = ((Math.round(s) % 12) + 12) % 12;
    if (currentActiveIdx !== activeBookIndex) {
      const dir = Math.sign(T - s) || 1;
      activeBookIndex = currentActiveIdx;
      updateMaskedCaption(books[activeBookIndex], dir);
      syncTabWithBook(books[activeBookIndex]);
    }

    // Custom cursor smoothing
    cx += (mx - cx) * (1 - Math.exp(-16 * dt));
    cy += (my - cy) * (1 - Math.exp(-16 * dt));
    customCursor.style.transform = `translate3d(${cx.toFixed(2)}px, ${cy.toFixed(2)}px, 0)`;

    // Tilt towards cursor on open cover
    const stageRect = shelfStage.getBoundingClientRect();
    const shelfCenterX = window.innerWidth / 2;
    const shelfCenterY = stageRect.top + stageRect.height / 2;

    const onCover = (
      Math.abs(mx - shelfCenterX) < (0.55 * d) &&
      Math.abs(my - shelfCenterY) < (0.55 * H) &&
      !isOpen &&
      Math.abs(T - s) < 0.35
    );

    if (onCover) {
      const targetTiltY = ((mx - shelfCenterX) / (0.55 * d)) * 9;
      const targetTiltX = -((my - shelfCenterY) / (H * 0.5)) * 6;
      tiltY += (targetTiltY - tiltY) * (1 - Math.exp(-7 * dt));
      tiltX += (targetTiltX - tiltX) * (1 - Math.exp(-7 * dt));
    } else {
      const targetTiltY = ((mx - shelfCenterX) / window.innerWidth) * 5;
      tiltY += (targetTiltY - tiltY) * (1 - Math.exp(-7 * dt));
      tiltX += (0 - tiltX) * (1 - Math.exp(-7 * dt));
    }

    // Custom cursor state update
    const isHiddenCursor = (
      isOpen ||
      document.body.classList.contains('drawer-open') ||
      document.body.classList.contains('modal-open') ||
      document.body.classList.contains('sheet-open') ||
      customCursor.classList.contains('hidden-cursor')
    );

    if (isHiddenCursor) {
      customCursor.className = 'custom-cursor hidden-cursor';
    } else if (onCover) {
      customCursor.className = 'custom-cursor state-view';
    } else if (isHoveringInteractive) {
      customCursor.className = 'custom-cursor state-btn';
    } else if (hoveredTapeObj && Math.abs(hoveredTapeObj.r) > 0.5) {
      customCursor.className = 'custom-cursor state-spine';
    } else {
      customCursor.className = 'custom-cursor';
    }

    // Play ring scale animation (shelf-hero-spec.md Section 4: pops in when shelf settles, hides when moving or open)
    if (playRing) {
      const playScale = isOpen ? 0 : smoothstep(Math.max(0, 1 - Math.abs(T - s) * 3));
      playRing.style.transform = `translate(-50%, -50%) scale(${playScale.toFixed(3)})`;
      playRing.style.pointerEvents = playScale > 0.1 ? 'auto' : 'none';
    }

    // Update each of the 36 tapes in 3D space
    const W = shelfStage.clientWidth;

    for (let j = 0; j < tapeObjects.length; j++) {
      const tape = tapeObjects[j];
      const v = tape.v;

      let r = (v - s) % 36;
      if (r > 18) r -= 36;
      if (r < -18) r += 36;
      tape.r = r;

      // Continuous step B(r)
      let Br;
      if (Math.abs(r) < 1) {
        Br = (r + Math.sin(Math.PI * r) / Math.PI) / 2;
      } else {
        Br = 0.5 * Math.sign(r);
      }

      const x = r * (ws + gap) + (d - ws + 1.6 * gap) * Br;

      // Culling off-screen tapes
      if (Math.abs(x) > W / 2 + 1.6 * d) {
        tape.el.style.visibility = 'hidden';
        continue;
      }
      tape.el.style.visibility = 'visible';

      // Openness o
      const rawO = Math.max(0, 1 - Math.abs(r));
      const o = smoothstep(rawO);

      // Hover lift
      tape.lift += (tape.targetLift - tape.lift) * (1 - Math.exp(-12 * dt));

      // 3D rotation & translation formulas from shelf-hero-spec.md
      const rotY = -90 * o + tiltY * o;
      const rotX = tiltX * o;
      const rotZ = -4.5 * o;
      const transZ = o * 0.2 * H;
      const transY = -o * 0.025 * H - tape.lift * 0.045 * H;

      tape.el.style.transform = `translate3d(${x.toFixed(2)}px, ${transY.toFixed(2)}px, ${transZ.toFixed(2)}px) rotateZ(${rotZ.toFixed(2)}deg) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg)`;
      tape.el.style.zIndex = Math.round(100 - Math.abs(r) * 4);

      // Shading opacity overlay on faces
      tape.spFace.style.setProperty('--shade', (o * 0.55).toFixed(3));
      tape.cvFace.style.setProperty('--shade', ((1 - o) * 0.5).toFixed(3));
    }

    // Update Floating Play Ring on active cover
    const playScale = isOpen ? 0 : smoothstep(Math.max(0, 1 - Math.abs(T - s) * 3));
    playRing.style.transform = `translate(-50%, -50%) scale(${playScale.toFixed(3)})`;
    playRing.style.pointerEvents = playScale > 0.5 ? 'auto' : 'none';

    requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);

  // --- 11. PRICE PARSER & TOAST NOTIFICATION ---
  function parsePrice(str) {
    if (typeof str === 'number') return str;
    if (!str) return 0;
    const num = parseInt(String(str).replace(/[^\d]/g, ''), 10);
    return isNaN(num) ? 0 : num;
  }

  function showToast(message) {
    let toast = document.querySelector('.bookloop-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'bookloop-toast';
      document.body.appendChild(toast);
    }
    toast.innerHTML = `
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#deb05c" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
      <span>${message}</span>
    `;
    toast.classList.add('show');

    clearTimeout(toast.timeout);
    toast.timeout = setTimeout(() => {
      toast.classList.remove('show');
    }, 2400);
  }

  // --- 12. WISHLIST MANAGEMENT (localStorage only) ---
  const STORAGE_WISHLIST = 'bookloop_wishlist';

  function getWishlist() {
    try {
      const raw = localStorage.getItem(STORAGE_WISHLIST);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  }

  function saveWishlist(list) {
    try {
      localStorage.setItem(STORAGE_WISHLIST, JSON.stringify(list));
    } catch (e) {}
  }

  function toggleWishlist(bookId) {
    const list = getWishlist();
    const idx = list.indexOf(bookId);
    let added = false;
    if (idx !== -1) {
      list.splice(idx, 1);
      added = false;
    } else {
      list.push(bookId);
      added = true;
    }
    saveWishlist(list);
    updateWishlistUI();
    showToast(added ? 'Saved to Wishlist' : 'Removed from Wishlist');
  }

  function removeFromWishlist(bookId) {
    const list = getWishlist().filter(id => id !== bookId);
    saveWishlist(list);
    updateWishlistUI();
    showToast('Removed from Wishlist');
  }

  function clearWishlist() {
    saveWishlist([]);
    updateWishlistUI();
    showToast('Wishlist cleared');
  }

  function updateWishlistUI() {
    const list = getWishlist();
    const count = list.length;

    // Header badge
    const headerWishlistBadge = document.getElementById('wishlist-badge');
    if (headerWishlistBadge) {
      headerWishlistBadge.textContent = count;
      headerWishlistBadge.style.display = count > 0 ? 'flex' : 'none';
    }

    // Mobile drawer count
    const mobileWishlistCount = document.getElementById('mobile-wishlist-count');
    if (mobileWishlistCount) {
      mobileWishlistCount.textContent = count;
    }

    // Drawer count chip
    const drawerCountChip = document.getElementById('wishlist-drawer-count');
    if (drawerCountChip) {
      drawerCountChip.textContent = `${count} ${count === 1 ? 'saved' : 'saved'}`;
    }

    // Drawer footer visibility
    const wishlistFooter = document.getElementById('wishlist-footer');
    if (wishlistFooter) {
      wishlistFooter.style.display = count > 0 ? 'flex' : 'none';
    }

    // Sync card heart icons in DOM
    document.querySelectorAll('.book-card').forEach(card => {
      const bookId = card.getAttribute('data-book-id');
      const heartBtn = card.querySelector('.card-wishlist-btn');
      const heartSvgPath = heartBtn ? heartBtn.querySelector('svg path') : null;
      if (heartBtn && bookId) {
        const isSaved = list.includes(bookId);
        if (isSaved) {
          heartBtn.classList.add('active');
          if (heartSvgPath) heartSvgPath.setAttribute('fill', 'currentColor');
        } else {
          heartBtn.classList.remove('active');
          if (heartSvgPath) heartSvgPath.setAttribute('fill', 'none');
        }
      }
    });

    // Render Wishlist Drawer Items
    const container = document.getElementById('wishlist-items-container');
    if (!container) return;

    if (count === 0) {
      container.innerHTML = `
        <div class="drawer-empty-state">
          <div class="drawer-empty-icon">
            <img src="assets/stickers/heart.png" alt="" class="sticker-icon" style="width: 44px; height: 44px; object-fit: contain;" />
          </div>
          <h4 class="drawer-empty-title">Your wishlist is empty</h4>
          <p class="drawer-empty-desc">Tap the heart on any book to save it for later.</p>
        </div>
      `;
      return;
    }

    const savedBooks = list.map(id => books.find(b => b.id === id)).filter(Boolean);
    container.innerHTML = savedBooks.map(book => `
      <div class="drawer-item-card" data-book-id="${book.id}">
        <img src="${book.cover}" alt="${book.title}" class="drawer-item-thumb" onerror="this.src='assets/covers/midnight-library.jpg';" />
        <div class="drawer-item-info">
          <div class="drawer-item-top">
            <h4 class="drawer-item-title">${book.title}</h4>
            <span class="drawer-item-author">By ${book.author}</span>
            <div class="drawer-badge-row">
              <span class="drawer-condition-pill">${book.condition}</span>
              <span class="drawer-item-calc">${book.genre}</span>
            </div>
          </div>
          <div class="drawer-item-actions">
            <button class="drawer-remove-btn" type="button" data-remove-wishlist="${book.id}">
              <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              Remove
            </button>
            <div class="drawer-action-split-btns">
              <button class="drawer-mini-btn buy" type="button" data-wishlist-buy="${book.id}">BUY ${book.buyPrice}</button>
              <button class="drawer-mini-btn rent" type="button" data-wishlist-rent="${book.id}">RENT ${book.rentPrice}</button>
            </div>
          </div>
        </div>
      </div>
    `).join('');

    // Attach listeners for wishlist item actions
    container.querySelectorAll('[data-remove-wishlist]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.getAttribute('data-remove-wishlist');
        removeFromWishlist(id);
      });
    });

    container.querySelectorAll('[data-wishlist-buy]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.getAttribute('data-wishlist-buy');
        addToCart(id, 'buy');
      });
    });

    container.querySelectorAll('[data-wishlist-rent]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.getAttribute('data-wishlist-rent');
        addToCart(id, 'rent', 1);
      });
    });
  }

  // --- 13. CART MANAGEMENT (localStorage only) ---
  const STORAGE_CART = 'bookloop_cart';

  function getCart() {
    try {
      const raw = localStorage.getItem(STORAGE_CART);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  }

  function saveCart(cart) {
    try {
      localStorage.setItem(STORAGE_CART, JSON.stringify(cart));
    } catch (e) {}
  }

  function addToCart(bookId, type = 'buy', weeks = 1) {
    const book = books.find(b => b.id === bookId);
    if (!book) return;

    const cart = getCart();
    const existing = cart.find(i => i.bookId === bookId && i.type === type);

    if (existing) {
      if (type === 'buy') {
        existing.quantity = (existing.quantity || 1) + 1;
      } else {
        existing.quantity = (existing.quantity || 1) + 1;
      }
    } else {
      cart.push({
        id: `${bookId}_${type}_${Date.now()}`,
        bookId: bookId,
        type: type,
        quantity: 1,
        weeks: type === 'rent' ? Math.max(1, Math.min(8, weeks || 1)) : 1
      });
    }

    saveCart(cart);
    updateCartUI();
    showToast('Added to cart');
  }

  function removeFromCart(itemId) {
    const cart = getCart().filter(i => i.id !== itemId);
    saveCart(cart);
    updateCartUI();
    showToast('Removed from cart');
  }

  function updateCartItemQty(itemId, delta) {
    const cart = getCart();
    const item = cart.find(i => i.id === itemId);
    if (item) {
      item.quantity = (item.quantity || 1) + delta;
      if (item.quantity <= 0) {
        removeFromCart(itemId);
        return;
      }
      saveCart(cart);
      updateCartUI();
    }
  }

  function updateCartItemWeeks(itemId, weeks) {
    const cart = getCart();
    const item = cart.find(i => i.id === itemId);
    if (item && item.type === 'rent') {
      item.weeks = Math.max(1, Math.min(8, parseInt(weeks, 10) || 1));
      saveCart(cart);
      updateCartUI();
    }
  }

  function clearCart() {
    saveCart([]);
    updateCartUI();
  }

  function updateCartUI() {
    const cart = getCart();
    const totalCount = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);

    // Header Cart Badge
    const headerCartBadge = document.getElementById('cart-badge');
    if (headerCartBadge) {
      headerCartBadge.textContent = totalCount;
      headerCartBadge.style.display = totalCount > 0 ? 'flex' : 'none';
    }

    // Drawer count chip
    const cartDrawerCount = document.getElementById('cart-drawer-count');
    if (cartDrawerCount) {
      cartDrawerCount.textContent = `${totalCount} ${totalCount === 1 ? 'item' : 'items'}`;
    }

    // Drawer footer visibility & checkout button
    const cartFooter = document.getElementById('cart-footer');
    const container = document.getElementById('cart-items-container');
    if (!container) return;

    if (cart.length === 0) {
      container.innerHTML = `
        <div class="drawer-empty-state">
          <div class="drawer-empty-icon">
            <img src="assets/stickers/cart.png" alt="" class="sticker-icon" style="width: 44px; height: 44px; object-fit: contain;" />
          </div>
          <h4 class="drawer-empty-title">Your bag is empty</h4>
          <p class="drawer-empty-desc">Find books to buy or rent for a few weeks.</p>
        </div>
      `;
      if (cartFooter) cartFooter.style.display = 'none';
      const subtotalEl = document.getElementById('cart-subtotal-val');
      const totalEl = document.getElementById('cart-total-val');
      if (subtotalEl) subtotalEl.textContent = '₹0';
      if (totalEl) totalEl.textContent = '₹0';
      return;
    }

    if (cartFooter) cartFooter.style.display = 'flex';

    let grandTotal = 0;

    container.innerHTML = cart.map(item => {
      const book = books.find(b => b.id === item.bookId) || {
        id: item.bookId,
        title: 'Book Volume',
        author: 'Author',
        buyPrice: '₹299',
        rentPrice: '₹40/week',
        cover: 'assets/covers/midnight-library.jpg',
        condition: 'GOOD'
      };

      const isRent = item.type === 'rent';
      const weeks = isRent ? (item.weeks || 1) : 1;
      const qty = item.quantity || 1;
      let linePrice = 0;
      let calcNote = '';

      if (isRent) {
        const weeklyRate = parsePrice(book.rentPrice);
        linePrice = weeklyRate * weeks * qty;
        calcNote = `₹${weeklyRate}/wk × ${weeks} ${weeks === 1 ? 'wk' : 'wks'}${qty > 1 ? ` × ${qty}` : ''}`;
      } else {
        const unitPrice = parsePrice(book.buyPrice);
        linePrice = unitPrice * qty;
        calcNote = qty > 1 ? `₹${unitPrice} × ${qty}` : `Buy price`;
      }

      grandTotal += linePrice;

      return `
        <div class="drawer-item-card" data-cart-id="${item.id}">
          <img src="${book.cover}" alt="${book.title}" class="drawer-item-thumb" onerror="this.src='assets/covers/midnight-library.jpg';" />
          <div class="drawer-item-info">
            <div class="drawer-item-top">
              <h4 class="drawer-item-title">${book.title}</h4>
              <span class="drawer-item-author">By ${book.author}</span>
              <div class="drawer-badge-row">
                <span class="cart-type-pill ${item.type}">${isRent ? 'RENTAL' : 'PURCHASE'}</span>
                <span class="drawer-condition-pill">${book.condition}</span>
              </div>
            </div>

            <div class="drawer-item-controls">
              ${isRent ? `
                <div class="rental-weeks-wrap">
                  <span class="rental-weeks-label">Duration:</span>
                  <select class="rental-weeks-select" data-cart-id="${item.id}">
                    ${[1, 2, 3, 4, 5, 6, 7, 8].map(w => `
                      <option value="${w}" ${w === weeks ? 'selected' : ''}>${w} ${w === 1 ? 'week' : 'weeks'}</option>
                    `).join('')}
                  </select>
                </div>
              ` : `
                <div class="cart-qty-wrap">
                  <button type="button" class="cart-qty-btn cart-qty-minus" data-cart-id="${item.id}" aria-label="Decrease quantity">-</button>
                  <span class="cart-qty-val">${qty}</span>
                  <button type="button" class="cart-qty-btn cart-qty-plus" data-cart-id="${item.id}" aria-label="Increase quantity">+</button>
                </div>
              `}

              <div class="drawer-item-price-block">
                <div class="drawer-item-price">₹${linePrice}</div>
                <div class="drawer-item-calc">${calcNote}</div>
              </div>
            </div>

            <div class="drawer-item-actions">
              <button class="drawer-remove-btn" type="button" data-remove-cart="${item.id}">
                <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                Remove
              </button>
            </div>
          </div>
        </div>
      `;
    }).join('');

    // Update totals
    const subtotalEl = document.getElementById('cart-subtotal-val');
    const totalEl = document.getElementById('cart-total-val');
    if (subtotalEl) subtotalEl.textContent = `₹${grandTotal}`;
    if (totalEl) totalEl.textContent = `₹${grandTotal}`;

    // Attach listeners for cart actions
    container.querySelectorAll('.rental-weeks-select').forEach(select => {
      select.addEventListener('change', (e) => {
        const id = select.getAttribute('data-cart-id');
        updateCartItemWeeks(id, e.target.value);
      });
    });

    container.querySelectorAll('.cart-qty-minus').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.getAttribute('data-cart-id');
        updateCartItemQty(id, -1);
      });
    });

    container.querySelectorAll('.cart-qty-plus').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.getAttribute('data-cart-id');
        updateCartItemQty(id, 1);
      });
    });

    container.querySelectorAll('[data-remove-cart]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.getAttribute('data-remove-cart');
        removeFromCart(id);
      });
    });
  }

  // --- 14. DRAWERS & MODAL OPEN/CLOSE SYSTEM ---
  const wishlistDrawer = document.getElementById('wishlist-drawer');
  const wishlistBackdrop = document.getElementById('wishlist-backdrop');
  const wishlistBtn = document.getElementById('header-wishlist-btn');
  const wishlistCloseBtn = document.getElementById('wishlist-close-btn');
  const wishlistClearBtn = document.getElementById('wishlist-clear-btn');

  const cartDrawer = document.getElementById('cart-drawer');
  const cartBackdrop = document.getElementById('cart-backdrop');
  const cartBtn = document.getElementById('header-cart-btn');
  const cartCloseBtn = document.getElementById('cart-close-btn');

  function openWishlistDrawer() {
    closeCartDrawer();
    closeCheckoutModal();
    updateWishlistUI();
    document.body.classList.add('drawer-open');
    if (customCursor) customCursor.classList.add('hidden-cursor');
    if (wishlistDrawer && wishlistBackdrop) {
      wishlistBackdrop.classList.add('open');
      wishlistDrawer.classList.add('open');
      wishlistDrawer.setAttribute('aria-hidden', 'false');
    }
  }

  function closeWishlistDrawer() {
    document.body.classList.remove('drawer-open');
    if (customCursor) customCursor.classList.remove('hidden-cursor');
    if (wishlistDrawer && wishlistBackdrop) {
      wishlistBackdrop.classList.remove('open');
      wishlistDrawer.classList.remove('open');
      wishlistDrawer.setAttribute('aria-hidden', 'true');
    }
  }

  function openCartDrawer() {
    closeWishlistDrawer();
    closeCheckoutModal();
    updateCartUI();
    document.body.classList.add('drawer-open');
    if (customCursor) customCursor.classList.add('hidden-cursor');
    if (cartDrawer && cartBackdrop) {
      cartBackdrop.classList.add('open');
      cartDrawer.classList.add('open');
      cartDrawer.setAttribute('aria-hidden', 'false');
    }
  }

  function closeCartDrawer() {
    document.body.classList.remove('drawer-open');
    if (customCursor) customCursor.classList.remove('hidden-cursor');
    if (cartDrawer && cartBackdrop) {
      cartBackdrop.classList.remove('open');
      cartDrawer.classList.remove('open');
      cartDrawer.setAttribute('aria-hidden', 'true');
    }
  }

  if (wishlistBtn) wishlistBtn.addEventListener('click', openWishlistDrawer);
  if (wishlistCloseBtn) wishlistCloseBtn.addEventListener('click', closeWishlistDrawer);
  if (wishlistBackdrop) wishlistBackdrop.addEventListener('click', closeWishlistDrawer);
  if (wishlistClearBtn) wishlistClearBtn.addEventListener('click', clearWishlist);

  if (cartBtn) cartBtn.addEventListener('click', openCartDrawer);
  if (cartCloseBtn) cartCloseBtn.addEventListener('click', closeCartDrawer);
  if (cartBackdrop) cartBackdrop.addEventListener('click', closeCartDrawer);

  // --- 15. CHECKOUT FLOW ---
  const checkoutBackdrop = document.getElementById('checkout-backdrop');
  const checkoutCloseBtn = document.getElementById('checkout-close-btn');
  const checkoutFormView = document.getElementById('checkout-form-view');
  const checkoutSuccessView = document.getElementById('checkout-success-view');
  const checkoutForm = document.getElementById('checkout-form');
  const checkoutSummaryCount = document.getElementById('checkout-summary-count');
  const checkoutSummaryTotal = document.getElementById('checkout-summary-total');
  const btnSuccessClose = document.getElementById('btn-success-close');
  const cartCheckoutBtn = document.getElementById('cart-checkout-btn');

  function openCheckoutModal() {
    const cart = getCart();
    if (cart.length === 0) {
      showToast('Your cart is empty');
      return;
    }
    closeCartDrawer();
    closeWishlistDrawer();

    document.body.classList.add('modal-open');
    if (customCursor) customCursor.classList.add('hidden-cursor');

    if (checkoutFormView) checkoutFormView.style.display = 'block';
    if (checkoutSuccessView) checkoutSuccessView.style.display = 'none';

    // Calculate checkout summary
    const totalCount = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
    let grandTotal = 0;
    cart.forEach(item => {
      const book = books.find(b => b.id === item.bookId);
      if (!book) return;
      if (item.type === 'rent') {
        grandTotal += parsePrice(book.rentPrice) * (item.weeks || 1) * (item.quantity || 1);
      } else {
        grandTotal += parsePrice(book.buyPrice) * (item.quantity || 1);
      }
    });

    if (checkoutSummaryCount) {
      checkoutSummaryCount.textContent = `${totalCount} ${totalCount === 1 ? 'item' : 'items'}`;
    }
    if (checkoutSummaryTotal) {
      checkoutSummaryTotal.textContent = `Total: ₹${grandTotal}`;
    }

    if (checkoutBackdrop) {
      checkoutBackdrop.classList.add('open');
    }
  }

  function closeCheckoutModal() {
    document.body.classList.remove('modal-open');
    if (customCursor) customCursor.classList.remove('hidden-cursor');
    if (checkoutBackdrop) {
      checkoutBackdrop.classList.remove('open');
    }
  }

  if (cartCheckoutBtn) cartCheckoutBtn.addEventListener('click', openCheckoutModal);
  if (checkoutCloseBtn) checkoutCloseBtn.addEventListener('click', closeCheckoutModal);
  if (checkoutBackdrop) {
    checkoutBackdrop.addEventListener('click', (e) => {
      if (e.target === checkoutBackdrop) closeCheckoutModal();
    });
  }
  if (btnSuccessClose) btnSuccessClose.addEventListener('click', closeCheckoutModal);

  if (checkoutForm) {
    checkoutForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('checkout-name')?.value.trim() || 'Reader';
      const address = document.getElementById('checkout-address')?.value.trim() || 'Address';

      const cart = getCart();
      const orderId = `BL-${Math.floor(100000 + Math.random() * 900000)}`;
      const orderDate = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

      let grandTotal = 0;
      const itemsSummary = cart.map(item => {
        const book = books.find(b => b.id === item.bookId);
        const title = book ? book.title : 'Volume';
        let cost = 0;
        let desc = '';
        if (item.type === 'rent') {
          cost = parsePrice(book?.rentPrice) * (item.weeks || 1) * (item.quantity || 1);
          desc = `${item.weeks || 1} wks rent`;
        } else {
          cost = parsePrice(book?.buyPrice) * (item.quantity || 1);
          desc = `${item.quantity || 1}x purchase`;
        }
        grandTotal += cost;
        return { title, desc, cost };
      });

      const successUserMsg = document.getElementById('success-user-msg');
      if (successUserMsg) {
        successUserMsg.textContent = `Thank you, ${name}! Your order #${orderId} has been confirmed.`;
      }

      const successDetailsCard = document.getElementById('success-details-card');
      if (successDetailsCard) {
        successDetailsCard.innerHTML = `
          <div class="success-detail-row">
            <span>Order Number:</span>
            <strong>#${orderId}</strong>
          </div>
          <div class="success-detail-row">
            <span>Date:</span>
            <span>${orderDate}</span>
          </div>
          <div class="success-detail-row">
            <span>Deliver to:</span>
            <span>${address.slice(0, 36)}${address.length > 36 ? '...' : ''}</span>
          </div>
          <div class="success-items-list">
            ${itemsSummary.map(i => `
              <div class="success-item-entry">
                <span>${i.title} (${i.desc})</span>
                <strong>₹${i.cost}</strong>
              </div>
            `).join('')}
          </div>
          <div class="success-detail-row bold">
            <span>Total Paid (Zero Charge):</span>
            <span>₹${grandTotal}</span>
          </div>
        `;
      }

      if (checkoutFormView) checkoutFormView.style.display = 'none';
      if (checkoutSuccessView) checkoutSuccessView.style.display = 'block';

      // Persist order to localStorage
      try {
        const pastOrders = JSON.parse(localStorage.getItem('bookloop_orders') || '[]');
        pastOrders.unshift({
          id: orderId,
          date: orderDate,
          recipient: name,
          address: address,
          items: itemsSummary,
          total: grandTotal,
          timestamp: Date.now()
        });
        localStorage.setItem('bookloop_orders', JSON.stringify(pastOrders));
      } catch (err) {
        console.error('Error saving order history:', err);
      }

      // Clear the cart completely
      clearCart();
      checkoutForm.reset();
    });
  }

  // Global Escape key to dismiss drawers or modal
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeWishlistDrawer();
      closeCartDrawer();
      closeCheckoutModal();
      closeModal('sell-modal-backdrop');
      closeModal('treasure-modal-backdrop');
      closeModal('auth-modal-backdrop');
      closeModal('orders-modal-backdrop');
      closeModal('info-modal-backdrop');
      closeModal('delete-modal-backdrop');
      if (typeof closeMobileNav === 'function') closeMobileNav();
      if (isOpen) closeDetail();
      document.body.classList.remove('drawer-open', 'modal-open', 'sheet-open');
      if (customCursor) customCursor.classList.remove('hidden-cursor');
    }
  });

  // --- 16. HERO CTA & DETAIL SHEET BUY/RENT CLICKS ---
  if (heroBuyBtn) {
    heroBuyBtn.addEventListener('click', () => {
      const book = books[activeBookIndex];
      if (book) addToCart(book.id, 'buy');
    });
  }

  if (heroRentBtn) {
    heroRentBtn.addEventListener('click', () => {
      const book = books[activeBookIndex];
      if (book) addToCart(book.id, 'rent', 1);
    });
  }

  if (sheetBuyBtn) {
    sheetBuyBtn.addEventListener('click', () => {
      const book = currentSheetBook || books[activeBookIndex];
      if (book) {
        addToCart(book.id, 'buy');
        closeDetail();
      }
    });
  }

  if (sheetRentBtn) {
    sheetRentBtn.addEventListener('click', () => {
      const book = currentSheetBook || books[activeBookIndex];
      if (book) {
        addToCart(book.id, 'rent', 1);
        closeDetail();
      }
    });
  }

  // Search Buy/Rent toggle
  const searchToggles = document.querySelectorAll('.buy-rent-toggle-btn');
  searchToggles.forEach(btn => {
    btn.addEventListener('click', () => {
      searchToggles.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });

  // Genre aisle navigation buttons (smooth scroll carousel)
  const genrePrev = document.getElementById('genre-prev');
  const genreNext = document.getElementById('genre-next');
  const genresGrid = document.querySelector('.genres-grid');
  if (genrePrev && genreNext && genresGrid) {
    genrePrev.addEventListener('click', () => {
      genresGrid.scrollBy({ left: -260, behavior: 'smooth' });
    });
    genreNext.addEventListener('click', () => {
      genresGrid.scrollBy({ left: 260, behavior: 'smooth' });
    });
  }

  // Genre card click interaction: switch shelf tab and scroll to shelf
  document.querySelectorAll('.genre-card').forEach(card => {
    card.addEventListener('click', () => {
      const g = card.getAttribute('data-genre') || 'all';
      const targetTab = document.querySelector(`.genre-tab-btn[data-genre="${g}"]`);
      if (targetTab) {
        targetTab.click();
        const shelf = document.getElementById('shelf-container');
        if (shelf) {
          shelf.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    });
  });

  // --- 17. DYNAMIC FEATURED BOOKS GRID ("Stories Worth Sharing") ---
  let showAllFeatured = false;

  function renderFeaturedGrid() {
    const grid = document.getElementById('featured-books-grid');
    if (!grid) return;

    const wishlist = getWishlist();

    // User-submitted listings (displayed first)
    const userListings = books.filter(b => b.isUserListing);

    // Curate featured titles
    let canonicalFeatured;
    if (showAllFeatured) {
      canonicalFeatured = books.filter(b => !b.isUserListing);
    } else {
      const featuredIds = ['midnight-library', 'atomic-habits', 'silent-patient', 'ikigai', 'alchemist', 'harry-potter'];
      canonicalFeatured = featuredIds.map(id => books.find(b => b.id === id)).filter(Boolean);
    }

    const displayBooks = [...userListings, ...canonicalFeatured];

    grid.innerHTML = displayBooks.map(book => {
      const isSaved = wishlist.includes(book.id);
      const isUser = !!book.isUserListing;
      const accent = book.accentColor || '#deb05c';
      return `
        <div class="book-card" data-book-id="${book.id}">
          <div>
            <div class="book-card-cover ${book.coverClass || ''}">
              <img src="${book.cover}" alt="${book.title} cover" class="card-real-cover" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';" />
              <div class="card-fallback-cover" style="display: none;">
                <div class="cover-header-meta">
                  <span class="cover-header-tag" style="color: ${accent};">BOOKLOOP</span>
                  <span style="color: ${accent};">
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>
                  </span>
                </div>
                <div class="cover-center-motif">
                  <div class="cover-icon-emblem" style="color: ${accent}; border-color: ${accent}66;">
                    ${getBookSvg(book.motif || 'moon-stars', 22)}
                  </div>
                  <h4 class="cover-title" style="font-size: 17px;">${book.title}</h4>
                  <p class="cover-author">${book.author}</p>
                </div>
                <div class="cover-footer-meta">
                  <span class="cover-edition-tag">${book.edition || 'Paperback Edition'}</span>
                  <span class="cover-price-badge">${book.buyPrice}</span>
                </div>
              </div>
              <button aria-label="Add to wishlist" class="card-wishlist-btn ${isSaved ? 'active' : ''}" type="button">
                <svg viewBox="0 0 24 24" fill="${isSaved ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
              </button>
            </div>
            <div class="book-card-meta">
              <div class="book-card-meta-row">
                <span>${book.author}</span>
                <div style="display: inline-flex; align-items: center; gap: 6px;">
                  ${isUser ? `
                    <span class="user-listing-tag">Your listing</span>
                    <button class="btn-delete-listing" type="button" data-id="${book.id}" aria-label="Delete listing" title="Delete this listing">
                      <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                    </button>
                  ` : ''}
                  <span class="book-condition-badge">${book.condition}</span>
                </div>
              </div>
              <h3 class="book-card-title">${book.title}</h3>
              <p class="book-card-price">${book.buyPrice} / ${book.rentPrice}</p>
            </div>
          </div>
          <div class="book-card-actions">
            <button class="btn-card-buy" type="button" data-id="${book.id}">BUY</button>
            <button class="btn-card-rent" type="button" data-id="${book.id}">RENT</button>
          </div>
        </div>
      `;
    }).join('');

    // Attach event listeners for wishlist buttons inside grid
    grid.querySelectorAll('.card-wishlist-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const card = btn.closest('.book-card');
        const bookId = card ? card.getAttribute('data-book-id') : null;
        if (bookId) {
          btn.style.transform = 'scale(1.25)';
          setTimeout(() => btn.style.transform = '', 200);
          toggleWishlist(bookId);
        }
      });
    });

    // Attach event listeners for BUY / RENT buttons inside grid
    grid.querySelectorAll('.btn-card-buy').forEach(button => {
      button.addEventListener('click', (e) => {
        e.stopPropagation();
        const bookId = button.getAttribute('data-id');
        addToCart(bookId, 'buy');
      });
    });

    grid.querySelectorAll('.btn-card-rent').forEach(button => {
      button.addEventListener('click', (e) => {
        e.stopPropagation();
        const bookId = button.getAttribute('data-id');
        addToCart(bookId, 'rent', 1);
      });
    });

    // Attach event listeners for delete listing buttons inside grid
    grid.querySelectorAll('.btn-delete-listing').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const bookId = btn.getAttribute('data-id');
        if (bookId) {
          promptDeleteListing(bookId);
        }
      });
    });

    // Clicking a book card opens the detail sheet for that book
    grid.querySelectorAll('.book-card').forEach(card => {
      card.addEventListener('click', (e) => {
        if (e.target.closest('button')) return;
        const bookId = card.getAttribute('data-book-id');
        const targetIdx = books.findIndex(b => b.id === bookId);
        if (targetIdx !== -1) {
          if (targetIdx < 12) {
            jumpToBookIndex(targetIdx);
            setTimeout(() => openDetail(), 350);
          } else {
            openDetail(false, books[targetIdx]);
          }
        }
      });
    });
  }

  // View All toggle
  const viewAllLink = document.querySelector('.view-all-link');
  if (viewAllLink) {
    viewAllLink.addEventListener('click', (e) => {
      e.preventDefault();
      showAllFeatured = !showAllFeatured;
      const span = viewAllLink.querySelector('span');
      if (span) {
        span.textContent = showAllFeatured ? 'Show 6 Picks' : 'View All Active Listings';
      }
      renderFeaturedGrid();
    });
  }

  // =========================================================================
  // --- 18. GENERAL MODAL INFRASTRUCTURE ---
  // =========================================================================
  function openModal(backdropId) {
    const el = document.getElementById(backdropId);
    if (!el) return;
    el.classList.add('open');
    document.body.classList.add('modal-open');
    if (customCursor) customCursor.classList.add('hidden-cursor');
  }

  function closeModal(backdropId) {
    const el = document.getElementById(backdropId);
    if (!el) return;
    el.classList.remove('open');
    const anyModalOpen = document.querySelector('.modal-backdrop.open, .checkout-modal-backdrop.open');
    if (!anyModalOpen && !document.querySelector('.slide-drawer.open') && !isOpen) {
      document.body.classList.remove('modal-open');
      if (customCursor) customCursor.classList.remove('hidden-cursor');
    }
  }

  // Backdrop click dismiss for all modals
  ['sell-modal-backdrop', 'treasure-modal-backdrop', 'auth-modal-backdrop', 'orders-modal-backdrop', 'info-modal-backdrop', 'delete-modal-backdrop'].forEach(id => {
    const backdrop = document.getElementById(id);
    if (backdrop) {
      backdrop.addEventListener('click', (e) => {
        if (e.target === backdrop) closeModal(id);
      });
    }
  });

  // =========================================================================
  // --- 19. "SELL A BOOK" CONTROLLER (LOCALSTORAGE ONLY) ---
  // =========================================================================
  let uploadedCoverDataUrl = null;
  const sellForm = document.getElementById('sell-book-form');
  const sellSuccessView = document.getElementById('sell-success-view');
  const sellSuccessMsg = document.getElementById('sell-success-msg');
  const sellPhotoInput = document.getElementById('sell-photo-input');
  const photoUploadPlaceholder = document.getElementById('photo-upload-placeholder');
  const photoPreviewWrap = document.getElementById('photo-preview-wrap');
  const sellPreviewImg = document.getElementById('sell-preview-img');
  const btnChangePhoto = document.getElementById('btn-change-photo');
  const photoUploadBox = document.getElementById('photo-upload-box');

  function openSellModal() {
    if (sellForm) sellForm.style.display = 'block';
    if (sellSuccessView) sellSuccessView.style.display = 'none';
    openModal('sell-modal-backdrop');
  }

  // Photo Upload Preview
  if (photoUploadBox && sellPhotoInput) {
    photoUploadBox.addEventListener('click', (e) => {
      if (e.target !== btnChangePhoto && !e.target.closest('#btn-change-photo')) {
        sellPhotoInput.click();
      }
    });
  }

  if (sellPhotoInput) {
    sellPhotoInput.addEventListener('change', (e) => {
      const file = e.target.files && e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          uploadedCoverDataUrl = event.target.result;
          if (sellPreviewImg) sellPreviewImg.src = uploadedCoverDataUrl;
          if (photoUploadPlaceholder) photoUploadPlaceholder.style.display = 'none';
          if (photoPreviewWrap) photoPreviewWrap.style.display = 'flex';
        };
        reader.readAsDataURL(file);
      }
    });
  }

  if (btnChangePhoto && sellPhotoInput) {
    btnChangePhoto.addEventListener('click', (e) => {
      e.stopPropagation();
      sellPhotoInput.click();
    });
  }

  // Sell form triggers
  const navSellLink = document.getElementById('nav-sell-link');
  const heroSellBtn = document.getElementById('hero-sell-btn');
  const footerSellLink = document.getElementById('footer-sell-link');
  const sellCloseBtn = document.getElementById('sell-close-btn');
  const btnSellDone = document.getElementById('btn-sell-done');

  if (navSellLink) navSellLink.addEventListener('click', (e) => { e.preventDefault(); openSellModal(); });
  if (heroSellBtn) heroSellBtn.addEventListener('click', () => openSellModal());
  if (footerSellLink) footerSellLink.addEventListener('click', (e) => { e.preventDefault(); openSellModal(); });
  if (sellCloseBtn) sellCloseBtn.addEventListener('click', () => closeModal('sell-modal-backdrop'));
  if (btnSellDone) {
    btnSellDone.addEventListener('click', () => {
      closeModal('sell-modal-backdrop');
      document.getElementById('featured-books-grid')?.scrollIntoView({ behavior: 'smooth' });
    });
  }

  // Sell form submission
  if (sellForm) {
    sellForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const title = document.getElementById('sell-title')?.value.trim();
      const author = document.getElementById('sell-author')?.value.trim();
      const genre = document.getElementById('sell-genre')?.value;
      const condition = document.getElementById('sell-condition')?.value;
      const buyPrice = document.getElementById('sell-buy-price')?.value;
      const rentPrice = document.getElementById('sell-rent-price')?.value;

      if (!title || !author || !buyPrice) {
        showToast('Please fill out all required fields');
        return;
      }

      const newListing = {
        id: 'user-' + Date.now(),
        number: '§ USR',
        title: title,
        fullTitle: title,
        author: author,
        authorShort: author.split(' ').pop(),
        genre: genre,
        genres: [genre.toLowerCase()],
        buyPrice: `₹${buyPrice}`,
        rentPrice: `₹${rentPrice}/week`,
        condition: condition,
        edition: 'Paperback Edition',
        pages: '320 pages',
        rating: '5.0 / 5.0 (Reader Listing)',
        synopsis: `Listed by a BookLoop reader in ${condition} condition. Clean pages and solid binding.`,
        quote: 'Read more, spend less, share stories.',
        cover: uploadedCoverDataUrl || 'assets/covers/midnight-library.jpg',
        spineColor: '#244C3B',
        spineTextColor: '#faf8f5',
        spineBorderColor: '#deb05c',
        spineTheme: 'spine-theme-1',
        coverClass: 'cover-midnight-library',
        motif: 'magic-crest',
        accentColor: '#deb05c',
        isUserListing: true,
        timestamp: Date.now()
      };

      // Persist to localStorage
      try {
        const stored = getUserListings();
        stored.unshift(newListing);
        localStorage.setItem('bookloop_user_listings', JSON.stringify(stored));
      } catch (err) {
        console.error('Error saving listing to localStorage:', err);
      }

      // Prepend to active catalog
      books.push(newListing);

      // Refresh featured grid
      renderFeaturedGrid();

      // Show success view
      if (sellSuccessMsg) {
        sellSuccessMsg.textContent = `"${title}" by ${author} has been added to the BookLoop catalog with a "Your listing" badge.`;
      }
      sellForm.style.display = 'none';
      if (sellSuccessView) sellSuccessView.style.display = 'block';

      // Reset form fields
      sellForm.reset();
      uploadedCoverDataUrl = null;
      if (sellPreviewImg) sellPreviewImg.src = '';
      if (photoPreviewWrap) photoPreviewWrap.style.display = 'none';
      if (photoUploadPlaceholder) photoUploadPlaceholder.style.display = 'flex';

      showToast('Book listed successfully!');
    });
  }

  // =========================================================================
  // --- 19.1. DELETE LISTINGS CONTROLLER (LOCALSTORAGE ONLY) ---
  // =========================================================================
  let pendingDeleteBookId = null;
  let isDeletingAll = false;

  const deleteModalBackdrop = document.getElementById('delete-modal-backdrop');
  const deleteModalTitle = document.getElementById('delete-modal-title');
  const deleteModalDesc = document.getElementById('delete-modal-desc');
  const btnDeleteCancel = document.getElementById('btn-delete-cancel');
  const btnDeleteConfirm = document.getElementById('btn-delete-confirm');
  const deleteModalCloseBtn = document.getElementById('delete-modal-close-btn');

  function promptDeleteListing(bookId) {
    const book = books.find(b => b.id === bookId);
    pendingDeleteBookId = bookId;
    isDeletingAll = false;
    if (deleteModalTitle) deleteModalTitle.textContent = 'Delete this listing?';
    if (deleteModalDesc) {
      deleteModalDesc.textContent = book
        ? `Are you sure you want to remove "${book.title}" from the BookLoop catalog? This cannot be undone.`
        : 'Are you sure you want to remove this listing from the BookLoop catalog? This cannot be undone.';
    }
    openModal('delete-modal-backdrop');
  }

  function promptDeleteAllListings() {
    const userListings = books.filter(b => b.isUserListing);
    if (userListings.length === 0) {
      showToast('You have no active listings to delete');
      return;
    }
    pendingDeleteBookId = null;
    isDeletingAll = true;
    if (deleteModalTitle) deleteModalTitle.textContent = 'Delete all my listings?';
    if (deleteModalDesc) {
      deleteModalDesc.textContent = `Are you sure you want to remove all ${userListings.length} of your listings from the BookLoop catalog? This will also remove them from your bag and saved books.`;
    }
    openModal('delete-modal-backdrop');
  }

  function cancelDelete() {
    pendingDeleteBookId = null;
    isDeletingAll = false;
    closeModal('delete-modal-backdrop');
  }

  function deleteListing(bookId) {
    const bookIndex = books.findIndex(b => b.id === bookId);
    const bookTitle = bookIndex !== -1 ? books[bookIndex].title : 'Listing';

    // 1. Remove from in-memory books
    if (bookIndex !== -1) {
      books.splice(bookIndex, 1);
    }

    // 2. Remove from localStorage 'bookloop_user_listings'
    try {
      const stored = getUserListings().filter(b => b.id !== bookId);
      localStorage.setItem('bookloop_user_listings', JSON.stringify(stored));
    } catch (err) {
      console.error('Error updating localStorage user listings:', err);
    }

    // 3. Remove from cart if present
    try {
      const cart = getCart().filter(item => item.bookId !== bookId && item.id !== bookId);
      saveCart(cart);
      updateCartUI();
    } catch (err) {
      console.error('Error removing listing from cart:', err);
    }

    // 4. Remove from wishlist if present
    try {
      const wishlist = getWishlist().filter(id => id !== bookId);
      saveWishlist(wishlist);
      updateWishlistUI();
    } catch (err) {
      console.error('Error removing listing from wishlist:', err);
    }

    // 5. Close detail sheet if open for this book
    if (isOpen && currentSheetBook && currentSheetBook.id === bookId) {
      closeDetail();
    }

    // 6. Immediately re-render the featured grid
    renderFeaturedGrid();

    showToast(`"${bookTitle}" listing deleted`);
  }

  function deleteAllUserListings() {
    const userListingIds = new Set(books.filter(b => b.isUserListing).map(b => b.id));
    const count = userListingIds.size;
    if (count === 0) return;

    // 1. Remove from in-memory books
    for (let i = books.length - 1; i >= 0; i--) {
      if (books[i].isUserListing) {
        books.splice(i, 1);
      }
    }

    // 2. Clear localStorage user listings
    try {
      localStorage.setItem('bookloop_user_listings', JSON.stringify([]));
    } catch (err) {
      console.error('Error clearing user listings:', err);
    }

    // 3. Remove from cart
    try {
      const cart = getCart().filter(item => !userListingIds.has(item.bookId) && !userListingIds.has(item.id));
      saveCart(cart);
      updateCartUI();
    } catch (err) {
      console.error('Error updating cart:', err);
    }

    // 4. Remove from wishlist
    try {
      const wishlist = getWishlist().filter(id => !userListingIds.has(id));
      saveWishlist(wishlist);
      updateWishlistUI();
    } catch (err) {
      console.error('Error updating wishlist:', err);
    }

    // 5. Close detail sheet if open on a deleted user book
    if (isOpen && currentSheetBook && currentSheetBook.isUserListing) {
      closeDetail();
    }

    // 6. Immediately re-render the featured grid
    renderFeaturedGrid();

    showToast(`Deleted ${count} listing${count > 1 ? 's' : ''}`);
  }

  if (btnDeleteCancel) btnDeleteCancel.addEventListener('click', cancelDelete);
  if (deleteModalCloseBtn) deleteModalCloseBtn.addEventListener('click', cancelDelete);

  if (btnDeleteConfirm) {
    btnDeleteConfirm.addEventListener('click', () => {
      if (isDeletingAll) {
        deleteAllUserListings();
      } else if (pendingDeleteBookId) {
        deleteListing(pendingDeleteBookId);
      }
      cancelDelete();
    });
  }

  // Expose delete functions for testability
  window.promptDeleteListing = promptDeleteListing;
  window.promptDeleteAllListings = promptDeleteAllListings;
  window.deleteListing = deleteListing;
  window.deleteAllUserListings = deleteAllUserListings;

  // =========================================================================
  // --- 20. TREASURE HUNT QUEST CONTROLLER (LOCALSTORAGE ONLY) ---
  // =========================================================================
  const CLUES_DATA = [
    {
      id: 'clue-1',
      code: 'LOOP01',
      title: 'Clue #01: The Old Clock & The Filter Coffee',
      riddle: 'Where cold filter coffee meets yellowed leaves, find shelf 4B behind the vintage clock tower.',
      coords: '12.9716° N, 77.5946° E · Church Street Bangalore',
      points: 150,
      reward: 'Free Bookmark Pack'
    },
    {
      id: 'clue-2',
      code: 'LOOP02',
      title: 'Clue #02: The Attic Beneath the Banyan',
      riddle: 'Beneath the roots of the ancient banyan in the colonial courtyard, look for the spine bound in indigo silk.',
      coords: '9.9656° N, 76.2421° E · Fort Kochi Heritage',
      points: 200,
      reward: '15% Off Your Next Rental'
    },
    {
      id: 'clue-3',
      code: 'LOOP03',
      title: 'Clue #03: The Silver Bookmark at Sunset',
      riddle: 'As the sea breeze rustles the pavement stalls, a hidden alcove keeps the signed memoirs safe.',
      coords: '19.0596° N, 72.8295° E · Bandra Sea Breeze Walk',
      points: 250,
      reward: 'Free Canvas Book Tote'
    }
  ];

  function getKarma() {
    try {
      const k = localStorage.getItem('bookloop_karma');
      return k !== null ? parseInt(k, 10) : 500;
    } catch (e) {
      return 500;
    }
  }

  function setKarma(pts) {
    try {
      localStorage.setItem('bookloop_karma', String(pts));
    } catch (e) {
      console.error(e);
    }
  }

  function getUnlockedClues() {
    try {
      return JSON.parse(localStorage.getItem('bookloop_unlocked_clues') || '[]');
    } catch (e) {
      return [];
    }
  }

  function setUnlockedClues(arr) {
    try {
      localStorage.setItem('bookloop_unlocked_clues', JSON.stringify(arr));
    } catch (e) {
      console.error(e);
    }
  }

  function getKarmaRank(pts) {
    if (pts < 600) return 'Reader';
    if (pts < 850) return 'Active Reader';
    if (pts < 1100) return 'Book Scout';
    return 'Top Scout';
  }

  function renderTreasureHuntUI() {
    const pts = getKarma();
    const karmaPtsVal = document.getElementById('karma-points-val');
    const karmaRankTitle = document.getElementById('karma-rank-title');
    if (karmaPtsVal) karmaPtsVal.textContent = pts;
    if (karmaRankTitle) karmaRankTitle.textContent = getKarmaRank(pts);

    const unlocked = getUnlockedClues();
    const activeClue = CLUES_DATA.find(c => !unlocked.includes(c.id));

    const clueBadge = document.getElementById('clue-badge-status');
    const clueCoords = document.getElementById('clue-coords-text');
    const clueTitle = document.getElementById('clue-title-text');
    const clueRiddle = document.getElementById('clue-riddle-text');

    if (!activeClue) {
      if (clueBadge) {
        clueBadge.textContent = 'HUNT COMPLETE';
        clueBadge.style.background = 'linear-gradient(135deg, #deb05c 0%, #c9933b 100%)';
        clueBadge.style.color = '#1b1c18';
      }
      if (clueCoords) clueCoords.textContent = 'All Clues Found';
      if (clueTitle) clueTitle.textContent = 'You have solved all clues!';
      if (clueRiddle) {
        clueRiddle.innerHTML = '&ldquo;You have unlocked every community drop point across Bangalore, Kochi, and Mumbai. Check back next Saturday for new clues!&rdquo;';
      }
    } else {
      if (clueBadge) {
        clueBadge.textContent = 'CURRENT ACTIVE CLUE';
        clueBadge.style.background = '';
        clueBadge.style.color = '';
      }
      if (clueCoords) clueCoords.textContent = activeClue.coords;
      if (clueTitle) clueTitle.textContent = activeClue.title;
      if (clueRiddle) clueRiddle.innerHTML = `&ldquo;${activeClue.riddle}&rdquo;`;
    }

    // Render Unlocked Clues List
    const cluesList = document.getElementById('unlocked-clues-list');
    if (cluesList) {
      if (unlocked.length === 0) {
        cluesList.innerHTML = `<div class="hunt-item locked"><span>No clues solved yet. Enter demo code LOOP01 or scan QR above!</span></div>`;
      } else {
        cluesList.innerHTML = CLUES_DATA.filter(c => unlocked.includes(c.id)).map(c => `
          <div class="hunt-item unlocked">
            <div style="display: flex; align-items: center; gap: 8px;">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#244C3B" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
              <span>${c.title}</span>
            </div>
            <strong style="color: #244C3B; font-size: 12px;">+${c.points} pts</strong>
          </div>
        `).join('');
      }
    }

    // Render Rewards List
    const rewardsList = document.getElementById('unlocked-rewards-list');
    if (rewardsList) {
      const rewardsThresholds = [
        { pts: 500, title: 'Free Bookmark Pack' },
        { pts: 650, title: '15% Off Your Next Rental' },
        { pts: 850, title: 'Free Canvas Book Tote' },
        { pts: 1100, title: 'Free 1-Month Rental Pass' }
      ];

      rewardsList.innerHTML = rewardsThresholds.map(r => {
        const isUnlocked = pts >= r.pts;
        return `
          <div class="hunt-item ${isUnlocked ? 'unlocked' : 'locked'}">
            <div style="display: flex; align-items: center; gap: 8px;">
              ${isUnlocked
                ? `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#244C3B" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>`
                : `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#999" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>`
              }
              <span>${r.title}</span>
            </div>
            <span style="font-size: 11px; font-weight: 600; color: ${isUnlocked ? '#244C3B' : '#888'};">
              ${isUnlocked ? 'CLAIMABLE' : `${r.pts} pts`}
            </span>
          </div>
        `;
      }).join('');
    }
  }

  // Clue Form Submit
  const clueCodeForm = document.getElementById('clue-code-form');
  const clueCodeInput = document.getElementById('clue-code-input');
  const huntFeedbackMsg = document.getElementById('hunt-feedback-msg');

  if (clueCodeForm) {
    clueCodeForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const code = (clueCodeInput?.value || '').trim().toUpperCase();
      if (!code) return;

      const matchedClue = CLUES_DATA.find(c => c.code === code);
      const unlocked = getUnlockedClues();

      if (matchedClue) {
        if (unlocked.includes(matchedClue.id)) {
          if (huntFeedbackMsg) {
            huntFeedbackMsg.style.display = 'block';
            huntFeedbackMsg.style.background = 'rgba(222, 176, 92, 0.15)';
            huntFeedbackMsg.style.borderColor = 'rgba(222, 176, 92, 0.4)';
            huntFeedbackMsg.style.color = '#885117';
            huntFeedbackMsg.textContent = `You have already redeemed code ${code}!`;
          }
        } else {
          unlocked.push(matchedClue.id);
          setUnlockedClues(unlocked);
          const newKarma = getKarma() + matchedClue.points;
          setKarma(newKarma);
          renderTreasureHuntUI();

          if (huntFeedbackMsg) {
            huntFeedbackMsg.style.display = 'block';
            huntFeedbackMsg.style.background = 'rgba(36, 76, 59, 0.12)';
            huntFeedbackMsg.style.borderColor = 'rgba(36, 76, 59, 0.3)';
            huntFeedbackMsg.style.color = '#244C3B';
            huntFeedbackMsg.textContent = `✨ Clue solved! +${matchedClue.points} Karma Points added!`;
          }
          showToast(`+${matchedClue.points} Karma Points earned!`);
          clueCodeForm.reset();
        }
      } else {
        if (huntFeedbackMsg) {
          huntFeedbackMsg.style.display = 'block';
          huntFeedbackMsg.style.background = 'rgba(186, 26, 26, 0.08)';
          huntFeedbackMsg.style.borderColor = 'rgba(186, 26, 26, 0.25)';
          huntFeedbackMsg.style.color = '#ba1a1a';
          huntFeedbackMsg.textContent = `Code "${code}" is invalid. Demo clue codes: LOOP01, LOOP02, LOOP03.`;
        }
      }
    });
  }

  // Scan QR Simulation
  const btnScanQr = document.getElementById('btn-scan-qr');
  const scanBtnLabel = document.getElementById('scan-btn-label');

  if (btnScanQr) {
    btnScanQr.addEventListener('click', () => {
      btnScanQr.disabled = true;
      if (scanBtnLabel) scanBtnLabel.textContent = 'Scanning Book QR...';
      btnScanQr.style.opacity = '0.7';

      setTimeout(() => {
        btnScanQr.disabled = false;
        btnScanQr.style.opacity = '1';
        if (scanBtnLabel) scanBtnLabel.textContent = 'Scan Book QR (Simulate Scan)';

        const unlocked = getUnlockedClues();
        const nextClue = CLUES_DATA.find(c => !unlocked.includes(c.id));

        if (nextClue) {
          unlocked.push(nextClue.id);
          setUnlockedClues(unlocked);
          const newKarma = getKarma() + nextClue.points;
          setKarma(newKarma);
          renderTreasureHuntUI();

          if (huntFeedbackMsg) {
            huntFeedbackMsg.style.display = 'block';
            huntFeedbackMsg.style.background = 'rgba(36, 76, 59, 0.12)';
            huntFeedbackMsg.style.borderColor = 'rgba(36, 76, 59, 0.3)';
            huntFeedbackMsg.style.color = '#244C3B';
            huntFeedbackMsg.textContent = `📸 Verified! You scanned ${nextClue.title}: +${nextClue.points} Karma awarded!`;
          }
          showToast(`QR Code Verified! +${nextClue.points} Karma!`);
        } else {
          // Bonus scan
          const bonusPts = 100;
          setKarma(getKarma() + bonusPts);
          renderTreasureHuntUI();
          if (huntFeedbackMsg) {
            huntFeedbackMsg.style.display = 'block';
            huntFeedbackMsg.style.background = 'rgba(36, 76, 59, 0.12)';
            huntFeedbackMsg.style.borderColor = 'rgba(36, 76, 59, 0.3)';
            huntFeedbackMsg.style.color = '#244C3B';
            huntFeedbackMsg.textContent = `📸 Verified! All current clues already solved. +${bonusPts} Bonus Karma awarded!`;
          }
          showToast(`+${bonusPts} Bonus Karma awarded!`);
        }
      }, 750);
    });
  }

  // Treasure hunt modal triggers
  function openTreasureHuntModal() {
    renderTreasureHuntUI();
    if (huntFeedbackMsg) huntFeedbackMsg.style.display = 'none';
    openModal('treasure-modal-backdrop');
  }

  const btnStartHunt = document.getElementById('btn-start-hunt');
  const navHuntLink = document.getElementById('nav-hunt-link');
  const footerHuntLink = document.getElementById('footer-hunt-link');
  const ticketQrTrigger = document.getElementById('ticket-qr-trigger');
  const treasureCloseBtn = document.getElementById('treasure-close-btn');

  if (btnStartHunt) btnStartHunt.addEventListener('click', openTreasureHuntModal);
  if (navHuntLink) navHuntLink.addEventListener('click', (e) => { e.preventDefault(); openTreasureHuntModal(); });
  if (footerHuntLink) footerHuntLink.addEventListener('click', (e) => { e.preventDefault(); openTreasureHuntModal(); });
  if (ticketQrTrigger) ticketQrTrigger.addEventListener('click', openTreasureHuntModal);
  if (treasureCloseBtn) treasureCloseBtn.addEventListener('click', () => closeModal('treasure-modal-backdrop'));

  // =========================================================================
  // --- 21. AUTHENTICATION (LOG IN & SIGN UP) CONTROLLER (LOCALSTORAGE ONLY) ---
  // =========================================================================
  function getStoredUser() {
    try {
      const u = localStorage.getItem('bookloop_user');
      return u ? JSON.parse(u) : null;
    } catch (e) {
      return null;
    }
  }

  function setStoredUser(u) {
    try {
      if (u) localStorage.setItem('bookloop_user', JSON.stringify(u));
      else localStorage.removeItem('bookloop_user');
    } catch (e) {
      console.error(e);
    }
  }

  const headerLoginBtn = document.getElementById('header-login-btn');
  const headerSignupBtn = document.getElementById('header-signup-btn');
  const headerAvatarWrap = document.getElementById('header-avatar-wrap');
  const headerAvatarBtn = document.getElementById('header-avatar-btn');
  const avatarDropdown = document.getElementById('avatar-dropdown');
  const dropdownUserName = document.getElementById('dropdown-user-name');
  const dropdownUserEmail = document.getElementById('dropdown-user-email');

  function updateAuthUI() {
    const user = getStoredUser();
    const mobileUserStatus = document.getElementById('mobile-user-status');
    const mobileAuthActions = document.getElementById('mobile-auth-actions');
    const mobileWishlistCount = document.getElementById('mobile-wishlist-count');
    if (mobileWishlistCount) {
      mobileWishlistCount.textContent = getWishlist().length;
    }

    if (user && user.loggedIn) {
      if (headerLoginBtn) headerLoginBtn.style.display = 'none';
      if (headerSignupBtn) headerSignupBtn.style.display = 'none';
      if (headerAvatarWrap) headerAvatarWrap.style.display = 'block';
      if (headerAvatarBtn) headerAvatarBtn.textContent = user.initial || user.name.charAt(0).toUpperCase();
      if (dropdownUserName) dropdownUserName.textContent = user.name || 'Member Bibliophile';
      if (dropdownUserEmail) dropdownUserEmail.textContent = user.email || 'reader@bookloop.in';

      if (mobileUserStatus) {
        mobileUserStatus.innerHTML = `
          <div class="mobile-user-card">
            <div class="mobile-user-initial">${user.initial || user.name.charAt(0).toUpperCase()}</div>
            <div class="mobile-user-details">
              <span class="mobile-user-name">${user.name || 'Member Bibliophile'}</span>
              <span class="mobile-user-email">${user.email || 'reader@bookloop.in'}</span>
            </div>
          </div>
        `;
      }

      if (mobileAuthActions) {
        mobileAuthActions.innerHTML = `
          <button type="button" class="btn-mobile-auth logout" id="btn-mobile-logout">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
            <span>Log Out</span>
          </button>
        `;
        const mobLogout = document.getElementById('btn-mobile-logout');
        if (mobLogout) {
          mobLogout.addEventListener('click', () => {
            setStoredUser(null);
            updateAuthUI();
            if (typeof closeMobileNav === 'function') closeMobileNav();
            showToast('Logged out successfully');
          });
        }
      }
    } else {
      if (headerLoginBtn) headerLoginBtn.style.display = 'inline-block';
      if (headerSignupBtn) headerSignupBtn.style.display = 'inline-block';
      if (headerAvatarWrap) headerAvatarWrap.style.display = 'none';
      if (avatarDropdown) avatarDropdown.style.display = 'none';

      if (mobileUserStatus) {
        mobileUserStatus.innerHTML = `
          <p style="font-size: 13px; color: var(--on-surface-variant); padding: 4px 6px; line-height: 1.5;">
            Join BookLoop to save wishlists, manage rentals, and track orders.
          </p>
        `;
      }

      if (mobileAuthActions) {
        mobileAuthActions.innerHTML = `
          <button type="button" class="btn-mobile-auth primary" id="btn-mobile-login">Log In</button>
          <button type="button" class="btn-mobile-auth secondary" id="btn-mobile-signup">Create Account</button>
        `;
        const mobLogin = document.getElementById('btn-mobile-login');
        const mobSignup = document.getElementById('btn-mobile-signup');
        if (mobLogin) {
          mobLogin.addEventListener('click', () => {
            if (typeof closeMobileNav === 'function') closeMobileNav();
            showLoginForm();
            openModal('auth-modal-backdrop');
          });
        }
        if (mobSignup) {
          mobSignup.addEventListener('click', () => {
            if (typeof closeMobileNav === 'function') closeMobileNav();
            showSignupForm();
            openModal('auth-modal-backdrop');
          });
        }
      }
    }
  }

  // Auth modal tabs & forms
  const tabLoginBtn = document.getElementById('tab-login-btn');
  const tabSignupBtn = document.getElementById('tab-signup-btn');
  const loginForm = document.getElementById('login-form');
  const signupForm = document.getElementById('signup-form');
  const switchToSignup = document.getElementById('switch-to-signup');
  const switchToLogin = document.getElementById('switch-to-login');
  const authCloseBtn = document.getElementById('auth-close-btn');

  function showLoginForm() {
    if (tabLoginBtn) tabLoginBtn.classList.add('active');
    if (tabSignupBtn) tabSignupBtn.classList.remove('active');
    if (loginForm) loginForm.style.display = 'flex';
    if (signupForm) signupForm.style.display = 'none';
  }

  function showSignupForm() {
    if (tabSignupBtn) tabSignupBtn.classList.add('active');
    if (tabLoginBtn) tabLoginBtn.classList.remove('active');
    if (signupForm) signupForm.style.display = 'flex';
    if (loginForm) loginForm.style.display = 'none';
  }

  if (tabLoginBtn) tabLoginBtn.addEventListener('click', showLoginForm);
  if (tabSignupBtn) tabSignupBtn.addEventListener('click', showSignupForm);
  if (switchToSignup) switchToSignup.addEventListener('click', (e) => { e.preventDefault(); showSignupForm(); });
  if (switchToLogin) switchToLogin.addEventListener('click', (e) => { e.preventDefault(); showLoginForm(); });

  if (headerLoginBtn) {
    headerLoginBtn.addEventListener('click', () => {
      showLoginForm();
      openModal('auth-modal-backdrop');
    });
  }

  if (headerSignupBtn) {
    headerSignupBtn.addEventListener('click', () => {
      showSignupForm();
      openModal('auth-modal-backdrop');
    });
  }

  const btnCommunityJoin = document.getElementById('btn-community-join');
  if (btnCommunityJoin) {
    btnCommunityJoin.addEventListener('click', () => {
      showSignupForm();
      openModal('auth-modal-backdrop');
    });
  }

  if (authCloseBtn) authCloseBtn.addEventListener('click', () => closeModal('auth-modal-backdrop'));

  // Handle Login Submit
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('login-email')?.value.trim();
      const password = document.getElementById('login-password')?.value;

      if (!email || !password) {
        showToast('Please provide your email and password');
        return;
      }

      // Check if user previously signed up or derive sensible display name
      const cleanName = email.split('@')[0].replace(/[._]/g, ' ');
      const displayName = cleanName.charAt(0).toUpperCase() + cleanName.slice(1);

      const user = {
        name: displayName,
        email: email,
        initial: displayName.charAt(0).toUpperCase(),
        loggedIn: true
      };

      setStoredUser(user);
      updateAuthUI();
      closeModal('auth-modal-backdrop');
      loginForm.reset();
      showToast(`Welcome back, ${displayName}!`);
    });
  }

  // Handle Signup Submit
  if (signupForm) {
    signupForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('signup-name')?.value.trim();
      const email = document.getElementById('signup-email')?.value.trim();
      const password = document.getElementById('signup-password')?.value;

      if (!name || !email || !password || password.length < 4) {
        showToast('Please fill out all fields (password min. 4 characters)');
        return;
      }

      const user = {
        name: name,
        email: email,
        initial: name.charAt(0).toUpperCase(),
        loggedIn: true
      };

      setStoredUser(user);
      updateAuthUI();
      closeModal('auth-modal-backdrop');
      signupForm.reset();
      showToast(`Account created! Welcome to BookLoop, ${name}.`);
    });
  }

  // Avatar Dropdown Toggle & Outside Click
  if (headerAvatarBtn) {
    headerAvatarBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (avatarDropdown) {
        avatarDropdown.style.display = avatarDropdown.style.display === 'block' ? 'none' : 'block';
      }
    });
  }

  document.addEventListener('click', (e) => {
    if (avatarDropdown && !avatarDropdown.contains(e.target) && e.target !== headerAvatarBtn) {
      avatarDropdown.style.display = 'none';
    }
  });

  // Avatar Dropdown Actions
  const dropdownWishlistBtn = document.getElementById('dropdown-wishlist-btn');
  const dropdownOrdersBtn = document.getElementById('dropdown-orders-btn');
  const dropdownHuntBtn = document.getElementById('dropdown-hunt-btn');
  const dropdownDeleteAllBtn = document.getElementById('dropdown-delete-all-listings-btn');
  const dropdownLogoutBtn = document.getElementById('dropdown-logout-btn');

  if (dropdownWishlistBtn) {
    dropdownWishlistBtn.addEventListener('click', () => {
      if (avatarDropdown) avatarDropdown.style.display = 'none';
      openWishlistDrawer();
    });
  }

  if (dropdownOrdersBtn) {
    dropdownOrdersBtn.addEventListener('click', () => {
      if (avatarDropdown) avatarDropdown.style.display = 'none';
      renderOrdersModal();
      openModal('orders-modal-backdrop');
    });
  }

  if (dropdownHuntBtn) {
    dropdownHuntBtn.addEventListener('click', () => {
      if (avatarDropdown) avatarDropdown.style.display = 'none';
      openTreasureHuntModal();
    });
  }

  if (dropdownDeleteAllBtn) {
    dropdownDeleteAllBtn.addEventListener('click', () => {
      if (avatarDropdown) avatarDropdown.style.display = 'none';
      promptDeleteAllListings();
    });
  }

  if (dropdownLogoutBtn) {
    dropdownLogoutBtn.addEventListener('click', () => {
      setStoredUser(null);
      updateAuthUI();
      showToast('Logged out successfully');
    });
  }

  // =========================================================================
  // --- 22. MY ORDERS MODAL CONTROLLER (LOCALSTORAGE ONLY) ---
  // =========================================================================
  const ordersCloseBtn = document.getElementById('orders-close-btn');
  if (ordersCloseBtn) ordersCloseBtn.addEventListener('click', () => closeModal('orders-modal-backdrop'));

  function renderOrdersModal() {
    const listContainer = document.getElementById('orders-list-container');
    if (!listContainer) return;

    let orders = [];
    try {
      orders = JSON.parse(localStorage.getItem('bookloop_orders') || '[]');
    } catch (e) {
      orders = [];
    }

    if (orders.length === 0) {
      listContainer.innerHTML = `
        <div class="orders-empty-state">
          <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="var(--forest-green)" stroke-width="1.5"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
          <h4>No Orders or Active Rentals</h4>
          <p>You haven't ordered any books yet. Explore our collection to start reading.</p>
          <button class="btn-modal-submit" id="btn-orders-explore" type="button" style="width: auto; padding: 10px 24px; margin-top: 14px;">Explore Books</button>
        </div>
      `;
      const expBtn = document.getElementById('btn-orders-explore');
      if (expBtn) {
        expBtn.addEventListener('click', () => {
          closeModal('orders-modal-backdrop');
          document.getElementById('featured-books-grid')?.scrollIntoView({ behavior: 'smooth' });
        });
      }
      return;
    }

    listContainer.innerHTML = orders.map(ord => `
      <div class="order-card">
        <div class="order-card-header">
          <div>
            <span class="order-id">#${ord.id}</span>
            <span class="order-date">${ord.date}</span>
          </div>
          <span class="order-status-badge">PACKED &amp; SHIPPED</span>
        </div>
        <div class="order-items-list">
          ${ord.items.map(item => `
            <div class="order-item-row">
              <span><strong>${item.title}</strong> (${item.desc})</span>
              <span>₹${item.cost}</span>
            </div>
          `).join('')}
        </div>
        <div class="order-card-footer">
          <span class="order-dest">Delivering to: ${ord.recipient}, ${ord.address.slice(0, 32)}${ord.address.length > 32 ? '...' : ''}</span>
          <span class="order-total-val">Total: ₹${ord.total}</span>
        </div>
      </div>
    `).join('');
  }

  // =========================================================================
  // --- 23. NEWSLETTER SUBSCRIBE (LOCALSTORAGE ONLY) ---
  // =========================================================================
  const newsletterForm = document.getElementById('newsletter-form');
  const newsletterEmail = document.getElementById('newsletter-email');
  const newsletterThankyou = document.getElementById('newsletter-thankyou');

  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = newsletterEmail?.value.trim();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!email || !emailRegex.test(email)) {
        showToast('Please enter a valid email address');
        return;
      }

      try {
        const list = JSON.parse(localStorage.getItem('bookloop_newsletter') || '[]');
        if (!list.includes(email)) {
          list.push(email);
          localStorage.setItem('bookloop_newsletter', JSON.stringify(list));
        }
      } catch (err) {
        console.error(err);
      }

      newsletterForm.style.display = 'none';
      if (newsletterThankyou) newsletterThankyou.style.display = 'flex';
      showToast('Subscribed to the newsletter!');
    });
  }

  // =========================================================================
  // --- 24. EDITORIAL INFO MODAL & NO DEAD LINKS ---
  // =========================================================================
  const INFO_ARTICLES = {
    antiquarian: {
      pill: 'RARE FINDS',
      title: 'Rare & Vintage Books',
      body: `
        <p>Find collectible first prints, vintage classics, and out-of-print titles listed by collectors and readers across India.</p>
        <p>Sellers upload real photos of book covers, corners, and pages so you can inspect the exact condition before ordering.</p>
        <p>Have an old classic or hardbound volume to pass on? List it in under 60 seconds with zero listing fees.</p>
      `
    },
    salon: {
      pill: 'MEETUPS',
      title: 'Reading Clubs & Meetups',
      body: `
        <p>We organize casual reading sessions and student meetups across Bangalore, Mumbai, Pune, and Delhi.</p>
        <p>Meet other readers, swap book recommendations over chai or coffee, and borrow books directly from each other.</p>
        <p>Check the community board on the first Sunday of each month for meetup locations and upcoming book picks.</p>
      `
    },
    exchange: {
      pill: 'SWAP',
      title: 'Book Exchange',
      body: `
        <p>The BookLoop Exchange lets readers swap finished novels and course textbooks directly.</p>
        <p>List the books you have finished, browse what other readers near you are offering, and trade directly without middlemen.</p>
        <p>Keep your shelf fresh, save money, and make sure good books never sit idle.</p>
      `
    },
    spotlights: {
      pill: 'FEATURED',
      title: 'Bestsellers & Recommendations',
      body: `
        <p>Explore popular titles and community favorites recommended by students and readers across India.</p>
        <p>From competitive exam prep and tech guides to best-selling fiction and memoirs, see what people are reading right now.</p>
        <p>Finished a great book? Share your review to help fellow readers pick their next read.</p>
      `
    },
    privacy: {
      pill: 'PRIVACY',
      title: 'Privacy Policy',
      body: `
        <p>At BookLoop, we keep your personal data simple and private. We only collect what is needed to process your orders and listings.</p>
        <p>We never sell your contact info to data brokers. Your wishlist, cart items, and karma points are stored locally in your own browser.</p>
        <p>Delivery addresses and phone numbers are used solely for shipping and courier handoff.</p>
      `
    },
    terms: {
      pill: 'TERMS',
      title: 'Terms of Rental & Sale',
      body: `
        <p>Rent books for 1 to 8 weeks. Need extra time to finish reading? Simply extend your rental at your regular weekly rate.</p>
        <p>Please take good care of borrowed books. Avoid dog-earing pages, pencil markings, and liquid spills so the next student can enjoy them too.</p>
        <p>Doorstep courier pickups are scheduled when your rental period ends.</p>
      `
    },
    standards: {
      pill: 'QUALITY',
      title: 'Condition Standards',
      body: `
        <p>Every book on BookLoop is graded using our 4 simple condition levels:</p>
        <ul style="margin-left: 20px; margin-top: 10px; line-height: 1.8; color: var(--on-surface);">
          <li><strong>LIKE NEW:</strong> Crisp cover, clean unmarked pages, tight binding. Looks unread.</li>
          <li><strong>VERY GOOD:</strong> Minor shelf wear, clean interior, intact spine with no heavy creases.</li>
          <li><strong>GOOD:</strong> Light normal reading wear, possible mild tanning or neat owner name, solid readable copy.</li>
          <li><strong>VINTAGE:</strong> Older or collectible copies with normal age wear, fully intact and readable.</li>
        </ul>
      `
    }
  };

  const infoModalPill = document.getElementById('info-modal-pill');
  const infoModalTitle = document.getElementById('info-modal-title');
  const infoModalContent = document.getElementById('info-modal-content');
  const infoCloseBtn = document.getElementById('info-close-btn');
  const btnInfoDismiss = document.getElementById('btn-info-dismiss');

  function openInfoModal(key) {
    const article = INFO_ARTICLES[key] || {
      pill: 'ABOUT',
      title: 'About BookLoop',
      body: '<p>Buy, rent and resell second-hand books. Read more, spend less, share stories.</p>'
    };

    if (infoModalPill) infoModalPill.textContent = article.pill;
    if (infoModalTitle) infoModalTitle.textContent = article.title;
    if (infoModalContent) infoModalContent.innerHTML = article.body;

    openModal('info-modal-backdrop');
  }

  if (infoCloseBtn) infoCloseBtn.addEventListener('click', () => closeModal('info-modal-backdrop'));
  if (btnInfoDismiss) btnInfoDismiss.addEventListener('click', () => closeModal('info-modal-backdrop'));

  // Wire all [data-info] links
  document.querySelectorAll('[data-info]').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      const key = el.getAttribute('data-info');
      if (key) openInfoModal(key);
    });
  });

  // Smooth scroll links & buttons
  const navHomeLink = document.getElementById('nav-home-link');
  const navExploreLink = document.getElementById('nav-explore-link');
  const footerCuratedLink = document.getElementById('footer-curated-link');
  const footerRentalLink = document.getElementById('footer-rental-link');
  const headerSearchBtn = document.getElementById('header-search-btn');
  const bookSearchInput = document.getElementById('book-search-input');
  const brandLogos = document.querySelectorAll('.brand-logo');

  if (navHomeLink) {
    navHomeLink.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  brandLogos.forEach(logo => {
    logo.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });

  if (navExploreLink) {
    navExploreLink.addEventListener('click', (e) => {
      e.preventDefault();
      document.getElementById('featured-books-grid')?.scrollIntoView({ behavior: 'smooth' });
    });
  }

  if (footerCuratedLink) {
    footerCuratedLink.addEventListener('click', (e) => {
      e.preventDefault();
      document.getElementById('featured-books-grid')?.scrollIntoView({ behavior: 'smooth' });
    });
  }

  if (footerRentalLink) {
    footerRentalLink.addEventListener('click', (e) => {
      e.preventDefault();
      document.getElementById('shelf-container')?.scrollIntoView({ behavior: 'smooth' });
    });
  }

  if (headerSearchBtn) {
    headerSearchBtn.addEventListener('click', () => {
      if (bookSearchInput) {
        bookSearchInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setTimeout(() => bookSearchInput.focus(), 400);
      }
    });
  }

  // =========================================================================
  // --- 25. MOBILE NAVIGATION DRAWER CONTROLLER ---
  // =========================================================================
  const hamburgerBtn = document.getElementById('hamburger-btn');
  const mobileNavDrawer = document.getElementById('mobile-nav-drawer');
  const mobileNavBackdrop = document.getElementById('mobile-nav-backdrop');
  const mobileNavClose = document.getElementById('mobile-nav-close');

  function openMobileNav() {
    if (mobileNavDrawer) mobileNavDrawer.classList.add('open');
    if (mobileNavBackdrop) mobileNavBackdrop.classList.add('open');
    document.body.classList.add('drawer-open');
    if (hamburgerBtn) hamburgerBtn.setAttribute('aria-expanded', 'true');
    if (customCursor) customCursor.classList.add('hidden-cursor');
  }

  function closeMobileNav() {
    if (mobileNavDrawer) mobileNavDrawer.classList.remove('open');
    if (mobileNavBackdrop) mobileNavBackdrop.classList.remove('open');
    if (hamburgerBtn) hamburgerBtn.setAttribute('aria-expanded', 'false');
    const anyOpen = document.querySelector('.slide-drawer.open, .modal-backdrop.open');
    if (!anyOpen) {
      document.body.classList.remove('drawer-open');
      if (customCursor) customCursor.classList.remove('hidden-cursor');
    }
  }

  if (hamburgerBtn) hamburgerBtn.addEventListener('click', openMobileNav);
  if (mobileNavClose) mobileNavClose.addEventListener('click', closeMobileNav);
  if (mobileNavBackdrop) mobileNavBackdrop.addEventListener('click', closeMobileNav);

  const mobHome = document.getElementById('mobile-nav-home');
  const mobExplore = document.getElementById('mobile-nav-explore');
  const mobSell = document.getElementById('mobile-nav-sell');
  const mobHunt = document.getElementById('mobile-nav-hunt');
  const mobWishlist = document.getElementById('mobile-nav-wishlist');
  const mobOrders = document.getElementById('mobile-nav-orders');
  const mobStandards = document.getElementById('mobile-nav-standards');
  const mobDeleteAll = document.getElementById('mobile-nav-delete-all');

  if (mobHome) {
    mobHome.addEventListener('click', (e) => {
      e.preventDefault();
      closeMobileNav();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  if (mobExplore) {
    mobExplore.addEventListener('click', (e) => {
      e.preventDefault();
      closeMobileNav();
      document.getElementById('featured-books-grid')?.scrollIntoView({ behavior: 'smooth' });
    });
  }

  if (mobSell) {
    mobSell.addEventListener('click', (e) => {
      e.preventDefault();
      closeMobileNav();
      openSellModal();
    });
  }

  if (mobHunt) {
    mobHunt.addEventListener('click', (e) => {
      e.preventDefault();
      closeMobileNav();
      openTreasureHuntModal();
    });
  }

  if (mobWishlist) {
    mobWishlist.addEventListener('click', () => {
      closeMobileNav();
      openWishlistDrawer();
    });
  }

  if (mobOrders) {
    mobOrders.addEventListener('click', () => {
      closeMobileNav();
      renderOrdersModal();
      openModal('orders-modal-backdrop');
    });
  }

  if (mobStandards) {
    mobStandards.addEventListener('click', () => {
      closeMobileNav();
      openInfoModal('standards');
    });
  }

  if (mobDeleteAll) {
    mobDeleteAll.addEventListener('click', () => {
      closeMobileNav();
      promptDeleteAllListings();
    });
  }

  // =========================================================================
  // --- 26. SCROLL-IN REVEAL & PREFERS-REDUCED-MOTION ---
  // =========================================================================
  const revealTargets = document.querySelectorAll(
    '.section-header-row, .search-interactive-container, .genre-card, .book-card, .treasure-banner-card, .hunt-step-card, .testimonial-card, .footer-top-grid > div'
  );
  revealTargets.forEach(el => el.classList.add('scroll-reveal'));

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!prefersReducedMotion && 'IntersectionObserver' in window) {
    const scrollObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          scrollObserver.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      threshold: 0.08,
      rootMargin: '0px 0px -20px 0px'
    });

    revealTargets.forEach(el => scrollObserver.observe(el));
  } else {
    revealTargets.forEach(el => el.classList.add('revealed'));
  }

  // --- 27. INITIALIZATION & TEST HOOKS ---
  updateAuthUI();
  updateWishlistUI();
  updateCartUI();
  renderFeaturedGrid();

  // URL Hash testing hooks
  if (window.location.hash === '#open-detail') {
    openDetail(false);
  } else if (window.location.hash === '#open-detail-instant') {
    openDetail(true);
  } else if (window.location.hash === '#open-cart') {
    openCartDrawer();
  } else if (window.location.hash === '#open-wishlist') {
    openWishlistDrawer();
  } else if (window.location.hash === '#open-checkout') {
    openCheckoutModal();
  } else if (window.location.hash === '#open-sell') {
    openSellModal();
  } else if (window.location.hash === '#open-hunt') {
    openTreasureHuntModal();
  } else if (window.location.hash === '#open-auth') {
    openModal('auth-modal-backdrop');
  } else if (window.location.hash === '#open-orders') {
    renderOrdersModal();
    openModal('orders-modal-backdrop');
  } else if (window.location.hash === '#open-info') {
    openInfoModal('standards');
  } else if (window.location.hash === '#open-mobile-nav') {
    openMobileNav();
  }

});
