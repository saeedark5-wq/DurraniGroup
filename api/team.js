"use strict";

const { json, parseBody, authToken, readJsonBlob, writeJsonBlob, TEAM_FILE, KEYS } = require("./_lib");

module.exports = async function (req, res) {
  if (req.method !== "POST") return json(res, 405, { ok: false, error: "Method not allowed." });
  if (!authToken(req)) return json(res, 401, { ok: false, error: "Authentication required." });
  return parseBody(req, async function (err, body) {
    if (err) return json(res, 400, { ok: false, error: String(err.message) });
    if (!body || !body.name) return json(res, 400, { ok: false, error: "Employee name is required." });
    const file = await readJsonBlob(KEYS.team, TEAM_FILE, { members: [] });
    let wa = String(body.mobile || "").replace(/[^\d]/g, "");
    if (wa.length === 10) wa = "92" + wa;
    const member = {
      id: Date.now(),
      name: body.name,
      role: body.role || "Sales Executive",
      area: body.area || "Regi Model Town, Peshawar",
      mobile: body.mobile || "",
      whatsapp: wa || "",
      photo: body.photo || "Mazhar Founder.jfif",
      email: body.email || ""
    };
    file.members.unshift(member);
    await writeJsonBlob(KEYS.team, file);
    return json(res, 200, { ok: true, member: member });
  });
};