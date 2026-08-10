"use strict";

const { json, readJsonBlob, writeJsonBlob, PROJECTS_FILE, TEAM_FILE, GALLERY_FILE, KEYS } = require("./_lib");

module.exports = async function (req, res) {
  if (req.method !== "GET") return json(res, 405, { ok: false, error: "Method not allowed." });
  const [projects, team, gallery] = await Promise.all([
    readJsonBlob(KEYS.projects, PROJECTS_FILE, { projects: [] }),
    readJsonBlob(KEYS.team, TEAM_FILE, { members: [] }),
    readJsonBlob(KEYS.gallery, GALLERY_FILE, { images: [] })
  ]);
  await writeJsonBlob(KEYS.projects, projects);
  await writeJsonBlob(KEYS.team, team);
  await writeJsonBlob(KEYS.gallery, gallery);
  return json(res, 200, {
    ok: true,
    projects: projects.projects || [],
    team: team.members || [],
    gallery: gallery.images || []
  });
};