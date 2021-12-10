Component({
  properties: {
    actionSheetOptions: {
      type: Object,
      value: () => {
        return { }
      },
      observer(val) {
        const { options } = this.data
        this.setData({options: Object.assign(options, val)})
      }
    },
    actionSheetList: {
      type: Array,
      value: () => [],
      observer(val) {
        this.setData({sheetList: val && JSON.parse(JSON.stringify(val)) || []})
      }
    },
    showActionSheet: {
      type: Boolean,
      value: false,
      observer(val) {
        const { actionSheetList } = this.properties
        if(typeof val !== 'undefined') this.setData({ showView: val, sheetList: actionSheetList && JSON.parse(JSON.stringify(actionSheetList)) || [] })
      }
    },
    viewStyle: {
      type: String,
      value: ''
    }
  },
  data: {
    sheetList: [],
    showView: false,
    options: {
      type: 'radio', // radio - checkbox
    }
  },
  lifetimes: {
    attached() {
    },
    detached() {
    }
  },
  methods: {
    changeNoActionSheetStatus() {},
    changeActionSheetStatus() {
      this.setData({ showView: false })
      this.triggerEvent('changeActionSheetStatus', false)
    },
    handleSelect(e) {
      let { options: { type }, sheetList } = this.data
      const { currentTarget: { dataset: { data, index } } } = e
      const { isactive } = data || {}
      if(type === 'checkbox') sheetList[index] && (sheetList[index].isactive = !isactive)
      if(type === 'radio') sheetList = sheetList.map((item, inx) => { return{ ...item, isactive: inx === index }})
      this.setData({ sheetList })
    },
    handleConfirm() {
      const { options: { type }, sheetList } = this.data
      const selectdata = sheetList.filter(item => item.isactive)
      const result = {
        type,
        selectdata,
        selecttitle: selectdata.map(item => item.title),
        selectvalue: selectdata.map(item => item.value)
      }

      this.changeActionSheetStatus()
      this.triggerEvent('confirm', result)
    }
  },
})
