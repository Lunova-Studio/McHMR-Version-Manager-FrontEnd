import { http } from "@/utils/http";
import { ApiResponse } from "@/utils/http/apiResponse";

export interface apiUrl {
  apiUrl: string;
}

export interface StateSwitch {
  StateSwitch: boolean;
}
export const getApiUrlApi = () => {
  return http.request<ApiResponse<apiUrl>>("get", "/welcome/getApiUrl");
};

export const generateApiUrlApi = data => {
  return http.request<ApiResponse<null>>("post", "/welcome/generateApiUrl", {
    data
  });
};

export const stateSwitchApi = data => {
  return http.request<ApiResponse<null>>("post", "/welcome/stateSwitch", {
    data
  });
};

export const gteStateSwitchApi = () => {
  return http.request<ApiResponse<StateSwitch>>(
    "get",
    "/welcome/getStateSwitch"
  );
};
