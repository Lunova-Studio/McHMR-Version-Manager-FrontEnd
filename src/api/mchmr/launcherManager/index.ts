import { http } from "@/utils/http";

export const uploadBackgroundApi = (data: FormData) => {
  return http.request(
    "post",
    "/launcher/background",
    { data },
    {
      transformRequest: [
        function (data, headers) {
          // 去除post请求默认的Content-Type
          if (
            (headers["Content-Type"] as string) &&
            (headers["Content-Type"] as string).includes(
              "application/x-www-form-urlencoded"
            )
          ) {
            delete headers["Content-Type"];
          }
          return data;
        }
      ],
      timeout: 5000
    }
  );
};

export const saveBackgroudApi = (data: any) => {
  return http.post("/launcher/saveBackground", { data });
};

export const getBackgroundApi = () => {
  return http.get("/launcher/background");
};

export const getDownloadModeApi = () => {
  return http.get("/launcher/getDownloadMode");
};

export const setDownloadModeApi = (data: number) => {
  return http.post("/launcher/setDownloadMode", { data });
};
