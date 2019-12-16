<template>
  <div>
    <el-upload
      class="avatar-uploader"
      :action="uploadUrl"
      :show-file-list="false"
      :on-success="handleAvatarSuccess"
      :before-upload="beforeAvatarUpload"
    >
      <img v-if="imageUrl" :src="imageUrl" class="avatar" />
      <i v-else class="el-icon-plus avatar-uploader-icon"></i>
    </el-upload>

    <!-- <span @click="showImages=true">选择图片</span>
    <el-dialog title="选择图片" :visible.sync="showImages" append-to-body>
      <choice-images :isChoice="true" @handleChoiceImage="handleChoiceImage"></choice-images>
    </el-dialog> -->
  </div>
</template>

<script>
import { cookieGet } from "@/common/cookie";
import ChoiceImages from "@/views/modules/images";

export default {
  name: "d2-upload-image",
  props: {
    imageUrl: {
      type: String
    }
  },
  data() {
    return {
      showImages: false,
      uploadUrl:`${window.SITE_CONFIG["apiURL"]}/image/?token=${cookieGet("token")}`
    };
  },
  created() {},
  methods: {
    //图片上传成功
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw); //预览
      this.$emit(
        "update:imageUrl",
        window.SITE_CONFIG["wwwURL"] + res.data
      ); //后台返回的图片路径
    },
    //图片上传前
    beforeAvatarUpload(file) {
      const isJPG =
        file.type === "image/jpeg" ||
        file.type === "image/jpg" ||
        file.type === "image/png" ||
        file.type === "image/gif";
      const isLt5M = file.size / 1024 / 1024 < 5;

      if (!isJPG) {
        this.$message.error("只支持jpg、png、gif格式的图片！");
      }
      if (!isLt5M) {
        this.$message.error("图片大小不能超过 5MB!");
      }
      return isJPG && isLt5M;
    },
    //选择图片
    handleChoiceImage(url) {
      this.showImages = false;
      this.imageUrl = url; //预览
      this.$emit("update:imageUrl", url);
    }
  },
  components: {
    ChoiceImages
  }
};
</script>