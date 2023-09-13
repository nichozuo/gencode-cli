const Apis = {
  Auth: {
    "admin/auth/login": {
      method: "post",
      "x-action-name": "login",
      summary: "登录",
      description: "",
      requestBody: {
        username: {
          type: "string",
          title: "用户名",
          required: true,
        },
        password: {
          type: "string",
          title: "密码",
          required: true,
        },
      },
    },
    "auth/me": {
      method: "post",
      summary: "login",
      description: "获取已登录用户信息",
    },
  },
  Admins: {
    "admins/list": {
      method: "post",
      summary: "list",
      description: "列表",
      requestBody: {
        username: {
          type: "string",
          title: "用户名",
          required: false,
        },
      },
    },
  },
};
