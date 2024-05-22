import { http } from "@/utils/http";

export interface ServerManager {
  [x: string]: any;
  id: number;
  serverName: string;
}

export interface Whitelist {
  [x: string]: any;
  path: string;
}

// 获取服务器名称
export const getServerManagerApi = () => {
  return http.request<ServerManager>("get", "/server/serverName");
};

// 更新或新增服务器名称
export const updateServerManagerApi = (data: ServerManager) => {
  return http.request("post", "/server/serverName", { data });
};

export const getWhitelistApi = () => {
  return http.request<ServerManager[]>("get", "/server/whitelist");
};

export const updateWhitelistApi = (data: Whitelist) => {
  return http.request("post", "/server/whitelist", { data });
};
