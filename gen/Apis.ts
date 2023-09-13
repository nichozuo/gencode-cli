import { request } from '@umijs/max';

export const Apis = {
  Admins: {
    List(data: ApiTypes.Admins.List): Promise<MyResponseType> {
      return request("/admin/admins/list", { data });
    },
    Store(data: ApiTypes.Admins.Store): Promise<MyResponseType> {
      return request("/admin/admins/store", { data });
    },
    Update(data: ApiTypes.Admins.Update): Promise<MyResponseType> {
      return request("/admin/admins/update", { data });
    },
    Delete(data: ApiTypes.Admins.Delete): Promise<MyResponseType> {
      return request("/admin/admins/delete", { data });
    },
	},
  Auth: {
    Login(data: ApiTypes.Auth.Login): Promise<MyResponseType> {
      return request("/admin/auth/login", { data });
    },
    Logout(data = {}): Promise<MyResponseType> {
      return request("/admin/auth/logout", { data });
    },
    Me(data = {}): Promise<MyResponseType> {
      return request("/admin/auth/me", { data });
    },
    ChangePassword(data: ApiTypes.Auth.ChangePassword): Promise<MyResponseType> {
      return request("/admin/auth/change_password", { data });
    },
    PreUpload(data: ApiTypes.Auth.PreUpload): Promise<MyResponseType> {
      return request("/admin/auth/pre_upload", { data });
    },
    DoUpload(data: ApiTypes.Auth.DoUpload): Promise<MyResponseType> {
      return request("/admin/auth/do_upload", { data });
    },
	},
  BannerCategories: {
    List(data: ApiTypes.BannerCategories.List): Promise<MyResponseType> {
      return request("/admin/banner_categories/list", { data });
    },
    Store(data: ApiTypes.BannerCategories.Store): Promise<MyResponseType> {
      return request("/admin/banner_categories/store", { data });
    },
    Update(data: ApiTypes.BannerCategories.Update): Promise<MyResponseType> {
      return request("/admin/banner_categories/update", { data });
    },
    Show(data: ApiTypes.BannerCategories.Show): Promise<MyResponseType> {
      return request("/admin/banner_categories/show", { data });
    },
    Delete(data: ApiTypes.BannerCategories.Delete): Promise<MyResponseType> {
      return request("/admin/banner_categories/delete", { data });
    },
    Select(data = {}): Promise<MyResponseType> {
      return request("/admin/banner_categories/select", { data });
    },
	},
  Banners: {
    List(data: ApiTypes.Banners.List): Promise<MyResponseType> {
      return request("/admin/banners/list", { data });
    },
    Store(data: ApiTypes.Banners.Store): Promise<MyResponseType> {
      return request("/admin/banners/store", { data });
    },
    Update(data: ApiTypes.Banners.Update): Promise<MyResponseType> {
      return request("/admin/banners/update", { data });
    },
    Show(data: ApiTypes.Banners.Show): Promise<MyResponseType> {
      return request("/admin/banners/show", { data });
    },
    Delete(data: ApiTypes.Banners.Delete): Promise<MyResponseType> {
      return request("/admin/banners/delete", { data });
    },
	},
  Cities: {
    List(data: ApiTypes.Cities.List): Promise<MyResponseType> {
      return request("/admin/cities/list", { data });
    },
    Store(data: ApiTypes.Cities.Store): Promise<MyResponseType> {
      return request("/admin/cities/store", { data });
    },
    Update(data: ApiTypes.Cities.Update): Promise<MyResponseType> {
      return request("/admin/cities/update", { data });
    },
    Show(data: ApiTypes.Cities.Show): Promise<MyResponseType> {
      return request("/admin/cities/show", { data });
    },
    SoftDelete(data: ApiTypes.Cities.SoftDelete): Promise<MyResponseType> {
      return request("/admin/cities/soft_delete", { data });
    },
    Restore(data: ApiTypes.Cities.Restore): Promise<MyResponseType> {
      return request("/admin/cities/restore", { data });
    },
    Delete(data: ApiTypes.Cities.Delete): Promise<MyResponseType> {
      return request("/admin/cities/delete", { data });
    },
	},
  Configs: {
    Get(data: ApiTypes.Configs.Get): Promise<MyResponseType> {
      return request("/admin/configs/get", { data });
    },
    Set(data: ApiTypes.Configs.Set): Promise<MyResponseType> {
      return request("/admin/configs/set", { data });
    },
	},
  NoticeCategories: {
    List(data: ApiTypes.NoticeCategories.List): Promise<MyResponseType> {
      return request("/admin/notice_categories/list", { data });
    },
    Store(data: ApiTypes.NoticeCategories.Store): Promise<MyResponseType> {
      return request("/admin/notice_categories/store", { data });
    },
    Update(data: ApiTypes.NoticeCategories.Update): Promise<MyResponseType> {
      return request("/admin/notice_categories/update", { data });
    },
    Show(data: ApiTypes.NoticeCategories.Show): Promise<MyResponseType> {
      return request("/admin/notice_categories/show", { data });
    },
    Delete(data: ApiTypes.NoticeCategories.Delete): Promise<MyResponseType> {
      return request("/admin/notice_categories/delete", { data });
    },
    Select(data = {}): Promise<MyResponseType> {
      return request("/admin/notice_categories/select", { data });
    },
	},
  Notices: {
    List(data: ApiTypes.Notices.List): Promise<MyResponseType> {
      return request("/admin/notices/list", { data });
    },
    Store(data: ApiTypes.Notices.Store): Promise<MyResponseType> {
      return request("/admin/notices/store", { data });
    },
    Update(data: ApiTypes.Notices.Update): Promise<MyResponseType> {
      return request("/admin/notices/update", { data });
    },
    Show(data: ApiTypes.Notices.Show): Promise<MyResponseType> {
      return request("/admin/notices/show", { data });
    },
    Delete(data: ApiTypes.Notices.Delete): Promise<MyResponseType> {
      return request("/admin/notices/delete", { data });
    },
	},
  SysPermissions: {
    List(data: ApiTypes.SysPermissions.List): Promise<MyResponseType> {
      return request("/admin/sys_permissions/list", { data });
    },
    Store(data: ApiTypes.SysPermissions.Store): Promise<MyResponseType> {
      return request("/admin/sys_permissions/store", { data });
    },
    Update(data: ApiTypes.SysPermissions.Update): Promise<MyResponseType> {
      return request("/admin/sys_permissions/update", { data });
    },
    Delete(data: ApiTypes.SysPermissions.Delete): Promise<MyResponseType> {
      return request("/admin/sys_permissions/delete", { data });
    },
    Move(data: ApiTypes.SysPermissions.Move): Promise<MyResponseType> {
      return request("/admin/sys_permissions/move", { data });
    },
    Tree(data = {}): Promise<MyResponseType> {
      return request("/admin/sys_permissions/tree", { data });
    },
	},
  SysRoles: {
    List(data: ApiTypes.SysRoles.List): Promise<MyResponseType> {
      return request("/admin/sys_roles/list", { data });
    },
    Store(data: ApiTypes.SysRoles.Store): Promise<MyResponseType> {
      return request("/admin/sys_roles/store", { data });
    },
    Update(data: ApiTypes.SysRoles.Update): Promise<MyResponseType> {
      return request("/admin/sys_roles/update", { data });
    },
    Delete(data: ApiTypes.SysRoles.Delete): Promise<MyResponseType> {
      return request("/admin/sys_roles/delete", { data });
    },
    Select(data = {}): Promise<MyResponseType> {
      return request("/admin/sys_roles/select", { data });
    },
    GetPermissions(data: ApiTypes.SysRoles.GetPermissions): Promise<MyResponseType> {
      return request("/admin/sys_roles/get_permissions", { data });
    },
    SetPermissions(data: ApiTypes.SysRoles.SetPermissions): Promise<MyResponseType> {
      return request("/admin/sys_roles/set_permissions", { data });
    },
	},
  Wechats: {
    List(data: ApiTypes.Wechats.List): Promise<MyResponseType> {
      return request("/admin/wechats/list", { data });
    },
	},
}