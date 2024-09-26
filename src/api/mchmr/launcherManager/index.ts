import { http } from "@/utils/http";

export const uploadBackgroundApi = (form: any) => {
  return http.uploadImg("/launcher/background", { form }, { timeout: 5000 });
};
