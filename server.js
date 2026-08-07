const http = require("http");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const ROOT = __dirname;
const PORT = process.env.PORT || 8000;

// ---- Admin credentials (change these) ----
const ADMIN_USER = process.env.ADMIN_USER || "admin";
const ADMIN_PASS = process.env.ADMIN_PASS || "durrani2026";

const DATA_DIR = path.join(ROOT, "data");
const UPLOAD_DIR = path.join(ROOT, "images", "uploads");
const PROJECTS_FILE = path.join(DATA_DIR, "projects.json");
const TEAM_FILE = path.join(DATA_DIR, "team.json");
const GALLERY_FILE = path.join(DATA_DIR, "gallery.json");

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".jfif": "image/jpeg",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".mp4": "video/mp4",
  ".pdf": "application/pdf",
  ".json": "application/json",
  ".txt": "text/plain; charset=utf-8",
  ".woff": "font/woff",
  ".woff2": "font/woff2"
};

// ---- Session store (in-memory) ----
const sessions = new Map();

function newSession() {
  const token = crypto.randomBytes(24).toString("hex");
  sessions.set(token, Date.now() + 12 * 60 * 60 * 1000);
  return token;
}

function authToken(req) {
  const header = req.headers["authorization"] || "";
  const m = header.match(/^Bearer\s+(.+)$/i);
  if (!m) return null;
  const expiry = sessions.get(m[1]);
  if (!expiry) return null;
  if (expiry < Date.now()) {
    sessions.delete(m[1]);
    return null;
  }
  return m[1];
}

function sendJson(res, code, obj) {
  const body = JSON.stringify(obj);
  res.writeHead(code, {
    "Content-Type": "application/json; charset=utf-8",
    "Content-Length": Buffer.byteLength(body)
  });
  res.end(body);
}

function readBody(req, cb) {
  let size = 0;
  const chunks = [];
  req.on("data", function (c) {
    size += c.length;
    if (size > 50 * 1024 * 1024) {
      req.destroy();
      cb(new Error("Body too large"));
      return;
    }
    chunks.push(c);
  });
  req.on("end", function () {
    cb(null, Buffer.concat(chunks));
  });
  req.on("error", function (e) {
    cb(e);
  });
}

function readJson(file, fallback) {
  try {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch (e) {
    return fallback;
  }
}

function writeJson(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2), "utf8");
  return data;
}

function safeSlug(s) {
  return String(s || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60) || ("project-" + Date.now());
}

function sanitizeBase(name) {
  return String(name || "image")
    .replace(/\.[^.]+$/, "")
    .replace(/[^a-z0-9_]+/gi, "-")
    .replace(/-+/g, "-")
    .slice(0, 40);
}

// ---- API handlers ----
function handleApi(req, res, urlPath) {
  // ---------- POST /api/login ----------
  if (urlPath === "/api/login" && req.method === "POST") {
    readBody(req, function (err, body) {
      if (err) return sendJson(res, 500, { ok: false, error: "Server error" });
      let parsed = null;
      try {
        parsed = JSON.parse(body.toString("utf8"));
      } catch (e) {}
      const u = parsed && parsed.username;
      const p = parsed && parsed.password;
      if (!u || !p || u !== ADMIN_USER || p !== ADMIN_PASS) {
        return sendJson(res, 401, { ok: false, error: "Invalid username or password." });
      }
      const token = newSession();
      return sendJson(res, 200, { ok: true, token: token, username: u });
    });
    return true;
  }

  // ---------- POST /api/logout ----------
  if (urlPath === "/api/logout" && req.method === "POST") {
    const token = authToken(req);
    if (token) sessions.delete(token);
    return sendJson(res, 200, { ok: true }) || true;
  }

  // ---------- GET /api/data ----------
  if (urlPath === "/api/data" && req.method === "GET") {
    return sendJson(res, 200, {
      ok: true,
      projects: readJson(PROJECTS_FILE, { projects: [] }).projects || [],
      team: readJson(TEAM_FILE, { members: [] }).members || [],
      gallery: readJson(GALLERY_FILE, { images: [] }).images || []
    }) || true;
  }

  if (req.method === "GET") {
    sendJson(res, 401, { ok: false, error: "Authentication required." });
    return true;
  }

  // Everything below requires a valid session
  if (!authToken(req)) {
    sendJson(res, 401, { ok: false, error: "Authentication required." });
    return true;
  }

  if (urlPath === "/api/session" && req.method === "POST") {
    return sendJson(res, 200, { ok: true }) || true;
  }

  // ---------- POST /api/upload ----------
  if (urlPath === "/api/upload" && req.method === "POST") {
    readBody(req, function (err, body) {
      if (err) return sendJson(res, 400, { ok: false, error: String(err.message) });
      let parsed = null;
      try {
        parsed = JSON.parse(body.toString("utf8"));
      } catch (e) {}
      const b64 = parsed && parsed.data;
      const filename = parsed && parsed.filename;
      if (!b64) return sendJson(res, 400, { ok: false, error: "No image data received." });
      const allowed = [".jfif", ".jpg", ".jpeg", ".png", ".gif", ".webp"];
      let ext = path.extname(String(filename || "")).toLowerCase();
      if (allowed.indexOf(ext) === -1) ext = ".jfif";
      if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });
      const outName = sanitizeBase(filename) + "-" + Date.now() + "-" + crypto.randomBytes(4).toString("hex") + ext;
      const buffer = Buffer.from(String(b64).replace(/^data:[^;]+;base64,/, ""), "base64");
      fs.writeFileSync(path.join(UPLOAD_DIR, outName), buffer);
      return sendJson(res, 200, { ok: true, url: "images/uploads/" + outName });
    });
    return true;
  }

  // ---------- POST /api/projects (add new project) ----------
  if (urlPath === "/api/projects" && req.method === "POST") {
    readBody(req, function (err, body) {
      if (err) return sendJson(res, 400, { ok: false, error: String(err.message) });
      let parsed = null;
      try {
        parsed = JSON.parse(body.toString("utf8"));
      } catch (e) {}
      if (!parsed || !parsed.name) return sendJson(res, 400, { ok: false, error: "Project name is required." });
      const file = readJson(PROJECTS_FILE, { projects: [] });
      const id = safeSlug(parsed.name);
      file.projects.unshift({
        id: id,
        name: parsed.name,
        location: parsed.location || "Peshawar, KP",
        description: parsed.description || "",
        tag: parsed.tag || "New Launch",
        image: parsed.image || "images/Map.jfif",
        page: parsed.page || "pages/projects.html",
        whatsappText: parsed.whatsappText || encodeURIComponent(parsed.name),
        gallery: Array.isArray(parsed.gallery) ? parsed.gallery : []
      });
      writeJson(PROJECTS_FILE, file);
      return sendJson(res, 200, { ok: true, project: file.projects[0] });
    });
    return true;
  }

  // ---------- POST /api/projects/:id/gallery (add images to a project) ----------
  const galleryMatch = urlPath.match(/^\/api\/projects\/([^/]+)\/gallery$/);
  if (galleryMatch && req.method === "POST") {
    const projectId = galleryMatch[1];
    readBody(req, function (err, body) {
      if (err) return sendJson(res, 400, { ok: false, error: String(err.message) });
      let parsed = null;
      try {
        parsed = JSON.parse(body.toString("utf8"));
      } catch (e) {}
      const images = Array.isArray(parsed && parsed.images) ? parsed.images : [];
      if (!images.length) return sendJson(res, 400, { ok: false, error: "No images provided." });
      const file = readJson(PROJECTS_FILE, { projects: [] });
      const project = file.projects.find(function (p) {
        return p.id === projectId;
      });
      if (!project) return sendJson(res, 404, { ok: false, error: "Project not found." });
      if (!Array.isArray(project.gallery)) project.gallery = [];
      const added = [];
      images.forEach(function (img) {
        if (!img || !img.src) return;
        project.gallery.push(img.src);
        added.push(img.src);
      });
      writeJson(PROJECTS_FILE, file);

      const galleryFile = readJson(GALLERY_FILE, { images: [] });
      images.forEach(function (img, i) {
        galleryFile.images.push({
          src: img.src,
          alt: (img.alt || project.name + " image") + (images.length > 1 ? " " + (i + 1) : ""),
          cat: "projects"
        });
      });
      writeJson(GALLERY_FILE, galleryFile);

      return sendJson(res, 200, { ok: true, added: added });
    });
    return true;
  }

  // ---------- POST /api/team (add employee) ----------
  if (urlPath === "/api/team" && req.method === "POST") {
    readBody(req, function (err, body) {
      if (err) return sendJson(res, 400, { ok: false, error: String(err.message) });
      let parsed = null;
      try {
        parsed = JSON.parse(body.toString("utf8"));
      } catch (e) {}
      if (!parsed || !parsed.name) return sendJson(res, 400, { ok: false, error: "Employee name is required." });
      const file = readJson(TEAM_FILE, { members: [] });
      let wa = String(parsed.mobile || "").replace(/[^\d]/g, "");
      if (wa.length === 10) wa = "92" + wa;
      const member = {
        id: Date.now(),
        name: parsed.name,
        role: parsed.role || "Sales Executive",
        area: parsed.area || "Regi Model Town, Peshawar",
        mobile: parsed.mobile || "",
        whatsapp: wa || "",
        photo: parsed.photo || "images/Founder.jfif",
        email: parsed.email || ""
      };
      file.members.unshift(member);
      writeJson(TEAM_FILE, file);
      return sendJson(res, 200, { ok: true, member: member });
    });
    return true;
  }

  sendJson(res, 404, { ok: false, error: "Not found." });
  return true;
}

http
  .createServer(function (req, res) {
    let urlPath;
    try {
      urlPath = decodeURIComponent(req.url.split("?")[0]);
    } catch (e) {
      res.writeHead(400);
      return res.end("Bad Request");
    }

    if (/^\/api\//.test(urlPath)) {
      handleApi(req, res, urlPath);
      return;
    }

    if (urlPath === "/") urlPath = "/index.html";
    const filePath = path.join(ROOT, path.normalize(urlPath));
    if (!filePath.startsWith(ROOT)) {
      res.writeHead(403);
      return res.end("Forbidden");
    }
    fs.readFile(filePath, function (err, data) {
      if (err) {
        res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
        return res.end("404 - Not Found");
      }
      res.writeHead(200, {
        "Content-Type": MIME[path.extname(filePath).toLowerCase()] || "application/octet-stream"
      });
      res.end(data);
    });
  })
  .listen(PORT, function () {
    console.log("Durrani Group site running at http://localhost:" + PORT);
    console.log("Admin panel: http://localhost:" + PORT + "/pages/admin.html");
  });