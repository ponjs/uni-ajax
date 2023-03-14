<script lang="ts" setup>
import { onMounted, ref } from 'vue'

const containerRef = ref<HTMLDivElement | null>(null)
onMounted(() => {
  const scriptElement = window.document.createElement('script')
  scriptElement.innerHTML = ';(adsbygoogle = window.adsbygoogle || []).push({})'
  containerRef.value?.appendChild(scriptElement)
})
</script>

<template>
  <div ref="containerRef">
    <slot></slot>
  </div>
</template>
