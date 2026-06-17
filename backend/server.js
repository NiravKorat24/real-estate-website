const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, "..", "frontend")));

app.get("/api/sites", (req, res) => {
  const data = fs.readFileSync(path.join(__dirname, "sites.json"), "utf-8");
  res.json(JSON.parse(data));
});

app.get("/api/sites/:id", (req, res) => {
  const data = JSON.parse(fs.readFileSync(path.join(__dirname, "sites.json"), "utf-8"));
  const site = data.find(s => s.id == req.params.id);
  res.json(site);
});

app.get("/projects/:name", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "frontend", "site.html"));
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
