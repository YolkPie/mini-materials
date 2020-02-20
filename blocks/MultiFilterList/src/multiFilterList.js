/**
 * 多级筛选列表组件
 * 选择列表成功后，发起onSelectSearchFilter事件，通知父组件
 */
const filterListData = require('./mockData/filterListData.js')

Component({
	data: {
		icons: {
			downArrowIcon: './images/gray_down_arrow.png',
			upArrowIcon: './images/gray_up_arrow.png'
		},
		isShowFilterList: false, // 是否展示列表选择列表
		handledFilterInfo: {
			firstFilterList: [], // 一级列表
			secondFilterList: [], // 二级列表
			thirdFilterList: [], // 三级列表
			selectedResult: [],
			finalSelectedName: '' // 最终选择的列表名称
		},
		savedFilterInfo: {
			firstFilterList: [], // 一级列表
			secondFilterList: [], // 二级列表
			thirdFilterList: [], // 三级列表
		},
		scrollSecondTopHeight: 0
	},
	pageLifetimes: {
		hide() {
			this.hideFilterList()
		}
	},
	lifetimes: {
		attached() {
			let { firstFilterList } = filterListData
			firstFilterList = JSON.parse(JSON.stringify(firstFilterList))
			this.initFilterInfo(firstFilterList)
		}
	},
	methods: {
		initFilterInfo(firstFilterList) { // 初始化，获取一级列表
			const selectedResult = []
			if (firstFilterList.length) {
				firstFilterList.forEach((item, index) => {
					const curItem = item
					curItem.selected = (index === 0)
					return curItem
				})
				let { handledFilterInfo } = this.data
				const secondFilterList = JSON.parse(JSON.stringify(filterListData.secondFilterList)) || []
				secondFilterList.unshift({
					name: '全部区域',
					id: 0,
					selected: true
				})
				selectedResult.push({
					name: secondFilterList[0].name,
					id: secondFilterList[0].id,
				})
				handledFilterInfo = {
					...handledFilterInfo,
					firstFilterList,
					secondFilterList,
					selectedResult
				}
				this.setData({
					handledFilterInfo,
					savedFilterInfo: JSON.parse(JSON.stringify(handledFilterInfo))
				})
			}
		},
		showFilterList() { // 展示列表列表
			this.setData({
				isShowFilterList: !this.data.isShowFilterList
			})
		},
		hideFilterList() { // 隐藏列表列表
			this.setData({
				isShowFilterList: false,
				handledFilterInfo: JSON.parse(JSON.stringify(this.data.savedFilterInfo))
			})
		},
		toFilterSelect({ handledFilterInfo }) { // 确定选择某一列表，列表选择框隐藏
			const { selectedResult } = handledFilterInfo
			this.triggerEvent('onSelectSearchFilter', selectedResult)
			const curHandledFilterInfo = handledFilterInfo
			curHandledFilterInfo.finalSelectedName = selectedResult[selectedResult.length - 1].name
			this.setData({
				isShowFilterList: false,
				handledFilterInfo: curHandledFilterInfo,
				savedFilterInfo: JSON.parse(JSON.stringify(curHandledFilterInfo))
			})
			console.log(selectedResult, '多级筛选列表组件选择的结果')
		},
		getFilterData({ nextFilterLevel, id = '' }) {
			return new Promise((resolve, reject) => {
				switch (nextFilterLevel) {
					case 2: // 二级列表
						resolve(JSON.parse(JSON.stringify(filterListData.secondFilterList)))
					case 3: // 三级列表
						resolve(JSON.parse(JSON.stringify(filterListData.thirdFilterList)))
					default:
						reject('获取筛选列表数据失败')
				}
			})
		},
		addressItemClick(e) {
			if (e && e.currentTarget && e.currentTarget.dataset) {
				// filterLevel 当前选中的级别，1：一级列表；2：二级列表；3：三级列表
				const param = e.currentTarget.dataset
				const { id = '', name = '' } = param
				let { filterLevel } = param
				filterLevel = Number(filterLevel)
				const handledFilterInfo = this.data.handledFilterInfo || {}
				let { selectedResult } = handledFilterInfo
				const areaKey = ['firstFilterList', 'secondFilterList', 'thirdFilterList']
				const firstItemNameArr = [{
					name: '全部城区',
					id: 0,
				}, {
					name: '全部商圈',
					id: 0,
				}]
				const curFilterKey = areaKey[filterLevel - 1]
				const nextFilterKey = areaKey[filterLevel]
				for (let i = filterLevel; i < areaKey.length; i++) { // 清空下一级列表的数据
					handledFilterInfo[areaKey[i]] = []
				}
				selectedResult = selectedResult.slice(0, filterLevel - 1)
				handledFilterInfo[curFilterKey].forEach((item) => {
					const curItem = item
					curItem.selected = item.id === id
				})
				if (filterLevel > 1 && id === 0) { // 当点击'全部区域'或'全部商圈'时
					handledFilterInfo.selectedResult = selectedResult
					this.toFilterSelect({ handledFilterInfo })
				} else {
					selectedResult.push({
						name,
						id
					})
					handledFilterInfo.selectedResult = selectedResult
					if (filterLevel < 3) { // 点击一级列表或者二级列表
						this.getFilterData({
							nextFilterLevel: parseInt(filterLevel, 10) + 1,
							id
						})
							.then((resData) => {
								const resultData = resData || []
								if (resultData.length) {
									resultData.unshift(firstItemNameArr[filterLevel - 1])
									handledFilterInfo[nextFilterKey] = resultData
									this.setData({ handledFilterInfo })
									if (filterLevel === 1) {
										this.setData({
											scrollSecondTopHeight: 0
										})
									}
								} else {
									this.toFilterSelect({ handledFilterInfo })
								}
							})
							.catch((err) => {
								// eslint-disable-next-line
								console.log(err, 'get filter data err!')
							})
					} else { // 点击三级列表
						this.toFilterSelect({ handledFilterInfo })
					}
				}
			}
		},
	}
})
