<template>
  <div class="d-flex justify-content-md-center bg-primary text-white">Copyright © 2025 - Agilisé à Toulouse, France - V{{appVersion}}</div>
</template>

<script setup>
const props = defineProps({
  appVersion: {
      type: String,
      default: ''
    }
});
</script>

