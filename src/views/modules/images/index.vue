<template>
  <d2-container>
    <el-row :gutter="15">
      <el-col :sm="6" :md="4" :lg="3" v-for="item in dataList" :key="item.id" class="d2-pb-20">
        <el-card :body-style="{ padding: '0px' }" style="line-height: 0;">
          <img
            lazy
            src="https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png"
            class="image"
          />
          <div>
            <el-button-group>
              <el-button
                type="primary"
                v-show="isChoice"
                class="button"
                @click="choiceHandle('https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png')"
              >选择</el-button>
              <el-button type="danger" class="button" @click="deleteHandle(item.id)">删除</el-button>
            </el-button-group>
          </div>
        </el-card>
      </el-col>
    </el-row>

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

export default {
  mixins: [mixinViewModule],
  props: {
    isChoice: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      mixinViewModuleOptions: {
        getDataListURL: "/information", //列表api
        getDataListIsPage: true, //是否分页
        deleteURL: "/information" //删除api
      },
      pageSize: 30, // 每页数

      //需要搜索的字段
      dataForm: {}
    };
  },
  created() {
    this.init();
  },
  methods: {
    init() {},
    choiceHandle(url) {
      this.$emit("handleChoiceImage", url);
    }
  },

  components: {}
};
</script>
<style lang="scss" scoped>
.image {
  width: 100%;
  height: 150px;
}
</style>
