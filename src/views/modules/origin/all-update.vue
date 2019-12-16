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

      <el-form-item prop="cronId" label="更新频率">
        <el-select v-model="dataForm.cronId" placeholder="请选择">
          <el-option v-for="item in taskCronTypes" :key="item.cron_id" :label="item.title" :value="item.cron_id"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item prop="isPublish" label="自动审核">
        <el-switch v-model="dataForm.isPublish" :active-value="2" :inactive-value="0"></el-switch>
      </el-form-item>

      <el-form-item prop="status" label="来源状态">
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
  props:{
    newsTypes:{
      type:[Array,Object]
    }
  },
  data() {
    return {
      visible: false,
      taskCronTypes: [
        {
          cron_id:1,
          title:'每小时'
        },
        {
          cron_id:2,
          title:'每天'
        },
        {
          cron_id:3,
          title:'每周'
        },
      ],
      dataForm: {
        ids: "",
        cronId: "", //更新频率
        status: 0,  
        isPublish: 0, //自动审核
      }
    };
  },
  computed: {
    dataRule() {
      return {
        cronId: [
          {
            required: true,
            message: this.$t("validate.required"),
            trigger: "blur"
          }
        ],
        status: [
          {
            required: true,
            message: this.$t("validate.required"),
            trigger: "blur"
          }
        ],
        isPublish: [
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
        if (this.dataForm.ids) {
          this.getInfo();
        }

      });
    },
   
    // 获取信息
    getInfo() {
      //  //获取更新频率列表
      // this.$axios
      //   .get(`/information/origin`)
      //   .then(res => {
      //     this.taskCronTypes = res;
      //   })
      //   .catch(() => {});
    },

    // 表单提交
    dataFormSubmitHandle: debounce(
      function() {
        this.$refs["dataForm"].validate(valid => {
          if (!valid) {
            return false;
          }
          this.$axios["put"](
            "/information/origin",
            this.dataForm,
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
