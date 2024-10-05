<template>
  <div class="app-container">
    <el-row :gutter="20" style="margin-top: 20px">
      <el-col :span="24" :xs="24">
        <el-card>
          <template v-slot:header>
            <div class="clearfix">
              <span>启动器背景图管理</span>
            </div>
          </template>
          <el-form ref="serverConfigRef" :model="launcherBackground">
            <el-form-item label="启用启动器背景" prop="hasBackground">
              <el-switch v-model="hasBg" />
            </el-form-item>
            <el-form-item
              label="选择上传启动器背景"
              prop="background"
              width="100px"
            >
              <el-upload
                class="avatar-uploader"
                action="#"
                :show-file-list="false"
                :before-upload="beforeAvatarUpload"
                :multiple="false"
                :http-request="submitBg"
                style="width: 400px; height: 225px"
              >
                <img
                  v-if="imageUrl"
                  :src="imageUrl"
                  class="avatar"
                  style="width: 400px; height: 225px"
                />
                <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
              </el-upload>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submitBgSave">提交</el-button>
              <span style="margin-left: 10px"
                >tips:
                提交后才能正常显示，如果启用启动器背景功能，不设置图像，会显示默认背景，不启用则不会显示背景。背景图比例建议：800x450</span
              >
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="20" style="margin-top: 20px">
      <el-col :span="24" :xs="24">
        <el-card>
          <template v-slot:header>
            <div class="clearfix">
              <span>启动器更新模式管理</span>
            </div>
          </template>
          <el-form>
            <el-form-item label="启用增量包模式">
              <el-switch v-model="hasIncremental" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submitMode">提交</el-button>
              <span style="margin-left: 10px"
                >tips:
                增量包模式会大量占用系统IO性能，多文件模式会占用大量服务器带宽，请根据实际情况择优选择启动器/更新器下载模式。</span
              >
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { ElMessage } from "element-plus";
import { Plus } from "@element-plus/icons-vue";
import {
  uploadBackgroundApi,
  saveBackgroudApi,
  getBackgroundApi,
  getDownloadModeApi,
  setDownloadModeApi
} from "@/api/mchmr/launcherManager";

import type { UploadProps, UploadRequestOptions } from "element-plus";

defineOptions({
  name: "LauncherManager"
});

const launcherBackground = {
  hasBg: null,
  background: null
};

const hasBg = ref(true);

const hasIncremental = ref(false);

const imageUrl = ref("");

const beforeAvatarUpload: UploadProps["beforeUpload"] = rawFile => {
  if (rawFile.type !== "image/jpeg") {
    ElMessage.error("只能上传 JPG 格式的图片");
    return false;
  } else if (rawFile.size / 1024 / 1024 > 2) {
    ElMessage.error("图片大小不能超过 2MB");
    return false;
  }
  return true;
};

const submitBg = async (option: UploadRequestOptions) => {
  const formData = new FormData();
  formData.append("file", option.file);
  await uploadBackgroundApi(formData).then((res: any) => {
    imageUrl.value = res.data;
  });
};

const submitBgSave = () => {
  const data: any = {
    hasBackground: hasBg.value === true ? 1 : 0,
    backgroundUrl: imageUrl.value
  };

  saveBackgroudApi(data).then((res: any) => {
    if (res.code === 0) {
      ElMessage.success("保存成功");
    } else {
      ElMessage.error("保存失败，请重新尝试");
    }
  });
};

const submitMode = () => {
  setDownloadModeApi(hasIncremental.value ? 1 : 0).then((res: any) => {
    if (res.code === 0) {
      ElMessage.success("保存成功");
    } else {
      ElMessage.error("保存失败，请重新尝试");
    }
  });
};

onMounted(() => {
  getBackgroundApi().then((res: any) => {
    console.log(res);
    if (res.data !== null) {
      imageUrl.value = res.data.backgroundUrl;
      hasBg.value = res.data.hasBackground === 1;
    }
  });
  getDownloadModeApi().then((res: any) => {
    hasIncremental.value = res.data === 1;
  });
});
</script>

<style scoped>
.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
<style>
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>
