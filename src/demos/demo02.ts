import { getImageUrl } from '@/utils'
import {
  Assets,
  Container,
  Sprite,
  Texture,
  TilingSprite,
  type Application,
  type UnresolvedAsset,
} from 'pixi.js'

// 动态鱼塘

// 需要的数学知识
// 直角三角形 https://www.shuxuele.com/right_angle_triangle.html
// 勾股定理 https://www.shuxuele.com/pythagoras.html
// 正弦余弦正切 https://www.shuxuele.com/sine-cosine-tangent.html
type FishSprite = Sprite &
  Partial<{
    direction: number
    speed: number
    turnspeed: number
  }>
export const demo02 = async (app: Application) => {
  await preloadAssets()
  // 添加池塘背景
  await addBackground(app)
  // 添加鱼
  await addFishes(app)
  // 添加波浪
  await addOverlay(app)
}

const preloadAssets = async () => {
  const assets: UnresolvedAsset[] = [
    {
      alias: 'background',
      src: getImageUrl('pond_background.jpg'),
    },
    {
      alias: 'fish1',
      src: getImageUrl('fish1.png'),
    },
    {
      alias: 'fish2',
      src: getImageUrl('fish2.png'),
    },
    {
      alias: 'fish3',
      src: getImageUrl('fish3.png'),
    },
    {
      alias: 'fish4',
      src: getImageUrl('fish4.png'),
    },
    {
      alias: 'fish5',
      src: getImageUrl('fish5.png'),
    },
    {
      alias: 'overlay',
      src: getImageUrl('wave_overlay.png'),
    },
    {
      alias: 'displacement',
      src: getImageUrl('displacement_map.png'),
    },
  ]
  // 批量预加载资源
  await Assets.load(assets, (progress) => {
    console.log('资源加载进度 >>', progress)
  })
}

const addBackground = async (app: Application) => {
  const background = Sprite.from('background')
  // 填满整个背景但是不失真

  // 01方案
  // if (app.screen.width >= app.screen.height) {
  //   background.width = app.screen.width
  //   background.scale.y = background.scale.x
  // }

  // if (app.screen.width < app.screen.height) {
  //   background.height = app.screen.height
  //   background.scale.x = background.scale.y
  // }

  // 02方案(推荐)
  console.log('background texture >>', background.texture)
  // Math.max 确保背景图片填满屏幕：通过选择宽度或高度的较大缩放比例，确保图片铺满。
  const scale = Math.max(
    app.screen.width / background.texture.width,
    app.screen.height / background.texture.height,
  )
  console.log('need scale >>', scale)

  background.width = background.texture.width * scale
  background.height = background.texture.height * scale
  // 居中对齐：调整图片的 x 和 y 值，保持居中。
  background.anchor.set(0.5)
  background.x = app.screen.width / 2
  background.y = app.screen.height / 2

  app.stage.addChild(background)
}

const addFishes = async (app: Application) => {
  // 1. 创建一个容器来将所有鱼 sprite 放在一起，并将其添加到舞台中。这是更好地分离的好方法。
  const fishContainer = new Container()
  app.stage.addChild(fishContainer)

  const fishes: FishSprite[] = []
  // 创建20条鱼
  const fishCount = 20
  // 5种鱼的贴图
  const fishAssets = ['fish1', 'fish2', 'fish3', 'fish4', 'fish5']

  for (let i = 0; i < fishCount; i++) {
    // 循环使用5种鱼的贴图创建精灵
    const fish: FishSprite = Sprite.from(fishAssets[i % fishAssets.length])
    // 设置精灵的属性
    // 随机方向（0-2π）
    // direction：使用弧度表示方向（0-2π）
    fish.direction = Math.random() * Math.PI * 2
    // 随机速度（2-4）
    fish.speed = Math.random() * 2 + 2
    // 随机转向速度（-0.8到0.2）
    fish.turnspeed = Math.random() - 0.8

    fish.anchor.set(0.5)
    // 随机位置和大小
    fish.scale.set(0.2 + Math.random() * 0.5)
    fish.x = Math.random() * app.screen.width
    fish.y = Math.random() * app.screen.height
    fishContainer.addChild(fish)
    fishes.push(fish)
  }

  app.ticker.add(() => {
    const stagePadding = 100
    const boundWidth = app.screen.width + stagePadding * 2
    const boundHeight = app.screen.height + stagePadding * 2

    fishes.forEach((fish) => {
      // 更新鱼的方向
      fish.direction! += fish.turnspeed! * 0.01
      // 根据方向和速度更新位置
      fish.x += Math.sin(fish.direction!) * fish.speed!
      fish.y += Math.cos(fish.direction!) * fish.speed!
      // 更新鱼的旋转角度，使鱼头朝向运动方向
      fish.rotation = -fish.direction! - Math.PI / 2

      // 边界检查：当鱼游出边界时，从另一边出现
      if (fish.x < -stagePadding) {
        fish.x += boundWidth
      }
      if (fish.x > app.screen.width + stagePadding) {
        fish.x -= boundWidth
      }
      if (fish.y < -stagePadding) {
        fish.y += boundHeight
      }
      if (fish.y > app.screen.height + stagePadding) {
        fish.y -= boundHeight
      }
    })
  })
}

const addOverlay = async (app: Application) => {
  const texture = Texture.from('overlay')
  // TilingSprite 是 PixiJS 中用于创建可平铺图像的类，它允许你将图像（纹理）作为一个平铺的背景或图案，覆盖在指定区域内。这对于创建大背景图、地面纹理等非常有用，因为它能自动重复图像而无需额外的渲染负担。
  const overlay = new TilingSprite({
    texture,
    // 平铺纹理的宽度和高度，纹理将会自动平铺以填充这个区域。
    width: app.screen.width,
    height: app.screen.height,
  })
  // tileScale控制纹理的缩放。
  overlay.tileScale = 0.5
  app.stage.addChild(overlay)
  app.ticker.add(({ deltaTime }) => {
    // 可以通过设置 tilePosition 来移动纹理，以实现平铺背景的动态效果。tilePosition 是一个 Point，它控制了平铺纹理的偏移量。
    overlay.tilePosition.x -= 0.5 * deltaTime
    overlay.tilePosition.y -= 0.5 * deltaTime
  })

  // TilingSprite 是 PixiJS 提供的一个非常有效的工具，用于处理背景或其他需要重复填充的图案。
}
