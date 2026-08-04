const http = require("http");
const fs = require("fs");
const path = require("path");

const ROOT = __dirname;
const PORT = 8000;
const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".jfif": "image/jpeg",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".mp4": "video/mp4",
  ".pdf": "application/pdf",
  ".json": "application/json",
  ".txt": "text/plain; charset=utf-8",
  ".woff": "font/woff",
  ".woff2": "font/woff2"
};

http
  .createServer(function (req, res) {
    let urlPath;
    try {
      urlPath = decodeURIComponent(req.url.split("?")[0]);
    } catch (e) {
      res.writeHead(400);
      return res.end("Bad Request");
    }
    if (urlPath === "/") urlPath = "/index.html";
    const filePath = path.join(ROOT, path.normalize(urlPath));
    if (!filePath.startsWith(ROOT)) {
      res.writeHead(403);
      return res.end("Forbidden");
    }
    fs.readFile(filePath, function (err, data) {
      if (err) {
        res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
        return res.end("404 - Not Found");
      }
      res.writeHead(200, { "Content-Type": MIME[path.extname(filePath).toLowerCase()] || "application/octet-stream" });
      res.end(data);
    });
  })
  .listen(PORT, function () {
    console.log("Durrani Group site running at http://localhost:" + PORT);
  });
