Component({
	/**
	 * 组件的属性列表
	 */
	properties: {
		endTime: {
			value: 1000000,
			type: Number
		},
		startTime: {
			value: 1000000,
			type: Number
		}
	},
	externalClasses: ['wrapper-class', 'time-class'],
	/**
	 * 组件生命周期函数，在组件实例进入页面节点树时执行
	 */
	attached() {
		let timeleft = this.data.endTime - this.data.startTime
		this.countdown.call(this, timeleft)
	},

	/**
	 * 组件的初始数据
	 */
	data: {
		countdown: ["HH", "mm", "ss"]
	},

	/**
	 * 组件的方法列表
	 */
	methods: {
		countdown(timeleft) {
			if (timeleft <= 0) {
				this.triggerEvent("onEnd")
				return
			}
			let hours = this.format(Math.floor(timeleft / (60 * 60 * 1000)))
			let min = this.format(
				Math.floor((timeleft - hours * 60 * 60 * 1000) / (60 * 1000))
			)
			let sec = this.format(
				Math.floor(
					(timeleft - hours * 60 * 60 * 1000 - min * 60 * 1000) / 1000
				)
			)

			this.setData({countdown: [hours, min, sec]})
			setTimeout(this.countdown.bind(this, timeleft - 1000), 1000)
		},
		format(n) {
			return +n < 10 ? "0" + n : n
		}
	}
})
