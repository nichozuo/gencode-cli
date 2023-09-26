const axios = require("axios");
const _ = require("lodash");
const fs = require("fs");
const path = require("path");

async function getJsonFromUrl(url) {
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error("请求错误", url, error);
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

function genApis(midLayer, json) {
  let data = `import { request } from '@umijs/max';

export const Apis = {
`;
  let docs = {};
  for (let module in midLayer) {
    // console.log(module);
    data += `  ${module}: {\n`;
    for (let path in midLayer[module]) {
      //   console.log("\t" + path);
      const summary = midLayer[module][path].summary;
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
  writeFile(json["outPath"], "Apis.ts", data);
}

function genTypings(midLayer, json) {
  let data = `declare namespace ApiTypes {
`;
  let docs = {};
  for (let module in midLayer) {
    data += `  namespace ${module} {\n`;
    for (let path in midLayer[module]) {
      const name = midLayer[module][path].name;
      const requestBody = midLayer[module][path].requestBody || null;
      if (!requestBody) continue;
      data += `    type ${name} = {\n`;
      for (let field in requestBody) {
        const type = requestBody[field].type;
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
  writeFile(json["outPath"], "typings.d.ts", data);
}

function genEnums(comps, json) {
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

    data1 = `import { MyProFormEnum } from '@/common';
import { ${key} } from '@/gen/enums';

export default function My${key}({ ...rest }) {
  return <MyProFormEnum name="${item["x-field"] ?? ""}" label="${
      item["title"]
    }" enums={${key}} {...rest} />;
}
    `;
    writeFile(json["outPath"] + "/components", `My${key}.tsx`, data1);
  }
  writeFile(json["outPath"], "enums.ts", data);
}

async function genCode(json) {
  try {
    openapi = await getJsonFromUrl(json["url"]);
    let midLayer = [];
    for (let path in openapi.paths) {
      if (!path.startsWith(json["module"])) continue;
      for (let method in openapi.paths[path]) {
        const operation = openapi.paths[path][method];
        const t1 = operation["tags"][0].replace("Controller", "").split("/");
        const moduleName = t1[0];
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
    genApis(midLayer, json);
    genTypings(midLayer, json);
    genEnums(openapi.components, json);
  } catch (error) {
    console.error(error);
  }
}

module.exports = genCode;
