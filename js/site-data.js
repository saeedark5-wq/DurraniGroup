(function () {
  "use strict";

  var inPages = window.location.pathname.indexOf("/pages/") !== -1;
  var base = inPages ? "../" : "";
  var apiPrefix = inPages ? "../" : "";

  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }

  function src(s) {
    var v = String(s || "");
    if (/^https?:/i.test(v) || /^data:/i.test(v) || v.charAt(0) === "/") return v;
    return v.indexOf("./") === 0 ? base + v.slice(2) : base + v;
  }

  function waHref(text) {
    var t = String(text || "this project");
    return "https://wa.me/923368800085?text=" + encodeURIComponent("Hello, I want to inquire about " + t);
  }

  function projCard(p) {
    return (
      '<div class="project-card">' +
      '<div class="project-img">' +
      '<img src="' + esc(src(p.image)) + '" alt="' + esc(p.name) + '" loading="lazy">' +
      '<span class="project-tag">' + esc(p.tag || "Featured") + "</span>" +
      "</div>" +
      '<div class="project-body">' +
      "<h3>" + esc(p.name) + "</h3>" +
      '<p class="project-loc">' + esc(p.location || "Peshawar, KP") + "</p>" +
      '<p class="project-desc">' + esc(p.description || "") + "</p>" +
      '<div class="project-actions">' +
      '<a href="' + esc(src(p.page || "pages/projects.html")) + '" class="btn btn-blue btn-sm">View Project</a>' +
      '<a href="' + esc(waHref(p.whatsappText || p.name)) + '" target="_blank" class="btn btn-wa btn-sm">WhatsApp</a>' +
      "</div>" +
      "</div>" +
      "</div>"
    );
  }

  function teamCard(m) {
    var phone = esc(m.mobile || "");
    return (
      '<div class="team-card">' +
      '<div class="team-photo">' +
      '<img src="' + esc(src(m.photo)) + '" alt="' + esc(m.name) + '" loading="lazy">' +
      "</div>" +
      '<div class="team-body">' +
      '<div class="team-name-row"><h3>' + esc(m.name) + "</h3>" +
      '<a class="team-phone" href="https://wa.me/' + esc(m.whatsapp || "923368800085") + '" target="_blank">' + esc(phone) + "</a></div>" +
      "<span>" + esc(m.role || "Sales Executive") + "</span>" +
      '<div class="team-meta">' +
      '<p class="team-area">' + esc(m.area || "") + "</p>" +
      '<a href="mailto:' + esc(m.email || "") + '">' + esc(m.email || "") + "</a>" +
      "</div>" +
      "</div>" +
      "</div>"
    );
  }

  function galItem(g) {
    if (g.type === "video") {
      return '<figure class="gal-item video-item" data-cat="' + esc(g.cat || "marketing") + '">' +
        '<video muted loop playsinline preload="metadata"><source src="' + esc(src(g.src)) + '" type="video/mp4"></video>' +
        "<figcaption>" + esc(g.alt || "") + "</figcaption></figure>";
    }
    return '<figure class="gal-item" data-cat="' + esc(g.cat || "projects") + '">' +
      '<img src="' + esc(src(g.src)) + '" alt="' + esc(g.alt || "") + '" loading="lazy">' +
      (g.alt ? "<figcaption>" + esc(g.alt) + "</figcaption>" : "") +
      "</figure>";
  }

  function loadJSON(name) {
    return new Promise(function (resolve) {
      var xhr = new XMLHttpRequest();
      xhr.open("GET", apiPrefix + "api/data", true);
      xhr.onload = function () {
        if (xhr.status !== 200) return loadJSONFile(name, resolve);
        try {
          var data = JSON.parse(xhr.responseText);
          if (!data || !data.ok) return loadJSONFile(name, resolve);
          if (name === "projects.json") return resolve({ projects: data.projects || [] });
          if (name === "team.json") return resolve({ members: data.team || [] });
          if (name === "gallery.json") return resolve({ images: data.gallery || [] });
          return loadJSONFile(name, resolve);
        } catch (e) {
          return loadJSONFile(name, resolve);
        }
      };
      xhr.onerror = function () { loadJSONFile(name, resolve); };
      xhr.send();
    });
  }

  function loadJSONFile(name, resolve) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", apiPrefix + "data/" + name, true);
    xhr.onload = function () {
      if (xhr.status !== 200) return resolve(null);
      try { resolve(JSON.parse(xhr.responseText)); } catch (e) { resolve(null); }
    };
    xhr.onerror = function () { resolve(null); };
    xhr.send();
  }

  function renderGrid(el, items, fn) {
    if (!el) return;
    if (!items || !items.length) {
      if (el.querySelector(".project-card") || el.querySelector(".team-card") || el.querySelector(".gal-item")) return;
      return;
    }
    el.innerHTML = items.map(fn).join("");
  }

  async function init() {
    var projects = await loadJSON("projects.json");
    var team = await loadJSON("team.json");
    var gallery = await loadJSON("gallery.json");

    var projectsGrid = document.getElementById("projectsGrid");
    var projectsSlider = document.getElementById("projectsSlider");
    if (projectsGrid) renderGrid(projectsGrid, projects && projects.projects, projCard);
    if (projectsSlider) renderGrid(projectsSlider, projects && projects.projects, projCard);

    var teamGrid = document.getElementById("teamGrid");
    if (teamGrid) renderGrid(teamGrid, team && team.members, teamCard);

    var galleryGrid = document.getElementById("galleryGrid");
    if (galleryGrid) renderGrid(galleryGrid, gallery && gallery.images, galItem);

    // Re-apply gallery filter if present after dynamic render
    var act = document.querySelector("#galleryFilter .gal-filter.active");
    if (act) act.click();
  }

  document.addEventListener("DOMContentLoaded", init);
})();