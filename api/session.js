"use strict";

const { json, authToken } = require("./_lib");

module.exports = async function (req, res) {
  if (req.method !== "POST") return json(res, 405, { ok: false, error: "Method not allowed." });
  if (!authToken(req)) return json(res, 401, { ok: false, error: "Authentication required." });
  return json(res, 200, { ok: true });
};