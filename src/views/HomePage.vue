<template>
  <div ref="container-ref" class="fixed h-100vh w-100vw"></div>
</template>

<script setup lang="ts">
import { demo01 } from '@/demos/demo01'
import { Application } from 'pixi.js'
import * as PIXI from 'pixi.js'
import { onMounted, onUnmounted, useTemplateRef } from 'vue'
import { gsap } from 'gsap'
import { PixiPlugin } from 'gsap/PixiPlugin'
import { demo02 } from '@/demos/demo02'
// gsap和pixi也是最佳搭档
gsap.registerPlugin(PixiPlugin)
PixiPlugin.registerPIXI(PIXI)
const containerRef = useTemplateRef('container-ref')
let app: Application | null = null
onMounted(async () => {
  await setup()
})

// pixi应用的创建步骤
const setup = async () => {
  if (!containerRef.value) {
    return
  }
  // 1. 创建pixi应用
  // Application：负责创建渲染器和舞台。
  app = new Application()
  // 2. 初始化pixi应用
  await app.init({ backgroundColor: 0x1099bb, resizeTo: containerRef.value })
  // 3. 添加pixi应用的画布到dom中
  containerRef.value.appendChild(app.canvas)
  // 4. 添加精灵/物体到pixi应用中
  // await demo01(app)
  await demo02(app)
}
</script>

<style scoped></style>
