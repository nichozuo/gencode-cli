#!/usr/bin/env node
const fs = require("fs");
const genCode = require("./index.js");

try {
  const data = fs.readFileSync("./gencode.json", "utf8");
  const json = JSON.parse(data);

  json["module"] = json["module"] || "/admin";
  json["outPath"] = json["outPath"] || "./src/gen";
  console.log(json);

  genCode(json);
} catch (err) {
  console.error("Error reading or parsing file", err);
}
