<template>
  <el-dialog
    :visible.sync="visible"
    :title="!dataForm.id ? $t('add') : $t('update')"
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
      <el-form-item prop="name" :label="$t('news.title')">
        <el-input v-model="dataForm.name" :placeholder="$t('news.title')" />
      </el-form-item>
      <el-form-item prop="serviceDay" label="App查询有效天数">
        <el-input v-model="dataForm.serviceDay" placeholder="App查询有效天数" />
      </el-form-item>
      <el-form-item prop="isLoadDetail" label="自动加载详情">
        <el-switch v-model="dataForm.isLoadDetail" :active-value="true" :inactive-value="false"></el-switch>
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
  data() {
    return {
      visible: false,
      dataForm: {
        id: "",
        name: "",
        serviceDay:"",
        isLoadDetail:""
      }
    };
  },
  computed: {
    dataRule() {
      return {
        name: [
          {
            required: true,
            message: this.$t("validate.required"),
            trigger: "blur"
          }
        ],
        serviceDay: [
          {
            required: true,
            message: this.$t("validate.required"),
            trigger: "blur"
          }
        ],
        isLoadDetail: [
          {
            required: true,
            message: this.$t("validate.required"),
            trigger: "blur"
          }
        ],
      };
    }
  },
  methods: {
    init() {
      this.visible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].resetFields();
        if (this.dataForm.id) {
          this.getInfo();
        }
      });
    },

    // 获取信息
    getInfo() {
      this.$axios
        .get(`/information/type/?id=${this.dataForm.id}`)
        .then(res => {
          this.dataForm = res[0];
        })
        .catch(() => {});
    },
    // 表单提交
    dataFormSubmitHandle: debounce(
      function() {
        this.$refs["dataForm"].validate(valid => {
          if (!valid) {
            return false;
          }
          this.$axios[!this.dataForm.id ? "post" : "put"](
            "/information/type",
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
