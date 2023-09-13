declare namespace ApiTypes {
  namespace Admins {
    type List = {
      username?: string; // 模糊搜索：名称
    }
    type Store = {
      username: string; // 用户名
      password: string; // 密码
      roles_id?: array; // 角色
    }
    type Update = {
      id: integer; // id
      username: string; // 用户名
      password?: string; // 密码
      roles_id?: array; // 角色
    }
    type Delete = {
      id: integer; // id
    }
  }

  namespace Auth {
    type Login = {
      username: string; // 用户名
      password: string; // 密码
    }
    type ChangePassword = {
      old_password: string; // 老密码
      new_password: string; // 新密码
      re_new_password: string; // 重复新密码
    }
    type PreUpload = {
      server_type: string; // -
      upload_type: string; // -
    }
    type DoUpload = {
      upload_file: file; // 上传文件
    }
  }

  namespace BannerCategories {
    type List = {
      name?: string; // 模糊搜索：名称
    }
    type Store = {
      name: string; // 分类名称
    }
    type Update = {
      id: integer; // id
      name: string; // 分类名称
    }
    type Show = {
      id: integer; // id
    }
    type Delete = {
      id: integer; // id
    }
  }

  namespace Banners {
    type List = {
      banner_categories_id?: integer; // 分类ID
    }
    type Store = {
      banner_categories_id: integer; // 分类ID
      cover_image: array; // 图片
      link?: string; // 链接
      order_column: integer; // 排序：从小到大
    }
    type Update = {
      id: integer; // id
      banner_categories_id: integer; // 分类ID
      cover_image: array; // 图片
      link?: string; // 链接
      order_column: integer; // 排序：从小到大
    }
    type Show = {
      id: integer; // id
    }
    type Delete = {
      id: integer; // id
    }
  }

  namespace Cities {
    type List = {
      name?: string; // 模糊搜索：名称
    }
    type Store = {
      name: string; // 城市名
    }
    type Update = {
      id: integer; // id
      name: string; // 城市名
    }
    type Show = {
      id: integer; // id
    }
    type SoftDelete = {
      id: integer; // id
    }
    type Restore = {
      id: integer; // id
    }
    type Delete = {
      id: integer; // id
    }
  }

  namespace Configs {
    type Get = {
      key: string; // 模糊搜索：名称
    }
    type Set = {
      key: string; // 配置项
      value: array; // 配置值
    }
  }

  namespace NoticeCategories {
    type List = {
      name?: string; // 模糊搜索：名称
    }
    type Store = {
      name: string; // 分类名称
    }
    type Update = {
      id: integer; // id
      name: string; // 分类名称
    }
    type Show = {
      id: integer; // id
    }
    type Delete = {
      id: integer; // id
    }
  }

  namespace Notices {
    type List = {
      notice_categories_id?: integer; // 分类ID
      title?: string; // 模糊搜索：名称
    }
    type Store = {
      notice_categories_id: integer; // 分类ID
      title?: string; // 标题
      link?: string; // 链接
      content?: string; // 内容
      order_column: integer; // 排序：从小到大
    }
    type Update = {
      id: integer; // id
      notice_categories_id: integer; // 分类ID
      title?: string; // 标题
      link?: string; // 链接
      content?: string; // 内容
      order_column: integer; // 排序：从小到大
    }
    type Show = {
      id: integer; // id
    }
    type Delete = {
      id: integer; // id
    }
  }

  namespace SysPermissions {
    type List = {
      parent_id?: integer; // 上级ID
    }
    type Store = {
      name: string; // 名称
      title: string; // 标题
      url?: string; // 菜单链接
      parent_id?: integer; // 上级ID
    }
    type Update = {
      id: integer; // ID
      name: string; // 名称
      title: string; // 标题
      url?: string; // 菜单链接
      parent_id?: integer; // 上级ID
    }
    type Delete = {
      id: integer; // ID
    }
    type Move = {
      id: integer; // ID
      type: string; // 类型：up 升级，down 降级
    }
  }

  namespace SysRoles {
    type List = {
      name?: string; // 模糊搜索：名称
    }
    type Store = {
      name: string; // 名称
      color?: array; // 颜色
    }
    type Update = {
      id: integer; // ID
      name: string; // 名称
      color?: array; // 颜色
    }
    type Delete = {
      id: integer; // ID
    }
    type GetPermissions = {
      id: integer; // ID
    }
    type SetPermissions = {
      id: integer; // ID
      permissions_ids: array; // 权限ID
    }
  }

  namespace Wechats {
    type List = {
      openid?: string; // openid
      nickname?: string; // 用户昵称
      phone_number?: string; // 手机号
    }
  }

}