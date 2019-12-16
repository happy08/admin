<template>
  <d2-container>
    <el-form :inline="true" size="mini" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-button type="primary" @click="addOrUpdateHandle()">{{ $t('add') }}</el-button>
      </el-form-item>
      <!-- <el-form-item>
        <el-button type="danger" @click="deleteHandle()">{{ $t('deleteBatch') }}</el-button>
      </el-form-item>-->
    </el-form>

    <el-table
      size="mini"
      v-loading="dataListLoading"
      :data="dataList"
      border
      @selection-change="dataListSelectionChangeHandle"
      @sort-change="dataListSortChangeHandle"
      style="width: 100%;"
    >
      <el-table-column type="selection" header-align="center" align="center" width="50" />
      <el-table-column prop="name" :label="$t('news.title')" header-align="center" align="center" />
      <el-table-column prop="newsCount" label="全部数量" />
      <el-table-column prop="publishCount" label="App已审核数量" />
      <el-table-column prop="serviceDay" label="App查询有效天数" />
      <el-table-column prop="isLoadDetail" label="自动加载详情" width="120">
        <template slot-scope="scope">
          <el-switch
            :disabled="scope.row.isForbidOperate == true"
            @change="tempFormSubmitHandle('isLoadDetail',scope.row.id,scope.row.isLoadDetail)"
            v-model="scope.row.isLoadDetail"
            :active-value="true"
            :inactive-value="false"
          ></el-switch>
        </template>
      </el-table-column>

      <el-table-column prop="createTime" :label="$t('news.createTime')">
        <template slot-scope="scope">{{ scope.row.createTime | timeFormat }}</template>
      </el-table-column>

      <el-table-column :label="$t('handle')" fixed="right" width="150">
        <template slot-scope="scope">
          <el-button
            :disabled="scope.row.isForbidOperate == true"
            type="text"
            size="mini"
            @click="addOrUpdateHandle(scope.row.id)"
          >{{ $t('update') }}</el-button>
          <el-button
            :disabled="scope.row.isForbidOperate == true"
            type="text"
            class="color-danger"
            size="mini"
            @click="deleteHandle(scope.row.id)"
          >{{ $t('delete') }}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList" />
  </d2-container>
</template>

<script>
import mixinViewModule from "@/mixins/view-module";
import AddOrUpdate from "./add-or-update";
export default {
  mixins: [mixinViewModule],
  data() {
    return {
      mixinViewModuleOptions: {
        getDataListURL: "/information/type", //列表api
        getDataListIsPage: false, //是否分页
        tempUpdateURL: "/information/type", //列表api
        deleteURL: "/information/type" //删除api
        //deleteIsBatch: true      //批量删除
      }
      // dataForm: {
      //   //title: "",
      // },
    };
  },
  methods: {
    beforDeleteHandle(id) {
      let newsCount = this.dataList.filter(item => item.id === id)[0].newsCount;
      if (newsCount !== 0) {
        this.$message.error("数量不为0，不可删除");
        return false;
      }
      return true;
    }
  },
  components: {
    AddOrUpdate
  }
};
</script>
