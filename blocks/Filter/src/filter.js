import api from '../../../../business/api'

Component({
  properties: {
    handleSetActionSheetOption: {
      type: Function
    },
    initStatus: {
      type: Boolean,
      value: false,
      observer(val) {
        if(!val) return
        const { viewList } = this.data
        viewList.forEach(item => {
          item.title = item.defaultTitle
          item.value = ''
        })
        this.setData({viewList})
      }
    },
  },
  lifetimes: {
    attached() {
      this.handleBuildFromAction()
    }
  },
  attached() {
    this.handleBuildFromAction()
  },
  data: {
    icons: {
      search: '/images/stroke/search.png',
    },
    showActionSheet: false,
    selectIndex: '',
    actionSheetOptions: {},
    actionSheetList: [],
    viewList: [
      { // 客户意向 1超高意向、2高意向、3中等意向、4无意向
        title: '意向',
        defaultTitle: '意向',
        value: '',
        list: [
          {
            title: '全部',
            value: ''
          },
          {
            title: 'A超高意向',
            value: 1
          },
          {
            title: 'B高意向',
            value: 2
          },
          {
            title: 'C一般意向',
            value: 3
          },
          {
            title: 'D无意向',
            value: 4
          },
        ]
      },
      { // 带看状态 0未带看，1已带看
        title: '带看状态',
        defaultTitle: '带看状态',
        value: '',
        list: [
          {
            title: '全部',
            value: ''
          },
          {
            title: '未带看',
            value: 0
          },
          {
            title: '已带看',
            value: 1
          }
        ]
      },
    ]
  },
  methods: {
    handleBuildFromAction() {
      const { viewList } = this.data
      api.getClueTypeEnumeration().then(res => {
        const { value } = res || {}
        if(!value) {
          wx.showToase({
            title: '获取来源失败，请稍后重试',
            icons: 'none',
          })
        }
        const result = { // 来源（线索类型） 
          title: '来源',
          defaultTitle: '来源',
          value: '',
          list: [{
              title: '全部',
              value: ''
            }].concat(value.map(item => {
              return {
                title: item.desc,
                value: item.type
              }
            }))
        }
  
        if(viewList.length > 2) {
          viewList.splice(2, 1, result)
        } else {
          viewList.push(result)
        }
        
        this.setData({viewList})
      }).catch(err => {
        console.log(err)
        wx.showToase({
          title: '获取来源失败，请稍后重试',
          icons: 'none',
        })
      })
    },
    handleShowActionSheet(e) {
      const { key, value } = e.currentTarget.dataset
      const { viewList } = this.data
      const list = viewList[key].list
      list.forEach(item => item.isactive = item.value + '' === value + '')
      const actionSheetList = list || []
      this.data.selectIndex = key

      this.setData({
        actionSheetList,
      }, () => {
        this.setData({showActionSheet: true})
      })
    },
    handleVisibleDialog() {
      this.setData({ showActionSheet: false })
    },
    changeActionSheetStatus() {
      this.setData({ showActionSheet: false })
    },
    handleSelect(e) {
      console.log(e)
    },
    handleConfirm(e) {
      const { detail } = e
      let { selectdata, selecttitle, selectvalue, type } = detail || []
      const { selectIndex, viewList } = this.data
      selecttitle = selecttitle + ''
      selectvalue = selectvalue + ''

      if (selectvalue === '') {
        viewList[selectIndex].title = viewList[selectIndex].defaultTitle
      } else {
        viewList[selectIndex].title = selecttitle
      }
      if (viewList[selectIndex].title.length > 4) {
        viewList[selectIndex].title = viewList[selectIndex].title.slice(0, 4) + '...'
      }
      
      viewList[selectIndex].value = selectvalue
      this.setData({ viewList })
      const result = viewList.map(item => item.value)
      this.triggerEvent('confirm', {
        customerIntent: result[0],
        lookState: result[1],
        clueType: result[2]
      })
    },
    toClickCustomerTrack() {
      this.triggerEvent('toClickCustomerTrack')
    }
  }
})
