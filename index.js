const _ = require("lodash");
const fs = require("fs");
const path = require("path");
const axios = require("axios");

async function getOpenAPI(url) {
  try {
    const response = await axios.get(url, {
      timeout: 5000, // 设置超时时间为5秒
    });
    // console.log("response", response.data);
    // const data = response.data;
    return response.data;
  } catch (error) {
    // console.log("请求错误", error.message);
    throw new Error(`请求错误: ${url} ${error.message}`);
  }
}

function snakeToPascal(snakeCaseStr) {
  return _.upperFirst(_.camelCase(snakeCaseStr));
}

function writeFile(dir, fileName, fileContent) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFile(path.join(dir, fileName), fileContent, function (err) {
    if (err) {
      console.error("Error: " + err.message);
    } else {
      console.log(`${fileName} has been created successfully.`);
    }
  });
}

function genApis(midLayer, config) {
  let data = `${config["apis"]["firstLine"]}\n\n` + `export const Apis = {\n`;
  for (let module in midLayer) {
    // console.log(module);
    data += `  ${module}: {\n`;
    for (let path in midLayer[module]) {
      //   console.log("\t" + path);
      const requestBody = midLayer[module][path].requestBody || null;
      const isDownload = midLayer[module][path].isDownload
        ? ", responseType: 'blob'"
        : "";
      // const typeName = snakeToPascal(summary);
      const name = midLayer[module][path].name;
      if (requestBody) {
        data += `    ${name}(data: ApiTypes.${module}.${name}): Promise<MyResponseType> {
      return request("${path}", { data${isDownload} });
    },\n`;
      } else {
        data += `    ${name}(data = {}): Promise<MyResponseType> {
      return request("${path}", { data${isDownload} });
    },\n`;
      }
    }
    data += `\t},\n`;
  }
  data += `}`;
  writeFile(config["outPath"], "Apis.ts", data);
}

function processType(type) {
  if (type.startsWith("mimes:")) return "any";
  return type;
}

function genTypings(midLayer, config) {
  let data = `declare namespace ApiTypes {
`;
  for (let module in midLayer) {
    data += `  namespace ${module} {\n`;
    for (let path in midLayer[module]) {
      const name = midLayer[module][path].name;
      const requestBody = midLayer[module][path].requestBody || null;
      if (!requestBody) continue;
      data += `    type ${name} = {\n`;
      for (let field in requestBody) {
        // 如果field带有*，则过滤
        if (field.indexOf("*") != -1) continue;
        const type = processType(requestBody[field].type);
        const description = requestBody[field].description;
        const required = requestBody[field].required;
        data += `      ${field}${
          required ? "" : "?"
        }: ${type}; // ${description}\n`;
      }
      data += `    }\n`;
    }
    data += `  }\n\n`;
  }
  data += `}`;
  writeFile(config["outPath"], "typings.d.ts", data);
}

function genEnums(comps, config) {
  let data = (data1 = ``);
  for (let key in comps) {
    if (comps[key]["x-type"] != "enum") continue;
    const item = comps[key];
    data += `// ${comps[key]["title"]}\n`;
    data += `export const ${key}: MyEnumItemProps[] = [\n`;
    for (let p in item["properties"]) {
      const prop = item["properties"][p];
      data += "\t" + JSON.stringify(prop) + ",\n";
    }
    data += `];\n`;

    if (config["components"] == false) continue;
    data1 = `import { MyProFormEnum } from '@/common';
import { ${key} } from '@/gen/enums';

export default function My${key}({ ...rest }) {
  return <MyProFormEnum name="${item["x-field"] ?? ""}" label="${
      item["title"]
    }" enums={${key}} {...rest} />;
}
    `;
    writeFile(config["outPath"] + "/components", `My${key}.tsx`, data1);
  }
  writeFile(config["outPath"], "enums.ts", data);
}

function genMidLayer(openapi, config) {
  let midLayer = [];
  for (let path in openapi.paths) {
    if (!path.startsWith(config["module"])) continue;
    for (let method in openapi.paths[path]) {
      const operation = openapi.paths[path][method];
      const t1 = operation["tags"][0].replace("Controller", "").split("/");
      const controllerName = t1[1];
      // console.log(moduleName, controllerName);
      const requestBody = operation.requestBody;

      if (!midLayer[controllerName]) midLayer[controllerName] = {};

      const item = {
        method,
        name: snakeToPascal(operation["summary"]),
        summary: operation.summary,
        description: operation.description,
        isDownload: operation["x-is-download"],
      };

      if (requestBody != null) {
        const properties =
          requestBody.content["application/x-www-form-urlencoded"].schema
            .properties;
        item["requestBody"] = properties;
      }

      midLayer[controllerName][path] = item;
    }
  }
  // console.log("midLayer", midLayer);
  return midLayer;
}

async function genCode(config) {
  console.log("开始请求...");
  openapi = await getOpenAPI(config["url"]);
  console.log("开始解析中间层...");
  const midLayer = genMidLayer(openapi, config);
  console.log("开始生成代码...");
  genApis(midLayer, config);
  genTypings(midLayer, config);
  genEnums(openapi.components, config);
}

module.exports = genCode;
