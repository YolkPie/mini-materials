//index.js
const { request } = require('../../utils/request.js');
const { upVideo } = require('../../utils/video.js');
const colorImgMsgMap = {
  '101': 'appkey不存在',
  '103': '图片文件异常，上传失败',
  '104': '不允许非*.jd*请求访问',
  '1': 'JFS授权码错误或无此授权码',
  '2': '未给业务设置目录生成方式',
  '3': '上传图片格式错误',
  '4': '图片大小不能超过5M',
  '5': '上传路径为空或图片不存在',
  '6': '水印位置为空',
  '7': '业务名或验证码错误'
};

Page({
  data: {
    mainImgList:[],
    upMainImgsLoadingList:[],
    wareImgs: [],
    videoId: ''
  },
  onLoad: function (option) {
  },
  formatImage(imgsrc){
      let nowarr = JSON.parse(JSON.stringify(this.data.wareImgs)) 
      nowarr.push(imgsrc)
      this.setData({
        wareImgs: nowarr
      })
      let imgList = JSON.parse(JSON.stringify(this.data.mainImgList))
      imgList.push({
        url: imgsrc,
        isTransparent: false
      })
      this.setData({
        mainImgList: imgList,
      })
  },
  chooseVideo(e){
    const this_ = this
    if(this.data.videoId){
      console.log('请删除视频之后再上传')
    }else{
      upVideo(function(id){
        if(id){
          this_.setData({
            videoId: id
          })
        }
      })
    }
  },
  goVideoPage(e){
    let id = e.currentTarget.dataset.id
    // h5页面，用京麦原生webview打开
    let url = 'https://jmai.m.jd.com/video?videoId=' + id
    jd.openJMWebView({
      url: url
    })
  },
  deleteVideo(e){
    let videoId = e.currentTarget.dataset.videoid
    let spuId = this.data.spuId
    if(spuId){
      request('/video/delRel.action', {
        wareId: spuId, 
        videoId: videoId
      }).then(Res => {
        if (Res) {
          console.log('删除视频成功~');
          this.setData({videoId: ''})
          
        } else {
          console.log('删除视频失败~');
        }
      }).catch(err => {
        console.log('删除视频失败~');
        console.log(err)
      })
    }else{
      console.log('删除视频成功~');
      this.setData({videoId: ''})
    }
    
  },
  chooseImage(e) {
    var this_ = this
    var numimg = 0
    var maxChooseCount = 9
      numimg = this.data.mainImgList.length
      if(this.data.mainImgList.length==10){
        console.log('商品主图最多上传10张')
        return
      }
      maxChooseCount = numimg>1 ? 10-numimg : 9

    jd.chooseImage({
      count: maxChooseCount, // 默认9
      sizeType: ['compressed','original'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function ({ tempFilePaths }) {
        if (
          !(tempFilePaths instanceof Array) ||
          tempFilePaths.length === 0
        ) {
          console.log('无图片~')
          return 
        }
        console.log(tempFilePaths,'图片上传选择返回')
            this_.setData({
              upMainImgsLoadingList: tempFilePaths
            })

        for(let i=0; i<tempFilePaths.length; i++){ 
          console.log(tempFilePaths.length,'上传图片的个数')     
          jd.uploadFile({
            url: 'https://pic.jd.com/0/45d9f3a448f345c3b2908bf218a3e58e', //后期上线需要修改color网关接口
            filePath: tempFilePaths[i],
            name: 'file',
            formData: {
              'user': 'test'
            },
            success ({ statusCode, data }) {
              if (statusCode !== 200) {
                console.log('图片网关接口异常~')
                return 
              }
              let dataobj = JSON.parse(data)
              if(dataobj.id == 1){
                if(/\.gif/.test(dataobj.msg)){
                  console.log('暂不支持gif图片')
                }else{
                  this_.formatImage(dataobj.msg)
                } 
              }else{
                let mms = colorImgMsgMap[dataobj.msg] || 'color接口请求失败'
                console.log(mms)
              }
              console.log('上传图片返回结果data',data)
            },
            fail: function (res) {
              console.log('fail上传图片', res)
            },
            complete: function (res) {             
                let imgListNew = JSON.parse(JSON.stringify(this_.data.upMainImgsLoadingList))
                imgListNew[i] = 'okimg'
                this_.setData({
                  upMainImgsLoadingList: imgListNew
                })
              console.log('complete上传图片', res)
            }
          })

        }

        // setTimeout(function(){
        //   if(type == 'detailimg'){
        //     this_.setData({
        //       upDesImgsLoadingList: []
        //     })
        //   }else{
        //     this_.setData({
        //       upMainImgsLoadingList: []
        //     })
        //   }
          
        // }, 30000)
        
      },
      fail: function (res) {
        console.log('fail', res)
      },
      complete: function (res) {
        console.log('complete', res)
      },
    })
  },
  deleteImageMain(e) {
    let index = e.currentTarget.dataset.imgid
    let imgListNew = JSON.parse(JSON.stringify(this.data.mainImgList))
    imgListNew.splice(index,1)
    let formListNew = JSON.parse(JSON.stringify(this.data.wareImgs))
    formListNew.splice(index,1)
    this.setData({
      mainImgList: imgListNew
    })
    this.setData({
      wareImgs: formListNew
    })
  }
})
