const { editStatusEnum, auditStatusEnum } = require("../../utils/constants.js");
Component({
  properties: {
    item: {
      type: Object,
      value: {}
    },
    editStatus: {
      type: String,
      value: editStatusEnum.notPublished.value
    },
    disabled: {
      type: Boolean,
      value: false
    }
  },
  data: {
    item: {}, // 详情数据
    editStatusEnum, // 拍品状态枚举
    auditStatusEnum, // 审核状态枚举
  },
  methods: {
    // 删除
    deleteHandle (e) {
      const skuDetailId = e.currentTarget.dataset.id
      this.triggerEvent('delete', {
        skuDetailId
      })
    },
    // 立即发布
    publishHandle (e) {
      const skuDetailId = e.currentTarget.dataset.id
      this.triggerEvent('publish', {
        skuDetailId
      })
    },
    /**
     * 跳转详情
     */
    linkHandle (e) {
      const skuDetailId = e.currentTarget.dataset.id
      this.triggerEvent('link', {
        skuDetailId
      })
    },
    /**
     * 查看历史详情
     */
    viewHandle (e) {
      const skuDetailId = e.currentTarget.dataset.id
      this.triggerEvent('view', {
        skuDetailId
      })
    },
    /**
     * 还原
     */
    restoreHandle (e) {
      const skuDetailId = e.currentTarget.dataset.id
      this.triggerEvent('restore', {
        skuDetailId
      })
    },
    /**
     * 查看驳回原因
     * @param {} e 
     */
    checkReasonHandle (e) {
      const skuDetailId = e.currentTarget.dataset.id
      this.triggerEvent('checkreason', {
        skuDetailId
      })
    }
  }
});
