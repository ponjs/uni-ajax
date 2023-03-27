<script lang="ts" setup>
import { useRoute } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import Adsense from './Adsense.vue'

const { Layout } = DefaultTheme

const route = useRoute()
</script>

<template>
  <Layout>
    <template #doc-after>
      <Adsense v-if="!route.path.startsWith('/sponsor')" :key="route.path" style="margin-top: 24px">
        <ins
          class="adsbygoogle"
          style="display: block"
          data-ad-client="ca-pub-6275273053223414"
          data-ad-slot="4649857109"
          data-ad-format="auto"
          data-full-width-responsive="true"
        ></ins>
      </Adsense>
    </template>

    <template #sidebar-nav-after>
      <Adsense :key="route.path.split('/')[1]" style="margin-top: 16px">
        <ins
          class="adsbygoogle"
          style="display: inline-block; width: 200px; height: 200px"
          data-ad-client="ca-pub-6275273053223414"
          data-ad-slot="9924867268"
        ></ins>
      </Adsense>
    </template>
  </Layout>
</template>
