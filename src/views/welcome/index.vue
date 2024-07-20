<script setup lang="ts">
defineOptions({
  name: "Welcome"
});
import { ref, onBeforeMount } from "vue";
import {
  getApiUrlApi,
  generateApiUrlApi,
  stateSwitchApi,
  gteStateSwitchApi
} from "@/api/mchmr/welcome/index";
import { message } from "@/utils/message";

const apiUrl = ref("");
const isMaintain = ref(false);

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

// const stateSwitch = () => {
//   stateSwitchApi(isMaintain.value).then(res => {
//     if (res.code === 0) {
//       message("操作成功", {
//         type: "success"
//       });
//     }
//   });
// };

// const getStateSwitch = () => {
//   gteStateSwitchApi().then(ref => {
//     if (ref.code === 0) {
//       isMaintain.value = ref.data.StateSwitch;
//     }
//   });
// };

onBeforeMount(() => {
  getApiUrl();
  // getStateSwitch();
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
  <!-- <div>
    <el-switch
      v-model="isMaintain"
      active-text="维护中"
      inactive-text="未维护"
      @change="stateSwitch"
    />
  </div> -->
</template>

<style>
.demonstration {
  color: var(--el-text-color-secondary);
}

.el-carousel__item h3 {
  margin: 0;
  line-height: 150px;
  color: #475669;
  text-align: center;
  opacity: 0.75;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}

:global(h2#card-usage ~ .example .example-showcase) {
  background-color: var(--el-fill-color) !important;
}

.el-statistic {
  --el-statistic-content-font-size: 28px;
}

.statistic-card {
  height: 100%;
  padding: 20px;
  background-color: var(--el-bg-color-overlay);
  border-radius: 4px;
}

.statistic-footer {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  margin-top: 16px;
  font-size: 12px;
  color: var(--el-text-color-regular);
}

.statistic-footer .footer-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.statistic-footer .footer-item span:last-child {
  display: inline-flex;
  align-items: center;
  margin-left: 4px;
}

.green {
  color: var(--el-color-success);
}

.red {
  color: var(--el-color-error);
}

.home_top {
  display: flex;
  flex-direction: row;
}

.top_card {
  width: 70%;
}

.top_ad {
  width: 30%;
}
</style>
