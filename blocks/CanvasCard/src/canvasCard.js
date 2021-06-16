import * as canvasApi from './canvasApi'

Component({
  properties: {
    canvasData: {
      type: Object,
      value: { views: [] },
      observer(newVal, oldVal) {
        if (newVal && newVal.views && newVal.views.length
          && JSON.stringify(newVal) !== JSON.stringify(oldVal)) {
          const { width = '', height = '' } = newVal
          if (newVal && width && height) {
            if (this.data.isShowCanvas) {
              this.setData({
                isShowCanvas: false
              }, () => {
                this.initCanvas(newVal)
              })
            } else {
              this.initCanvas(newVal)
            }
          }
        }
      }
    }
  },
  data: {
    isShowCanvas: false,

    canvasWidth: 0,
    canvasHeight: 0,
    canvasId: '',

    tempFileList: []
  },
  ctx: null,
  canvas: null,
  canvasToImgTime: 0, // canvas转化成图片的时间间隔（延迟保存图片，解决安卓生成图片错位bug）
  methods: {
    initCanvas(canvasData) {
      let {
        canvasId
      } = canvasData
      const {
        width, height, backgroundColor, views
      } = canvasData
      const canvasWidth = width
      const canvasHeight = height
      canvasId += new Date().getTime()
      this.setData({
        isShowCanvas: true,
        canvasId,
        canvasWidth,
        canvasHeight
      })
      wx.createSelectorQuery().in(this)
        .select(`#${canvasId}`)
        .fields({
          node: true,
          size: true,
        })
        .exec((res) => {
          if (res && res[0]) {
            const { node: canvas, width: cWidth, height: cHeight } = res[0]
            this.canvas = canvas
            this.ctx = canvas.getContext('2d')
            const dpr = wx.getSystemInfoSync().pixelRatio
            canvas.width = cWidth * dpr
            canvas.height = cHeight * dpr
            this.ctx.scale(dpr, dpr)
            if (backgroundColor) {
              this.ctx.fillStyle = backgroundColor
              this.ctx.fillRect(0, 0, canvasWidth, canvasHeight)
            }
            const { platform } = wx.getSystemInfoSync()
            if (platform === 'android') { this.canvasToImgTime = 500 }
            this.paintingCanvas({
              canvasId, canvasWidth: width, canvasHeight: height, views
            })
          }
        })
      // this.ctx = wx.createCanvasContext(canvasId, this)
      // if (backgroundColor) {
      //   this.ctx.fillStyle = backgroundColor
      //   this.ctx.fillRect(0, 0, canvasWidth, canvasHeight)
      // }
      // const { platform } = wx.getSystemInfoSync()
      // if (platform === 'android') { this.canvasToImgTime = 500 }
      // this.paintingCanvas({
      //   canvasId, canvasWidth: width, canvasHeight: height, views
      // })
    },
    // 获取图片信息并绘制图片
    drawImage(view) {
      return new Promise((resolve) => {
        if (view && view.type === 'image') {
          canvasApi.createCanvasImage(view.url, this.canvas).then((res) => {
            canvasApi.drawImage({
              ...view,
              url: res || ''
            }, this.ctx)
            resolve()
          }).catch(resolve)
        }
      })
    },
    // 绘制canvas上的内容
    paintingCanvas({
      canvasWidth, canvasHeight, views
    }) {
      views.map((item) => {
        const curItem = item
        if (!item.zIndex) { curItem.zIndex = 0 }
        return curItem
      })
      views.sort((a, b) => a.zIndex - b.zIndex)
      const imgViewsTask = []
      for (let i = 0; i < views.length; i++) {
        if (views[i].type === 'image') {
          imgViewsTask.push(this.drawImage(views[i]))
        } else if (views[i].type === 'text') {
          canvasApi.drawText(views[i], this.ctx)
        } else if (views[i].type === 'rect') {
          canvasApi.drawRect(views[i], this.ctx)
        } else if (views[i].type === 'line') {
          canvasApi.drawLine(views[i], this.ctx)
        }
      }
      Promise.all(imgViewsTask).then(() => {
        setTimeout(() => {
          canvasApi.saveCanvasImage({
            canvas: this.canvas, width: canvasWidth, height: canvasHeight
          }, this)
        }, this.canvasToImgTime)
      }).catch((err) => {
        // eslint-disable-next-line no-console
        console.log(err, 'poster err!')
      })
    },
    /**
     * 重绘canvas
     * @param views 重绘的内容
     * @param rectParams 重绘区域
     */
    repaintCanvas({ views, rectParams }) {
      canvasApi.clearRect(rectParams, this.ctx)
      const { width, height } = this.properties.canvasData
      const { canvasId } = this.data
      canvasApi.drawRect({ ...rectParams, width: width + 1 }, this.ctx)
      // canvasApi.drawRect(rectParams, this.ctx)
      this.paintingCanvas({
        canvasId, canvasWidth: width, canvasHeight: height, views
      })
    },
    // 清除canvas,重新全部绘制（解决在安卓端，canvas通过clearRect再重新绘制，导致文字样式布局错乱的问题）
    redrawCanvas() {
      this.setData({
        isShowCanvas: false
      }, () => {
        this.initCanvas(this.properties.canvasData)
      })
    }
  }

})
