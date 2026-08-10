"use strict";

const { json, parseBody, authToken, uploadImage } = require("./_lib");

module.exports = async function (req, res) {
  if (req.method !== "POST") return json(res, 405, { ok: false, error: "Method not allowed." });
  if (!authToken(req)) return json(res, 401, { ok: false, error: "Authentication required." });
  return parseBody(req, async function (err, body) {
    if (err) return json(res, 400, { ok: false, error: String(err.message) });
    const b64 = body && body.data;
    if (!b64) return json(res, 400, { ok: false, error: "No image data received." });
    const url = await uploadImage(body.filename, b64);
    if (!url) return json(res, 500, { ok: false, error: "Upload storage is not configured (BLOB_READ_WRITE_TOKEN missing)." });
    return json(res, 200, { ok: true, url: url });
  });
};