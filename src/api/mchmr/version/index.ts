import { http } from "@/utils/http";
import { ApiResponse } from "@/utils/http/apiResponse";

export interface VersionData {
  total: number;
  rows: VersionEntity[];
}

export interface VersionEntity {
  creatorId: string | null;
  createTime: string;
  updaterId: string | null;
  updateTime: string | null;
  deleted: boolean | null;
  vid: number;
  version: string;
  versionDescription: string;
  versionHashListPath: string;
  activeStatus: boolean;
}

export interface VersionQuery {
  pageNum: number;
  keyWord: string;
}

export interface VersionCreate {
  version: string;
  description: string;
}

export interface VersionChange {
  version: string;
  description: string;
}

export const updateVersionApi = (data: VersionChange) => {
  return http.request<ApiResponse<VersionChange>>("post", "/version/update", {
    data
  });
};

export const getVersionListApi = (params?: VersionQuery) => {
  return http.request<ApiResponse<VersionData>>("get", "/version/list", {
    params
  });
};

export const createVersionApi = (data: VersionCreate) => {
  return http.request<ApiResponse<VersionCreate>>("post", "/version/create", {
    data
  });
};
