#!/usr/bin/env node
const fs = require("fs");
const _ = require("lodash");
const path = require("path");
const axios = require("axios");
const configFilePath = "./gencode.json";
const genFiles = require("./index");

function getConfig() {
  let userConfig = {};
  if (fs.existsSync(configFilePath)) {
    const fileContent = fs.readFileSync(configFilePath, "utf8");
    userConfig = JSON.parse(fileContent);
  } else {
    console.log("gencode.json 文件不存在，自动生成默认配置文件");
    fs.writeFileSync(
      configFilePath,
      JSON.stringify(defaultConfig, null, 2),
      "utf8"
    );
    userConfig = defaultConfig;
  }
  return _.merge(
    {
      url: "http://0.0.0.0:8000/api/docs/openapi",
      module: "Admin",
      outPath: "./src/gen/",
      apis: {
        firstLine:
          "import { MyResponseType } from '@/common';\nimport { request } from '@umijs/max';",
      },
    },
    userConfig
  );
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

async function fetchOpenApi(url) {
  try {
    const response = await axios.get(url, {
      timeout: 5000,
    });
    return response.data;
  } catch (error) {
    throw new Error(`请求错误: ${url} ${error.message}`);
  }
}

async function main() {
  try {
    // 根据用户的配置文件，或者默认的配置文件，生成配置
    const config = getConfig();
    console.log("配置信息", config);

    // 删除老的文件
    deleteDirectory(config.outPath);

    // 获取openapi信息
    const openapi = await fetchOpenApi(config.url);
    // console.log("openapi", openapi);

    // 生成新的文件
    genFiles(openapi, config);
  } catch (err) {
    console.log("err", err.message);
  }
}

main();
