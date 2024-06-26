import { http } from "@/utils/http";
import { ApiResponse } from "@/utils/http/apiResponse";

export interface apiUrl {
  apiUrl: string;
}

export const getApiUrlApi = () => {
  return http.request<ApiResponse<apiUrl>>("get", "/welcome/getApiUrl");
};

export const generateApiUrlApi = () => {
  return http.request<ApiResponse<null>>("post", "/welcome/generateApiUrl");
};
