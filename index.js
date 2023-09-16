const axios = require("axios");
const _ = require("lodash");
const fs = require("fs");

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

function genApis(midLayer) {
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
      // const typeName = snakeToPascal(summary);
      const name = midLayer[module][path].name;
      if (requestBody) {
        data += `    ${name}(data: ApiTypes.${module}.${name}): Promise<MyResponseType> {
      return request("${path}", { data });
    },\n`;
      } else {
        data += `    ${name}(data = {}): Promise<MyResponseType> {
      return request("${path}", { data });
    },\n`;
      }
    }
    data += `\t},\n`;
  }

  data += `}`;

  fs.writeFile("src/gen/Apis.ts", data, function (err) {
    if (err) {
      console.error("Error: " + err.message);
    } else {
      console.log("src/gen/Apis.ts has been created successfully.");
    }
  });
}

function genTypings(midLayer) {
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

  fs.writeFile("src/gen/typings.d.ts", data, function (err) {
    if (err) {
      console.error("Error: " + err.message);
    } else {
      console.log("src/gen/typings.d.ts has been created successfully.");
    }
  });
}

async function genCode(json) {
  try {
    openapi = await getJsonFromUrl(json["url"]);

    let midLayer = [];

    for (let path in openapi.paths) {
      if (path.startsWith(json["module"])) continue;
      for (let method in openapi.paths[path]) {
        const operation = openapi.paths[path][method];
        const t1 = operation["tags"][0].replace("Controller", "").split("/");
        const moduleName = t1[0];
        const controllerName = t1[1];
        // console.log(moduleName, controllerName);
        if (moduleName !== "Admin") continue;
        const requestBody = operation.requestBody;

        if (!midLayer[controllerName]) midLayer[controllerName] = {};

        const item = {
          method,
          name: snakeToPascal(operation["summary"]),
          summary: operation.summary,
          description: operation.description,
        };

        if (requestBody != null) {
          const properties =
            requestBody.content["application/x-www-form-urlencoded"].schema
              .properties;
          item["requestBody"] = properties;
        }

        midLayer[controllerName][path] = item;
        // console.log(item);
        // console.log({ path, method, module: operation["x-module-name"] });
      }
    }
    // console.log(midLayer);
    genApis(midLayer);
    genTypings(midLayer);
  } catch (error) {
    console.error(error);
  }
}
// // 使用函数
// (async () => {

// })();
module.exports = genCode;
