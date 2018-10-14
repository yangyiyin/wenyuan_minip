
Component({
    options: {
        multipleSlots: true // 在组件定义时的选项中启用多slot支持
    },
    behaviors: [],
    properties: {
        visible:{
            type:Boolean,
            value:false,
            observer: function(newVal, oldVal, changedPath) {
                if (newVal) {
                    this.animation.bottom(0).step();
                    this.setData({
                        animationData:this.animation.export()
                    })
                } else {
                    var height = -this.data.height + 'rpx';
                    // console.log(height);
                    this.animation.bottom(height).step();
                    this.setData({
                        animationData:this.animation.export()
                    })
                }
            }
        },
        height:{
            type:Number,
            value:'100'
        }
    },
    data: {
        animation:null
    },
    attached(){
        this.animation = wx.createAnimation({
            duration: 200,
            timingFunction: "ease",
            delay: 0
        });

    },
    methods: {
        close(){
            this.setData({
                visible:false
            });
            this.triggerEvent('close');
        },
        none(){}
    }
});
