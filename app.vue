<template>
  <div class="d-flex flex-column justify-content-between min-vh-100">
    <VitePwaManifest/>
    <div>
      <BaseNavBar></BaseNavBar>
      <BaseSnackToast></BaseSnackToast>
      <BContainer>
        <NuxtPage />
      </BContainer>
    </div>
    <div class="justify-content-end">
      <BaseFooter :appVersion="version"></BaseFooter>
    </div>
  </div>
</template>
<script setup lang="ts">

  // imports
  import { name, version } from '~/package.json';

  // nuxt cycle hooks
  console.log("starting app : "+name + ", appVersion:" +version)

</script>