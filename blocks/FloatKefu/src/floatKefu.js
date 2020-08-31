/**
 * 确认弹框
 * 确认弹框里的内容支持可配置化
 * 点击取消时，发起modalCancel事件；点击确认按钮时，发起modalConfirm事件，通知父组件

 */
Component({
  properties: {
    phoneNumber: {
      type: String,
      value: '400 606 5500'
    },
    showTime: {
      type: Number,
      value: 3000
    },
  },
  data: {
    showKefuLabel: false, // 是否展示客服按钮
  },
  methods: {
    // 客服点击
    kefuClick: function() {
      const { phoneNumber, showKefuLabel } = this.data
      // 未展示客服时，展示客服
      if (!showKefuLabel) {
        this.setData({
          showKefuLabel: true
        })
      } else {
        // 已经展示客服按钮了，拨打电话
        wx.makePhoneCall({
          phoneNumber: phoneNumber.replace(/\s/g, '')
        })
      }
      // 定时隐藏客服
      this.startHideKefuTimer()
    },
    // 定时隐藏客服
    startHideKefuTimer: function() {
      if (this.kefuTimer) {
        clearTimeout(this.kefuTimer)
        this.kefuTimer = null
      }

      // 定时隐藏客服
      this.kefuTimer = setTimeout(() => {
        this.setData({
          showKefuLabel: false
        })
        clearTimeout(this.kefuTimer)
        this.kefuTimer = null
      }, 3000)
    },
  }
})
