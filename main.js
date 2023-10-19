#!/usr/bin/env node
const fs = require("fs");
const _ = require("lodash");
const path = require("path");
const genCode = require("./index.js");
const configFilePath = "./gencode.json";

const defaultConfig = {
  url: "http://0.0.0.0:8000/api/docs/openapi",
  module: "/admin",
  outPath: "./src/gen/",
  apis: {
    firstLine: "import { request } from '@umijs/max';",
  },
};

function getUserConfig() {
  if (fs.existsSync(configFilePath)) {
    const fileContent = fs.readFileSync(configFilePath, "utf8");
    return JSON.parse(fileContent);
  } else {
    console.log("gencode.json 文件不存在，自动生成默认配置文件");
    fs.writeFileSync(defaultConfig, JSON.stringify(config, null, 2), "utf8");
    return defaultConfig;
  }
}

function deleteDirectory(directoryPath) {
  if (fs.existsSync(directoryPath)) {
    fs.readdirSync(directoryPath).forEach((file) => {
      const curPath = path.join(directoryPath, file);
      if (fs.lstatSync(curPath).isDirectory()) {
        deleteDirectory(curPath);
      } else {
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(directoryPath);
    console.log(`目录 ${directoryPath} 已成功删除。`);
  } else {
    console.log(`目录 ${directoryPath} 不存在。`);
  }
}

try {
  // 根据用户的配置文件，或者默认的配置文件，生成配置
  const userConfig = getUserConfig();
  const config = _.merge(defaultConfig, userConfig);
  console.log(config);

  // 删除老的文件
  deleteDirectory(config.outPath);
  // fs.rm(config.outPath, { recursive: true });

  // 生成新的文件
  genCode(config);
} catch (err) {
  console.error("Error reading or parsing file", err);
}
