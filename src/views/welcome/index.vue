<script setup lang="ts">
import { ref, onBeforeMount } from "vue";
import { getApiUrlApi, generateApiUrlApi } from "@/api/mchmr/welcome/index";
import { message } from "@/utils/message";

defineOptions({
  name: "Welcome"
});

const apiUrl = ref(null);

const getApiUrl = () => {
  getApiUrlApi().then(res => {
    if (res.code === 0) {
      apiUrl.value = res.data.apiUrl;
    }
  });
};

const generateApiUrl = () => {
  generateApiUrlApi(window.webConfig.webApiBaseUrl).then(res => {
    if (res.code === 0) {
      message("操作成功", {
        type: "success"
      });
      getApiUrl();
      copyApiUrl();
    }
  });
};

onBeforeMount(() => {
  getApiUrl();
});

const copyApiUrl = () => {
  try {
    navigator.clipboard.writeText(apiUrl.value);
  } catch {
    message("复制失败，请手动复制", {
      type: "error"
    });
  }
};
</script>

<template>
  <div style="display: flex; flex-direction: row">
    <el-input
      placeholder="点击生成按钮生成API地址"
      v-model="apiUrl"
      style="width: 500px; margin-right: 15px"
    />
    <el-button @click="generateApiUrl">生成</el-button>
    <el-button @click="copyApiUrl">复制</el-button>
  </div>
</template>
