import { request } from "@/common";

export const Apis = {
  admin: {
    admins: {
      : (params: any) => request.post(`/admin/admins/list`, params),
    }
    assets: {
      assetBuildings: {
        : (params: any) => request.post(`/admin/assets/asset_buildings/list`, params),
      }
  },
};
