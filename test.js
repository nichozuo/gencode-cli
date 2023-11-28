const fs = require("fs");
const _ = require("lodash");

function createNestedStructure(array) {
  const root = {};

  array.forEach((path) => {
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
      if (index === parts.length - 1) {
        // 例如，可以在这里标记为控制器结束点
        currentLevel.isLeaf = true;
      }
    });
  });

  return root;
}

// 读取openapi.json文件
const openapiContent = fs.readFileSync("openapi.json", "utf8");
const openapi = JSON.parse(openapiContent);

// 获取所有tags
const tags = openapi.tags.map((tag) => {
  return tag.name;
});

// 生成树形结构
const nestedObject = createNestedStructure(tags);
console.log(JSON.stringify(nestedObject, null, 2));

// 读取接口定义
for (const [path, method] of Object.entries(openapi.paths)) {
  console.log(path);
  for (const [method, content] of Object.entries(method)) {
    console.log(method, content);
  }
}
