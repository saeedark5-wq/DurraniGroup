"use strict";

const { json, parseBody, authToken, safeSlug, readJsonBlob, writeJsonBlob, PROJECTS_FILE, KEYS } = require("./_lib");

module.exports = async function (req, res) {
  if (req.method !== "POST") return json(res, 405, { ok: false, error: "Method not allowed." });
  if (!authToken(req)) return json(res, 401, { ok: false, error: "Authentication required." });
  return parseBody(req, async function (err, body) {
    if (err) return json(res, 400, { ok: false, error: String(err.message) });
    if (!body || !body.name) return json(res, 400, { ok: false, error: "Project name is required." });
    const file = await readJsonBlob(KEYS.projects, PROJECTS_FILE, { projects: [] });
    const id = safeSlug(body.name);
    file.projects.unshift({
      id: id,
      name: body.name,
      location: body.location || "Peshawar, KP",
      description: body.description || "",
      tag: body.tag || "New Launch",
      image: body.image || "images/Map.jfif",
      page: body.page || "pages/projects.html",
      whatsappText: body.whatsappText || encodeURIComponent(body.name),
      gallery: Array.isArray(body.gallery) ? body.gallery : []
    });
    await writeJsonBlob(KEYS.projects, file);
    return json(res, 200, { ok: true, project: file.projects[0] });
  });
};