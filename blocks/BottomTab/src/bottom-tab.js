

Component({
  properties: {
    currentTab: String,
    isIphoneX:String
    // 这里定义了 msg 属性，属性值可以在组件使用时指定
    // title: String,
    // itemClickOne: Function,
  },
  data: {
    list: [
      {
        "selectedIconPath": "../../assets/img/1-1.png",
        "iconPath": "../../assets/img/1-2.png",
        "disabledIconPath": "../../assets/img/1-3.png",
        "pagePath": "pages/index/index",
        "text": "我的拍卖",
        "disabled": false,
        "badgeShow": false,
        "badgeText": ''
      }, {
        "selectedIconPath": "../../assets/img/2-1.png",
        "iconPath": "../../assets/img/2-2.png",
        "disabledIconPath": "../../assets/img/2-3.png",
        "pagePath": "pages/index/index",
        "text": "我的活动",
        "disabled": false,
        "badgeShow": false,
        "badgeText": ''
      }, {
        "selectedIconPath": "../../assets/img/3-1.png",
        "iconPath": "../../assets/img/3-2.png",
        "disabledIconPath": "../../assets/img/3-3.png",
        "pagePath": "pages/index/index",
        "text": "店铺成长",
        "disabled": true,
        "badgeShow": false,
        "badgeText": ''
      }, {
        "selectedIconPath": "../../assets/img/4-1.png",
        "iconPath": "../../assets/img/4-2.png",
        "disabledIconPath": "../../assets/img/4-3.png",
        "pagePath": "pages/index/index",
        "text": "推广大厅",
        "disabled": false,
        "badgeShow": false,
        "badgeText": ''
      }, {
        "selectedIconPath": "../../assets/img/5-1.png",
        "iconPath": "../../assets/img/5-2.png",
        "disabledIconPath": "../../assets/img/5-3.png",
        "pagePath": "pages/index/index",
        "text": "我的店铺",
        "disabled": false,
        "badgeShow": false,
        "badgeText": ''
      }
    ]
  },
  methods: {
    // 这里是一个自定义方法
    setIndexTab: function (e) {
      let index = e.currentTarget.dataset.index;
      let item = e.currentTarget.dataset.item;

      if (item.disabled) {
        console.log('新功能暂未开放哦~');
        return;
      }
      // this.setData({
      //   currentTab: index
      // })
      if (index == 0) {
        jd.redirectTo({
          // url: '/pages/portal/index?tab=0'
        })
      }else if(index == 1) {
        jd.navigateTo({
          // url: '/pages/albumManage/index'
        })
      }else if(index == 2) {
        jd.navigateTo({
          // url: '/pages/portal/index'
        })
      }else if(index == 3) {
        jd.redirectTo({
          // url: '/pages/portal/index?tab=3'
        })
      }else if(index == 4) {
        jd.navigateTo({
          // url: '/pages/storepage/index'
        })
      }
    },
  }

})
