import utils from './util'

/**
 * 画圆角矩形、圆角边框和圆角图片所用到的方法
 * @param params
 * @param ctx
 */
const toDrawRadiusRect = (params, ctx) => {
  const {
    left, top, width, height, borderRadius,
    borderTopLeftRadius, borderTopRightRadius, borderBottomRightRadius, borderBottomLeftRadius
  } = params
  ctx.beginPath()
  if (borderRadius) {
    // 全部有弧度
    const br = borderRadius / 2
    ctx.moveTo(left + br, top) // 移动到左上角的点
    ctx.lineTo(left + width - br, top) // 画上边的线
    ctx.arcTo(left + width, top, left + width, top + br, br) // 画右上角的弧
    ctx.lineTo(left + width, top + height - br) // 画右边的线
    ctx.arcTo(left + width, top + height, left + width - br, top + height, br) // 画右下角的弧
    ctx.lineTo(left + br, top + height) // 画下边的线
    ctx.arcTo(left, top + height, left, top + height - br, br) // 画左下角的弧
    ctx.lineTo(left, top + br) // 画左边的线
    ctx.arcTo(left, top, left + br, top, br) // 画左上角的弧
  } else {
    const topLeftBr = borderTopLeftRadius ? borderTopLeftRadius / 2 : 0
    const topRightBr = borderTopRightRadius ? borderTopRightRadius / 2 : 0
    const bottomRightBr = borderBottomRightRadius ? borderBottomRightRadius / 2 : 0
    const bottomLeftBr = borderBottomLeftRadius ? borderBottomLeftRadius / 2 : 0
    ctx.moveTo(left + topLeftBr, top)
    ctx.lineTo(left + width - topRightBr, top)
    if (topRightBr) { // 画右上角的弧度
      ctx.arcTo(left + width, top, left + width, top + topRightBr, topRightBr)
    }
    ctx.lineTo(left + width, top + height - bottomRightBr) // 画右边的线
    if (bottomRightBr) { // 画右下角的弧度
      ctx.arcTo(left + width, top + height,
        left + width - bottomRightBr, top + height, bottomRightBr)
    }
    ctx.lineTo(left + bottomLeftBr, top + height)
    if (bottomLeftBr) {
      ctx.arcTo(left, top + height, left, top + height - bottomLeftBr, bottomLeftBr)
    }
    ctx.lineTo(left, top + topLeftBr)
    if (topLeftBr) {
      ctx.arcTo(left, top, left + topLeftBr, top, topLeftBr)
    }
  }

  // 左右下角有弧度
  // ctx.moveTo(left, top)
  // ctx.lineTo(left + width, top)
  // ctx.lineTo(left + width, top + height - br)
  // ctx.arcTo(left + width, top + height, left + width - br, top + height, br)
  // ctx.lineTo(left + br, top + height)
  // ctx.arcTo(left, top + height, left, top + height - br, br)
  // ctx.lineTo(left, top)
  // 左右上角有弧度
  // ctx.moveTo(left + br, top) // 移动到左上角的点
  // ctx.lineTo(left + width - br, top) // 画上边的线
  // ctx.arcTo(left + width, top, left + width, top + br, br) // 画右上角的弧
  // ctx.lineTo(left + width, top + height)
  // ctx.lineTo(left, top + height)
  // ctx.lineTo(left, top + br)
  // ctx.arcTo(left, top, left + br, top, br)
  // 左上角有弧度
  // ctx.moveTo(left + br, top)
  // ctx.lineTo(left + width, top)
  // ctx.lineTo(left + width, top + height)
  // ctx.lineTo(left, top + height)
  // ctx.lineTo(left, top + br)
  // ctx.arcTo(left, top, left + br, top, br)
  //  右上角有弧度
  // ctx.moveTo(left, top)
  // ctx.lineTo(left + width - br, top)
  // ctx.arcTo(left + width, top, left + width, top + br, br)
  // ctx.lineTo(left + width, top + height)
  // ctx.lineTo(left, top + height)
  // ctx.lineTo(left, top)
  //  右下角有弧度
  // ctx.moveTo(left, top)
  // ctx.lineTo(left + width, top)
  // ctx.lineTo(left + width, top + height - br)
  // ctx.arcTo(left + width, top + height, left + width - br, top + height, br)
  // ctx.lineTo(left, top + height)
  // ctx.lineTo(left, top)
  //  左下角有弧度
  // ctx.moveTo(left, top)
  // ctx.lineTo(left + width, top)
  // ctx.lineTo(left + width, top + height)
  // ctx.lineTo(left + br, top + height)
  // ctx.arcTo(left, top + height, left, top + height - br, br)
  // ctx.lineTo(left, top)
}

/**
 * 画顶部或底部有弧度的矩形或图片需要用到的方法
 * @param params
 * @param topRadianHeight 顶部弧度，大于0为顶部凸，小于0为顶部凹
 * @param bottomRadianHeight 底部弧度，大于0为底部凸，小于0为底部凹
 * @param ctx
 */
const toDrawArcRect = (params, ctx) => { // 画上下左右方向有弧度的矩形
  const {
    left, top, width, height,
    topRadianHeight, bottomRadianHeight
  } = params

  const halfWidth = width / 2
  const radianHeight = topRadianHeight || bottomRadianHeight || 0
  const r = (halfWidth * halfWidth + radianHeight * radianHeight) / (2 * Math.abs(radianHeight))
  const radiusX = left + halfWidth // 圆心X的坐标
  const radianValue = Math.acos(halfWidth / r) // 弧度
  ctx.beginPath()
  if (bottomRadianHeight) { // 底部凸
    if (bottomRadianHeight > 0) {
      ctx.arc(radiusX, top + height - r, r, radianValue, -radianValue + Math.PI)
      ctx.lineTo(left, top)
      ctx.lineTo(left + width, top)
      ctx.lineTo(left + width, top - radianHeight + height)
    } else { // 底部凹
      ctx.arc(radiusX, top + height + r + radianHeight, r, radianValue - Math.PI, -radianValue)
      ctx.lineTo(left + width, top)
      ctx.lineTo(left, top)
      ctx.lineTo(left, top + height)
    }
    return
  }
  if (topRadianHeight) {
    if (topRadianHeight > 0) { // 顶部凸
      ctx.arc(radiusX, top + r, r, radianValue - Math.PI, -radianValue)
      ctx.lineTo(left + width, top + height)
      ctx.lineTo(left, top + height)
      ctx.lineTo(left, top + radianHeight)
    } else { // 顶部凹
      ctx.arc(radiusX, top - r - topRadianHeight, r, radianValue, -radianValue + Math.PI)
      ctx.lineTo(left, top + height)
      ctx.lineTo(left + width, top + height)
      ctx.lineTo(left + width, top)
    }
  }
}

/**
 * 填充矩形
 * @param params(传参的单位是rpx)
 * @param ctx
 */
const drawRectRpx = (params, ctx) => {
  ctx.save()
  const {
    top = 0,
    left = 0,
    width = 0,
    height = 0,
    background,
    borderRadius, borderTopLeftRadius, borderTopRightRadius,
    borderBottomRightRadius, borderBottomLeftRadius,
    bottomRadianHeight, topRadianHeight,
    shadow
  } = params
  ctx.fillStyle = background
  if (shadow) {
    const { color = '#fff' } = shadow
    let { offsetX = 0, offsetY = 0, blur = 0 } = shadow
    if (offsetX) {
      offsetX = utils.toPx(offsetX)
    }
    if (offsetY) {
      offsetY = utils.toPx(offsetY)
    }
    if (blur) {
      blur = utils.toPx(blur)
    }
    ctx.setShadow(offsetX, offsetY, blur, color)
  }
  if (borderRadius || borderTopLeftRadius || borderTopRightRadius
    || borderBottomRightRadius || borderBottomLeftRadius) {
    toDrawRadiusRect(params, ctx)
    ctx.fill()
  } else if (bottomRadianHeight || topRadianHeight) {
    toDrawArcRect(params, ctx)
    ctx.fill()
  } else {
    ctx.fillRect(left, top, width, height)
  }
  ctx.restore()
}

// 画文字的下划线
const drawTextLine = ({
  left, top, textDecoration, color, fontSize, content
}, ctx) => {
  if (textDecoration === 'underline') {
    drawRectRpx({
      background: color,
      top: top + fontSize * 1.2,
      left: left - 1,
      width: ctx.measureText(content).width + 3,
      height: 1
    }, ctx)
  } else if (textDecoration === 'line-through') {
    drawRectRpx({
      background: color,
      top: top + fontSize * 0.6,
      left: left - 1,
      width: ctx.measureText(content).width + 3,
      height: 1
    }, ctx)
  }
}
/**
 * 填充文本
 * @param params
 * @param ctx
 */
const drawText = (params, ctx) => {
  ctx.save()
  const {
    maxLineNumber = '',
    color = 'black',
    content = '',
    baseLine = 'top',
    textAlign = 'left',
    bolder = false,
    textDecoration = 'none'
  } = params
  let {
    fontSize = 28,
    top = 0,
    left = 0,
    lineHeight = '',
    width
  } = params
  if (content) {
    fontSize = utils.toPx(fontSize)
    top = utils.toPx(top)
    left = utils.toPx(left)
    lineHeight = lineHeight ? utils.toPx(lineHeight) : fontSize + utils.toPx(12)
    if (width) {
      width = utils.toPx(width)
    }
    // ctx.setTextBaseline(baseLine)
    // ctx.setTextAlign(textAlign)
    // ctx.setFillStyle(color)
    ctx.textBaseline = baseLine
    ctx.textAlign = textAlign
    ctx.fillStyle = color
    if (ctx.font) {
      ctx.font = bolder ? `normal bold ${fontSize}px sans-serif` : `normal normal ${fontSize}px sans-serif`
    } else {
      ctx.setFontSize(fontSize)
      if (bolder) {
        const { left: oldLeft, top: oldTop } = params
        drawText({
          ...params,
          left: oldLeft + 0.3,
          top: oldTop + 0.3,
          bolder: false,
          textDecoration: 'none'
        }, ctx)
      }
    }
    if (!width) {
      ctx.fillText(content, left, top)
      drawTextLine({
        left,
        top,
        textDecoration,
        color,
        fontSize,
        content
      }, ctx)
    } else {
      let fillText = ''
      let fillTop = top + (lineHeight - fontSize) / 2
      let lineNum = 1
      for (let i = 0; i < content.length; i++) {
        fillText += [content[i]]
        // if (ctx.measureText(fillText).width > width) {
        let isChangeLine = false // 是否换下一行
        if (i < content.length - 1) {
          isChangeLine = ctx.measureText(fillText).width <= width
            && ctx.measureText(fillText + content[i + 1]).width > width
        }
        if (isChangeLine) {
          if (maxLineNumber && lineNum === maxLineNumber) {
            if (i !== content.length) {
              fillText = `${fillText.substring(0, fillText.length - 1)}...`
              ctx.fillText(fillText, left, fillTop)
              drawTextLine({
                left,
                top: fillTop,
                textDecoration,
                color,
                fontSize,
                content: fillText
              }, ctx)
              fillText = ''
              break
            }
          }
          ctx.fillText(fillText, left, fillTop)
          drawTextLine({
            left,
            top: fillTop,
            textDecoration,
            color,
            fontSize,
            content: fillText
          }, ctx)
          fillText = ''
          fillTop += lineHeight
          lineNum += 1
        }
      }
      ctx.fillText(fillText, left, fillTop)
      drawTextLine({
        left,
        top: fillTop,
        textDecoration,
        color,
        fontSize,
        content: fillText
      }, ctx)
    }
  }
  ctx.restore()
}

/**
 * 画线
 * @param params
 * @param ctx
 */
const drawLine = (params, ctx) => {
  const { color } = params
  let {
    startX = 0, startY = 0, endX = 0, endY = 0, width = 1
  } = params
  if (startX) {
    startX = utils.toPx(startX)
  }
  if (startY) {
    startY = utils.toPx(startY)
  }
  if (endX) {
    endX = utils.toPx(endX)
  }
  if (endY) {
    endY = utils.toPx(endY)
  }
  if (width) {
    width = utils.toPx(width)
  }
  ctx.save()
  ctx.beginPath()
  ctx.setStrokeStyle(color)
  ctx.setLineWidth(width)
  ctx.moveTo(startX, startY)
  ctx.lineTo(endX, endY)
  ctx.stroke()
  ctx.closePath()
  ctx.restore()
}

/**
 * 填充矩形
 * @param params(传参的单位是px)
 * @param ctx
 */
const drawRect = (params, ctx) => {
  const {
    top = 0,
    left = 0,
    width = 0,
    height = 0,
    borderRadius = 0,
    borderTopLeftRadius = 0, borderTopRightRadius = 0,
    borderBottomRightRadius = 0, borderBottomLeftRadius = 0,
    bottomRadianHeight = 0, topRadianHeight = 0
  } = params
  const curParams = {
    ...params,
    top: utils.toPx(top),
    left: utils.toPx(left),
    width: utils.toPx(width),
    height: utils.toPx(height),
    borderRadius: utils.toPx(borderRadius),
    borderTopLeftRadius: utils.toPx(borderTopLeftRadius),
    borderTopRightRadius: utils.toPx(borderTopRightRadius),
    borderBottomRightRadius: utils.toPx(borderBottomRightRadius),
    borderBottomLeftRadius: utils.toPx(borderBottomLeftRadius),
    bottomRadianHeight: utils.toPx(bottomRadianHeight),
    topRadianHeight: utils.toPx(topRadianHeight),
  }
  drawRectRpx(curParams, ctx)
}

/**
 * 绘制图像
 * @param params
 * @param ctx
 */
const drawImage = (params, ctx) => {
  const { url, deg = 0 } = params
  let {
    top = 0, left = 0, width = 0, height = 0,
    borderRadius = 0, borderTopLeftRadius = 0, borderTopRightRadius = 0,
    borderBottomRightRadius = 0, borderBottomLeftRadius = 0,
    bottomRadianHeight = 0, topRadianHeight = 0
  } = params
  if (url) {
    if (top) {
      top = utils.toPx(top)
    }
    if (left) {
      left = utils.toPx(left)
    }
    if (width) {
      width = utils.toPx(width)
    }
    if (height) {
      height = utils.toPx(height)
    }
    if (borderRadius) {
      borderRadius = utils.toPx(borderRadius)
    }
    if (borderTopLeftRadius) {
      borderTopLeftRadius = utils.toPx(borderTopLeftRadius)
    }
    if (borderTopRightRadius) {
      borderTopRightRadius = utils.toPx(borderTopRightRadius)
    }
    if (borderBottomRightRadius) {
      borderBottomRightRadius = utils.toPx(borderBottomRightRadius)
    }
    if (borderBottomLeftRadius) {
      borderBottomLeftRadius = utils.toPx(borderBottomLeftRadius)
    }
    if (bottomRadianHeight) {
      bottomRadianHeight = utils.toPx(bottomRadianHeight)
    }
    if (topRadianHeight) {
      topRadianHeight = utils.toPx(topRadianHeight)
    }
    ctx.save()
    if (borderRadius || borderTopLeftRadius || borderTopRightRadius
      || borderBottomRightRadius || borderBottomLeftRadius) {
      // 第一种方案
      toDrawRadiusRect({
        top,
        left,
        width,
        height,
        borderRadius,
        borderTopLeftRadius,
        borderTopRightRadius,
        borderBottomRightRadius,
        borderBottomLeftRadius
      }, ctx)
      ctx.strokeStyle = 'rgba(255,255,255,0)'
      ctx.stroke()
      ctx.clip()
      // eslint-disable-next-line
      toDrawImage()
      return
    }
    if (bottomRadianHeight || topRadianHeight) {
      toDrawArcRect({
        top,
        left,
        width,
        height,
        bottomRadianHeight,
        topRadianHeight
      }, ctx)
      ctx.strokeStyle = 'rgba(255,255,255,0)'
      ctx.stroke()
      ctx.clip()
      // eslint-disable-next-line
      toDrawImage()
      return
    }
    // eslint-disable-next-line
    toDrawImage()
  }

  function toDrawImage() {
    if (deg !== 0) {
      ctx.translate(left + width / 2, top + height / 2)
      ctx.rotate((deg * Math.PI) / 180)
      ctx.drawImage(url, -width / 2, -height / 2, width, height)
    } else {
      ctx.drawImage(url, left, top, width, height)
    }
    ctx.restore()
  }
}
/**
 * 网络图片，需要先下载到本地
 * @param url
 * @returns {Promise<any>}
 */
const downloadImg = (url) => {
  const imgInfoCache = wx.getStorageSync('imgInfoCache') || {}
  return new Promise((resolve, reject) => {
    // eslint-disable-next-line
    const objExp = new RegExp(/^http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?/)
    // canvas 绘制图片，若是网络资源图片， 要通过 getImageInfo / downloadFile 先下载
    if (objExp.test(url)) {
      wx.getImageInfo({
        src: url,
        complete: (res) => {
          if (res.errMsg === 'getImageInfo:ok') {
            imgInfoCache[url] = res.path
            wx.setStorageSync('imgInfoCache', imgInfoCache)
            resolve(res.path)
          } else {
            reject()
          }
        }
      })
    } else {
      resolve(url)
    }
  })
}
/**
 * 获取或保存微信本地图片
 */
const getFileImageUrl = (url) => new Promise((resolve, reject) => {
  const imgInfoCache = wx.getStorageSync('imgInfoCache') || {}
  if (imgInfoCache[url]) {
    wx.getFileInfo({
      filePath: imgInfoCache[url],
      success: () => {
        resolve(imgInfoCache[url])
      },
      fail: () => {
        downloadImg(url)
          .then((downloadImgUrl) => {
            resolve(downloadImgUrl)
          })
          .catch(() => {
            reject()
          })
      }
    })
  } else {
    downloadImg(url)
      .then((downloadImgUrl) => {
        resolve(downloadImgUrl)
      })
      .catch(() => {
        reject()
      })
  }
})
/**
 * 创建canvas图片
 * @param url
 * @returns {Promise<any>}
 */
const createCanvasImage = (url, canvas) => new Promise((resolve, reject) => {
  let img = canvas.createImage()
  img.onload = () => {
    resolve(img)
  }
  // 部分图片链接会下载失败，此时将图片下载到本地，再执行
  img.onerror = () => {
    getFileImageUrl(url).then((downloadImgUrl) => {
      img = canvas.createImage()
      img.onload = () => {
        resolve(img)
      }
      img.onerror = () => {
        reject()
      }
      img.src = downloadImgUrl
    }).catch(() => {
      reject()
    })
  }
  img.src = url
})
/**
 * 获取图片信息
 * @param url
 * @returns {Promise<any>}
 */
const getImageInfo = (url) => new Promise((resolve, reject) => {
  const imgInfoCache = wx.getStorageSync('imgInfoCache') || {}
  if (imgInfoCache[url]) {
    wx.getFileInfo({
      filePath: imgInfoCache[url],
      success: () => {
        resolve(imgInfoCache[url])
      },
      fail: () => {
        downloadImg(url)
          .then((downloadImgUrl) => {
            resolve(downloadImgUrl)
          })
          .catch(() => {
            reject()
          })
      }
    })
  } else {
    downloadImg(url)
      .then((downloadImgUrl) => {
        resolve(downloadImgUrl)
      })
      .catch(() => {
        reject()
      })
  }
})
const getImagesInfo = (views) => {
  async function toGetImagesInfo() {
    const loadImgTask = []
    const imagesInfo = []
    for (let i = 0; i < views.length; i++) {
      if (views[i].type === 'image') {
        loadImgTask.push(getImageInfo(views[i].url))
      }
    }
    for (let j = 0; j < loadImgTask.length; j++) {
      // eslint-disable-next-line
      const imageInfo = await loadImgTask[j].catch(() => {
      }) || ''
      imagesInfo.push(imageInfo)
    }
    return imagesInfo
  }

  return new Promise((resolve) => {
    toGetImagesInfo()
      .then((res) => {
        resolve(res)
      })
      .catch(() => {
        resolve([])
      })
  })
}

/**
 * 画一个图片canvas
 * @param view
 * @param ctx
 * @returns {Promise<any>}
 */
const drawImageCanvas = (view, ctx) => new Promise((resolve) => {
  getImageInfo(view.url)
    .then((res) => {
      drawImage({
        ...view,
        url: res
      }, ctx)
      resolve()
    })
    .catch(() => {
      resolve()
    })
})
/**
 * 定义画所有图片的canvas任务
 * @param views
 * @param ctx
 * @returns {Promise<any>}
 */
const drawAllImagesCanvas = (views = [], ctx) => {
  const drawImgTask = []
  if (views && views.length) {
    for (let i = 0; i < views.length; i++) {
      drawImgTask.push(drawImageCanvas(views[i], ctx))
    }
  }
  return new Promise((resolve) => {
    Promise.all(drawImgTask)
      .then(() => {
        resolve()
      })
  })
}
/**
 * 将canvas导出生成指定大小的图片
 * @param params
 */
const saveCanvasImage = (params, _this) => {
  const {
    left = 0, top = 0, width, height, canvasId, canvas
  } = params
  wx.canvasToTempFilePath({
    canvasId,
    canvas,
    x: left,
    y: top,
    width,
    height,
    destWidth: width * 3,
    destHeight: height * 3,
    complete(res) {
      if (res.errMsg === 'canvasToTempFilePath:ok') {
        _this.triggerEvent('getCanvasImage', {
          tempFilePath: res.tempFilePath,
          errMsg: 'canvasToTempFilePath:ok'
        })
      } else {
        _this.triggerEvent('getCanvasImage', { errMsg: 'canvasToTempFilePath:fail' })
      }
    }
  }, _this)
}

/**
 * 清除canvas在该矩形区域内的内容
 * @param left
 * @param top
 * @param width
 * @param height
 * @param ctx
 */
const clearRect = (params, ctx) => {
  let {
    left = 0, top = 0, width = 0, height = 0
  } = params
  if (top) {
    top = utils.toPx(top)
  }
  if (left) {
    left = utils.toPx(left)
  }
  if (width) {
    width = utils.toPx(width)
  }
  if (height) {
    height = utils.toPx(height)
  }
  ctx.clearRect(left, top, width, height)
  ctx.draw(true)
}

export {
  drawText,
  drawTextLine,
  drawLine,
  drawRect,
  drawRectRpx,
  drawImage,
  getImageInfo,
  getImagesInfo,
  downloadImg,
  toDrawRadiusRect,
  toDrawArcRect,
  drawImageCanvas,
  drawAllImagesCanvas,
  saveCanvasImage,
  clearRect,
  createCanvasImage
}
