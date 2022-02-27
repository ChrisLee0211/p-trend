<template>
  <div class="table">
    <section class="table-tool">
      <n-form
        inline
        :label-width="80"
        :model="searchParams"
        label-placement="left"
        ref="formRef"
      >
        <n-form-item label="文件名" path="searchParams.name">
          <n-input
            placeholder="文件名或路径"
            v-model:value="searchParams.name"
          />
        </n-form-item>
        <n-form-item label="更新时间" path="searchParams.updatedAt">
          <n-date-picker
            v-model:value="searchParams.updatedAt"
            type="datetimerange"
            clearable
          />
        </n-form-item>
        <n-form-item label="创建时间" path="searchParams.createdAt">
          <n-date-picker
            v-model:value="searchParams.createdAt"
            type="datetimerange"
            clearable
          />
        </n-form-item>
        <n-form-item>
          <n-button>搜索</n-button>
        </n-form-item>
      </n-form>
    </section>
    <section class="table-container">
      <n-space vertical>
        <n-button v-if="currentSelections.length" @click="batchRemoveFiles"
          >删除</n-button
        >
        <n-data-table
          :columns="tableColumn"
          :data="tableData"
          :loading="loading"
          :row-key="(row) => row.path"
          @update:checked-row-keys="handleSelect"
        />
        <n-space justify="center">
          <n-pagination
            v-model:page="searchParams.page"
            :item-count="total"
            @change="changePage"
          />
        </n-space>
      </n-space>
    </section>
    <Detail
      :detail="detailInfo"
      :visible="detailVisible"
      :setDetailVisible="setDetailVisible"
    />
    <LoadingModal
      :visible="loadingModalVisible"
      :limit="currentSelections.length"
      :success="success"
      :fail="fail"
     />
  </div>
</template>
<script lang="ts">
import {
  defineComponent,
  ref,
  computed,
  reactive,
} from "vue";
import {
  NDataTable,
  NButton,
  NInput,
  NForm,
  NFormItem,
  NDatePicker,
  NSpace,
  NPagination,
  useDialog,
  useNotification
} from "naive-ui";
import { useFetch } from "@vueuse/core";
import { useTableColumn } from "./useTableColumn";
import Detail from "./components/Detail.vue";
import LoadingModal from "./components/LoadingModal.vue";
import axios from "axios";

interface SearchParams {
  page: number;
  pageSize: number;
  name: string | undefined;
  updatedAt: [number, number] | null;
  createdAt: [number, number] | null;
}

interface ApiResponse {
  data: FileNode[];
  page: number;
  pageSize: number;
  total: number;
}
export default defineComponent({
  name: "Table",
  components: {
    NDataTable,
    NFormItem,
    NButton,
    NInput,
    NForm,
    NDatePicker,
    NPagination,
    NSpace,
    Detail,
    LoadingModal
  },
  setup() {
    const notice = useNotification();
    /** 表格基础操作逻辑 */
    const dialog = useDialog()
    const loading = ref(false);
    const total = ref(0);
    const detailInfo = ref<FileNode>();
    const detailVisible = ref(false);
    const setDetailVisible = (bool: boolean) => {
      detailVisible.value = bool;
    };
    const setDetail = (record: FileNode) => {
      detailVisible.value = true;
      detailInfo.value = record;
    };

    const deleteCurrentFile = (record: FileNode) => {
      console.log(record)
      dialog.warning({
        title: '提示',
        content: '确定要删除指定的文件吗？',
        positiveText: '删除',
        negativeText: '不删',
        onPositiveClick:async () => {
          console.log(record.path);
          const res = await axios
            .post(`http://localhost:${window.preloadState.port}/table/delete`, {path:record.path});
          if (res.data.result) {
            refreshTable();
            notice.success({title:'删除成功'})
            return true
          }else {
            notice.error({title:'删除失败'})
          }
        }
      })
    };
    const tableColumn = useTableColumn(setDetail, deleteCurrentFile);
    const tableData = computed<FileNode[]>(() => {
      return data.value ? data.value.data : [];
    });

    /** 请求逻辑 */
    const searchParams = reactive<SearchParams>({
      page: 1,
      pageSize: 10,
      name: "",
      updatedAt: null,
      createdAt: null,
    });
    const fetchTableDataUrl = computed(() => {
      const urlObject = new URL(`http://localhost:${window.preloadState.port}/table`);
      const searchObject = urlObject.searchParams;
      if (searchParams.createdAt) {
        searchObject.set("ctimeStart", String(searchParams.createdAt[0]));
        searchObject.set("ctimeEnd", String(searchParams.createdAt[1]));
      }
      if (searchParams.updatedAt) {
        searchObject.set("utimeStart", String(searchParams.updatedAt[0]));
        searchObject.set("utimeEnd", String(searchParams.updatedAt[1]));
      }
      if (searchParams.name && searchParams.name !== "") {
        searchObject.set("name", searchParams.name);
      }
      searchObject.set("page", String(searchParams.page));
      searchObject.set("pageSize", String(searchParams.pageSize));
      const url = urlObject.toString();
      return url;
    });
    const {
      data,
      onFetchFinally,
      execute: refreshTable,
    } = useFetch(fetchTableDataUrl, {
      refetch: true,
      beforeFetch() {
        loading.value = true;
      },
    }).json<ApiResponse>();
    onFetchFinally(() => {
      loading.value = false;
      total.value = data.value ? data.value.total : 0;
    });
    const changePage = (page: number) => {
      searchParams.page = page;
    };

    /** 多选逻辑 */
    const loadingModalVisible = ref(false);
    const currentSelections = ref<string[]>([]);
    const success = ref<number>(0);
    const fail = ref<number>(0);
    const handleSelect = (keys: any[]) => {
      currentSelections.value = keys;
    };
    const batchRemoveFiles = () => {
      dialog.warning({
        title: '提示',
        content: '确定要删除指定的文件吗？',
        positiveText: '删除',
        negativeText: '不删',
        onPositiveClick:() => {
          loadingModalVisible.value = true;
          for(let i = 0; i<currentSelections.value.length;i++) {
            const curPath = currentSelections.value[i];
            axios
            .post(`http://localhost:${window.preloadState.port}/table/delete`, { path: curPath})
            .then((res)=> {
              if(res.data) {
                success.value = success.value + 1
              }
            })
            .catch((e) => {
              fail.value = fail.value + 1
            })
            .finally(() => {
              if (success.value + fail.value === currentSelections.value.length) {
                setTimeout(() => {
                  loadingModalVisible.value = false;
                  fail.value = 0;
                  success.value = 0;
                  refreshTable()
                }, 2000)
              }
            })
          }
        }
      })
    };
    return {
      searchParams,
      loading,
      tableData,
      tableColumn,
      total,
      changePage,
      detailInfo,
      detailVisible,
      setDetailVisible,
      handleSelect,
      currentSelections,
      batchRemoveFiles,
      loadingModalVisible,
      success,
      fail
    };
  },
});
</script>
<style lang="scss">
.table {
  width: 100%;
  height: 100%;
  display: flex;
  flex-flow: column;
  padding: 20px;
  box-sizing: border-box;
  &-tool {
    width: 100%;
    height: 15%;
    display: flex;
    align-items: center;
  }
  &-container {
    width: 100%;
    height: 85%;
  }
}
</style>
