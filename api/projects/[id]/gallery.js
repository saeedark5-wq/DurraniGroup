"use strict";

const { json, parseBody, authToken, readJsonBlob, writeJsonBlob, PROJECTS_FILE, GALLERY_FILE, KEYS } = require("../../_lib");

module.exports = async function (req, res) {
  if (req.method !== "POST") return json(res, 405, { ok: false, error: "Method not allowed." });
  if (!authToken(req)) return json(res, 401, { ok: false, error: "Authentication required." });
  const projectId = decodeURIComponent(req.url.split("/").filter(Boolean).slice(-2)[0]);
  return parseBody(req, async function (err, body) {
    if (err) return json(res, 400, { ok: false, error: String(err.message) });
    const images = Array.isArray(body && body.images) ? body.images : [];
    if (!images.length) return json(res, 400, { ok: false, error: "No images provided." });
    const file = await readJsonBlob(KEYS.projects, PROJECTS_FILE, { projects: [] });
    const project = file.projects.find(function (p) { return p.id === projectId; });
    if (!project) return json(res, 404, { ok: false, error: "Project not found." });
    if (!Array.isArray(project.gallery)) project.gallery = [];
    const added = [];
    images.forEach(function (img) {
      if (!img || !img.src) return;
      project.gallery.push(img.src);
      added.push(img.src);
    });
    await writeJsonBlob(KEYS.projects, file);

    const galleryFile = await readJsonBlob(KEYS.gallery, GALLERY_FILE, { images: [] });
    images.forEach(function (img, i) {
      galleryFile.images.push({
        src: img.src,
        alt: (img.alt || project.name + " image") + (images.length > 1 ? " " + (i + 1) : ""),
        cat: "projects"
      });
    });
    await writeJsonBlob(KEYS.gallery, galleryFile);

    return json(res, 200, { ok: true, added: added });
  });
};