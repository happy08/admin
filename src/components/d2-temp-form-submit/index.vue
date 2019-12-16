<template>
  <el-popover placement="false" trigger="click" popper-class="cur-popover d2-p-0">
    <!-- input -->
    <template v-if="scopeObj.type=='input'">
      <el-input type="text" size="mini" placeholder="请输入" v-model="scopeTempObj.value" />
      <el-button
        type="primary"
        size="mini"
        @click="tempFormSubmitHandle({field:'title',id:scopeObj.id,value:scopeTempObj.value})"
      >{{ $t('confirm') }}</el-button>
      <div slot="reference">{{ value }}</div>
    </template>

    <!-- select单选 -->
    <template v-if="scopeObj.type=='select'">
      <el-select v-model="scopeTempObj.value" placeholder="请选择" @change="tempFormSubmitHandle({field:'typeIds',id:scopeObj.id,value:scopeTempObj.value})">
        <el-option
          v-for="item in scopeObj.newsTypes"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        ></el-option>
      </el-select>
      <div slot="reference">{{ value | idToWords(scopeObj.newsTypes) }}</div>
    </template>

    <!-- selectMultiple多选 -->
    <template v-if="scopeObj.type=='selectMultiple'">
      <el-select multiple v-model="scopeTempObj.value" placeholder="请选择">
        <el-option
          v-for="item in scopeObj.newsTypes"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        ></el-option>
      </el-select>
      <el-button
        type="primary"
        size="mini"
        @click="tempFormSubmitHandle({field:'typeIds',id:scopeObj.id,value:scopeTempObj.value})"
      >{{ $t('confirm') }}</el-button>
      <div slot="reference">{{ value | arrayIdsToWords(scopeObj.newsTypes) }}</div>
    </template>
  </el-popover>
</template>

<script>
import mixinViewModule from "@/mixins/view-module";

export default {
  name: "d2-temp-form-submit",
  mixins: [mixinViewModule],
  props: {
    value: {
      type: [String, Array, Object],
      default: ""
    },
    scopeObj: {
      type: Object
    }
  },
  data() {
    return {
      mixinViewModuleOptions: {
        activatedIsNeed: false, // 此页面是否在激活（进入）时，调用查询数据列表接口？
        tempUpdateURL: this.scopeObj.tempUpdateURL // 临时修改列表中单个数据接口，API地址
      },
      scopeTempObj: {
        value:''
      }
    };
  },
  watch: {
    value: {
      handler(newVal, oldVal) { console.log('newVal.value',newVal);
        //this.scopeTempObj = Object.assign({}, newVal);
        this.scopeTempObj.value = newVal
      },
      immediate: true
    },
    // scopeObj: {
    //   handler(newVal, oldVal) { console.log('newVal.value2',newVal.id);
    //     //this.scopeTempObj = Object.assign({}, newVal);
    //     //this.scopeTempObj.value = newVal.value
    //   },
    //   immediate: true
    // }
  },
  created() {},
  methods: {},
  components: {}
};
</script>
<style lang="scss">
.cur-popover {
  width: 100%;
  left: 0px;
  display: flex;
  > .el-input {
    min-width: 250px;
  }
  > .el-button{
    margin-left: 1px;
  }
}
</style>