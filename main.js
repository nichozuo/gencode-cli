#!/usr/bin/env node
const fs = require("fs");
const genCode = require("./index.js");

try {
  const data = fs.readFileSync("./gencode.json", "utf8");
  const json = JSON.parse(data);
  console.log(json["url"]);
  genCode(json["url"]);
} catch (err) {
  console.error("Error reading or parsing file", err);
}
