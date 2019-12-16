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
      <div v-show="!dataForm.id">
        <el-form-item prop="title" :label="$t('news.title')">
          <el-input v-model="dataForm.title" :placeholder="$t('news.title')" />
        </el-form-item>

        <el-form-item prop="isPublish" label="审核状态">
          <el-radio
            v-model="dataForm.isPublish"
            v-for="item in isPublishList"
            :key="item.id"
            :label="item.id"
          >{{item.name}}</el-radio>
        </el-form-item>

        <el-form-item prop="typeIds" label="所属分类">
          <el-select v-model="dataForm.typeIds" multiple placeholder="请选择">
            <el-option v-for="item in newsTypes" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item prop="status" label="启用状态">
          <el-switch v-model="dataForm.status" :active-value="2" :inactive-value="0"></el-switch>
        </el-form-item>
      </div>

      <el-form-item prop="coverImgUrl" label="封面">
        <d2-upload-image :imageUrl.sync="dataForm.coverImgUrl"></d2-upload-image>
      </el-form-item>

      <el-form-item prop="content" :label="$t('news.content')">
        <d2-quill-editor v-if="contentVisible" :content.sync="dataForm.content"></d2-quill-editor>
      </el-form-item>
    </el-form>
    <template slot="footer">
      <el-button @click="visible = false">{{ $t('cancel') }}</el-button>
      <el-button type="primary" @click="dataFormSubmitHandle()">{{ $t('confirm') }}</el-button>
    </template>
  </el-dialog>
</template>

<script>
import D2UploadImage from "@/components/d2-upload-image";
import D2QuillEditor from "@/components/d2-quill-editor";

import { debounce } from "lodash";
export default {
  props: {
    isPublishList: {
      // 发布
      type: [Object, Array]
    },
    newsTypes: {
      // 所属分类
      type: [Object, Array]
    }
  },
  data() {
    return {
      visible: false, //弹窗是否显示
      contentVisible: false, //编辑器是否显示
      //更新的字段
      dataForm: {
        id: "",
        title: "",
        status: 0, //2启用状态 0禁用
        isPublish: 0, //0待审核 2已审核
        typeIds: "", //所属分类
        coverImgUrl: "", //封面图片
        content: ""
      }
    };
  },
  computed: {
    dataRule() {
      var validateContent = (rule, value, callback) => {
        if (
          this.dataForm.content == "" ||
          this.dataForm.content == "<p><br></p>"
        ) {
          return callback(new Error(this.$t("validate.required")));
        }
        callback();
      };
      return {
        title: [
          {
            required: true,
            message: this.$t("validate.required"),
            trigger: "blur"
          }
        ],
        typeIds: [
          {
            required: true,
            message: this.$t("validate.required"),
            trigger: "blur"
          }
        ],
        content: [
          {
            required: true,
            message: this.$t("validate.required"),
            trigger: "blur"
          },
          { validator: validateContent, trigger: "blur" }
        ]
      };
    }
  },
  methods: {
    init() {
      this.visible = true;
      this.contentVisible = false; //编辑器显示
      this.$nextTick(() => {
        this.$refs["dataForm"].resetFields();
        if (this.dataForm.id) {
          this.getInfo();
        } else {
          this.contentVisible = true;
        }
      });
    },
    // 获取信息
    getInfo() {
      this.$axios
        .get(`/information/?id=${this.dataForm.id}`)
        .then(res => {
          this.dataForm = res;
          this.contentVisible = true;
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
            "/information",
            this.dataForm
            //{ headers: { "content-type": "application/x-www-form-urlencoded" } }
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
  },
  components: {
    D2UploadImage,
    D2QuillEditor
  }
};
</script>
