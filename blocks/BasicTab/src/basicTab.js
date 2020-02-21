/**
 * 基础tab组件
 * tabs 标签选项，格式是[{ title: '标签1' }, { title: '标签2' }]
 * selectedIndex 激活标签对应的索引值，默认情况下是第一个
 * 切换选项时，抛出switchTabOption事件
 */
Component({
	properties: {
		tabs: {
			type: Array,
			value: []
		},
		selectedIndex: {
			type: Number,
			value: 1,
			observer(curVal, oldVal) {
				if (curVal && curVal !== oldVal) {
					this.setData({
						activeState: curVal
					})
				}
			}
		}
	},
	data: {
		activeState: 1
	},
	methods: {
		switchOption(e) {
			if (e && e.currentTarget && e.currentTarget.dataset) {
				const tabIndex = e.currentTarget.dataset.tabindex || 1
				this.setData({
					activeState: tabIndex
				})
				this.triggerEvent('switchTabOption', { activeState: tabIndex })
			}
		}
	}
})
