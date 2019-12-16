<template>
  <div>
    <!-- 富文本编辑器, 容器 -->
    <div :id="quillId" style="height: 300px;" />
    <!-- 自定义上传图片功能 (使用element upload组件) -->
    <el-upload
      :action="uploadUrl"
      :show-file-list="false"
      :before-upload="uploadBeforeUploadHandle"
      :on-success="uploadSuccessHandle"
      style="display: none;"
    >
      <el-button ref="uploadBtn" type="primary" size="mini">{{ $t('upload.button') }}</el-button>
    </el-upload>
  </div>
</template>

<script>
import { cookieGet } from "@/common/cookie";
import "quill/dist/quill.snow.css";
import Quill from "quill";

export default {
  name: "d2-quill-editor",
  props: {
    content: {
      type: String
    }
  },
  data() {
    return {
      quillId: `J_quillEditor${Math.ceil(Math.random() * 1000)}`,
      quillEditor: null,
      quillEditorToolbarOptions: [
        ["bold", "italic", "underline", "strike"],
        ["blockquote", "code-block", "image"],
        [{ header: 1 }, { header: 2 }],
        [{ list: "ordered" }, { list: "bullet" }],
        [{ script: "sub" }, { script: "super" }],
        [{ indent: "-1" }, { indent: "+1" }],
        [{ direction: "rtl" }],
        [{ size: ["small", false, "large", "huge"] }],
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        [{ color: [] }, { background: [] }],
        [{ font: [] }],
        [{ align: [] }],
        ["clean"]
      ],
      uploadUrl: "" // 编辑器图片url
    };
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      this.$nextTick(() => {
        if (this.quillEditor) {
          this.quillEditor.deleteText(0, this.quillEditor.getLength());
        } else {
          this.quillEditorHandle();
        }
        this.quillEditor.root.innerHTML = this.content;
      });
    },

    // 富文本编辑器
    quillEditorHandle() {
      this.quillEditor = new Quill(`#${this.quillId}`, {
        modules: {
          toolbar: this.quillEditorToolbarOptions
        },
        theme: "snow"
      });
      // 自定义上传图片功能 (使用element upload组件)
      this.uploadUrl =`${window.SITE_CONFIG["apiURL"]}/image/?token=${cookieGet("token")}`;

      this.quillEditor.getModule("toolbar").addHandler("image", () => {
        this.$refs.uploadBtn.$el.click();
      });
      // 监听内容变化，动态赋值
      this.quillEditor.on("text-change", () => {
        this.$emit("update:content", this.quillEditor.root.innerHTML); //赋值
      });
    },
    // 富文本上传图片之前
    uploadBeforeUploadHandle(file) {
      if (
        file.type !== "image/jpg" &&
        file.type !== "image/jpeg" &&
        file.type !== "image/png" &&
        file.type !== "image/gif"
      ) {
        this.$message.error("只支持jpg、png、gif格式的图片！");
        return false;
      }
    },
    // 富文本上传图片成功
    uploadSuccessHandle(res, file, fileList) {
      if (res.code !== 200) {
        return this.$message.error(res.message);
      }
      this.quillEditor.insertEmbed(
        this.quillEditor.getSelection().index,
        "image",
        window.SITE_CONFIG["wwwURL"]+res.data
      );
    }
  }
};
</script>
