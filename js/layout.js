function renderHeader() {
  var base = window.location.pathname.indexOf("/pages/") !== -1 ? "../" : "";
  document.getElementById("site-header").innerHTML = `
  <div class="topbar">
    <div class="container topbar-inner">
      <a href="https://www.google.com/maps/search/?api=1&query=Shinwari+Plaza%2C+Nasir+Bagh+Road%2C+Peshawar" target="_blank" rel="noopener" class="topbar-item" title="Open in Google Maps"><span class="material-icons" style="font-size:13px; vertical-align:-2px; margin-right:6px;">place</span>1st Floor, Shinwari Plaza, Nasir Bagh Road, Peshawar</a>
      <div class="topbar-links">
        <a href="https://facebook.com/D.RealEstateofficial" target="_blank" class="topbar-item social-link" title="Facebook">
          <svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor"><path d="M13.5 21v-7h2.4l.36-2.8H13.5V9.4c0-.81.22-1.36 1.38-1.36h1.48V5.55c-.26-.03-1.13-.11-2.15-.11-2.13 0-3.59 1.3-3.59 3.69v2.06H8.2V14h2.42v7h2.88z"/></svg>
          Facebook
        </a>
        <a href="https://tiktok.com/@durrani.group.of.c" target="_blank" class="topbar-item social-link" title="TikTok">
          <svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/></svg>
          TikTok
        </a>
        <a href="mailto:durranigroupofcompanies9@gmail.com" class="topbar-item social-link" title="Email">
          <svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4-8 5-8-5V6l8 5 8-5v2z"/></svg>
          Email
        </a>
        <a href="${base}pages/admin.html" class="topbar-item social-link admin-link" title="Admin Login">
          <svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor"><path d="M12 1a9 9 0 0 1 9 9v6a4 4 0 0 1-4 4h-2a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h4V10a7 7 0 0 0-14 0v1h4v2a2 2 0 0 1-2 2H4c-1.1 0-2 .9-2 2v3a4 4 0 0 0 4 4h2a2 2 0 0 0 2-2v-5a2 2 0 0 0-2-2H8v1a6 6 0 1 1 12 0v1h-2a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h2a4 4 0 0 0 4-4v-6a9 9 0 0 0-6-8.5A9 9 0 0 0 12 1z"/></svg>
          Admin
        </a>
      </div>
    </div>
  </div>
  <nav class="navbar" id="navbar">
    <div class="container nav-inner">
      <a href="${base}index.html" class="brand">
        <img src="${base}logo.jfif" alt="Durrani Group of Companies Logo" class="brand-logo">
        <span class="brand-text">
          <strong>DURRANI</strong>
          <small>GROUP OF COMPANIES</small>
        </span>
      </a>
      <button class="hamburger" id="hamburger" aria-label="Menu">
        <span></span><span></span><span></span>
      </button>
      <div class="nav-menu" id="navMenu">
        <ul class="nav-links">
          <li><a href="${base}index.html" data-i18n="navHome">Home</a></li>
          <li class="dropdown">
            <a href="#" class="drop-toggle" data-i18n="navAbout">About <span class="material-icons caret">arrow_drop_down</span></a>
            <ul class="dropdown-menu">
              <li><a href="${base}pages/about.html" data-i18n="navAboutUs">About Us</a></li>
              <li><a href="${base}pages/founder-message.html" data-i18n="navFounder">Founder's Message</a></li>
              <li><a href="${base}pages/chairman-message.html" data-i18n="navChairman">CEO's Message</a></li>
              <li><a href="${base}pages/divisions.html" data-i18n="navDivisions">Business Divisions</a></li>
              <li><a href="${base}pages/companies.html" data-i18n="navOurCompanies">Our Companies</a></li>
            </ul>
          </li>
          <li class="dropdown">
            <a href="#" class="drop-toggle" data-i18n="navProjects">Projects <span class="material-icons caret">arrow_drop_down</span></a>
            <ul class="dropdown-menu">
              <li><a href="${base}pages/malik-town.html" data-i18n="navMalik">Malik Town Housing Society</a></li>
              <li><a href="${base}pages/durrani-enclave.html" data-i18n="navEnclave">Durrani Enclave</a></li>
              <li><a href="${base}pages/durrani-residency.html" data-i18n="navResidency">Durrani Residency CHS</a></li>
              <li><a href="${base}pages/regi-model-town.html" data-i18n="navRegi">Regi Model Town</a></li>
              <li><a href="${base}pages/sheikh-yaseen-town.html" data-i18n="navSheikh">Sheikh Yaseen Town</a></li>
            </ul>
          </li>
          <li class="dropdown">
            <a href="#" class="drop-toggle" data-i18n="navCompanies">Companies <span class="material-icons caret">arrow_drop_down</span></a>
            <ul class="dropdown-menu">
              <li><a href="${base}pages/companies.html#real-estate">Durrani Real Estate</a></li>
              <li><a href="${base}pages/companies.html#builders">Durrani Builders</a></li>
              <li><a href="${base}pages/companies.html#developers">Durrani Developers Pvt. Ltd.</a></li>
              <li><a href="${base}pages/companies.html#marketing">Durrani Marketing Agency</a></li>
              <li><a href="${base}pages/companies.html#landscape">Durrani Garden Landscape</a></li>
              <li><a href="${base}pages/companies.html#spring-rose">Spring Rose Real Estate</a></li>
              <li><a href="${base}pages/companies.html#events">Spring Rose Events</a></li>
            </ul>
          </li>
          <li class="dropdown">
            <a href="#" class="drop-toggle" data-i18n="navMedia">Media <span class="material-icons caret">arrow_drop_down</span></a>
            <ul class="dropdown-menu">
              <li><a href="${base}pages/gallery.html" data-i18n="navGallery">Gallery</a></li>
              <li><a href="${base}pages/videos.html" data-i18n="navVideos">Videos</a></li>
              <li><a href="${base}pages/downloads.html" data-i18n="navDownloads">Download Center</a></li>
              <li><a href="${base}pages/news.html" data-i18n="navNews">News &amp; Media</a></li>
              <li><a href="${base}pages/blog.html" data-i18n="navBlog">Blog</a></li>
            </ul>
          </li>
          <li><a href="${base}pages/contact.html" data-i18n="navContact">Contact</a></li>
        </ul>
        <div class="nav-cta">
          <button class="theme-toggle" id="themeToggle" aria-label="Toggle day / night mode">
            <svg class="icon-sun" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="4.5"/><path d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M19.1 4.9l-1.8 1.8M6.7 17.3l-1.8 1.8"/></svg>
            <svg class="icon-moon" viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
          </button>
          <div class="lang-switch">
            <button class="lang-btn active" data-lang="en">EN</button>
            <button class="lang-btn" data-lang="ur">&#1575;&#1585;&#1583;&#1608;</button>
          </div>
          <a href="${base}pages/contact.html" class="btn btn-green" data-i18n="navFreeConsult">Free Consultation</a>
        </div>
      </div>
    </div>
  </nav>`;
}

function renderFooter() {
  var base = window.location.pathname.indexOf("/pages/") !== -1 ? "../" : "";
  document.getElementById("site-footer").innerHTML = `
  <footer class="footer">
    <div class="container footer-grid">
      <div class="footer-col footer-about">
        <a href="${base}index.html" class="brand footer-brand">
          <img src="${base}logo.jfif" alt="Durrani Group of Companies Logo" class="brand-logo">
          <span class="brand-text">
            <strong>DURRANI</strong>
            <small>GROUP OF COMPANIES</small>
          </span>
        </a>
        <p data-i18n="fAbout">Building Trust. Creating Futures. A premier real estate group developing landmark communities across Khyber Pakhtunkhwa, Pakistan.</p>
        <form class="newsletter" id="newsletterForm">
          <strong>Subscribe for Project Updates</strong>
          <div class="newsletter-row">
            <input type="email" id="nlEmail" placeholder="Your email address" required>
            <button type="submit" class="btn btn-green btn-sm">Join</button>
          </div>
          <small>New launches, price updates and payment plans — straight to your inbox.</small>
        </form>
        <div class="footer-social">
          <a href="https://facebook.com/D.RealEstateofficial" target="_blank" title="Facebook">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M13.5 21v-7h2.4l.36-2.8H13.5V9.4c0-.81.22-1.36 1.38-1.36h1.48V5.55c-.26-.03-1.13-.11-2.15-.11-2.13 0-3.59 1.3-3.59 3.69v2.06H8.2V14h2.42v7h2.88z"/></svg>
          </a>
          <a href="https://tiktok.com/@durrani.group.of.c" target="_blank" title="TikTok">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/></svg>
          </a>
          <a href="mailto:durranigroupofcompanies9@gmail.com" title="Email">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4-8 5-8-5V6l8 5 8-5v2z"/></svg>
          </a>
          <a href="https://wa.me/923368800085" target="_blank" title="WhatsApp">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M17.5 14.4c-.3-.15-1.77-.87-2.04-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.14-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.5 0 1.47 1.07 2.9 1.22 3.1.15.2 2.11 3.22 5.1 4.51.71.31 1.27.49 1.7.63.72.23 1.37.2 1.88.12.58-.09 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.13-.27-.2-.57-.35zM12.05 21.8h-.01a9.87 9.87 0 0 1-5.03-1.38l-.36-.21-3.74.98 1-3.65-.24-.37a9.86 9.86 0 0 1-1.51-5.26c0-5.45 4.44-9.88 9.9-9.88a9.83 9.83 0 0 1 7 2.9 9.83 9.83 0 0 1 2.89 7c0 5.45-4.44 9.88-9.9 9.88zm8.42-18.3A11.82 11.82 0 0 0 12.05 0C5.5 0 .16 5.34.16 11.9c0 2.1.55 4.15 1.59 5.95L.06 24l6.3-1.65a11.9 11.9 0 0 0 5.68 1.45h.01c6.55 0 11.89-5.34 11.89-11.9 0-3.18-1.24-6.16-3.47-8.4z"/></svg>
          </a>
        </div>
      </div>
      <div class="footer-col">
        <h4 data-i18n="fQuick">Quick Links</h4>
        <ul>
          <li><a href="${base}index.html" data-i18n="navHome">Home</a></li>
          <li><a href="${base}pages/about.html" data-i18n="navAboutUs">About Us</a></li>
          <li><a href="${base}pages/gallery.html" data-i18n="navGallery">Gallery</a></li>
          <li><a href="${base}pages/blog.html" data-i18n="navBlog">Blog</a></li>
          <li><a href="${base}pages/downloads.html" data-i18n="navDownloads">Download Center</a></li>
          <li><a href="${base}pages/contact.html" data-i18n="navContact">Contact Us</a></li>
        </ul>
      </div>
      <div class="footer-col">
        <h4 data-i18n="navProjects">Our Projects</h4>
        <ul>
          <li><a href="${base}pages/malik-town.html" data-i18n="navMalik">Malik Town Housing Society</a></li>
          <li><a href="${base}pages/durrani-enclave.html" data-i18n="navEnclave">Durrani Enclave</a></li>
          <li><a href="${base}pages/durrani-residency.html" data-i18n="navResidency">Durrani Residency CHS</a></li>
          <li><a href="${base}pages/regi-model-town.html" data-i18n="navRegi">Regi Model Town</a></li>
          <li><a href="${base}pages/sheikh-yaseen-town.html" data-i18n="navSheikh">Sheikh Yaseen Town</a></li>
        </ul>
      </div>
      <div class="footer-col">
        <h4 data-i18n="fContactHead">Contact</h4>
        <ul class="footer-contact">
          <li><span class="material-icons" style="font-size:15px; vertical-align:-2px; margin-right:6px;">place</span>1st Floor, Shinwari Plaza, Nasir Bagh Road, Peshawar, KP, Pakistan</li>
          <li><a href="https://wa.me/923288999919" target="_blank"><svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor" style="vertical-align:-2px; margin-right:6px;"><path d="M17 1.01L7 1c-1.1 0-2 .9-2 2v18c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-1.99-2-1.99zM17 19H7V5h10v14z"/></svg>Mazhar Durrani (Founder)<br>+92 328 8999919</a></li>
          <li><a href="https://wa.me/923159048363" target="_blank"><svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor" style="vertical-align:-2px; margin-right:6px;"><path d="M17 1.01L7 1c-1.1 0-2 .9-2 2v18c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-1.99-2-1.99zM17 19H7V5h10v14z"/></svg>Mubashir Durrani (CEO)<br>+92 315 9048363</a></li>
          <li><a href="https://wa.me/923368800085" target="_blank"><svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor" style="vertical-align:-2px; margin-right:6px;"><path d="M17 1.01L7 1c-1.1 0-2 .9-2 2v18c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-1.99-2-1.99zM17 19H7V5h10v14z"/></svg>Muhammad Shahsaud (General Manager)<br>+92 336 8800085</a></li>
          <li><a href="mailto:durranigroupofcompanies9@gmail.com"><svg viewBox="52 42 88 66" width="15" height="15" style="vertical-align:-2px; margin-right:6px;"><path fill="#4285f4" d="M58 108h14V74L52 59v43c0 3.32 2.69 6 6 6"/><path fill="#34a853" d="M120 108h14c3.32 0 6-2.69 6-6V59l-20 15"/><path fill="#fbbc04" d="M120 48v26l20-15v-8c0-7.42-8.47-11.65-14.4-7.2"/><path fill="#ea4335" d="M72 74V48l24 18 24-18v26L96 92"/><path fill="#c5221f" d="M52 51v8l20 15V48l-5.6-4.2c-5.94-4.45-14.4-.22-14.4 7.2"/></svg>durranigroupofcompanies9@gmail.com</a></li>
          <li><a href="https://facebook.com/D.RealEstateofficial" target="_blank">f&nbsp; @D.RealEstateofficial</a></li>
        </ul>
      </div>
    </div>
    <div class="footer-bottom">
      <div class="container">
        <p>&copy; 2026 Durrani Group of Companies. All Rights Reserved.</p>
        <p class="tagline-text" data-i18n="tagline">Building Trust. Creating Futures.</p>
      </div>
    </div>
    <div class="footer-dev">
      <p>Website developed by <a href="tel:+971563217816">Muhammad Saeed</a> &mdash; Ark Developer &mdash; <a href="tel:+971563217816">+971 56 321 7816</a></p>
    </div>
  </footer>`;
    if (!document.getElementById("waFloat")) {
    const wa = document.createElement("a");
    wa.id = "waFloat";
    wa.className = "wa-float";
    wa.href = "https://wa.me/923368800085?text=Hello%2C%20Durrani%20Group%20of%20Companies!";
    wa.target = "_blank";
    wa.setAttribute("aria-label", "Chat on WhatsApp");
    wa.innerHTML = '<svg viewBox="0 0 24 24"><path d="M17.5 14.4c-.3-.15-1.77-.87-2.04-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.14-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.5 0 1.47 1.07 2.9 1.22 3.1.15.2 2.11 3.22 5.1 4.51.71.31 1.27.49 1.7.63.72.23 1.37.2 1.88.12.58-.09 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.13-.27-.2-.57-.35zM12.05 21.8h-.01a9.87 9.87 0 0 1-5.03-1.38l-.36-.21-3.74.98 1-3.65-.24-.37a9.86 9.86 0 0 1-1.51-5.26c0-5.45 4.44-9.88 9.9-9.88a9.83 9.83 0 0 1 7 2.9 9.83 9.83 0 0 1 2.89 7c0 5.45-4.44 9.88-9.9 9.88zm8.42-18.3A11.82 11.82 0 0 0 12.05 0C5.5 0 .16 5.34.16 11.9c0 2.1.55 4.15 1.59 5.95L.06 24l6.3-1.65a11.9 11.9 0 0 0 5.68 1.45h.01c6.55 0 11.89-5.34 11.89-11.9 0-3.18-1.24-6.16-3.47-8.4z"/></svg>';
    document.body.appendChild(wa);
  }

  if (!document.getElementById("topBtn")) {
    const tb = document.createElement("button");
    tb.id = "topBtn";
    tb.className = "top-btn";
    tb.setAttribute("aria-label", "Back to top");
    tb.innerHTML = '<span class="material-icons" style="font-size:20px;">arrow_upward</span>';
    tb.addEventListener("click", function () { window.scrollTo({ top: 0, behavior: "smooth" }); });
    document.body.appendChild(tb);
  }
}

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  try { localStorage.setItem("durraniTheme", theme); } catch (e) {}
}

function initTheme() {
  var saved = null;
  try { saved = localStorage.getItem("durraniTheme"); } catch (e) {}
  if (!saved) saved = "light";
  applyTheme(saved);
}

document.addEventListener("DOMContentLoaded", function () {
  initTheme();
  if (document.getElementById("site-header")) renderHeader();
  if (document.getElementById("site-footer")) renderFooter();

  const themeToggle = document.getElementById("themeToggle");
  if (themeToggle) {
    themeToggle.addEventListener("click", function () {
      const current = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
      applyTheme(current);
    });
  }

  const hamburger = document.getElementById("hamburger");
  const navMenu = document.getElementById("navMenu");
  if (hamburger && navMenu) {
    hamburger.addEventListener("click", function () {
      navMenu.classList.toggle("open");
      hamburger.classList.toggle("active");
    });
  }

  document.querySelectorAll(".drop-toggle").forEach(function (toggle) {
    toggle.addEventListener("click", function (e) {
      const parent = toggle.parentElement;
      if (window.innerWidth <= 992) {
        e.preventDefault();
        parent.classList.toggle("open");
      }
    });
  });

  const navbar = document.getElementById("navbar");
  window.addEventListener("scroll", function () {
    if (navbar) {
      if (window.scrollY > 50) navbar.classList.add("scrolled");
      else navbar.classList.remove("scrolled");
    }
  });
});
