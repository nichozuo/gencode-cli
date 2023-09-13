const axios = require("axios");
const fs = require("fs");
const _ = require("lodash");

async function getJsonFromUrl(url) {
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

/**
 *
 * @param {*} snakeCaseStr
 * @returns
 */
function snakeToPascal(snakeCaseStr) {
  return _.upperFirst(_.camelCase(snakeCaseStr));
}

/**
 * 生成Apis.ts
 */
function genApis() {
  let data = `import { request } from "../common";

export const Apis = {
`;

  let docs = {};
  for (let module in Apis) {
    // console.log(module);
    data += `  ${module}: {\n`;
    for (let path in Apis[module]) {
      //   console.log("\t" + path);
      const summary = Apis[module][path].summary;
      const requestBody = Apis[module][path].requestBody || null;
      const typeName = snakeToPascal(summary);
      if (requestBody) {
        data += `    ${summary}(data: ApiTypes.${module}.${typeName}): Promise<MyResponseType> {
      return request("${path}", { data });
    },\n`;
      } else {
        data += `    ${summary}(data = {}): Promise<MyResponseType> {
      return request("${path}", { data });
    },\n`;
      }
    }
    data += `\t},\n`;
  }

  data += `}`;

  fs.writeFile("gen/Apis.ts", data, function (err) {
    if (err) {
      console.error("Error: " + err.message);
    } else {
      console.log("gen/Apis.ts has been created successfully.");
    }
  });
}

/**
 * 生成typings.d.ts
 */
function genTypings() {
  let data = `declare namespace ApiTypes {
`;

  let docs = {};
  for (let module in Apis) {
    console.log(module);
    data += `  namespace ${module} {\n`;
    for (let path in Apis[module]) {
      //   console.log("\t" + path);
      //   const summary = Apis[module][path].summary;
      const requestBody = Apis[module][path].requestBody || null;
      if (!requestBody) continue;

      data += `    type ${snakeToPascal(Apis[module][path].summary)} = {\n`;
      for (let field in requestBody) {
        const type = requestBody[field].type;
        const title = requestBody[field].title;
        const required = requestBody[field].required;
        data += `      ${field}${required ? "" : "?"}: ${type}; // ${title}\n`;
      }
      //   const typeName = snakeToPascal(summary);
      //   if (requestBody) {
      //     data += `    ${summary}(data: ApiTypes.${module}.${typeName}): Promise<MyResponseType> {
      //   return request("${path}", { data });
      // },\n`;
      //   } else {
      //     data += `    ${summary}(data = {}): Promise<MyResponseType> {
      //   return request("${path}", { data });
      // },\n`;
      //   }
      data += `    }\n`;
    }
    data += `  }\n\n`;
  }

  data += `}`;

  fs.writeFile("gen/typings.d.ts", data, function (err) {
    if (err) {
      console.error("Error: " + err.message);
    } else {
      console.log("gen/typings.d.ts has been created successfully.");
    }
  });
}

// getOpenApi(
//   "http://127.0.0.1:4523/export/openapi?projectId=3135131&version=3.0"
// );
const url = "http://0.0.0.0:8000/api/docs/openapi";
const openapi = await getJsonFromUrl(url);
console.log(openapi);
// for (let path in openapi.paths) {
//   console.log(path);
// }
// genApis();
// genTypings();
