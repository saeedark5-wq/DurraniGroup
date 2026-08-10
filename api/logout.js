"use strict";

const { json } = require("./_lib");

module.exports = async function (req, res) {
  if (req.method !== "POST") return json(res, 405, { ok: false, error: "Method not allowed." });
  return json(res, 200, { ok: true });
};