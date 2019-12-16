<template>
  <d2-container>
    <el-form :inline="true" size="mini" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-button type="primary" @click="allUpdateHandle()">批量设置</el-button>
      </el-form-item>
      <!-- <el-form-item>
        <el-button type="primary" @click="addOrUpdateHandle()">{{ $t('add') }}</el-button>
      </el-form-item>
      <el-form-item>
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
      <el-table-column prop="name" :label="$t('news.title')" />
      <el-table-column prop="typeName" label="来源分类" />

      <el-table-column prop="url" label="网站地址" />
      <el-table-column prop="defaultTypeId" label="入库分类">
        <template slot-scope="scope">
          <el-popover placement="false" trigger="click" popper-class="d2-p-0">
            <el-select
              v-model="scope.row.defaultTypeId"
              placeholder="所属分类"
              @change="tempFormSubmitHandle('typeId',scope.row.id,scope.row.defaultTypeId)"
            >
              <el-option
                v-for="item in newsTypes"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
            <div slot="reference">{{ mapping.newsTypes[scope.row.defaultTypeId] }}</div>
          </el-popover>
        </template>
      </el-table-column>

      <!--
      <el-table-column prop="defaultStatus" label="自动启用" width="100">
        <template slot-scope="scope">
          <span :class="{'color-danger':scope.row.defaultStatus===0}">{{ mapping.status[scope.row.defaultStatus] }}</span>
        </template>
      </el-table-column>
      -->
      <el-table-column prop="defaultPublish" label="自动审核" width="100">
        <template slot-scope="scope">
          <el-switch
            @change="tempFormSubmitHandle('isPublish',scope.row.id,scope.row.defaultPublish)"
            v-model="scope.row.defaultPublish"
            :active-value="2"
            :inactive-value="0"
          ></el-switch>
        </template>
      </el-table-column>

      <el-table-column prop="status" label="来源状态" width="100">
        <template slot-scope="scope">
          <el-switch
            @change="tempFormSubmitHandle('status',scope.row.id,scope.row.status)"
            v-model="scope.row.status"
            :active-value="2"
            :inactive-value="0"
          ></el-switch>
          <!-- <span
            :class="{'color-danger':scope.row.status===0}"
          >{{ mapping.status[scope.row.status] }}</span>-->
        </template>
      </el-table-column>
      <el-table-column prop="cronName" label="更新频率" />
      <el-table-column prop="nextExecuteTime" label="下次更新时间" width="180">
        <template slot-scope="scope">{{ scope.row.nextExecuteTime | timeFormat }}</template>
      </el-table-column>

      <!-- <el-table-column
        :label="$t('handle')"
        fixed="right"
        width="150"
      >
        <template slot-scope="scope">
          <el-button
            type="text"
            size="mini"
            @click="addOrUpdateHandle(scope.row.id)"
          >{{ $t('update') }}</el-button>
          <el-button type="text" size="mini" @click="deleteHandle(scope.row.id)">{{ $t('delete') }}</el-button>
        </template>
      </el-table-column>-->
    </el-table>

    <!-- 弹窗, 批量修改-->
    <all-update
      v-if="allUpdateVisible"
      ref="allUpdate"
      @refreshDataList="getDataList"
      :newsTypes="newsTypes"
    />
  </d2-container>
</template>

<script>
import mixinViewModule from "@/mixins/view-module";
import AllUpdate from "./all-update";
export default {
  mixins: [mixinViewModule],
  data() {
    return {
      mixinViewModuleOptions: {
        getDataListURL: "/information/origin", //列表api
        tempUpdateURL: "/information/origin", //修改单个数据api
        getDataListIsPage: false, //是否分页
        deleteURL: "/information/origin" //删除api
        //deleteIsBatch: true      //批量删除
      },
      newsTypes: [],
      status: [{ id: 0, name: "禁用" }, { id: 2, name: "启用" }],
      mapping: {
        newsTypes: {},
        status: {} //状态映射
      }
      // dataForm: {
      //   //title: "",
      // },
    };
  },
  mounted() {
    //this.init();
  },
  methods: {
    init() {
      //所属分类列表
      this.$axios.get(`/information/type`).then(res => {
        this.newsTypes = res;
        this.newsTypes.map(item => {
          this.mapping.newsTypes[item.id] = item.name; //转成{1:'标题1',2:'标题2'}
        });
      });
      this.status.map(item => {
        this.mapping.status[item.id] = item.name;
      });
    }
  },

  components: {
    AllUpdate
  }
};
</script>
