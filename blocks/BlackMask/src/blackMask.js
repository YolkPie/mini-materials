Component({
  properties: {
    backgroundColor: {
      type: String,
      value: 'rgba(0, 0, 0, 0.6)'
    }
  },
	externalClasses: ['wrapper-class'],
	methods: {
    // 关闭遮罩层
    closeMask() {
      this.triggerEvent('closeMask')
    },
    preventMove() {}
  }
})
