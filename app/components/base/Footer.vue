<template>
  <div>
    <USeparator type="dashed" color="primary"
      :avatar="{
        src: '/icon.png'
      }"/>
    <UFooter>Copyright © {{year}} - Agilisé à Toulouse, France - V{{appVersion}}</UFooter>
   </div>
</template>

<script setup>
  const props = defineProps({
    appVersion: {
        type: String,
        default: ''
      }
  });
  const year = new Date().getFullYear()
</script>
