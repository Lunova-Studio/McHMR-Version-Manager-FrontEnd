<template>
  <div>
    <!-- 删除确认弹窗 -->
    <el-dialog v-model="deleteDialog" title="危险操作" width="500" align-center>
      <span>该操作不可逆，你确定要删除选中的这些文件吗? </span>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="deleteDialog = false">取消</el-button>
          <el-button type="danger" @click="submitDelete"> 确认删除 </el-button>
        </div>
      </template>
    </el-dialog>
    <!-- 上传文件弹窗 -->
    <el-dialog v-model="uploadDialog" title="上传文件" width="500" align-center>
      <div>
        <el-upload
          class="upload-demo"
          ref="uploadRef"
          drag
          multiple
          :http-request="checkedFile"
          :before-remove="removeFile"
          :auto-upload="false"
          action="/game/upload"
          :limit="1"
        >
          <el-icon class="el-icon--upload"><UploadFilled /></el-icon>
          <div class="el-upload__text">
            将文件拖到此处或者<em>点击这里</em>上传
          </div>
          <template #tip>
            <div class="el-upload__tip">
              注意：支持所有常用文件格式，每个文件大小不超过2GB，不支持文件夹上传，暂不支持多文件上传，默认上传到当前进入的目录，建议多文件打包成zip压缩包，使用McHMR游戏管理中自带的zip解压功能解压
            </div>
          </template>
        </el-upload>
        <el-progress
          :stroke-width="15"
          striped
          striped-flow
          :duration="10"
          :percentage="progress"
          class="progress"
          v-if="showProgress"
        />
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="uploadDialog = false">关闭</el-button>
          <el-button @click="submitUpload" type="primary">点击上传</el-button>
        </div>
      </template>
    </el-dialog>
    <!-- 远程下载弹窗 -->
    <el-dialog
      v-model="downloadDialog"
      title="远程下载（该功能暂未上线）"
      width="500"
      align-center
    >
      <div>
        <el-input
          type="text"
          v-model="downloadUrl"
          placeholder="远程下载地址"
        />

        <el-text class="mx-1" type="warning"
          >远程下载受到部署服务器地区影响，下载速度可能有所差异</el-text
        >
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="downloadDialog = false">取消</el-button>
          <el-button type="primary" @click="submitDownload"> 下载 </el-button>
        </div>
      </template>
    </el-dialog>
    <!-- 解压操作弹窗 -->
    <el-dialog
      v-model="unzipDialog"
      title="解压中"
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
    <!-- 文件管理面包屑导航及上一级和刷新按钮 -->
    <div class="fileBread">
      <div style="display: flex; flex-direction: row">
        <el-tooltip
          class="box-item"
          effect="dark"
          content="上一级"
          placement="bottom"
        >
          <button position="left" :disabled="isRootPath" @click="goBack">
            <el-icon><Back /></el-icon>
          </button>
        </el-tooltip>

        <el-breadcrumb
          :separator-icon="ArrowRight"
          class="filePath"
          id="scrollContent"
        >
          <el-breadcrumb-item v-for="path in paths" :key="path">{{
            path
          }}</el-breadcrumb-item>
        </el-breadcrumb>
        <el-tooltip
          class="box-item"
          effect="dark"
          content="刷新列表"
          placement="bottom"
        >
          <button position="right" @click="refreshList">
            <el-icon><RefreshRight /></el-icon>
          </button>
        </el-tooltip>
        <el-button style="margin-left: 10px" @click="copyPath"
          >复制路径</el-button
        >
      </div>
      <div>
        <el-input
          v-model="searchQuery.keyWord"
          style="width: 400px"
          placeholder="输入搜索当前目录的文件夹 / 文件"
          class="input-with-select"
        >
          <template #append>
            <el-button :icon="Search" @click="onSearch" />
          </template>
        </el-input>
        <el-button @click="reSearch" style="margin-left: 10px">重置</el-button>
      </div>
    </div>
    <el-divider style="margin: 12px 0" />
    <div class="fileOperate">
      <div class="fileOperateLeft">
        <el-button @click="uploadDialog = true">上传文件</el-button>
        <el-button @click="downloadFile">远程下载</el-button>
        <el-button @click="createFolder">新建目录</el-button>
        <el-divider direction="vertical" />
        <el-button :icon="HomeFilled" @click="goRootPath">根目录</el-button>
        <div v-if="isBatchSelected">
          <el-divider direction="vertical" />
          <el-button type="danger" @click="confirmBatchDelete"
            >批量删除</el-button
          >
          <el-button type="success" @click="confirmBatchMove"
            >批量移动</el-button
          >
        </div>
        <div>
          <el-divider direction="vertical" />
          <el-button type="primary" v-if="moveStatus" @click="submitMove"
            >移动到此处</el-button
          >
        </div>
      </div>
      <div class="fileOperateRight">
        <p style="display: flex; flex-direction: row; align-items: center">
          <el-icon size="16px"><InfoFilled /></el-icon>
          &nbsp;注意：一切操作不可逆，请谨慎操作
        </p>
      </div>
    </div>
    <div class="fileList">
      <el-table
        :data="tableData"
        style="width: 100%"
        height="700"
        @selection-change="handleSelectionChange"
        @cell-mouse-enter="handleMouseEnter"
        @cell-mouse-leave="handleMouseLeave"
        @cell-dblclick="handleDoubleClick"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column fixed prop="fileName" label="文件名" width="380">
          <template v-slot="scope">
            <div
              style="display: flex; flex-direction: row; align-items: center"
            >
              <img
                v-if="scope.row.fileType === 'folder'"
                src="../../assets/svg/folder.svg"
                alt="文件夹"
                style="width: 32px; height: 32px; transform: translateY(-3px)"
              />
              <img
                v-else-if="scope.row.fileType === 'document'"
                src="../../assets/svg/document.svg"
                alt="文本文件"
                style="width: 32px; height: 32px"
              />
              <img
                v-else-if="scope.row.fileType === 'image'"
                src="../../assets/svg/image.svg"
                alt="图片文件"
                style="width: 32px; height: 32px"
              />
              <img
                v-else-if="scope.row.fileType === 'zip'"
                src="../../assets/svg/zip.svg"
                alt="zip文件"
                style="width: 32px; height: 32px"
              />
              <img
                v-else-if="scope.row.fileType === 'jar'"
                src="../../assets/svg/jar.svg"
                alt="jar文件"
                style="width: 32px; height: 32px"
              />
              <img
                v-else-if="scope.row.fileType === 'exe'"
                src="../../assets/svg/exe.svg"
                alt="Windows可执行文件"
                style="width: 32px; height: 32px"
              />
              <img
                v-else
                src="../../assets/svg/unknown.svg"
                alt="未知文件"
                style="width: 32px; height: 32px"
              />
              <span
                v-if="!scope.row.isRename"
                class="text-ellipsis"
                :title="scope.row.fileName"
                >&nbsp;{{ scope.row.fileName }}</span
              >
              <span v-else style="display: flex; flex-direction: row">
                <el-input v-model="oldName" type="text" />
                <el-button
                  type="success"
                  :icon="Select"
                  text
                  width="32px"
                  @click="submitRename(scope.row)"
                />
                <el-button
                  type="danger"
                  :icon="CloseBold"
                  text
                  width="32px"
                  @click="closeRename(scope.row)"
                />
              </span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="permission" label="权限" width="100" />
        <el-table-column prop="modifyDate" label="修改日期" width="200" />
        <el-table-column prop="fileType" label="类型" width="180">
          <template v-slot="scope">
            <span v-if="scope.row.fileType === 'folder'">文件夹</span>
            <span v-else-if="scope.row.fileType === 'document'">文本文件</span>
            <span v-else-if="scope.row.fileType === 'image'">图片文件</span>
            <span v-else-if="scope.row.fileType === 'zip'">zip文件</span>
            <span v-else-if="scope.row.fileType === 'jar'">jar文件</span>
            <span v-else-if="scope.row.fileType === 'exe'"
              >Windows可执行文件</span
            >
            <span v-else-if="scope.row.fileType === 'unknown'">未知文件</span>
          </template>
        </el-table-column>
        <el-table-column prop="fileSize" label="大小" width="220">
          <template v-slot="scope">
            <span>{{ formatFileSize(scope.row.fileSize) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="right">
          <template v-slot="scope">
            <div class="enterElement" v-if="scope.row.showBtn">
              <el-button type="danger" link @click="confirmDelete(scope.row)"
                >删除</el-button
              >
              <el-button
                type="warning"
                link
                @click="unzip(scope.row)"
                v-if="scope.row.fileType === 'zip'"
                >解压</el-button
              >
              <el-button link @click="rename(scope.row)">重命名</el-button>
              <el-button link @click="move(scope.row)">移动</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <el-row style="display: flex; justify-content: end; margin-top: 10px">
        <p>共 {{ total }} 项，{{ folderNum }} 个文件夹，{{ fileNum }} 个文件</p>
      </el-row>
    </div>
  </div>
</template>
<script lang="ts" setup>
import {
  ArrowRight,
  Back,
  RefreshRight,
  InfoFilled,
  HomeFilled,
  Search,
  Select,
  CloseBold,
  UploadFilled
} from "@element-plus/icons-vue";
import type { UploadInstance, UploadRequestOptions } from "element-plus";
import { ref, onMounted, onBeforeMount, reactive } from "vue";
import {
  GameFileListQuery,
  FileMoveRequest,
  FolderCreateRequest,
  FileRenameRequest,
  getGameFileListApi,
  deleteFileApi,
  renameFileApi,
  createFolderApi,
  moveFileApi,
  uploadApi,
  isUploadApi,
  unZipApi
} from "@/api/mchmr/gameManager";
import { message } from "@/utils/message";

const tableData = ref(null);
const total = ref(0);
const folderNum = ref(0);
const fileNum = ref(0);
const paths = ref(null);
const isRootPath = ref(true);
const isBatchSelected = ref(false);
const oldName = ref(null);
const isWin = ref(false);
const deleteDialog = ref(false);
const deleteFilesCache = ref([]);
const moveFilesChache = ref([]);
const moveStatus = ref(false);
const downloadDialog = ref(false);
const downloadUrl = ref(null);
const isCreateFolder = ref(false);
const uploadDialog = ref(false);
const unzipDialog = ref(false);

// 文件上传

const uploadRef = ref<UploadInstance>();
const progress = ref(0);
const showProgress = ref(false);

const submitUpload = () => {
  uploadRef.value!.submit();
};

defineOptions({
  name: "GameFileManager"
});

const checkedFile = async (option: UploadRequestOptions) => {
  if (option.file.size > 2 * 1024 * 1024 * 1024) {
    return message("文件大小不能超过2GB", {
      type: "error"
    });
  }

  const uploadFunc =
    option.file.size < 10 * 1024 * 1024 ? uploadSmallFile : uploadBigFile;

  try {
    await uploadFunc(option.file, option.onProgress);
  } catch (error) {
    message(error, {
      type: "error"
    });
    showProgress.value = false;
    progress.value = 0;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars, prettier/prettier
  const prom = new Promise((resolve, reject) => {});
  (prom as any).abort = () => {};
  return prom;
};

const uploadSmallFile = async (file: any, onProgress: any) => {
  // 获取上传授权
  const uploadAuth = ref("");
  try {
    const res: any = await isUploadApi({
      fileName: file.name,
      path: buildPath()
    });
    if (res.code === 0) {
      uploadAuth.value = res.data.result;
      if (uploadAuth.value === "false") {
        message("文件已存在禁止重复上传", {
          type: "error"
        });
        return;
      }
    } else {
      message("未知错误", {
        type: "error"
      });
      return;
    }
  } catch (error) {
    message("请求上传授权时出错", {
      type: "error"
    });
    return;
  }

  showProgress.value = true;
  progress.value = 0;
  const formData = new FormData();
  formData.append("file", file);
  formData.append("filename", file.name);
  formData.append("totalChunks", "1");
  formData.append("targetPath", buildPath());
  formData.append("identifier", uploadAuth.value);
  await uploadApi(formData, onProgress).then((res: any) => {
    if (res.code === 0) {
      message("上传成功", {
        type: "success"
      });
      refreshList();
      showProgress.value = false;
      progress.value = 0;
      uploadAuth.value = "";
      uploadRef.value!.clearFiles();
    } else {
      message("上传失败", {
        type: "error"
      });
    }
  });
};

const uploadBigFile = async (file: any, onProgress: any) => {
  // 获取上传授权
  const uploadAuth = ref("");
  try {
    const res: any = await isUploadApi({
      fileName: file.name,
      path: buildPath()
    });
    if (res.code === 0) {
      uploadAuth.value = res.data.result;
      if (uploadAuth.value === "false") {
        message("文件已存在禁止重复上传", {
          type: "error"
        });
        return;
      }
    } else {
      message("未知错误", {
        type: "error"
      });
      return;
    }
  } catch (error) {
    message("请求上传授权时出错", {
      type: "error"
    });
    return;
  }

  showProgress.value = true;
  progress.value = 0;
  const chunks = createChunks(file, 10 * 1024 * 1024);
  for (let i = 0; i < chunks.length; i++) {
    const formData = new FormData();
    formData.append("filename", file.name);
    formData.append("file", chunks[i]);
    formData.append("chunkNumber", (i + 1).toString());
    formData.append("totalChunks", chunks.length.toString());
    formData.append("targetPath", buildPath());
    formData.append("identifier", uploadAuth.value);
    await uploadApi(formData, onProgress).then((res: any) => {
      if (res.code === 0) {
        const progressPercent = ((i + 1) / chunks.length) * 100;
        progress.value = parseFloat(progressPercent.toFixed());
      }
    });
  }
  message("上传成功", {
    type: "success"
  });
  refreshList();
  showProgress.value = false;
  progress.value = 0;
  uploadAuth.value = "";
  uploadRef.value!.clearFiles();
};

const createChunks = (file: any, chunkSize: number) => {
  const result = [];
  for (let i = 0; i < file.size; i += chunkSize) {
    file.slice(i, i + chunkSize);
    result.push(file.slice(i, i + chunkSize));
  }
  return result;
};

const removeFile = () => {
  return true;
};

onMounted(() => {
  const scrollContent = document.getElementById("scrollContent");

  scrollContent.scrollLeft = scrollContent.scrollWidth;

  scrollContent.addEventListener("mousewheel", (event: any) => {
    const detail = event.wheelDelta || event.detail;
    const moveForwardStep = 1;
    const moveBackStep = -1;
    let step = 0;
    if (detail < 0) {
      step = moveForwardStep * 100;
    } else {
      step = moveBackStep * 100;
    }
    scrollContent.scrollLeft += step;
  });
});

const submitDownload = () => {};

const unzip = (row: any) => {
  unzipDialog.value = true;
  unZipApi({ path: buildPath(), targetFile: row.fileName }).then((res: any) => {
    if (res.code === 0) {
      message("解压成功", {
        type: "success"
      });
      refreshList();
      unzipDialog.value = false;
    } else {
      message("解压失败，压缩包可能损坏", {
        type: "error"
      });
      unzipDialog.value = false;
    }
  });
};

const createFolder = () => {
  const item: any = {
    fileName: "New Folder",
    showBtn: false,
    fileType: "folder",
    isRename: true,
    fileSize: 0
  };
  oldName.value = "New Folder";
  isCreateFolder.value = true;
  tableData.value.push(item);
};
const downloadFile = () => {
  downloadDialog.value = true;
};

const handleMouseEnter = (row: any) => {
  row.showBtn = true;
};

const handleMouseLeave = (row: any) => {
  row.showBtn = false;
};

const handleSelectionChange = (val: any) => {
  if (val !== undefined && val.length === 0) {
    isBatchSelected.value = false;
  } else {
    isBatchSelected.value = true;
  }

  val.forEach(element => {
    if (buildPath() === "\\" || buildPath() === "/") {
      deleteFilesCache.value.push(buildPath() + element.fileName);
      moveFilesChache.value.push(buildPath() + element.fileName);
    } else if (buildPath().includes("/")) {
      deleteFilesCache.value.push(
        buildPath() + buildPath().slice(0, 0) + element.fileName
      );
      moveFilesChache.value.push(
        buildPath() + buildPath().slice(0, 0) + element.fileName
      );
    } else if (buildPath().includes("\\")) {
      deleteFilesCache.value.push(
        buildPath() + buildPath().slice(0, 1) + element.fileName
      );
      moveFilesChache.value.push(
        buildPath() + buildPath().slice(0, 1) + element.fileName
      );
    }
  });
};

const confirmBatchMove = () => {
  moveStatus.value = true;
};

const move = (row: any) => {
  moveFilesChache.value = [];
  moveStatus.value = true;
  moveFilesChache.value.push(buildPath() + "/" + row.fileName);
};

const submitMove = () => {
  const data: FileMoveRequest = {
    targetPath: buildPath(),
    fileArray: moveFilesChache.value
  };

  console.log(data);

  moveFileApi(data).then((res: any) => {
    if (res.code === 0) {
      message("移动成功", {
        type: "success"
      });
      refreshList();
    } else {
      message("移动失败", {
        type: "error"
      });
    }
    moveFilesChache.value = [];
    moveStatus.value = false;
  });
};

const buildPath = () => {
  isWindows();
  const path = ref(null);
  if (isWin.value === true) {
    path.value = paths.value.join("\\");
  } else {
    path.value = paths.value.join("/");
  }
  path.value = path.value.slice(1);
  if (path.value === "") {
    if (isWin.value === true) {
      path.value = "\\";
    } else {
      path.value = "/";
    }
  }
  return path.value;
};

const confirmDelete = (row: any) => {
  deleteDialog.value = true;
  deleteFilesCache.value = [];

  const filePath = buildPath() + "/" + row.fileName;
  deleteFilesCache.value.push(filePath);
};

const confirmBatchDelete = () => {
  deleteDialog.value = true;
};

const submitDelete = () => {
  deleteFileApi(deleteFilesCache.value).then((res: any) => {
    if (res.code === 0) {
      message("删除成功", {
        type: "success"
      });
      refreshList();
    } else {
      message("删除失败", {
        type: "error"
      });
    }
  });
  deleteFilesCache.value = [];
  deleteDialog.value = false;
};

const rename = (row: any) => {
  oldName.value = row.fileName;
  isCreateFolder.value = false;
  row.isRename = true;
};

const submitRename = (row: any) => {
  if (isCreateFolder.value) {
    const data: FolderCreateRequest = {
      path: buildPath(),
      folderName: oldName.value
    };
    createFolderApi(data).then((res: any) => {
      if (res.code === 0) {
        message("创建成功", {
          type: "success"
        });
        row.isRename = false;
        refreshList();
      } else {
        message("创建失败", {
          type: "error"
        });
      }
      isCreateFolder.value = false;
    });
    return;
  }
  const data: FileRenameRequest = {
    path: buildPath(),
    oldName: row.fileName,
    newName: oldName.value
  };
  renameFileApi(data).then((res: any) => {
    if (res.code === 0) {
      message("重命名成功", {
        type: "success"
      });
      row.isRename = false;
      refreshList();
    } else {
      message("重命名失败", {
        type: "error"
      });
    }
  });
};

const closeRename = (row: any) => {
  row.isRename = false;
  refreshList();
};

const refreshList = () => {
  deleteFilesCache.value = [];
  moveFilesChache.value = [];
  getList("refresh", buildPath());
};

const onSearch = () => {
  deleteFilesCache.value = [];
  moveFilesChache.value = [];
  getList("search", buildPath(), searchQuery.keyWord);
};

const reSearch = () => {
  deleteFilesCache.value = [];
  moveFilesChache.value = [];
  getList("search", buildPath(), "");
};

const copyPath = () => {
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(buildPath()).then(
      function () {
        message("复制成功", {
          type: "success"
        });
      },
      function () {
        message("复制失败", {
          type: "error"
        });
      }
    );
  }
};

const isWindows = () => {
  if (paths.value[0] === "\\") {
    isWin.value = true;
  }
};

const goRootPath = () => {
  getList("get");
};

const handleDoubleClick = (row: any) => {
  isWindows();
  if (row.fileType === "folder") {
    paths.value.push(row.fileName);
    getList("into", buildPath());
  }
};

const goBack = () => {
  if (paths.value.length > 1) {
    paths.value.pop();
    getList("into", buildPath());
  }
};

function formatFileSize(sizeInBytes) {
  if (sizeInBytes < 1024) {
    return `${sizeInBytes}B`;
  } else if (sizeInBytes < 1024 * 1024) {
    return `${(sizeInBytes / 1024).toFixed(2)}KB`;
  } else if (sizeInBytes < 1024 * 1024 * 1024) {
    return `${(sizeInBytes / (1024 * 1024)).toFixed(2)}MB`;
  } else {
    return `${(sizeInBytes / (1024 * 1024 * 1024)).toFixed(2)}GB`;
  }
}

const searchQuery = reactive<GameFileListQuery>({
  path: "/",
  keyWord: ""
});

function getList(operation: string, gopath?: string, keyWord?: string) {
  if (operation === "refresh") {
    searchQuery.path = gopath;
    searchQuery.keyWord = "";
  }
  if (operation === "get") {
    searchQuery.path = "homeDir";
    searchQuery.keyWord = "";
  }
  if (operation === "search") {
    searchQuery.path = gopath;
    searchQuery.keyWord = keyWord;
  }
  if (operation === "into") {
    searchQuery.path = gopath;
    searchQuery.keyWord = "";
  }
  if (operation === "back") {
    searchQuery.path = gopath;
    searchQuery.keyWord = "";
  }
  getGameFileListApi(searchQuery).then(res => {
    tableData.value = res.data.rows;
    total.value = res.data.total;
    folderNum.value = res.data.folderNum;
    fileNum.value = res.data.fileNum;
    paths.value = res.data.path;
    if (paths.value !== null) {
      isRootPath.value = false;
    }
  });
}

onBeforeMount(() => {
  getList("get");
});
</script>

<style>
.text-ellipsis {
  height: 20px;
  overflow: hidden;
  text-overflow: ellipsis;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.fileBread {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin: 10px 0;
  font-size: 20px;
  text-align: center;
}

.fileBread button[position="left"] {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  cursor: pointer;
  background-color: #fff;
  border: 1px solid var(--el-border-color);
  border-radius: 3px 0 0 3px;
}

.fileBread button[position="right"] {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  cursor: pointer;
  background-color: #fff;
  border: 1px solid var(--el-border-color);
  border-radius: 0 3px 3px 0;
}

.filePath {
  display: flex;
  align-items: center;
  min-width: 250px;
  max-width: 500px;
  height: 32px;
  padding: 0 10px;
  overflow-x: auto;
  font-size: 14px;
  white-space: nowrap;
  background-color: #fff;
  border-top: 1px solid var(--el-border-color);
  border-bottom: 1px solid var(--el-border-color);
}

.filePath::-webkit-scrollbar {
  display: none;
}

.fileOperate {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 10px;
}

.fileOperateLeft {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.fileOperateRight {
  display: flex;
  align-items: center;
  font-size: 14px;
  font-weight: 400;
  color: rgb(255 166 0);
}

.enterElement {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
}
</style>
