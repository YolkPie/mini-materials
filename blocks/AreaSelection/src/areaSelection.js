/**
 * 区域选择组件实现
 * 区域选择成功后，发起onSelect事件，通知父组件
 */
const areaData = require('./mockData/areaData.js');
Component({
  data: {
    closeImg: './images/circle_close.png', // 关闭按钮图片地址
    isShowAreaSelection: true, // 是否展示区域选择组件
    handledAddressInfo: {
      isDirectCity: false,
      curTabIndex: 0, // tab标签当前选中状态
      areaLevel: 1, // 当前选中的级别，1: 省; 2: 市; 3: 区域; 4: 商圈
      addressTabList: [{
        name: '请选择省份'
      }], // tab标签展示的数据
      showedAdressList: [],
      firstAdressList: [],
      secondAdressList: [],
      thirdAdressList: [],
      fourthAdressList: [],
      areaSelectionResult: {} // 选择地址的结果
    },
    savedAddressInfo: {
      isDirectCity: false,
      curTabIndex: 0, // tab标签当前选中状态
      areaLevel: 1, // 当前选中的级别，1: 省; 2: 市; 3: 区域; 4: 商圈
      addressTabList: [{
        name: '请选择省份'
      }], // tab标签展示的数据
      firstAdressList: [],
      secondAdressList: [],
      thirdAdressList: [],
      fourthAdressList: [],
      areaSelectionResult: {} // 选择地址的结果
    }
  },
  lifetimes: {
    attached() {
    	// 渲染省份数据
			const firstAdressList = areaData.provinceList
			let { handledAddressInfo } = this.data
			handledAddressInfo = {
				...handledAddressInfo, firstAdressList, showedAdressList: firstAdressList
			}
			this.setData({
				handledAddressInfo,
				savedAddressInfo: JSON.parse(JSON.stringify(handledAddressInfo))
			})
    }
  },
  methods: {
    showAreaSelection() { // 展示区域选择组件
      this.setData({
        isShowAreaSelection: true
      })
    },
    hideAreaSelection() { // 隐藏区域选择组件
      this.setData({
        isShowAreaSelection: false,
        handledAddressInfo: JSON.parse(JSON.stringify(this.data.savedAddressInfo))
      })
    },
    getAreaSelectionResult({ isDirectCity, addressSelectionList }) { // 格式化选择的区域
      const resultIdKey = ['firstCode', 'secondCode', 'thirdCode', 'tradingAreaId']
      const resultNameKey = ['firstName', 'secondName', 'thirdName', 'tradingAreaName']
      const areaSelectionResult = {}; let
        level
      addressSelectionList.forEach((item, index) => {
        level = isDirectCity ? index + 1 : index
        if (isDirectCity && index === 0) {
          areaSelectionResult[resultIdKey[level - 1]] = item.id
          areaSelectionResult[resultNameKey[level - 1]] = item.name
          areaSelectionResult[resultIdKey[level]] = item.id
          areaSelectionResult[resultNameKey[level]] = item.name
        } else {
          areaSelectionResult[resultIdKey[level]] = item.id
          areaSelectionResult[resultNameKey[level]] = item.name
        }
      })
      return areaSelectionResult
    },
		// 选择最后一级地址后的操作
    toAreaSelect({
      handledAddressInfo, isDirectCity, addressSelectionList, showedAdressList
    }) {
      const areaSelectionResult = this.getAreaSelectionResult({
        isDirectCity, addressSelectionList
      })
      const curHandledAddressInfo = {
        ...handledAddressInfo, areaSelectionResult, showedAdressList
      }
      this.setData({
        isShowAreaSelection: false,
        handledAddressInfo: curHandledAddressInfo,
        savedAddressInfo: JSON.parse(JSON.stringify(curHandledAddressInfo))
      })
			// 通知父组件区域选择完成
      this.triggerEvent('onSelect', areaSelectionResult)
			console.log(areaSelectionResult, '选择的区域数据')
    },
		// 点击区域列表
    handleAddressClick(e) {
      if (e && e.currentTarget && e.currentTarget.dataset) {
        const { id = '', name = '' } = e.currentTarget.dataset
        const handledAddressInfo = this.data.handledAddressInfo || {}
        let {
          isDirectCity, areaLevel, addressTabList
        } = handledAddressInfo
        const { curTabIndex } = handledAddressInfo
        const addressTabName = ['请选择省份', '请选择城市', '请选择区域', '请选择商圈']
        const addressKey = ['firstAdressList', 'secondAdressList', 'thirdAdressList', 'fourthAdressList']
        let showedAdressList = []
        for (let i = curTabIndex + 1; i < addressKey.length; i++) { // 清空下一级地址的数据
          handledAddressInfo[addressKey[i]] = []
        }
        if (curTabIndex === 0) {
          isDirectCity = id && id <= 4
          if (isDirectCity) { areaLevel += 1 }
          handledAddressInfo.isDirectCity = isDirectCity
        }
        handledAddressInfo[addressKey[curTabIndex]].forEach((item) => {
          const curItem = item
          curItem.selected = item.id === id
        })
        addressTabList = addressTabList.slice(0, curTabIndex + 1)
        addressTabList[curTabIndex] = { name, id }
        if (areaLevel < 4) {
          this.getAreaData({ nextAreaLevel: areaLevel + 1, id }).then((resData) => {
            const result = resData || []
            let adressList = []
            if (areaLevel === 3) { // 下一级是商圈
              if (result.length) { // 有商圈数据
                result.forEach((item) => {
                  adressList.push({
                    name: item.name,
                    id: item.tradingAreaId
                  })
                })
              } else {
                //  该区域没有商圈数据，回调
                this.toAreaSelect({
                  handledAddressInfo,
                  isDirectCity,
                  addressSelectionList: addressTabList,
                  showedAdressList: handledAddressInfo[addressKey[curTabIndex]]
                })
                return
              }
            } else { // 下一级是城市、区域
              adressList = result
            }
            addressTabList.push({
              name: addressTabName[areaLevel]
            })
            handledAddressInfo[addressKey[curTabIndex + 1]] = adressList
            showedAdressList = adressList
            this.setData({
              handledAddressInfo: {
                ...handledAddressInfo,
                addressTabList,
                curTabIndex: curTabIndex + 1,
                areaLevel: areaLevel + 1,
                showedAdressList
              }
            })
          }).catch((err) => {
            // eslint-disable-next-line
            console.log(err, 'get area data err!')
          })
        } else { //  点击商圈，回调
          this.toAreaSelect({
            handledAddressInfo,
            isDirectCity,
            addressSelectionList: addressTabList,
            showedAdressList: handledAddressInfo[addressKey[curTabIndex]]
          })
        }
      }
    },
    getAreaData({ nextAreaLevel, id = '' }) { // 根据级别，请求相应的城市、区域或商圈数据
  		return new Promise((resolve, reject) => {
				switch (nextAreaLevel) {
					case 2: // 城市
						resolve(areaData.cityList)
					case 3: // 区域
						resolve(areaData.countyList)
					case 4: // 商圈
						resolve(areaData.tradingAreaList)
					default:
						reject('获取区域数据失败')
				}
			})
    },
		// 点击请选择省份/城市/区域/商圈tab标签
    handleTabClick(e) {
      if (e && e.currentTarget && e.currentTarget.dataset) {
        const { index = '' } = e.currentTarget.dataset
        const addressKey = ['firstAdressList', 'secondAdressList', 'thirdAdressList', 'fourthAdressList']
        const { handledAddressInfo } = this.data
        const showedAdressList = handledAddressInfo[addressKey[index]]
        const { isDirectCity } = handledAddressInfo
        const areaLevel = index > 0 && isDirectCity ? index + 2 : index + 1
        this.setData({
          handledAddressInfo: {
            ...handledAddressInfo, showedAdressList, curTabIndex: index, areaLevel
          }
        })
      }
    }
  }
})
