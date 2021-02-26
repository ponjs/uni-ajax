<template>
  <span style="white-space:nowrap">
    <slot>
      {{ text }}
    </slot>
    <template v-if="badge">&nbsp;<Badge :text="badge"/></template>
  </span>
</template>

<script>
export default {
  name: 'Nowrap',
  props: {
    text: {
      type: String
    },
    badge: {
      type: String
    }
  }
}
</script>
