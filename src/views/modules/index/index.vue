<template>
  <d2-container>
    <el-form :inline="true" size="mini" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-input v-model="dataForm.fuzzyWord" placeholder="查询关键字" clearable />
      </el-form-item>
      <el-form-item>
        <el-date-picker
          v-model="dataForm.startDate"
          type="datetime"
          value-format="yyyy-MM-dd HH:mm:ss"
          :placeholder="$t('datePicker.start')"
        ></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-date-picker
          v-model="dataForm.endDate"
          type="datetime"
          value-format="yyyy-MM-dd HH:mm:ss"
          :placeholder="$t('datePicker.end')"
        ></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-select v-model="dataForm.typeIds" clearable placeholder="所属分类">
          <el-option v-for="item in newsTypes" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select v-model="dataForm.status" clearable placeholder="启用状态">
          <el-option v-for="item in statusList" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button type="success" @click="getDataList()">{{ $t('query') }}</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="addOrUpdateHandle()">{{ $t('add') }}</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="danger" @click="deleteHandle()">{{ $t('deleteBatch') }}</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="allUpdateHandle()">批量设置</el-button>
      </el-form-item>

      <div>
        <el-form-item>
          <el-radio-group v-model="dataForm.isPublish" @change="getDataList()" size="medium">
            <el-radio-button v-for="item in isPublishList" :key="item.id" :label="item.id">{{item.name}}</el-radio-button>
          </el-radio-group>
        </el-form-item>
      </div>
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

      <el-table-column prop="batchNumber" label="获取日期" width="120" />
      <el-table-column prop="dayNumber" label="编号" width="50" />
      <el-table-column prop="title" label="标题" header-align="center" align="left">
        <template slot-scope="scope">
          <!---->
          <d2-temp-form-submit
            :value.sync="scope.row.title"
            :scopeObj="{type:'input',id:scope.row.id,tempUpdateURL:mixinViewModuleOptions.tempUpdateURL}"
          ></d2-temp-form-submit>
        </template>
      </el-table-column>

      <el-table-column prop="typeIds" label="所属分类" width="120">
        <template slot-scope="scope">
          <!---->
          <d2-temp-form-submit
            :value.sync="scope.row.typeIds"
            :scopeObj="{type:'selectMultiple',id:scope.row.id,newsTypes:newsTypes,tempUpdateURL:mixinViewModuleOptions.tempUpdateURL}"
            v-if="newsTypes.length>0"
          ></d2-temp-form-submit>
          <!--{{ scope.row.typeIds | arrayIdsToWords(mapping.newsTypes) }}-->
        </template>
      </el-table-column>
      <el-table-column prop="isPublish" label="审核状态" width="120">
        <template slot-scope="scope">{{ scope.row.isPublish | idToWords(isPublishList) }}</template>
      </el-table-column>
      <el-table-column prop="status" label="启用状态" width="120">
        <template slot-scope="scope">
          <el-switch
            v-if="scope.row.isPublish == 2"
            @change="tempFormSubmitHandle({field:'status',id:scope.row.id,value:scope.row.status})"
            v-model="scope.row.status"
            :active-value="2"
            :inactive-value="0"
          ></el-switch>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <!-- <el-table-column prop="publishTime" :label="$t('news.pubTime')" width="150">
        <template slot-scope="scope">{{ scope.row.publishTime | timeFormat }}</template>
      </el-table-column>
      <el-table-column
        prop="createDate"
        :label="$t('news.createTime')"
        sortable="custom"
        width="150"
      />-->
      <el-table-column prop="updateTime" :label="$t('news.updateTime')" width="180">
        <template slot-scope="scope">{{ scope.row.updateTime | timeFormat }}</template>
      </el-table-column>

      <el-table-column prop="origin" label="资讯网站" width="100" />
      <el-table-column :label="$t('handle')" fixed="right" width="150">
        <template slot-scope="scope">
          <el-button
            v-if="scope.row.isPublish == 0"
            type="text"
            size="mini"
            class="color-success"
            @click="tempFormSubmitHandle({field:'isPublish',id:scope.row.id,value:2,confirm:true})"
          >审核</el-button>

          <el-button
            type="text"
            size="mini"
            @click="addOrUpdateHandle(scope.row.id)"
          >{{ $t('update') }}</el-button>
          <el-button
            type="text"
            size="mini"
            class="color-danger"
            @click="deleteHandle(scope.row.id)"
          >{{ $t('delete') }}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update
      v-if="addOrUpdateVisible"
      ref="addOrUpdate"
      @refreshDataList="getDataList"
      :newsTypes="newsTypes"
      :isPublishList="isPublishList"
    />

    <!-- 弹窗, 批量管理-->
    <all-update
      v-if="allUpdateVisible"
      ref="allUpdate"
      @refreshDataList="getDataList"
      :newsTypes="newsTypes"
      :isPublish="dataForm.isPublish"
    />

    <!-- 分页 -->
    <el-pagination
      slot="footer"
      :current-page="page"
      :page-size="pageSize"
      :total="total"
      layout="total, sizes, prev, pager, next, jumper"
      @size-change="pageSizeChangeHandle"
      @current-change="pageCurrentChangeHandle"
    ></el-pagination>
  </d2-container>
</template>

<script>
import mixinViewModule from "@/mixins/view-module";
import D2TempFormSubmit from "@/components/d2-temp-form-submit";
import AddOrUpdate from "./add-or-update";
import AllUpdate from "./all-update";

export default {
  mixins: [mixinViewModule],
  data() {
    return {
      mixinViewModuleOptions: {
        getDataListURL: "/information", //列表api
        tempUpdateURL: "/information", //修改单个数据api
        getDataListIsPage: true, //是否分页
        deleteURL: "/information", //删除api
        deleteIsBatch: true
      },
      newsTypes: [], // 所属分类列表
      isPublishList: [{ id: 0, name: "待审核" }, { id: 2, name: "已审核" }],
      statusList: [{ id: 0, name: "禁用" }, { id: 2, name: "启用" }],
      // mapping: {
      //   //映射
      //   newsTypes: {}, //分类做映射
      //   isPublish: {}, //审核
      //   status: {} //状态
      // },
      //需要搜索的字段
      dataForm: {
        fuzzyWord: "", //模糊查询关键字
        startDate: "",
        endDate: "",
        typeIds: "", //1快讯 2新闻 ……
        status: "", //0禁用 2启用
        isPublish: "0" //2为已审核，0为待审核
      }
    };
  },
  created() {
    //this.init();
  },
  methods: {
    init() {
      //所属分类列表
      this.$axios.get(`/information/type`).then(res => {
        this.newsTypes = res;
        //this.mapping.newsTypes = this.newsTypes.map(obj =>obj.name);
        // this.newsTypes.map(item => {
        //   this.mapping.newsTypes[item.id] = item.name; //转成{1:'标题1',2:'标题2'}
        // });
      });
      // this.isPublish.map(item => {
      //   this.mapping.isPublish[item.id] = item.name;
      // });
      // this.status.map(item => {
      //   this.mapping.status[item.id] = item.name;
      // });
    },

  },

  components: {
    D2TempFormSubmit,
    AddOrUpdate,
    AllUpdate
  }
};
</script>
