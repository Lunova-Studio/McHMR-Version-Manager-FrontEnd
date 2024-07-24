<script setup lang="ts">
import { ref, onBeforeMount } from "vue";
import { getApiUrlApi, generateApiUrlApi } from "@/api/mchmr/welcome/index";
import { message } from "@/utils/message";

defineOptions({
  name: "Welcome"
});

const apiUrl = ref("");

const getApiUrl = () => {
  getApiUrlApi().then(res => {
    if (res.code === 0) {
      apiUrl.value = res.data.apiUrl;
    }
  });
};

const generateApiUrl = () => {
  let url = apiUrl.value;
  if (url === null || url === "") {
    const domain = window.location.host;
    if (
      !(
        domain.indexOf("localhost") != -1 ||
        domain.indexOf("127") != -1 ||
        domain.indexOf("192.168") != -1
      )
    ) {
      url = domain;
    } else {
      message(
        "您当前访问的IP为内网IP，请在输入框中输入您的公网IP或使用公网IP访问以生成API地址",
        {
          type: "error"
        }
      );
      return;
    }
  }
  generateApiUrlApi(url).then(res => {
    if (res.code === 0) {
      message("操作成功,API地址已自动复制至剪切板", {
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
  navigator.clipboard.writeText(apiUrl.value);
};
</script>

<template>
  <div style="display: flex; flex-direction: row">
    <el-input
      placeholder="请输入您的公网IP地址"
      v-model="apiUrl"
      style="width: 500px; margin-right: 15px"
    />
    <el-button @click="generateApiUrl">生成</el-button>
    <el-button :disabled="apiUrl !== null ? false : true" @click="copyApiUrl"
      >复制</el-button
    >
  </div>
</template>
