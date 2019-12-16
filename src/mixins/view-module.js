import { cookieGet } from '@/common/cookie'
import qs from 'qs'
export default {
  data() {
    /* eslint-disable */
    return {
      // 设置属性
      mixinViewModuleOptions: {
        activatedIsNeed: true,    // 此页面是否在激活（进入）时，调用查询数据列表接口？
        getDataListURL: '',       // 数据列表接口，API地址
        getDataListIsPage: true,  // 数据列表接口，是否需要分页？
        tempUpdateURL: '',        // 临时修改列表中单个数据接口，API地址
        deleteURL: '',            // 删除接口，API地址
        deleteIsBatch: false,     // 删除接口，是否需要批量？
        deleteIsBatchKey: 'id',   // 删除接口，批量状态下由那个key进行标记操作？比如：pid，uid...
        exportURL: ''             // 导出接口，API地址
      },
      // 默认属性
      dataForm: {},               // 查询条件
      dataList: [],               // 数据列表
      order: '',                  // 排序，asc／desc
      orderField: '',             // 排序，字段
      page: 1,                    // 当前页码
      pageSize: 10,               // 每页数
      total: 0,                   // 总条数
      dataListLoading: false,     // 数据列表，loading状态
      dataListSelections: [],     // 数据列表，多选项
      addOrUpdateVisible: false,  // 新增／更新，弹窗visible状态
      allUpdateVisible: false     // 批量更新，弹窗visible状态
    }
    /* eslint-enable */
  },
  activated() {
    if (this.mixinViewModuleOptions.activatedIsNeed) {
      this.getDataList()
    }
  },
  created() {
    if (this.mixinViewModuleOptions.activatedIsNeed) {
      this.getDataList()
    }
  },
  methods: {
    init() { },
    // 获取数据列表
    async getDataList() {
      this.dataListLoading = true
      await this.init()
      await this.$axios.get(
        this.mixinViewModuleOptions.getDataListURL,
        {
          params: {
            //order: this.order,  //排序
            //orderField: this.orderField,  //排序字段
            page: this.mixinViewModuleOptions.getDataListIsPage ? this.page : null,
            pageSize: this.mixinViewModuleOptions.getDataListIsPage ? this.pageSize : null,
            ...this.dataForm
          }
        }
      ).then(res => {
        this.dataListLoading = false
        this.dataList = this.mixinViewModuleOptions.getDataListIsPage ? res.data : res
        // this.dataList.forEach((item,index)=>{
        //   // for(let i in item){
        //   //   this.dataList[index][i+"Temp"]=item[i]
        //   // } 
        // }) 
        this.total = this.mixinViewModuleOptions.getDataListIsPage ? res.totalCount : 0
      }).catch(() => {
        this.dataList = []
        this.total = 0
        this.dataListLoading = false
      })
    },
    // 多选
    dataListSelectionChangeHandle(val) {
      this.dataListSelections = val
    },
    // 排序
    dataListSortChangeHandle(data) {
      if (!data.order || !data.prop) {
        this.order = ''
        this.orderField = ''
        return false
      }
      this.order = data.order.replace(/ending$/, '')
      this.orderField = data.prop.replace(/([A-Z])/g, '_$1').toLowerCase()
      this.getDataList()
    },
    // 分页, 每页条数
    pageSizeChangeHandle(val) {
      this.page = 1
      this.pageSize = val
      this.getDataList()
    },
    // 分页, 当前页
    pageCurrentChangeHandle(val) {
      this.page = val
      this.getDataList()
    },
    // 新增 / 修改
    addOrUpdateHandle(id) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.dataForm.id = id
        this.$refs.addOrUpdate.init()
      })
    },
    beforDeleteHandle() { return true },
    // 删除
    deleteHandle(id) {
      if (this.beforDeleteHandle(id)) {
        if (!id && this.dataListSelections.length <= 0) {
          return this.$message({
            message: this.$t('prompt.deleteBatch'),
            type: 'warning',
          })
        }
        this.$confirm(this.$t('prompt.info', { 'handle': this.$t('delete') }), this.$t('prompt.title'), {
          confirmButtonText: this.$t('confirm'),
          cancelButtonText: this.$t('cancel'),
          type: 'warning'
        }).then(() => {
          // let  this.mixinViewModuleOptions.deleteIsBatch ?ids:id
          //console.log('ww', id, '--', id ? id : this.dataListSelections.map(item => item[this.mixinViewModuleOptions.deleteIsBatchKey]));//return
          this.$axios.delete(
            //`${this.mixinViewModuleOptions.deleteURL}${this.mixinViewModuleOptions.deleteIsBatch ? '' : '/?id=' + id}`,//
            `${this.mixinViewModuleOptions.deleteURL}`,
            this.mixinViewModuleOptions.deleteIsBatch ?
              { data: { ids: id ? [id] : this.dataListSelections.map(item => item[this.mixinViewModuleOptions.deleteIsBatchKey]) } }
              :
              { data: { id: id } }
            // { data: { id: id ? id : this.dataListSelections.map(item => item[this.mixinViewModuleOptions.deleteIsBatchKey]) } }
          ).then(res => {
            this.$message({
              message: this.$t('prompt.success'),
              type: 'success',
              duration: 500,
              onClose: () => {
                this.getDataList()
              }
            })
          }).catch(() => { })
        }).catch(() => { })
      }
    },
    //批量设置
    allUpdateHandle() {
      if (this.dataListSelections.length <= 0) {
        return this.$message({
          message: "请勾选选项",
          type: 'warning',
        })
      }
      this.allUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.allUpdate.dataForm.ids = this.dataListSelections.map(item => item[this.mixinViewModuleOptions.deleteIsBatchKey])
        this.$refs.allUpdate.init()
      })
    },

    // 临时表单提交-单个编辑  field字段, id, val值, confirm是否确认
    tempFormSubmitHandle(option) {
      let o = {
        field: option.field,
        id: option.id,
        value: option.value,
        confirm: option.confirm || false,
        isArray: option.isArray || false,
      }
      //console.log('o',o,option);
      let tempForm = {
        [o.field]: o.isArray == true ? [o.value] : o.value,
        id: o.id
      };
      //console.log('tempForm',tempForm); return
      if (o.confirm == true) {
        this.$confirm("确认操作?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            this.tempDoSubmit(tempForm, o.value, o.confirm);
          })
          .catch(() => { });
      } else {
        this.tempDoSubmit(tempForm, o.value);
      }
      //console.log("tempForm", tempForm);
      //return;

    },
    tempDoSubmit(tempForm, value, confirm) {
      document.querySelector("#app").click();
      this.$axios["put"](
        this.mixinViewModuleOptions.tempUpdateURL,
        tempForm
        //{ headers: { "content-type": "application/x-www-form-urlencoded" } }
      ).then(res => {
        if (confirm) {
          this.getDataList()
        } else {
          this.$emit("update:value", value)
        }
        this.$message({
          message: this.$t("prompt.success"),
          type: "success",
          duration: 500
        });
      }).catch(() => {
        this.$message({
          message: this.$t("prompt.failed"),
          type: "success",
          duration: 500
        });
        //this.getDataList()
      })
    },
    // 导出
    exportHandle() {
      var params = qs.stringify({
        'token': cookieGet('token'),
        ...this.dataForm
      })
      window.location.href = `${window.SITE_CONFIG['apiURL']}${this.mixinViewModuleOptions.exportURL}?${params}`
    }
  }
}
