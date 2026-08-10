"use strict";

const { ADMIN_USER, ADMIN_PASS, json, parseBody, signToken } = require("./_lib");

module.exports = async function (req, res) {
  if (req.method !== "POST") return json(res, 405, { ok: false, error: "Method not allowed." });
  parseBody(req, function (err, body) {
    if (err) return json(res, 400, { ok: false, error: String(err.message) });
    const u = body && body.username;
    const p = body && body.password;
    if (!u || !p) return json(res, 401, { ok: false, error: "Enter username and password." });
    if (u !== ADMIN_USER || p !== ADMIN_PASS) {
      return json(res, 401, { ok: false, error: "Invalid username or password." });
    }
    return json(res, 200, { ok: true, token: signToken(u), username: u });
  });
};