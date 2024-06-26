<script setup lang="ts">
defineOptions({
  name: "Welcome"
});
import { ref, onBeforeMount } from "vue";
import { getApiUrlApi, generateApiUrlApi } from "@/api/mchmr/welcome/index";
import { message } from "@/utils/message";

const apiUrl = ref(null);

const generateApiUrl = () => {
  generateApiUrlApi().then(res => {
    if (res.code === 200) {
      message("操作成功", {
        type: "success"
      });
    }
  });
};

onBeforeMount(() => {
  getApiUrlApi().then(res => {
    if (res.code === 200) {
      apiUrl.value = res.data.apiUrl;
    }
  });
});

const copyApiUrl = () => {};
</script>

<template>
  <div style="display: flex; flex-direction: row">
    <el-input
      placeholder="请生成 Open API 地址"
      v-model="apiUrl"
      :disabled="true"
      style="width: 500px; margin-right: 15px"
    />
    <el-button @click="generateApiUrl">生成</el-button>
    <el-button :disabled="apiUrl !== null ? false : true" @click="copyApiUrl"
      >复制</el-button
    >
  </div>
</template>

<style scoped lang="scss">
.home_top {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 20px;
}

.top_card {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 300px;
}
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
