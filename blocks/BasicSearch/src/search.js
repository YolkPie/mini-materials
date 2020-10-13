Component({
  properties: {
    placeholder: String,
    type: String,
    value: {
      type: String,
      observer (newVal) {
        if (newVal && newVal.length) {
          this.setData({
            inputValue: newVal
          })
        }
      }
    }
  },
  data: {
    inputValue: '',
    searchValue: '', // 初始搜索值，点击取消的时候要恢复到该值
    isFocus: false
  },
  methods: {
    /**
     * input框获取焦点
     */
    handleFocus() {
      this.setData({
        isFocus: true
      })
      this.triggerEvent('focus')
    },
    /**
     * input框输入操作
     */
    handleInput({detail: {value}}) {
      this.setData({
        inputValue: value
      })
    },
    /**
     * 清空搜索框
     */
    handleClear() {
      this.setData({
        inputValue: ''
      })
    },
    /**
     * 取消搜索
     */
    handleCancel() {
      const {
        searchValue
      } = this.data
      this.setData({
        isFocus: false,
        inputValue: searchValue
      })
      this.triggerEvent('blur')
      this.triggerEvent('searchcancel')
    },
    /**
     * 提交表单
     */
    handleConfirm({detail: {value}}) {
      this.setData({
        searchValue: value,
        isFocus: false
      })
      this.triggerEvent('search', {
        value
      })
      this.triggerEvent('blur')
    }
  },
});
