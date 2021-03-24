Component({
	properties: {
		isShow: {
			type: Boolean,
			value: false,
			observer(val) {
				const { isRender } = this.data
				if (val && !isRender) {
				  this.setData({ isRender: true })
				}
			}
		}
	},
	data: {
		isRender: false,
		upArrowIcon: 'https://img10.360buyimg.com/imagetools/jfs/t1/166877/1/3607/374/6007ee48Eb2c08ba1/9e31a859c9959c31.png'
	},
	methods: {
		toClickToTop() {
			if (this.properties.isShow) {
				wx.pageScrollTo({
					scrollTop: 0,
					duration: 300
				})
				this.triggerEvent('clickToTop')
			}
		}
	}
})
