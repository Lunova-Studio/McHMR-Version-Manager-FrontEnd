<script setup lang="ts">
import { ref, onBeforeMount } from "vue";
import { getApiUrlApi, generateApiUrlApi } from "@/api/mchmr/welcome/index";
import { message } from "@/utils/message";
import { is } from "@pureadmin/utils";

defineOptions({
  name: "Welcome"
});

const apiUrl = ref(null);
const isEdit = ref(false);

const getApiUrl = () => {
  getApiUrlApi().then(res => {
    if (res.code === 0) {
      apiUrl.value = res.data.apiUrl;
      isEdit.value = res.data.apiUrl !== null ? false : true;
    }
  });
};

const generateApiUrl = () => {
  let url = apiUrl.value;
  if (url === null || url === "") {
    // const domain = window.location.host;
    // if (
    //   !(
    //     domain.indexOf("localhost") != -1 ||
    //     domain.indexOf("127") != -1 ||
    //     domain.indexOf("192.168") != -1
    //   )
    // ) {
    //   url = domain;
    // } else {
    //   message(
    //     "您当前访问的IP为内网IP，请在输入框中输入您的公网IP或使用公网IP访问以生成API地址",
    //     {
    //       type: "error"
    //     }
    //   );
    //   return;
    // }
    message("请输入您的后端地址以生成API地址", {
      type: "error"
    });
    return;
  }
  generateApiUrlApi(apiUrl.value).then(res => {
    if (res.code === 0) {
      message("操作成功,API地址已自动复制至剪切板", {
        type: "success"
      });
      getApiUrl();
      copyApiUrl();
    }
  });
};

const reset = () => {
  apiUrl.value = null;
  isEdit.value = true;
};

onBeforeMount(() => {
  getApiUrl();
});

const copyApiUrl = () => {
  navigator.clipboard.writeText(apiUrl.value);
};
</script>

<template>
  <div style="display: flex; flex-direction: row; padding: 20px 20px 0px 20px">
    <el-input
      placeholder="请输入您的后端地址"
      v-model="apiUrl"
      style="width: 500px; margin-right: 15px"
    />
    <el-button @click="generateApiUrl" :disabled="!isEdit">生成</el-button>
    <el-button :disabled="isEdit" @click="copyApiUrl">复制</el-button>
    <el-button @click="reset" :disabled="isEdit">重置</el-button>
  </div>
  <p class="prompt">在输入后端地址时请携带http://或https://</p>
  <p class="prompt">
    您生成API后无法再次生成，如需重新生成，请点击重置按钮后重新输入
  </p>
  <p class="prompt">
    由于浏览器限制，自动复制及复制按钮可能失效，如遇失效请您手动复制API
  </p>
</template>

<style scoped>
.prompt {
  padding: 0px 20px 0px 20px;
  font-size: 13px;
  color: #a9a9a9;
}
</style>
