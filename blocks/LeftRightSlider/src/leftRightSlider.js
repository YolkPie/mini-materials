/**
 * 左右滑动组件
 * 左滑时，左边滑块(leftPart)向左滑，右边滑块(rightPart)展示出来；
 * 左滑时，左边滑块(leftPart)向左滑，右边滑块(rightPart)展示出来；
 */
const commonMethods = require('../../business/commonMethods')
Component({
	options: {
		multipleSlots: true // 在组件定义时的选项中启用多slot支持
	},
	properties: {
		maxSlideWidth: { // 向左滑动的最大距离，注意后面携带的单位是rpx
			type: Number,
			value: 0,
			observer(val) {
				this.setData({
					translateX: val
				})
			}
		},
		isSlide: { // 是否滑动
			type: Boolean,
			value: true,
			observer(val) {
				console.log(val, '都解不开会')
			}
		}
	},
	data: {
		startX: 0, // 开始坐标
		startY: 0,
		translateX: 0, // X轴方向偏移的
		transitionStyle: ''
	},
	methods: {
		// 手指触摸动作开始 记录起点X坐标
		touchStartFn(e) {
			this.triggerEvent('touchStart')
			this.setData({
				transitionStyle: '',
				startX: e.changedTouches[0].clientX,
				startY: e.changedTouches[0].clientY
			})
		},
		// 手指触摸后移动
		touchMoveFn(e) {
			const { maxSlideWidth } = this.properties
			const { startX, startY } = this.data // 初始滑动坐标
			const { clientX: touchMoveX, clientY: touchMoveY} = e.changedTouches[0] // 滑动变化坐标
			const	angle = this.angle({
				X: startX,
				Y: startY
			}, {
				X: touchMoveX,
				Y: touchMoveY
			})
			if (Math.abs(angle) > 30) return
			let disX = commonMethods.toPxInt(startX - touchMoveX) // 滑动的距离
			let translateX
			// disX = Math.abs(disX)
			if (Math.abs(disX)  > maxSlideWidth) {
				disX = maxSlideWidth
			}
			translateX = disX >= 0 ? maxSlideWidth - disX : Math.abs(disX)
			this.setData({
				translateX
			})
		},
		touchEndFn(e) {
			const { maxSlideWidth } = this.properties
			const { startX } = this.data // 初始滑动坐标
			const { clientX: touchMoveX } = e.changedTouches[0] // 滑动变化坐标
			let disX = commonMethods.toPxInt(startX - touchMoveX) // 滑动的距离
			let translateX
			if (Math.abs(disX) >= maxSlideWidth / 3) {
				translateX = disX > 0 ? 0 : maxSlideWidth
			} else {
				translateX = disX > 0 ? maxSlideWidth : 0
			}
			this.setData({
				transitionStyle: 'transition: all 0.4s',
				translateX
			})
			this.triggerEvent('touchEnd')
		},
		/**
		 * 计算滑动角度
		 * @param {Object} start 起点坐标
		 * @param {Object} end 终点坐标
		 */
		angle(start, end) {
			var _X = end.X - start.X, _Y = end.Y - start.Y
//返回角度 /Math.atan()返回数字的反正切值
			return 360 * Math.atan(_Y / _X) / (2 * Math.PI)
		},
	}
})
