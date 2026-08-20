/* Shaker DCN Nutrition — lógica de la tienda (menú, carrito, checkout por WhatsApp) */
(() => {
  "use strict";

  const fmt = (n) => `${SHAKER_CONFIG.currency}${Math.round(n).toLocaleString("es-DO")}`;
  const esc = (s) =>
    String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
  const normalize = (s) =>
    s
      .toLowerCase()
      .replace(/[áàäâ]/g, "a")
      .replace(/[éèëê]/g, "e")
      .replace(/[íìïî]/g, "i")
      .replace(/[óòöô]/g, "o")
      .replace(/[úùüû]/g, "u")
      .replace(/ñ/g, "n");
  const prefersReducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------------- Foco para diálogos (carrito, ficha de opciones) ---------------- */
  let lastFocusedEl = null;
  function focusableIn(container) {
    return $$('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])', container).filter(
      (el) => !el.disabled && el.offsetParent !== null
    );
  }
  function focusDialog(container) {
    lastFocusedEl = document.activeElement;
    const target = focusableIn(container)[0];
    if (target) target.focus();
  }
  function restoreFocus() {
    if (lastFocusedEl && typeof lastFocusedEl.focus === "function") lastFocusedEl.focus();
    lastFocusedEl = null;
  }

  /* ---------------- Número animado (para los totales del carrito) ---------------- */
  function animateNumber(el, to) {
    const from = Number(el.dataset.val || 0);
    el.dataset.val = to;
    if (prefersReducedMotion || from === to) {
      el.textContent = fmt(to);
      return;
    }
    const duration = 320;
    const start = performance.now();
    function tick(now) {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = fmt(from + (to - from) * eased);
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
    // Red de seguridad: si la pestaña está en segundo plano, rAF no corre —
    // igual garantizamos que el total quede correcto.
    setTimeout(() => {
      el.textContent = fmt(to);
    }, duration + 80);
  }

  /* ---------------- WhatsApp / social links ---------------- */
  const waUrl = (msg) => `https://wa.me/${SHAKER_CONFIG.whatsappPedidos}?text=${encodeURIComponent(msg)}`;
  const isTouch = matchMedia("(pointer: coarse)").matches;
  function openWhatsApp(url) {
    // En móvil evitamos dejar una pestaña en blanco al saltar a la app de WhatsApp.
    if (isTouch) {
      location.href = url;
    } else {
      window.open(url, "_blank", "noopener");
    }
  }
  $("#headerWaLink").href = waUrl("Hola, quiero más información de Shaker.");
  $("#footerWaLink").href = waUrl("Hola, quiero más información de Shaker.");
  $("#heroTrainingBtn").href = waUrl(
    "Hola, quiero información sobre un plan de entrenamiento personalizado y alimentación."
  );
  $("#footerIgLink").href = `https://instagram.com/${SHAKER_CONFIG.instagram}`;
  $("#year").textContent = new Date().getFullYear();

  /* ---------------- Iconos de línea, trazo suelto a juego con el logo ---------------- */
  const ICON_STROKE = 'fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"';
  const CAT_ICONS = {
    desayunos: `<svg viewBox="0 0 24 24" ${ICON_STROKE}><ellipse cx="11.5" cy="13" rx="7.3" ry="5.3"/><circle cx="13.3" cy="12.2" r="2.6"/></svg>`,
    almuerzos: `<svg viewBox="0 0 24 24" ${ICON_STROKE}><path d="M4 11h16c0 4.2-3.6 7.4-8 7.4s-8-3.2-8-7.4z"/><path d="M4.4 11c-.1-.6.3-1.1.9-1.1h13.4c.6 0 1 .5.9 1.1"/><path d="M9 6.2c-.7.6-.7 1.5 0 2.1M13.4 5.4c-.7.6-.7 1.5 0 2.1"/></svg>`,
    bebidas: `<svg viewBox="0 0 24 24" ${ICON_STROKE}><path d="M8.3 8.4h7.4l-.9 10c-.1.9-.8 1.6-1.7 1.6h-2.2c-.9 0-1.6-.7-1.7-1.6l-.9-10z"/><path d="M7.6 8.4h8.8"/><path d="M12 8.4V3"/><path d="M10.6 3h2.8"/></svg>`,
    aperitivos: `<svg viewBox="0 0 24 24" ${ICON_STROKE}><path d="M7.4 10h7.6l-.9 8.3c-.1.9-.8 1.6-1.7 1.6h-2.4c-.9 0-1.6-.7-1.7-1.6L7.4 10z"/><path d="M6.8 10h8.8"/><path d="M16.6 4c1.5.5 2.2 2 1.7 3.5-.4 1-1.2 1.7-1.9 2.1"/><circle cx="17.2" cy="3.6" r="1.4"/></svg>`,
    "menu-fat": `<svg viewBox="0 0 24 24" ${ICON_STROKE}><path d="M4.2 10.2c-.2-3.2 3.5-5.4 7.8-5.4s8 2.2 7.8 5.4"/><path d="M3.6 10.2h16.8"/><path d="M4 13.4h16"/><path d="M4.4 16.5h15.2"/><path d="M3.6 19.5h16.8"/></svg>`,
  };
  const catIconHtml = (cat) => CAT_ICONS[cat.id] || `<span>${cat.icon}</span>`;

  const ICONS = {
    avocado: `<svg viewBox="0 0 24 24" ${ICON_STROKE}><path d="M12 3c3.4 0 5.5 3.6 5.5 7.8 0 5.4-3 10-5.5 10s-5.5-4.6-5.5-10C6.5 6.6 8.6 3 12 3z"/><circle cx="12" cy="13.4" r="2.7"/></svg>`,
    plate: `<svg viewBox="0 0 24 24" ${ICON_STROKE}><circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="4"/></svg>`,
    dumbbell: `<svg viewBox="0 0 24 24" ${ICON_STROKE}><path d="M4 12h16"/><path d="M6.5 8.5v7M4.5 9.8v4.4"/><path d="M17.5 8.5v7M19.5 9.8v4.4"/></svg>`,
    trophy: `<svg viewBox="0 0 24 24" ${ICON_STROKE}><path d="M8 4h8v4a4 4 0 01-8 0V4z"/><path d="M8 5H5.7a2 2 0 000 4H8M16 5h2.3a2 2 0 010 4H16"/><path d="M12 12v3.4M9 19h6M9.6 16.4h4.8v2.6H9.6z"/></svg>`,
    scooter: `<svg viewBox="0 0 24 24" ${ICON_STROKE}><circle cx="6" cy="17" r="2.2"/><circle cx="17" cy="17" r="2.2"/><path d="M6 17h5.5l2-6h3"/><path d="M13.5 11h2.5"/><path d="M17 8.5v3"/></svg>`,
    house: `<svg viewBox="0 0 24 24" ${ICON_STROKE}><path d="M4 11.3L12 4.2l8 7.1"/><path d="M6 10v9h12v-9"/><path d="M10 19v-5h4v5"/></svg>`,
    pencil: `<svg viewBox="0 0 24 24" ${ICON_STROKE}><path d="M4 20l.9-3.9L15.6 5.4l3 3L7.9 19.1 4 20z"/><path d="M13.7 7.3l3 3"/></svg>`,
    trash: `<svg viewBox="0 0 24 24" ${ICON_STROKE}><path d="M4.5 7h15"/><path d="M9.3 7V4.3h5.4V7"/><path d="M6.3 7l1 12.5h9.4l1-12.5"/><path d="M10.2 10.8v6M13.8 10.8v6"/></svg>`,
  };
  const icon = (name) => `<span class="icon">${ICONS[name] || ""}</span>`;
  $$("[data-icon]").forEach((el) => {
    el.innerHTML = ICONS[el.dataset.icon] || "";
  });

  /* ---------------- Titular rotativo del hero ----------------
     Esta lista va embebida (no solo en assets/data/taglines.json) para que
     la rotación funcione siempre, incluso si el archivo se abre haciendo
     doble clic en index.html en vez de servirlo — ahí el navegador bloquea
     el fetch() de archivos locales y solo tendríamos el texto fijo. */
  const DEFAULT_TAGLINES = [
    { before: "Tu próxima", accent: "comida buena", after: "está a un toque" },
    { before: "Aquí la comida", accent: "sí es real", after: "y se nota" },
    { before: "Tu antojo saludable,", accent: "resuelto", after: "en minutos" },
    { before: "Comer bien", accent: "no es complicado", after: "aquí lo comprobamos" },
    { before: "De la plancha", accent: "a tu mesa", after: "sin vueltas" },
    { before: "Rico, fresco", accent: "y hecho", after: "para ti" },
  ];
  const pickRandom = (list) => list[Math.floor(Math.random() * list.length)];
  function renderHeadline(t) {
    $("#heroHeadline").innerHTML = `${esc(t.before)}<br />
      <span class="hero__accent">${esc(t.accent)}</span><br />
      ${esc(t.after)}`;
  }
  renderHeadline(pickRandom(DEFAULT_TAGLINES));
  fetch("assets/data/taglines.json")
    .then((r) => (r.ok ? r.json() : null))
    .then((list) => {
      if (!Array.isArray(list) || !list.length) return;
      renderHeadline(pickRandom(list));
    })
    .catch(() => {});

  /* ---------------- Render category nav ---------------- */
  const catNavTrack = $("#catNavTrack");
  catNavTrack.innerHTML = MENU.map(
    (cat) =>
      `<button type="button" class="cat-chip" data-cat="${cat.id}"><span class="cat-icon">${catIconHtml(cat)}</span>${esc(cat.name)}</button>`
  ).join("");

  /* ---------------- Render bento (grilla visual de categorías) ---------------- */
  const bentoGrid = $("#bentoGrid");
  bentoGrid.innerHTML = MENU.map((cat, i) => {
    const wide = i === 0 ? " bento-tile--wide" : "";
    const delay = ` style="transition-delay:${Math.min(i * 60, 240)}ms"`;
    if (!cat.img) {
      return `
        <button type="button" class="bento-tile bento-tile--noimg reveal${wide}" data-cat="${cat.id}"${delay}>
          <strong><span class="cat-icon">${catIconHtml(cat)}</span>${esc(cat.name)}</strong>
          <span>${esc(cat.tagline || "")}</span>
        </button>`;
    }
    return `
      <button type="button" class="bento-tile reveal${wide}" data-cat="${cat.id}"${delay}>
        <img src="${cat.img}" alt="" loading="lazy" />
        <span class="bento-tile__scrim"></span>
        <span class="bento-tile__label"><strong><span class="cat-icon">${catIconHtml(cat)}</span>${esc(cat.name)}</strong><span>${esc(cat.tagline || "")}</span></span>
      </button>`;
  }).join("");
  bentoGrid.addEventListener("click", (e) => {
    const tile = e.target.closest(".bento-tile");
    if (tile) openCategory(tile.dataset.cat);
  });

  /* ---------------- Render ofertas ---------------- */
  const offersSection = $("#offersSection");
  const offersTrack = $("#offersTrack");
  fetch("assets/data/offers.json")
    .then((r) => (r.ok ? r.json() : []))
    .then((offers) => {
      const activas = (offers || []).filter((o) => o.activa);
      if (!activas.length) return;
      offersTrack.innerHTML = activas
        .map(
          (o) => `
        <article class="offer-card">
          ${o.etiqueta ? `<span class="offer-card__tag">${esc(o.etiqueta)}</span>` : ""}
          ${o.imagen ? `<img src="${o.imagen}" alt="" loading="lazy">` : ""}
          <div class="offer-card__body">
            <h3>${esc(o.titulo)}</h3>
            <p>${esc(o.descripcion || "")}</p>
            <div class="offer-card__row">
              <div class="offer-card__price">
                <span class="offer-card__now">${fmt(o.precio)}</span>
                ${o.precioAntes ? `<span class="offer-card__before">${fmt(o.precioAntes)}</span>` : ""}
              </div>
              <button type="button" class="offer-card__add" data-name="${esc(o.titulo)}" data-price="${o.precio}">Agregar</button>
            </div>
          </div>
        </article>`
        )
        .join("");
      offersSection.hidden = false;
    })
    .catch(() => {});

  offersTrack?.addEventListener("click", (e) => {
    const btn = e.target.closest(".offer-card__add");
    if (!btn) return;
    addToCart({
      catId: "ofertas",
      catName: "Ofertas",
      name: btn.dataset.name,
      basePrice: Number(btn.dataset.price),
      mods: [],
      qty: 1,
    });
    toast(`${btn.dataset.name} agregado ✅`);
  });

  /* ---------------- Buscar un producto del catálogo por categoría + nombre ---------------- */
  function findMenuItem(catId, name) {
    const cat = MENU.find((c) => c.id === catId);
    if (!cat) return null;
    if (cat.items) {
      const item = cat.items.find((i) => i.name === name);
      if (item) return { cat, item };
    }
    if (cat.subgroups) {
      for (const sg of cat.subgroups) {
        const item = sg.items.find((i) => i.name === name);
        if (item) return { cat, item };
      }
    }
    return null;
  }

  /* ---------------- Render menu ---------------- */
  const menuEl = $("#menu");
  const menuListEl = $("#menuList");
  const menuSearchEmpty = $("#menuSearchEmpty");

  function renderModifierHint(cat, item) {
    if (!item.modifiers || !item.modifiers.length) return "";
    const labels = item.modifiers.map((key) => cat.modifierGroups[key].label);
    return `<p class="item-row__hint">${esc(labels.join(" · "))}</p>`;
  }

  function itemRowHtml(cat, item, idx) {
    return `
      <div class="item-row" data-cat="${cat.id}" data-item="${idx}" data-name="${esc(normalize(item.name))}">
        <div class="item-row__text">
          <h4>${esc(item.name)}</h4>
          ${renderModifierHint(cat, item)}
        </div>
        <span class="item-row__price">${fmt(item.price)}</span>
        <button type="button" class="item-row__add" aria-label="Agregar ${esc(item.name)}">+</button>
      </div>`;
  }

  function subgroupHtml(cat, items, idxPrefix, label) {
    const rows = items.map((item, i) => itemRowHtml(cat, item, `${idxPrefix}${i}`)).join("");
    return `
      <div class="subgroup">
        ${label ? `<p class="subgroup-label">${esc(label)}</p>` : ""}
        ${rows}
      </div>`;
  }

  menuListEl.innerHTML = MENU.map((cat, catIdx) => {
    let bodyHtml = "";
    let count = 0;

    if (cat.items) {
      count += cat.items.length;
      bodyHtml += subgroupHtml(cat, cat.items, "", null);
    }
    if (cat.subgroups) {
      cat.subgroups.forEach((sg, sgIdx) => {
        count += sg.items.length;
        bodyHtml += subgroupHtml(cat, sg.items, `sg${sgIdx}-`, sg.label);
      });
    }

    const thumb = cat.img ? `<img src="${cat.img}" alt="" loading="lazy">` : catIconHtml(cat);

    return `
      <section class="cat-section reveal${catIdx === 0 ? " is-open" : ""}" id="cat-${cat.id}" data-cat-id="${cat.id}">
        <button type="button" class="cat-section__header" aria-expanded="${catIdx === 0}">
          <span class="cat-section__thumb">${thumb}</span>
          <span class="cat-section__text">
            <h2>${esc(cat.name)}</h2>
            <p>${esc(cat.tagline || "")}</p>
          </span>
          <span class="cat-section__meta">
            <span class="cat-section__count">${count}</span>
            <svg class="cat-section__chevron" width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </span>
        </button>
        <div class="cat-section__panel">
          <div class="cat-section__inner">${bodyHtml}</div>
        </div>
      </section>`;
  }).join("");

  /* ---------------- Accordion behaviour ---------------- */
  $$(".cat-section__header").forEach((btn) => {
    btn.addEventListener("click", () => {
      const section = btn.closest(".cat-section");
      const open = section.classList.toggle("is-open");
      btn.setAttribute("aria-expanded", String(open));
    });
  });

  function openCategory(catId) {
    clearMenuSearch();
    const section = $(`#cat-${catId}`);
    if (!section) return;
    section.classList.add("is-open");
    $(".cat-section__header", section).setAttribute("aria-expanded", "true");
    section.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  $$(".cat-chip").forEach((chip) => {
    chip.addEventListener("click", () => openCategory(chip.dataset.cat));
  });

  /* ---------------- Active chip on scroll ---------------- */
  const chipByCat = Object.fromEntries($$(".cat-chip").map((c) => [c.dataset.cat, c]));
  const sections = $$(".cat-section");
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const id = entry.target.dataset.catId;
        $$(".cat-chip").forEach((c) => c.classList.remove("is-active"));
        chipByCat[id]?.classList.add("is-active");
        chipByCat[id]?.scrollIntoView({ inline: "center", block: "nearest", behavior: "smooth" });
      });
    },
    { rootMargin: "-45% 0px -50% 0px" }
  );
  sections.forEach((s) => io.observe(s));

  /* ---------------- Reveal al hacer scroll ---------------- */
  const revealIo = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        revealIo.unobserve(entry.target);
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
  );
  if (prefersReducedMotion) {
    $$(".reveal").forEach((el) => el.classList.add("is-visible"));
  } else {
    $$(".reveal").forEach((el) => revealIo.observe(el));
    // Red de seguridad: si por lo que sea el observer nunca dispara
    // (pestaña en segundo plano, etc.), el contenido igual se ve.
    setTimeout(() => {
      $$(".reveal:not(.is-visible)").forEach((el) => el.classList.add("is-visible"));
    }, 1200);
  }

  /* ---------------- Búsqueda en vivo del menú ---------------- */
  const menuSearchInput = $("#menuSearch");
  const menuSearchClear = $("#menuSearchClear");

  function clearMenuSearch() {
    if (!menuSearchInput.value) return;
    menuSearchInput.value = "";
    applyMenuSearch("");
  }

  function applyMenuSearch(rawQuery) {
    const query = normalize(rawQuery.trim());
    menuSearchClear.hidden = !query;

    if (!query) {
      sections.forEach((section, i) => {
        section.hidden = false;
        section.classList.toggle("is-open", i === 0);
        $(".cat-section__header", section).setAttribute("aria-expanded", String(i === 0));
        $$(".subgroup", section).forEach((sg) => (sg.hidden = false));
        $$(".item-row", section).forEach((row) => (row.hidden = false));
      });
      menuSearchEmpty.hidden = true;
      return;
    }

    let anyMatch = false;
    sections.forEach((section) => {
      let sectionHasMatch = false;
      $$(".subgroup", section).forEach((sg) => {
        let sgHasMatch = false;
        $$(".item-row", sg).forEach((row) => {
          const match = row.dataset.name.includes(query);
          row.hidden = !match;
          if (match) sgHasMatch = true;
        });
        sg.hidden = !sgHasMatch;
      });
      sectionHasMatch = $$(".subgroup", section).some((sg) => !sg.hidden);
      section.hidden = !sectionHasMatch;
      section.classList.toggle("is-open", sectionHasMatch);
      $(".cat-section__header", section).setAttribute("aria-expanded", String(sectionHasMatch));
      if (sectionHasMatch) {
        anyMatch = true;
        section.classList.add("is-visible"); // resultados de búsqueda no dependen del scroll-reveal
      }
    });

    menuSearchEmpty.hidden = anyMatch;
  }

  let searchDebounce;
  menuSearchInput.addEventListener("input", () => {
    clearTimeout(searchDebounce);
    searchDebounce = setTimeout(() => applyMenuSearch(menuSearchInput.value), 120);
  });
  menuSearchClear.addEventListener("click", () => {
    clearMenuSearch();
    menuSearchInput.focus();
  });

  /* ================================================================
     CART
     ================================================================ */
  let cart = [];
  try {
    cart = JSON.parse(localStorage.getItem("shaker_cart") || "[]");
  } catch {
    cart = [];
  }

  const saveCart = () => localStorage.setItem("shaker_cart", JSON.stringify(cart));

  function cartTotal() {
    return cart.reduce((sum, line) => sum + line.unitPrice * line.qty, 0);
  }
  function cartCount() {
    return cart.reduce((sum, line) => sum + line.qty, 0);
  }

  function lineKey(catId, name, mods) {
    return `${catId}::${name}::${mods.map((m) => m.name).sort().join("|")}`;
  }

  function addToCart({ catId, catName, name, basePrice, mods = [], qty = 1 }) {
    const modsTotal = mods.reduce((s, m) => s + m.price, 0);
    const unitPrice = basePrice + modsTotal;
    const key = lineKey(catId, name, mods);
    const existing = cart.find((l) => l.key === key);
    if (existing) {
      existing.qty += qty;
    } else {
      cart.push({ key, catId, catName, name, basePrice, mods, unitPrice, qty });
    }
    saveCart();
    renderCart();
  }

  function changeQty(key, delta) {
    const line = cart.find((l) => l.key === key);
    if (!line) return;
    line.qty += delta;
    if (line.qty <= 0) cart = cart.filter((l) => l.key !== key);
    saveCart();
    renderCart();
  }

  function removeLine(key) {
    cart = cart.filter((l) => l.key !== key);
    saveCart();
    renderCart();
  }

  const cartFab = $("#cartFab");
  const cartFabCount = $("#cartFabCount");
  const cartFabTotal = $("#cartFabTotal");
  const cartSummaryCount = $("#cartSummaryCount");
  const cartSummaryTotal = $("#cartSummaryTotal");
  const cartList = $("#cartList");
  const cartEmpty = $("#cartEmpty");
  const cartTotals = $("#cartTotals");
  const cartSubtotal = $("#cartSubtotal");
  const checkoutForm = $("#checkoutForm");
  const sendOrderBtn = $("#sendOrderBtn");

  function renderCart() {
    const count = cartCount();
    const total = cartTotal();

    cartFab.classList.toggle("is-visible", count > 0);
    cartFabCount.textContent = count;
    animateNumber(cartFabTotal, total);
    cartSummaryCount.textContent = `${count} ${count === 1 ? "ítem" : "ítems"}`;
    animateNumber(cartSummaryTotal, total);
    animateNumber(cartSubtotal, total);

    if (!cart.length) orderSent.hidden = true;
    cartEmpty.style.display = cart.length ? "none" : "block";
    cartTotals.style.display = cart.length ? "block" : "none";
    checkoutForm.style.display = cart.length && orderSent.hidden ? "flex" : "none";

    cartList.innerHTML = cart
      .map((line) => {
        const modsText = line.mods.length ? line.mods.map((m) => m.name).join(", ") : "";
        const found = findMenuItem(line.catId, line.name);
        const canEdit = !!(found && found.item.modifiers && found.item.modifiers.length);
        return `
        <li class="cart-item" data-key="${esc(line.key)}">
          <div class="cart-item__text">
            <h5>${esc(line.name)}</h5>
            ${modsText ? `<p class="cart-item__mods">${esc(modsText)}</p>` : ""}
            <div class="cart-item__row2">
              <div class="cart-item__qty">
                <button type="button" data-action="minus" aria-label="Quitar uno">−</button>
                <span>${line.qty}</span>
                <button type="button" data-action="plus" aria-label="Agregar uno">+</button>
              </div>
              <span class="cart-item__price">${fmt(line.unitPrice * line.qty)}</span>
            </div>
            <div class="cart-item__actions">
              ${canEdit ? `<button type="button" class="cart-item__edit" data-action="edit">${icon("pencil")}Editar</button>` : ""}
              <button type="button" class="cart-item__remove" data-action="remove">${icon("trash")}Quitar</button>
            </div>
          </div>
        </li>`;
      })
      .join("");

    syncItemBadges();
  }

  function syncItemBadges() {
    $$(".item-row__add .item-row__badge").forEach((b) => b.remove());
    const totals = {};
    cart.forEach((line) => {
      const k = `${line.catId}::${line.name}`;
      totals[k] = (totals[k] || 0) + line.qty;
    });
    $$(".item-row").forEach((row) => {
      const h4 = row.querySelector("h4");
      if (!h4) return;
      const qty = totals[`${row.dataset.cat}::${h4.textContent}`];
      if (!qty) return;
      const badge = document.createElement("span");
      badge.className = "item-row__badge";
      badge.textContent = String(qty);
      row.querySelector(".item-row__add").appendChild(badge);
    });
  }

  cartList.addEventListener("click", (e) => {
    const btn = e.target.closest("button");
    if (!btn) return;
    const key = btn.closest(".cart-item").dataset.key;
    const action = btn.dataset.action;
    if (action === "plus") changeQty(key, 1);
    if (action === "minus") changeQty(key, -1);
    if (action === "remove") removeLine(key);
    if (action === "edit") {
      const line = cart.find((l) => l.key === key);
      if (!line) return;
      const found = findMenuItem(line.catId, line.name);
      if (!found) return;
      openModifierSheet(found.cat, found.item, { key: line.key, presetMods: line.mods, qty: line.qty });
    }
  });

  /* ---------------- Cart panel open/close (mobile) ---------------- */
  const cartPanel = $("#cartPanel");
  const sheetBackdrop = $("#sheetBackdrop");

  function openCartPanel() {
    cartPanel.classList.add("is-open");
    sheetBackdrop.classList.add("is-visible");
    if (window.innerWidth < 960) focusDialog(cartPanel);
  }
  function closeCartPanel() {
    cartPanel.classList.remove("is-open");
    sheetBackdrop.classList.remove("is-visible");
    if (window.innerWidth < 960) restoreFocus();
  }
  $("#cartFabBtn").addEventListener("click", openCartPanel);
  $("#cartCloseBtn").addEventListener("click", closeCartPanel);
  sheetBackdrop.addEventListener("click", () => {
    if (modifierSheetWrap.classList.contains("is-open")) closeModifierSheet();
    else closeCartPanel();
  });

  /* ---------------- Delivery address toggle ---------------- */
  const direccionField = $("#direccionField");
  $$('input[name="entrega"]').forEach((radio) => {
    radio.addEventListener("change", () => {
      const isDelivery = $('input[name="entrega"]:checked').value === "Entrega a domicilio";
      direccionField.hidden = !isDelivery;
      direccionField.querySelector("input").required = isDelivery;
    });
  });

  /* ---------------- Toast ---------------- */
  const toastEl = $("#toast");
  let toastTimer;
  function toast(msg) {
    toastEl.textContent = msg;
    toastEl.classList.add("is-visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove("is-visible"), 1900);
  }

  /* ================================================================
     MODIFIER SHEET
     ================================================================ */
  const modifierSheetWrap = $("#modifierSheetWrap");
  const modifierSheet = $("#modifierSheet");
  const modifierTitle = $("#modifierTitle");
  const modifierBody = $("#modifierBody");
  const modifierAdd = $("#modifierAdd");
  const qtyValueEl = $("#qtyValue");
  let sheetCtx = null; // { cat, item, qty, editingKey }

  function openModifierSheet(cat, item, editCtx = null) {
    sheetCtx = { cat, item, qty: editCtx ? editCtx.qty : 1, selections: {}, editingKey: editCtx ? editCtx.key : null };

    item.modifiers.forEach((key) => {
      const group = cat.modifierGroups[key];
      sheetCtx.selections[key] = group.type === "multi" ? [] : null;
    });

    modifierTitle.textContent = item.name;
    modifierBody.innerHTML = item.modifiers
      .map((key) => {
        const group = cat.modifierGroups[key];
        const inputType = group.type === "multi" ? "checkbox" : "radio";
        const options = group.options
          .map(
            (opt, i) => `
          <label class="mod-option">
            <input type="${inputType}" name="mod-${key}" value="${i}">
            <span class="mod-option__name">${esc(opt.name)}</span>
            <span class="mod-option__price">${opt.price ? "+" + fmt(opt.price) : "Incluido"}</span>
          </label>`
          )
          .join("");
        return `
        <div class="mod-group" data-group="${key}">
          <p class="mod-group__label">${esc(group.label)} ${group.required ? '<span class="mod-group__required">Obligatorio</span>' : ""}</p>
          ${options}
        </div>`;
      })
      .join("");

    if (editCtx) {
      editCtx.presetMods.forEach((m) => {
        const group = cat.modifierGroups[m.groupKey];
        if (!group) return;
        const idx = group.options.findIndex((o) => o.name === m.name);
        if (idx === -1) return;
        const input = modifierBody.querySelector(`input[name="mod-${m.groupKey}"][value="${idx}"]`);
        if (input) {
          input.checked = true;
          input.dispatchEvent(new Event("change", { bubbles: true }));
        }
      });
    }

    qtyValueEl.textContent = String(sheetCtx.qty);
    updateSheetTotal();
    modifierSheetWrap.classList.add("is-open");
    sheetBackdrop.classList.add("is-visible");
    focusDialog(modifierSheet);
  }

  function closeModifierSheet() {
    modifierSheetWrap.classList.remove("is-open");
    sheetBackdrop.classList.remove("is-visible");
    sheetCtx = null;
    restoreFocus();
  }
  $("#modifierClose").addEventListener("click", closeModifierSheet);
  modifierSheetWrap.addEventListener("click", (e) => {
    if (e.target === modifierSheetWrap) closeModifierSheet();
  });

  modifierBody.addEventListener("change", (e) => {
    const input = e.target;
    if (!input.matches("input")) return;
    const groupKey = input.closest(".mod-group").dataset.group;
    const group = sheetCtx.cat.modifierGroups[groupKey];
    const opt = group.options[Number(input.value)];
    if (group.type === "multi") {
      const list = sheetCtx.selections[groupKey];
      const idx = list.findIndex((o) => o.name === opt.name);
      if (input.checked && idx === -1) list.push(opt);
      if (!input.checked && idx !== -1) list.splice(idx, 1);
    } else {
      sheetCtx.selections[groupKey] = opt;
    }
    updateSheetTotal();
  });

  function sheetIsValid() {
    if (!sheetCtx) return false;
    return sheetCtx.item.modifiers.every((key) => {
      const group = sheetCtx.cat.modifierGroups[key];
      if (!group.required) return true;
      const sel = sheetCtx.selections[key];
      return group.type === "multi" ? sel.length > 0 : sel !== null;
    });
  }

  function sheetModsFlat() {
    const flat = [];
    sheetCtx.item.modifiers.forEach((key) => {
      const group = sheetCtx.cat.modifierGroups[key];
      const sel = sheetCtx.selections[key];
      if (group.type === "multi") {
        sel.forEach((o) => flat.push({ groupKey: key, group: group.label, name: o.name, price: o.price }));
      } else if (sel) {
        flat.push({ groupKey: key, group: group.label, name: sel.name, price: sel.price });
      }
    });
    return flat;
  }

  function updateSheetTotal() {
    const mods = sheetModsFlat();
    const modsTotal = mods.reduce((s, m) => s + m.price, 0);
    const unit = sheetCtx.item.price + modsTotal;
    const total = unit * sheetCtx.qty;
    const verb = sheetCtx.editingKey ? "Actualizar" : "Agregar";
    modifierAdd.textContent = `${verb} · ${fmt(total)}`;
    modifierAdd.disabled = !sheetIsValid();
  }

  $("#qtyMinus").addEventListener("click", () => {
    if (!sheetCtx || sheetCtx.qty <= 1) return;
    sheetCtx.qty -= 1;
    qtyValueEl.textContent = sheetCtx.qty;
    updateSheetTotal();
  });
  $("#qtyPlus").addEventListener("click", () => {
    if (!sheetCtx) return;
    sheetCtx.qty += 1;
    qtyValueEl.textContent = sheetCtx.qty;
    updateSheetTotal();
  });

  modifierAdd.addEventListener("click", () => {
    if (!sheetCtx || !sheetIsValid()) return;
    const isEdit = !!sheetCtx.editingKey;
    if (isEdit) removeLine(sheetCtx.editingKey);
    addToCart({
      catId: sheetCtx.cat.id,
      catName: sheetCtx.cat.name,
      name: sheetCtx.item.name,
      basePrice: sheetCtx.item.price,
      mods: sheetModsFlat(),
      qty: sheetCtx.qty,
    });
    toast(isEdit ? `${sheetCtx.item.name} actualizado ✅` : `${sheetCtx.item.name} agregado ✅`);
    closeModifierSheet();
  });

  /* ---------------- Item add buttons (delegated) ---------------- */
  menuEl.addEventListener("click", (e) => {
    const addBtn = e.target.closest(".item-row__add");
    if (!addBtn) return;
    const row = addBtn.closest(".item-row");
    const cat = MENU.find((c) => c.id === row.dataset.cat);
    let item;
    if (String(row.dataset.item).startsWith("sg")) {
      const [, sgIdx, itemIdx] = row.dataset.item.match(/sg(\d+)-(\d+)/);
      item = cat.subgroups[Number(sgIdx)].items[Number(itemIdx)];
    } else {
      item = cat.items[Number(row.dataset.item)];
    }

    if (item.modifiers && item.modifiers.length) {
      openModifierSheet(cat, item);
      return;
    }

    addToCart({ catId: cat.id, catName: cat.name, name: item.name, basePrice: item.price, mods: [], qty: 1 });
    addBtn.classList.remove("is-added");
    void addBtn.offsetWidth;
    addBtn.classList.add("is-added");
    toast(`${item.name} agregado ✅`);
  });

  /* ================================================================
     CHECKOUT → WhatsApp
     ================================================================ */
  const orderSent = $("#orderSent");

  function showOrderSent() {
    checkoutForm.style.display = "none";
    orderSent.hidden = false;
  }
  function hideOrderSent() {
    orderSent.hidden = true;
    checkoutForm.style.display = cart.length ? "flex" : "none";
  }
  function clearCart() {
    cart = [];
    saveCart();
    renderCart();
    checkoutForm.reset();
    direccionField.hidden = true;
    hideOrderSent();
    toast("Carrito vaciado 🧹");
  }
  $("#keepEditingBtn").addEventListener("click", hideOrderSent);
  $("#confirmClearBtn").addEventListener("click", clearCart);
  $("#clearCartBtn").addEventListener("click", clearCart);

  checkoutForm.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!cart.length) return;

    const fd = new FormData(checkoutForm);
    const nombre = (fd.get("nombre") || "").toString().trim();
    const telefono = (fd.get("telefono") || "").toString().trim();
    const entrega = fd.get("entrega");
    const direccion = (fd.get("direccion") || "").toString().trim();
    const pago = fd.get("pago");
    const notas = (fd.get("notas") || "").toString().trim();

    if (!nombre) {
      toast("Escribe tu nombre para continuar");
      $('input[name="nombre"]').focus();
      return;
    }
    if (entrega === "Entrega a domicilio" && !direccion) {
      toast("Agrega la dirección de entrega");
      $('input[name="direccion"]').focus();
      return;
    }

    const lines = cart
      .map((line, i) => {
        const modsText = line.mods.length ? `\n   • ${line.mods.map((m) => m.name).join(", ")}` : "";
        return `${i + 1}) ${line.name} x${line.qty}${modsText}\n   ${fmt(line.unitPrice * line.qty)}`;
      })
      .join("\n\n");

    let msg = `${SHAKER_CONFIG.whatsappGreeting}\n\n${lines}\n\n— \nTotal: ${fmt(cartTotal())}\n\n`;
    msg += `Cliente: ${nombre}\n`;
    if (telefono) msg += `Teléfono: ${telefono}\n`;
    msg += `Entrega: ${entrega}${entrega === "Entrega a domicilio" ? " — " + direccion : ""}\n`;
    msg += `Pago: ${pago}\n`;
    if (notas) msg += `Notas: ${notas}\n`;

    openWhatsApp(waUrl(msg));
    showOrderSent();
  });

  /* ---------------- Escape para cerrar diálogos + trampa de foco (Tab) ---------------- */
  document.addEventListener("keydown", (e) => {
    const modifierOpen = modifierSheetWrap.classList.contains("is-open");
    const cartOpen = window.innerWidth < 960 && cartPanel.classList.contains("is-open");

    if (e.key === "Escape") {
      if (modifierOpen) closeModifierSheet();
      else if (cartOpen) closeCartPanel();
      return;
    }

    if (e.key === "Tab" && (modifierOpen || cartOpen)) {
      const container = modifierOpen ? modifierSheet : cartPanel;
      const focusable = focusableIn(container);
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  });

  /* ---------------- Volver arriba ---------------- */
  const toTopBtn = $("#toTopBtn");
  toTopBtn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

  /* ---------------- Header shadow + botón "volver arriba" en scroll ---------------- */
  const header = $("#siteHeader");
  window.addEventListener(
    "scroll",
    () => {
      header.style.boxShadow = window.scrollY > 8 ? "var(--shadow-sm)" : "none";
      toTopBtn.classList.toggle("is-visible", window.scrollY > 900);
    },
    { passive: true }
  );

  /* ---------------- Mosaico del hero: leve efecto de profundidad con el mouse ---------------- */
  const mosaic = $(".hero__mosaic");
  const canHover = matchMedia("(hover: hover) and (pointer: fine)").matches;
  if (mosaic && canHover && !prefersReducedMotion) {
    const layers = [
      { el: $(".mosaic__img--a", mosaic), base: -3, range: 4, depth: 10 },
      { el: $(".mosaic__img--b", mosaic), base: 4, range: 6, depth: 18 },
      { el: $(".mosaic__img--c", mosaic), base: -4, range: 7, depth: 22 },
    ];
    mosaic.addEventListener("pointermove", (e) => {
      const rect = mosaic.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width - 0.5; // -0.5..0.5
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      layers.forEach(({ el, base, range, depth }) => {
        if (!el) return;
        el.style.transform = `rotate(${base + px * range}deg) translate(${px * depth}px, ${py * depth}px)`;
      });
    });
    mosaic.addEventListener("pointerleave", () => {
      layers.forEach(({ el }) => el && (el.style.transform = ""));
    });
  }

  renderCart();
})();
