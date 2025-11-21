<template>
  <div class="d-flex justify-content-md-center bg-primary text-white">Copyright © {{year}} - Agilisé à Toulouse, France - V{{appVersion}}</div>
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
