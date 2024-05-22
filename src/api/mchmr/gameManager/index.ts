import { http } from "@/utils/http";
import { ApiResponse } from "@/utils/http/apiResponse";

// 定义返回的数据格式
export interface GameFileListData {
  total: number;
  folderNum: number;
  fileNum: number;
  path: string[] | string;
  rows: {
    fileName: string;
    permission: string;
    modifyDate: Date;
    fileType: string;
    fileSize: number;
    showBtn: boolean;
    isRename: boolean;
  };
}

// 定义搜索的参数
export interface GameFileListQuery {
  path: string;
  keyWord: string;
}

export interface FileRenameRequest {
  path: string;
  oldName: string;
  newName: string;
}

export interface FileMoveRequest {
  targetPath: string;
  fileArray: string[];
}

export interface FolderCreateRequest {
  path: string;
  folderName: string;
}

export interface isUploadRequest {
  fileName: string;
  path: string;
}

export interface unZipRequest {
  path: string;
  targetFile: string;
}

export const getGameFileListApi = (params: GameFileListQuery) => {
  return http.request<ApiResponse<GameFileListData>>("get", "/game/list", {
    params
  });
};

export const renameFileApi = (data: FileRenameRequest) => {
  return http.request<ResponseData<void>>("post", "/game/rename", { data });
};

export const deleteFileApi = (data: string[]) => {
  return http.request<ResponseData<void>>("delete", "/game/delete", { data });
};

export const moveFileApi = (data: FileMoveRequest) => {
  return http.request<ResponseData<void>>("post", "/game/move", { data });
};

export const createFolderApi = (data: FolderCreateRequest) => {
  return http.request<ResponseData<void>>("post", "/game/createNewFolder", {
    data
  });
};

export const uploadApi = (data: any, config: any) => {
  return http.upload("/game/upload", { data }, { config });
};

export const isUploadApi = (params: isUploadRequest) => {
  return http.request("get", "/game/isUpload", { params });
};

export const unZipApi = (params: unZipRequest) => {
  return http.unzip("/game/unZip", { params });
};
