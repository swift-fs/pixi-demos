import { getImageUrl } from '@/utils'
import gsap from 'gsap'
import { Assets, Sprite, type Application } from 'pixi.js'

// 绘制图像到应用中
export const demo01 = async (app: Application) => {
  // 1. 图像使用之前需要先加载，和网页中的图片类似
  // Assets：PixiJS 的资源管理器，用于异步加载图像等资源。
  // 返回值 texture 是一个 PixiJS 的 Texture 对象，表示加载后的图像数据。\
  // 注：texture是纹理的意思，一般用来表示图像
  const texture = await Assets.load(getImageUrl('bunny.png'))
  // 2. 创建一个精灵
  // Sprite：用于创建 2D 图像对象（即精灵）。
  // 创建了一个新的 Sprite 实例 bunny，并使用加载的 texture（兔子图片）作为精灵的纹理。
  // 注：Sprite 对象是 PixiJS 中最重要的对象之一。它是一个绘图项目，可以添加到场景中并渲染到屏幕上。
  const bunny = new Sprite(texture)
  // 3. 将精灵 bunny 添加到 app.stage，使其成为舞台上的一部分，从而被渲染到画布上。
  // Stage：PixiJS 的根容器，所有精灵和对象都需要添加到舞台中。
  app.stage.addChild(bunny)

  // anchor：决定精灵的位置点，是以哪个点对准 x, y 坐标
  // 中心点为锚点
  bunny.anchor.set(0.5)
  // screen: 对渲染器的屏幕矩形的引用，也就是画布大小的引用
  bunny.x = app.screen.width / 2
  bunny.y = app.screen.height / 2

  // ticker 是一个 PixiJS 对象，每帧运行一个或多个回调
  // 它将在每一帧中被调用
  app.ticker.add((time) => {
    // 每一帧都在基础上增加一定的渲染角度
    // deltaTime 的值是基于帧率（Frame Rate）计算的，默认情况下，与目标帧率成反比
    // 60FPS 1
    // 30FPS 2
    // 120FPS 0.5
    // 帧率越高，deltaTime 值越小
    bunny.rotation += time.deltaTime * 0.1
  })
}
