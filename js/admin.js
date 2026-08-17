(function () {
  "use strict";

  var TOKEN_KEY = "durrani_admin_token";
  var token = null;
  var state = { projects: [], team: [], gallery: [] };

  // ---------- helpers ----------
  function $(id) { return document.getElementById(id); }

  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }

  function apiBase() {
    return "/api/";
  }

  function baseImg(src) {
    var s = String(src || "");
    if (/^https?:/i.test(s) || /^data:/i.test(s) || s.charAt(0) === "/") return s;
    if (window.location.pathname.indexOf("/pages/") !== -1) return "../" + s;
    return s;
  }

  function readFileAsBase64(file, cb) {
    var reader = new FileReader();
    reader.onload = function () { cb(reader.result); };
    reader.onerror = function () { cb(null); };
    reader.readAsDataURL(file);
  }

  function showMsg(text, type) {
    var el = $("mainMsg");
    if (!el) return;
    el.className = "msg " + (type || "info");
    el.textContent = text;
    clearTimeout(el._t);
    el._t = setTimeout(function () { el.style.opacity = "0"; }, 6000);
    el.style.opacity = "1";
  }

  function showLoginMsg(text, type) {
    var el = $("loginMsg");
    if (!el) return;
    el.className = "msg " + (type || "err");
    el.textContent = text;
  }

  // ---------- auth ----------
  function getToken() {
    try { return localStorage.getItem(TOKEN_KEY); } catch (e) { return null; }
  }
  function setToken(t) {
    try { if (t) localStorage.setItem(TOKEN_KEY, t); else localStorage.removeItem(TOKEN_KEY); } catch (e) {}
  }

  function api(method, path, body, cb) {
    var xhr = new XMLHttpRequest();
    xhr.open(method, apiBase() + path, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    if (token) xhr.setRequestHeader("Authorization", "Bearer " + token);
    xhr.onload = function () {
      var data = null;
      try { data = JSON.parse(xhr.responseText); } catch (e) {}
      if (xhr.status === 401 && path !== "login") {
        token = null;
        setToken(null);
        showView("login");
      }
      cb(data, xhr.status);
    };
    xhr.onerror = function () { cb(null, 0); };
    xhr.send(body ? JSON.stringify(body) : undefined);
  }

  function loadData() {
    api("GET", "data", null, function (data) {
      if (!data) return;
      state.projects = data.projects || [];
      state.team = data.team || [];
      state.gallery = data.gallery || [];
      renderProjectsList();
      renderTeamList();
      renderProjectSelect();
      renderPreview();
    });
  }

  // ---------- views ----------
  function showView(v) {
    $("loginView").style.display = v === "login" ? "block" : "none";
    $("panelView").style.display = v === "panel" ? "block" : "none";
  }

  function switchPanel(name) {
    document.querySelectorAll(".tab").forEach(function (t) {
      t.classList.toggle("active", t.getAttribute("data-panel") === name);
    });
    document.querySelectorAll(".panel").forEach(function (p) {
      p.classList.toggle("active", p.id === "panel-" + name);
    });
  }

  // ---------- render ----------
  function renderProjectsList() {
    var box = $("projectsList");
    if (!box) return;
    if (!state.projects.length) { box.innerHTML = '<div class="muted">No projects yet.</div>'; return; }
    box.innerHTML = state.projects.map(function (p) {
      return '<div class="list-item">' +
        '<img src="' + esc(baseImg(p.image)) + '" alt="">' +
        '<div class="li-body"><strong>' + esc(p.name) + "</strong>" +
        "<span>" + esc(p.location || "") + " &bull; " + esc(p.tag || "") + " &bull; " + (p.gallery ? p.gallery.length : 0) + " photos</span></div>" +
        "</div>";
    }).join("");
  }

  function renderTeamList() {
    var box = $("teamList");
    if (!box) return;
    if (!state.team.length) { box.innerHTML = '<div class="muted">No team members yet.</div>'; return; }
    box.innerHTML = state.team.map(function (m) {
      return '<div class="list-item">' +
        '<img src="' + esc(baseImg(m.photo)) + '" alt="">' +
        '<div class="li-body"><strong>' + esc(m.name) + "</strong>" +
        "<span>" + esc(m.role || "") + " &bull; " + esc(m.mobile || "") + " &bull; " + esc(m.email || "") + "</span></div>" +
        '<button type="button" class="btn btn-ghost btn-sm team-edit-btn" data-id="' + esc(m.id) + '">Edit</button>' +
        "</div>";
    }).join("");
    Array.prototype.forEach.call(box.querySelectorAll(".team-edit-btn"), function (btn) {
      btn.addEventListener("click", function () { openTeamEdit(btn.getAttribute("data-id")); });
    });
  }

  var editingTeamId = null;

  function openTeamEdit(id) {
    var member = null;
    state.team.forEach(function (m) { if (String(m.id) === String(id)) member = m; });
    if (!member) return showMsg("Team member not found.", "err");
    editingTeamId = id;
    $("editTmName").value = member.name || "";
    $("editTmRole").value = member.role || "";
    $("editTmArea").value = member.area || "";
    $("editTmMobile").value = member.mobile || "";
    $("editTmEmail").value = member.email || "";
    $("editTmPhoto").value = "";
    $("editTmPhotoPreview").innerHTML = "";
    $("editTeamCard").style.display = "block";
    $("editTeamCard").scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function closeTeamEdit() {
    editingTeamId = null;
    $("editTeamCard").style.display = "none";
  }

  function saveTeamEdit() {
    if (!editingTeamId) return;
    var name = $("editTmName").value.trim();
    if (!name) return showMsg("Employee name is required.", "err");
    var payload = {
      name: name,
      role: $("editTmRole").value.trim(),
      area: $("editTmArea").value.trim(),
      mobile: $("editTmMobile").value.trim(),
      email: $("editTmEmail").value.trim()
    };
    var file = $("editTmPhoto").files && $("editTmPhoto").files[0];
    var finish = function () {
      api("PUT", "team/" + encodeURIComponent(editingTeamId), payload, function (res, status) {
        if (status === 200 && res && res.ok) {
          showMsg('Employee "' + payload.name + '" updated successfully.', "ok");
          closeTeamEdit();
          loadData();
        } else {
          showMsg((res && res.error) || "Could not update employee.", "err");
        }
      });
    };
    if (file) {
      showMsg("Uploading photo...", "info");
      uploadImage(file, function (url, err) {
        if (url) payload.photo = url;
        else if (err) showMsg("Photo upload failed: " + err + ".", "err");
        finish();
      });
    } else {
      finish();
    }
  }

  function renderProjectSelect() {
    var sel = $("imgProject");
    if (!sel) return;
    sel.innerHTML = state.projects.map(function (p) {
      return '<option value="' + esc(p.id) + '">' + esc(p.name) + "</option>";
    }).join("");
  }

  function renderPreview() {
    if ($("previewProjects")) $("previewProjects").textContent = state.projects.length;
    if ($("previewMembers")) $("previewMembers").textContent = state.team.length;
    if ($("previewGallery")) $("previewGallery").textContent = state.gallery.length;
  }

  function previewFiles(inputId, wrapId) {
    var input = $(inputId);
    var wrap = $(wrapId);
    if (!input || !wrap) return;
    wrap.innerHTML = "";
    Array.prototype.forEach.call(input.files || [], function (file, idx) {
      readFileAsBase64(file, function (data) {
        if (!data) return;
        var div = document.createElement("div");
        div.className = "thumb";
        div.innerHTML = '<img src="' + data + '" alt="">' +
          '<button type="button" aria-label="Remove" data-idx="' + idx + '">&times;</button>';
        wrap.appendChild(div);
      });
    });
  }

  // ---------- upload ----------
  function uploadImage(file, cb) {
    readFileAsBase64(file, function (data) {
      if (!data) return cb(null, "Could not read file");
      api("POST", "upload", { filename: file.name, data: data }, function (res) {
        if (res && res.ok) cb(res.url);
        else cb(null, (res && res.error) || "Upload failed");
      });
    });
  }

  function uploadMany(files, cb) {
    var urls = [];
    var pending = files.length;
    if (!pending) return cb([]);
    Array.prototype.forEach.call(files, function (file) {
      uploadImage(file, function (url) {
        if (url) urls.push(url);
        if (--pending === 0) cb(urls);
      });
    });
  }

  // ---------- actions ----------
  function addProject() {
    var name = $("prName").value.trim();
    if (!name) return showMsg("Project name is required.", "err");
    var payload = {
      name: name,
      tag: $("prTag").value.trim(),
      location: $("prLocation").value.trim(),
      page: $("prPage").value.trim(),
      description: $("prDesc").value.trim()
    };
    var file = $("prImage").files && $("prImage").files[0];
    var finish = function () {
      api("POST", "projects", payload, function (res, status) {
        if (status === 200 && res && res.ok) {
          showMsg('Project "' + payload.name + '" added successfully.', "ok");
          ["prName", "prTag", "prLocation", "prPage", "prDesc"].forEach(function (id) { $(id).value = ""; });
          if ($("prImage")) $("prImage").value = "";
          $("prImagePreview").innerHTML = "";
          loadData();
        } else {
          showMsg((res && res.error) || "Could not add project.", "err");
        }
      });
    };
    if (file) {
      showMsg("Uploading cover image...", "info");
      uploadImage(file, function (url, err) {
        if (url) payload.image = url;
        else if (err) showMsg("Image upload failed: " + err + ". Project added without image.", "err");
        finish();
      });
    } else {
      finish();
    }
  }

  function addImages() {
    var projectId = $("imgProject").value;
    var files = $("imgFiles").files;
    if (!projectId) return showMsg("Select a project first.", "err");
    if (!files || !files.length) return showMsg("Select at least one image.", "err");
    showMsg("Uploading " + files.length + " image(s)...", "info");
    uploadMany(files, function (urls) {
      if (!urls.length) return showMsg("Upload failed. Try again.", "err");
      api("POST", "projects/" + encodeURIComponent(projectId) + "/gallery", { images: urls.map(function (u) { return { src: u }; }) }, function (res, status) {
        if (status === 200 && res && res.ok) {
          showMsg(urls.length + " photo(s) added to project.", "ok");
          $("imgFiles").value = "";
          $("imgPreview").innerHTML = "";
          loadData();
        } else {
          showMsg((res && res.error) || "Could not save images.", "err");
        }
      });
    });
  }

  function addTeam() {
    var name = $("tmName").value.trim();
    if (!name) return showMsg("Employee name is required.", "err");
    var payload = {
      name: name,
      role: $("tmRole").value.trim(),
      area: $("tmArea").value.trim(),
      mobile: $("tmMobile").value.trim(),
      email: $("tmEmail").value.trim()
    };
    var file = $("tmPhoto").files && $("tmPhoto").files[0];
    var finish = function () {
      api("POST", "team", payload, function (res, status) {
        if (status === 200 && res && res.ok) {
          showMsg('Employee "' + payload.name + '" added to the team.', "ok");
          ["tmName", "tmRole", "tmArea", "tmMobile", "tmEmail"].forEach(function (id) { $(id).value = ""; });
          if ($("tmPhoto")) $("tmPhoto").value = "";
          $("tmPhotoPreview").innerHTML = "";
          loadData();
        } else {
          showMsg((res && res.error) || "Could not add employee.", "err");
        }
      });
    };
    if (file) {
      showMsg("Uploading photo...", "info");
      uploadImage(file, function (url, err) {
        if (url) payload.photo = url;
        else if (err) showMsg("Photo upload failed: " + err + ". Employee added without photo.", "err");
        finish();
      });
    } else {
      finish();
    }
  }

  // ---------- login ----------
  function doLogin() {
    var u = $("loginUser").value.trim();
    var p = $("loginPass").value;
    if (!u || !p) return showLoginMsg("Enter username and password.", "err");
    var xhr = new XMLHttpRequest();
    xhr.open("POST", apiBase() + "login", true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onload = function () {
      var data = null;
      try { data = JSON.parse(xhr.responseText); } catch (e) {}
      if (xhr.status === 200 && data && data.ok) {
        token = data.token;
        setToken(token);
        if ($("helloUser")) $("helloUser").textContent = data.username || "admin";
        showView("panel");
        loadData();
      } else {
        showLoginMsg((data && data.error) || "Login failed.", "err");
      }
    };
    xhr.onerror = function () { showLoginMsg("Cannot reach server. Run: node server.js", "err"); };
    xhr.send(JSON.stringify({ username: u, password: p }));
  }

  function doLogout() {
    api("POST", "logout", null, function () {});
    token = null;
    setToken(null);
    showView("login");
  }

  // ---------- init ----------
  function bindEvents() {
    if ($("loginBtn")) $("loginBtn").addEventListener("click", doLogin);
    if ($("loginPass")) $("loginPass").addEventListener("keydown", function (e) { if (e.key === "Enter") doLogin(); });
    if ($("logoutBtn")) $("logoutBtn").addEventListener("click", doLogout);
    if ($("addProjectBtn")) $("addProjectBtn").addEventListener("click", addProject);
    if ($("addImagesBtn")) $("addImagesBtn").addEventListener("click", addImages);
    if ($("addTeamBtn")) $("addTeamBtn").addEventListener("click", addTeam);
    if ($("saveTeamBtn")) $("saveTeamBtn").addEventListener("click", saveTeamEdit);
    if ($("cancelTeamBtn")) $("cancelTeamBtn").addEventListener("click", closeTeamEdit);

    document.querySelectorAll(".tab").forEach(function (tab) {
      tab.addEventListener("click", function () { switchPanel(tab.getAttribute("data-panel")); });
    });

    if ($("prImage")) $("prImage").addEventListener("change", function () { previewFiles("prImage", "prImagePreview"); });
    if ($("imgFiles")) $("imgFiles").addEventListener("change", function () { previewFiles("imgFiles", "imgPreview"); });
    if ($("tmPhoto")) $("tmPhoto").addEventListener("change", function () { previewFiles("tmPhoto", "tmPhotoPreview"); });
    if ($("editTmPhoto")) $("editTmPhoto").addEventListener("change", function () { previewFiles("editTmPhoto", "editTmPhotoPreview"); });
  }

  function init() {
    token = getToken();
    if (token) {
      showView("panel");
      loadData();
    } else {
      showView("login");
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    bindEvents();
    init();
  });
})();