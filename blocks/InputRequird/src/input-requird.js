var run = true
Component({
  properties: {
    // 这里定义了 msg 属性，属性值可以在组件使用时指定
    title: String,
    type: String,
    unit: String,
    explain:String,
    value: String,
    maxlength: Number,
    placeholder: String,
    required: Boolean,
    disabled: Boolean,
    ruleStr: String,
    levelPriceMax: Number,
    levelPriceMin: Number
    // itemClickOne: Function,
  },
  data: {
    showAction:false,
  },
  methods: {
    inputBlur (e) {
      this.triggerEvent('inputBlur', e.detail || {})
    },
    inputDown(e) {
      var myEventDetail =  e.detail || {} // detail对象，提供给事件监听函数
      myEventDetail.isPass = true
      let rules = new RegExp(this.data.ruleStr)
      let inputvalue = myEventDetail.value

      let rulesValue = rules.test(inputvalue)

      if(inputvalue && rulesValue){
        if(this.properties.levelPriceMax){
          if(inputvalue <= this.properties.levelPriceMax && this.properties.levelPriceMin <= inputvalue ) {
              this.setData({
                showAction:false
              })
              myEventDetail.isPass = true
          }else{
              this.setData({
                showAction:true
              })
              myEventDetail.isPass = false
          }
        }else{
          this.setData({
            showAction:false
          })
          myEventDetail.isPass = true
        }
      } else if(this.properties.required){
        this.setData({
          showAction:true
        })
        myEventDetail.isPass = false
      }else{
        this.setData({
          showAction:false
        })
        myEventDetail.isPass = true
      } 
      this.triggerEvent('inputDown', myEventDetail)
    },
    lableExplain(){
      this.triggerEvent('lableExplain')
    },
    throttle(func, deley) {
      let run = true
      return function () {
        if (!run) {
          return  // 如果开关关闭了，那就直接不执行下边的代码
        }
        run = false // 持续触发的话，run一直是false，就会停在上边的判断那里
        setTimeout(() => {
          func.apply(this, arguments)
          run = true // 定时器到时间之后，会把开关打开
        }, deley)
      }
    }
  }
})
