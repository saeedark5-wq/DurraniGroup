document.addEventListener("DOMContentLoaded", function () {
  function initI18n() {
    if (typeof I18N === "undefined") return;
    var saved = "en";
    try { saved = localStorage.getItem("durrani_lang") || "en"; } catch (e) {}
    if (!I18N[saved]) saved = I18N_DEFAULT;

    function applyLang(lang) {
      var dict = I18N[lang] || I18N[I18N_DEFAULT];
      document.querySelectorAll("[data-i18n]").forEach(function (el) {
        var key = el.getAttribute("data-i18n");
        if (dict[key]) el.innerHTML = dict[key];
      });
      document.querySelectorAll(".lang-btn").forEach(function (b) {
        b.classList.toggle("active", b.getAttribute("data-lang") === lang);
      });
      var html = document.documentElement;
      html.lang = lang;
      if (lang === "ur" || lang === "ps") {
        html.setAttribute("dir", "rtl");
        html.classList.add("rtl-lang");
      } else {
        html.removeAttribute("dir");
        html.classList.remove("rtl-lang");
      }
      try { localStorage.setItem("durrani_lang", lang); } catch (e) {}
    }

    applyLang(saved);

    document.querySelectorAll(".lang-btn").forEach(function (btn) {
      btn.addEventListener("click", function () {
        applyLang(btn.getAttribute("data-lang"));
      });
    });
  }
  initI18n();

  const revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("visible"); });
  }

  const heroSlides = document.getElementById("heroSlides");
  if (heroSlides) {
    const slides = heroSlides.querySelectorAll(".hero-slide");
    const dotsWrap = document.getElementById("heroDots");
    const captionEl = document.getElementById("heroCaption");
    let current = 0;
    let timer = null;

    function setCaption() {
      if (!captionEl) return;
      const cap = slides[current].getAttribute("data-caption");
      captionEl.textContent = cap || "";
    }

    function goTo(i) {
      slides[current].classList.remove("active");
      current = (i + slides.length) % slides.length;
      slides[current].classList.add("active");
      const dots = dotsWrap.querySelectorAll("button");
      dots.forEach(function (d, idx) { d.classList.toggle("active", idx === current); });
      slides.forEach(function (s) {
        const v = s.querySelector("video");
        if (v) { if (s.classList.contains("active")) v.play().catch(function () {}); else v.pause(); }
      });
      setCaption();
    }

    slides.forEach(function (_, idx) {
      const dot = document.createElement("button");
      if (idx === 0) dot.classList.add("active");
      dot.setAttribute("aria-label", "Slide " + (idx + 1));
      dot.addEventListener("click", function () {
        goTo(idx);
        restart();
      });
      dotsWrap.appendChild(dot);
    });

    function restart() {
      if (timer) clearInterval(timer);
      timer = setInterval(function () { goTo(current + 1); }, 6000);
    }
    restart();
  }

  const counters = document.querySelectorAll(".counter");
  if (counters.length && "IntersectionObserver" in window) {
    const co = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          const target = parseInt(el.getAttribute("data-target"), 10);
          const duration = 1800;
          const start = performance.now();
          function tick(now) {
            const p = Math.min((now - start) / duration, 1);
            el.textContent = Math.floor(target * (1 - Math.pow(1 - p, 3))).toLocaleString("en-US");
            if (p < 1) requestAnimationFrame(tick);
          }
          requestAnimationFrame(tick);
          co.unobserve(el);
        });
      },
      { threshold: 0.4 }
    );
    counters.forEach(function (el) { co.observe(el); });
  }

  const projectsSlider = document.getElementById("projectsSlider");
  if (projectsSlider) {
    const prev = document.getElementById("projPrev");
    const next = document.getElementById("projNext");
    const step = 386;
    prev.addEventListener("click", function () { projectsSlider.scrollBy({ left: -step, behavior: "smooth" }); });
    next.addEventListener("click", function () { projectsSlider.scrollBy({ left: step, behavior: "smooth" }); });
  }

  const tTrack = document.getElementById("tTrack");
  if (tTrack) {
    const slides = tTrack.children;
    const dotsWrap = document.getElementById("tDots");
    let current = 0;
    let tTimer = null;

    for (let i = 0; i < slides.length; i++) {
      const dot = document.createElement("button");
      if (i === 0) dot.classList.add("active");
      dot.setAttribute("aria-label", "Testimonial " + (i + 1));
      dot.addEventListener("click", function () { go(i); restartT(); });
      dotsWrap.appendChild(dot);
    }
    const dots = dotsWrap.querySelectorAll("button");

    function go(i) {
      current = (i + slides.length) % slides.length;
      tTrack.style.transform = "translateX(-" + current * 100 + "%)";
      dots.forEach(function (d, idx) { d.classList.toggle("active", idx === current); });
    }
    function restartT() {
      if (tTimer) clearInterval(tTimer);
      tTimer = setInterval(function () { go(current + 1); }, 6000);
    }
    restartT();
  }

  const consultForm = document.getElementById("consultForm");
  if (consultForm) {
    consultForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const name = document.getElementById("cfName").value.trim();
      const phone = document.getElementById("cfPhone").value.trim();
      const city = document.getElementById("cfCity").value.trim();
      const project = document.getElementById("cfProject").value;
      const msg = document.getElementById("cfMsg").value.trim();
      const text =
        "Hello Durrani Group of Companies!%0A%0A" +
        "Name: " + encodeURIComponent(name) + "%0A" +
        "Phone: " + encodeURIComponent(phone) + "%0A" +
        "City: " + encodeURIComponent(city || "Not provided") + "%0A" +
        "Interested Project: " + encodeURIComponent(project) + "%0A" +
        "Message: " + encodeURIComponent(msg || "Free consultation request");
      window.open("https://wa.me/923368800085?text=" + text, "_blank");
    });
  }

  const galleryItems = document.querySelectorAll(".proj-gallery figure");
  if (galleryItems.length) {
    const lightbox = document.createElement("div");
    lightbox.className = "lightbox";
    lightbox.innerHTML =
      '<button class="lb-close" aria-label="Close"><span class="material-icons">close</span></button>' +
      '<button class="lb-prev" aria-label="Previous"><span class="material-icons">chevron_left</span></button>' +
      '<button class="lb-next" aria-label="Next"><span class="material-icons">chevron_right</span></button>' +
      '<div class="lb-media"></div>';
    document.body.appendChild(lightbox);
    const mediaBox = lightbox.querySelector(".lb-media");
    let current = 0;
    const items = Array.prototype.map.call(galleryItems, function (fig) {
      if (fig.classList.contains("video-item")) {
        const v = fig.querySelector("video");
        return v ? { type: "video", src: v.querySelector("source") ? v.querySelector("source").src : v.src } : null;
      }
      const img = fig.querySelector("img");
      return img ? { type: "img", src: img.src } : null;
    }).filter(Boolean);

    function show(i) {
      current = (i + items.length) % items.length;
      const it = items[current];
      if (it.type === "video") {
        mediaBox.innerHTML = '<video src="' + it.src + '" controls autoplay></video>';
      } else {
        mediaBox.innerHTML = '<img src="' + it.src + '" alt="Gallery image">';
      }
    }
    galleryItems.forEach(function (fig, idx) {
      fig.addEventListener("click", function () {
        show(idx);
        lightbox.classList.add("open");
        document.body.style.overflow = "hidden";
      });
    });
    lightbox.querySelector(".lb-close").addEventListener("click", function () {
      lightbox.classList.remove("open");
      document.body.style.overflow = "";
      mediaBox.innerHTML = "";
    });
    lightbox.addEventListener("click", function (e) {
      if (e.target === lightbox) {
        lightbox.classList.remove("open");
        document.body.style.overflow = "";
        mediaBox.innerHTML = "";
      }
    });
    lightbox.querySelector(".lb-prev").addEventListener("click", function () { show(current - 1); });
    lightbox.querySelector(".lb-next").addEventListener("click", function () { show(current + 1); });
    document.addEventListener("keydown", function (e) {
      if (!lightbox.classList.contains("open")) return;
      if (e.key === "Escape") lightbox.querySelector(".lb-close").click();
      if (e.key === "ArrowLeft") show(current - 1);
      if (e.key === "ArrowRight") show(current + 1);
    });
  }

  const galleryFilter = document.getElementById("galleryFilter");
  if (galleryFilter) {
    const items = document.querySelectorAll(".gal-item");
    galleryFilter.querySelectorAll(".gal-filter").forEach(function (btn) {
      btn.addEventListener("click", function () {
        galleryFilter.querySelectorAll(".gal-filter").forEach(function (b) { b.classList.remove("active"); });
        btn.classList.add("active");
        const filter = btn.getAttribute("data-filter");
        items.forEach(function (it) {
          if (filter === "all" || it.getAttribute("data-cat") === filter) {
            it.classList.remove("hidden");
          } else {
            it.classList.add("hidden");
          }
        });
      });
    });
  }

  const searchForm = document.getElementById("searchForm");
  if (searchForm) {
    searchForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const loc = document.getElementById("sLocation").value;
      const type = document.getElementById("sType").value;
      const budget = document.getElementById("sBudget").value;
      const text =
        "Hello Durrani Group! I'm looking for: " + encodeURIComponent(type) +
        " in " + encodeURIComponent(loc) +
        " (Budget: " + encodeURIComponent(budget) + ").";
      window.open("https://wa.me/923368800085?text=" + text, "_blank");
    });
  }

  const calcPrice = document.getElementById("calcPrice");
  if (calcPrice) {
    const calcDown = document.getElementById("calcDown");
    const calcYears = document.getElementById("calcYears");
    const calcMonthly = document.getElementById("calcMonthly");
    const calcDetail = document.getElementById("calcDetail");
    const calcWaBtn = document.getElementById("calcWaBtn");

    function formatPKR(n) {
      return n.toLocaleString("en-PK");
    }
    function calc() {
      const price = parseFloat(calcPrice.value) || 0;
      const downPct = Math.min(Math.max(parseFloat(calcDown.value) || 0, 0), 100);
      const years = parseInt(calcYears.value, 10) || 3;
      const down = price * downPct / 100;
      const months = years * 12;
      const monthly = months > 0 ? Math.round((price - down) / months) : 0;
      calcMonthly.textContent = formatPKR(monthly) + " PKR";
      calcDetail.textContent = "Total price " + formatPKR(price) + " PKR • Down " + formatPKR(Math.round(down)) + " PKR • " + years + " years / " + months + " installments";
    }
    [calcPrice, calcDown, calcYears].forEach(function (el) {
      el.addEventListener("input", calc);
      el.addEventListener("change", calc);
    });
    calc();

    calcWaBtn.addEventListener("click", function () {
      const price = parseFloat(calcPrice.value) || 0;
      const downPct = parseFloat(calcDown.value) || 0;
      const years = parseInt(calcYears.value, 10) || 3;
      const months = years * 12;
      const monthly = months > 0 ? Math.round((price - price * downPct / 100) / months) : 0;
      const text =
        "Hello! I calculated a monthly installment of " + encodeURIComponent(formatPKR(monthly)) +
        " PKR on a plot of " + encodeURIComponent(formatPKR(price)) +
        " PKR (" + downPct + "% down, " + years + " years). Please confirm the exact rates.";
      window.open("https://wa.me/923368800085?text=" + text, "_blank");
    });
  }

  const newsletterForm = document.getElementById("newsletterForm");
  if (newsletterForm) {
    newsletterForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const email = document.getElementById("nlEmail").value.trim();
      const text = "Hello! Please subscribe " + encodeURIComponent(email) + " for project updates and new launches.";
      window.open("https://wa.me/923368800085?text=" + text, "_blank");
    });
  }

  const topBtn = document.getElementById("topBtn");
  if (topBtn) {
    window.addEventListener("scroll", function () {
      topBtn.classList.toggle("show", window.scrollY > 500);
    });
  }
});
