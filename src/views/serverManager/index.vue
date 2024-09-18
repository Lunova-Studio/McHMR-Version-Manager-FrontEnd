<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="24" :xs="24">
        <el-card>
          <template v-slot:header>
            <div class="clearfix">
              <span>服务器信息</span>
            </div>
          </template>
          <el-form ref="serverConfigRef" :model="server" :rules="rules">
            <el-form-item label="服务器名称" prop="serverName" width="100px">
              <el-input
                v-model="server.serverName"
                placeholder="请输入服务器名称"
                type="text"
              />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submit">保存</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="24" :xs="24">
        <el-card>
          <template v-slot:header>
            <div class="clearfix">
              <span>服务端设置</span>
            </div>
          </template>
          <el-form ref="serverConfigRef" :model="serverIp" :rules="rules">
            <el-form-item label="服务器地址" prop="serverIp" width="100px">
              <el-input
                v-model="serverIp"
                placeholder="请输入服务器地址"
                type="text"
              />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submiServerIp">保存</el-button>
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
              <span>更新白名单</span>
            </div>
          </template>
          <el-form ref="clientWhiteList" :model="whitelist">
            <el-form-item label="白名单列表" prop="serverName" width="100px">
              <el-input
                v-model="whitelist.path"
                placeholder="请输入白名单列表"
                type="textarea"
                :autosize="{ minRows: 3, maxRows: 6 }"
              />
            </el-form-item>
            <el-form-item>
              <p>
                通常客户端配置目录、Mod配置文件目录、资源包目录、光影包目录、日志目录等都需要被排除，一行一条，支持输入路径或者文件，请以游戏客户端根目录<code>/</code>开始
              </p>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submitWhitelist"
                >保存</el-button
              >
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
<script setup lang="ts">
import { ref, reactive, onBeforeMount } from "vue";
import {
  ServerManager,
  Whitelist,
  getServerManagerApi,
  updateServerManagerApi,
  getWhitelistApi,
  updateWhitelistApi,
  getServerIpApi,
  updateServerIpApi
} from "@/api/mchmr/serverManager";
import { message } from "@/utils/message";

const serverConfigRef = ref();
const clientWhiteList = ref();

const rules = ref({
  serverName: [
    { required: true, message: "服务器名称不能为空", trigger: "blur" }
  ]
});

const server = reactive<ServerManager>({
  id: 1,
  serverName: undefined
});
const whitelist = reactive<Whitelist>({
  path: undefined
});
const serverIp = ref(undefined);

defineOptions({
  name: "ServerManager"
});

// 获取服务器名称
onBeforeMount(() => {
  getServerManagerApi().then((res: any) => {
    server.serverName = res.data.serverName;
  });
  getWhitelistApi().then((res: any) => {
    whitelist.path = res.data.path;
  });
  getServerIpApi().then((res: any) => {
    serverIp.value = res.data;
  });
});

function submit() {
  serverConfigRef.value.validate(valid => {
    if (valid) {
      updateServerManagerApi(server).then(() => {
        message("设置成功", {
          type: "success"
        });
      });
    }
  });
}

function submitWhitelist() {
  serverConfigRef.value.validate(valid => {
    if (valid) {
      updateWhitelistApi(whitelist).then(() => {
        message("设置成功", {
          type: "success"
        });
      });
    }
  });
}

function submiServerIp() {
  serverConfigRef.value.validate(valid => {
    if (valid) {
      updateServerIpApi(serverIp.value).then(() => {
        message("设置成功", {
          type: "success"
        });
      });
    }
  });
}
</script>
