"use strict";

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
let blob = null;
try {
  blob = require("@vercel/blob");
} catch (e) {
  blob = null;
}

const ADMIN_USER = process.env.ADMIN_USER || "admin";
const ADMIN_PASS = process.env.ADMIN_PASS || "durrani2026";
const TOKEN_TTL = 12 * 60 * 60 * 1000;
const SECRET = process.env.BLOB_READ_WRITE_TOKEN || process.env.ADMIN_SECRET || "durrani-local-secret";

const ROOT = __dirname.replace(/[\\/]api$/, "");
const DATA_DIR = path.join(ROOT, "data");
const PROJECTS_FILE = path.join(DATA_DIR, "projects.json");
const TEAM_FILE = path.join(DATA_DIR, "team.json");
const GALLERY_FILE = path.join(DATA_DIR, "gallery.json");

const KEYS = {
  projects: "lib/projects.json",
  team: "lib/team.json",
  gallery: "lib/gallery.json"
};

function json(res, code, obj) {
  if (res.headersSent) return;
  res.statusCode = code;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify(obj));
}

function readBody(req, cb) {
  const chunks = [];
  let size = 0;
  req.on("data", function (c) {
    size += c.length;
    if (size > 60 * 1024 * 1024) {
      req.destroy();
      cb(new Error("Body too large"));
      return;
    }
    chunks.push(c);
  });
  req.on("end", function () { cb(null, Buffer.concat(chunks)); });
  req.on("error", function (e) { cb(e); });
}

function parseBody(req, cb) {
  readBody(req, function (err, buf) {
    if (err) return cb(err);
    let parsed = null;
    try {
      parsed = JSON.parse(buf.toString("utf8"));
    } catch (e) {}
    cb(null, parsed);
  });
}

function authToken(req) {
  const header = req.headers["authorization"] || "";
  const m = header.match(/^Bearer\s+(.+)$/i);
  if (!m) return false;
  const token = m[1];
  try {
    const parts = token.split(".");
    if (parts.length !== 2) return false;
    const payload = JSON.parse(Buffer.from(parts[0], "base64url").toString("utf8"));
    if (!payload.exp || payload.exp < Date.now()) return false;
    const sig = crypto.createHmac("sha256", SECRET).update(parts[0]).digest("base64url");
    if (sig !== parts[1]) return false;
    return true;
  } catch (e) {
    return false;
  }
}

function signToken(username) {
  const payload = { u: username, exp: Date.now() + TOKEN_TTL };
  const data = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const sig = crypto.createHmac("sha256", SECRET).update(data).digest("base64url");
  return data + "." + sig;
}

function readLocalJson(file, fallback) {
  try {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch (e) {
    return fallback;
  }
}

function blobClient() {
  if (!blob) return null;
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) return null;
  return blob;
}

function blobUrl(key) {
  if (!process.env.BLOB_READ_WRITE_TOKEN) return null;
  return "https://dwydvfbspixp0i2t.public.blob.vercel-storage.com/" + encodeURIComponent(key);
}

async function readJsonBlob(key, localFile, fallback) {
  const client = blobClient();
  const url = blobUrl(key);
  if (client && url) {
    try {
      const response = await fetch(url, { signal: AbortSignal.timeout(15000) });
      if (response.ok) return await response.json();
    } catch (e) {}
  }
  const local = readLocalJson(localFile, fallback);
  if (client) {
    try {
      await client.put(key, JSON.stringify(local), {
        access: "public",
        addRandomSuffix: false,
        allowOverwrite: true,
        token: process.env.BLOB_READ_WRITE_TOKEN
      });
    } catch (e) {}
  }
  return local;
}

async function writeJsonBlob(key, data) {
  const client = blobClient();
  if (client) {
    try {
      await client.put(key, JSON.stringify(data, null, 2), {
        access: "public",
        addRandomSuffix: false,
        allowOverwrite: true,
        token: process.env.BLOB_READ_WRITE_TOKEN
      });
      return true;
    } catch (e) {}
  }
  return false;
}

async function uploadImage(filename, b64) {
  const client = blobClient();
  if (!client) return null;
  const buf = Buffer.from(String(b64).replace(/^data:[^;]+;base64,/, ""), "base64");
  const allowed = [".jfif", ".jpg", ".jpeg", ".png", ".gif", ".webp"];
  let ext = path.extname(String(filename || "")).toLowerCase();
  if (allowed.indexOf(ext) === -1) ext = ".jfif";
  const safe = String(filename || "image")
    .replace(/\.[^.]+$/, "")
    .replace(/[^a-z0-9_]+/gi, "-")
    .replace(/-+/g, "-")
    .slice(0, 40);
  const outName = safe + "-" + Date.now() + "-" + crypto.randomBytes(4).toString("hex") + ext;
  const r = await client.put("uploads/" + outName, buf, {
    access: "public",
    addRandomSuffix: false,
    token: process.env.BLOB_READ_WRITE_TOKEN
  });
  return r.url;
}

function safeSlug(s) {
  return String(s || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60) || ("project-" + Date.now());
}

module.exports = {
  ADMIN_USER,
  ADMIN_PASS,
  json,
  parseBody,
  authToken,
  signToken,
  uploadImage,
  safeSlug,
  readJsonBlob,
  writeJsonBlob,
  PROJECTS_FILE,
  TEAM_FILE,
  GALLERY_FILE,
  KEYS
};