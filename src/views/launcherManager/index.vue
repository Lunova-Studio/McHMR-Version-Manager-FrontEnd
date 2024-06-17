<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="24" :xs="24">
        <el-card>
          <template v-shot:header>
            <div class="clearfix">
              <span>启动器帮助</span>
            </div>
          </template>
          <p>此处使用折叠面板</p>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
defineOptions({
  name: "LauncherManager"
});
</script>

<style></style>
