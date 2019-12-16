<template>
  <el-dialog
    :visible.sync="visible"
    title="批量设置"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <el-form
      :model="dataForm"
      :rules="dataRule"
      ref="dataForm"
      @keyup.enter.native="dataFormSubmitHandle()"
      label-width="120px"
    >
      <el-form-item prop="typeIds" label="所属分类">
        <el-select v-model="dataForm.typeIds" multiple placeholder="请选择">
          <el-option v-for="item in newsTypes" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item v-if="isPublish != 2" prop="isPublish" label="审核状态">
        <el-radio v-model="dataForm.isPublish" :label="0">待审核</el-radio>
        <el-radio v-model="dataForm.isPublish" :label="2">已审核</el-radio>
      </el-form-item>

      <el-form-item v-if="isPublish != 0" prop="status" label="启用状态">
        <el-switch v-model="dataForm.status" :active-value="2" :inactive-value="0"></el-switch>
      </el-form-item>
    </el-form>
    <template slot="footer">
      <el-button @click="visible = false">{{ $t('cancel') }}</el-button>
      <el-button type="primary" @click="dataFormSubmitHandle()">{{ $t('confirm') }}</el-button>
    </template>
  </el-dialog>
</template>

<script>
import { debounce } from "lodash";
export default {
  props: {
    newsTypes: {
      // 所属分类
      type: [Object, Array]
    },
    isPublish:{
      type:Number
    }
  },

  data() {
    return {
      visible: false,
      dataForm: {
        ids: "",
        typeIds: "", //类型id
        isPublish: 0, //2为已审核，0为待审核
        status: 0, //0禁用 2启用
      }
    };
  },
  watch:{
    //父级审核状态
    isPublish:{
      immediate: true,
      handler:function(newVal, oldVal){
        this.dataForm.isPublish = newVal
      }
    }
  },
  computed: {
    dataRule() {
      return {
        typeIds: [
          {
            required: true,
            message: this.$t("validate.required"),
            trigger: "blur"
          }
        ]
      };
    }
  },
  methods: {
    init() {
      this.visible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].resetFields();
        if (this.dataForm.ids) {
          this.getInfo();
        }
      });
    },

    // 获取信息
    getInfo() {},
    // 表单提交
    dataFormSubmitHandle: debounce(
      function() {
        this.$refs["dataForm"].validate(valid => {
          if (!valid) {
            return false;
          }
          this.$axios["put"](
            "/information",
            this.dataForm
            // { headers: { "content-type": "application/x-www-form-urlencoded" } }
          )
            .then(res => {
              this.$message({
                message: this.$t("prompt.success"),
                type: "success",
                duration: 500,
                onClose: () => {
                  this.visible = false;
                  this.$emit("refreshDataList");
                }
              });
            })
            .catch(() => {});
        });
      },
      1000,
      { leading: true, trailing: false }
    )
  }
};
</script>
