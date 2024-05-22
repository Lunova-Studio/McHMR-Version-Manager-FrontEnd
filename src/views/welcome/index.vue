<script setup lang="ts">
defineOptions({
  name: "Welcome"
});
import {
  ArrowRight,
  CaretBottom,
  CaretTop,
  Warning
} from "@element-plus/icons-vue";
</script>

<template>
  <div>
    <div class="home_top">
      <div class="top_card">
        <el-row :gutter="16">
          <el-col :span="8">
            <div class="statistic-card">
              <el-statistic :value="98500">
                <template #title>
                  <div style="display: inline-flex; align-items: center">
                    版本数量
                    <el-tooltip
                      effect="dark"
                      content="这是你所有已发布版本的总数"
                      placement="top"
                    >
                      <el-icon style="margin-left: 4px" :size="12">
                        <Warning />
                      </el-icon>
                    </el-tooltip>
                  </div>
                </template>
              </el-statistic>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="statistic-card">
              <el-statistic :value="693700">
                <template #title>
                  <div style="display: inline-flex; align-items: center">
                    玩家数量
                    <el-tooltip
                      effect="dark"
                      content="这是你的服务器所有玩家的数量（根据客户端数量统计）"
                      placement="top"
                    >
                      <el-icon style="margin-left: 4px" :size="12">
                        <Warning />
                      </el-icon>
                    </el-tooltip>
                  </div>
                </template>
              </el-statistic>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="statistic-card">
              <el-statistic :value="72000" title="每日玩家下载量">
                <template #title>
                  <div style="display: inline-flex; align-items: center">
                    每日玩家下载量
                    <el-tooltip
                      effect="dark"
                      content="实时统计每天服务器的下载量"
                      placement="top"
                    >
                      <el-icon style="margin-left: 4px" :size="12">
                        <Warning />
                      </el-icon>
                    </el-tooltip>
                  </div>
                </template>
              </el-statistic>
              <div class="statistic-footer">
                <div class="footer-item">
                  <span>较昨日</span>
                  <span class="green">
                    16%
                    <el-icon>
                      <CaretTop />
                    </el-icon>
                  </span>
                </div>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
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
