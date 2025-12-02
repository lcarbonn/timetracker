<template>
  <UApp :toaster="{ position: 'top-right' }">
    <VitePwaManifest/>
    <BaseNavBar></BaseNavBar>
    <BaseSnackToast></BaseSnackToast>
    <UMain>
      <NuxtLayout>
        <UContainer>
          <NuxtPage />
        </UContainer>
      </NuxtLayout>
    </UMain>
    <BaseFooter  :appVersion="version"></BaseFooter>
  </UApp>
</template>
<script setup lang="ts">

  // imports
  import { name, version } from '../package.json';

  // nuxt cycle hooks
  console.log("starting app : "+name + ", appVersion:" +version)

</script>