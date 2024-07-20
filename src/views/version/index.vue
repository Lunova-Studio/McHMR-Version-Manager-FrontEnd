<template>
  <div>
    <!-- 创建版本操作 -->
    <el-dialog
      v-model="createNewVersionDialog"
      title="正在生成版本差异对比文件"
      width="500"
      align-center
      :show-close="false"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
    >
      <el-progress
        :percentage="50"
        :indeterminate="true"
        :text-inside="true"
        :show-text="false"
      />
    </el-dialog>
    <el-container>
      <el-row
        style="
          background-color: white;
          border: 1px solid #ffffff31;
          border-radius: 3px;
        "
      >
        <!-- 搜索表单 -->
        <el-form
          :inline="true"
          :model="searchform"
          class="search-form bg-bg_color w-[99/100] pl-8 pt-[12px]"
        >
          <el-form-item label="版本号" style="margin-bottom: 0px">
            <el-input
              v-model="searchform.keyWord"
              placeholder="请输入版本号"
              clearable
            />
          </el-form-item>
          <el-form-item style="margin-bottom: 0px">
            <el-form-item>
              <el-button type="primary" @click="onSubmit">搜索</el-button>
              <el-button @click="onReset">重置</el-button>
            </el-form-item>
          </el-form-item>
        </el-form>
      </el-row>
      <el-header style="height: 0" />
      <el-main
        class="bg-bg_color w-[99/100] pl-8 pt-[12px]"
        style="margin-top: 12px"
      >
        <el-row
          class="mb-4"
          style="
            display: flex;
            flex-direction: row;
            justify-content: space-between;
          "
        >
          <el-col :span="6"><h3>版本列表</h3></el-col>
          <el-col
            :span="6"
            style="
              display: flex;
              flex-direction: row;
              margin-right: 20px;
              justify-content: end;
            "
          >
            <el-button
              type="primary"
              :icon="Plus"
              @click="addVersionVisible = true"
              >新增版本</el-button
            >
            <el-button v-show="false" type="danger" :icon="Delete"
              >删除版本</el-button
            >
            <el-button v-show="false" type="warning" :icon="Edit"
              >修改版本</el-button
            >
          </el-col>
        </el-row>
        <div
          style="
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            height: 670px;
          "
        >
          <el-table
            :data="tableData"
            ref="table"
            style="width: 100%"
            @selection-change="handleSelectionChange"
          >
            <el-table-column type="selection" width="55" />
            <el-table-column label="ID" width="100">
              <template v-slot="scope">
                {{ getPageObjectCount(scope.$index) }}
              </template>
            </el-table-column>
            <el-table-column prop="version" label="版本号" width="180" />
            <el-table-column prop="versionDescription" label="版本介绍" />
            <el-table-column prop="createTime" label="创建日期" width="180">
              <template v-slot="scope">{{ formatDate(scope.row) }}</template>
            </el-table-column>
            <el-table-column prop="activeStatus" label="活动状态" width="180">
              <template v-slot="scope">
                {{ scope.row.activeStatus === true ? "当前版本" : "历史版本" }}
              </template>
            </el-table-column>
          </el-table>
          <div>
            <el-divider />
            <!-- 分页 -->
            <el-row class="mb-4" justify="end">
              <el-pagination
                background
                layout="prev, pager, next"
                :total="total"
                @current-change="handleCurrentChange"
              />
            </el-row>
          </div>
        </div>
        <!-- 表格 -->
      </el-main>
    </el-container>

    <!-- 新增版本对话框 -->
    <el-dialog
      v-model="addVersionVisible"
      title="新增版本"
      width="500"
      :before-close="addVersionHandleClose"
    >
      <el-form
        :model="addForm"
        label-width="120px"
        :rules="addRules"
        ref="addFormRef"
      >
        <el-form-item label="版本号" prop="version">
          <el-input v-model="addForm.version" placeholder="请输入版本号" />
        </el-form-item>
        <el-form-item label="版本介绍" prop="description">
          <el-input
            v-model="addForm.description"
            placeholder="请输入版本介绍"
            type="textarea"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="addVersionVisible = false">取消</el-button>
          <el-button type="primary" @click="addVersionSubmit">新增</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 修改版本对话框 -->
    <el-dialog
      v-model="changeVersionVisible"
      title="修改版本"
      width="500"
      :before-close="changeVersionHandleClose"
    >
      <el-form :model="changeForm" label-width="120px">
        <el-form-item label="版本号" prop="version">
          <el-input
            v-model="changeForm.version"
            placeholder="请输入版本号"
            disabled
          />
        </el-form-item>
        <el-form-item label="版本介绍" prop="desc">
          <el-input
            v-model="changeForm.description"
            placeholder="请输入版本介绍"
            type="textarea"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="changeVersionVisible = false">取消</el-button>
          <el-button type="primary" @click="changeVersionSubmit"
            >修改</el-button
          >
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onBeforeMount } from "vue";
import { ElTable } from "element-plus";
import {
  getVersionListApi,
  createVersionApi,
  updateVersionApi,
  VersionEntity,
  VersionQuery,
  VersionCreate,
  VersionChange
} from "@/api/mchmr/version/index";
import { message } from "@/utils/message";
import { Plus, Delete, Edit } from "@element-plus/icons-vue";
import { ElForm } from "element-plus";

defineOptions({
  name: "Version"
});

const createNewVersionDialog = ref(false);

const searchform = reactive<VersionQuery>({
  pageNum: 1,
  keyWord: null
});

const table = ref<InstanceType<typeof ElTable>>();
const tableSelection = ref<VersionEntity[]>([]);
const tableData = ref(null);

const changeVersionVisible = ref(false);
const changeVersionHandleClose = () => {
  changeVersionVisible.value = false;
};

const changeForm = reactive<VersionChange>({
  version: null,
  description: null
});

const changeVersionSubmit = () => {
  changeVersionVisible.value = false;
  updateVersionApi(changeForm)
    .then((res: any) => {
      if (res.code === 0) {
        onReset();
        message("修改成功", {
          type: "success"
        });
      }
    })
    .catch(() => {
      changeVersionVisible.value = false;
      message("版本不能低于或等于活动版本", {
        type: "warning"
      });
    });
};

const addForm = reactive<VersionCreate>({
  version: null,
  description: null
});
const addVersionVisible = ref(false);

const addRules = {
  version: [
    { required: true, message: "请输入版本号", trigger: "blur" },
    {
      pattern: /^(\d+)\.(\d+)\.(\d+)$/,
      message: "版本号格式错误，如1.0.0",
      trigger: "blur"
    }
  ],
  description: [
    { required: true, message: "请输入版本描述", trigger: "blur" },
    { min: 1, max: 100, message: "长度在 1 到 100 个字符", trigger: "blur" }
  ]
};

const addFormRef = ref<InstanceType<typeof ElForm>>();

const addVersionSubmit = () => {
  addFormRef.value?.validate(valid => {
    if (valid) {
      createNewVersionDialog.value = true;
      createVersionApi(addForm)
        .then((res: any) => {
          console.log(res);
          addVersionVisible.value = false;
          createNewVersionDialog.value = false;
          if (res.code === 0) {
            onReset();
            message("添加成功", {
              type: "success"
            });
          }
        })
        .catch(() => {
          addVersionVisible.value = false;
          createNewVersionDialog.value = false;
          message("版本不能 ≤ 活动版本", {
            type: "warning"
          });
        });
    } else {
      message("请填写完整信息", {
        type: "warning"
      });
    }
  });
};

// 分页数据
const total = ref(0);

const addVersionHandleClose = () => {
  addVersionVisible.value = false;
};

const onSubmit = () => {
  searchform.pageNum = 1;
  getVersionListApi(searchform).then(res => {
    tableData.value = res.data.rows;
    total.value = res.data.total;
  });
};

const onReset = () => {
  searchform.keyWord = null;
  getVersionListApi(searchform).then(res => {
    tableData.value = res.data.rows;
    total.value = res.data.total;
  });
};

const formatDate = (row: VersionEntity) => {
  // 格式化日期为日月年
  const date = new Date(row.createTime);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const getPageObjectCount = index => {
  const itemsPerPage = 20; // 每页显示的数据数量
  const currentPage = searchform.pageNum; // 当前页码

  // 计算当前页的起始索引
  const startIndex = (currentPage - 1) * itemsPerPage;

  // 计算当前条目的ID
  const id = startIndex + index + 1;

  // 如果当前页的起始索引加上索引大于总数量，返回空字符串
  if (startIndex + index >= total.value) {
    return "";
  }

  return id;
};

const handleSelectionChange = (val: VersionEntity[]) => {
  tableSelection.value = val;
};

const handleCurrentChange = (val: number) => {
  searchform.pageNum = val;
  getVersionListApi(searchform).then(res => {
    tableData.value = res.data.rows;
    total.value = res.data.total;
  });
};

onBeforeMount(() => {
  getVersionListApi(searchform).then(res => {
    tableData.value = res.data.rows;
    total.value = res.data.total;
  });
});
</script>
<style scoped>
.example-pagination-block + .example-pagination-block {
  margin-top: 10px;
}

.example-pagination-block .example-demonstration {
  margin-bottom: 16px;
}

.search-form {
  margin-bottom: 12px;
}
</style>
