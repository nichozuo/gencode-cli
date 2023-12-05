const fs = require("fs");
const _ = require("lodash");
const path = require("path");

function writeFile(dir, fileName, fileContent, print = true) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFile(path.join(dir, fileName), fileContent, function (err) {
    if (err) {
      console.error("Error: " + err.message);
    } else {
      if (print) console.log(`${fileName} has been created successfully.`);
    }
  });
}

function createNestedStructure(openapi) {
  // 获取所有tags
  const tags = openapi.tags.map((tag) => {
    return tag.name;
  });

  const root = {};

  tags.forEach((path) => {
    // 移除末尾的 "Controller" 并分割路径
    const parts = path.replace(/Controller$/, "").split("/");
    let currentLevel = root;

    // 遍历路径的每一部分，构建嵌套对象
    parts.forEach((part, index) => {
      // 如果当前层级还不存在该部分，则初始化为空对象
      if (!currentLevel[part]) {
        currentLevel[part] = {};
      }
      // 移动到下一个层级
      currentLevel = currentLevel[part];

      // 如果是路径的最后一部分，可以在这里添加额外的数据或标记
      // if (index === parts.length - 1) {
      //   // 例如，可以在这里标记为控制器结束点
      //   currentLevel.isLeaf = true;
      // }
    });
  });

  return root;
}

function parsePhpTypeToJsType(type) {
  switch (type) {
    case "array":
      return "any[]";
    case "integer":
    case "numeric":
      return "number";
    case "file":
    case "image":
      return "File";
    case "date":
      return "Date";
    default:
      return type;
  }
}

function createNestedApis(openapi, nestedStructure) {
  // 读取接口定义
  for (const [path, methods] of Object.entries(openapi.paths)) {
    // console.log(path);
    for (const [method, content] of Object.entries(methods)) {
      // console.log(path, method, content);
      const tags = content.tags[0].replace(/Controller$/, "").split("/");
      // console.log("tags", tags);
      let currentLevel = nestedStructure;
      tags.forEach((tag, index) => {
        currentLevel = currentLevel[tag];
        if (index === tags.length - 1) {
          const name = _.upperFirst(_.camelCase(content.summary));
          // console.log("name", name, content);
          const params = [];
          if (content.requestBody) {
            const properties =
              content["requestBody"]["content"][
                "application/x-www-form-urlencoded"
              ]["schema"]["properties"] ?? null;
            if (properties) {
              Object.keys(properties).forEach((key) => {
                if (key.includes("*")) return;
                params.push({
                  name: key,
                  type: parsePhpTypeToJsType(properties[key].type),
                  description: properties[key].description,
                  required: properties[key].required,
                });
              });
            }
          }
          if (content.parameters) {
            content.parameters.forEach((param) => {
              params[param.name] = param.schema.type;
            });
          }
          currentLevel[name] = {};
          currentLevel[name].path = path;
          currentLevel[name].tags = [...tags, name];
          currentLevel[name].params = params;
        }
      });
    }
  }
  return nestedStructure;
}

function _createApisFile(node, level) {
  let content = "";
  const tab = "  ".repeat(level);
  for (const [key, value] of Object.entries(node)) {
    if (value.path) {
      value.tags.shift();
      const typeString = ["ApiTypes", ...value.tags].join(".");
      const hasParams = value.params.length > 0 ? "" : "?";
      content += `${tab}${key}(data${hasParams}: ${typeString}): Promise<MyResponseType> {\n`;
      content += `${tab}  return request('${value.path}', { data });\n`;
      content += `${tab}},\n`;
    } else {
      content += `${tab}${key}: {\n`;
      content += _createApisFile(value, level + 1);
      content += `${tab}},\n`;
    }
  }
  return content;
}
function createApisFile(nestedApis, config) {
  let content =
    `${config["apis"]["firstLine"]}\n\n` + `export const Apis = {\n`;

  content += _createApisFile(nestedApis[config["module"]], 1);

  content += `}`;
  writeFile(config["outPath"], "Apis.ts", content);
}

function _createApiTypesFile(node, level) {
  const tab = "  ".repeat(level);
  let content = "";
  for (const [key, value] of Object.entries(node)) {
    if (value.path) {
      content += `${tab}type ${key} = {\n`;
      value.params.forEach((param) => {
        const required = param.required ? "" : "?";
        content += `${tab}  ${param.name}${required}: ${param.type}; // ${param.description} \n`;
      });
      content += `${tab}};\n`;
    } else {
      content += `${tab}namespace ${key} {\n`;
      content += _createApiTypesFile(value, level + 1);
      content += `${tab}}\n`;
    }
  }
  return content;
}
function createApiTypesFile(nestedApis, config) {
  let content = `declare namespace ApiTypes {\n`;

  content += _createApiTypesFile(nestedApis[config["module"]], 1);

  content += `}\n`;
  writeFile(config["outPath"], "typings.d.ts", content);
}

function createEnumsFile(openapi, config) {
  const comps = openapi.components.schemas;
  let data = (data1 = ``);
  for (let key in comps) {
    if (comps[key]["x-type"] != "enum") continue;
    const item = comps[key];
    data += `// ${comps[key]["title"]}\n`;
    data += `export const ${key}: MyEnumItemProps[] = [\n`;
    for (let p in item["properties"]) {
      const prop = item["properties"][p];
      data += "  " + JSON.stringify(prop) + ",\n";
    }
    data += `];\n\n`;

    if (config["components"] == false) continue;
    data1 = `import { MyProFormEnum } from "@/common";
import { ${key} } from "@/gen/enums";

export default function My${key}({ ...rest }) {
  return (
    <MyProFormEnum
      name="${item["x-field"] ?? ""}" 
      label="${item["title"]}"
      enums={${key}}
      {...rest}
    />
  );
}
    `;
    writeFile(config["outPath"] + "/components", `My${key}.tsx`, data1, false);
  }
  writeFile(config["outPath"], "enums.ts", data);
}

function genFiles(openapi, config) {
  // 生成树形结构
  const nestedStructure = createNestedStructure(openapi);
  // console.log(JSON.stringify(nestedStructure, null, 2));

  // 生成接口信息
  const nestedApis = createNestedApis(openapi, nestedStructure);
  // console.log(JSON.stringify(nestedApis, null, 2));

  // 生成接口文件
  createApisFile(nestedApis, config);

  // 生成type文件
  createApiTypesFile(nestedApis, config);

  // 生成enum文件
  createEnumsFile(openapi, config);
}

module.exports = genFiles;
