<template>
  <UApp :toaster="{ position: 'top-right' }" :locale="locales[locale]">
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

  // for locale
  import * as locales from '@nuxt/ui/locale'
  const { locale } = useI18n()

  
  // imports
  import { name, version } from '../package.json';

  // nuxt cycle hooks
  console.log("starting app : "+name + ", appVersion:" +version)

</script>