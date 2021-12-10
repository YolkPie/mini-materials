Component({
  properties: {
    gender: {
      type: String,
      value: 'other',
      observer(val) {
        const { url, width } = this.properties
        const { imgObj } = this.data
        const imageStyle = `width: ${width}rpx; height: ${width}rpx`
        if (url) return this.setData({ imgurl: url, imageStyle })
        this.setData({ imgurl: imgObj[val], imageStyle })
      }
    },
    width: {
      type: [String, Number],
      value: 86
    },
    url: {
      type: String,
      value: ''
    }
  },
  data: {
    imgurl: '',
    imageStyle: '',
    imgObj: {
      girl: './images/girl.png',
      boy: '/images/boy.png',
      other: './images/other.png',
    },
  },
  lifetimes: {
    attached() {

    }
  },
  methods: {
    handleImageLoadError() {
      const { gender } = this.properties
      const { imgObj } = this.data
      this.setData({ imgurl: imgObj[gender] })
    },
    toClickCustomerTrack() {
      this.triggerEvent('toClickCustomerTrack')
    }
  }
})
