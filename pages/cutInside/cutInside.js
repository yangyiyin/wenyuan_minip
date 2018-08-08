/**
 * Created by sail on 2017/6/1.
 */
import WeCropper from '../../vendor/we-cropper/we-cropper.js'
const app = getApp()
const device = wx.getSystemInfoSync()
const width = device.windowWidth
const height = device.windowHeight - 50
const rate = width / 750;

Page({
  data: {
    cropperOpt: {
      id: 'cropper',
      width,
      height,
      scale: 2.5,
      zoom: 8,
      cut: {
        x: (width - 300) / 2,
        y: (height - 300) / 2,
        width: 300,
        height: 300
      }
    }
  },
  touchStart (e) {
    this.wecropper.touchStart(e)
  },
  touchMove (e) {
    this.wecropper.touchMove(e)
  },
  touchEnd (e) {
    this.wecropper.touchEnd(e)
  },
  getCropperImage () {
    const self = this
    this.wecropper.getCropperImage((src) => {
      if (!self.uploaded) {
        wx.showToast({
          title: '请上传图片',
          icon: 'none'
        })
        return;
      }
      if (src) {
        // console.log(src)
        // wx.previewImage({
        //   current: '', // 当前显示图片的http链接
        //   urls: [src] // 需要预览的图片http链接列表
        // })
        app.globalData.current_cut_img = src;
        wx.navigateBack({
          delta: 1
        })
      } else {
        wx.showToast({
          title: '获取图片地址失败，请稍后重试',
          icon: 'none'
        })
        //console.log('获取图片地址失败，请稍后重试')
      }
    })
  },
  uploadTap () {
    const self = this

    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success (res) {
        const src = res.tempFilePaths[0]
        //  获取裁剪图片资源后，给data添加src属性及其值

        self.wecropper.pushOrign(src);
        self.uploaded = true;
      }
    })
  },
  onLoad (option) {

    option.w = parseInt(option.w * rate);
    option.h = parseInt(option.h * rate);
    const { cropperOpt } = this.data
    cropperOpt.cut = {
      x: (width - option.w) / 2,
      y: (height - option.h) / 2,
      width: option.w,
      height: option.h
    }
    new WeCropper(cropperOpt)
      .on('ready', (ctx) => {
        console.log(`wecropper is ready for work!`)
      })
      .on('beforeImageLoad', (ctx) => {
        console.log(`before picture loaded, i can do something`)
        console.log(`current canvas context:`, ctx)
        wx.showToast({
          title: '上传中',
          icon: 'loading',
          duration: 20000
        })
      })
      .on('imageLoad', (ctx) => {
        console.log(`picture loaded`)
        console.log(`current canvas context:`, ctx)
        wx.hideToast()
      })
      .on('beforeDraw', (ctx, instance) => {
        console.log(`before canvas draw,i can do something`)
        console.log(`current canvas context:`, ctx)
      })
      .updateCanvas()
  }
})
