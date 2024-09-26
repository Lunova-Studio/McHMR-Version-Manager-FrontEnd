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
            <el-form-item label="是否启用启动器背景" prop="hasBackground">
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
                :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload"
                :multiple="false"
                :http-request="submitBg"
              >
                <img v-if="imageUrl" :src="imageUrl" class="avatar" />
                <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
              </el-upload>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submitBg">提交</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { ElMessage } from "element-plus";
import { Plus } from "@element-plus/icons-vue";
import { uploadBackgroundApi } from "@/api/mchmr/launcherManager";

import type { UploadProps, UploadRequestOptions } from "element-plus";

defineOptions({
  name: "LauncherManager"
});

const launcherBackground = {
  hasBg: null,
  background: null
};

const hasBg = ref(true);

const imageUrl = ref("");

const handleAvatarSuccess: UploadProps["onSuccess"] = (
  response,
  uploadFile
) => {
  console.log(response);
  console.log(uploadFile);

  imageUrl.value = URL.createObjectURL(response.data.data);
};

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
  await uploadBackgroundApi(option.file).then(res => {
    console.log(res);
  });
};
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
