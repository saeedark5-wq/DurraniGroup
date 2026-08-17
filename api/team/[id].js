"use strict";

const { json, parseBody, authToken, readJsonBlob, writeJsonBlob, TEAM_FILE, KEYS } = require("../_lib");

module.exports = async function (req, res) {
  if (req.method !== "PUT") return json(res, 405, { ok: false, error: "Method not allowed." });
  if (!authToken(req)) return json(res, 401, { ok: false, error: "Authentication required." });
  const memberId = decodeURIComponent(req.url.split("?")[0].split("/").filter(Boolean).slice(-1)[0]);
  return parseBody(req, async function (err, body) {
    if (err) return json(res, 400, { ok: false, error: String(err.message) });
    if (!body || !body.name) return json(res, 400, { ok: false, error: "Employee name is required." });
    const file = await readJsonBlob(KEYS.team, TEAM_FILE, { members: [] });
    const member = file.members.find(function (m) { return String(m.id) === String(memberId); });
    if (!member) return json(res, 404, { ok: false, error: "Team member not found." });
    let wa = String(body.mobile || "").replace(/[^\d]/g, "");
    if (wa.length === 10) wa = "92" + wa;
    member.name = body.name;
    member.role = body.role || member.role;
    member.area = body.area || member.area;
    member.mobile = body.mobile || member.mobile;
    member.whatsapp = wa || member.whatsapp;
    member.photo = body.photo || member.photo;
    member.email = body.email || member.email;
    const saved = await writeJsonBlob(KEYS.team, file);
    return json(res, saved ? 200 : 500, { ok: saved, error: saved ? undefined : "Could not save to storage.", member: member });
  });
};