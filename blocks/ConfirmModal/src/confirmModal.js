/**
 * 确认弹框
 * 确认弹框里的内容支持可配置化
 * 点击取消时，发起modalCancel事件；点击确认按钮时，发起modalConfirm事件，通知父组件

 */
Component({
  properties: {
    cancelText: {
      type: String,
      value: '取消'
    },
    confirmText: {
      type: String,
      value: '确定'
    },
    showCancel: { // 是否显示取消按钮
      type: Boolean,
      value: true
    },
    isSpecialModal: { // 是否展示特殊的弹框样式
      type: Boolean,
      value: false
    },
    isShowCloseBtn: { // 是否展示右上角的关闭按钮
      type: Boolean,
      value: false
    }
  },
  data: {
    isShow: false, // 默认弹窗是关闭的
    imgIcons: {
      circleClose: './images/circle_close.png'
    }
  },
  methods: {
    toggleModal(isShow = true) { // 开启、关闭弹框
      this.setData({
        isShow
      })
    },
    confirm() { // 确认按钮
      this.triggerEvent('modalConfirm')
    },
    cancel() { // 取消按钮
      this.triggerEvent('modalCancel')
      this.toggleModal(false)
    },
    handleClickMask() { // 点击蒙层
      if (this.data.showCancel) {
        this.cancel()
      }
    },
    clickModal() {
      return false
    },
    preventD() {

    }
  }
})
